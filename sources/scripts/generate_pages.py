#!/usr/bin/env python3
"""Generate static HTML pages from WP extracts (sources/wp-extract/)."""
from __future__ import annotations
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[2]
EXTRACT = ROOT / "sources" / "wp-extract"

PORTFOLIO_MANIFEST = [
    # eveil-a-soi portfolio
    ("eveil-a-soi/portfolio--estime-de-soi-estime-du-soi.md", "eveil-a-soi/estime-de-soi.html", "Atelier", "Estime de Soi, Estime du Soi"),
    ("eveil-a-soi/portfolio--atelier-depasser-sa-peur-et-developper-ses-qualites.md", "eveil-a-soi/depasser-sa-peur.html", "Atelier", "Dépasser sa peur & développer ses qualités"),
    ("eveil-a-soi/portfolio--atelier-rencontre-feminine.md", "eveil-a-soi/feminin-sacre.html", "Atelier", "Rencontrer son Féminin Sacré"),
    ("eveil-a-soi/portfolio--atelier-pour-les-hommes-la-femme-mode-demploi.md", "eveil-a-soi/couple-mode-emploi.html", "Atelier", "La femme — mode d'emploi (pour les hommes)"),
    ("eveil-a-soi/portfolio--atelier-creer-son-couple-ame-soeur.md", "eveil-a-soi/couple-ame-soeur.html", "Atelier", "Créer son couple âme sœur"),
    ("eveil-a-soi/portfolio--stage-eveil-du-champ-quantique-et-activation-de-la-merkaba.md", "eveil-a-soi/merkaba.html", "Stage", "Éveil du champ quantique & activation de la Merkaba"),
    ("eveil-a-soi/portfolio--stage-eveil-du-champ-multidimensionnel-et-pleine-conscience.md", "eveil-a-soi/champ-multidimensionnel.html", "Stage", "Éveil du champ multidimensionnel & pleine conscience"),
    ("eveil-a-soi/portfolio--stage-activation-du-champ-vibratoire-du-coeur-avec-la-triple-flamme.md", "eveil-a-soi/triple-flamme.html", "Stage", "Activation du champ vibratoire du cœur — Triple Flamme"),
    ("eveil-a-soi/portfolio--le-voyage-de-l-ame.md", "eveil-a-soi/voyage-de-l-ame.html", "Conférence", "Le voyage de l'Âme"),
    ("eveil-a-soi/portfolio--conscience-expansee-conscience-unifiee.md", "eveil-a-soi/passage-5eme-dimension.html", "Conférence", "Conscience expansée, conscience unifiée"),
    ("eveil-a-soi/portfolio--humain-spiritualise-codes-ascensionnels-4d-5d.md", "eveil-a-soi/humain-spiritualise.html", "Stage", "Humain spiritualisé — codes ascensionnels 4D/5D"),
    ("eveil-a-soi/portfolio--initiation-aux-flammes-sacrees-avec-les-7-rayons-et-les-maitres-ascensionnes-pou.md", "eveil-a-soi/flammes-sacrees-7-rayons.html", "Stage", "Initiation aux Flammes Sacrées — 7 Rayons & Maîtres Ascensionnés"),
    ("eveil-a-soi/portfolio--conference-debat-intelligence-artificielle-et-ethique-humaine.md", "eveil-a-soi/ia-ethique-humaine.html", "Conférence", "IA & éthique humaine"),
    ("eveil-a-soi/portfolio--conference-nouveaute.md", "eveil-a-soi/conference-nouveaute.html", "Conférence", "Nouveauté en cours"),
    # eveil-au-soi portfolio
    ("eveil-au-soi/portfolio--stage-telos-et-la-5d.md", "eveil-au-soi/stage-telos-5d.html", "Stage", "Stage TELOS & la 5D"),
    ("eveil-au-soi/portfolio--atelier-shasta-a-plazac.md", "eveil-au-soi/shasta-a-plazac.html", "Stage", "Shasta à Plazac"),
    ("eveil-au-soi/portfolio--voyage-en-conscience-vers-telos.md", "eveil-au-soi/voyage-telos.html", "Voyage", "Voyage en conscience vers TELOS"),
    ("eveil-au-soi/portfolio--conference-lascension-planetaire-vers-la-5eme-dimension-le-mont-shasta206.md", "eveil-au-soi/ascension-planetaire-5d.html", "Conférence", "L'ascension planétaire vers la 5ème dimension — le Mont Shasta"),
    ("eveil-au-soi/portfolio--conf-on-line-intra-terrestres-de-5eme-dimension-leur-role-pour-la-terre-et-lhuma.md", "eveil-au-soi/intra-terrestres-5d.html", "Conférence", "Intra-terrestres de 5ème dimension — leur rôle pour la Terre"),
]

