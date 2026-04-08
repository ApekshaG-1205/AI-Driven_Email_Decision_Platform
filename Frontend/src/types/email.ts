export type EmailAnalysis = {
  intent: string;
  sentiment: string;
  urgency: string;
  risk: string;
  final_decision: string;
};

export type EmailResponse = {
  email_text: string;
  analysis: EmailAnalysis;
};

export type AnalysisHistory = EmailResponse & {
  id: string;
  timestamp: Date;
};
