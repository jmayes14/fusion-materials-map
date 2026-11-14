const SOURCES = {
  iisdChile: ["IISD, Lithium Mining in Chile (Sept 2026)", "https://www.iisd.org/system/files/2026-09/lithium-mining-chile.pdf"],
  reutersAtacama: ["Reuters, As Chile revs up lithium plans, Indigenous people demand more control (7 Apr 2025)", "https://www.reuters.com/world/americas/chile-revs-up-lithium-plans-indigenous-people-demand-more-control-2025-04-07"],
  fidh: ["FIDH, Lithium and Human Rights in the High Andean Salt Flats", "https://www.fidh.org/IMG/pdf/lithium_and_human_rights_in_the_high_andean_salt_flats_of_argentina_bolivia_and_chile.pdf"],
  energyMonitor: ["Energy Monitor, Lithium in Argentina: how to make it sustainable", "https://www.energymonitor.ai/sectors/extractive-industries/lithium-in-argentina-how-to-make-it-sustainable"],
  dolList: ["U.S. Department of Labor, List of Goods Produced by Child Labor or Forced Labor (2024)", "https://www.dol.gov/agencies/ilab/reports/child-labor/list-of-goods"],
  mongabayBikita: ["Mongabay, Locals slam Zimbabwe for turning a blind eye to Chinese miner's violations (Apr 2024)", "https://news.mongabay.com/2024/04/locals-slam-zimbabwe-for-turning-a-blind-eye-to-chinese-miners-violations"],
  ieaGcmo2025: ["IEA, Global Critical Minerals Outlook 2025", "https://iea.blob.core.windows.net/assets/ef5e9b70-3374-4caa-ba9d-19c72253bfc4/GlobalCriticalMineralsOutlook2025.pdf"],
  ustrUflpa2025: ["USTR, FLETF release of the 2025 update to the UFLPA Strategy (Aug 2025)", "https://ustr.gov/about/policy-offices/press-office/press-releases/2025/august/forced-labor-enforcement-task-force-release-2025-update-uflpa-strategy"],
  wardArxiv: ["Ward, Pearson, Scott and Lopes Cardozo, Lithium enrichment threatens to curb fusion deployment, arXiv:2605.04707 (May 2026)", "https://arxiv.org/html/2605.04707v1"],
  ostiY12: ["OSTI, History of mercury use and environmental contamination at the Oak Ridge Y-12 Plant", "https://www.osti.gov/biblio/1037053"],
  atsdrY12: ["ATSDR (CDC), Y-12 Weapons Plant chemical releases into East Fork Poplar Creek", "https://archive.cdc.gov/www_atsdr_cdc_gov/hac/PHA/efork1/y12_p1.html"],
  doeY12: ["DOE Office of Environmental Management, Y-12 National Security Complex", "https://www.energy.gov/orem/y-12-national-security-complex"],
  wnaLithium: ["World Nuclear Association, Lithium", "https://world-nuclear.org/information-library/current-and-future-generation/lithium"],
  precisionPeriodic: ["Precision Periodic, Scalable Lithium-6 and Lithium-7 Enrichment (23 Sept 2025)", "https://www.precisionperiodic.com/scalable-lithium-6-lithium-7-enrichment"],
  moltenSalt: ["Molten Salt Solutions, Strategic agreements to supply enriched lithium for fusion (PR Newswire, 24 Mar 2026)", "https://finance.yahoo.com/sectors/energy/articles/molten-salt-solutions-signs-strategic-160100744.html"],
  marathon: ["Marathon Fusion, Demonstrates lithium and hydrogen isotope enrichment using plasma centrifuge (PR Newswire, 27 Aug 2026)", "https://www.prnewswire.com/news-releases/marathon-fusion-demonstrates-lithium-and-hydrogen-isotope-enrichment-using-proprietary-plasma-centrifuge-technology-302861336.html"],
  sbirLi6: ["SBIR.gov, Award 218860: Precision Periodic lithium-6 and lithium-7 separation", "https://www.sbir.gov/awards/218860"],
  abcGreenbushes: ["ABC News, Talison 'underestimated' impact of mine expansion on Greenbushes community (1 Apr 2025)", "https://www.abc.net.au/news/2025-04-01/lithium-talison-underestimated-impact-greenbushes-mine-expansion/105117068"],
  oecdMinerals: ["OECD, Responsible mineral supply chains (Due Diligence Guidance)", "https://www.oecd.org/en/topics/sub-issues/due-diligence-guidance-for-responsible-business-conduct/responsible-mineral-supply-chains.html"],
  ornlTbm: ["OSTI, ITER test blanket module design basis", "https://www.osti.gov/servlets/purl/1165762"],
  materionCfs: ["Materion, Supply agreement with Commonwealth Fusion Systems (28 Oct 2025)", "https://www.materion.com/en/about-materion/news/performance-alloys/materion-supply-agreement-with-commonwealth-fusion"],
  iterTbm: ["ITER Organization, Tritium Breeding", "https://www.iter.org/machine/supporting-systems/tritium-breeding"],
  neiEnriched: ["Nuclear Engineering International, Enriched lithium and advanced nuclear", "https://www.neimagazine.com/analysis/enriched-lithium-and-advanced-nuclear"],
  cfsLibrti: ["Commonwealth Fusion Systems, CFS named first international partner in UKAEA's LIBRTI program (1 July 2026)", "https://cfs.energy/news-and-media/cfs-named-first-international-partner-in-ukaeas-librti-program"],
  sayariTrade: ["Sayari, lithium hydroxide (HS 282520) supplier facets, 2024 onward (retrieved 9 Nov 2026)", "https://graph.sayari.com"],
  sayariNccp: ["Sayari, Novosibirsk Chemical Concentrates Plant entity record and trade relationships", "https://graph.sayari.com/resource/entity/uGeE9Bs2EvxWqf4mTsQFRQ"],
  sayariBikita: ["Sayari, Bikita Minerals (Pvt) Ltd trade relationships", "https://graph.sayari.com/resource/entity/RwcU9n6KEGr1upZT1NyNEg"],
  sayariIsoflex: ["Sayari, Isoflex USA upstream supply chain (filtered to isotope and lithium-chemical HS codes 2845, 282520, 283691, 280519)", "https://graph.sayari.com/resource/entity/AEGsjKeoKLf8DAjnFUikgw"],
  sayariCfs: ["Sayari, Commonwealth Fusion Systems LLC upstream supply chain", "https://graph.sayari.com/resource/entity/pvo3Wv7gZb9K0hiji7-Nag"],
  sayariHainan: ["Sayari, Sinomine Resource (Hainan) Lithium trade relationships", "https://graph.sayari.com/resource/entity/NU2nnTaUlY9iKHBogeoPtQ"],
  sayariXnm: ["Sayari, Xinjiang Nonferrous Metals Industry (Group) corporate tree", "https://graph.sayari.com/resource/entity/3CswEP9tXc2H8ReYWPr9cQ"],
  sayariSqm: ["Sayari, SQM (Sociedad Química y Minera de Chile) trade relationships", "https://graph.sayari.com/resource/entity/V2N3UCmWJXP8xf0fPBNUbQ"],
  millerUflpa: ["Miller & Chevalier, FLETF announces single largest expansion of UFLPA Entity List", "https://www.millerchevalier.com/publication/trade-compliance-flash-fletf-announces-single-largest-expansion-uflpa-entity-list"],
  isotopRu: ["Isotope JSC, Company news (subsidiary of Rosatom)", "http://www.isotop.ru/en/news/page5.html"],
  atommediaEcp: ["Atom Media (Rosatom), Electrochemical Plant in Zelenogorsk produces stable and radioactive isotopes", "https://atommedia.online/en/press-releases/v-rosatome-zapustili-vtoruyu-v-rossii-ustanovku-po-pererabotke-obednennogo-urana"]
};

