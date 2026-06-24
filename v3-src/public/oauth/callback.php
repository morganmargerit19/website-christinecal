<?php
// Relais OAuth GitHub — PHP (OVH). Étape 2 : échange le code contre un jeton et
// le renvoie à la fenêtre du CMS (protocole postMessage Decap/Sveltia).
// Callback de l'OAuth App GitHub : https://<domaine>/oauth/callback.php
$cfg = @include __DIR__ . '/config.php';
$code = isset($_GET['code']) ? $_GET['code'] : '';
$status = 'error';
$payload = ['message' => 'Code OAuth manquant.'];

if ($code !== '' && $cfg && !empty($cfg['client_id'])) {
  $ch = curl_init('https://github.com/login/oauth/access_token');
  curl_setopt_array($ch, [
    CURLOPT_POST => true,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER => [
      'Accept: application/json',
      'Content-Type: application/json',
      'User-Agent: christinecal-cms',
    ],
    CURLOPT_POSTFIELDS => json_encode([
      'client_id' => $cfg['client_id'],
      'client_secret' => $cfg['client_secret'],
      'code' => $code,
    ]),
  ]);
  $res = curl_exec($ch);
  curl_close($ch);
  $data = $res ? json_decode($res, true) : null;
  if (!empty($data['access_token'])) {
    $status = 'success';
    $payload = ['token' => $data['access_token'], 'provider' => 'github'];
  } else {
    $payload = ['message' => isset($data['error_description']) ? $data['error_description'] : 'Jeton non obtenu.'];
  }
}

$message = 'authorization:github:' . $status . ':' . json_encode($payload);
header('Content-Type: text/html; charset=utf-8');
echo '<!doctype html><meta charset="utf-8"><p>Connexion en cours…</p><script>'
   . '(function(){function r(e){if(window.opener)window.opener.postMessage('
   . json_encode($message)
   . ',e.origin);window.removeEventListener("message",r,false);window.close();}'
   . 'window.addEventListener("message",r,false);'
   . 'if(window.opener)window.opener.postMessage("authorizing:github","*");})();</script>';
