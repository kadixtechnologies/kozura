import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type TimelineStep = {
  label: string;
  timestamp?: string;
  state: "complete" | "active" | "pending";
};

export function OrderTimeline({ steps }: { steps: TimelineStep[] }) {
  return (
    <ol className="relative space-y-5" style={{ WebkitPrintColorAdjust: "exact", printColorAdjust: "exact" }}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <li key={i} className="relative pl-10">
            {!isLast && (
              <span
                className={cn(
                  "absolute left-[15px] top-8 h-full w-px print:border-l print:border-black print:bg-transparent",
                  step.state === "complete" ? "bg-ink" : "bg-border",
                )}
              />
            )}
            <span
              className={cn(
                "absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full print:border print:border-black print:bg-transparent print:text-black",
                step.state === "complete" && "bg-ink text-ink-foreground",
                step.state === "active" && "bg-background border-2 border-ink text-foreground",
                step.state === "pending" && "bg-background border border-border text-muted-foreground",
              )}
            >
              {step.state === "complete" ? (
                <Check className="h-4 w-4" />
              ) : (
                <span className={cn("h-2 w-2 rounded-full", step.state === "active" ? "bg-ink" : "bg-muted-foreground/40")} />
              )}
            </span>
            <div>
              <div
                className={cn(
                  "font-medium text-sm",
                  step.state === "pending" ? "text-muted-foreground" : "text-foreground",
                )}
              >
                {step.label}
              </div>
              {step.timestamp && (
                <div className="text-xs text-muted-foreground mt-0.5">{step.timestamp}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
