import { Brain, Shield, AlertTriangle, TrendingUp, Target } from "lucide-react";
import type { EmailAnalysis } from "@/types/email";
import {
  StatusBadge,
  getSentimentVariant,
  getUrgencyVariant,
  getRiskVariant,
} from "./StatusBadge";

interface AnalysisResultProps {
  analysis: EmailAnalysis;
}

const metrics = [
  { key: "intent" as const, label: "Intent", icon: Target, getVariant: () => "info" as const },
  { key: "sentiment" as const, label: "Sentiment", icon: TrendingUp, getVariant: getSentimentVariant },
  { key: "urgency" as const, label: "Urgency", icon: AlertTriangle, getVariant: getUrgencyVariant },
  { key: "risk" as const, label: "Risk", icon: Shield, getVariant: getRiskVariant },
];

export function AnalysisResult({ analysis }: AnalysisResultProps) {
  return (
    <div className="space-y-6 animate-slide-up">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {metrics.map(({ key, label, icon: Icon, getVariant }, i) => (
          <div
            key={key}
            className="glass-card p-5 flex items-start gap-4 transition-all hover:border-primary/30"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div className="rounded-lg bg-primary/10 p-2.5">
              <Icon className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground mb-1.5">{label}</p>
              <StatusBadge label={analysis[key]} variant={getVariant(analysis[key])} />
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-5 glow-primary">
        <div className="flex items-start gap-4">
          <div className="rounded-lg bg-primary/10 p-2.5">
            <Brain className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground mb-1">Final Decision</p>
            <p className="text-foreground font-medium leading-relaxed">
              {analysis.final_decision}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
