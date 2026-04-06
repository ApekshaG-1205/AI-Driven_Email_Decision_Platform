import { useEmailStore } from "@/store/emailStore";
import { StatusBadge } from "@/components/StatusBadge";
import { AlertTriangle, ShieldAlert, Clock, Activity } from "lucide-react";

const typeIcons: Record<string, typeof AlertTriangle> = {
  high_risk: ShieldAlert,
  threat: AlertTriangle,
  sla_breach: Clock,
  anomaly: Activity,
};

export default function AlertsPage() {
  const { alerts, markAlertRead } = useEmailStore();

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Alerts</h1>
        <p className="text-sm text-muted-foreground mt-1">Security and compliance notifications</p>
      </div>

      <div className="space-y-2">
        {alerts.map((alert) => {
          const Icon = typeIcons[alert.type] || AlertTriangle;
          return (
            <div
              key={alert.id}
              onClick={() => markAlertRead(alert.id)}
              className={`rounded-lg border p-4 card-shadow hover:card-shadow-hover transition-all cursor-pointer ${
                alert.severity === "critical"
                  ? "border-destructive/30 bg-destructive/5"
                  : "border-border bg-card"
              } ${!alert.read ? "ring-1 ring-primary/20" : ""}`}
            >
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${alert.severity === "critical" ? "bg-destructive/10 text-destructive" : "bg-warning/10 text-warning"}`}>
                  <Icon className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{alert.message}</p>
                    {!alert.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <StatusBadge variant={alert.severity === "critical" ? "danger" : "warning"}>
                      {alert.severity}
                    </StatusBadge>
                    <span className="text-xs text-muted-foreground capitalize">{alert.type.replace("_", " ")}</span>
                    <span className="text-xs text-muted-foreground">·</span>
                    <span className="text-xs text-muted-foreground">{new Date(alert.timestamp).toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
