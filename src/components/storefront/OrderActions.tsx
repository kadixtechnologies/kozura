"use client";

import { useState } from "react";
import { Truck, Printer, MessageCircle, XCircle, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateOrderStatus } from "@/actions/seller/orders";

export function OrderActions({ orderId, currentStatus, customerPhone, orderNumber }: { orderId: string, currentStatus: string, customerPhone?: string, orderNumber?: string }) {
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

  const handleWhatsApp = () => {
    if (!customerPhone) {
      toast.error("Customer phone number not available");
      return;
    }

    let phone = customerPhone.replace(/\D/g, "");
    if (phone.startsWith("0")) {
      phone = "234" + phone.substring(1);
    } else if (phone.length === 10 && !phone.startsWith("234")) {
      phone = "234" + phone;
    }

    const message = encodeURIComponent(`Hi, this is regarding your order #${orderNumber || orderId} on our store.`);
    window.open(`https://wa.me/${phone}?text=${message}`, "_blank");
  };

  // Terminal states — no further progression possible
  const isTerminal = currentStatus === "cancelled" || currentStatus === "returned";

  return (
    <div className="space-y-2">
      {/* Mark as shipped: only from pending or processing */}
      {!isTerminal && currentStatus !== "shipped" && currentStatus !== "delivered" && (
        <Button className="w-full gap-2" onClick={() => handleUpdateStatus("shipped")} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />} Mark as shipped
        </Button>
      )}

      {/* Mark as delivered: only when shipped */}
      {currentStatus === "shipped" && (
        <Button className="w-full gap-2 bg-success hover:bg-success/90" onClick={() => handleUpdateStatus("delivered")} disabled={isLoading}>
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Truck className="h-4 w-4" />} Mark as delivered
        </Button>
      )}

      <Button variant="outline" className="w-full gap-2" onClick={handlePrint} disabled={isLoading}>
        <Printer className="h-4 w-4" /> Print order
      </Button>
      <Button variant="outline" className="w-full gap-2" onClick={handleWhatsApp} disabled={isLoading}>
        <MessageCircle className="h-4 w-4" /> Send WhatsApp
      </Button>

      {/* Cancel: only on pending/processing — not once shipped, delivered, returned, or already cancelled */}
      {!isTerminal && currentStatus !== "shipped" && currentStatus !== "delivered" && (
        <Button
          variant="outline"
          className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => handleUpdateStatus("cancelled")}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <XCircle className="h-4 w-4" />} Cancel order
        </Button>
      )}

      {/* Mark as returned: only when shipped or delivered */}
      {(currentStatus === "shipped" || currentStatus === "delivered") && (
        <Button
          variant="outline"
          className="w-full gap-2 border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive"
          onClick={() => handleUpdateStatus("returned")}
          disabled={isLoading}
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />} Mark as returned
        </Button>
      )}

      {/* Inform seller when no further actions are available */}
      {isTerminal && (
        <p className="text-xs text-muted-foreground text-center pt-1">
          This order is <span className="font-semibold capitalize">{currentStatus}</span>. No further actions available.
        </p>
      )}
    </div>
  );
}
