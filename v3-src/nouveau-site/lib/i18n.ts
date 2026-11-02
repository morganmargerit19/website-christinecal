/**
 * Langues du site. Le français est la langue de référence : Christine écrit en
 * français dans Mon espace, et chaque langue reprend tout ce qui ne se traduit
 * pas (dates, lieux, tarifs, photos, vidéos) depuis le français. Les textes
 * traduits viennent de :
 *  - ui.json : les textes de l'interface, rangés par leur version française ;
 *  - src/data/<page>.<langue>.json : les pages Qui suis-je, Mission, univers ;
 *  - src/content/fiches/<langue>/ : les fiches de stages.
 * Un texte sans traduction reste en français (rien ne disparaît du site).
 *
 * La langue de la page en cours de construction est posée par le middleware
 * (AsyncLocalStorage) : tr(), getFichesL(), pageData() la lisent d'eux-mêmes.
 */
import { AsyncLocalStorage } from 'node:async_hooks';
import type { CollectionEntry } from 'astro:content';
import { getFiches, slugOf } from '../../src/lib/fiches';
import UI from './ui.json';

export const LANGS = ['fr', 'en', 'es', 'it', 'pl'] as const;
export type Lang = (typeof LANGS)[number];
export const OTHER_LANGS = LANGS.filter((l) => l !== 'fr') as Exclude<Lang, 'fr'>[];
export const LANG_NAMES: Record<Lang, string> = { fr: 'Français', en: 'English', es: 'Español', it: 'Italiano', pl: 'Polski' };
/** Code pour <html lang> et hreflang. */
export const HTML_LANG: Record<Lang, string> = { fr: 'fr', en: 'en', es: 'es', it: 'it', pl: 'pl' };

const store = new AsyncLocalStorage<Lang>();
export const withLang = <T>(lang: Lang, fn: () => T) => store.run(lang, fn);
/** Langue de la page en cours. */
export const lang = (): Lang => store.getStore() ?? 'fr';
export const isLang = (s: unknown): s is Lang => typeof s === 'string' && (LANGS as readonly string[]).includes(s);

/** Pour getStaticPaths : chaque page existe en français (racine) et dans chaque langue (/en/…). */
export const langPaths = () => [{ params: { lang: undefined } }, ...OTHER_LANGS.map((l) => ({ params: { lang: l } }))];

type Dict = Record<string, Partial<Record<Lang, string>>>;
const ui = UI as Dict;
const missing = new Set<string>();

/** Traduit un texte de l'interface, donné en français. */
export function tr(fr: string, vars?: Record<string, string | number>): string {
  const l = lang();
  let s = l === 'fr' ? fr : ui[fr]?.[l];
  if (s === undefined) { if (l !== 'fr') missing.add(fr); s = fr; }
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.replaceAll(`{${k}}`, String(v));
  return s;
}
/** Le dictionnaire connaît-il ce texte ? (pour les textes libres de Christine, traduits seulement s'ils sont connus) */
export const hasTr = (fr: string) => fr in ui;
/** Pluriel simple : trn('{n} stage', '{n} stages', n). */
export const trn = (one: string, many: string, n: number) => tr(n === 1 ? one : many, { n });
/** Textes sans traduction rencontrés pendant le build (affichés à la fin). */
export const missingTranslations = () => [...missing];

