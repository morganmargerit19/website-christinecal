import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://www.christinecal.com',
  // Phase aperçu : la V2 est servie sous /v2/ à côté du site v1 (racine).
  // Le build sort dans ../v2/ qui est commité tel quel (déploiement Vercel
  // statique sans étape de build). À la bascule finale : retirer base/outDir.
  base: '/v2',
  outDir: '../v2',
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
