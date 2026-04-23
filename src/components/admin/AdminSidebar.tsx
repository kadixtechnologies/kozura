import { LayoutDashboard, Package, Tag, ShoppingBag, Settings, ExternalLink } from "lucide-react";
import { NavLink, Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { store } from "@/lib/mock-data";

const navItems = [
  { to: "/admin", end: true, icon: LayoutDashboard, label: "Dashboard" },
  { to: "/admin/products", icon: Package, label: "Products" },
  { to: "/admin/categories", icon: Tag, label: "Categories" },
  { to: "/admin/orders", icon: ShoppingBag, label: "Orders" },
  { to: "/admin/settings", icon: Settings, label: "Settings" },
];

export function AdminSidebar() {
  return (
    <aside className="hidden md:flex flex-col w-56 shrink-0 border-r bg-background h-screen sticky top-0">
      <div className="px-5 h-14 border-b flex items-center">
        <Link to="/admin" className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-foreground text-background flex items-center justify-center text-[10px] font-semibold">
            S
          </div>
          <span className="font-semibold text-sm tracking-tight">ShopLink</span>
        </Link>
      </div>
      <nav className="flex-1 p-2 space-y-0.5">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm transition-colors",
                isActive
                  ? "bg-muted text-foreground font-medium"
                  : "text-muted-foreground",
              )
            }
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="p-2 border-t">
        <Link
          to={`/${store.slug}`}
          className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-sm text-muted-foreground"
        >
          <ExternalLink className="h-4 w-4" />
          View store
        </Link>
      </div>
    </aside>
  );
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex w-full bg-background">
      <AdminSidebar />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}
