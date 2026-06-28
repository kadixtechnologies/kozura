"use client";

import { useState } from "react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TablePagination } from "@/components/shared/TablePagination";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Zap, TrendingUp, Briefcase, Crown, AlertTriangle, X, ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { updateStoreStatus, updateStorePlan, deleteStore as deleteStoreAction } from "@/actions/admin";

export type DbPlan = {
  id: string;
  name: string;
  price_monthly: number;
  order_limit: number;
};
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Static visual config keyed by lowercase plan name
const PLAN_VISUALS: Record<string, { icon: React.ElementType; color: string; badge: string }> = {
  free:     { icon: Zap,      color: "bg-muted",       badge: "bg-zinc-100 text-zinc-700" },
  starter:  { icon: Zap,      color: "bg-muted",       badge: "bg-zinc-100 text-zinc-700" },
  hustle:   { icon: TrendingUp, color: "bg-tile-butter", badge: "bg-amber-100 text-amber-700" },
  business: { icon: Briefcase, color: "bg-tile-sky",    badge: "bg-blue-100 text-blue-700" },
  boss:     { icon: Crown,    color: "bg-tile-peach",   badge: "bg-orange-100 text-orange-700" },
};

const DEFAULT_VISUAL = { icon: Zap, color: "bg-muted", badge: "bg-zinc-100 text-zinc-700" };

function formatOrderLimit(limit: number) {
  return limit === -1 ? "Unlimited orders" : `${limit} orders/mo`;
}

function formatPrice(price: number) {
  return price === 0 ? "Free" : `₦${price.toLocaleString("en-NG")}/mo`;
}

function PlanBadge({ planName }: { planName: string }) {
  const key = (planName || "free").toLowerCase();
  const visual = PLAN_VISUALS[key] || DEFAULT_VISUAL;
  const Icon = visual.icon;
  return (<span className={cn("inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold", visual.badge)}><Icon className="h-3 w-3" />{planName}</span>);
}

