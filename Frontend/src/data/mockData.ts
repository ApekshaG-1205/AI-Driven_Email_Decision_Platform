export interface Email {
  id: string;
  subject: string;
  sender: string;
  senderEmail: string;
  body: string;
  date: string;
  emotion: "positive" | "negative" | "neutral" | "frustrated" | "angry";
  urgency: "low" | "medium" | "high" | "critical";
  intent: "inquiry" | "complaint" | "request" | "escalation" | "feedback" | "threat";
  riskLevel: "low" | "medium" | "high";
  riskScore: number;
  confidence: { sentiment: number; urgency: number; intent: number; risk: number };
  assignedTeam?: string;
  status: "new" | "in_progress" | "escalated" | "resolved";
  slaBreached: boolean;
}

export interface Alert {
  id: string;
  type: "high_risk" | "threat" | "sla_breach" | "anomaly";
  message: string;
  emailId: string;
  severity: "warning" | "critical";
  timestamp: string;
  read: boolean;
}

export const mockEmails: Email[] = [
  { id: "e1", subject: "Urgent: Contract Termination Notice", sender: "John Mitchell", senderEmail: "j.mitchell@acme.com", body: "Dear Team,\n\nWe are writing to formally notify you that we intend to terminate our service agreement effective immediately due to repeated SLA violations over the past quarter. Our legal team will be in contact regarding the financial implications.\n\nThis matter requires your immediate attention.\n\nRegards,\nJohn Mitchell\nVP Operations, Acme Corp", date: "2026-04-06T09:15:00", emotion: "angry", urgency: "critical", intent: "threat", riskLevel: "high", riskScore: 92, confidence: { sentiment: 0.95, urgency: 0.98, intent: 0.88, risk: 0.94 }, status: "new", slaBreached: false },
  { id: "e2", subject: "Re: Invoice #4521 - Payment Delay", sender: "Sarah Chen", senderEmail: "s.chen@globaltech.io", body: "Hi,\n\nI wanted to follow up on invoice #4521 which was due last week. We're experiencing some internal delays but expect to process it within the next 5 business days. Apologies for the inconvenience.\n\nBest,\nSarah", date: "2026-04-06T08:42:00", emotion: "neutral", urgency: "medium", intent: "request", riskLevel: "medium", riskScore: 45, confidence: { sentiment: 0.82, urgency: 0.76, intent: 0.91, risk: 0.79 }, status: "in_progress", assignedTeam: "Finance", slaBreached: false },
  { id: "e3", subject: "Feedback on Q1 Product Launch", sender: "Lisa Park", senderEmail: "l.park@innovate.co", body: "Hello,\n\nJust wanted to share some positive feedback from our team regarding the Q1 product launch. The new features have significantly improved our workflow and our team productivity is up 23%. Great work!\n\nCheers,\nLisa", date: "2026-04-06T07:30:00", emotion: "positive", urgency: "low", intent: "feedback", riskLevel: "low", riskScore: 8, confidence: { sentiment: 0.97, urgency: 0.85, intent: 0.93, risk: 0.91 }, status: "resolved", assignedTeam: "Product", slaBreached: false },
  { id: "e4", subject: "COMPLAINT: System Downtime Impact", sender: "Robert Davis", senderEmail: "r.davis@enterprise.com", body: "To Whom It May Concern,\n\nThe repeated system downtimes this month have cost us significant revenue. We've documented 14 hours of total downtime which directly impacted our operations. We expect a detailed RCA and compensation.\n\nRobert Davis\nCTO, Enterprise Solutions", date: "2026-04-06T06:55:00", emotion: "frustrated", urgency: "high", intent: "complaint", riskLevel: "high", riskScore: 78, confidence: { sentiment: 0.91, urgency: 0.89, intent: 0.95, risk: 0.87 }, status: "escalated", assignedTeam: "Engineering", slaBreached: true },
  { id: "e5", subject: "Partnership Inquiry - AI Integration", sender: "Maria Garcia", senderEmail: "m.garcia@techventures.com", body: "Dear Business Development Team,\n\nWe're interested in exploring a potential partnership for integrating your AI capabilities into our platform. Could we schedule a call next week to discuss possibilities?\n\nBest regards,\nMaria Garcia", date: "2026-04-06T10:20:00", emotion: "positive", urgency: "low", intent: "inquiry", riskLevel: "low", riskScore: 5, confidence: { sentiment: 0.88, urgency: 0.92, intent: 0.96, risk: 0.95 }, status: "new", slaBreached: false },
  { id: "e6", subject: "Security Vulnerability Report", sender: "Alex Thompson", senderEmail: "a.thompson@securitylab.net", body: "Hi Security Team,\n\nDuring our recent audit, we identified a critical vulnerability in your API authentication layer. This needs to be addressed within 24 hours to prevent potential data exposure. Details are attached.\n\nUrgent attention required.\n\nAlex Thompson\nSr. Security Analyst", date: "2026-04-06T05:10:00", emotion: "neutral", urgency: "critical", intent: "escalation", riskLevel: "high", riskScore: 96, confidence: { sentiment: 0.79, urgency: 0.99, intent: 0.92, risk: 0.97 }, status: "escalated", assignedTeam: "Security", slaBreached: true },
  { id: "e7", subject: "Meeting Request: Quarterly Review", sender: "David Kim", senderEmail: "d.kim@partner.org", body: "Hello,\n\nI'd like to schedule our quarterly review meeting for next Tuesday. Please confirm your availability.\n\nThanks,\nDavid", date: "2026-04-06T11:00:00", emotion: "neutral", urgency: "low", intent: "request", riskLevel: "low", riskScore: 3, confidence: { sentiment: 0.90, urgency: 0.88, intent: 0.94, risk: 0.96 }, status: "new", slaBreached: false },
  { id: "e8", subject: "Re: Refund Request - Order #8891", sender: "Emma Wilson", senderEmail: "e.wilson@customer.com", body: "This is the third time I'm reaching out about my refund. It's been 3 weeks and I still haven't received it. If this isn't resolved by end of week, I'll be filing a formal complaint with consumer protection.\n\nEmma Wilson", date: "2026-04-05T16:30:00", emotion: "angry", urgency: "high", intent: "complaint", riskLevel: "high", riskScore: 82, confidence: { sentiment: 0.96, urgency: 0.91, intent: 0.97, risk: 0.89 }, status: "in_progress", assignedTeam: "Support", slaBreached: true },
  { id: "e9", subject: "New Feature Suggestion", sender: "Tom Harris", senderEmail: "t.harris@startup.io", body: "Hey team,\n\nLove the product! Quick suggestion - would be great to have keyboard shortcuts for common actions. Happy to provide more detailed feedback if helpful.\n\nCheers,\nTom", date: "2026-04-05T14:15:00", emotion: "positive", urgency: "low", intent: "feedback", riskLevel: "low", riskScore: 2, confidence: { sentiment: 0.94, urgency: 0.90, intent: 0.92, risk: 0.98 }, status: "resolved", assignedTeam: "Product", slaBreached: false },
  { id: "e10", subject: "Data Migration Request - Priority", sender: "Jennifer Lee", senderEmail: "j.lee@megacorp.com", body: "Hi,\n\nWe need to migrate our data to the new system by end of this week. This is blocking our team from proceeding with the quarterly audit. Please prioritize.\n\nJennifer Lee\nData Operations Manager", date: "2026-04-06T08:00:00", emotion: "neutral", urgency: "high", intent: "request", riskLevel: "medium", riskScore: 55, confidence: { sentiment: 0.83, urgency: 0.87, intent: 0.90, risk: 0.82 }, status: "in_progress", assignedTeam: "Engineering", slaBreached: false },
];

