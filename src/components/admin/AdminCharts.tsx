"use client";

import { useMemo } from "react";
import { format, subDays, startOfDay } from "date-fns";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const chartConfig = {
  revenue: {
    label: "Revenue",
    color: "hsl(var(--ink))",
  },
  orders: {
    label: "Orders",
    color: "hsl(var(--tile-mint))",
  },
};

export function AdminCharts({ orders }: { orders: any[] }) {
  // Aggregate data by the last 7 days
  const chartData = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const targetDate = startOfDay(subDays(new Date(), i));
      const dateString = format(targetDate, "MMM dd");
      
      const dayOrders = orders.filter((o) => {
        const orderDate = startOfDay(new Date(o.created_at));
        return orderDate.getTime() === targetDate.getTime();
      });

      const revenue = dayOrders
        .filter((o) => o.status !== "cancelled")
        .reduce((sum, o) => sum + (Number(o.total_amount) || 0), 0);

      data.push({
        date: dateString,
        revenue,
        orders: dayOrders.length,
      });
    }
    return data;
  }, [orders]);

  return (
    <div className="grid lg:grid-cols-2 gap-6 mt-6">
      <div className="rounded-[20px] bg-background p-6 border border-border/60 shadow-sm flex flex-col">
        <div className="mb-6">
          <h3 className="font-semibold text-base">Revenue Over Time</h3>
          <p className="text-xs text-muted-foreground mt-1">Platform gross merchandise value (last 7 days)</p>
        </div>
        <div className="flex-1 min-h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <AreaChart accessibilityLayer data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8} 
                tickFormatter={(value) => `₦${(value / 1000).toFixed(0)}k`}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Area
                dataKey="revenue"
                type="monotone"
                fill="var(--color-revenue)"
                fillOpacity={0.1}
                stroke="var(--color-revenue)"
                strokeWidth={3}
              />
            </AreaChart>
          </ChartContainer>
        </div>
      </div>

      <div className="rounded-[20px] bg-background p-6 border border-border/60 shadow-sm flex flex-col">
        <div className="mb-6">
          <h3 className="font-semibold text-base">Order Volume</h3>
          <p className="text-xs text-muted-foreground mt-1">Total orders placed across all stores (last 7 days)</p>
        </div>
        <div className="flex-1 min-h-[300px]">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ left: -20, right: 10, top: 10, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" className="stroke-border/50" />
              <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} className="text-xs" />
              <YAxis 
                tickLine={false} 
                axisLine={false} 
                tickMargin={8}
                className="text-xs"
              />
              <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
              <Bar dataKey="orders" fill="var(--color-orders)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </div>
      </div>
    </div>
  );
}
