import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AppNav } from "@/components/AppNav";
import { AnalyzePage } from "@/pages/AnalyzePage";
import { DashboardPage } from "@/pages/DashboardPage";
import { useAnalysisHistory } from "@/hooks/useAnalysisHistory";

const queryClient = new QueryClient();

function AppContent() {
  const [page, setPage] = useState<"analyze" | "dashboard">("analyze");
  const { addEntry, stats, sentimentDistribution, riskDistribution } = useAnalysisHistory();

  return (
    <div className="min-h-screen bg-background">
      <AppNav active={page} onNavigate={setPage} />
      {page === "analyze" ? (
        <AnalyzePage onResult={addEntry} />
      ) : (
        <DashboardPage
          stats={stats}
          sentimentDistribution={sentimentDistribution}
          riskDistribution={riskDistribution}
        />
      )}
    </div>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
