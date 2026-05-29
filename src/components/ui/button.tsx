"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-semibold select-none transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none",
  {
    variants: {
      variant: {
        primary:
          "rounded-md bg-brand-600 text-white hover:bg-brand-700 shadow-sm",
        secondary:
          "rounded-md bg-foreground text-[var(--bg)] hover:opacity-90",
        outline:
          "rounded-md border border-[var(--border-strong)] text-foreground bg-[var(--bg-elevated)] hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400",
        ghost:
          "rounded-md text-foreground hover:bg-foreground/[0.06]",
        light:
          "rounded-md bg-white text-brand-700 hover:bg-white/95 shadow-sm",
        gradient:
          "rounded-md bg-gradient-to-r from-brand-600 to-brand-500 text-white hover:from-brand-700 hover:to-brand-600 shadow-sm",
        soft:
          "rounded-md bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-6 text-sm",
        xl: "h-14 px-8 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
  )
);
Button.displayName = "Button";

export { buttonVariants };
