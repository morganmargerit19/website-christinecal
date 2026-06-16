import type { Locale } from '../utils';

/**
 * Contenu de la page « Qui suis-je », structuré par langue.
 * Source FR : texte validé par Christine (site v1, qui-suis-je.html).
 * ⚠️ EN/PL : premiers jets à faire relire par un locuteur natif.
 */
export interface AboutDict {
  meta: { title: string; description: string };
  hero: { eyebrow: string; title: string; lede: string };
  galactic: { heading: string; items: string[] };
  videos: {
    heading: string;
    list: { id: string; title: string; meta: string }[];
  };
  journey: { heading: string; items: { lead: string; text: string }[] };
  activities: { heading: string; items: { title: string; text: string }[] };
  news: { heading: string; items: string[] };
  clients: { heading: string; text: string };
  press: { text: string; href: string };
}

export const about: Record<Locale, AboutDict> = {
  fr: {
    meta: {
      title: 'Qui suis-je — Christine CAL',
      description:
        "Le parcours de Christine CAL : expert-comptable devenue médium clairvoyante et clairaudiente, coach d'éveil, conférencière, créatrice d'un enseignement initiatique.",
    },
    hero: {
      eyebrow: 'Qui suis-je',
      title: 'Un électron libre atypique en contact avec ses versions du futur',
      lede: "L'Espace-Temps se contracte de plus en plus, donc soyons brefs mais précis.",
    },
    galactic: {
      heading: "Une galactique venue d'un futur",
      items: [
        'Ayant quitté sa lointaine famille pour participer à la libération de cette humanité sur cette magnifique planète Terre, dans cette galaxie très convoitée et depuis peu libérée.',
      ],
    },
    videos: {
      heading: 'Deux vidéos de présentation',
      list: [
        { id: '0QL8ive6NuU', title: 'Qui est Christine CAL', meta: 'Juillet 2016 · 10 min 42' },
        { id: '2oEYgOGBH7o', title: 'Témoignage de vie de C.C.', meta: 'Juillet 2016 · 4 min 39' },
      ],
    },
    journey: {
      heading: 'Un parcours en bref',
      items: [
        { lead: 'Une petite fille', text: 'choquée par un monde inversé.' },
        {
          lead: 'Une adolescente',
          text: 'consciente du Jeu Matriciel, passionnée par la psychologie humaine et les religions créées par les hommes, en recherche de son SOI Supérieur.',
        },
        { lead: 'Un cerveau gauche musclé', text: 'Expert-comptable en libéral de 1993 à 2013.' },
        {
          lead: 'Un cerveau droit déployé',
          text: 'Médium clairvoyante et clairaudiente en contacts avec de nombreux mondes parallèles.',
        },
      ],
    },
    activities: {
      heading: 'Activités actuelles',
      items: [
        {
          title: 'Coach Consultant',
          text: "Création et animation de stages psycho-spirituels d'Éveil depuis plus de 20 ans. Canalisation de Maîtres divers.",
        },
        { title: 'Consultations médiumniques', text: 'Depuis 2013.' },
        { title: 'Conférencière', text: 'Sujets divers en France et via Zoom ou des Associations.' },
        {
          title: "Création d'un enseignement initiatique",
          text: 'CONSTRUIRE SON VAISSEAU MULTIDIMENSIONNEL — formation de plus de 950 personnes depuis 2013.',
        },
        {
          title: 'Organisatrice',
          text: 'Séminaires Initiatiques au Mont Shasta de 2014 à 2019 et Rencontres Internationales avec le Réseau TELOS Mondial.',
        },
        {
          title: 'Spécialiste',
          text: 'Du voyage astral et des contacts avec divers peuples intra et extraterrestres depuis 2003.',
        },
      ],
    },
    news: {
      heading: 'Actualités',
      items: [
        "Depuis 2024 — Création de stages sur la multidimensionnalité de l'Être.",
        "2025 / 2026 — Mont Shasta. Visite dans le nouveau TELOS après l'invasion en 2021, confirmée suite à ma rencontre avec Elena Danaan en août 2024 et 2025.",
        '2026 — Mont Bugarach. Contacts avec des ET Gardiens. Mission en cours.',
        "Divers livres en cours d'écriture.",
      ],
    },
    clients: {
      heading: 'Une clientèle variée',
      text: "Psychologues, médecins divers, pédopsychiatre, infirmières, ostéopathes, naturopathes, kinésiologues, pharmacien, directrice d'EHPAD, nombreux thérapeutes énergétiques, artistes divers, inspecteur et contrôleurs des Impôts, architecte, huissier de justice… et tant d'autres.",
    },
    press: {
      text: 'Lire l’article dans Sud Ouest du 2 juin 2017 — « Cette comptable qui est devenue coach de vie… »',
      href: 'https://www.sudouest.fr/2017/06/02/cela-vous-dit-d-enfin-realiser-vos-reves-3497649-1988.php',
    },
  },

  en: {
    meta: {
      title: 'About me — Christine CAL',
      description:
        'The journey of Christine CAL: a chartered accountant turned clairvoyant and clairaudient medium, awakening coach, speaker, creator of an initiatory teaching.',
    },
    hero: {
      eyebrow: 'About me',
      title: 'An atypical free spirit in contact with her future selves',
      lede: 'Space-Time is contracting more and more, so let us be brief but precise.',
    },
    galactic: {
      heading: 'A galactic soul from a future',
      items: [
        'Having left her distant family to take part in the liberation of this humanity on this magnificent planet Earth, in this highly coveted and recently liberated galaxy.',
      ],
    },
    videos: {
      heading: 'Two introduction videos',
      list: [
        { id: '0QL8ive6NuU', title: 'Who is Christine CAL (in French)', meta: 'July 2016 · 10 min 42' },
        { id: '2oEYgOGBH7o', title: 'A life testimony by C.C. (in French)', meta: 'July 2016 · 4 min 39' },
      ],
    },
    journey: {
      heading: 'A journey in brief',
      items: [
        { lead: 'A little girl', text: 'shocked by an inverted world.' },
        {
          lead: 'A teenager',
          text: 'aware of the Matrix Game, passionate about human psychology and man-made religions, in search of her Higher SELF.',
        },
        { lead: 'A well-trained left brain', text: 'Chartered accountant in private practice from 1993 to 2013.' },
        {
          lead: 'A fully unfolded right brain',
          text: 'Clairvoyant and clairaudient medium in contact with many parallel worlds.',
        },
      ],
    },
    activities: {
      heading: 'Current activities',
      items: [
        {
          title: 'Coach & consultant',
          text: 'Creating and leading psycho-spiritual awakening retreats for over 20 years. Channelling of various Masters.',
        },
        { title: 'Mediumship consultations', text: 'Since 2013.' },
        { title: 'Speaker', text: 'Various topics across France, via Zoom or through associations.' },
        {
          title: 'Creator of an initiatory teaching',
          text: 'BUILDING YOUR MULTIDIMENSIONAL VESSEL — over 950 people trained since 2013.',
        },
        {
          title: 'Organiser',
          text: 'Initiatory seminars at Mount Shasta from 2014 to 2019 and international gatherings with the worldwide TELOS network.',
        },
        {
          title: 'Specialist',
          text: 'In astral travel and contacts with various intra- and extraterrestrial peoples since 2003.',
        },
      ],
    },
    news: {
      heading: 'News',
      items: [
        'Since 2024 — Creation of retreats on the multidimensionality of Being.',
        '2025 / 2026 — Mount Shasta. Visit to the new TELOS after the 2021 invasion, confirmed following my meeting with Elena Danaan in August 2024 and 2025.',
        '2026 — Mount Bugarach. Contacts with Guardian ETs. Mission in progress.',
        'Several books currently being written.',
      ],
    },
    clients: {
      heading: 'A varied clientele',
      text: 'Psychologists, doctors, a child psychiatrist, nurses, osteopaths, naturopaths, kinesiologists, a pharmacist, a care-home director, many energy therapists, artists, tax inspectors, an architect, a bailiff… and so many others.',
    },
    press: {
      text: 'Read the article in Sud Ouest, 2 June 2017 — “The accountant who became a life coach…” (in French)',
      href: 'https://www.sudouest.fr/2017/06/02/cela-vous-dit-d-enfin-realiser-vos-reves-3497649-1988.php',
    },
  },

  pl: {
    meta: {
      title: 'O mnie — Christine CAL',
      description:
        'Droga Christine CAL: biegła księgowa, która stała się medium jasnowidzącym i jasnosłyszącym, coach przebudzenia, prelegentka, twórczyni inicjacyjnego nauczania.',
    },
    hero: {
      eyebrow: 'O mnie',
      title: 'Nietypowy wolny duch w kontakcie ze swoimi wersjami z przyszłości',
      lede: 'Czasoprzestrzeń kurczy się coraz bardziej, bądźmy więc zwięźli, ale precyzyjni.',
    },
    galactic: {
      heading: 'Galaktyczna dusza z przyszłości',
      items: [
        'Opuściła swoją odległą rodzinę, aby wziąć udział w wyzwoleniu tej ludzkości na tej wspaniałej planecie Ziemi, w tej bardzo pożądanej i niedawno wyzwolonej galaktyce.',
      ],
    },
    videos: {
      heading: 'Dwa filmy wprowadzające',
      list: [
        { id: '0QL8ive6NuU', title: 'Kim jest Christine CAL (po francusku)', meta: 'Lipiec 2016 · 10 min 42' },
        { id: '2oEYgOGBH7o', title: 'Świadectwo życia C.C. (po francusku)', meta: 'Lipiec 2016 · 4 min 39' },
      ],
    },
    journey: {
      heading: 'Droga w skrócie',
      items: [
        { lead: 'Mała dziewczynka', text: 'wstrząśnięta odwróconym światem.' },
        {
          lead: 'Nastolatka',
          text: 'świadoma Gry Matrycy, zafascynowana psychologią człowieka i religiami stworzonymi przez ludzi, w poszukiwaniu swojej Wyższej JAŹNI.',
        },
        { lead: 'Wytrenowana lewa półkula', text: 'Biegła księgowa prowadząca własną praktykę w latach 1993–2013.' },
        {
          lead: 'Rozwinięta prawa półkula',
          text: 'Medium jasnowidzące i jasnosłyszące w kontakcie z wieloma światami równoległymi.',
        },
      ],
    },
    activities: {
      heading: 'Obecna działalność',
      items: [
        {
          title: 'Coach i konsultantka',
          text: 'Tworzenie i prowadzenie psycho-duchowych warsztatów przebudzenia od ponad 20 lat. Przekazy różnych Mistrzów.',
        },
        { title: 'Konsultacje mediumiczne', text: 'Od 2013 roku.' },
        { title: 'Prelegentka', text: 'Różnorodne tematy we Francji, przez Zoom lub we współpracy ze stowarzyszeniami.' },
        {
          title: 'Twórczyni inicjacyjnego nauczania',
          text: 'ZBUDUJ SWÓJ WIELOWYMIAROWY STATEK — ponad 950 przeszkolonych osób od 2013 roku.',
        },
        {
          title: 'Organizatorka',
          text: 'Seminaria inicjacyjne na Mount Shasta w latach 2014–2019 oraz międzynarodowe spotkania ze światową siecią TELOS.',
        },
        {
          title: 'Specjalistka',
          text: 'W podróżach astralnych i kontaktach z różnymi ludami wewnątrz- i pozaziemskimi od 2003 roku.',
        },
      ],
    },
    news: {
      heading: 'Aktualności',
      items: [
        'Od 2024 — Tworzenie warsztatów o wielowymiarowości istnienia.',
        '2025 / 2026 — Mount Shasta. Wizyta w nowym TELOS po inwazji w 2021 roku, potwierdzona po moim spotkaniu z Eleną Danaan w sierpniu 2024 i 2025.',
        '2026 — Góra Bugarach. Kontakty ze Strażnikami ET. Misja w toku.',
        'Kilka książek w trakcie pisania.',
      ],
    },
    clients: {
      heading: 'Różnorodna klientela',
      text: 'Psychologowie, lekarze, psychiatra dziecięcy, pielęgniarki, osteopaci, naturopaci, kinezjolodzy, farmaceuta, dyrektorka domu opieki, liczni terapeuci energetyczni, artyści, inspektorzy podatkowi, architekt, komornik… i wielu innych.',
    },
    press: {
      text: 'Przeczytaj artykuł w Sud Ouest z 2 czerwca 2017 — „Księgowa, która została life coachem…” (po francusku)',
      href: 'https://www.sudouest.fr/2017/06/02/cela-vous-dit-d-enfin-realiser-vos-reves-3497649-1988.php',
    },
  },
};
