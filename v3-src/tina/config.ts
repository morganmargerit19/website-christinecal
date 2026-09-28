import { defineConfig } from 'tinacms';

/**
 * TinaCMS — édition du contenu par l'équipe (page /admin), en remplacement de
 * Sveltia. Chaque enregistrement = un commit GitHub (via la GitHub App de Tina
 * Cloud) → rebuild + déploiement.
 *
 * ⚠️ RÈGLE D'OR : un CMS git-based réécrit le fichier À PARTIR DU SCHÉMA. Tout
 * champ présent dans le fichier mais ABSENT de ce schéma est EFFACÉ à la
 * sauvegarde. La source de vérité du jeu de champs des fiches est
 * `src/content.config.ts` (le schéma Zod validé au build) — ce fichier le
 * reflète intégralement (c'est ce qui manquait à l'ancienne config Sveltia, qui
 * effaçait sideImages / inlineMedia / wideBody / audioCover / bodyImageBelow).
 *
 * Le corps des fiches (.mdx) est un éditeur riche + blocs (`bodyTemplates`).
 *
 * Christine voit la collection « Mes stages et pages » en affichage SIMPLE :
 * les réglages de mise en page y sont masqués (mais conservés), cf. `ficheFields`.
 */

// Branche ciblée par Tina Cloud (doit correspondre à la branche déployée).
const branch =
  process.env.GITHUB_BRANCH ||
  process.env.VERCEL_GIT_COMMIT_REF ||
  process.env.HEAD ||
  'main';

const HUBS = ['eveil-a-soi', 'eveil-au-soi'];
const CATEGORIES = ['consultation', 'stage', 'atelier', 'conference', 'voyage', 'parcours'];
const LANGS = ['fr', 'en', 'pl', 'es', 'it'];

// ─── Blocs insérables dans le corps (éditeur rich-text) ──────────────────────
// ⚠️ Le `name` de chaque template DOIT correspondre EXACTEMENT au composant Astro
// (src/components/blocks/<Name>.astro) ET à la clé du mapping `blockComponents`
// dans src/layouts/Fiche.astro — c'est ce nom qui devient la balise MDX écrite
// dans le fichier .mdx. Un champ nommé `children` (rich-text) = le contenu placé
// ENTRE les balises du bloc (texte formaté). Les fiches sont désormais en `.mdx`.
type ImgItem = { caption?: string; alt?: string };
const imageItemFields = [
  { type: 'image' as const, name: 'src', label: 'Image' },
  { type: 'string' as const, name: 'alt', label: 'Texte alternatif' },
  { type: 'string' as const, name: 'caption', label: 'Légende' },
];

const columnTemplate = {
  name: 'Column',
  label: 'Colonne',
  fields: [
    { type: 'string' as const, name: 'title', label: 'Titre' },
    { type: 'string' as const, name: 'subtitle', label: 'Sous-titre (en doré, facultatif)' },
    { type: 'rich-text' as const, name: 'children', label: 'Contenu' },
  ],
};

