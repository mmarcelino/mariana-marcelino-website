(function () {
  // Where the free-redesign form is sent. Paste a Formspree / Basin / Getform
  // endpoint here (e.g. "https://formspree.io/f/xxxxxx"). While it's empty,
  // the form opens the visitor's email app addressed to FALLBACK_EMAIL.
  var FORM_ENDPOINT = "";
  var FALLBACK_EMAIL = "info@mariana-marcelino.com";

  // Image fade-on-load
  document.querySelectorAll("img.fade-on-load").forEach(function (img) {
    if (img.complete && img.naturalWidth) img.classList.add("loaded");
    else img.addEventListener("load", function () { img.classList.add("loaded"); });
  });

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
    var countEl = visual.querySelector(".js-fl-count");
    var todayEl = visual.querySelector(".js-fl-today");
    var BASE = 18;
    var OLD = [
      { i: "RL", c: 3, name: "Rita Lopes", src: "Pedido de orçamento", time: "Ontem" },
      { i: "MF", c: 4, name: "Marta Freitas", src: "Remodelação de apartamento", time: "Seg" },
      { i: "JS", c: 5, name: "João Santos", src: "Projeto de moradia", time: "Dom" }
    ];
    var FORM_LEAD = { i: "AR", c: 0, name: "Ana Ribeiro", email: "ana.ribeiro@gmail.com", msg: "Remodelação de cozinha", time: "09:31" };
    var CHAT_LEAD = {
      i: "PM", c: 2, name: "Pedro Martins", src: "Via chat · Orçamento para moradia", time: "09:48",
      // Two messages only, so the eye moves on to the dashboard quickly
      chat: [
        ["me", "Olá! Queria um orçamento para uma moradia. pedro@martins.pt"],
        ["bot", "Obrigado, Pedro! Respondemos ainda hoje."]
      ]
    };
    var LEADS = [FORM_LEAD, CHAT_LEAD];
    var timers = [];
    var at = function (ms, fn) { timers.push(setTimeout(fn, ms)); };
    var mobile = function () { return window.innerWidth < 560; };
    var maxRows = function () { return mobile() ? 2 : 3; };

    function row(l, fresh) {
      var li = document.createElement("li");
      li.className = "fl-row" + (fresh ? " is-fresh" : "");
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
      countEl.textContent = BASE + n;
      todayEl.textContent = n;
      countEl.classList.remove("is-bump"); countEl.offsetWidth; countEl.classList.add("is-bump");
      var rows = list.querySelectorAll(".fl-row:not(.is-out)");
      for (var k = maxRows(); k < rows.length; k++) {
        (function (old) { old.classList.add("is-out"); setTimeout(function () { old.remove(); }, 750); })(rows[k]);
      }
    }
    // The dashboard keeps one fixed height for the whole loop
    function lockHeight() { if (!list.style.height) list.style.height = list.offsetHeight + "px"; }
    function fill(items) {
      list.innerHTML = "";
      items.slice(0, maxRows()).forEach(function (l) { list.appendChild(row(l)); });
    }
    function clearForm() {
      Object.keys(fields).forEach(function (k) { fields[k].textContent = ""; fields[k].parentNode.classList.remove("is-active"); });
    }
    function reset() {
      fill(OLD);
      lockHeight();
      countEl.textContent = BASE;
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
      var end = t0 + text.length * speed + 150;
      at(end, function () { fields[key].parentNode.classList.remove("is-active"); });
      return end;
    }
    // One request: type email and message, send, streak runs down, pill appears, lands
    function lead(l, n, t0) {
      at(t0, clearForm);
      var t = type("email", l.email, t0 + 100, 40);
      t = type("msg", l.msg, t + 100, 38);
      at(t + 250, function () { flow.classList.add("is-press"); });
      at(t + 430, function () { flow.classList.remove("is-press"); });
      return send(l, n, t + 430, clearForm);
    }
    // Streak runs down, pill appears, the lead lands (~2s)
    function send(l, n, t, after) {
      at(t, function () { flow.classList.remove("is-send"); flow.offsetWidth; flow.classList.add("is-send"); });
      at(t + 420, function () { flow.classList.add("is-glow"); });
      at(t + 1120, function () { land(l, n); });
      at(t + 1270, after);
      at(t + 1970, function () { flow.classList.remove("is-glow"); });
      return t + 1970;
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
      at(t0 + 180, function () { flow.classList.remove("is-launch-press"); flow.classList.add("is-chat"); });
      var t = t0 + 800;
      l.chat.forEach(function (m) {
        if (m[0] === "bot") {
          var dots;
          at(t, function () { dots = typingDots(); });
          t += 500;
          at(t, function () { dots.remove(); bubble("bot", m[1]); });
          t += 600;
        } else {
          at(t, function () { bubble("me", m[1]); });
          t += 700;
        }
      });
      return send(l, n, t, function () {}) + 400;
    }
    function cycle() {
      timers.forEach(clearTimeout); timers = [];
      reset();
      var t = 900;
      t = lead(FORM_LEAD, 1, t) + 900;
      t = chatLead(CHAT_LEAD, 2, t);
      at(t, function () { flow.classList.remove("is-chat"); });
      at(t + 800, function () { chatLog.innerHTML = ""; });
      // Restart softly: fade the dashboard's contents out, reset them unseen, fade back in
      at(t + 3500, function () { flow.classList.add("is-restart"); });
      at(t + 4100, function () { cycle(); flow.classList.remove("is-restart"); });
    }
    function showFinal() {
      timers.forEach(clearTimeout); timers = [];
      reset();
      fill(LEADS.slice().reverse());
      countEl.textContent = BASE + LEADS.length;
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
        show("Por favor, preencha o email e o link do site.", false);
        return;
      }
      if (!FORM_ENDPOINT) {
        var body = "Email: " + email + "\nSite: " + url;
        window.location.href = "mailto:" + FALLBACK_EMAIL +
          "?subject=" + encodeURIComponent("Redesign gratuito") +
          "&body=" + encodeURIComponent(body);
        return;
      }
      var button = form.querySelector("button[type=submit]");
      button.disabled = true;
      fetch(FORM_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ Email: email, URL: url })
      }).then(function (res) {
        if (!res.ok) throw new Error(res.status);
        form.reset();
        show("Obrigada! Receberá a proposta por email.", true);
      }).catch(function () {
        show("Ocorreu um erro. Tente novamente ou escreva para " + FALLBACK_EMAIL + ".", false);
      }).finally(function () {
        button.disabled = false;
      });
    });
  });
})();
