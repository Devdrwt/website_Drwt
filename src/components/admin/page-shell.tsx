import { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Link } from "@/i18n/navigation";

export function AdminPageShell({
  title,
  subtitle,
  actions,
  backHref,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
  backHref?: string;
  children: ReactNode;
}) {
  return (
    <div className="container-page py-10 md:py-14 max-w-6xl mx-auto">
      {backHref && (
        <Link
          href={backHref as "/admin"}
          className="inline-flex items-center gap-1.5 text-sm text-fg-muted hover:text-foreground transition-colors mb-6"
        >
          <ArrowLeft className="h-4 w-4" /> Retour
        </Link>
      )}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-3xl md:text-4xl font-semibold tracking-tight">{title}</h1>
          {subtitle && <p className="mt-2 text-fg-muted">{subtitle}</p>}
        </div>
        {actions && <div className="flex gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}
