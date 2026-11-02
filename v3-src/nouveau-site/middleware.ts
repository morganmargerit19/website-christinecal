/**
 * Langue de chaque page : /en/…, /es/…, /it/…, /pl/… (le français à la racine).
 * - pose la langue pour toute la construction de la page (tr(), getFichesL()…) ;
 * - sur une page traduite, fait pointer les liens internes vers la même langue
 *   (« /qui-suis-je/ » → « /en/qui-suis-je/ ») : les composants écrivent leurs
 *   liens sans se soucier de la langue. Un lien marqué « § » (sélecteur de langue,
 *   hreflang) est laissé tel quel.
 */
import { defineMiddleware } from 'astro:middleware';
import { base } from './lib/site';
import { OTHER_LANGS, isLang, withLang, type Lang } from './lib/i18n';

const ASSET = /^\/(_astro|images|audio|mon-espace|favicon)|\.[a-z0-9]{2,5}$/i;

export const onRequest = defineMiddleware((context, next) => {
  const rest = context.url.pathname.slice(base.length);
  const first = rest.split('/')[1];
  const l: Lang = isLang(first) && first !== 'fr' ? first : 'fr';
  return withLang(l, async () => {
    const res = await next();
    if (!(res.headers.get('content-type') ?? '').includes('text/html')) return res;
    let html = await res.text();
    if (l !== 'fr') {
      const langs = OTHER_LANGS.join('|');
      html = html.replace(/(\shref=")([^"#?]*)/g, (all, attr: string, href: string) => {
        if (!href.startsWith(base + '/')) return all;
        const path = href.slice(base.length);
        if (ASSET.test(path) || new RegExp(`^/(${langs})(/|$)`).test(path)) return all;
        return attr + base + '/' + l + path;
      });
    }
    html = html.replaceAll('href="§', 'href="');
    return new Response(html, { status: res.status, statusText: res.statusText, headers: res.headers });
  });
});
