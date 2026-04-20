# Session state — Refonte christinecal.com

> Fichier de reprise pour le prochain chat Claude Code. Lu au démarrage.
> Branche de travail : `claude/continue-session-state-a0X9q`
> Dernière mise à jour : 2026-04-20 (après Vagues 2-3-4)

## Contexte général

Refonte du site de Christine CAL (coach médium) en **site statique unifié** sur `www.christinecal.com` à partir de 3 sites WordPress legacy + contenus `.odt`. Stack : HTML5 + CSS custom + vanilla JS, zéro build, déploiement GitHub Pages / Netlify.

- Architecture : 1 site unifié avec 2 sous-sections `/eveil-a-soi/` (coach médium) et `/eveil-au-soi/` (TELOS/Shasta/multidim)
- Palette : bleu indigo `#3f3d9c`, fond clair `#f8f7f4`
- Typo : Cormorant Garamond (titres) + Inter (corps), via Google Fonts
- Formulaire : Netlify Forms
- Pas de boutique ni blog

## État actuel (commits sur la branche)

```
277a0e3 Add GitHub Actions workflow to rehydrate WordPress media
b7ca99f Extract image URL inventory from WP exports + document media rehydration
bf1be9e Wave 1 — enrich 7 pages with real WordPress content
7c78bf7 Import WordPress XML exports and extract 52 items
f426d8f Restructure into 2 unified sub-sections (eveil-a-soi + eveil-au-soi)
2a236cf Fix portal: remove overlay text, 2 hotspots
b163da6 Rebuild christinecal.com as static site
```

### ✅ Ce qui est fait

**Pages enrichies (Vague 1) :**
- `index.html` (portail avec 2 hotspots)
- `qui-suis-je.html` (bio + histoire médiumnique 1993 + Sud Ouest)
- `eveil-a-soi/index.html` + `consultations.html` + `corps-lumiere-vortex.html`
- `eveil-au-soi/index.html` + `mont-shasta-telos.html` + `retour-du-futur.html` + `bugarach.html`
- `contact.html`, `mentions-legales.html`, `politique-confidentialite.html`, `merci.html`
- Scaffolding `/en/`

**Extraction contenu :**
- `sources/` contient les 2 XML WordPress + les `.odt` originaux
- `sources/wp-extract/` contient 52 fichiers `.md` (33 eveil-a-soi + 19 eveil-au-soi) issus des XML
- `sources/wp-extract/INVENTORY.md` liste tous les extraits avec URLs et tailles
- `sources/wp-extract/image-urls.txt` : 261 URLs d'images uniques
- `sources/wp-extract/image-mapping.json` : 236 mappings attachment ID → URL
- `sources/wp-extract/README-MEDIA.md` : procédure de téléchargement

**Scripts :**
- `sources/scripts/extract_image_urls.py` (lxml, parse WXR)
- `sources/scripts/fetch_wp_media.py` (idempotent downloader avec retries)

**Automation :**
- `.github/workflows/fetch-wp-media.yml` — télécharge les 261 images sur un runner GitHub (le sandbox Claude Code bloque `coach.christkal5d.com` et `www.christinecal-coach-quantique.com` via allowlist). À vérifier dans l'onglet Actions que le run a réussi et commité les images dans `assets/images/wp/`.

**Vagues 2-3-4 (session du 2026-04-20) :**
- `sources/scripts/generate_pages.py` — générateur avec manifest portfolio + pages
- Vague 2 : 19 pages portfolio générées + hub-grids branchés
- Vague 3 : 21 pages secondaires (coaching/faq/presse/partages/témoignages/calendrier)
- Vague 4 : sitemap.xml étendu (~47 URLs)

### ⏳ Ce qui reste à faire

**Relecture éditoriale** — les pages générées auto contiennent encore :
- des balises `<h3>` utilisées comme gras/souligné WP (à convertir en `<p><strong>` selon cas)
- quelques résidus `<img>` avec URLs WP non téléchargées (voir workflow `fetch-wp-media.yml`)
- des liens vers `jeanneracaud.fr`, `debowska.fr`, `christine-coach.com` à valider
- le fichier `coaching-professionnel.html` a été nettoyé mais le contenu éditorial mériterait une passe humaine

