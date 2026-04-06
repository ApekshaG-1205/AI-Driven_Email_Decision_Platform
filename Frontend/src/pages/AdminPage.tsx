import { useState } from "react";
import { workflowRules } from "@/data/mockData";
import { Plus, Trash2 } from "lucide-react";

export default function AdminPage() {
  const [rules, setRules] = useState(workflowRules);
  const [urgencyThreshold, setUrgencyThreshold] = useState(70);
  const [riskThreshold, setRiskThreshold] = useState(75);
  const [models, setModels] = useState({
    sentiment: true,
    urgency: true,
    intent: true,
    risk: true,
  });

  const toggleRule = (id: string) =>
    setRules((r) => r.map((rule) => (rule.id === id ? { ...rule, enabled: !rule.enabled } : rule)));

  const deleteRule = (id: string) => setRules((r) => r.filter((rule) => rule.id !== id));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
        <p className="text-sm text-muted-foreground mt-1">Configure routing rules and AI model settings</p>
      </div>

      {/* Rules */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-card-foreground">Routing Rules</h3>
          <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-3.5 w-3.5" /> Add Rule
          </button>
        </div>
        <div className="space-y-3">
          {rules.map((rule) => (
            <div key={rule.id} className="flex items-center gap-4 p-3 rounded-md bg-accent/50">
              <button
                onClick={() => toggleRule(rule.id)}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  rule.enabled ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition-transform ${
                    rule.enabled ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{rule.name}</p>
                <p className="text-xs text-muted-foreground">
                  If {rule.condition} → {rule.action}
                </p>
              </div>
              <button onClick={() => deleteRule(rule.id)} className="p-1.5 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors">
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Model Toggles */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">AI Models</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {(Object.keys(models) as Array<keyof typeof models>).map((key) => (
            <div key={key} className="flex items-center justify-between p-3 rounded-md bg-accent/50">
              <span className="text-sm text-foreground capitalize">{key} Analysis</span>
              <button
                onClick={() => setModels((m) => ({ ...m, [key]: !m[key] }))}
                className={`relative w-10 h-5 rounded-full transition-colors ${
                  models[key] ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 h-4 w-4 rounded-full bg-card transition-transform ${
                    models[key] ? "left-5" : "left-0.5"
                  }`}
                />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Thresholds */}
      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Thresholds</h3>
        <div className="space-y-5">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground">Urgency Threshold</span>
              <span className="font-medium text-foreground">{urgencyThreshold}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={urgencyThreshold}
              onChange={(e) => setUrgencyThreshold(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-foreground">Risk Threshold</span>
              <span className="font-medium text-foreground">{riskThreshold}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={riskThreshold}
              onChange={(e) => setRiskThreshold(Number(e.target.value))}
              className="w-full accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
