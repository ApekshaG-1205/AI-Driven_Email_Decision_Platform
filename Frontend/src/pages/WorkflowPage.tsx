import { useState } from "react";
import { useEmailStore } from "@/store/emailStore";
import { StatusBadge, getRiskVariant } from "@/components/StatusBadge";
import type { Email } from "@/data/mockData";

const columns = [
  { id: "new" as const, title: "New", color: "bg-info" },
  { id: "in_progress" as const, title: "In Progress", color: "bg-warning" },
  { id: "escalated" as const, title: "Escalated", color: "bg-destructive" },
  { id: "resolved" as const, title: "Resolved", color: "bg-success" },
];

function KanbanCard({ email }: { email: Email }) {
  return (
    <div
      draggable
      onDragStart={(e) => e.dataTransfer.setData("emailId", email.id)}
      className="rounded-lg border border-border bg-card p-3 card-shadow hover:card-shadow-hover transition-shadow cursor-grab active:cursor-grabbing"
    >
      <p className="text-sm font-medium text-card-foreground truncate">{email.subject}</p>
      <p className="text-xs text-muted-foreground mt-1">{email.sender}</p>
      <div className="flex items-center gap-2 mt-2">
        <StatusBadge variant={getRiskVariant(email.riskLevel)}>{email.riskLevel} risk</StatusBadge>
        {email.assignedTeam && (
          <span className="text-xs text-muted-foreground">{email.assignedTeam}</span>
        )}
      </div>
    </div>
  );
}

export default function WorkflowPage() {
  const { emails, updateEmailStatus } = useEmailStore();
  const [dragOver, setDragOver] = useState<string | null>(null);

  const handleDrop = (status: Email["status"], e: React.DragEvent) => {
    e.preventDefault();
    const emailId = e.dataTransfer.getData("emailId");
    if (emailId) updateEmailStatus(emailId, status);
    setDragOver(null);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Workflow</h1>
        <p className="text-sm text-muted-foreground mt-1">Drag and drop emails between stages</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-[500px]">
        {columns.map((col) => {
          const colEmails = emails.filter((e) => e.status === col.id);
          return (
            <div
              key={col.id}
              onDragOver={(e) => { e.preventDefault(); setDragOver(col.id); }}
              onDragLeave={() => setDragOver(null)}
              onDrop={(e) => handleDrop(col.id, e)}
              className={`rounded-lg border border-border bg-muted/30 p-3 transition-colors ${
                dragOver === col.id ? "bg-primary/5 border-primary/30" : ""
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <div className={`h-2 w-2 rounded-full ${col.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{col.title}</h3>
                <span className="text-xs text-muted-foreground ml-auto">{colEmails.length}</span>
              </div>
              <div className="space-y-2">
                {colEmails.map((email) => (
                  <KanbanCard key={email.id} email={email} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
