import { Activity, AlertTriangle, Shield, TrendingDown } from "lucide-react";

interface StatsCardsProps {
  stats: {
    total: number;
    highRisk: number;
    highUrgency: number;
    negativeSentiment: number;
  };
}

const cards = [
  { key: "total" as const, label: "Total Analyzed", icon: Activity, color: "text-primary", bg: "bg-primary/10" },
  { key: "highRisk" as const, label: "High Risk", icon: Shield, color: "text-destructive", bg: "bg-destructive/10" },
  { key: "highUrgency" as const, label: "High Urgency", icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10" },
  { key: "negativeSentiment" as const, label: "Negative Sentiment", icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10" },
];

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map(({ key, label, icon: Icon, color, bg }, i) => (
        <div
          key={key}
          className="glass-card p-5 animate-slide-up"
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-muted-foreground">{label}</span>
            <div className={`rounded-lg ${bg} p-2`}>
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
          </div>
          <p className="text-3xl font-bold text-foreground">{stats[key]}</p>
        </div>
      ))}
    </div>
  );
}
