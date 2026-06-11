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
    contact: string;
    skipToContent: string;
    langLabel: string;
  };
  hero: {
    eyebrow: string;
    tagline: string;
    scrollHint: string;
  };
  paths: {
    heading: string;
    lede: string;
    aSoi: {
      title: string;
      kicker: string;
      desc: string;
      items: string[];
    };
    auSoi: {
      title: string;
      kicker: string;
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
    legal: string;
    privacy: string;
    rights: string;
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
      contact: 'Contact',
      skipToContent: 'Aller au contenu',
      langLabel: 'Langue',
    },
    hero: {
      eyebrow: "Coach d'Éveil à la Multidimensionnalité de l'Être",
      tagline: 'Vous accompagne dans votre Éveil de conscience',
      scrollHint: 'Découvrir',
    },
    paths: {
      heading: "Deux portes d'entrée",
      lede: 'Un même chemin : retrouver qui vous êtes, dans toutes vos dimensions.',
      aSoi: {
        title: 'Éveil à Soi',
        kicker: 'Se rencontrer',
        desc: "Se libérer des blessures du passé, déployer ses capacités et bâtir l'estime de Soi — par le coaching, les consultations médiumniques et les stages d'éveil.",
        items: ['Coaching & consultations', "Stages d'éveil", 'Ateliers & conférences'],
      },
      auSoi: {
        title: 'Éveil au Soi',
        kicker: 'Explorer plus grand que soi',
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
      legal: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      rights: 'Tous droits réservés',
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
      contact: 'Contact',
      skipToContent: 'Skip to content',
      langLabel: 'Language',
    },
    hero: {
      eyebrow: 'Coach in Awakening to the Multidimensionality of Being',
      tagline: 'Guiding you through your awakening of consciousness',
      scrollHint: 'Discover',
    },
    paths: {
      heading: 'Two gateways',
      lede: 'One same path: rediscovering who you are, in all your dimensions.',
      aSoi: {
        title: 'Self-Awakening',
        kicker: 'Meeting yourself',
        desc: 'Healing the wounds of the past, unfolding your abilities and building self-esteem — through coaching, mediumship consultations and awakening retreats.',
        items: ['Coaching & consultations', 'Awakening retreats', 'Workshops & lectures'],
      },
      auSoi: {
        title: 'Awakening to the Self',
        kicker: 'Exploring beyond yourself',
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
      legal: 'Legal notice',
      privacy: 'Privacy policy',
      rights: 'All rights reserved',
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
      contact: 'Kontakt',
      skipToContent: 'Przejdź do treści',
      langLabel: 'Język',
    },
    hero: {
      eyebrow: 'Coach przebudzenia do wielowymiarowości istnienia',
      tagline: 'Towarzyszę Ci w przebudzeniu świadomości',
      scrollHint: 'Odkryj',
    },
    paths: {
      heading: 'Dwie bramy',
      lede: 'Jedna droga: odnaleźć siebie we wszystkich swoich wymiarach.',
      aSoi: {
        title: 'Przebudzenie Siebie',
        kicker: 'Spotkanie z sobą',
        desc: 'Uwolnienie się od ran przeszłości, rozwinięcie swoich zdolności i budowanie poczucia własnej wartości — poprzez coaching, konsultacje mediumiczne i warsztaty przebudzenia.',
        items: ['Coaching i konsultacje', 'Warsztaty przebudzenia', 'Spotkania i wykłady'],
      },
      auSoi: {
        title: 'Przebudzenie do Jaźni',
        kicker: 'Odkrywanie tego, co większe',
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
      legal: 'Nota prawna',
      privacy: 'Polityka prywatności',
      rights: 'Wszelkie prawa zastrzeżone',
    },
  },
};
