"use client";

import { useTransition } from "react";
import type { JobApplication, JobOpening, ApplicationStatus } from "@prisma/client";
import { Trash2, Mail, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { deleteApplication, updateApplicationStatus } from "@/lib/actions/applications";

const STATUSES: ApplicationStatus[] = [
  "RECEIVED",
  "REVIEWING",
  "INTERVIEW",
  "OFFER",
  "REJECTED",
  "WITHDRAWN",
];

export function ApplicationRow({
  application,
}: {
  application: JobApplication & { job: JobOpening | null };
}) {
  const [pending, start] = useTransition();

  return (
    <div className="card-elevated p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-semibold">{application.fullName}</p>
          <Badge tone="neutral">{application.status}</Badge>
        </div>
        <p className="mt-1 text-sm text-fg-muted truncate">
          {application.job?.title_fr ?? "Candidature spontanée"}
        </p>
        <div className="mt-2 flex flex-wrap gap-3 text-xs text-fg-muted">
          <a
            href={`mailto:${application.email}`}
            className="inline-flex items-center gap-1 hover:text-foreground"
          >
            <Mail className="h-3 w-3" /> {application.email}
          </a>
          {application.resumeUrl && (
            <a
              href={application.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              <ExternalLink className="h-3 w-3" /> CV
            </a>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <select
          defaultValue={application.status}
          disabled={pending}
          onChange={(e) =>
            start(() =>
              updateApplicationStatus(application.id, e.target.value as ApplicationStatus)
            )
          }
          className="h-9 rounded-lg border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-3 text-sm"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <Button
          variant="ghost"
          size="icon"
          className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
          disabled={pending}
          onClick={() => {
            if (confirm("Supprimer cette candidature ?")) start(() => deleteApplication(application.id));
          }}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
