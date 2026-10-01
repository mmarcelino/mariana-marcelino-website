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
const LILAC = "#d6cbec";
const INK = "#171715";
const PAPER = "#eeeeea";

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
  if (!R.noSite) blocks.push({ scorecard: { score: R.score, label: D.ui.scoreLabel, title: R.band.title, text: R.band.text } });
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
    subject: R.noSite ? T.subjectNoSite : T.subject.replace("{score}", R.score).replace("{band}", R.band.title),
    eyebrow: lang === "en" ? "Website diagnosis" : "Diagnóstico do site",
    hello: () => (lang === "en" ? "Hi," : "Olá,"),
    blocks,
    recap: null
  };
}

// ---------- Visitor email (on brand) ----------
// Quiet, editorial layout: off-white page, a soft card, Inter-like system type,
// a lilac pill naming the email, black pill buttons and a monogram signature.
const MUTED = "#6b6b66", BODY = "#2c2c29", LINE = "#e6e5df", TINT = "#f3f0fa", DEEP = "#5b46b5";
const FONT = "Inter,-apple-system,BlinkMacSystemFont,'Segoe UI','Helvetica Neue',Arial,sans-serif";

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
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:4px 0 26px;background:${TINT};border-radius:16px"><tr><td style="padding:24px 26px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>${num}<td valign="middle">${sc.label ? `<p style="margin:0 0 4px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${MUTED}">${esc(sc.label)}</p>` : ""}<p style="margin:0;font-size:21px;line-height:1.25;letter-spacing:-.01em;color:${INK}">${esc(sc.title)}</p><p style="margin:6px 0 0;font-size:14.5px;line-height:1.55;color:${BODY}">${esc(sc.text)}</p></td></tr></table></td></tr></table>`;
    }
    if (b.plan) {
      const pl = b.plan;
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:10px 0 26px;background:${LILAC};border-radius:16px"><tr><td style="padding:26px 28px 6px"><p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:#4a4560">${esc(pl.label)}</p><p style="margin:0 0 8px;font-size:22px;line-height:1.25;letter-spacing:-.015em;color:${INK}">${esc(pl.name)}</p><p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:${INK}">${esc(pl.text)}</p>${button(pl.cta, pl.href)}${pl.note ? `<p style="margin:-8px 0 20px;font-size:13px;line-height:1.55;color:#4a4560">${esc(pl.note)}</p>` : ""}</td></tr></table>`;
    }
    if (b.label) return `<p style="margin:8px 0 12px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${MUTED}">${esc(b.label)}</p>`;
    if (b.item) {
      return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:0;border-top:1px solid ${LINE}"><tr>${b.n ? `<td width="34" valign="top" style="padding:16px 0 18px;font-size:12px;line-height:22px;color:${MUTED};font-variant-numeric:tabular-nums">${String(b.n).padStart(2, "0")}</td>` : ""}<td valign="top" style="padding:16px 0 18px"><p style="margin:0;font-size:16px;line-height:22px;font-weight:600;color:${INK}">${esc(b.item)}</p><p style="margin:4px 0 0;font-size:15px;line-height:1.6;color:${BODY}">${esc(b.text)}</p>${b.todo ? `<p style="margin:10px 0 0;font-size:14.5px;line-height:1.6;color:${BODY}"><span style="font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${DEEP}">${esc(b.todoLabel)}</span><br>${esc(b.todo)}</p>` : ""}</td></tr></table>`;
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
        .map((k) => `<tr><td valign="top" style="padding:7px 18px 7px 0;font-size:11px;line-height:22px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:${MUTED};width:90px;white-space:nowrap">${esc(L.fields[k])}</td><td valign="top" style="padding:7px 0;font-size:15px;line-height:22px;color:${INK};white-space:pre-wrap">${esc(data[k])}</td></tr>`)
        .join("")
    : "";
  const recap = recapRows
    ? `<tr><td class="px" style="padding:0 44px 40px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f5f1;border-radius:14px"><tr><td style="padding:20px 22px"><p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.12em;text-transform:uppercase;color:${MUTED}">${esc(c.recap)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${recapRows}</table></td></tr></table></td></tr>`
    : "";
  const html = `<!doctype html><html lang="${lang === "en" ? "en" : "pt-PT"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><style>@media (max-width:520px){.px{padding-left:24px!important;padding-right:24px!important}.nm,.eb{display:block!important;width:auto!important}.eb{text-align:left!important;padding-top:12px!important}}</style><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:${FONT};color:${INK};-webkit-font-smoothing:antialiased">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}"><tr><td align="center" style="padding:40px 14px 32px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:580px;background:#fbfbf9;border:1px solid ${LINE};border-radius:20px">
<tr><td class="px" style="padding:26px 44px 22px;border-bottom:1px solid ${LINE}"><table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
<td class="nm" valign="middle"><a href="${home}" style="font-size:12px;font-weight:600;letter-spacing:.14em;white-space:nowrap;color:${INK};text-decoration:none">MARIANA MARCELINO</a></td>
<td class="eb" valign="middle" align="right">${c.eyebrow ? `<span style="display:inline-block;padding:5px 10px;border-radius:999px;background:${LILAC};font-size:10.5px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;white-space:nowrap;color:${INK}">${esc(c.eyebrow)}</span>` : ""}</td>
</tr></table></td></tr>
<tr><td class="px" style="padding:36px 44px 8px">
<p style="margin:0 0 18px;font-size:17px;line-height:1.5;color:${INK}">${esc(c.hello(first))}</p>
${c.blocks.map(blockHtml).join("\n")}
</td></tr>
<tr><td class="px" style="padding:6px 44px 38px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid ${LINE}"><tr><td style="padding-top:24px">
<p style="margin:0 0 16px;font-size:16px;line-height:1.5;color:${BODY}">${esc(c.sign || L.sign)}</p>
<table role="presentation" cellpadding="0" cellspacing="0"><tr>
<td valign="middle" style="padding-right:14px"><div style="width:40px;height:40px;border-radius:50%;background:${LILAC};text-align:center;line-height:40px;font-size:16px;font-weight:600;color:${INK}">M</div></td>
<td valign="middle"><p style="margin:0;font-size:15px;line-height:1.4;font-weight:600;color:${INK}">${esc(L.name)}</p><p style="margin:2px 0 0;font-size:13px;line-height:1.5;color:${MUTED}">${esc(L.role)} · <a href="${home}" style="color:${MUTED};text-decoration:underline;text-underline-offset:2px">mariana-marcelino.com</a></p></td>
</tr></table>
</td></tr></table></td></tr>
${recap}
</table>
<p style="max-width:520px;margin:20px auto 0;font-size:12px;line-height:1.6;color:#8a8a84;text-align:center">${esc(L.footer)}</p>
</td></tr></table></body></html>`;
  const textBlocks = c.blocks.map((b) =>
    b.scorecard ? [b.scorecard.score != null ? `${b.scorecard.label}: ${b.scorecard.score}/100 · ${b.scorecard.title}` : b.scorecard.title, b.scorecard.text].join("\n")
    : b.plan ? [b.plan.label.toUpperCase(), b.plan.name, b.plan.text, `${b.plan.cta}: ${b.plan.href}`, b.plan.note].filter(Boolean).join("\n")
    : b.label ? b.label.toUpperCase()
    : b.item ? [(b.n ? String(b.n).padStart(2, "0") + " " : "") + b.item, b.text, b.todo ? `${b.todoLabel}: ${b.todo}` : ""].filter(Boolean).join("\n")
    : b.p && b.link ? `${b.p}${b.link} (${b.href})${b.after || ""}` : b.p ? b.p : b.ul ? b.ul.join("\n") : `${b.cta || b.link}: ${b.href}`);
  const text = [c.hello(first), "", ...textBlocks.flatMap((t) => [t, ""]), c.sign || L.sign, "", L.name, L.role, home,
    ...(recapRows ? ["", "———", c.recap + ":", ...Object.keys(L.fields).filter((k) => data[k] && k !== "Email").map((k) => `${L.fields[k]}: ${data[k]}`)] : [])].join("\n");
  return { subject: c.subject, html, text };
}