PAGES_MANIFEST = [
    # eveil-a-soi pages
    ("eveil-a-soi/page--coaching-d-eveil-quantique.md", "eveil-a-soi/coaching-quantique.html", "Coaching", "Coaching d'éveil quantique"),
    ("eveil-a-soi/page--coaching-d-eveil-multidimensionnel.md", "eveil-a-soi/coaching-multidimensionnel.html", "Coaching", "Coaching d'éveil multidimensionnel"),
    ("eveil-a-soi/page--coaching-d-eveil.md", "eveil-a-soi/coaching-eveil.html", "Coaching", "Coaching d'éveil"),
    ("eveil-a-soi/page--coaching-professionnel-medium.md", "eveil-a-soi/coaching-professionnel.html", "Coaching", "Coaching professionnel médium"),
    ("eveil-a-soi/page--conferences-rencontres.md", "eveil-a-soi/conferences.html", "Agenda", "Conférences & rencontres"),
    ("eveil-a-soi/page--calendrier-conferences-ateliers.md", "eveil-a-soi/calendrier.html", "Agenda", "Calendrier des conférences & ateliers"),
    ("eveil-a-soi/page--faq-coaching-mediumnite.md", "eveil-a-soi/faq.html", "FAQ", "Questions fréquentes — coaching & médiumnité"),
    ("eveil-a-soi/page--presse.md", "eveil-a-soi/presse.html", "Presse", "Presse"),
    ("eveil-a-soi/page--partages.md", "eveil-a-soi/partages.html", "Partages", "Partages"),
    ("eveil-a-soi/page--temoignages-christine-cal.md", "eveil-a-soi/temoignages.html", "Témoignages", "Témoignages"),
    ("eveil-a-soi/page--centre-dexpansion-de-conscience.md", "eveil-a-soi/centre-expansion.html", "Lieu", "Centre d'Expansion de Conscience"),
    ("eveil-a-soi/page--une-nouvelle-ere-pour-la-terre-de-5eme-dimension.md", "eveil-a-soi/nouvelle-ere-5d.html", "Conférence", "Une nouvelle ère pour la Terre de 5ème dimension"),
    # eveil-au-soi pages
    ("eveil-au-soi/page--ateliers-stages-conferences.md", "eveil-au-soi/ateliers-stages.html", "Agenda", "Ateliers, stages & conférences"),
    ("eveil-au-soi/page--calendrier-des-activites-d-eveil-au-soi-mont-shasta.md", "eveil-au-soi/calendrier.html", "Agenda", "Calendrier des activités d'Éveil au Soi"),
    ("eveil-au-soi/page--temoignages.md", "eveil-au-soi/temoignages.html", "Témoignages", "Témoignages"),
    ("eveil-au-soi/page--news-presse.md", "eveil-au-soi/news-presse.html", "Presse", "News & Presse"),
    ("eveil-au-soi/page--partages.md", "eveil-au-soi/partages.html", "Partages", "Partages"),
    ("eveil-au-soi/page--reseau-telos-mondial.md", "eveil-au-soi/reseau-telos.html", "Réseau", "Réseau TELOS mondial"),
    ("eveil-au-soi/page--voyage-initiatique-au-mont-shasta-2017.md", "eveil-au-soi/voyage-mont-shasta.html", "Voyage", "Voyage initiatique au Mont Shasta"),
    ("eveil-au-soi/page--voyage-en-conscience-vers-telos.md", "eveil-au-soi/voyage-telos-conscient.html", "Voyage", "Voyage en conscience vers TELOS"),
    ("eveil-au-soi/page--voyage-conscient-vers-telos-2.md", "eveil-au-soi/voyage-telos-2.html", "Voyage", "Voyage conscient vers TELOS (2)"),
]


