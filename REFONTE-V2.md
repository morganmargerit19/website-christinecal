# Refonte V2 — christinecal.com

> ⚠️ **2026-06-16 — LA V3 EST EN LIGNE (`/v3/`, surprise).** Le WordPress de Christophe a été
> extrait (XML + `wp-content` complet, déposés dans `sources/wp-v2/`, dump gitignoré). Le site
> complet a été reconstruit dans **`v3-src/`** (Astro, servi sous **`/v3/`** — invisible pour
> Christine tant qu'elle n'a pas le lien). `/v2/` reste le teaser qu'elle connaît.
>
> **État V3** : architecture complète FR — home portail (image Terre + point lumineux conservée),
> 2 hubs (Éveil à Soi / au Soi avec bandeaux), consultation médiumnique mise en avant (70 €/1h30/Zoom),
> **17 fiches** stages/ateliers/conférences (collection Markdown éditable `v3-src/src/content/fiches/`),
> qui-suis-je (portrait + 2 vidéos + presse), contact (formulaire mailto), 3 pages légales RGPD
> (vidéos en façade « clic-pour-lire » = zéro cookie YouTube avant action). 73 images WP intégrées
> dans `v3-src/public/images/wp/`. Build : `cd v3-src && npm run build` → sort dans `../v3/`.
>
> **Reste à faire** (non bloquant) : traductions EN/PL des nouvelles pages (FR-only pour l'instant,
> en/pl pointent sur FR dans `i18n/utils.ts`) ; section DVD (jaquettes `dvd-*.jpg` déjà copiées) +
> page Mission (contenu dans `sources/wp-v2/pages/mission.md`, 3 vidéos) ; backend du formulaire
> contact (Web3Forms/Formspree) au choix de l'hébergeur final ; fignolage visuel des images par fiche
> selon retours Christine. Désirs détaillés : `sources/wp-v2/DESIRS-CHRISTINE.md`.

> Document de cadrage pour Morgan. Rédigé le 2026-06-11 en préparation de la refonte
> complète du site de Christine CAL (en remplacement de la version WordPress en cours
> chez son ami).

## TL;DR