const bodyTemplates = [
  {
    name: 'FloatImage',
    label: 'Image (dans le texte)',
    fields: [
      { type: 'image' as const, name: 'src', label: 'Image' },
      { type: 'string' as const, name: 'alt', label: 'Texte alternatif' },
      { type: 'string' as const, name: 'caption', label: 'Légende (facultatif)' },
      {
        type: 'string' as const, name: 'placement', label: 'Placement',
        options: [
          { value: 'right', label: 'Flottante à droite (le texte s’enroule)' },
          { value: 'left', label: 'Flottante à gauche' },
          { value: 'center', label: 'Centrée' },
          { value: 'full', label: 'Pleine largeur' },
        ],
      },
      {
        type: 'string' as const, name: 'size', label: 'Taille',
        options: [
          { value: 'small', label: 'Petite' },
          { value: 'medium', label: 'Moyenne' },
          { value: 'large', label: 'Grande' },
        ],
      },
    ],
  },
  {
    name: 'CenteredText',
    label: 'Texte centré',
    fields: [
      { type: 'boolean' as const, name: 'italic', label: 'En italique' },
      { type: 'rich-text' as const, name: 'children', label: 'Texte' },
    ],
  },
  {
    name: 'Lead',
    label: 'Grand texte (mise en avant)',
    fields: [{ type: 'rich-text' as const, name: 'children', label: 'Texte' }],
  },
  {
    name: 'Note',
    label: 'Petit texte / note',
    fields: [{ type: 'rich-text' as const, name: 'children', label: 'Texte' }],
  },
  {
    name: 'MediaDuo',
    label: 'Deux images côte à côte',
    fields: [
      { type: 'boolean' as const, name: 'float', label: 'Flotte à droite (le texte s’enroule à gauche)' },
      {
        type: 'object' as const, name: 'images', label: 'Images', list: true,
        ui: { itemProps: (i: ImgItem) => ({ label: i?.caption || i?.alt || 'Image' }) },
        fields: imageItemFields,
      },
    ],
  },
  {
    name: 'VideoBlock',
    label: 'Vidéo',
    fields: [
      { type: 'string' as const, name: 'id', label: 'ID YouTube (les caractères après v=)' },
      { type: 'string' as const, name: 'title', label: 'Titre (facultatif)' },
      { type: 'string' as const, name: 'meta', label: 'Légende / date (facultatif)' },
      { type: 'string' as const, name: 'credit', label: 'Crédit', options: [{ value: 'debowska', label: 'DVD Debowska' }] },
      { type: 'image' as const, name: 'cover', label: 'Jaquette DVD (facultatif)' },
      { type: 'string' as const, name: 'coverAlt', label: 'Texte alternatif de la jaquette' },
    ],
  },
  {
    name: 'SlideshowBlock',
    label: 'Diaporama',
    fields: [
      { type: 'image' as const, name: 'images', label: 'Images', list: true },
      { type: 'string' as const, name: 'alt', label: 'Texte alternatif (1re image)' },
    ],
  },
  {
    name: 'GalleryBlock',
    label: 'Galerie de photos',
    fields: [
      {
        type: 'object' as const, name: 'images', label: 'Images', list: true,
        ui: { itemProps: (i: ImgItem) => ({ label: i?.caption || i?.alt || 'Image' }) },
        fields: imageItemFields,
      },
    ],
  },
  columnTemplate,
  {
    name: 'TwoColumns',
    label: 'Deux colonnes',
    fields: [
      { type: 'rich-text' as const, name: 'children', label: 'Colonnes (ajouter des blocs « Colonne »)', templates: [columnTemplate] },
    ],
  },
];

// Rubriques pouvant accueillir des stages (slug de la fiche parente). Un stage
// qui choisit une rubrique s'affiche dans sa page « Au programme ». « aucune »
// ne correspond à aucune fiche : le site la traite comme une absence de rubrique.
const RUBRIQUES = [
  { value: 'aucune', label: '— Aucune (carte directement sur la page Éveil à / au Soi)' },
  { value: 'construire-son-vaisseau', label: 'Construire son vaisseau (Éveil à Soi)' },
  { value: 'la-team-galactique', label: 'La Team galactique (Éveil au Soi)' },
  { value: 'les-extras-du-bugarach', label: 'Les Extras du Bugarach (Éveil au Soi)' },
  { value: 'les-intra-telos-mont-shasta', label: 'Mont Shasta / Telos (Éveil au Soi)' },
  { value: 'retrouver-sa-memoire-galactique', label: 'Retrouver sa mémoire galactique (Éveil au Soi)' },
];

const slugify = (values: { title?: string }) =>
  (values?.title || 'carte')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

