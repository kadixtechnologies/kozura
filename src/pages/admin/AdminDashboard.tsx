import { DollarSign, ShoppingBag, Clock, Package } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/shop/StatCard";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Card } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, stats, formatNGN } from "@/lib/mock-data";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <div className="border-b">
        <div className="px-6 lg:px-8 py-6">
          <h1 className="text-xl font-semibold tracking-tight">Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">Overview of your store performance.</p>
        </div>
      </div>

      <div className="p-6 lg:p-8 space-y-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total sales" value={formatNGN(stats.totalSales)} icon={DollarSign} accent="success" />
          <StatCard label="Total orders" value={String(stats.totalOrders)} icon={ShoppingBag} accent="primary" />
          <StatCard label="Pending orders" value={String(stats.pendingOrders)} icon={Clock} accent="warning" />
          <StatCard label="Products" value={String(stats.productsCount)} icon={Package} accent="muted" />
        </div>

        <Card className="overflow-hidden">
          <div className="px-5 py-4 border-b">
            <h2 className="font-medium text-sm">Recent orders</h2>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.slice(0, 5).map((o) => (
                <TableRow key={o.id}>
                  <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">{o.itemsCount}</TableCell>
                  <TableCell>{formatNGN(o.total)}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-muted-foreground">{o.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </AdminLayout>
  );
}
