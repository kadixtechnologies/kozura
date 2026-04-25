"use client";

import { useState } from "react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Zap, TrendingUp, Briefcase, Crown, Edit2, X, Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { updatePlanLimits } from "@/app/actions/admin";

type Plan = {
  id: string;
  name: string;
  description: string;
  price_monthly: number;
  order_limit: number;
  product_limit: number;
  bg_color: string;
  popular: boolean;
};

function EditPlanDialog({ plan, onSave, onClose }: { plan: Plan; onSave: (updates: any) => Promise<void>; onClose: () => void }) {
  const [formData, setFormData] = useState({
    price_monthly: plan.price_monthly,
    order_limit: plan.order_limit,
    product_limit: plan.product_limit,
  });
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={(e) => !isLoading && e.target === e.currentTarget && onClose()}>
      <div className="bg-background rounded-[24px] border border-border/60 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-base">Edit {plan.name} Plan</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Updates apply to all users on this plan</p>
          </div>
          <button onClick={onClose} disabled={isLoading} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Monthly Price (₦)</label>
            <input 
              type="number" 
              value={formData.price_monthly} 
              onChange={(e) => setFormData({...formData, price_monthly: Number(e.target.value)})}
              className="w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Monthly Order Limit (-1 for Unlimited)</label>
            <input 
              type="number" 
              value={formData.order_limit} 
              onChange={(e) => setFormData({...formData, order_limit: Number(e.target.value)})}
              className="w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground ml-1">Product Upload Limit (-1 for Unlimited)</label>
            <input 
              type="number" 
              value={formData.product_limit} 
              onChange={(e) => setFormData({...formData, product_limit: Number(e.target.value)})}
              className="w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-primary/50 transition-all"
            />
          </div>
        </div>

        <div className="mt-6 p-3 rounded-xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 flex gap-3">
          <Info className="h-5 w-5 text-blue-500 shrink-0" />
          <p className="text-[11px] text-blue-700 dark:text-blue-300 leading-relaxed">
            Changing these values will immediately affect the dashboard limits for all sellers currently subscribed to the <strong>{plan.name}</strong> plan.
          </p>
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button className="flex-1 rounded-xl" onClick={async () => { setIsLoading(true); await onSave(formData); setIsLoading(false); }} disabled={isLoading}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ClientAdminPlansPage({ initialPlans }: { initialPlans: any[] }) {
  const [plans, setPlans] = useState(initialPlans);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);

  const handleUpdate = async (planId: string, updates: any) => {
    const res = await updatePlanLimits(planId, updates);
    if (res.success) {
      setPlans(prev => prev.map(p => p.id === planId ? { ...p, ...updates } : p));
      toast.success("Plan limits updated successfully");
      setEditingPlan(null);
    } else {
      toast.error(res.error || "Failed to update plan");
    }
  };

  const formatLimit = (limit: number) => {
    if (limit === -1) return "Unlimited";
    return limit.toLocaleString();
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <>
      <AdminLayout>
        <AdminTopBar title="Pricing Plans" count={String(plans.length)} subtitle="Manage subscription limits" />
        <div className="p-7">
          <div className="rounded-[20px] border border-border/60 bg-background">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent">
                  <TableHead>Plan Name</TableHead>
                  <TableHead>Monthly Price</TableHead>
                  <TableHead>Order Limit</TableHead>
                  <TableHead>Product Limit</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan) => {
                  return (
                    <TableRow key={plan.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-semibold text-sm">{plan.name}</div>
                            <div className="text-[10px] text-muted-foreground">{plan.description}</div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium text-sm">
                        {plan.price_monthly === 0 ? "Free" : formatCurrency(plan.price_monthly)}
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLimit(plan.order_limit)} <span className="text-[10px] text-muted-foreground">/mo</span>
                      </TableCell>
                      <TableCell className="text-sm">
                        {formatLimit(plan.product_limit)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" className="rounded-xl h-8 px-3 gap-1.5" onClick={() => setEditingPlan(plan)}>
                          <Edit2 className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </div>
      </AdminLayout>
      {editingPlan && (
        <EditPlanDialog 
          plan={editingPlan} 
          onSave={(updates) => handleUpdate(editingPlan.id, updates)} 
          onClose={() => setEditingPlan(null)} 
        />
      )}
    </>
  );
}
