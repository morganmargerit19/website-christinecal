// Relais OAuth GitHub pour le CMS (Sveltia / Decap) — étape 1 : redirige vers GitHub.
// Déployé automatiquement par Vercel comme fonction serverless : https://<domaine>/api/auth
// Variables d'environnement à définir dans Vercel :
//   CMS_GITHUB_CLIENT_ID, CMS_GITHUB_CLIENT_SECRET (cf. CMS-CHRISTINE.md)
module.exports = (req, res) => {
  const clientId = process.env.CMS_GITHUB_CLIENT_ID;
  if (!clientId) {
    // DIAGNOSTIC TEMPORAIRE : liste les NOMS de variables vues par la fonction
    // (jamais les valeurs) pour repérer un nom mal orthographié / absent.
    const seen = Object.keys(process.env)
      .filter((k) => /cms|github/i.test(k))
      .sort();
    res.statusCode = 500;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end(
      'Configuration manquante : CMS_GITHUB_CLIENT_ID introuvable.\n\n' +
        'Variables vues par la fonction (noms uniquement) :\n' +
        (seen.length ? seen.join('\n') : '(aucune variable contenant « cms » ou « github »)') +
        '\n\nCMS_GITHUB_CLIENT_ID présent ? ' + ('CMS_GITHUB_CLIENT_ID' in process.env) +
        '\nCMS_GITHUB_CLIENT_SECRET présent ? ' + ('CMS_GITHUB_CLIENT_SECRET' in process.env),
    );
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
