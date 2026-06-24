<?php
// Relais OAuth GitHub — PHP (pour l'hébergement OVH, qui exécute PHP).
// Étape 1 : redirige vers GitHub. URL publique : https://<domaine>/oauth/auth.php
// Les clés sont dans oauth/config.php (généré au build CI à partir des secrets,
// jamais committé). Inerte tant que le site est servi par Vercel (PHP non exécuté).
$cfg = @include __DIR__ . '/config.php';
if (!$cfg || empty($cfg['client_id'])) {
  http_response_code(500);
  exit("OAuth non configuré : oauth/config.php manquant ou incomplet.");
}
$host = $_SERVER['HTTP_HOST'];
$dir = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'])), '/');
$redirect = 'https://' . $host . $dir . '/callback.php';
$params = http_build_query([
  'client_id' => $cfg['client_id'],
  'redirect_uri' => $redirect,
  'scope' => 'repo,user',
  'state' => bin2hex(random_bytes(12)),
  'allow_signup' => 'false',
]);
header('Location: https://github.com/login/oauth/authorize?' . $params);
