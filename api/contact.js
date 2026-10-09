// Vercel serverless function: receives the site's forms, emails the enquiry
// to Mariana and sends the visitor a branded confirmation in PT or EN.
//
// Environment variables (Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  required. API key from resend.com
//   MAIL_FROM       optional. Default: "Mariana Marcelino <info@mariana-marcelino.com>"
//   MAIL_TO         optional. Where enquiries arrive. Default: info@mariana-marcelino.com
//
// Without RESEND_API_KEY the function answers 503 and the site falls back to
// Web3Forms, so the forms keep working while email sending is being set up.

const SITE = "https://www.mariana-marcelino.com";
const CALENDLY = "https://calendly.com/marianacmarcelino/30min";
// Light monochrome palette: black ink, neutral greys, baby-blue accent
const ACCENT = "#dee8eb";
const INK = "#0a0a0a";
const PAPER = "#f4f4f4";

const QUIZ = require("./quiz-data.js");
const evaluateQuiz = require("../assets/quiz-logic.js");

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const clip = (s, n) => String(s == null ? "" : s).trim().slice(0, n);
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

// ---------- Copy ----------
// Each email is a list of blocks: { p } paragraph, { ul } bullet list,
// { cta, href, secondary } button. PT and EN say the same thing.
const FREE_CALL = {
  pt: "Esta conversa é 100% gratuita e sem qualquer compromisso – serve apenas para alinharmos ideias e conversarmos sobre o seu projeto.",
  en: "This conversation is 100% free and comes with no commitment – it's simply a chance to align ideas and talk about your project."
};
const COPY = {
  pt: {
    contact: {
      subject: "Obrigada pela sua mensagem",
      eyebrow: "Mensagem recebida",
      hello: (n) => (n ? `Olá, ${n}!` : "Olá!"),
      blocks: [
        { p: "Obrigada pela mensagem, volto ao seu contacto muito em breve." },
        { p: "Se preferir avançar já para uma conversa direta, pode marcar uma chamada:" },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt },
        { p: "Se preferir esperar pelo email, respondo-lhe brevemente." }
      ],
      sign: "Até já,",
      recap: "A sua mensagem"
    },
    chat: {
      subject: "Recebi a sua conversa no chat",
      eyebrow: "Conversa recebida",
      hello: () => "Olá!",
      blocks: [
        { p: "Obrigada por ter deixado o seu email no chat do site. Recebi a conversa que teve com o assistente e vou dar-lhe seguimento pessoalmente." },
        { p: "Se quiser acrescentar alguma coisa entretanto, basta responder a este email." },
        { p: "Se preferir falar já, pode marcar uma chamada:" },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt }
      ],
      sign: "Até já,",
      recap: "A sua conversa",
      chat: { you: "Eu", bot: "Assistente" }
    },
    redesign: {
      subject: "Obrigada pelo pedido de redesign",
      eyebrow: "Redesign gratuito",
      hello: (n) => (n ? `Olá, ${n}!` : "Olá!"),
      blocks: [
        { p: "Obrigada pelo interesse em ver como posso ajudar a renovar o seu site. Já recebi o seu pedido e o próximo passo está do meu lado – vou analisar o site atual e nos próximos dias vou enviar-lhe:" },
        { ul: [
          "— Uma proposta visual de redesign para a sua nova homepage.",
          "— Um relatório com os principais pontos de melhoria (além do design) para ajudar a converter mais visitantes em clientes."
        ] },
        { p: "Se não quiser esperar pelo e-mail e preferir avançar já para uma conversa direta, pode marcar uma chamada:" },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt }
      ],
      recap: null
    },
    guide: {
      subject: "O seu guia: Oito sinais de que o seu site está a afastar clientes",
      eyebrow: "Guia gratuito",
      hello: (n) => (n ? `Olá, ${n},` : "Olá,"),
      blocks: [
        { p: "Como prometido, aqui tem o link para descarregar o guia: ", link: "Oito sinais de que o seu site está a afastar clientes", href: `${SITE}/assets/guia-8-sinais.pdf` },
        { p: "Identificar estes sinais é apenas o primeiro passo: o verdadeiro desafio é corrigi-los. Se preferir avançar mais rápido, pode marcar comigo uma breve chamada de 30 minutos." },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt },
        { p: "Ou, se preferir, comece por fazer a auditoria ao seu ritmo. Quando sentir que é altura de avançar, estarei por aqui para conversarmos." }
      ],
      sign: "Até já,",
      recap: null
    },
    sign: "Até breve,",
    name: "Mariana Marcelino",
    role: "Web Design · Automação · IA",
    fields: { Nome: "Nome", Email: "Email", Mensagem: "Mensagem", URL: "Site" },
    footer: "Recebeu este email porque enviou um formulário em mariana-marcelino.com."
  },
  en: {
    contact: {
      subject: "Thank you for your message",
      eyebrow: "Message received",
      hello: (n) => (n ? `Hi, ${n}!` : "Hi!"),
      blocks: [
        { p: "Thank you for your message, I'll get back to you very soon." },
        { p: "If you'd like to go straight to a conversation, you can book a call:" },
        { cta: "Book a call", href: CALENDLY },
        { p: FREE_CALL.en },
        { p: "If you'd rather wait for my email, I'll get back to you soon." }
      ],
      sign: "Talk soon,",
      recap: "Your message"
    },
    chat: {
      subject: "I've received your chat conversation",
      eyebrow: "Chat received",
      hello: () => "Hi!",
      blocks: [
        { p: "Thank you for leaving your email in the website chat. I've received your conversation with the assistant and I'll follow up personally." },
        { p: "If there's anything you'd like to add in the meantime, just reply to this email." },
        { p: "If you'd rather talk now, you can book a call:" },
        { cta: "Book a call", href: CALENDLY },
        { p: FREE_CALL.en }
      ],
      sign: "Talk soon,",
      recap: "Your conversation",
      chat: { you: "You", bot: "Assistant" }
    },
    redesign: {
      subject: "Thank you for your redesign request",
      eyebrow: "Free redesign",
      hello: (n) => (n ? `Hi, ${n}!` : "Hi!"),
      blocks: [
        { p: "Thank you for your interest in seeing how I can help you refresh your website. I've received your request and the next step is on me – I'll review your current website and, over the next few days, send you:" },
        { ul: [
          "— A visual redesign proposal for your new homepage.",
          "— A report with the main points for improvement (beyond design) to help you turn more visitors into clients."
        ] },
        { p: "If you'd rather not wait for my email and prefer to go straight to a conversation, you can book a call:" },
        { cta: "Book a call", href: CALENDLY },
        { p: FREE_CALL.en }
      ],
      recap: null
    },
    guide: {
      subject: "Your guide: Eight signs your website is driving clients away",
      eyebrow: "Free guide",
      hello: (n) => (n ? `Hi, ${n},` : "Hi,"),
      blocks: [
        { p: "As promised, here's the link to download the guide: ", link: "Eight signs your website is driving clients away", href: `${SITE}/assets/guide-8-signs.pdf` },
        { p: "Spotting these signs is only the first step: the real challenge is fixing them. If you'd like to move faster, I'd like to invite you to book a short 30-minute call with me." },
        { cta: "Book a call", href: CALENDLY },
        { p: FREE_CALL.en },
        { p: "Or, if you'd prefer, start by running the audit at your own pace. When you feel it's time to move forward, I'll be here to talk." }
      ],
      sign: "Talk soon,",
      recap: null
    },
    sign: "Speak soon,",
    name: "Mariana Marcelino",
    role: "Web Design · Automation · AI",
    fields: { Nome: "Name", Email: "Email", Mensagem: "Message", URL: "Website" },
    footer: "You received this email because you submitted a form on mariana-marcelino.com."
  }
};

