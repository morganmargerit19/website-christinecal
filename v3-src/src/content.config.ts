import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

/**
 * Collection « fiches » — chaque stage / atelier / conférence / consultation /
 * voyage est un fichier Markdown éditable (frontmatter + corps).
 * Objectif : contenu modifiable facilement (et branchable sur un CMS type Decap
 * plus tard, puisque Christine veut gérer ~80 % des modifs elle-même).
 *
 * Phase actuelle : FR uniquement. Les traductions EN/PL seront ajoutées dans
 * des sous-dossiers (en/, pl/) avec le même `slug` pour relier les langues.
 */
const fiches = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/fiches' }),
  schema: z.object({
    title: z.string(),
    // Eyebrow affiché au-dessus du titre : « Consultation », « Stage », etc.
    kicker: z.string(),
    // Univers d'appartenance (détermine l'URL : /eveil-a-soi/<slug>/ …)
    hub: z.enum(['eveil-a-soi', 'eveil-au-soi']),
    category: z.enum(['consultation', 'stage', 'atelier', 'conference', 'voyage', 'parcours']),
    // Ordre d'affichage dans la grille du hub (petit = en premier)
    order: z.number().default(50),
    lang: z.enum(['fr', 'en', 'pl']).default('fr'),
    // Résumé court (carte + chapeau de page). Christine : « pas de blabla ».
    lede: z.string(),
    // Infos pratiques (toutes optionnelles)
    dates: z.array(z.string()).default([]),
    duration: z.string().optional(),
    price: z.string().optional(),
    format: z.string().optional(),
    // Visuel principal (chemin sous /images/… ; vraies images intégrées demain)
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Vidéos YouTube (IDs récupérés du WordPress)
    videos: z
      .array(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          meta: z.string().optional(),
        }),
      )
      .default([]),
    // Mise en avant (ex. la consultation médiumnique en tête du hub)
    featured: z.boolean().default(false),
    // Brouillon : exclu des grilles et non rendu (fiches squelettes WP)
    draft: z.boolean().default(false),
  }),
});

export const collections = { fiches };
