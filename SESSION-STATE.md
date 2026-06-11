# Session state — Refonte christinecal.com

> ⚠️ **2026-06-11 — NOUVELLE PHASE : refonte V2.** Christine a fait refaire le site
> en WordPress par un ami ; on va le remplacer par une V2 moderne (Astro, trilingue
> FR/EN/PL, GSAP). **Toute la marche à suivre est dans `REFONTE-V2.md`** — le lire
> en premier. Prototype V2 : code dans `v2-src/`, build servi sur
> https://website-christinecal.vercel.app/v2/. Le contenu de ce fichier ci-dessous
> documente la v1 (contexte, contacts, décisions) et reste valable comme référence.

> Fichier de reprise pour le prochain chat Claude Code. Lu au démarrage.
> Branche de travail : `main` (depuis 2026-04-27 — tout a été mergé dans main pour simplifier la migration Vercel)
> Dernière mise à jour : 2026-04-27 (migration Netlify → Vercel suite à limite de bande passante atteinte)
> **Preview en ligne** : https://website-christinecal.vercel.app/ (Vercel, branche prod = `main`)
> **Ancienne preview Netlify** : https://astounding-cannoli-c11c6a.netlify.app/ (limite atteinte, abandonnée)

## Contexte général

Refonte du site de Christine CAL (coach médium) en **site statique unifié** sur `www.christinecal.com` à partir de 3 sites WordPress legacy + contenus `.odt`. Stack : HTML5 + CSS custom + vanilla JS, zéro build, déployé sur Vercel (preview temporaire — l'hébergeur final sera choisi quand le site sera validé par Christine).

- Architecture : 1 site unifié avec 2 sous-sections `/eveil-a-soi/` (coach médium) et `/eveil-au-soi/` (TELOS/Shasta/multidim)
- Palette : bleu indigo `#3f3d9c`, fond clair `#f8f7f4`, fond cosmique indigo étoilé site-wide
- Typo : Cormorant Garamond (titres) + Inter (corps), via Google Fonts
- Formulaire : Netlify Forms toujours câblé dans `contact.html` (`data-netlify="true"`) — **inerte sur Vercel**, à remplacer par Formspree/Web3Forms/serverless quand on choisira l'hébergeur final
- Pas de boutique ni blog

## État actuel (derniers commits sur `claude/continue-session-state-a0X9q`)

```
04cee04 Strengthen cosmic theme + add 2 YouTube videos to Qui suis-je
befd91f Revert portal to original image + apply site-wide cosmic theme
8f97d6a Rewrite Qui suis-je with Christine's new concise bullet-style text
2e6388c Redesign portal: indigo night-sky with CSS stars, no rose/yellow
7c345d2 Address Christine's feedback: RGPD, copy deterrents, SEO
431d24a Replace /en/ placeholder with a clean coming-soon page
74c9adf Fix qui-suis-je nav highlight + replace portrait with pro Sony shot
a66821e Add Netlify config + deploy notice for staging preview
5b8d6ab Update SESSION-STATE with Wave 5 polish checklist
e213dc3 Add a custom 404 page with hub-style navigation fallback
eb5db99 Add back-link from generated pages to their sub-section hub + CSS
0fda37a Polish: a11y H1 on portal, unwrap h2><img>, center iframes
041e1f9 Add hero banner image to the two sub-section hub pages
661d23d Further generator cleanup: strip non-vc shortcodes, split testimonials
6924f5d Improve generator: wpautop, demote pseudo-H3/H1, strip WP class cruft
5914dc5 Add CSS rules for WP-imported image alignment
ce83539 Strip 17 broken <img> tags pointing to 10 unfetchable legacy URLs
702f561 Merge branch's rehydrated media (github-actions[bot])
ebbd6bc Merge main + remove duplicate root-level WP XML files
```

**main** a reçu les commits workflow + image-urls.txt + le workflow a tourné avec succès (209/261 images rapatriées) et ses améliorations :
```
0cdc666 Soften fetch-wp-media workflow + add host diagnostics
af9287e Add GitHub Actions workflow to rehydrate WordPress media
e909ecd Extract image URL inventory from WP exports
611b33b exports wordpress des 2 sites (Morgan)
026f553 Add files via upload
```
Et le run bot a produit `68aec04 Rehydrate 209 WordPress media files from legacy hosts` sur `main`.

## Déploiement Vercel (preview en cours)

- Repo connecté à Vercel (via dashboard Morgan), branche **`main`** = Production Branch
- URL preview : **https://website-christinecal.vercel.app/**
- `vercel.json` à la racine : `X-Robots-Tag: noindex` sur toute la preview, cache long sur `/assets/`, 11 redirects 301 WP→nouveau (équivalent du `netlify.toml`)
- `netlify.toml` conservé au cas où on revienne sur Netlify (Vercel l'ignore)
- Voir `DEPLOY-VERCEL.md` pour la procédure de setup
- ⚠️ **Formulaire contact KO** sur Vercel (Netlify Forms non disponible) — acceptable en preview, à fixer quand on choisira l'hébergeur final
- **DNS** non basculé — `christinecal.com` reste sur l'ancien hébergeur tant que Christine n'a pas validé

### Historique des hébergeurs preview
- Netlify (jusqu'au 2026-04-27) : limite de bande passante atteinte → migration vers Vercel
- Vercel (depuis 2026-04-27) : preview gratuite, plan Hobby

## Contact / entreprise (intégré partout)

Christine a fourni ses infos pro (commit `7c345d2`) :
- **EURL Christine CAL — Coach Consultant**
- Coach d'Éveil à la Multidimensionnalité de l'Être
- 254 Chemin de la Terre Pointue — Castelgirou — 24 580 PLAZAC
- Tél : 06 80 42 85 91
- Email : cc.christinecal@gmail.com
- SIRET : 393 691 993 00033

Intégré : mentions-legales, Schema.org JSON-LD (Person + LocalBusiness), footer des 51 pages (email ajouté sous le téléphone).

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

**EN PRIORITÉ au redémarrage :** _(mise à jour 2026-04-20 tard soirée — les 3 points ci-dessous sont FAITS)_

1. ✅ Workflow `fetch-wp-media.yml` : **209/261 images rehydratées** (commits `68aec04` sur main + `7a2b459` sur la branche, mergés dans `ebbd6bc`/`702f561`). Les 52 autres sont des URLs 404 mortes — acceptable.
2. ✅ 17 `<img>` brisés retirés automatiquement des pages (10 images manquantes, référencées 17 fois) — commit `ce83539`.
3. ✅ CSS `alignright`/`alignleft`/`aligncenter`/`alignnone` de WordPress ajouté à `styles.css` — commit `5914dc5`.

**Vague 5 — polish auto du 2026-04-20 nuit (FAIT) :**

1. ✅ Générateur amélioré : wpautop, pseudo-H3 démotés en `<p>`, inline `<h1>` → `<h2>`, classes WP `wp-image-*` / `size-*` strippées, liens cross-domain (17 slugs) mappés, `<a>` qui wrappent un `<img>` déballés — commit `6924f5d`.
2. ✅ Shortcodes non-vc strippés (`[table id=1 /]`, `[caption]`, `[gallery]`) + testimonials splittés en paragraphes + `<p>` vides retirés — commit `661d23d`.
3. ✅ Bannières hero ajoutées à `eveil-a-soi/` et `eveil-au-soi/` (classe CSS `.page-hero__banner`) — commit `041e1f9`.
4. ✅ a11y : H1 caché (`.sr-only`) sur le portail, unwrap `<h2><img></h2>`, iframes YouTube ratio 16/9 par CSS — commit `0fda37a`.
5. ✅ Back-link "← Retour à Éveil à Soi/au Soi" au bas de chaque page générée — commit `eb5db99`.
6. ✅ **Page 404 personnalisée** (`/404.html`) avec hub-grid de rattrapage — commit `e213dc3`.

**Vague 6 — retours Christine #1 (2026-04-21 jour) :**

1. ✅ **RGPD complet** : mentions légales + politique de confidentialité réécrites aux standards CNIL, références Art. RGPD 2016/679 + Loi 78-17, 7 droits listés, base légale Art. 6-1.a/b, Netlify déclaré comme sous-traitant avec DPA, adresse postale CNIL pour réclamation — commit `7c345d2`.
2. ✅ **Copy deterrents** : `<img>` non droppables/sélectionnables (CSS `user-select:none` + `-webkit-user-drag:none` + iOS `touch-callout:none`), clic-droit bloqué UNIQUEMENT sur les `<img>` via JS (pas tout le site), avertissement contrefaçon Art. L.335-2 CPI renforcé — commit `7c345d2`.
3. ✅ **Schema.org JSON-LD** injecté sur portail (Person + LocalBusiness Castelgirou + WebSite) — commit `7c345d2`.
4. ✅ **Page EN** : remplacement du portail V1 (superposition de texte) par une vraie page "coming soon" cohérente avec le design — commit `431d24a`.
5. ✅ **Nav `qui-suis-je`** : `aria-current` corrigé (pointait sur Éveil au Soi au lieu de Qui suis-je) — commit `74c9adf`.
6. ✅ **Portrait Christine** : remplacé par le shooting Sony haute qualité (3178×3812 → redimensionné à 1200 × 1439, 188 KB) trouvé dans les archives WP — commit `74c9adf`.

**Vague 7 — retours Christine #2 (2026-04-21 soir) :**

1. ✅ **Mentions légales** complétées avec les infos EURL Christine CAL (commit `7c345d2` revu intégrant l'adresse complète `254 Chemin de la Terre Pointue`, email `cc.christinecal@gmail.com`, SIRET `393 691 993 00033`).
2. ✅ **Email dans le footer des 51 pages** — ajout de `cc.christinecal@gmail.com` sous le téléphone.
3. ⚠️ **Portail** : Christine veut GARDER l'image d'origine (mains + cercles) mais supprimer les couleurs rose et jaune sur les cercles. J'ai tenté un full-redesign "ciel étoilé" mais Morgan m'a corrigé — j'ai remis l'image d'origine (commit `befd91f`). **À clarifier avec Christine** : comment on traite le changement de couleurs ?
   - Option A : Christine envoie une version retouchée de l'image (son graphiste)
   - Option B : je tente un traitement PIL global (teinte indigo) mais résultat incertain sans voir l'image
   - Option C : elle m'envoie un brief précis des couleurs à remplacer (ex : "rose #ff88aa → indigo #3f3d9c", "jaune #ffdd22 → blanc #fff")
4. ✅ **Thème cosmique site-wide** : fond indigo profond avec étoiles (twinkle animation) sur toutes les pages sauf portail. Sur desktop, sections de contenu flottent en cartes avec marges latérales laissant voir l'indigo autour. Page-hero semi-transparent — commits `befd91f` + `04cee04`.
5. ✅ **Qui suis-je** :
   - Nouveau texte concis fourni par Christine (bullet points rapides au lieu de récit long) — commit `8f97d6a`.
   - 2 vidéos YouTube intégrées sous la photo (youtube-nocookie) avec captions dates/durées — commit `04cee04` :
     - `0QL8ive6NuU` — "Qui est Christine CAL" — Juillet 2016 · 10:42
     - `2oEYgOGBH7o` — "Témoignage de vie de C.C." — Juillet 2016 · 4:39
   - Grille `.video-grid` + `.video-card` pour layout 2-col responsive.

## ⏳ Ce qui reste à faire (au redémarrage)

**EN ATTENTE DE CHRISTINE (retours à venir) :**

1. **Portail — décision couleurs** : rose/jaune à faire disparaître sur l'image d'origine. 3 options à lui soumettre (voir Vague 7 point 3).
2. **2 photos DVD** à intégrer sous les vidéos dans `qui-suis-je.html` — Christine refait les photos samedi avec une meilleure caméra (les siennes prises sur son iPhone ne rendent pas bien). Placement : **à confirmer** avec elle (sur qui-suis-je, ou sur une page dédiée DVD / stages).
3. **Relecture suite** du site : Christine va continuer à survoler les autres sections (`eveil-a-soi`, `eveil-au-soi`, sous-pages). Prévoir intégration de corrections éditoriales au fil de l'eau.

**Chantiers techniques encore à faire :**

1. **Relecture éditoriale** des pages auto-générées (Vagues 2-3) :
   - Liens vers `jeanneracaud.fr`, `debowska.fr`, sites tiers — valider qu'ils existent encore
   - Sections thin (`calendrier`, `conferences`, `partages`, `presse`) — contenu à enrichir
   - `eveil-a-soi/coaching-professionnel.html` — passe humaine recommandée
2. **Décap CMS** : une fois le site validé par Christine, intégrer Decap CMS (`/admin`) pour qu'elle gère agenda / témoignages / pages depuis un dashboard. Setup ~1-2j de boulot (refactor des pages sensibles en templates + données markdown). NB : l'auth Netlify Identity n'existe pas sur Vercel — basculer sur GitHub OAuth via Decap si on reste sur Vercel.
3. **DNS switchover** : basculer `christinecal.com` + `www.christinecal.com` sur l'hébergeur final quand Christine valide. Retirer `noindex` de `vercel.json` (et `netlify.toml` si on revient dessus).
4. **Choix de l'hébergeur final** : Vercel n'est qu'une preview gratuite. Quand Christine valide, on choisit (Netlify avec plan payant, Vercel Pro, OVH/Gandi pour héberger un static, Cloudflare Pages, etc.). Décision à prendre avec Morgan le moment venu.
4. **Google Search Console** : soumettre le sitemap après mise en prod pour accélérer l'indexation.

**Travail de fond (hors portée immédiate) :**
- Version EN du site (placeholder en place, traduction complète à prévoir)
- Calendly embed pour prise de rendez-vous
- Handles réseaux sociaux (YouTube à créer selon Christine)
- Logo définitif (en attente)

## Points techniques à retenir

- **Preview Vercel** : https://website-christinecal.vercel.app/ (Production Branch = `main`)
- **Auto-déploiement** : chaque push sur `main` déclenche un build Vercel en ~30 sec
- Le générateur `sources/scripts/generate_pages.py` est idempotent — le relancer (`python3 sources/scripts/generate_pages.py all`) régénère les 40 pages à partir de `sources/wp-extract/*.md` selon les 2 manifests inline (`PORTFOLIO_MANIFEST` + `PAGES_MANIFEST`)
- Pour regenerate + restrip les `<img>` brisés : il y a un snippet Python inline dans l'historique de chat qui scanne `assets/images/wp/` et retire les `<img>` dont le src n'existe pas
- Le CSS cosmique est dans `assets/css/styles.css` (body::before starfield + gradient indigo, sections avec margin+radius+shadow sur desktop)

## Branche et git

- **Branche de travail** : `main` (depuis 2026-04-27 — tout a été fast-forward mergé pour faciliter Vercel)
- Anciennes branches de dev archivées sur le remote : `claude/continue-session-state-a0X9q`, `claude/migrate-to-vercel-LsIF0`, `claude/christine-cal-website-OIZPX`
- Règle : ne pas créer de PR tant que Morgan n'a pas demandé explicitement

## Personne à l'autre bout

**Morgan** (intermédiaire technique bénévole, non professionnel web — son SIRET n'a aucune place sur le site) pour **Christine CAL** (coach médium, ~60 ans, EURL Christine CAL Coach Consultant, SIRET 393 691 993 00033).

Christine lit le site en preview chez elle, remonte ses retours à Morgan qui les paste ici. Elle est précise et pointilleuse (bon signe), veut un site propre conforme RGPD, avec son identité visuelle (indigo + étoiles), contenu concis.

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
