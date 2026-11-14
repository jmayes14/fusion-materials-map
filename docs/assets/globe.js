// Map page: one step at a time, shown as a flat world map or a globe.
// Needs data.js (SOURCES, STAGES, SITES, FLOWS, color, srcLink, stageFromUrl) plus d3 and topojson.

let W = 960, H = 540, BASE;
const ORDER = STAGES.map(s => s.id);
const qs = new URLSearchParams(location.search);
let activeStage = qs.get("step") === "all" ? "all" : stageFromUrl("extract");
let mode = "flat";
try { const saved = localStorage.getItem("lithium-map-view"); if (saved === "flat" || saved === "globe") mode = saved; } catch (e) { /* storage blocked: keep default */ }
if (qs.get("view") === "flat" || qs.get("view") === "globe") mode = qs.get("view");
let selected = null;
let worldView = false;
let land = null;
const byId = Object.fromEntries(SITES.map(s => [s.id, s]));
const stageOf = id => STAGES.find(s => s.id === id);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

// One plain sentence per step, shown above the map.
const CAPTIONS = {
  all: "Every place on this site. Pick a step above to see one part of the journey at a time.",
  extract: "Lithium is dug up or pumped out of the ground in South America, Australia, and Africa. The arrow shows lithium from Zimbabwe's Bikita mine going to a Chinese company.",
  refine: "China turns most of the world's raw lithium into usable chemicals. Xinjiang is where the U.S. says forced labor is a risk.",
  enrich: "This is the step fusion adds. The arrows show five Russian nuclear plants selling to one U.S. company, and the main Russian plant selling to China and Europe. Oak Ridge, Tennessee, is where the U.S. did this in the 1950s.",
  fabricate: "Factories turn lithium-6 into the parts that make fuel. The arrow shows an Ohio company supplying the biggest U.S. fusion company.",
  deploy: "These are fusion projects testing lithium parts now, in the U.S., the U.K., France, and the Netherlands.",
  after: "We haven't found any places for this step yet. Nobody has said where used fusion parts will be recycled or stored."
};

// ---- Map setup ----
const svg = d3.select("#map");
const defs = svg.append("defs");
const gSphere = svg.append("path").attr("class", "sphere");
const gGrat = svg.append("path").attr("class", "grat");
const gLand = svg.append("path").attr("class", "land");
const gFlows = svg.append("g");
const gLeaders = svg.append("g");
const gSites = svg.append("g");
const gLabels = svg.append("g");

// One arrowhead per step color. refX pulls the tip back to the edge of the dot.
defs.selectAll("marker").data(STAGES).join("marker")
  .attr("id", d => "arrow-" + d.id).attr("viewBox", "0 0 10 10")
  .attr("refX", 22).attr("refY", 5).attr("markerWidth", 9).attr("markerHeight", 9)
  .attr("markerUnits", "userSpaceOnUse").attr("orient", "auto")
  .append("path").attr("d", "M0,0 L10,5 L0,10 z");

const flat = d3.geoEqualEarth().rotate([-10, 0]);
const globe = d3.geoOrthographic().clipAngle(90).rotate([20, -20]);

// Draw the map at the real on-screen size, so text and dots stay readable on phones.
function resize() {
  W = Math.max(280, Math.round(svg.node().getBoundingClientRect().width) || 960);
  H = Math.max(320, Math.round(W * 0.6));
  svg.attr("viewBox", `0 0 ${W} ${H}`);
  const base = d3.geoEqualEarth().rotate([-10, 0]).fitExtent([[8, 8], [W - 8, H - 8]], { type: "Sphere" });
  BASE = { scale: base.scale(), translate: base.translate() };
  globe.translate([W / 2, H / 2]).scale(Math.min(W, H) / 2 - 12);
}

// When zoomed in, keep the map filling the frame instead of showing the edge of the world.
function clampFlat(s, t) {
  const pr = d3.geoEqualEarth().rotate([-10, 0]).scale(s).translate(t);
  const top = pr([0, 89.9])[1], bottom = pr([0, -89.9])[1];
  const left = pr([-169.9, 0])[0], right = pr([-170.1, 0])[0];
  let [tx, ty] = t;
  if (bottom - top > H) { if (top > 0) ty -= top; else if (bottom < H) ty += H - bottom; }
  if (right - left > W) { if (left > 0) tx -= left; else if (right < W) tx += W - right; }
  return [tx, ty];
}
const proj = () => (mode === "flat" ? flat : globe);

