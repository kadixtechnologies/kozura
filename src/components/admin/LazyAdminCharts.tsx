"use client";

import dynamic from "next/dynamic";

export const LazyAdminCharts = dynamic(
  () => import("./AdminCharts").then(mod => mod.AdminCharts),
  {
    ssr: false,
    loading: () => (
      <div className="h-[400px] w-full rounded-3xl border border-border/60 bg-muted/20 animate-pulse flex items-center justify-center text-muted-foreground">
        Loading charts...
      </div>
    )
  }
);