def read_extract(path: Path) -> tuple[str, str, str]:
    text = path.read_text(encoding="utf-8")
    m_title = re.search(r"^# (.+)$", text, re.M)
    title = (m_title.group(1).strip() if m_title else path.stem).replace("Atelier - ", "").replace("Conférence - ", "").replace("Stage - ", "")
    m_excerpt = re.search(r"## Excerpt\n+(.+?)(?=\n## |\Z)", text, re.S)
    excerpt = (m_excerpt.group(1).strip() if m_excerpt else "")
    m_html = re.search(r"## HTML Content \(raw from WordPress\)\n+(.*)$", text, re.S)
    html = m_html.group(1).strip() if m_html else ""
    return title, excerpt, html


def clean_html(html: str) -> str:
    # 1. WPBakery shortcodes with params — strip entirely but keep inner block for some.
    # [vc_row ...], [vc_column ...], [vc_column_text ...], [/vc_*], etc.
    # Open/close tags for container-like shortcodes -> drop (keep content).
    container_open = r"\[(?:vc_row|vc_column|vc_column_text|vc_tta_tabs|vc_tta_section|vc_tab)(?:\s+[^\]]*)?\]"
    container_close = r"\[/(?:vc_row|vc_column|vc_column_text|vc_tta_tabs|vc_tta_section|vc_tab)\]"
    html = re.sub(container_open, "", html)
    html = re.sub(container_close, "", html)

    # Standalone shortcodes — drop entirely
    standalone = r"\[(?:vc_cta_button|vc_btn|vc_single_image|vc_facebook|vc_googleplus|vc_tweetmeme|vc_posts_slider|vc_separator|vc_empty_space|vc_video|vc_gallery|vc_message|vc_raw_html)(?:\s+[^\]]*)?/?\]"
    html = re.sub(standalone, "", html)

    # Closing variants of standalones
    html = re.sub(r"\[/(?:vc_cta_button|vc_btn|vc_single_image|vc_facebook|vc_googleplus|vc_tweetmeme|vc_posts_slider|vc_separator)\]", "", html)

    # Any remaining [vc_xxx ...] or [/vc_xxx]
    html = re.sub(r"\[/?vc_[a-z_]+(?:\s+[^\]]*)?\]", "", html)

    # 1b. Strip generic WordPress shortcodes we don't render (TablePress,
    #     Contact Form 7, caption, etc.). Conservative: only strip shortcodes
    #     that are self-closing `[name ... /]` or pairs on one line.
    html = re.sub(r"\[[a-z_]+(?:\s+[^\[\]]*)?/\]", "", html)
    html = re.sub(r"\[/?(?:table|caption|gallery|embed|audio|video|playlist|contact-form-7|cf7)[^\]]*\]", "", html)

    # 2. Strip style attributes
    html = re.sub(r"\s+style=\"[^\"]*\"", "", html)
    html = re.sub(r"\s+style='[^']*'", "", html)

    # 3. Strip span with only styles (after style removed, span has no attrs)
    html = re.sub(r"<span\s*>", "", html)
    html = re.sub(r"</span>", "", html)

    # 4. Strip <table> used just to center iframes — keep iframe content only
    def unwrap_iframe_table(match: re.Match) -> str:
        inner = match.group(0)
        m = re.search(r"<iframe[^>]*>\s*</iframe>", inner, re.S)
        return f'<p class="text-center">{m.group(0)}</p>' if m else ""
    html = re.sub(r"<table[^>]*>.*?</table>", unwrap_iframe_table, html, flags=re.S)

    # 5. Fix iframe URLs that start with //
    html = re.sub(r'src="//', 'src="https://', html)

    # 6. Rewrite image URLs
    html = re.sub(
        r"https?://coach\.christkal5d\.com/wp-content/uploads/",
        "../assets/images/wp/coach-christkal5d/",
        html,
    )
    html = re.sub(
        r"https?://www\.christinecal-coach-quantique\.com/wp-content/uploads/",
        "../assets/images/wp/coach-quantique/",
        html,
    )
    html = re.sub(
        r"https?://www\.christinecal-coach-medium\.com/wp-content/uploads/",
        "../assets/images/wp/coach-medium/",
        html,
    )
    html = re.sub(
        r"https?://christine-coach\.com/wp-content/uploads/",
        "../assets/images/wp/christine-coach/",
        html,
    )

    # 7. Rewrite cross-domain links
    html = re.sub(
        r"https?://www\.christinecal-coach-medium\.com/calendrier-conferences-ateliers/?",
        "calendrier.html",
        html,
    )
    html = re.sub(
        r"https?://www\.christinecal-coach-quantique\.com/calendrier-des-activites-d-eveil-au-soi-mont-shasta/?",
        "calendrier.html",
        html,
    )
    html = re.sub(
        r"https?://www\.christinecal-coach-medium\.com/portfolio/([a-z0-9-]+)/?",
        r"\1.html",
        html,
    )
    html = re.sub(
        r"https?://www\.christinecal-coach-quantique\.com/portfolio/([a-z0-9-]+)/?",
        r"\1.html",
        html,
    )
    # 7b. Common page slug mappings (WP → new site)
    WP_PAGE_MAP = {
        "une-nouvelle-ere-pour-la-terre-de-5eme-dimension": "nouvelle-ere-5d.html",
        "coaching-d-eveil-quantique": "coaching-quantique.html",
        "coaching-d-eveil-multidimensionnel": "coaching-multidimensionnel.html",
        "coaching-d-eveil": "coaching-eveil.html",
        "coaching-professionnel-medium": "coaching-professionnel.html",
        "conferences-rencontres": "conferences.html",
        "faq-coaching-mediumnite": "faq.html",
        "temoignages-christine-cal": "temoignages.html",
        "centre-dexpansion-de-conscience": "centre-expansion.html",
        "reseau-telos-mondial": "reseau-telos.html",
        "voyage-initiatique-au-mont-shasta-2017": "voyage-mont-shasta.html",
        "ateliers-stages-conferences": "ateliers-stages.html",
        "news-presse": "news-presse.html",
        "presse": "presse.html",
        "partages": "partages.html",
        "temoignages": "temoignages.html",
        "le-mont-shasta": "../eveil-au-soi/mont-shasta-telos.html",
        "qui-est-christine-cal-medium-5d-telos": "../qui-suis-je.html",
    }
    for slug, target in WP_PAGE_MAP.items():
        html = re.sub(
            rf"https?://(?:www\.)?christinecal-coach-(?:medium|quantique)\.com/{re.escape(slug)}/?",
            target,
            html,
        )
    html = re.sub(r'href="/contact/?"', 'href="../contact.html"', html)
    html = re.sub(r'href="/partages/?"', 'href="partages.html"', html)
    # Drop any remaining christinecal-coach-*.com links that we couldn't map —
    # convert them to plain text (unwrap the anchor).
    html = re.sub(
        r'<a[^>]*href="https?://(?:www\.)?christinecal-coach-(?:medium|quantique)\.com[^"]*"[^>]*>(.*?)</a>',
        r"\1",
        html,
        flags=re.S,
    )
    # Same for the old christine-coach.com sub-pages.
    html = re.sub(
        r'<a[^>]*href="https?://(?:www\.)?christine-coach\.com[^"]*"[^>]*>(.*?)</a>',
        r"\1",
        html,
        flags=re.S,
    )

    # 8. Drop <img> tags with base64 data URLs (pollution from WP exports)
    html = re.sub(r'<img[^>]*src="data:[^"]*"[^>]*/?>', "", html)

    # 8b. Strip WP-specific <img> cruft classes ("wp-image-NNN", "size-...",
    #     "align..." is kept because our CSS uses it). Also drop width/height
    #     attributes so the CSS max-width rules apply cleanly.
    html = re.sub(r'\s*(?:wp-image-\d+|size-(?:thumbnail|medium|large|full))', "", html)
    html = re.sub(r'\s+class="\s*"', "", html)
    html = re.sub(r'<img([^>]*)\s+(?:width|height)="[^"]*"', r'<img\1', html)

    # 8c. Remove inline <h1> — the page hero already provides the single H1
    html = re.sub(r"<h1[^>]*>(.*?)</h1>", r"<h2>\1</h2>", html, flags=re.S)

    # 8d. Convert "pseudo-H3" into a paragraph when WP used h3 as a bold
    #     emphasis block rather than a real subheading. Heuristics:
    #     - fully wrapped in <strong>/<b> → unwrap into <p><strong>
    #     - plain-text content longer than 100 chars → demote to <p>
    #     - contains a sentence-like pattern (". " mid-text) → demote to <p>
    def pseudo_h3_to_p(m: re.Match) -> str:
        inner = m.group(1).strip()
        only_strong = re.fullmatch(r"<(?:strong|b)>(.*)</(?:strong|b)>", inner, re.S)
        if only_strong:
            return f"<p><strong>{only_strong.group(1).strip()}</strong></p>"
        plain = re.sub(r"<[^>]+>", "", inner).strip()
        if len(plain) > 100 or re.search(r"[a-zéèàù],? [a-zéèàù]", plain, re.I) and ". " in plain:
            return f"<p>{inner}</p>"
        return m.group(0)
    html = re.sub(r"<h3[^>]*>(.*?)</h3>", pseudo_h3_to_p, html, flags=re.S)

    # 9. Drop empty anchors that were wrapping images
    html = re.sub(r"<a[^>]*>\s*</a>", "", html)

    # 9b. Unwrap <a> that only wraps an <img> and points to the same image
    #     (WP "click to view full size") — keep just the img.
    html = re.sub(
        r'<a[^>]*href="([^"]+)"[^>]*>\s*(<img[^>]*src="\1"[^>]*/?>)\s*</a>',
        r"\2",
        html,
    )
    # General unwrap: <a href="...image..."><img ...></a> → <img ...>
    html = re.sub(
        r'<a[^>]*href="[^"]+\.(?:jpg|jpeg|png|gif|webp)"[^>]*>\s*(<img[^>]*/?>)\s*</a>',
        r"\1",
        html,
        flags=re.IGNORECASE,
    )

    # 10. Drop empty headings
    html = re.sub(r"<h[1-6][^>]*>\s*</h[1-6]>", "", html)

    # 10b. Testimonial-style runs: split adjacent quoted passages so each
    #      becomes its own paragraph. WP exports often concatenate them.
    html = re.sub(r'""\s*(?=[A-Z«"])', '"\n\n"', html)       # ""X → new para
    html = re.sub(r'"\."\s*(?=[A-Z«"])', '".\n\n"', html)   # "."X → split on period-between-quotes
    html = re.sub(r'(\w\.)"(?=[A-Z«"])', r'\1"\n\n', html)  # word."X → new para
    html = re.sub(r'(!")\s+"(?=[A-Z])', r'\1\n\n"', html)   # !" "X → new para
    html = re.sub(r'(\?")\s+"(?=[A-Z])', r'\1\n\n"', html)   # ?" "X → new para

    # 11. Normalize whitespace
    html = re.sub(r"\n{3,}", "\n\n", html).strip()

    # 12. Auto-wrap loose text in <p> (simplified wpautop). WP exports often
    #     contain bare lines separated by blank lines that should be paragraphs.
    html = wpautop(html)

    # 13. Drop empty / near-empty paragraphs: <p>"</p>, <p>&nbsp;</p>, <p></p>
    html = re.sub(r'<p>\s*(?:"|&nbsp;|\s)*\s*</p>', "", html)
    html = re.sub(r"\n{3,}", "\n\n", html)

    return html


