import { cn } from "@/lib/utils";

type Status = "Pending" | "Shipped" | "Cancelled" | "Active" | "Inactive" | "Delivered";

const styles: Record<Status, string> = {
  Pending: "bg-warning-soft text-warning-foreground border-warning/30",
  Shipped: "bg-success-soft text-success border-success/20",
  Delivered: "bg-success-soft text-success border-success/20",
  Active: "bg-success-soft text-success border-success/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  Inactive: "bg-muted text-muted-foreground border-border",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium",
        styles[status],
        className,
      )}
    >
      {status}
    </span>
  );
}
