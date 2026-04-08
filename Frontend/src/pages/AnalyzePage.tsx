import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { useAnalyzeEmail } from "@/hooks/useAnalyzeEmail";
import { AnalysisResult } from "@/components/AnalysisResult";
import type { EmailResponse } from "@/types/email";

interface AnalyzePageProps {
  onResult: (response: EmailResponse) => void;
}

export function AnalyzePage({ onResult }: AnalyzePageProps) {
  const [emailText, setEmailText] = useState("");
  const { mutate, isPending, error, data } = useAnalyzeEmail();

  const handleAnalyze = () => {
    if (!emailText.trim()) return;
    mutate(emailText.trim(), {
      onSuccess: (response) => {
        onResult(response);
      },
    });
  };

  return (
    <div className="container max-w-3xl py-10 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Analyze Email
        </h2>
        <p className="text-muted-foreground text-sm">
          Paste an email below to get AI-powered insights on intent, sentiment, urgency, and risk.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4 animate-slide-up">
        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          placeholder="Paste your email content here..."
          rows={8}
          className="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-none transition-all"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {emailText.length > 0
              ? `${emailText.trim().split(/\s+/).length} words`
              : "Enter email text to begin"}
          </span>
          <button
            onClick={handleAnalyze}
            disabled={isPending || !emailText.trim()}
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-lg text-sm font-medium transition-all hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isPending ? "Analyzing…" : "Analyze Email"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4 text-sm text-destructive animate-fade-in">
          {error.message}
        </div>
      )}

      {data && <AnalysisResult analysis={data.analysis} />}
    </div>
  );
}