BLOCK_TAGS = (
    "h1", "h2", "h3", "h4", "h5", "h6",
    "p", "ul", "ol", "li", "table", "thead", "tbody", "tr", "td", "th",
    "section", "div", "blockquote", "figure", "iframe", "pre",
    "header", "footer", "article", "aside", "nav",
    "hr",
)


_BLOCK_OPEN_RE = re.compile(
    r"^\s*<(?:" + "|".join(BLOCK_TAGS) + r")(?:\s|>|/>)",
    re.IGNORECASE,
)
_BLOCK_CLOSE_RE = re.compile(
    r"</(?:" + "|".join(BLOCK_TAGS) + r")>\s*$",
    re.IGNORECASE,
)


def wpautop(html: str) -> str:
    """Wrap loose text in <p>. A "loose" line is one that neither starts with
    a block-level opening tag nor ends with a block-level closing tag. Blank
    lines separate paragraphs. Never wrap block elements in <p>."""
    lines = html.split("\n")
    out: list[str] = []
    buf: list[str] = []

    def flush() -> None:
        if not buf:
            return
        text = " ".join(l.strip() for l in buf if l.strip())
        if text:
            out.append(f"<p>{text}</p>")
        buf.clear()

    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush()
            continue
        is_block = bool(_BLOCK_OPEN_RE.match(stripped) or _BLOCK_CLOSE_RE.search(stripped))
        if is_block:
            flush()
            out.append(stripped)
        else:
            buf.append(stripped)
    flush()
    return "\n".join(out)