/**
 * Champs des fiches. Deux affichages du MÊME jeu de champs :
 *  - `simple` (collection de Christine, fiches françaises) : seuls les champs
 *    utiles pour gérer un stage sont visibles ; les réglages de mise en page
 *    sont MASQUÉS (`hidden`) mais restent déclarés, donc conservés à
 *    l'enregistrement (cf. RÈGLE D'OR) — elle ne peut ni les voir ni les casser.
 *  - complet (traductions, réservé à Morgan) : tout est visible.
 */
function ficheFields(simple: boolean) {
  // Réglage avancé : masqué dans l'affichage simple, jamais supprimé.
  const adv = <T extends Record<string, unknown>>(field: T): T =>
    simple ? { ...field, ui: { component: 'hidden' } } : field;

  return [
    adv({ type: 'string', name: 'lang', label: 'Langue', options: LANGS, ui: { component: 'select' } }),
    { type: 'string', name: 'title', label: 'Titre', required: true, isTitle: true },
    {
      type: 'string', name: 'kicker', label: 'Petit mot au-dessus du titre', required: true,
      description: 'Ex. : Stage, Atelier, Conférence, Voyage…',
    },
    {
      type: 'string', name: 'hub', label: 'Page du site', required: true,
      description: 'Sans effet si une rubrique est choisie juste en dessous (le stage suit sa rubrique).',
      options: [
        { value: 'eveil-a-soi', label: 'Éveil à Soi' },
        { value: 'eveil-au-soi', label: 'Éveil au Soi' },
      ],
      ui: { component: 'select' },
    },
    {
      type: 'string', name: 'rubrique', label: 'Rubrique',
      description: 'Le stage apparaît dans « Au programme » de cette page.',
      options: RUBRIQUES, ui: { component: 'select' },
    },
    {
      type: 'boolean', name: 'draft', label: 'Masquer du site',
      description: 'Activé = la page n’apparaît plus sur le site (rien n’est supprimé ; désactiver pour la remettre).',
    },
    adv({ type: 'string', name: 'category', label: 'Catégorie', options: CATEGORIES, required: true, ui: { component: 'select' } }),
    {
      type: 'number', name: 'order', label: "Ordre d'affichage",
      description: 'Petit nombre = affiché en premier.',
    },
    { type: 'string', name: 'lede', label: 'Phrase de présentation (sous le titre)', required: true, ui: { component: 'textarea' } },
    {
      type: 'string', name: 'cardLede', label: 'Texte de la carte (facultatif)',
      description: 'Si vide, la carte reprend la phrase de présentation.',
      ui: { component: 'textarea' },
    },

    // --- Infos pratiques ---
    {
      type: 'string', name: 'dates', label: 'Dates', list: true,
      description: 'Une ligne par date. Ex. : 14–15 mars 2027. La première s’affiche sur la carte.',
    },
    { type: 'string', name: 'place', label: 'Lieu', description: 'Ex. : Bugarach (Aude), En ligne (Zoom)…' },
    { type: 'string', name: 'duration', label: 'Durée', description: 'Ex. : 2 jours, 7 jours…' },
    { type: 'string', name: 'price', label: 'Tarif', description: 'Ex. : 280 €' },
    { type: 'string', name: 'format', label: 'Format', description: 'Ex. : Présentiel, Zoom…' },

    // --- Photos ---
    { type: 'image', name: 'image', label: 'Photo principale' },
    { type: 'string', name: 'imageAlt', label: 'Description de la photo (pour Google et les malvoyants)' },
    {
      type: 'image', name: 'slideshow', label: 'Diaporama (facultatif)', list: true,
      description: 'Plusieurs photos qui défilent en haut de la page, à la place de la photo principale.',
    },
    {
      type: 'object', name: 'gallery', label: 'Galerie de photos (sous le texte)', list: true,
      ui: { itemProps: (i: { caption?: string }) => ({ label: i?.caption || 'Photo' }) },
      fields: [
        { type: 'image', name: 'src', label: 'Photo' },
        { type: 'string', name: 'alt', label: 'Description de la photo' },
        { type: 'string', name: 'caption', label: 'Légende (facultatif)' },
      ],
    },

    // --- Texte de la page : éditeur riche (gras/italique/titres/listes/liens)
    // + blocs insérables (images, colonnes, vidéo, diaporama…). Voir `bodyTemplates`. ---
    { type: 'rich-text', name: 'body', label: 'Texte de la page', isBody: true, templates: bodyTemplates },

    // --- Vidéos / témoignages ---
    { type: 'string', name: 'videosHeading', label: 'Titre au-dessus des vidéos (facultatif)' },
    {
      type: 'object', name: 'videos', label: 'Vidéos YouTube', list: true,
      ui: { itemProps: (i: { title?: string }) => ({ label: i?.title || 'Vidéo' }) },
      fields: [
        { type: 'string', name: 'id', label: 'Code YouTube', description: 'Les caractères après « v= » dans l’adresse de la vidéo.' },
        { type: 'string', name: 'title', label: 'Titre' },
        { type: 'string', name: 'meta', label: 'Légende (date…)' },
        { type: 'string', name: 'credit', label: 'Crédit', options: ['debowska'], ui: { component: 'select' } },
        { type: 'image', name: 'cover', label: 'Jaquette (DVD…)' },
        { type: 'string', name: 'coverAlt', label: 'Description de la jaquette' },
      ],
    },
    {
      type: 'object', name: 'testimonials', label: 'Témoignages', list: true,
      ui: { itemProps: (i: { author?: string }) => ({ label: i?.author || 'Témoignage' }) },
      fields: [
        { type: 'string', name: 'quote', label: 'Témoignage', ui: { component: 'textarea' } },
        { type: 'string', name: 'author', label: 'Auteur' },
      ],
    },

    // ─── Réglages avancés (masqués pour Christine, conservés) ───
    adv({ type: 'image', name: 'banner', label: 'Bandeau large (haut de page)' }),
    adv({ type: 'string', name: 'bannerAlt', label: 'Texte alternatif du bandeau' }),
    adv({
      type: 'object', name: 'bodyImage', label: 'Image illustrative dans le texte',
      fields: [
        { type: 'image', name: 'src', label: 'Image' },
        { type: 'string', name: 'alt', label: 'Texte alternatif' },
        { type: 'string', name: 'caption', label: 'Légende' },
      ],
    }),
    adv({ type: 'boolean', name: 'bodyImageBelow', label: "Afficher l'image illustrative SOUS le texte" }),
    adv({
      type: 'object', name: 'sideImages', label: "Images à côté d'une section", list: true,
      ui: { itemProps: (i: { section?: string }) => ({ label: i?.section || 'Image latérale' }) },
      fields: [
        { type: 'string', name: 'section', label: 'Section (id du titre ou extrait de texte)' },
        { type: 'image', name: 'src', label: 'Image' },
        { type: 'string', name: 'alt', label: 'Texte alternatif' },
        { type: 'string', name: 'caption', label: 'Légende' },
        { type: 'string', name: 'align', label: 'Alignement', options: ['left', 'right'], ui: { component: 'select' } },
        { type: 'string', name: 'size', label: 'Taille', options: ['xsmall', 'small', 'normal'], ui: { component: 'select' } },
      ],
    }),
    adv({
      type: 'object', name: 'inlineMedia', label: 'Médias insérés après une section', list: true,
      ui: { itemProps: (i: { section?: string }) => ({ label: i?.section || 'Bloc média' }) },
      fields: [
        { type: 'string', name: 'section', label: 'Section (id du titre ou extrait de texte)' },
        { type: 'string', name: 'layout', label: 'Disposition', options: ['aside'], ui: { component: 'select' }, description: "« aside » = photos À CÔTÉ de la vidéo (sinon en rangée dessous)" },
        {
          type: 'object', name: 'video', label: 'Vidéo',
          fields: [
            { type: 'string', name: 'id', label: 'ID YouTube' },
            { type: 'string', name: 'title', label: 'Titre' },
            { type: 'string', name: 'meta', label: 'Légende (date…)' },
            { type: 'string', name: 'credit', label: 'Crédit', options: ['debowska'], ui: { component: 'select' } },
            { type: 'image', name: 'cover', label: 'Vignette' },
            { type: 'string', name: 'coverAlt', label: 'Texte alternatif de la vignette' },
          ],
        },
        {
          type: 'object', name: 'images', label: 'Photos', list: true,
          ui: { itemProps: (i: { alt?: string }) => ({ label: i?.alt || 'Photo' }) },
          fields: [
            { type: 'image', name: 'src', label: 'Image' },
            { type: 'string', name: 'alt', label: 'Texte alternatif' },
            { type: 'string', name: 'caption', label: 'Légende' },
            { type: 'string', name: 'size', label: 'Taille', options: ['small', 'normal'], ui: { component: 'select' } },
          ],
        },
      ],
    }),
    adv({ type: 'string', name: 'audio', label: 'Audio (chemin du fichier mp3, ex. /audio/xxx.mp3)' }),
    adv({ type: 'string', name: 'audioTitle', label: "Titre de l'audio" }),
    adv({ type: 'image', name: 'audioCover', label: "Visuel de l'audio (jaquette)" }),
    adv({
      type: 'object', name: 'pendingVideos', label: 'Emplacements vidéo à intégrer', list: true,
      ui: { itemProps: (i: { title?: string }) => ({ label: i?.title || 'À intégrer' }) },
      fields: [
        { type: 'string', name: 'title', label: 'Titre' },
        { type: 'string', name: 'meta', label: 'Légende' },
      ],
    }),
    adv({ type: 'string', name: 'stages', label: 'Rubrique : slugs des stages regroupés (préférer le champ « Rubrique » du stage)', list: true }),
    adv({ type: 'boolean', name: 'hideHeaderImage', label: "Masquer l'image en tête" }),
    adv({ type: 'boolean', name: 'hideHeaderMeta', label: 'Masquer le cadre dates/format en haut' }),
    adv({ type: 'boolean', name: 'practicalFooter', label: 'Afficher les infos pratiques en bas' }),
    adv({ type: 'boolean', name: 'wideBody', label: 'Corps en pleine largeur' }),
    adv({ type: 'string', name: 'richLayout', label: 'Gabarit spécial', options: ['sortir-matrice'], ui: { component: 'select' } }),
    adv({ type: 'boolean', name: 'featured', label: 'Mise en avant' }),
  ];
}

