import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

/**
 * NOUVEAU SITE « Relier » (proposition de refonte), construit À CÔTÉ du site
 * actuel, sans le modifier : mêmes contenus (src/content, src/data, public/),
 * donc même /admin pour Christine. Seule la présentation change (dossier
 * nouveau-site/). Le site en ligne (OVH) n'est pas concerné : il continue
 * d'être construit par astro.config.mjs.
 *
 * Cibles (variable NOUVEAU_SITE_TARGET) :
 *  - vercel   : aperçu Vercel, servi sous /nouveau-site/ à côté du site actuel
 *  - artifact : copie statique à partager (liens rendus relatifs ensuite)
 *  - (vide)   : essai local dans ./dist-nouveau-site/
 */
const target = process.env.NOUVEAU_SITE_TARGET;

export default defineConfig({
  site: 'https://www.christinecal.com',
  srcDir: './nouveau-site',
  base: target === 'vercel' ? '/nouveau-site' : '/',
  outDir: target === 'vercel' ? '../v3/nouveau-site' : './dist-nouveau-site',
  cacheDir: './node_modules/.astro-nouveau-site',
  integrations: [mdx()],
  vite: {
    define: { 'import.meta.env.NOUVEAU_SITE_TARGET': JSON.stringify(target ?? '') },
  },
});