function onFront(at) {
  if (mode === "flat") return true;
  const r = globe.rotate();
  return d3.geoDistance(at, [-r[0], -r[1]]) < Math.PI / 2 - 0.03;
}

// Places in the active step, plus places in other steps that connect to it by an arrow.
function current() {
  const all = activeStage === "all";
  const main = SITES.filter(s => all || s.stage === activeStage);
  const flows = FLOWS.filter(f => all || byId[f.from].stage === activeStage || byId[f.to].stage === activeStage);
  const ids = new Set(main.map(s => s.id));
  const linked = [];
  flows.forEach(f => [f.from, f.to].forEach(id => { if (!ids.has(id)) { ids.add(id); linked.push(byId[id]); } }));
  return { main, linked, flows };
}

// Spread out dots that would sit on top of each other, keeping their rough direction.
function dodge(items, gap = 26) {
  const seen = new Set();
  items.forEach((_, i) => {
    if (seen.has(i)) return;
    const group = [i]; seen.add(i);
    for (let k = 0; k < group.length; k++) {
      items.forEach((b, j) => {
        if (!seen.has(j) && Math.hypot(items[group[k]].tx - b.tx, items[group[k]].ty - b.ty) < gap) { seen.add(j); group.push(j); }
      });
    }
    if (group.length < 2) return;
    const cx = d3.mean(group, j => items[j].tx), cy = d3.mean(group, j => items[j].ty);
    const R = Math.max(gap * 0.8, (gap * group.length) / (2 * Math.PI) * 1.2);
    group.sort((a, b) => Math.atan2(items[a].ty - cy, items[a].tx - cx) - Math.atan2(items[b].ty - cy, items[b].tx - cx));
    const start = Math.atan2(items[group[0]].ty - cy, items[group[0]].tx - cx);
    group.forEach((j, k) => {
      const a = start + (2 * Math.PI * k) / group.length;
      items[j].x = cx + R * Math.cos(a);
      items[j].y = cy + R * Math.sin(a);
    });
  });
}

// A gentle arc between two dots, bowing upward.
function curve(a, b) {
  const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2, dx = b.x - a.x, dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1, bend = Math.min(90, len * 0.22);
  let nx = -dy / len, ny = dx / len;
  if (ny > 0) { nx = -nx; ny = -ny; }
  return `M${a.x},${a.y} Q${mx + nx * bend},${my + ny * bend} ${b.x},${b.y}`;
}

