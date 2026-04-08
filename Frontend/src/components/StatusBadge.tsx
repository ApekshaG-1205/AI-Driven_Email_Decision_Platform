import { cn } from "@/lib/utils";

type BadgeVariant = "success" | "warning" | "destructive" | "muted" | "info";

const variantClasses: Record<BadgeVariant, string> = {
  success: "bg-success/15 text-success border-success/20",
  warning: "bg-warning/15 text-warning border-warning/20",
  destructive: "bg-destructive/15 text-destructive border-destructive/20",
  muted: "bg-muted text-muted-foreground border-border",
  info: "bg-info/15 text-info border-info/20",
};

export function getSentimentVariant(value: string): BadgeVariant {
  const v = value.toLowerCase();
  if (v === "positive") return "success";
  if (v === "negative") return "destructive";
  return "muted";
}

export function getUrgencyVariant(value: string): BadgeVariant {
  const v = value.toLowerCase();
  if (v === "high") return "destructive";
  if (v === "medium") return "warning";
  return "success";
}

export function getRiskVariant(value: string): BadgeVariant {
  const v = value.toLowerCase();
  if (v === "high") return "destructive";
  if (v === "medium") return "warning";
  return "success";
}

interface StatusBadgeProps {
  label: string;
  variant: BadgeVariant;
  className?: string;
}

export function StatusBadge({ label, variant, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium capitalize",
        variantClasses[variant],
        className
      )}
    >
      {label}
    </span>
  );
}
