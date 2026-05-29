# Runbook de déploiement — Next.js + Prisma/MySQL sur VPS (AlmaLinux + Webuzo/nginx)

Guide **passe-partout** pour déployer une app **Next.js (App Router) + Prisma/MySQL**
en **Docker**, derrière le **nginx de Webuzo** (reverse proxy + Certbot), avec
**déploiement continu GitHub Actions** (build → GHCR → SSH deploy).

Issu d'un déploiement réel (drwintech). Reprends-le tel quel pour chaque nouvelle app :
remplace les variables, suis la checklist, applique les templates.

---

## 0. Contexte / prérequis (déjà en place sur le VPS)

- **VPS** AlmaLinux 9, accès **root** SSH. IP : `69.62.108.213`.
- **Webuzo** gère **nginx** sur les ports **80/443** + plusieurs sites. On **ne touche pas** au global.
- Les vhosts sont des fichiers manuels dans **`/etc/nginx/conf.d/*.conf`**, SSL via **Certbot** (`certbot --nginx`).
- **MariaDB** Webuzo tourne sur `3306` (on ne l'utilise pas : chaque app a son MySQL en conteneur, réseau interne).
- **Docker + Compose** installés une fois pour toutes (cf. annexe A si VPS neuf).
- DNS du domaine géré chez **Hostinger** (zone DNS).

> ⚠️ **Règle d'or multi-apps** : chaque app doit avoir un **port loopback unique**, un
> **dossier unique**, un **sous-domaine unique** et un **fichier nginx unique**. La 1ʳᵉ app
> utilise `3000` ; la suivante `3001`, puis `3002`, etc.

---

## 1. Variables à définir (remplis ce tableau pour la nouvelle app)

| Variable | Exemple (1ʳᵉ app) | La tienne |
|---|---|---|
| `APP_NAME` (= nom dépôt / image, minuscules) | `website_drwt` | `__________` |
| `GH_OWNER` (org/user GitHub, minuscules) | `devdrwt` | `__________` |
| `REPO_URL` | `https://github.com/Devdrwt/website_Drwt.git` | `__________` |
| `SUBDOMAIN` (FQDN) | `webdrwt.drwintech.com` | `__________` |
| `APP_DIR` (sur le VPS) | `/opt/drwintech` | `/opt/______` |
| `HOST_PORT` (loopback **unique**) | `3000` | `300_` |
| `DB_NAME` / `DB_USER` | `drwintech` | `__________` |
| `COMPOSE_PROJECT` (= nom du dossier) | `drwintech` | `__________` |
| `DOCKER_NETWORK` (= `<project>_web`) | `drwintech_web` | `_______web` |

Image GHCR finale : `ghcr.io/<GH_OWNER>/<APP_NAME>` → ex. `ghcr.io/devdrwt/website_drwt`.

---

## 2. Préparation **côté code** (dans le dépôt de l'app)

### 2.1 `next.config.ts` — sortie standalone
```ts
const nextConfig: NextConfig = {
  output: "standalone",
  // ...
};
```

### 2.2 ⚠️ Pas d'accès BD pendant le build
Le conteneur de build **n'a pas** accès à MySQL. Toute page/fonction qui interroge Prisma
au build fait **échouer `next build`** (`Environment variable not found: DATABASE_URL`).
Solutions :

- Sur **chaque page publique sans paramètre** qui lit la BD (listes, accueil…) :
  ```ts
  export const dynamic = "force-dynamic";
  ```
- Sur les pages **`[slug]`** qui lisent la BD : `export const dynamic = "force-dynamic";`
  et **surtout PAS** de `generateStaticParams` qui interroge Prisma (le supprimer ou le rendre statique).
- Les pages derrière `auth()` (cookies) sont déjà dynamiques → OK.

> Vérifie en local **sans** base : mets `.env` de côté et lance `npm run build`.
> Aucune ligne `Failed to collect page data` ne doit apparaître.

### 2.3 `Dockerfile` (multi-stage, standalone + CLI Prisma isolé)
```dockerfile
# syntax=docker/dockerfile:1

# ---------- Builder ----------
FROM node:22-alpine AS builder
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY . .
ARG NEXT_PUBLIC_SITE_URL
# (ajoute ici les autres NEXT_PUBLIC_* de ton app — ils sont INLINÉS au build)
ENV NEXT_PUBLIC_SITE_URL=$NEXT_PUBLIC_SITE_URL NEXT_TELEMETRY_DISABLED=1
RUN npx prisma generate
RUN npm run build

# ---------- Runner ----------
FROM node:22-alpine AS runner
WORKDIR /app
RUN apk add --no-cache libc6-compat openssl
ENV NODE_ENV=production NEXT_TELEMETRY_DISABLED=1 PORT=3000 HOSTNAME=0.0.0.0
RUN addgroup -g 1001 -S nodejs && adduser -u 1001 -S nextjs -G nodejs

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Schéma + client Prisma (runtime de l'app)
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# ⚠️ CLI Prisma ISOLÉ avec TOUTES ses deps (sinon: Cannot find module 'effect')
RUN npm install --prefix /opt/prisma-cli prisma@6.19.3 --omit=dev --no-audit --no-fund

COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh && mkdir -p /app/private/uploads && chown -R nextjs:nodejs /app
USER nextjs
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
```
> Le conteneur écoute toujours sur `3000` **en interne** ; c'est le compose qui le mappe
> sur le `HOST_PORT` loopback choisi.

### 2.4 `docker-entrypoint.sh` (LF obligatoire)
```sh
#!/bin/sh
set -e
echo "→ Syncing database schema (prisma db push)..."
/opt/prisma-cli/node_modules/.bin/prisma db push --schema /app/prisma/schema.prisma --skip-generate
echo "→ Starting Next.js..."
exec node server.js
```

### 2.5 `.gitattributes` (évite que CRLF Windows casse le shebang)
```gitattributes
* text=auto eol=lf
*.sh text eol=lf
```

### 2.6 `.dockerignore`
```
node_modules
.next
.git
.github
.env
.env.*
!.env.example
*.md
private/uploads/*
```

### 2.7 `docker-compose.yml` (sans reverse proxy ; nginx hôte s'en charge)
```yaml
services:
  db:
    image: mysql:8.0
    restart: unless-stopped
    environment:
      MYSQL_DATABASE: ${MYSQL_DATABASE}
      MYSQL_USER: ${MYSQL_USER}
      MYSQL_PASSWORD: ${MYSQL_PASSWORD}
      MYSQL_ROOT_PASSWORD: ${MYSQL_ROOT_PASSWORD}
    command: --character-set-server=utf8mb4 --collation-server=utf8mb4_unicode_ci
    volumes: [db_data:/var/lib/mysql]
    healthcheck:
      test: ["CMD","mysqladmin","ping","-h","127.0.0.1","-uroot","-p${MYSQL_ROOT_PASSWORD}"]
      interval: 10s
      timeout: 5s
      retries: 15
      start_period: 30s
    networks: [web]

  app:
    image: ${APP_IMAGE}
    restart: unless-stopped
    depends_on:
      db: { condition: service_healthy }
    environment:
      DATABASE_URL: "mysql://${MYSQL_USER}:${MYSQL_PASSWORD}@db:3306/${MYSQL_DATABASE}"
      AUTH_SECRET: ${AUTH_SECRET}
      AUTH_TRUST_HOST: "true"
      NEXT_PUBLIC_SITE_URL: ${NEXT_PUBLIC_SITE_URL}
    volumes: [uploads:/app/private/uploads]
    ports:
      - "127.0.0.1:${HOST_PORT}:3000"   # ⚠️ loopback only + port UNIQUE par app
    networks: [web]

volumes: { db_data: , uploads: }
networks: { web: }
```

### 2.8 GitHub Actions — `.github/workflows/deploy.yml`
```yaml
name: Deploy
on:
  push: { branches: [main] }
  workflow_dispatch:
concurrency: { group: deploy-${{ github.ref }}, cancel-in-progress: true }
env:
  IMAGE_NAME: ghcr.io/<GH_OWNER>/<APP_NAME>

jobs:
  build:
    runs-on: ubuntu-latest
    permissions: { contents: read, packages: write }
    steps:
      - uses: actions/checkout@v4
      - uses: docker/setup-buildx-action@v3
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: ${{ github.actor }}, password: ${{ secrets.GITHUB_TOKEN }} }
      - id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.IMAGE_NAME }}
          tags: |
            type=raw,value=latest
            type=sha,format=long
      - uses: docker/build-push-action@v6
        with:
          context: .
          push: true
          tags: ${{ steps.meta.outputs.tags }}
          cache-from: type=gha
          cache-to: type=gha,mode=max
          build-args: |
            NEXT_PUBLIC_SITE_URL=${{ vars.NEXT_PUBLIC_SITE_URL || 'https://<SUBDOMAIN>' }}

  deploy:
    needs: build
    runs-on: ubuntu-latest
    steps:
      - name: Deploy over SSH
        env:
          VPS_HOST: ${{ secrets.VPS_HOST }}
          VPS_USER: ${{ secrets.VPS_USER }}
          VPS_PORT: ${{ secrets.VPS_PORT }}
          VPS_APP_DIR: ${{ secrets.VPS_APP_DIR }}
          SSH_KEY_B64: ${{ secrets.VPS_SSH_KEY }}   # clé privée en BASE64 (1 ligne)
        run: |
          mkdir -p ~/.ssh
          printf '%s' "$SSH_KEY_B64" | base64 -d > ~/.ssh/id_deploy
          chmod 600 ~/.ssh/id_deploy
          PORT="${VPS_PORT:-22}"
          ssh-keyscan -p "$PORT" "$VPS_HOST" >> ~/.ssh/known_hosts 2>/dev/null || true
          ssh -i ~/.ssh/id_deploy -p "$PORT" -o StrictHostKeyChecking=accept-new \
            "$VPS_USER@$VPS_HOST" \
            "set -e; cd '$VPS_APP_DIR'; git pull --ff-only; docker compose pull app; docker compose up -d; docker image prune -f"
```

### 2.9 `.env.production.example` (+ whitelister dans `.gitignore` : `!.env.production.example`)
```env
APP_IMAGE=ghcr.io/<GH_OWNER>/<APP_NAME>:latest
HOST_PORT=<HOST_PORT>
MYSQL_DATABASE=<DB_NAME>
MYSQL_USER=<DB_USER>
MYSQL_PASSWORD=change-me
MYSQL_ROOT_PASSWORD=change-me
AUTH_SECRET=change-me
NEXT_PUBLIC_SITE_URL=https://<SUBDOMAIN>
```

Commit/push tout ça sur `main`.

---

## 3. DNS (Hostinger)

hPanel → **Noms de domaine** → le domaine → **Zone DNS** → ajoute :
- Type `A`, Nom `<sous-domaine>`, Valeur `69.62.108.213` (IP du VPS).

Vérifie : `nslookup <SUBDOMAIN>` → doit renvoyer `69.62.108.213`.

---

## 4. Première mise en service (sur le VPS, en root)

```bash
# 4.1 Cloner
mkdir -p <APP_DIR>
git clone <REPO_URL> <APP_DIR>
cd <APP_DIR> && git checkout main

# 4.2 Créer le .env (secrets générés, caractères URL-safe pour le mot de passe DB)
AUTH_SECRET=$(openssl rand -base64 32)
DB_PASS=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)
DB_ROOT_PASS=$(openssl rand -base64 24 | tr -d '/+=' | cut -c1-24)
cat > .env <<EOF
APP_IMAGE=ghcr.io/<GH_OWNER>/<APP_NAME>:latest
HOST_PORT=<HOST_PORT>
MYSQL_DATABASE=<DB_NAME>
MYSQL_USER=<DB_USER>
MYSQL_PASSWORD=${DB_PASS}
MYSQL_ROOT_PASSWORD=${DB_ROOT_PASS}
AUTH_SECRET=${AUTH_SECRET}
NEXT_PUBLIC_SITE_URL=https://<SUBDOMAIN>
EOF
chmod 600 .env
```

> **Rends le package GHCR public** (sinon `docker pull` → `denied`) :
> GitHub → repo → Packages → `<APP_NAME>` → *Package settings* → *Change visibility* → **Public**.
> (Le build doit avoir tourné au moins une fois pour que le package existe.)

```bash
# 4.3 Tirer les images + démarrer
docker compose pull
docker compose up -d
docker compose ps                 # app + db doivent être "running"/"healthy"
docker compose logs app | tail -30
curl -I http://127.0.0.1:<HOST_PORT>   # attendu : HTTP 200 / 307
```

---

## 5. Reverse proxy nginx + HTTPS (Certbot)

```bash
cat > /etc/nginx/conf.d/<APP_NAME>.conf <<'EOF'
server {
    listen 80;
    server_name <SUBDOMAIN>;
    location / {
        proxy_pass http://127.0.0.1:<HOST_PORT>;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Connection "";
        proxy_read_timeout 60s;
        client_max_body_size 25m;
    }
}
EOF
# ⚠️ remplace <SUBDOMAIN> et <HOST_PORT> AVANT d'exécuter (le heredoc 'EOF' ne substitue pas)

nginx -t && systemctl reload nginx
certbot --nginx -d <SUBDOMAIN> --redirect --non-interactive
curl -I https://<SUBDOMAIN>        # attendu : HTTP/2 200
```
Certbot ajoute tout seul le bloc `listen 443 ssl` + la redirection au fichier `.conf`.

---

## 6. Seed de la base (compte admin + données), si l'app en a un

L'image runtime n'embarque pas `tsx`. On lance le seed via un conteneur Node jetable,
branché sur le **réseau Docker de l'app** :

```bash
cd <APP_DIR>
DB_USER=$(grep '^MYSQL_USER=' .env | cut -d= -f2-)
DB_PASS=$(grep '^MYSQL_PASSWORD=' .env | cut -d= -f2-)
DB_NAME=$(grep '^MYSQL_DATABASE=' .env | cut -d= -f2-)
docker run --rm --network <DOCKER_NETWORK> \
  -e DATABASE_URL="mysql://${DB_USER}:${DB_PASS}@db:3306/${DB_NAME}" \
  -v "$PWD":/app -w /app node:22-alpine \
  sh -c "apk add --no-cache openssl && npm install --no-save tsx bcryptjs @prisma/client prisma && npx prisma generate && npx tsx prisma/seed.ts"
```
> `<DOCKER_NETWORK>` = nom affiché à `docker compose up` (« Network xxx_web Created »).
> **Change le mot de passe admin** après la 1ʳᵉ connexion s'il vient d'un seed public.

---

## 7. Activer le déploiement continu (GitHub)

### 7.1 Clé SSH dédiée (sur le VPS)
```bash
ssh-keygen -t ed25519 -f ~/.ssh/<APP_NAME>_deploy -N "" -C "gha-<APP_NAME>"
cat ~/.ssh/<APP_NAME>_deploy.pub >> ~/.ssh/authorized_keys
chmod 600 ~/.ssh/authorized_keys
base64 -w0 ~/.ssh/<APP_NAME>_deploy; echo     # ⬅️ copie cette ligne (clé en base64)
```

### 7.2 Secrets du dépôt (Settings → Secrets and variables → Actions)
| Secret | Valeur |
|---|---|
| `VPS_HOST` | `69.62.108.213` |
| `VPS_USER` | `root` |
| `VPS_PORT` | `22` |
| `VPS_APP_DIR` | `<APP_DIR>` |
| `VPS_SSH_KEY` | la **clé en base64** (une ligne) |

> ⚠️ On stocke la clé **en base64** (1 ligne) : ça évite l'erreur `ssh: no key found`
> due aux retours-ligne mal collés. Le workflow la décode (`base64 -d`).

### 7.3 Tester
`git push` sur `main` (ou Actions → Run workflow). Les jobs **build** puis **deploy**
doivent passer ✅. À partir de là : **chaque push sur `main` déploie automatiquement.**

---

## 8. Exploitation (runbook)

```bash
cd <APP_DIR>
docker compose ps                          # état
docker compose logs -f app                 # logs live
docker compose pull app && docker compose up -d   # MAJ manuelle
docker compose restart app                 # redémarrer

# Rollback vers un tag précis (visibles sur GHCR : sha-xxxx)
echo 'APP_IMAGE=ghcr.io/<GH_OWNER>/<APP_NAME>:sha-<commit>' >> .env   # ou édite la ligne
docker compose up -d app

# Backup / restore MySQL
docker compose exec db sh -c 'exec mysqldump -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"' > backup_$(date +%F).sql
cat backup.sql | docker compose exec -T db sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD" "$MYSQL_DATABASE"'
```

---

## 9. Pièges rencontrés → solutions (mémo)

| Symptôme | Cause | Solution |
|---|---|---|
| `next build` : `Environment variable not found: DATABASE_URL` | Une page interroge Prisma au build | `force-dynamic` + retirer les `generateStaticParams` qui lisent la BD (§2.2) |
| Conteneur en `Restarting`, log `Cannot find module 'effect'` | CLI Prisma copié sans ses deps | CLI Prisma **isolé** dans `/opt/prisma-cli` (§2.3) |
| `docker pull` → `denied` | Package GHCR privé | Rendre le package **public** (§4) ou `docker login` avec un PAT `read:packages` |
| Deploy SSH : `ssh: no key found` | Clé privée mal collée (retours-ligne) | Clé en **base64** + `base64 -d` dans le workflow (§2.8 / §7) |
| `curl http://...` → 301 vers https | Redirection globale HTTP→HTTPS du VPS | Normal ; lance Certbot pour créer le bloc 443 (§5) |
| Le navigateur affiche une vieille URL/contenu client | `NEXT_PUBLIC_*` inlinés au **build** | Passer la bonne valeur en **build-arg** / *repo variable* (§2.8) |
| Port déjà utilisé au `up` | `HOST_PORT` partagé avec une autre app | Choisir un **port loopback unique** (§1) |

---

## Annexe A — Installer Docker sur un VPS AlmaLinux neuf (root)
```bash
dnf -y install dnf-plugins-core
dnf config-manager --add-repo https://download.docker.com/linux/centos/docker-ce.repo
dnf -y install docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
systemctl enable --now docker
docker --version && docker compose version
```

## Annexe B — Checklist express (nouvelle app)
- [ ] Code : `output: standalone`, `force-dynamic`, pas de `generateStaticParams` BD
- [ ] Fichiers : Dockerfile, entrypoint (LF), compose (port unique), workflow, `.dockerignore`, `.gitattributes`
- [ ] DNS A `<sous-domaine>` → IP VPS
- [ ] VPS : clone → `.env` → package GHCR public → `compose up` → `curl :PORT` OK
- [ ] nginx `/etc/nginx/conf.d/<app>.conf` + `certbot --nginx`
- [ ] Seed (si besoin) + changer mot de passe admin
- [ ] Clé SSH base64 + 5 secrets GitHub → push `main` → build+deploy verts
