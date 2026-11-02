/**
 * Traductions automatiques du nouveau site (EN, ES, IT, PL).
 *
 * Christine écrit en français dans Mon espace. À chaque mise en ligne, ce script
 * repère les textes français modifiés depuis leur dernière traduction et les fait
 * traduire par Claude, puis écrit :
 *  - src/content/fiches/<langue>/<slug>.mdx  (stages, ateliers…)
 *  - src/data/<page>.<langue>.json           (Qui suis-je, Mission, Éveil à Soi / au Soi)
 *  - src/data/videos.<langue>.json           (titres des thèmes et des vidéos ajoutées)
 *  - src/data/infos.<langue>.json            (l'annonce en haut des pages)
 * Chaque traduction garde l'empreinte du français dont elle vient (`sourceHash`,
 * `_source`) : un texte inchangé n'est jamais retraduit. Dates, lieux, tarifs, photos
 * et vidéos ne passent pas par ici (le site les reprend du français).
 *
 *   node scripts/traduire.mjs            traduit ce qui a changé (ANTHROPIC_API_KEY)
 *   node scripts/traduire.mjs --marquer  marque les traductions actuelles comme à jour
 *   node scripts/traduire.mjs --verifier liste ce qui serait traduit, sans rien appeler
 *
 * Sans clé, ou si un appel échoue, le site se construit avec les traductions
 * existantes (un texte jamais traduit s'affiche en français) : rien ne bloque.
 */
import Anthropic from '@anthropic-ai/sdk';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import YAML from 'yaml';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FICHES = path.join(ROOT, 'src/content/fiches');
const DATA = path.join(ROOT, 'src/data');
const LANGS = { en: 'English', es: 'Spanish (Spain)', it: 'Italian', pl: 'Polish' };
const MODE = process.argv.includes('--marquer') ? 'marquer' : process.argv.includes('--verifier') ? 'verifier' : 'traduire';
const MODEL = 'claude-opus-5-5';
const PARALLEL = 4;

const hash = (o) => crypto.createHash('sha256').update(JSON.stringify(o)).digest('hex').slice(0, 16);
const readJson = (p) => (fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null);
const writeJson = (p, o) => fs.writeFileSync(p, JSON.stringify(o, null, 2) + '\n');
const empty = (v) => v === undefined || v === '' || (Array.isArray(v) ? v.length === 0 : v !== null && typeof v === 'object' && Object.keys(v).length === 0);
const prune = (o) => Object.fromEntries(Object.entries(o).filter(([, v]) => !empty(v)));

// ------------------------------------------------------------------ Consignes de traduction
const SYSTEM = `You translate the website of Christine CAL, a French spiritual coach and medium ("Coach d'Éveil à la Multidimensionnalité de l'Être"): workshops, Soul readings, Mount Shasta / TELOS, galactic memory, the 5D School. Translate faithfully and warmly, keeping her voice, her capitalised words (Âme, SOI, Être…) and her emphasis. Natural, fluent prose in the target language, never word-for-word.

Register: English neutral; Spanish formal "usted"; Italian plural "voi"; Polish informal "Ty".

Glossary (always use these):
- Éveil à Soi → Self-Awakening | Despertar a Sí | Risveglio a Sé | Przebudzenie Siebie
- Éveil au Soi → Awakening to the Self | Despertar al Sí | Risveglio al Sé | Przebudzenie do Jaźni
- École 5D → 5D School | Escuela 5D | Scuola 5D | Szkoła 5D
- Construire son Vaisseau Multidimensionnel (de l'Âme) → Building the Multidimensional Vehicle of Your Soul | Construir el Vehículo Multidimensional del Alma | Costruire il Veicolo Multidimensionale dell'Anima | Zbudować Wielowymiarowy Pojazd Duszy
- Stage → Workshop | Taller | Seminario | Warsztat ; Atelier → Workshop | Taller | Laboratorio | Warsztat ; Conférence → Talk | Conferencia | Conferenza | Wykład
- Âme → Soul | Alma | Anima | Dusza ; le SOI / le Soi → the SELF | el SÍ | il SÉ | JAŹŃ ; l'Être → the Being | el Ser | l'Essere | Istota
- Intra-Terrestres / les Intra → Inner-Earth Beings | Intraterrestres | Intraterrestri | istoty z wnętrza Ziemi ; Telosiens → Telosians | Telosianos | Telosiani | Telosianie
- Mont Shasta → Mount Shasta | Monte Shasta | Monte Shasta | Góra Shasta
- « Invitation au discernement et aux questionnements - Respect de la libre pensée » → "An invitation to discernment and questioning — Respect for free thought" | "Invitación al discernimiento y al cuestionamiento — Respeto del libre pensamiento" | "Invito al discernimento e agli interrogativi — Rispetto del libero pensiero" | "Zaproszenie do rozeznania i zadawania pytań — Szacunek dla wolnej myśli"
Keep unchanged: personal names, TELOS, AGARTHA, DEBOWSKA, Studio Margerit, "Let's go!", English phrases already in English. Book titles: keep the original title and add a short translation in parentheses when useful.

Quotation marks: English “…”, Spanish and Italian «…», Polish „…”.

Output format — this is critical:
- You receive one JSON object between <source> tags. Return ONLY the translated JSON object: same keys, same nesting, same array lengths and order, every string translated. No comments, no code fences, nothing before or after.
- Never translate keys. Leave unchanged the values of keys named "id", "meta", "en".
- Keep HTML tags and their attributes exactly (<strong class="about-accent">, <br />, <em>…). Keep Markdown syntax (##, **, _, >, lists, links) and line structure.
- MDX components (<TwoColumns>, <Column title="…">, <MediaDuo …/>, <FloatImage …/>, <CenteredText>…): keep component names, attribute names, image paths (src), braces and JavaScript syntax exactly; translate only human-readable attribute values (title, subtitle, alt, caption) and the text between tags.
- Never change URLs, image paths, numbers, years or dates written with digits. Keep "2019 — text" prefixes (year, space, em dash) at the start of list items.
- A "section" value marks where a photo or video is placed: return a short text (a heading or a few consecutive words) that appears word for word in your translated "body". If the French value looks like an identifier (lowercase-with-dashes), return the translated heading text it refers to.`;

