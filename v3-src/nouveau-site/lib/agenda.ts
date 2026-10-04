/**
 * Agenda automatique. Christine écrit ses dates en clair dans /admin (une
 * ligne par date : « 3–9 juillet 2027 », « 1er–2 mai 2027 », « Août 2027 »,
 * « À partir de septembre 2026 », « 14/03/2027 »…). Le site les comprend, les
 * range dans l'ordre et retire tout seul les dates passées, sur la page
 * Agenda comme sur l'accueil. Le texte affiché reste exactement le sien.
 * Une date non reconnue (« Me contacter », « Sur demande ») range le stage
 * dans la ligne « Sur demande ».
 */
import type { CollectionEntry } from 'astro:content';
import { slugOf } from '../../src/lib/fiches';
import { fichePath, type Hub } from './site';

type Fiche = CollectionEntry<'fiches'>;

const MONTHS: [RegExp, number][] = [
  [/^janv/, 0], [/^f[eé]v/, 1], [/^mars$/, 2], [/^avr/, 3], [/^mai$/, 4], [/^juin$/, 5],
  [/^juil/, 6], [/^ao[uû]t$/, 7], [/^sept?/, 8], [/^oct/, 9], [/^nov/, 10], [/^d[eé]c/, 11],
];

const monthOf = (word: string) => MONTHS.find(([re]) => re.test(word))?.[1];
const iso = (d: Date) => d.toISOString().slice(0, 10);
const day = (y: number, m: number, d: number) => new Date(Date.UTC(y, m, d));
const lastDay = (y: number, m: number) => new Date(Date.UTC(y, m + 1, 0));

export type ParsedDate = { start: Date; end: Date | null; ongoing: boolean; precision: 'day' | 'month' | 'year' };

export function parseDate(label: string, today = new Date()): ParsedDate | null {
  const n = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/(\d)\s*(er|eme|e)\b/g, '$1');
  const ongoing = /^(a partir|des\s|depuis|chaque|tous les|toute l)/.test(n.trim());

  // Format numérique 14/03/2027 (ou 14/03 – 16/03/2027)
  const nums = [...n.matchAll(/\b(\d{1,2})[/.](\d{1,2})(?:[/.](\d{2,4}))?\b/g)];
  if (nums.length) {
    const year = (s?: string) => (s ? (s.length === 2 ? 2000 + +s : +s) : undefined);
    const lastYear = year(nums[nums.length - 1][3]) ?? today.getUTCFullYear();
    const [a, b] = [nums[0], nums[nums.length - 1]];
    const start = day(year(a[3]) ?? lastYear, +a[2] - 1, +a[1]);
    const end = day(year(b[3]) ?? lastYear, +b[2] - 1, +b[1]);
    return { start, end: ongoing ? null : end, ongoing, precision: 'day' };
  }

  const tokens = [...n.matchAll(/[a-z]+|\d+/g)].map((m) => m[0]);
  const months = tokens.map((t, i) => ({ i, m: monthOf(t) })).filter((x) => x.m !== undefined) as { i: number; m: number }[];
  const years = tokens.map((t, i) => ({ i, y: /^20\d\d$/.test(t) ? +t : NaN })).filter((x) => !isNaN(x.y));
  const isDay = (t: string) => /^\d{1,2}$/.test(t) && +t >= 1 && +t <= 31;

  if (!months.length) {
    if (!years.length) return null;
    const y = years[0].y;
    return { start: day(y, 0, 1), end: ongoing ? null : day(y, 11, 31), ongoing, precision: 'year' };
  }

  const first = months[0];
  const last = months[months.length - 1];
  const yearAfter = (pos: number) => years.find((x) => x.i > pos)?.y ?? years[years.length - 1]?.y;
  const dayBefore = (pos: number, from: number) => {
    const ds = tokens.slice(from, pos).filter(isDay);
    return ds.length ? ds : null;
  };

  const startDays = dayBefore(first.i, 0);
  const endDays = first === last ? startDays : dayBefore(last.i, first.i + 1);
  let endYear = yearAfter(last.i);
  let startYear = yearAfter(first.i);

  // Pas d'année écrite : la prochaine occurrence de ce mois
  if (endYear === undefined) {
    endYear = today.getUTCFullYear();
    if (lastDay(endYear, last.m) < today) endYear++;
    startYear = endYear;
  }
  if (startYear === undefined) startYear = endYear;
  if (first.m > last.m && startYear === endYear) startYear--; // 28 déc. – 2 janv. 2028

  const start = day(startYear, first.m, startDays ? +startDays[0] : 1);
  const end = endDays ? day(endYear, last.m, +endDays[endDays.length - 1]) : lastDay(endYear, last.m);
  return { start, end: ongoing ? null : end, ongoing, precision: startDays ? 'day' : 'month' };
}

export type AgendaEntry = {
  label: string;
  title: string;
  href: string;
  rubrique?: string;
  info?: string;
  /** Fin (ISO) : l'entrée disparaît le lendemain. Absente = « à partir de… ». */
  end?: string;
  sort: string;
  subject: string;
};

export function buildAgenda(fiches: Fiche[], today = new Date()) {
  const bySlug = new Map(fiches.map((f) => [slugOf(f.id), f]));
  const entries: AgendaEntry[] = [];
  const onDemand: { title: string; href: string }[] = [];
  const todayIso = iso(today);

  for (const f of fiches) {
    const d = f.data;
    const href = fichePath(d.hub as Hub, slugOf(f.id));
    const rubrique = d.rubrique ? bySlug.get(d.rubrique)?.data.title : undefined;
    const info = [d.place, d.format, d.duration].filter(Boolean).join(' · ') || undefined;
    let dated = false;
    for (const label of d.dates.filter((x) => x.trim())) {
      const p = parseDate(label, today);
      if (!p) continue;
      dated = true;
      const end = p.end ? iso(p.end) : undefined;
      if (end && end < todayIso) continue; // déjà passé au moment du build
      const sortDate = p.precision === 'year' && !p.ongoing ? p.end! : p.start;
      entries.push({
        label, title: d.title, href, rubrique, info, end,
        sort: iso(sortDate) + d.title,
        subject: `Inscription : ${d.title} (${label})`,
      });
    }
    if (!dated && d.dates.some((x) => x.trim())) onDemand.push({ title: d.title, href });
  }
  entries.sort((a, b) => a.sort.localeCompare(b.sort));
  return { entries, onDemand };
}

/** Prochaine date à venir d'une fiche (texte de Christine), s'il y en a une. */
export function nextDate(f: Fiche['data'], today = new Date()) {
  const todayIso = iso(today);
  return f.dates.find((label) => {
    const p = parseDate(label, today);
    return p && (!p.end || iso(p.end) >= todayIso);
  });
}
