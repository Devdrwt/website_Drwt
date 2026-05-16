"use client";

import { Trash2 } from "lucide-react";
import { useTransition } from "react";

export function DeleteForm({ action }: { action: () => Promise<void> }) {
  const [pending, start] = useTransition();
  return (
    <button
      type="button"
      disabled={pending}
      onClick={() => {
        if (confirm("Supprimer définitivement ?")) start(() => action());
      }}
      className="inline-flex items-center gap-1 text-xs text-rose-600 dark:text-rose-400 hover:underline disabled:opacity-50"
    >
      <Trash2 className="h-3.5 w-3.5" /> Supprimer
    </button>
  );
}
