/*
 * Mon espace : l'interface de Christine.
 * Les fiches du site sont des fichiers texte (en-tête YAML + texte Markdown).
 * On les lit, on ne modifie QUE les champs de ce formulaire, et on garde tout
 * le reste à l'identique (réglages de mise en page, traductions, etc.).
 */
(() => {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];
  const FICHES = 'v3-src/src/content/fiches/';
  const INFOS = 'v3-src/src/data/infos.json';
  const ASOI = 'v3-src/src/data/eveil-a-soi.fr.json';
  const AUSOI = 'v3-src/src/data/eveil-au-soi.fr.json';

  let csrf = '';
  let files = {};      // chemin → { sha, text }
  let fiches = [];     // fiches françaises lues
  let current = null;  // fiche en cours de modification
  let newPhoto = null; // { blob, name, url } photo choisie, envoyée à l'enregistrement
  let bodyDirty = false;

  // ------------------------------------------------------------ API
  async function api(action, payload = {}) {
    const res = await fetch('api.php', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json', 'X-CSRF': csrf },
      body: JSON.stringify({ action, ...payload }),
    });
    let json;
    try { json = await res.json(); } catch { json = { ok: false, error: 'Réponse inattendue du serveur.' }; }
    if (res.status === 401 && action !== 'login') { show('login'); }
    if (!json.ok) throw new Error(json.error || 'Une erreur est survenue.');
    return json;
  }

  // ------------------------------------------------------------ Vues
  function show(view) {
    $$('.view').forEach((v) => (v.hidden = v.id !== 'v-' + view));
    const logged = view !== 'login' && view !== 'loading';
    $('#tabs').hidden = !logged;
    $('#top-right').hidden = !logged;
    $$('#tabs button').forEach((b) => b.toggleAttribute('aria-current', b.dataset.tab === view || (view === 'edit' && b.dataset.tab === 'stages')));
    window.scrollTo(0, 0);
  }

  let statusTimer = null;
  function status(kind, text) {
    const el = $('#status');
    el.className = 'status ' + kind;
    el.textContent = text;
    el.hidden = !text;
  }

  // Après un enregistrement : suit la mise en ligne automatique.
  function followDeploy() {
    clearInterval(statusTimer);
    status('wait', 'C’est enregistré. Votre site se met à jour, comptez 3 à 5 minutes…');
    const started = Date.now();
    statusTimer = setInterval(async () => {
      if (Date.now() - started < 20000) return; // laisse le temps au déploiement de démarrer
      try {
        const s = await api('status');
        if (s.state === 'en-ligne' && Date.parse(s.since) > started - 60000) {
          clearInterval(statusTimer);
          status('ok', 'C’est en ligne : votre site est à jour.');
        } else if (s.state === 'erreur') {
          clearInterval(statusTimer);
          status('err', 'La mise en ligne a rencontré un souci. Rien n’est perdu : prévenez Morgan.');
        }
      } catch { /* on réessaie au prochain tour */ }
      if (Date.now() - started > 10 * 60000) clearInterval(statusTimer);
    }, 10000);
  }

  // ------------------------------------------------------------ Fiches
  function parseFiche(path, sha, text) {
    const m = text.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
    if (!m) return null;
    let data;
    try { data = jsyaml.load(m[1]) || {}; } catch { return null; }
    if (data.lang && data.lang !== 'fr') return null;
    return { path, sha, data, body: m[2].replace(/^\n+/, ''), slug: path.slice(FICHES.length).replace(/\.mdx?$/, '') };
  }

  function serialize(data, body) {
    const yaml = jsyaml.dump(data, { lineWidth: -1, noRefs: true, quotingType: "'" });
    return `---\n${yaml}---\n\n${body.trim()}\n`;
  }

  /** Corps avec mise en page spéciale (blocs, HTML) : non modifiable ici, pour ne rien casser. */
  const hasLayout = (body) => /<[A-Za-z][^>]*>|^\s*(import|export)\s/m.test(body);

  const rubriques = () => {
    const used = new Set(fiches.map((f) => f.data.rubrique).filter(Boolean));
    return fiches
      .filter((f) => used.has(f.slug) || (f.data.stages || []).length || f.data.category === 'parcours')
      // Éveil à Soi d'abord, puis Éveil au Soi, chacun dans l'ordre d'affichage du site
      .sort((a, b) => (a.data.hub === b.data.hub ? 0 : a.data.hub === 'eveil-a-soi' ? -1 : 1) || (a.data.order ?? 50) - (b.data.order ?? 50));
  };
  const bySlug = (s) => fiches.find((f) => f.slug === s);
  const hubLabel = { 'eveil-a-soi': 'Éveil à Soi', 'eveil-au-soi': 'Éveil au Soi' };

  // ------------------------------------------------------------ Dates (lecture des dates en clair, comme le site)
  const MONTHS = [/^janv/, /^f[eé]v/, /^mars$/, /^avr/, /^mai$/, /^juin$/, /^juil/, /^ao[uû]t$/, /^sept?/, /^oct/, /^nov/, /^d[eé]c/];
  function endOf(label) {
    const n = label.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/(\d)\s*(er|eme|e)\b/g, '$1');
    if (/^(a partir|des\s|depuis)/.test(n.trim())) return Infinity;
    const num = [...n.matchAll(/\b(\d{1,2})[/.](\d{1,2})[/.](\d{2,4})\b/g)].pop();
    if (num) return Date.UTC(+num[3] < 100 ? 2000 + +num[3] : +num[3], +num[2] - 1, +num[1]);
    const toks = n.match(/[a-z]+|\d+/g) || [];
    const yi = toks.map((t, i) => (/^20\d\d$/.test(t) ? i : -1)).filter((i) => i >= 0);
    const mi = toks.map((t, i) => (MONTHS.findIndex((r) => r.test(t)) >= 0 ? i : -1)).filter((i) => i >= 0);
    if (!yi.length) return null;
    const y = +toks[yi[yi.length - 1]];
    if (!mi.length) return Date.UTC(y, 11, 31);
    const last = mi[mi.length - 1];
    const m = MONTHS.findIndex((r) => r.test(toks[last]));
    const d = toks.slice(0, last).reverse().find((t) => /^\d{1,2}$/.test(t));
    return d ? Date.UTC(y, m, +d) : Date.UTC(y, m + 1, 0);
  }
  function nextDate(dates = []) {
    const today = Date.now() - 86400000;
    return dates.map(String).find((d) => { const e = endOf(d); return e !== null && e >= today; });
  }

  // ------------------------------------------------------------ Liste
  function renderList() {
    const groups = new Map();
    const order = (f) => f.data.order ?? 50;
    const rubs = rubriques();
    for (const r of rubs) groups.set(r.slug, { title: r.data.title, items: [r] });
    const others = { 'eveil-a-soi': [], 'eveil-au-soi': [] };
    for (const f of fiches) {
      if (rubs.includes(f)) continue;
      if (f.data.rubrique && groups.has(f.data.rubrique)) groups.get(f.data.rubrique).items.push(f);
      else (others[f.data.hub] || others['eveil-a-soi']).push(f);
    }
    const blocks = ['eveil-a-soi', 'eveil-au-soi'].flatMap((h) => [
      ...(others[h].length ? [{ title: hubLabel[h], items: others[h] }] : []),
      ...rubs.filter((r) => r.data.hub === h).map((r) => groups.get(r.slug)),
    ]);
    const box = $('#stage-groups');
    box.replaceChildren();
    for (const g of blocks) {
      const sec = document.createElement('section');
      sec.className = 'group';
      const h = document.createElement('h2');
      h.textContent = g.title;
      const rows = document.createElement('div');
      rows.className = 'rows';
      for (const f of g.items.sort((a, b) => (g.items[0] === a && rubs.includes(a) ? -1 : g.items[0] === b && rubs.includes(b) ? 1 : order(a) - order(b)))) {
        const row = document.createElement('button');
        row.type = 'button';
        row.className = 'srow';
        const thumb = document.createElement('span');
        thumb.className = 'thumb';
        if (f.data.image) thumb.style.backgroundImage = `url("${encodeURI(f.data.image)}")`;
        const txt = document.createElement('span');
        const t = document.createElement('span');
        t.className = 't';
        t.textContent = f.data.title + (rubs.includes(f) ? ' (page de la rubrique)' : '');
        if (f.data.draft) { const b = document.createElement('span'); b.className = 'badge'; b.textContent = 'Masqué'; t.append(b); }
        const m = document.createElement('span');
        m.className = 'm';
        m.style.display = 'block';
        const nd = nextDate(f.data.dates);
        m.textContent = nd ? 'Prochaine date : ' + nd : (f.data.dates || []).length ? 'Sur demande' : 'Pas de date';
        txt.append(t, m);
        const go = document.createElement('span');
        go.className = 'go';
        go.textContent = 'Modifier →';
        row.append(thumb, txt, go);
        row.addEventListener('click', () => openEditor(f));
        rows.append(row);
      }
      sec.append(h, rows);
      box.append(sec);
    }
  }

  // ------------------------------------------------------------ Éditeur
  const turndown = new TurndownService({ headingStyle: 'atx', bulletListMarker: '-', emDelimiter: '_', strongDelimiter: '**' });

  function addItem(listSel, tplSel, fill) {
    const node = $(tplSel).content.firstElementChild.cloneNode(true);
    fill?.(node);
    $('.x', node).addEventListener('click', () => { node.remove(); preview(); });
    node.addEventListener('input', preview);
    $(listSel).append(node);
    return node;
  }

  function openEditor(f) {
    current = f || { path: null, sha: null, slug: null, body: '', data: { lang: 'fr', kicker: 'Stage', hub: 'eveil-a-soi', category: 'stage', order: 50, dates: [] } };
    newPhoto = null;
    bodyDirty = false;
    const d = current.data;
    $('#edit-title').textContent = f ? 'Modifier : ' + d.title : 'Nouveau stage';
    $('#f-title').value = d.title || '';
    $('#f-kicker').value = d.kicker || '';
    const sel = $('#f-rubrique');
    sel.replaceChildren(new Option('Aucune : une carte sur la page de l’univers', 'aucune'));
    for (const r of rubriques()) if (r !== current) sel.append(new Option(`${r.data.title} (${hubLabel[r.data.hub]})`, r.slug));
    sel.value = d.rubrique && bySlug(d.rubrique) ? d.rubrique : 'aucune';
    $('#f-hub').value = d.hub || 'eveil-a-soi';
    $('#f-lede').value = d.lede || '';
    $('#f-place').value = d.place || '';
    $('#f-duration').value = d.duration || '';
    $('#f-price').value = d.price || '';
    $('#f-format').value = d.format || '';
    $('#f-dates').replaceChildren();
    (d.dates || []).forEach((x) => addItem('#f-dates', '#t-date', (n) => ($('.date', n).value = String(x))));
    if (!(d.dates || []).length && !f) addItem('#f-dates', '#t-date');
    $('#f-videos').replaceChildren();
    (d.videos || []).forEach((v) => addItem('#f-videos', '#t-video', (n) => {
      n.dataset.extra = JSON.stringify(v);
      $('.v-url', n).value = 'https://www.youtube.com/watch?v=' + v.id;
      $('.v-title', n).value = v.title || '';
    }));
    $('#f-testimonials').replaceChildren();
    (d.testimonials || []).forEach((t) => addItem('#f-testimonials', '#t-testimonial', (n) => {
      $('.t-quote', n).value = t.quote || '';
      $('.t-author', n).value = t.author || '';
    }));
    $('#f-visible').checked = !d.draft;
    const locked = hasLayout(current.body);
    $('#body-locked').hidden = !locked;
    $('#body-wrap').hidden = locked;
    $('#f-body').innerHTML = locked ? '' : marked.parse(current.body || '');
    setPhoto(d.image || '');
    $('#edit-error').hidden = true;
    toggleHub();
    preview();
    show('edit');
  }

  function toggleHub() { $('#hub-wrap').hidden = $('#f-rubrique').value !== 'aucune'; }

  function setPhoto(src) {
    const img = $('#photo-img');
    img.hidden = !src;
    $('#photo-empty').hidden = !!src;
    $('#photo-remove').hidden = !src;
    if (src) img.src = src;
    else img.removeAttribute('src');
    preview();
  }

  /** Réduit une photo (1600 px au plus, JPEG) avant l'envoi : rapide et léger pour le site. */
  async function shrink(file) {
    const url = URL.createObjectURL(file);
    const img = await new Promise((ok, ko) => { const i = new Image(); i.onload = () => ok(i); i.onerror = ko; i.src = url; });
    const scale = Math.min(1, 1600 / Math.max(img.naturalWidth, img.naturalHeight));
    const c = document.createElement('canvas');
    c.width = Math.round(img.naturalWidth * scale);
    c.height = Math.round(img.naturalHeight * scale);
    c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
    URL.revokeObjectURL(url);
    const blob = await new Promise((ok) => c.toBlob(ok, 'image/jpeg', 0.85));
    return { blob, url: URL.createObjectURL(blob), name: file.name.replace(/\.[a-z0-9]+$/i, '') };
  }

  async function pickPhoto(file) {
    if (!file || !/^image\//.test(file.type)) return;
    try {
      newPhoto = await shrink(file);
      setPhoto(newPhoto.url);
    } catch {
      showError('#edit-error', 'Cette photo n’a pas pu être lue. Essayez une photo au format JPEG.');
    }
  }

  function preview() {
    const dates = $$('#f-dates .date').map((i) => i.value.trim()).filter(Boolean);
    const img = $('#photo-img').hidden ? '' : $('#photo-img').src;
    $('#p-img').style.backgroundImage = img ? `url("${img}")` : '';
    $('#p-label').textContent = nextDate(dates) || $('#f-kicker').value || 'Stage';
    $('#p-title').textContent = $('#f-title').value || 'Titre du stage';
    $('#p-lede').textContent = $('#f-lede').value;
    $('#p-meta').textContent = [$('#f-place').value, $('#f-format').value, $('#f-duration').value, $('#f-price').value].map((s) => s.trim()).filter(Boolean).join(' · ');
  }

  const youtubeId = (url) => (url.match(/(?:v=|youtu\.be\/|embed\/|shorts\/)([A-Za-z0-9_-]{11})/) || url.match(/^([A-Za-z0-9_-]{11})$/) || [])[1];
  const slugify = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 70) || 'stage';

  function showError(sel, msg) { const e = $(sel); e.textContent = msg; e.hidden = !msg; }

  async function saveFiche(ev) {
    ev.preventDefault();
    const title = $('#f-title').value.trim();
    const lede = $('#f-lede').value.trim();
    if (!title || !lede) return showError('#edit-error', 'Il manque le titre ou la phrase de présentation.');
    const videos = [];
    for (const n of $$('#f-videos .item')) {
      const url = $('.v-url', n).value.trim();
      if (!url) continue;
      const id = youtubeId(url);
      if (!id) return showError('#edit-error', 'Un lien de vidéo n’est pas un lien YouTube. Copiez l’adresse de la vidéo depuis YouTube.');
      const extra = n.dataset.extra ? JSON.parse(n.dataset.extra) : {};
      videos.push({ ...extra, id, title: $('.v-title', n).value.trim() || extra.title || '' });
    }
    const testimonials = $$('#f-testimonials .item')
      .map((n) => ({ quote: $('.t-quote', n).value.trim(), author: $('.t-author', n).value.trim() }))
      .filter((t) => t.quote)
      .map((t) => (t.author ? t : { quote: t.quote }));

    const btn = $('#save');
    btn.disabled = true;
    btn.textContent = 'Enregistrement…';
    showError('#edit-error', '');
    try {
      const d = { ...current.data };
      if (newPhoto) {
        const b64 = await new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.readAsDataURL(newPhoto.blob); });
        const up = await api('upload', { name: slugify(title), data: b64 });
        d.image = up.src;
        d.imageAlt = d.imageAlt || title;
      } else if ($('#photo-img').hidden) {
        delete d.image;
      }
      const rub = $('#f-rubrique').value;
      d.title = title;
      d.kicker = $('#f-kicker').value.trim() || 'Stage';
      if (rub === 'aucune') { delete d.rubrique; d.hub = $('#f-hub').value; } else { d.rubrique = rub; d.hub = bySlug(rub)?.data.hub || d.hub; }
      d.lede = lede;
      d.dates = $$('#f-dates .date').map((i) => i.value.trim()).filter(Boolean);
      for (const k of ['place', 'duration', 'price', 'format']) {
        const v = $('#f-' + k).value.trim();
        if (v) d[k] = v; else if (k in d) d[k] = '';
      }
      if (videos.length || d.videos) d.videos = videos;
      if (testimonials.length || d.testimonials) d.testimonials = testimonials;
      d.draft = !$('#f-visible').checked;
      if (!d.draft && current.data.draft === undefined) delete d.draft;

      const body = bodyDirty ? turndown.turndown($('#f-body').innerHTML) : current.body;
      let path = current.path;
      if (!path) {
        let slug = slugify(title), n = 2;
        while (fiches.some((f) => f.slug === slug)) slug = slugify(title) + '-' + n++;
        path = FICHES + slug + '.mdx';
      }
      const text = serialize(d, body);
      const res = await api('save', { path, text, sha: current.sha, title });
      files[path] = { sha: res.sha, text };
      const updated = parseFiche(path, res.sha, text);
      fiches = fiches.filter((f) => f.path !== path).concat(updated);
      renderList();
      show('stages');
      followDeploy();
    } catch (e) {
      showError('#edit-error', e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enregistrer';
    }
  }

  // ------------------------------------------------------------ Petites infos
  const json = (p, fallback) => { try { return JSON.parse(files[p]?.text || ''); } catch { return fallback; } };
  function renderInfos() {
    const infos = json(INFOS, {});
    $('#i-phone').value = infos.telephone || '';
    $('#i-email').value = infos.email || '';
    $('#i-annonce-on').checked = !!infos.annonce?.actif;
    $('#i-annonce').value = infos.annonce?.texte || '';
    $('#i-annonce-link').value = infos.annonce?.lien || '';
    const a = json(ASOI, {}), b = json(AUSOI, {});
    $('#i-asoi-h1').value = a.h1 || ''; $('#i-asoi-lede').value = a.lede || '';
    $('#i-ausoi-h1').value = b.h1 || ''; $('#i-ausoi-lede').value = b.lede || '';
  }

  async function saveInfos(ev) {
    ev.preventDefault();
    const btn = $('#infos-form button[type=submit]');
    btn.disabled = true;
    showError('#infos-error', '');
    try {
      const infos = json(INFOS, {});
      infos.telephone = $('#i-phone').value.trim();
      infos.email = $('#i-email').value.trim();
      infos.annonce = { actif: $('#i-annonce-on').checked, texte: $('#i-annonce').value.trim(), lien: $('#i-annonce-link').value.trim() };
      const a = json(ASOI, null), b = json(AUSOI, null);
      const changes = [[INFOS, infos, 'Petites infos']];
      if (a) changes.push([ASOI, { ...a, h1: $('#i-asoi-h1').value.trim(), lede: $('#i-asoi-lede').value.trim() }, 'Page Éveil à Soi']);
      if (b) changes.push([AUSOI, { ...b, h1: $('#i-ausoi-h1').value.trim(), lede: $('#i-ausoi-lede').value.trim() }, 'Page Éveil au Soi']);
      let saved = 0;
      for (const [p, obj, title] of changes) {
        const text = JSON.stringify(obj, null, 2) + '\n';
        if (files[p] && files[p].text === text) continue; // rien de changé
        const res = await api('save', { path: p, text, sha: files[p]?.sha, title });
        files[p] = { sha: res.sha, text };
        saved++;
      }
      if (saved) followDeploy(); else status('ok', 'Rien n’a changé : il n’y avait rien à enregistrer.');
    } catch (e) {
      showError('#infos-error', e.message);
    } finally {
      btn.disabled = false;
    }
  }

  // ------------------------------------------------------------ Chargement
  async function load() {
    show('loading');
    const res = await api('load');
    files = {};
    for (const f of res.files) files[f.path] = { sha: f.sha, text: f.text };
    fiches = res.files.filter((f) => f.path.startsWith(FICHES)).map((f) => parseFiche(f.path, f.sha, f.text)).filter(Boolean);
    renderList();
    renderInfos();
    show('stages');
  }

  // ------------------------------------------------------------ Événements
  $('#login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    showError('#login-error', '');
    try {
      const r = await api('login', { email: $('#login-email').value, password: $('#login-password').value });
      csrf = r.csrf;
      $('#login-password').value = '';
      await load();
    } catch (err) { showError('#login-error', err.message); }
  });
  $('#logout').addEventListener('click', async () => { try { await api('logout'); } catch {} csrf = ''; status('', ''); show('login'); });
  $$('#tabs button').forEach((b) => b.addEventListener('click', () => show(b.dataset.tab)));
  $('#add-stage').addEventListener('click', () => openEditor(null));
  $('#back').addEventListener('click', () => show('stages'));
  $('#cancel').addEventListener('click', () => show('stages'));
  $('#add-date').addEventListener('click', () => $('.date', addItem('#f-dates', '#t-date')).focus());
  $('#add-video').addEventListener('click', () => $('.v-url', addItem('#f-videos', '#t-video')).focus());
  $('#add-testimonial').addEventListener('click', () => $('.t-quote', addItem('#f-testimonials', '#t-testimonial')).focus());
  $('#f-rubrique').addEventListener('change', toggleHub);
  $('#edit-form').addEventListener('input', preview);
  $('#edit-form').addEventListener('submit', saveFiche);
  $('#infos-form').addEventListener('submit', saveInfos);
  $('#f-photo').addEventListener('change', (e) => pickPhoto(e.target.files[0]));
  $('#photo-remove').addEventListener('click', () => { newPhoto = null; setPhoto(''); });
  const drop = $('#photo-drop');
  drop.addEventListener('dragover', (e) => { e.preventDefault(); drop.classList.add('over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('over'));
  drop.addEventListener('drop', (e) => { e.preventDefault(); drop.classList.remove('over'); pickPhoto(e.dataTransfer.files[0]); });

  // Éditeur de texte
  const editor = $('#f-body');
  editor.addEventListener('input', () => (bodyDirty = true));
  editor.addEventListener('paste', (e) => {
    // Colle le texte seul : pas de mise en forme parasite venue d'un traitement de texte
    e.preventDefault();
    document.execCommand('insertText', false, e.clipboardData.getData('text/plain'));
  });
  $$('.toolbar button').forEach((b) => b.addEventListener('mousedown', (e) => {
    e.preventDefault();
    editor.focus();
    const cmd = b.dataset.cmd;
    if (cmd === 'bold' || cmd === 'italic') document.execCommand(cmd);
    else if (cmd === 'list') document.execCommand('insertUnorderedList');
    else if (cmd === 'h2') document.execCommand('formatBlock', false, 'h2');
    else if (cmd === 'quote') document.execCommand('formatBlock', false, 'blockquote');
    else if (cmd === 'p') document.execCommand('formatBlock', false, 'p');
    else if (cmd === 'link') {
      const url = prompt('Adresse du lien (https://…)');
      if (url && /^(https?:\/\/|\/|mailto:)/.test(url)) document.execCommand('createLink', false, url);
    }
    bodyDirty = true;
  }));

  // Démarrage
  api('me').then((r) => { csrf = r.csrf; return r.loggedIn ? load() : show('login'); })
    .catch((e) => { show('login'); showError('#login-error', e.message); });
})();
