import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Cible de build :
//  - défaut (preview Vercel) : le site vit sous /v3/, sortie dans ../v3/ (commité
//    tel quel, invisible à côté du teaser, en noindex via vercel.json).
//  - DEPLOY_TARGET=ovh (production) : le site vit à la RACINE du domaine, sortie
//    dans ./dist/ → envoyé en FTP sur l'hébergement mutualisé OVH (christinecal.com).
//    À la bascule, c'est cette cible qui devient le site officiel.
const isOvh = process.env.DEPLOY_TARGET === 'ovh';

export default defineConfig({
  site: 'https://www.christinecal.com',
  base: isOvh ? '/' : '/v3',
  outDir: isOvh ? './dist' : '../v3',
  integrations: [sitemap()],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
