import { cn } from "@/lib/cn";

export function GradientText({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <span className={cn("text-gradient", className)}>{children}</span>;
}
