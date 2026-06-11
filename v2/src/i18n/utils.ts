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
 */
export type RouteKey = 'home' | 'about';

export const routes: Record<RouteKey, Record<Locale, string>> = {
  home: { fr: '/', en: '/en/', pl: '/pl/' },
  about: { fr: '/qui-suis-je/', en: '/en/about/', pl: '/pl/o-mnie/' },
};

export function pathFor(key: RouteKey, locale: Locale): string {
  return routes[key][locale];
}
