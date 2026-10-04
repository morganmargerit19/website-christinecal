# Nouveau site « Relier » (proposition de refonte)

Proposition de nouveau design, construite **à côté** du site en ligne, sans le
modifier. Elle lit **les mêmes contenus** que le site actuel : les fiches de
stages (`v3-src/src/content/fiches`), les pages Qui suis-je, Mission, Éveil à /
au Soi (`v3-src/src/data`) et les photos (`v3-src/public/images`). Christine
continue donc d'utiliser le même `/admin`, sans rien apprendre de nouveau.

## Ce que Christine fait, et ce que le site fait tout seul

| Christine, dans /admin | Le nouveau site, automatiquement |
|---|---|
| Crée un stage, choisit sa rubrique | Carte dans la rubrique, page du stage, ligne dans l'agenda |
| Écrit une date (« 14–15 mars 2027 », « Août 2027 », « À partir de septembre 2026 »…) | Range l'agenda dans l'ordre, retire les dates passées, bouton « S'inscrire » avec le nom du stage et la date |
| Écrit « Me contacter » à la place d'une date | Le stage passe dans la ligne « Sur demande » |
| Laisse vide le lieu, le tarif, la durée | La case n'apparaît pas (jamais de « à préciser ») |
| Envoie une photo, quel que soit son format | Recadrée en cercle ou en carte ; un bandeau très large est montré en entier ; sans photo, fleur de vie |
| Ajoute des témoignages, des vidéos | Rubriques « Témoignages » et « Voir et écouter » ; DVD Debowska repris sur l'accueil |

## Où le voir

- **Aperçu Vercel** : `/nouveau-site/` sur chaque déploiement Vercel (aperçu de
  branche ou de `main`), à côté du site actuel. Toujours en `noindex`.
- **En local** : `cd v3-src && npm run build:nouveau-site`, puis ouvrir
  `v3-src/dist-nouveau-site/`.

## Fichiers

- `v3-src/astro.nouveau-site.config.mjs` : configuration (dossier source `nouveau-site/`).
- `v3-src/nouveau-site/` : pages, gabarits et styles du nouveau design.
  - `lib/agenda.ts` : lecture des dates écrites en français, agenda automatique.
  - `lib/images.ts` : choix de présentation de chaque photo selon ses proportions.
  - `components/blocks/` : les blocs de l'éditeur (mêmes noms que dans `tina/config.ts`).

Le site en ligne (OVH) n'est **pas** concerné : le déploiement OVH construit
toujours `astro.config.mjs` (dossier `src/`).

## Reste à faire avant de le mettre en ligne

1. Validation du design par Christine.
2. Versions EN / ES / IT / PL (les traductions existantes seront reprises).
3. Bascule : faire construire `astro.nouveau-site.config.mjs` (sortie `dist/`)
   par le déploiement OVH, `.github/workflows/deploy-ovh.yml`. Retour arrière :
   revenir à `astro.config.mjs` ; l'ancien design reste intact dans `src/`.