// ---------- Diagnosis report (built from the answers, never from free text) ----------
function quizCopy(lang, q) {
  const D = QUIZ[lang], R = q.result, T = D.report, P = D.plans[R.plan];
  const abs = (h) => (h.startsWith("/") ? SITE + h : h);
  const blocks = [{ p: R.noSite ? T.introNoSite : !R.weakAll.length ? T.introGood : T.intro }];
  // No site: the intro already says it, so there's no result card
  if (!R.noSite) blocks.push({ scorecard: { score: R.score, label: D.ui.scoreLabel + (q.site ? " · " + q.site : ""), title: R.band.title, text: R.band.text } });
  if (!R.noSite && R.weakAll.length) {
    blocks.push({ label: T.weakTitle });
    R.weakAll.forEach((id, i) => blocks.push({ item: D.weak[id].title, n: i + 1, text: D.weak[id].line, todoLabel: T.doLabel.replace(/:\s*$/, ""), todo: D.weak[id].todo }));
  }
  // The email's button is always the call when the plan offers one
  const call = [P.cta, P.cta2].find((c) => /calendly\.com/.test(c.href));
  const cta = call || P.cta;
  blocks.push({ plan: {
    label: T.planTitle, name: P.name,
    text: (R.noSite && P.lineNoSite ? P.lineNoSite : P.line) + (R.alsoEngine && P.also ? " " + P.also : ""),
    cta: cta.t, href: abs(cta.href), note: call ? T.free : ""
  } });
  blocks.push(R.noSite
    ? { p: T.guideNoSite, link: T.guideLink, href: T.guideHref, after: T.guideAfterNoSite }
    : { p: T.guide, link: T.guideLink, href: T.guideHref });
  return {
    subject: R.noSite ? T.subjectNoSite : (q.site ? T.subjectSite.replace("{site}", q.site) : T.subject).replace("{score}", R.score).replace("{band}", R.band.title),
    eyebrow: lang === "en" ? "Website diagnosis" : "Diagnóstico do site",
    hello: () => (lang === "en" ? "Hi," : "Olá,"),
    blocks,
    recap: null
  };
}

