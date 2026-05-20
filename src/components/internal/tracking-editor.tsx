"use client";

import { useState, useTransition } from "react";
import { Pencil, Check, X } from "lucide-react";

import { cn } from "@/lib/cn";
import { PROJECT_STATUS, PROJECT_PRIORITY, STATUS_ORDER } from "@/lib/project-status";
import { updateProjectTracking } from "@/lib/actions/internal";

type Props = {
  projectId: string;
  slug: string;
  status: string;
  priority: string;
  progress: number;
  startDate: string | null;
  endDate: string | null;
  isAdmin: boolean;
};

const PRIORITY_ORDER = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
const inputCls =
  "h-10 w-full rounded-md border border-[var(--border-strong)] bg-[var(--bg)] px-3 text-sm text-foreground focus-visible:border-brand-500 focus-visible:outline-none";

export function TrackingEditor(props: Props) {
  const [editing, setEditing] = useState(false);
  const [pending, start] = useTransition();
  const [progress, setProgress] = useState(props.progress);

  const s = PROJECT_STATUS[props.status as keyof typeof PROJECT_STATUS];
  const p = PROJECT_PRIORITY[props.priority as keyof typeof PROJECT_PRIORITY];

  if (!editing) {
    return (
      <div className="card-elevated p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground">Suivi du projet</h2>
          {props.isAdmin && (
            <button
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 h-8 px-3 rounded-md text-xs font-semibold text-brand-600 dark:text-brand-400 hover:bg-brand-500/10"
            >
              <Pencil className="h-3.5 w-3.5" /> Modifier
            </button>
          )}
        </div>
        <dl className="space-y-3 text-sm">
          <Row label="Statut">
            <span className={cn("inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider", s.chip)}>
              <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
              {s.label}
            </span>
          </Row>
          <Row label="Priorité">
            <span className={cn("text-sm font-medium", p.chip)}>{p.label}</span>
          </Row>
          <Row label="Avancement">
            <div className="flex items-center gap-2 w-44">
              <div className="h-2 flex-1 rounded-full bg-foreground/[0.07] overflow-hidden">
                <div className="h-full rounded-full bg-brand-500" style={{ width: `${props.progress}%` }} />
              </div>
              <span className="font-mono text-xs text-fg-subtle w-9 text-right">{props.progress}%</span>
            </div>
          </Row>
          <Row label="Début">
            <span className="text-foreground">
              {props.startDate ? new Date(props.startDate).toLocaleDateString("fr-FR") : "—"}
            </span>
          </Row>
          <Row label="Échéance">
            <span className="text-foreground">
              {props.endDate ? new Date(props.endDate).toLocaleDateString("fr-FR") : "—"}
            </span>
          </Row>
        </dl>
      </div>
    );
  }

  return (
    <form
      action={(fd) => start(() => updateProjectTracking(fd).then(() => setEditing(false)))}
      className="card-elevated p-5"
    >
      <input type="hidden" name="projectId" value={props.projectId} />
      <input type="hidden" name="slug" value={props.slug} />
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-foreground">Modifier le suivi</h2>
        <button
          type="button"
          onClick={() => setEditing(false)}
          className="inline-flex h-8 w-8 items-center justify-center rounded-md text-fg-subtle hover:bg-foreground/[0.06]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-3">
        <Field label="Statut">
          <select name="status" defaultValue={props.status} className={inputCls}>
            {STATUS_ORDER.map((k) => (
              <option key={k} value={k}>{PROJECT_STATUS[k].label}</option>
            ))}
          </select>
        </Field>
        <Field label="Priorité">
          <select name="priority" defaultValue={props.priority} className={inputCls}>
            {PRIORITY_ORDER.map((k) => (
              <option key={k} value={k}>{PROJECT_PRIORITY[k].label}</option>
            ))}
          </select>
        </Field>
        <Field label={`Avancement — ${progress}%`}>
          <input
            name="progress"
            type="range"
            min={0}
            max={100}
            step={5}
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full accent-[var(--brand-500)]"
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Début">
            <input
              name="startDate"
              type="date"
              defaultValue={props.startDate ? props.startDate.slice(0, 10) : ""}
              className={inputCls}
            />
          </Field>
          <Field label="Échéance">
            <input
              name="endDate"
              type="date"
              defaultValue={props.endDate ? props.endDate.slice(0, 10) : ""}
              className={inputCls}
            />
          </Field>
        </div>
      </div>

      <button
        disabled={pending}
        className="mt-4 w-full h-10 rounded-md bg-brand-600 text-white text-sm font-semibold hover:bg-brand-700 disabled:opacity-60 inline-flex items-center justify-center gap-2"
      >
        <Check className="h-4 w-4" />
        {pending ? "Enregistrement…" : "Enregistrer"}
      </button>
    </form>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{label}</dt>
      <dd>{children}</dd>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-wider text-fg-subtle">{label}</span>
      <div className="mt-1">{children}</div>
    </label>
  );
}
