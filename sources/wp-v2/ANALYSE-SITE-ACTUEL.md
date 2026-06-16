# Analyse du site actuel — christinecal.com (refonte tierce)

> **Date d'analyse : 2026-06-16.**
> Le site est **en cours d'édition active** : le `page-sitemap.xml` et plusieurs pages ont
> été modifiés le 16/06/2026 jusqu'à **16:24** (la dernière page touchée est
> `les-intra-du-nouveau-telos-au-mont-shasta`, modifiée à 16:24:44 ; `les-extras-du-bugarach`
> à 16:19, `la-team-galactique` à 16:20). C'est un chantier vivant : l'inventaire ci-dessous
> est un instantané susceptible de changer d'un jour à l'autre.
>
> Méthode : extraction via l'API REST WordPress publique (`/wp-json/wp/v2/`) + WebFetch sur
> quelques URLs HTML rendues et sur les sitemaps Yoast. Domaine analysé : `www.christinecal.com`
> (≠ des domaines V1 `christinecal-coach-medium.com` et `christinecal-coach-quantique.com`).

---

## 1. Synthèse technique

| Élément | Constat |
|---|---|
| **CMS** | WordPress (REST API ouverte) |
| **Thème / page builder** | **Divi** (Elegant Themes) — namespace `divi/v1` exposé dans `/wp-json`, formulaire de contact = module "Divi Contact Form", classes Divi dans le rendu. **Pas** d'Elementor ni WPBakery, **pas** de Gutenberg pur. |
| **SEO** | **Yoast SEO** (namespace `yoast/v1`, sitemaps `wp-sitemap.xml`→`page-sitemap.xml` au format Yoast). |
| **Sécurité** | **Wordfence** (namespace `wordfence/v1`). |
| **Autres plugins visibles** | **Duplicate Post** (`duplicate-post/v1`) — utilisé pour dupliquer/tester des pages (cf. "Welcome test remake"). |
| **Endpoint settings** | `/wp-json/wp/v2/settings` → HTTP 401 (privé, normal). Le nom de site exposé par `/wp-json` est resté "WordPress" (description vide) — installation pas encore finalisée côté identité. |
| **Médias** | 74 objets, tous uploadés en **2026/06** (réimport récent en bloc). |

---

## 2. Arborescence des pages

**24 pages**, **toutes en haut niveau** (`parent = 0`, `menu_order = 0` partout) : la hiérarchie
« hub → sous-pages » n'est PAS portée par le champ `parent` WordPress, elle est uniquement
**éditoriale** (liens internes dans le corps des pages hubs). Le menu de navigation devra donc
être reconstruit à la main.

| id | slug | titre | modifié |
|---|---|---|---|
| 12 | `wellcome-legacy` | Welcome (legacy) | 2026-06-03 20:51 |
| 25 | `welcome` | Welcome | 2026-06-15 18:26 |
| 110 | `welcome-new` | Welcome (test remake) | 2026-06-15 07:58 |
| 116 | `qui-suis-je` | Qui suis-je | 2026-06-16 08:15 |
| 121 | `mission` | Mission | 2026-06-16 11:46 |
| 123 | `eveil-a-soi` | Eveil à Soi *(HUB 1)* | 2026-06-16 14:30 |
| 125 | `eveil-au-soi` | Eveil au Soi *(HUB 2)* | 2026-06-16 14:27 |
| 127 | `contact` | Contact | 2026-06-09 19:49 |
| 244 | `consultation-mediumnique` | Consultation Médiumnique | 2026-06-16 11:52 |
| 246 | `sortir-de-sa-matrice-personnelle` | Sortir de sa matrice personnelle | 2026-06-15 18:52 |
| 248 | `construire-son-vaisseau-multidimensionnel-de-lame` | Construire son vaisseau multidimensionnel de l'âme | 2026-06-15 18:52 |
| 405 | `stage-construction-du-corps-de-lumiere` | Stage n°1 : Construction du « Corps de Lumière » | 2026-06-15 21:24 |
| 420 | `stage-construction-de-la-merkaba-chritalline` | Stage n°2 : Construction de la Merkaba christalline | 2026-06-15 20:42 |
| 443 | `retrouver-sa-memoire-galactique` | Retrouver sa mémoire galactique | 2026-06-16 13:44 |
| 463 | `la-team-galactique-de-la-nouvelle-terre` | La team galactique de la nouvelle terre | 2026-06-16 16:20 |
| 503 | `les-intra-du-nouveau-telos-au-mont-shasta` | Les intra du nouveau Telos au Mont Shasta | 2026-06-16 16:24 |
| 586 | `les-7-rayons-7-jours-initiatiques` | Les 7 rayons : 7 jours initiatiques | 2026-06-15 19:31 |
| 588 | `semaine-initiatique-avec-lenergie-des-telosiens` | Semaine initiatique avec l'énergie des télosiens | 2026-06-16 13:26 |
| 591 | `initiation-de-fin-de-cycle-et-multi-dimensionnalite-de-letre` | Initiation de fin de cycle et multi-dimensionnalité de l'être | 2026-06-15 16:58 |
| 594 | `voyages-en-expansion-de-conscience-ou-voyage-astral` | Voyages en expansion de conscience ou voyage astral | 2026-06-15 17:00 |
| 756 | `stage-du-corps-physique-au-temple-initiatique` | Stage : du corps physique au temple initiatique | 2026-06-16 13:32 |
| 760 | `stage-de-lhomme-terrestre-a-lhumain-cosmique` | Stage : de l'homme terrestre à l'humain cosmique | 2026-06-16 13:34 |
| 763 | `stage-mission-des-light-workers` | Stage : mission des light workers | 2026-06-16 13:35 |
| 776 | `les-extras-du-bugarach-et-ses-nouvelles-energies` | Les extras du Bugarach et ses nouvelles énergies | 2026-06-16 16:19 |

