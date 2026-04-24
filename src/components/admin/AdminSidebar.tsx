import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, ExternalLink, LogOut, Plus } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { store, orders } from "@/lib/mock-data";

const navItems = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

const recent = orders.slice(0, 2);

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-64 shrink-0 p-5 pr-0">
      <div className="flex flex-col h-full bg-background rounded-[24px] border border-border/60 p-5">
        <Link to="/admin" className="flex items-center gap-2.5 px-1">
          <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-semibold">
            S
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight leading-none">ShopLink</div>
            <div className="text-[11px] text-muted-foreground mt-0.5">{store.name}</div>
          </div>
        </Link>

        <nav className="mt-6 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 h-10 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-ink text-ink-foreground font-medium"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted",
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="mt-6">
          <div className="text-[11px] uppercase tracking-wider text-muted-foreground px-3 mb-2">Quick actions</div>
          <Link to="/admin/products/new" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-foreground hover:bg-muted transition-colors">
            <Plus className="h-4 w-4" /> Add product
          </Link>
          <Link to="/admin/categories" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-foreground hover:bg-muted transition-colors">
            <Plus className="h-4 w-4" /> Add category
          </Link>
        </div>

        <div className="mt-6">
          <div className="flex items-center justify-between px-3 mb-2">
            <span className="text-[11px] uppercase tracking-wider text-muted-foreground">Last orders</span>
            <span className="text-[11px] text-muted-foreground">{orders.length}</span>
          </div>
          <div className="space-y-1">
            {recent.map((o) => (
              <Link key={o.id} to={`/admin/orders/${o.id}`} className="flex items-center gap-2.5 px-3 py-2 rounded-2xl hover:bg-muted transition-colors">
                <div className="h-8 w-8 rounded-lg bg-tile-mint shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium truncate">#{o.orderNumber}</div>
                  <div className="text-[11px] text-muted-foreground truncate">{o.customerName}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-border/60 space-y-1">
          <Link to={`/${store.slug}`} className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <ExternalLink className="h-4 w-4" /> View store
          </Link>
          <Link to="/admin/login" className="flex items-center gap-2 px-3 h-9 rounded-full text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
            <LogOut className="h-4 w-4" /> Log out
          </Link>
        </div>
      </div>
    </aside>
  );
}

export function AdminTopBar({ title, count, subtitle, action }: { title: string; count?: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between flex-wrap gap-4 px-7 py-5 border-b border-border/60">
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
  return (
    <div className="min-h-screen flex w-full bg-canvas">
      <AdminSidebar />
      <main className="flex-1 min-w-0 p-5 pl-2.5">
        <div className="bg-background rounded-[24px] border border-border/60 min-h-[calc(100vh-2.5rem)] overflow-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
