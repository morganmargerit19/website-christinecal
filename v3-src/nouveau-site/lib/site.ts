/** Chemins, coordonnées et petites aides partagées par toutes les pages. */

/** Préfixe `base` d'Astro (« /nouveau-site » sur l'aperçu Vercel), sans slash final. */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** URL interne préfixée par `base` : u('/agenda/') → /nouveau-site/agenda/ */
export const u = (path: string) => base + path;

/** Copie à partager (artifact) : pas d'iframe YouTube, les vidéos s'ouvrent sur YouTube. */
export const isArtifact = import.meta.env.NOUVEAU_SITE_TARGET === 'artifact';

/** Maquette : bouton « Donner mon avis » et page Proposition. À passer à false à la mise en ligne. */
export const SHOW_PROPOSITION = false;

export type Hub = 'eveil-a-soi' | 'eveil-au-soi';

export const HUBS: Record<Hub, { label: string; path: string; sub: string }> = {
  'eveil-a-soi': { label: 'Éveil à Soi', path: '/eveil-a-soi/', sub: "Coaching · Stages d'Éveil" },
  'eveil-au-soi': { label: 'Éveil au Soi', path: '/eveil-au-soi/', sub: 'Mont Shasta · Telos · Bugarach' },
};

export const fichePath = (hub: Hub, slug: string) => u(`/${hub}/${slug}/`);

// Coordonnées et annonce : modifiables par Christine dans « Mon espace » (Petites infos).
import infos from '../../src/data/infos.json';
export const CONTACT = {
  email: infos.email || 'cc.christinecal@gmail.com',
  phone: infos.telephone || '06 80 42 85 91',
  tel: '+33' + (infos.telephone || '06 80 42 85 91').replace(/\D/g, '').replace(/^0/, ''),
};
export const ANNONCE = infos.annonce?.actif && infos.annonce.texte ? infos.annonce : null;

/** Lien « M'écrire » avec un objet pré-rempli (ex. inscription à un stage). */
export const mailto = (subject?: string) =>
  `mailto:${CONTACT.email}${subject ? '?subject=' + encodeURIComponent(subject) : ''}`;

/**
 * Menu (retours de Christine, 12/10) : Mission en accès direct (beaucoup de
 * ses clients sont peu à l'aise avec Internet), la consultation reste dans
 * Éveil à Soi, l'École 5D et le Mont Shasta deviennent des sections à part.
 * `also` : les pages rattachées qui allument la même entrée.
 */
export const ECOLE_PATH = '/eveil-a-soi/construire-son-vaisseau/';
export const SHASTA_PATH = '/eveil-au-soi/les-intra-telos-mont-shasta/';
export const NAV: { label: string; path: string; also?: string[] }[] = [
  { label: 'Qui suis-je', path: '/qui-suis-je/' },
  { label: 'Mission', path: '/mission/' },
  { label: 'Éveil à Soi', path: '/eveil-a-soi/' },
  { label: 'École 5D', path: ECOLE_PATH },
  { label: 'Éveil au Soi', path: '/eveil-au-soi/' },
  { label: 'Mont Shasta', path: SHASTA_PATH },
  { label: 'Agenda', path: '/agenda/' },
  { label: 'Vidéos', path: '/videos/' },
  { label: 'Contact', path: '/contact/' },
];

/** Retire les balises HTML d'un texte saisi au CMS (pour un résumé ou un attribut). */
export const plain = (html: string) => html.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

/**
 * « 2019 — Contact avec… » → { date: '2019', text: 'Contact avec…' }.
 * Les listes datées de la page Qui suis-je sont saisies ainsi au CMS.
 */
export function splitDated(item: string): { date?: string; text: string } {
  const m = item.match(/^\s*([^—–]{1,40}?)\s+[—–]\s+(.+)$/s);
  return m ? { date: m[1].trim(), text: m[2].trim() } : { text: item };
}