const NOTES = {
  about: `Page-specific rules: "hero.title" must keep the phrase meaning "in contact with" (in contact / en contacto / in contatto / w kontakcie). In "specifics.items", the first item must stay "<text> — <words> 1000 <words>." with the number in digits after an em dash; an item ending with "depuis 2003." must end with "since 2003." / "desde 2003." / "dal 2003." / "od 2003 r.". The last talk in "activities.items[].accordion.items", if it starts with « Et bien d'autres », must start with "And many other" / "Y muchos otros" / "E molti altri" / "I wiele innych". "upcoming.items" keep their "Label: text" form. "news.items" keep their "date — text" form, where "Depuis 2024" becomes "Since 2024" / "Desde 2024" / "Dal 2024" / "Od 2024".`,
  mission: `Page-specific rules: in "s1Heading", drop the leading sentence « Expérience de vie d'une galactique au sol. » and the <br /> after it; translate only what follows. Keep « … » quotes in "lede" as the target language's quotation marks.`,
  'eveil-a-soi': `Page-specific rule: "intro" must keep exactly the same number of lines, each line translating the matching French line.`,
};

// ------------------------------------------------------------------ Fiches (MDX)
const splitMdx = (src) => {
  const m = src.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
  if (!m) throw new Error('front matter introuvable');
  return { fm: YAML.parse(m[1]), body: m[2] };
};

function fichePayload(fm, body) {
  const img = (i) => prune({ alt: i?.alt, caption: i?.caption });
  return prune({
    title: fm.title, kicker: fm.kicker, lede: fm.lede, cardLede: fm.cardLede, imageAlt: fm.imageAlt,
    bannerAlt: fm.bannerAlt, videosHeading: fm.videosHeading, audioTitle: fm.audioTitle,
    videos: Object.fromEntries((fm.videos ?? []).filter((v) => v.title).map((v) => [v.id, v.title])),
    inline: (fm.inlineMedia ?? []).map((m) => prune({ section: m.section, video: m.video?.title, images: (m.images ?? []).map(img) })),
    side: (fm.sideImages ?? []).map((s) => prune({ section: s.section, alt: s.alt, caption: s.caption })),
    gallery: (fm.gallery ?? []).map(img),
    bodyImage: fm.bodyImage ? img(fm.bodyImage) : undefined,
    testimonials: (fm.testimonials ?? []).map((t) => t.quote),
    body: body.trim(),
  });
}

