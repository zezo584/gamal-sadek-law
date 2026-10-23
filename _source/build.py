# -*- coding: utf-8 -*-
"""Static site generator: renders AR (root) + EN (/en/) pages, sitemap, robots, manifest.
Run:  python build.py   (from the build/ folder). Output goes to ../site
Change DOMAIN below to the real domain before publishing."""
import json, os, re, shutil
from jinja2 import Environment, FileSystemLoader
import content as C

DOMAIN = "https://www.gamalsadeklaw.com"   # <-- غيّر هذا إلى نطاق الموقع الحقيقي
HERE = os.path.dirname(os.path.abspath(__file__))
OUT = os.path.join(HERE, "..")
MAP_Q = "27 شارع المعتمدية الرئيسي، المعتمدية، الجيزة، مصر"

def svg(d, vb="0 0 24 24", extra=""):
    return f'<svg viewBox="{vb}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" {extra}>{d}</svg>'

ICONS = {
    "formation": svg('<path d="M3 21h18M4 10h16M12 3 4 7v3h16V7z"/><path d="M6 10v8M10 10v8M14 10v8M18 10v8M4 18h16"/>'),
    "contracts": svg('<path d="M14 3H6a1 1 0 0 0-1 1v16a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V8z"/><path d="M14 3v5h5M8 13h8M8 17h5"/><path d="m15.5 19.5 4-4 1.5 1.5-4 4H15.5z"/>'),
    "civil": svg('<path d="M12 3v18M7 21h10M5 7h14M12 4.5 5 7l-3 7a3 3 0 0 0 6 0L5 7M19 7l-3 7a3 3 0 0 0 6 0l-3-7"/>'),
    "criminal": svg('<path d="m14 4 6 6M11 7l6 6M12.5 5.5l-4 4M18.5 11.5l-4 4M11 11 4 18l2 2 7-7M3 21h8"/>'),
    "family": svg('<path d="M3 11 12 4l9 7M5 10v10h14V10"/><circle cx="10" cy="13" r="1.6"/><circle cx="14.5" cy="13.5" r="1.3"/><path d="M7.5 20v-2.5a2.5 2.5 0 0 1 5 0V20M12.5 20v-2a2 2 0 0 1 4 0v2"/>'),
    "affairs": svg('<rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2M3 12h18M11 12v2h2v-2"/>'),
    "residency": svg('<rect x="5" y="3" width="14" height="18" rx="1.5"/><circle cx="12" cy="10" r="3"/><path d="M9 10h6M12 7c-1 1.6-1 4.4 0 6M12 7c1 1.6 1 4.4 0 6M9 17h6"/>'),
    "diploma": svg('<path d="M3 5h18v11H3z"/><path d="M7 9h10M7 12h6"/><circle cx="17" cy="16" r="2.5"/><path d="m15.5 18-.5 3 2-1 2 1-.5-3"/>'),
    "handshake": svg('<path d="m11 17 2 2a1.4 1.4 0 0 0 2-2"/><path d="m14 14 2.5 2.5a1.4 1.4 0 0 0 2-2L15 11l-3 1a2 2 0 0 1-2-3l3-3h3l5 5M3 11l5-5h3"/><path d="m3 11 7 7a1.4 1.4 0 0 0 2-2"/>'),
    "arrow": svg('<path d="M5 12h14M13 6l6 6-6 6"/>', extra='class="ico-arrow"'),
    "chev": svg('<path d="m9 6 6 6-6 6"/>', extra='class="ico-chev"'),
    "play": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M8 5.5v13a.8.8 0 0 0 1.2.7l10.4-6.5a.8.8 0 0 0 0-1.4L9.2 4.8A.8.8 0 0 0 8 5.5z"/></svg>',
    "pin": svg('<path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.5"/>'),
    "phone": svg('<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2"/>'),
    "mail": svg('<rect x="3" y="5" width="18" height="14" rx="1.5"/><path d="m3 7 9 6 9-6"/>'),
    "whatsapp": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M17.5 14.4c-.3-.1-1.8-.9-2-1-.3-.1-.5-.1-.7.1-.2.3-.8 1-.9 1.2-.2.2-.3.2-.6.1-.3-.1-1.3-.5-2.4-1.5-.9-.8-1.5-1.8-1.7-2.1-.2-.3 0-.5.1-.6l.4-.5c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.1.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2-1.4.2-.7.2-1.3.2-1.4-.1-.2-.3-.3-.6-.4zM12 21.8c-1.8 0-3.5-.5-5-1.4l-.4-.2-3.7 1 1-3.6-.2-.4A9.8 9.8 0 1 1 12 21.8zm8.4-18.2A11.8 11.8 0 0 0 1.7 17.9L0 24l6.3-1.7a11.8 11.8 0 0 0 5.7 1.4A11.8 11.8 0 0 0 20.4 3.6z"/></svg>',
    "facebook": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.9.3-1.5 1.5-1.5h1.5V4.4a20 20 0 0 0-2.2-.1c-2.2 0-3.7 1.3-3.7 3.8v2.4H8v3h2.6V21z"/></svg>',
    "instagram": svg('<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/>'),
    "tiktok": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M16.6 3h-3.1v12.3a2.7 2.7 0 1 1-2.7-2.7c.3 0 .6 0 .8.1V9.5a5.9 5.9 0 1 0 5 5.8V9.1a7.6 7.6 0 0 0 4.4 1.4V7.4a4.4 4.4 0 0 1-4.4-4.4z"/></svg>',
    "youtube": '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M23 7.2a3 3 0 0 0-2.1-2.1C19 4.6 12 4.6 12 4.6s-7 0-8.9.5A3 3 0 0 0 1 7.2 31 31 0 0 0 .5 12a31 31 0 0 0 .5 4.8 3 3 0 0 0 2.1 2.1c1.9.5 8.9.5 8.9.5s7 0 8.9-.5a3 3 0 0 0 2.1-2.1 31 31 0 0 0 .5-4.8 31 31 0 0 0-.5-4.8zM9.7 15V9l5.8 3z"/></svg>',
}

