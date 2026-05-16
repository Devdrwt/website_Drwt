# Drwintech — Site web officiel

Plateforme web bilingue (FR / EN) de **Drwintech Inc.**, refonte moderne du site existant avec back-office d'administration, espace client, et CMS intégré.

## Stack

- **Next.js 16** (App Router) + **TypeScript** + **React 19**
- **Tailwind CSS v4** (configuration dans `globals.css`, `@theme`)
- **Framer Motion** — animations
- **Prisma 6** + **MySQL** (XAMPP)
- **Auth.js v5** (next-auth beta) — credentials provider, rôles ADMIN / CLIENT
- **next-intl 4** — i18n FR/EN avec routing localisé (`as-needed`)
- **next-themes** — toggle dark / light
- **react-hook-form + zod** — formulaires validés

## Démarrage rapide

### 1. Pré-requis

- Node 22+ et npm 11+
- XAMPP avec MySQL démarré (`C:\xampp\mysql`)

### 2. Installation

```bash
npm install
cp .env.example .env   # ajuster si besoin (DB, AUTH_SECRET…)
```

### 3. Base de données

Démarrer MySQL depuis XAMPP Control Panel, puis :

```bash
# créer la base
"C:\xampp\mysql\bin\mysql.exe" -u root -e "CREATE DATABASE IF NOT EXISTS drwintech CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# pousser le schéma + générer le client
npm run db:push
npm run db:generate

# seed (admin + client démo + services + équipe…)
npm run db:seed
```

### 4. Lancer le dev

```bash
npm run dev
```

Site : http://localhost:3000

### Comptes de démo

| Rôle   | Email                    | Mot de passe   |
|--------|--------------------------|----------------|
| Admin  | admin@drwintech.com      | `Admin12345!`  |
| Client | client@demo.com          | `Client12345!` |

⚠️ **À changer en production** (modifier `AUTH_SECRET` dans `.env` + les mots de passe via le seed).

## Structure du projet

```
src/
├── app/
│   ├── layout.tsx                # racine HTML (polices, métadonnées)
│   ├── [locale]/                 # i18n routing (fr, en)
│   │   ├── layout.tsx            # Navbar / Footer / Providers
│   │   ├── page.tsx              # Accueil
│   │   ├── about/, services/, portfolio/, team/, careers/, contact/
│   │   ├── (auth)/sign-in, sign-up
│   │   ├── (client)/dashboard, projects, invoices, support
│   │   └── (admin)/admin/...
│   └── api/                      # contact, newsletter, register, auth/[...nextauth]
├── components/
│   ├── layout/                   # Navbar, Footer, Logo, WhatsAppFab
│   ├── sections/                 # Hero, Services, About, Portfolio, etc.
│   ├── ui/                       # Button, Input, Section, Badge, GradientText
│   ├── admin/                    # Sidebar, page shell, formulaires CRUD
│   ├── client/                   # Sidebar espace client
│   ├── theme-provider, theme-toggle, locale-switcher, session-provider
├── i18n/
│   ├── routing.ts, request.ts, navigation.ts
├── lib/
│   ├── prisma.ts, auth.ts, admin-guard.ts, cn.ts, site.ts
│   └── actions/                  # server actions CRUD (services, portfolio, team, jobs, messages, applications)
└── proxy.ts                      # middleware i18n (proxy.ts en Next 16)
messages/
├── fr.json, en.json              # traductions
prisma/
├── schema.prisma, seed.ts
```

## Design system

Tout est dans `src/app/globals.css` :

- **Tokens** : `--brand-50…950`, `--accent-from/via/to`, surfaces `--bg`, `--bg-elevated`, `--surface`, bordures, ombres, glow
- **Variant dark** : déclenché par classe `.dark` sur `<html>` (via `next-themes`)
- **Utilities custom** : `container-page`, `text-gradient`, `glass`, `glass-strong`, `card-elevated`, `surface-grid`, `surface-dots`, `ring-glow`, `btn-shine`
- **Animations keyframes** : `shimmer`, `float`, `blob`, `gradient`, `marquee`
- **Reduced motion** géré globalement

## Pages

### Publiques
- `/` Accueil (hero animé, services, à propos, process, portfolio, testimonials, CTA)
- `/about` `/services` `/services/[slug]` `/portfolio` `/team` `/careers` `/contact`
- `/sign-in` `/sign-up`

### Espace client (protégé)
- `/dashboard` — vue d'ensemble
- `/projects` — projets et jalons
- `/invoices` — factures (table)
- `/support` — tickets

### Back-office admin (rôle ADMIN)
- `/admin` — tableau de bord (compteurs)
- `/admin/services` (+ `/new` `/[id]`) — CRUD complet
- `/admin/portfolio` (+ `/new` `/[id]`)
- `/admin/team` (+ `/new` `/[id]`)
- `/admin/jobs` (+ `/new` `/[id]`)
- `/admin/applications` — change le statut des candidatures
- `/admin/messages` — messages de contact reçus
- `/admin/clients` — liste des utilisateurs CLIENT

## i18n

- Locale par défaut : `fr` (sans préfixe d'URL)
- `en` : `/en/about`, `/en/services`, etc.
- Bouton de bascule dans la navbar (composant `LocaleSwitcher`)
- Toutes les chaînes dans `messages/fr.json` + `messages/en.json` (mêmes clés)

## Scripts npm

```bash
npm run dev         # serveur de dev (Turbopack)
npm run build       # build production
npm run start       # serveur production
npm run lint        # ESLint
npm run db:generate # Prisma client
npm run db:push     # pousser le schéma sans migration
npm run db:migrate  # migration
npm run db:studio   # interface Prisma Studio
npm run db:seed     # seed (tsx prisma/seed.ts)
```

## Production — checklist

- [ ] Générer `AUTH_SECRET` : `openssl rand -base64 32`
- [ ] Mettre à jour `DATABASE_URL` (mot de passe MySQL prod)
- [ ] `NEXT_PUBLIC_SITE_URL=https://drwintech.com`
- [ ] Remplacer les mots de passe seed
- [ ] Désactiver les comptes démo
- [ ] Activer HTTPS et `AUTH_TRUST_HOST=false` derrière un reverse proxy
- [ ] Lancer `npm run build` puis `npm run start`

## Inspiration

- Visuel : Linear, Vercel, Stripe, nexastruct.org (dépassé)
- Fonctionnel : drwintech.com (refondu et étendu)
