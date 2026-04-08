import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

interface ChartData {
  name: string;
  value: number;
}

interface DistributionChartProps {
  title: string;
  data: ChartData[];
  colors: string[];
}

export function DistributionChart({ title, data, colors }: DistributionChartProps) {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="glass-card p-6">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">{title}</h3>
      {hasData ? (
        <ResponsiveContainer width="100%" height={240}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={4}
              dataKey="value"
              stroke="none"
            >
              {data.map((_, index) => (
                <Cell key={index} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(222 44% 9%)",
                border: "1px solid hsl(222 30% 16%)",
                borderRadius: "8px",
                color: "hsl(210 40% 96%)",
                fontSize: "13px",
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "13px", color: "hsl(215 20% 55%)" }}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="flex items-center justify-center h-[240px] text-muted-foreground text-sm">
          No data yet — analyze some emails first
        </div>
      )}
    </div>
  );
}
