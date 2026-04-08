import { useState, useCallback } from "react";
import type { AnalysisHistory, EmailResponse } from "@/types/email";

export function useAnalysisHistory() {
  const [history, setHistory] = useState<AnalysisHistory[]>([]);

  const addEntry = useCallback((response: EmailResponse) => {
    setHistory((prev) => [
      {
        ...response,
        id: crypto.randomUUID(),
        timestamp: new Date(),
      },
      ...prev,
    ]);
  }, []);

  const stats = {
    total: history.length,
    highRisk: history.filter((h) => h.analysis.risk.toLowerCase() === "high").length,
    highUrgency: history.filter((h) => h.analysis.urgency.toLowerCase() === "high").length,
    negativeSentiment: history.filter((h) => h.analysis.sentiment.toLowerCase() === "negative").length,
  };

  const sentimentDistribution = ["positive", "neutral", "negative"].map((s) => ({
    name: s.charAt(0).toUpperCase() + s.slice(1),
    value: history.filter((h) => h.analysis.sentiment.toLowerCase() === s).length,
  }));

  const riskDistribution = ["low", "medium", "high"].map((r) => ({
    name: r.charAt(0).toUpperCase() + r.slice(1),
    value: history.filter((h) => h.analysis.risk.toLowerCase() === r).length,
  }));

  return { history, addEntry, stats, sentimentDistribution, riskDistribution };
}
