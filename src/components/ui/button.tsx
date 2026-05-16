"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/cn";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none select-none active:scale-[0.98]",
  {
    variants: {
      variant: {
        primary:
          "bg-foreground text-[var(--bg)] hover:bg-foreground/90 shadow-md hover:shadow-lg",
        gradient:
          "text-white shadow-[var(--shadow-glow)] bg-[linear-gradient(120deg,var(--accent-from),var(--accent-via)_55%,var(--accent-to))] bg-[length:200%_200%] hover:bg-[position:100%_50%] btn-shine",
        outline:
          "border border-[var(--border-strong)] text-foreground hover:border-foreground/40 hover:bg-foreground/[0.04]",
        ghost:
          "text-foreground hover:bg-foreground/[0.06]",
        soft:
          "bg-foreground/[0.06] text-foreground hover:bg-foreground/[0.1]",
        link:
          "text-foreground underline-offset-4 hover:underline rounded-none",
      },
      size: {
        sm: "h-9 px-4 text-sm",
        md: "h-11 px-6 text-sm",
        lg: "h-13 px-8 text-base",
        xl: "h-14 px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { buttonVariants };
