let activeStage = stageFromUrl("enrich");
let activeLens = "all";

const chainEl = document.getElementById("chain");
chainEl.innerHTML = STAGES.map(s => `<li><button class="stage" data-stage="${s.id}" style="--c: var(--${s.id})" aria-pressed="false">
  <span class="num">${s.n}</span><span class="name">${s.name}</span><span class="what">${s.what}</span><span class="flag">${s.flag}</span></button></li>`).join("");

function renderDetail() {
  const s = STAGES.find(x => x.id === activeStage);
  document.querySelectorAll(".stage").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.stage === activeStage)));
  const facts = s.facts.map(f => {
    const risk = f.l.length > 0;
    const dim = activeLens !== "all" && !f.l.includes(activeLens);
    const tags = (f.k ? `<span class="tag kind">${f.k}</span>` : "") ;
    return `<li class="${risk ? "is-risk" : ""} ${dim ? "is-dim" : ""}">${f.t}<div class="tags">${tags}<span class="src">Source: ${srcLink(f.s)}</span></div></li>`;
  }).join("");
  document.getElementById("detail").innerHTML = `<div><span class="eyebrow">Step ${s.n} of 6</span><h3>${s.name}</h3><p class="summary">${s.summary}</p><ul class="facts">${facts}</ul></div>
    <div class="unknown"><h4>What we still don't know</h4><ul>${s.unknown.map(u => `<li>${u}</li>`).join("")}</ul></div>`;
  const link = document.getElementById("to-map");
  if (link) { link.href = `globe.html?step=${s.id}`; link.textContent = `See the "${s.name}" places on the map →`; }
  history.replaceState(null, "", `?step=${s.id}`);
}
chainEl.addEventListener("click", e => {
  const b = e.target.closest(".stage"); if (!b) return;
  activeStage = b.dataset.stage; renderDetail();
});
document.querySelectorAll(".lens").forEach(b => b.addEventListener("click", () => {
  activeLens = b.dataset.lens;
  document.querySelectorAll(".lens").forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  // Jump to the first stage that has this risk, if the current one has none.
  const cur = STAGES.find(x => x.id === activeStage);
  if (activeLens !== "all" && !cur.facts.some(f => f.l.includes(activeLens))) {
    const first = STAGES.find(x => x.facts.some(f => f.l.includes(activeLens)));
    if (first) activeStage = first.id;
  }
  renderDetail();
}));


renderDetail();
