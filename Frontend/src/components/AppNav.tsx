import { Mail, BarChart3, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppNavProps {
  active: "analyze" | "dashboard";
  onNavigate: (page: "analyze" | "dashboard") => void;
}

const navItems = [
  { id: "analyze" as const, label: "Analyze", icon: Zap },
  { id: "dashboard" as const, label: "Dashboard", icon: BarChart3 },
];

export function AppNav({ active, onNavigate }: AppNavProps) {
  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-50">
      <div className="container flex items-center justify-between h-16">
        <div className="flex items-center gap-2.5">
          <div className="rounded-lg bg-primary/10 p-2">
            <Mail className="h-5 w-5 text-primary" />
          </div>
          <h1 className="text-lg font-semibold text-foreground tracking-tight">
            Email Intelligence
          </h1>
        </div>
        <nav className="flex items-center gap-1 bg-secondary/50 rounded-lg p-1">
          {navItems.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all",
                active === id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
