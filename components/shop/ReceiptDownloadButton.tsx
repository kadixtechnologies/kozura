"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ReceiptDownloadButton({ url }: { url: string }) {
  const handleDownload = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      // Extract extension from URL
      const ext = url.split(".").pop()?.split("?")[0] || "png";
      link.download = `payment-receipt.${ext}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (err) {
      toast.error("Failed to download receipt");
    }
  };

  return (
    <Button size="icon" variant="outline" className="h-8 w-8 rounded-full shrink-0" onClick={handleDownload} title="Download receipt">
      <Download className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