// ---------- Chat transcript as message bubbles ----------
// The site sends the conversation as "Eu|You: …" / "Assistente|Assistant: …"
// turns separated by blank lines. Visitor on the right, assistant on the left.
// botBg: the assistant's bubble must contrast with what's behind it
function chatTurns(transcript, labels, botBg) {
  return String(transcript || "").split(/\n{2,}/).map((t) => {
    const m = t.match(/^(Eu|You|Assistente|Assistant):\s*([\s\S]*)$/);
    const mine = m && (m[1] === "Eu" || m[1] === "You");
    const body = esc(m ? m[2] : t).replace(/\n/g, "<br>");
    return `<tr><td align="${mine ? "right" : "left"}" style="padding:4px 0"><table role="presentation" cellpadding="0" cellspacing="0" style="max-width:85%"><tr><td style="padding:10px 14px;border-radius:14px;background:${mine ? ACCENT : botBg};font-size:14.5px;line-height:1.5;color:${INK};text-align:left">${m ? `<span style="display:block;margin-bottom:2px;font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${MUTED}">${esc(mine ? labels.you : labels.bot)}</span>` : ""}${body}</td></tr></table></td></tr>`;
  }).join("");
}

// ---------- Visitor email (on brand) ----------
// Quiet, editorial layout: light grey page, a white card, Inter-like system type
// with mono labels, a baby-blue pill naming the email, graphite pill buttons and
// the favicon's monogram as signature.
const MUTED = "#555555", BODY = "#222222", LINE = "#e5e5e5", TINT = "#f4f4f4", DEEP = "#555555";
const FONT = "'Inter Tight',Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif";
const MONO = "'JetBrains Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

