import { StatsCards } from "@/components/StatsCards";
import { DistributionChart } from "@/components/DistributionChart";

interface DashboardPageProps {
  stats: { total: number; highRisk: number; highUrgency: number; negativeSentiment: number };
  sentimentDistribution: { name: string; value: number }[];
  riskDistribution: { name: string; value: number }[];
}

const sentimentColors = ["#22c55e", "#6b7280", "#ef4444"];
const riskColors = ["#22c55e", "#f97316", "#ef4444"];

export function DashboardPage({ stats, sentimentDistribution, riskDistribution }: DashboardPageProps) {
  return (
    <div className="container py-10 space-y-8">
      <div className="animate-fade-in">
        <h2 className="text-2xl font-bold text-foreground tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Overview of all analyzed emails and key metrics.
        </p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DistributionChart
          title="Sentiment Distribution"
          data={sentimentDistribution}
          colors={sentimentColors}
        />
        <DistributionChart
          title="Risk Distribution"
          data={riskDistribution}
          colors={riskColors}
        />
      </div>
    </div>
  );
}
