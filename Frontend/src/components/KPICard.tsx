import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  variant?: "default" | "warning" | "danger" | "success";
}

const variantStyles = {
  default: "border-border",
  warning: "border-warning/30 bg-warning/5",
  danger: "border-destructive/30 bg-destructive/5",
  success: "border-success/30 bg-success/5",
};

const iconVariantStyles = {
  default: "text-primary bg-primary/10",
  warning: "text-warning bg-warning/10",
  danger: "text-destructive bg-destructive/10",
  success: "text-success bg-success/10",
};

export function KPICard({ title, value, icon: Icon, trend, variant = "default" }: KPICardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border p-5 card-shadow hover:card-shadow-hover transition-shadow animate-fade-in bg-card",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold mt-1 text-card-foreground">{value}</p>
          {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
        </div>
        <div className={cn("p-2 rounded-lg", iconVariantStyles[variant])}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </div>
  );
}