function visitorEmail(type, lang, data) {
  const L = COPY[lang];
  const c = type === "quiz" ? quizCopy(lang, data.quiz) : L[type];
  const first = (data.Nome || "").split(/\s+/)[0];
  const home = `${SITE}${lang === "en" ? "/en/" : "/"}`;
  const P = (t, extra) => `<p style="margin:0 0 18px;font-size:16px;line-height:1.65;color:${BODY}${extra || ""}">${t}</p>`;
  const A = (t, href) => `<a href="${href}" style="color:${INK};font-weight:600;text-decoration:underline;text-underline-offset:3px">${esc(t)}</a>`;
  const button = (t, href) => `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 22px"><tr><td style="background:${INK};border-radius:999px"><a href="${href}" style="display:inline-block;padding:14px 28px;font-family:${FONT};font-size:15px;font-weight:500;letter-spacing:.01em;color:#ffffff;text-decoration:none">${esc(t)}</a></td></tr></table>`;
  const blockHtml = (b) => {
    if (b.scorecard) {
      const sc = b.scorecard;
      const num = sc.score == null ? "" : `<td width="112" valign="middle" style="padding-right:20px"><p style="margin:0;font-size:52px;line-height:1;font-weight:300;letter-spacing:-.04em;color:${INK}">${sc.score}<span style="font-size:15px;letter-spacing:0;color:${MUTED}">/100</span></p></td>`;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 26px;background:${TINT};border-radius:16px"><tr><td style="padding:24px 26px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${num}<td valign="middle">${sc.label ? `<p style="margin:0 0 4px;font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${MUTED}">${esc(sc.label)}</p>` : ""}<p style="margin:0;font-size:21px;line-height:1.25;letter-spacing:-.01em;color:${INK}">${esc(sc.title)}</p><p style="margin:6px 0 0;font-size:14.5px;line-height:1.55;color:${BODY}">${esc(sc.text)}</p></td></tr></table></td></tr></table>`;
    }
    if (b.plan) {
      const pl = b.plan;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 26px;background:${ACCENT};border-radius:16px"><tr><td style="padding:26px 28px 6px"><p style="margin:0 0 6px;font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:#444444">${esc(pl.label)}</p><p style="margin:0 0 8px;font-size:22px;line-height:1.25;letter-spacing:-.015em;color:${INK}">${esc(pl.name)}</p><p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${INK}">${esc(pl.text)}</p>${button(pl.cta, pl.href)}${pl.note ? `<p style="margin:-8px 0 20px;font-size:13px;line-height:1.55;color:#444444">${esc(pl.note)}</p>` : ""}</td></tr></table>`;
    }
    if (b.label) return `<p style="margin:8px 0 12px;font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${MUTED}">${esc(b.label)}</p>`;
    if (b.item) {
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;border-top:1px solid ${LINE}"><tr>${b.n ? `<td width="34" valign="top" style="padding:16px 0 18px;font-size:12px;line-height:22px;color:${MUTED};font-variant-numeric:tabular-nums">${String(b.n).padStart(2, "0")}</td>` : ""}<td valign="top" style="padding:16px 0 18px"><p style="margin:0;font-size:16px;line-height:22px;font-weight:600;color:${INK}">${esc(b.item)}</p><p style="margin:4px 0 0;font-size:15px;line-height:1.6;color:${BODY}">${esc(b.text)}</p>${b.todo ? `<p style="margin:10px 0 0;font-size:14.5px;line-height:1.6;color:${BODY}"><span style="font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${DEEP}">${esc(b.todoLabel)}</span><br>${esc(b.todo)}</p>` : ""}</td></tr></table>`;
    }
    if (b.p && b.link) return P(esc(b.p) + A(b.link, b.href) + esc(b.after || ""));
    if (b.p) return P(esc(b.p));
    if (b.link) return P(A(b.link, b.href));
    if (b.ul) return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 20px">${b.ul.map((li) => `<tr><td valign="top" width="22" style="padding:6px 0;font-size:16px;line-height:1.6;color:${DEEP}">—</td><td style="padding:6px 0;font-size:16px;line-height:1.6;color:${BODY}">${esc(li.replace(/^—\s*/, ""))}</td></tr>`).join("")}</table>`;
    if (b.cta) return button(b.cta, b.href);
    return "";
  };
  const recapRows = c.recap
    ? Object.keys(L.fields)
        .filter((k) => data[k] && k !== "Email")
        .map((k) => `<tr><td valign="top" style="padding:7px 18px 7px 0;font-family:${MONO};font-size:11.5px;line-height:22px;font-weight:400;letter-spacing:0;color:${MUTED};width:90px;white-space:nowrap">${esc(L.fields[k])}</td><td valign="top" style="padding:7px 0;font-size:15px;line-height:22px;color:${INK};white-space:pre-wrap">${esc(data[k])}</td></tr>`)
        .join("")
    : "";
  const recapBody = c.chat && data.Mensagem ? chatTurns(data.Mensagem, c.chat, "#ffffff") : recapRows;
  const recap = recapBody
    ? `<tr><td class="px" style="padding:0 44px 40px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f4;border-radius:14px"><tr><td style="padding:20px 22px"><p style="margin:0 0 8px;font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${MUTED}">${esc(c.recap)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${recapBody}</table></td></tr></table></td></tr>`
    : "";
  const html = `<!doctype html><html lang="${lang === "en" ? "en" : "pt-PT"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>@media (max-width:520px){.px{padding-left:24px!important;padding-right:24px!important}.nm,.eb{display:block!important;width:auto!important}.eb{text-align:left!important;padding-top:12px!important}}</style><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};color:${INK};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}"><tr><td align="center" style="padding:40px 14px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#ffffff;border:1px solid ${LINE};border-radius:16px">
<tr><td class="px" style="padding:26px 44px 22px;border-bottom:1px solid ${LINE}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td class="nm" valign="middle"><a href="${home}" style="display:block;font-size:19px;font-weight:500;letter-spacing:-.02em;line-height:1.1;white-space:nowrap;color:${INK};text-decoration:none">mariana marcelino</a><span style="display:block;margin-top:5px;font-family:${MONO};font-size:${lang === "en" ? "10.5px" : "10.9px"};line-height:1;white-space:nowrap;color:${MUTED}">${lang === "en" ? "Design — Automation — AI" : "Design — Automação — IA"}</span></td>
<td class="eb" valign="middle" align="right">${c.eyebrow ? `<span style="display:inline-block;padding:5px 10px;border-radius:999px;background:${ACCENT};font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;white-space:nowrap;color:${INK}">${esc(c.eyebrow)}</span>` : ""}</td>
</tr></table></td></tr>
<tr><td class="px" style="padding:36px 44px 8px">
<p style="margin:0 0 18px;font-size:17px;line-height:1.5;color:${INK}">${esc(c.hello(first))}</p>
${c.blocks.map(blockHtml).join("\n")}
</td></tr>
<tr><td class="px" style="padding:6px 44px 38px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE}"><tr><td style="padding-top:24px">
<p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:${BODY}">${esc(c.sign || L.sign)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" style="padding-right:14px"><div style="width:40px;height:40px;border-radius:9px;background:${INK};text-align:center;line-height:40px;font-size:18px;font-weight:400;color:${ACCENT}">M</div></td>
<td valign="middle"><p style="margin:0;font-size:15px;line-height:1.4;font-weight:600;color:${INK}">${esc(L.name)}</p><p style="margin:2px 0 0;font-size:13px;line-height:1.5;color:${MUTED}">${esc(L.role)} · <a href="${home}" style="color:${MUTED};text-decoration:underline;text-underline-offset:2px">mariana-marcelino.com</a></p></td>
</tr></table>
</td></tr></table></td></tr>
${recap}
</table>
<p style="max-width:520px;margin:20px auto 0;font-size:12px;line-height:1.6;color:#8a8a8a;text-align:center">${esc(L.footer)}</p>
</td></tr></table></body></html>`;
  const textBlocks = c.blocks.map((b) =>
    b.scorecard ? [b.scorecard.score != null ? `${b.scorecard.label}: ${b.scorecard.score}/100 · ${b.scorecard.title}` : b.scorecard.title, b.scorecard.text].join("\n")
    : b.plan ? [b.plan.label.toUpperCase(), b.plan.name, b.plan.text, `${b.plan.cta}: ${b.plan.href}`, b.plan.note].filter(Boolean).join("\n")
    : b.label ? b.label.toUpperCase()
    : b.item ? [(b.n ? String(b.n).padStart(2, "0") + " " : "") + b.item, b.text, b.todo ? `${b.todoLabel}: ${b.todo}` : ""].filter(Boolean).join("\n")
    : b.p && b.link ? `${b.p}${b.link} (${b.href})${b.after || ""}` : b.p ? b.p : b.ul ? b.ul.join("\n") : `${b.cta || b.link}: ${b.href}`);
  const text = [c.hello(first), "", ...textBlocks.flatMap((t) => [t, ""]), c.sign || L.sign, "", L.name, L.role, home,
    ...(c.chat && data.Mensagem ? ["", "———", c.recap + ":", "", data.Mensagem]
      : recapRows ? ["", "———", c.recap + ":", ...Object.keys(L.fields).filter((k) => data[k] && k !== "Email").map((k) => `${L.fields[k]}: ${data[k]}`)] : [])].join("\n");
  return { subject: c.subject, html, text };
}

