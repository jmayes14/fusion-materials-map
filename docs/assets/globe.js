let activeStage = stageFromUrl("enrich");
// Step chips: pick which step to highlight on the globe.
const chips = document.getElementById("step-chips");
chips.innerHTML = "<span>Highlight a step:</span>" + STAGES.map(s => `<button data-stage="${s.id}" style="--c: var(--${s.id})" aria-pressed="${s.id === activeStage}">${s.n}. ${s.name}</button>`).join("");
chips.addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  activeStage = b.dataset.stage;
  chips.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  history.replaceState(null, "", `?step=${activeStage}`);
  highlightGlobe(); spinTo(SITES.filter(x => x.stage === activeStage));
});

const svg = d3.select("#globe");
const W = 600, H = 600;
const projection = d3.geoOrthographic().translate([W / 2, H / 2]).scale(285).clipAngle(90).rotate([40, -15]);
const path = d3.geoPath(projection);
const gSphere = svg.append("path").datum({ type: "Sphere" }).attr("class", "sphere");
const gGrat = svg.append("path").datum(d3.geoGraticule10()).attr("class", "grat");
const gLand = svg.append("path").attr("class", "land");
const gFlows = svg.append("g");
const gSites = svg.append("g");
const gLabels = svg.append("g");
let land = null;
const byId = Object.fromEntries(SITES.map(s => [s.id, s]));

function visible(lonlat) {
  const r = projection.rotate();
  return d3.geoDistance(lonlat, [-r[0], -r[1]]) < Math.PI / 2 - 0.02;
}
function draw() {
  gSphere.attr("d", path); gGrat.attr("d", path);
  if (land) gLand.attr("d", path(land));
  gFlows.selectAll("path").data(FLOWS).join("path")
    .attr("class", d => "flow " + d.kind)
    .attr("stroke", d => color(byId[d.from].stage))
    .attr("d", d => path({ type: "LineString", coordinates: [byId[d.from].at, byId[d.to].at] }));
  gSites.selectAll("circle").data(SITES, d => d.id).join("circle")
    .attr("class", "site")
    .attr("r", d => d.region ? 10 : 8)
    .attr("fill", d => color(d.stage))
    .attr("fill-opacity", d => d.region ? 0.7 : 1)
    .attr("display", d => visible(d.at) ? null : "none")
    .attr("cx", d => projection(d.at)[0]).attr("cy", d => projection(d.at)[1])
    .on("click", (e, d) => showSite(d));
  gLabels.selectAll("text").data(SITES, d => d.id).join("text")
    .attr("class", "label")
    .attr("display", d => visible(d.at) && d.stage === activeStage ? null : "none")
    .attr("x", d => projection(d.at)[0] + 10).attr("y", d => projection(d.at)[1] + 4 + (d.ly || 0))
    .text(d => d.name);
  highlightGlobe();
}
function highlightGlobe() {
  gSites.selectAll("circle").classed("is-dim", d => d.stage !== activeStage);
  gLabels.selectAll("text").attr("display", d => visible(d.at) && d.stage === activeStage ? null : "none");
}
function showSite(d) {
  gSites.selectAll("circle").classed("is-active", x => x.id === d.id);
  const st = STAGES.find(s => s.id === d.stage);
  document.getElementById("site-card").innerHTML = `<span class="eyebrow" style="color: var(--${d.stage})">Step ${st.n}: ${st.name}</span>
    <h3>${d.name}</h3><p class="where">${d.where}${d.region ? " · not a single plant" : ""}</p><p>${d.text}</p>
    <p class="src">${d.s.length ? "Sources: " + d.s.map(srcLink).join(", ") : "No source checked yet for this place."}</p>`;
}
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
function spinTo(sites) {
  if (!sites.length) return;
  const c = d3.geoCentroid({ type: "MultiPoint", coordinates: sites.map(s => s.at) });
  const target = [-c[0], -Math.max(-50, Math.min(50, c[1]))];
  const interp = d3.interpolate(projection.rotate(), target);
  if (reduceMotion) { projection.rotate(target); draw(); return; }
  d3.transition().duration(1400).ease(d3.easeCubicInOut).tween("spin", () => t => { projection.rotate(interp(t)); draw(); });
}
svg.call(d3.drag().on("drag", e => {
  const r = projection.rotate(), k = 0.25;
  projection.rotate([r[0] + e.dx * k, Math.max(-80, Math.min(80, r[1] - e.dy * k))]); draw();
}));
document.getElementById("globe-tools").innerHTML = [["South America", [68, 25]], ["Africa", [-25, 15]], ["China and Russia", [-100, -40]], ["Europe and U.S.", [40, -40]]]
  .map(([n, r]) => `<button data-r="${r}">${n}</button>`).join("");
document.getElementById("globe-tools").addEventListener("click", e => {
  const b = e.target.closest("button"); if (!b) return;
  const target = b.dataset.r.split(",").map(Number);
  const interp = d3.interpolate(projection.rotate(), target);
  if (reduceMotion) { projection.rotate(target); draw(); return; }
  d3.transition().duration(1200).tween("spin", () => t => { projection.rotate(interp(t)); draw(); });
});
document.getElementById("legend").innerHTML = STAGES.map(s => `<span><i style="background: var(--${s.id})"></i>${s.n}. ${s.name}</span>`).join("") +
  `<span><span class="ln"></span>Public business deal or partnership</span><span><span class="ln dash"></span>Shipping record (contents not always known)</span><span>Bigger, lighter dots mark a whole country or region, not one place.</span>`;

fetch("https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json")
  .then(r => r.json())
  .then(world => { land = topojson.feature(world, world.objects.land); draw(); })
  .catch(() => { draw(); document.getElementById("site-card").insertAdjacentHTML("beforeend", `<p class="map-error">The map outline didn't load, but the dots still work.</p>`); });


draw();
spinTo(SITES.filter(x => x.stage === activeStage));
window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", draw);
