/**
 * Pages légales (mentions, cookies, confidentialité) dans les autres langues.
 * Le français reste dans les pages elles-mêmes et fait foi. `{B}` = préfixe `base`.
 */
import { base } from './site';
import { lang, type Lang } from './i18n';

type Page = 'mentions' | 'cookies' | 'confidentialite';
const MAIL = '<a href="mailto:cc.christinecal@gmail.com">cc.christinecal@gmail.com</a>';
const ADDR = '254 Chemin de la Terre Pointue — Castelgirou — 24 580 PLAZAC, France';

const T: Record<Exclude<Lang, 'fr'>, Record<Page, string>> = {
  en: {
    mentions: `
<p><em>Translation provided for information; the French version is legally binding.</em></p>
<h2>Website publisher</h2>
<p><strong>EURL CHRISTINE CAL COACH CONSULTANT</strong><br />Coach in Awakening to the Multidimensionality of Being.<br />${ADDR}.<br />Phone: <a href="tel:+33680428591">+33 6 80 42 85 91</a><br />E-mail: ${MAIL}<br />SIRET: 393 691 993 00033.</p>
<p><strong>Publication director:</strong> Christine CAL.</p>
<h2>Design and development</h2>
<p>Website designed and built by <strong><a href="https://studio-margerit.fr" target="_blank" rel="noopener">Studio Margerit</a></strong>.</p>
<h2>Hosting</h2>
<p>The website is hosted by <strong>OVH SAS</strong>, 2 rue Kellermann, 59100 Roubaix, France — <a href="https://www.ovhcloud.com" rel="noopener">ovhcloud.com</a>.</p>
<h2>Intellectual property</h2>
<p>All content on this website (texts, photographs, videos, teachings, graphic elements) is the exclusive property of Christine CAL or of their respective authors and is protected by the French Intellectual Property Code (art. L.111-1 and L.335-2 et seq.).</p>
<p>Any reproduction, representation, distribution or use, in whole or in part, without prior written permission is prohibited and constitutes an infringement punishable by law. Photographs of Christine CAL may not be downloaded, saved or reused.</p>
<h2>Personal data &amp; cookies</h2>
<p>How your data is handled is described in the <a href="{B}/politique-de-confidentialite/">privacy policy</a>, and the use of cookies in the <a href="{B}/cookies/">cookie policy</a>.</p>`,
    cookies: `
<p><em>Translation provided for information; the French version is legally binding.</em></p>
<h2>No tracking cookies</h2>
<p>This website is deliberately simple: it sets <strong>no advertising, tracking or audience-measurement cookies</strong>. No consent is therefore required to browse it, and you are not followed from one page to the next.</p>
<h2>YouTube videos</h2>
<p>Videos only load <strong>when you click</strong> the play button. Until you start a video, no YouTube cookie is set. When you click, the video is served in privacy-enhanced mode (<em>youtube-nocookie.com</em>); YouTube/Google may then set its own cookies, subject to <a href="https://policies.google.com/privacy" rel="noopener">Google's privacy policy</a>.</p>
<h2>Technical cookies</h2>
<p>No cookie is needed for the website to work. Your browser may store display preferences locally; this information stays on your device and is never sent to us.</p>
<h2>Learn more</h2>
<p>How your data is handled is described in the <a href="{B}/politique-de-confidentialite/">privacy policy</a>.</p>`,
    confidentialite: `
<p><em>Translation provided for information; the French version is legally binding.</em></p>
<h2>Data controller</h2>
<p>Data collected on this website is processed by <strong>EURL CHRISTINE CAL COACH CONSULTANT</strong>, ${ADDR} — ${MAIL}.</p>
<h2>Data collected and purpose</h2>
<p>This is a showcase website: it creates no accounts and collects no data without your knowledge. Only the information you choose to send through the contact form or by e-mail (name, e-mail address, content of your message) is processed, for the sole purpose of <strong>answering your request</strong>.</p>
<p>Legal basis: your <strong>consent</strong> and the legitimate interest in answering your request (art. 6 GDPR — EU Regulation 2016/679).</p>
<h2>Recipients &amp; retention</h2>
<p>Your data is <strong>never sold, transferred or passed on</strong> to third parties for commercial purposes. It is kept for as long as needed to handle your request, then deleted (at the latest 3 years after the last contact).</p>
<h2>Your rights</h2>
<p>Under the GDPR and the French “Informatique et Libertés” Act (Law 78-17 of 6 January 1978), you have the following rights:</p>
<ul><li>right of access and information;</li><li>right to rectification;</li><li>right to erasure (“right to be forgotten”);</li><li>right to restriction of processing;</li><li>right to object;</li><li>right to data portability;</li><li>right to set instructions regarding your data after death.</li></ul>
<p>To exercise these rights, write to ${MAIL}. If you encounter any difficulty, you may lodge a complaint with the <strong>CNIL</strong> (3 place de Fontenoy, 75007 Paris, France — <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>
<h2>Cookies</h2>
<p>The use of cookies is detailed in the <a href="{B}/cookies/">cookie policy</a>.</p>`,
  },
  es: {
    mentions: `
<p><em>Traducción a título informativo; solo la versión francesa tiene valor legal.</em></p>
<h2>Editor del sitio</h2>
<p><strong>EURL CHRISTINE CAL COACH CONSULTANT</strong><br />Coach de Despertar a la Multidimensionalidad del Ser.<br />${ADDR}.<br />Teléfono: <a href="tel:+33680428591">+33 6 80 42 85 91</a><br />Correo electrónico: ${MAIL}<br />SIRET: 393 691 993 00033.</p>
<p><strong>Directora de la publicación:</strong> Christine CAL.</p>
<h2>Diseño y realización</h2>
<p>Sitio diseñado y realizado por <strong><a href="https://studio-margerit.fr" target="_blank" rel="noopener">Studio Margerit</a></strong>.</p>
<h2>Alojamiento</h2>
<p>El sitio está alojado por <strong>OVH SAS</strong>, 2 rue Kellermann, 59100 Roubaix, Francia — <a href="https://www.ovhcloud.com" rel="noopener">ovhcloud.com</a>.</p>
<h2>Propiedad intelectual</h2>
<p>Todos los contenidos del sitio (textos, fotografías, vídeos, enseñanzas, elementos gráficos) son propiedad exclusiva de Christine CAL o de sus respectivos autores y están protegidos por el Código francés de la propiedad intelectual (art. L.111-1 y L.335-2 y siguientes).</p>
<p>Queda prohibida toda reproducción, representación, difusión o explotación, total o parcial, sin autorización previa por escrito, que constituiría una falsificación sancionada por la ley. Las fotografías de Christine CAL no pueden descargarse, guardarse ni reutilizarse.</p>
<h2>Datos personales y cookies</h2>
<p>El tratamiento de sus datos se describe en la <a href="{B}/politique-de-confidentialite/">política de privacidad</a>, y el uso de cookies en la <a href="{B}/cookies/">política de cookies</a>.</p>`,
    cookies: `
<p><em>Traducción a título informativo; solo la versión francesa tiene valor legal.</em></p>
<h2>Ninguna cookie de seguimiento</h2>
<p>Este sitio es deliberadamente sobrio: no instala <strong>ninguna cookie</strong> publicitaria, de seguimiento ni de medición de audiencia. Por lo tanto, no se requiere ningún consentimiento para consultarlo, y nadie le sigue de una página a otra.</p>
<h2>Vídeos de YouTube</h2>
<p>Los vídeos solo se cargan <strong>en el momento en que hace clic</strong> en el botón de reproducción. Mientras no inicie un vídeo, no se instala ninguna cookie de YouTube. Al hacer clic, el vídeo se sirve en el modo de privacidad mejorada (<em>youtube-nocookie.com</em>); YouTube/Google puede entonces instalar sus propias cookies, sujetas a <a href="https://policies.google.com/privacy" rel="noopener">la política de Google</a>.</p>
<h2>Cookies técnicas</h2>
<p>Ninguna cookie es necesaria para el funcionamiento del sitio. Su navegador puede conservar localmente preferencias de visualización; esta información permanece en su dispositivo y nunca se nos transmite.</p>
<h2>Más información</h2>
<p>El tratamiento de sus datos se describe en la <a href="{B}/politique-de-confidentialite/">política de privacidad</a>.</p>`,
    confidentialite: `
<p><em>Traducción a título informativo; solo la versión francesa tiene valor legal.</em></p>
<h2>Responsable del tratamiento</h2>
<p>Los datos recogidos en este sitio son tratados por <strong>EURL CHRISTINE CAL COACH CONSULTANT</strong>, ${ADDR} — ${MAIL}.</p>
<h2>Datos recogidos y finalidad</h2>
<p>Es un sitio de presentación: no crea cuentas ni recoge ningún dato sin que usted lo sepa. Solo se tratan los datos que usted transmite voluntariamente mediante el formulario de contacto o por correo electrónico (nombre, dirección de correo, contenido de su mensaje), con el único fin de <strong>responder a su solicitud</strong>.</p>
<p>Base legal: su <strong>consentimiento</strong> y el interés legítimo en responder a su solicitud (art. 6 del RGPD — Reglamento UE 2016/679).</p>
<h2>Destinatarios y conservación</h2>
<p>Sus datos <strong>no se venden, ni se ceden, ni se transmiten</strong> a terceros con fines comerciales. Se conservan el tiempo necesario para tratar su solicitud y luego se eliminan (a más tardar 3 años después del último contacto).</p>
<h2>Sus derechos</h2>
<p>De conformidad con el RGPD y la ley francesa «Informatique et Libertés» (ley 78-17 del 6 de enero de 1978), usted dispone de los siguientes derechos:</p>
<ul><li>derecho de acceso e información;</li><li>derecho de rectificación;</li><li>derecho de supresión («derecho al olvido»);</li><li>derecho a la limitación del tratamiento;</li><li>derecho de oposición;</li><li>derecho a la portabilidad de sus datos;</li><li>derecho a establecer directrices post mortem.</li></ul>
<p>Para ejercer estos derechos, escriba a ${MAIL}. En caso de dificultad, puede presentar una reclamación ante la <strong>CNIL</strong> (3 place de Fontenoy, 75007 París, Francia — <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>
<h2>Cookies</h2>
<p>El uso de cookies se detalla en la <a href="{B}/cookies/">política de cookies</a>.</p>`,
  },
  it: {
    mentions: `
<p><em>Traduzione a titolo informativo; fa fede la versione francese.</em></p>
<h2>Editore del sito</h2>
<p><strong>EURL CHRISTINE CAL COACH CONSULTANT</strong><br />Coach del Risveglio alla Multidimensionalità dell'Essere.<br />${ADDR}.<br />Telefono: <a href="tel:+33680428591">+33 6 80 42 85 91</a><br />E-mail: ${MAIL}<br />SIRET: 393 691 993 00033.</p>
<p><strong>Direttrice della pubblicazione:</strong> Christine CAL.</p>
<h2>Progettazione e realizzazione</h2>
<p>Sito progettato e realizzato da <strong><a href="https://studio-margerit.fr" target="_blank" rel="noopener">Studio Margerit</a></strong>.</p>
<h2>Hosting</h2>
<p>Il sito è ospitato da <strong>OVH SAS</strong>, 2 rue Kellermann, 59100 Roubaix, Francia — <a href="https://www.ovhcloud.com" rel="noopener">ovhcloud.com</a>.</p>
<h2>Proprietà intellettuale</h2>
<p>Tutti i contenuti del sito (testi, fotografie, video, insegnamenti, elementi grafici) sono di proprietà esclusiva di Christine CAL o dei rispettivi autori e sono tutelati dal Codice francese della proprietà intellettuale (art. L.111-1 e L.335-2 e seguenti).</p>
<p>Qualsiasi riproduzione, rappresentazione, diffusione o utilizzo, totale o parziale, senza previa autorizzazione scritta è vietato e costituisce una contraffazione punita dalla legge. Le fotografie di Christine CAL non possono essere scaricate, salvate o riutilizzate.</p>
<h2>Dati personali e cookie</h2>
<p>Il trattamento dei vostri dati è descritto nell'<a href="{B}/politique-de-confidentialite/">informativa sulla privacy</a>, e l'uso dei cookie nella <a href="{B}/cookies/">cookie policy</a>.</p>`,
    cookies: `
<p><em>Traduzione a titolo informativo; fa fede la versione francese.</em></p>
<h2>Nessun cookie di tracciamento</h2>
<p>Questo sito è volutamente essenziale: non installa <strong>alcun cookie</strong> pubblicitario, di tracciamento o di misurazione dell'audience. Non è quindi richiesto alcun consenso per consultarlo, e nessuno vi segue da una pagina all'altra.</p>
<h2>Video YouTube</h2>
<p>I video si caricano <strong>solo nel momento in cui cliccate</strong> sul pulsante di riproduzione. Finché non avviate un video, non viene installato alcun cookie di YouTube. Al clic, il video viene fornito in modalità di privacy avanzata (<em>youtube-nocookie.com</em>); YouTube/Google può allora installare i propri cookie, soggetti alla <a href="https://policies.google.com/privacy" rel="noopener">politica di Google</a>.</p>
<h2>Cookie tecnici</h2>
<p>Nessun cookie è necessario al funzionamento del sito. Il vostro browser può conservare localmente delle preferenze di visualizzazione; queste informazioni restano sul vostro dispositivo e non ci vengono mai trasmesse.</p>
<h2>Per saperne di più</h2>
<p>Il trattamento dei vostri dati è descritto nell'<a href="{B}/politique-de-confidentialite/">informativa sulla privacy</a>.</p>`,
    confidentialite: `
<p><em>Traduzione a titolo informativo; fa fede la versione francese.</em></p>
<h2>Titolare del trattamento</h2>
<p>I dati raccolti su questo sito sono trattati da <strong>EURL CHRISTINE CAL COACH CONSULTANT</strong>, ${ADDR} — ${MAIL}.</p>
<h2>Dati raccolti e finalità</h2>
<p>È un sito vetrina: non crea account e non raccoglie alcun dato a vostra insaputa. Vengono trattate solo le informazioni che trasmettete volontariamente tramite il modulo di contatto o per e-mail (nome, indirizzo e-mail, contenuto del messaggio), al solo scopo di <strong>rispondere alla vostra richiesta</strong>.</p>
<p>Base giuridica: il vostro <strong>consenso</strong> e il legittimo interesse a rispondere alla vostra richiesta (art. 6 del GDPR — Regolamento UE 2016/679).</p>
<h2>Destinatari e conservazione</h2>
<p>I vostri dati <strong>non sono né venduti, né ceduti, né trasmessi</strong> a terzi per fini commerciali. Sono conservati per il tempo necessario a gestire la vostra richiesta, poi cancellati (al più tardi 3 anni dopo l'ultimo contatto).</p>
<h2>I vostri diritti</h2>
<p>Ai sensi del GDPR e della legge francese «Informatique et Libertés» (legge 78-17 del 6 gennaio 1978), disponete dei seguenti diritti:</p>
<ul><li>diritto di accesso e di informazione;</li><li>diritto di rettifica;</li><li>diritto alla cancellazione («diritto all'oblio»);</li><li>diritto di limitazione del trattamento;</li><li>diritto di opposizione;</li><li>diritto alla portabilità dei dati;</li><li>diritto di definire direttive post mortem.</li></ul>
<p>Per esercitare questi diritti, scrivete a ${MAIL}. In caso di difficoltà, potete presentare un reclamo alla <strong>CNIL</strong> (3 place de Fontenoy, 75007 Parigi, Francia — <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>
<h2>Cookie</h2>
<p>L'uso dei cookie è descritto nella <a href="{B}/cookies/">cookie policy</a>.</p>`,
  },
  pl: {
    mentions: `
<p><em>Tłumaczenie ma charakter informacyjny; wiążąca jest wersja francuska.</em></p>
<h2>Wydawca strony</h2>
<p><strong>EURL CHRISTINE CAL COACH CONSULTANT</strong><br />Coach Przebudzenia do Wielowymiarowości Istoty.<br />${ADDR}.<br />Telefon: <a href="tel:+33680428591">+33 6 80 42 85 91</a><br />E-mail: ${MAIL}<br />SIRET: 393 691 993 00033.</p>
<p><strong>Dyrektor publikacji:</strong> Christine CAL.</p>
<h2>Projekt i wykonanie</h2>
<p>Strona zaprojektowana i wykonana przez <strong><a href="https://studio-margerit.fr" target="_blank" rel="noopener">Studio Margerit</a></strong>.</p>
<h2>Hosting</h2>
<p>Strona jest hostowana przez <strong>OVH SAS</strong>, 2 rue Kellermann, 59100 Roubaix, Francja — <a href="https://www.ovhcloud.com" rel="noopener">ovhcloud.com</a>.</p>
<h2>Własność intelektualna</h2>
<p>Wszystkie treści strony (teksty, fotografie, filmy, nauki, elementy graficzne) są wyłączną własnością Christine CAL lub ich autorów i są chronione francuskim Kodeksem własności intelektualnej (art. L.111-1 oraz L.335-2 i nast.).</p>
<p>Wszelkie kopiowanie, przedstawianie, rozpowszechnianie lub wykorzystywanie, w całości lub w części, bez uprzedniej pisemnej zgody jest zabronione i stanowi naruszenie prawa podlegające karze. Fotografii Christine CAL nie wolno pobierać, zapisywać ani ponownie wykorzystywać.</p>
<h2>Dane osobowe i pliki cookie</h2>
<p>Przetwarzanie Twoich danych opisuje <a href="{B}/politique-de-confidentialite/">polityka prywatności</a>, a korzystanie z plików cookie — <a href="{B}/cookies/">polityka cookies</a>.</p>`,
    cookies: `
<p><em>Tłumaczenie ma charakter informacyjny; wiążąca jest wersja francuska.</em></p>
<h2>Żadnych śledzących plików cookie</h2>
<p>Ta strona jest celowo prosta: nie zapisuje <strong>żadnych plików cookie</strong> reklamowych, śledzących ani służących do pomiaru oglądalności. Dlatego do jej przeglądania nie jest wymagana żadna zgoda i nikt nie śledzi Cię między stronami.</p>
<h2>Filmy YouTube</h2>
<p>Filmy ładują się <strong>dopiero w chwili kliknięcia</strong> przycisku odtwarzania. Dopóki nie uruchomisz filmu, żaden plik cookie YouTube nie jest zapisywany. Po kliknięciu film jest wyświetlany w trybie rozszerzonej prywatności (<em>youtube-nocookie.com</em>); YouTube/Google może wtedy zapisać własne pliki cookie, zgodnie z <a href="https://policies.google.com/privacy" rel="noopener">polityką Google</a>.</p>
<h2>Techniczne pliki cookie</h2>
<p>Do działania strony nie jest potrzebny żaden plik cookie. Twoja przeglądarka może przechowywać lokalnie ustawienia wyświetlania; te informacje pozostają na Twoim urządzeniu i nigdy nie są nam przekazywane.</p>
<h2>Więcej informacji</h2>
<p>Przetwarzanie Twoich danych opisuje <a href="{B}/politique-de-confidentialite/">polityka prywatności</a>.</p>`,
    confidentialite: `
<p><em>Tłumaczenie ma charakter informacyjny; wiążąca jest wersja francuska.</em></p>
<h2>Administrator danych</h2>
<p>Dane zbierane na tej stronie przetwarza <strong>EURL CHRISTINE CAL COACH CONSULTANT</strong>, ${ADDR} — ${MAIL}.</p>
<h2>Zbierane dane i cel</h2>
<p>To strona wizytówka: nie tworzy kont i nie zbiera żadnych danych bez Twojej wiedzy. Przetwarzane są wyłącznie informacje, które dobrowolnie przekazujesz przez formularz kontaktowy lub e-mailem (imię i nazwisko, adres e-mail, treść wiadomości), wyłącznie w celu <strong>odpowiedzi na Twoje zapytanie</strong>.</p>
<p>Podstawa prawna: Twoja <strong>zgoda</strong> oraz prawnie uzasadniony interes w udzieleniu odpowiedzi (art. 6 RODO — Rozporządzenie UE 2016/679).</p>
<h2>Odbiorcy i przechowywanie</h2>
<p>Twoje dane <strong>nie są sprzedawane, odstępowane ani przekazywane</strong> osobom trzecim w celach handlowych. Są przechowywane przez czas potrzebny do obsługi zapytania, a następnie usuwane (najpóźniej 3 lata po ostatnim kontakcie).</p>
<h2>Twoje prawa</h2>
<p>Zgodnie z RODO i francuską ustawą „Informatique et Libertés” (ustawa 78-17 z 6 stycznia 1978 r.) przysługują Ci następujące prawa:</p>
<ul><li>prawo dostępu i informacji;</li><li>prawo do sprostowania;</li><li>prawo do usunięcia danych („prawo do bycia zapomnianym”);</li><li>prawo do ograniczenia przetwarzania;</li><li>prawo do sprzeciwu;</li><li>prawo do przenoszenia danych;</li><li>prawo do określenia dyspozycji na wypadek śmierci.</li></ul>
<p>Aby skorzystać z tych praw, napisz na adres ${MAIL}. W razie trudności możesz złożyć skargę do <strong>CNIL</strong> (3 place de Fontenoy, 75007 Paryż, Francja — <a href="https://www.cnil.fr" rel="noopener">cnil.fr</a>).</p>
<h2>Pliki cookie</h2>
<p>Korzystanie z plików cookie opisuje <a href="{B}/cookies/">polityka cookies</a>.</p>`,
  },
};

/** Texte d'une page légale dans la langue en cours (le français reste dans la page). */
export const legal = (page: Page) => {
  const l = lang();
  return l === 'fr' ? '' : T[l][page].replaceAll('{B}', base);
};