const STAGES = [
  { id: "extract", n: 1, name: "Dig", what: "Pump salty water from salt flats, or mine rock", flag: "Land, water, child labor",
    summary: "Lithium comes from two places: salty underground water pumped up in Chile and Argentina, or rock mined in Australia, Zimbabwe, and other countries. No fusion company has said which mine its lithium comes from.",
    facts: [
      { t: "In Chile's Atacama Desert, lithium is mined on land that has belonged to Indigenous peoples for generations.", s: "iisdChile", l: ["land"] },
      { t: "Chile's big lithium companies plan to mine up to 33% more there through 2060. Indigenous groups want more say.", s: "reutersAtacama", l: ["land"] },
      { t: "In 2023, the Jujuy province of Argentina changed its constitution to make mining easier on community land, without properly asking Indigenous communities.", s: "fidh", l: ["land"] },
      { t: "Communities at the Salinas Grandes salt flats protested for 15 days after that vote.", s: "energyMonitor", l: ["land"] },
      { t: "The U.S. Department of Labor says lithium from Zimbabwe is made with child labor.", s: "dolList", l: ["labor"], k: "Government list" },
      { t: "Workers and villagers near Zimbabwe's Bikita lithium mine say they've faced being forced off their land, chemical spills, worker abuse, and a death. They blame the Chinese owner, Sinomine, and the government.", s: "mongabayBikita", l: ["labor", "land"], k: "People's claims, reported in the news" },
      { t: "At Greenbushes, Australia's biggest lithium mine, the mining company admitted its dust went over legal limits at least 8 times in 2024.", s: "abcGreenbushes", l: ["land"] },
      { t: "Shipping records show the Bikita mine sending goods to a Chinese lithium company in Hainan, owned by the same parent company.", s: "sayariBikita", l: [], k: "Shipping record, contents unknown" },
      { t: "That Hainan company then ships to its sister companies in Namibia and Tanzania. It acts as a middleman, so we can't see where Bikita's lithium finally ends up.", s: "sayariHainan", l: [], k: "Shipping record, contents unknown" }
    ],
    unknown: ["Which mine any fusion company's lithium comes from.", "Where Bikita's lithium ends up after the Hainan company.", "Which buyers of Chile's SQM take lithium. SQM also sells fertilizer, and the records mix the two."] },
  { id: "refine", n: 2, name: "Process", what: "Turn raw lithium into clean lithium chemicals", flag: "Forced labor",
    summary: "The raw material is cleaned and turned into lithium chemicals that batteries and nuclear projects can use. China does most of this work.",
    facts: [
      { t: "China processes 70% of the world's lithium chemicals, and 95% of the lithium that comes from rock.", s: "ieaGcmo2025", l: ["forced"] },
      { t: "In August 2025, the U.S. made lithium a top priority for stopping imports made with forced labor in Xinjiang, China.", s: "ustrUflpa2025", l: ["forced"], k: "Government decision" },
      { t: "Since 2024, shipping records show 445 Chinese companies exporting processed lithium, more than any other country. The U.S. has 247 and South Korea 214.", s: "sayariTrade", l: [] },
      { t: "A Chinese state company, Xinjiang Nonferrous Metals, is on the U.S. forced-labor list. Letters cited by the same source say two big battery makers, CATL and Gotion, buy raw materials from it.", s: "millerUflpa", l: ["forced"], k: "Government list" },
      { t: "Company records show this Xinjiang company owns a lithium chemical plant.", s: "sayariXnm", l: ["forced"], k: "Company records" }
    ],
    unknown: ["Whether any lithium bought for fusion research passed through Xinjiang."] },
  { id: "enrich", n: 3, name: "Sort", what: "Collect the rare lithium-6", flag: "Mercury, weapons",
    summary: "Only about 7 out of every 100 lithium atoms are lithium-6, but fusion needs 30 to 90 out of 100. Sorting them is the step fusion adds, and it's the hardest part. On a large scale, it has only ever been done to build nuclear weapons.",
    facts: [
      { t: "Large-scale lithium sorting has only been done for nuclear weapons. China, North Korea, and Russia still do it with a method that uses toxic mercury.", s: "wardArxiv", l: ["weapons", "toxic"] },
      { t: "One fusion power plant needs about 100 tonnes of lithium-6. Researchers say the world can barely make any today.", s: "wardArxiv", l: [], k: "Estimate" },
      { t: "From 1950 to 1963, the Y-12 plant in Oak Ridge, Tennessee, used about 11 million kilograms of mercury to sort lithium.", s: "ostiY12", l: ["toxic"] },
      { t: "The U.S. government says about 330 tonnes of mercury leaked, 110 tonnes of it into a local creek. Another 750 tonnes can't be accounted for.", s: "atsdrY12", l: ["toxic"], k: "Government record" },
      { t: "Mercury is still the top cleanup problem at Y-12. A treatment plant is due to open in 2027.", s: "doeY12", l: ["toxic"] },
      { t: "A Russian plant called NCCP, part of Russia's state nuclear agency, makes up to 80% of the world's lithium-7. Lithium-7 is left over when lithium-6 is sorted out for weapons.", s: "wnaLithium", l: ["weapons"] },
      { t: "NCCP is on Ukraine's sanctions list.", s: "sayariNccp", l: ["weapons"], k: "Government list" },
      { t: "Russian government contract records show major Russian nuclear institutes hiring NCCP, including a site that once made plutonium for bombs.", s: "sayariNccp", l: ["weapons"], k: "Government contract records" },
      { t: "Isoflex USA, a company that sells isotopes in the U.S., buys from five suppliers run by Russia's state nuclear agency, including NCCP. The records were narrowed to isotopes and lithium chemicals.", s: "sayariIsoflex", l: ["weapons"], k: "Shipping record, contents narrowed" },
      { t: "One of those suppliers, in the secret nuclear city of Zelenogorsk, makes nuclear fuel and isotopes.", s: "atommediaEcp", l: ["weapons"] },
      { t: "Shipping records also show NCCP selling to China's state nuclear company, a Dutch research reactor, a German lithium company, battery makers, and nuclear power plants. NCCP also makes nuclear fuel, so we don't know what was in each shipment.", s: "sayariNccp", l: ["weapons"], k: "Shipping record, contents unknown" },
      { t: "Cleaner methods without mercury are coming. Precision Periodic announced one in September 2025, with U.S. government funding.", s: "precisionPeriodic", l: [] },
      { t: "In March 2026, Molten Salt Solutions said it had deals to supply lithium-6 to two fusion companies, Type One Energy and Gauss Fusion.", s: "moltenSalt", l: [], k: "Company's own claim" },
      { t: "In August 2026, Marathon Fusion said it had sorted lithium with a spinning machine that doesn't use mercury, with U.S. government support.", s: "marathon", l: [], k: "Company's own claim" },
      { t: "A U.S. government grant summary says America makes no lithium-6 or lithium-7 of its own and depends completely on Russia and China.", s: "sbirLi6", l: ["weapons"], k: "Grant summary" }
    ],
    unknown: ["How much lithium-6 Russia, China, and the U.S. can make or have stored.", "Who owns NCCP. The records only list a local government office.", "Exactly what was in each shipment to Isoflex USA. We narrowed it to isotopes and lithium chemicals, but couldn't get more specific.", "Whether any Russian material from Isoflex USA reached a fusion lab."] },
  { id: "fabricate", n: 4, name: "Make parts", what: "Turn lithium-6 into fuel-making parts", flag: "Toxic beryllium",
    summary: "The sorted lithium is made into the part of the power plant that makes fuel. It can be small ceramic beads, a liquid metal mix, or a melted salt called FLiBe (made from lithium and a metal called beryllium).",
    facts: [
      { t: "China's test part for the international ITER fusion project uses tiny lithium beads that are 60% lithium-6.", s: "ornlTbm", l: [] },
      { t: "An Ohio company, Materion, will supply the beryllium half of the FLiBe salt for Commonwealth Fusion Systems. Where the lithium half comes from hasn't been made public.", s: "materionCfs", l: [] }
    ],
    unknown: ["Who will make these parts on a large scale, and whose lithium they'll use."] },
  { id: "deploy", n: 5, name: "Use", what: "The parts go into fusion machines", flag: "Tritium safety",
    summary: "The lithium layer wraps around the super-hot fusion reaction. It catches particles, makes new fuel, and carries heat away to make electricity. Tests are happening now. Power plants are planned for the 2030s.",
    facts: [
      { t: "The ITER fusion project in France will test four designs from Europe, Japan, China, and Korea.", s: "iterTbm", l: [] },
      { t: "ITER's test needed about 200 kilograms of lithium-6-rich lithium.", s: "neiEnriched", l: [] },
      { t: "The U.K. is spending £220 million on a program to prove plants can make their own fuel. Commonwealth Fusion Systems joined it in July 2026.", s: "cfsLibrti", l: [] },
      { t: "Shipping records show Commonwealth Fusion Systems buying copper, steel, cooling, and cable parts. No lithium supplier shows up yet. That makes sense for a company that hasn't started buying fuel materials in bulk.", s: "sayariCfs", l: [] }
    ],
    unknown: ["Whether any fusion company has rules about where its lithium comes from. We found such rules from lithium and battery companies, but none from a fusion company."] },
  { id: "after", n: 6, name: "Afterward", what: "Used parts, recycling, waste", flag: "Waste, recycling",
    summary: "Used lithium parts are slightly radioactive. Recycling them would mean less new lithium-6 has to be made.",
    facts: [
      { t: "Without recycling, a large power plant could use up to 12 tonnes of lithium-6 a year. With good recycling, about 1.2 tonnes.", s: "neiEnriched", l: ["toxic"], k: "Estimate" }
    ],
    unknown: ["Where used parts would be processed, and which communities would live near that."] }
];

