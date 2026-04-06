import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Users, Clock } from "lucide-react";
import { useEmailStore } from "@/store/emailStore";
import { StatusBadge, getEmotionVariant, getUrgencyVariant, getRiskVariant } from "@/components/StatusBadge";
import { teams } from "@/data/mockData";

function ConfidenceBar({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-medium text-foreground">{Math.round(value * 100)}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500"
          style={{ width: `${value * 100}%` }}
        />
      </div>
    </div>
  );
}

export default function EmailDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { emails, assignTeam, updateEmailStatus } = useEmailStore();
  const email = emails.find((e) => e.id === id);

  if (!email) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <p>Email not found</p>
        <button onClick={() => navigate("/inbox")} className="mt-2 text-primary text-sm hover:underline">
          Back to Inbox
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 animate-fade-in">
      <button onClick={() => navigate("/inbox")} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4" /> Back to Inbox
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Content */}
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-lg border border-border bg-card p-6 card-shadow">
            <h1 className="text-xl font-bold text-card-foreground">{email.subject}</h1>
            <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{email.sender}</span>
              <span>·</span>
              <span>{email.senderEmail}</span>
              <span>·</span>
              <span>{new Date(email.date).toLocaleString()}</span>
            </div>
            <div className="mt-6 text-sm leading-relaxed text-foreground whitespace-pre-line">
              {email.body}
            </div>
          </div>

          {/* Actions */}
          <div className="rounded-lg border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Actions</h3>
            <div className="flex flex-wrap gap-3">
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Assign Team</label>
                <select
                  value={email.assignedTeam || ""}
                  onChange={(e) => assignTeam(email.id, e.target.value)}
                  className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground"
                >
                  <option value="">Select team...</option>
                  {teams.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground block mb-1">Status</label>
                <select
                  value={email.status}
                  onChange={(e) => updateEmailStatus(email.id, e.target.value as any)}
                  className="bg-card border border-border rounded-md px-3 py-1.5 text-sm text-foreground"
                >
                  <option value="new">New</option>
                  <option value="in_progress">In Progress</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={() => updateEmailStatus(email.id, "escalated")}
                  className="px-4 py-1.5 rounded-md bg-destructive text-destructive-foreground text-sm font-medium hover:bg-destructive/90 transition-colors"
                >
                  <AlertTriangle className="h-3.5 w-3.5 inline mr-1.5" />
                  Escalate
                </button>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="rounded-lg border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Activity Timeline</h3>
            <div className="space-y-4">
              {[
                { time: email.date, event: "Email received and analyzed by AI", icon: Clock },
                ...(email.assignedTeam ? [{ time: email.date, event: `Assigned to ${email.assignedTeam}`, icon: Users }] : []),
                ...(email.status === "escalated" ? [{ time: email.date, event: "Escalated for immediate review", icon: AlertTriangle }] : []),
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="p-1.5 rounded-full bg-muted">
                    <item.icon className="h-3 w-3 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="text-sm text-foreground">{item.event}</p>
                    <p className="text-xs text-muted-foreground">{new Date(item.time).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights Panel */}
        <div className="space-y-4">
          <div className="rounded-lg border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">AI Insights</h3>
            <div className="space-y-4">
              <div>
                <span className="text-xs text-muted-foreground">Emotional Sentiment</span>
                <div className="mt-1">
                  <StatusBadge variant={getEmotionVariant(email.emotion)} className="text-sm">
                    {email.emotion}
                  </StatusBadge>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Urgency Level</span>
                <div className="mt-1">
                  <StatusBadge variant={getUrgencyVariant(email.urgency)} className="text-sm">
                    {email.urgency}
                  </StatusBadge>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Intent Classification</span>
                <div className="mt-1">
                  <StatusBadge variant="info" className="text-sm capitalize">
                    {email.intent}
                  </StatusBadge>
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Risk Score</span>
                <div className="mt-1 flex items-center gap-2">
                  <StatusBadge variant={getRiskVariant(email.riskLevel)} className="text-sm">
                    {email.riskScore}/100
                  </StatusBadge>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-lg border border-border bg-card p-5 card-shadow">
            <h3 className="text-sm font-semibold text-card-foreground mb-4">Confidence Scores</h3>
            <div className="space-y-3">
              <ConfidenceBar label="Sentiment" value={email.confidence.sentiment} />
              <ConfidenceBar label="Urgency" value={email.confidence.urgency} />
              <ConfidenceBar label="Intent" value={email.confidence.intent} />
              <ConfidenceBar label="Risk" value={email.confidence.risk} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
