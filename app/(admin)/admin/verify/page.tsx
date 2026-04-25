"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { verifyAdminPassword } from "@/app/actions/admin";

export default function AdminVerifyPage() {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;

    setIsLoading(true);
    try {
      const res = await verifyAdminPassword(password);
      if (res.success) {
        toast.success("Identity verified");
        router.push("/admin");
      } else {
        toast.error(res.error || "Incorrect password");
        setPassword("");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-5">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2.5 mb-8 justify-center">
          <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-bold">SL</div>
          <span className="font-semibold tracking-tight">ShopLink Core</span>
        </div>
        
        <div className="bg-background rounded-[24px] border border-border/60 p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-xl font-semibold tracking-tight">Admin Verification</h1>
            <p className="text-sm text-muted-foreground mt-1.5">Enter the master password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="h-12 rounded-xl text-center tracking-widest bg-muted/30"
                autoFocus
              />
            </div>
            
            <Button 
              type="submit" 
              disabled={isLoading || !password}
              className="w-full h-12 rounded-xl bg-ink text-ink-foreground hover:bg-ink/90"
            >
              {isLoading ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
              ) : (
                "Verify & Enter"
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
