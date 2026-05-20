# Déploiement & mise en production

Guide de mise en production de la plateforme Drwintech.

---

## 1. Pré-requis serveur

- **Node.js** ≥ 20
- **MySQL** ≥ 8 (ou MariaDB ≥ 10.4)
- Un reverse proxy (Nginx / Apache) avec **HTTPS**

---

## 2. Variables d'environnement de production

Créer un `.env` (ou configurer les variables d'environnement de l'hébergeur) :

```ini
DATABASE_URL="mysql://UTILISATEUR:MOT_DE_PASSE@HOTE:3306/drwintech"
AUTH_SECRET="<openssl rand -base64 32>"
NEXT_PUBLIC_SITE_URL="https://drwintech.com"
```

> `AUTH_SECRET` **doit** être une valeur aléatoire forte et secrète.
> Ne jamais réutiliser la valeur de développement.

---

## 3. Build & démarrage

```bash
npm ci                  # installation reproductible
npm run db:generate     # client Prisma
npm run db:push         # applique le schéma (ou `prisma migrate deploy`)
npm run build           # build de production
npm run start           # démarre le serveur (port 3000 par défaut)
```

Placer le serveur derrière un process manager (PM2, systemd) et un reverse proxy.

---

## 4. Assets

Les vidéos et images de fond ne sont pas versionnées. Sur le serveur :

```bash
npm run assets:fetch
```

Ou copier manuellement les fichiers dans `public/videos/` et `public/images/heroes/`.

---

## 5. Checklist de sécurité

Avant l'ouverture au public :

- [ ] **`AUTH_SECRET`** régénéré (valeur unique, secrète).
- [ ] **Mots de passe de démonstration changés ou comptes supprimés**
      (`admin@drwintech.com`, `staff@drwintech.com`, `client@demo.com`).
- [ ] Base de données : utilisateur MySQL dédié **avec mot de passe** (pas `root`).
- [ ] **HTTPS** actif, redirection HTTP → HTTPS.
- [ ] Dossier **`private/uploads/`** non exposé par le serveur web.
- [ ] Sauvegardes automatiques de la base de données configurées.
- [ ] Variables d'environnement non commitées (`.env` est dans `.gitignore`).
- [ ] `npm run build` passe sans erreur ni avertissement bloquant.

---

## 6. Migrations de base de données

En développement, `npm run db:push` synchronise le schéma directement.

En production, préférer les **migrations versionnées** :

```bash
# Créer une migration (dev)
npx prisma migrate dev --name description_du_changement

# Appliquer les migrations (prod)
npx prisma migrate deploy
```

---

## 7. Sauvegardes

Sauvegarder régulièrement :

- la **base de données** (`mysqldump`),
- le dossier **`private/uploads/`** (fichiers internes des projets).

```bash
mysqldump -u UTILISATEUR -p drwintech > backup-$(date +%F).sql
```

---

## 8. Mise à jour

```bash
git pull
npm ci
npm run db:generate
npx prisma migrate deploy
npm run build
# redémarrer le process
```
