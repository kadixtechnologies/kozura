import { cn } from "@/lib/utils";

export type Status = "Pending" | "Processing" | "Shipped" | "Cancelled" | "Active" | "Inactive" | "Delivered" | "Returned";

const styles: Record<Status, string> = {
  Pending: "bg-tile-butter text-foreground",
  Processing: "bg-tile-sky text-foreground",
  Shipped: "bg-tile-sky text-foreground",
  Delivered: "bg-tile-mint text-foreground",
  Active: "bg-tile-mint text-foreground",
  Cancelled: "bg-destructive/10 text-destructive",
  Returned: "bg-destructive/10 text-destructive",
  Inactive: "bg-muted text-muted-foreground",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-medium",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      {status}
    </span>
  );
}
