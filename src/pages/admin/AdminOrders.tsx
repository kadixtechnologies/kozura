import { useNavigate } from "react-router-dom";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, formatNGN } from "@/lib/mock-data";

export default function AdminOrders() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <AdminTopBar count={String(orders.length)} title="Orders" subtitle="All time" />

      <div className="p-7 space-y-5">
        <Tabs defaultValue="all">
          <TabsList className="bg-muted rounded-full p-1 h-auto">
            <TabsTrigger value="all" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm">All (47)</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm">Pending (12)</TabsTrigger>
            <TabsTrigger value="shipped" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm">Shipped (28)</TabsTrigger>
            <TabsTrigger value="cancelled" className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm">Cancelled (7)</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="rounded-[20px] border border-border/60 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                  <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell className="text-muted-foreground">{o.itemsCount}</TableCell>
                  <TableCell>{formatNGN(o.total)}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{o.paymentMethod}</TableCell>
                  <TableCell className="text-muted-foreground text-xs">{o.shipping}</TableCell>
                  <TableCell><StatusBadge status={o.status} /></TableCell>
                  <TableCell className="text-right text-muted-foreground text-xs">{o.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </AdminLayout>
  );
}
