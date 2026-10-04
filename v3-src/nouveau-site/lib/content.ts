/**
 * Ce que les pages « vitrines » (accueil, univers) piochent dans les fiches :
 * rien n'est recopié à la main, tout suit ce que Christine publie au CMS.
 */
import type { CollectionEntry } from 'astro:content';
import { childSlugs, slugOf, stagesOf } from '../../src/lib/fiches';
import { nextDate, parseDate } from './agenda';
import { fichePath, type Hub } from './site';

type Fiche = CollectionEntry<'fiches'>;

/** Fiches affichées directement sur la page d'un univers (hors stages rangés en rubrique). */
export function topLevel(fiches: Fiche[], hub: Hub) {
  const nested = childSlugs(fiches);
  return fiches
    .filter((f) => f.data.hub === hub && !nested.has(slugOf(f.id)))
    .sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order);
}

/** Petite ligne d'infos d'une fiche : « 3 stages · 27–29 mars 2027 » ou « Via Zoom · 1h30 – 2h · 70 € ». */
export function metaLine(f: Fiche, fiches: Fiche[]) {
  const kids = stagesOf(f, fiches);
  if (kids.length) {
    const next = kids.map((k) => nextDate(k.data)).find(Boolean);
    return [`${kids.length} stage${kids.length > 1 ? 's' : ''}`, next].filter(Boolean).join(' · ');
  }
  const facts = [f.data.format, f.data.duration, f.data.price].filter(Boolean).join(' · ');
  return [nextDate(f.data), facts].filter(Boolean).join(' · ');
}

export type Dvd = {
  id: string; title: string; meta?: string; cover: string; coverAlt?: string;
  href: string; sort: string;
};

/** Toutes les vidéos DVD Debowska (avec jaquette) des fiches, de la plus récente à la plus ancienne. */
export function dvds(fiches: Fiche[]): Dvd[] {
  const seen = new Set<string>();
  const list: Dvd[] = [];
  for (const f of fiches) {
    const inline = f.data.inlineMedia.map((m) => m.video).filter(Boolean);
    for (const v of [...f.data.videos, ...inline] as NonNullable<(typeof inline)[number]>[]) {
      if (v.credit !== 'debowska' || !v.cover || seen.has(v.id)) continue;
      seen.add(v.id);
      const d = v.meta ? parseDate(v.meta) : null;
      list.push({
        id: v.id, title: v.title ?? f.data.title, meta: v.meta, cover: v.cover, coverAlt: v.coverAlt,
        href: fichePath(f.data.hub as Hub, slugOf(f.id)),
        sort: d ? d.start.toISOString() : '0000',
      });
    }
  }
  return list.sort((a, b) => b.sort.localeCompare(a.sort));
}

/** Quelques témoignages courts, de fiches différentes, pour l'accueil. */
export function someTestimonials(fiches: Fiche[], count = 3) {
  const picked: { quote: string; author?: string }[] = [];
  const used = new Set<string>();
  const ordered = [...fiches].sort((a, b) => Number(b.data.featured) - Number(a.data.featured) || a.data.order - b.data.order);
  for (const max of [200, 320]) {
    for (const f of ordered) {
      if (picked.length >= count) break;
      if (used.has(f.id)) continue;
      const t = f.data.testimonials.find((x) => x.quote.length <= max);
      if (t) { picked.push(t); used.add(f.id); }
    }
  }
  // Pas assez de fiches avec témoignages : on complète avec d'autres témoignages courts.
  for (const f of ordered) {
    for (const t of f.data.testimonials) {
      if (picked.length >= count) return picked;
      if (t.quote.length <= 320 && !picked.includes(t)) picked.push(t);
    }
  }
  return picked;
}

/** Découpe un texte en membres de phrase, pour l'animation « écriture » de l'épigraphe. */
export const clauses = (text: string) => text.split(/(?<=[,:;.])\s+/).filter(Boolean);

export type VideoItem = {
  id: string; title: string; meta?: string; credit?: 'debowska'; cover?: string; coverAlt?: string;
  from?: { title: string; href: string };
};

/**
 * Toutes les vidéos du site, une seule fois chacune, avec la page d'où elles
 * viennent : DVD Debowska d'un côté, conférences et interviews de l'autre.
 */
export function allVideos(fiches: Fiche[], extra: VideoItem[] = []) {
  const seen = new Set<string>();
  const dvd: VideoItem[] = [];
  const talks: VideoItem[] = [];
  const push = (v: VideoItem) => {
    if (!v.id || seen.has(v.id)) return;
    seen.add(v.id);
    (v.credit === 'debowska' ? dvd : talks).push(v);
  };
  const ordered = [...fiches].sort((a, b) => a.data.order - b.data.order);
  for (const f of ordered) {
    const from = { title: f.data.title, href: fichePath(f.data.hub as Hub, slugOf(f.id)) };
    for (const v of f.data.videos) push({ ...v, title: v.title ?? f.data.title, from });
    for (const m of f.data.inlineMedia) if (m.video) push({ ...m.video, title: m.video.title ?? f.data.title, from });
  }
  extra.forEach(push);
  const date = (v: VideoItem) => (v.meta ? parseDate(v.meta)?.start.toISOString() : undefined) ?? '0000';
  dvd.sort((a, b) => date(b).localeCompare(date(a)));
  return { dvd, talks };
}
