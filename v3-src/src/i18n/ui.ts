import type { Locale } from './utils';

/**
 * Chaînes d'interface (header, footer, page d'accueil).
 * ⚠️ Les traductions EN/PL sont des premiers jets à faire relire
 * par un locuteur natif avant mise en production.
 */
export interface UIDict {
  meta: {
    homeTitle: string;
    homeDescription: string;
  };
  nav: {
    home: string;
    about: string;
    eveilASoi: string;
    eveilAuSoi: string;
    mission: string;
    contact: string;
    skipToContent: string;
    langLabel: string;
    menu: string;
    mainNav: string;
    breadcrumb: string;
  };
  video: {
    play: string;
  };
  hero: {
    eyebrow: string;
    tagline: string;
    scrollHint: string;
    portalBaseline: string;
    portalEyebrow: string;
  };
  paths: {
    heading: string;
    lede: string;
    aSoi: {
      title: string;
      kicker: string;
      sub: string;
      desc: string;
      items: string[];
    };
    auSoi: {
      title: string;
      kicker: string;
      sub: string;
      desc: string;
      items: string[];
    };
    cta: string;
  };
  aboutTeaser: {
    eyebrow: string;
    heading: string;
    body: string;
    stats: { value: string; label: string }[];
    cta: string;
  };
  quote: {
    text: string;
    author: string;
  };
  contact: {
    heading: string;
    body: string;
    cta: string;
    phoneLabel: string;
  };
  footer: {
    role: string;
    navTitle: string;
    contactTitle: string;
    followTitle: string;
    consultation: string;
    legal: string;
    privacy: string;
    rights: string;
  };
  fiche: {
    dates: string;
    format: string;
    duration: string;
    price: string;
    ctaConsult: string;
    ctaDefault: string;
    back: string;
  };
}