### Quelle page est la home ?

Le `page-sitemap.xml` liste `https://www.christinecal.com/` avec `lastmod = 2026-06-03 20:51:46`,
date **strictement identique** à celle de la page id 12 `wellcome-legacy`. Conclusion :
**la page d'accueil pointe actuellement sur "Welcome (legacy)" (id 12)**, la plus ancienne.
Les deux autres "welcome" sont des brouillons de remplacement non encore promus en home.

### Rôle des doublons welcome / welcome-new / wellcome-legacy

Trois variantes d'une même page d'accueil, manifestement créées via **Duplicate Post** pour itérer :
- **`wellcome-legacy`** (id 12) — l'ancienne home, *toujours active comme front page*. Hero = photo Getty (`GettyImages-188090182.jpg`), 2 chemins "EVEIL À SOI" (boutons DEVENIR / ENTRER) et "EVEIL AU SOI GALACTIQUE" (ENTRER). Dividers blancs décoratifs.
- **`welcome`** (id 25) — refonte de la home : 2 blocs "ÉCOLE 5D" et "GALACTIQUE", baseline sur l'expérience d'une galactique en contact avec ses versions futures. Pas de hero photo, dividers blancs.
- **`welcome-new`** (id 110, titre "Welcome (test remake)") — brouillon de test, contenu proche de `welcome`.

> ⚠️ Doublons à **fusionner en une seule home** dans la V2. Le slug `eveil-au-soi-2` testé n'existe pas (404 API).

---

## 3. Les 2 hubs

La structure du site repose sur **deux portails jumeaux** (différenciés par une seule préposition,
source de confusion à clarifier en V2) :

