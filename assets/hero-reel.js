// Hero reel: four beats, about 12 s, built from code so it stays sharp and
// can be translated. Found (search + AI overview) → trusted (before/after
// redesign) → contacted (an inbox: the request, the automatic reply, the
// booking) → results (an analytics dashboard).
//
// When it first reaches the middle of the screen (scrolling down) the page
// holds still until the end of the first beat, then scrolling is released and
// the reel keeps looping. Reduced motion: a still frame, no hold.
(function () {
  var root = document.querySelector(".js-hero-reel");
  if (!root) return;

  var EN = /^en/i.test(document.documentElement.lang);
  var COPY = EN ? {
    words: [["More", "visibility."], ["More", "trust."], ["More", "enquiries."], ["More", "results."]],
    labels: ["Visibility on Google & AI", "Website redesign", "Contact automation", "Results"],
    query: "architect in lisbon to renovate kitchen", newSearch: "New search", searchSuffix: " - Search",
    tabs: ["All", "AI Mode", "Images", "Maps", "News", "Videos"], aiTitle: "AI Overview",
    aiText: 'To renovate your kitchen in Lisbon with an architect, <mark>Alma Studio</mark> is one of the most recommended studios: bespoke interior projects, from the 3D design to the finished build.',
    chip: "almastudio +1", aiHead: "Architecture Studios and Renovation Companies in Lisbon",
    aiItem: "Alma Studio", aiSub: ["Services:", "Interior design, kitchen and bathroom renovations, project management."], more: "Show more",
    you: "Your site", resUrl: "https://almastudio.pt › renovations", resTitle: "Kitchen Renovation in Lisbon | Alma Studio", resText: "Bespoke interior projects in Lisbon. Kitchen renovations from the 3D design to the finished build. Book a visit online.",
    rating: "4.9 · 120 reviews", links: ["Projects", "Book a visit", "Contact"],
    before: "Before", after: "After",
    old: { top: ["☎ +351 21 345 6789", "✉ info@almastudio.pt", "Mon–Fri 9am–6pm"], social: "Facebook · Instagram · LinkedIn &nbsp;|&nbsp; PT · EN", tagline: "Architecture • Design • Renovations • Decoration • Building",
      nav: ["HOME", "COMPANY", "SERVICES", "PROJECTS", "PORTFOLIO", "NEWS", "PARTNERS", "FAQ", "CONTACTS"], btn: "GET A QUOTE", h: "WELCOME TO ALMA STUDIO",
      p: "For over 15 years we have been developing architecture, interior design, renovation and turnkey projects for homes and businesses in Lisbon and the surrounding area. Quality, rigour and commitment in every project.",
      b1: "LEARN MORE", b2: "CONTACT US",
      cols: [["Architecture", "We develop architecture projects for houses, flats and commercial spaces, from planning permission to completion, always with close follow-up."], ["Interiors", "We create functional, welcoming spaces suited to your lifestyle and budget, including materials, furniture and lighting."], ["Renovations", "Kitchens, bathrooms, entire flats. We take care of the whole process so you don't have to worry about your build."], ["Turnkey projects", "A complete solution with team management, controlled timings and costs. Ask for your no-obligation quote today!"]],
      more: "Read more »", cookie: "This website uses cookies to improve your browsing experience. By continuing to browse you accept our cookie policy.", ok: "ACCEPT", info: "LEARN MORE" },
    neu: { nav: ["Projects", "Studio", "Process", "Contact"], book: "Book a visit", kicker: "Interior architecture — Lisbon", h: "Interiors designed for real life.", p: "Bespoke renovations, from the first sketch to the last piece. We follow every project from start to finish.", see: "See projects →", cap: ["Casa da Graça, Lisbon", "2025"], proof: [["120+", "completed projects"], ["4.9", "Google rating"], ["24h", "response time"]] },
    inbox: { title: "Inbox — Alma Studio", compose: "Compose", folders: ["Inbox", "Bookings", "Sent", "Automations"],
      rows: [
        ["Ana Ribeiro", "Quote request — kitchen", "Hi! I'd like to renovate my kitchen, can you help?", "2:02 pm"],
        ["Calendar", "Visit booked: Ana Ribeiro", "Thursday 16 May, 2:30 pm", "2:03 pm"],
        ["Pedro Martins", "New chat message", "Do you also renovate offices?", "2:09 pm"],
        ["Sofia Costa", "Quote request", "I'm opening a shop downtown and need help with…", "2:15 pm"]
      ], old: [["Rita Lopes", "Re: Proposal", "Thanks, I'll look at it this week.", "Yesterday"], ["Marta Freitas", "Flat renovation", "Could we change the date of the visit?", "Mon"]],
      from: "Ana Ribeiro", email: "ana.ribeiro@gmail.com", body: "Hi! I'd like to renovate my kitchen. It's a small space, what would you suggest? Thanks, Ana",
      auto: "Automatic reply sent", reply: "Hi Ana, thanks for getting in touch! We'll reply today. To speed things up, book a visit here: almastudio.pt/visit",
      booked: "Visit booked", when: "Thursday 16 May · 2:30 pm", confirmed: "Confirmed", now: "now" },
    db: { title: "Dashboard", period: "Last 12 months", kpis: [["Visits", 0, 3240, 0, "+48%"], ["Enquiries", 0, 47, 0, "+62%"], ["Conversion rate", 0, 3.8, 1, "+1.2 pts", "%"], ["Avg. Google position", 9.5, 2.1, 1, "↑ 7 places"]],
      chart: "Enquiries per month", newSite: "New site", tip: "47 enquiries", months: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      sources: "Where enquiries come from", src: [["Google", 38], ["AI assistants", 21], ["Direct", 24], ["Social", 17]] }
  } : {
    words: [["Mais", "visibilidade."], ["Mais", "confiança."], ["Mais", "contactos."], ["Mais", "resultados."]],
    labels: ["Visibilidade no Google e IA", "Redesign do site", "Automação de contactos", "Resultados"],
    query: "arquiteto em lisboa para remodelar cozinha", newSearch: "Nova pesquisa", searchSuffix: " - Pesquisa",
    // Google's interface as it shows up in Portugal: content in Portuguese, labels in English
    tabs: ["All", "AI Mode", "Images", "Maps", "News", "Videos"], aiTitle: "AI Overview",
    aiText: 'Para remodelar a sua cozinha em Lisboa com acompanhamento de arquitetura, o <mark>Alma Studio</mark> é um dos gabinetes mais recomendados: projetos de interiores à medida, do desenho 3D à execução da obra.',
    chip: "almastudio +1", aiHead: "Gabinetes de Arquitetura e Empresas de Remodelação em Lisboa",
    aiItem: "Alma Studio", aiSub: ["Serviços:", "Projeto de interiores, remodelação de cozinhas e casas de banho, gestão de obra."], more: "Show more",
    you: "O seu site", resUrl: "https://almastudio.pt › remodelacoes", resTitle: "Remodelação de Cozinhas em Lisboa | Alma Studio", resText: "Projetos de interiores à medida em Lisboa. Remodelação de cozinhas, do desenho 3D à execução da obra. Marque uma visita online.",
    rating: "4,9 · 120 avaliações", links: ["Projetos", "Marcar visita", "Contacto"],
    before: "Antes", after: "Depois",
    old: { top: ["☎ 21 345 6789", "✉ geral@almastudio.pt", "Seg–Sex 9h–18h"], social: "Facebook · Instagram · LinkedIn &nbsp;|&nbsp; PT · EN", tagline: "Arquitetura • Design • Remodelações • Decoração • Obras",
      nav: ["INÍCIO", "EMPRESA", "SERVIÇOS", "PROJETOS", "PORTFÓLIO", "NOTÍCIAS", "PARCEIROS", "FAQ", "CONTACTOS"], btn: "PEDIR ORÇAMENTO", h: "BEM-VINDO À ALMA STUDIO",
      p: "Há mais de 15 anos a desenvolver projetos de arquitetura, design de interiores, remodelações e obras chave na mão para particulares e empresas em Lisboa e arredores. Qualidade, rigor e compromisso em cada projeto.",
      b1: "SAIBA MAIS", b2: "CONTACTE-NOS",
      cols: [["Arquitetura", "Desenvolvemos projetos de arquitetura para moradias, apartamentos e espaços comerciais, desde o licenciamento até à execução, sempre com acompanhamento."], ["Interiores", "Criamos ambientes funcionais e acolhedores, adaptados ao seu estilo de vida e orçamento, com escolha de materiais, mobiliário e iluminação."], ["Remodelações", "Cozinhas, casas de banho, apartamentos completos. Tratamos de todo o processo para que não tenha preocupações com a sua obra."], ["Obras chave na mão", "Uma solução completa com gestão de equipas, prazos e custos controlados. Peça já o seu orçamento sem compromisso!"]],
      more: "Ler mais »", cookie: "Este site utiliza cookies para melhorar a sua experiência de navegação. Ao continuar a navegar está a aceitar a nossa política de cookies.", ok: "ACEITAR", info: "SAIBA MAIS" },
    neu: { nav: ["Projetos", "Estúdio", "Processo", "Contacto"], book: "Marcar visita", kicker: "Arquitetura de interiores — Lisboa", h: "Interiores pensados para a vida real.", p: "Remodelações à medida, do primeiro esboço à última peça. Acompanhamos cada projeto do início ao fim.", see: "Ver projetos →", cap: ["Casa da Graça, Lisboa", "2025"], proof: [["120+", "projetos concluídos"], ["4,9", "avaliação no Google"], ["24h", "tempo de resposta"]] },
    inbox: { title: "Caixa de entrada — Alma Studio", compose: "Escrever", folders: ["Caixa de entrada", "Marcações", "Enviados", "Automações"],
      rows: [
        ["Ana Ribeiro", "Pedido de orçamento — cozinha", "Olá! Quero remodelar a cozinha, podem ajudar?", "14:02"],
        ["Agenda", "Visita marcada: Ana Ribeiro", "quinta-feira, 16 de maio, 14:30", "14:03"],
        ["Pedro Martins", "Nova mensagem no chat", "Também remodelam escritórios?", "14:09"],
        ["Sofia Costa", "Pedido de orçamento", "Vou abrir uma loja no centro e preciso de ajuda…", "14:15"]
      ], old: [["Rita Lopes", "Re: Proposta", "Obrigada, vou ver esta semana.", "Ontem"], ["Marta Freitas", "Remodelação de apartamento", "Podemos mudar a data da visita?", "Seg"]],
      from: "Ana Ribeiro", email: "ana.ribeiro@gmail.com", body: "Olá! Quero remodelar a cozinha. É um espaço pequeno, que soluções fazem sentido? Obrigada, Ana",
      auto: "Resposta automática enviada", reply: "Olá Ana, obrigado pelo contacto! Respondemos ainda hoje. Para ganhar tempo, marque já a sua visita: almastudio.pt/visita",
      booked: "Visita marcada", when: "quinta-feira, 16 de maio · 14:30", confirmed: "Confirmada", now: "agora" },
    db: { title: "Painel", period: "Últimos 12 meses", kpis: [["Visitas", 0, 3240, 0, "+48%"], ["Pedidos de contacto", 0, 47, 0, "+62%"], ["Taxa de conversão", 0, 3.8, 1, "+1,2 p.p.", "%"], ["Posição média no Google", 9.5, 2.1, 1, "↑ 7 lugares"]],
      chart: "Pedidos de contacto por mês", newSite: "Novo site", tip: "47 pedidos", months: ["Set", "Out", "Nov", "Dez", "Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago"],
      sources: "Origem dos pedidos", src: [["Google", 38], ["Assistentes de IA", 21], ["Direto", 24], ["Redes sociais", 17]] }
  };

  // ---------- markup ----------
  var SEARCH_ICON = '<svg viewBox="0 0 14 14"><circle cx="6" cy="6" r="4.2"/><path d="M9.2 9.2 12.5 12.5"/></svg>';
  var C = COPY, O = C.old, N = C.neu;
  var map = function (a, f) { return a.map(f).join(""); };
  root.innerHTML =
    '<div class="hr-light js-light"></div><div class="hr-light -b js-light2"></div><div class="hr-vignette"></div>' +
    '<div class="hr-vis">' +
      // 1 · found
      '<div class="hr-beat js-beat"><div class="hr-slot"><div class="hr-sframe js-sframe"><div class="he-sp js-sp">' +
        '<div class="sp-chrome"><span class="sp-lights"><i></i><i></i><i></i></span><span class="sp-tab">' + SEARCH_ICON + '<span class="js-tabq"></span></span></div>' +
        '<div class="sp-bar"><span>←</span><span>→</span><span>↻</span><span class="sp-omni">' + SEARCH_ICON + '<span class="js-omni"></span></span></div>' +
        '<div class="sp-page">' +
          '<div class="sp-box">' + SEARCH_ICON + '<span class="js-q"></span><i class="sp-caret js-caret"></i></div>' +
          '<div class="js-results"><div class="sp-tabs">' + map(C.tabs, function (t, k) { return '<span' + (k ? "" : ' class="on"') + ">" + t + "</span>"; }) + '</div>' +
          '<div class="sp-main">' +
            '<div class="sp-ai">' +
              '<div class="sp-ai-h"><svg viewBox="0 0 24 24"><defs><linearGradient id="hr-gem" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4f8df5"/><stop offset="1" stop-color="#2f5fd8"/></linearGradient></defs><path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="url(#hr-gem)"/></svg>' + C.aiTitle + '</div>' +
              '<div class="sp-ai-top"><div class="sp-ai-copy"><div class="sp-skel js-skel"><i style="width:96%"></i><i style="width:90%"></i><i style="width:70%"></i></div>' +
                '<p class="sp-text js-aitext">' + C.aiText + '</p><span class="sp-chip js-chip"><em>A</em>' + C.chip + '</span></div>' +
                '<div class="sp-thumb js-thumb"></div></div>' +
              '<div class="js-aimore"><h6 class="sp-ai-h2">' + C.aiHead + '</h6>' +
                '<ul class="sp-ai-list"><li><u class="js-aiitem">' + C.aiItem + '</u><ul><li><b>' + C.aiSub[0] + '</b> ' + C.aiSub[1] + '</li></ul></li></ul>' +
                '<span class="sp-more">' + C.more + ' <i>⌄</i></span></div>' +
            '</div>' +
            '<div class="sp-res js-res"><span class="sp-you js-you">' + C.you + '</span><div class="sp-site"><em>A</em><div>Alma Studio<small>' + C.resUrl + '</small></div></div>' +
              '<h5>' + C.resTitle + '</h5><p>' + C.resText + '</p><div class="sp-rate"><b>★★★★★</b> ' + C.rating + '</div></div>' +
          '</div></div>' +
        '</div>' +
      '</div></div></div></div>' +
      // 2 · chosen
      '<div class="hr-beat js-beat"><div class="hr-slot">' +
        '<div class="hr-ba"><span class="js-ba-a">' + C.before + '</span><i></i><span class="js-ba-b">' + C.after + '</span></div>' +
        '<div class="hr-frame js-frame">' +
          '<div class="hr-canvas he-old">' +
            '<div class="o-top">' + map(O.top, function (x) { return "<span>" + x + "</span>"; }) + '<span class="r">' + O.social + '</span></div>' +
            '<div class="o-head"><div class="o-logo"><b>ALMA STUDIO</b><small>' + O.tagline + '</small></div><nav>' + map(O.nav, function (x) { return "<span>" + x + "</span>"; }) + '</nav><span class="o-btn">' + O.btn + '</span></div>' +
            '<div class="o-slider"><h4>' + O.h + '</h4><p>' + O.p + '</p><span>' + O.b1 + '</span><span>' + O.b2 + '</span><i class="o-arr -l">‹</i><i class="o-arr -r">›</i><div class="o-dots"><i class="on"></i><i></i><i></i><i></i><i></i></div></div>' +
            '<div class="o-cols">' + map(O.cols, function (c) { return "<div><b>" + c[0] + "</b><p>" + c[1] + "</p><a>" + O.more + "</a></div>"; }) + '</div>' +
            '<div class="o-cookie">' + O.cookie + ' <span>' + O.ok + '</span><span>' + O.info + '</span></div><i class="o-wa"></i>' +
          '</div>' +
          '<div class="hr-after js-after"><div class="hr-canvas he-new">' +
            '<nav class="n-nav"><b>Alma</b>' + map(N.nav, function (x) { return "<span>" + x + "</span>"; }) + '<em>' + N.book + '</em></nav>' +
            '<div class="n-hero"><div class="n-copy"><small>' + N.kicker + '</small><h4>' + N.h + '</h4><p>' + N.p + '</p><div class="n-cta"><span class="n-btn">' + N.book + '</span><span class="n-link">' + N.see + '</span></div></div>' +
            '<figure class="n-img"><div></div><figcaption><span>' + N.cap[0] + '</span><span>' + N.cap[1] + '</span></figcaption></figure></div>' +
            '<div class="n-proof">' + map(N.proof, function (p) { return "<span><b>" + p[0] + "</b>" + p[1] + "</span>"; }) + '</div>' +
          '</div></div>' +
          '<i class="hr-edge js-edge"></i>' +
        '</div>' +
      '</div></div>' +
      // 3 · contacted: an inbox
      '<div class="hr-beat js-beat"><div class="hr-slot"><div class="hr-iframe js-iframe"><div class="ib js-ib">' +
        '<div class="ib-chrome"><span class="sp-lights"><i></i><i></i><i></i></span><span>' + C.inbox.title + '</span></div>' +
        '<div class="ib-main">' +
          '<aside class="ib-side"><span class="ib-compose">' + C.inbox.compose + '</span>' + map(C.inbox.folders, function (f, k) { return '<span class="ib-folder' + (k ? "" : " on") + '">' + f + (k ? "" : '<b class="js-ibcount">0</b>') + "</span>"; }) + '</aside>' +
          '<div class="ib-list">' + map(C.inbox.rows.concat(C.inbox.old), function (r, k) {
            var av = r[0] === "Agenda" || r[0] === "Calendar" ? '<em class="ib-av -cal">16</em>' : '<em class="ib-av">' + r[0].split(" ").map(function (w) { return w[0]; }).join("") + "</em>";
            return '<div class="ib-row js-ibrow' + (k < 4 ? " -new" : "") + '">' + av + '<div><div class="ib-r1"><b>' + r[0] + '</b><time>' + r[3] + '</time></div><div class="ib-sub">' + r[1] + '</div><div class="ib-snip">' + r[2] + "</div></div></div>";
          }) + '</div>' +
          '<div class="ib-read js-ibread">' +
            '<h6>' + C.inbox.rows[0][1] + '</h6>' +
            '<div class="ib-from"><em class="ib-av">AR</em><div><b>' + C.inbox.from + '</b><small>' + C.inbox.email + '</small></div><time>' + C.inbox.rows[0][3] + '</time></div>' +
            '<p class="ib-body">' + C.inbox.body + '</p>' +
            '<div class="ib-auto js-ibauto"><div class="ib-auto-h"><i>✦</i>' + C.inbox.auto + '<time>' + C.inbox.now + '</time></div><p>' + C.inbox.reply + '</p></div>' +
            '<div class="ib-book js-ibbook"><em class="ib-av -cal">16</em><div><b>' + C.inbox.booked + '</b><small>' + C.inbox.when + '</small></div><span>✓ ' + C.inbox.confirmed + '</span></div>' +
          '</div>' +
        '</div>' +
      '</div></div></div></div>' +
      // 4 · grow: an analytics dashboard
      '<div class="hr-beat js-beat"><div class="hr-slot"><div class="hr-dframe js-dframe"><div class="db js-db">' +
        '<div class="db-top"><b>Alma</b><span>' + C.db.title + '</span><em>' + C.db.period + ' ⌄</em><small>almastudio.pt</small></div>' +
        '<div class="db-body">' +
          '<div class="db-kpis">' + map(C.db.kpis, function (k) { return '<div class="db-kpi js-kpi"><span>' + k[0] + '</span><b class="js-kv">0</b><i>' + k[4] + "</i></div>"; }) + '</div>' +
          '<div class="db-chart"><div class="db-chart-h"><span>' + C.db.chart + '</span><small><i></i>' + C.db.newSite + '</small></div>' +
            '<svg class="js-dbchart" preserveAspectRatio="none"><defs><linearGradient id="hr-area" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1f1f1f" stop-opacity=".22"/><stop offset="1" stop-color="#1f1f1f" stop-opacity="0"/></linearGradient></defs>' +
              '<g class="js-dbgrid"></g><line class="db-mark js-dbmark"/><path class="db-area js-dbarea"/><path class="db-line js-dbline"/><circle class="db-dot js-dbdot" r="5"/></svg>' +
            '<div class="db-tip js-dbtip">' + C.db.tip + '</div>' +
            '<div class="db-months">' + map(C.db.months, function (m) { return "<span>" + m + "</span>"; }) + '</div>' +
          '</div>' +
          '<div class="db-src"><span>' + C.db.sources + '</span><div class="db-bar">' + map(C.db.src, function (x) { return '<i class="js-dbseg" style="flex-basis:' + x[1] + '%"></i>'; }) + '</div>' +
            '<div class="db-legend">' + map(C.db.src, function (x) { return "<span><i></i>" + x[0] + " " + x[1] + "%</span>"; }) + '</div></div>' +
        '</div>' +
      '</div></div></div></div>' +
    '</div>' +
    '<div class="hr-type">' + map(C.words, function (w) {
      return '<div class="hr-word js-word">' + (w[0] ? '<span class="hr-ser js-ser"><span>' + w[0] + "</span></span>" : "") + '<span class="hr-big"><span class="row js-big">' + w[1] + "</span></span></div>";
    }) + '</div>' +
    '<div class="hr-section hr-label js-section"><b class="js-sec-n">01</b><i class="js-sec-line"></i><span class="mask"><span class="js-sec-t"></span></span></div>' +
    '<div class="hr-grain js-grain"></div>';

  // ---------- helpers ----------
  var $ = function (s) { return root.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(root.querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var lerp = function (a, b, p) { return a + (b - a) * p; };
  var expo = function (p) { return p === 1 ? 1 : 1 - Math.pow(2, -10 * p); };
  var io = function (p) { return p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; };
  var inq = function (p) { return p * p * p; };
  var back = function (p) { var c = 1.3; return 1 + (c + 1) * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); };
  var pr = function (u, a, b, e) { var p = clamp((u - a) / (b - a), 0, 1); return e ? e(p) : p; };
  // Deterministic noise, so a given moment always looks the same
  var hash = function (n) { var x = Math.sin(n * 127.1) * 43758.5453; return x - Math.floor(x); };

  // [length, background, foreground]
  var DARK = "#0b0b0a", INK = "#eeeeea";
  var BEATS = [[3.8, DARK, INK], [3.0, DARK, INK], [3.0, DARK, INK], [3.0, DARK, INK]];
  var HOLD = BEATS[0][0]; // the page holds still until the end of the first beat
  var L = BEATS.reduce(function (s, b) { return s + b[0]; }, 0);
  var OUT = .55; // each beat eases out over its last ~half second

  var words = $$(".js-word").map(function (w) {
    var big = w.querySelector(".js-big"), txt = big.textContent;
    big.innerHTML = txt.split("").map(function (c) { return "<span>" + c + "</span>"; }).join("");
    return { el: w, big: big, ser: w.querySelector(".js-ser span"), letters: Array.prototype.slice.call(big.children), orig: txt.split("") };
  });

  var el = {
    beats: $$(".js-beat"), light: $(".js-light"), grain: $(".js-grain"),
    sec: $(".js-section"), secN: $(".js-sec-n"), secT: $(".js-sec-t"), secLine: $(".js-sec-line"),
    sframe: $(".js-sframe"), sp: $(".js-sp"), tabq: $(".js-tabq"), omni: $(".js-omni"), q: $(".js-q"), caret: $(".js-caret"),
    results: $(".js-results"), you: $(".js-you"), skel: $(".js-skel"), aitext: $(".js-aitext"), mark: $(".js-aitext mark"), res: $(".js-res"), aiitem: $(".js-aiitem"), chip: $(".js-chip"), thumb: $(".js-thumb"), aimore: $(".js-aimore"),
    frame: $(".js-frame"), after: $(".js-after"), edge: $(".js-edge"), baA: $(".js-ba-a"), baB: $(".js-ba-b"),
    iframe: $(".js-iframe"), ib: $(".js-ib"), ibrows: $$(".js-ibrow"), ibcount: $(".js-ibcount"), ibread: $(".js-ibread"), ibauto: $(".js-ibauto"), ibbook: $(".js-ibbook"),
    light2: $(".js-light2"),
    ba: $(".hr-ba"), dframe: $(".js-dframe"), db: $(".js-db"), kpis: $$(".js-kv"), kpiTiles: $$(".js-kpi"), dbchart: $(".js-dbchart"), dbgrid: $(".js-dbgrid"),
    dbmark: $(".js-dbmark"), dbarea: $(".js-dbarea"), dbline: $(".js-dbline"), dbdot: $(".js-dbdot"), dbtip: $(".js-dbtip"), dbsegs: $$(".js-dbseg")
  };

  // AI overview text, revealed word by word
  (function split(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var f = document.createDocumentFragment();
        // each word carries its following space, so the highlight runs on unbroken
        (n.textContent.match(/\s*\S+\s*/g) || []).forEach(function (w) {
          var sp = document.createElement("span"); sp.textContent = w; f.appendChild(sp);
        });
        node.replaceChild(f, n);
      } else split(n);
    });
  })(el.aitext);
  var aiWords = Array.prototype.slice.call(el.aitext.querySelectorAll("span"));

  // ---------- layout that depends on the panel's size ----------
  var W = 0, H = 0, narrow = false, dbLen = 0, dbPts = [];
  var DATA = [18, 21, 19, 22, 20, 24, 29, 33, 37, 41, 44, 47], LAUNCH = 5.5;
  var fit = function (node, w) { node.style.width = Math.round(w) + "px"; };
  function layout() {
    W = root.clientWidth; H = root.clientHeight; narrow = W < 560;
    var pad = parseFloat(getComputedStyle(root).getPropertyValue("--pad")) || 16;
    // Room for the visuals: from the top of their slot down to just above the word
    var wordH = 0, bigH = 0;
    words.forEach(function (w) { wordH = Math.max(wordH, w.el.offsetHeight); bigH = Math.max(bigH, w.big.parentNode.offsetHeight); });
    var top = narrow ? pad + 52 : pad;
    // On wide screens the visuals sit to the right of the small "Ser", so they can come
    // down to the big word itself; on phones they span the width, so they stop above "Ser"
    var room = narrow ? H - pad - wordH - 20 - top : H - pad - bigH - 22 - top;
    var slotW = narrow ? W - pad * 2 : (W - pad * 2) * 2 / 3;
    // Search page and dashboard are laid out at a real size, then scaled into their frames
    var sw = narrow ? 430 : 1024, sh = narrow ? 560 : 720;
    el.sp.classList.toggle("-m", narrow);
    el.sp.style.width = sw + "px"; el.sp.style.height = sh + "px";
    el.sframe.style.aspectRatio = sw + " / " + sh;
    fit(el.sframe, Math.min(slotW, room * sw / sh));
    var dw = narrow ? 430 : 1024, dh = narrow ? 640 : 640;
    el.db.classList.toggle("-m", narrow);
    el.db.style.width = dw + "px"; el.db.style.height = dh + "px";
    el.dframe.style.aspectRatio = dw + " / " + dh;
    fit(el.dframe, Math.min(slotW, room * dw / dh));
    // Before/after: tabs above a 16:10 frame
    var fw = Math.min(slotW, (room - 46) * 1.6);
    fit(el.ba, fw); fit(el.frame, fw);
    // Inbox: real size, scaled into its frame
    var iw = narrow ? 430 : 1024, ih = narrow ? 610 : 640;
    el.ib.classList.toggle("-m", narrow);
    el.ib.style.width = iw + "px"; el.ib.style.height = ih + "px";
    el.iframe.style.aspectRatio = iw + " / " + ih;
    fit(el.iframe, Math.min(slotW, room * iw / ih));
    // Dashboard chart, drawn in its own coordinates
    var cw = narrow ? 380 : 940, ch = narrow ? 190 : 250;
    el.dbchart.setAttribute("viewBox", "0 0 " + cw + " " + ch);
    var lo = 12, hi = 52;
    dbPts = DATA.map(function (v, k) { return [12 + k / (DATA.length - 1) * (cw - 24), ch - 10 - (v - lo) / (hi - lo) * (ch - 30)]; });
    var d = "M" + dbPts[0][0] + " " + dbPts[0][1];
    for (var k = 1; k < dbPts.length; k++) { var a2 = dbPts[k - 1], b2 = dbPts[k], mx = (a2[0] + b2[0]) / 2; d += " C" + mx + " " + a2[1] + " " + mx + " " + b2[1] + " " + b2[0] + " " + b2[1]; }
    el.dbline.setAttribute("d", d);
    el.dbarea.setAttribute("d", d + " L" + dbPts[dbPts.length - 1][0] + " " + ch + " L" + dbPts[0][0] + " " + ch + " Z");
    dbLen = el.dbline.getTotalLength();
    el.dbline.style.strokeDasharray = dbLen;
    var mxl = 12 + LAUNCH / (DATA.length - 1) * (cw - 24);
    el.dbmark.setAttribute("x1", mxl); el.dbmark.setAttribute("x2", mxl); el.dbmark.setAttribute("y1", 0); el.dbmark.setAttribute("y2", ch);
    el.dbgrid.innerHTML = [.25, .5, .75].map(function (f) { return '<line x1="0" x2="' + cw + '" y1="' + ch * f + '" y2="' + ch * f + '"/>'; }).join("");
  }
  var fmt = function (v, dec, unit) {
    var str = dec ? v.toFixed(dec) : String(Math.round(v));
    if (!dec && Math.round(v) >= 1000) str = EN ? Math.round(v).toLocaleString("en-GB") : Math.round(v).toLocaleString("pt-PT").replace(/\u00a0/g, " ");
    if (!EN) str = str.replace(".", ",");
    return str + (unit || "");
  };

  // ---------- one moment of the reel ----------
  function render(t) {
    t = ((t % L) + L) % L;
    var i = 0, s = 0;
    while (t >= s + BEATS[i][0]) { s += BEATS[i][0]; i++; }
    var u = t - s, len = BEATS[i][0], B = BEATS[i], frame = Math.floor(t * 24);
    // On the very first pass the page already shows beat 1 laid out (the poster), so
    // its entrance is skipped: only the search starts typing
    if (i > 0) intro = false;
    var ent = intro && i === 0 ? 99 : u;
    // ...except the words, which rise in once they're on screen themselves
    var went = intro && i === 0 ? (wordT === null ? 0 : (performance.now() - wordT) / 1000) : u;

    root.style.setProperty("--bg", B[1]); root.style.setProperty("--fg", B[2]);
    root.style.background = B[1];
    el.grain.style.transform = "translate(" + (hash(frame) * 20 - 10) + "%," + (hash(frame + 7) * 20 - 10) + "%)";
    var ph = t / L * Math.PI * 2;
    // All beats are black: the lights alternate which one leads (cool lilac, then warm)
    el.light.style.background = "radial-gradient(circle, " + (i % 2 ? "rgba(110,140,215,.28)" : "rgba(143,124,201,.34)") + ", rgba(0,0,0,0) 62%)";
    el.light2.style.background = "radial-gradient(circle, " + (i % 2 ? "rgba(143,124,201,.2)" : "rgba(110,140,215,.16)") + ", rgba(0,0,0,0) 62%)";
    el.light.style.transform = "translate(" + (W * (.3 + .18 * Math.cos(ph)) - el.light.offsetWidth / 2) + "px," + (H * (.3 + .18 * Math.sin(ph)) - el.light.offsetHeight / 2) + "px)";
    el.light2.style.transform = "translate(" + (W * (.78 - .14 * Math.cos(ph + 1.2)) - el.light2.offsetWidth / 2) + "px," + (H * (.78 - .16 * Math.sin(ph + 1.2)) - el.light2.offsetHeight / 2) + "px)";

    // Section label: number, a hairline that draws, the name rising out of its mask
    el.sec.style.color = B[2];
    el.secN.textContent = "0" + (i + 1);
    el.secT.textContent = C.labels[i];
    el.secLine.style.transform = "scaleX(" + (pr(ent, .05, .6, expo) * (1 - pr(u, len - OUT, len - .1, io))) + ")";
    el.secT.style.transform = "translateY(" + ((1 - pr(ent, .15, .7, expo)) * 110 - pr(u, len - OUT + .1, len, io) * 110) + "%)";
    el.secN.style.opacity = .5 * pr(ent, .05, .3);

    // The word: letters rise in one after another, and leave the same way, upwards
    // through their mask; a word wider than the panel drifts left
    words.forEach(function (w, j) {
      w.el.style.visibility = j === i ? "visible" : "hidden";
      if (j !== i) return;
      if (w.ser) w.ser.style.transform = "translateY(" + ((1 - pr(went, .08, .6, expo)) * 105 - pr(u, len - OUT, len - .25, io) * 105) + "%)";
      var step = Math.min(.025, .25 / w.letters.length);
      w.letters.forEach(function (c, k) {
        var inP = pr(went, .12 + k * .03, .7 + k * .03, expo), outP = pr(u, len - OUT + k * step, len - .25 + k * step, io);
        c.style.transform = "translateY(" + ((1 - inP) * 105 - outP * 105) + "%)";
      });
      var over = Math.max(0, w.big.scrollWidth - W + 40);
      w.big.style.transform = "translateX(" + (-over * pr(u, .3, len - .2, io)) + "px)";
    });

    // Visuals
    el.beats.forEach(function (b, j) { b.style.display = j === i ? "block" : "none"; });
    // Visuals come into focus and leave softly: fade, a touch of blur and lift
    var vin = pr(ent, .05, .75, expo), vout = pr(u, len - OUT, len - .05, io);
    var slot = el.beats[i].querySelector(".hr-slot");
    slot.style.opacity = vin * (1 - vout);
    slot.style.filter = vin < 1 || vout > 0 ? "blur(" + ((1 - vin) * 10 + vout * 8).toFixed(2) + "px)" : "";
    slot.style.transform = "translateY(" + ((1 - vin) * 18 - vout * 12) + "px) scale(" + (.985 + .015 * vin - .01 * vout) + ")";

    if (i === 0) {
      // Query typed, the results page loads, the AI overview answers, the site's result lights up
      el.sp.style.transform = "scale(" + (el.sframe.clientWidth / (narrow ? 430 : 1024)) + ")";
      var typedQ = C.query.slice(0, Math.round(C.query.length * pr(u, .1, .7)));
      var loaded = u >= .78;
      el.q.textContent = typedQ; el.omni.textContent = loaded || narrow ? typedQ : "";
      el.tabq.textContent = loaded ? C.query + C.searchSuffix : C.newSearch;
      el.caret.style.opacity = loaded ? 0 : (Math.floor(u * 3) % 2 ? .25 : 1);
      var rl = pr(u, .78, 1.05, expo);
      el.results.style.opacity = rl; el.results.style.transform = "translateY(" + (1 - rl) * 10 + "px)";
      // AI overview: a shimmering placeholder, then the answer streams in (Alma Studio named first),
      // its source chip and picture, the list with Alma Studio on top; then Alma Studio's own
      // result, first in the organic results, lights up
      var thinking = u < 1.2;
      el.skel.style.display = thinking ? "block" : "none";
      Array.prototype.forEach.call(el.skel.children, function (b) { b.style.backgroundPosition = (100 - (u * 160) % 200) + "% 0"; });
      el.aitext.style.display = thinking ? "none" : "block";
      var wp = pr(u, 1.2, 1.95);
      aiWords.forEach(function (w, k) { w.style.opacity = clamp(wp * aiWords.length - k, 0, 1); });
      var cp = pr(u, 1.9, 2.15, expo);
      el.chip.style.opacity = cp;
      el.thumb.style.opacity = pr(u, 1.3, 1.7, expo);
      var mp = pr(u, 2.0, 2.35, expo);
      el.aimore.style.opacity = mp; el.aimore.style.transform = "translateY(" + (1 - mp) * 8 + "px)";
      var rp = pr(u, 2.3, 2.6, expo);
      el.res.style.opacity = rp; el.res.style.transform = "translateY(" + (1 - rp) * 10 + "px)";
      // Lilac highlight wherever Alma Studio shows up: in the AI answer, in its list, in the results
      el.mark.style.setProperty("--m", pr(u, 1.95, 2.25, expo));
      el.aiitem.style.setProperty("--m", pr(u, 2.3, 2.6, expo));
      var hl = pr(u, 2.75, 3.1, expo);
      el.res.style.setProperty("--hl", hl);
      el.you.style.opacity = hl; el.you.style.transform = "translateY(" + (1 - hl) * 6 + "px)";
    }
    if (i === 1) {
      // A clean wipe from the old site to the new one
      el.frame.style.setProperty("--s", el.frame.clientWidth / 1280);
      var wp2 = pr(u, 1.0, 1.55, io);
      el.after.style.clipPath = "inset(0 " + (100 - wp2 * 100) + "% 0 0)";
      el.edge.style.left = (wp2 * 100) + "%";
      el.edge.style.opacity = wp2 > 0 && wp2 < 1 ? 1 : 0;
      el.baA.style.setProperty("--on", 1 - pr(u, 1.0, 1.3, expo));
      el.baB.style.setProperty("--on", pr(u, 1.25, 1.55, expo));
      el.baA.style.opacity = lerp(1, .4, pr(u, 1.0, 1.3));
      el.baB.style.opacity = lerp(.4, 1, pr(u, 1.25, 1.55));
    }
    if (i === 2) {
      // Ana's request lands and opens; the automatic reply goes out, the visit is booked;
      // more enquiries keep arriving at the top of the list
      el.ib.style.transform = "scale(" + (el.iframe.clientWidth / (narrow ? 430 : 1024)) + ")";
      var T0 = [.3, 1.55, 1.95, 2.25], ROW = narrow ? 92 : 86, cnt = 0;
      var landed = T0.map(function (a) { return pr(u, a, a + .4, expo); });
      el.ibrows.forEach(function (r, j) {
        var y, newer = 0;
        if (j < 4) {
          for (var k = j + 1; k < 4; k++) newer += landed[k];
          y = newer * ROW + (1 - landed[j]) * -16;
          r.style.opacity = landed[j];
          if (u >= T0[j]) cnt++;
          r.classList.toggle("is-sel", j === 0 && u >= .55);
        } else {
          y = (j - 4) * ROW + (landed[0] + landed[1] + landed[2] + landed[3]) * ROW;
        }
        r.style.transform = "translateY(" + y + "px)";
      });
      el.ibcount.textContent = cnt;
      var rd = pr(u, .55, .85, expo);
      el.ibread.style.opacity = rd; el.ibread.style.transform = "translateY(" + (1 - rd) * 8 + "px)";
      var au = pr(u, 1.0, 1.3, expo);
      el.ibauto.style.opacity = au; el.ibauto.style.transform = "translateY(" + (1 - au) * 10 + "px)";
      var bk = pr(u, 1.45, 1.75, expo);
      el.ibbook.style.opacity = bk; el.ibbook.style.transform = "translateY(" + (1 - bk) * 10 + "px)";
    }
    if (i === 3) {
      // Dashboard: the numbers count up, the line draws past the launch, sources fill in
      var dbS = el.dframe.clientWidth / (narrow ? 430 : 1024);
      el.db.style.transform = "scale(" + dbS + ")";
      C.db.kpis.forEach(function (k, j) {
        var p = pr(u, .25 + j * .1, 1.35 + j * .1, io);
        el.kpis[j].textContent = fmt(lerp(k[1], k[2], p), k[3], k[5]);
        var tp = pr(u, .1 + j * .08, .5 + j * .08, expo);
        el.kpiTiles[j].style.opacity = tp; el.kpiTiles[j].style.transform = "translateY(" + (1 - tp) * 10 + "px)";
      });
      var lp = pr(u, .35, 1.6, io);
      el.dbline.style.strokeDashoffset = dbLen * (1 - lp);
      el.dbarea.style.opacity = pr(u, .9, 1.7);
      var q = el.dbline.getPointAtLength(dbLen * lp);
      el.dbdot.setAttribute("cx", q.x); el.dbdot.setAttribute("cy", q.y);
      el.dbmark.style.opacity = pr(u, .5, .8);
      var tip = pr(u, 1.6, 1.9, expo);
      el.dbtip.style.opacity = tip; el.dbtip.style.transform = "translateY(" + (1 - tip) * 6 + "px)";
      el.dbsegs.forEach(function (g, j) { g.style.transform = "scaleX(" + pr(u, 1.2 + j * .1, 1.7 + j * .1, expo) + ")"; });
    }
  }

  layout();
  window.addEventListener("resize", function () { layout(); render(clock); });
  window.__heroReelRender = function (t) { clock = t; render(t); }; // frame-by-frame rendering (video export, checks)

  var clock = 0, intro = true, wordT = null;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { render(L - .9); return; }
  // Until the visitor scrolls, the reel shows the first slide laid out with the
  // search box still empty; scrolling starts the typing and the rest of the story
  render(0);
  // The first word rises in when it comes on screen (on load, if it's already there)
  function wordCheck() {
    if (wordT !== null || !intro) return;
    var r = words[0].el.getBoundingClientRect();
    if (r.top >= 0 && r.top + r.height * .6 <= window.innerHeight) {
      wordT = performance.now();
      var until = wordT + 1600;
      (function frame(now) { render(clock); if (!playing && now < until) requestAnimationFrame(frame); })(wordT);
    }
  }
  wordCheck();
  window.addEventListener("scroll", wordCheck, { passive: true });

  // ---------- playback ----------
  // Starts from the beginning on the first scroll down; then plays while on screen.
  var playing = false, started = false, held = false, done = false, last = 0, holdUntil = HOLD;
  function tick(now) {
    if (!playing) return;
    var dt = last ? Math.min(.1, (now - last) / 1000) : 0;
    clock += dt;
    // First pass: beat 1 doesn't start leaving until its words have been on screen a while
    var exitAt = BEATS[0][0] - OUT - .01;
    if (intro && clock > exitAt && (wordT === null || now - wordT < 1800)) clock = exitAt;
    last = now;
    if (held && clock >= holdUntil) release();
    wordCheck();
    render(clock);
    requestAnimationFrame(tick);
  }
  function play() { if (playing) return; playing = true; last = 0; requestAnimationFrame(tick); }
  function pause() { playing = false; }
  new IntersectionObserver(function (e) {
    if (e[0].isIntersecting && started) play(); else if (!e[0].isIntersecting) pause();
  }, { threshold: .15 }).observe(root);

  // ---------- the hold ----------
  // Scrolling down, the first time the reel's middle reaches the middle of the
  // screen: centre it and stop the page until the end of the first beat.
  var html = document.documentElement;
  var keys = { " ": 1, PageDown: 1, PageUp: 1, ArrowDown: 1, ArrowUp: 1, Home: 1, End: 1 };
  // Someone who keeps trying to scroll is let go early, on their second
  // deliberate attempt. The gesture that brought the reel to the middle (and
  // its trackpad momentum) doesn't count. A new attempt is a scroll after a
  // pause, or one that clearly speeds up again while the last swipe is still
  // dying down. Speeds are smoothed, since a trackpad's deltas jitter from one
  // event to the next, and attempts are at least 400ms apart, so a single
  // swipe can never count twice.
  var ATTEMPTS = 2, attempts = 0, lastEvent = 0, lastAttempt = 0, speed = 0, peak = 0, trough = 0;
  var push = function (size) {
    var now = performance.now();
    var paused = now - lastEvent > 250;
    speed = paused ? size : speed * .65 + size * .35;
    lastEvent = now;
    if (speed > peak) { peak = speed; trough = speed; } else if (speed < trough) trough = speed;
    var again = paused || (trough < peak * .6 && speed > trough * 2 + 10);
    if (again && now - lastAttempt > 400) {
      attempts++;
      lastAttempt = now;
      peak = trough = speed;
      if (attempts >= ATTEMPTS) release();
    }
  };
  var block = function (e) { e.preventDefault(); push(Math.abs(e.deltaY || 0)); };
  var blockKeys = function (e) { if (keys[e.key]) { e.preventDefault(); push(0); } };
  function centreY() { var r = root.getBoundingClientRect(); return window.scrollY + r.top + r.height / 2 - window.innerHeight / 2; }
  function start() { if (started) return; started = true; clock = 0; play(); }
  function hold() {
    held = true;
    // Whatever scrolling is under way now is the gesture that got here, not an attempt
    lastEvent = lastAttempt = performance.now();
    speed = peak = trough = 0;
    start();
    // The reel keeps running from the first scroll (no restart). The hold lasts to the
    // end of the first beat, or just a beat of a second if that's already gone by
    holdUntil = Math.max(HOLD, clock + 1);
    var y = centreY(), lenis = window.siteLenis;
    if (lenis) { lenis.scrollTo(y, { immediate: true, force: true }); lenis.stop(); }
    else window.scrollTo(0, y);
    html.style.overflow = "hidden";
    window.addEventListener("wheel", block, { passive: false });
    window.addEventListener("touchmove", block, { passive: false });
    window.addEventListener("keydown", blockKeys);
    play();
    viewing();
  }
  function release() {
    held = false; done = true;
    html.style.overflow = "";
    window.removeEventListener("wheel", block);
    window.removeEventListener("touchmove", block);
    window.removeEventListener("keydown", blockKeys);
    if (window.siteLenis) window.siteLenis.start();
  }
  // While the reel fills the screen, the nav steps aside
  function viewing() {
    var r = root.getBoundingClientRect(), vh = window.innerHeight;
    html.classList.toggle("reel-view", r.top < vh * .3 && r.bottom > vh * .7);
  }
  // A little air between the reel and the quiz strip below it
  var curtain = root.closest(".hero-curtain");
  if (curtain) curtain.classList.add("has-reel");
  var lastY = window.scrollY;
  // Only the visitor's own scrolling counts: the browser also fires scroll events
  // by itself (restoring the position on reload, for one), which must not start the reel
  var touched = false;
  window.addEventListener("wheel", function (e) { if (e.deltaY > 0) touched = true; }, { passive: true });
  window.addEventListener("touchstart", function () { touched = true; }, { passive: true });
  window.addEventListener("keydown", function (e) { if (keys[e.key]) touched = true; });
  // Already past it (e.g. reloaded further down the page): no hold, just play
  if (centreY() < window.scrollY - 4) { done = true; start(); }
  window.addEventListener("scroll", function () {
    var y = window.scrollY, down = y > lastY;
    lastY = y;
    viewing();
    if (!down || !touched) return;
    // It starts as soon as the reel is on screen
    var r = root.getBoundingClientRect();
    if (r.top < window.innerHeight && r.bottom > 0) start();
    if (done || held) return;
    if (r.top + r.height / 2 <= window.innerHeight / 2) hold();
  }, { passive: true });
})();
