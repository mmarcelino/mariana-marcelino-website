"""Builds the lead-magnet guide ("8 sinais…") as A4 HTML pages in PT and EN.
Run:  python3 guide/_build.py   (writes guide/guia-pt.html and guide/guide-en.html)
Then print them to assets/guia-8-sinais.pdf / assets/guide-8-signs.pdf with
guide/_print.py (headless Chrome).
"""
import html, os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.mariana-marcelino.com"
CALENDLY = "https://calendly.com/marianacmarcelino/30min"

T = {
"pt": dict(
  lang="pt-PT", file="guia-pt.html",
  kicker="Guia gratuito",
  title="Oito sinais de que o seu site está a afastar clientes",
  subtitle="E o que fazer com cada um, sem jargão técnico.",
  author="Mariana Marcelino", role="Web Design · Automação · IA",
  intro_k="Antes de começar",
  intro_h="Um site raramente avaria de forma visível",
  intro_p=["Vai simplesmente deixando de funcionar: as visitas continuam a chegar, mas os pedidos de contacto diminuem sem se perceber porquê.",
           "Este guia reúne os oito sinais mais comuns de que isso está a acontecer. Para cada um, explico porque importa, o que fazer e um teste rápido que pode fazer hoje.",
           "Percorra os oito sinais e marque os que reconhece no seu site. No fim, a contagem ajuda a decidir o próximo passo."],
  how_k="Como usar",
  how=["Leia cada sinal com o seu site aberto ao lado.", "Faça o teste rápido e marque a caixa se reconhecer o problema.", "Conte os sinais marcados e veja o resultado na última página."],
  why="Porque importa", do="O que fazer", test="Teste rápido",
  signs=[
   ("No telemóvel, é difícil de usar",
    "A maioria das visitas chega por telemóvel. Se é preciso fazer zoom, se os botões são pequenos ou o menu falha, o visitante desiste antes de perceber o que oferece.",
    ["Texto legível sem zoom (16px ou mais)", "Botões com espaço suficiente para o dedo", "Menu simples, com o contacto sempre à mão"],
    "Abra o site no telemóvel e tente contactar-se a si próprio. Consegue em menos de um minuto?"),
   ("Demora a carregar",
    "Cada segundo de espera aumenta a probabilidade de o visitante voltar para trás. E o Google também tem a velocidade em conta.",
    ["Comprima e redimensione as imagens", "Retire plugins e scripts que não usa", "Confirme se o alojamento está à altura"],
    "Analise o site em pagespeed.web.dev. O resultado para telemóvel está a verde?"),
   ("Não se percebe o que faz em cinco segundos",
    "Um slogan genérico obriga o visitante a procurar. A maioria não procura: sai.",
    ["Uma frase no topo que diga o que faz, para quem e onde", "Um subtítulo com o principal benefício", "Uma imagem do seu trabalho real"],
    "Mostre a homepage a alguém durante cinco segundos. Essa pessoa consegue explicar o que faz?"),
   ("Não há um próximo passo claro",
    "Um visitante interessado precisa de saber o que fazer a seguir. Com cinco opções ao mesmo nível, ou nenhuma, a decisão fica adiada.",
    ["Escolha uma ação principal por página", "Torne-a visível sem ser preciso fazer scroll", "Repita-a no fim de cada secção importante"],
    "Em cada página, qual é a única coisa que quer que o visitante faça? Está evidente?"),
   ("O design parece de outra época",
    "Um visual datado transmite que o negócio parou no tempo, mesmo que não seja verdade. E a confiança decide-se na primeira impressão.",
    ["Use fotografias reais da equipa, do espaço e do trabalho", "Atualize datas, textos e referências antigas", "Simplifique: menos elementos, mais espaço"],
    "O rodapé ainda diz “© 2019”? As fotografias parecem de banco de imagens?"),
   ("Contactar dá trabalho",
    "Formulários longos, um email escondido ou a obrigação de ligar em horário de expediente são obstáculos desnecessários.",
    ["Reduza o formulário a nome, email e mensagem", "Ofereça WhatsApp, marcação online ou chat", "Diga quando vai responder, e cumpra"],
    "Quantos cliques e campos são precisos para lhe enviar um pedido?"),
   ("Não encontram o seu negócio no Google nem nas ferramentas de IA",
    "Um site que ninguém encontra não gera contactos. Se não aparece quando procuram o seu serviço na sua zona, os concorrentes ficam com esses clientes.",
    ["Títulos e descrições claros em cada página", "Um Perfil da Empresa no Google completo e com avaliações", "Respostas diretas às perguntas dos seus clientes"],
    "Pesquise o seu serviço e a sua cidade no Google e no ChatGPT. O seu negócio aparece?"),
   ("Não consegue atualizá-lo sem ajuda",
    "Se mudar um preço ou acrescentar um projeto exige pedir ajuda e esperar, o site fica desatualizado. E um site desatualizado transmite desleixo.",
    ["Garanta autonomia para editar os conteúdos do dia a dia", "Peça formação no fim de qualquer projeto", "Mantenha o domínio e os acessos em seu nome"],
    "Consegue alterar um texto do site hoje, sem ajuda?"),
  ],
  score_k="Resultado", score_h="Quantos sinais marcou?",
  score=[("0–1", "O seu site está em boa forma. Mantenha-o atualizado e reveja-o uma vez por ano."),
         ("2–3", "Há ajustes pontuais com impacto rápido. Comece pelos sinais 1, 3 e 4."),
         ("4 ou mais", "Um redesign será, provavelmente, o caminho mais eficaz e mais económico do que remendos sucessivos.")],
  cta_h="Quer uma segunda opinião?",
  cta_p="Posso redesenhar a homepage do seu site gratuitamente, com uma auditoria de pontos de melhoria, para que veja o potencial antes de decidir.",
  cta_a=("Pedir redesign gratuito", f"{SITE}/#free"), cta_b=("Marcar uma chamada", CALENDLY),
  page="Página",
),
"en": dict(
  lang="en", file="guide-en.html",
  kicker="Free guide",
  title="Eight signs your website is driving clients away",
  subtitle="And what to do about each one, without the jargon.",
  author="Mariana Marcelino", role="Web Design · Automation · AI",
  intro_k="Before you start",
  intro_h="A website rarely breaks in a visible way",
  intro_p=["It simply stops working: visitors keep coming, but enquiries drop and nobody quite knows why.",
           "This guide brings together the eight most common signs that this is happening. For each one, I explain why it matters, what to do and a quick test you can run today.",
           "Go through the eight signs and tick the ones you recognise on your website. At the end, your count will help you decide what to do next."],
  how_k="How to use it",
  how=["Read each sign with your website open next to you.", "Run the quick test and tick the box if you recognise the problem.", "Count your ticks and check the result on the last page."],
  why="Why it matters", do="What to do", test="Quick test",
  signs=[
   ("It’s hard to use on a phone",
    "Most visits come from phones. If people need to zoom, the buttons are tiny or the menu misbehaves, they leave before understanding what you offer.",
    ["Text readable without zooming (16px or more)", "Buttons with enough room for a thumb", "A simple menu, with contact always at hand"],
    "Open your website on your phone and try to contact yourself. Can you do it in under a minute?"),
   ("It’s slow to load",
    "Every second of waiting makes visitors more likely to go back. Google takes speed into account too.",
    ["Compress and resize your images", "Remove plugins and scripts you don’t use", "Check that your hosting is up to the job"],
    "Test your website at pagespeed.web.dev. Is the mobile score green?"),
   ("It’s not clear what you do within five seconds",
    "A generic slogan makes visitors search. Most don’t: they leave.",
    ["A headline that says what you do, for whom and where", "A subheading with your main benefit", "An image of your real work"],
    "Show your homepage to someone for five seconds. Can they explain what you do?"),
   ("There’s no clear next step",
    "Interested visitors need to know what to do next. With five equal options, or none, the decision gets postponed.",
    ["Choose one main action per page", "Make it visible without scrolling", "Repeat it at the end of each key section"],
    "On each page, what is the one thing you want visitors to do? Is it obvious?"),
   ("The design looks dated",
    "A dated look says the business has stood still, even when it hasn’t. And trust is decided at first glance.",
    ["Use real photos of your team, space and work", "Update old dates, copy and references", "Simplify: fewer elements, more space"],
    "Does your footer still say “© 2019”? Do your photos look like stock images?"),
   ("Getting in touch takes effort",
    "Long forms, a hidden email address or having to call during office hours are needless obstacles.",
    ["Cut the form down to name, email and message", "Offer WhatsApp, online booking or chat", "Say when you’ll reply, and keep to it"],
    "How many clicks and fields does it take to send you a request?"),
   ("People can’t find you on Google or AI tools",
    "A website nobody finds doesn’t bring enquiries. If you don’t show up when people search for your service in your area, your competitors get those clients.",
    ["Clear titles and descriptions on every page", "A complete Google Business Profile with reviews", "Direct answers to your clients’ questions"],
    "Search for your service and your city on Google and ChatGPT. Does your business show up?"),
   ("You can’t update it yourself",
    "If changing a price or adding a project means asking for help and waiting, the website falls behind. And an outdated website looks careless.",
    ["Make sure you can edit day-to-day content yourself", "Ask for training at the end of any project", "Keep the domain and logins in your name"],
    "Could you change a line of text on your website today, without help?"),
  ],
  score_k="Your result", score_h="How many signs did you tick?",
  score=[("0–1", "Your website is in good shape. Keep it up to date and review it once a year."),
         ("2–3", "A few targeted fixes will make a quick difference. Start with signs 1, 3 and 4."),
         ("4 or more", "A redesign is probably the most effective option, and cheaper than patching things one by one.")],
  cta_h="Want a second opinion?",
  cta_p="I can redesign your homepage for free, with an audit of what to improve, so you can see the potential before you decide.",
  cta_a=("Request a free redesign", f"{SITE}/en/#free"), cta_b=("Book a call", CALENDLY),
  page="Page",
),
}