function ficheUnits() {
  const out = [];
  for (const file of fs.readdirSync(FICHES).filter((f) => f.endsWith('.mdx') || f.endsWith('.md'))) {
    const slug = file.replace(/\.mdx?$/, '');
    const { fm, body } = splitMdx(fs.readFileSync(path.join(FICHES, file), 'utf8'));
    const payload = fichePayload(fm, body);
    out.push({
      name: `fiche ${slug}`,
      payload,
      notes: '',
      target: (l) => path.join(FICHES, l, `${slug}.mdx`),
      stored: (p) => (fs.existsSync(p) ? splitMdx(fs.readFileSync(p, 'utf8')).fm.sourceHash : undefined),
      mark: (p, h) => {
        const { fm: t, body: tb } = splitMdx(fs.readFileSync(p, 'utf8'));
        t.sourceHash = h;
        fs.writeFileSync(p, '---\n' + YAML.stringify(t, { lineWidth: 0 }) + '---\n\n' + tb.trimStart());
      },
      write: (p, l, tr, h) => {
        const d = structuredClone(fm);
        d.lang = l;
        d.sourceHash = h;
        for (const k of ['title', 'kicker', 'lede', 'cardLede', 'imageAlt', 'bannerAlt', 'videosHeading', 'audioTitle']) if (tr[k]) d[k] = tr[k];
        for (const v of d.videos ?? []) if (tr.videos?.[v.id]) v.title = tr.videos[v.id];
        (d.inlineMedia ?? []).forEach((m, i) => {
          const t = tr.inline?.[i]; if (!t) return;
          if (t.section) m.section = t.section;
          if (m.video && t.video) m.video.title = t.video;
          (m.images ?? []).forEach((im, j) => Object.assign(im, prune(t.images?.[j] ?? {})));
        });
        (d.sideImages ?? []).forEach((s, i) => Object.assign(s, prune(tr.side?.[i] ?? {})));
        (d.gallery ?? []).forEach((g, i) => Object.assign(g, prune(tr.gallery?.[i] ?? {})));
        if (d.bodyImage && tr.bodyImage) Object.assign(d.bodyImage, prune(tr.bodyImage));
        (d.testimonials ?? []).forEach((t, i) => { if (tr.testimonials?.[i]) t.quote = tr.testimonials[i]; });
        fs.mkdirSync(path.dirname(p), { recursive: true });
        fs.writeFileSync(p, '---\n' + YAML.stringify(d, { lineWidth: 0 }) + '---\n\n' + tr.body.trim() + '\n');
      },
    });
  }
  return out;
}

// ------------------------------------------------------------------ Pages, vidéos, annonce (JSON)
const KEEP = ['id', 'meta', 'en'];
const PHOTOS = ['photo', 'fond', 'bandeau'];
/** Réapplique les valeurs à ne pas traduire (id, meta, en) depuis le français. */
function restore(fr, t) {
  if (Array.isArray(fr)) return fr.map((x, i) => restore(x, t[i]));
  if (fr && typeof fr === 'object') return Object.fromEntries(Object.keys(fr).map((k) => [k, KEEP.includes(k) ? fr[k] : restore(fr[k], t[k])]));
  return t;
}

function jsonUnits() {
  const out = [];
  for (const name of ['about', 'mission', 'eveil-a-soi', 'eveil-au-soi']) {
    const fr = readJson(path.join(DATA, `${name}.fr.json`));
    const payload = structuredClone(fr);
    for (const k of PHOTOS) delete payload[k];
    if (payload.hero) delete payload.hero.photo;
    out.push(jsonUnit(name, payload, NOTES[name] ?? '', (tr) => restore(payload, tr)));
  }
  const vids = readJson(path.join(DATA, 'videos.fr.json'));
  out.push(jsonUnit('videos', prune({
    themes: Object.fromEntries(vids.themes.map((t) => [t.id, t.title])),
    videos: Object.fromEntries((vids.videos ?? []).filter((v) => v.title).map((v) => [v.id, v.title])),
  }), 'Keys of "themes" and "videos" are identifiers: keep them; translate the values (titles).', (tr) => tr));
  const infos = readJson(path.join(DATA, 'infos.json'));
  if (infos.annonce?.texte) out.push(jsonUnit('infos', { annonce: infos.annonce.texte }, 'A short announcement shown at the top of every page.', (tr) => tr));
  return out;
}

