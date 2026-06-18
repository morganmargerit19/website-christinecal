export const locales = ['fr', 'en', 'pl', 'es', 'it'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'fr';

export const localeNames: Record<Locale, string> = {
  fr: 'Français',
  en: 'English',
  pl: 'Polski',
  es: 'Español',
  it: 'Italiano',
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
  | 'mission'
  | 'eveilASoi'
  | 'eveilAuSoi'
  | 'consultation'
  | 'contact'
  | 'mentions'
  | 'confidentialite'
  | 'cookies';

export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en/', pl: '/pl/', es: '/es/', it: '/it/' },
  about: { fr: '/qui-suis-je/', en: '/en/about/', pl: '/pl/o-mnie/', es: '/es/about/', it: '/it/about/' },
  mission: { fr: '/mission/', en: '/en/mission/', pl: '/pl/mission/', es: '/es/mission/', it: '/it/mission/' },
  eveilASoi: { fr: '/eveil-a-soi/', en: '/en/eveil-a-soi/', pl: '/pl/eveil-a-soi/', es: '/es/eveil-a-soi/', it: '/it/eveil-a-soi/' },
  eveilAuSoi: { fr: '/eveil-au-soi/', en: '/en/eveil-au-soi/', pl: '/pl/eveil-au-soi/', es: '/es/eveil-au-soi/', it: '/it/eveil-au-soi/' },
  consultation: {
    fr: '/eveil-a-soi/consultation-mediumnique/',
    en: '/en/eveil-a-soi/consultation-mediumnique/',
    pl: '/pl/eveil-a-soi/consultation-mediumnique/',
    es: '/es/eveil-a-soi/consultation-mediumnique/',
    it: '/it/eveil-a-soi/consultation-mediumnique/',
  },
  contact: { fr: '/contact/', en: '/en/contact/', pl: '/pl/contact/', es: '/es/contact/', it: '/it/contact/' },
  mentions: { fr: '/mentions-legales/', en: '/en/mentions-legales/', pl: '/pl/mentions-legales/', es: '/es/mentions-legales/', it: '/it/mentions-legales/' },
  confidentialite: {
    fr: '/politique-de-confidentialite/',
    en: '/en/politique-de-confidentialite/',
    pl: '/pl/politique-de-confidentialite/',
    es: '/es/politique-de-confidentialite/',
    it: '/it/politique-de-confidentialite/',
  },
  cookies: { fr: '/cookies/', en: '/en/cookies/', pl: '/pl/cookies/', es: '/es/cookies/', it: '/it/cookies/' },
};

/** Préfixe d'URL par langue (le FR est à la racine). */
export const localePrefix: Record<Locale, string> = { fr: '', en: '/en', pl: '/pl', es: '/es', it: '/it' };

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

/** URL d'une fiche (préfixée par `base`, la langue et son hub). */
export function fichePath(
  hub: 'eveil-a-soi' | 'eveil-au-soi',
  slug: string,
  locale: Locale = 'fr',
): string {
  return `${base}${localePrefix[locale]}/${hub}/${slug}/`;
}