**Images WP** — vérifier que le workflow `.github/workflows/fetch-wp-media.yml` a bien rapatrié les 261 images dans `assets/images/wp/` (si non, relancer manuellement depuis l'onglet Actions).

**Ancienne liste — Vague 2 (maintenant faite)**

Créer un script Python `sources/scripts/generate_pages.py` qui :
1. Lit un fichier `.md` dans `sources/wp-extract/`
2. Extrait le titre H1 et la section "HTML Content (raw from WordPress)"
3. Strip les shortcodes WPBakery : `[vc_row]`, `[/vc_row]`, `[vc_column]`, `[/vc_column]`, `[vc_column_text]`, `[/vc_column_text]`, `[vc_cta_button ...]`, `[vc_single_image ...]`, `[vc_facebook ...]`, `[vc_googleplus ...]`, `[vc_tweetmeme ...]`, `[vc_posts_slider ...]`, `[vc_tta_tabs]`, `[vc_tab]`, `[vc_separator ...]`, etc.
4. Strip `<span style="...">` en préservant le contenu (ne pas supprimer la balise globalement, retirer juste l'attribut `style`)
5. Strip `style="color: #...; font-size: ...;"` etc. sur tous les éléments
6. Strip les `<table>` utilisées pour centrer les iframes YouTube, garder juste l'iframe
7. Réécrit les URLs d'images :
   - `http://coach.christkal5d.com/wp-content/uploads/YYYY/MM/file.jpg` → `../assets/images/wp/coach-christkal5d/YYYY/MM/file.jpg`
   - `http://www.christinecal-coach-quantique.com/wp-content/uploads/YYYY/MM/file.jpg` → `../assets/images/wp/coach-quantique/YYYY/MM/file.jpg`
8. Réécrit les liens cross-domain :
   - `http://www.christinecal-coach-medium.com/portfolio/<slug>/` → `<slug-mapping>.html`
   - `/contact` → `../contact.html`
   - `/calendrier-conferences-ateliers/` → `calendrier.html`
   - `/partages` → `partages.html`
9. Wrap dans le template de site (header + footer identiques à `eveil-a-soi/consultations.html`)

**Manifest de pages portfolio** (mettre dans le script ou JSON séparé) :

*eveil-a-soi (14 pages)* :
| Extract | Cible | Eyebrow |
|---|---|---|
| portfolio--estime-de-soi-estime-du-soi | `eveil-a-soi/estime-de-soi.html` | Atelier |
| portfolio--atelier-depasser-sa-peur-et-developper-ses-qualites | `eveil-a-soi/depasser-sa-peur.html` | Atelier |
| portfolio--atelier-rencontre-feminine | `eveil-a-soi/feminin-sacre.html` | Atelier |
| portfolio--atelier-pour-les-hommes-la-femme-mode-demploi | `eveil-a-soi/couple-mode-emploi.html` | Atelier |
| portfolio--atelier-creer-son-couple-ame-soeur | `eveil-a-soi/couple-ame-soeur.html` | Atelier |
| portfolio--stage-eveil-du-champ-quantique-et-activation-de-la-merkaba | `eveil-a-soi/merkaba.html` | Stage |
| portfolio--stage-eveil-du-champ-multidimensionnel-et-pleine-conscience | `eveil-a-soi/champ-multidimensionnel.html` | Stage |
| portfolio--stage-activation-du-champ-vibratoire-du-coeur-avec-la-triple-flamme | `eveil-a-soi/triple-flamme.html` | Stage |
| portfolio--le-voyage-de-l-ame | `eveil-a-soi/voyage-de-l-ame.html` | Conférence |
| portfolio--conscience-expansee-conscience-unifiee | `eveil-a-soi/passage-5eme-dimension.html` | Conférence |
| portfolio--humain-spiritualise-codes-ascensionnels-4d-5d | `eveil-a-soi/humain-spiritualise.html` | Stage |
| portfolio--initiation-aux-flammes-sacrees-avec-les-7-rayons-et-les-maitres-ascensionnes-pou | `eveil-a-soi/flammes-sacrees-7-rayons.html` | Stage |
| portfolio--conference-debat-intelligence-artificielle-et-ethique-humaine | `eveil-a-soi/ia-ethique-humaine.html` | Conférence |
| portfolio--conference-nouveaute | `eveil-a-soi/conference-nouveaute.html` | Conférence |

**Skip** : `portfolio--stages-activation-du-corps-de-lumiere.md` (déjà fait dans `corps-lumiere-vortex.html`)

*eveil-au-soi (5 pages)* :
| Extract | Cible | Eyebrow |
|---|---|---|
| portfolio--stage-telos-et-la-5d | `eveil-au-soi/stage-telos-5d.html` | Stage |
| portfolio--atelier-shasta-a-plazac | `eveil-au-soi/shasta-a-plazac.html` | Stage |
| portfolio--voyage-en-conscience-vers-telos | `eveil-au-soi/voyage-telos.html` | Voyage |
| portfolio--conference-lascension-planetaire-vers-la-5eme-dimension-le-mont-shasta206 | `eveil-au-soi/ascension-planetaire-5d.html` | Conférence |
| portfolio--conf-on-line-intra-terrestres-de-5eme-dimension-leur-role-pour-la-terre-et-lhuma | `eveil-au-soi/intra-terrestres-5d.html` | Conférence |

**Vague 2b — mettre à jour les hub-grids :**
- Dans `eveil-a-soi/index.html`, remplacer les `<div class="hub-card hub-card--coming">` par des `<a class="hub-card" href="...">` pointant vers les nouvelles pages
- Pareil dans `eveil-au-soi/index.html`

**Vague 3 — ~19 pages secondaires (pages `page--*.md`) :**

*eveil-a-soi (11 pages)* :
| Extract | Cible |
|---|---|
| page--coaching-d-eveil-quantique | `eveil-a-soi/coaching-quantique.html` |
| page--coaching-d-eveil-multidimensionnel | `eveil-a-soi/coaching-multidimensionnel.html` |
| page--coaching-d-eveil | `eveil-a-soi/coaching-eveil.html` |
| page--coaching-professionnel-medium | `eveil-a-soi/coaching-professionnel.html` (attention : 555k chars, contenu probablement pollué, à nettoyer agressivement) |
| page--conferences-rencontres | `eveil-a-soi/conferences.html` |
| page--calendrier-conferences-ateliers | `eveil-a-soi/calendrier.html` |
| page--faq-coaching-mediumnite | `eveil-a-soi/faq.html` |
| page--presse | `eveil-a-soi/presse.html` |
| page--partages | `eveil-a-soi/partages.html` |
| page--temoignages-christine-cal | `eveil-a-soi/temoignages.html` |
| page--centre-dexpansion-de-conscience | `eveil-a-soi/centre-expansion.html` |
| page--une-nouvelle-ere-pour-la-terre-de-5eme-dimension | `eveil-a-soi/nouvelle-ere-5d.html` |

**Skip** : `page--home`, `page--contact`, `page--christine-cal-coach-medium`, `page--404-error`, `page--mentions-legales`, `page--coaching-mediumnique-lecture-d-ame` (déjà couvert par consultations.html)

*eveil-au-soi (8 pages)* :
| Extract | Cible |
|---|---|
| page--ateliers-stages-conferences | `eveil-au-soi/ateliers-stages.html` |
| page--calendrier-des-activites-d-eveil-au-soi-mont-shasta | `eveil-au-soi/calendrier.html` |
| page--temoignages | `eveil-au-soi/temoignages.html` |
| page--news-presse | `eveil-au-soi/news-presse.html` |
| page--partages | `eveil-au-soi/partages.html` |
| page--reseau-telos-mondial | `eveil-au-soi/reseau-telos.html` |
| page--voyage-initiatique-au-mont-shasta-2017 | `eveil-au-soi/voyage-mont-shasta.html` |
| page--voyage-en-conscience-vers-telos | `eveil-au-soi/voyage-telos-conscient.html` |
| page--voyage-conscient-vers-telos-2 | `eveil-au-soi/voyage-telos-2.html` |

**Skip** : `page--home`, `page--contact`, `page--le-mont-shasta` (déjà mont-shasta-telos.html), `page--qui-est-christine-cal-medium-5d-telos` (déjà qui-suis-je.html), `page--l-ere-des-revelations` (déjà merged dans retour-du-futur.html)

**Vague 4 — SEO :**
- Mettre à jour `sitemap.xml` pour inclure toutes les nouvelles pages
- Mettre à jour `robots.txt` (ajouter `Disallow: /sources/`)

## Template HTML à utiliser

Se baser sur `eveil-a-soi/consultations.html` (ligne 1-196). Les pages doivent avoir :
- `<head>` : title, description, theme-color `#3f3d9c`, canonical, hreflang FR/EN, Open Graph, Google Fonts Cormorant + Inter, link vers `../assets/css/styles.css`
- Header identique (brand + nav + lang-switch)
- `<main id="main">` avec :
  - `<section class="page-hero">` — eyebrow + h1 + lede
  - Alterner les sections avec et sans `style="background: var(--paper-soft);"` (jamais 2 paper-soft consécutives, jamais 2 sans bg consécutives)
  - Utiliser `<div class="container container--narrow prose">` pour le texte
  - Pour les listes de CTA : `<div class="container"><div class="two-col">...</div></div>`
- Footer identique
- `<script src="../assets/js/main.js" defer></script>`

## Classes CSS disponibles

- `.hub-grid`, `.hub-card`, `.hub-card--coming`, `.hub-card__eyebrow`, `.hub-card__cta`
- `.page-hero`, `.page-hero__lede`, `.eyebrow`
- `.container`, `.container--narrow`
- `.prose` (typo optimisée pour texte long)
- `.two-col` (grid 2 colonnes)
- `.dvd-grid`, `.dvd`, `.dvd__ref`, `.dvd__meta`
- `.btn`, `.btn--primary`, `.btn--large`
- `.text-center`
- `.steps` (liste ordonnée visuellement riche)
- `.highlight` (encart)
- `.social-links`

## Exemple concret de transformation WPBakery → template

**Input** (extract `.md`) :
```
[vc_row][vc_column][vc_column_text]
<h2>L'estime de soi est la rencontre du moi avec le soi.</h2>
<h3><b>Objectifs : </b></h3>
<ul>
  <li>Se libérer des blessures du passé</li>
  ...
</ul>
[/vc_column_text][vc_cta_button call_text="..." title="CONTACTEZ-MOI" href="/contact"][/vc_column][/vc_row]
```

**Output** (page HTML) :
```html
<section>
  <div class="container container--narrow prose">
    <h2>L'estime de soi est la rencontre du moi avec le soi.</h2>
    <h3>Objectifs</h3>
    <ul>
      <li>Se libérer des blessures du passé</li>
      ...
    </ul>
  </div>
</section>

<section style="background: var(--paper-soft);">
  <div class="container container--narrow text-center">
    <h2>Vous souhaitez réserver votre participation à cet atelier ?</h2>
    <p><a href="../contact.html" class="btn btn--primary btn--large">Me contacter</a></p>
  </div>
</section>
```

## Fichiers critiques déjà présents

- `assets/css/styles.css` — design system complet
- `assets/js/main.js` — menu mobile, lang switch
- `assets/images/portal/fond-portail-2021-bleu1200-V2.jpg` — image portail
- `assets/images/dvd/*.jpg` — 7 jaquettes DVD
- `assets/images/christine/IMG-20250502-WA0001.jpg` — portrait
- `assets/images/wp/` — sera peuplé par le workflow GitHub Actions (261 images)

## Questions encore ouvertes avec Christine (non-bloquantes)

- URL **Calendly** (RDV)
- URL chaîne **YouTube** à créer
- Handles réseaux sociaux
- Choix newsletter (Brevo vs Mailchimp)
- Email de contact à afficher
- Validation palette indigo finale
- Logo

## Consignes pour le prochain chat

1. Lire ce fichier en premier, puis `sources/wp-extract/INVENTORY.md`
2. Regarder un extract `.md` (ex: `sources/wp-extract/eveil-a-soi/portfolio--estime-de-soi-estime-du-soi.md`) pour voir le format
3. Regarder `eveil-a-soi/consultations.html` comme référence de template
4. Écrire `sources/scripts/generate_pages.py` avec le manifest inline
5. **Commit par lots de 5-10 pages** pour que Morgan voie l'avancement en direct (il s'est plaint des longs silences)
6. Ne PAS chercher à télécharger les images WP — le workflow GitHub Actions s'en charge
7. Vérifier d'abord via `mcp__github__list_workflow_runs` ou similaire si le workflow `fetch-wp-media.yml` a tourné et rapatrié les images

## Personne à l'autre bout

**Morgan** (intermédiaire technique) pour **Christine CAL** (coach médium, ~60 ans).
Christine veut le site prêt pour sa visibilité croissante (plateforme BEBOODA, DVD, YouTube à venir). Elle a elle-même défini la structure en 6 sections.

## Rappel règles git

- Branche : `claude/christine-cal-website-OIZPX`
- Push avec `git push -u origin claude/christine-cal-website-OIZPX`
- Commits descriptifs (style des commits précédents, FR)
- Ne PAS créer de PR sans demande explicite
