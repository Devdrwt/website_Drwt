# Architecture

Documentation technique du projet Drwintech : routing, modèle de données, rôles,
internationalisation et thème.

---

## 1. Application Next.js

Le projet utilise **Next.js 16** avec l'**App Router** et **Turbopack**.

- **Server Components par défaut** — les composants interactifs sont marqués `"use client"`.
- **Server Actions** pour les mutations (`src/lib/actions/*`).
- **Route Handlers** (`src/app/api/*`) pour les endpoints REST (auth, upload, etc.).

---

## 2. Routing & internationalisation

Le routing est internationalisé via **next-intl**. Toutes les pages vivent sous
`src/app/[locale]/`.

- Locale par défaut : **`fr`** (sans préfixe d'URL).
- Locale secondaire : **`en`** (préfixe `/en/...`).
- Configuration : `src/i18n/routing.ts`, `request.ts`, `navigation.ts`.
- Traductions : `messages/fr.json` et `messages/en.json`.

### Groupes de routes

Les parenthèses créent des **groupes de routes** sans impacter l'URL :

| Groupe | Dossier | Layout dédié | Garde |
|---|---|---|---|
| Public | `[locale]/*` | Navbar + Footer | aucune |
| Auth | `[locale]/(auth)/` | minimal | aucune |
| Client | `[locale]/(client)/` | sidebar client | `CLIENT`+ |
| Admin | `[locale]/(admin)/` | sidebar admin | `ADMIN` |
| Interne | `[locale]/(internal)/` | sidebar interne | `STAFF` / `ADMIN` |

### Pages publiques

```
/                       Accueil (hero vidéo + sections)
/about                  À propos (+ timeline, stats)
/services               Services (+ /services/[slug])
/portfolio              Portfolio (+ /portfolio/[slug] — étude de cas)
/team                   Équipe
/careers                Carrières
/contact                Contact
/sign-in, /sign-up      Authentification
```

---

## 3. Authentification & rôles

Authentification gérée par **Auth.js v5** (`src/lib/auth.ts`) :

- Provider **Credentials** (email + mot de passe haché bcrypt).
- Sessions **JWT**.
- Adaptateur **Prisma**.

### Rôles (`enum UserRole`)

| Rôle | Description | Accès |
|---|---|---|
| `CLIENT` | Client de Drwintech | Espace client |
| `STAFF` | Membre de l'équipe Drwintech | Dashboard interne (lecture) |
| `ADMIN` | Administrateur | Tout : admin + interne (édition) |

### Gardes de rôle (`src/lib/admin-guard.ts`)

```ts
requireAdmin()          // throw si role ≠ ADMIN
requireStaff()          // throw si role ∉ { ADMIN, STAFF }
canEditInternal(role)   // true si role = ADMIN
```

Les **layouts** des groupes protégés vérifient la session et redirigent vers
`/sign-in` ou `/dashboard` selon le cas. Les **Server Actions** revalident le rôle
côté serveur avant toute mutation.

---

## 4. Modèle de données (Prisma)

Schéma complet dans `prisma/schema.prisma`. Vue d'ensemble des modèles :

### Authentification
- `User` — comptes (avec `role`, `password` haché)
- `Account`, `Session`, `VerificationToken` — tables Auth.js

### Contenu public
- `Service` — prestations (bilingue)
- `Project` — réalisations / projets (bilingue, double diamant, suivi interne)
- `TeamMember` — membres d'équipe affichés publiquement
- `Testimonial` — témoignages clients
- `JobOpening` / `JobApplication` — offres d'emploi & candidatures
- `ContactMessage` — messages du formulaire de contact
- `NewsletterSubscriber` — inscrits à la newsletter

### Espace client
- `Invoice` — factures
- `SupportTicket` / `TicketMessage` — tickets de support

### Dashboard interne
- `ProjectResource` — ressources & documentation (liens + fichiers)
- `ProjectAccess` — références d'accès (liens uniquement, **aucun secret**)
- `ProjectNote` — notes & comptes-rendus
- `ProjectMember` — membres d'équipe affectés à un projet
- `ProjectMilestone` — jalons

### Le modèle `Project`

C'est le modèle central. Il porte :

- **Contenu public bilingue** : `title`, `summary`, `content` (`_fr` / `_en`).
- **Narration Design Thinking (double diamant)** :
  `challenge`, `discover`, `define`, `develop`, `deliver` (chacun `_fr` / `_en`).
- **Suivi interne** : `status`, `priority`, `progress` (0–100), `startDate`, `endDate`.
- **Relations** : `resources`, `accesses`, `notes`, `members`, `milestones`.

### Enums clés

```
ProjectStatus    PROSPECT · ACTIVE · ON_HOLD · COMPLETED · ARCHIVED
ProjectPriority  LOW · MEDIUM · HIGH · CRITICAL
ResourceKind     LINK · FILE
ResourceCategory SPEC · DESIGN · DOC · REPORT · ASSET · OTHER
AccessEnvironment REPOSITORY · STAGING · PRODUCTION · DESIGN_TOOL · PROJECT_MGMT · OTHER
```

---

## 5. Server Actions (`src/lib/actions/`)

Les mutations passent par des Server Actions, regroupées par domaine :

| Fichier | Domaine |
|---|---|
| `services.ts` | CRUD services |
| `portfolio.ts` | CRUD projets (portfolio public) |
| `team.ts` | CRUD membres d'équipe |
| `jobs.ts` | CRUD offres d'emploi |
| `applications.ts` | Traitement des candidatures |
| `messages.ts` | Traitement des messages de contact |
| `internal.ts` | Suivi projet, ressources, accès, notes (dashboard interne) |

Chaque action :
1. revalide le rôle (`requireAdmin` / `requireStaff`),
2. valide les entrées avec **zod**,
3. exécute la mutation Prisma,
4. appelle `revalidatePath()` sur les pages concernées.

---

## 6. API Routes (`src/app/api/`)

| Route | Méthode | Rôle | Description |
|---|---|---|---|
| `/api/auth/[...nextauth]` | — | — | Auth.js |
| `/api/contact` | POST | public | Enregistre un message de contact |
| `/api/newsletter` | POST | public | Inscription newsletter |
| `/api/register` | POST | public | Création de compte client |
| `/api/internal/upload` | POST | `ADMIN` | Upload de fichier projet |
| `/api/internal/files/[id]` | GET | `STAFF`+ | Téléchargement authentifié d'un fichier |

---

## 7. Design system & thème

- **Tailwind CSS v4** — configuration dans `src/app/globals.css`.
- Palette **cyan/bleu Drwintech** dérivée du logo officiel (`--brand-50` → `--brand-950`).
- Thème **clair / sombre / système** via `next-themes` (classe `.dark`).
- Tokens CSS pour les surfaces, bordures, ombres, dégradés.
- Composants UI réutilisables dans `src/components/ui/`.

### Animations (`src/components/animations/`)

| Composant | Effet |
|---|---|
| `parallax-image` | Translation au scroll |
| `floating-shapes` | Formes floues animées en arrière-plan |
| `scroll-indicator` | Indicateur de défilement |
| `animated-counter` | Compteur incrémenté à l'apparition |
| `word-reveal` | Révélation de texte mot à mot |
| `custom-cursor` | Curseur personnalisé (desktop) |

---

## 8. Internationalisation — ajouter une chaîne

1. Ajouter la clé dans `messages/fr.json` **et** `messages/en.json`.
2. Côté Server Component : `getTranslations({ locale, namespace })`.
3. Côté Client Component : `useTranslations(namespace)`.

Les liens internationalisés utilisent `Link` / `useRouter` depuis `src/i18n/navigation.ts`
(et **non** `next/link`).