PAGES = {  # (lang, page) -> path relative to site root
    ("ar", "home"): "index.html",
    ("en", "home"): "en/index.html",
    ("ar", "formation"): "company-formation/index.html",
    ("en", "formation"): "en/company-formation/index.html",
}
CLEAN = {k: "/" + v.replace("index.html", "") for k, v in PAGES.items()}

def rel(from_path, to_path):
    depth = from_path.count("/")
    return "../" * depth + to_path

def schema_for(lang, page, t):
    url = DOMAIN + CLEAN[(lang, page)]
    org_id = DOMAIN + "/#organization"
    person = {
        "@type": "Person", "@id": DOMAIN + "/#gamal",
        "name": "جمال عبدالناصر صادق" if lang == "ar" else "Gamal Abdel Nasser Sadek",
        "alternateName": ["Gamal Abdel Nasser Sadek", "جمال عبدالناصر صادق"],
        "jobTitle": "محامٍ ومستشار قانوني" if lang == "ar" else "Lawyer & Legal Counselor",
        "image": DOMAIN + "/assets/img/gamal-portrait.jpg",
        "worksFor": {"@id": org_id},
        "knowsAbout": ["Company formation", "Contract drafting", "Civil law", "Criminal law", "Family law"],
        "hasCredential": [{"@type": "EducationalOccupationalCredential", "name": d} for d in t["about"]["dipl"]],
        "sameAs": list(C.SOCIAL.values()),
    }
    org = {
        "@type": ["LegalService", "Attorney"], "@id": org_id,
        "name": t["brand_full"], "alternateName": [C.AR["brand_full"], C.EN["brand_full"]],
        "description": t["home"]["desc"], "url": DOMAIN + "/",
        "logo": DOMAIN + "/assets/img/icon-512.png", "image": DOMAIN + "/assets/img/og-image.jpg",
        "telephone": C.PHONE_INTL, "email": C.EMAIL,
        "address": {"@type": "PostalAddress", "streetAddress": t["contact"]["address"], "addressCountry": "EG"},
        "areaServed": {"@type": "Country", "name": "Egypt"},
        "founder": {"@id": DOMAIN + "/#gamal"}, "employee": {"@id": DOMAIN + "/#gamal"},
        "sameAs": list(C.SOCIAL.values()),
        "knowsLanguage": ["ar", "en"],
        "hasOfferCatalog": {"@type": "OfferCatalog", "name": t["services"]["eyebrow"],
            "itemListElement": [{"@type": "Offer", "itemOffered": {"@type": "Service", "name": s[1], "description": s[2]}} for s in t["services"]["items"]]},
        "contactPoint": {"@type": "ContactPoint", "telephone": C.PHONE_INTL, "contactType": "customer service", "availableLanguage": ["Arabic", "English"]},
    }
    graph = [org, person, {"@type": "WebSite", "@id": DOMAIN + "/#website", "url": DOMAIN + "/", "name": t["brand_full"], "inLanguage": ["ar", "en"], "publisher": {"@id": org_id}}]
    if page == "home":
        graph.append({"@type": "WebPage", "@id": url + "#webpage", "url": url, "name": t["home"]["title"], "inLanguage": lang, "isPartOf": {"@id": DOMAIN + "/#website"}, "about": {"@id": org_id}})
        for co in t["academy"]["courses"]:
            graph.append({"@type": "Course", "name": co[0], "description": co[1], "inLanguage": lang,
                          "provider": {"@id": org_id}, "teaches": co[2]})
    else:
        graph.append({"@type": "Service", "name": t["fp"]["h1"], "serviceType": "Company formation",
                      "description": t["fp"]["desc"], "provider": {"@id": org_id}, "areaServed": "EG", "url": url})
        graph.append({"@type": "FAQPage", "mainEntity": [{"@type": "Question", "name": q, "acceptedAnswer": {"@type": "Answer", "text": a}} for q, a in t["fp"]["faq"]]})
        graph.append({"@type": "BreadcrumbList", "itemListElement": [
            {"@type": "ListItem", "position": 1, "name": t["nav"][0][1], "item": DOMAIN + CLEAN[(lang, "home")]},
            {"@type": "ListItem", "position": 2, "name": t["fp"]["crumb"], "item": url}]})
    return json.dumps({"@context": "https://schema.org", "@graph": graph}, ensure_ascii=False).replace("</", "<\\/")