// ---------- Notification to Mariana ----------
// Same look as the visitor emails, laid out to be read at a glance: who it is,
// quick actions, then the content (score and answers, message or chat).
const DOT = ["#5f9e7f", "#d49a3a", "#c4553f"]; // answer points: fine / could be better / problem
function notification(type, lang, data) {
  const label = { contact: "Formulário: nova mensagem", redesign: "Redesign: novo pedido", guide: "Guia: novo download", chat: "Chat: novo contacto", quiz: "Diagnóstico: novo resultado" }[type];
  const pill = { contact: "Formulário", redesign: "Redesign gratuito", guide: "Guia", chat: "Chat", quiz: "Diagnóstico" }[type];
  const site = data.URL && data.URL !== "Ainda não tem site" ? data.URL : "";
  const siteHref = site ? (/^https?:\/\//i.test(site) ? site : "https://" + site) : "";
  const R = data.quiz && data.quiz.result;
  const pt = QUIZ.pt;
  const detail = R ? [site || data.Email, R.noSite ? "sem site" : `${R.score}/100`, pt.plans[R.plan].name].join(" · ")
    : type === "redesign" ? site : data.Nome || data.Email;
  const subject = detail ? `${label} · ${detail}` : label;

  const cap = (t) => `<p style="margin:0 0 10px;font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${MUTED}">${esc(t)}</p>`;
  const lines = (t) => esc(t).replace(/\n/g, "<br>");
  const btn = (t, href, solid) => `<td style="padding:0 8px 8px 0"><a href="${esc(href)}" style="display:inline-block;padding:11px 20px;border-radius:999px;border:1px solid ${INK};background:${solid ? INK : "transparent"};font-size:14px;font-weight:500;color:${solid ? "#ffffff" : INK};text-decoration:none">${esc(t)}</a></td>`;
  const fact = (k, v) => `<tr><td valign="top" style="padding:6px 16px 6px 0;width:72px;font-family:${MONO};font-size:11.5px;line-height:20px;font-weight:400;letter-spacing:0;color:${MUTED};white-space:nowrap">${esc(k)}</td><td valign="top" style="padding:6px 0;font-size:15px;line-height:20px;color:${INK}">${v}</td></tr>`;

  const who = data.Nome || data.Email;
  const facts = [
    data.Nome ? fact("Email", `<a href="mailto:${esc(data.Email)}" style="color:${INK}">${esc(data.Email)}</a>`) : "",
    site ? fact("Site", `<a href="${esc(siteHref)}" style="color:${INK}">${esc(site)}</a>`) : data.URL ? fact("Site", esc(data.URL)) : "",
    fact("Idioma", lang === "en" ? "Inglês" : "Português")
  ].join("");
  const actions = `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:18px 0 4px"><tr>${btn("Responder", "mailto:" + data.Email, true)}${siteHref ? btn("Abrir site", siteHref) : ""}</tr></table>`;

  let content = "";
  if (R) {
    const answers = data.quiz.answers;
    const top = R.noSite
      ? `<p style="margin:0;font-size:21px;line-height:1.25;color:${INK}">Ainda não tem site</p><p style="margin:6px 0 0;font-size:14.5px;line-height:1.5;color:${BODY}">Começar do zero</p>`
      : `<table role="presentation" cellpadding="0" cellspacing="0"><tr><td valign="middle" style="padding-right:18px"><p style="margin:0;font-size:48px;line-height:1;font-weight:300;letter-spacing:-.04em;color:${INK}">${R.score}<span style="font-size:14px;letter-spacing:0;color:${MUTED}">/100</span></p></td><td valign="middle"><p style="margin:0;font-size:19px;line-height:1.25;color:${INK}">${esc(pt.bands.find((b) => R.score >= b.min).title)}</p></td></tr></table>`;
    const points = (id) => { const i = pt.questions.findIndex((q) => q.id === id); return pt.questions[i].options[answers[i]].p; };
    const goal = pt.questions[pt.questions.length - 1].options[answers[answers.length - 1]].t;
    const plan = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:18px;border-top:1px solid rgba(10,10,10,.1)"><tr><td style="padding-top:14px">${fact("Plano", `<b style="font-weight:600">${esc(pt.plans[R.plan].name)}</b>${R.alsoEngine ? " <span style=\"color:" + MUTED + "\">(+ nota Motor de Contactos)</span>" : ""}`)}${fact("Objetivo", esc(goal))}</td></tr></table>`;
    const weak = R.weakAll.length
      ? `<div style="margin:26px 0 0">${cap("Pontos a melhorar")}<p style="margin:0;line-height:2">${R.weakAll.map((id) => `<span style="display:inline-block;margin:0 6px 6px 0;padding:4px 12px;border-radius:999px;background:${points(id) === 2 ? "#f6dcd5" : "#f5e8cf"};font-size:13px;line-height:20px;color:${INK}">${esc(pt.weak[id].title)}</span>`).join("")}</p></div>`
      : "";
    const rows = pt.questions.map((q, i) => {
      if (answers[i] == null) return "";
      const o = q.options[answers[i]];
      const dot = q.cat ? DOT[o.p] : "#b5b5b5";
      return `<tr><td valign="top" width="20" style="padding:12px 0;border-top:1px solid ${LINE}"><div style="width:9px;height:9px;margin-top:5px;border-radius:50%;background:${dot}"></div></td><td valign="top" style="padding:12px 0;border-top:1px solid ${LINE}"><p style="margin:0;font-size:13px;line-height:1.45;color:${MUTED}">${esc(q.q)}</p><p style="margin:3px 0 0;font-size:15px;line-height:1.45;color:${INK}">${esc(o.t)}</p></td></tr>`;
    }).join("");
    const legend = `<p style="margin:10px 0 0;font-size:12px;color:${MUTED}">${[["Bem", 0], ["Pode melhorar", 1], ["Problema", 2]].map(([t, k]) => `<span style="display:inline-block;width:8px;height:8px;border-radius:50%;background:${DOT[k]};margin:0 5px 0 0"></span>${t}`).join("&nbsp;&nbsp;&nbsp;")}</p>`;
    content = `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:26px;background:${TINT};border-radius:16px"><tr><td style="padding:22px 24px">${cap(site ? "Saúde do site · " + site : "Resultado")}${top}${plan}</td></tr></table>${weak}<div style="margin:26px 0 0">${cap("Respostas")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>${legend}</div>`;
  } else if (type === "chat") {
    const turns = chatTurns(data.Mensagem, { you: "Visitante", bot: "Assistente" }, "#f1f1f1");
    content = `<div style="margin-top:26px">${cap("Conversa")}<table role="presentation" width="100%" cellpadding="0" cellspacing="0">${turns}</table></div>`;
  } else if (data.Mensagem) {
    content = `<div style="margin-top:26px">${cap("Mensagem")}<div style="padding:18px 20px;border-radius:14px;background:#f4f4f4;font-size:15.5px;line-height:1.6;color:${INK}">${lines(data.Mensagem)}</div></div>`;
  }

  const html = `<!doctype html><html lang="pt-PT"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>@media (max-width:520px){.px{padding-left:22px!important;padding-right:22px!important}}</style><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};color:${INK};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}"><tr><td align="center" style="padding:32px 12px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border:1px solid ${LINE};border-radius:16px">
<tr><td class="px" style="padding:30px 40px 34px">
<span style="display:inline-block;padding:5px 10px;border-radius:999px;background:${ACCENT};font-family:${MONO};font-size:11.5px;font-weight:400;letter-spacing:0;color:${INK}">${esc(pill)}</span>
<p style="margin:14px 0 10px;font-size:24px;line-height:1.2;letter-spacing:-.015em;color:${INK}">${esc(who)}</p>
<table role="presentation" cellpadding="0" cellspacing="0">${facts}</table>
${actions}
${content}
</td></tr></table>
<p style="margin:16px 0 0;font-size:12px;color:#8a8a8a">Responder a este email responde diretamente a ${esc(data.Email)}.</p>
</td></tr></table></body></html>`;
  const text = [label, "", ...[["Nome", data.Nome], ["Email", data.Email], ["Site", data.URL], ["Idioma", lang.toUpperCase()], ["Mensagem", data.Mensagem]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");
  return { subject, html, text };
}

async function send(key, msg) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify(msg)
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text()}`);
  return res.json();
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }
  const key = process.env.RESEND_API_KEY;
  if (!key) return res.status(503).json({ success: false, message: "Email sending not configured" });

  let body = req.body || {};
  if (typeof body === "string") { try { body = JSON.parse(body); } catch (e) { body = {}; } }

  // Honeypot: real visitors never fill this hidden field
  if (body.company) return res.status(200).json({ success: true });

  const type = ["contact", "redesign", "guide", "chat", "quiz"].includes(body.type) ? body.type : "contact";
  const lang = body.lang === "en" ? "en" : "pt";
  const data = {
    Nome: clip(body.name, 120),
    Email: clip(body.email, 200),
    URL: clip(body.url, 300),
    Mensagem: clip(body.message, type === "chat" ? 12000 : 5000)
  };
  if (!isEmail(data.Email)) return res.status(400).json({ success: false, message: "Invalid email" });
  // Diagnosis: score and plan are recomputed here from the answers
  if (type === "quiz") {
    const D = QUIZ[lang];
    const raw = Array.isArray(body.answers) ? body.answers.slice(0, D.questions.length) : [];
    const answers = D.questions.map((q, i) => (Number.isInteger(raw[i]) && raw[i] >= 0 && raw[i] < q.options.length ? raw[i] : null));
    if (answers[0] == null || answers[D.questions.length - 1] == null) return res.status(400).json({ success: false, message: "Incomplete" });
    const result = evaluateQuiz(D, answers);
    // Optional website address: kept only when it looks like a domain
    const site = data.URL.toLowerCase().replace(/^https?:\/\//i, "").replace(/^www\./i, "").replace(/\/+$/, "").slice(0, 200);
    data.URL = !result.noSite && /^[^\s\/.]+(\.[^\s\/.]+)*\.[a-z]{2,}(\/\S*)?$/i.test(site) ? site : "";
    data.quiz = { result, answers, site: data.URL };
    const pt = QUIZ.pt;
    data.Mensagem = [
      result.noSite ? "Sem site (começar do zero)" : `Saúde do site: ${result.score}/100 · ${pt.bands.find((b) => result.score >= b.min).title}`,
      `Plano recomendado: ${pt.plans[result.plan].name}`,
      "",
      ...pt.questions.map((q, i) => (answers[i] == null ? null : `${q.q}\n— ${q.options[answers[i]].t}`)).filter(Boolean)
    ].join("\n");
  }
  if ((type === "contact" || type === "chat") && !data.Mensagem) return res.status(400).json({ success: false, message: "Missing message" });
  // The guide can be requested by someone who doesn't have a website yet
  if (type === "guide" && body.noSite === true) data.URL = "Ainda não tem site";
  if ((type === "redesign" || type === "guide") && !data.URL) return res.status(400).json({ success: false, message: "Missing website" });

  const from = process.env.MAIL_FROM || "Mariana Marcelino <info@mariana-marcelino.com>";
  const to = process.env.MAIL_TO || "info@mariana-marcelino.com";
  try {
    const n = notification(type, lang, data);
    await send(key, { from, to: [to], reply_to: data.Email, subject: n.subject, html: n.html, text: n.text });
    // The visitor's confirmation shouldn't fail the whole request
    try {
      const v = visitorEmail(type, lang, data);
      await send(key, { from, to: [data.Email], reply_to: to, subject: v.subject, html: v.html, text: v.text });
    } catch (e) {
      console.error("Confirmation email failed:", e.message);
    }
    return res.status(200).json({ success: true });
  } catch (e) {
    console.error(e.message);
    return res.status(502).json({ success: false, message: "Could not send" });
  }
};

// Exposed for local previews
module.exports.visitorEmail = visitorEmail;
module.exports.notification = notification;
