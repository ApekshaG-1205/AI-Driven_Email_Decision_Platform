import { Mail, AlertTriangle, ShieldAlert, Clock } from "lucide-react";
import { KPICard } from "@/components/KPICard";
import { StatusBadge } from "@/components/StatusBadge";
import { useEmailStore } from "@/store/emailStore";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { sentimentData, volumeTrendData } from "@/data/mockData";

export default function Dashboard() {
  const emails = useEmailStore((s) => s.emails);
  const alerts = useEmailStore((s) => s.alerts);

  const urgentCount = emails.filter((e) => e.urgency === "high" || e.urgency === "critical").length;
  const highRiskCount = emails.filter((e) => e.riskLevel === "high").length;
  const slaBreaches = emails.filter((e) => e.slaBreached).length;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">AI-powered email intelligence overview</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Total Emails Today" value={emails.length} icon={Mail} trend="+12% vs yesterday" />
        <KPICard title="Urgent Emails" value={urgentCount} icon={AlertTriangle} variant="warning" trend="3 unresolved" />
        <KPICard title="High Risk Emails" value={highRiskCount} icon={ShieldAlert} variant="danger" trend="Needs attention" />
        <KPICard title="SLA Breaches" value={slaBreaches} icon={Clock} variant={slaBreaches > 0 ? "danger" : "success"} trend={slaBreaches > 0 ? "Action required" : "All clear"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-lg border border-border bg-card p-5 card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Sentiment Distribution</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={sentimentData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value" paddingAngle={3}>
                {sentimentData.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="rounded-lg border border-border bg-card p-5 card-shadow">
          <h3 className="text-sm font-semibold text-card-foreground mb-4">Email Volume Trend</h3>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={volumeTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
              <Line type="monotone" dataKey="emails" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="urgent" stroke="hsl(var(--destructive))" strokeWidth={2} dot={false} />
              <Legend wrapperStyle={{ fontSize: "12px" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card p-5 card-shadow">
        <h3 className="text-sm font-semibold text-card-foreground mb-4">Recent Alerts</h3>
        <div className="space-y-3">
          {alerts.slice(0, 5).map((alert) => (
            <div key={alert.id} className="flex items-start gap-3 p-3 rounded-md bg-accent/50 hover:bg-accent transition-colors">
              <div className={`mt-0.5 h-2 w-2 rounded-full shrink-0 ${alert.severity === "critical" ? "bg-destructive" : "bg-warning"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground">{alert.message}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {new Date(alert.timestamp).toLocaleString()}
                </p>
              </div>
              <StatusBadge variant={alert.severity === "critical" ? "danger" : "warning"}>
                {alert.severity}
              </StatusBadge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
