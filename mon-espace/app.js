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
  // Texte envoyé en base64 : le pare-feu de l'hébergeur bloque parfois un
  // contenu qui ressemble à du code (HTML, JSON…).
  const toBase64 = (s) => {
    const bytes = new TextEncoder().encode(s);
    let bin = '';
    for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
    return btoa(bin);
  };

  async function api(action, payload = {}) {
    if (typeof payload.text === 'string') {
      const { text, ...rest } = payload;
      payload = { ...rest, text64: toBase64(text) };
    }
    let res;
    try {
      res = await fetch('api.php', {
        method: 'POST',
        credentials: 'same-origin',
        headers: { 'Content-Type': 'application/json', 'X-CSRF': csrf },
        body: JSON.stringify({ action, ...payload }),
      });
    } catch {
      throw new Error('Pas de connexion Internet. Vérifiez le Wi-Fi puis réessayez.');
    }
    const raw = await res.text();
    let json;
    try { json = JSON.parse(raw); } catch {
      console.error('Mon espace : réponse du serveur', res.status, raw.slice(0, 500));
      json = { ok: false, error: `Réponse inattendue du serveur (code ${res.status}). Appelez Morgan.` };
    }
    if (res.status === 401 && action !== 'login') { show('login'); }
    if (!json.ok) throw new Error(json.error || 'Une erreur est survenue.');
    return json;
  }

  // ------------------------------------------------------------ Vues
  const TAB_OF = { edit: 'stages', page: 'pages' };
  let currentView = '';
  // Changements pas encore enregistrés : on demande avant de quitter l'écran
  const UNSAVED = {
    edit: ['Vous n’avez pas enregistré vos changements sur ce stage.', () => editDirty()],
    page: ['Vous n’avez pas enregistré vos changements sur cette page.', () => pageDirty()],
    videos: ['Vous n’avez pas enregistré vos changements dans Mes vidéos.', () => videosDirty()],
  };
  const unsaved = () => UNSAVED[currentView]?.[1]() ?? false;
  function show(view) {
    if (view !== currentView && view !== 'loading' && unsaved()
      && !confirm(UNSAVED[currentView][0] + '\n\nLes abandonner ? (« Annuler » pour rester et enregistrer)')) return;
    if (currentView === 'videos' && view !== 'videos') resetVideos();
    currentView = view;
    $$('.view').forEach((v) => (v.hidden = v.id !== 'v-' + view));
    const logged = view !== 'login' && view !== 'loading';
    $('#tabs').hidden = !logged;
    $('#top-right').hidden = !logged;
    $$('#tabs button').forEach((b) => b.toggleAttribute('aria-current', b.dataset.tab === (TAB_OF[view] || view)));
    if (view === 'home') renderHome();
    if (view === 'history') renderHistory();
    if (view === 'videos') renderVideos();
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
    siteState = { state: 'en-cours' };
    const started = Date.now();
    statusTimer = setInterval(async () => {
      if (Date.now() - started < 20000) return; // laisse le temps au déploiement de démarrer
      try {
        const s = await api('status');
        if (s.state === 'en-ligne' && Date.parse(s.since) > started - 60000) {
          clearInterval(statusTimer);
          status('ok', 'C’est en ligne : votre site est à jour.');
          siteState = null;
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
    slides = (d.slideshow || []).map((src) => ({ src }));
    renderSlides();
    $('#edit-see').hidden = !f || !!d.draft;
    if (f) $('#edit-see').href = SITE + (d.hub || 'eveil-a-soi') + '/' + f.slug + '/';
    $('#edit-error').hidden = true;
    toggleHub();
    preview();
    editBase = editSnapshot();
    show('edit');
  }

  // Photo instantanée du formulaire de stage, pour savoir s'il a changé
  let editBase = '';
  function editSnapshot() {
    const vals = $$('#edit-form input:not([type=file]), #edit-form select, #edit-form textarea').map((i) => (i.type === 'checkbox' ? i.checked : i.value));
    return JSON.stringify([vals, bodyDirty ? $('#f-body').innerHTML : '', !!newPhoto, $('#photo-img').hidden, slides.map((x) => x.src || 'nouvelle')]);
  }
  const editDirty = () => !!current && editSnapshot() !== editBase;

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

  const toB64 = (blob) => new Promise((ok) => { const r = new FileReader(); r.onload = () => ok(String(r.result).split(',')[1]); r.readAsDataURL(blob); });

  // Diaporama du stage : [{ src }] déjà en ligne, ou [{ pending }] choisie, envoyée à l'enregistrement
  let slides = [];
  function renderSlides() {
    const box = $('#f-slides');
    box.replaceChildren();
    if (!slides.length) box.append(el('p', 'hint', 'Pas de diaporama pour ce stage.'));
    slides.forEach((x, i) => {
      const t = el('div', 'slide');
      const im = el('img'); im.alt = ''; im.src = x.pending ? x.pending.url : x.src;
      const acts = el('div', 'vacts');
      const move = (to) => { slides.splice(to, 0, slides.splice(i, 1)[0]); renderSlides(); };
      acts.append(tool('←', 'Avant', i > 0, () => move(i - 1)), tool('→', 'Après', i < slides.length - 1, () => move(i + 1)),
        tool('Retirer', 'Retirer du diaporama', true, () => { slides.splice(i, 1); renderSlides(); }, 'danger'));
      t.append(im, el('span', 'vm', 'Photo ' + (i + 1) + (x.pending ? ' · nouvelle' : '')), acts);
      box.append(t);
    });
  }
  async function addSlides(list) {
    for (const file of [...list]) {
      if (!/^image\//.test(file.type)) continue;
      try { slides.push({ pending: await shrink(file) }); } catch { showError('#edit-error', 'Une photo n’a pas pu être lue. Essayez une photo au format JPEG.'); }
    }
    renderSlides();
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
        const up = await api('upload', { name: slugify(title), data: await toB64(newPhoto.blob) });
        d.image = up.src;
        d.imageAlt = d.imageAlt || title;
      } else if ($('#photo-img').hidden) {
        delete d.image;
      }
      // Diaporama : on envoie d'abord les nouvelles photos, dans l'ordre choisi
      const fresh = slides.filter((x) => x.pending);
      for (const [i, x] of fresh.entries()) {
        btn.textContent = `Envoi des photos ${i + 1}/${fresh.length}…`;
        const up = await api('upload', { name: slugify(title) + '-diaporama', data: await toB64(x.pending.blob) });
        x.src = up.src; delete x.pending;
      }
      btn.textContent = 'Enregistrement…';
      if (slides.length || d.slideshow) d.slideshow = slides.map((x) => x.src);
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
      historyCache = null;
      current = null;
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
      const changes = [[INFOS, infos, 'Petites infos']];
      let saved = 0;
      for (const [p, obj, title] of changes) {
        const text = JSON.stringify(obj, null, 2) + '\n';
        if (files[p] && files[p].text === text) continue; // rien de changé
        const res = await api('save', { path: p, text, sha: files[p]?.sha, title });
        files[p] = { sha: res.sha, text };
        saved++;
      }
      if (saved) { followDeploy(); historyCache = null; } else status('ok', 'Rien n’a changé : il n’y avait rien à enregistrer.');
    } catch (e) {
      showError('#infos-error', e.message);
    } finally {
      btn.disabled = false;
    }
  }

  // ------------------------------------------------------------ Mes pages
  // Le site que Christine regarde : le nouveau site, encore en maquette sur Vercel.
  // À la bascule du nouveau site sur OVH, remettre '/'.
  const SITE = 'https://website-christinecal.vercel.app/nouveau-site/';
  const ABOUT = 'v3-src/src/data/about.fr.json';
  const MISSION = 'v3-src/src/data/mission.fr.json';
  // Types de champ : line (une ligne), text (un paragraphe sans mise en forme),
  // rich (gras, italique, retour à la ligne : le site l'affiche en HTML), list (textes),
  // objs (liste de petits blocs), videos. « rich » seulement là où le site lit du HTML.
  const L = (p, label, help) => ({ p, label, help, type: 'line' });
  const P = (p, label, help) => ({ p, label, help, type: 'text' });
  const R = (p, label, help) => ({ p, label, help, type: 'rich' });
  function hubPage(path, title, url, photo) {
    return { path, title, url, sections: [
      { legend: 'En haut de la page', fields: [L('eyebrow', 'Petit mot au-dessus du titre'), L('h1', 'Grand titre'), P('lede', 'Phrase d’accroche'), photo] },
      { legend: 'Introduction', fields: [{ p: 'intro', label: 'Phrases d’introduction', type: 'list', item: 'rich', add: 'une phrase', help: 'Une phrase par bloc, dans l’ordre de la page.' }] },
      { legend: 'Phrases de clôture', fields: [{ p: 'outro', label: 'En bas de la page', type: 'list', item: 'text', add: 'une phrase', help: 'La première s’affiche en grand, entre guillemets.' }] },
    ] };
  }
  const PAGES = [
    { path: ABOUT, title: 'Qui suis-je', url: 'qui-suis-je/', accent: 'about-accent', sections: [
      { legend: 'En haut de la page', fields: [
        { p: 'hero.photo', label: 'Votre portrait', type: 'photo', help: 'En rectangle, à gauche du titre. Une photo en hauteur convient le mieux.' },
        L('hero.title', 'Grand titre', 'Le site passe à la ligne avant « en contact ».'),
        P('epigraph', 'Texte en italique sous le titre') ] },
      { legend: 'Une galactique venue d’un futur', fields: [
        L('galactic.heading', 'Titre'),
        { p: 'galactic.items', label: 'Paragraphes', type: 'list', item: 'text', add: 'un paragraphe' } ] },
      { legend: 'Un parcours en bref', fields: [
        L('journey.heading', 'Titre'),
        { p: 'journey.items', label: 'Étapes du parcours', type: 'objs', add: 'une étape', help: 'Les deux dernières étapes s’affichent côte à côte, en grand.',
          item: [L('lead', 'Début (en doré)'), R('text', 'Suite')] } ] },
      { legend: 'Activités actuelles', fields: [
        L('activities.heading', 'Titre'),
        { p: 'activities.items', label: 'Activités', type: 'objs', add: 'une activité',
          item: [L('title', 'Nom de l’activité'), R('text', 'Description'),
            { p: 'accordion.items', label: 'Exemples de conférences', type: 'lines', optional: true,
              help: 'Une conférence par ligne. Mettez l’année à la fin (« … — 2026 ») : les plus récentes s’affichent en premier.' }] } ] },
      { legend: 'Spécificités', fields: [
        L('specifics.heading', 'Titre'),
        { p: 'specifics.items', label: 'Spécificités', type: 'list', item: 'rich', add: 'une spécificité', help: 'Une date au début (« 2019 — … ») s’affiche à part, en doré.' } ] },
      { legend: 'Une clientèle variée', fields: [L('clients.heading', 'Titre'), P('clients.text', 'Texte')] },
      { legend: 'Actualités', fields: [
        L('news.heading', 'Titre'),
        { p: 'news.items', label: 'Actualités', type: 'list', item: 'rich', add: 'une actualité', help: 'Commencez par la date : « 2026 — … ».' } ] },
      { legend: 'À venir', fields: [
        L('upcoming.heading', 'Titre'),
        { p: 'upcoming.items', label: 'Projets à venir', type: 'list', item: 'rich', add: 'un projet', help: 'Un mot suivi de deux-points (« YouTube : … ») s’affiche en doré.' } ] },
      { legend: 'Vidéos de présentation', fields: [L('videos.heading', 'Titre'), { p: 'videos.list', label: 'Vidéos', type: 'videos' }] },
    ] },
    { path: MISSION, title: 'Ma mission', url: 'mission/', sections: [
      { legend: 'En haut de la page', fields: [
        L('eyebrow', 'Petit mot au-dessus du titre'), L('h1', 'Grand titre'),
        R('lede', 'Phrase sous le titre', 'La citation entre « » est aussi reprise sur la page Qui suis-je.') ] },
      { legend: 'L’Espace-Temps se contracte', fields: [
        R('s1Heading', 'Titre', 'Sur le site, seule la fin s’affiche (après « au sol. »).'),
        R('s1p1', 'Premier paragraphe'), R('s1p2', 'Paragraphe en italique doré') ] },
      { legend: 'La mission', fields: [
        { p: 'photo', label: 'Votre photo', type: 'photo', help: 'À gauche du texte « La mission ». Une photo en hauteur convient le mieux.' },
        L('s2Heading', 'Titre'), R('s2Quote', 'Grand texte'), L('s2Matrix', 'Petite phrase en italique'),
        { p: 'points', label: 'Les points I, II, III', type: 'list', item: 'rich', add: 'un point' } ] },
      { legend: 'Véritable pionnier', fields: [
        L('pioneerHeading', 'Titre'), R('pioneerIntro', 'Introduction'),
        { p: 'pioneerQuotes', label: 'Citations', type: 'list', item: 'text', add: 'une citation', help: 'Les guillemets « » sont ajoutés par le site.' },
        R('pioneerP2', 'Phrase sous les citations'), R('pioneerAdn', 'Phrase en italique doré'), R('pioneerP3', 'Dernier paragraphe') ] },
      { legend: 'Vous sentez l’appel ?', fields: [
        L('callEyebrow', 'Titre'), L('callHeading', 'Phrase'), L('callHeadingEm', 'Fin de la phrase, en doré'),
        L('crewOld.title', 'Premier équipage'), L('crewOld.en', 'Son nom en anglais'), P('crewOld.desc', 'Sa description'),
        L('crewYoung.title', 'Second équipage'), L('crewYoung.en', 'Son nom en anglais'), P('crewYoung.desc', 'Sa description'),
        P('callLede', 'Phrase sous les équipages') ] },
      { legend: 'Vidéos', fields: [L('pressHeading', 'Titre'), { p: 'videos', label: 'Vidéos', type: 'videos' }] },
      { legend: 'Vous vous reconnaissez ?', fields: [L('recognizeHeading', 'Titre'), P('recognizeBody', 'Texte')] },
    ] },
    hubPage(ASOI, 'Éveil à Soi', 'eveil-a-soi/', { p: 'fond', label: 'Image de fond', type: 'photo', removable: true, help: 'À droite du titre, fondue dans la nuit. Une image en largeur convient le mieux.' }),
    hubPage(AUSOI, 'Éveil au Soi', 'eveil-au-soi/', { p: 'bandeau', label: 'Bandeau sous le titre', type: 'photo', removable: true, help: 'Une image en largeur, affichée en bandeau.' }),
  ];
  let page = null; // { def, data } page en cours

  const getAt = (o, p) => p.split('.').reduce((v, k) => (v == null ? v : v[k]), o);
  function setAt(o, p, val) {
    const ks = p.split('.');
    const last = ks.pop();
    const parent = ks.reduce((v, k) => (v[k] ??= {}), o);
    parent[last] = val;
  }
  const el = (tag, cls, text) => { const n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; };
  const escHTML = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  /** HTML d'un champ « rich », réduit à ce que le site sait afficher : gras, italique, retour à la ligne. */
  function richHTML(root, accent) {
    let out = '';
    const walk = (n) => {
      for (const c of n.childNodes) {
        if (c.nodeType === 3) { out += escHTML(c.nodeValue); continue; }
        if (c.nodeType !== 1) continue;
        const tag = c.tagName.toLowerCase();
        if (tag === 'br') { out += '<br />'; continue; }
        if (tag === 'div' || tag === 'p') { if (out && !out.endsWith('<br />')) out += '<br />'; walk(c); continue; }
        const wrap = tag === 'strong' || tag === 'b' ? 'strong' : tag === 'em' || tag === 'i' ? 'em'
          : tag === 'span' && c.classList.contains('about-white') ? 'span' : null;
        if (!wrap) { walk(c); continue; }
        const cls = c.getAttribute('class') || (wrap === 'strong' && accent ? accent : '');
        out += `<${wrap}${cls ? ` class="${escHTML(cls)}"` : ''}>`;
        walk(c);
        out += `</${wrap}>`;
      }
    };
    walk(root);
    return out.replace(/(<br \/>)+$/, '').trim();
  }

  // Un champ : renvoie { node, read } ; read() rend la valeur d'origine tant qu'on n'y a pas touché.
  function textField(type, value, label, help) {
    const wrap = el('div', 'field');
    if (label) { const l = el('div', 'label-like', label); if (help) l.append(el('small', null, help)); wrap.append(l); }
    const orig = value ?? '';
    if (type === 'rich') {
      const bar = el('div', 'toolbar mini');
      const ed = el('div', 'editor rich');
      ed.contentEditable = 'true';
      ed.innerHTML = orig;
      let dirty = false;
      ed.addEventListener('input', () => (dirty = true));
      ed.addEventListener('paste', (e) => { e.preventDefault(); document.execCommand('insertText', false, e.clipboardData.getData('text/plain')); });
      ed.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); document.execCommand('insertLineBreak'); dirty = true; } });
      for (const [cmd, html, title] of [['bold', '<b>G</b>', 'Gras'], ['italic', '<i>I</i>', 'Italique']]) {
        const b = el('button');
        b.type = 'button'; b.title = title; b.innerHTML = html;
        b.addEventListener('mousedown', (e) => { e.preventDefault(); ed.focus(); document.execCommand(cmd); dirty = true; });
        bar.append(b);
      }
      wrap.append(bar, ed);
      return { node: wrap, focus: () => ed.focus(), read: () => (dirty ? richHTML(ed, page.def.accent) : orig) };
    }
    const input = type === 'text' ? el('textarea') : el('input');
    if (type === 'text') input.rows = Math.min(8, Math.max(3, Math.ceil(orig.length / 70)));
    else input.type = 'text';
    input.value = orig;
    wrap.append(input);
    return { node: wrap, focus: () => input.focus(), read: () => (input.value === orig ? orig : input.value.trim()) };
  }

  // Une liste : des blocs qu'on peut retirer, remonter, ajouter.
  function listField(f, values, makeItem) {
    const wrap = el('div', 'field');
    const l = el('div', 'label-like', f.label);
    if (f.help) l.append(el('small', null, f.help));
    const box = el('div', 'list');
    const items = [];
    const add = (v, focus) => {
      const it = makeItem(v);
      const row = el('div', 'item col');
      const acts = el('div', 'item-actions');
      const up = el('button', 'x up', '↑ Monter');
      up.type = 'button';
      up.addEventListener('click', () => { const i = items.indexOf(entry); if (i > 0) { items.splice(i - 1, 0, items.splice(i, 1)[0]); row.previousElementSibling.before(row); } });
      const rm = el('button', 'x', 'Retirer');
      rm.type = 'button';
      rm.addEventListener('click', () => { items.splice(items.indexOf(entry), 1); row.remove(); });
      acts.append(up, rm);
      row.append(it.node, acts);
      box.append(row);
      const entry = { row, read: it.read };
      items.push(entry);
      if (focus) it.focus?.();
    };
    (values || []).forEach((v) => add(v));
    const more = el('button', 'btn small', '+ Ajouter ' + (f.add || 'un élément'));
    more.type = 'button';
    more.addEventListener('click', () => add(undefined, true));
    wrap.append(l, box, more);
    return { node: wrap, read: () => items.map((e) => e.read()).filter((x) => x !== '') };
  }

  /** Une photo de page : aperçu, choisir (ou glisser), retirer. Envoyée à l'enregistrement. */
  function photoField(f, value) {
    const wrap = el('div', 'field');
    const l = el('div', 'label-like', f.label);
    if (f.help) l.append(el('small', null, f.help));
    const box = el('div', 'photo page-photo');
    const img = el('img'); img.alt = '';
    const empty = el('p', null, 'Aucune image.');
    box.append(img, empty);
    let src = value || '', pending = null;
    const acts = el('div', 'row-actions');
    const pick = el('label', 'btn small file', 'Choisir une photo');
    const input = el('input'); input.type = 'file'; input.accept = 'image/jpeg,image/png,image/webp'; input.hidden = true;
    pick.append(input);
    const rm = el('button', 'btn small ghost', 'Retirer l’image'); rm.type = 'button';
    acts.append(pick, rm);
    const paint = () => {
      const shown = pending ? pending.url : src;
      img.hidden = !shown; empty.hidden = !!shown;
      if (shown) img.src = shown; else img.removeAttribute('src');
      rm.hidden = !f.removable || !shown;
    };
    const take = async (file) => {
      if (!file || !/^image\//.test(file.type)) return;
      try { pending = await shrink(file); paint(); } catch { showError('#page-error', 'Cette photo n’a pas pu être lue. Essayez une photo au format JPEG.'); }
    };
    input.addEventListener('change', () => take(input.files[0]));
    box.addEventListener('dragover', (e) => { e.preventDefault(); box.classList.add('over'); });
    box.addEventListener('dragleave', () => box.classList.remove('over'));
    box.addEventListener('drop', (e) => { e.preventDefault(); box.classList.remove('over'); take(e.dataTransfer.files[0]); });
    rm.addEventListener('click', () => { src = ''; pending = null; paint(); });
    paint();
    wrap.append(l, box, acts);
    return { node: wrap, read: () => src, pending: () => !!pending, upload: async (name) => {
      if (!pending) return;
      const up = await api('upload', { name, data: await toB64(pending.blob) });
      src = up.src; pending = null;
    } };
  }

  function buildField(f, data) {
    const v = getAt(data, f.p);
    if (f.type === 'photo') return photoField(f, v);
    if (f.type === 'lines') {
      // Une liste courte, un élément par ligne : plus lisible qu'une pile de blocs
      const orig = (v || []).join('\n');
      const t = textField('text', orig, f.label, f.help);
      t.node.querySelector('textarea').rows = Math.min(14, Math.max(4, (v || []).length + 1));
      return { ...t, read: () => { const x = t.read(); return x === orig ? v : x.split('\n').map((l) => l.trim()).filter(Boolean); } };
    }
    if (f.type === 'list') {
      return listField(f, v, (x) => {
        const t = textField(f.item, x);
        return { ...t, read: () => t.read() };
      });
    }
    if (f.type === 'objs') {
      return listField(f, v, (obj) => {
        const base = obj ? JSON.parse(JSON.stringify(obj)) : {};
        const box = el('div', 'sub');
        const parts = f.item
          .filter((sf) => !sf.optional || getAt(base, sf.p) !== undefined)
          .map((sf) => { const b = buildField(sf, base); box.append(b.node); return [sf, b]; });
        return { node: box, focus: () => box.querySelector('input,textarea,[contenteditable]')?.focus(), read: () => {
          const o = JSON.parse(JSON.stringify(base));
          for (const [sf, b] of parts) setAt(o, sf.p, b.read());
          return o;
        } };
      });
    }
    if (f.type === 'videos') {
      return listField({ ...f, add: 'une vidéo YouTube' }, v, (vid) => {
        const base = vid ? { ...vid } : {};
        const box = el('div', 'sub');
        const url = textField('line', base.id ? 'https://www.youtube.com/watch?v=' + base.id : '', 'Lien YouTube');
        const title = textField('line', base.title || '', 'Titre de la vidéo');
        const meta = textField('line', base.meta || '', 'Date et durée', 'Ex. : Juillet 2016 · 10 min 42');
        box.append(url.node, title.node, meta.node);
        return { node: box, focus: url.focus, read: () => {
          const id = youtubeId(url.read());
          if (!id) throw new Error('Un lien de vidéo n’est pas un lien YouTube. Copiez l’adresse de la vidéo depuis YouTube.');
          return { ...base, id, title: title.read(), meta: meta.read() };
        } };
      });
    }
    return textField(f.type, v, f.label, f.help);
  }

  function renderPages() {
    const box = $('#page-list');
    box.replaceChildren();
    for (const def of PAGES) {
      if (!files[def.path]) continue;
      const row = el('button', 'srow srow--page');
      row.type = 'button';
      const txt = el('span');
      txt.append(el('span', 't', def.title), Object.assign(el('span', 'm', def.sections.map((s) => s.legend).slice(0, 4).join(' · ') + '…'), { style: 'display:block' }));
      row.append(txt, el('span', 'go', 'Modifier →'));
      row.addEventListener('click', () => openPage(def));
      box.append(row);
    }
  }

  function openPage(def) {
    const data = json(def.path, null);
    if (!data) return status('err', 'Cette page n’a pas pu être lue. Rechargez, ou prévenez Morgan.');
    page = { def, data, fields: [] };
    $('#page-title').textContent = def.title;
    $('#page-see').href = SITE + def.url;
    const box = $('#page-fields');
    box.replaceChildren();
    // Une section par bloc de la page, repliée : on ouvre celle qu'on veut modifier.
    for (const s of def.sections) {
      const fs = el('details', 'card sec');
      fs.append(el('summary', null, s.legend));
      for (const f of s.fields) {
        if (getAt(data, f.p) === undefined && f.type !== 'list') continue; // champ absent de ce fichier
        const b = buildField(f, data);
        fs.append(b.node);
        page.fields.push([f, b]);
      }
      box.append(fs);
    }
    showError('#page-error', '');
    show('page');
  }

  function pageDirty() {
    if (!page) return false;
    if (page.fields.some(([, b]) => b.pending?.())) return true;
    try {
      const obj = JSON.parse(JSON.stringify(page.data));
      for (const [f, b] of page.fields) setAt(obj, f.p, b.read());
      return JSON.stringify(obj) !== JSON.stringify(page.data);
    } catch { return true; } // un lien YouTube en cours de saisie, par exemple
  }

  async function savePage(ev) {
    ev.preventDefault();
    const btn = $('#page-save');
    showError('#page-error', '');
    const photos = page.fields.filter(([, b]) => b.pending?.());
    let obj;
    try {
      obj = JSON.parse(JSON.stringify(page.data));
      for (const [f, b] of page.fields) setAt(obj, f.p, b.read());
    } catch (e) { return showError('#page-error', e.message); }
    if (!photos.length && JSON.stringify(obj) === JSON.stringify(page.data)) return status('ok', 'Rien n’a changé : il n’y avait rien à enregistrer.');
    btn.disabled = true;
    btn.textContent = photos.length ? 'Envoi de la photo…' : 'Enregistrement…';
    try {
      for (const [f, b] of photos) await b.upload(slugify(page.def.title + ' ' + f.label));
      if (photos.length) { for (const [f, b] of photos) setAt(obj, f.p, b.read()); btn.textContent = 'Enregistrement…'; }
      const p = page.def.path;
      const text = JSON.stringify(obj, null, 2) + '\n';
      const res = await api('save', { path: p, text, sha: files[p]?.sha, title: 'Page ' + page.def.title });
      files[p] = { sha: res.sha, text };
      page.data = obj;
      historyCache = null;
      show('pages');
      followDeploy();
    } catch (e) {
      showError('#page-error', e.message);
    } finally {
      btn.disabled = false;
      btn.textContent = 'Enregistrer';
    }
  }

  // ------------------------------------------------------------ Dates lisibles
  const DAY = 86400000;
  function when(iso) {
    const d = new Date(iso);
    if (isNaN(d)) return '';
    const t = new Date(); t.setHours(0, 0, 0, 0);
    const hour = d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }).replace(':', ' h ');
    if (d >= t) return 'aujourd’hui à ' + hour;
    if (d >= t - DAY) return 'hier à ' + hour;
    return 'le ' + d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: d.getFullYear() === t.getFullYear() ? undefined : 'numeric' });
  }

  // ------------------------------------------------------------ Accueil
  let siteState = null; // dernier état de la mise en ligne
  function renderHome() {
    const h = new Date().getHours();
    $('#hello').textContent = (h >= 18 || h < 5 ? 'Bonsoir' : 'Bonjour') + ' Christine';

    // Prochaines dates de tous les stages affichés, de la plus proche à la plus lointaine
    const today = Date.now() - DAY;
    const upcoming = [];
    let onRequest = 0;
    for (const f of fiches) {
      if (f.data.draft) continue;
      const ds = (f.data.dates || []).map(String);
      const next = ds.map((d) => ({ d, end: endOf(d) })).filter((x) => x.end !== null && x.end >= today);
      if (!next.length) { if (ds.length) onRequest++; continue; }
      for (const x of next) upcoming.push({ ...x, f });
    }
    upcoming.sort((a, b) => a.end - b.end);
    const box = $('#home-dates');
    box.replaceChildren();
    for (const x of upcoming.slice(0, 7)) {
      const row = el('button', 'date-row');
      row.type = 'button';
      row.append(el('span', 'dd', x.d), el('span', 'dt', x.f.data.title));
      row.addEventListener('click', () => openEditor(x.f));
      box.append(row);
    }
    if (!upcoming.length) box.append(el('p', 'hint', 'Aucune date à venir pour l’instant.'));
    const more = [];
    if (upcoming.length > 7) more.push(`et ${upcoming.length - 7} autre${upcoming.length - 7 > 1 ? 's' : ''} date${upcoming.length - 7 > 1 ? 's' : ''}`);
    if (onRequest) more.push(`${onRequest} stage${onRequest > 1 ? 's' : ''} sur demande`);
    $('#home-dates-more').textContent = more.length ? more.join(' · ').replace(/^./, (c) => c.toUpperCase()) + '.' : '';

    const infos = json(INFOS, {});
    $('#home-annonce').textContent = infos.annonce?.actif && infos.annonce.texte
      ? 'Annonce affichée : « ' + infos.annonce.texte + ' »'
      : 'Pas d’annonce en haut du site en ce moment.';
    showSiteState();
    homeHistory();
  }

  async function showSiteState() {
    const p = $('#home-site');
    try {
      if (!siteState) siteState = await api('status');
      const s = siteState;
      p.className = 'site-state ' + s.state;
      p.textContent = s.state === 'en-ligne' ? '✓ Votre site est à jour' + (s.since ? ' (mis à jour ' + when(s.since) + ')' : '') + '.'
        : s.state === 'en-cours' ? 'Mise en ligne en cours… Comptez 3 à 5 minutes.'
        : s.state === 'erreur' ? 'La dernière mise en ligne a rencontré un souci. Rien n’est perdu : prévenez Morgan.'
        : 'Votre site est en ligne.';
    } catch { p.className = 'site-state'; p.textContent = 'Votre site est en ligne.'; }
  }

  // ------------------------------------------------------------ Historique
  let historyCache = null;
  // Les essais de Morgan (installation de l'espace, 18 et 30/10) ne sont pas montrés à Christine.
  const HISTORY_FROM = '2026-10-30T17:20:00Z';
  async function getHistory() {
    if (!historyCache) {
      historyCache = (await api('history')).commits
        // Une photo seule va toujours avec l'enregistrement du stage ou de la page : on ne la montre pas
        .filter((c) => (!c.date || c.date >= HISTORY_FROM) && !/^Mon espace : ajoute la photo/.test(c.message));
    }
    return historyCache;
  }
  /** « Mon espace : modifie « X » » → { verb: 'Modification', what: 'X', undoable } */
  function describe(message) {
    const m = message.replace(/^Mon espace : /, '');
    const what = (m.match(/«\s*(.+?)\s*»/) || [])[1] || '';
    if (/^ajoute la photo/.test(m)) return { verb: 'Photo ajoutée', what: '', undoable: false };
    if (/^annule/.test(m)) return { verb: 'Annulation', what, undoable: true };
    if (/^ajoute/.test(m)) return { verb: 'Nouveau stage', what, undoable: false, added: true };
    return { verb: 'Modification', what, undoable: true };
  }

  async function homeHistory() {
    const ul = $('#home-history');
    try {
      const list = (await getHistory()).filter((c) => describe(c.message).what).slice(0, 5);
      ul.replaceChildren();
      for (const c of list) {
        const d = describe(c.message);
        const li = el('li');
        li.append(el('span', 'hv', d.verb + ' : '), el('span', 'hw', d.what), el('span', 'hd', ' · ' + when(c.date)));
        ul.append(li);
      }
      if (!list.length) ul.append(el('li', 'hint', 'Aucune modification pour l’instant.'));
    } catch { ul.replaceChildren(el('li', 'hint', 'L’historique n’a pas pu être lu pour le moment.')); }
  }

  async function renderHistory() {
    const box = $('#history');
    box.replaceChildren(el('p', 'hint', 'Un instant, je récupère vos modifications…'));
    let list;
    try { list = await getHistory(); } catch (e) { box.replaceChildren(el('p', 'error', e.message)); return; }
    box.replaceChildren();
    if (!list.length) box.append(el('p', 'hint', 'Aucune modification pour l’instant.'));
    for (const c of list) {
      const d = describe(c.message);
      const row = el('div', 'hrow');
      const txt = el('div');
      txt.append(el('p', 'ht', d.verb + (d.what ? ' : ' + d.what : '')), el('p', 'hm', when(c.date)));
      row.append(txt);
      if (d.undoable) {
        const b = el('button', 'btn small ghost', 'Annuler cette modification');
        b.type = 'button';
        b.addEventListener('click', () => undo(c, d, b));
        row.append(b);
      } else if (d.added) {
        // Un nouveau stage ne s'efface pas : on le retire du site (il reste dans Mes stages)
        const f = fiches.find((x) => x.data.title === d.what);
        if (f) {
          const hidden = !!f.data.draft;
          if (hidden) txt.append(el('p', 'hm', 'Retiré du site, gardé dans Mes stages.'));
          const b = el('button', 'btn small ghost', hidden ? 'Le remettre sur le site' : 'Retirer ce stage du site');
          b.type = 'button';
          b.addEventListener('click', () => setVisible(f, hidden, b));
          row.append(b);
        }
      }
      box.append(row);
    }
  }

  async function setVisible(f, visible, btn) {
    if (!visible && !confirm(`Retirer « ${f.data.title} » du site ?\n\nIl reste dans Mes stages, prêt à revenir.`)) return;
    btn.disabled = true;
    try {
      const d = { ...f.data };
      if (visible) delete d.draft; else d.draft = true;
      await api('save', { path: f.path, text: serialize(d, f.body), sha: f.sha, title: f.data.title });
      historyCache = null;
      await load('history');
      followDeploy();
    } catch (e) {
      status('err', e.message);
      btn.disabled = false;
    }
  }

  async function undo(c, d, btn) {
    if (!confirm(`Annuler « ${d.what} » ?\n\nLa page revient comme elle était juste avant cette modification.`)) return;
    btn.disabled = true;
    btn.textContent = 'Annulation…';
    try {
      await api('undo', { sha: c.sha });
      historyCache = null;
      await load('history');
      followDeploy();
    } catch (e) {
      status('err', e.message);
      btn.disabled = false;
      btn.textContent = 'Annuler cette modification';
    }
  }

  // ------------------------------------------------------------ Mes vidéos
  // La page Vidéos du site : thèmes → lignes (3 vidéos au plus) → identifiants YouTube
  // ou « soon » (place « Bientôt en ligne »). Les vidéos DVD des stages sont reprises
  // telles quelles ; les autres sont enregistrées dans `videos`. Fichier : videos.fr.json.
  const VIDEOS = 'v3-src/src/data/videos.fr.json';
  const SOON = 'soon';
  const PER_ROW = 3;
  let vstate = null;   // { themes, videos, hidden } en cours de modification
  let vdialog = null;  // où ajouter la vidéo : { ti, ri, ii } (ii = place à remplacer)
  const thumb = (id) => `https://i.ytimg.com/vi/${id}/mqdefault.jpg`;

  /** Les vidéos des stages, comme la page Vidéos les lit (DVD Debowska à part). */
  function catalog() {
    const map = new Map();
    const ordered = [...fiches].sort((a, b) => (a.data.order ?? 50) - (b.data.order ?? 50));
    for (const f of ordered) {
      const vids = [...(f.data.videos || []), ...(f.data.inlineMedia || []).map((m) => m && m.video).filter(Boolean)];
      for (const v of vids) {
        if (!v.id || map.has(v.id)) continue;
        map.set(v.id, { id: v.id, title: v.title || f.data.title, meta: v.meta || '', from: f.data.title, dvd: v.credit === 'debowska' });
      }
    }
    return map;
  }
  const videoInfo = (id) => vstate.videos.find((v) => v.id === id) || catalog().get(id) || { id, title: '', meta: '' };

  function resetVideos() {
    const d = json(VIDEOS, null);
    vstate = d ? { themes: d.themes || [], videos: d.videos || [], hidden: d.hidden || [], ...d } : null;
    if (vstate) vstate = JSON.parse(JSON.stringify(vstate));
  }
  function normalized(st) {
    const used = new Set(st.themes.flatMap((t) => t.rows.flat()));
    return {
      ...st,
      themes: st.themes.map((t) => ({ ...t, rows: t.rows.filter((r) => r.length) })),
      videos: st.videos.filter((v) => used.has(v.id)),
      hidden: [...new Set(st.hidden)].filter((id) => !used.has(id)),
    };
  }
  function videosDirty() {
    const d = json(VIDEOS, null);
    return !!(vstate && d) && JSON.stringify(normalized(vstate)) !== JSON.stringify(normalized({ themes: [], videos: [], hidden: [], ...d }));
  }

  function renderVideos() {
    if (!vstate) resetVideos();
    const box = $('#themes');
    box.replaceChildren();
    if (!vstate) { box.append(el('p', 'error', 'La page Vidéos n’a pas pu être lue. Rechargez, ou prévenez Morgan.')); return; }
    const cat = catalog();
    vstate.themes.forEach((t, ti) => {
      const card = el('section', 'card theme');
      const head = el('div', 'theme-head');
      const title = el('input');
      title.type = 'text';
      title.value = t.title;
      title.setAttribute('aria-label', 'Nom du thème');
      title.addEventListener('input', () => { t.title = title.value; });
      head.append(title, tool('↑', 'Monter ce thème', ti > 0, () => { vstate.themes.splice(ti - 1, 0, vstate.themes.splice(ti, 1)[0]); renderVideos(); }),
        tool('Supprimer le thème', 'Supprimer ce thème', true, () => {
          const n = t.rows.flat().filter((id) => id !== SOON).length;
          if (n && !confirm(`Supprimer le thème « ${t.title} » et ses ${n} vidéo${n > 1 ? 's' : ''} de la page Vidéos ?`)) return;
          for (const id of t.rows.flat()) if (cat.get(id)?.dvd) vstate.hidden.push(id);
          vstate.themes.splice(ti, 1); renderVideos();
        }, 'danger'));
      card.append(head);
      t.rows.forEach((row, ri) => {
        const line = el('div', 'vline');
        const lab = el('div', 'vline-head');
        lab.append(el('span', 'eyebrow', 'Ligne ' + (ri + 1)),
          tool('↑ Monter la ligne', 'Monter cette ligne', ri > 0, () => { t.rows.splice(ri - 1, 0, t.rows.splice(ri, 1)[0]); renderVideos(); }),
          tool('Retirer la ligne', 'Retirer cette ligne', true, () => { for (const id of row) if (cat.get(id)?.dvd) vstate.hidden.push(id); t.rows.splice(ri, 1); renderVideos(); }, 'danger'));
        const tiles = el('div', 'vtiles');
        row.forEach((id, ii) => tiles.append(tile(id, t, ti, ri, ii, cat)));
        if (row.length < PER_ROW) {
          const add = el('button', 'vtile vadd');
          add.type = 'button';
          add.append(el('span', 'plus', '+'), el('span', null, 'Ajouter une vidéo'));
          add.addEventListener('click', () => openVideoDialog({ ti, ri, ii: -1 }));
          tiles.append(add);
        }
        line.append(lab, tiles);
        card.append(line);
      });
      const addRow = el('button', 'btn small', '+ Ajouter une ligne');
      addRow.type = 'button';
      addRow.addEventListener('click', () => { t.rows.push([]); renderVideos(); });
      card.append(addRow);
      box.append(card);
    });

    // Vidéos DVD des stages rangées dans aucun thème
    const placed = new Set(vstate.themes.flatMap((t) => t.rows.flat()));
    const others = [...cat.values()].filter((v) => v.dvd && !placed.has(v.id));
    const ob = $('#others');
    ob.replaceChildren();
    if (!others.length) ob.append(el('p', 'hint', 'Toutes vos vidéos DVD sont rangées dans un thème.'));
    for (const v of others) {
      const hiddenNow = vstate.hidden.includes(v.id);
      const r = el('div', 'orow');
      const im = el('img'); im.src = thumb(v.id); im.alt = ''; im.loading = 'lazy';
      const txt = el('div');
      txt.append(el('p', 'ot', v.title), el('p', 'om', (hiddenNow ? 'Pas affichée sur la page Vidéos' : 'Affichée sous « Autres forums et conférences »') + ' · vient de la page « ' + v.from + ' »'));
      const sel = el('select');
      sel.setAttribute('aria-label', 'Ranger dans un thème');
      sel.append(new Option('Ranger dans le thème…', ''));
      vstate.themes.forEach((t, ti) => sel.append(new Option(t.title, String(ti))));
      sel.addEventListener('change', () => {
        if (sel.value === '') return;
        const t = vstate.themes[+sel.value];
        const last = t.rows[t.rows.length - 1];
        if (last && last.length < PER_ROW) last.push(v.id); else t.rows.push([v.id]);
        vstate.hidden = vstate.hidden.filter((x) => x !== v.id);
        renderVideos();
      });
      const tog = el('button', 'btn small ghost', hiddenNow ? 'Afficher' : 'Ne pas afficher');
      tog.type = 'button';
      tog.addEventListener('click', () => {
        vstate.hidden = hiddenNow ? vstate.hidden.filter((x) => x !== v.id) : [...vstate.hidden, v.id];
        renderVideos();
      });
      const acts = el('div', 'oacts');
      acts.append(sel, tog);
      r.append(im, txt, acts);
      ob.append(r);
    }
    $('#videos-save').disabled = !videosDirty();
  }

  function tool(label, title, enabled, fn, kind) {
    const b = el('button', 'tool' + (kind ? ' ' + kind : ''), label);
    b.type = 'button';
    b.title = title;
    b.disabled = !enabled;
    b.addEventListener('click', fn);
    return b;
  }

  function tile(id, t, ti, ri, ii, cat) {
    const row = t.rows[ri];
    const move = (to) => { row.splice(to, 0, row.splice(ii, 1)[0]); renderVideos(); };
    const box = el('div', 'vtile' + (id === SOON ? ' vsoon' : ''));
    if (id === SOON) {
      box.append(el('span', 'vs', 'Bientôt en ligne'), el('span', 'hint', 'Place réservée à une nouvelle vidéo'));
      const put = el('button', 'btn small', 'Mettre la vidéo');
      put.type = 'button';
      put.addEventListener('click', () => openVideoDialog({ ti, ri, ii }));
      box.append(put);
    } else {
      const v = videoInfo(id);
      const im = el('img'); im.src = thumb(id); im.alt = ''; im.loading = 'lazy';
      box.append(im, el('span', 'vt', v.title || 'Vidéo sans titre'), el('span', 'vm', [v.meta, cat.get(id) ? 'page « ' + cat.get(id).from + ' »' : ''].filter(Boolean).join(' · ')));
      if (!cat.get(id)) {
        const edit = el('button', 'link-dark', 'Changer le titre ou la date');
        edit.type = 'button';
        edit.addEventListener('click', () => openVideoDialog({ ti, ri, ii, edit: true }));
        box.append(edit);
      }
    }
    const acts = el('div', 'vacts');
    acts.append(tool('←', 'Vers la gauche', ii > 0, () => move(ii - 1)), tool('→', 'Vers la droite', ii < row.length - 1, () => move(ii + 1)),
      tool('Retirer', 'Retirer de la page Vidéos', true, () => { if (cat.get(id)?.dvd) vstate.hidden.push(id); row.splice(ii, 1); renderVideos(); }, 'danger'));
    box.append(acts);
    return box;
  }

  function openVideoDialog(where) {
    vdialog = where;
    const id = where.ii >= 0 ? vstate.themes[where.ti].rows[where.ri][where.ii] : null;
    const v = id && id !== SOON ? videoInfo(id) : null;
    $('#vdlg-title').textContent = where.edit ? 'Changer la vidéo' : id === SOON ? 'Mettre la vidéo à la place de « Bientôt en ligne »' : 'Ajouter une vidéo';
    $('#v-url').value = v ? 'https://www.youtube.com/watch?v=' + v.id : '';
    $('#v-title').value = v?.title || '';
    $('#v-meta').value = v?.meta || '';
    $('#vdlg-soon').hidden = where.ii >= 0;
    $('#vdlg-ok').textContent = where.ii >= 0 ? 'Valider' : 'Ajouter';
    showError('#vdlg-error', '');
    vPreview();
    $('#vdlg').showModal();
    $('#v-url').focus();
  }

  function vPreview() {
    const id = youtubeId($('#v-url').value.trim());
    $('#v-prev').hidden = !id;
    if (!id) return;
    $('#v-thumb').src = thumb(id);
    const known = catalog().get(id);
    $('#v-known').textContent = known ? `Cette vidéo est déjà sur la page « ${known.from} ».` : '';
    if (known && !$('#v-title').value) $('#v-title').value = known.title;
    if (known && !$('#v-meta').value) $('#v-meta').value = known.meta;
  }

  function placeVideo(id) {
    const { ti, ri, ii } = vdialog;
    const row = vstate.themes[ti].rows[ri];
    if (ii >= 0) row[ii] = id; else row.push(id);
    vstate.hidden = vstate.hidden.filter((x) => x !== id);
    $('#vdlg').close();
    renderVideos();
  }

  function submitVideo(e) {
    e.preventDefault();
    const id = youtubeId($('#v-url').value.trim());
    if (!id) return showError('#vdlg-error', 'Ce lien n’est pas un lien YouTube. Sur YouTube, cliquez sur « Partager » puis « Copier », et collez ici.');
    const title = $('#v-title').value.trim();
    if (!title) return showError('#vdlg-error', 'Donnez un titre à la vidéo.');
    const { ti, ri, ii } = vdialog;
    const current = ii >= 0 ? vstate.themes[ti].rows[ri][ii] : null;
    const elsewhere = vstate.themes.find((t) => t.rows.some((r) => r.includes(id)));
    if (elsewhere && id !== current) return showError('#vdlg-error', `Cette vidéo est déjà dans le thème « ${elsewhere.title} ».`);
    const known = catalog().get(id);
    if (!known?.dvd) {
      const meta = $('#v-meta').value.trim();
      const existing = vstate.videos.find((v) => v.id === id);
      if (existing) Object.assign(existing, { title, meta }); else vstate.videos.push({ id, title, meta });
    }
    placeVideo(id);
  }

  async function saveVideos() {
    const btn = $('#videos-save');
    showError('#videos-error', '');
    const used = new Set();
    for (const t of vstate.themes) {
      if (!t.title.trim()) return showError('#videos-error', 'Un thème n’a pas de nom.');
      t.title = t.title.trim();
      if (!t.id) {
        let base = slugify(t.title), id = base, n = 2;
        while (vstate.themes.some((o) => o !== t && o.id === id)) id = base + '-' + n++;
        t.id = id;
      }
      if (used.has(t.id)) t.id += '-' + vstate.themes.indexOf(t);
      used.add(t.id);
    }
    btn.disabled = true;
    btn.textContent = 'Enregistrement…';
    try {
      const obj = normalized(vstate);
      const text = JSON.stringify(obj, null, 2) + '\n';
      const res = await api('save', { path: VIDEOS, text, sha: files[VIDEOS]?.sha, title: 'Page Vidéos' });
      files[VIDEOS] = { sha: res.sha, text };
      resetVideos();
      historyCache = null;
      renderVideos();
      followDeploy();
    } catch (e) {
      showError('#videos-error', e.message);
    } finally {
      btn.textContent = 'Enregistrer';
      btn.disabled = !videosDirty();
    }
  }

  // ------------------------------------------------------------ Chargement
  async function load(view = 'home') {
    show('loading');
    const res = await api('load');
    files = {};
    for (const f of res.files) files[f.path] = { sha: f.sha, text: f.text };
    fiches = res.files.filter((f) => f.path.startsWith(FICHES)).map((f) => parseFiche(f.path, f.sha, f.text)).filter(Boolean);
    renderList();
    renderInfos();
    renderPages();
    resetVideos();
    show(view);
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
  $('#page-form').addEventListener('submit', savePage);
  $('#add-theme').addEventListener('click', () => { vstate.themes.push({ title: 'Nouveau thème', rows: [[]] }); renderVideos(); $$('#themes .theme-head input').pop()?.select(); });
  $('#videos-save').addEventListener('click', saveVideos);
  $('#videos-reset').addEventListener('click', () => { if (!videosDirty() || confirm('Abandonner vos changements dans Mes vidéos ?')) { resetVideos(); renderVideos(); } });
  $('#v-url').addEventListener('input', vPreview);
  $('#vdlg-form').addEventListener('submit', submitVideo);
  $('#vdlg-cancel').addEventListener('click', () => $('#vdlg').close());
  $('#vdlg-soon').addEventListener('click', () => placeVideo(SOON));
  // Le bouton « Enregistrer » s'allume dès qu'un nom de thème change
  $('#themes').addEventListener('input', () => ($('#videos-save').disabled = !videosDirty()));
  // Fermer l'onglet ou recharger avec des changements non enregistrés : le navigateur demande
  window.addEventListener('beforeunload', (e) => { if (unsaved()) { e.preventDefault(); e.returnValue = ''; } });
  // Boutons « aller à » (accueil, aide…)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-go]');
    if (!b) return;
    if (b.dataset.go === 'add-stage') openEditor(null); else show(b.dataset.go);
  });
  $('#page-back').addEventListener('click', () => show('pages'));
  $('#see-site').href = SITE;
  $('#home-see').href = SITE;
  $('#videos-see').href = SITE + 'videos/';
  $('#f-photo').addEventListener('change', (e) => pickPhoto(e.target.files[0]));
  $('#f-slide-input').addEventListener('change', (e) => { addSlides(e.target.files); e.target.value = ''; });
  const sdrop = $('#f-slides');
  sdrop.addEventListener('dragover', (e) => { e.preventDefault(); sdrop.classList.add('over'); });
  sdrop.addEventListener('dragleave', () => sdrop.classList.remove('over'));
  sdrop.addEventListener('drop', (e) => { e.preventDefault(); sdrop.classList.remove('over'); addSlides(e.dataTransfer.files); });
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
