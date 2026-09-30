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
      subject: "Recebi a sua mensagem",
      hello: (n) => (n ? `Olá, ${n}!` : "Olá!"),
      blocks: [
        { p: "Obrigada por entrar em contacto. Recebi a sua mensagem e vou lê-la muito em breve." },
        { p: "Se preferir avançar já para uma conversa direta, pode marcar uma chamada:" },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt },
        { p: "Se preferir esperar pelo email, respondo-lhe brevemente." }
      ],
      sign: "Até já,",
      recap: "A sua mensagem"
    },
    redesign: {
      subject: "Recebi o seu pedido de redesign gratuito",
      hello: (n) => (n ? `Olá, ${n}!` : "Olá!"),
      blocks: [
        { p: "Obrigada pelo interesse em ver como o posso ajudar a renovar o seu site. Já recebi o seu pedido e o próximo passo está do meu lado: vou analisar o seu site atual e nos próximos dias vou enviar-lhe:" },
        { ul: [
          "— Uma proposta visual de redesign para a sua nova homepage.",
          "— Um relatório com os principais pontos de melhoria (além do design) para o ajudar a converter mais visitantes em clientes."
        ] },
        { p: "Se não quiser esperar pelo e-mail e preferir avançar já para uma conversa direta, pode marcar uma chamada:" },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt }
      ],
      recap: null
    },
    guide: {
      subject: "O seu guia: Oito sinais de que o seu site está a afastar clientes",
      hello: (n) => (n ? `Olá, ${n},` : "Olá,"),
      blocks: [
        { p: "Como prometido, aqui tem o link de acesso ao guia “Oito sinais de que o seu site está a afastar clientes”." },
        { link: "Descarregar o guia em PDF", href: `${SITE}/assets/guia-8-sinais.pdf` },
        { p: "Identificar estes sinais é apenas o primeiro passo: o verdadeiro desafio é corrigi-los. Se preferir avançar mais rápido, convido-o a marcar comigo uma breve chamada de 30 minutos:" },
        { cta: "Marcar chamada", href: CALENDLY },
        { p: FREE_CALL.pt }
      ],
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
      subject: "I've received your message",
      hello: (n) => (n ? `Hi, ${n}!` : "Hi!"),
      blocks: [
        { p: "Thank you for getting in touch. I've received your message and will read it very soon." },
        { p: "If you'd like to go straight to a conversation, you can book a call:" },
        { cta: "Book a call", href: CALENDLY },
        { p: FREE_CALL.en },
        { p: "If you'd rather wait for my email, I'll get back to you soon." }
      ],
      sign: "Talk soon,",
      recap: "Your message"
    },
    redesign: {
      subject: "I've received your free redesign request",
      hello: (n) => (n ? `Hi, ${n}!` : "Hi!"),
      blocks: [
        { p: "Thank you for your interest in seeing how I can help you refresh your website. I've received your request and the next step is on me: I'll review your current website and, over the next few days, send you:" },
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
      hello: (n) => (n ? `Hi, ${n},` : "Hi,"),
      blocks: [
        { p: "As promised, here's your link to the guide “Eight signs your website is driving clients away”." },
        { link: "Download the PDF guide", href: `${SITE}/assets/guide-8-signs.pdf` },
        { p: "Spotting these signs is only the first step: the real challenge is fixing them. If you'd like to move faster, I'd like to invite you to book a short 30-minute call with me:" },
        { cta: "Book a call", href: CALENDLY },
        { p: FREE_CALL.en }
      ],
      recap: null
    },
    sign: "Speak soon,",
    name: "Mariana Marcelino",
    role: "Web Design · Automation · AI",
    fields: { Nome: "Name", Email: "Email", Mensagem: "Message", URL: "Website" },
    footer: "You received this email because you submitted a form on mariana-marcelino.com."
  }
};

