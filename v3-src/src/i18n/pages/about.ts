import type { Locale } from '../utils';

/**
 * Contenu de la page « Qui suis-je », structuré par langue.
 * Source FR : texte validé par Christine (site v1, qui-suis-je.html).
 * ⚠️ EN/PL : premiers jets à faire relire par un locuteur natif.
 */
export interface AboutDict {
  meta: { title: string; description: string };
  /** `lede` optionnel : retiré sur la page FR à la demande de Christine. */
  hero: { eyebrow: string; title: string; lede?: string };
  /** Épigraphe poétique en ouverture (portrait à la 3e personne). */
  epigraph: string;
  galactic: { heading: string; items: string[] };
  videos: {
    heading: string;
    list: { id: string; title: string; meta: string }[];
  };
  journey: { heading: string; items: { lead: string; text: string }[] };
  /** Une carte peut porter un accordéon (ex. liste des conférences). */
  activities: {
    heading: string;
    items: {
      title: string;
      text: string;
      accordion?: { summary: string; items: string[] };
    }[];
  };
  /** Section « Spécificités » (FR). Optionnel le temps de traduire les autres langues. */
  specifics?: { heading: string; items: string[] };
  news: { heading: string; items: string[] };
  /** Section « À venir » (FR). Optionnel le temps de traduire les autres langues. */
  upcoming?: { heading: string; items: string[] };
  clients: { heading: string; text: string };
  /** Bloc « Presse & DVD » — retiré de la page FR (déplacé vers la rubrique Mission). */
  dvd?: { heading: string; body: string; posterAlt: string; trailerTitle: string };
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
    epigraph:
      "Elle vit dans plusieurs mondes à la fois, et a ce don rare de les relier : le ciel et le quotidien, l'invisible et le concret. Les pieds sur Terre, le regard dans les étoiles — une chaleur qui accueille, une exigence de vérité qui éveille. Une galactique venue du futur, profondément humaine, qui vous prend par la main pour vous montrer la lumière que vous portez déjà.",
    galactic: {
      heading: "Une galactique venue d'un futur",
      items: [
        'Ayant quitté sa lointaine famille pour participer à la libération de cette humanité sur cette magnifique planète Terre, dans cette galaxie très convoitée et depuis peu libérée.',
        'Ayant reconnecté son identité en réintégrant consciemment ses fractales Terrestres.',
        'Œuvrant avec ses fractales Célestes à travers les différentes Time-Lines.',
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
    dvd: {
      heading: 'Presse & DVD',
      body: 'Christine figure dans le film documentaire « Les Acteurs de la Vie » de Peter Müller et Angélique Piro (2017), qui donne la parole à celles et ceux qui voient le monde autrement.',
      posterAlt: 'Affiche du film « Les Acteurs de la Vie »',
      trailerTitle: 'Bande-annonce — Les Acteurs de la Vie',
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
    epigraph:
      'She lives in several worlds at once, with the rare gift of weaving them together: the sky and the everyday, the invisible and the tangible. Feet on the Earth, eyes among the stars — a warmth that welcomes, a longing for truth that awakens. A galactic soul from the future, deeply human, who takes you by the hand to show you the light you already carry.',
    galactic: {
      heading: 'A galactic soul from a future',
      items: [
        'Having left her distant family to take part in the liberation of this humanity on this magnificent planet Earth, in this highly coveted and recently liberated galaxy.',
        'Having reconnected her identity by consciously reintegrating her Terrestrial fractals.',
        'Working with her Celestial fractals across the different Time-Lines.',
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
    dvd: {
      heading: 'Press & DVD',
      body: 'Christine appears in the documentary film “Les Acteurs de la Vie” by Peter Müller and Angélique Piro (2017), which gives a voice to those who see the world differently.',
      posterAlt: 'Poster of the film “Les Acteurs de la Vie”',
      trailerTitle: 'Trailer — Les Acteurs de la Vie',
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
    epigraph:
      'Żyje w kilku światach naraz i ma rzadki dar ich łączenia: niebo i codzienność, to, co niewidzialne, i to, co namacalne. Stopami na Ziemi, wzrokiem wśród gwiazd — ciepło, które przyjmuje, i pragnienie prawdy, które przebudza. Galaktyczna dusza z przyszłości, głęboko ludzka, która bierze cię za rękę, by pokazać ci światło, które już w sobie nosisz.',
    galactic: {
      heading: 'Galaktyczna dusza z przyszłości',
      items: [
        'Opuściła swoją odległą rodzinę, aby wziąć udział w wyzwoleniu tej ludzkości na tej wspaniałej planecie Ziemi, w tej bardzo pożądanej i niedawno wyzwolonej galaktyce.',
        'Ponownie połączyła swoją tożsamość, świadomie reintegrując swoje fraktale Ziemskie.',
        'Działając ze swoimi fraktalami Niebiańskimi poprzez różne Linie Czasowe.',
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
    dvd: {
      heading: 'Prasa i DVD',
      body: 'Christine występuje w filmie dokumentalnym „Les Acteurs de la Vie” Petera Müllera i Angélique Piro (2017), który oddaje głos tym, którzy widzą świat inaczej.',
      posterAlt: 'Plakat filmu „Les Acteurs de la Vie”',
      trailerTitle: 'Zwiastun — Les Acteurs de la Vie',
    },
  },

  es: {
    meta: {
      title: 'Quién soy — Christine CAL',
      description:
        'La trayectoria de Christine CAL: censora jurada de cuentas convertida en médium clarividente y clariaudiente, coach de despertar, conferenciante, creadora de una enseñanza iniciática.',
    },
    hero: {
      eyebrow: 'Quién soy',
      title: 'Un espíritu libre atípico en contacto con sus versiones del futuro',
      lede: 'El Espacio-Tiempo se contrae cada vez más, así que seamos breves pero precisos.',
    },
    epigraph:
      'Vive en varios mundos a la vez, con el raro don de entrelazarlos: el cielo y lo cotidiano, lo invisible y lo tangible. Los pies en la Tierra, la mirada entre las estrellas — una calidez que acoge, una exigencia de verdad que despierta. Una galáctica venida del futuro, profundamente humana, que te toma de la mano para mostrarte la luz que ya llevas dentro.',
    galactic: {
      heading: 'Un alma galáctica venida de un futuro',
      items: [
        'Habiendo dejado a su lejana familia para participar en la liberación de esta humanidad en este magnífico planeta Tierra, en esta galaxia tan codiciada y recientemente liberada.',
        'Habiendo reconectado su identidad reintegrando conscientemente sus fractales Terrestres.',
        'Obrando con sus fractales Celestes a través de las diferentes Líneas Temporales.',
      ],
    },
    videos: {
      heading: 'Dos vídeos de presentación',
      list: [
        { id: '0QL8ive6NuU', title: 'Quién es Christine CAL (en francés)', meta: 'Julio de 2016 · 10 min 42' },
        { id: '2oEYgOGBH7o', title: 'Testimonio de vida de C.C. (en francés)', meta: 'Julio de 2016 · 4 min 39' },
      ],
    },
    journey: {
      heading: 'Una trayectoria en breve',
      items: [
        { lead: 'Una niña pequeña', text: 'conmocionada por un mundo invertido.' },
        {
          lead: 'Una adolescente',
          text: 'consciente del Juego de la Matrix, apasionada por la psicología humana y las religiones creadas por los hombres, en busca de su SER Superior.',
        },
        { lead: 'Un hemisferio izquierdo bien entrenado', text: 'Censora jurada de cuentas en ejercicio libre de 1993 a 2013.' },
        {
          lead: 'Un hemisferio derecho plenamente desplegado',
          text: 'Médium clarividente y clariaudiente en contacto con numerosos mundos paralelos.',
        },
      ],
    },
    activities: {
      heading: 'Actividades actuales',
      items: [
        {
          title: 'Coach y consultora',
          text: 'Creación y dirección de retiros psicoespirituales de Despertar desde hace más de 20 años. Canalización de diversos Maestros.',
        },
        { title: 'Consultas mediúmnicas', text: 'Desde 2013.' },
        { title: 'Conferenciante', text: 'Temas diversos en Francia y a través de Zoom o de asociaciones.' },
        {
          title: 'Creadora de una enseñanza iniciática',
          text: 'CONSTRUIR TU NAVE MULTIDIMENSIONAL — más de 950 personas formadas desde 2013.',
        },
        {
          title: 'Organizadora',
          text: 'Seminarios iniciáticos en el Monte Shasta de 2014 a 2019 y Encuentros Internacionales con la Red TELOS Mundial.',
        },
        {
          title: 'Especialista',
          text: 'En el viaje astral y los contactos con diversos pueblos intra y extraterrestres desde 2003.',
        },
      ],
    },
    news: {
      heading: 'Novedades',
      items: [
        'Desde 2024 — Creación de retiros sobre la multidimensionalidad del Ser.',
        '2025 / 2026 — Monte Shasta. Visita al nuevo TELOS tras la invasión de 2021, confirmada a raíz de mi encuentro con Elena Danaan en agosto de 2024 y 2025.',
        '2026 — Monte Bugarach. Contactos con ET Guardianes. Misión en curso.',
        'Varios libros en proceso de escritura.',
      ],
    },
    clients: {
      heading: 'Una clientela variada',
      text: 'Psicólogos, médicos diversos, una psiquiatra infantil, enfermeras, osteópatas, naturópatas, kinesiólogos, un farmacéutico, una directora de residencia de ancianos, numerosos terapeutas energéticos, artistas diversos, inspectores y controladores de Hacienda, un arquitecto, un agente judicial… y tantos otros.',
    },
    dvd: {
      heading: 'Prensa y DVD',
      body: 'Christine aparece en el documental «Les Acteurs de la Vie» de Peter Müller y Angélique Piro (2017), que da voz a quienes ven el mundo de otra manera.',
      posterAlt: 'Cartel de la película «Les Acteurs de la Vie»',
      trailerTitle: 'Tráiler — Les Acteurs de la Vie',
    },
  },

  it: {
    meta: {
      title: 'Chi sono — Christine CAL',
      description:
        'Il percorso di Christine CAL: dottore commercialista diventata medium chiaroveggente e chiarudente, coach del risveglio, conferenziera, creatrice di un insegnamento iniziatico.',
    },
    hero: {
      eyebrow: 'Chi sono',
      title: 'Uno spirito libero atipico in contatto con le sue versioni del futuro',
      lede: 'Lo Spazio-Tempo si contrae sempre di più, quindi siamo brevi ma precisi.',
    },
    epigraph:
      'Vive in più mondi alla volta, con il raro dono di intrecciarli: il cielo e il quotidiano, l’invisibile e il concreto. I piedi sulla Terra, lo sguardo tra le stelle — un calore che accoglie, un’esigenza di verità che risveglia. Un’anima galattica venuta dal futuro, profondamente umana, che ti prende per mano per mostrarti la luce che già porti dentro.',
    galactic: {
      heading: "Un'anima galattica venuta da un futuro",
      items: [
        'Avendo lasciato la sua lontana famiglia per partecipare alla liberazione di questa umanità su questo magnifico pianeta Terra, in questa galassia tanto ambita e da poco liberata.',
        'Avendo riconnesso la sua identità reintegrando consapevolmente le sue frattali Terrestri.',
        'Operando con le sue frattali Celesti attraverso le diverse Linee Temporali.',
      ],
    },
    videos: {
      heading: 'Due video di presentazione',
      list: [
        { id: '0QL8ive6NuU', title: 'Chi è Christine CAL (in francese)', meta: 'Luglio 2016 · 10 min 42' },
        { id: '2oEYgOGBH7o', title: 'Testimonianza di vita di C.C. (in francese)', meta: 'Luglio 2016 · 4 min 39' },
      ],
    },
    journey: {
      heading: 'Un percorso in breve',
      items: [
        { lead: 'Una bambina', text: 'sconvolta da un mondo capovolto.' },
        {
          lead: "Un'adolescente",
          text: 'consapevole del Gioco della Matrice, appassionata di psicologia umana e delle religioni create dagli uomini, alla ricerca del suo SÉ Superiore.',
        },
        { lead: 'Un emisfero sinistro ben allenato', text: 'Dottore commercialista in libera professione dal 1993 al 2013.' },
        {
          lead: 'Un emisfero destro pienamente dispiegato',
          text: 'Medium chiaroveggente e chiarudente in contatto con numerosi mondi paralleli.',
        },
      ],
    },
    activities: {
      heading: 'Attività attuali',
      items: [
        {
          title: 'Coach e consulente',
          text: 'Creazione e conduzione di ritiri psico-spirituali di Risveglio da oltre 20 anni. Canalizzazione di vari Maestri.',
        },
        { title: 'Consulti medianici', text: 'Dal 2013.' },
        { title: 'Conferenziera', text: 'Argomenti vari in Francia e tramite Zoom o associazioni.' },
        {
          title: 'Creatrice di un insegnamento iniziatico',
          text: 'COSTRUIRE LA TUA NAVE MULTIDIMENSIONALE — oltre 950 persone formate dal 2013.',
        },
        {
          title: 'Organizzatrice',
          text: 'Seminari Iniziatici al Monte Shasta dal 2014 al 2019 e Incontri Internazionali con la Rete TELOS Mondiale.',
        },
        {
          title: 'Specialista',
          text: 'Del viaggio astrale e dei contatti con diversi popoli intra ed extraterrestri dal 2003.',
        },
      ],
    },
    news: {
      heading: 'Novità',
      items: [
        "Dal 2024 — Creazione di ritiri sulla multidimensionalità dell'Essere.",
        '2025 / 2026 — Monte Shasta. Visita al nuovo TELOS dopo l’invasione del 2021, confermata in seguito al mio incontro con Elena Danaan ad agosto 2024 e 2025.',
        '2026 — Monte Bugarach. Contatti con ET Guardiani. Missione in corso.',
        'Vari libri in fase di scrittura.',
      ],
    },
    clients: {
      heading: 'Una clientela variegata',
      text: 'Psicologi, medici vari, una neuropsichiatra infantile, infermiere, osteopati, naturopati, kinesiologi, un farmacista, una direttrice di casa di riposo, numerosi terapeuti energetici, artisti vari, ispettori e controllori delle Imposte, un architetto, un ufficiale giudiziario… e tanti altri.',
    },
    dvd: {
      heading: 'Stampa e DVD',
      body: 'Christine compare nel documentario «Les Acteurs de la Vie» di Peter Müller e Angélique Piro (2017), che dà voce a chi vede il mondo in modo diverso.',
      posterAlt: 'Locandina del film «Les Acteurs de la Vie»',
      trailerTitle: 'Trailer — Les Acteurs de la Vie',
    },
  },
};
