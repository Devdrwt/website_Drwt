import { Link } from "@/i18n/navigation";
import { cn } from "@/lib/cn";

export function Logo({
  className,
  withWordmark = true,
}: {
  className?: string;
  withWordmark?: boolean;
}) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center gap-2.5 font-display font-semibold text-foreground",
        className
      )}
      aria-label="Drwintech — Accueil"
    >
      <span className="relative inline-flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-[linear-gradient(135deg,var(--accent-from),var(--accent-via),var(--accent-to))] bg-[length:200%_200%] animate-gradient text-white shadow-[var(--shadow-glow)] transition-transform group-hover:scale-105">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={2.4}
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="M4 5h7a5 5 0 0 1 0 10H4z" />
          <path d="M13 12l7 7" />
        </svg>
        <span className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/20" />
      </span>
      {withWordmark && (
        <span className="text-base tracking-tight leading-none">
          Drwin<span className="text-brand-500">tech</span>
        </span>
      )}
    </Link>
  );
}
