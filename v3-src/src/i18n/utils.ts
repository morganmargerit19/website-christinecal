export const locales = ['fr', 'en', 'pl'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  pl: 'Polski',
};

/**
 * Chaque page logique du site a un slug par langue.
 * Le sélecteur de langue s'appuie sur cette table pour basculer
 * vers la même page dans une autre langue.
 *
 * ⚠️ Phase « surprise » V3 : seules `home` et `about` sont traduites FR/EN/PL.
 * Les pages ajoutées ce soir (hubs, consultation, légal) sont FR uniquement ;
 * leurs entrées en/pl pointent provisoirement sur l'URL FR pour ne pas casser
 * le sélecteur de langue. À traduire dans une passe ultérieure (relecture native).
 */
export type RouteKey =
  | 'home'
  | 'about'
  | 'eveilASoi'
  | 'eveilAuSoi'
  | 'consultation'
  | 'contact'
  | 'mentions'
  | 'confidentialite'
  | 'cookies';

export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en/', pl: '/pl/' },
  about: { fr: '/qui-suis-je/', en: '/en/about/', pl: '/pl/o-mnie/' },
  // FR-only pour l'instant (en/pl = FR) — à traduire plus tard.
  eveilASoi: { fr: '/eveil-a-soi/', en: '/eveil-a-soi/', pl: '/eveil-a-soi/' },
  eveilAuSoi: { fr: '/eveil-au-soi/', en: '/eveil-au-soi/', pl: '/eveil-au-soi/' },
  consultation: {
    fr: '/eveil-a-soi/consultation-mediumnique/',
    en: '/eveil-a-soi/consultation-mediumnique/',
    pl: '/eveil-a-soi/consultation-mediumnique/',
  },
  contact: { fr: '/contact/', en: '/contact/', pl: '/contact/' },
  mentions: { fr: '/mentions-legales/', en: '/mentions-legales/', pl: '/mentions-legales/' },
  confidentialite: {
    fr: '/politique-de-confidentialite/',
    en: '/politique-de-confidentialite/',
    pl: '/politique-de-confidentialite/',
  },
  cookies: { fr: '/cookies/', en: '/cookies/', pl: '/cookies/' },
};

/** Préfixe `base` d'Astro (ex. « /v3 » pendant la phase aperçu), sans slash final. */
export const base = import.meta.env.BASE_URL.replace(/\/$/, '');

export function pathFor(key: RouteKey, locale: Locale): string {
  return base + routes[key][locale];
}

/** Métadonnées des deux univers (libellés + route). */
export const hubs: Record<'eveil-a-soi' | 'eveil-au-soi', { key: RouteKey; label: string }> = {
  'eveil-a-soi': { key: 'eveilASoi', label: 'Éveil à Soi' },
  'eveil-au-soi': { key: 'eveilAuSoi', label: 'Éveil au Soi' },
};

/** URL d'une fiche (préfixée par `base` et son hub). */
export function fichePath(hub: 'eveil-a-soi' | 'eveil-au-soi', slug: string): string {
  return `${base}/${hub}/${slug}/`;
}
