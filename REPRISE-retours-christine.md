# Reprise — Retours de Christine (22/06/2026)

État de la branche `claude/christine-site-feedback-qah97x` · PR **#2** (draft) · build OK · preview Vercel OK.
Périmètre : **FR uniquement** (EN/PL/ES/IT = lot séparé).

## ✅ Fait (6 mails implémentés)

| Page | Fichiers | Résumé |
|------|----------|--------|
| Qui suis-je | `src/i18n/pages/about.ts`, `src/components/about/About.astro` | lede retiré · titre galactique italique+bleu · textes photo MAJ · parcours 6 puces compact · accordéon conférences · sections Spécificités & À venir · vidéos descendues · fin sur clientèle · Presse & DVD retiré |
| Mission | `src/components/mission/Mission.astro` | lede retouché · section « L'Espace-Temps » en 2 colonnes (vidéo gauche / texte droite) |
| Éveil à Soi | `src/components/hub/HubIndex.astro` | bloc intro sous bannière · 2 vidéos · cartes 2+1 (Consultation+Sortir, puis Construire le vaisseau plus grand) |
| Consultation | `src/content/fiches/consultation-mediumnique.md`, `src/layouts/Fiche.astro` | titre « Mission de Vie » en avant · sous-titre/intro/4 puces · 2e vidéo BOB · infos pratiques + petite image en bas |
| Sortir de la matrice | `src/content/fiches/sortir-de-sa-matrice.md`, `src/layouts/Fiche.astro` | gabarit sur-mesure (image sous titre · accroche · texte/image · infos stage · énnéagramme + objectifs · vidéo en bas) |

Infra ajoutée au schéma (`src/content.config.ts`) : `cardLede`, `hideHeaderImage`,
`hideHeaderMeta`, `practicalFooter`, `richLayout`, `pendingVideos`.

## ⏸️ Assets à intégrer (placeholders propres déjà en place)

1. Nouvelle photo « Qui suis-je » → `About.astro` (`/images/christine-portrait.jpg`).
2. Vidéo Shutterstock #1062052936 (spirale dorée) → `Mission.astro` (`.mission-spacetime__placeholder`).
3. 2 IDs YouTube « La transition planétaire » / « Le défi de l'Humanité » → `HubIndex.astro` (bloc `eveil-videos`, remplacer les placeholders par `<VideoEmbed>`).
4. ID YouTube interview « Être Médium – BOB Bellanca » → `consultation-mediumnique.md` : déplacer l'entrée de `pendingVideos` vers `videos` avec l'`id`.
5. Images `old-life-new-life.jpg` + `chat-miroir.jpg` (Sortir) → déposer dans `public/images/wp/`, puis remplacer les `.img-placeholder` du gabarit `sortir-matrice` dans `Fiche.astro` par de vraies `<img src={base + '/images/wp/...'}>`. (Hotlink WordPress = 403, à obtenir de Christine.)

