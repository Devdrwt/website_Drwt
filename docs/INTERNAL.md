# Dashboard interne — Gestion de projets

Guide complet du **dashboard interne** : suivi de tous les projets de Drwintech,
présentés selon la méthode **Design Thinking (double diamant)**, avec ressources,
documentation et références d'accès.

> Accès : `/internal` — réservé aux rôles **`STAFF`** et **`ADMIN`**.

---

## 1. Principe

Le dashboard interne centralise **tous les projets** de l'entreprise — en cours,
terminés, en pause, en prospection — dans un espace réservé à l'équipe.

Chaque projet y est documenté de façon **explicite** :

- sa **narration design thinking** (double diamant),
- ses **ressources & documentation** (liens + fichiers),
- ses **références d'accès** (dépôt, environnements…),
- ses **notes & comptes-rendus**,
- son **suivi** (statut, avancement, priorité, échéances).

### Qui peut faire quoi

| Action | `STAFF` | `ADMIN` |
|---|:---:|:---:|
| Consulter les projets, ressources, accès, notes | ✅ | ✅ |
| Télécharger les fichiers | ✅ | ✅ |
| Modifier le suivi (statut, avancement…) | ❌ | ✅ |
| Ajouter / supprimer ressources, accès, notes | ❌ | ✅ |

---

## 2. Pages

### `/internal` — Vue d'ensemble

- Indicateurs clés : nombre de projets, avancement moyen, ressources, notes.
- Répartition des projets par statut.
- Activité récente (6 derniers projets modifiés).

### `/internal/projects` — Liste des projets

Trois vues commutables via onglets, plus recherche et filtre par statut :

| Vue | Usage |
|---|---|
| **Tableau** | Liste dense, triable — idéal pour beaucoup de projets |
| **Kanban** | Colonnes par statut — suivi visuel de l'avancement |
| **Cartes** | Cartes design thinking avec le double diamant en aperçu |

### `/internal/projects/[slug]` — Détail d'un projet

Page complète d'un projet :

1. **En-tête** — visuel, statut, client, lien vers le site live.
2. **Présentation Design Thinking** — la problématique + les 4 phases du double diamant.
3. **Ressources & documentation** — liens et fichiers, catégorisés.
4. **Accès** — références vers dépôt, environnements, outils.
5. **Notes & comptes-rendus** — notes épinglables avec auteur.
6. **Suivi** (colonne latérale) — statut, priorité, avancement, dates.
7. **Équipe & jalons**.

---

## 3. Le double diamant

Chaque projet est raconté selon les **4 phases** du double diamant du Design Council :

| Phase | Diamant | Nature | Contenu attendu |
|---|---|---|---|
| **Discover** | 1 | Diverger | Recherche, immersion, ethnographie, benchmark |
| **Define** | 1 | Converger | Synthèse, insights, problématisation |
| **Develop** | 2 | Diverger | Idéation, ateliers, prototypage |
| **Deliver** | 2 | Converger | Production, livraison, mesure d'impact |

Ces contenus sont stockés sur le modèle `Project` (champs `discover_fr/_en`,
`define_fr/_en`, etc.) et s'éditent dans le **back-office admin**
(`/admin/portfolio/[id]`). Le champ `challenge_fr/_en` porte la problématique initiale.

L'indicateur `MiniDiamond` affiche visuellement quelles phases sont documentées.

---

## 4. Ressources & documentation

Modèle `ProjectResource`. Deux types :

- **Lien** (`LINK`) — URL externe (Google Drive, Figma, Notion, Swagger…).
- **Fichier** (`FILE`) — fichier téléversé (PDF, image, Office, zip…).

Chaque ressource a une **catégorie** : cahier des charges, design, documentation,
compte-rendu, ressource média, autre.

### Upload de fichiers

- Taille max : **25 Mo**.
- Types autorisés : PDF, images, documents Office, zip, texte.
- Les fichiers sont stockés dans **`private/uploads/`** — **hors du dossier public**.
- Ils sont servis par la route authentifiée **`/api/internal/files/[id]`**
  (vérifie le rôle `STAFF`/`ADMIN` avant de streamer le fichier).
- Les fichiers ne sont **pas versionnés** dans Git.

---

## 5. Accès — sécurité

Modèle `ProjectAccess`.

> ⚠️ **Aucun identifiant ni mot de passe n'est stocké en base de données.**

Un accès enregistre uniquement :

- un **libellé** (ex. « Dépôt GitHub », « Préproduction »),
- un **environnement** (dépôt, staging, production, outil de design, gestion de projet),
- une **URL** (optionnelle),
- une **indication** sur où trouver les identifiants
  (ex. « Identifiants dans le coffre Bitwarden — dossier HCBE »).

Ce choix est volontaire : la base de données n'est jamais un point de fuite de secrets.
Les identifiants réels restent dans un gestionnaire de mots de passe dédié.

---

## 6. Notes & comptes-rendus

Modèle `ProjectNote`. Notes en texte (markdown supporté à l'affichage),
**épinglables**, horodatées et attribuées à leur auteur.

Usage typique : comptes-rendus de réunion, points de vigilance, décisions.

---

## 7. Suivi de projet

Le suivi s'édite **en ligne** sur la page détail (réservé `ADMIN`) :

| Champ | Valeurs |
|---|---|
| **Statut** | Prospect · En cours · En pause · Terminé · Archivé |
| **Priorité** | Basse · Moyenne · Haute · Critique |
| **Avancement** | 0 – 100 % (curseur) |
| **Début / Échéance** | Dates |

Les libellés, couleurs et ordres sont centralisés dans `src/lib/project-status.ts`.

---

## 8. Fichiers sources

| Fichier | Rôle |
|---|---|
| `src/app/[locale]/(internal)/internal/layout.tsx` | Layout + garde de rôle |
| `src/app/[locale]/(internal)/internal/page.tsx` | Vue d'ensemble |
| `src/app/[locale]/(internal)/internal/projects/page.tsx` | Liste des projets |
| `src/app/[locale]/(internal)/internal/projects/[slug]/page.tsx` | Détail projet |
| `src/components/internal/sidebar.tsx` | Navigation interne |
| `src/components/internal/projects-explorer.tsx` | Les 3 vues (tableau/kanban/cartes) |
| `src/components/internal/managers.tsx` | Gestion ressources / accès / notes |
| `src/components/internal/tracking-editor.tsx` | Édition du suivi |
| `src/components/internal/mini-diamond.tsx` | Indicateur double diamant compact |
| `src/lib/actions/internal.ts` | Server Actions (CRUD interne) |
| `src/lib/project-status.ts` | Constantes statut / priorité / catégories |
| `src/app/api/internal/upload/route.ts` | Endpoint d'upload |
| `src/app/api/internal/files/[id]/route.ts` | Endpoint de téléchargement authentifié |

---

## 9. Données de démonstration

`npm run db:seed` crée :

- un utilisateur **`STAFF`** (`staff@drwintech.com` / `Staff12345!`),
- un **suivi** (statut, avancement, dates) sur les 8 projets,
- des **ressources, accès et notes** d'exemple sur le projet *HCBE USA-C*.