// Collection de Christine : les pages FRANÇAISES (racine du dossier). Affichage
// simplifié ; pas de suppression (on masque) ni de renommage d'adresse (le nom
// de fichier = l'URL et le lien avec les traductions).
const fiches = {
  name: 'fiches',
  label: 'Mes stages et pages (français)',
  path: 'src/content/fiches',
  format: 'mdx' as const,
  match: { include: '*' },
  defaultItem: () => ({
    lang: 'fr',
    kicker: 'Stage',
    category: 'stage',
    hub: 'eveil-au-soi',
    order: 50,
  }),
  ui: {
    allowedActions: { create: true, delete: false, createFolder: false, createNestedFolder: false },
    filename: { readonly: true, slugify },
  },
  fields: ficheFields(true),
};

// Traductions (en/ es/ it/ pl/) : affichage complet, réservé à Morgan.
const traductions = {
  name: 'traductions',
  label: '⚙️ Traductions (EN/ES/IT/PL) — réservé à Morgan',
  path: 'src/content/fiches',
  format: 'mdx' as const,
  match: { include: '{en,es,it,pl}/*' },
  ui: { allowedActions: { create: false, delete: false, createFolder: false, createNestedFolder: false } },
  fields: ficheFields(false),
};

// Pages « hors fiches » (données JSON lues par le site). Chaque page = un
// fichier-singleton (création/suppression désactivées). Tous les champs sont
// déclarés (même règle anti-effacement que les fiches).
const pageCollections = [
  // ----------------------------- QUI SUIS-JE -----------------------------
  {
    name: 'pageAbout',
    label: 'Page — Qui suis-je',
    path: 'src/data',
    format: 'json' as const,
    match: { include: 'about.fr' },
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      {
        type: 'object', name: 'meta', label: 'Référencement Google (titre & description)',
        fields: [
          { type: 'string', name: 'title', label: "Titre de l'onglet" },
          { type: 'string', name: 'description', label: 'Description (résultat Google)', ui: { component: 'textarea' } },
        ],
      },
      {
        type: 'object', name: 'hero', label: 'En-tête de page',
        fields: [
          { type: 'string', name: 'eyebrow', label: 'Sur-titre' },
          { type: 'string', name: 'title', label: 'Grand titre', ui: { component: 'textarea' } },
          { type: 'string', name: 'lede', label: 'Accroche (facultatif)', required: false, ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', name: 'epigraph', label: "Épigraphe (texte d'ouverture en italique)", ui: { component: 'textarea' } },
      {
        type: 'object', name: 'galactic', label: "Bloc « Une galactique venue d'un futur » (sur la photo)",
        fields: [
          { type: 'string', name: 'heading', label: 'Titre' },
          { type: 'string', name: 'items', label: 'Paragraphes', list: true, ui: { component: 'textarea' } },
        ],
      },
      {
        type: 'object', name: 'videos', label: 'Vidéos de présentation',
        fields: [
          { type: 'string', name: 'heading', label: 'Titre de section' },
          {
            type: 'object', name: 'list', label: 'Vidéos', list: true,
            ui: { itemProps: (item: { title?: string }) => ({ label: item?.title }) },
            fields: [
              { type: 'string', name: 'id', label: 'ID YouTube (les caractères après v=)' },
              { type: 'string', name: 'title', label: 'Titre' },
              { type: 'string', name: 'meta', label: 'Légende (date, durée…)', required: false },
            ],
          },
        ],
      },
      {
        type: 'object', name: 'journey', label: 'Un parcours en bref',
        fields: [
          { type: 'string', name: 'heading', label: 'Titre de section' },
          {
            type: 'object', name: 'items', label: 'Étapes du parcours', list: true,
            ui: { itemProps: (item: { lead?: string }) => ({ label: item?.lead }) },
            fields: [
              { type: 'string', name: 'lead', label: 'Intitulé (en gras)' },
              { type: 'string', name: 'text', label: 'Texte', ui: { component: 'textarea' } },
            ],
          },
        ],
      },
      {
        type: 'object', name: 'activities', label: 'Activités actuelles',
        fields: [
          { type: 'string', name: 'heading', label: 'Titre de section' },
          {
            type: 'object', name: 'items', label: 'Activités', list: true,
            ui: { itemProps: (item: { title?: string }) => ({ label: item?.title }) },
            fields: [
              { type: 'string', name: 'title', label: "Titre de l'activité" },
              { type: 'string', name: 'text', label: 'Texte', ui: { component: 'textarea' } },
              {
                type: 'object', name: 'accordion', label: 'Liste dépliante (facultatif — ex. exemples de conférences)', required: false,
                fields: [
                  { type: 'string', name: 'summary', label: 'Intitulé cliquable' },
                  { type: 'string', name: 'items', label: 'Éléments de la liste', list: true },
                ],
              },
            ],
          },
        ],
      },
      {
        type: 'object', name: 'specifics', label: 'Spécificités', required: false,
        fields: [
          { type: 'string', name: 'heading', label: 'Titre de section' },
          { type: 'string', name: 'items', label: 'Éléments', list: true, ui: { component: 'textarea' } },
        ],
      },
      {
        type: 'object', name: 'news', label: 'Actualités',
        fields: [
          { type: 'string', name: 'heading', label: 'Titre de section' },
          { type: 'string', name: 'items', label: 'Éléments', list: true, ui: { component: 'textarea' } },
        ],
      },
      {
        type: 'object', name: 'upcoming', label: 'À venir', required: false,
        fields: [
          { type: 'string', name: 'heading', label: 'Titre de section' },
          { type: 'string', name: 'items', label: 'Éléments', list: true, ui: { component: 'textarea' } },
        ],
      },
      {
        type: 'object', name: 'clients', label: 'Une clientèle variée',
        fields: [
          { type: 'string', name: 'heading', label: 'Titre' },
          { type: 'string', name: 'text', label: 'Texte', ui: { component: 'textarea' } },
        ],
      },
    ],
  },

  // ------------------------------- MISSION -------------------------------
  {
    name: 'pageMission',
    label: 'Page — Ma mission',
    path: 'src/data',
    format: 'json' as const,
    match: { include: 'mission.fr' },
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      { type: 'string', name: 'metaTitle', label: "Titre de l'onglet (Google)" },
      { type: 'string', name: 'metaDesc', label: 'Description Google', ui: { component: 'textarea' } },
      { type: 'string', name: 'eyebrow', label: 'Sur-titre' },
      { type: 'string', name: 'h1', label: 'Grand titre' },
      { type: 'string', name: 'lede', label: 'Accroche', ui: { component: 'textarea' } },
      { type: 'string', name: 'bannerAlt', label: 'Description de la bannière (accessibilité)' },
      { type: 'string', name: 's1Heading', label: 'Titre — section « Espace-Temps »', ui: { component: 'textarea' } },
      { type: 'string', name: 's1p1', label: 'Paragraphe 1 — Espace-Temps', ui: { component: 'textarea' } },
      { type: 'string', name: 's1p2', label: 'Paragraphe 2 (sous le dessin)', ui: { component: 'textarea' } },
      { type: 'string', name: 's2Heading', label: 'Titre — « La mission »' },
      { type: 'string', name: 's2Quote', label: 'Citation principale de la mission', ui: { component: 'textarea' } },
      { type: 'string', name: 's2Matrix', label: 'Phrase « Matrix » (facultatif)', required: false },
      { type: 'string', name: 'points', label: 'Les points de la mission', list: true, ui: { component: 'textarea' } },
      { type: 'string', name: 'pioneerAlt', label: "Description de l'image « ascension » (accessibilité)" },
      { type: 'string', name: 'pioneerHeading', label: 'Titre — « Véritable pionnier »' },
      { type: 'string', name: 'pioneerIntro', label: 'Introduction — pionnier', ui: { component: 'textarea' } },
      { type: 'string', name: 'pioneerQuotes', label: 'Citations — pionnier', list: true, ui: { component: 'textarea' } },
      { type: 'string', name: 'pioneerP2', label: 'Phrase après les citations', ui: { component: 'textarea' } },
      { type: 'string', name: 'pioneerAdn', label: 'Phrase « nouvel ADN » (facultatif)', required: false, ui: { component: 'textarea' } },
      { type: 'string', name: 'pioneerP3', label: 'Paragraphe de conclusion (sous la lemniscate)', ui: { component: 'textarea' } },
      { type: 'string', name: 'callEyebrow', label: "Sur-titre — « Vous sentez l'appel ? »" },
      { type: 'string', name: 'callHeading', label: 'Titre — Appel' },
      { type: 'string', name: 'callHeadingEm', label: "Fin du titre (en doré, ex. Let's go !)" },
      { type: 'string', name: 'callLede', label: 'Accroche — Appel' },
      { type: 'string', name: 'infinityAlt', label: 'Description de la lemniscate (accessibilité)' },
      {
        type: 'object', name: 'crewOld', label: 'Équipage — « Vieilles Âmes »',
        fields: [
          { type: 'string', name: 'title', label: 'Titre' },
          { type: 'string', name: 'en', label: 'Sous-titre (anglais)' },
          { type: 'string', name: 'desc', label: 'Description', ui: { component: 'textarea' } },
        ],
      },
      {
        type: 'object', name: 'crewYoung', label: 'Équipage — « Jeunes Âmes »',
        fields: [
          { type: 'string', name: 'title', label: 'Titre' },
          { type: 'string', name: 'en', label: 'Sous-titre (anglais)' },
          { type: 'string', name: 'desc', label: 'Description', ui: { component: 'textarea' } },
        ],
      },
      { type: 'string', name: 'pressHeading', label: 'Titre au-dessus des vidéos (facultatif)', required: false },
      {
        type: 'object', name: 'videos', label: 'Vidéos', list: true,
        ui: { itemProps: (item: { title?: string }) => ({ label: item?.title }) },
        fields: [
          { type: 'string', name: 'id', label: 'ID YouTube (les caractères après v=)' },
          { type: 'string', name: 'title', label: 'Titre' },
          { type: 'string', name: 'meta', label: 'Légende (date…)', required: false },
        ],
      },
      { type: 'string', name: 'recognizeHeading', label: 'Titre — bandeau de contact' },
      { type: 'string', name: 'recognizeBody', label: 'Texte — bandeau de contact', ui: { component: 'textarea' } },
      { type: 'string', name: 'contactCta', label: 'Texte du bouton contact' },
      { type: 'string', name: 'back', label: 'Texte du lien retour' },
    ],
  },

  // ----------------------------- ÉVEIL À SOI -----------------------------
  {
    name: 'pageEveilASoi',
    label: 'Page — Éveil à Soi',
    path: 'src/data',
    format: 'json' as const,
    match: { include: 'eveil-a-soi.fr' },
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      { type: 'string', name: 'metaTitle', label: "Titre de l'onglet (Google)" },
      { type: 'string', name: 'metaDesc', label: 'Description Google', ui: { component: 'textarea' } },
      { type: 'string', name: 'eyebrow', label: 'Sur-titre' },
      { type: 'string', name: 'h1', label: 'Grand titre' },
      { type: 'string', name: 'lede', label: 'Accroche', ui: { component: 'textarea' } },
      { type: 'string', name: 'intro', label: "Paragraphes d'introduction (sous la bannière)", list: true, ui: { component: 'textarea' } },
    ],
  },

  // ----------------------------- ÉVEIL AU SOI ----------------------------
  {
    name: 'pageEveilAuSoi',
    label: 'Page — Éveil au Soi',
    path: 'src/data',
    format: 'json' as const,
    match: { include: 'eveil-au-soi.fr' },
    ui: { allowedActions: { create: false, delete: false } },
    fields: [
      { type: 'string', name: 'metaTitle', label: "Titre de l'onglet (Google)" },
      { type: 'string', name: 'metaDesc', label: 'Description Google', ui: { component: 'textarea' } },
      { type: 'string', name: 'eyebrow', label: 'Sur-titre' },
      { type: 'string', name: 'h1', label: 'Grand titre' },
      { type: 'string', name: 'lede', label: 'Accroche', ui: { component: 'textarea' } },
      { type: 'string', name: 'intro', label: "Paragraphes d'introduction (sous la bannière)", list: true, ui: { component: 'textarea' } },
      { type: 'string', name: 'outro', label: 'Phrases de clôture (centrées, sous les cartes)', list: true, ui: { component: 'textarea' } },
    ],
  },
];

export default defineConfig({
  branch,
  // Renseignés par Tina Cloud (cf. DEPLOY-CMS-TINA.md). Vides tant que non
  // configurés : l'éditeur /admin ne se connecte pas, mais le SITE se build quand même.
  clientId: process.env.NEXT_PUBLIC_TINA_CLIENT_ID ?? '',
  token: process.env.TINA_TOKEN ?? '',
  build: {
    outputFolder: 'admin', // → public/admin/ (servi à /admin sur OVH comme sur Vercel)
    publicFolder: 'public',
  },
  // Médias gérés dans le dépôt (public/images/…), chemins stockés en /images/…
  media: {
    tina: {
      mediaRoot: 'images',
      publicFolder: 'public',
    },
  },
  schema: {
    collections: [fiches, ...pageCollections, traductions],
  },
});
