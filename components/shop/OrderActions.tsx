"use client";

import { useState } from "react";
import { Truck, Printer, MessageCircle, XCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateOrderStatus } from "@/app/actions/orders";

export function OrderActions({ orderId, currentStatus }: { orderId: string, currentStatus: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateStatus = async (status: string) => {
    setIsLoading(true);
    const res = await updateOrderStatus(orderId, status);
    if (res.success) {
      toast.success(`Order marked as ${status}`);
    } else {
      toast.error(res.error || "Failed to update order");
    }
    setIsLoading(false);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-2">
      {currentStatus !== 'shipped' && currentStatus !== 'delivered' && currentStatus !== 'cancelled' && (
        <Button className="w-full gap-2" onClick={() => handleUpdateStatus('shipped')} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />} Mark as shipped
        </Button>
      )}
      {currentStatus === 'shipped' && (
        <Button className="w-full gap-2 bg-success hover:bg-success/90" onClick={() => handleUpdateStatus('delivered')} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />} Mark as delivered
        </Button>
      )}
      <Button variant="outline" className="w-full gap-2" onClick={handlePrint} disabled={isLoading}>
        <Printer className="h-4 w-4" /> Print order
      </Button>
      <Button variant="outline" className="w-full gap-2" disabled={isLoading}>
        <MessageCircle className="h-4 w-4" /> Send WhatsApp
      </Button>
      {currentStatus !== 'cancelled' && currentStatus !== 'returned' && currentStatus !== 'shipped' && currentStatus !== 'delivered' && (
        <Button variant="outline" className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleUpdateStatus('cancelled')} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Cancel order
        </Button>
      )}
      {(currentStatus === 'shipped' || currentStatus === 'delivered') && (
        <Button variant="outline" className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={() => handleUpdateStatus('cancelled')} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Mark as returned
        </Button>
      )}
    </div>
  );
}
