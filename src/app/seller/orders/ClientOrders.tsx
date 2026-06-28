"use client";

import { useRouter } from "next/navigation";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { StatusBadge } from "@/components/storefront/StatusBadge";
import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TablePagination } from "@/components/shared/TablePagination";
import { formatNGN } from "@/lib/format";

const tabs = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending", filter: "pending" },
  { value: "shipped", label: "Shipped", filter: "shipped" },
  { value: "cancelled", label: "Cancelled", filter: "cancelled" },
];

export function ClientOrders({ orders }: { orders: any[] }) {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const renderTable = (list: any[]) => {
    const totalPages = Math.ceil(list.length / itemsPerPage);
    const paginatedOrders = list.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    return (
      <div className="rounded-[20px] border border-border/60 overflow-hidden bg-background mt-5">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
          <tr className="border-b border-border/60 text-left text-muted-foreground text-xs">
            <th className="px-3 sm:px-5 py-3 font-medium">Order</th>
            <th className="px-3 sm:px-5 py-3 font-medium hidden sm:table-cell">Customer</th>
            <th className="px-3 sm:px-5 py-3 font-medium hidden sm:table-cell">Items</th>
            <th className="px-3 sm:px-5 py-3 font-medium hidden sm:table-cell">Total</th>
            <th className="px-3 sm:px-5 py-3 font-medium text-right sm:text-left">Status</th>
            <th className="px-3 sm:px-5 py-3 font-medium hidden sm:table-cell">Date</th>
          </tr>
        </thead>
        <tbody>
          {list.length === 0 ? (
            <tr><td colSpan={6} className="px-5 py-8 text-center text-muted-foreground">No orders found</td></tr>
          ) : paginatedOrders.map((o) => (
            <tr
              key={o.id}
              className="border-b border-border/60 last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer"
              onClick={() => router.push(`/seller/orders/${o.id}`)}
            >
              <td className="px-3 sm:px-5 py-3">
                <div className="font-medium">#{o.order_number}</div>
                <div className="text-muted-foreground truncate max-w-[140px] sm:hidden text-xs mt-0.5">{o.customer_name}</div>
              </td>
              <td className="px-3 sm:px-5 py-3 text-muted-foreground truncate max-w-[120px] sm:max-w-none hidden sm:table-cell">{o.customer_name}</td>
              <td className="px-3 sm:px-5 py-3 hidden sm:table-cell">{o.order_items?.length || 0}</td>
              <td className="px-3 sm:px-5 py-3 font-medium hidden sm:table-cell">{formatNGN(o.total_amount)}</td>
              <td className="px-3 sm:px-5 py-3 text-right sm:text-left">
                <div className="flex justify-end sm:justify-start">
                  <StatusBadge status={o.status.charAt(0).toUpperCase() + o.status.slice(1)} />
                </div>
                <div className="font-medium sm:hidden text-xs mt-1.5">{formatNGN(o.total_amount)}</div>
              </td>
              <td className="px-3 sm:px-5 py-3 text-muted-foreground hidden sm:table-cell">
                {new Date(o.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
      {list.length > 0 && (
        <TablePagination
          currentPage={currentPage}
          totalCount={list.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
          onItemsPerPageChange={(v) => setItemsPerPage(v)}
        />
      )}
    </div>
  )};

  return (
    <SellerLayout>
      <SellerTopBar
        count={String(orders.length)}
        title="Orders"
        subtitle="Manage incoming orders"
      />
      <div className="p-4 sm:p-7">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="mb-5 w-full sm:w-64">
            <Select value={activeTab} onValueChange={setActiveTab}>
              <SelectTrigger className="w-full rounded-xl bg-background h-10 px-3 text-[13px] sm:text-sm font-medium capitalize shadow-sm border-border/60">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-border/60">
                {tabs.map((t) => (
                  <SelectItem key={t.value} value={t.value} className="capitalize text-[13px] sm:text-sm rounded-lg cursor-pointer">
                    {t.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
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
