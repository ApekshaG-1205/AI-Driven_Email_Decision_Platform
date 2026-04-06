import { useNavigate } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { useEmailStore } from "@/store/emailStore";
import {
  StatusBadge,
  getEmotionVariant,
  getUrgencyVariant,
  getRiskVariant,
} from "@/components/StatusBadge";

export default function InboxPage() {
  const { filters, setFilter, getFilteredEmails } = useEmailStore();
  const emails = getFilteredEmails();
  const navigate = useNavigate();

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Smart Inbox</h1>
        <p className="text-sm text-muted-foreground mt-1">
          AI-analyzed emails prioritized by urgency and risk
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 flex-1 max-w-sm bg-card border border-border rounded-lg px-3 py-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search emails..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="bg-transparent text-sm outline-none w-full placeholder:text-muted-foreground"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          {(["urgent", "highRisk", "complaint"] as const).map((key) => (
            <button
              key={key}
              onClick={() => setFilter(key, !filters[key])}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filters[key]
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {key === "highRisk" ? "High Risk" : key.charAt(0).toUpperCase() + key.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-border bg-card card-shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Subject</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Sender</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Emotion</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Urgency</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Intent</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Risk</th>
              </tr>
            </thead>
            <tbody>
              {emails.map((email) => (
                <tr
                  key={email.id}
                  onClick={() => navigate(`/email/${email.id}`)}
                  className="border-b border-border last:border-0 hover:bg-accent/50 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {email.slaBreached && (
                        <span className="h-2 w-2 rounded-full bg-destructive shrink-0" />
                      )}
                      <span className="font-medium text-foreground truncate max-w-[300px]">
                        {email.subject}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{email.sender}</td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={getEmotionVariant(email.emotion)}>
                      {email.emotion}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={getUrgencyVariant(email.urgency)}>
                      {email.urgency}
                    </StatusBadge>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-muted-foreground capitalize">{email.intent}</span>
                  </td>
                  <td className="py-3 px-4">
                    <StatusBadge variant={getRiskVariant(email.riskLevel)}>
                      {email.riskLevel}
                    </StatusBadge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {emails.length === 0 && (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No emails match your filters.
          </div>
        )}
      </div>
    </div>
  );
}