def build():
    env = Environment(loader=FileSystemLoader(os.path.join(HERE, "templates")), autoescape=True,
                      trim_blocks=True, lstrip_blocks=True)
    for (lang, page), path in PAGES.items():
        t = C.LANGS[lang]
        other = "en" if lang == "ar" else "ar"
        u = {
            "home": rel(path, PAGES[(lang, "home")]),
            "formation": rel(path, PAGES[(lang, "formation")]),
            "other": rel(path, PAGES[(other, page)]),
            "home_anchor": "" if page == "home" else rel(path, PAGES[(lang, "home")]),
        }
        meta = {
            "title": t["home"]["title"] if page == "home" else t["fp"]["title"],
            "desc": t["home"]["desc"] if page == "home" else t["fp"]["desc"],
            "keywords": t["home"]["keywords"],
            "canonical": DOMAIN + CLEAN[(lang, page)],
            "alt_ar": DOMAIN + CLEAN[("ar", page)], "alt_en": DOMAIN + CLEAN[("en", page)],
        }
        i18n = {
            "lang": lang, "dir": t["dir"],
            "media": t["media"], "contact": {k: v for k, v in t["contact"].items() if k.startswith(("f_", "wa_", "copied"))},
        }
        tpl = env.get_template(page + ".html.j2")
        html = tpl.render(t=t, c=C, u=u, meta=meta, root="../" * path.count("/"), page=page,
                          icons=ICONS, clients=C.CLIENTS[lang], domain=DOMAIN, map_q=MAP_Q,
                          schema=schema_for(lang, page, t),
                          i18n=json.dumps(i18n, ensure_ascii=False).replace("</", "<\\/"))
        html = re.sub(r"\n\s*\n+", "\n", html)
        dest = os.path.join(OUT, path)
        os.makedirs(os.path.dirname(dest), exist_ok=True)
        open(dest, "w", encoding="utf-8").write(html)
        print("built", path, len(html))

    # sitemap / robots / manifest
    urls = []
    for page in ("home", "formation"):
        for lang in ("ar", "en"):
            alts = "".join(f'\n    <xhtml:link rel="alternate" hreflang="{l}" href="{DOMAIN}{CLEAN[(l, page)]}"/>' for l in ("ar", "en"))
            urls.append(f'  <url>\n    <loc>{DOMAIN}{CLEAN[(lang, page)]}</loc>{alts}\n    <changefreq>monthly</changefreq>\n    <priority>{"1.0" if page == "home" and lang == "ar" else "0.9"}</priority>\n  </url>')
    open(os.path.join(OUT, "sitemap.xml"), "w", encoding="utf-8").write(
        '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n' + "\n".join(urls) + "\n</urlset>\n")
    open(os.path.join(OUT, "robots.txt"), "w", encoding="utf-8").write(f"User-agent: *\nAllow: /\n\nSitemap: {DOMAIN}/sitemap.xml\n")
    json.dump({"name": C.AR["brand_full"], "short_name": "جمال صادق", "lang": "ar", "dir": "rtl",
               "start_url": "/", "display": "standalone", "background_color": "#111111", "theme_color": "#111111",
               "icons": [{"src": "assets/img/icon-180.png", "sizes": "180x180", "type": "image/png"},
                         {"src": "assets/img/icon-512.png", "sizes": "512x512", "type": "image/png"}]},
              open(os.path.join(OUT, "site.webmanifest"), "w", encoding="utf-8"), ensure_ascii=False, indent=1)

if __name__ == "__main__":
    build()
