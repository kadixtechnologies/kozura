import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon: Icon, accent = "primary", trend,
}: {
  label: string; value: string; icon: LucideIcon;
  accent?: "primary" | "warning" | "muted" | "success";
  trend?: string;
}) {
  const accentMap = {
    primary: "bg-tile-mint",
    warning: "bg-tile-butter",
    muted: "bg-tile-mist",
    success: "bg-tile-sky",
  };
  return (
    <div className={cn("rounded-[20px] p-5 flex flex-col justify-between min-h-[130px]", accentMap[accent])}>
      <div className="flex items-center justify-between">
        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center">
          <Icon className="h-4 w-4 text-foreground" />
        </div>
        {trend && <span className="text-[11px] font-medium text-foreground/70">{trend}</span>}
      </div>
      <div>
        <div className="text-2xl font-semibold tracking-tight">{value}</div>
        <div className="text-xs text-foreground/60 mt-1">{label}</div>
      </div>
    </div>
  );
}