// ------------------------------------------------------------------ Dates et infos pratiques
// Christine écrit en français (« 14–15 mars 2027 », « À partir de septembre 2026 », « 3 jours ») :
// on traduit les mots, les nombres restent les siens.
const MONTHS: Record<Exclude<Lang, 'fr'>, string[]> = {
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
  es: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
  it: ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'],
  pl: ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'],
};
// Mois seul (« Août 2027 ») : au nominatif en polonais.
const MONTHS_ALONE: Partial<Record<Exclude<Lang, 'fr'>, string[]>> = {
  pl: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
};
const WORDS: Record<Exclude<Lang, 'fr'>, [RegExp, string][]> = {
  en: [[/^à partir d[e']\s*/i, 'From '], [/^dès\s+/i, 'From '], [/^depuis\s+/i, 'Since '], [/^me contacter$/i, 'Contact me'], [/^sur demande$/i, 'On request'], [/\b(\d+)er\b/g, '$1'], [/\bet\b/g, 'and'], [/\bau\b/g, 'to']],
  es: [[/^à partir d[e']\s*/i, 'A partir de '], [/^dès\s+/i, 'Desde '], [/^depuis\s+/i, 'Desde '], [/^me contacter$/i, 'Contactarme'], [/^sur demande$/i, 'Bajo petición'], [/\b(\d+)er\b/g, '$1'], [/\bet\b/g, 'y'], [/\bau\b/g, 'al']],
  it: [[/^à partir d[e']\s*/i, 'A partire da '], [/^dès\s+/i, 'Da '], [/^depuis\s+/i, 'Da '], [/^me contacter$/i, 'Contattatemi'], [/^sur demande$/i, 'Su richiesta'], [/\b(\d+)er\b/g, '$1'], [/\bet\b/g, 'e'], [/\bau\b/g, 'al']],
  pl: [[/^à partir d[e']\s*/i, 'Od '], [/^dès\s+/i, 'Od '], [/^depuis\s+/i, 'Od '], [/^me contacter$/i, 'Proszę o kontakt'], [/^sur demande$/i, 'Na zapytanie'], [/\b(\d+)er\b/g, '$1'], [/\bet\b/g, 'i'], [/\bau\b/g, 'do']],
};
const MONTH_RE = /(janvier|janv\.?|f[ée]vrier|f[ée]vr?\.?|mars|avril|avr\.?|mai|juin|juillet|juil\.?|ao[uû]t|septembre|sept?\.?|octobre|oct\.?|novembre|nov\.?|d[ée]cembre|d[ée]c\.?)(?![a-zà-ÿ])/giu;
const MONTH_KEYS = ['jan', 'fev', 'mar', 'avr', 'mai', 'juin', 'juil', 'aou', 'sep', 'oct', 'nov', 'dec'];
const monthIndex = (w: string) => {
  const n = w.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  return MONTH_KEYS.findIndex((k) => n.startsWith(k));
};

/** Une date écrite par Christine, dans la langue de la page. */
export function localDate(label: string): string {
  const l = lang();
  if (l === 'fr' || !label) return label;
  let s = label.trim();
  for (const [re, to] of WORDS[l]) s = s.replace(re, to);
  return s.replace(MONTH_RE, (word, _m, offset: number, whole: string) => {
    const i = monthIndex(word);
    if (i < 0) return word;
    const before = whole.slice(0, offset);
    const afterDay = /\d\s*$/.test(before); // « 14 mars » (génitif en polonais) ou « Août 2027 »
    let name = (!afterDay && MONTHS_ALONE[l]?.[i]) || MONTHS[l][i];
    if (l === 'en' || /^\s*$/.test(before) || /[.!?]\s*$/.test(before)) name = name[0].toUpperCase() + name.slice(1);
    return name;
  });
}

const PRACTICAL: Record<Exclude<Lang, 'fr'>, [RegExp, string][]> = {
  en: [[/présentiel ou zoom/i, 'In person or Zoom'], [/séance via zoom/i, 'Session via Zoom'], [/en présentiel/i, 'In person'], [/présentiel/i, 'In person'], [/via zoom/i, 'via Zoom'], [/(\d+)\s*jours?\b/gi, (_: string, n: string) => `${n} day${+n > 1 ? 's' : ''}`] as never, [/(\d+)\s*semaines?\b/gi, (_: string, n: string) => `${n} week${+n > 1 ? 's' : ''}`] as never, [/\bnuits?\b/gi, 'nights'], [/\bou\b/g, 'or'], [/\bet\b/g, 'and'], [/\bpar personne\b/gi, 'per person'], [/\bsur demande\b/gi, 'on request'], [/\bà préciser\b/gi, 'to be confirmed']],
  es: [[/présentiel ou zoom/i, 'Presencial o Zoom'], [/séance via zoom/i, 'Sesión por Zoom'], [/en présentiel/i, 'Presencial'], [/présentiel/i, 'Presencial'], [/via zoom/i, 'por Zoom'], [/(\d+)\s*jours?\b/gi, (_: string, n: string) => `${n} día${+n > 1 ? 's' : ''}`] as never, [/(\d+)\s*semaines?\b/gi, (_: string, n: string) => `${n} semana${+n > 1 ? 's' : ''}`] as never, [/\bnuits?\b/gi, 'noches'], [/\bou\b/g, 'o'], [/\bet\b/g, 'y'], [/\bpar personne\b/gi, 'por persona'], [/\bsur demande\b/gi, 'bajo petición'], [/\bà préciser\b/gi, 'por confirmar']],
  it: [[/présentiel ou zoom/i, 'In presenza o Zoom'], [/séance via zoom/i, 'Sessione su Zoom'], [/en présentiel/i, 'In presenza'], [/présentiel/i, 'In presenza'], [/via zoom/i, 'su Zoom'], [/(\d+)\s*jours?\b/gi, (_: string, n: string) => `${n} giorn${+n > 1 ? 'i' : 'o'}`] as never, [/(\d+)\s*semaines?\b/gi, (_: string, n: string) => `${n} settiman${+n > 1 ? 'e' : 'a'}`] as never, [/\bnuits?\b/gi, 'notti'], [/\bou\b/g, 'o'], [/\bet\b/g, 'e'], [/\bpar personne\b/gi, 'a persona'], [/\bsur demande\b/gi, 'su richiesta'], [/\bà préciser\b/gi, 'da definire']],
  pl: [[/présentiel ou zoom/i, 'Stacjonarnie lub Zoom'], [/séance via zoom/i, 'Sesja przez Zoom'], [/en présentiel/i, 'Stacjonarnie'], [/présentiel/i, 'Stacjonarnie'], [/via zoom/i, 'przez Zoom'], [/(\d+)\s*jours?\b/gi, (_: string, n: string) => `${n} ${+n === 1 ? 'dzień' : 'dni'}`] as never, [/(\d+)\s*semaines?\b/gi, (_: string, n: string) => `${n} ${+n === 1 ? 'tydzień' : 'tygodnie'}`] as never, [/\bnuits?\b/gi, 'noce'], [/\bou\b/g, 'lub'], [/\bet\b/g, 'i'], [/\bpar personne\b/gi, 'za osobę'], [/\bsur demande\b/gi, 'na zapytanie'], [/\bà préciser\b/gi, 'do potwierdzenia']],
};
/** Lieu, format, durée, tarif écrits par Christine : on traduit les mots courants. */
export function localPractical(s: string | undefined): string | undefined {
  const l = lang();
  if (l === 'fr' || !s) return s;
  let out = s;
  for (const [re, to] of PRACTICAL[l]) out = out.replace(re, to as string);
  return out;
}

// ------------------------------------------------------------------ Contenus
type Fiche = CollectionEntry<'fiches'>;
type D = Fiche['data'];
const TEXT_FIELDS = ['title', 'kicker', 'lede', 'cardLede', 'imageAlt', 'bannerAlt', 'testimonials', 'videosHeading', 'audioTitle'] as const;

/** Textes d'une image (légende, description) pris dans la traduction, l'image restant celle du français. */
const imgText = <T extends { alt?: string; caption?: string }>(fr: T, t?: { alt?: string; caption?: string }): T =>
  t ? { ...fr, alt: t.alt ?? fr.alt, caption: t.caption ?? fr.caption } : fr;

/**
 * Fiches dans la langue de la page. La liste et tout le pratique viennent du
 * français (ce que Christine gère dans Mon espace : dates, lieu, tarif, photos,
 * vidéos, stage masqué ou supprimé) ; les textes viennent de la traduction
 * quand elle existe. Le corps de la page est celui de la traduction.
 * Photos et vidéos placées « après tel titre » : même rang dans les deux
 * langues, le repère (titre) est celui de la traduction.
 */
export async function getFichesL(): Promise<Fiche[]> {
  const fr = await getFiches('fr');
  const l = lang();
  if (l === 'fr') return fr;
  const own = new Map((await getFiches(l)).filter((e) => e.data.lang === l).map((e) => [slugOf(e.id), e]));
  return fr.map((f) => {
    const t = own.get(slugOf(f.id));
    const data = { ...f.data, place: localPractical(f.data.place), format: localPractical(f.data.format), duration: localPractical(f.data.duration), price: localPractical(f.data.price) } as D;
    if (!t) return { ...f, data };
    const td = t.data;
    for (const k of TEXT_FIELDS) if ((td as Record<string, unknown>)[k] !== undefined && (td as Record<string, unknown>)[k] !== '') (data as Record<string, unknown>)[k] = (td as Record<string, unknown>)[k];
    // Vidéos : celles du français (Christine), avec le titre traduit quand la vidéo existe dans la traduction
    const vt = new Map([...td.videos, ...td.inlineMedia.map((m) => m.video).filter(Boolean)].map((v) => [v!.id, v!]));
    data.videos = f.data.videos.map((v) => ({ ...v, title: vt.get(v.id)?.title ?? v.title, coverAlt: vt.get(v.id)?.coverAlt || v.coverAlt }));
    data.inlineMedia = f.data.inlineMedia.map((m, i) => {
      const tm = td.inlineMedia[i];
      return {
        ...m,
        section: tm?.section ?? m.section,
        video: m.video && { ...m.video, title: vt.get(m.video.id)?.title ?? m.video.title },
        images: m.images.map((im, j) => imgText(im, tm?.images[j])),
      };
    });
    data.sideImages = f.data.sideImages.map((s, i) => ({ ...imgText(s, td.sideImages[i]), section: td.sideImages[i]?.section ?? s.section }));
    data.gallery = f.data.gallery.map((g, i) => imgText(g, td.gallery[i]));
    data.bodyImage = f.data.bodyImage && imgText(f.data.bodyImage, td.bodyImage);
    data.richLayout = f.data.richLayout;
    return { ...t, id: t.id, data } as Fiche;
  });
}

const DATA = import.meta.glob<{ default: Record<string, unknown> }>('../../src/data/*.json', { eager: true });
/** Données d'une page (« about », « mission »…) dans la langue en cours, repli sur le français. */
export function pageData<T = Record<string, unknown>>(name: string): T {
  const l = lang();
  const pick = (code: string) => DATA[`../../src/data/${name}.${code}.json`]?.default;
  return (pick(l) ?? pick('fr')) as T;
}
