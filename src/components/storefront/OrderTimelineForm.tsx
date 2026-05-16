"use client";

import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { addOrderNote } from "@/actions/seller/orders";

export function OrderTimelineForm({ orderId }: { orderId: string }) {
  const [note, setNote] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!note.trim()) return toast.error("Please enter a note");
    setIsLoading(true);
    const res = await addOrderNote(orderId, note.trim());
    if (res.success) {
      toast.success("Note added to timeline");
      setNote("");
    } else {
      toast.error(res.error || "Failed to add note");
    }
    setIsLoading(false);
  };

  return (
    <div>
      <Textarea
        placeholder="Add a note..."
        rows={3}
        className="rounded-2xl resize-none"
        value={note}
        onChange={(e) => setNote(e.target.value)}
        disabled={isLoading}
      />
      <Button className="mt-3" size="sm" onClick={handleSubmit} disabled={isLoading || !note.trim()}>
        {isLoading && <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />}
        Add to timeline
      </Button>
    </div>
  );
}
