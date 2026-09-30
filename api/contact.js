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
const COPY = {
  pt: {
    contact: {
      subject: "Recebi a sua mensagem",
      hello: (n) => (n ? `Olá ${n},` : "Olá,"),
      body: [
        "Obrigada pela sua mensagem. Já a recebi e vou lê-la com atenção. Respondo-lhe pessoalmente o mais brevemente possível.",
        "Se preferir falar já, pode marcar uma chamada de 30 minutos, sem custo nem compromisso."
      ],
      cta: "Marcar chamada",
      ctaHref: CALENDLY,
      recap: "A sua mensagem"
    },
    redesign: {
      subject: "Recebi o seu pedido de redesign gratuito",
      hello: () => "Olá,",
      body: [
        "Obrigada pelo seu pedido. Vou analisar o seu site e, em até 2 dias úteis, envio-lhe por email o redesign da sua homepage, uma auditoria com pontos claros de melhoria e uma proposta personalizada.",
        "Não tem qualquer custo nem compromisso. Se entretanto quiser falar, pode marcar uma chamada de 30 minutos."
      ],
      cta: "Marcar chamada",
      ctaHref: CALENDLY,
      recap: "O seu pedido"
    },
    guide: {
      subject: "O seu guia: Oito sinais de que o seu site está a afastar clientes",
      hello: () => "Olá,",
      body: [
        "Obrigada pelo interesse. Aqui está o guia, para ler quando lhe der mais jeito: cada sinal vem com um teste rápido para fazer ao seu site.",
        "Se reconhecer alguns destes sinais no seu site, posso fazer-lhe um redesign gratuito da homepage, com uma auditoria e uma proposta, sem compromisso."
      ],
      cta: "Descarregar o guia",
      ctaHref: `${SITE}/assets/guia-8-sinais.pdf`,
      recap: null
    },
    sign: "Até breve,",
    role: "Web Design · Automação · IA",
    fields: { Nome: "Nome", Email: "Email", Mensagem: "Mensagem", URL: "Site" },
    footer: "Recebeu este email porque enviou um formulário em mariana-marcelino.com."
  },
  en: {
    contact: {
      subject: "I've received your message",
      hello: (n) => (n ? `Hi ${n},` : "Hi,"),
      body: [
        "Thank you for your message. I've received it and will read it carefully. I'll get back to you personally as soon as I can.",
        "If you'd rather talk now, you can book a free 30-minute call, with no commitment."
      ],
      cta: "Book a call",
      ctaHref: CALENDLY,
      recap: "Your message"
    },
    redesign: {
      subject: "I've received your free redesign request",
      hello: () => "Hi,",
      body: [
        "Thank you for your request. I'll look at your website and, within 2 working days, email you a redesign of your homepage, an audit with clear points for improvement and a personalised proposal.",
        "There's no cost and no commitment. If you'd like to talk in the meantime, you can book a 30-minute call."
      ],
      cta: "Book a call",
      ctaHref: CALENDLY,
      recap: "Your request"
    },
    guide: {
      subject: "Your guide: Eight signs your website is driving clients away",
      hello: () => "Hi,",
      body: [
        "Thank you for your interest. Here's the guide, to read whenever suits you: each sign comes with a quick test you can run on your website.",
        "If you recognise some of these signs on your site, I can do a free redesign of your homepage, with an audit and a proposal, no strings attached."
      ],
      cta: "Download the guide",
      ctaHref: `${SITE}/assets/guide-8-signs.pdf`,
      recap: null
    },
    sign: "Speak soon,",
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
  const recapRows = c.recap
    ? Object.keys(L.fields)
        .filter((k) => data[k] && k !== "Email")
        .map((k) => `<tr><td style="padding:6px 0;font-size:12px;letter-spacing:.06em;text-transform:uppercase;color:#6b6b69;vertical-align:top;width:90px">${esc(L.fields[k])}</td><td style="padding:6px 0;font-size:15px;line-height:1.5;color:${INK};white-space:pre-wrap">${esc(data[k])}</td></tr>`)
        .join("")
    : "";
  const recap = recapRows
    ? `<tr><td style="padding:32px 40px 0"><p style="margin:0 0 8px;font-size:11px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#6b6b69">${esc(c.recap)}</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-top:1px solid #d4d4cf">${recapRows}</table></td></tr>`
    : "";
  const paragraphs = c.body.map((p) => `<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK}">${esc(p)}</p>`).join("");
  const html = `<!doctype html><html lang="${lang === "en" ? "en" : "pt-PT"}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(c.subject)}</title></head>
<body style="margin:0;padding:0;background:${PAPER};font-family:Inter,-apple-system,BlinkMacSystemFont,'Helvetica Neue',Arial,sans-serif;color:${INK}">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${PAPER}"><tr><td align="center" style="padding:32px 16px">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff">
<tr><td style="height:6px;background:${LILAC};font-size:0;line-height:0">&nbsp;</td></tr>
<tr><td style="padding:32px 40px 8px"><a href="${SITE}${lang === "en" ? "/en/" : "/"}" style="font-size:15px;font-weight:600;letter-spacing:.02em;color:${INK};text-decoration:none">MARIANA MARCELINO</a></td></tr>
<tr><td style="padding:24px 40px 0">
<h1 style="margin:0 0 24px;font-size:26px;line-height:1.2;font-weight:400;letter-spacing:-.02em;color:${INK}">${esc(c.subject)}</h1>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:${INK}">${esc(c.hello(first))}</p>
${paragraphs}
<table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 8px"><tr><td style="background:${INK};border-radius:44px"><a href="${c.ctaHref}" style="display:inline-block;padding:13px 26px;font-size:15px;color:#ffffff;text-decoration:none">${esc(c.cta)}</a></td></tr></table>
</td></tr>
${recap}
<tr><td style="padding:32px 40px 36px">
<p style="margin:0;font-size:16px;line-height:1.6;color:${INK}">${esc(L.sign)}</p>
<p style="margin:4px 0 0;font-size:16px;line-height:1.4;color:${INK}">Mariana Marcelino</p>
<p style="margin:2px 0 0;font-size:13px;line-height:1.4;color:#6b6b69">${esc(L.role)} · <a href="${SITE}${lang === "en" ? "/en/" : "/"}" style="color:#6b6b69">mariana-marcelino.com</a></p>
</td></tr>
</table>
<p style="max-width:560px;margin:16px auto 0;font-size:12px;line-height:1.5;color:#8a8a86">${esc(L.footer)}</p>
</td></tr></table></body></html>`;
  const text = [c.subject, "", c.hello(first), "", ...c.body, "", `${c.cta}: ${c.ctaHref}`, "",
    ...(c.recap ? [c.recap + ":", ...Object.keys(L.fields).filter((k) => data[k] && k !== "Email").map((k) => `${L.fields[k]}: ${data[k]}`), ""] : []),
    L.sign, "Mariana Marcelino", `${L.role} · ${SITE}`].join("\n");
  return { subject: c.subject, html, text };
}

// ---------- Notification to Mariana ----------
function notification(type, lang, data) {
  const label = { contact: "Nova mensagem do site", redesign: "Novo pedido de redesign gratuito", guide: "Novo download do guia" }[type];
  const subject = `${label} — ${data.Nome || data.URL || data.Email}`;
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
