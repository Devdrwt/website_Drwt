# Déploiement — Drwintech website

Stack : **Next.js 16 (standalone)** + **MySQL 8**, conteneurisée avec **Docker Compose**,
derrière **Caddy** (HTTPS automatique). Déploiement continu via **GitHub Actions** :
chaque push sur `main` construit une image, la publie sur **GHCR**, puis la redéploie
sur le **VPS Hostinger** en SSH.

```
GitHub push (main)
   └─▶ Actions: build image ──▶ GHCR (ghcr.io/devdrwt/website_drwt)
          └─▶ SSH au VPS ──▶ docker compose pull + up -d
                                 ├─ caddy  (80/443, TLS auto)
                                 ├─ app    (Next.js :3000)
                                 └─ db     (MySQL, volume persistant)
```

---

## 1. Préparation du VPS (une seule fois)

Connecté en SSH sur le VPS Hostinger (Ubuntu/Debian) :

```bash
# 1. Docker + Compose plugin
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER       # puis reconnecte-toi

# 2. Récupérer le dépôt (contient compose, Caddyfile, etc.)
sudo mkdir -p /opt/drwintech && sudo chown $USER /opt/drwintech
git clone https://github.com/Devdrwt/website_Drwt.git /opt/drwintech
cd /opt/drwintech

# 3. Créer le fichier d'environnement de production
cp .env.production.example .env
nano .env        # remplis tous les secrets (voir §3)
```

### DNS
Crée un enregistrement **A** (et **AAAA** si IPv6) pointant `drwintech.com`
(et `www` si besoin) vers l'IP du VPS. Caddy ne pourra émettre le certificat
TLS que si le DNS est correct et que les ports 80/443 sont ouverts au pare-feu :

```bash
sudo ufw allow 80 && sudo ufw allow 443 && sudo ufw allow OpenSSH && sudo ufw enable
```

---

## 2. Premier démarrage manuel

```bash
cd /opt/drwintech
# Connexion à GHCR pour tirer l'image (voir §4 pour le token)
echo "$GHCR_PAT" | docker login ghcr.io -u <ton-user-github> --password-stdin

docker compose pull
docker compose up -d
docker compose logs -f app      # vérifier "Starting Next.js server"
```

Au démarrage, l'`entrypoint` applique le schéma Prisma (`prisma db push`) sur MySQL.

### Créer un compte admin / charger les données de démo
Le seed (`prisma/seed.ts`) crée les comptes et le contenu de démo :

```bash
# Exécute le seed à l'intérieur du conteneur app
docker compose exec app node ./node_modules/prisma/build/index.js db seed || \
docker compose run --rm app sh -c "npx tsx prisma/seed.ts"
```
> Le seed nécessite `tsx` (devDependency) : si absent dans l'image runtime,
> lance-le ponctuellement depuis une machine ayant le repo + `DATABASE_URL`
> pointant vers le VPS, ou via un conteneur `node:22` jetable.

---

## 3. Variables d'environnement (`.env` sur le VPS)

| Variable | Rôle |
|---|---|
| `APP_IMAGE` | Image à déployer (par défaut `…:latest`). Sert au rollback. |
| `SITE_DOMAIN` | Domaine pour Caddy / certificat TLS. |
| `MYSQL_DATABASE` / `MYSQL_USER` / `MYSQL_PASSWORD` / `MYSQL_ROOT_PASSWORD` | Base MySQL (créée au 1er boot). |
| `AUTH_SECRET` | Secret NextAuth — `openssl rand -base64 32`. |
| `NEXT_PUBLIC_SITE_URL` | URL publique (SEO, métadonnées). |
| `NEXT_PUBLIC_WHATSAPP` / `_CONTACT_EMAIL` / `_PHONE` | Coordonnées affichées. |