### HUB 1 — `eveil-a-soi` "Éveil À Soi" (id 123) — parcours terrestre / 5D
Sujet : devenir créateur conscient de sa vie, transmutation, libération émotionnelle.
Bandeau `bandeau-eveil-a-soi.jpg`. Vidéos YouTube : **AvtWBNRF8vE** (transition planétaire ère du verseau) et **rALVl8lKlBs** (défi de l'humanité actuelle).
Sous-pages rattachées (liens internes) :
- `consultation-mediumnique`
- `sortir-de-sa-matrice-personnelle`
- `construire-son-vaisseau-multidimensionnel-de-lame` (= "École 5D", qui chapeaute les stages n°1/2/3)

### HUB 2 — `eveil-au-soi` "Éveil AU Soi" (id 125) — parcours galactique / cosmique
Sujet : intégration de la Présence JE SUIS, ascension multidimensionnelle, famille galactique.
Bandeau `bandeau-eveil-au-soi-2.jpg`. Pas de vidéo sur le hub lui-même.
Sous-pages rattachées (liens internes) :
- `retrouver-sa-memoire-galactique`
- `la-team-galactique-de-la-nouvelle-terre`
- `les-intra-du-nouveau-telos-au-mont-shasta`
- `les-extras-du-bugarach-et-ses-nouvelles-energies`

---

## 4. Résumé du contenu de chaque page

**Pages structurelles**
- **`wellcome-legacy` / `welcome` / `welcome-new`** — Home (3 variantes, voir §2). Choix entre les 2 hubs. Pas de vidéo.
- **`qui-suis-je`** — Bio Christine Cal : ex-expert-comptable (1993-2013), médium clairvoyante/clairaudiente, coach PNL, 950+ personnes formées depuis 2013, voyage astral, contacts avec versions futures d'elle-même (2019, 2021). Portrait `ccal-portrait-2.jpg`. Vidéos YouTube : **0QL8ive6NuU** (qui est Christine Cal) et **2oEYgOGBH7o** (témoignages de vie).
- **`mission`** — Manifeste : évolution de conscience 3D→5D, "vieilles âmes" et jeunes galactiques. Images `5emedimension`, `ascension`. 3 vidéos YouTube : **Ncg54JqREp4** (bande-annonce "Les Acteurs de la vie"), **ANs3YN5mMb0** ("Les Acteurs de la Vie"), **zKNYVg283kU** (conférence "Apocalypse Now !? Révélations vers la 5e dimension", nov. 2021).
- **`contact`** — Formulaire Divi (Nom, Email, Message + captcha "2+3="). **Aucun** email/téléphone/adresse/réseau social affiché.
- **`consultation-mediumnique`** — Lecture d'âme / coaching médiumnique. **70 € la séance de 1h30 via Zoom**. Vidéo YouTube : **T3R7jxtKto8** (déroulement d'une séance). Lien vers contact.

