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
    // Rubrique : une fiche `parcours` regroupe plusieurs stages. Liste des slugs
    // des stages qui en font partie (ils sont alors imbriqués sous la rubrique
    // dans la grille du hub, et non affichés en vrac).
    stages: z.array(z.string()).default([]),
    lang: z.enum(['fr', 'en', 'pl', 'es', 'it']).default('fr'),
    // Résumé court (carte + chapeau de page). Christine : « pas de blabla ».
    lede: z.string(),
    // Texte spécifique affiché sur la CARTE du hub (si différent du `lede` de la
    // page). Permet d'avoir un sous-titre de carte distinct du chapeau de page.
    cardLede: z.string().optional(),
    // Mise en page « riche » de la fiche : on masque l'image / les infos
    // pratiques générées en tête, car le corps gère lui-même la mise en page.
    hideHeaderImage: z.boolean().default(false),
    hideHeaderMeta: z.boolean().default(false),
    // Affiche un encart « infos pratiques » (petite image + format/durée/tarif)
    // EN BAS de la fiche, après les vidéos (souhait de Christine, page Consultation).
    practicalFooter: z.boolean().default(false),
    // Mise en page sur-mesure rendue par le layout (images positionnées avec le
    // bon `base`). Identifiant de gabarit ; pour l'instant : 'sortir-matrice'.
    richLayout: z.enum(['sortir-matrice']).optional(),
    // Emplacements vidéo « à intégrer » (placeholders) en attente d'un ID YouTube.
    pendingVideos: z
      .array(z.object({ title: z.string().optional(), meta: z.string().optional() }))
      .default([]),
    // Titre affiché au-dessus de la grille vidéo (ex. « Témoignage de ma propre
    // expérience grâce à ces outils » avant les vidéos Debowska).
    videosHeading: z.string().optional(),
    // Témoignages affichés en bas de fiche (après les vidéos).
    testimonials: z
      .array(z.object({ quote: z.string(), author: z.string().optional() }))
      .default([]),
    // Image illustrative insérée après le corps (chemin sous /images/…), rendue
    // par le layout pour bénéficier du bon `base` (impossible en markdown brut).
    bodyImage: z
      .object({ src: z.string(), alt: z.string().optional(), caption: z.string().optional() })
      .optional(),
    // Si vrai, l'image `bodyImage` est rendue APRÈS le corps (figure centrée
    // légendée) au lieu de flotter en aside en haut du texte.
    bodyImageBelow: z.boolean().default(false),
    // Si vrai, la carte « papier » du corps prend toute la largeur (au lieu de
    // la colonne étroite) : utile pour des blocs côte à côte bien carrés.
    wideBody: z.boolean().default(false),
    // Images insérées À CÔTÉ d'une section précise du corps (flottantes), ancrées
    // par l'id du titre (slug). Permet « mettre cette photo à côté de tel texte ».
    sideImages: z
      .array(
        z.object({
          section: z.string(), // id du titre (ex. "2026--contact-avec-des-gardiens")
          src: z.string(),
          alt: z.string().optional(),
          caption: z.string().optional(),
          align: z.enum(['left', 'right']).default('right'),
          size: z.enum(['xsmall', 'small', 'normal']).default('normal'),
        }),
      )
      .default([]),
    // Médias insérés EN PLEINE LARGEUR juste après une section (ancrée par id de
    // titre ou extrait de texte) : une vidéo (façade RGPD + crédit) et/ou une
    // rangée de photos. Pour reproduire « vidéo + photos sous tel paragraphe ».
    inlineMedia: z
      .array(
        z.object({
          section: z.string(),
          // 'aside' : la (les) photo(s) sont placées À CÔTÉ de la vidéo (colonne
          // étroite à droite) au lieu d'une rangée sous la vidéo.
          layout: z.enum(['aside']).optional(),
          video: z
            .object({
              id: z.string(),
              title: z.string().optional(),
              meta: z.string().optional(),
              credit: z.enum(['debowska']).optional(),
              cover: z.string().optional(),
              coverAlt: z.string().optional(),
            })
            .optional(),
          images: z
            .array(
              z.object({
                src: z.string(),
                alt: z.string().optional(),
                caption: z.string().optional(),
                size: z.enum(['small', 'normal']).optional(),
              }),
            )
            .default([]),
        }),
      )
      .default([]),
    // Infos pratiques (toutes optionnelles)
    dates: z.array(z.string()).default([]),
    duration: z.string().optional(),
    price: z.string().optional(),
    format: z.string().optional(),
    // Bandeau large en tête de page (full-bleed, ratio ~3.2:1), optionnel
    banner: z.string().optional(),
    bannerAlt: z.string().optional(),
    // Visuel principal (chemin sous /images/… ; vraies images intégrées demain)
    image: z.string().optional(),
    imageAlt: z.string().optional(),
    // Diaporama en tête de fiche (remplace l'image unique) — liste de chemins.
    slideshow: z.array(z.string()).default([]),
    // Galerie d'images légendées rendue dans le corps de la fiche (après le texte),
    // avec le bon `base`. Pour les pages riches en photos (ex. Mont Shasta).
    gallery: z
      .array(z.object({ src: z.string(), alt: z.string().optional(), caption: z.string().optional() }))
      .default([]),
    // Piste audio (ex. émission radio) — lecteur affiché sur la fiche
    audio: z.string().optional(),
    audioTitle: z.string().optional(),
    // Visuel (jaquette) de l'enregistrement audio : si renseigné, l'audio est
    // présenté comme une carte (image + « Enregistrement ») à côté des vidéos.
    audioCover: z.string().optional(),
    // Vidéos YouTube (IDs récupérés du WordPress)
    videos: z
      .array(
        z.object({
          id: z.string(),
          title: z.string().optional(),
          meta: z.string().optional(),
          // Mention de droits à afficher sous la vidéo. `debowska` = phrase
          // d'attribution validée par Konstanty Debowska (avec lien vers son site).
          credit: z.enum(['debowska']).optional(),
          // Jaquette du DVD (chemin sous /images/…) : affichée à côté de la vidéo.
          cover: z.string().optional(),
          coverAlt: z.string().optional(),
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
