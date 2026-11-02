import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

/**
 * NOUVEAU SITE « Relier », EN LIGNE sur christinecal.com depuis le 02/11/2026 :
 * c'est lui que le déploiement OVH construit. Mêmes contenus que l'ancien design
 * (src/content, src/data, public/), modifiés par Christine dans « Mon espace ».
 * Retour arrière : faire reconstruire astro.config.mjs (ancien design, dossier
 * src/) par .github/workflows/deploy-ovh.yml.
 *
 * Cibles (variable NOUVEAU_SITE_TARGET) :
 *  - ovh      : PRODUCTION (christinecal.com), sortie ./dist/, indexé, plan du site
 *  - vercel   : aperçu Vercel, servi sous /nouveau-site/ à côté de l'ancien design
 *  - artifact : copie statique à partager (liens rendus relatifs ensuite)
 *  - (vide)   : essai local dans ./dist-nouveau-site/
 */
const target = process.env.NOUVEAU_SITE_TARGET;
const isOvh = target === 'ovh';

export default defineConfig({
  site: 'https://www.christinecal.com',
  srcDir: './nouveau-site',
  base: target === 'vercel' ? '/nouveau-site' : '/',
  outDir: target === 'vercel' ? '../v3/nouveau-site' : isOvh ? './dist' : './dist-nouveau-site',
  cacheDir: './node_modules/.astro-nouveau-site',
  integrations: isOvh ? [mdx(), sitemap()] : [mdx()],
  vite: {
    define: { 'import.meta.env.NOUVEAU_SITE_TARGET': JSON.stringify(target ?? '') },
  },
});
