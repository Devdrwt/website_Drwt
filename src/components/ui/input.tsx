import * as React from "react";
import { cn } from "@/lib/cn";

export const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type = "text", ...props }, ref) => {
  return (
    <input
      ref={ref}
      type={type}
      className={cn(
        "h-12 w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 text-sm text-foreground placeholder:text-fg-subtle transition-colors",
        "focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
});
Input.displayName = "Input";

export const Textarea = React.forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, rows = 5, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      rows={rows}
      className={cn(
        "w-full rounded-xl border border-[var(--border-strong)] bg-[var(--bg-elevated)] px-4 py-3 text-sm text-foreground placeholder:text-fg-subtle transition-colors resize-y",
        "focus-visible:border-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/30",
        "disabled:opacity-50 disabled:pointer-events-none",
        className
      )}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Label = React.forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn("text-xs font-medium uppercase tracking-wider text-fg-muted", className)}
    {...props}
  />
));
Label.displayName = "Label";
