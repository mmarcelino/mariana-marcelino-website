(function () {
  // Free-redesign requests are relayed to CONTACT_EMAIL by FormSubmit. The very
  // first submission triggers a one-off activation email that must be confirmed.
  var CONTACT_EMAIL = "info@mariana-marcelino.com";
  var FORM_ENDPOINT = "https://formsubmit.co/ajax/" + CONTACT_EMAIL;
  var EN = /^en/i.test(document.documentElement.lang);

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
    var navTicking = false;
    var over = function (areas, x, y) {
      for (var i = 0; i < areas.length; i++) {
        var a = areas[i].getBoundingClientRect();
        if (x >= a.left && x <= a.right && y >= a.top && y <= a.bottom) return true;
      }
      return false;
    };
    var promoStrip = document.querySelector(".promo-strip");
    var updateNav = function () {
      navTicking = false;
      document.documentElement.classList.toggle("is-scrolled", window.scrollY > 4);
      // The strip slides away over the contact section and footer, like the nav
      if (promoStrip) {
        // Inline strip (homepage): flag when it has reached the top and stuck there
        if (document.documentElement.classList.contains("strip-inline")) {
          document.documentElement.classList.toggle("strip-stuck", window.scrollY > 0 && promoStrip.getBoundingClientRect().top <= 1);
        }
        // Fixed probe point: the strip's own rect moves once it slides away
        promoStrip.classList.toggle("is-away", over(hideAreas, window.innerWidth / 2, promoStrip.offsetHeight / 2));
      }
      // Once scrolled, the nav sits on a near-opaque band in the colour of the
      // section underneath (read at the page edge); its text follows that band
      var scrolled = window.scrollY > 4;
      var bandDark = null;
      if (scrolled && navParts[0]) {
        var lr = navParts[0].getBoundingClientRect();
        var probe = document.elementsFromPoint(2, lr.top + lr.height / 2);
        for (var i = 0; i < probe.length; i++) {
          var el = probe[i];
          if (el.closest(".header, .promo-strip, .mobile-menu")) continue;
          var m = getComputedStyle(el).backgroundColor.match(/[\d.]+/g);
          if (m && (m.length < 4 || parseFloat(m[3]) > 0.5)) {
            document.documentElement.style.setProperty("--nav-bg", "rgba(" + m[0] + "," + m[1] + "," + m[2] + ",.85)");
            bandDark = (0.299 * m[0] + 0.587 * m[1] + 0.114 * m[2]) < 128;
            break;
          }
        }
      }
      navParts.forEach(function (part) {
        var r = part.getBoundingClientRect();
        var x = r.left + r.width / 2;
        var y = r.top + r.height / 2;
        part.classList.toggle("nav-on-dark", bandDark === null ? over(darkAreas, x, y) : bandDark);
        part.classList.toggle("nav-hidden", over(hideAreas, x, y));
      });
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
  if (visual) {
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
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
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
      var running = false;
      new IntersectionObserver(function (entries) {
        var visible = entries[0].isIntersecting;
        if (visible && !running) { running = true; cycle(); }
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
    document.querySelectorAll('[data-open-modal="' + modal.id + '"]').forEach(function (trigger) {
      trigger.addEventListener("click", function (e) {
        e.preventDefault();
        opener = trigger;
        modal.showModal();
        document.body.classList.add("has-modal");
        var first = modal.querySelector("input:not([hidden])");
        if (first && first.offsetParent) first.focus();
      });
    });
    modal.querySelectorAll(".js-close-modal").forEach(function (btn) { btn.addEventListener("click", closeModal); });
    modal.addEventListener("click", function (e) { if (e.target === modal) closeModal(); });
    modal.addEventListener("close", function () {
      document.body.classList.remove("has-modal");
      if (opener) opener.focus();
    });
  });

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

  // Mobile menu
  var mobileMenu = document.querySelector(".js-mobile-menu");
  var menuOpen = document.querySelector(".js-menu-open");
  if (mobileMenu && menuOpen) {
    var closeMenu = function (restoreFocus) {
      mobileMenu.classList.remove("is-open");
      menuOpen.setAttribute("aria-expanded", "false");
      document.body.classList.remove("has-modal");
      setTimeout(function () { mobileMenu.hidden = true; }, 300);
      if (restoreFocus) menuOpen.focus();
    };
    menuOpen.addEventListener("click", function () {
      mobileMenu.hidden = false;
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

  // Blog: filter by topic chip + free-text search
  var postList = document.querySelector(".js-post-list");
  if (postList) {
    var chips = Array.prototype.slice.call(postList.querySelectorAll(".js-chip"));
    var postCards = Array.prototype.slice.call(postList.querySelectorAll(".js-post"));
    var searchBox = postList.querySelector(".js-post-search");
    var empty = postList.querySelector(".js-posts-empty");
    var activeCat = "all";
    var norm = function (s) { return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim(); };
    var applyFilter = function () {
      var q = norm(searchBox ? searchBox.value : "");
      var shown = 0;
      postCards.forEach(function (card) {
        var ok = (activeCat === "all" || card.dataset.cat === activeCat) && (!q || card.dataset.text.indexOf(q) !== -1);
        card.hidden = !ok;
        if (ok) shown++;
      });
      if (empty) empty.hidden = shown > 0;
    };
    chips.forEach(function (chip) {
      chip.addEventListener("click", function () {
        // Clicking the active topic again goes back to "all"
        activeCat = (chip.dataset.filter === activeCat && activeCat !== "all") ? "all" : chip.dataset.filter;
        chips.forEach(function (c) {
          var on = c.dataset.filter === activeCat;
          c.classList.toggle("is-active", on);
          c.setAttribute("aria-pressed", on ? "true" : "false");
        });
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
      var data = new FormData();
      data.append("Nome", name || "—");
      data.append("Email", email);
      data.append("Mensagem", text);
      data.append("Origem", "Formulário de contacto");
      data.append("Idioma", EN ? "EN" : "PT");
      data.append("_subject", "Nova mensagem do site — " + (name || email));
      data.append("_replyto", email);
      data.append("_template", "table");
      data.append("_captcha", "false");
      fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data })
        .then(function (res) {
          if (!res.ok) throw new Error(res.status);
          return res.json();
        })
        .then(function (d) {
          if (String(d.success) === "false" && !/activat/i.test(d.message || "")) throw new Error(d.message);
          form.reset();
          show(EN ? "Thanks for your message! I'll get back to you soon." : "Obrigada pela mensagem! Respondo em breve.", true);
        })
        .catch(function () {
          show((EN ? "Something went wrong. Please try again or write to " : "Ocorreu um erro. Tente novamente ou escreva para ") + CONTACT_EMAIL + ".", false);
        })
        .finally(function () { button.disabled = false; });
    });
  });

  // Lead-magnet form: send the lead, then reveal the download. The guide is
  // handed over even if the relay fails, so the visitor never leaves empty-handed.
  document.querySelectorAll(".js-guide-form").forEach(function (form) {
    var msg = form.querySelector(".js-form-message");
    var success = form.parentNode.querySelector(".js-guide-success");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var email = form.elements.Email.value.trim();
      var url = form.elements.URL.value.trim();
      if (!/^\S+@\S+\.\S+$/.test(email) || !url) {
        msg.textContent = EN ? "Please enter your email and your website link." : "Por favor, preencha o email e o link do site.";
        msg.classList.add("is-error");
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      var data = new FormData();
      data.append("Email", email);
      data.append("URL", url);
      data.append("Origem", "Guia 8 sinais (faixa)");
      data.append("Idioma", EN ? "EN" : "PT");
      data.append("_subject", "Novo download do guia — " + url);
      data.append("_replyto", email);
      data.append("_template", "table");
      data.append("_captcha", "false");
      var reveal = function () {
        form.hidden = true;
        success.hidden = false;
        var dl = success.querySelector("a");
        if (dl) dl.focus();
      };
      fetch(FORM_ENDPOINT, { method: "POST", headers: { Accept: "application/json" }, body: data })
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
      // FormData keeps this a "simple" CORS request (no preflight)
      var data = new FormData();
      data.append("Email", email);
      data.append("URL", url);
      data.append("Origem", "Plano gratuito (pop-up)");
      data.append("Idioma", EN ? "EN" : "PT");
      data.append("_subject", "Novo pedido de redesign gratuito — " + url);
      data.append("_replyto", email);
      data.append("_template", "table");
      data.append("_captcha", "false");
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: data
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        return res.json();
      }).then(function (data) {
        // FormSubmit answers 200 with success "false" on real failures; before activation it says so in `message`
        if (String(data.success) === "false" && !/activat/i.test(data.message || "")) throw new Error(data.message);
        form.reset();
        show(EN ? "Thank you! You'll receive the proposal by email." : "Obrigada! Receberá a proposta por email.", true);
      }).catch(function () {
        show((EN ? "Something went wrong. Please try again or write to " : "Ocorreu um erro. Tente novamente ou escreva para ") + CONTACT_EMAIL + ".", false);
      }).finally(function () {
        button.disabled = false;
      });
    });
  });

  // Testimonials: logos double as tabs; prev/next arrows and logo clicks
  // navigate manually (no auto-rotation).
  var testimonialLogos = document.querySelector(".js-testimonial-logos");
  var testimonialSlides = document.querySelector(".js-testimonial-slides");
  if (testimonialLogos && testimonialSlides) {
    var logos = Array.prototype.slice.call(testimonialLogos.querySelectorAll(".testimonial-logo"));
    var slides = Array.prototype.slice.call(testimonialSlides.querySelectorAll(".testimonial-slide"));
    var current = 0;

    function show(index) {
      current = index;
      logos.forEach(function (logo, i) {
        var active = i === index;
        logo.classList.toggle("is-active", active);
        logo.setAttribute("aria-selected", active ? "true" : "false");
      });
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
    }

    function prev() { show((current - 1 + slides.length) % slides.length); }
    function next() { show((current + 1) % slides.length); }

    logos.forEach(function (logo, i) {
      logo.addEventListener("click", function () { show(i); });
    });

    // Each slide carries its own prev/next pair (so the arrows sit right
    // after that slide's own content); only the active slide's pair is
    // reachable since inactive slides have pointer-events: none.
    document.querySelectorAll(".js-testimonial-prev").forEach(function (btn) {
      btn.addEventListener("click", prev);
    });
    document.querySelectorAll(".js-testimonial-next").forEach(function (btn) {
      btn.addEventListener("click", next);
    });
  }
})();
