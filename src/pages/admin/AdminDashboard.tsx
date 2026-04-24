import { Link } from "react-router-dom";
import { DollarSign, ShoppingBag, Clock, Package, ArrowUpRight, Plus } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { StatCard } from "@/components/shop/StatCard";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, stats, formatNGN } from "@/lib/mock-data";

export default function AdminDashboard() {
  return (
    <AdminLayout>
      <AdminTopBar
        count={String(stats.totalOrders)}
        title="Orders"
        subtitle="Last 7 days"
        action={
          <>
            <div className="hidden sm:inline-flex items-center gap-1 bg-muted rounded-full p-1">
              <span className="px-3.5 py-1 rounded-full bg-background text-sm font-medium">Dashboard</span>
              <Link to="/admin/orders" className="px-3.5 py-1 text-sm text-muted-foreground">Website</Link>
            </div>
            <Button asChild size="sm" className="gap-1.5">
              <Link to="/admin/products/new"><Plus className="h-4 w-4" /> New product</Link>
            </Button>
          </>
        }
      />

      <div className="p-7 space-y-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total sales" value={formatNGN(stats.totalSales)} icon={DollarSign} accent="primary" trend="+12%" />
          <StatCard label="Total orders" value={String(stats.totalOrders)} icon={ShoppingBag} accent="warning" trend="+5" />
          <StatCard label="Pending orders" value={String(stats.pendingOrders)} icon={Clock} accent="success" />
          <StatCard label="Products" value={String(stats.productsCount)} icon={Package} accent="muted" />
        </div>

        <div className="grid lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 rounded-[20px] border border-border/60 overflow-hidden">
            <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between">
              <h2 className="font-semibold text-sm">Recent orders</h2>
              <Link to="/admin/orders" className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                See all <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.slice(0, 5).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                    <TableCell>{o.customerName}</TableCell>
                    <TableCell>{formatNGN(o.total)}</TableCell>
                    <TableCell><StatusBadge status={o.status} /></TableCell>
                    <TableCell className="text-right text-muted-foreground text-xs">{o.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="space-y-5">
            <div className="rounded-[20px] bg-tile-mint p-6 min-h-[180px] flex flex-col justify-between">
              <div className="text-xs uppercase tracking-wider text-foreground/60 font-medium">Tip of the day</div>
              <div>
                <div className="font-semibold text-lg tracking-tight leading-tight">Add product images to boost conversions by up to 30%.</div>
                <Button asChild size="sm" variant="outline" className="mt-4 bg-background border-transparent">
                  <Link to="/admin/products">Review products <ArrowUpRight className="h-3.5 w-3.5" /></Link>
                </Button>
              </div>
            </div>
            <div className="rounded-[20px] bg-tile-butter p-6">
              <div className="text-xs uppercase tracking-wider text-foreground/60 font-medium">Store status</div>
              <div className="mt-3 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-success" />
                <span className="font-medium text-sm">Live & accepting orders</span>
              </div>
              <div className="text-xs text-foreground/60 mt-2">Visible to customers worldwide.</div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
