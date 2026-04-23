import { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatCard({
  label, value, icon: Icon, accent = "primary",
}: {
  label: string; value: string; icon: LucideIcon;
  accent?: "primary" | "warning" | "muted" | "success";
}) {
  const accentMap = {
    primary: "bg-primary-soft text-primary",
    warning: "bg-warning-soft text-warning-foreground",
    muted: "bg-muted text-muted-foreground",
    success: "bg-success-soft text-success",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</div>
          <div className="text-2xl font-semibold tracking-tight mt-2">{value}</div>
        </div>
        <div className={cn("h-9 w-9 rounded-md flex items-center justify-center shrink-0", accentMap[accent])}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
    </Card>
  );
}
