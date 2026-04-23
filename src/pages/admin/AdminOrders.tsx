import { useNavigate } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { orders, formatNGN } from "@/lib/mock-data";

export default function AdminOrders() {
  const navigate = useNavigate();
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Orders</h1>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All (47)</TabsTrigger>
            <TabsTrigger value="pending">Pending (12)</TabsTrigger>
            <TabsTrigger value="shipped">Shipped (28)</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled (7)</TabsTrigger>
          </TabsList>
        </Tabs>

        <Card className="rounded-xl shadow-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order #</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {orders.map((o) => (
                <TableRow key={o.id} className="cursor-pointer" onClick={() => navigate(`/admin/orders/${o.id}`)}>
                  <TableCell className="font-medium">#{o.orderNumber}</TableCell>
                  <TableCell>{o.customerName}</TableCell>
                  <TableCell>{o.itemsCount}</TableCell>
                  <TableCell>{formatNGN(o.total)}</TableCell>
                  <TableCell className="text-muted-foreground">{o.paymentMethod}</TableCell>
                  <TableCell className="text-muted-foreground">{o.shipping}</TableCell>
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
