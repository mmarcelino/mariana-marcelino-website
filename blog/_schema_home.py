"""Rebuilds the schema.org graph in index.html and en/index.html from the
content that is visible on each page (services, plans, testimonials), so the
structured data always matches what visitors see.
Run:  python3 blog/_schema_home.py   (also called by blog/_build.py)
"""
import html, json, os, re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SITE = "https://www.mariana-marcelino.com"
LINKEDIN = "https://www.linkedin.com/in/marianamarcelino-frontend-engineer/"
CALENDLY = "https://calendly.com/marianacmarcelino/30min"

# Business details not shown as page copy. Fill in when available:
# a street address or opening hours make LocalBusiness data more useful.
BUSINESS = {
    "addressLocality": "",
    "addressCountry": "PT",
    "openingHours": [],      # e.g. ["Mo-Fr 09:00-18:00"]
    "telephone": "",
}

COPY = {
    "pt": dict(url=f"{SITE}/", lang="pt-PT", plans="Planos", services="Serviços",
               desc="Redesign e desenvolvimento de sites para pequenos negócios: design, automação e IA para atrair visitas e gerar contactos.",
               job="Web designer e developer",
               plan_desc=["Redesign da homepage e relatório personalizado com pontos a otimizar, enviado por email.",
                          "Novo design mantendo a estrutura e os conteúdos atuais, para sites até 4 páginas.",
                          "Design e estrutura à medida, otimização para Google e IA, formulários e questionários, follow-ups automáticos, WhatsApp e painel de métricas. Extras como chatbot com IA à parte."]),
    "en": dict(url=f"{SITE}/en/", lang="en", plans="Plans", services="Services",
               desc="Website redesign and development for small businesses: design, automation and AI to attract visitors and generate enquiries.",
               job="Web designer and developer",
               plan_desc=["Homepage redesign and a personalised report on what to improve, sent by email.",
                          "New design keeping the current structure and content, for websites of up to 4 pages.",
                          "Custom design and structure, optimisation for Google and AI, forms and quizzes, automatic follow-up, WhatsApp and a metrics dashboard. Extras such as an AI chatbot on top."]),
}


