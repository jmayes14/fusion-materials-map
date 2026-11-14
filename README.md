# Fusion Materials Map

A class project for "Mapping the Human Cost of Fusion Energy Materials."
Iteration 1 focuses on **lithium**. Fusion reactors breed their own tritium
fuel from lithium-6, so they will need tonnes of enriched lithium.

The site traces that lithium through six steps: dig, process, sort, make
parts, use, and afterward. It shows who could be harmed at each step and
proposes policy and tech fixes.

Live site: <https://jmayes14.github.io/fusion-materials-map/>

## Writing style

The site is written for a general reader, at about an 8th-grade reading level.
It has a "Words to know" box, and it explains technical terms the first time
they appear.

## What's in it

- **Systems map:** six clickable steps. Each shows sourced facts, open gaps,
  and filters for five kinds of harm.
- **Globe:** 17 sites colored by step. Solid lines are published agreements;
  dashed lines are Sayari trade links where the product is not confirmed.
- **Risk table:** who is at risk at each step, and the evidence level.
- **Policy brief:** puts conditions on public fusion funding, funds lithium-6
  enrichment that doesn't use mercury, closes the isotope gap in UFLPA
  enforcement, and proposes a "Fusion Lithium Passport."
- **Method and sources:** each source is tagged "via Tavily" or "via Sayari."

## Methodology

The full methodology is on the site at
[docs/methodology.html](./docs/methodology.html). It covers the question and
scope, the six-step chain model, how sources were searched and verified with
Tavily, how company and trade links were traced with Sayari, evidence labels,
risk assessment, AI use, and limits.

## Research

- Web sources were found with Tavily search, and key claims were checked
  against the full page text with Tavily extract.
- Entity, ownership, and trade links come from Sayari.
- The full record, with provenance for each source, is in
  [research/fusion-lithium-2026-11.json](./research/fusion-lithium-2026-11.json).

## Evidence rules

- No company is rated ethical or unethical.
- Allegations are attributed to whoever reported them.
- Trade links are labeled "product not confirmed."
- Gaps are shown. A gap is not evidence that a chain is clean or harmful.

## Files

The site is one file, [docs/index.html](./docs/index.html), with no build step.
It is published with GitHub Pages from `docs/` on `main`. It loads D3 and
topojson-client from public CDNs, and coastlines from the `world-atlas`
package on jsDelivr.
