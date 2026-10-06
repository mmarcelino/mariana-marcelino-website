"""Builds api/knowledge.js: what the website's chatbot knows, taken from the
live pages (plans, solutions, FAQ, about, articles), in PT and EN, so the
assistant always answers from the site's current content.
Run:  python3 blog/_knowledge.py   (also called by blog/_build.py)
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.mariana-marcelino.com"


def text(fragment):
    fragment = re.sub(r"<br\s*/?>", " ", fragment)
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment))).strip()


def section(page, cls):
    m = re.search(r'<section[^>]*class="[^"]*' + cls + r'[^"]*".*?</section>', page, re.S)
    return m.group(0) if m else ""


def knowledge(lang):
    path = os.path.join(ROOT, "index.html" if lang == "pt" else "en/index.html")
    page = open(path, encoding="utf-8").read()
    L = []
    title = lambda t: L.append(f"\n## {t}")

    hero = section(page, "hero")
    title("Resumo" if lang == "pt" else "Summary")
    L.append(text(re.search(r'<h1 class="hero-title">(.*?)</h1>', hero, re.S).group(1)) + ". " +
             text(re.search(r'<p class="hero-statement[^"]*">(.*?)</p>', hero, re.S).group(1)))

    about = section(page, "about")
    title("Sobre a Mariana" if lang == "pt" else "About Mariana")
    L.append(text(re.search(r'<div class="about-copy">(.*?)</div>', about, re.S).group(1)).replace(" LinkedIn", ""))

    impact = section(page, "impact")
    title("Soluções" if lang == "pt" else "Solutions")
    for t, d in re.findall(r'<h3 class="card-title">(.*?)</h3>\s*<p class="p card-desc">(.*?)</p>', impact, re.S):
        L.append(f"— {text(t)}: {text(d)}")

    tiers = section(page, "tiers-section")
    title("Planos e preços" if lang == "pt" else "Plans and prices")
    for block in re.findall(r'<article[^>]*class="tier[ "].*?</article>', tiers, re.S):
        name = text(re.search(r'<h3 class="tier-name">(.*?)</h3>', block, re.S).group(1))
        desc = re.search(r'<p class="tier-desc">(.*?)</p>', block, re.S)
        price = re.search(r'<p class="tier-price">(.*?)</p>', block, re.S)
        # Included items come from the main list; optional extras (paid on top) are listed apart
        main = re.search(r'<ul class="tier-list">(.*?)</ul>', block, re.S)
        items = [text(i) for i in re.findall(r"<li>(.*?)</li>", main.group(1) if main else "", re.S)]
        extras_ul = re.search(r'<ul class="tier-list -extras">(.*?)</ul>', block, re.S)
        extras = [text(i) for i in re.findall(r"<li>(.*?)</li>", extras_ul.group(1), re.S)] if extras_ul else []
        head = f"— {name}" + (f" ({text(price.group(1))})" if price else "") + (f": {text(desc.group(1))}" if desc else "")
        note = re.search(r'<p class="tier-note"[^>]*>(.*?)</p>', block, re.S)
        extras_txt = (". " + ("Extras opcionais, pagos à parte e não incluídos no preço base" if lang == "pt" else "Optional extras, paid on top and not included in the base price") + ": " + "; ".join(extras)) if extras else ""
        L.append(head + (". " + ("Inclui" if lang == "pt" else "Includes") + ": " + "; ".join(items) if items else "") + (f" ({text(note.group(1))})" if note else "") + extras_txt)
    # The free redesign isn't a plan: it sits under the plans as an option for
    # anyone not sure yet, and is offered whenever plans come up
    free = re.search(r'<article id="free".*?</article>', tiers, re.S)
    if free:
        pick = lambda pat: text(re.search(pat, free.group(0), re.S).group(1))
        lead = ("Além dos planos (não é um plano): para quem ainda não tem a certeza e quer ver o potencial antes de investir"
                if lang == "pt" else
                "Besides the plans (not a plan): for anyone not sure yet who wants to see the potential before investing")
        L.append(f"{lead} — {pick(r'<span class=.tier-name.>(.*?)</span>')} ({pick(r'<span class=.tier-price.>(.*?)</span>')}): {pick(r'<p class=.tier-desc.>(.*?)</p>')}")

    faq = section(page, "faq-section")
    title("Perguntas frequentes" if lang == "pt" else "Frequently asked questions")
    for q, a in re.findall(r'<summary>(.*?)</summary>\s*<div class="faq-answer">(.*?)</div>', faq, re.S):
        L.append(f"P: {text(q)}\nR: {text(a)}" if lang == "pt" else f"Q: {text(q)}\nA: {text(a)}")

    title("Contactos e próximos passos" if lang == "pt" else "Contact and next steps")
    if lang == "pt":
        L.append("Marcar chamada gratuita de 30 minutos (botão “Marcar chamada” no site). Pedir o redesign gratuito da homepage (oferta gratuita, por baixo dos planos). "
                 "Diagnóstico gratuito do site, com 9 perguntas e resultado imediato com o plano recomendado: https://www.mariana-marcelino.com/diagnostico/ (útil para quem não sabe que plano escolher). Email: info@mariana-marcelino.com. "
                 "Trabalho remoto, com negócios de todo o país e do estrangeiro, em português ou inglês.")
    else:
        L.append("Book a free 30-minute call (“Book a call” button on the website). Request the free homepage redesign (free offer, below the plans). "
                 "Free website diagnosis, 9 questions with an instant result and the recommended plan: https://www.mariana-marcelino.com/en/diagnosis/ (useful for anyone unsure which plan to choose). Email: info@mariana-marcelino.com. "
                 "Works remotely with businesses across Portugal and abroad, in Portuguese or English.")

    blog_index = open(os.path.join(ROOT, "blog/index.html" if lang == "pt" else "en/blog/index.html"), encoding="utf-8").read()
    title("Artigos do blog" if lang == "pt" else "Blog articles")
    for href, t in re.findall(r'<h[23] class="post-title"><a href="([^"]+)">(.*?)</a></h[23]>', blog_index):
        slug = href.rstrip("/").split("/")[-1]
        url = f"{SITE}/blog/{slug}/" if lang == "pt" else f"{SITE}/en/blog/{slug}/"
        L.append(f"— {text(t)}: {url}")

    return "\n".join(L).strip()


def run():
    data = {"pt": knowledge("pt"), "en": knowledge("en")}
    out = ("// Generated by blog/_knowledge.py from the live pages. Do not edit by hand:\n"
           "// change the site and run python3 blog/_build.py.\n"
           "module.exports = " + json.dumps(data, ensure_ascii=False, indent=2) + ";\n")
    os.makedirs(os.path.join(ROOT, "api"), exist_ok=True)
    with open(os.path.join(ROOT, "api", "knowledge.js"), "w", encoding="utf-8") as f:
        f.write(out)
    return data


if __name__ == "__main__":
    d = run()
    print(len(d["pt"]), "chars PT,", len(d["en"]), "chars EN")
