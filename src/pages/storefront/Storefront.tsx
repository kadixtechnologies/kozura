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

      <section className="border-b bg-muted/40">
        <div className="container py-14 sm:py-20">
          <div className="text-xs font-medium text-primary uppercase tracking-wider">Verified Seller</div>
          <h1 className="mt-3 text-3xl sm:text-4xl font-semibold tracking-tight max-w-2xl">
            {store.name}
          </h1>
          <p className="mt-2 text-base text-muted-foreground max-w-xl">{store.tagline}</p>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex items-center justify-between gap-4 mb-6">
          <h2 className="text-sm font-medium text-muted-foreground">
            {filtered.length} products
          </h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-3 -mx-4 px-4 sm:mx-0 sm:px-0">
          {categories.map((c) => {
            const Icon = iconMap[c.icon];
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium border whitespace-nowrap transition-colors",
                  isActive
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-muted-foreground border-border",
                )}
              >
                <Icon className="h-3.5 w-3.5" />
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
