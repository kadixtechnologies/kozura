"use client";

import { useRouter } from "next/navigation";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending", filter: "pending" },
  { value: "shipped", label: "Shipped", filter: "shipped" },
  { value: "cancelled", label: "Cancelled", filter: "cancelled" },
];

const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

export function ClientOrders({ orders }: { orders: any[] }) {
  const router = useRouter();

  const renderTable = (list: any[]) => (
    <div className="rounded-[20px] border border-border/60 overflow-hidden bg-background mt-5">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border/60 text-left text-muted-foreground text-xs">
            <th className="px-5 py-3 font-medium">Order</th>
            <th className="px-5 py-3 font-medium">Customer</th>
            <th className="px-5 py-3 font-medium hidden sm:table-cell">Items</th>
            <th className="px-5 py-3 font-medium">Total</th>
            <th className="px-5 py-3 font-medium">Status</th>
            <th className="px-5 py-3 font-medium hidden sm:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No orders found</td></tr>
          ) : list.map((o) => (
            <tr
              key={o.id}
              className="border-b border-border/60 last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/seller/orders/${o.id}`)}
            >
              <td className="px-5 py-3 font-medium">#{o.order_number}</td>
              <td className="px-5 py-3 text-muted-foreground">{o.customer_name}</td>
              <td className="px-5 py-3 hidden sm:table-cell">{o.order_items?.length || 0}</td>
              <td className="px-5 py-3 font-medium">{formatNGN(o.total_amount)}</td>
              <td className="px-5 py-3"><StatusBadge status={o.status.charAt(0).toUpperCase() + o.status.slice(1)} /></td>
              <td className="px-5 py-3 text-muted-foreground hidden sm:table-cell">
                {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <SellerLayout>
      <SellerTopBar
        count={String(orders.length)}
        title="Orders"
        subtitle="Manage incoming orders"
      />
      <div className="p-7">
        <Tabs defaultValue="all">
          <TabsList className="bg-muted rounded-full p-1 h-auto">
            {tabs.map((t) => (
              <TabsTrigger
                key={t.value}
                value={t.value}
                className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm capitalize"
              >
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabs.map((t) => (
            <TabsContent key={t.value} value={t.value}>
              {renderTable(t.filter ? orders.filter((o) => o.status === t.filter) : orders)}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </SellerLayout>
  );
}
