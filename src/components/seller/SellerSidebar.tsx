"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, ExternalLink, LogOut, Plus } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { getSellerProfile, getSellerStore, signOutSeller } from "@/lib/auth/seller";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/seller/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/seller/products", icon: Package, label: "Products" },
  { href: "/seller/categories", icon: Tag, label: "Categories" },
  { href: "/seller/orders", icon: ShoppingBag, label: "Orders" },
  { href: "/seller/settings", icon: Settings, label: "Settings" },
];

export function SellerSidebar() {
  const pathname = usePathname();
  const [profile, setProfile] = useState<any>(null);
  const [activeStore, setActiveStore] = useState<any>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      const p = await getSellerProfile();
      if (p) {
        setProfile(p);
        const s = await getSellerStore(p.id);
        setActiveStore(s);
        
        if (s) {
          const supabase = createClient();
          const { data } = await supabase
            .from("orders")
            .select("id, order_number, customer_name")
            .eq("store_id", s.id)
            .order("created_at", { ascending: false })
            .limit(2);
          if (data) setRecentOrders(data);
        }
      }
    }
    loadData();
  }, []);

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 p-5 pr-0 print:hidden">
      <div className="flex flex-col h-full bg-background rounded-[24px] border border-border/60 p-5">
        <Link href="/seller/dashboard" className="flex items-center gap-2.5 px-1 min-w-0">
          {activeStore?.logo_url ? (
            <img src={activeStore.logo_url} alt="Store Logo" className="h-8 w-8 rounded-xl object-cover shrink-0" />
          ) : profile?.avatar_url ? (
            <img src={profile.avatar_url} alt="Avatar" className="h-8 w-8 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-semibold shrink-0">
              {activeStore?.name ? activeStore.name.charAt(0).toUpperCase() : profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : <img src="/logo.png" alt="Logo" className="h-8 w-8 object-contain" />}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm tracking-tight leading-none truncate">{activeStore?.name || profile?.full_name || "Seller"}</div>
            <div className="text-[11px] text-muted-foreground mt-0.5 truncate">{activeStore?.name ? "Store" : "No Store Yet"}</div>
          </div>
        </Link>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => {
            const isActive = item.href === "/seller/dashboard"
              ? pathname === "/seller/dashboard"
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 h-10 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-ink text-ink-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-3 mb-2">Quick actions</div>
          <Link href="/seller/products/new" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-foreground hover:bg-muted transition-colors">
            <Plus className="h-4 w-4" /> Add product
          </Link>
          <Link href="/seller/categories" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-foreground hover:bg-muted transition-colors">
            <Plus className="h-4 w-4" /> Add category
          </Link>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Last orders</span>
            <span className="text-[11px] text-muted-foreground">{recentOrders.length}</span>
          </div>
          <div className="space-y-1">
            {recentOrders.length === 0 ? (
              <div className="text-xs text-muted-foreground px-3 py-2">No orders yet</div>
            ) : recentOrders.map((o) => (
              <Link key={o.id} href={`/seller/orders/${o.id}`} className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-muted transition-colors">
                <div className="h-8 w-8 rounded-lg bg-tile-mint shrink-0 flex items-center justify-center text-xs font-bold text-teal-800">
                  {o.customer_name?.charAt(0).toUpperCase() || "O"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">#{o.order_number}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{o.customer_name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border/60 space-y-1">
          {activeStore?.slug ? (
            <Link href={`/${activeStore.slug}`} target="_blank" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ExternalLink className="h-4 w-4" /> View store
            </Link>
          ) : (
            <Link href="/seller/onboarding" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
              <ExternalLink className="h-4 w-4" /> Setup store
            </Link>
          )}
          <button onClick={signOutSeller} className="w-full flex items-center gap-2 px-3 h-9 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors text-left">
            <LogOut className="h-4 w-4" /> Log out
          </button>
        </div>
      </div>
    </aside>
  );
}

export function SellerTopBar({ title, count, subtitle, action }: { title: string; count?: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 px-4 md:px-7 py-4 md:py-5 border-b border-border/60 print:pb-0 print:border-none">
      <div className="flex items-baseline gap-3">
        {count && <span className="text-3xl font-semibold tracking-tight">{count}</span>}
        <div>
          <div className="text-base font-semibold tracking-tight leading-none">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2 print:hidden">
        {action}
        <button onClick={signOutSeller} className="md:hidden h-9 w-9 flex items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground transition-colors" title="Log out">
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex w-full bg-canvas pb-[72px] md:pb-0">
      <SellerSidebar />
      <main className="flex-1 min-w-0 p-3 md:p-5 md:pl-2.5">
        <div className="bg-background rounded-[24px] border border-border/60 min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)] overflow-hidden print:border-none">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-lg border-t border-border/60 px-2 py-2 flex items-center justify-around z-50 print:hidden">
        {navItems.map((item) => {
          const isActive = item.href === "/seller/dashboard"
            ? pathname === "/seller/dashboard"
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl text-[10px] font-medium transition-colors",
                isActive
                  ? "text-ink"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <item.icon className="h-5 w-5 mb-0.5" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
