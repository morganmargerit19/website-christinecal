import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.christinecal.com',
  // Phase « surprise » : la V3 (site complet) est servie sous /v3/, en parallèle
  // de la V2 (/v2/, le teaser que Christine connaît) et du site v1 (racine).
  // Le build sort dans ../v3/ qui est commité tel quel (déploiement Vercel
  // statique sans étape de build). À la bascule finale : retirer base/outDir.
  base: '/v3',
  outDir: '../v3',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
