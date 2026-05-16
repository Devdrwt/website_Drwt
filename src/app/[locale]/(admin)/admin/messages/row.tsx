"use client";

import { useTransition, useState } from "react";
import type { ContactMessage } from "@prisma/client";
import { Check, Mail, Phone, Trash2, ChevronDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { toggleMessageHandled, deleteMessage } from "@/lib/actions/messages";

export function MessageRow({ message }: { message: ContactMessage }) {
  const [open, setOpen] = useState(false);
  const [pending, start] = useTransition();

  return (
    <div className="card-elevated overflow-hidden">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-foreground/[0.02] transition-colors"
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <p className="font-semibold">{message.name}</p>
            {message.handled ? (
              <Badge tone="brand">Traité</Badge>
            ) : (
              <Badge tone="neutral">Nouveau</Badge>
            )}
            <span className="text-xs text-fg-subtle">
              {new Date(message.createdAt).toLocaleString("fr-FR")}
            </span>
          </div>
          <p className="mt-1 text-sm text-fg-muted truncate">
            {message.subject ?? message.message.slice(0, 80)}
          </p>
        </div>
        <ChevronDown
          className={`h-5 w-5 text-fg-subtle shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="border-t border-[var(--border)] p-5 bg-foreground/[0.02] space-y-4">
          <div className="grid sm:grid-cols-2 gap-3 text-sm">
            <a
              href={`mailto:${message.email}`}
              className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
            >
              <Mail className="h-4 w-4" /> {message.email}
            </a>
            {message.phone && (
              <a
                href={`tel:${message.phone}`}
                className="inline-flex items-center gap-2 text-brand-600 dark:text-brand-400 hover:underline"
              >
                <Phone className="h-4 w-4" /> {message.phone}
              </a>
            )}
            {message.company && (
              <p className="text-fg-muted">Entreprise · <strong>{message.company}</strong></p>
            )}
            {message.budget && (
              <p className="text-fg-muted">Budget · <strong>{message.budget}</strong></p>
            )}
          </div>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.message}</p>
          <div className="flex gap-2 pt-2">
            <Button
              variant="soft"
              size="sm"
              disabled={pending}
              onClick={() => start(() => toggleMessageHandled(message.id, !message.handled))}
            >
              <Check className="h-4 w-4" />
              {message.handled ? "Marquer non traité" : "Marquer traité"}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10"
              disabled={pending}
              onClick={() => {
                if (confirm("Supprimer ce message ?")) start(() => deleteMessage(message.id));
              }}
            >
              <Trash2 className="h-4 w-4" />
              Supprimer
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