function draw() {
  const p = proj(), gp = d3.geoPath(p);
  const { main, linked, flows } = current();
  svg.classed("is-globe", mode === "globe");
  gSphere.attr("d", gp({ type: "Sphere" }));
  gGrat.attr("d", gp(d3.geoGraticule10()));
  gLand.attr("d", land ? gp(land) : null);
  defs.selectAll("marker path").attr("fill", d => color(d.id));

  const order = [...main.map(s => ({ s, linked: false })), ...linked.map(s => ({ s, linked: true }))]
    .sort((a, b) => (b.s.id === selected) - (a.s.id === selected));
  const shown = order.filter(o => onFront(o.s.at)).map(o => {
    const [x, y] = p(o.s.at);
    return { ...o, x, y, tx: x, ty: y };
  });
  dodge(shown);
  const pos = Object.fromEntries(shown.map(o => [o.s.id, o]));

  gFlows.selectAll("path").data(flows.filter(f => pos[f.from] && pos[f.to]), f => f.from + ">" + f.to).join("path")
    .attr("class", f => "flow " + f.kind)
    .attr("stroke", f => color(byId[f.from].stage))
    .attr("marker-end", f => `url(#arrow-${byId[f.from].stage})`)
    .attr("d", f => curve(pos[f.from], pos[f.to]));

  const moved = shown.filter(o => Math.hypot(o.x - o.tx, o.y - o.ty) > 2);
  gLeaders.selectAll("line").data(moved, o => o.s.id).join("line").attr("class", "leader")
    .attr("x1", o => o.tx).attr("y1", o => o.ty).attr("x2", o => o.x).attr("y2", o => o.y);
  gLeaders.selectAll("circle").data(moved, o => o.s.id).join("circle").attr("class", "true-spot")
    .attr("r", 2.2).attr("cx", o => o.tx).attr("cy", o => o.ty);

  const g = gSites.selectAll("g.site").data(shown, o => o.s.id).join(enter => {
    const e = enter.append("g").attr("class", "site").attr("tabindex", 0).attr("role", "button");
    e.append("circle"); e.append("text");
    return e;
  });
  g.attr("transform", o => `translate(${o.x},${o.y})`)
    .classed("is-linked", o => o.linked).classed("is-region", o => !!o.s.region).classed("is-active", o => o.s.id === selected)
    .attr("aria-label", o => `${o.s.name}, ${o.s.where}. Step ${stageOf(o.s.stage).n}.`)
    .on("click", (e, o) => selectSite(o.s.id))
    .on("keydown", (e, o) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); selectSite(o.s.id); } });
  g.select("circle")
    .attr("r", o => (o.linked ? 9 : o.s.region ? 13 : 11))
    .attr("fill", o => color(o.s.stage))
    .attr("stroke", o => (o.linked ? color(o.s.stage) : "#ffffff"));
  g.select("text").text(o => stageOf(o.s.stage).n).attr("fill", o => (o.linked ? color(o.s.stage) : "#ffffff"));
  gSites.selectAll("g.site").sort((a, b) => (a.s.id === selected) - (b.s.id === selected));

  // Labels: try right, left, above, below; skip if it would cover another dot or label.
  const blocks = shown.map(o => ({ x: o.x - 13, y: o.y - 13, w: 26, h: 26 }));
  const labels = [];
  shown.forEach(o => {
    const w = o.s.name.length * 6.7 + 6, h = 15;
    for (const [dx, dy] of [[15, -h / 2], [-15 - w, -h / 2], [-w / 2, -16 - h], [-w / 2, 16], [12, -h - 8], [12, 8], [-12 - w, -h - 8], [-12 - w, 8]]) {
      const b = { x: o.x + dx, y: o.y + dy, w, h };
      if (b.x < 2 || b.x + w > W - 2 || b.y < 2 || b.y + h > H - 2) continue;
      if (blocks.some(c => !(b.x + b.w < c.x || c.x + c.w < b.x || b.y + b.h < c.y || c.y + c.h < b.y))) continue;
      blocks.push(b);
      labels.push({ o, x: b.x + 3, y: b.y + h - 3.5 });
      return;
    }
  });
  gLabels.selectAll("text").data(labels, l => l.o.s.id).join("text")
    .attr("class", l => "label" + (l.o.linked ? " is-linked" : ""))
    .attr("x", l => l.x).attr("y", l => l.y).text(l => l.o.s.name);
}

// ---- Moving the view ----
function run(dur, step) {
  draw(); // show the right places right away, even before the view finishes moving
  if (!dur) { step(1); draw(); return; }
  svg.transition("move").duration(dur).ease(d3.easeCubicInOut).tween("move", () => k => { step(k); draw(); });
}

function flatTarget() {
  const { main, linked } = current();
  const pts = [...main, ...linked].map(s => s.at);
  if (worldView || activeStage === "all" || pts.length === 0) return BASE;
  const px = Math.min(110, W * 0.12), py = Math.min(70, H * 0.12);
  const fit = d3.geoEqualEarth().rotate([-10, 0]).fitExtent([[px, py], [W - px, H - py]], { type: "MultiPoint", coordinates: pts });
  let s = fit.scale(), t = fit.translate();
  const cap = BASE.scale * 3.2;
  if (s > cap) {
    const c = d3.geoCentroid({ type: "MultiPoint", coordinates: pts });
    const at = d3.geoEqualEarth().rotate([-10, 0]).scale(cap).translate([0, 0])(c);
    s = cap; t = [W / 2 - at[0], H / 2 - at[1]];
  }
  return s < BASE.scale ? BASE : { scale: s, translate: clampFlat(s, t) };
}

// Aim the globe where the most places are visible at once.
function globeTarget(points) {
  const c = d3.geoCentroid({ type: "MultiPoint", coordinates: points });
  const grid = [];
  for (let lon = -180; lon < 180; lon += 20) for (const lat of [-30, 0, 30, 55, 75]) grid.push([lon, lat]);
  const candidates = [c, ...points, ...grid];
  let best = c, bestCount = -1, bestDist = Infinity;
  candidates.forEach(cand => {
    const center = [cand[0], Math.max(-45, Math.min(75, cand[1]))];
    const count = points.filter(pt => d3.geoDistance(pt, center) < 1.35).length;
    const dist = d3.geoDistance(center, c);
    if (count > bestCount || (count === bestCount && dist < bestDist)) { best = center; bestCount = count; bestDist = dist; }
  });
  return [-best[0], -best[1]];
}