> ⚠️ Les `NEXT_PUBLIC_*` sont **injectées au build** dans le bundle client.
> Pour le navigateur, c'est la valeur passée à GitHub Actions (build-args) qui
> compte — pas celle du `.env` runtime. Garde les deux cohérentes. Définis-les
> côté CI comme *Repository variables* (Settings ▸ Secrets and variables ▸
> Actions ▸ Variables) : `NEXT_PUBLIC_SITE_URL`, etc.

---

## 4. Secrets GitHub Actions (Settings ▸ Secrets ▸ Actions)

| Secret | Description |
|---|---|
| `VPS_HOST` | IP ou hostname du VPS. |
| `VPS_USER` | Utilisateur SSH (ex. `deploy` ou `root`). |
| `VPS_SSH_KEY` | Clé **privée** SSH (l'élément public est dans `~/.ssh/authorized_keys` du VPS). |
| `VPS_PORT` | *(optionnel)* port SSH, défaut 22. |
| `VPS_APP_DIR` | Chemin du repo sur le VPS, ex. `/opt/drwintech`. |
| `GHCR_PAT` | *(si le package GHCR est privé)* PAT classique avec `read:packages`. |

- La **publication** de l'image utilise le `GITHUB_TOKEN` intégré (aucun secret à créer).
- Le **pull** côté VPS a besoin d'un login GHCR. Deux options :
  1. Rendre le package public (GHCR ▸ package ▸ *Package settings* ▸ *Change visibility*) → tu peux retirer le `docker login` et `GHCR_PAT`.
  2. Garder privé et fournir `GHCR_PAT`.

### Clé SSH de déploiement
```bash
ssh-keygen -t ed25519 -C "github-deploy" -f deploy_key
# clé publique → sur le VPS :
cat deploy_key.pub >> ~/.ssh/authorized_keys
# clé privée (contenu de deploy_key) → secret GitHub VPS_SSH_KEY
```

---

## 5. Déploiement continu

Après la config ci-dessus, le cycle est automatique :

1. `git push origin main`
2. Actions construit et pousse `ghcr.io/devdrwt/website_drwt:latest` (+ tag `sha-…`).
3. Actions se connecte au VPS, fait `git pull`, `docker compose pull app`, `up -d`.

> Le workflow se déclenche sur **`main`**. Tu développes sur `dev` — ouvre une PR
> `dev → main` (ou change `branches: [main]` dans `.github/workflows/deploy.yml`).
> Tu peux aussi lancer le déploiement à la main via l'onglet **Actions ▸ Deploy ▸ Run workflow**.

---

## 6. Exploitation (runbook)

```bash
cd /opt/drwintech
docker compose ps                 # état des services
docker compose logs -f app        # logs applicatifs
docker compose restart app        # redémarrer l'app

# Mise à jour manuelle vers la dernière image
docker compose pull app && docker compose up -d

# Rollback vers une version précise (tag SHA listé dans GHCR)
echo 'APP_IMAGE=ghcr.io/devdrwt/website_drwt:sha-<commit>' >> .env
docker compose up -d app
```

### Sauvegarde / restauration MySQL
```bash
# Backup
docker compose exec db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' > backup_$(date +%F).sql
# Restore
cat backup.sql | docker compose exec -T db sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```
Planifie un backup quotidien via `cron` et stocke-le hors VPS.

---

## 7. Build local (test avant push)

```bash
# Image de prod
docker build -t drwintech-web .

# Stack complète en local
cp .env.production.example .env   # adapte SITE_DOMAIN=localhost et les mots de passe
docker compose up -d
```

---

## 8. Notes & limites

- **Schéma BD** : le projet utilise `prisma db push` (pas de migrations versionnées).
  Pour un historique de migrations en prod, passe à `prisma migrate deploy`
  (génère des migrations avec `prisma migrate dev` puis adapte l'entrypoint).
- **Uploads** : les fichiers `/app/private/uploads` sont sur un volume Docker
  (`uploads`) — préservés entre déploiements, à inclure dans tes sauvegardes.
- **Assets média** (vidéos/photos hero) : téléchargés pendant le build de l'image
  (best-effort). S'ils manquent, relance le build ou ajoute-les au repo.
