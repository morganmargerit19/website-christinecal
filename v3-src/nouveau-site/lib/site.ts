/** Chemins, coordonnées et petites aides partagées par toutes les pages. */

/** Préfixe `base` d'Astro (« /nouveau-site » sur l'aperçu Vercel), sans slash final. */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

/** URL interne préfixée par `base` : u('/agenda/') → /nouveau-site/agenda/ */
export const u = (path: string) => base + path;

/** Copie à partager (artifact) : pas d'iframe YouTube, les vidéos s'ouvrent sur YouTube. */
export const isArtifact = import.meta.env.NOUVEAU_SITE_TARGET === 'artifact';

/** Maquette : bouton « Donner mon avis » et page Proposition. À passer à false à la mise en ligne. */
export const SHOW_PROPOSITION = true;

export type Hub = 'eveil-a-soi' | 'eveil-au-soi';

export const HUBS: Record<Hub, { label: string; path: string; sub: string }> = {
  'eveil-a-soi': { label: 'Éveil à Soi', path: '/eveil-a-soi/', sub: "Coaching · Stages d'Éveil" },
  'eveil-au-soi': { label: 'Éveil au Soi', path: '/eveil-au-soi/', sub: 'Mont Shasta · Telos · Bugarach' },
};

export const fichePath = (hub: Hub, slug: string) => u(`/${hub}/${slug}/`);

export const CONTACT = {
  email: 'cc.christinecal@gmail.com',
  phone: '06 80 42 85 91',
  tel: '+33680428591',
};

/** Lien « M'écrire » avec un objet pré-rempli (ex. inscription à un stage). */
export const mailto = (subject?: string) =>
  `mailto:${CONTACT.email}${subject ? '?subject=' + encodeURIComponent(subject) : ''}`;

/**
 * Menu proposé (7 entrées, dans l'ordre de la visite) : qui elle est, ce
 * qu'elle propose seul à seul, puis en groupe, quand, et pour voir / écouter.
 * Le logo ramène à l'accueil ; « Ma mission » est rattachée à Qui suis-je.
 */
export const NAV = [
  { label: 'Qui suis-je', path: '/qui-suis-je/', also: ['/mission/'] },
  { label: 'Consultation', path: '/eveil-a-soi/consultation-mediumnique/' },
  { label: 'Éveil à Soi', path: '/eveil-a-soi/' },
  { label: 'Éveil au Soi', path: '/eveil-au-soi/' },
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