function moveView(instant = false) {
  const dur = instant || reduceMotion ? 0 : 900;
  if (mode === "flat") {
    const to = flatTarget(), is = d3.interpolate(flat.scale(), to.scale), it = d3.interpolate(flat.translate(), to.translate);
    run(dur, k => flat.scale(is(k)).translate(it(k)));
  } else {
    const { main, linked } = current();
    const pts = [...main, ...linked].map(s => s.at);
    if (!pts.length) { draw(); return; }
    const ir = d3.interpolate(globe.rotate(), globeTarget(pts));
    run(dur, k => globe.rotate(ir(k)));
  }
}

// ---- Side panel ----
function showCard(id) {
  const card = document.getElementById("site-card");
  if (!id) { card.innerHTML = `<p class="where">Click a place in the list or on the map to read about it.</p>`; return; }
  const d = byId[id], st = stageOf(d.stage);
  card.innerHTML = `<span class="eyebrow" style="color: var(--${d.stage})">Step ${st.n}: ${st.name}</span>
    <h3>${d.name}</h3><p class="where">${d.where}${d.region ? " · a whole area, not one place" : ""}</p><p>${d.text}</p>
    <p class="src">${d.s.length ? "Sources: " + d.s.map(srcLink).join(", ") : "No source checked yet for this place."}</p>`;
}

function renderSide() {
  const { main, linked } = current();
  const st = activeStage === "all" ? null : stageOf(activeStage);
  const cap = document.getElementById("step-caption");
  cap.style.setProperty("--c", st ? `var(--${st.id})` : "var(--accent)");
  cap.innerHTML = `<span class="eyebrow" style="color: var(--c)">${st ? `Step ${st.n} of 6` : "All steps"}</span>
    <h3>${st ? `${st.name}: ${st.what}` : "Every place on this site"}</h3><p>${CAPTIONS[activeStage]}</p>`;

  const item = (s, isLinked) => `<li><button data-site="${s.id}" class="${isLinked ? "is-linked" : ""}" aria-pressed="${s.id === selected}">
    <span class="badge" style="--c: var(--${s.stage})">${stageOf(s.stage).n}</span><span><b>${s.name}</b><small>${s.where}</small></span></button></li>`;
  document.getElementById("places-h").textContent = st ? `Places in this step (${main.length})` : `All places (${main.length})`;
  document.getElementById("place-list").innerHTML =
    (main.length ? main.map(s => item(s, false)).join("") : `<li class="empty">No places for this step yet.</li>`) +
    (linked.length ? `<li class="sub">Connected places from other steps</li>` + linked.map(s => item(s, true)).join("") : "");

  document.querySelectorAll("#step-chips button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.stage === activeStage)));
  document.querySelectorAll("#view-toggle button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.mode === mode)));
  const i = ORDER.indexOf(activeStage);
  document.getElementById("tour-count").textContent = i >= 0 ? `Step ${i + 1} of 6` : "All steps";
  document.getElementById("tour-back").disabled = i <= 0;
  document.getElementById("tour-next").disabled = i === ORDER.length - 1;

  const tools = document.getElementById("map-tools");
  if (mode === "flat") {
    tools.innerHTML = activeStage === "all" ? "" : `<button id="world-btn">${worldView ? "Zoom to this step" : "Show whole world"}</button>`;
  } else {
    tools.innerHTML = `<span class="hint">Drag the globe to spin it, or jump to:</span>` +
      [["South America", [68, 25]], ["Africa", [-25, 15]], ["China and Russia", [-100, -40]], ["Europe and U.S.", [40, -40]]]
        .map(([n, r]) => `<button data-r="${r}">${n}</button>`).join("");
  }
}

// ---- Actions ----
function setStage(id) {
  activeStage = id;
  selected = null;
  worldView = false;
  history.replaceState(null, "", `?step=${id}`);
  showCard(null);
  renderSide();
  moveView();
}

function selectSite(id) {
  selected = id;
  showCard(id);
  renderSide();
  if (mode === "globe" && !onFront(byId[id].at)) {
    const ir = d3.interpolate(globe.rotate(), globeTarget([byId[id].at]));
    run(reduceMotion ? 0 : 700, k => globe.rotate(ir(k)));
  } else {
    draw();
  }
}

function setMode(m) {
  mode = m;
  try { localStorage.setItem("lithium-map-view", m); } catch (e) { /* storage blocked */ }
  renderSide();
  moveView(true);
}

document.getElementById("step-chips").innerHTML =
  `<button data-stage="all" style="--c: var(--accent)">All</button>` +
  STAGES.map(s => `<button data-stage="${s.id}" style="--c: var(--${s.id})">${s.n}. ${s.name}</button>`).join("");
document.getElementById("step-chips").addEventListener("click", e => { const b = e.target.closest("button"); if (b) setStage(b.dataset.stage); });
document.getElementById("view-toggle").addEventListener("click", e => { const b = e.target.closest("button"); if (b && b.dataset.mode !== mode) setMode(b.dataset.mode); });
document.getElementById("tour-start").addEventListener("click", () => setStage(ORDER[0]));
document.getElementById("tour-back").addEventListener("click", () => { const i = ORDER.indexOf(activeStage); setStage(ORDER[Math.max(0, i - 1)]); });
document.getElementById("tour-next").addEventListener("click", () => { const i = ORDER.indexOf(activeStage); setStage(ORDER[Math.min(ORDER.length - 1, i + 1)]); });
document.getElementById("place-list").addEventListener("click", e => { const b = e.target.closest("button[data-site]"); if (b) selectSite(b.dataset.site); });
document.getElementById("map-tools").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  if (b.id === "world-btn") { worldView = !worldView; renderSide(); moveView(); return; }
  const ir = d3.interpolate(globe.rotate(), b.dataset.r.split(",").map(Number));
  run(reduceMotion ? 0 : 1000, k => globe.rotate(ir(k)));
});