export const mockAlerts: Alert[] = [
  { id: "a1", type: "high_risk", message: "High-risk email detected from Acme Corp - Contract termination threat", emailId: "e1", severity: "critical", timestamp: "2026-04-06T09:16:00", read: false },
  { id: "a2", type: "threat", message: "Security vulnerability report requires immediate attention", emailId: "e6", severity: "critical", timestamp: "2026-04-06T05:11:00", read: false },
  { id: "a3", type: "sla_breach", message: "SLA breached: System downtime complaint from Enterprise Solutions", emailId: "e4", severity: "critical", timestamp: "2026-04-06T06:56:00", read: true },
  { id: "a4", type: "sla_breach", message: "SLA breached: Refund request #8891 - 3 weeks overdue", emailId: "e8", severity: "warning", timestamp: "2026-04-05T16:31:00", read: true },
  { id: "a5", type: "high_risk", message: "Customer threatening formal complaint - Order #8891", emailId: "e8", severity: "warning", timestamp: "2026-04-05T16:31:00", read: false },
  { id: "a6", type: "anomaly", message: "Unusual spike in negative sentiment emails detected", emailId: "e4", severity: "warning", timestamp: "2026-04-06T07:00:00", read: true },
];

export const sentimentData = [
  { name: "Positive", value: 28, fill: "hsl(142, 76%, 36%)" },
  { name: "Neutral", value: 42, fill: "hsl(215, 16%, 47%)" },
  { name: "Negative", value: 18, fill: "hsl(0, 84%, 60%)" },
  { name: "Frustrated", value: 12, fill: "hsl(38, 92%, 50%)" },
];

