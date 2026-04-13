import { useState } from "react";
import { Send, Loader2, ClipboardPaste } from "lucide-react";
import { useAnalyzeEmail } from "@/hooks/useAnalyzeEmail";
import { AnalysisResult } from "@/components/AnalysisResult";
import type { EmailResponse } from "@/types/email";

interface AnalyzePageProps {
  onResult: (response: EmailResponse) => void;
}

// Must match backend EmailRequest.max_length
const MAX_CHARS = 50_000;

export function AnalyzePage({ onResult }: AnalyzePageProps) {
  const [emailText, setEmailText] = useState("");
  const { mutate, isPending, error, data } = useAnalyzeEmail();

  const charCount = emailText.length;
  const wordCount = emailText.trim() ? emailText.trim().split(/\s+/).length : 0;
  const isOverLimit = charCount > MAX_CHARS;

  const handleAnalyze = () => {
    if (!emailText.trim() || isOverLimit) return;
    mutate(emailText.trim(), {
      onSuccess: (response) => {
        onResult(response);
      },
    });
  };

  // Allow Ctrl/Cmd+Enter to submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      handleAnalyze();
    }
  };

  return (
    <div className="container max-w-3xl py-10 space-y-8">
      <div className="text-center space-y-2 animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">
          Analyze Email
        </h2>
        <p className="text-muted-foreground text-sm">
          Paste a full email below — including subject, body, and any quoted
          replies. The analyzer will extract the core content automatically.
        </p>
      </div>

      <div className="glass-card p-6 space-y-4 animate-slide-up">
        {/* Label + paste hint */}
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-foreground flex items-center gap-1.5">
            <ClipboardPaste className="h-4 w-4 text-muted-foreground" />
            Email Content
          </label>
          <span className="text-xs text-muted-foreground">
            Tip: Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-xs font-mono">Ctrl+Enter</kbd> to analyze
          </span>
        </div>

        <textarea
          value={emailText}
          onChange={(e) => setEmailText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={`Paste your full email here...\n\nDear Support Team,\nI need urgent assistance with my account...\n\nBest regards,\nJohn`}
          rows={12}
          className={`w-full bg-secondary/50 border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 resize-y transition-all font-mono leading-relaxed ${
            isOverLimit
              ? "border-destructive/60 focus:ring-destructive/50"
              : "border-border"
          }`}
        />

        {/* Footer bar: word/char count + submit */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            {emailText.trim() ? (
              <>
                <span>{wordCount.toLocaleString()} words</span>
                <span className="text-border">·</span>
                <span className={isOverLimit ? "text-destructive font-medium" : ""}>
                  {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
                </span>
              </>
            ) : (
              <span>Enter or paste your email to begin</span>
            )}
          </div>
          <button
            onClick={handleAnalyze}
            disabled={isPending || !emailText.trim() || isOverLimit}
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

        {/* Over-limit warning */}
        {isOverLimit && (
          <p className="text-xs text-destructive">
            Email exceeds the {MAX_CHARS.toLocaleString()}-character limit. Please shorten it before analyzing.
          </p>
        )}
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