// Sites. Coordinates are approximate. "region" means a country or regional marker, not a plant.
const SITES = [
  { id: "atacama", stage: "extract", name: "Atacama salt flat", where: "Chile", at: [-68.25, -23.5], text: "Chilean companies pump lithium-rich water here, on Indigenous land.", s: ["iisdChile", "reutersAtacama"] },
  { id: "jujuy", stage: "extract", name: "Jujuy salt flats", where: "Argentina", at: [-66.4, -23.5], text: "Communities protested in 2023 after a vote made mining on their land easier.", s: ["fidh", "energyMonitor"] },
  { id: "greenbushes", stage: "extract", name: "Greenbushes mine", where: "Western Australia", at: [116.06, -33.86], text: "Australia's biggest lithium mine. Its dust went over legal limits at least 8 times in 2024, and a state report called it a health risk.", s: ["abcGreenbushes"] },
  { id: "bikita", stage: "extract", name: "Bikita mine", where: "Zimbabwe", at: [31.3, -20.08], text: "Owned by Chinese company Sinomine since 2022. The U.S. lists Zimbabwe's lithium as made with child labor, and people nearby have reported abuses.", s: ["dolList", "mongabayBikita", "sayariBikita"] },
  { id: "china", stage: "refine", name: "China", where: "Whole country", at: [112, 31], region: true, text: "Processes 70% of the world's lithium chemicals.", s: ["ieaGcmo2025"] },
  { id: "hainan", stage: "refine", name: "Sinomine (Hainan)", where: "Hainan, China", at: [109.2, 19.7], text: "Gets shipments from the Bikita mine, according to shipping records.", s: ["sayariBikita"] },
  { id: "xnm", stage: "refine", name: "Xinjiang Nonferrous Metals", where: "Xinjiang, China", at: [87.6, 43.8], text: "Chinese state company on the U.S. forced-labor list. Company records show it owns a lithium chemical plant.", s: ["millerUflpa", "sayariXnm"] },
  { id: "isoflex", stage: "enrich", name: "Isoflex USA", where: "California, U.S.", at: [-122.42, 37.77], text: "Sells isotopes in the U.S. Shipping records show it buying from five suppliers run by Russia's state nuclear agency. The dot marks the state, not an exact address.", s: ["sayariIsoflex"] },
  { id: "ecp", stage: "enrich", name: "Electrochemical Plant", where: "Zelenogorsk, Russia", at: [94.6, 56.1], text: "Russian state plant in a secret nuclear city. Makes nuclear fuel and isotopes. Sells to Isoflex USA.", s: ["atommediaEcp", "sayariIsoflex"] },
  { id: "shk", stage: "enrich", name: "Siberian Chemical Combine", where: "Seversk, Russia", at: [84.9, 56.6], ly: -8, text: "Russian state nuclear plant. Sells to Isoflex USA, according to shipping records.", s: ["sayariIsoflex"] },
  { id: "ekhp", stage: "enrich", name: "Elektrokhimpribor", where: "Lesnoy, Russia", at: [59.8, 58.6], text: "Russian state plant in a secret nuclear city. Sells to Isoflex USA, according to shipping records.", s: ["sayariIsoflex"] },
  { id: "isotop", stage: "enrich", name: "Isotope JSC", where: "Moscow, Russia", at: [37.6, 55.75], text: "Sells isotopes abroad for Russia's state nuclear agency. Sells to Isoflex USA.", s: ["isotopRu", "sayariIsoflex"] },
  { id: "xinjiang", stage: "refine", name: "Xinjiang", where: "Region of China", at: [85, 41.5], region: true, text: "The U.S. assumes goods from here involve forced labor. Lithium became a top priority for this in August 2025.", s: ["ustrUflpa2025"] },
  { id: "nccp", stage: "enrich", name: "NCCP", where: "Novosibirsk, Russia", at: [82.93, 55.03], ly: 10, text: "Russian state plant that makes most of the world's lithium-7, left over from sorting lithium-6 for weapons. On Ukraine's sanctions list. Sells to Isoflex USA and works for Russia's nuclear institutes.", s: ["wnaLithium", "sayariNccp", "sayariIsoflex"] },
  { id: "y12", stage: "enrich", name: "Y-12, Oak Ridge", where: "Tennessee, U.S.", at: [-84.25, 35.99], text: "Sorted lithium for U.S. nuclear weapons from 1953 to 1963 using mercury. Still being cleaned up.", s: ["wardArxiv", "atsdrY12", "doeY12"] },
  { id: "pp", stage: "enrich", name: "Precision Periodic", where: "Orlando, Florida", at: [-81.38, 28.54], text: "Working on a way to make lithium-6 without mercury, with U.S. government funding.", s: ["precisionPeriodic"] },
  { id: "swip", stage: "fabricate", name: "SWIP", where: "Chengdu, China", at: [104.07, 30.67], text: "Chinese research institute that built China's lithium test part for ITER.", s: ["ornlTbm"] },
  { id: "materion", stage: "fabricate", name: "Materion", where: "Elmore, Ohio", at: [-83.3, 41.48], text: "Supplies beryllium for Commonwealth Fusion Systems' FLiBe salt. Shown because that salt also contains lithium. Materion doesn't supply lithium.", s: ["materionCfs"] },
  { id: "iter", stage: "deploy", name: "ITER", where: "Southern France", at: [5.76, 43.7], text: "A huge international fusion experiment. It will test four designs for making fuel from lithium.", s: ["iterTbm", "neiEnriched"] },
  { id: "cfs", stage: "deploy", name: "Commonwealth Fusion Systems", where: "Massachusetts, U.S.", at: [-71.61, 42.54], text: "The biggest fusion company. Plans to use FLiBe salt. Hasn't said where its lithium will come from.", s: ["materionCfs", "cfsLibrti"] },
  { id: "ukaea", stage: "deploy", name: "U.K. fusion fuel program", where: "Culham, England", at: [-1.23, 51.66], text: "A £220 million program to prove fusion plants can make their own fuel.", s: ["cfsLibrti"] },
  { id: "petten", stage: "deploy", name: "Petten research reactor", where: "Netherlands", at: [4.66, 52.79], text: "A Dutch nuclear research reactor that tests materials. Shipping records show it trading with NCCP. Contents unknown.", s: ["sayariNccp"] },
  { id: "cneic", stage: "refine", name: "CNEIC", where: "Beijing, China", at: [116.4, 39.9], text: "China's state nuclear trading company. Shipping records show it trading with NCCP. Contents unknown.", s: ["sayariNccp"] }
];

