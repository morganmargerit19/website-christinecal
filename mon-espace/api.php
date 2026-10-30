<?php
/**
 * « Mon espace » — l'espace de gestion de Christine (API).
 *
 * Rôle : vérifier qu'il s'agit bien de Christine (mot de passe), puis lire et
 * enregistrer les fichiers de contenu du site dans le dépôt GitHub. Chaque
 * enregistrement est un commit : la mise en ligne automatique (GitHub Actions
 * → OVH) se déclenche toute seule, et tout reste annulable dans l'historique.
 *
 * La clé GitHub et le mot de passe ne sont JAMAIS dans ce dossier : ils sont
 * dans mon-espace-config.php, rangé HORS du dossier public du site (voir
 * INSTALLATION.md). Le navigateur ne voit jamais la clé.
 *
 * Seuls quelques chemins sont modifiables (fiches FR, quelques fichiers de
 * données, photos) : impossible de toucher au code du site depuis cet espace.
 */

declare(strict_types=1);

// Toujours une réponse JSON lisible par l'espace : pas d'avertissement PHP
// mêlé à la réponse, et une erreur fatale devient un message d'erreur.
ini_set('display_errors', '0');
ob_start();
register_shutdown_function(function (): void {
    $e = error_get_last();
    if (!$e || !in_array($e['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_COMPILE_ERROR], true)) return;
    while (ob_get_level()) ob_end_clean();
    if (!headers_sent()) http_response_code(500);
    $msg = preg_replace('#(/[^\s/:]+)+/#', '', $e['message']);
    echo json_encode(['ok' => false, 'error' => 'Erreur du serveur : ' . $msg], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
});

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');

// ---------------------------------------------------------------- Config
function config(): array
{
    static $cfg = null;
    if ($cfg !== null) return $cfg;
    $candidates = array_filter([
        getenv('MON_ESPACE_CONFIG') ?: null,
        dirname(__DIR__, 2) . '/mon-espace-config.php', // ~/mon-espace-config.php (www/mon-espace/api.php)
        dirname(__DIR__) . '/../mon-espace-config.php',
    ]);
    foreach ($candidates as $file) {
        if (is_file($file)) {
            $cfg = require $file;
            break;
        }
    }
    if (!is_array($cfg) || empty($cfg['password_hash']) || empty($cfg['github_token'])) {
        fail(500, "L'espace n'est pas encore configuré (fichier mon-espace-config.php introuvable).");
    }
    $cfg += [
        'email' => '',
        'repo' => 'morganmargerit19/website-christinecal',
        'branch' => 'main',
        'api_base' => 'https://api.github.com',
        'author_name' => 'Christine CAL (Mon espace)',
        'author_email' => 'cc.christinecal@gmail.com',
        'workflow' => 'deploy-ovh.yml',
        'secure_cookie' => true,
    ];
    return $cfg;
}

// Chemins du dépôt que l'espace a le droit de lire / écrire.
const FICHES_DIR = 'v3-src/src/content/fiches';
const IMAGES_DIR = 'v3-src/public/images/stages';
const DATA_FILES = [
    'v3-src/src/data/infos.json',
    'v3-src/src/data/eveil-a-soi.fr.json',
    'v3-src/src/data/eveil-au-soi.fr.json',
    'v3-src/src/data/about.fr.json',
    'v3-src/src/data/mission.fr.json',
    'v3-src/src/data/videos.fr.json',
];

function allowed_text_path(string $path): bool
{
    return (bool) preg_match('#^' . FICHES_DIR . '/[a-z0-9][a-z0-9-]{0,80}\.mdx?$#', $path)
        || in_array($path, DATA_FILES, true);
}

// ---------------------------------------------------------------- Réponses
function fail(int $code, string $message): never
{
    if (ob_get_level()) ob_clean();
    http_response_code($code);
    echo json_encode(['ok' => false, 'error' => $message], JSON_UNESCAPED_UNICODE | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

function ok(array $data = []): never
{
    if (ob_get_level()) ob_clean();
    echo json_encode(['ok' => true] + $data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

// ---------------------------------------------------------------- Session
function start_session(): void
{
    $cfg = config();
    session_name('monespace');
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => dirname($_SERVER['SCRIPT_NAME']) ?: '/',
        'secure' => (bool) $cfg['secure_cookie'],
        'httponly' => true,
        'samesite' => 'Strict',
    ]);
    session_start();
    // Déconnexion automatique après 8 h d'inactivité
    if (!empty($_SESSION['seen']) && time() - $_SESSION['seen'] > 8 * 3600) {
        $_SESSION = [];
        session_regenerate_id(true);
    }
    $_SESSION['seen'] = time();
    if (empty($_SESSION['csrf'])) $_SESSION['csrf'] = bin2hex(random_bytes(32));
}

function require_login(): void
{
    if (empty($_SESSION['user'])) fail(401, 'Session expirée : reconnectez-vous.');
    $sent = $_SERVER['HTTP_X_CSRF'] ?? '';
    if (!hash_equals($_SESSION['csrf'], $sent)) fail(403, 'Requête refusée. Rechargez la page.');
}

// Limite les essais de mot de passe : 5 échecs par quart d'heure et par adresse.
function throttle_file(): string
{
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'inconnu';
    return sys_get_temp_dir() . '/monespace-' . hash('sha256', $ip . __FILE__) . '.json';
}

function too_many_attempts(): bool
{
    $f = throttle_file();
    $data = is_file($f) ? json_decode((string) file_get_contents($f), true) : null;
    $recent = array_filter($data['fails'] ?? [], fn ($t) => $t > time() - 900);
    return count($recent) >= 5;
}

function record_failure(): void
{
    $f = throttle_file();
    $data = is_file($f) ? json_decode((string) file_get_contents($f), true) : [];
    $fails = array_values(array_filter($data['fails'] ?? [], fn ($t) => $t > time() - 900));
    $fails[] = time();
    file_put_contents($f, json_encode(['fails' => $fails]), LOCK_EX);
}

// ---------------------------------------------------------------- GitHub
function gh(string $method, string $endpoint, ?array $body = null): array
{
    $cfg = config();
    $ch = curl_init(rtrim($cfg['api_base'], '/') . $endpoint);
    $headers = [
        'Authorization: Bearer ' . $cfg['github_token'],
        'Accept: application/vnd.github+json',
        'X-GitHub-Api-Version: 2022-11-28',
        'User-Agent: christinecal-mon-espace',
    ];
    if ($body !== null) $headers[] = 'Content-Type: application/json';
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_TIMEOUT => 30,
        CURLOPT_POSTFIELDS => $body !== null ? json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) : null,
    ]);
    $raw = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_RESPONSE_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($raw === false) fail(502, "GitHub ne répond pas ($err). Réessayez dans un instant.");
    return [$status, json_decode((string) $raw, true)];
}

function repo_path(string $path): string
{
    return '/repos/' . config()['repo'] . '/contents/' . implode('/', array_map('rawurlencode', explode('/', $path)));
}

/** Plusieurs fichiers en parallèle (liste des stages : une seule attente). */
function gh_get_many(array $paths): array
{
    $cfg = config();
    $mh = curl_multi_init();
    $handles = [];
    foreach ($paths as $p) {
        $ch = curl_init(rtrim($cfg['api_base'], '/') . repo_path($p) . '?ref=' . rawurlencode($cfg['branch']));
        curl_setopt_array($ch, [
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTPHEADER => [
                'Authorization: Bearer ' . $cfg['github_token'],
                'Accept: application/vnd.github+json',
                'X-GitHub-Api-Version: 2022-11-28',
                'User-Agent: christinecal-mon-espace',
            ],
        ]);
        curl_multi_add_handle($mh, $ch);
        $handles[$p] = $ch;
    }
    do {
        $status = curl_multi_exec($mh, $running);
        if ($running) curl_multi_select($mh);
    } while ($running && $status === CURLM_OK);
    $out = [];
    foreach ($handles as $p => $ch) {
        $json = json_decode((string) curl_multi_getcontent($ch), true);
        if (is_array($json) && isset($json['content'], $json['sha'])) {
            $out[] = ['path' => $p, 'sha' => $json['sha'], 'text' => base64_decode(str_replace("\n", '', $json['content']))];
        }
        curl_multi_remove_handle($mh, $ch);
        curl_close($ch);
    }
    curl_multi_close($mh);
    return $out;
}

function commit_file(string $path, string $bytes, ?string $sha, string $message): array
{
    $cfg = config();
    $body = [
        'message' => $message,
        'content' => base64_encode($bytes),
        'branch' => $cfg['branch'],
        'committer' => ['name' => $cfg['author_name'], 'email' => $cfg['author_email']],
    ];
    if ($sha) $body['sha'] = $sha;
    [$status, $json] = gh('PUT', repo_path($path), $body);
    if ($status === 409 || $status === 422 && strpos((string) ($json['message'] ?? ''), 'sha') !== false) {
        fail(409, "Cette page vient d'être modifiée ailleurs. Rechargez pour voir la dernière version.");
    }
    if ($status >= 300) fail(502, "L'enregistrement a échoué (GitHub $status). Réessayez ; rien n'a été perdu.");
    return ['sha' => $json['content']['sha'] ?? null, 'commit' => $json['commit']['sha'] ?? null];
}

/** Un fichier du dépôt à une version donnée (branche ou commit), ou null. */
function gh_file(string $path, string $ref): ?array
{
    [$status, $json] = gh('GET', repo_path($path) . '?ref=' . rawurlencode($ref));
    if ($status >= 300 || !is_array($json) || !isset($json['content'], $json['sha'])) return null;
    return ['sha' => $json['sha'], 'text' => base64_decode(str_replace("\n", '', $json['content']))];
}

/** « Mon espace : modifie « Le Nouveau Bugarach » » → « Le Nouveau Bugarach ». */
function change_title(string $message): string
{
    return preg_match('/«\s*(.+?)\s*»/u', $message, $m) ? $m[1] : 'la modification';
}

// ---------------------------------------------------------------- Actions
if ($_SERVER['REQUEST_METHOD'] !== 'POST') fail(405, 'Méthode non autorisée.');
$input = json_decode((string) file_get_contents('php://input'), true) ?: [];
$action = (string) ($input['action'] ?? '');

start_session();

switch ($action) {
    case 'me':
        ok(['loggedIn' => !empty($_SESSION['user']), 'csrf' => $_SESSION['csrf']]);

    case 'login':
        if (too_many_attempts()) fail(429, 'Trop d’essais. Patientez un quart d’heure, ou appelez Morgan.');
        $cfg = config();
        $email = strtolower(trim((string) ($input['email'] ?? '')));
        $password = (string) ($input['password'] ?? '');
        $emailOk = $cfg['email'] === '' || hash_equals(strtolower($cfg['email']), $email);
        if (!$emailOk || !password_verify($password, $cfg['password_hash'])) {
            record_failure();
            usleep(400000);
            fail(401, 'E-mail ou mot de passe incorrect.');
        }
        session_regenerate_id(true);
        $_SESSION['user'] = 'christine';
        $_SESSION['csrf'] = bin2hex(random_bytes(32));
        ok(['csrf' => $_SESSION['csrf']]);

    case 'logout':
        $_SESSION = [];
        session_destroy();
        ok();

    case 'load':
        require_login();
        $cfg = config();
        [$status, $list] = gh('GET', repo_path(FICHES_DIR) . '?ref=' . rawurlencode($cfg['branch']));
        if ($status >= 300 || !is_array($list)) fail(502, 'Impossible de lire les stages pour le moment.');
        $paths = [];
        foreach ($list as $item) {
            if (($item['type'] ?? '') === 'file' && allowed_text_path($item['path'] ?? '')) $paths[] = $item['path'];
        }
        $files = gh_get_many(array_merge($paths, DATA_FILES));
        ok(['files' => $files]);

    case 'save':
        require_login();
        $path = (string) ($input['path'] ?? '');
        $text = isset($input['text64']) ? base64_decode((string) $input['text64'], true) : (string) ($input['text'] ?? '');
        if ($text === false) fail(400, 'Texte illisible.');
        $sha = isset($input['sha']) && $input['sha'] !== '' ? (string) $input['sha'] : null;
        $title = trim(preg_replace('/\s+/', ' ', (string) ($input['title'] ?? '')) ?? '');
        if (!allowed_text_path($path)) fail(400, 'Ce fichier ne peut pas être modifié depuis cet espace.');
        if (strlen($text) > 300000) fail(413, 'Le texte est trop long.');
        $isJson = substr($path, -5) === '.json';
        if ($isJson && json_decode($text) === null) fail(400, 'Données invalides.');
        if (!$isJson && !preg_match('/^---\n.+?\n---\n/s', $text)) fail(400, 'Fiche invalide.');
        $msg = 'Mon espace : ' . ($sha ? 'modifie' : 'ajoute') . ' « ' . mb_substr($title ?: basename($path), 0, 80) . ' »';
        ok(commit_file($path, $text, $sha, $msg));

    case 'upload':
        require_login();
        $data = base64_decode((string) ($input['data'] ?? ''), true);
        if ($data === false || strlen($data) < 100) fail(400, 'Photo illisible.');
        if (strlen($data) > 6 * 1024 * 1024) fail(413, 'Photo trop lourde (6 Mo au plus).');
        $info = @getimagesizefromstring($data);
        $ext = [IMAGETYPE_JPEG => 'jpg', IMAGETYPE_PNG => 'png', IMAGETYPE_WEBP => 'webp'][$info[2] ?? 0] ?? null;
        if (!$ext) fail(415, 'Format de photo non accepté (JPEG, PNG ou WebP).');
        $base = strtolower(preg_replace('/[^a-z0-9]+/i', '-', iconv('UTF-8', 'ASCII//TRANSLIT', (string) ($input['name'] ?? 'photo')) ?: 'photo'));
        $base = trim(substr($base, 0, 50), '-') ?: 'photo';
        $file = $base . '-' . date('Ymd-His') . '.' . $ext;
        commit_file(IMAGES_DIR . '/' . $file, $data, null, 'Mon espace : ajoute la photo ' . $file);
        ok(['src' => '/images/stages/' . $file, 'width' => $info[0], 'height' => $info[1]]);

    case 'status':
        require_login();
        $cfg = config();
        [$status, $json] = gh('GET', '/repos/' . $cfg['repo'] . '/actions/workflows/' . rawurlencode($cfg['workflow']) . '/runs?per_page=1&branch=' . rawurlencode($cfg['branch']));
        $run = $json['workflow_runs'][0] ?? null;
        if ($status >= 300 || !$run) ok(['state' => 'inconnu']);
        $state = $run['status'] === 'completed' ? ($run['conclusion'] === 'success' ? 'en-ligne' : 'erreur') : 'en-cours';
        ok(['state' => $state, 'since' => $run['created_at'] ?? null, 'commit' => $run['head_sha'] ?? null]);

    case 'history':
        // Les dernières modifications faites depuis Mon espace, les plus récentes d'abord.
        require_login();
        $cfg = config();
        [$status, $list] = gh('GET', '/repos/' . $cfg['repo'] . '/commits?sha=' . rawurlencode($cfg['branch'])
            . '&author=' . rawurlencode($cfg['author_email']) . '&per_page=40');
        if ($status >= 300 || !is_array($list)) fail(502, "L'historique ne peut pas être lu pour le moment. Réessayez dans un instant.");
        $out = [];
        foreach ($list as $c) {
            $msg = (string) ($c['commit']['message'] ?? '');
            if (strpos($msg, 'Mon espace : ') !== 0) continue;
            $out[] = ['sha' => (string) ($c['sha'] ?? ''), 'message' => $msg, 'date' => $c['commit']['committer']['date'] ?? ($c['commit']['author']['date'] ?? null)];
        }
        ok(['commits' => $out]);

    case 'undo':
        // Remet les fichiers comme avant une modification de Christine. Refusé si un de ces
        // fichiers a changé depuis : on n'efface jamais une modification plus récente.
        require_login();
        $cfg = config();
        $sha = (string) ($input['sha'] ?? '');
        if (!preg_match('/^[0-9a-f]{40}$/', $sha)) fail(400, 'Modification inconnue.');
        [$status, $c] = gh('GET', '/repos/' . $cfg['repo'] . '/commits/' . $sha);
        if ($status >= 300 || !is_array($c)) fail(502, 'Cette modification ne peut pas être lue pour le moment. Réessayez dans un instant.');
        if (strtolower((string) ($c['commit']['author']['email'] ?? '')) !== strtolower($cfg['author_email'])) {
            fail(403, 'Seules les modifications faites depuis Mon espace peuvent être annulées ici.');
        }
        $parent = (string) ($c['parents'][0]['sha'] ?? '');
        if ($parent === '') fail(400, 'Cette modification ne peut pas être annulée.');
        $paths = [];
        foreach (($c['files'] ?? []) as $f) {
            $path = (string) ($f['filename'] ?? '');
            if (allowed_text_path($path) && ($f['status'] ?? '') === 'modified') $paths[] = $path;
        }
        if (!$paths) {
            fail(400, "Un nouveau stage ou une photo ne s'annule pas ici. Pour retirer un stage du site, ouvrez-le et décochez « Afficher ce stage sur le site ».");
        }
        $plan = [];
        foreach ($paths as $path) {
            $then = gh_file($path, $sha);
            $now = gh_file($path, $cfg['branch']);
            $before = gh_file($path, $parent);
            if ($then === null || $now === null || $before === null) fail(502, 'Cette modification ne peut pas être lue pour le moment. Réessayez dans un instant.');
            if ($now['text'] !== $then['text']) {
                fail(409, 'Cette page a été modifiée de nouveau depuis. Annulez d’abord la modification la plus récente, en haut de la liste.');
            }
            $plan[] = [$path, $before['text'], $now['sha']];
        }
        $title = change_title((string) ($c['commit']['message'] ?? ''));
        foreach ($plan as $step) {
            commit_file($step[0], $step[1], $step[2], 'Mon espace : annule « ' . mb_substr($title, 0, 80) . ' »');
        }
        ok(['files' => count($plan), 'title' => $title]);

    default:
        fail(400, 'Action inconnue.');
}
