<?php
// MODÈLE. Le vrai oauth/config.php est généré automatiquement au déploiement OVH
// (workflow .github/workflows/deploy-ovh.yml) à partir des secrets GitHub
// CMS_GITHUB_CLIENT_ID / CMS_GITHUB_CLIENT_SECRET. Il n'est JAMAIS committé.
//
// (Pour un test manuel, copier ce fichier en config.php et renseigner les clés.)
return [
  'client_id' => 'VOTRE_CLIENT_ID',
  'client_secret' => 'VOTRE_CLIENT_SECRET',
];
