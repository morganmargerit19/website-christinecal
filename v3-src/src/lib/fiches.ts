import { getCollection, type CollectionEntry } from 'astro:content';
import type { Locale } from '../i18n/utils';

export type FicheEntry = CollectionEntry<'fiches'>;

/** Slug d'une fiche, identique dans toutes les langues (`en/merkaba` → `merkaba`). */
export const slugOf = (id: string) => id.replace(/^(en|pl|es|it)\//, '');

/**
 * Fiches publiées d'une langue, AVEC REPLI SUR LE FRANÇAIS : une fiche créée
 * par Christine au CMS (en français) apparaît aussi sur les versions
 * EN/PL/ES/IT du site tant que sa traduction n'existe pas — sinon un nouveau
 * stage serait invisible hors du site français. Dès qu'une traduction est
 * ajoutée (même slug dans en/, pl/…), c'est elle qui est utilisée.
 */
export async function getFiches(locale: Locale): Promise<FicheEntry[]> {
  const all = await getCollection('fiches', (e) => !e.data.draft);
  const own = all.filter((e) => e.data.lang === locale);
  const translated = new Set(own.map((e) => slugOf(e.id)));
  const fallback =
    locale === 'fr' ? [] : all.filter((e) => e.data.lang === 'fr' && !translated.has(slugOf(e.id)));
  return withRubriqueHub([...own, ...fallback]);
}

/**
 * Un stage rangé dans une rubrique vit dans le même univers que celle-ci (URL
 * /eveil-a-soi/… ou /eveil-au-soi/…), quel que soit l'univers coché au CMS :
 * Christine n'a qu'à choisir la rubrique, sans risque de lien cassé.
 */
function withRubriqueHub(fiches: FicheEntry[]): FicheEntry[] {
  const hubOf = new Map(fiches.map((e) => [slugOf(e.id), e.data.hub]));
  return fiches.map((e) => {
    const hub = e.data.rubrique ? hubOf.get(e.data.rubrique) : undefined;
    return hub && hub !== e.data.hub ? { ...e, data: { ...e.data, hub } } : e;
  });
}

/**
 * Stages rangés sous une rubrique (ex. « Construire son vaisseau »), dans
 * l'ordre : d'abord ceux listés par la rubrique elle-même (`stages`), puis
 * ceux qui déclarent la rubrique (`rubrique`, choisie par Christine au CMS),
 * triés par ordre d'affichage.
 */
export function stagesOf(parent: FicheEntry, fiches: FicheEntry[]): FicheEntry[] {
  const parentSlug = slugOf(parent.id);
  const listed = parent.data.stages
    .map((s) => fiches.find((e) => slugOf(e.id) === s))
    .filter((e): e is FicheEntry => Boolean(e));
  const declared = fiches
    .filter((e) => e.data.rubrique === parentSlug && !parent.data.stages.includes(slugOf(e.id)))
    .sort((a, b) => a.data.order - b.data.order);
  return [...listed, ...declared];
}

/**
 * Slugs de toutes les fiches rangées dans une rubrique (retirées de la grille
 * du hub). Une rubrique inexistante ou masquée est ignorée : le stage reste
 * alors visible en carte sur son hub plutôt que de disparaître du site.
 */
export function childSlugs(fiches: FicheEntry[]): Set<string> {
  const slugs = new Set(fiches.map((f) => slugOf(f.id)));
  return new Set([
    ...fiches.flatMap((f) => f.data.stages),
    ...fiches.filter((f) => f.data.rubrique && slugs.has(f.data.rubrique)).map((f) => slugOf(f.id)),
  ]);
}