CSS = """
@page { size: A4; margin: 0; }
* { box-sizing: border-box; margin: 0; padding: 0; }
:root { --ink: #171715; --paper: #eeeeea; --grey: #a3a3a3; --soft: rgba(23,23,21,.62); --line: rgba(23,23,21,.16); --lilac: #d6cbec; }
html, body { background: var(--paper); }
body { font-family: "Inter", Helvetica, Arial, sans-serif; color: var(--ink); -webkit-font-smoothing: antialiased; }
.page { position: relative; width: 210mm; height: 297mm; padding: 18mm 18mm 16mm; overflow: hidden; page-break-after: always; display: flex; flex-direction: column; }
.page:last-child { page-break-after: auto; }
.kicker { font-size: 8pt; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; }
.muted { color: var(--soft); }
.brand { display: flex; justify-content: space-between; align-items: center; font-size: 8pt; font-weight: 600; letter-spacing: .02em; text-transform: uppercase; }
.brand span:last-child { font-weight: 500; color: var(--soft); }
.foot { margin-top: auto; display: flex; justify-content: space-between; padding-top: 5mm; border-top: 1px solid var(--line); font-size: 7.5pt; color: var(--soft); }

/* Cover */
/* Full-bleed dark cover: the site's 3D form fades into the page colour */
.cover { padding: 0; background: #17121e; color: var(--paper); }
.cover-art { position: absolute; inset: 0; background: #17121e center top / 100% auto no-repeat; }
.cover-art::after { content: ""; position: absolute; inset: 0; background: linear-gradient(180deg, rgba(23,18,30,.35) 0%, rgba(23,18,30,0) 15%, rgba(23,18,30,0) 36%, #17121e 70%); }
.cover-body { position: relative; flex: 1; display: flex; flex-direction: column; padding: 16mm 18mm 16mm; }
.cover .brand span:last-child { color: var(--ink); background: var(--lilac); padding: 1.6mm 3.6mm; border-radius: 20mm; }
.cover h1 { margin-top: auto; font-size: 44pt; line-height: 1.02; letter-spacing: -.035em; font-weight: 400; max-width: 14ch; }
.cover .sub { margin-top: 6mm; font-size: 13pt; line-height: 1.4; color: rgba(238,238,234,.72); max-width: 30em; }
.byline { margin-top: 16mm; display: flex; justify-content: space-between; align-items: flex-end; padding-top: 6mm; border-top: 1px solid rgba(238,238,234,.22); font-size: 9pt; line-height: 1.4; }
.byline b { font-weight: 600; display: block; }
.byline .url { color: rgba(238,238,234,.62); }

/* Intro */
.intro h2, .score h2 { margin-top: 20mm; font-size: 28pt; line-height: 1.05; letter-spacing: -.03em; font-weight: 400; max-width: 16ch; }
.intro .lead { margin-top: 8mm; max-width: 132mm; }
.intro .lead p { font-size: 11.5pt; line-height: 1.6; }
.intro .lead p + p { margin-top: 4mm; }
.how { margin-top: 14mm; border-top: 1px solid var(--ink); padding-top: 5mm; max-width: 150mm; }
.how ol { list-style: none; margin-top: 3mm; }
.how li { display: grid; grid-template-columns: 12mm 1fr; padding: 3.5mm 0; border-bottom: 1px solid var(--line); font-size: 10.5pt; line-height: 1.45; }
.how li span { color: var(--grey); font-size: 8.5pt; padding-top: .6mm; }
.index { margin-top: 12mm; display: grid; grid-template-columns: 1fr 1fr; column-gap: 10mm; }
.index div { display: grid; grid-template-columns: 9mm 1fr; padding: 2.4mm 0; border-bottom: 1px solid var(--line); font-size: 9pt; line-height: 1.35; }
.index span { color: var(--grey); font-size: 8pt; }

/* Signs: two per page */
.sign { display: grid; grid-template-columns: 30mm 1fr; column-gap: 6mm; padding: 9mm 0; border-top: 1px solid var(--ink); }
.sign + .sign { border-top: 1px solid var(--line); }
.sign-num { font-size: 34pt; line-height: .9; letter-spacing: -.04em; font-weight: 300; color: var(--grey); }
.sign h2 { font-size: 19pt; line-height: 1.12; letter-spacing: -.02em; font-weight: 400; }
.sign .why { margin-top: 3.5mm; font-size: 10.5pt; line-height: 1.55; color: var(--soft); }
.cols { margin-top: 5mm; display: grid; grid-template-columns: 1fr 1fr; column-gap: 6mm; }
.label { font-size: 7.5pt; font-weight: 600; letter-spacing: .06em; text-transform: uppercase; margin-bottom: 2mm; }
.do ul { list-style: none; }
.do li { position: relative; padding: 1.6mm 0 1.6mm 5mm; font-size: 9.8pt; line-height: 1.4; border-bottom: 1px solid var(--line); }
.do li::before { content: "—"; position: absolute; left: 0; color: var(--grey); }
.test { background: var(--lilac); padding: 4mm 4.5mm; display: grid; grid-template-columns: 5.5mm 1fr; column-gap: 3mm; align-items: start; }
.test .box { width: 5mm; height: 5mm; border: 1.2px solid var(--ink); border-radius: 1mm; margin-top: .6mm; background: rgba(255,255,255,.35); }
.test p { font-size: 9.8pt; line-height: 1.45; }
.signs-wrap { margin-top: 10mm; }

/* Score + CTA */
.score .rows { margin-top: 10mm; border-top: 1px solid var(--ink); }
.score .row { display: grid; grid-template-columns: 34mm 1fr; padding: 5.5mm 0; border-bottom: 1px solid var(--line); align-items: baseline; }
.score .row b { font-size: 16pt; font-weight: 400; letter-spacing: -.02em; }
.score .row p { font-size: 11pt; line-height: 1.5; }
.cta { margin-top: auto; background: var(--ink); color: var(--paper); padding: 12mm 12mm 11mm; }
.cta h3 { font-size: 22pt; line-height: 1.08; letter-spacing: -.03em; font-weight: 400; }
.cta p { margin-top: 4mm; font-size: 10.5pt; line-height: 1.55; color: rgba(238,238,234,.72); max-width: 125mm; }
.cta .btns { margin-top: 7mm; display: flex; gap: 3mm; flex-wrap: wrap; }
.cta a { display: inline-block; padding: 3mm 6mm; border-radius: 20mm; border: 1px solid var(--paper); color: var(--paper); text-decoration: none; font-size: 9.5pt; }
.cta a.primary { background: var(--paper); color: var(--ink); }
.cta .contact { margin-top: 7mm; padding-top: 4mm; border-top: 1px solid rgba(238,238,234,.2); font-size: 8.5pt; color: rgba(238,238,234,.6); display: flex; justify-content: space-between; }
.cta .contact a { border: 0; padding: 0; font-size: 8.5pt; color: rgba(238,238,234,.85); }
"""


