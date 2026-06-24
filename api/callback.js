// Relais OAuth GitHub pour le CMS (Sveltia / Decap) — étape 2 : échange le code
// contre un jeton et le renvoie à la fenêtre du CMS (protocole postMessage Decap).
// Déployé par Vercel : https://<domaine>/api/callback (= callback de l'OAuth App GitHub).
module.exports = async (req, res) => {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  const clientSecret = process.env.CMS_GITHUB_CLIENT_SECRET;
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const code = new URL(req.url, `${proto}://${host}`).searchParams.get('code');

  let status = 'error';
  let payload = { message: 'Code OAuth manquant.' };

  if (code && clientId && clientSecret) {
    try {
      const r = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
      });
      const data = await r.json();
      if (data.access_token) {
        status = 'success';
        payload = { token: data.access_token, provider: 'github' };
      } else {
        payload = { message: data.error_description || data.error || 'Jeton non obtenu.' };
      }
    } catch (e) {
      payload = { message: String((e && e.message) || e) };
    }
  }

  const message = `authorization:github:${status}:${JSON.stringify(payload)}`;
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.end(`<!doctype html><html lang="fr"><head><meta charset="utf-8"></head>
<body><p>Connexion en cours…</p><script>
(function () {
  function receive(e) {
    if (window.opener) window.opener.postMessage(${JSON.stringify(message)}, e.origin);
    window.removeEventListener('message', receive, false);
    window.close();
  }
  window.addEventListener('message', receive, false);
  if (window.opener) window.opener.postMessage('authorizing:github', '*');
})();
</script></body></html>`);
};
