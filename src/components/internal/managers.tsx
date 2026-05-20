"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Plus, Trash2, ExternalLink, FileUp, Loader2, Link2, FileText,
  Pin, X, StickyNote, KeyRound,
} from "lucide-react";

import { cn } from "@/lib/cn";
import { RESOURCE_CATEGORY, ACCESS_ENV } from "@/lib/project-status";
import {
  createResourceLink, deleteResource,
  createAccess, deleteAccess,
  createNote, deleteNote,
} from "@/lib/actions/internal";

/* ============================================================
   Shared bits
   ============================================================ */
function SectionCard({
  title,
  Icon,
  count,
  children,
  action,
}: {
  title: string;
  Icon: React.ComponentType<{ className?: string }>;
  count: number;
  children: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <section className="card-elevated p-5 md:p-6">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-brand-500" />
          {title}
          <span className="font-mono text-xs text-fg-subtle">({count})</span>
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function AddButton({ open, onClick }: { open: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10 transition-colors"
    >
      {open ? <X className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      {open ? "Annuler" : "Ajouter"}
    </button>
  );
}

const inputCls =
  "h-10 w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-3 text-sm text-foreground placeholder:text-fg-subtle focus-visible:border-brand-500 focus-visible:outline-none";

/* ============================================================
   Resources — links + file uploads
   ============================================================ */
type Resource = {
  id: string;
  kind: "LINK" | "FILE";
  category: string;
  label: string;
  url: string | null;
  fileName: string | null;
  fileSize: number | null;
  note: string | null;
};

export function ResourceManager({
  projectId,
  slug,
  resources,
  isAdmin,
}: {
  projectId: string;
  slug: string;
  resources: Resource[];
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState<null | "link" | "file">(null);
  const [pending, start] = useTransition();
  const [uploading, setUploading] = useState(false);
  const router = useRouter();
  const fileFormRef = useRef<HTMLFormElement>(null);

  async function handleUpload(formData: FormData) {
    setUploading(true);
    try {
      const res = await fetch("/api/internal/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(
          d.error === "too_large" ? "Fichier trop volumineux (max 25 Mo)."
          : d.error === "type" ? "Type de fichier non autorisé."
          : "Échec de l'envoi."
        );
      } else {
        fileFormRef.current?.reset();
        setOpen(null);
        router.refresh();
      }
    } finally {
      setUploading(false);
    }
  }

  return (
    <SectionCard
      title="Ressources & documentation"
      Icon={Link2}
      count={resources.length}
      action={
        isAdmin && (
          <div className="flex gap-1">
            <button
              onClick={() => setOpen(open === "link" ? null : "link")}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold transition-colors",
                open === "link" ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "text-fg-muted hover:bg-foreground/[0.05]"
              )}
            >
              <Link2 className="h-3.5 w-3.5" /> Lien
            </button>
            <button
              onClick={() => setOpen(open === "file" ? null : "file")}
              className={cn(
                "inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold transition-colors",
                open === "file" ? "bg-brand-500/10 text-brand-600 dark:text-brand-400" : "text-fg-muted hover:bg-foreground/[0.05]"
              )}
            >
              <FileUp className="h-3.5 w-3.5" /> Fichier
            </button>
          </div>
        )
      }
    >
      {/* Add link form */}
      {open === "link" && isAdmin && (
        <form
          action={(fd) => start(() => createResourceLink(fd).then(() => setOpen(null)))}
          className="mb-4 grid gap-2 sm:grid-cols-2 p-4 rounded-lg bg-foreground/[0.03]"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="slug" value={slug} />
          <input name="label" required placeholder="Intitulé (ex: Cahier des charges)" className={inputCls} />
          <select name="category" className={inputCls} defaultValue="DOC">
            {Object.entries(RESOURCE_CATEGORY).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input name="url" required type="url" placeholder="https://…" className={cn(inputCls, "sm:col-span-2")} />
          <input name="note" placeholder="Note (optionnel)" className={cn(inputCls, "sm:col-span-2")} />
          <button
            disabled={pending}
            className="sm:col-span-2 h-10 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Ajout…" : "Ajouter le lien"}
          </button>
        </form>
      )}

      {/* Add file form */}
      {open === "file" && isAdmin && (
        <form
          ref={fileFormRef}
          action={handleUpload}
          className="mb-4 grid gap-2 sm:grid-cols-2 p-4 rounded-lg bg-foreground/[0.03]"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="slug" value={slug} />
          <input name="label" placeholder="Intitulé (optionnel)" className={inputCls} />
          <select name="category" className={inputCls} defaultValue="DOC">
            {Object.entries(RESOURCE_CATEGORY).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input
            name="file"
            type="file"
            required
            className={cn(inputCls, "sm:col-span-2 file:mr-3 file:h-7 file:rounded file:border-0 file:bg-brand-600 file:px-3 file:text-white file:text-xs pt-2")}
          />
          <p className="sm:col-span-2 text-[11px] text-fg-subtle">
            PDF, images, Office, zip… — 25 Mo max. Servi via lien authentifié.
          </p>
          <button
            disabled={uploading}
            className="sm:col-span-2 h-10 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 inline-flex items-center justify-center gap-2"
          >
            {uploading && <Loader2 className="h-4 w-4 animate-spin" />}
            {uploading ? "Envoi…" : "Téléverser le fichier"}
          </button>
        </form>
      )}

      {resources.length === 0 ? (
        <p className="text-sm text-fg-subtle py-4 text-center">Aucune ressource.</p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {resources.map((r) => (
            <li key={r.id} className="flex items-center gap-3 py-3">
              <span className="h-9 w-9 grid place-items-center rounded-md bg-brand-500/10 text-brand-600 dark:text-brand-300 shrink-0">
                {r.kind === "FILE" ? <FileText className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{r.label}</p>
                <p className="text-xs text-fg-subtle">
                  {RESOURCE_CATEGORY[r.category] ?? r.category}
                  {r.kind === "FILE" && r.fileSize
                    ? ` · ${(r.fileSize / 1024 / 1024).toFixed(1)} Mo`
                    : ""}
                  {r.note ? ` · ${r.note}` : ""}
                </p>
              </div>
              <a
                href={r.kind === "FILE" ? `/api/internal/files/${r.id}` : r.url ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-foreground/[0.06] hover:text-brand-600"
                aria-label="Ouvrir"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm("Supprimer cette ressource ?")) {
                      start(() => deleteResource(r.id, slug));
                    }
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-rose-500/10 hover:text-rose-500"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

/* ============================================================
   Access — links & references only
   ============================================================ */
type Access = {
  id: string;
  environment: string;
  label: string;
  url: string | null;
  credentialHint: string | null;
};

export function AccessManager({
  projectId,
  slug,
  accesses,
  isAdmin,
}: {
  projectId: string;
  slug: string;
  accesses: Access[];
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <SectionCard
      title="Accès"
      Icon={KeyRound}
      count={accesses.length}
      action={isAdmin && <AddButton open={open} onClick={() => setOpen(!open)} />}
    >
      <p className="text-[11px] text-fg-subtle mb-3 -mt-1">
        Liens et références uniquement — aucun mot de passe n'est stocké ici.
      </p>

      {open && isAdmin && (
        <form
          action={(fd) => start(() => createAccess(fd).then(() => setOpen(false)))}
          className="mb-4 grid gap-2 sm:grid-cols-2 p-4 rounded-lg bg-foreground/[0.03]"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="slug" value={slug} />
          <input name="label" required placeholder="Intitulé (ex: Dépôt GitHub)" className={inputCls} />
          <select name="environment" className={inputCls} defaultValue="REPOSITORY">
            {Object.entries(ACCESS_ENV).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
          <input name="url" type="url" placeholder="https://… (optionnel)" className={cn(inputCls, "sm:col-span-2")} />
          <input
            name="credentialHint"
            placeholder="Où trouver les identifiants (ex: coffre Bitwarden — dossier Drwintech)"
            className={cn(inputCls, "sm:col-span-2")}
          />
          <button
            disabled={pending}
            className="sm:col-span-2 h-10 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Ajout…" : "Ajouter l'accès"}
          </button>
        </form>
      )}

      {accesses.length === 0 ? (
        <p className="text-sm text-fg-subtle py-4 text-center">Aucun accès référencé.</p>
      ) : (
        <ul className="divide-y divide-[var(--border)]">
          {accesses.map((a) => (
            <li key={a.id} className="flex items-start gap-3 py-3">
              <span className="h-9 w-9 grid place-items-center rounded-md bg-foreground/[0.05] text-fg-muted shrink-0">
                <KeyRound className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{a.label}</p>
                <p className="text-xs text-fg-subtle">{ACCESS_ENV[a.environment] ?? a.environment}</p>
                {a.url && (
                  <a
                    href={a.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-brand-600 dark:text-brand-400 hover:underline mt-1"
                  >
                    <ExternalLink className="h-3 w-3" /> {a.url}
                  </a>
                )}
                {a.credentialHint && (
                  <p className="mt-1 text-xs text-fg-muted italic">🔑 {a.credentialHint}</p>
                )}
              </div>
              {isAdmin && (
                <button
                  onClick={() => {
                    if (confirm("Supprimer cet accès ?")) start(() => deleteAccess(a.id, slug));
                  }}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-rose-500/10 hover:text-rose-500"
                  aria-label="Supprimer"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}

/* ============================================================
   Notes
   ============================================================ */
type Note = {
  id: string;
  title: string;
  body: string;
  pinned: boolean;
  author: string | null;
  createdAt: string;
};

export function NoteManager({
  projectId,
  slug,
  notes,
  isAdmin,
}: {
  projectId: string;
  slug: string;
  notes: Note[];
  isAdmin: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <SectionCard
      title="Notes & comptes-rendus"
      Icon={StickyNote}
      count={notes.length}
      action={isAdmin && <AddButton open={open} onClick={() => setOpen(!open)} />}
    >
      {open && isAdmin && (
        <form
          action={(fd) => start(() => createNote(fd).then(() => setOpen(false)))}
          className="mb-4 grid gap-2 p-4 rounded-lg bg-foreground/[0.03]"
        >
          <input type="hidden" name="projectId" value={projectId} />
          <input type="hidden" name="slug" value={slug} />
          <input name="title" required placeholder="Titre de la note" className={inputCls} />
          <textarea
            name="body"
            required
            rows={5}
            placeholder="Contenu (markdown supporté)…"
            className="w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-3 py-2 text-sm text-foreground placeholder:text-fg-subtle focus-visible:border-brand-500 focus-visible:outline-none resize-y"
          />
          <label className="inline-flex items-center gap-2 text-xs text-fg-muted">
            <input type="checkbox" name="pinned" className="h-4 w-4 accent-[var(--brand-500)]" />
            Épingler en haut
          </label>
          <button
            disabled={pending}
            className="h-10 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60"
          >
            {pending ? "Enregistrement…" : "Enregistrer la note"}
          </button>
        </form>
      )}

      {notes.length === 0 ? (
        <p className="text-sm text-fg-subtle py-4 text-center">Aucune note.</p>
      ) : (
        <ul className="space-y-3">
          {notes.map((n) => (
            <li key={n.id} className="rounded-lg border border-[var(--border)] p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                  {n.pinned && <Pin className="h-3.5 w-3.5 text-brand-500 shrink-0" />}
                  <h3 className="font-semibold text-sm text-foreground truncate">{n.title}</h3>
                </div>
                {isAdmin && (
                  <button
                    onClick={() => {
                      if (confirm("Supprimer cette note ?")) start(() => deleteNote(n.id, slug));
                    }}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-md text-fg-subtle hover:bg-rose-500/10 hover:text-rose-500 shrink-0"
                    aria-label="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
              <p className="mt-2 text-sm text-fg-muted whitespace-pre-wrap leading-relaxed">{n.body}</p>
              <p className="mt-3 font-mono text-[10px] uppercase tracking-wider text-fg-subtle">
                {n.author ?? "—"} · {new Date(n.createdAt).toLocaleDateString("fr-FR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  );
}