// Links. "source" = a published agreement; "sayari" = a trade relationship, product not confirmed.
const FLOWS = [
  { from: "bikita", to: "hainan", kind: "sayari" },
  { from: "nccp", to: "cneic", kind: "sayari" },
  { from: "nccp", to: "petten", kind: "sayari" },
  { from: "nccp", to: "isoflex", kind: "sayari" },
  { from: "ecp", to: "isoflex", kind: "sayari" },
  { from: "shk", to: "isoflex", kind: "sayari" },
  { from: "ekhp", to: "isoflex", kind: "sayari" },
  { from: "isotop", to: "isoflex", kind: "sayari" },
  { from: "materion", to: "cfs", kind: "source" },
  { from: "cfs", to: "ukaea", kind: "source" }
];

const color = id => getComputedStyle(document.documentElement).getPropertyValue("--" + id).trim();
// Every web source was found and read with Tavily (search and extract); entity and trade data came from Sayari.
const via = k => k.startsWith("sayari") ? "Sayari" : "Tavily";
const srcLink = k => SOURCES[k] ? `<a href="${SOURCES[k][1]}" target="_blank" rel="noopener">${SOURCES[k][0].split(",")[0]}</a> <span class="via">via ${via(k)}</span>` : "";
const stageFromUrl = fallback => {
  const s = new URLSearchParams(location.search).get("step");
  return STAGES.some(x => x.id === s) ? s : fallback;
};
const UNKNOWNS = [
  "Which mine any fusion company's lithium comes from. None has said.",
  "How much lithium-6 Russia, China, and the U.S. can make or have stored.",
  "What was inside each shipment in the company records.",
  "Whether any fusion company has rules about where its lithium comes from."
];