def split_sections(content_html: str) -> list[str]:
    """Split cleaned HTML into logical sections on <h2>. Fallback to <h3> if
    no <h2> exists so the page doesn't render as one giant block."""
    has_h2 = re.search(r"<h2[\s>]", content_html) is not None
    splitter = r"(?=<h2[\s>])" if has_h2 else r"(?=<h3[\s>])"
    parts = re.split(splitter, content_html)
    parts = [p.strip() for p in parts if p.strip()]
    return parts


def build_page(target: str, eyebrow: str, title: str, excerpt: str, content_html: str) -> str:
    depth = target.count("/")
    base = "../" * depth
    sections = split_sections(content_html)
    section_html_parts: list[str] = []
    for i, part in enumerate(sections):
        bg = " style=\"background: var(--paper-soft);\"" if i % 2 == 1 else ""
        section_html_parts.append(
            f'<section{bg}>\n  <div class="container container--narrow prose">\n{part}\n  </div>\n</section>'
        )
    # CTA at the end
    bg_final = " style=\"background: var(--paper-soft);\"" if len(sections) % 2 == 1 else ""
    section_html_parts.append(
        f'<section{bg_final}>\n  <div class="container container--narrow text-center">\n    <h2>Envie d\'en savoir plus&nbsp;?</h2>\n    <p><a href="{base}contact.html" class="btn btn--primary btn--large">Me contacter</a></p>\n  </div>\n</section>'
    )

    body_sections = "\n\n".join(section_html_parts)
    og_desc = (excerpt[:180].replace('"', "&quot;") if excerpt else title)
    slug_dir = target.split("/")[0] if "/" in target else ""
    lang_fr_href = target.split("/")[-1]
    return f"""<!doctype html>
<html lang="fr">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>{title} — Christine CAL</title>
    <meta name="description" content="{og_desc}">
    <meta name="theme-color" content="#3f3d9c">
    <link rel="canonical" href="https://www.christinecal.com/{target}">
    <link rel="alternate" hreflang="fr" href="https://www.christinecal.com/{target}">
    <link rel="alternate" hreflang="en" href="https://www.christinecal.com/en/">
    <meta property="og:title" content="{title} — Christine CAL">
    <meta property="og:description" content="{og_desc}">
    <meta property="og:type" content="website">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;1,400&family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
    <link rel="stylesheet" href="{base}assets/css/styles.css">
</head>
<body>

<header class="site-header">
    <div class="container">
        <a href="{base}index.html" class="brand">Christine CAL<span>Éveil à sa multidimensionnalité</span></a>
        <button class="nav-toggle" aria-expanded="false" aria-controls="main-nav" aria-label="Menu">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <line x1="4" y1="7"  x2="20" y2="7"/>
                <line x1="4" y1="12" x2="20" y2="12"/>
                <line x1="4" y1="17" x2="20" y2="17"/>
            </svg>
        </button>
        <nav class="main-nav" id="main-nav" aria-label="Principal">
            <ul>
                <li><a href="{base}qui-suis-je.html">Qui suis-je</a></li>
                <li><a href="{base}eveil-a-soi/"{' aria-current="page"' if slug_dir=='eveil-a-soi' else ''}>Éveil à Soi</a></li>
                <li><a href="{base}eveil-au-soi/"{' aria-current="page"' if slug_dir=='eveil-au-soi' else ''}>Éveil au Soi</a></li>
                <li><a href="{base}contact.html">Contact</a></li>
            </ul>
            <div class="lang-switch" aria-label="Langue">
                <a href="{lang_fr_href}" aria-current="true">FR</a>
                <a href="{base}en/">EN</a>
            </div>
        </nav>
    </div>
</header>

<main id="main">

<section class="page-hero">
    <div class="container">
        <span class="eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {f'<p class="page-hero__lede">{excerpt}</p>' if excerpt else ''}
    </div>
</section>

{body_sections}

</main>

<footer class="site-footer">
    <div class="container">
        <div class="footer-grid">
            <div>
                <h4>Christine CAL</h4>
                <p>Coach médiumnique · Conférencière<br>Éveil à sa multidimensionnalité</p>
            </div>
            <div>
                <h4>Navigation</h4>
                <ul>
                    <li><a href="{base}qui-suis-je.html">Qui suis-je</a></li>
                    <li><a href="{base}eveil-a-soi/">Éveil à Soi</a></li>
                    <li><a href="{base}eveil-au-soi/">Éveil au Soi</a></li>
                    <li><a href="{base}contact.html">Contact</a></li>
                </ul>
            </div>
            <div>
                <h4>Contact</h4>
                <p><a href="tel:+33680428591">06&nbsp;80&nbsp;42&nbsp;85&nbsp;91</a></p>
                <p><a href="{base}contact.html">Formulaire &amp; RDV</a></p>
            </div>
            <div>
                <h4>Suivre</h4>
                <ul class="social-links">
                    <li><a href="#" aria-label="YouTube" title="YouTube — lien à venir"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.5 12 3.5 12 3.5s-7.505 0-9.377.55A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136C4.495 20.5 12 20.5 12 20.5s7.505 0 9.377-.55a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.546 15.568V8.432L15.818 12l-6.272 3.568z"/></svg></a></li>
                </ul>
            </div>
        </div>
        <div class="footer-bottom">
            <span>© <span>2026</span> Christine CAL — Tous droits réservés</span>
            <span>
                <a href="{base}mentions-legales.html">Mentions légales</a> ·
                <a href="{base}politique-confidentialite.html">Politique de confidentialité</a>
            </span>
        </div>
    </div>
</footer>

<script src="{base}assets/js/main.js" defer></script>
</body>
</html>
"""


def generate(manifest: list[tuple], label: str) -> None:
    for source, target, eyebrow, nice_title in manifest:
        src_path = EXTRACT / source
        if not src_path.exists():
            print(f"[SKIP] {source} (missing)")
            continue
        title, excerpt, raw_html = read_extract(src_path)
        # Override title with nice_title from manifest for clean headings
        cleaned = clean_html(raw_html)
        out_path = ROOT / target
        out_path.parent.mkdir(parents=True, exist_ok=True)
        out_path.write_text(build_page(target, eyebrow, nice_title, excerpt, cleaned), encoding="utf-8")
        print(f"[{label}] {target}")


def main() -> None:
    mode = sys.argv[1] if len(sys.argv) > 1 else "all"
    if mode in ("portfolio", "all"):
        generate(PORTFOLIO_MANIFEST, "PORTFOLIO")
    if mode in ("pages", "all"):
        generate(PAGES_MANIFEST, "PAGE")


if __name__ == "__main__":
    main()
