"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/actions/marketing/waitlist";
import { Loader2, CheckCircle2 } from "lucide-react";

export function WaitlistForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    const result = await joinWaitlist(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.success) {
      setSuccess(result.success);
    }

    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex items-center gap-3 bg-primary/10 text-primary p-4 rounded-2xl border border-primary/20 animate-in fade-in zoom-in duration-300">
        <CheckCircle2 className="h-6 w-6" />
        <p className="font-medium">{success}</p>
      </div>
    );
  }

  return (
    <form action={onSubmit} className="flex flex-col gap-3 w-full max-w-md">
      <div className="flex flex-col gap-3 w-full">
        <Input
          type="text"
          name="name"
          placeholder="Enter your full name"
          required
          disabled={loading}
          className="h-12 md:h-14 rounded-full px-6 text-base bg-background/80 backdrop-blur-sm border-border/60 shadow-sm focus-visible:ring-primary w-full"
        />
        <Input
          type="email"
          name="email"
          placeholder="Enter your email address"
          required
          disabled={loading}
          className="h-12 md:h-14 rounded-full px-6 text-base bg-background/80 backdrop-blur-sm border-border/60 shadow-sm focus-visible:ring-primary w-full"
        />
        <Button
          type="submit"
          disabled={loading}
          className="h-12 md:h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 font-medium shadow-sm w-full"
        >
          {loading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            "Join Waitlist"
          )}
        </Button>
      </div>
      {error && (
        <p className="text-sm text-destructive font-medium px-2 animate-in slide-in-from-top-2">
          {error}
        </p>
      )}
    </form>
  );
}
