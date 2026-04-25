"use client";

import { Search, Filter, X } from "lucide-react";
import { useState, useMemo } from "react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";

export function StorefrontClient({ store, products, categories }: { store: any, products: any[], categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [filterOpen, setFilterOpen] = useState(false);

  // Add "all" to categories for the UI
  const allCategories = [{ id: "all", label: "All", slug: "all" }, ...categories];

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? products : products.filter((p) => p.category_id === activeCategory);
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => {
        const cat = categories.find(c => c.id === p.category_id);
        const catName = cat ? cat.name.toLowerCase() : "";
        return p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)) || catName.includes(q);
      });
    }
    if (sortBy === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [activeCategory, searchQuery, sortBy, products, categories]);

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar store={store} />
      <div className="container py-6 lg:py-8">
        <div className="bg-background rounded-[32px] p-8 md:p-12 min-h-[300px] flex flex-col justify-end border border-border/60">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <h1 className="text-6xl sm:text-8xl font-semibold tracking-tight leading-none">
                Explore <br />
                <span className="text-muted-foreground/40">{store.name}</span>
              </h1>
            </div>
            <div className="flex items-center gap-2 sm:pb-2">
              <button onClick={() => setFilterOpen((v) => !v)} className={cn("inline-flex items-center gap-2 h-10 pl-4 pr-5 rounded-full border text-sm font-medium transition-colors", filterOpen ? "bg-ink text-ink-foreground border-ink" : "bg-canvas border-border hover:bg-muted")}>
                <Filter className="h-4 w-4" /> Filters
                {sortBy !== "default" && (<span className="ml-1 h-4 w-4 rounded-full bg-primary text-primary-foreground text-[10px] flex items-center justify-center font-bold">1</span>)}
              </button>
              <button onClick={() => { setSearchOpen((v) => !v); if (searchOpen) setSearchQuery(""); }} className={cn("h-10 w-10 rounded-full border flex items-center justify-center transition-colors", searchOpen ? "bg-ink text-ink-foreground border-ink" : "bg-canvas border-border hover:bg-muted")}>
                {searchOpen ? <X className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              </button>
            </div>
          </div>
          {searchOpen && (
            <div className="mt-6 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
              <input autoFocus value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search products, brands…" className="w-full h-12 pl-11 pr-4 rounded-2xl border border-border bg-canvas text-sm outline-none focus:border-foreground/40 focus:ring-2 focus:ring-foreground/10 transition-all" />
              {searchQuery && (<button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 h-6 w-6 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70"><X className="h-3 w-3" /></button>)}
            </div>
          )}
        </div>
        {filterOpen && (
          <div className="mt-3 rounded-[20px] bg-background border border-border/60 p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-semibold">Sort by price</span>
              {sortBy !== "default" && (<button onClick={() => setSortBy("default")} className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2">Clear</button>)}
            </div>
            <div className="flex gap-2 flex-wrap">
              {([{ value: "default", label: "Default" }, { value: "price-asc", label: "Price: Low → High" }, { value: "price-desc", label: "Price: High → Low" }] as const).map((opt) => (
                <button key={opt.value} onClick={() => setSortBy(opt.value)} className={cn("h-9 px-4 rounded-full text-sm border font-medium transition-colors", sortBy === opt.value ? "bg-ink text-ink-foreground border-ink" : "bg-canvas border-border hover:border-foreground/30")}>{opt.label}</button>
              ))}
            </div>
          </div>
        )}
        <div className="mt-6 flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 sm:mx-0 sm:px-0 scrollbar-none">
          {allCategories.map((c) => {
            const isActive = activeCategory === c.id;
            return (<button key={c.id} onClick={() => setActiveCategory(c.id)} className={cn("inline-flex items-center justify-center rounded-full px-5 h-10 text-sm font-medium border whitespace-nowrap transition-all", isActive ? "bg-ink text-ink-foreground border-ink" : "bg-background text-foreground border-border hover:border-foreground/30")}>{c.name || c.label}</button>);
          })}
        </div>
        <div className="mt-10 flex items-baseline justify-between">
          <h2 className="text-xl font-semibold tracking-tight">{activeCategory === "all" ? "All products" : allCategories.find((c) => c.id === activeCategory)?.name}</h2>
          <span className="text-sm text-muted-foreground">{filtered.length} item{filtered.length !== 1 ? "s" : ""}</span>
        </div>
        {filtered.length === 0 ? (
          <div className="mt-16 flex flex-col items-center justify-center text-center gap-3 py-16">
            <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center"><Search className="h-7 w-7 text-muted-foreground" /></div>
            <p className="font-semibold text-lg">No products found</p>
            <p className="text-sm text-muted-foreground">Try a different search term or category.</p>
            <button onClick={() => { setSearchQuery(""); setActiveCategory("all"); setSortBy("default"); }} className="mt-2 text-sm underline underline-offset-2 text-muted-foreground hover:text-foreground">Clear all filters</button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
            {filtered.map((p, i) => (<ProductCard key={p.id} product={{...p, image: p.images?.[0] || "/placeholder.png"}} index={i} storeSlug={store.slug} />))}
          </div>
        )}
        <footer className="mt-16 border-t border-border/60 py-8 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-3">
          <span>© {new Date().getFullYear()} {store.name}. All rights reserved.</span>
          <span>Powered by ShopLink</span>
        </footer>
      </div>
    </div>
  );
}