**HUB 1 — École 5D / parcours terrestre**
- **`sortir-de-sa-matrice-personnelle`** — Atelier : transmuter la peur en énergie créatrice via l'**Ennéagramme**. Dates : **24-25 oct. 2026** et **23-24 janv. 2027** (Zoom). Images `chat-mirroir`, `eneagramme`, `old-life-new-life`. Pas de tarif affiché.
- **`construire-son-vaisseau-multidimensionnel-de-lame`** — Page "École 5D" chapeau, 3 stages. **Vidéo auto-hébergée `merkaba.mp4`**. Révisions Zoom gratuites les 1ers mardis 20h30. 950+ participants depuis 2013. Liens vers stages 1/2/3.
- **`stage-construction-du-corps-de-lumiere`** (Stage n°1) — Activation du corps de lumière, présentiel ou Zoom. Vidéo YouTube : **QExlOVMPHPc**. Bannière `stage-construction-corps-de-lumiere`. Pas de tarif ni date.
- **`stage-construction-de-la-merkaba-chritalline`** (Stage n°2) — Construction Merkaba cristalline. Vidéo YouTube : **UQzWaRZutoM** ("Les ateliers de Christine Cal"). Image `stage-construction-merkaba-cristalline`. Pas de tarif ni date.
  - *(Stage n°3 "Vortex ascensionnel" cité dans le texte de l'École 5D ; image `stage-construction-vortex-ascentionnel` présente dans les médias, mais **pas de page dédiée** dans le sitemap → page manquante / à créer.)*

**HUB 2 — Galactique / Telos**
- **`retrouver-sa-memoire-galactique`** — Témoignage + ateliers : contacts ET, shifts de timeline. DVD "Réintégration vies passées", "Extraterrestres envahisseurs subtils". Événement Forum **15-17 août 2025** à Rennes-les-Bains. Images `eveil-quantique`, `adn`, `homme-aura`. Pas de vidéo embarquée.
- **`la-team-galactique-de-la-nouvelle-terre`** — Atelier collaboration galactique / transition 5D. Stage **6-9 mai 2027** dans la Vallée de l'Homme (Dordogne, 24). Images `les-freres-des-etoiles`, `etoile`, `homme-debout-etoiles`. Pas de vidéo. Lien contact.
- **`les-intra-du-nouveau-telos-au-mont-shasta`** — Telos / cité 5D sous le Mont Shasta, Lémuriens. **3 vidéos YouTube : ZKYMHeWzyM8, fYk9P-p_BAA, GzqcsFWp0ec.** Nombreuses photos Shasta (`shasta1/2`, `diapo-shasta1-7`, `nuage-lenticulaire`, `chris-shasta`), couvertures livres ("Revelations of New Lemuria", "Messages from Hollow Earth"). 4 retraites initiatiques proposées.
- **`les-extras-du-bugarach-et-ses-nouvelles-energies`** — Mont Bugarach, expériences mystiques 2003-2026. Atelier "LE NOUVEAU BUGARACH" prévu **2027**. Note "En mission — mise à jour fin d'été", livre en cours d'écriture. Images `bugarach`, `bugarach-1280x400`, `bugarach-2`. Pas de vidéo.

**Stages / semaines initiatiques (rattachement à préciser — probablement HUB 2)**
- **`les-7-rayons-7-jours-initiatiques`** — Séminaires 7 Rayons des Maîtres ascensionnés (tenus 2014-2020, **reprise dès 2027**). Image `les-7-rayons`. Pas de vidéo ni tarif.
- **`semaine-initiatique-avec-lenergie-des-telosiens`** — Semaine avec énergie télosienne. **3-9 juillet 2027.** Image `mains`. Témoignage Karine (2020). Pas de vidéo ni tarif.
- **`initiation-de-fin-de-cycle-et-multi-dimensionnalite-de-letre`** — Retraite à thèmes quotidiens. **12-18 juillet 2027.** Image `multidimensionnalite`. Pas de vidéo ni tarif.
- **`voyages-en-expansion-de-conscience-ou-voyage-astral`** — Soirées Zoom voyage astral, **début sept. 2026** (saison hivernale). Image `expansion-conscience`. Pas de vidéo ni tarif.
- **`stage-du-corps-physique-au-temple-initiatique`** — Stage. **WE 1-2 mai 2027.** Pas d'image/vidéo/tarif (contenu encore léger).
- **`stage-de-lhomme-terrestre-a-lhumain-cosmique`** — Parcours initiatique retour conscience cosmique, **27-29 mars 2027** (3 jours). Pas d'image/vidéo/tarif.
- **`stage-mission-des-light-workers`** — "Mission des light workers". **WE 19-20 juin 2027.** Pas d'image/vidéo/tarif (contenu très léger).

> Plusieurs pages (les 3 derniers stages surtout) sont des **coquilles quasi vides** : titre + dates 2027 + lien contact, peu de corps rédigé. Chantier en cours.

---

## 5. Médias

**74 objets** uploadés (tous datés `2026/06` → réimport récent en masse) :
- **66 × image/jpeg**, **2 × image/png** (`divider-white.png` décoratif, une cover MP3), **3 × video/mp4**, **1 × audio/mpeg**.
- **Vidéos auto-hébergées (MP4)** : `merkaba.mp4` (id 669, page École 5D), `1023075865-preview.mp4` (id 364, stock), `114246177-silhouette-people-looking-star.mp4` (id 223, stock). → Probablement des fonds/teasers décoratifs (deux ont des noms de banque d'images).
- **Audio** : `mp3_..._Toute_La_Verite_Christine_Cal_Interpreter_sa_Mediumnite.mp3` (id 287) — interview radio "Toute la Vérité".
- **Vidéos embarquées (YouTube, pas dans la médiathèque)** : voir IDs par page au §4. Récap : `AvtWBNRF8vE`, `rALVl8lKlBs`, `0QL8ive6NuU`, `2oEYgOGBH7o`, `Ncg54JqREp4`, `ANs3YN5mMb0`, `zKNYVg283kU`, `T3R7jxtKto8`, `QExlOVMPHPc`, `UQzWaRZutoM`, `ZKYMHeWzyM8`, `fYk9P-p_BAA`, `GzqcsFWp0ec`. **Aucune Vimeo détectée.**
- **Images symboliques probables** :
  - Portail : `fond-portail-2021-bleu1200-V2.jpg` (id 16), `nuage-lenticulaire.jpg`, `etoile.jpg`.
  - Portrait Christine : `ccal-portrait-2.jpg`, `ccal-portrait-667x800-1.jpg`, `chris-shasta.jpg`, `claude-jarry-des-loges.jpg`.
  - Bandeaux de hub : `bandeau-eveil-a-soi.jpg`, `bandeau-eveil-au-soi.jpg` / `bandeau-eveil-au-soi-2.jpg`.
  - Fond générique : `fond-pages.jpg`.
  - Couvertures DVD (≈ 12) : produits/conférences passées, candidates à une page "boutique" ou "presse".

---

## 6. Multilingue

**Aucune trace de multilingue.** Pas de namespace Polylang/WPML dans `/wp-json`. Le sitemap index
ne référence qu'un seul `page-sitemap.xml`, sans variantes `/en/` ni `/pl/`. Tout le contenu est
**en français uniquement**. → La V2 trilingue FR/EN/PL devra **traduire from scratch** ; aucune
traduction existante à récupérer.

---

## 7. RGPD / cookies / mentions légales

- **Bandeau cookies** : non détecté dans le HTML rendu de la home (aucun plugin Cookie Notice / Complianz / Borlabs dans `/wp-json`). À confirmer mais très probablement **absent**.
- **`/mentions-legales/`** → **HTTP 404** (page inexistante).
- **`/politique-de-confidentialite/`** → **HTTP 404** (page inexistante).
- → Le nouveau site **n'a, à ce stade, ni mentions légales, ni politique de confidentialité, ni gestion de consentement cookies**. Point de conformité à traiter impérativement en V2 (déjà prévu côté Astro).

---

## 8. Technique (récap)

Voir §1. En bref : **WordPress + thème/builder Divi**, **Yoast SEO**, **Wordfence**, **Duplicate Post**.
Formulaires via module Divi natif (pas de Contact Form 7 / WPForms exposé). Front page = page statique
"Welcome (legacy)". Pas de blog/articles (sitemap ne contient que des pages).

---

## 9. DIFF vs V1 (cf. `sources/wp-extract/INVENTORY.md`)

La V1 vivait sur **deux domaines distincts** (`christinecal-coach-medium.com` = Éveil À Soi,
`christinecal-coach-quantique.com` = Éveil AU Soi) avec un **custom post type `portfolio`** pour les
ateliers/stages/conférences. Le nouveau site **fusionne tout sur `christinecal.com`** et **abandonne
le CPT portfolio** : tout est désormais en pages simples. Slugs et titres ont été **entièrement
réécrits** → peu de correspondances 1:1.

### Pages NOUVELLES (absentes de la V1, ou refondues sous un nouveau slug)
- `welcome` / `welcome-new` (refontes de la home).
- `eveil-a-soi` et `eveil-au-soi` comme **pages-portails uniques** (en V1 c'étaient deux *sites* entiers).
- `consultation-mediumnique` (V1 : `coaching-mediumnique-lecture-d-ame`) — refondu, **tarif 70 € désormais explicite**.
- `sortir-de-sa-matrice-personnelle`, `construire-son-vaisseau-multidimensionnel-de-lame` — nouveaux regroupements.
- `stage-construction-du-corps-de-lumiere`, `stage-construction-de-la-merkaba-chritalline` — réorganisation en "Stage n°1/n°2" (V1 : `stages-activation-du-corps-de-lumiere`, `stage-...-merkaba`).
- `retrouver-sa-memoire-galactique`, `la-team-galactique-de-la-nouvelle-terre`, `les-extras-du-bugarach-et-ses-nouvelles-energies` — **nouveaux thèmes** (Bugarach est nouveau).
- `les-intra-du-nouveau-telos-au-mont-shasta` — refonte des contenus V1 Telos/Shasta (`le-mont-shasta`, `stage-telos-et-la-5d`, etc.).
- 6 stages datés 2027 (`stage-du-corps-physique...`, `...homme-terrestre-a-lhumain-cosmique`, `...mission-des-light-workers`, `les-7-rayons...`, `semaine-initiatique-telosiens`, `initiation-de-fin-de-cycle...`) — **nouvelle programmation 2026-2027**.
- `voyages-en-expansion-de-conscience-ou-voyage-astral` — nouvelle offre.

### Pages REPRISES (concept conservé, contenu/slug réécrits)
- Bio : V1 `christine-cal-coach-medium` / `qui-est-christine-cal-medium-5d-telos` → V2 `qui-suis-je`.
- Contact : repris (mais réseaux/coordonnées retirés).
- Mission / manifeste 5D : V1 `une-nouvelle-ere-pour-la-terre-de-5eme-dimension` → V2 `mission`.
- Thématique Telos/Shasta : reprise et condensée dans `les-intra-du-nouveau-telos-au-mont-shasta`.

### Pages SUPPRIMÉES (présentes en V1, absentes du nouveau sitemap)
- `mentions-legales`, `temoignages-christine-cal` / `temoignages`, `presse` / `news-presse`,
  `faq-coaching-mediumnite`, `partages`, `calendrier-conferences-ateliers` /
  `calendrier-des-activites...`, `centre-dexpansion-de-conscience`, `reseau-telos-mondial`,
  `404-error`, et **l'ensemble du CPT `portfolio`** (ateliers couple/féminin/IA, conférences voyage de l'âme, etc.).
- ⚠️ La disparition de **témoignages, presse, FAQ, calendrier et mentions légales** est notable :
  soit non encore migrées (chantier en cours), soit volontairement retirées. À arbitrer avec Christine.

---

## 10. Recommandations de mapping vers la V2 Astro

La V2 possède déjà les deux hubs **Éveil à Soi** / **Éveil au Soi**. Mapping proposé :

| Page actuelle | Destination V2 |
|---|---|
| `welcome` / `welcome-new` / `wellcome-legacy` | **Home unique** `/` — fusionner les 3, choisir le meilleur hero, garder le choix 2-hubs. Supprimer les doublons. |
| `qui-suis-je` | Page bio `/qui-suis-je` (commune aux 2 hubs). Conserver les 2 vidéos YouTube. |
| `mission` | Page manifeste `/mission` (commune). Conserver les 3 vidéos. |
| `contact` | Page `/contact` — **réintroduire email/tel/réseaux** + formulaire (et consentement RGPD). |
| `consultation-mediumnique` | **Hub Éveil À Soi** → offre phare. Mettre en avant le tarif 70 €/1h30 Zoom + vidéo T3R7jxtKto8. |
| `sortir-de-sa-matrice-personnelle` | **Hub Éveil À Soi** → atelier. |
| `construire-son-vaisseau-multidimensionnel-de-lame` | **Hub Éveil À Soi** → page "École 5D" chapeau des 3 stages. |
| `stage-construction-du-corps-de-lumiere` (n°1) | Sous-page École 5D (Éveil À Soi). |
| `stage-construction-de-la-merkaba-chritalline` (n°2) | Sous-page École 5D (Éveil À Soi). |
| *(Stage n°3 Vortex ascensionnel)* | **À créer** : page manquante (image existante, pas de page). |
| `retrouver-sa-memoire-galactique` | **Hub Éveil au Soi**. |
| `la-team-galactique-de-la-nouvelle-terre` | **Hub Éveil au Soi** → stage mai 2027. |
| `les-intra-du-nouveau-telos-au-mont-shasta` | **Hub Éveil au Soi** → page Telos/Shasta (3 vidéos + galerie photos). |
| `les-extras-du-bugarach-et-ses-nouvelles-energies` | **Hub Éveil au Soi** → page Bugarach (statut "en cours"). |
| `les-7-rayons-7-jours-initiatiques` | **Hub Éveil au Soi** → catalogue stages 2027. |
| `semaine-initiatique-avec-lenergie-des-telosiens` | **Hub Éveil au Soi** → stage juillet 2027. |
| `initiation-de-fin-de-cycle-et-multi-dimensionnalite-de-letre` | **Hub Éveil au Soi** → stage juillet 2027. |
| `voyages-en-expansion-de-conscience-ou-voyage-astral` | **Hub Éveil au Soi** (ou À Soi) → soirées Zoom sept. 2026. |
| `stage-du-corps-physique-au-temple-initiatique` | **Hub Éveil au Soi** → stage mai 2027 (étoffer le contenu). |
| `stage-de-lhomme-terrestre-a-lhumain-cosmique` | **Hub Éveil au Soi** → stage mars 2027 (étoffer). |
| `stage-mission-des-light-workers` | **Hub Éveil au Soi** → stage juin 2027 (étoffer). |

**Transverse / à prévoir en V2 :**
1. Créer une page **Calendrier / Agenda 2026-2027** (toutes les dates de stages sont éparpillées : sept. 2026, oct. 2026, janv./mars/mai/juin/juillet 2027 — un calendrier consolidé serait précieux).
2. (Re)créer **Mentions légales + Politique de confidentialité + bandeau cookies** (absents — obligation légale, surtout pour un site trilingue européen avec collecte de formulaire).
3. Décider du sort de **Témoignages / Presse / FAQ** (présents en V1, absents ici) — récupérer le contenu V1 dans `sources/wp-extract/` si on les réintroduit.
4. Traduire l'intégralité en **EN + PL** (aucune traduction préexistante).
5. Migrer les **médias 2026/06** (74 fichiers) vers `assets/` Astro ; conserver les bandeaux, portraits, photos Shasta/Bugarach et le `merkaba.mp4`. Les MP4 "stock" et certaines covers DVD sont optionnels.
6. **Clarifier la dénomination des 2 hubs** ("Éveil À Soi" vs "Éveil AU Soi" diffèrent d'une lettre — risque de confusion fort pour le visiteur). Envisager des libellés plus parlants (ex. "Parcours terrestre / École 5D" vs "Parcours galactique / Telos").