// ---------- Visitor email (on brand) ----------
function visitorEmail(type, lang, data) {
  const L = COPY[lang];
  const c = L[type];
  const first = (data.Nome || "").split(/\s+/)[0];
  const home = `${SITE}${lang === "en" ? "/en/" : "/"}`;
  const P = (t) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK}">${esc(t)}</p>`;
  const blockHtml = (b) => {
    if (b.p) return P(b.p);
    if (b.link) return `<p style="margin:0 0 20px;font-size:16px;line-height:1.6"><a href="${b.href}" style="color:${INK};font-weight:600;text-decoration:underline;text-underline-offset:3px">${esc(b.link)}</a></p>`;
    if (b.ul) return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px">${b.ul.map((li) => `<tr><td style="padding:4px 0;font-size:16px;line-height:1.55;color:${INK}">${esc(li)}</td></tr>`).join("")}</table>`;
    if (b.cta) {
      const bg = b.secondary ? "#ffffff" : INK, fg = b.secondary ? INK : "#ffffff";
      return `<table role="presentation" cellpadding="0" cellspacing="0" style="margin:4px 0 20px"><tr><td style="background:${bg};border:1px solid ${INK};border-radius:44px"><a href="${b.href}" style="display:inline-block;padding:13px 26px;font-size:15px;color:${fg};text-decoration:none">${esc(b.cta)}</a></td></tr></table>`;
    }
    return "";
  };
  const recapRows = c.recap
    ? Object.keys(L.fields)
        .filter((k) => data[k] && k !== "Email")
        .map((k) => `<tr><td style="padding:6px 0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6b6b69;vertical-align:top;width:90px">${esc(L.fields[k])}</td><td style="padding:6px 0;font-size:15px;line-height:1.5;color:${INK};white-space:pre-wrap">${esc(data[k])}</td></tr>`)
        .join("")
    : "";
  // The recap sits at the very end, below a line under the signature
  const recap = recapRows
    ? `<tr><td style="padding:0 40px 36px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #d4d4cf"><tr><td style="padding-top:24px"><p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b6b69">${esc(c.recap)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0">${recapRows}</table></td></tr></table></td></tr>`
    : "";
  const html = `<!doctype html><html lang="${lang === "en" ? "en" : "pt-PT"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:Inter,-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:${INK}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="height:6px;background:${LILAC};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:32px 40px 8px"><a href="${home}" style="font-size:15px;font-weight:600;letter-spacing:.02em;color:${INK};text-decoration:none">MARIANA MARCELINO</a></td></tr>
<tr><td style="padding:28px 40px 0">
${P(c.hello(first))}
${c.blocks.map(blockHtml).join("\n")}
</td></tr>
<tr><td style="padding:8px 40px 32px">
<p style="margin:0;font-size:16px;line-height:1.6;color:${INK}">${esc(c.sign || L.sign)}</p>
<p style="margin:12px 0 0;font-size:16px;line-height:1.4;color:${INK}">${esc(L.name)}</p>
<p style="margin:4px 0 0;font-size:14px;line-height:1.5;color:#6b6b69">${esc(L.role)}</p>
<p style="margin:0;font-size:14px;line-height:1.5"><a href="${home}" style="color:#6b6b69">mariana-marcelino.com</a></p>
</td></tr>
${recap}
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#8a8a86">${esc(L.footer)}</p>
</td></tr></table></body></html>`;
  const textBlocks = c.blocks.map((b) => b.p ? b.p : b.ul ? b.ul.join("\n") : `${b.cta || b.link}: ${b.href}`);
  const text = [c.hello(first), "", ...textBlocks.flatMap((t) => [t, ""]), c.sign || L.sign, "", L.name, L.role, home,
    ...(recapRows ? ["", "———", c.recap + ":", ...Object.keys(L.fields).filter((k) => data[k] && k !== "Email").map((k) => `${L.fields[k]}: ${data[k]}`)] : [])].join("\n");
  return { subject: c.subject, html, text };
}

// ---------- Notification to Mariana ----------
function notification(type, lang, data) {
  const label = { contact: "Formulário: nova mensagem", redesign: "Redesign: novo pedido", guide: "Guia: novo download" }[type];
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

  const type = ["contact", "redesign", "guide"].includes(body.type) ? body.type : "contact";
  const lang = body.lang === "en" ? "en" : "pt";
  const data = {
    Nome: clip(body.name, 120),
    Email: clip(body.email, 200),
    URL: clip(body.url, 300),
    Mensagem: clip(body.message, 5000)
  };
  if (!isEmail(data.Email)) return res.status(400).json({ success: false, message: "Invalid email" });
  if (type === "contact" && !data.Mensagem) return res.status(400).json({ success: false, message: "Missing message" });
  if (type !== "contact" && !data.URL) return res.status(400).json({ success: false, message: "Missing website" });

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
