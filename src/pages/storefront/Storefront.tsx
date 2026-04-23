import { Sparkles, Smartphone, Laptop, Cable, Headphones, LucideIcon } from "lucide-react";
import { useState } from "react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { categories, products, store } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = { Sparkles, Smartphone, Laptop, Cable, Headphones };

export default function Storefront() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />

      <section className="relative h-64 sm:h-80 bg-gradient-to-br from-primary via-primary to-emerald-600 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_white_0%,_transparent_60%)] opacity-10" />
        <div className="container relative h-full flex flex-col justify-center text-primary-foreground">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">{store.name}</h1>
          <p className="mt-2 text-lg opacity-90">{store.tagline}</p>
        </div>
      </section>

      <div className="container py-6">
        <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((c) => {
            const Icon = iconMap[c.icon];
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium border whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background hover:bg-muted",
                )}
              >
                <Icon className="h-4 w-4" />
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