svg.call(d3.drag()
  .filter(e => mode === "globe" && !e.button && !e.target.closest("g.site"))
  .on("drag", e => {
    const r = globe.rotate(), k = 0.25;
    globe.rotate([r[0] + e.dx * k, Math.max(-80, Math.min(80, r[1] - e.dy * k))]);
    draw();
  }));

const swatch = (fill, stroke, n, textFill) => `<svg width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="8" style="fill:${fill};stroke:${stroke};stroke-width:2"/>${n ? `<text x="11" y="11.5" text-anchor="middle" dominant-baseline="central" style="font-size:10px;font-weight:800;fill:${textFill || "#fff"}">${n}</text>` : ""}</svg>`;
const line = dashed => `<svg width="34" height="12" aria-hidden="true"><line x1="1" y1="6" x2="25" y2="6" style="stroke:var(--muted);stroke-width:2.4${dashed ? ";stroke-dasharray:5 4" : ""}"/><path d="M24,1 L33,6 L24,11 z" style="fill:var(--muted)"/></svg>`;
document.getElementById("legend").innerHTML =
  `<span>${swatch("var(--enrich)", "#fff", 3)} A place. The number is its step.</span>` +
  `<span>${swatch("var(--panel)", "var(--refine)", 2, "var(--refine)")} A connected place from another step</span>` +
  `<span>${line(false)} A public business deal</span>` +
  `<span>${line(true)} A shipping record. The arrow points to the buyer.</span>` +
  `<span><svg width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="9" style="fill:var(--refine);fill-opacity:.75;stroke:#fff;stroke-width:2"/></svg> A whole country or region</span>` +
  `<span><svg width="30" height="16" aria-hidden="true"><circle cx="4" cy="12" r="2.2" style="fill:var(--muted)"/><line x1="4" y1="12" x2="20" y2="5" style="stroke:var(--muted)"/><circle cx="22" cy="5" r="4" style="fill:var(--muted)"/></svg> Moved apart to stay readable. The small dot is the real spot.</span>`;

fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json")
  .then(r => r.json())
  .then(world => { land = topojson.feature(world, world.objects.land); draw(); })
  .catch(() => { draw(); document.getElementById("site-card").insertAdjacentHTML("beforeend", `<p class="map-error">The map outline didn't load, but the places still work.</p>`); });

resize();
renderSide();
showCard(null);
moveView(true);
let resizeTimer;
window.addEventListener("resize", () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(() => { resize(); moveView(true); }, 150); });
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