def e(s):
    return html.escape(s, quote=True)


def build(code):
    t = T[code]
    total = 7
    pages = []

    def foot(n):
        return f'<div class="foot"><span>{e(t["title"])}</span><span>{t["page"]} {n} / {total}</span></div>'

    # 1. Cover
    pages.append(f"""
<section class="page cover">
  <div class="cover-art" style="background-image:url('../assets/hero-form-color.webp')"></div>
  <div class="cover-body">
    <div class="brand"><span>Mariana Marcelino</span><span>{e(t['kicker'])}</span></div>
    <h1>{e(t['title'])}</h1>
    <p class="sub">{e(t['subtitle'])}</p>
    <div class="byline"><div><b>{e(t['author'])}</b><span class="url">{e(t['role'])}</span></div><span class="url">mariana-marcelino.com</span></div>
  </div>
</section>""")

    # 2. Intro
    how = "".join(f'<li><span>{i:02d}</span>{e(x)}</li>' for i, x in enumerate(t["how"], 1))
    index = "".join(f'<div><span>{i:02d}</span>{e(s[0])}</div>' for i, s in enumerate(t["signs"], 1))
    lead = "".join(f"<p>{e(p)}</p>" for p in t["intro_p"])
    pages.append(f"""
<section class="page intro">
  <div class="brand"><span>Mariana Marcelino</span><span>{e(t['intro_k'])}</span></div>
  <h2>{e(t['intro_h'])}</h2>
  <div class="lead">{lead}</div>
  <div class="how"><p class="kicker">{e(t['how_k'])}</p><ol>{how}</ol></div>
  <div class="index">{index}</div>
  {foot(2)}
</section>""")

    # 3–6. Signs, two per page
    for p in range(4):
        blocks = []
        for k in (2 * p, 2 * p + 1):
            title, why, dos, test = t["signs"][k]
            lis = "".join(f"<li>{e(d)}</li>" for d in dos)
            blocks.append(f"""
    <article class="sign">
      <div class="sign-num">{k + 1:02d}</div>
      <div>
        <h2>{e(title)}</h2>
        <p class="why">{e(why)}</p>
        <div class="cols">
          <div class="do"><p class="label">{e(t['do'])}</p><ul>{lis}</ul></div>
          <div><p class="label">{e(t['test'])}</p><div class="test"><span class="box"></span><p>{e(test)}</p></div></div>
        </div>
      </div>
    </article>""")
        n = p + 3
        pages.append(f"""
<section class="page">
  <div class="brand"><span>Mariana Marcelino</span><span>{e(t['kicker'])}</span></div>
  <div class="signs-wrap">{''.join(blocks)}</div>
  {foot(n)}
</section>""")

    # 7. Result + call to action
    rows = "".join(f'<div class="row"><b>{e(a)}</b><p>{e(b)}</p></div>' for a, b in t["score"])
    last = f"""
<section class="page score">
  <div class="brand"><span>Mariana Marcelino</span><span>{e(t['score_k'])}</span></div>
  <h2>{e(t['score_h'])}</h2>
  <div class="rows">{rows}</div>
  <div class="cta">
    <h3>{e(t['cta_h'])}</h3>
    <p>{e(t['cta_p'])}</p>
    <div class="btns"><a class="primary" href="{t['cta_a'][1]}">{e(t['cta_a'][0])}</a><a href="{t['cta_b'][1]}">{e(t['cta_b'][0])}</a></div>
    <div class="contact"><a href="mailto:info@mariana-marcelino.com">info@mariana-marcelino.com</a><a href="{SITE}">mariana-marcelino.com</a></div>
  </div>
</section>"""
    pages.append(last)

    doc = f"""<!doctype html>
<html lang="{t['lang']}">
<head>
<meta charset="utf-8">
<title>{e(t['title'])} — Mariana Marcelino</title>
<link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300..700&display=swap" rel="stylesheet">
<style>{CSS}</style>
</head>
<body>
{''.join(pages)}
</body>
</html>
"""
    open(os.path.join(ROOT, "guide", t["file"]), "w", encoding="utf-8").write(doc)
    return len(pages)


if __name__ == "__main__":
    for c in T:
        print(c, build(c), "pages")
