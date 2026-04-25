"use client";

import { useState, useEffect } from "react";
import { LayoutDashboard, Store, Users, Settings, LogOut, Zap } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

const navItems = [
  { href: "/admin", end: true, icon: LayoutDashboard, label: "Overview" },
  { href: "/admin/stores", icon: Store, label: "Stores" },
  { href: "/admin/users", icon: Users, label: "Users" },
  { href: "/admin/plans", icon: Zap, label: "Plans" },
  { href: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const [adminUser, setAdminUser] = useState<any>(null);

  useEffect(() => {
    async function loadUser() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setAdminUser(user);
      }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = '/admin/login';
  };

  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 p-5 pr-0">
      <div className="flex flex-col h-full bg-ink text-ink-foreground rounded-[24px] border border-border/60 p-5">
        <Link href="/admin" className="flex items-center gap-2.5 px-1 min-w-0">
          {adminUser?.user_metadata?.avatar_url ? (
            <img src={adminUser.user_metadata.avatar_url} alt="Admin" className="h-8 w-8 rounded-xl object-cover shrink-0" />
          ) : (
            <div className="h-8 w-8 rounded-xl bg-background text-foreground flex items-center justify-center text-sm font-bold shrink-0">
              SL
            </div>
          )}
          <div className="min-w-0 flex-1">
            <div className="font-semibold text-sm tracking-tight leading-none truncate">
              {adminUser?.user_metadata?.full_name || "ShopLink Core"}
            </div>
            <div className="text-[11px] text-ink-foreground/60 mt-0.5 truncate">
              {adminUser?.email || "Super Admin"}
            </div>
          </div>
        </Link>

        <nav className="mt-8 space-y-1">
          {navItems.map((item) => {
            const isActive = item.end
              ? pathname === item.href
              : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-3 h-10 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-background text-foreground font-medium shadow-sm"
                    : "text-ink-foreground/70 hover:text-ink-foreground hover:bg-ink-foreground/10",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-4 border-t border-ink-foreground/10 space-y-1">
          <button onClick={handleSignOut} className="w-full flex items-center gap-2 px-3 h-9 rounded-full text-sm text-ink-foreground/70 hover:text-ink-foreground hover:bg-ink-foreground/10 transition-colors text-left">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      </div>
    </aside>
  );
}

export function AdminTopBar({ title, count, subtitle, action }: { title: string; count?: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 px-4 md:px-7 py-4 md:py-5 border-b border-border/60">
      <div className="flex items-baseline gap-3">
        {count && <span className="text-3xl font-semibold tracking-tight">{count}</span>}
        <div>
          <div className="text-base font-semibold tracking-tight leading-none">{title}</div>
          {subtitle && <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>}
        </div>
      </div>
      <div className="flex items-center gap-2">{action}</div>
    </div>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex w-full bg-canvas pb-[72px] md:pb-0">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-3 md:p-5 md:pl-2.5">
        <div className="bg-background rounded-[24px] border border-border/60 min-h-[calc(100vh-1.5rem)] md:min-h-[calc(100vh-2.5rem)] overflow-hidden">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-ink text-ink-foreground border-t border-ink-foreground/10 px-2 py-2 flex items-center justify-around z-50">
        {navItems.map((item) => {
          const isActive = item.end
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-14 h-12 rounded-xl text-[10px] font-medium transition-colors",
                isActive
                  ? "bg-background text-foreground"
                  : "text-ink-foreground/70 hover:text-ink-foreground"
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
