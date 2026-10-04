/**
 * Dimensions des images de public/ lues au build (en-têtes JPEG/PNG/WebP/GIF,
 * sans dépendance). Sert à choisir la bonne présentation pour n'importe quelle
 * photo envoyée par Christine au CMS : une photo « normale » est recadrée en
 * cercle ou en carte, un bandeau très large (titre graphique de stage, panorama)
 * est montré en entier. Aucune photo ne peut donc « casser » la mise en page.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { CollectionEntry } from 'astro:content';

type Size = { w: number; h: number };
const cache = new Map<string, Size | null>();

function readSize(buf: Buffer): Size | null {
  // PNG
  if (buf.length > 24 && buf.readUInt32BE(0) === 0x89504e47) {
    return { w: buf.readUInt32BE(16), h: buf.readUInt32BE(20) };
  }
  // GIF
  if (buf.toString('ascii', 0, 3) === 'GIF') {
    return { w: buf.readUInt16LE(6), h: buf.readUInt16LE(8) };
  }
  // WebP (VP8 / VP8L / VP8X)
  if (buf.toString('ascii', 0, 4) === 'RIFF' && buf.toString('ascii', 8, 12) === 'WEBP') {
    const kind = buf.toString('ascii', 12, 16);
    if (kind === 'VP8 ') return { w: buf.readUInt16LE(26) & 0x3fff, h: buf.readUInt16LE(28) & 0x3fff };
    if (kind === 'VP8L') {
      const b = buf.readUInt32LE(21);
      return { w: (b & 0x3fff) + 1, h: ((b >> 14) & 0x3fff) + 1 };
    }
    if (kind === 'VP8X') return { w: buf.readUIntLE(24, 3) + 1, h: buf.readUIntLE(27, 3) + 1 };
  }
  // JPEG : on parcourt les segments jusqu'au SOF
  if (buf[0] === 0xff && buf[1] === 0xd8) {
    let i = 2;
    while (i < buf.length - 9) {
      if (buf[i] !== 0xff) { i++; continue; }
      const marker = buf[i + 1];
      const len = buf.readUInt16BE(i + 2);
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { w: buf.readUInt16BE(i + 7), h: buf.readUInt16BE(i + 5) };
      }
      i += 2 + len;
    }
  }
  return null;
}

export function sizeOf(src?: string): Size | null {
  if (!src || /^https?:/.test(src)) return null;
  if (cache.has(src)) return cache.get(src)!;
  let size: Size | null = null;
  try {
    size = readSize(readFileSync(join(process.cwd(), 'public', decodeURI(src))));
  } catch {
    size = null; // image absente : on retombe sur le visuel de géométrie sacrée
  }
  cache.set(src, size);
  return size;
}

/** Image existante dans public/ (une image supprimée ne doit pas laisser de trou). */
export const exists = (src?: string) => Boolean(sizeOf(src));

/** Bandeau très large (ex. 864 × 122) : à montrer en entier, jamais recadré. */
export function isStrip(src?: string) {
  const s = sizeOf(src);
  return Boolean(s && s.w / s.h >= 2.4);
}

/** Photo recadrable (ni bandeau, ni trop étroite) pour une carte ou un hublot. */
export function isPhoto(src?: string) {
  const s = sizeOf(src);
  return Boolean(s && s.w / s.h < 2.4 && s.w / s.h > 0.45);
}

/** Panorama assez grand pour être recadré (paysage large), à la différence d'un titre graphique. */
export function isPanorama(src?: string) {
  const s = sizeOf(src);
  return Boolean(s && s.w / s.h >= 2.4 && s.w / s.h <= 3.6 && s.w >= 900);
}

/** Toutes les images d'une fiche, dans l'ordre où Christine les a placées. */
export function imagesOf(f: CollectionEntry<'fiches'>['data']): string[] {
  return [
    f.image,
    ...f.slideshow,
    f.banner,
    ...f.gallery.map((g) => g.src),
    f.bodyImage?.src,
    ...f.inlineMedia.flatMap((m) => m.images.map((i) => i.src)),
    ...f.sideImages.map((s) => s.src),
  ].filter((s): s is string => Boolean(s) && exists(s));
}

/** Le visuel « carte / hublot » d'une fiche : sa première vraie photo, sinon un panorama. */
export const visualOf = (f: CollectionEntry<'fiches'>['data']) =>
  imagesOf(f).find(isPhoto) ?? imagesOf(f).find(isPanorama);
