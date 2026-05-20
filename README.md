# Drwintech — Site web & plateforme

> **Push Beyond Today** — Site vitrine bilingue, espace client, back-office d'administration
> et dashboard interne de gestion de projets pour **Drwintech Inc.**

Plateforme web complète développée avec Next.js 16 : site marketing public (FR/EN),
authentification, CMS d'administration, espace client et un dashboard interne de suivi
de projets structuré selon la méthode **Design Thinking (double diamant)**.

---

## Sommaire

- [Aperçu](#aperçu)
- [Stack technique](#stack-technique)
- [Démarrage rapide](#démarrage-rapide)
- [Comptes de démonstration](#comptes-de-démonstration)
- [Scripts npm](#scripts-npm)
- [Structure du projet](#structure-du-projet)
- [Les 4 espaces de la plateforme](#les-4-espaces-de-la-plateforme)
- [Assets (vidéos & images)](#assets-vidéos--images)
- [Documentation détaillée](#documentation-détaillée)

---

## Aperçu

Le projet couvre quatre périmètres dans une seule application Next.js :

| Espace | URL | Public | Rôle requis |
|---|---|---|---|
| **Site public** | `/`, `/about`, `/services`, `/portfolio`, `/team`, `/careers`, `/contact` | Visiteurs | — |
| **Espace client** | `/dashboard`, `/projects`, `/invoices`, `/support` | Clients | `CLIENT` |
| **Back-office admin** | `/admin/*` | Administrateurs | `ADMIN` |
| **Dashboard interne** | `/internal/*` | Équipe Drwintech | `STAFF` ou `ADMIN` |

Le site est **bilingue** (français par défaut, anglais) et propose un **thème clair/sombre**.

---

## Stack technique

| Domaine | Choix |
|---|---|
| Framework | **Next.js 16** (App Router, Turbopack) |
| Langage | **TypeScript** |
| UI | **React 19**, **Tailwind CSS v4** |
| Animations | **Framer Motion** |
| Base de données | **MySQL** (via XAMPP) |
| ORM | **Prisma 6** |
| Authentification | **Auth.js v5** (NextAuth) — provider Credentials, sessions JWT |
| Internationalisation | **next-intl** (FR / EN, routing localisé) |
| Thème | **next-themes** (clair / sombre / système) |
| Formulaires | **react-hook-form** + **zod** |
| Icônes | **lucide-react** |

---

## Démarrage rapide

### Pré-requis

- **Node.js** ≥ 20 (testé sur 22.x)
- **XAMPP** avec **MySQL** démarré
- **npm** ≥ 10

### Installation

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer l'environnement
cp .env.example .env
#    puis éditer .env (voir section ci-dessous)

# 3. Créer la base de données MySQL
#    Depuis le panneau XAMPP, démarrer MySQL, puis :
mysql -u root -e "CREATE DATABASE drwintech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 4. Pousser le schéma Prisma et générer le client
npm run db:push
npm run db:generate

# 5. Peupler la base avec des données de démonstration
npm run db:seed

# 6. (Optionnel) Télécharger les assets vidéo + images
npm run assets:fetch

# 7. Lancer le serveur de développement
npm run dev
```

Le site est disponible sur **http://localhost:3000**.

### Variables d'environnement (`.env`)

```ini
# Connexion MySQL (XAMPP : utilisateur root sans mot de passe par défaut)
DATABASE_URL="mysql://root:@localhost:3306/drwintech"

# Auth.js — secret de session (générer avec : openssl rand -base64 32)
AUTH_SECRET="votre-secret-aléatoire"

# URL publique du site
NEXT_PUBLIC_SITE_URL="http://localhost:3000"
```

---

## Comptes de démonstration

Créés par `npm run db:seed` :

| Rôle | Email | Mot de passe | Accès |
|---|---|---|---|
| **Admin** | `admin@drwintech.com` | `Admin12345!` | Tout : site, admin, interne |
| **Staff** | `staff@drwintech.com` | `Staff12345!` | Dashboard interne (lecture) |
| **Client** | `client@demo.com` | `Client12345!` | Espace client |

> ⚠️ **À changer impérativement avant toute mise en production.**

---

## Scripts npm

| Commande | Description |
|---|---|
| `npm run dev` | Serveur de développement (Turbopack) |
| `npm run build` | Build de production |
| `npm run start` | Serveur de production |
| `npm run lint` | Linter ESLint |
| `npm run db:push` | Applique le schéma Prisma à la base |
| `npm run db:generate` | Génère le client Prisma |
| `npm run db:seed` | Peuple la base de données |
| `npm run db:studio` | Ouvre Prisma Studio (explorateur de BDD) |
| `npm run videos:fetch` | Télécharge les vidéos de fond (hero) |
| `npm run images:fetch` | Télécharge les images de fond (hero) |
| `npm run assets:fetch` | Télécharge vidéos **+** images |

---

## Structure du projet

```
website_Drwt/
├── prisma/
│   ├── schema.prisma          # Modèle de données complet
│   └── seed.ts                # Données de démonstration
├── scripts/
│   ├── download-videos.mjs    # Récupère les vidéos hero (Pexels)
│   └── download-images.mjs    # Récupère les images hero (Unsplash)
├── public/
│   ├── logo/                  # Logos officiels Drwintech
│   ├── videos/                # Vidéos de fond (non versionnées)
│   └── images/heroes/         # Images de fond (non versionnées)
├── private/
│   └── uploads/               # Fichiers internes uploadés (non versionnés)
├── messages/
│   ├── fr.json                # Traductions françaises
│   └── en.json                # Traductions anglaises
├── docs/                      # Documentation détaillée (voir plus bas)
└── src/
    ├── app/
    │   ├── [locale]/           # Routing internationalisé
    │   │   ├── (auth)/         # Connexion / inscription
    │   │   ├── (client)/       # Espace client
    │   │   ├── (admin)/        # Back-office d'administration
    │   │   ├── (internal)/     # Dashboard interne projets
    │   │   └── ...             # Pages publiques
    │   └── api/                # Routes API (auth, contact, upload…)
    ├── components/
    │   ├── animations/         # Composants d'animation réutilisables
    │   ├── sections/           # Sections de page (hero, services…)
    │   ├── layout/             # Navbar, footer, logo
    │   ├── ui/                 # Primitives UI (button, badge…)
    │   ├── admin/              # Composants du back-office
    │   ├── internal/           # Composants du dashboard interne
    │   └── client/             # Composants de l'espace client
    ├── lib/
    │   ├── actions/            # Server Actions (CRUD)
    │   ├── auth.ts             # Configuration Auth.js
    │   ├── admin-guard.ts      # Gardes de rôle (requireAdmin, requireStaff)
    │   ├── prisma.ts           # Client Prisma singleton
    │   ├── project-status.ts   # Constantes & libellés de statut projet
    │   └── site.ts             # Configuration globale du site
    └── i18n/                   # Configuration next-intl
```

---

## Les 4 espaces de la plateforme

### 1. Site public
Pages marketing bilingues : accueil (hero vidéo), à propos, services, portfolio
(avec études de cas double diamant), équipe, carrières, contact.
Animations : parallax, scroll horizontal, curseur personnalisé, compteurs animés.

### 2. Espace client (`CLIENT`)
Tableau de bord, suivi des projets, factures, tickets de support.

### 3. Back-office admin (`ADMIN`)
CMS complet : gestion des services, du portfolio, de l'équipe, des offres d'emploi,
des candidatures, des messages de contact et des clients.

### 4. Dashboard interne (`STAFF` / `ADMIN`)
Suivi de **tous les projets** de l'entreprise, présentés selon le **double diamant**,
avec ressources, documentation, références d'accès et notes.
→ Voir **[docs/INTERNAL.md](docs/INTERNAL.md)** pour le détail.

---

## Assets (vidéos & images)

Les fichiers lourds (vidéos hero, photos hero) **ne sont pas versionnés** dans Git.
Ils se téléchargent à la demande :

```bash
npm run assets:fetch     # vidéos + images
```

- **Vidéos** : 3 vidéos de fond depuis Pexels → `public/videos/`
- **Images** : 6 photos de fond depuis Unsplash → `public/images/heroes/`

Le `postinstall` tente automatiquement de les récupérer après `npm install`.
Les sources et le mapping page↔image sont documentés dans `scripts/download-images.mjs`.

---

## Documentation détaillée

| Document | Contenu |
|---|---|
| **[docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)** | Architecture, routing, modèle de données, rôles, i18n, thème |
| **[docs/INTERNAL.md](docs/INTERNAL.md)** | Guide complet du dashboard interne de projets |
| **[docs/DEPLOYMENT.md](docs/DEPLOYMENT.md)** | Mise en production, checklist de sécurité |

---

© Drwintech Inc. — Cotonou, Bénin.
