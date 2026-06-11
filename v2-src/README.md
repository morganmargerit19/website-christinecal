# christinecal.com — V2 (code source)

Site Astro statique, trilingue (FR par défaut, EN, PL), animations GSAP,
DA « Cosmos intérieur ». Voir `../REFONTE-V2.md` pour le cadrage complet
et la marche à suivre.

## Commandes

```bash
npm install
npm run dev      # serveur de dev — http://localhost:4321/v2/
npm run build    # build statique dans ../v2/ (servi sous /v2/ sur Vercel)
```

⚠️ Phase aperçu : `astro.config.mjs` définit `base: '/v2'` et `outDir: '../v2'`.
Le dossier `../v2/` est **commité** (le déploiement Vercel est statique, sans
build). Après toute modification ici : `npm run build`, puis commit + push de
`v2/`. À la bascule finale, retirer `base`/`outDir` et déployer à la racine.

## Organisation

```
src/
  i18n/
    utils.ts        # locales, préfixe base, table des slugs par langue
    ui.ts           # chaînes d'interface + contenu accueil (fr/en/pl)
    pages/about.ts  # contenu de la page Qui suis-je (fr/en/pl)
  layouts/Base.astro      # <head> SEO (canonical, hreflang, OG), header, footer
  components/
    Header.astro          # nav + sélecteur de langue + menu mobile
    Footer.astro
    Starfield.astro       # étoiles canvas (scintillement + parallaxe scroll)
    home/Home.astro       # page d'accueil (hero GSAP, cartes-portails…)
    about/About.astro     # page Qui suis-je
  pages/                  # routes par langue (wrappers fins)
    index.astro  qui-suis-je.astro
    en/index.astro  en/about.astro
    pl/index.astro  pl/o-mnie.astro
```

## Ajouter une page

1. Créer le contenu par langue dans `src/i18n/pages/<page>.ts`.
2. Créer le composant dans `src/components/<page>/`.
3. Ajouter le slug par langue dans `routes` (`src/i18n/utils.ts`).
4. Créer les 3 wrappers dans `src/pages/`.

## Ajouter une langue

1. Ajouter le code dans `locales` (`src/i18n/utils.ts`) et `astro.config.mjs`.
2. Compléter les dictionnaires (`ui.ts`, `pages/*.ts`, `routes`).

⚠️ Les traductions EN/PL actuelles sont des premiers jets (générés) — à faire
relire par un locuteur natif avant mise en production.