function ChangePlanDialog({ store, plans, onSave, onClose }: { store: any; plans: DbPlan[]; onSave: (planName: string) => Promise<void>; onClose: () => void }) {
  // Current plan is stored as the plan name (e.g. "Hustle") on the store row
  const currentPlanName = (store.subscription_plan || "free").toLowerCase();
  const [selected, setSelected] = useState<string>(currentPlanName);
  const [isLoading, setIsLoading] = useState(false);
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={(e) => !isLoading && e.target === e.currentTarget && onClose()}>
      <div className="bg-background rounded-[24px] border border-border/60 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="font-semibold text-base">Change plan</h2>
            <p className="text-sm text-muted-foreground mt-0.5">{store.name}</p>
          </div>
          <button onClick={onClose} disabled={isLoading} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"><X className="h-4 w-4" /></button>
        </div>
        <div className="space-y-2">
          {plans.map((plan) => {
            const key = plan.name.toLowerCase();
            const visual = PLAN_VISUALS[key] || DEFAULT_VISUAL;
            const Icon = visual.icon;
            const isSelected = selected === key;
            const isCurrent = currentPlanName === key;
            return (
              <button key={plan.id} onClick={() => setSelected(key)} disabled={isLoading} className={cn("w-full flex items-center gap-3 rounded-2xl border p-4 text-left transition-all", isSelected ? "border-foreground/30 bg-muted/50" : "border-border hover:border-foreground/20")}>
                <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center shrink-0", visual.color)}><Icon className="h-4 w-4" /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm">{plan.name}</span>
                    {isCurrent && <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">Current</span>}
                  </div>
                  <div className="text-xs text-muted-foreground">{formatOrderLimit(plan.order_limit)} · {formatPrice(plan.price_monthly)}</div>
                </div>
                <div className={cn("h-5 w-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-all", isSelected ? "border-foreground bg-foreground" : "border-border")}>{isSelected && <div className="h-2 w-2 rounded-full bg-background" />}</div>
              </button>
            );
          })}
        </div>
        <div className="flex gap-2 mt-5">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button className="flex-1 rounded-xl" onClick={async () => { setIsLoading(true); await onSave(selected); setIsLoading(false); }} disabled={selected === currentPlanName || isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save plan"}</Button>
        </div>
      </div>
    </div>
  );
}

function DeleteStoreDialog({ store, onConfirm, onClose }: { store: any; onConfirm: () => Promise<void>; onClose: () => void }) {
  const [confirmText, setConfirmText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isConfirmed = confirmText === store.name;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={(e) => !isLoading && e.target === e.currentTarget && onClose()}>
      <div className="bg-background rounded-[24px] border border-border/60 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start gap-3 mb-5"><div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0 mt-0.5"><AlertTriangle className="h-5 w-5 text-destructive" /></div><div className="flex-1"><h2 className="font-semibold text-base">Delete store</h2><p className="text-sm text-muted-foreground mt-1">This will permanently delete <strong>{store.name}</strong> and all associated data. This cannot be undone.</p></div><button onClick={onClose} disabled={isLoading} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors shrink-0"><X className="h-4 w-4" /></button></div>
        <div className="space-y-2 mb-5"><label className="text-xs text-muted-foreground">Type <span className="font-mono font-bold text-foreground">{store.name}</span> to confirm</label><input autoFocus value={confirmText} disabled={isLoading} onChange={(e) => setConfirmText(e.target.value)} placeholder={store.name} className="w-full rounded-xl border border-border bg-muted/40 px-4 py-2.5 text-sm outline-none focus:border-destructive/50 focus:ring-2 focus:ring-destructive/20 transition-all" /></div>
        <div className="flex gap-2"><Button variant="outline" className="flex-1 rounded-xl" onClick={onClose} disabled={isLoading}>Cancel</Button><Button variant="destructive" className="flex-1 rounded-xl" disabled={!isConfirmed || isLoading} onClick={async () => { setIsLoading(true); await onConfirm(); setIsLoading(false); }}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete store"}</Button></div>
      </div>
    </div>
  );
}

function ActionMenu({ store, onToggle, onChangePlan, onDelete }: { store: any; onToggle: () => void; onChangePlan: () => void; onDelete: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1.5 rounded-xl h-8 text-[11px] sm:text-xs">
          Actions <ChevronDown className="h-3.5 w-3.5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-1.5">
        <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer text-[11px] sm:text-xs" onClick={onToggle}>
          {store.is_active ? "Deactivate" : "Activate"}
        </DropdownMenuItem>
        <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer text-[11px] sm:text-xs" onClick={onChangePlan}>
          Change plan
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 border-t border-border/60" />
        <DropdownMenuItem className="rounded-xl px-3 py-2 cursor-pointer text-[11px] sm:text-xs text-destructive focus:text-destructive focus:bg-destructive/10" onClick={onDelete}>
          Delete store
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ClientAdminStoresPage({ initialStores, plans }: { initialStores: any[]; plans: DbPlan[] }) {
  const [stores, setStores] = useState(initialStores);
  const [planDialog, setPlanDialog] = useState<any | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<any | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const totalPages = Math.ceil(stores.length / itemsPerPage);
  const paginatedStores = stores.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const toggleStatus = async (id: string) => {
    const s = stores.find((s) => s.id === id)!;
    const newStatus = s.is_active ? "inactive" : "active";
    const res = await updateStoreStatus(id, newStatus);
    if (res.success) {
      setStores((prev) => prev.map((store) => store.id === id ? { ...store, is_active: newStatus === "active" } : store));
      toast.success(`${s.name} ${newStatus === "inactive" ? "deactivated" : "activated"}`);
    } else {
      toast.error(res.error || "Failed to update store status");
    }
  };

  const changePlan = async (id: string, planName: string) => {
    const res = await updateStorePlan(id, planName);
    if (res.success) {
      setStores((prev) => prev.map((s) => (s.id === id ? { ...s, subscription_plan: planName } : s)));
      const displayName = plans.find((p) => p.name.toLowerCase() === planName)?.name || planName;
      toast.success(`${stores.find((s) => s.id === id)!.name} moved to ${displayName}`);
      setPlanDialog(null);
    } else {
      toast.error(res.error || "Failed to update store plan");
    }
  };

  const deleteStore = async (id: string) => {
    const name = stores.find((s) => s.id === id)!.name;
    const res = await deleteStoreAction(id);
    if (res.success) {
      setStores((prev) => prev.filter((s) => s.id !== id));
      toast.error(`${name} has been deleted`);
      setDeleteDialog(null);
    } else {
      toast.error(res.error || "Failed to delete store");
    }
  };

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(val || 0);
  };

  return (
    <>
      <AdminLayout>
        <AdminTopBar title="Manage Stores" count={String(stores.length)} subtitle="All registered sellers" />
        <div className="p-4 sm:p-7">
          <div className="rounded-[20px] border border-border/60 bg-background">
            <Table>
              <TableHeader><TableRow className="hover:bg-transparent"><TableHead>Store Name</TableHead><TableHead className="hidden sm:table-cell">Contact Info</TableHead><TableHead>Plan</TableHead><TableHead className="hidden sm:table-cell">Revenue</TableHead><TableHead className="hidden sm:table-cell">Status</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
              <TableBody>
                {stores.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No stores found</TableCell></TableRow>
                ) : paginatedStores.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="font-semibold">{s.name}</div>
                      <div className="sm:hidden text-[11px] text-muted-foreground mt-0.5">{s.seller?.full_name || s.account_name} • {formatCurrency(s.totalRevenue)}</div>
                      <div className="sm:hidden mt-1"><span className={cn("inline-flex items-center rounded-full px-2 py-0 text-[10px] font-semibold", s.is_active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>{s.is_active ? "Active" : "Inactive"}</span></div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell"><div className="flex flex-col"><span className="font-medium text-sm">{s.seller?.full_name || s.account_name}</span><span className="text-[11px] text-muted-foreground">{s.seller?.email || s.contact_email}</span><span className="text-[11px] text-muted-foreground">{s.whatsapp_number}</span></div></TableCell>
                    <TableCell><PlanBadge planName={s.subscription_plan} /></TableCell>
                    <TableCell className="font-medium hidden sm:table-cell">{formatCurrency(s.totalRevenue)}</TableCell>
                    <TableCell className="hidden sm:table-cell"><span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold", s.is_active ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive")}>{s.is_active ? "Active" : "Inactive"}</span></TableCell>
                    <TableCell className="text-right"><ActionMenu store={s} onToggle={() => toggleStatus(s.id)} onChangePlan={() => setPlanDialog(s)} onDelete={() => setDeleteDialog(s)} /></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {stores.length > 0 && (
            <TablePagination
              currentPage={currentPage}
              totalCount={stores.length}
              itemsPerPage={itemsPerPage}
              onPageChange={setCurrentPage}
              onItemsPerPageChange={(v) => { setItemsPerPage(v); setCurrentPage(1); }}
            />
          )}
        </div>
      </AdminLayout>
      {planDialog && <ChangePlanDialog store={planDialog} plans={plans} onSave={(planName) => changePlan(planDialog.id, planName)} onClose={() => setPlanDialog(null)} />}
      {deleteDialog && <DeleteStoreDialog store={deleteDialog} onConfirm={() => deleteStore(deleteDialog.id)} onClose={() => setDeleteDialog(null)} />}
    </>
  );
}