Un **prototype fonctionnel de la V2 est en place** : site Astro moderne, trilingue
(FR / EN / PL), animé au GSAP, avec la direction artistique « Cosmos intérieur »
(évolution de l'indigo étoilé que Christine a déjà validé sur la v1). Quand le
contenu WordPress arrive, on le coule dans ce moule — l'architecture est prête.

- **`v2-src/`** = le code source (Astro).
- **`v2/`** = le build statique commité, servi par Vercel sous
  **https://website-christinecal.vercel.app/v2/** (le site v1 reste à la racine).
- Sélecteur de langue FR / EN / PL dans le header de chaque page.

```bash
cd v2-src
npm install
npm run dev      # http://localhost:4321/v2/
npm run build    # régénère ../v2/ → commiter + pusher pour mettre en ligne
```

Pages du prototype (préfixe `/v2` pendant la phase aperçu) :

| Page | FR | EN | PL |
|---|---|---|---|
| Accueil | `/v2/` | `/v2/en/` | `/v2/pl/` |
| Qui suis-je | `/v2/qui-suis-je/` | `/v2/en/about/` | `/v2/pl/o-mnie/` |

À la bascule finale (quand la V2 remplacera la v1) : retirer `base` et `outDir`
de `v2-src/astro.config.mjs` et déployer `dist/` à la racine.

## Pourquoi cette stack

- **Astro 5** : site 100 % statique (rapide, hébergement gratuit, zéro maintenance
  serveur — tout ce que WordPress n'est pas), avec composants réutilisables et
  **i18n natif** (routage `/`, `/en/`, `/pl/` + hreflang automatique). Ajouter une
  4ᵉ langue = 1 ligne de config + les traductions.
- **GSAP + ScrollTrigger** : animations d'entrée du hero, reveals au scroll, étoiles
  en canvas avec parallaxe. `prefers-reduced-motion` respecté partout.
- **Pas de CMS pour l'instant** : le contenu vit dans des fichiers structurés
  (`v2/src/i18n/`). Decap CMS pourra être branché plus tard si Christine veut éditer
  elle-même (déjà étudié en v1).

## Direction artistique « Cosmos intérieur »

Évolution de la DA v1 validée par Christine (indigo + étoiles), modernisée :

- **Nuit indigo** (`#100d2e` → `#07061a`) en fond fixe, nébuleuses en dégradés radiaux,
  champ d'étoiles canvas qui scintille et dérive doucement au scroll (12 % d'étoiles or).
- **Or** (`#c9a961`) en accent : eyebrows, puces ✦, CTA, sélecteur de langue actif.
- **Papier** (`#f8f7f4`) : le contenu long flotte en cartes claires arrondies sur la nuit —
  lisibilité maximale, contraste AA.
- **Typo** : Cormorant Garamond (titres, italiques) + Inter (corps), tailles fluides
  (`clamp()`), déjà la combinaison v1.
- **Verre dépoli** : header et cartes-portails en glassmorphism (`backdrop-filter`).
- Les deux univers **Éveil à Soi / Éveil au Soi** restent le cœur de la narration :
  deux cartes-portails sur l'accueil (l'équivalent moderne de l'image-portail v1).

## ★ MARCHE À SUIVRE le jour où le WordPress est « fini »

### Étape 1 — Morgan récupère le contenu

Dans l'ordre de préférence :

1. **Export WordPress natif** : admin WP → *Outils → Exporter → Tout le contenu* → fichier
   `.xml` (WXR). C'est exactement ce qu'on avait fait pour la v1 — les scripts de parsing
   existent déjà dans `sources/scripts/`.
2. **Le dossier `wp-content/uploads/`** en zip (toutes les images originales).
3. À défaut : **l'URL du site en ligne** — je peux crawler et tout extraire.
4. En bonus : tout nouveau texte/photo que Christine a écrit pour la version WordPress
   (Word, mail, peu importe le format).

⚠️ À noter : **on a déjà tout le contenu de la v1 dans ce repo** (`sources/wp-extract/` :
52 extraits Markdown, 209 images dans `assets/images/wp/`). Si la version WordPress de
l'ami reprend les mêmes textes, on n'a presque rien à attendre — seuls les contenus
*nouveaux* nous intéressent.

### Étape 2 — Morgan dépose le contenu et relance Claude

1. Commiter les fichiers récupérés dans `sources/wp-v2/` (ou les uploader via GitHub
   → « Add files via upload », comme pour la v1). Peu importe le format exact.
2. Ouvrir une session Claude Code sur ce repo et dire simplement :
   > « Le contenu WordPress est dans `sources/wp-v2/`. Lis `REFONTE-V2.md` et
   > lance la production de la V2. »
3. Claude lit ce fichier + `SESSION-STATE.md`, et déroule le plan de production
   ci-dessous.

### Étape 3 — Plan de production (une fois le contenu reçu)

1. **Inventaire** : diff entre le contenu WordPress reçu et `sources/wp-extract/` →
   liste des pages nouvelles / modifiées / supprimées.
2. **Architecture éditoriale** : arborescence cible validée avec Christine (probablement
   proche de la v1 : 2 hubs + ~40 pages stages/ateliers/conférences + qui-suis-je,
   contact, témoignages, légal).
3. **Gabarits** : page hub, page stage/atelier, page témoignages, contact (avec
   formulaire Formspree/Web3Forms — fonctionne sur n'importe quel hébergeur statique).
4. **Intégration FR** : tout le contenu français dans les collections.
5. **Traductions EN puis PL** : je produis les premiers jets, **relecture par un
   locuteur natif fortement recommandée** avant mise en ligne (surtout le PL).
6. **Polish** : animations par page, images optimisées (`astro:assets` → WebP/AVIF),
   SEO (sitemap multilingue, Schema.org repris de la v1), RGPD (textes v1 réutilisables).
7. **Mise en ligne** : Vercel (gratuit, déjà utilisé pour la preview v1) + bascule DNS
   de `christinecal.com` quand Christine valide.

## Questions ouvertes (non bloquantes)

- Le polonais : qui relit ? (Christine a-t-elle un contact polonais ?)
- Formulaire de contact : Formspree (simple) ou Web3Forms (gratuit illimité) ?
- Le portail-image historique (mains + cercles) : on le garde quelque part en clin
  d'œil, ou la V2 le remplace définitivement par les cartes-portails ?
- Liens YouTube / réseaux sociaux définitifs.

## État du repo

- `v2-src/` — le code source du nouveau site (Astro). **C'est ici que tout se passe.**
- `v2/` — le build statique de la V2, commité, servi sous `/v2/` sur Vercel.
  Ne pas éditer à la main : régénéré par `npm run build` dans `v2-src/`.
- Racine + `eveil-a-soi/` + `eveil-au-soi/` — le site v1 statique, intact (toujours
  déployé sur Vercel, racine du domaine preview).
- `sources/` — exports WordPress 2026-04, extraits Markdown, scripts de parsing.
- `sources/wp-v2/` — (à créer) le futur contenu récupéré du WordPress de l'ami.
- `SESSION-STATE.md` — historique de la v1 (contexte, décisions, contacts).