// ---------- Notification to Mariana ----------
function notification(type, lang, data) {
  const label = { contact: "Formulário: nova mensagem", redesign: "Redesign: novo pedido", guide: "Guia: novo download", chat: "Chat: novo contacto", quiz: "Diagnóstico: novo resultado" }[type];
  const subject = label;
  const rows = [["Tipo", label], ["Idioma", lang.toUpperCase()], ["Nome", data.Nome], ["Email", data.Email], ["Site", data.URL], ["Mensagem", data.Mensagem]]
    .filter(([, v]) => v)
    .map(([k, v]) => `<tr><td style="padding:8px 12px 8px 0;font-size:12px;color:#6b6b69;text-transform:uppercase;letter-spacing:.06em;vertical-align:top">${esc(k)}</td><td style="padding:8px 0;font-size:15px;color:${INK};white-space:pre-wrap">${esc(v)}</td></tr>`)
    .join("");
  const html = `<div style="font-family:-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;max-width:560px"><p style="font-size:16px;margin:0 0 12px">${esc(label)}</p><table cellpadding="0" cellspacing="0" style="border-top:1px solid #ddd">${rows}</table><p style="font-size:13px;color:#888;margin-top:16px">Responda diretamente a este email para responder a ${esc(data.Email)}.</p></div>`;
  const text = [label, "", ...[["Idioma", lang.toUpperCase()], ["Nome", data.Nome], ["Email", data.Email], ["Site", data.URL], ["Mensagem", data.Mensagem]].filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`)].join("\n");
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
    data.quiz = { result, answers };
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
      // A chat left by email gets the same confirmation as the contact form
      const v = visitorEmail(type === "chat" ? "contact" : type, lang, data);
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
