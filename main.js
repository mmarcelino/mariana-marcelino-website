(function () {
  // Form submissions are emailed to CONTACT_EMAIL by Web3Forms. The access key
  // is public by design (it only allows sending to this address).
  var CONTACT_EMAIL = "info@mariana-marcelino.com";
  var FORM_ENDPOINT = "https://api.web3forms.com/submit";
  var FORM_KEY = "973fe51d-cbf3-42aa-a9ed-89eba047449c";
  var formData = function (subject, replyTo) {
    var data = new FormData();
    data.append("access_key", FORM_KEY);
    data.append("subject", subject);
    data.append("from_name", "Site Mariana Marcelino");
    data.append("replyto", replyTo);
    return data;
  };
  // Forms go to the site's own email function first (branded confirmation for
  // the visitor); if that isn't available, Web3Forms delivers the enquiry
  var submit = function (form, payload, w3) {
    payload.lang = EN ? "en" : "pt";
    payload.company = form.elements.company ? form.elements.company.value : "";
    return fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify(payload)
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) {
        if (res.ok && d.success === true) return d;
        if (res.status === 400) throw new Error(d.message || "invalid");
        return sendForm(w3);
      });
    }, function () { return sendForm(w3); });
  };
  var sendForm = function (data) {
    return fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data })
      .then(function (res) { return res.json().catch(function () { return {}; }); })
      .then(function (d) { if (!d || d.success !== true) throw new Error((d && d.message) || "send failed"); return d; });
  };
  // Shared with the diagnosis quiz (assets/quiz.js)
  window.siteForms = { formData: formData, submit: function (f, p, w) { return submit(f, p, w); } };
  var EN = /^en/i.test(document.documentElement.lang);
  var REDUCED = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Smooth scrolling (Lenis, self-hosted). Mouse/trackpad devices only: touch
  // keeps native scrolling (on iOS 26 Safari, Lenis made the fixed strip slide
  // under the address bar). Popups and the mobile menu scroll natively and
  // pause it.
  var lenis = null;
  if (window.Lenis && !REDUCED && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
    lenis = new Lenis({
      lerp: 0.07,
      wheelMultiplier: 0.9,
      autoRaf: true,
      // In-page links glide with a fixed duration and a soft ease in/out
      anchors: {
        duration: 1.5,
        easing: function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }
      },
      prevent: function (node) { return node.closest && node.closest("dialog, .mobile-menu, [data-lenis-prevent]"); }
    });
    // Shared with the hero reel (assets/hero-reel.js), which holds the page still for one loop
    window.siteLenis = lenis;
    new MutationObserver(function () {
      if (document.body.classList.contains("has-modal")) lenis.stop(); else lenis.start();
    }).observe(document.body, { attributes: true, attributeFilter: ["class"] });
  }

  // The arrival fade (html.pt-enter, set in the page head) is cleared once it has run
  if (document.documentElement.classList.contains("pt-enter")) {
    var ptMain = document.querySelector("main");
    var ptDone = function () { document.documentElement.classList.remove("pt-enter"); };
    if (ptMain) ptMain.addEventListener("animationend", function (e) { if (e.target === ptMain && e.animationName === "pt-in") ptDone(); });
    setTimeout(ptDone, 1200);
  }

  // Page transitions between internal pages: fade out, then navigate
  if (!REDUCED) {
    document.addEventListener("click", function (e) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || !/^https?:$/.test(url.protocol)) return;
      // Same page (anchor links) is handled by the smooth scroll
      if (url.pathname === location.pathname && url.search === location.search) return;
      e.preventDefault();
      try { sessionStorage.setItem("pt", "1"); } catch (err) {}
      document.documentElement.classList.add("pt-out");
      setTimeout(function () { location.href = url.href; }, 430);
    });
    // Coming back through the browser history: show the page again
    window.addEventListener("pageshow", function (e) {
      if (e.persisted) document.documentElement.classList.remove("pt-out");
    });
    // Warm up the next page while the pointer rests on a link
    var warmed = {};
    document.addEventListener("pointerover", function (e) {
      var a = e.target.closest && e.target.closest("a[href]");
      if (!a) return;
      var url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || warmed[url.pathname]) return;
      warmed[url.pathname] = true;
      var l = document.createElement("link");
      l.rel = "prefetch"; l.href = url.pathname;
      document.head.appendChild(l);
    });
  }

  // Booking: every "Marcar chamada" link opens Calendly in a popup over
  // the page instead of a new tab. Calendly's files load on the first click
  // only; if they fail, the link simply opens in a new tab as before.
  var calendlyLoading = null;
  var loadCalendly = function () {
    if (calendlyLoading) return calendlyLoading;
    calendlyLoading = new Promise(function (resolve, reject) {
      var css = document.createElement("link");
      css.rel = "stylesheet";
      css.href = "https://assets.calendly.com/assets/external/widget.css";
      document.head.appendChild(css);
      var js = document.createElement("script");
      js.src = "https://assets.calendly.com/assets/external/widget.js";
      js.async = true;
      js.onload = function () { window.Calendly ? resolve() : reject(); };
      js.onerror = reject;
      document.head.appendChild(js);
    });
    return calendlyLoading;
  };
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest && e.target.closest('a[href*="calendly.com/"]');
    if (!a) return;
    e.preventDefault();
    var url = a.href;
    // The mobile menu closes first so the calendar opens on a clean page
    var menuClose = document.querySelector(".js-mobile-menu:not([hidden]) .js-menu-close");
    if (menuClose) menuClose.click();
    loadCalendly().then(function () {
      window.Calendly.initPopupWidget({ url: url });
    }).catch(function () { window.open(url, "_blank", "noopener"); });
  });
  // While the calendar is open, the page behind stays still
  new MutationObserver(function () {
    var open = !!document.querySelector(".calendly-overlay");
    document.body.classList.toggle("has-calendly", open);
    if (lenis) { if (open) lenis.stop(); else if (!document.body.classList.contains("has-modal")) lenis.start(); }
  }).observe(document.body, { childList: true });

  // ---------- Chat assistant (our own; answers come from /api/chat) ----------
  // Kept in its own scope: the hero animation further down uses the same names
  (function () {
  var CHAT_T = EN ? {
    open: "Open chat", close: "Close chat", title: "Let's talk", status: "Virtual assistant · Online", label: "Mariana's virtual assistant",
    hello: "Hi, how can I help? I can answer your questions about the services, plans and prices, or suggest the next step that makes most sense for your business.",
    placeholder: "Write your question…", send: "Send",
    chips: ["How much does a website cost?", "How does the free redesign work?", "How long does it take?"],
    call: "Book a call", mail: "Email this conversation",
    mailAsk: "Leave your email and Mariana will get back to you with this conversation in hand.",
    mailPlaceholder: "Your email", mailSend: "Send", mailCancel: "Cancel",
    mailOk: "Done! Mariana has received this conversation and will get back to you soon.",
    leadAsk: "Would you like Mariana to follow up on your questions in more detail? Leave your email and she'll get back to you soon.",
    leadSkip: "Not now",
    mailFail: "It couldn't be sent right now. You can write to info@mariana-marcelino.com.",
    busy: "Too many messages in a short time. Please try again in a little while, or book a call.",
    fail: "Sorry, I can't answer right now. You can book a call or write to info@mariana-marcelino.com.",
    you: "You", bot: "Assistant"
  } : {
    open: "Abrir chat", close: "Fechar chat", title: "Vamos falar", status: "Assistente virtual · Online", label: "Assistente virtual da Mariana",
    hello: "Olá, como posso ajudar? Posso responder às suas dúvidas sobre os serviços, planos e preços, ou sugerir o próximo passo que faz mais sentido para o seu negócio.",
    placeholder: "Escreva a sua pergunta…", send: "Enviar",
    chips: ["Quanto custa um site?", "Como funciona o redesign gratuito?", "Quanto tempo demora?"],
    call: "Marcar chamada", mail: "Enviar conversa por email",
    mailAsk: "Deixe o seu email e a Mariana responde-lhe com esta conversa em mãos.",
    mailPlaceholder: "O seu email", mailSend: "Enviar", mailCancel: "Cancelar",
    mailOk: "Feito! A Mariana recebeu esta conversa e responde-lhe brevemente.",
    leadAsk: "Quer que a Mariana dê seguimento mais detalhado às suas dúvidas? Deixe o seu email e ela responde-lhe brevemente.",
    leadSkip: "Agora não",
    mailFail: "Não foi possível enviar agora. Pode escrever para info@mariana-marcelino.com.",
    busy: "Muitas mensagens em pouco tempo. Tente de novo daqui a pouco, ou marque uma chamada.",
    fail: "Desculpe, não consigo responder agora. Pode marcar uma chamada ou escrever para info@mariana-marcelino.com.",
    you: "Eu", bot: "Assistente"
  };
  var CHAT_KEY = "chat-" + (EN ? "en" : "pt");
  var chatHistory = [];
  try { chatHistory = JSON.parse(sessionStorage.getItem(CHAT_KEY) || "[]"); } catch (err) { chatHistory = []; }
  var saveChat = function () { try { sessionStorage.setItem(CHAT_KEY, JSON.stringify(chatHistory.slice(-30))); } catch (err) {} };

  var launcher = document.createElement("button");
  launcher.type = "button";
  launcher.className = "chat-launcher";
  launcher.setAttribute("aria-label", CHAT_T.open);
  launcher.setAttribute("aria-expanded", "false");
  launcher.setAttribute("aria-controls", "chat-panel");
  launcher.innerHTML = '<span class="chat-launcher-icon" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M5 5.5h14a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17H5a1.5 1.5 0 0 1-1.5-1.5V7A1.5 1.5 0 0 1 5 5.5Z"/></svg></span>';

  var panel = document.createElement("section");
  panel.className = "chat-panel";
  panel.id = "chat-panel";
  panel.hidden = true;
  panel.setAttribute("role", "dialog");
  // Wheel and touch scrolling inside the chat stay in the chat (not the page)
  panel.setAttribute("data-lenis-prevent", "");
  panel.setAttribute("aria-label", CHAT_T.label);
  panel.innerHTML =
    '<header class="chat-head"><div><p class="chat-title"></p><p class="chat-status"><i aria-hidden="true"></i><span></span></p></div>' +
    '<button type="button" class="chat-close"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3 3 13"/></svg></button></header>' +
    '<div class="chat-log" aria-live="polite"></div>' +
    '<div class="chat-chips"></div>' +
    '<form class="chat-mail" hidden novalidate><p class="chat-mail-ask"></p><div class="chat-mail-row"><input type="email" class="chat-mail-input" autocomplete="email" required><button type="submit" class="chat-mail-send"></button></div><button type="button" class="chat-mail-cancel"></button></form>' +
    '<form class="chat-form" novalidate><textarea class="chat-input" rows="1" maxlength="800"></textarea><button type="submit" class="chat-send"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2.5 8h11M9 3.5 13.5 8 9 12.5"/></svg></button></form>' +
    '<div class="chat-actions"><a class="chat-action" target="_blank" rel="noopener" href="https://calendly.com/marianacmarcelino/30min"></a><button type="button" class="chat-action js-chat-mail"></button></div>';
  var $ = function (sel) { return panel.querySelector(sel); };
  $(".chat-title").textContent = CHAT_T.title;
  $(".chat-status span").textContent = CHAT_T.status;
  $(".chat-close").setAttribute("aria-label", CHAT_T.close);
  $(".chat-input").placeholder = CHAT_T.placeholder;
  $(".chat-input").setAttribute("aria-label", CHAT_T.placeholder);
  $(".chat-send").setAttribute("aria-label", CHAT_T.send);
  $(".chat-actions a").textContent = CHAT_T.call;
  $(".js-chat-mail").textContent = CHAT_T.mail;
  $(".chat-mail-ask").textContent = CHAT_T.mailAsk;
  $(".chat-mail-input").placeholder = CHAT_T.mailPlaceholder;
  $(".chat-mail-input").setAttribute("aria-label", CHAT_T.mailPlaceholder);
  $(".chat-mail-send").textContent = CHAT_T.mailSend;
  $(".chat-mail-cancel").textContent = CHAT_T.mailCancel;
  var logEl = $(".chat-log"), input = $(".chat-input"), chatForm = $(".chat-form"), chips = $(".chat-chips"), mailForm = $(".chat-mail");

  // Replies are plain text; site links become clickable, everything else stays text
  var bubble = function (role, content, extraClass) {
    var el = document.createElement("div");
    el.className = "chat-msg -" + role + (extraClass ? " " + extraClass : "");
    String(content).split(/(https:\/\/www\.mariana-marcelino\.com\/[^\s)]*)/).forEach(function (part, idx) {
      if (idx % 2) {
        var a = document.createElement("a");
        a.href = part.replace(/[.,;:]+$/, "");
        a.textContent = a.href.replace("https://www.", "");
        el.appendChild(a);
        if (part !== a.href) el.appendChild(document.createTextNode(part.slice(a.href.length)));
      } else {
        el.appendChild(document.createTextNode(part));
      }
    });
    logEl.appendChild(el);
    logEl.scrollTop = logEl.scrollHeight;
    return el;
  };
  var renderChat = function () {
    logEl.innerHTML = "";
    bubble("bot", CHAT_T.hello);
    chatHistory.forEach(function (m) { bubble(m.role === "user" ? "user" : "bot", m.content); });
    chips.hidden = chatHistory.length > 0;
  };
  CHAT_T.chips.forEach(function (label) {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "chat-chip";
    b.textContent = label;
    b.addEventListener("click", function () { ask(label); });
    chips.appendChild(b);
  });

  // Lead capture: never before the chat starts. A soft, optional card asks for
  // an email after the second answer, or earlier if the assistant sees intent
  // (it ends its reply with [[EMAIL]]). Shown once per visit; skipping is fine.
  var LEAD_KEY = "chat-lead";
  var leadState = "";
  try { leadState = sessionStorage.getItem(LEAD_KEY) || ""; } catch (err) {}
  var setLead = function (v) { leadState = v; try { sessionStorage.setItem(LEAD_KEY, v); } catch (err) {} };
  var transcriptText = function () {
    return chatHistory.map(function (m) { return (m.role === "user" ? CHAT_T.you : CHAT_T.bot) + ": " + m.content; }).join("\n\n") || "—";
  };
  var sendTranscript = function (email, form) {
    var transcript = transcriptText();
    var w3 = formData("Chat: novo contacto", email);
    w3.append("Email", email);
    w3.append("Mensagem", transcript);
    w3.append("Origem", "Chat do site");
    w3.append("Idioma", EN ? "EN" : "PT");
    return submit(form, { type: "chat", email: email, message: transcript }, w3);
  };
  var leadCard = null;
  var offerLead = function () {
    if (leadState || leadCard) return;
    setLead("offered");
    leadCard = document.createElement("form");
    leadCard.className = "chat-lead";
    leadCard.noValidate = true;
    leadCard.innerHTML = '<p></p><div class="chat-mail-row"><input type="email" class="chat-mail-input" autocomplete="email" required><button type="submit" class="chat-mail-send"></button></div><button type="button" class="chat-mail-cancel"></button>';
    leadCard.querySelector("p").textContent = CHAT_T.leadAsk;
    var li = leadCard.querySelector("input");
    li.placeholder = CHAT_T.mailPlaceholder;
    li.setAttribute("aria-label", CHAT_T.mailPlaceholder);
    leadCard.querySelector(".chat-mail-send").textContent = CHAT_T.mailSend;
    leadCard.querySelector(".chat-mail-cancel").textContent = CHAT_T.leadSkip;
    leadCard.querySelector(".chat-mail-cancel").addEventListener("click", function () {
      leadCard.remove(); leadCard = null; setLead("skipped"); input.focus();
    });
    leadCard.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = li.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email)) { li.focus(); return; }
      var btn = leadCard.querySelector(".chat-mail-send");
      btn.disabled = true;
      sendTranscript(email, leadCard).then(function () {
        setLead("sent");
        leadCard.remove(); leadCard = null;
        bubble("bot", CHAT_T.mailOk, "is-note");
      }).catch(function () {
        btn.disabled = false;
        bubble("bot", CHAT_T.mailFail, "is-note");
      });
    });
    logEl.appendChild(leadCard);
    logEl.scrollTop = logEl.scrollHeight;
  };

  var waiting = false;
  var ask = function (text) {
    text = String(text || "").trim();
    if (!text || waiting) return;
    waiting = true;
    chips.hidden = true;
    chatHistory.push({ role: "user", content: text.slice(0, 800) });
    saveChat();
    bubble("user", text);
    input.value = "";
    autosize();
    var typing = bubble("bot", "", "is-typing");
    typing.innerHTML = "<i></i><i></i><i></i>";
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ lang: EN ? "en" : "pt", messages: chatHistory })
    }).then(function (res) {
      return res.json().catch(function () { return {}; }).then(function (d) {
        if (res.status === 429) throw new Error("busy");
        if (!res.ok || !d.reply) throw new Error("fail");
        return d.reply;
      });
    }).then(function (reply) {
      typing.remove();
      var wantsEmail = /\[\[EMAIL\]\]/.test(reply);
      reply = reply.replace(/\s*\[\[EMAIL\]\]\s*/g, " ").trim();
      chatHistory.push({ role: "assistant", content: reply });
      saveChat();
      bubble("bot", reply);
      var answers = chatHistory.filter(function (m) { return m.role === "assistant"; }).length;
      if (wantsEmail || answers >= 2) offerLead();
    }).catch(function (e) {
      typing.remove();
      bubble("bot", e.message === "busy" ? CHAT_T.busy : CHAT_T.fail, "is-note");
    }).finally(function () { waiting = false; });
  };
  var autosize = function () { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; };
  input.addEventListener("input", autosize);
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
  chatForm.addEventListener("submit", function (e) { e.preventDefault(); ask(input.value); });

  // "Email this conversation": sent through the same email function as the forms
  $(".js-chat-mail").addEventListener("click", function () {
    mailForm.hidden = false;
    chatForm.hidden = true;
    $(".chat-mail-input").focus();
  });
  $(".chat-mail-cancel").addEventListener("click", function () { mailForm.hidden = true; chatForm.hidden = false; input.focus(); });
  mailForm.addEventListener("submit", function (e) {
    e.preventDefault();
    var email = $(".chat-mail-input").value.trim();
    if (!/^\S+@\S+\.\S+$/.test(email)) { $(".chat-mail-input").focus(); return; }
    $(".chat-mail-send").disabled = true;
    sendTranscript(email, mailForm).then(function () {
      setLead("sent");
      if (leadCard) { leadCard.remove(); leadCard = null; }
      mailForm.hidden = true;
      chatForm.hidden = false;
      bubble("bot", CHAT_T.mailOk, "is-note");
    }).catch(function () {
      bubble("bot", CHAT_T.mailFail, "is-note");
    }).finally(function () { $(".chat-mail-send").disabled = false; });
  });

  var chatIsOpen = false;
  var openChat = function () {
    if (!logEl.childNodes.length) renderChat();
    panel.hidden = false;
    requestAnimationFrame(function () { panel.classList.add("is-open"); });
    chatIsOpen = true;
    launcher.setAttribute("aria-expanded", "true");
    launcher.setAttribute("aria-label", CHAT_T.close);
    launcher.classList.add("is-active");
    setTimeout(function () { input.focus({ preventScroll: true }); logEl.scrollTop = logEl.scrollHeight; }, 50);
  };
  var closeChat = function () {
    panel.classList.remove("is-open");
    chatIsOpen = false;
    launcher.setAttribute("aria-expanded", "false");
    launcher.setAttribute("aria-label", CHAT_T.open);
    launcher.classList.remove("is-active");
    setTimeout(function () { if (!chatIsOpen) panel.hidden = true; }, 300);
  };
  launcher.addEventListener("click", function () { if (chatIsOpen) closeChat(); else openChat(); });
  $(".chat-close").addEventListener("click", function () { closeChat(); launcher.focus(); });
  panel.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeChat(); launcher.focus(); } });
  document.body.appendChild(panel);
  document.body.appendChild(launcher);

  // Keep the button out of the way while it would sit on top of the hero
  // animation, and give it a light outline over black sections
  var heroVisual = document.querySelector(".hero-visual");
  var darkZones = document.querySelectorAll('[data-nav="dark"]');
  var chatTick = false;
  var placeLauncher = function () {
    chatTick = false;
    var l = launcher.getBoundingClientRect();
    var cy = l.top + l.height / 2;
    var onDark = false;
    for (var z = 0; z < darkZones.length; z++) {
      var d = darkZones[z].getBoundingClientRect();
      if (cy > d.top && cy < d.bottom) { onDark = true; break; }
    }
    launcher.classList.toggle("on-dark", onDark);
    if (!heroVisual) return;
    var v = heroVisual.getBoundingClientRect();
    var overlaps = v.bottom > l.top - 24 && v.top < l.bottom + 24;
    launcher.classList.toggle("is-hidden", overlaps && !chatIsOpen);
  };
  window.addEventListener("scroll", function () { if (!chatTick) { chatTick = true; requestAnimationFrame(placeLauncher); } }, { passive: true });
  window.addEventListener("resize", placeLauncher);
  placeLauncher();
  })();

  // Buttons: on hover the label rolls up and a copy rolls in from below
  document.querySelectorAll(".button").forEach(function (btn) {
    var label = btn.textContent.trim();
    if (!label || btn.children.length) return;
    btn.textContent = "";
    var roll = document.createElement("span");
    roll.className = "btn-roll";
    var a = document.createElement("span");
    var b = document.createElement("span");
    a.textContent = b.textContent = label;
    b.setAttribute("aria-hidden", "true");
    roll.appendChild(a); roll.appendChild(b);
    btn.appendChild(roll);
  });

  // Image fade-on-load
  document.querySelectorAll("img.fade-on-load").forEach(function (img) {
    if (img.complete && img.naturalWidth) img.classList.add("loaded");
    else img.addEventListener("load", function () { img.classList.add("loaded"); });
  });

  // Fixed header: each side turns off-white while it sits over a dark area
  var header = document.querySelector(".header");
  if (header) {
    var navParts = [header.querySelector(".logo-container"), header.querySelector(".lang-switch"), header.querySelector(".nav-link-plain"), header.querySelector(".nav-cta-fixed"), header.querySelector(".nav-burger")].filter(Boolean);
    var darkAreas = document.querySelectorAll('[data-nav="dark"]');
    var hideAreas = document.querySelectorAll("[data-nav-hide]");
    // The strip steps aside over the footer (data-nav-hide) and the contact panel
    // (data-strip-hide), where the nav itself stays visible
    var stripHideAreas = document.querySelectorAll("[data-nav-hide], [data-strip-hide]");
    var stripHideFrom = document.querySelector("[data-strip-hide]");
    var navTicking = false;
    var over = function (areas, x, y) {
      for (var i = 0; i < areas.length; i++) {
        var a = areas[i].getBoundingClientRect();
        if (x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) return true;
      }
      return false;
    };
    var promoStrip = document.querySelector(".promo-strip");
    var curtain = document.querySelector(".hero-curtain");
    var curtainNav = document.querySelectorAll(".header .lang-switch");
    if (curtain) document.documentElement.classList.add("has-curtain");
    var curtainStart = 0;
    var measureCurtain = function () { if (curtain) curtainStart = curtain.getBoundingClientRect().top + window.scrollY; };
    measureCurtain();
    window.addEventListener("resize", measureCurtain);
    var updateNav = function () {
      navTicking = false;
      document.documentElement.classList.toggle("is-scrolled", window.scrollY > 4);
      // The strip slides away over the footer
      if (promoStrip) {
        // Inline strip (homepage): flag when it has reached the top (it then turns fixed).
        // Measured from the next section, whose top sits one strip below the strip's
        // place in the page whether the strip is in the flow or fixed
        if (document.documentElement.classList.contains("strip-inline")) {
          var stripNext = promoStrip.nextElementSibling;
          var stripAt = stripNext ? stripNext.getBoundingClientRect().top - promoStrip.offsetHeight : promoStrip.getBoundingClientRect().top;
          document.documentElement.classList.toggle("strip-stuck", window.scrollY > 0 && stripAt <= 1);
        }
        // Fixed probe point: the strip's own rect moves once it slides away.
        // It goes as soon as the contact panel (data-strip-hide) reaches the
        // strip's bottom edge, and stays away to the end of the page, so it
        // doesn't flash back in the gap before the footer
        var stripProbe = promoStrip.offsetHeight / 2;
        var stripAway = over(stripHideAreas, window.innerWidth / 2, stripProbe) ||
          (stripHideFrom && stripHideFrom.getBoundingClientRect().top <= promoStrip.offsetHeight);
        promoStrip.classList.toggle("is-away", stripAway);
        document.documentElement.classList.toggle("strip-away", stripAway);
        // Over a dark section the pill switches to its light version
        var stripRect = promoStrip.getBoundingClientRect();
        promoStrip.classList.toggle("is-on-dark", over(darkAreas, window.innerWidth / 2, stripRect.top + stripRect.height / 2));
      }
      navParts.forEach(function (part) {
        var r = part.getBoundingClientRect();
        var x = r.left + r.width / 2;
        var y = r.top + r.height / 2;
        part.classList.toggle("nav-on-dark", over(darkAreas, x, y));
        part.classList.toggle("nav-hidden", over(hideAreas, x, y));
      });
      // Homepage curtain: the language switch gets covered by the rising
      // curtain (clipped from the bottom) instead of fading out
      if (curtain) {
        var ct = curtain.getBoundingClientRect().top;
        curtainNav.forEach(function (el) {
          var r = el.getBoundingClientRect();
          var cut = Math.max(0, Math.min(r.height + 2, r.bottom - ct));
          el.style.clipPath = cut > 0 ? "inset(-2px -2px " + cut + "px -2px)" : "";
          el.style.visibility = cut >= r.height ? "hidden" : "";
        });
        // Widen the panel to full width as it travels up to the top
        var cp = Math.min(1, Math.max(0, window.scrollY / ((curtainStart || 1) * 0.5)));
        curtain.style.setProperty("--cp", cp.toFixed(3));
        var bandBottom = navParts[0] ? navParts[0].getBoundingClientRect().bottom + 40 : 0;
        document.documentElement.classList.toggle("hero-pinned", ct > bandBottom);
      }
      // The scroll backdrop goes away with the nav over the contact area
      var logoPart = navParts[0];
      if (logoPart) {
        document.documentElement.classList.toggle("nav-away", logoPart.classList.contains("nav-hidden"));
      }
    };
    var requestNav = function () {
      if (!navTicking) { navTicking = true; requestAnimationFrame(updateNav); }
    };
    window.addEventListener("scroll", requestNav, { passive: true });
    window.addEventListener("resize", requestNav);
    window.addEventListener("load", updateNav);
    updateNav();
  }

  // Article table of contents: highlight the section being read
  var tocLinks = document.querySelectorAll(".article-toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var byId = {};
    tocLinks.forEach(function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var tocIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        tocLinks.forEach(function (a) { a.classList.remove("is-active"); });
        byId[entry.target.id].classList.add("is-active");
      });
    }, { rootMargin: "0px 0px -70% 0px" });
    Object.keys(byId).forEach(function (id) {
      var h = document.getElementById(id);
      if (h) tocIo.observe(h);
    });
  }

  // Scroll reveal
  if ("IntersectionObserver" in window) {
    var targets = document.querySelectorAll(".plane-content, .section .grid, .program, .split-text, .footer-row");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px" });
    targets.forEach(function (el) {
      el.classList.add("js-animate");
      io.observe(el);
    });
  }

  // Hero flow: one visitor fills in the form, another chats with the bot → each time a streak runs down and the lead lands in the dashboard
  var visual = document.querySelector(".js-hero-visual");
  if (visual && visual.querySelector(".js-flow")) {
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var flow = visual.querySelector(".js-flow");
    var fields = {
      email: visual.querySelector(".js-fl-email"),
      msg: visual.querySelector(".js-fl-msg")
    };
    var list = visual.querySelector(".js-fl-list");
    var chatLog = visual.querySelector(".js-fl-chat-log");
    var unreadEl = visual.querySelector(".fl-unread");
    var todayEl = visual.querySelector(".js-fl-today");
    // Already-read mail sitting at the bottom of the inbox
    var OLD = EN ? [
      { i: "RL", c: 3, name: "Rachel Lewis", src: "Quote request", time: "Yesterday" },
      { i: "MF", c: 4, name: "Mark Fisher", src: "Flat renovation", time: "Mon" },
      { i: "JS", c: 5, name: "James Scott", src: "New home project", time: "Sun" },
      { i: "CD", c: 0, name: "Claire Davis", src: "Showroom visit", time: "Sun" }
    ] : [
      { i: "RL", c: 3, name: "Rita Lopes", src: "Pedido de orçamento", time: "Ontem" },
      { i: "MF", c: 4, name: "Marta Freitas", src: "Remodelação de apartamento", time: "Seg" },
      { i: "JS", c: 5, name: "João Santos", src: "Projeto de moradia", time: "Dom" },
      { i: "CD", c: 0, name: "Carlos Dias", src: "Visita ao showroom", time: "Dom" }
    ];
    // Leads alternate form → chat and keep rotating, so the story never stops
    var FORM_LEADS = EN ? [
      { i: "AR", c: 0, name: "Anna Reed", email: "anna.reed@gmail.com", msg: "Hi! I'd like to know more about kitchen renovations. My space is small, what solutions would work?" },
      { i: "SC", c: 1, name: "Sophie Carter", email: "sophie.carter@outlook.com", msg: "Good morning, I'm thinking of extending my parents' house. Could we book a visit to assess the project?" },
      { i: "IA", c: 4, name: "Isla Allen", email: "isla.allen@gmail.com", msg: "Hello, I'm opening a new shop in the city centre and need help with the interior design. Can you help?" }
    ] : [
      { i: "AR", c: 0, name: "Ana Ribeiro", email: "ana.ribeiro@gmail.com", msg: "Olá! Gostava de saber mais sobre remodelação de cozinha. Tenho um espaço pequeno, que soluções fazem sentido?" },
      { i: "SC", c: 1, name: "Sofia Costa", email: "sofia.costa@sapo.pt", msg: "Bom dia, estou a pensar ampliar a moradia dos meus pais. Podemos agendar uma visita para avaliar o projeto?" },
      { i: "IA", c: 4, name: "Inês Alves", email: "ines.alves@gmail.com", msg: "Olá, vou abrir uma loja nova no centro e preciso de ajuda com o projeto de interiores. Podem ajudar?" }
    ];
    var CHAT_LEADS = EN ? [
      { i: "PM", c: 2, name: "Peter Mills", src: "Via chat · Quote for a house",
        chat: [["me", "Hi! I'd like a quote for a house. peter@mills.co"], ["bot", "Thanks, Peter! We'll reply today."]] },
      { i: "TR", c: 5, name: "Tom Reynolds", src: "Via chat · Office renovation",
        chat: [["me", "Morning! Do you renovate offices? tom@reynolds.co"], ["bot", "We do! Thanks, Tom. Talk soon."]] },
      { i: "BG", c: 3, name: "Beth Green", src: "Via chat · Holiday home",
        chat: [["me", "Hi! I have a holiday home to design. beth.g@gmail.com"], ["bot", "Lovely, Beth! We'll reply today."]] }
    ] : [
      { i: "PM", c: 2, name: "Pedro Martins", src: "Via chat · Orçamento para moradia",
        chat: [["me", "Olá! Queria um orçamento para uma moradia. pedro@martins.pt"], ["bot", "Obrigado, Pedro! Respondemos ainda hoje."]] },
      { i: "TR", c: 5, name: "Tiago Reis", src: "Via chat · Remodelação de escritório",
        chat: [["me", "Bom dia! Remodelam escritórios? tiago@reis.pt"], ["bot", "Sim! Obrigado, Tiago. Falamos já hoje."]] },
      { i: "BG", c: 3, name: "Beatriz Gomes", src: "Via chat · Casa de férias",
        chat: [["me", "Olá! Tenho uma casa de férias para projetar. beatriz.g@gmail.com"], ["bot", "Que bom, Beatriz! Respondemos ainda hoje."]] }
    ];
    var LEADS = [FORM_LEADS[0], CHAT_LEADS[0]];
    var clock = 9 * 60 + 31; // lead times keep moving forward through the day
    function stamp(l) {
      l.time = String(Math.floor(clock / 60)).padStart(2, "0") + ":" + String(clock % 60).padStart(2, "0");
      clock += 7 + Math.floor(Math.random() * 12);
      if (clock > 18 * 60) clock = 9 * 60 + 5;
      return l;
    }
    var timers = [];
    // PACE < 1 plays the whole story faster (the streak CSS is tuned to match)
    var PACE = 0.72;
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms * PACE)); };
    var mobile = function () { return window.innerWidth < 560; };
    var maxRows = function () { return mobile() ? 3 : 4; };

    function row(l, unread) {
      var li = document.createElement("li");
      li.className = "fl-row" + (unread ? " is-fresh -unread" : "");
      li.innerHTML = '<div class="fl-row-in"><div class="fl-card"><span class="fl-av"></span><span class="fl-name"></span><span class="fl-time"></span><span class="fl-src"></span></div></div>';
      li.querySelector(".fl-av").textContent = l.i;
      li.querySelector(".fl-av").dataset.c = l.c;
      li.querySelector(".fl-name").textContent = l.name;
      li.querySelector(".fl-time").textContent = l.time;
      li.querySelector(".fl-src").textContent = l.src || l.msg;
      return li;
    }
    function land(l, n) {
      var li = row(l, true);
      li.classList.add("is-new");
      list.insertBefore(li, list.firstChild);
      li.offsetHeight;
      li.classList.remove("is-new");
      setTimeout(function () { li.classList.remove("is-fresh"); }, 1600);
      todayEl.textContent = n;
      unreadEl.classList.remove("is-bump"); unreadEl.offsetWidth; unreadEl.classList.add("is-bump");
      var rows = list.querySelectorAll(".fl-row:not(.is-out)");
      for (var k = maxRows(); k < rows.length; k++) {
        (function (old) { old.classList.add("is-out"); setTimeout(function () { old.remove(); }, 750); })(rows[k]);
      }
    }
    // The inbox keeps one fixed height for the whole loop
    function lockHeight() { if (!list.style.height) list.style.height = list.offsetHeight + "px"; }
    function fill(items, unread) {
      list.innerHTML = "";
      items.slice(0, maxRows()).forEach(function (l) { list.appendChild(row(l, unread)); });
    }
    function clearForm() {
      Object.keys(fields).forEach(function (k) { fields[k].textContent = ""; fields[k].parentNode.classList.remove("is-active"); });
    }
    function reset() {
      fill(OLD, false); // already read
      lockHeight();
      todayEl.textContent = "0";
      clearForm();
      flow.classList.remove("is-press", "is-send", "is-glow", "is-chat", "is-launch-press");
      chatLog.innerHTML = "";
    }
    function type(key, text, t0, speed) {
      at(t0, function () { fields[key].parentNode.classList.add("is-active"); });
      for (var c = 1; c <= text.length; c++) {
        (function (c) { at(t0 + c * speed, function () { fields[key].textContent = text.slice(0, c); }); })(c);
      }
      var end = t0 + text.length * speed + 100;
      at(end, function () { fields[key].parentNode.classList.remove("is-active"); });
      return end;
    }
    // One request: type email and message, send, streak runs down, pill appears, lands
    function lead(l, n, t0) {
      at(t0, clearForm);
      var t = type("email", l.email, t0 + 60, 24);
      t = type("msg", l.msg, t + 60, 9);
      at(t + 150, function () { flow.classList.add("is-press"); });
      at(t + 300, function () { flow.classList.remove("is-press"); });
      return send(l, n, t + 300, clearForm);
    }
    // Streak runs down, pill appears, the lead lands (~2s)
    function send(l, n, t, after) {
      at(t, function () { flow.classList.remove("is-send"); flow.offsetWidth; flow.classList.add("is-send"); });
      at(t + 300, function () { flow.classList.add("is-glow"); });
      at(t + 800, function () { land(l, n); });
      at(t + 900, after);
      at(t + 1400, function () { flow.classList.remove("is-glow"); });
      return t + 1400;
    }
    function bubble(who, text) {
      var li = document.createElement("li");
      li.className = "fl-msg -" + who;
      li.textContent = text;
      chatLog.appendChild(li);
      while (chatLog.children.length > (mobile() ? 2 : 4)) chatLog.removeChild(chatLog.firstChild);
      return li;
    }
    function typingDots() {
      var li = document.createElement("li");
      li.className = "fl-msg -bot fl-typing";
      li.innerHTML = "<i></i><i></i><i></i>";
      chatLog.appendChild(li);
      while (chatLog.children.length > (mobile() ? 2 : 4)) chatLog.removeChild(chatLog.firstChild);
      return li;
    }
    // One chat: open the widget, bot and visitor talk, the lead lands, the widget closes
    function chatLead(l, n, t0) {
      at(t0, function () { flow.classList.add("is-launch-press"); });
      at(t0 + 150, function () { flow.classList.remove("is-launch-press"); flow.classList.add("is-chat"); });
      var t = t0 + 550;
      l.chat.forEach(function (m) {
        if (m[0] === "bot") {
          var dots;
          at(t, function () { dots = typingDots(); });
          t += 380;
          at(t, function () { dots.remove(); bubble("bot", m[1]); });
          t += 450;
        } else {
          at(t, function () { bubble("me", m[1]); });
          t += 550;
        }
      });
      return send(l, n, t, function () {}) + 400;
    }
    var round = 0, arrived = 0;
    function cycle() {
      timers.forEach(clearTimeout); timers = [];
      reset();
      round = 0; arrived = 0; clock = 9 * 60 + 31;
      step(400);
    }
    // One round = a form lead then a chat lead; the next round starts straight after
    function step(t) {
      var f = stamp(Object.assign({}, FORM_LEADS[round % FORM_LEADS.length]));
      var c = stamp(Object.assign({}, CHAT_LEADS[round % CHAT_LEADS.length]));
      t = lead(f, ++arrived, t) + 500;
      t = chatLead(c, ++arrived, t);
      at(t, function () { flow.classList.remove("is-chat"); });
      at(t + 500, function () { chatLog.innerHTML = ""; });
      round++;
      // After a few rounds, reset the counters softly so the numbers stay believable
      if (round % 4 === 0) {
        at(t + 900, function () { flow.classList.add("is-restart"); });
        at(t + 1500, function () { cycle(); flow.classList.remove("is-restart"); });
      } else {
        at(t + 700, function () { step(0); });
      }
    }
    function showFinal() {
      timers.forEach(clearTimeout); timers = [];
      reset();
      fill(LEADS.slice().reverse(), true);
      todayEl.textContent = LEADS.length;
    }

    window.addEventListener("resize", function () { list.style.height = ""; });
    requestAnimationFrame(function () { requestAnimationFrame(function () { visual.classList.add("is-ready"); }); });
    if (reduce) {
      showFinal();
    } else {
      reset();
      var running = false, started = false;
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) {
          running = true;
          // First time: wait until the panel has faded in, so nobody misses the start
          var wait = started ? 0 : (parseInt(getComputedStyle(visual).getPropertyValue("--reveal-delay"), 10) || 0) + 300;
          started = true;
          timers.push(setTimeout(cycle, wait));
        }
        if (!visible && running) { running = false; showFinal(); }
      }).observe(visual);
    }
  }

  // Hero field: carry the site link into the free-redesign form, then ask for the email
  var heroForm = document.querySelector(".js-hero-form");
  var freeForm = document.querySelector("#free .js-form");
  if (heroForm && freeForm) {
    heroForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var url = heroForm.elements.URL.value.trim();
      if (url) freeForm.elements.URL.value = url;
      document.getElementById("free").scrollIntoView({ behavior: "smooth", block: "start" });
      setTimeout(function () {
        (url ? freeForm.elements.Email : freeForm.elements.URL).focus({ preventScroll: true });
      }, 600);
    });
  }

  // Popups: any [data-open-modal="id"] opens <dialog id="id" class="js-modal">
  document.querySelectorAll(".js-modal").forEach(function (modal) {
    if (typeof modal.showModal !== "function") return;
    var opener = null;
    var closeModal = function () { modal.close(); };
    var openModal = function (trigger) {
        opener = trigger;
        modal.showModal();
        document.body.classList.add("has-modal");
        modal.scrollTop = 0;
        var first = modal.querySelector("input:not([hidden])");
        if (first && first.offsetParent && !window.matchMedia("(pointer: coarse)").matches) first.focus({ preventScroll: true });
        else modal.focus({ preventScroll: true });
    };
    document.querySelectorAll('[data-open-modal="' + modal.id + '"]').forEach(function (trigger) {
      trigger.addEventListener("click", function (e) { e.preventDefault(); openModal(trigger); });
    });
    // Links from other pages (e.g. the diagnosis result) can open the free
    // redesign popup with #pedir-redesign
    if (modal.id === "free-modal" && location.hash === "#pedir-redesign") {
      history.replaceState(null, "", location.pathname + location.search);
      setTimeout(function () { openModal(null); }, 400);
    }
    modal.querySelectorAll(".js-close-modal").forEach(function (btn) { btn.addEventListener("click", closeModal); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener("close", function () {
      document.body.classList.remove("has-modal");
      if (opener) opener.focus();
    });
  });

  // Footer legal links: a dropdown on phones (always shown on desktop)
  var legalToggle = document.querySelector(".js-legal-toggle");
  if (legalToggle) {
    legalToggle.addEventListener("click", function () {
      var open = legalToggle.getAttribute("aria-expanded") !== "true";
      legalToggle.setAttribute("aria-expanded", String(open));
      legalToggle.parentNode.classList.toggle("is-open", open);
    });
  }

  // Lead-magnet strip: closing hides it until the top of the page (hero, or
  // the page head on blog/legal pages) leaves the viewport and comes back
  var promoClose = document.querySelector(".js-promo-close");
  var stripAnchor = document.querySelector(".hero, .blog-head");
  if (promoClose) {
    var rootEl = document.documentElement;
    var anchorLeft = false;
    var anchorVisible = true;
    promoClose.addEventListener("click", function () {
      rootEl.classList.add("strip-closed");
      // If the hero is already off screen, coming back to it is enough to reopen
      anchorLeft = !anchorVisible;
      if (typeof requestNav === "function") requestNav();
    });
    if (stripAnchor && "IntersectionObserver" in window) {
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        anchorVisible = visible;
        if (!visible) anchorLeft = true;
        else if (anchorLeft && rootEl.classList.contains("strip-closed")) {
          rootEl.classList.remove("strip-closed");
          anchorLeft = false;
          if (typeof requestNav === "function") requestNav();
        }
      }).observe(stripAnchor);
    }
  }

  // Section entrances: in each section the kicker, title and subtitle come
  // in first, one after the other, then the content follows in sequence
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var HEAD = ".kicker, .hero-title, .hero-statement, .pains-statement, .pains-sub, .impact-title, .impact-sub, .about-title, .tiers-intro, .tiers-sub, .faq-title, .cta-title, .cta-sub, .blog-title, .blog-intro, .filters-title";
    var BODY = ".hero-actions, .hero-visual, .pains-lead, .pains-row, .card, .about-grid > *, .tier, .faq-item, .testimonial-logos, .testimonial-top, .cta-main, .cta-write, .filters-search, .filters-chips, .post-card";
    // Scroll speed (px/ms): when flicking through the page, things appear at
    // once instead of waiting for their staggered turn
    var lastY = window.scrollY, lastT = performance.now(), speed = 0;
    window.addEventListener("scroll", function () {
      var now = performance.now();
      var v = Math.abs(window.scrollY - lastY) / Math.max(1, now - lastT);
      speed = speed * 0.6 + v * 0.4;
      lastY = window.scrollY; lastT = now;
    }, { passive: true });
    // The first view keeps its choreographed delays (title, then subtitle,
    // then content). Further down, things start as soon as they come into
    // view: only elements arriving together are staggered, a beat apart,
    // so content never waits for its turn while you scroll.
    var firstBatch = true;
    var revealIo = new IntersectionObserver(function (entries) {
      var fast = speed > 1.2;
      var arriving = entries.filter(function (e) { return e.isIntersecting; })
        .sort(function (a, b) { return a.boundingClientRect.top - b.boundingClientRect.top || a.boundingClientRect.left - b.boundingClientRect.left; });
      arriving.forEach(function (entry, k) {
        var el = entry.target;
        // Flicking fast, or already scrolled past it: show it right away
        if (fast || entry.boundingClientRect.top < 0) el.classList.add("reveal-fast");
        else if (!firstBatch) el.style.setProperty("--reveal-delay", Math.min(k, 5) * 70 + "ms");
        el.classList.add("is-in");
        revealIo.unobserve(el);
      });
      if (arriving.length) firstBatch = false;
    }, { rootMargin: "0px 0px -2% 0px" });
    // Big titles get their own entrance: each word rises out of a mask
    var TITLES = ".hero-title, .pains-statement, .impact-title, .about-title, .tiers-intro, .faq-title, .cta-title, .blog-title, .filters-title";
    var splitWords = function (el) {
      var n = 0;
      Array.prototype.slice.call(el.childNodes).forEach(function (node) {
        if (node.nodeType !== 3) return;
        var frag = document.createDocumentFragment();
        node.textContent.split(/(\s+)/).forEach(function (part) {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          var outer = document.createElement("span");
          var inner = document.createElement("span");
          outer.className = "tw";
          inner.className = "tw-in";
          inner.style.setProperty("--w", n++);
          inner.textContent = part;
          outer.appendChild(inner);
          frag.appendChild(outer);
        });
        node.parentNode.replaceChild(frag, node);
      });
    };
    var prep = function (el, delay) {
      if (el.classList.contains("js-animate") || el.classList.contains("reveal") || el.classList.contains("title-reveal")) return;
      if (el.matches(TITLES)) {
        splitWords(el);
        el.classList.add("title-reveal");
      } else {
        el.classList.add("reveal");
      }
      el.style.setProperty("--reveal-delay", delay + "ms");
      revealIo.observe(el);
    };
    document.querySelectorAll("main > section, main > .blog-head, main .blog-filters, main .post-list").forEach(function (section) {
      var heads = section.querySelectorAll(HEAD);
      var t = 0;
      heads.forEach(function (el) {
        prep(el, t);
        // The subtitle follows once most of the title's words are on their way up
        t += el.classList.contains("title-reveal") ? 220 + el.querySelectorAll(".tw").length * 35 : 90;
      });
      var start = t + 40;
      section.querySelectorAll(BODY).forEach(function (el, i) { prep(el, start + Math.min(i, 6) * 70); });
    });
    // Settle the hidden starting state now, so elements already on screen at
    // load still animate in instead of appearing at once
    void document.body.offsetHeight;
  }

  // Mobile menu
  var mobileMenu = document.querySelector(".js-mobile-menu");
  var menuOpen = document.querySelector(".js-menu-open");
  if (mobileMenu && menuOpen) {
    var setPageInert = function (on) {
      Array.prototype.forEach.call(document.body.children, function (el) {
        if (el !== mobileMenu && el.tagName !== "SCRIPT" && el.tagName !== "DIALOG") el.inert = on;
      });
    };
    var closeMenu = function (restoreFocus) {
      setPageInert(false);
      mobileMenu.classList.remove("is-open");
      menuOpen.setAttribute("aria-expanded", "false");
      document.body.classList.remove("has-modal");
      setTimeout(function () { mobileMenu.hidden = true; }, 300);
      if (restoreFocus) menuOpen.focus();
    };
    menuOpen.addEventListener("click", function () {
      mobileMenu.hidden = false;
      setPageInert(true);
      requestAnimationFrame(function () { mobileMenu.classList.add("is-open"); });
      menuOpen.setAttribute("aria-expanded", "true");
      document.body.classList.add("has-modal");
      mobileMenu.querySelector(".js-menu-close").focus();
    });
    mobileMenu.querySelector(".js-menu-close").addEventListener("click", function () { closeMenu(true); });
    mobileMenu.querySelectorAll(".js-menu-link").forEach(function (a) {
      a.addEventListener("click", function () { closeMenu(false); });
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && !mobileMenu.hidden) closeMenu(true);
    });
  }

  // Blog: filter by topic chips + free-text search. Several topics can be on
  // at once; a post shows only if it has every selected topic
  var postList = document.querySelector(".js-post-list");
  if (postList) {
    var chips = Array.prototype.slice.call(postList.querySelectorAll(".js-chip"));
    var postCards = Array.prototype.slice.call(postList.querySelectorAll(".js-post"));
    var searchBox = postList.querySelector(".js-post-search");
    var empty = postList.querySelector(".js-posts-empty");
    var selected = [];
    var norm = function (s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); };
    var applyFilter = function () {
      var q = norm(searchBox ? searchBox.value : "");
      var shown = 0;
      postCards.forEach(function (card) {
        var cats = (card.dataset.cats || "").split(" ");
        var ok = selected.every(function (c) { return cats.indexOf(c) !== -1; }) && (!q || card.dataset.text.indexOf(q) !== -1);
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    var paintChips = function () {
      chips.forEach(function (c) {
        var on = c.dataset.filter === "all" ? selected.length === 0 : selected.indexOf(c.dataset.filter) !== -1;
        c.classList.toggle("is-active", on);
        c.setAttribute("aria-pressed", on ? "true" : "false");
      });
    };
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        var f = chip.dataset.filter;
        // "All" clears the selection; any other topic toggles on and off
        if (f === "all") selected = [];
        else if (selected.indexOf(f) !== -1) selected = selected.filter(function (c) { return c !== f; });
        else selected.push(f);
        paintChips();
        applyFilter();
      });
    });
    if (searchBox) searchBox.addEventListener("input", applyFilter);
  }

  // "Se preferir, envie uma mensagem →" reveals the contact form in place
  document.querySelectorAll(".js-write-toggle").forEach(function (toggle) {
    var target = document.getElementById(toggle.getAttribute("aria-controls"));
    if (!target) return;
    toggle.addEventListener("click", function () {
      var open = target.hidden;
      target.hidden = !open;
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      if (open) {
        var first = target.querySelector("input, textarea");
        if (first) first.focus({ preventScroll: true });
      }
    });
  });

  // Contact form ("Prefere escrever?")
  // If the form relay is down, offer the visitor's own email app with the
  // message already written, so the enquiry isn't lost
  var mailFallback = function (msg, subject, body) {
    var href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    msg.textContent = EN ? "The form couldn't be sent right now. " : "Não foi possível enviar o formulário agora. ";
    var a = document.createElement("a");
    a.href = href;
    a.textContent = EN ? "Send it by email instead" : "Enviar por email";
    msg.appendChild(a);
    msg.appendChild(document.createTextNode(EN ? " (your message is already filled in)." : " (a sua mensagem já vai escrita)."));
    msg.classList.remove("is-success");
    msg.classList.add("is-error");
  };

  // Sent: the toggle and form fade out, the block eases to the height of a
  // short thank-you note, which then fades in where the form was
  // Smooth content swap (form → thank-you): what leaves fades out, the block
  // then eases to its new height while what arrives fades in over it.
  // Inside a popup the popup is pinned in place, so it only grows or shrinks
  // at the bottom instead of re-centring on the screen.
  var smoothSwap = function (opts) {
    var box = opts.box, leaving = opts.leaving, change = opts.change, arriving = opts.arriving, focusEl = opts.focus;
    var inPlace = !!opts.inPlace;
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var dlg = box.closest("dialog") || (box.tagName === "DIALOG" ? box : null);
    if (dlg && !dlg.style.marginTop) {
      dlg.style.marginTop = dlg.getBoundingClientRect().top + "px";
      dlg.style.marginBottom = "auto";
      dlg.addEventListener("close", function () { dlg.style.marginTop = ""; dlg.style.marginBottom = ""; }, { once: true });
    }
    arriving.forEach(function (el) { el.classList.add("swap-in"); });
    var done = function () { if (focusEl) focusEl.focus({ preventScroll: true }); };
    if (reduce) {
      change();
      arriving.forEach(function (el) { el.classList.add("is-in"); });
      done();
      return;
    }
    leaving.forEach(function (el) { el.classList.add("swap-out"); });
    if (inPlace) {
      // Cross-fade: the new content takes the old one's place and size
      setTimeout(function () {
        change();
        requestAnimationFrame(function () { arriving.forEach(function (el) { el.classList.add("is-in"); }); });
        setTimeout(done, 700);
      }, 350);
      return;
    }
    setTimeout(function () {
      var h0 = box.offsetHeight;
      change();
      var h1 = box.offsetHeight;
      box.style.overflow = "hidden";
      box.style.height = h0 + "px";
      box.offsetHeight;
      box.style.transition = "height .9s cubic-bezier(.45, 0, .15, 1)";
      box.style.height = h1 + "px";
      setTimeout(function () { arriving.forEach(function (el) { el.classList.add("is-in"); }); }, 300);
      setTimeout(function () {
        box.style.height = "";
        box.style.overflow = "";
        box.style.transition = "";
        done();
      }, 950);
    }, 500);
  };

  // Contact form / free redesign popup: the form gives way to a short note.
  // Returns a function that puts the original content back.
  var thankYou = function (wrap, title, sub, again) {
    var original = Array.prototype.slice.call(wrap.children);
    var note = document.createElement("div");
    note.className = "cta-thanks";
    note.setAttribute("role", "status");
    note.setAttribute("tabindex", "-1");
    var t = document.createElement("p"); t.className = "cta-thanks-title"; t.textContent = title;
    var d = document.createElement("p"); d.className = "cta-thanks-sub"; d.textContent = sub;
    note.appendChild(t); note.appendChild(d);
    var clean = function () {
      original.forEach(function (el) { el.classList.remove("swap-out", "swap-in", "is-in"); });
    };
    var restore = function (animate) {
      if (!note.parentNode) return;
      if (!animate) { wrap.innerHTML = ""; original.forEach(function (el) { wrap.appendChild(el); }); clean(); return; }
      smoothSwap({
        box: wrap,
        leaving: [note],
        change: function () { wrap.innerHTML = ""; clean(); original.forEach(function (el) { wrap.appendChild(el); }); },
        arriving: original,
        focus: wrap.querySelector("input, textarea")
      });
    };
    if (again) {
      var link = document.createElement("button");
      link.type = "button";
      link.className = "cta-thanks-again";
      link.innerHTML = '<span class="ul"></span> <span class="arrow" aria-hidden="true">→</span>';
      link.querySelector(".ul").textContent = again;
      link.addEventListener("click", function () { if (again.onRestore) again.onRestore(); restore(true); });
      note.appendChild(link);
    }
    smoothSwap({
      box: wrap,
      leaving: original,
      change: function () { wrap.innerHTML = ""; wrap.appendChild(note); },
      arriving: [note],
      focus: note
    });
    return restore;
  };

  document.querySelectorAll(".js-contact-form").forEach(function (form) {
    var msg = form.querySelector(".js-form-message");
    var show = function (text, ok) {
      msg.textContent = text;
      msg.classList.toggle("is-success", ok);
      msg.classList.toggle("is-error", !ok);
    };
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var name = form.elements.Nome.value.trim();
      var email = form.elements.Email.value.trim();
      var text = form.elements.Mensagem.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || !text) {
        show(EN ? "Please enter your email and a message." : "Por favor, preencha o email e a mensagem.", false);
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      var data = formData("Formulário: nova mensagem", email);
      data.append("Nome", name || "—");
      data.append("Email", email);
      data.append("Mensagem", text);
      data.append("Origem", "Formulário de contacto");
      data.append("Idioma", EN ? "EN" : "PT");
      submit(form, { type: "contact", name: name, email: email, message: text }, data)
        .then(function () {
          form.reset();
          msg.textContent = "";
          msg.classList.remove("is-success", "is-error");
          var againLabel = new String(EN ? "Send another message" : "Enviar outra mensagem");
          againLabel.onRestore = function () {
            form.hidden = false;
            var toggle = document.querySelector('.js-write-toggle[aria-controls="' + form.id + '"]');
            if (toggle) toggle.setAttribute("aria-expanded", "true");
          };
          thankYou(form.closest(".cta-write") || form,
            EN ? "Thank you for your message!" : "Obrigada pela mensagem!",
            EN ? "I'll be in touch soon." : "Entrarei em contacto brevemente.",
            againLabel);
        })
        .catch(function () {
          mailFallback(msg, (EN ? "Message from the website" : "Mensagem do site") + (name ? " — " + name : ""), text + "\n\n" + (name || "") + "\n" + email);
        })
        .finally(function () { button.disabled = false; });
    });
  });

  // Lead-magnet form: send the lead, then reveal the download. The guide is
  // handed over even if the relay fails, so the visitor never leaves empty-handed.
  document.querySelectorAll(".js-guide-form").forEach(function (form) {
    var msg = form.querySelector(".js-form-message");
    var success = form.parentNode.querySelector(".js-guide-success");
    // "I don't have a website yet": the link field steps aside
    var noSite = form.querySelector(".js-nosite");
    // The link field sits in a slot that folds away (its height eases to zero
    // while it fades), so everything below glides up instead of jumping
    var slot = form.querySelector(".url-slot");
    var syncNoSite = function (animate) {
      var on = !!(noSite && noSite.checked);
      var field = form.elements.URL;
      field.required = !on;
      field.disabled = on;
      if (on) field.value = "";
      if (!slot) { field.hidden = on; return; }
      var dlg = form.closest("dialog");
      if (animate && dlg && dlg.open && !dlg.style.marginTop) {
        // Pin the popup so it grows and shrinks at the bottom only
        dlg.style.marginTop = dlg.getBoundingClientRect().top + "px";
        dlg.style.marginBottom = "auto";
        dlg.addEventListener("close", function () { dlg.style.marginTop = ""; dlg.style.marginBottom = ""; }, { once: true });
      }
      slot.classList.toggle("no-anim", !animate);
      slot.classList.toggle("is-collapsed", on);
    };
    if (noSite) {
      Array.prototype.forEach.call(form.querySelectorAll('input[name="HasSite"]'), function (r) {
        r.addEventListener("change", function () { syncNoSite(true); });
      });
      form.addEventListener("reset", function () { setTimeout(function () { syncNoSite(false); }, 0); });
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.Email.value.trim();
      var hasNoSite = !!(noSite && noSite.checked);
      var url = hasNoSite ? "" : form.elements.URL.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || (!url && !hasNoSite)) {
        msg.textContent = EN ? "Please enter your email and your website link." : "Por favor, preencha o email e o link do site.";
        msg.classList.add("is-error");
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      var data = formData("Guia: novo download", email);
      data.append("Email", email);
      data.append("URL", hasNoSite ? "Ainda não tem site" : url);
      data.append("Origem", "Guia 8 sinais");
      data.append("Idioma", EN ? "EN" : "PT");
      var payload = { type: "guide", email: email, url: url, noSite: hasNoSite };
      var reveal = function () {
        var formHeight = form.offsetHeight;
        smoothSwap({
          box: form.closest("dialog") || form.parentNode,
          inPlace: true,
          leaving: Array.prototype.slice.call(form.children),
          // The note appears centred in the space the form had; then that space
          // eases closed around it, so the popup settles to its new size
          change: function () {
            success.style.minHeight = formHeight + "px";
            form.hidden = true;
            success.hidden = false;
            if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { success.style.minHeight = ""; return; }
            requestAnimationFrame(function () {
              success.style.minHeight = "0px";
              var natural = success.offsetHeight;
              success.style.minHeight = formHeight + "px";
              success.offsetHeight;
              success.style.transition = "min-height .7s cubic-bezier(.3, 0, .15, 1)";
              success.style.minHeight = natural + "px";
              setTimeout(function () { success.style.transition = ""; success.style.minHeight = ""; }, 750);
            });
          },
          arriving: Array.prototype.slice.call(success.children),
          focus: success.querySelector("a")
        });
        var guideDlg = form.closest("dialog");
        if (guideDlg) guideDlg.addEventListener("close", function () {
          form.reset();
          form.hidden = false;
          success.hidden = true;
          success.style.minHeight = "";
          Array.prototype.forEach.call(form.children, function (el) { el.classList.remove("swap-out"); });
          Array.prototype.forEach.call(success.children, function (el) { el.classList.remove("swap-in", "is-in"); });
        }, { once: true });
      };
      submit(form, payload, data)
        .then(reveal, reveal)
        .finally(function () { button.disabled = false; });
    });
  });

  // Free redesign form
  document.querySelectorAll(".js-form").forEach(function (form) {
    var msg = form.querySelector(".js-form-message");
    function show(text, ok) {
      msg.textContent = text;
      msg.classList.toggle("is-success", ok);
      msg.classList.toggle("is-error", !ok);
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.Email.value.trim();
      var url = form.elements.URL.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || !url) {
        show(EN ? "Please enter your email and your website link." : "Por favor, preencha o email e o link do site.", false);
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      var data = formData("Redesign: novo pedido", email);
      data.append("Email", email);
      data.append("URL", url);
      data.append("Origem", "Plano gratuito (pop-up)");
      data.append("Idioma", EN ? "EN" : "PT");
      submit(form, { type: "redesign", email: email, url: url }, data).then(function () {
        form.reset();
        msg.textContent = "";
        msg.classList.remove("is-success", "is-error");
        var restoreFree = thankYou(form,
          EN ? "Thank you!" : "Obrigada!",
          EN ? "You'll soon receive a personalised redesign proposal in your inbox." : "Em breve receberá uma proposta personalizada de redesign no seu email.");
        var freeDlg = form.closest("dialog");
        if (freeDlg) freeDlg.addEventListener("close", function () { restoreFree(false); }, { once: true });
      }).catch(function () {
        mailFallback(msg, EN ? "Free homepage redesign request" : "Pedido de redesign gratuito", (EN ? "Website: " : "Site: ") + url + "\n" + (EN ? "Email: " : "Email: ") + email);
      }).finally(function () {
        button.disabled = false;
      });
    });
  });

  // Testimonials: the client logos double as tabs; prev/next arrows (each
  // slide carries its own pair, only the active one is reachable)
  var testimonialSlides = document.querySelector(".js-testimonial-slides");
  if (testimonialSlides) {
    var slides = Array.prototype.slice.call(testimonialSlides.querySelectorAll(".testimonial-slide"));
    var logos = Array.prototype.slice.call(document.querySelectorAll(".js-testimonial-logos .testimonial-logo"));
    var current = 0;
    var mobileSlides = window.matchMedia("(max-width: 859px)");
    var show = function (index) {
      if (index === current) return;
      current = index;
      // Mobile: ease the block from the old testimonial's height to the new one's
      var h0 = testimonialSlides.offsetHeight;
      slides.forEach(function (slide, i) { slide.classList.toggle("is-active", i === index); });
      if (mobileSlides.matches) {
        var h1 = slides[index].offsetHeight;
        testimonialSlides.style.height = h0 + "px";
        testimonialSlides.offsetHeight;
        testimonialSlides.style.height = h1 + "px";
        setTimeout(function () { testimonialSlides.style.height = ""; }, 700);
      }
      logos.forEach(function (logo, i) {
        logo.classList.toggle("is-active", i === index);
        logo.setAttribute("aria-selected", i === index ? "true" : "false");
      });
    };
    logos.forEach(function (logo, i) { logo.addEventListener("click", function () { show(i); }); });
    // Mobile: after the arrows (which sit below a long quote) or a swipe, bring the
    // start of the new testimonial into view, just under the nav, so it can be read whole
    var toSlideTop = function () {
      if (!mobileSlides.matches) return;
      var hd = document.querySelector(".header");
      var offset = (hd ? Math.max(0, hd.getBoundingClientRect().bottom) : 0) + 16;
      var top = testimonialSlides.getBoundingClientRect().top;
      if (top < offset) window.scrollTo({ top: window.scrollY + top - offset, behavior: REDUCED ? "auto" : "smooth" });
    };
    var go = function (index) { show(index); toSlideTop(); };
    // Swipe left/right on touch screens
    var tx = null, ty = null;
    testimonialSlides.addEventListener("touchstart", function (e) {
      tx = e.touches[0].clientX; ty = e.touches[0].clientY;
    }, { passive: true });
    testimonialSlides.addEventListener("touchend", function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      tx = null;
      if (Math.abs(dx) < 50 || Math.abs(dx) < Math.abs(dy) * 1.5) return;
      go(dx < 0 ? (current + 1) % slides.length : (current - 1 + slides.length) % slides.length);
    }, { passive: true });
    document.querySelectorAll(".js-testimonial-prev").forEach(function (btn) {
      btn.addEventListener("click", function () { go((current - 1 + slides.length) % slides.length); });
    });
    document.querySelectorAll(".js-testimonial-next").forEach(function (btn) {
      btn.addEventListener("click", function () { go((current + 1) % slides.length); });
    });
  }
})();
