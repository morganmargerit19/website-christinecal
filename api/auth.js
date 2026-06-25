// Relais OAuth GitHub pour le CMS (Sveltia / Decap) — étape 1 : redirige vers GitHub.
// Déployé automatiquement par Vercel comme fonction serverless : https://<domaine>/api/auth
// Variables d'environnement à définir dans Vercel :
//   CMS_GITHUB_CLIENT_ID, CMS_GITHUB_CLIENT_SECRET (cf. CMS-CHRISTINE.md)
module.exports = (req, res) => {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  if (!clientId) {
    res.statusCode = 500;
    res.end('Configuration manquante : définissez CMS_GITHUB_CLIENT_ID dans Vercel.');
    return;
  }
  const proto = req.headers['x-forwarded-proto'] || 'https';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  const redirectUri = `${proto}://${host}/api/callback`;
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'repo,user',
    allow_signup: 'false',
  });
  res.statusCode = 302;
  res.setHeader('Location', `https://github.com/login/oauth/authorize?${params.toString()}`);
  res.end();
};
