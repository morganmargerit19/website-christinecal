import type { Locale } from '../utils';
// FR éditable par Christine via le CMS (/admin → « Page : Qui suis-je »).
// Le formulaire écrit ce fichier de données ; ne pas dupliquer le FR ci-dessous.
import aboutFrData from '../../data/about.fr.json';

/**
 * Contenu de la page « Qui suis-je », structuré par langue.
 * Source FR : `src/data/about.fr.json` (édité au CMS par Christine).
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
  fr: aboutFrData as AboutDict,

  en: {
    meta: {
      title: 'About me — Christine CAL',
      description:
        'The journey of Christine CAL: a chartered accountant turned clairvoyant and clairaudient medium, awakening coach, speaker, creator of an initiatory teaching.',
    },
    hero: {
      eyebrow: 'About me',
      title: 'An atypical free spirit in contact with her future selves',
    },
    epigraph:
      'She lives in several worlds at once, with the rare gift of weaving them together: the sky and the everyday, the invisible and the tangible. Feet on the Earth, eyes among the stars — a warmth that welcomes, a longing for truth that awakens. A galactic soul from the future, deeply human, who takes you by the hand to show you the light you already carry.',
    galactic: {
      heading: 'A galactic soul from a future',
      items: [
        'Having left her distant land to take part in the liberation of this magnificent planet Earth, in this galaxy so recently set free.',
        'Having reconnected her multidimensional identity by consciously reintegrating her Terrestrial fractals at this Apocalyptic end of cycle.',
        'Working with her Celestial fractals across the different Time-Lines.',
      ],
    },
    videos: {
      heading: 'Introduction videos',
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
          text: 'aware of the Matrix Game, an insatiable reader of human sciences and psychology, of religions and contemporary ideologies.',
        },
        {
          lead: 'An independent, pragmatic seeker',
          text: 'passionate about bridging science and the mystical, having experienced a reversal of consciousness, a revelation of the SELF. Stepping out of the Game through the I.',
        },
        { lead: 'A mother', text: "in contact with her daughter's Soul during pregnancy." },
        { lead: 'A well-trained left brain', text: 'Chartered accountant (C.P.A) in private practice from 1993 to 2013.' },
        {
          lead: 'A fully unfolded right brain',
          text: 'Clairvoyant and clairaudient medium in contact with many parallel worlds through astral travel and telepathy.',
        },
      ],
    },
    activities: {
      heading: 'Current activities',
      items: [
        {
          title: 'Coach & consultant',
          text: "Creating and leading Awakening retreats for over 20 years. NLP — certified by the INLPTA (International NLP Trainers Association), 1997.",
        },
        {
          title: 'Mediumship consultations',
          text: 'Individual, couples or professional coaching.',
        },
        {
          title: 'Speaker since 2013',
          text: 'Topics presented across France and via Zoom or through associations.',
          accordion: {
            summary: 'A few examples of talks (click)',
            items: [
              'The process of incarnation and de-incarnation, with personal anecdotes',
              'The journey of the Soul and the world of the Astral',
              'From the inner couple to the outer couple',
              'From the psycho-karmic couple to the cosmic couple',
              'Planetary and galactic alignments of 21/12/2012',
              'Talk and workshops on the feminine / International Symposium of Biarritz 2014',
              'Parallel worlds',
              'Extra-sensory perceptions and astral travel',
              'Shift into 5D: the countdown',
              'Apocalypse Now: revelations towards 5D',
              'Lemurian Wisdom in the service of 5D',
              'The Hollow Earth and Mount Shasta',
              'Becoming a Quantum Human — 2025',
              'The multidimensionality of Being — 2025',
              'The Unified Field of Consciousness — 2022',
              'The state of Terra: intra and extra news in 2024, likewise in 2025',
              'Forum organiser: 2025 “Experiences of other worlds” at Rennes-les-Bains, with talks',
              'The mutation of the body and of DNA — June 2026',
              'And many other topics… including numerous DVDs with DEBOWSKA Productions, to discover on the site.',
            ],
          },
        },
        {
          title: 'Organiser',
          text: 'Initiatory seminars at Mount Shasta from 2014 to 2019 and International Gatherings with the worldwide TELOS Foundation and Network.',
        },
      ],
    },
    specifics: {
      heading: 'Distinctive features',
      items: [
        'Creator of an initiatory teaching: BUILDING YOUR MULTIDIMENSIONAL VESSEL — over 950 people trained since 2013.',
        'Specialist in astral travel and in contacts with various intra- and extraterrestrial peoples through telepathy since 2003.',
        '2019 — Contact with a fractal of my Future at Mount Shasta.',
        '2021 — Contacts with another fractal from a parallel current, with physical sensations and unsettling flashes upon waking over several months. This led me to research the subject and to meet Beings who move within these worlds.',
      ],
    },
    news: {
      heading: 'News',
      items: [
        'Since 2024 — Retreats on the multidimensionality of Being.',
        '2025 / 2026 — Mount Shasta and the new TELOS, following the 2021 invasion by involutive beings, confirmed after my meeting with Elena Danaan in August 2024 and 2025. Trip to Mount Shasta in 07.2026.',
        '2026 — Mount Bugarach: contacts with Guardian ETs. Mission in progress.',
      ],
    },
    upcoming: {
      heading: 'Coming soon',
      items: [
        'YouTube: “Discovering your multidimensionality: my adventure! And you, what about yours?” — audio or video from the 2nd half of 2026.',
        'Various books currently being written.',
      ],
    },
    clients: {
      heading: 'A varied clientele',
      text: 'Psychologists, doctors, a child psychiatrist, nurses, osteopaths, naturopaths, kinesiologists, a pharmacist, a care-home director, many energy therapists, artists, tax inspectors, an architect, a bailiff… and so many others.',
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
    },
    epigraph:
      'Żyje w kilku światach naraz i ma rzadki dar ich łączenia: niebo i codzienność, to, co niewidzialne, i to, co namacalne. Stopami na Ziemi, wzrokiem wśród gwiazd — ciepło, które przyjmuje, i pragnienie prawdy, które przebudza. Galaktyczna dusza z przyszłości, głęboko ludzka, która bierze cię za rękę, by pokazać ci światło, które już w sobie nosisz.',
    galactic: {
      heading: 'Galaktyczna dusza z przyszłości',
      items: [
        'Opuściła swoją odległą krainę, aby wziąć udział w wyzwoleniu tej wspaniałej planety Ziemi, w tej galaktyce niedawno uwolnionej.',
        'Ponownie połączyła swoją wielowymiarową tożsamość, świadomie reintegrując swoje Ziemskie fraktale u kresu tego Apokaliptycznego cyklu.',
        'Działając ze swoimi Niebiańskimi fraktalami poprzez różne Linie Czasowe.',
      ],
    },
    videos: {
      heading: 'Filmy wprowadzające',
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
          text: 'świadoma Gry Matrycy, nienasycona czytelniczka nauk i psychologii człowieka, religii oraz współczesnych ideologii.',
        },
        {
          lead: 'Niezależna, pragmatyczna poszukiwaczka',
          text: 'zafascynowana zbliżeniem nauki i mistyki, która doświadczyła odwrócenia świadomości, objawienia JAŹNI. Wyjście z Gry przez JA.',
        },
        { lead: 'Mama', text: 'w kontakcie z Duszą swojej córki podczas ciąży.' },
        { lead: 'Wytrenowana lewa półkula', text: 'Biegła księgowa prowadząca własną praktykę w latach 1993–2013.' },
        {
          lead: 'Rozwinięta prawa półkula',
          text: 'Medium jasnowidzące i jasnosłyszące w kontakcie z wieloma światami równoległymi poprzez podróż astralną i telepatię.',
        },
      ],
    },
    activities: {
      heading: 'Obecna działalność',
      items: [
        {
          title: 'Coach i konsultantka',
          text: 'Tworzenie i prowadzenie warsztatów Przebudzenia od ponad 20 lat. NLP — dyplom INLPTA (International NLP Trainers Association), 1997.',
        },
        {
          title: 'Konsultacje mediumiczne',
          text: 'Coaching indywidualny, par lub zawodowy.',
        },
        {
          title: 'Prelegentka od 2013 roku',
          text: 'Tematy prezentowane we Francji oraz przez Zoom lub we współpracy ze stowarzyszeniami.',
          accordion: {
            summary: 'Kilka przykładowych wykładów (kliknij)',
            items: [
              'Proces wcielenia i odcielenia wraz z osobistymi anegdotami',
              'Podróż Duszy i świat Astralu',
              'Od pary wewnętrznej do pary zewnętrznej',
              'Od pary psycho-karmicznej do pary kosmicznej',
              'Wyrównania planetarne i galaktyczne z 21.12.2012',
              'Wykład i warsztaty o pierwiastku żeńskim / Międzynarodowe Sympozjum w Biarritz 2014',
              'Światy równoległe',
              'Percepcje pozazmysłowe i podróż astralna',
              'Przejście do 5D: odliczanie',
              'Apocalypse Now: objawienia ku 5D',
              'Mądrość Lemurii w służbie 5D',
              'Pusta Ziemia i Mount Shasta',
              'Stać się Kwantowym Człowiekiem — 2025',
              'Wielowymiarowość Istoty — 2025',
              'Zjednoczone Pole Świadomości — 2022',
              'Stan Terry: wiadomości wewnętrzne i zewnętrzne w 2024, podobnie w 2025',
              'Organizatorka Forów: 2025 „Doświadczenia innych światów” w Rennes-les-Bains wraz z wystąpieniami',
              'Mutacja ciał i DNA — czerwiec 2026',
              'I wiele innych tematów… w tym liczne DVD u DEBOWSKA Productions do odkrycia na stronie.',
            ],
          },
        },
        {
          title: 'Organizatorka',
          text: 'Seminaria inicjacyjne na Mount Shasta w latach 2014–2019 oraz Międzynarodowe Spotkania z Fundacją i światową Siecią TELOS.',
        },
      ],
    },
    specifics: {
      heading: 'Cechy szczególne',
      items: [
        'Twórczyni inicjacyjnego nauczania: ZBUDUJ SWÓJ WIELOWYMIAROWY STATEK — ponad 950 przeszkolonych osób od 2013 roku.',
        'Specjalistka w podróżach astralnych i kontaktach z różnymi ludami wewnątrz- i pozaziemskimi poprzez telepatię od 2003 roku.',
        '2019 — Kontakt z fraktalem mojej Przyszłości na Mount Shasta.',
        '2021 — Kontakty z innym fraktalem z równoległego nurtu, z fizycznymi odczuciami i niepokojącymi przebłyskami po przebudzeniu przez wiele miesięcy. To skłoniło mnie do zgłębiania tematu i spotkania Istot, które obcują z tymi światami.',
      ],
    },
    news: {
      heading: 'Aktualności',
      items: [
        'Od 2024 — Warsztaty o wielowymiarowości Istoty.',
        '2025 / 2026 — Mount Shasta i nowy TELOS, po inwazji istot inwolucyjnych w 2021 roku, potwierdzonej po moim spotkaniu z Eleną Danaan w sierpniu 2024 i 2025. Wyjazd na Mount Shasta w 07.2026.',
        '2026 — Góra Bugarach: kontakty ze Strażnikami ET. Misja w toku.',
      ],
    },
    upcoming: {
      heading: 'Wkrótce',
      items: [
        'YouTube: „Odkryć swoją wielowymiarowość: moja przygoda! A wy, jaka jest wasza?” — audio lub wideo od 2. połowy 2026 roku.',
        'Różne książki w trakcie pisania.',
      ],
    },
    clients: {
      heading: 'Różnorodna klientela',
      text: 'Psychologowie, lekarze, psychiatra dziecięcy, pielęgniarki, osteopaci, naturopaci, kinezjolodzy, farmaceuta, dyrektorka domu opieki, liczni terapeuci energetyczni, artyści, inspektorzy podatkowi, architekt, komornik… i wielu innych.',
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
    },
    epigraph:
      'Vive en varios mundos a la vez, con el raro don de entrelazarlos: el cielo y lo cotidiano, lo invisible y lo tangible. Los pies en la Tierra, la mirada entre las estrellas — una calidez que acoge, una exigencia de verdad que despierta. Una galáctica venida del futuro, profundamente humana, que te toma de la mano para mostrarte la luz que ya llevas dentro.',
    galactic: {
      heading: 'Un alma galáctica venida de un futuro',
      items: [
        'Habiendo dejado su lejana tierra para participar en la liberación de este magnífico planeta Tierra, en esta galaxia recientemente liberada.',
        'Habiendo reconectado su identidad multidimensional reintegrando conscientemente sus fractales Terrestres en este fin de ciclo Apocalíptico.',
        'Obrando con sus fractales Celestes a través de las diferentes Líneas Temporales.',
      ],
    },
    videos: {
      heading: 'Vídeos de presentación',
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
          text: 'consciente del Juego de la Matrix, lectora insaciable de ciencias y psicología humanas, de religiones e ideologías contemporáneas.',
        },
        {
          lead: 'Una buscadora pragmática e independiente',
          text: 'apasionada por el acercamiento entre la ciencia y lo místico, habiendo experimentado un vuelco de conciencia, una revelación del SER. Salir del Juego por el YO.',
        },
        { lead: 'Una madre', text: 'en contacto con el Alma de su hija durante el embarazo.' },
        { lead: 'Un hemisferio izquierdo bien entrenado', text: 'Censora jurada de cuentas en ejercicio libre de 1993 a 2013.' },
        {
          lead: 'Un hemisferio derecho plenamente desplegado',
          text: 'Médium clarividente y clariaudiente en contacto con numerosos mundos paralelos a través del viaje astral y la telepatía.',
        },
      ],
    },
    activities: {
      heading: 'Actividades actuales',
      items: [
        {
          title: 'Coach y consultora',
          text: 'Creación y dirección de retiros de Despertar desde hace más de 20 años. PNL — diplomada por la INLPTA (International NLP Trainers Association), 1997.',
        },
        {
          title: 'Consultas mediúmnicas',
          text: 'Coaching individual, de pareja o profesional.',
        },
        {
          title: 'Conferenciante desde 2013',
          text: 'Temas presentados en Francia y a través de Zoom o de asociaciones.',
          accordion: {
            summary: 'Algunos ejemplos de conferencias (haz clic)',
            items: [
              'Proceso de encarnación y desencarnación con anécdotas personales',
              'El viaje del Alma y el mundo del Astral',
              'De la pareja interior a la pareja exterior',
              'De la pareja psico-kármica a la pareja cósmica',
              'Alineaciones planetarias y galácticas del 21/12/2012',
              'Conferencia y talleres sobre lo femenino / Simposio Internacional de Biarritz 2014',
              'Los mundos paralelos',
              'Percepciones extrasensoriales y viaje astral',
              'Paso a la 5D: cuenta atrás',
              'Apocalypse Now: revelaciones hacia la 5D',
              'La Sabiduría Lemuriana al servicio de la 5D',
              'La Tierra Hueca y el Monte Shasta',
              'Convertirse en un Humano Cuántico — 2025',
              'La multidimensionalidad del Ser — 2025',
              'El Campo Unificado de la Conciencia — 2022',
              'El estado de Terra: actualidad intra y extra en 2024, ídem en 2025',
              'Organizadora de Foros: 2025 «Experiencias de otros mundos» en Rennes-les-Bains, con intervenciones',
              'La mutación de los cuerpos y del ADN — junio de 2026',
              'Y muchos otros temas… incluidos numerosos DVD en DEBOWSKA Productions, por descubrir en el sitio.',
            ],
          },
        },
        {
          title: 'Organizadora',
          text: 'Seminarios iniciáticos en el Monte Shasta de 2014 a 2019 y Encuentros Internacionales con la Fundación y la Red TELOS Mundial.',
        },
      ],
    },
    specifics: {
      heading: 'Particularidades',
      items: [
        'Creadora de una enseñanza iniciática: CONSTRUIR TU NAVE MULTIDIMENSIONAL — más de 950 personas formadas desde 2013.',
        'Especialista en el viaje astral y en los contactos con diversos pueblos intra y extraterrestres por telepatía desde 2003.',
        '2019 — Contacto con un fractal de mi Futuro en el Monte Shasta.',
        '2021 — Contactos con otro fractal de una corriente paralela, con sensaciones físicas y destellos perturbadores al despertar durante meses. Lo que me llevó a documentarme y a encontrarme con Seres que frecuentan esos mundos.',
      ],
    },
    news: {
      heading: 'Novedades',
      items: [
        'Desde 2024 — Retiros sobre la multidimensionalidad del Ser.',
        '2025 / 2026 — Monte Shasta y el nuevo TELOS, tras la invasión por seres involutivos en 2021, confirmada a raíz de mi encuentro con Elena Danaan en agosto de 2024 y 2025. Viaje al Monte Shasta en 07.2026.',
        '2026 — Monte Bugarach: contactos con ET Guardianes. Misión en curso.',
      ],
    },
    upcoming: {
      heading: 'Próximamente',
      items: [
        'YouTube: «Descubrir tu multidimensionalidad: ¡mi aventura! Y vosotros, ¿la vuestra?» — audios o vídeos a partir del 2.º semestre de 2026.',
        'Diversos libros en proceso de escritura.',
      ],
    },
    clients: {
      heading: 'Una clientela variada',
      text: 'Psicólogos, médicos diversos, una psiquiatra infantil, enfermeras, osteópatas, naturópatas, kinesiólogos, un farmacéutico, una directora de residencia de ancianos, numerosos terapeutas energéticos, artistas diversos, inspectores y controladores de Hacienda, un arquitecto, un agente judicial… y tantos otros.',
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
    },
    epigraph:
      'Vive in più mondi alla volta, con il raro dono di intrecciarli: il cielo e il quotidiano, l’invisibile e il concreto. I piedi sulla Terra, lo sguardo tra le stelle — un calore che accoglie, un’esigenza di verità che risveglia. Un’anima galattica venuta dal futuro, profondamente umana, che ti prende per mano per mostrarti la luce che già porti dentro.',
    galactic: {
      heading: "Un'anima galattica venuta da un futuro",
      items: [
        'Avendo lasciato la sua lontana contrada per partecipare alla liberazione di questo magnifico pianeta Terra, in questa galassia da poco liberata.',
        'Avendo riconnesso la sua identità multidimensionale reintegrando consapevolmente le sue frattali Terrestri in questa fine di ciclo Apocalittica.',
        'Operando con le sue frattali Celesti attraverso le diverse Linee Temporali.',
      ],
    },
    videos: {
      heading: 'Video di presentazione',
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
          text: 'consapevole del Gioco della Matrice, lettrice insaziabile di scienze e psicologia umane, di religioni e ideologie contemporanee.',
        },
        {
          lead: 'Una ricercatrice pragmatica e indipendente',
          text: 'appassionata dal ravvicinamento tra la scienza e il mistico, avendo sperimentato un ribaltamento di coscienza, una rivelazione del SÉ. Uscire dal Gioco attraverso l’IO.',
        },
        { lead: 'Una mamma', text: "in contatto con l'Anima di sua figlia durante la gravidanza." },
        { lead: 'Un emisfero sinistro ben allenato', text: 'Dottore commercialista in libera professione dal 1993 al 2013.' },
        {
          lead: 'Un emisfero destro pienamente dispiegato',
          text: 'Medium chiaroveggente e chiarudente in contatto con numerosi mondi paralleli attraverso il viaggio astrale e la telepatia.',
        },
      ],
    },
    activities: {
      heading: 'Attività attuali',
      items: [
        {
          title: 'Coach e consulente',
          text: 'Creazione e conduzione di ritiri di Risveglio da oltre 20 anni. PNL — diplomata presso l’INLPTA (International NLP Trainers Association), 1997.',
        },
        {
          title: 'Consulti medianici',
          text: 'Coaching individuale, di coppia o professionale.',
        },
        {
          title: 'Conferenziera dal 2013',
          text: 'Argomenti presentati in Francia e tramite Zoom o associazioni.',
          accordion: {
            summary: 'Alcuni esempi di conferenze (clicca)',
            items: [
              'Processo di incarnazione e disincarnazione con aneddoti personali',
              "Il viaggio dell'Anima e il mondo dell'Astrale",
              'Dalla coppia interiore alla coppia esteriore',
              'Dalla coppia psico-karmica alla coppia cosmica',
              'Allineamenti planetari e galattici del 21/12/2012',
              'Conferenza e laboratori sul femminile / Simposio Internazionale di Biarritz 2014',
              'I mondi paralleli',
              'Percezioni extrasensoriali e viaggio astrale',
              'Passaggio alla 5D: conto alla rovescia',
              'Apocalypse Now: rivelazioni verso la 5D',
              'La Saggezza Lemuriana al servizio della 5D',
              'La Terra Cava e il Monte Shasta',
              'Diventare un Umano Quantico — 2025',
              "La multidimensionalità dell'Essere — 2025",
              'Il Campo Unificato della Coscienza — 2022',
              'Lo stato di Terra: attualità intra ed extra nel 2024, idem nel 2025',
              'Organizzatrice di Forum: 2025 «Esperienze di altri mondi» a Rennes-les-Bains, con interventi',
              'La mutazione dei corpi e del DNA — giugno 2026',
              "E molti altri argomenti… tra cui numerosi DVD presso DEBOWSKA Productions da scoprire nel sito.",
            ],
          },
        },
        {
          title: 'Organizzatrice',
          text: 'Seminari Iniziatici al Monte Shasta dal 2014 al 2019 e Incontri Internazionali con la Fondazione e la Rete TELOS Mondiale.',
        },
      ],
    },
    specifics: {
      heading: 'Specificità',
      items: [
        'Creatrice di un insegnamento iniziatico: COSTRUIRE LA TUA NAVE MULTIDIMENSIONALE — oltre 950 persone formate dal 2013.',
        'Specialista del viaggio astrale e dei contatti con diversi popoli intra ed extraterrestri tramite telepatia dal 2003.',
        '2019 — Contatto con una frattale del mio Futuro sul Monte Shasta.',
        '2021 — Contatti con un’altra frattale di una corrente parallela, con sensazioni fisiche e flash sconcertanti al risveglio per diversi mesi. Il che mi ha portata a documentarmi e a incontrare Esseri che frequentano questi mondi.',
      ],
    },
    news: {
      heading: 'Novità',
      items: [
        "Dal 2024 — Ritiri sulla multidimensionalità dell'Essere.",
        '2025 / 2026 — Monte Shasta e il nuovo TELOS, dopo l’invasione da parte di esseri involutivi nel 2021, confermata in seguito al mio incontro con Elena Danaan ad agosto 2024 e 2025. Viaggio al Monte Shasta nel 07.2026.',
        '2026 — Monte Bugarach: contatti con ET Guardiani. Missione in corso.',
      ],
    },
    upcoming: {
      heading: 'In arrivo',
      items: [
        'YouTube: «Scoprire la propria multidimensionalità: la mia avventura! E voi, la vostra?» — audio o video a partire dal 2° semestre 2026.',
        'Vari libri in fase di scrittura.',
      ],
    },
    clients: {
      heading: 'Una clientela variegata',
      text: 'Psicologi, medici vari, una neuropsichiatra infantile, infermiere, osteopati, naturopati, kinesiologi, un farmacista, una direttrice di casa di riposo, numerosi terapeuti energetici, artisti vari, ispettori e controllori delle Imposte, un architetto, un ufficiale giudiziario… e tanti altri.',
    },
  },
};