def text(fragment):
    return html.unescape(re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", fragment))).strip()


def graph(page, lang):
    c = COPY[lang]
    biz_id, person_id, site_id = f"{SITE}/#business", f"{SITE}/#mariana", f"{SITE}/#website"

    # "O que faço" cards
    cards = re.findall(r'<h3 class="card-title">(.*?)</h3>\s*<p class="p card-desc">(.*?)</p>', page, re.S)
    services = [{
        "@type": "Service",
        "@id": f"{c['url']}#service-{i}",
        "name": text(t),
        "description": text(d),
        "serviceType": text(t),
        "provider": {"@id": biz_id},
        "areaServed": [{"@type": "Country", "name": "Portugal"}, "Worldwide"],
        "availableLanguage": ["pt-PT", "en"],
    } for i, (t, d) in enumerate(cards, 1)]

    # Plans
    # The free redesign (its own block under the plans) comes first, then the paid plans
    free = re.search(r'<article id="free".*?<span class="tier-name">(.*?)</span>', page, re.S)
    names = [text(free.group(1))] + [text(n) for n in re.findall(r'<h3 class="tier-name">(.*?)</h3>', page)]
    prices = ["0", "750", "1800"]
    offers = [{
        "@type": "Offer",
        "name": n,
        "description": c["plan_desc"][i],
        "price": prices[i],
        "priceCurrency": "EUR",
        "url": f"{c['url']}#solutions",
        "seller": {"@id": biz_id},
        "itemOffered": {"@type": "Service", "name": n, "provider": {"@id": biz_id}},
        **({"priceSpecification": {"@type": "PriceSpecification", "minPrice": prices[i], "priceCurrency": "EUR"}} if i == 2 else {}),
    } for i, n in enumerate(names)]

    # Testimonials are not marked up as Review: Google doesn't show review
    # snippets for a business's own testimonials ("self-serving reviews") and
    # flags them as invalid without a star rating, which the page doesn't show.

    address = {"@type": "PostalAddress", "addressCountry": BUSINESS["addressCountry"]}
    if BUSINESS["addressLocality"]:
        address["addressLocality"] = BUSINESS["addressLocality"]

    business = {
        "@type": "ProfessionalService",
        "@id": biz_id,
        "name": "Mariana Marcelino",
        "url": c["url"],
        "description": c["desc"],
        "email": "info@mariana-marcelino.com",
        "image": f"{SITE}/assets/og-image.png",
        "logo": f"{SITE}/assets/icon-512.png",
        "address": address,
        "areaServed": [{"@type": "Country", "name": "Portugal"}, "Worldwide"],
        "availableLanguage": ["pt-PT", "en"],
        "priceRange": "€0–€1800+",
        "founder": {"@id": person_id},
        "sameAs": [LINKEDIN],
        "potentialAction": {"@type": "ReserveAction", "name": "Marcar chamada" if lang == "pt" else "Book a call",
                            "target": CALENDLY},
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": c["plans"], "itemListElement": offers},
        "makesOffer": [{"@type": "Offer", "itemOffered": {"@id": s["@id"]}} for s in services],
        "knowsAbout": ["Web design", "SEO", "Generative engine optimisation", "Conversion rate optimisation",
                       "Marketing automation", "Chatbots", "Structured data"],
    }
    if BUSINESS["openingHours"]:
        business["openingHours"] = BUSINESS["openingHours"]
    if BUSINESS["telephone"]:
        business["telephone"] = BUSINESS["telephone"]

    person = {
        "@type": "Person",
        "@id": person_id,
        "name": "Mariana Marcelino",
        "jobTitle": c["job"],
        "image": f"{SITE}/assets/mariana-about.webp",
        "url": c["url"] + "#about",
        "worksFor": {"@id": biz_id},
        "sameAs": [LINKEDIN],
    }
    website = {
        "@type": "WebSite",
        "@id": site_id,
        "name": "Mariana Marcelino",
        "url": f"{SITE}/",
        "inLanguage": ["pt-PT", "en"],
        "publisher": {"@id": biz_id},
    }
    webpage = {
        "@type": "WebPage",
        "@id": f"{c['url']}#webpage",
        "url": c["url"],
        "inLanguage": c["lang"],
        "isPartOf": {"@id": site_id},
        "about": {"@id": biz_id},
        "primaryImageOfPage": f"{SITE}/assets/og-image.png",
    }
    # FAQ (visible on the page)
    faqs = re.findall(r'<details class="faq-item">\s*<summary>(.*?)</summary>\s*<div class="faq-answer">(.*?)</div>', page, re.S)
    extra = []
    if faqs:
        extra.append({
            "@type": "FAQPage",
            "@id": f"{c['url']}#faq",
            "inLanguage": c["lang"],
            "isPartOf": {"@id": f"{c['url']}#webpage"},
            "about": {"@id": biz_id},
            "mainEntity": [{
                "@type": "Question",
                "name": text(q),
                "acceptedAnswer": {"@type": "Answer", "text": text(a)},
            } for q, a in faqs],
        })
    return {"@context": "https://schema.org", "@graph": [business, person, website, webpage] + services + extra}


def run():
    for rel, lang in (("index.html", "pt"), ("en/index.html", "en")):
        path = os.path.join(ROOT, rel)
        page = open(path, encoding="utf-8").read()
        page = re.sub(r'  <script type="application/ld\+json">.*?</script>\n', "", page, flags=re.S)
        block = f'  <script type="application/ld+json">{json.dumps(graph(page, lang), ensure_ascii=False)}</script>\n'
        page = page.replace("</head>", block + "</head>", 1)
        open(path, "w", encoding="utf-8").write(page)


if __name__ == "__main__":
    run()
    print("schema updated")
