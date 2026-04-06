import { cn } from "@/lib/utils";

type BadgeVariant = "default" | "positive" | "negative" | "warning" | "danger" | "neutral" | "info";

const variants: Record<BadgeVariant, string> = {
  default: "bg-secondary text-secondary-foreground",
  positive: "bg-success/15 text-success",
  negative: "bg-destructive/15 text-destructive",
  warning: "bg-warning/15 text-warning",
  danger: "bg-destructive/15 text-destructive",
  neutral: "bg-muted text-muted-foreground",
  info: "bg-info/15 text-info",
};

export function StatusBadge({
  children,
  variant = "default",
  className,
}: {
  children: React.ReactNode;
  variant?: BadgeVariant;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}

export function getEmotionVariant(emotion: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    positive: "positive",
    negative: "danger",
    neutral: "neutral",
    frustrated: "warning",
    angry: "danger",
  };
  return map[emotion] || "default";
}

export function getUrgencyVariant(urgency: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    low: "neutral",
    medium: "info",
    high: "warning",
    critical: "danger",
  };
  return map[urgency] || "default";
}

export function getRiskVariant(risk: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    low: "positive",
    medium: "warning",
    high: "danger",
  };
  return map[risk] || "default";
}