export const volumeTrendData = [
  { date: "Mon", emails: 45, urgent: 8 },
  { date: "Tue", emails: 52, urgent: 12 },
  { date: "Wed", emails: 38, urgent: 5 },
  { date: "Thu", emails: 65, urgent: 15 },
  { date: "Fri", emails: 48, urgent: 9 },
  { date: "Sat", emails: 22, urgent: 3 },
  { date: "Sun", emails: 18, urgent: 2 },
];

export const sentimentTrendData = [
  { week: "W1", positive: 30, neutral: 45, negative: 15, frustrated: 10 },
  { week: "W2", positive: 28, neutral: 42, negative: 18, frustrated: 12 },
  { week: "W3", positive: 35, neutral: 38, negative: 14, frustrated: 13 },
  { week: "W4", positive: 32, neutral: 40, negative: 16, frustrated: 12 },
];

export const intentDistributionData = [
  { name: "Inquiry", value: 35 },
  { name: "Complaint", value: 20 },
  { name: "Request", value: 25 },
  { name: "Feedback", value: 12 },
  { name: "Escalation", value: 5 },
  { name: "Threat", value: 3 },
];

export const teamPerformanceData = [
  { team: "Support", resolved: 45, avgTime: 2.3, satisfaction: 87 },
  { team: "Engineering", resolved: 32, avgTime: 4.1, satisfaction: 91 },
  { team: "Finance", resolved: 28, avgTime: 1.8, satisfaction: 94 },
  { team: "Legal", resolved: 15, avgTime: 6.2, satisfaction: 78 },
  { team: "Security", resolved: 22, avgTime: 3.5, satisfaction: 85 },
  { team: "Product", resolved: 38, avgTime: 2.0, satisfaction: 92 },
];

export const teams = ["Support", "Engineering", "Finance", "Legal", "Security", "Product", "Sales"];

export const workflowRules = [
  { id: "r1", name: "Route High Risk to Legal", condition: "Risk = High", action: "Route to Legal", enabled: true },
  { id: "r2", name: "Escalate Threats", condition: "Intent = Threat", action: "Escalate + Notify Manager", enabled: true },
  { id: "r3", name: "Auto-assign Complaints", condition: "Intent = Complaint", action: "Route to Support", enabled: true },
  { id: "r4", name: "SLA Alert", condition: "Response Time > 24h", action: "Send Alert", enabled: false },
];
