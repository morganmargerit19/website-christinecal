import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';

// Cible de build (le site vit à la RACINE dans tous les cas — plus de /v3) :
//  - défaut (aperçu Vercel) : sortie dans ../v3/, servie À LA RACINE par Vercel
//    (vercel.json → "outputDirectory": "v3"). Toujours en noindex (privé).
//  - DEPLOY_TARGET=ovh (production) : sortie dans ./dist/ → envoyé en FTP sur
//    l'hébergement mutualisé OVH (christinecal.com).
const isOvh = process.env.DEPLOY_TARGET === 'ovh';

export default defineConfig({
  site: 'https://www.christinecal.com',
  base: '/',
  outDir: isOvh ? './dist' : '../v3',
  integrations: [mdx(), sitemap()],
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en', 'pl'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