## ⚠️ À confirmer avec Christine
- Consultation : témoignages **conservés** (non mentionnés) ; image du bas = `mediumnite.jpg` (est-ce bien « l'image de la tête » ?).
- Teinte de bleu du titre galactique (actuel : `--indigo-500`).
- Libellé exact du lede Mission (gardé : « … » Expérience de vie d'une galactique au sol).

## Commandes utiles
```bash
cd v3-src && npm install && npm run build   # build (sortie dans ../v3)
```

## Prochaines étapes possibles
- Intégrer les assets ci-dessus.
- Répercuter le FR sur EN/PL/ES/IT.
- Passer la PR #2 de draft à « ready » quand validé.

---

# Vague 2 — mails 7→10 (IMPLÉMENTÉE depuis l'extract WP)

✅ **Le contenu WP est dans le repo** : `sources/wp-v2/pages/*.md` (extract de
Christophe). Le WordPress en ligne renvoie 403, mais l'extract suffit — c'est la
source utilisée. NE PAS scraper le WP en ligne.

## ✅ Fait (vague 2)
- **Éveil au Soi** (`HubIndex.astro`) : nouveau lede (« …explorer des lieux de
  5ème Dimension »), bloc intro 6 § sous bannière, bannière → `bandeau-eveil-au-soi-2.jpg`.
  Les 4 cartes : non touchées (souhait de Christine).
- **Construire son vaisseau** (`construire-son-vaisseau.md`) : titre « École 5D — … »,
  corps repris du WP (Comment / Particularité+ADN / Effets / Source), liste
  « Les trois bandeaux » retirée, titre `videosHeading` « Témoignage de ma propre
  expérience… » avant les vidéos Debowska, 6 témoignages (frontmatter `testimonials`).
- **Retrouver sa mémoire galactique** (`retrouver-sa-memoire-galactique.md`) :
  jaquettes des 2 vidéos ET inversées (corrigées), liste « Stages initiatiques »
  retirée (cartes dessous), ajout infos astrologue **Claude Jarry des Loges**.
- Infra : schéma + `Fiche.astro` étendus (`videosHeading`, `testimonials`).

## ✅ Finitions faites (depuis l'extract WP + images du repo)
- **Éveil à Soi** : vraies vidéos intégrées (IDs trouvés dans l'extract) —
  « La transition planétaire… » `AvtWBNRF8vE`, « Le défi de l'humanité… » `rALVl8lKlBs`.
- **Sortir de la matrice** : vraies images posées (`old-life-new-life.jpg`,
  `chat-mirroir.jpg` — présentes dans `public/images/wp/`).
- **Construire** : image ADN `restructurer-adn.jpg` rendue (champ `bodyImage`).
- **Retrouver mémoire galactique** : photo astrologue `claude-jarry-des-loges.jpg`
  rendue (champ `bodyImage`).
- **Consultation** : le « BOB Bellanca » est en réalité l'**interview AUDIO**
  (confirmé par l'extract WP : MP3, pas une vidéo) → placeholder vidéo retiré,
  titre de l'audio corrigé. ⚠️ à faire confirmer par Christine.

## ⏸️ Vrais manques (assets externes, hors repo)
1. **`merkaba.mp4`** — vidéo « qui s'active » en tête de Construire (absente du repo).
2. **Nouvelle photo « Qui suis-je »** (Christine la voulait « plus actuelle »).
3. **Vidéo Shutterstock #1062052936** (spirale dorée, Mission) — qu'elle achètera.

## 🎨 Raffinements optionnels
- ADN (Construire) et astrologue (Retrouver) sont affichés en **figure centrée**
  (`bodyImage`), pas en strict 2 colonnes image-gauche/texte-droite.
- Teinte de bleu du titre galactique (Qui suis-je) à valider.

⚠️ Rappel : ne PAS scraper le WP en ligne (403). Tout est dans
`sources/wp-v2/pages/` (textes) et `v3-src/public/images/wp/` (images).

Ordre chrono (le plus récent fait foi) :
- Mail 20:25 « PAGE CONSTRUIRE… » → **ANNULÉ** par le mail 20:40.
- Mail 20:31 « PAGE EVEIL AU SOI ».
- Mail 20:40 « ANNULE ET REMPLACE … CONSTRUIRE » → **fait foi**.
- Mail 21:02 « pages suivantes » (consigne générale + Retrouver mémoire galactique).

## ✅ Faisable tout de suite (texte dans les mails / repo)
1. **Éveil au Soi** (`HubIndex.astro`, hub `eveil-au-soi`) :
   - Lede → « Retrouver sa mémoire galactique, participer à la création de la Nouvelle Terre et explorer des lieux de 5ème Dimension ».
   - Ajouter bloc intro 6 paragraphes (texte fourni dans le mail 20:31) sous la bannière — même mécanisme que la page `eveil-a-soi`.
   - Cartes (4 cadres) : NE PAS toucher.
   - Bannière : remplacer l'image Mont Shasta par `bandeau-eveil-au-soi-2.jpg` → ⏸️ asset.
2. **Construire son vaisseau** (`construire-son-vaisseau.md`, `Fiche.astro`) :
   - Titre → « ÉCOLE 5D — CONSTRUIRE SON VAISSEAU MULTIDIMENSIONNEL DE L'ÂME ».
   - Bloc image ADN (`/images/wp/restructurer-adn.jpg`) à gauche + texte à droite
     (texte « …s'intègre au niveau cellulaire via l'inconscient… » — fourni mail 20:25).
   - Retirer la section texte « Les trois bandeaux » (les cartes de stages suffisent).
   - Ajouter H2 « Témoignage de ma propre expérience grâce à ces outils » AVANT les vidéos Debowska.
   - Image « qui s'active » → ⏸️ asset.
3. **Retrouver sa mémoire galactique** (`retrouver-sa-memoire-galactique.md`) :
   - Retirer la section texte « Stages initiatiques » (cartes suffisent).
   - Inverser les 2 jaquettes vidéo ET (08/2022 vs 16/08/2025) : permuter les `cover`
     entre la vidéo `0eDwfiYJY3w` et `J7CRbYCPSKI` (« robe jaune / veste blanche »).

## ⛔ Bloqué (WP 403 — réclamer le texte à Christine)
- Les **4 témoignages manquants** de Construire son vaisseau (il en faut 5, on en a 1).
- **Contenu manquant + infos sur l'astrologue** de Retrouver sa mémoire galactique.
- Reprise fidèle « tous les textes / même présentation » des pages WP.

## Compliments (aucune action)
- Stages : « contenu super, rien à changer » ; elle aime les kickers
  (ex. « Faire de son corps physique un temple initiatique, le temps d'un week-end »).
