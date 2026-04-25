"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { DollarSign, ShoppingBag, Package, ArrowUpRight, Copy, ExternalLink, Share2, X, Check } from "lucide-react";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { StatCard } from "@/components/shop/StatCard";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Format currency
const formatNGN = (amount: number) => {
  return new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN', maximumFractionDigits: 0 }).format(amount);
};

export function ClientDashboard({ store, stats, recentOrders }: { store: any, stats: any, recentOrders: any[] }) {
  const router = useRouter();
  const storeUrl = `shoplink.app/${store.slug}`;
  const [showShare, setShowShare] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const copyLink = async () => {
    try { await navigator.clipboard.writeText(`https://${storeUrl}`); } catch {
      const el = document.createElement("textarea"); el.value = `https://${storeUrl}`; el.style.position = "fixed"; el.style.opacity = "0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopiedLink(true); toast.success("Store link copied!"); setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareLinks = [
    { label: "WhatsApp", color: "bg-green-500 hover:bg-green-600", icon: "💬", url: `https://wa.me/?text=${encodeURIComponent(`Check out my store: https://${storeUrl}`)}` },
    { label: "X (Twitter)", color: "bg-ink hover:bg-ink/90", icon: "𝕏", url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my store on ShopLink!`)}&url=${encodeURIComponent(`https://${storeUrl}`)}` },
    { label: "Facebook", color: "bg-blue-600 hover:bg-blue-700", icon: "f", url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://${storeUrl}`)}` },
  ];

  return (
    <>
      <SellerLayout>
        <SellerTopBar title="Dashboard" subtitle={`Welcome back, ${store.name}`} action={<Button onClick={() => setShowShare(true)} className="gap-2"><Share2 className="h-4 w-4" /> Share store</Button>} />
        <div className="p-4 md:p-7 space-y-6">
          <div className="rounded-[20px] border border-border/60 bg-muted/30 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <div className="h-10 w-10 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-semibold shrink-0">{store.name.charAt(0)}</div>
              <div className="min-w-0">
                <div className="text-xs text-muted-foreground">Your store link</div>
                <div className="font-medium text-sm truncate">{storeUrl}</div>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button variant="outline" size="sm" className="gap-1.5" onClick={copyLink}>
                {copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copiedLink ? "Copied" : "Copy"}
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5" asChild>
                <Link href={`/${store.slug}`} target="_blank"><ExternalLink className="h-3.5 w-3.5" /> Visit</Link>
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total Sales" value={formatNGN(stats.totalSales)} icon={DollarSign} accent="primary" />
            <StatCard label="Total Orders" value={String(stats.totalOrders)} icon={ShoppingBag} accent="warning" />
            <StatCard label="Pending" value={String(stats.pendingOrders)} icon={ShoppingBag} accent="muted" />
            <StatCard label="Products" value={String(stats.productsCount)} icon={Package} accent="success" />
          </div>
          <div className="rounded-[20px] border border-border/60 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/60">
              <h2 className="font-semibold text-sm">Recent orders</h2>
              <Link href="/seller/orders" className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1">View all <ArrowUpRight className="h-3 w-3" /></Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead><tr className="border-b border-border/60 text-left text-muted-foreground text-xs"><th className="px-5 py-3 font-medium">Order</th><th className="px-5 py-3 font-medium">Customer</th><th className="px-5 py-3 font-medium">Amount</th><th className="px-5 py-3 font-medium">Status</th></tr></thead>
                <tbody>
                  {recentOrders.length === 0 ? (
                    <tr><td colSpan={4} className="px-5 py-8 text-center text-muted-foreground">No orders yet</td></tr>
                  ) : recentOrders.map((o) => (
                    <tr key={o.id} className="border-b border-border/60 last:border-b-0 hover:bg-muted/30 transition-colors cursor-pointer" onClick={() => router.push(`/seller/orders/${o.id}`)}>
                      <td className="px-5 py-3 font-medium">{o.order_number}</td>
                      <td className="px-5 py-3 text-muted-foreground">{o.customer_name}</td>
                      <td className="px-5 py-3 font-medium">{formatNGN(o.total_amount)}</td>
                      <td className="px-5 py-3"><StatusBadge status={o.status.charAt(0).toUpperCase() + o.status.slice(1)} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="rounded-[20px] border border-border/60 p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div><h3 className="font-semibold text-sm">Quick start</h3><p className="text-xs text-muted-foreground mt-0.5">Add your first product to your store.</p></div>
            <Button asChild size="sm"><Link href="/seller/products/new">Add product</Link></Button>
          </div>
        </div>
      </SellerLayout>

      {showShare && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)" }} onClick={(e) => e.target === e.currentTarget && setShowShare(false)}>
          <div className="bg-background rounded-[24px] border border-border/60 shadow-2xl w-full max-w-sm p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-semibold text-base">Share your store</h2>
              <button onClick={() => setShowShare(false)} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"><X className="h-4 w-4" /></button>
            </div>
            <div className="rounded-2xl bg-muted/50 border border-border/60 p-4 flex items-center justify-between gap-3 mb-5">
              <span className="text-sm font-medium truncate">{storeUrl}</span>
              <Button variant="outline" size="sm" className="shrink-0 gap-1.5" onClick={copyLink}>{copiedLink ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}{copiedLink ? "Copied" : "Copy"}</Button>
            </div>
            <div className="space-y-2">
              {shareLinks.map((s) => (
                <a key={s.label} href={s.url} target="_blank" rel="noopener noreferrer" className={cn("flex items-center gap-3 w-full px-4 py-3 rounded-2xl text-white text-sm font-medium transition-colors", s.color)}>
                  <span className="h-8 w-8 rounded-xl bg-white/20 flex items-center justify-center text-base font-bold">{s.icon}</span>{s.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
