/* DOWN UNDER — site interactions. Uses localStorage for checklist progress and tip preferences. */
(() => {
  "use strict";
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const storage = {
    get(key, fallback) { try { const value = localStorage.getItem(key); return value === null ? fallback : JSON.parse(value); } catch { return fallback; } },
    set(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (error) { console.warn("Could not save preference on this device.", error); } }
  };

  const tips = [
    {type:"help",icon:"💡",label:"EASY TIP",tag:"GOOD TO KNOW",text:"You may need to walk a lot to reach shops or buses. Wear comfy shoes and check the route on your map.",url:"https://www.google.com/maps",link:"Open Google Maps"},
    {type:"emergency",icon:"🚨",label:"EMERGENCY",tag:"ACT NOW",text:"Need police, fire or an ambulance in an emergency? Call 000. Tell them what happened and where you are.",url:"https://www.triplezero.gov.au/",link:"Read emergency advice"},
    {type:"money",icon:"💳",label:"MONEY TIP",tag:"SAVE MONEY",text:"You do not need to buy everything on day one. Start with a pillow, blanket, towel and a few kitchen items.",url:"https://www.kmart.com.au/",link:"Look at home basics"},
    {type:"study",icon:"🎓",label:"UNI TIP",tag:"MEET PEOPLE",text:"Visit your university and ask where student support is. Join one club or event to meet people.",url:"https://www.studyaustralia.gov.au/",link:"Study in Australia"},
    {type:"work",icon:"🧰",label:"JOB TIP",tag:"FIND WORK",text:"A car may help you reach more jobs, especially outside the city. But fuel, insurance and repairs cost money, so plan first.",url:"https://www.seek.com.au/",link:"Search for jobs"},
    {type:"work",icon:"🛡️",label:"JOB SAFETY",tag:"WATCH OUT",text:"Never pay someone who promises to give you a job. Check the company before sharing personal information.",url:"https://www.fairwork.gov.au/",link:"Know your work rights"},
    {type:"tax",icon:"🧾",label:"TAX TIP",tag:"OFFICIAL INFO",text:"If you get a job, you may need a Tax File Number (TFN). An ABN is not needed for every job.",url:"https://www.ato.gov.au/individuals-and-families/tax-file-number",link:"TFN information"},
    {type:"transport",icon:"🚌",label:"TRANSPORT TIP",tag:"GET AROUND",text:"If you are in Sydney, learn how Opal and contactless travel payments work before your first trip.",url:"https://transportnsw.info/",link:"Sydney transport guide"},
    {type:"shopping",icon:"🛒",label:"SHOPPING TIP",tag:"DAILY LIFE",text:"Woolworths, Coles and Aldi sell everyday food. Compare prices and check which shop is closest to your home.",url:"https://www.aldi.com.au/",link:"Visit ALDI"},
    {type:"safety",icon:"🔐",label:"SAFETY TIP",tag:"KEEP SAFE",text:"Keep your passport and bank details safe. Never tell anyone your bank PIN or the code sent to your phone.",url:"https://moneysmart.gov.au/",link:"Money safety tips"},
    {type:"help",icon:"📱",label:"PHONE TIP",tag:"STAY CONNECTED",text:"Get a local SIM or eSIM so you can call people, use maps and receive messages while you are out.",url:"https://www.whistleout.com.au/MobilePhones",link:"Compare phone plans"},
    {type:"help",icon:"🌦️",label:"WEATHER TIP",tag:"PLAN AHEAD",text:"Weather can be very different across Australia. Check the forecast for your city before you go out.",url:"https://www.bom.gov.au/",link:"Check the weather"},
    {type:"work",icon:"📄",label:"RESUME TIP",tag:"FIND WORK",text:"If you have no work reference yet, ask your university about career help. You can also politely ask local shops if they take resumes.",url:"https://www.seek.com.au/career-advice",link:"Resume and job advice"},
    {type:"help",icon:"👋",label:"FRIENDSHIP TIP",tag:"YOU CAN DO IT",text:"Try saying: ‘Hi, I’m new here. Do you know any good places around here?’ A small chat is a good start.",url:"https://www.studyaustralia.gov.au/",link:"Student life advice"},
    {type:"help",icon:"🧭",label:"LOCAL TIP",tag:"FIND YOUR WAY",text:"Save your home address, university, nearest supermarket and nearest pharmacy in your phone map.",url:"https://www.google.com/maps",link:"Open Google Maps"},
    {type:"shopping",icon:"🛏️",label:"HOME TIP",tag:"START SMALL",text:"Kmart and Big W can be useful for bedding and kitchen items. Check prices online before you go.",url:"https://www.bigw.com.au/",link:"Look at Big W"},
    {type:"help",icon:"💬",label:"ENGLISH TIP",tag:"TAKE YOUR TIME",text:"Australian English may sound different at first. It is okay to ask someone to repeat or explain a word.",url:"https://www.studyaustralia.gov.au/",link:"Student information"},
    {type:"safety",icon:"🚦",label:"DRIVING TIP",tag:"CHECK FIRST",text:"Driving rules are different in each state. Check the official rules before driving with an overseas licence.",url:"https://www.service.nsw.gov.au/transaction/check-what-you-need-to-drive-in-nsw",link:"Check NSW driving rules"},
    {type:"money",icon:"🏦",label:"BANK TIP",tag:"KEEP IT SAFE",text:"Ask a bank what ID you need to open an account. Never share your PIN or banking login with anyone.",url:"https://moneysmart.gov.au/banking",link:"Banking basics"},
    {type:"help",icon:"🌱",label:"A LITTLE REMINDER",tag:"ONE STEP AT A TIME",text:"It is normal to feel nervous in a new country. You do not need to solve everything today. Take one step at a time.",url:"https://www.studyaustralia.gov.au/",link:"Support for students"}
  ];
  let tipIndex = storage.get("du-tip-index", 0) % tips.length;
  const tipWidget = $("#tipWidget"), tipText = $("#tipText"), tipCounter = $("#tipCounter"), tipReopen = $("#tipReopen");
  function renderTip() {
    const tip = tips[tipIndex];
    tipText.textContent = tip.text;
    tipCounter.textContent = `TIP ${String(tipIndex + 1).padStart(2, "0")} / ${tips.length}`;
    $("#tipIcon").textContent = tip.icon;
    $("#tipLabel").textContent = tip.label;
    $("#tipTag").textContent = tip.tag;
    tipWidget.dataset.type = tip.type;
    $("#tipLink").href = tip.url;
    $("#tipLink").textContent = `${tip.link} ↗`;
    storage.set("du-tip-index", tipIndex);
  }
  function nextTip() { tipIndex = (tipIndex + 1) % tips.length; renderTip(); }
  renderTip();
  if (storage.get("du-tip-hidden", false)) { tipWidget.classList.add("hidden"); tipReopen.hidden = false; }
  $("#nextTip").addEventListener("click", nextTip);
  $("#tipClose").addEventListener("click", () => { tipWidget.classList.add("hidden"); tipReopen.hidden = false; storage.set("du-tip-hidden", true); });
  tipReopen.addEventListener("click", () => { tipWidget.classList.remove("hidden"); tipWidget.classList.add("compact"); tipReopen.hidden = true; storage.set("du-tip-hidden", false); });
  const tipExpand = $("#tipExpand");
  tipExpand.addEventListener("click", () => {
    const compact = tipWidget.classList.toggle("compact");
    tipExpand.setAttribute("aria-expanded", String(!compact));
    tipExpand.textContent = compact ? "Show tip ＋" : "Minimise −";
  });

  const cityPlaces = {
    sydney: [["Sydney Opera House","See the famous building beside the harbour.","https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=700&q=80","https://www.sydneyoperahouse.com/"],["Sydney Harbour Bridge","Enjoy harbour views or learn about bridge climbs.","https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=700&q=80","https://www.bridgeclimb.com/"],["Bondi Beach","A popular beach for swimming and coastal walks.","https://images.unsplash.com/photo-1523428096881-5bd79d043006?auto=format&fit=crop&w=700&q=80","https://www.sydney.com/destinations/sydney/sydney-east/bondi"],["Royal Botanic Garden","A green place for a walk beside the harbour.","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80","https://www.rbgsyd.nsw.gov.au/"],["Gerringong","A coastal town south of Sydney for a day trip.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://www.visitnsw.com/destinations/south-coast/kiama-area/gerringong"]],
    melbourne: [["Federation Square","A central meeting spot near the river.","https://images.unsplash.com/photo-1514395462725-fb4566210144?auto=format&fit=crop&w=700&q=80","https://fedsquare.com/"],["Queen Victoria Market","Find food, fresh produce and local stalls.","https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=700&q=80","https://qvm.com.au/"],["Great Ocean Road","A famous coastal drive with ocean views.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://www.visitgreatoceanroad.org.au/"],["Royal Botanic Gardens","Walk through gardens close to the city.","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80","https://www.rbg.vic.gov.au/"]],
    tasmania: [["Cradle Mountain","Mountain views and walking tracks. Check weather first.","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80","https://parks.tas.gov.au/explore-our-parks/cradle-mountain"],["Freycinet National Park","Known for Wineglass Bay and coastal walks.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://parks.tas.gov.au/explore-our-parks/freycinet-national-park"],["Hobart waterfront","A nice area for food, boats and harbour views.","https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80","https://www.discovertasmania.com.au/"],["Port Arthur","Visit an important historic site.","https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=700&q=80","https://portarthur.org.au/"]],
    brisbane: [["South Bank Parklands","Riverside gardens and places to eat.","https://images.unsplash.com/photo-1524293581917-878a6d017c71?auto=format&fit=crop&w=700&q=80","https://visit.brisbane.qld.au/"],["Lone Pine Koala Sanctuary","See native Australian animals.","https://images.unsplash.com/photo-1459262838948-3e2de6c1ec80?auto=format&fit=crop&w=700&q=80","https://lonepinekoalasanctuary.com/"],["Moreton Island","A nature trip with beaches and clear water.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://parks.desi.qld.gov.au/parks/moreton-island"]],
    perth: [["Kings Park","A big park with city views and walking paths.","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80","https://www.bgpa.wa.gov.au/kings-park"],["Cottesloe Beach","A popular place to watch the sunset.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://www.westernaustralia.com/"],["Fremantle","Explore the harbour, markets and historic streets.","https://images.unsplash.com/photo-1518837695005-2083093ee35b?auto=format&fit=crop&w=700&q=80","https://visitfremantle.com.au/"]],
    adelaide: [["Adelaide Central Market","Try local food and browse fresh produce stalls.","https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=700&q=80","https://adelaidecentralmarket.com.au/"],["Glenelg Beach","A beach suburb with shops and places to eat.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://southaustralia.com/"],["Adelaide Botanic Garden","A peaceful garden in the city.","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80","https://www.botanicgardens.sa.gov.au/"]],
    darwin: [["Mindil Beach","Known for sunsets and seasonal markets.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://www.northernterritory.com/"],["Litchfield National Park","See waterfalls and nature. Check safety alerts.","https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=700&q=80","https://nt.gov.au/parks/find-a-park/litchfield-national-park"],["Kakadu National Park","Explore nature and learn about Aboriginal culture and history.","https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=700&q=80","https://parksaustralia.gov.au/kakadu/"]],
    canberra: [["Australian War Memorial","Learn about Australia's military history.","https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=700&q=80","https://www.awm.gov.au/"],["National Gallery of Australia","See Australian and international art.","https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=700&q=80","https://nga.gov.au/"],["Lake Burley Griffin","Walk, cycle or relax beside the lake.","https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=700&q=80","https://visitcanberra.com.au/"]],
    islands: [["Great Barrier Reef","See coral reefs and sea life with a guided trip.","https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=700&q=80","https://www.gbrmpa.gov.au/"],["Whitsunday Islands","White beaches and blue water. Plan boat trips ahead.","https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=700&q=80","https://www.queensland.com/"],["Kangaroo Island","Look for wildlife, coastal views and nature walks.","https://images.unsplash.com/photo-1470770841072-f978cf4d019e?auto=format&fit=crop&w=700&q=80","https://www.tourkangarooisland.com.au/"]]
  };
  $$("[data-open-place]").forEach(button => {
    button.addEventListener("click", () => $(`[data-show-place="${button.dataset.openPlace}"]`)?.click());
  });
  $$("[data-show-place]").forEach(button => button.addEventListener("click", () => {
    const key = button.dataset.showPlace, panel = $("#places-" + key);
    const open = button.getAttribute("aria-expanded") !== "true";
    button.setAttribute("aria-expanded", String(open));
    panel.hidden = !open;
    panel.setAttribute("aria-hidden", String(!open));
    button.innerHTML = open ? 'Hide places <span aria-hidden="true">−</span>' : 'See places and photos <span aria-hidden="true">＋</span>';
    if (open && !panel.dataset.loaded) {
      panel.innerHTML = (cityPlaces[key] || []).map(([name, desc, img, url]) => `<article class="attraction-card"><a href="${url}" target="_blank" rel="noopener"><img src="${img}" alt="${name}" loading="lazy"><div class="attraction-copy"><h4>${name}</h4><p>${desc}</p><span>Learn more ↗</span></div></a></article>`).join("");
      panel.dataset.loaded = "true";
    }
  }));

  // Keep every accordion's plus/minus symbol in sync with its open state.
  $$('details').forEach(details => {
    const symbol = details.querySelector('.word-plus, .summary-plus');
    if (!symbol) return;
    const updateSymbol = () => { symbol.textContent = details.open ? '−' : '＋'; };
    updateSymbol();
    details.addEventListener('toggle', updateSymbol);
  });

  // Home-page search: suggest relevant words and open the matching section/topic.
  const searchInput = $("#homeSearchInput");
  const suggestionBox = $("#homeSearchSuggestions");
  const searchItems = [
    {name:"Opal card", desc:"Transport card and how to use it", page:"important-words", target:"word-opal", keys:"opal transport train bus ferry metro"},
    {name:"Bank account and debit card", desc:"How to open an account and get a card", page:"important-words", target:"word-bank", keys:"bank money debit card account"},
    {name:"SIM card or eSIM", desc:"Get phone calls, messages and mobile data", page:"important-words", target:"word-sim", keys:"sim esim phone mobile data"},
    {name:"TFN", desc:"Tax File Number and how to apply", page:"important-words", target:"word-tfn", keys:"tfn tax file number job work tax"},
    {name:"ABN", desc:"Australian Business Number basics", page:"important-words", target:"word-abn", keys:"abn business contractor tax"},
    {name:"myGov", desc:"Access supported Australian government services", page:"important-words", target:"word-mygov", keys:"mygov government account centrelink"},
    {name:"OSHC", desc:"Overseas Student Health Cover", page:"important-words", target:"word-oshc", keys:"oshc health insurance student"},
    {name:"Emergency number 000", desc:"What to do in an emergency", page:"important-words", target:"word-emergency", keys:"emergency 000 police fire ambulance"},
    {name:"Rent and bond", desc:"Understand rental payments", page:"important-words", target:"word-rent", keys:"rent bond house accommodation lease"},
    {name:"Student visa conditions", desc:"Check the rules attached to your visa", page:"important-words", target:"word-visa", keys:"visa student work hours immigration"},
    {name:"Before you fly", desc:"Packing, documents and preparation", page:"before-flight", keys:"flight airport passport packing documents"},
    {name:"First days in Australia", desc:"Set up transport, phone, bank and essentials", page:"first-days", keys:"first day arrival transport bank phone"},
    {name:"Jobs and career", desc:"Find work and understand job safety", page:"jobs", keys:"job jobs career resume seek indeed work car"},
    {name:"Tourist destinations", desc:"Explore Australian cities and attractions", page:"explore", keys:"tourist travel sydney melbourne tasmania brisbane perth adelaide darwin canberra beach"},
    {name:"Everyday life and challenges", desc:"Shopping, safety, homesickness and daily routines", page:"everyday", keys:"daily life shops groceries challenge safety lonely homesick"}
  ];
  function matchingSearchItems(value) {
    const q = value.trim().toLowerCase();
    if (!q) return [];
    return searchItems.map(item => ({...item, score: (item.name.toLowerCase().includes(q) ? 3 : 0) + (item.keys.includes(q) ? 2 : 0) + (item.desc.toLowerCase().includes(q) ? 1 : 0) + (item.keys.split(' ').some(k => k.startsWith(q)) ? 1 : 0)})).filter(item => item.score > 0).sort((a,b) => b.score-a.score).slice(0,6);
  }
  function closeSuggestions() { suggestionBox.hidden = true; searchInput.setAttribute('aria-expanded','false'); }
  function showSuggestions() {
    const matches = matchingSearchItems(searchInput.value);
    suggestionBox.replaceChildren();
    matches.forEach(item => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'search-suggestion'; button.setAttribute('role','option');
      const title = document.createElement('strong'); title.textContent = item.name;
      const desc = document.createElement('small'); desc.textContent = item.desc;
      button.append(title, desc);
      button.addEventListener('click', () => openSearchResult(item));
      suggestionBox.append(button);
    });
    if (matches.length) { suggestionBox.hidden = false; searchInput.setAttribute('aria-expanded','true'); }
    else closeSuggestions();
  }
  function openSearchResult(item) {
    closeSuggestions();
    if (location.hash === '#' + item.page) activatePage(item.page);
    else location.hash = item.page;
    if (item.target) window.setTimeout(() => {
      const target = document.getElementById(item.target);
      if (target) { target.open = true; target.scrollIntoView({behavior:'smooth',block:'center'}); }
    }, 80);
    else window.scrollTo({top:0,behavior:'smooth'});
  }
  if (searchInput && suggestionBox) {
    searchInput.addEventListener('input', showSuggestions);
    searchInput.addEventListener('focus', showSuggestions);
    searchInput.addEventListener('keydown', event => {
      const options = $$('.search-suggestion', suggestionBox);
      if (event.key === 'Escape') { closeSuggestions(); return; }
      if (event.key === 'ArrowDown' && options.length) { event.preventDefault(); options[0].focus(); }
      if (event.key === 'Enter') { event.preventDefault(); const match = matchingSearchItems(searchInput.value)[0]; if (match) openSearchResult(match); else if (searchInput.value.trim()) { searchItems.find(item => item.page === 'explore').page && (location.hash = 'explore'); } }
    });
    $$('[data-search-term]').forEach(button => button.addEventListener('click', () => { searchInput.value = button.dataset.searchTerm; const match = matchingSearchItems(searchInput.value)[0]; if (match) openSearchResult(match); else showSuggestions(); }));
    document.addEventListener('click', event => { if (!event.target.closest('.home-search')) closeSuggestions(); });
  }

  // Internal navigation behaves like feature pages while preserving normal URL hashes and browser history.
  const pages = $$(".page");
  const navLinks = $$(".nav-link");
  const menuToggle = $("#menuToggle");
  function activatePage(id, scroll = true) {
    const pageId = pages.some(page => page.id === id) ? id : "home";
    pages.forEach(page => { const active = page.id === pageId; page.classList.toggle("active-page", active); page.setAttribute("aria-hidden", String(!active)); });
    navLinks.forEach(link => { const active = link.getAttribute("href") === `#${pageId}`; link.classList.toggle("active", active); if (active) link.setAttribute("aria-current", "page"); else link.removeAttribute("aria-current"); });
    document.body.classList.remove("nav-open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    nextTip();
    if (scroll) window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
  }
  function handleHash() { activatePage(decodeURIComponent(location.hash.slice(1) || "home"), false); }
  window.addEventListener("hashchange", handleHash);
  $$('a[href^="#"]').forEach(link => link.addEventListener("click", event => {
    const id = link.getAttribute("href").slice(1);
    if (!pages.some(page => page.id === id)) return;
    event.preventDefault();
    if (location.hash === `#${id}`) activatePage(id);
    else location.hash = id;
  }));
  menuToggle.addEventListener("click", () => {
    const open = !document.body.classList.contains("nav-open");
    document.body.classList.toggle("nav-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  });
  handleHash();

  // Save checkboxes independently on this device.
  $$('input[type="checkbox"][data-check]').forEach(input => {
    const key = `du-check-${input.dataset.check}`;
    input.checked = storage.get(key, false);
    input.addEventListener("change", () => {
      storage.set(key, input.checked);
      updateProgress();
    });
  });
  function updateProgress() {
    const homeChecks = $$('input[data-check^="home-"]');
    const homeDone = homeChecks.filter(input => input.checked).length;
    const homeBar = $("#homeProgressBar");
    if (homeBar) homeBar.style.width = `${homeChecks.length ? homeDone / homeChecks.length * 100 : 0}%`;
    const homeText = $("#homeProgressText");
    if (homeText) homeText.textContent = `${homeDone} of ${homeChecks.length} essentials completed`;
    const flightChecks = $$('input[data-check^="flight-"]');
    const flightDone = flightChecks.filter(input => input.checked).length;
    const pct = Math.round(flightDone / Math.max(flightChecks.length, 1) * 100);
    const flightBar = $("#flightProgressBar"), flightNumber = $("#flightProgressNumber");
    if (flightBar) flightBar.style.width = `${pct}%`;
    if (flightNumber) flightNumber.textContent = `${pct}%`;
  }
  updateProgress();

  // Filter destinations without leaving the page.
  $$(".filter-btn").forEach(button => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    $$(".filter-btn").forEach(item => { const selected = item === button; item.classList.toggle("selected", selected); item.setAttribute("aria-pressed", String(selected)); });
    $$(".place-card").forEach(card => { card.hidden = filter !== "all" && card.dataset.category !== filter; });
  }));
  $$(".filter-btn").forEach(button => button.setAttribute("aria-pressed", String(button.classList.contains("selected"))));

  // Scroll affordance.
  const toTop = $("#toTop");
  window.addEventListener("scroll", () => toTop.classList.toggle("visible", window.scrollY > 500), { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }));
  $("#year").textContent = new Date().getFullYear();
})();
