import { Sparkles, Smartphone, Laptop, Cable, Headphones, LucideIcon, ArrowUpRight, Search, Filter } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { categories, products, store } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const iconMap: Record<string, LucideIcon> = { Sparkles, Smartphone, Laptop, Cable, Headphones };

export default function Storefront() {
  const [active, setActive] = useState("all");
  const filtered = active === "all" ? products : products.filter((p) => p.category === active);
  const featured = products.slice(0, 2);

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar />

      <div className="container py-6 lg:py-8">
        {/* Page header */}
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">
              Verified Seller · Lagos, NG
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-semibold tracking-tight">
              Explore <span className="text-muted-foreground/60">{store.name}</span>
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 h-10 pl-4 pr-5 rounded-full bg-background border border-border text-sm font-medium hover:bg-muted transition-colors">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="h-10 w-10 rounded-full bg-background border border-border flex items-center justify-center hover:bg-muted transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Category pills */}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-none">
          {categories.map((c) => {
            const Icon = iconMap[c.icon];
            const isActive = active === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActive(c.id)}
                className={cn(
                  "inline-flex items-center gap-2 rounded-full px-4 h-10 text-sm font-medium border whitespace-nowrap transition-all",
                  isActive
                    ? "bg-ink text-ink-foreground border-ink"
                    : "bg-background text-foreground border-border hover:border-foreground/30",
                )}
              >
                <Icon className="h-4 w-4" />
                {c.label}
              </button>
            );
          })}
        </div>

        {/* Hero / Featured grid */}
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Promo tile */}
          <div className="lg:col-span-2 grid sm:grid-cols-2 gap-4">
            <div className="relative rounded-[24px] bg-tile-mint p-7 min-h-[260px] flex flex-col justify-between overflow-hidden">
              <div>
                <div className="text-xs uppercase tracking-wider font-medium text-foreground/60">Limited drop</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight leading-tight max-w-[12ch]">
                  Get up to 50% off premium gadgets
                </div>
              </div>
              <button className="self-start inline-flex items-center gap-1.5 rounded-full bg-background px-4 py-2 text-sm font-medium hover:bg-background/80 transition-colors">
                Shop the sale
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>

            <div className="relative rounded-[24px] bg-tile-butter p-7 min-h-[260px] flex flex-col justify-between overflow-hidden">
              <div>
                <div className="text-xs uppercase tracking-wider font-medium text-foreground/60">This week</div>
                <div className="mt-3 text-2xl font-semibold tracking-tight leading-tight max-w-[14ch]">
                  Weekend essentials, ready to ship
                </div>
              </div>
              <div className="text-sm text-foreground/70">Free pickup in Lagos</div>
            </div>
          </div>

          {/* Featured product */}
          {featured[0] && (
            <Link
              to={`/${store.slug}/p/${featured[0].slug}`}
              className="group relative rounded-[24px] bg-tile-peach min-h-[260px] p-7 flex flex-col justify-between overflow-hidden"
            >
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-foreground" />
                <span className="h-2 w-2 rounded-full bg-foreground/30" />
              </div>
              <div className="flex items-end justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-foreground/60">Your Choice</div>
                  <div className="mt-1 font-semibold text-lg leading-tight max-w-[14ch]">{featured[0].name}</div>
                </div>
                <div className="inline-flex items-center gap-1 rounded-full bg-ink text-ink-foreground px-3 py-1.5 text-xs font-semibold">
                  Buy now
                  <ArrowUpRight className="h-3 w-3" />
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Product grid */}
        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">All products</h2>
          <span className="text-sm text-muted-foreground">{filtered.length} items</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>

        <footer className="mt-16 border-t border-border/60 py-8 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {store.name}. All rights reserved.</span>
          <span>Powered by ShopLink</span>
        </footer>
      </div>
    </div>
  );
}
