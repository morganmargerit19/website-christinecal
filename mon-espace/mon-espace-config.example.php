<?php
/*
 * Configuration de « Mon espace ». À COPIER sur le serveur OVH sous le nom
 * mon-espace-config.php, DANS LE DOSSIER PERSONNEL (au-dessus de « www »),
 * jamais dans le site public. Voir INSTALLATION.md.
 */
return [
    // E-mail de connexion de Christine
    'email' => 'cc.christinecal@gmail.com',
    // Empreinte du mot de passe (jamais le mot de passe lui-même). Pour la créer
    // sur un Mac : htpasswd -bnBC 12 "" 'LE-MOT-DE-PASSE' | tr -d ':\n'
    'password_hash' => '$2y$12$REMPLACER-PAR-L-EMPREINTE',
    // Clé GitHub « fine-grained », limitée au dépôt website-christinecal :
    // Contents = Read and write, Actions = Read-only, Metadata = Read-only.
    'github_token' => 'github_pat_REMPLACER',
    'repo' => 'morganmargerit19/website-christinecal',
    'branch' => 'main',
];