export const ui: Record<Locale, UIDict> = {
  fr: {
    meta: {
      homeTitle: 'Christine CAL — Éveil à sa multidimensionnalité',
      homeDescription:
        "Christine CAL, coach d'Éveil à la Multidimensionnalité de l'Être. Éveil à Soi (coaching, consultations, stages) et Éveil au Soi (Mont Shasta, TELOS, Nouvelle Terre).",
    },
    nav: {
      home: 'Accueil',
      about: 'Qui suis-je',
      eveilASoi: 'Éveil à Soi',
      eveilAuSoi: 'Éveil au Soi',
      mission: 'Mission',
      contact: 'Contact',
      skipToContent: 'Aller au contenu',
      langLabel: 'Langue',
      menu: 'Menu',
      mainNav: 'Navigation principale',
      breadcrumb: "Fil d'Ariane",
    },
    video: {
      play: 'Lancer la vidéo',
    },
    hero: {
      eyebrow: "Coach d'Éveil à la Multidimensionnalité de l'Être",
      tagline: 'Une galactique venue du futur — éveil à sa multidimensionnalité',
      scrollHint: 'Découvrir',
      portalBaseline: 'Éveil à sa multidimensionnalité',
      portalEyebrow: 'Une galactique venue du futur',
    },
    paths: {
      heading: "Deux portes d'entrée",
      lede: 'Un même chemin : retrouver qui vous êtes, dans toutes vos dimensions.',
      aSoi: {
        title: 'Éveil à Soi',
        kicker: 'Se rencontrer',
        sub: 'École 5D',
        desc: "Se libérer des blessures du passé, déployer ses capacités et bâtir l'estime de Soi — par le coaching, les consultations médiumniques et les stages d'éveil.",
        items: ['Coaching & consultations', "Stages d'éveil", 'Ateliers & conférences'],
      },
      auSoi: {
        title: 'Éveil au Soi',
        kicker: 'Explorer plus grand que soi',
        sub: 'Galactique',
        desc: 'Mont Shasta, TELOS, mémoire de la Lémurie, passage en 5e dimension : explorer les mondes parallèles et la Nouvelle Terre qui se dessine.',
        items: ['Mont Shasta & TELOS', 'Voyages en conscience', 'Nouvelle Terre & 5D'],
      },
      cta: 'Explorer',
    },
    aboutTeaser: {
      eyebrow: 'Qui suis-je',
      heading: 'Un électron libre atypique, en contact avec ses versions du futur',
      body: "Expert-comptable devenue médium clairvoyante et clairaudiente, Christine CAL crée et anime des stages psycho-spirituels d'Éveil depuis plus de 20 ans. Créatrice de l'enseignement initiatique « Construire son Vaisseau Multidimensionnel ».",
      stats: [
        { value: '20+', label: "années d'accompagnement" },
        { value: '950+', label: 'personnes formées depuis 2013' },
        { value: '2014–2019', label: 'séminaires au Mont Shasta' },
      ],
      cta: 'Découvrir mon parcours',
    },
    quote: {
      text: "L'estime de soi est la rencontre du moi avec le Soi.",
      author: 'Christine CAL',
    },
    contact: {
      heading: 'Entrer en contact',
      body: 'Une question, une consultation, un stage ? Écrivez-moi ou appelez-moi.',
      cta: 'M’écrire',
      phoneLabel: 'Téléphone',
    },
    footer: {
      role: 'Coach médiumnique · Conférencière\nÉveil à sa multidimensionnalité',
      navTitle: 'Navigation',
      contactTitle: 'Contact',
      followTitle: 'Suivre',
      consultation: 'Consultation médiumnique',
      legal: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      rights: 'Tous droits réservés',
    },
    fiche: {
      dates: 'Prochaines dates',
      format: 'Format',
      duration: 'Durée',
      price: 'Tarif',
      ctaConsult: 'Réserver une consultation',
      ctaDefault: 'Participer ou en savoir plus',
      back: 'Retour',
    },
  },

  en: {
    meta: {
      homeTitle: 'Christine CAL — Awakening to Your Multidimensionality',
      homeDescription:
        'Christine CAL, coach in Awakening to the Multidimensionality of Being. Self-Awakening (coaching, consultations, retreats) and Awakening to the Self (Mount Shasta, TELOS, New Earth).',
    },
    nav: {
      home: 'Home',
      about: 'About me',
      eveilASoi: 'Self-Awakening',
      eveilAuSoi: 'Awakening to the Self',
      mission: 'Mission',
      contact: 'Contact',
      skipToContent: 'Skip to content',
      langLabel: 'Language',
      menu: 'Menu',
      mainNav: 'Main navigation',
      breadcrumb: 'Breadcrumb',
    },
    video: {
      play: 'Play video',
    },
    hero: {
      eyebrow: 'Coach in Awakening to the Multidimensionality of Being',
      tagline: 'Guiding you through your awakening of consciousness',
      scrollHint: 'Discover',
      portalBaseline: 'Awakening to your multidimensionality',
      portalEyebrow: 'A galactic soul from the future',
    },
    paths: {
      heading: 'Two gateways',
      lede: 'One same path: rediscovering who you are, in all your dimensions.',
      aSoi: {
        title: 'Self-Awakening',
        kicker: 'Meeting yourself',
        sub: '5D School',
        desc: 'Healing the wounds of the past, unfolding your abilities and building self-esteem — through coaching, mediumship consultations and awakening retreats.',
        items: ['Coaching & consultations', 'Awakening retreats', 'Workshops & lectures'],
      },
      auSoi: {
        title: 'Awakening to the Self',
        kicker: 'Exploring beyond yourself',
        sub: 'Galactic',
        desc: 'Mount Shasta, TELOS, the memory of Lemuria, the shift to the 5th dimension: exploring parallel worlds and the New Earth taking shape.',
        items: ['Mount Shasta & TELOS', 'Conscious journeys', 'New Earth & 5D'],
      },
      cta: 'Explore',
    },
    aboutTeaser: {
      eyebrow: 'About me',
      heading: 'An atypical free spirit, in contact with her future selves',
      body: 'A chartered accountant turned clairvoyant and clairaudient medium, Christine CAL has been creating and leading psycho-spiritual awakening retreats for over 20 years. Creator of the initiatory teaching “Building Your Multidimensional Vessel”.',
      stats: [
        { value: '20+', label: 'years of guidance' },
        { value: '950+', label: 'people trained since 2013' },
        { value: '2014–2019', label: 'Mount Shasta seminars' },
      ],
      cta: 'Discover my journey',
    },
    quote: {
      text: 'Self-esteem is the meeting of the me with the Self.',
      author: 'Christine CAL',
    },
    contact: {
      heading: 'Get in touch',
      body: 'A question, a consultation, a retreat? Write to me or call me.',
      cta: 'Write to me',
      phoneLabel: 'Phone',
    },
    footer: {
      role: 'Mediumship coach · Speaker\nAwakening to multidimensionality',
      navTitle: 'Navigation',
      contactTitle: 'Contact',
      followTitle: 'Follow',
      consultation: 'Mediumship consultation',
      legal: 'Legal notice',
      privacy: 'Privacy policy',
      rights: 'All rights reserved',
    },
    fiche: {
      dates: 'Upcoming dates',
      format: 'Format',
      duration: 'Duration',
      price: 'Fee',
      ctaConsult: 'Book a consultation',
      ctaDefault: 'Take part or find out more',
      back: 'Back',
    },
  },

  pl: {
    meta: {
      homeTitle: 'Christine CAL — Przebudzenie do wielowymiarowości',
      homeDescription:
        'Christine CAL, coach przebudzenia do wielowymiarowości istnienia. Przebudzenie Siebie (coaching, konsultacje, warsztaty) i Przebudzenie do Jaźni (Mount Shasta, TELOS, Nowa Ziemia).',
    },
    nav: {
      home: 'Strona główna',
      about: 'O mnie',
      eveilASoi: 'Przebudzenie Siebie',
      eveilAuSoi: 'Przebudzenie do Jaźni',
      mission: 'Misja',
      contact: 'Kontakt',
      skipToContent: 'Przejdź do treści',
      langLabel: 'Język',
      menu: 'Menu',
      mainNav: 'Nawigacja główna',
      breadcrumb: 'Ścieżka nawigacji',
    },
    video: {
      play: 'Odtwórz wideo',
    },
    hero: {
      eyebrow: 'Coach przebudzenia do wielowymiarowości istnienia',
      tagline: 'Towarzyszę Ci w przebudzeniu świadomości',
      scrollHint: 'Odkryj',
      portalBaseline: 'Przebudzenie do swojej wielowymiarowości',
      portalEyebrow: 'Istota galaktyczna z przyszłości',
    },
    paths: {
      heading: 'Dwie bramy',
      lede: 'Jedna droga: odnaleźć siebie we wszystkich swoich wymiarach.',
      aSoi: {
        title: 'Przebudzenie Siebie',
        kicker: 'Spotkanie z sobą',
        sub: 'Szkoła 5D',
        desc: 'Uwolnienie się od ran przeszłości, rozwinięcie swoich zdolności i budowanie poczucia własnej wartości — poprzez coaching, konsultacje mediumiczne i warsztaty przebudzenia.',
        items: ['Coaching i konsultacje', 'Warsztaty przebudzenia', 'Spotkania i wykłady'],
      },
      auSoi: {
        title: 'Przebudzenie do Jaźni',
        kicker: 'Odkrywanie tego, co większe',
        sub: 'Galaktyczny',
        desc: 'Mount Shasta, TELOS, pamięć Lemurii, przejście do 5. wymiaru: odkrywanie światów równoległych i rodzącej się Nowej Ziemi.',
        items: ['Mount Shasta i TELOS', 'Świadome podróże', 'Nowa Ziemia i 5D'],
      },
      cta: 'Odkryj',
    },
    aboutTeaser: {
      eyebrow: 'O mnie',
      heading: 'Nietypowy wolny duch, w kontakcie ze swoimi wersjami z przyszłości',
      body: 'Biegła księgowa, która stała się medium jasnowidzącym i jasnosłyszącym. Christine CAL od ponad 20 lat tworzy i prowadzi psycho-duchowe warsztaty przebudzenia. Twórczyni inicjacyjnego nauczania „Zbuduj swój wielowymiarowy statek”.',
      stats: [
        { value: '20+', label: 'lat towarzyszenia' },
        { value: '950+', label: 'osób przeszkolonych od 2013 r.' },
        { value: '2014–2019', label: 'seminaria na Mount Shasta' },
      ],
      cta: 'Poznaj moją drogę',
    },
    quote: {
      text: 'Poczucie własnej wartości to spotkanie „ja” z Jaźnią.',
      author: 'Christine CAL',
    },
    contact: {
      heading: 'Skontaktuj się',
      body: 'Pytanie, konsultacja, warsztat? Napisz do mnie lub zadzwoń.',
      cta: 'Napisz do mnie',
      phoneLabel: 'Telefon',
    },
    footer: {
      role: 'Coach mediumiczny · Prelegentka\nPrzebudzenie do wielowymiarowości',
      navTitle: 'Nawigacja',
      contactTitle: 'Kontakt',
      followTitle: 'Obserwuj',
      consultation: 'Konsultacja mediumiczna',
      legal: 'Nota prawna',
      privacy: 'Polityka prywatności',
      rights: 'Wszelkie prawa zastrzeżone',
    },
    fiche: {
      dates: 'Najbliższe terminy',
      format: 'Format',
      duration: 'Czas trwania',
      price: 'Cena',
      ctaConsult: 'Zarezerwuj konsultację',
      ctaDefault: 'Weź udział lub dowiedz się więcej',
      back: 'Powrót',
    },
  },

  es: {
    meta: {
      homeTitle: 'Christine CAL — Despertar a tu multidimensionalidad',
      homeDescription:
        'Christine CAL, coach de despertar a la multidimensionalidad del Ser. Despertar a Sí (coaching, consultas, talleres) y Despertar al Sí (Monte Shasta, TELOS, Nueva Tierra).',
    },
    nav: {
      home: 'Inicio',
      about: 'Quién soy',
      eveilASoi: 'Despertar a Sí',
      eveilAuSoi: 'Despertar al Sí',
      mission: 'Misión',
      contact: 'Contacto',
      skipToContent: 'Ir al contenido',
      langLabel: 'Idioma',
      menu: 'Menú',
      mainNav: 'Navegación principal',
      breadcrumb: 'Ruta de navegación',
    },
    video: {
      play: 'Reproducir vídeo',
    },
    hero: {
      eyebrow: 'Coach de despertar a la multidimensionalidad del Ser',
      tagline: 'Te acompaño en tu despertar de conciencia',
      scrollHint: 'Descubrir',
      portalBaseline: 'Despertar a tu multidimensionalidad',
      portalEyebrow: 'Una galáctica venida del futuro',
    },
    paths: {
      heading: 'Dos puertas de entrada',
      lede: 'Un mismo camino: reencontrar quién eres, en todas tus dimensiones.',
      aSoi: {
        title: 'Despertar a Sí',
        kicker: 'Encontrarse',
        sub: 'Escuela 5D',
        desc: 'Liberarse de las heridas del pasado, desplegar tus capacidades y construir la autoestima — mediante el coaching, las consultas de médium y los talleres de despertar.',
        items: ['Coaching y consultas', 'Cursos de despertar', 'Talleres y conferencias'],
      },
      auSoi: {
        title: 'Despertar al Sí',
        kicker: 'Explorar más allá de uno mismo',
        sub: 'Galáctico',
        desc: 'Monte Shasta, TELOS, la memoria de Lemuria, el paso a la 5ª dimensión: explorar los mundos paralelos y la Nueva Tierra que se perfila.',
        items: ['Monte Shasta y TELOS', 'Viajes en conciencia', 'Nueva Tierra y 5D'],
      },
      cta: 'Explorar',
    },
    aboutTeaser: {
      eyebrow: 'Quién soy',
      heading: 'Un espíritu libre atípico, en contacto con sus versiones del futuro',
      body: 'Contable de formación convertida en médium clarividente y clariaudiente, Christine CAL crea y dirige talleres psico-espirituales de despertar desde hace más de 20 años. Creadora de la enseñanza iniciática «Construir tu Nave Multidimensional».',
      stats: [
        { value: '20+', label: 'años de acompañamiento' },
        { value: '950+', label: 'personas formadas desde 2013' },
        { value: '2014–2019', label: 'seminarios en el Monte Shasta' },
      ],
      cta: 'Descubrir mi trayectoria',
    },
    quote: {
      text: 'La autoestima es el encuentro del yo con el Sí mismo.',
      author: 'Christine CAL',
    },
    contact: {
      heading: 'Ponte en contacto',
      body: '¿Una pregunta, una consulta, un taller? Escríbeme o llámame.',
      cta: 'Escríbeme',
      phoneLabel: 'Teléfono',
    },
    footer: {
      role: 'Coach médium · Conferenciante\nDespertar a la multidimensionalidad',
      navTitle: 'Navegación',
      contactTitle: 'Contacto',
      followTitle: 'Seguir',
      consultation: 'Consulta de médium',
      legal: 'Aviso legal',
      privacy: 'Política de privacidad',
      rights: 'Todos los derechos reservados',
    },
    fiche: {
      dates: 'Próximas fechas',
      format: 'Formato',
      duration: 'Duración',
      price: 'Tarifa',
      ctaConsult: 'Reservar una consulta',
      ctaDefault: 'Participar o saber más',
      back: 'Volver',
    },
  },

  it: {
    meta: {
      homeTitle: 'Christine CAL — Risveglio alla tua multidimensionalità',
      homeDescription:
        "Christine CAL, coach del risveglio alla multidimensionalità dell'Essere. Risveglio a Sé (coaching, consulti, seminari) e Risveglio al Sé (Monte Shasta, TELOS, Nuova Terra).",
    },
    nav: {
      home: 'Home',
      about: 'Chi sono',
      eveilASoi: 'Risveglio a Sé',
      eveilAuSoi: 'Risveglio al Sé',
      mission: 'Missione',
      contact: 'Contatto',
      skipToContent: 'Vai al contenuto',
      langLabel: 'Lingua',
      menu: 'Menu',
      mainNav: 'Navigazione principale',
      breadcrumb: 'Percorso di navigazione',
    },
    video: {
      play: 'Riproduci video',
    },
    hero: {
      eyebrow: "Coach del risveglio alla multidimensionalità dell'Essere",
      tagline: 'Ti accompagno nel tuo risveglio di coscienza',
      scrollHint: 'Scopri',
      portalBaseline: 'Risveglio alla tua multidimensionalità',
      portalEyebrow: 'Una galattica venuta dal futuro',
    },
    paths: {
      heading: "Due porte d'ingresso",
      lede: 'Un solo cammino: ritrovare chi sei, in tutte le tue dimensioni.',
      aSoi: {
        title: 'Risveglio a Sé',
        kicker: 'Incontrarsi',
        sub: 'Scuola 5D',
        desc: "Liberarsi dalle ferite del passato, sviluppare le proprie capacità e costruire l'autostima — attraverso il coaching, i consulti medianici e i seminari di risveglio.",
        items: ['Coaching e consulti', 'Seminari di risveglio', 'Laboratori e conferenze'],
      },
      auSoi: {
        title: 'Risveglio al Sé',
        kicker: 'Esplorare oltre se stessi',
        sub: 'Galattico',
        desc: 'Monte Shasta, TELOS, la memoria di Lemuria, il passaggio alla 5ª dimensione: esplorare i mondi paralleli e la Nuova Terra che prende forma.',
        items: ['Monte Shasta e TELOS', 'Viaggi nella coscienza', 'Nuova Terra e 5D'],
      },
      cta: 'Esplora',
    },
    aboutTeaser: {
      eyebrow: 'Chi sono',
      heading: 'Uno spirito libero atipico, in contatto con le sue versioni del futuro',
      body: "Commercialista diventata medium chiaroveggente e chiaroudente, Christine CAL crea e conduce seminari psico-spirituali di risveglio da oltre 20 anni. Creatrice dell'insegnamento iniziatico «Costruire la tua Nave Multidimensionale».",
      stats: [
        { value: '20+', label: 'anni di accompagnamento' },
        { value: '950+', label: 'persone formate dal 2013' },
        { value: '2014–2019', label: 'seminari al Monte Shasta' },
      ],
      cta: 'Scopri il mio percorso',
    },
    quote: {
      text: "L'autostima è l'incontro dell'io con il Sé.",
      author: 'Christine CAL',
    },
    contact: {
      heading: 'Mettiti in contatto',
      body: 'Una domanda, un consulto, un seminario? Scrivimi o chiamami.',
      cta: 'Scrivimi',
      phoneLabel: 'Telefono',
    },
    footer: {
      role: 'Coach medianica · Relatrice\nRisveglio alla multidimensionalità',
      navTitle: 'Navigazione',
      contactTitle: 'Contatto',
      followTitle: 'Seguimi',
      consultation: 'Consulto medianico',
      legal: 'Note legali',
      privacy: 'Informativa sulla privacy',
      rights: 'Tutti i diritti riservati',
    },
    fiche: {
      dates: 'Prossime date',
      format: 'Formato',
      duration: 'Durata',
      price: 'Tariffa',
      ctaConsult: 'Prenotare un consulto',
      ctaDefault: 'Partecipare o saperne di più',
      back: 'Indietro',
    },
  },
};