function jsonUnit(name, payload, notes, finish) {
  return {
    name: `page ${name}`, payload, notes,
    target: (l) => path.join(DATA, `${name}.${l}.json`),
    stored: (p) => readJson(p)?._source,
    mark: (p, h) => { const { _source, ...rest } = readJson(p); writeJson(p, { _source: h, ...rest }); },
    write: (p, _l, tr, h) => writeJson(p, { _source: h, ...finish(tr) }),
  };
}

// ------------------------------------------------------------------ Appel à Claude
/** Même forme que la source : mêmes clés, mêmes longueurs de listes, des textes partout où il y en avait. */
function sameShape(a, b, where = '') {
  if (typeof a === 'string') { if (typeof b !== 'string' || (a.trim() && !b.trim())) throw new Error(`texte manquant : ${where}`); return; }
  if (Array.isArray(a)) {
    if (!Array.isArray(b) || a.length !== b.length) throw new Error(`liste différente : ${where}`);
    a.forEach((x, i) => sameShape(x, b[i], `${where}[${i}]`)); return;
  }
  if (a && typeof a === 'object') {
    if (!b || typeof b !== 'object') throw new Error(`objet manquant : ${where}`);
    for (const k of Object.keys(a)) sameShape(a[k], b[k], `${where}.${k}`);
    return;
  }
  if (a !== b && typeof a !== typeof b) throw new Error(`valeur différente : ${where}`);
}

let client;
async function translate(unit, lang) {
  client ??= new Anthropic();
  let lastError;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const stream = client.beta.messages.stream({
        model: MODEL,
        max_tokens: 64000,
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        output_config: { effort: 'high' },
        system: SYSTEM,
        messages: [{
          role: 'user',
          content: `Target language: ${LANGS[lang]}.\n${unit.notes}\n\n<source>\n${JSON.stringify(unit.payload, null, 1)}\n</source>`,
        }],
      });
      const msg = await stream.finalMessage();
      if (msg.stop_reason === 'refusal') throw new Error('traduction refusée par le modèle');
      if (msg.stop_reason === 'max_tokens') throw new Error('réponse tronquée');
      const text = msg.content.filter((b) => b.type === 'text').map((b) => b.text).join('');
      const json = JSON.parse(text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1));
      sameShape(unit.payload, json);
      return json;
    } catch (e) {
      lastError = e;
      if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) throw e;
    }
  }
  throw lastError;
}

// ------------------------------------------------------------------ Programme
async function pool(tasks, n) {
  const results = [];
  let next = 0;
  await Promise.all(Array.from({ length: n }, async () => { while (next < tasks.length) { const i = next++; results[i] = await tasks[i](); } }));
  return results;
}

const units = [...ficheUnits(), ...jsonUnits()];

// Fiches supprimées en français : leurs traductions partent aussi.
const slugs = new Set(fs.readdirSync(FICHES).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, '')));
for (const l of Object.keys(LANGS)) {
  const dir = path.join(FICHES, l);
  if (!fs.existsSync(dir)) continue;
  for (const f of fs.readdirSync(dir)) if (!slugs.has(f.replace(/\.mdx?$/, ''))) { fs.rmSync(path.join(dir, f)); console.log(`supprimé : ${l}/${f}`); }
}

const todo = [];
for (const u of units) {
  const h = hash(u.payload);
  for (const l of Object.keys(LANGS)) {
    const p = u.target(l);
    if (MODE === 'marquer') { if (fs.existsSync(p)) u.mark(p, h); continue; }
    if (u.stored(p) !== h) todo.push({ u, l, p, h });
  }
}
if (MODE === 'marquer') { console.log('Traductions marquées à jour.'); process.exit(0); }
console.log(todo.length ? `À traduire (${todo.length}) : ${todo.map((t) => `${t.u.name} [${t.l}]`).join(', ')}` : 'Traductions à jour.');
if (!todo.length || MODE === 'verifier') process.exit(0);
if (!process.env.ANTHROPIC_API_KEY) {
  console.log('::warning::ANTHROPIC_API_KEY absente : traductions non mises à jour (le site garde les précédentes).');
  process.exit(0);
}

let failed = 0;
await pool(todo.map(({ u, l, p, h }) => async () => {
  try {
    const tr = await translate(u, l);
    u.write(p, l, tr, h);
    console.log(`traduit : ${u.name} [${l}]`);
  } catch (e) {
    failed++;
    console.log(`::warning::${u.name} [${l}] non traduit : ${e.message}`);
  }
}), PARALLEL);
console.log(failed ? `${failed} traduction(s) en échec : le site garde les précédentes.` : 'Toutes les traductions sont à jour.');
