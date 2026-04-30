"use client";

import { Search, Filter, X, Facebook, Instagram } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { cn } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ensureExternalLink = (url: string) => {
  if (!url) return "";
  return url.startsWith("http") ? url : `https://${url}`;
};

const ITEMS_PER_PAGE = 12;

export function StorefrontClient({ store, products, categories }: { store: any, products: any[], categories: any[] }) {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"default" | "price-asc" | "price-desc">("default");
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [shuffledProducts, setShuffledProducts] = useState(products);

  // Shuffle products on initial load
  useEffect(() => {
    setShuffledProducts([...products].sort(() => Math.random() - 0.5));
  }, [products]);

  // Add "all" to categories for the UI
  const allCategories = [{ id: "all", label: "All", slug: "all" }, ...categories];

  const filtered = useMemo(() => {
    let list = activeCategory === "all" ? shuffledProducts : shuffledProducts.filter((p) => p.category_id === activeCategory);
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
  }, [activeCategory, searchQuery, sortBy, shuffledProducts, categories]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedProducts = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, "ellipsis", totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, "ellipsis", totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages);
      }
    }
    return pages;
  };

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
        {/* Desktop Categories */}
        <div className="hidden sm:flex mt-6 gap-2 flex-wrap pb-2">
          {allCategories.map((c) => {
            const isActive = activeCategory === c.id;
            return (<button key={c.id} onClick={() => setActiveCategory(c.id)} className={cn("inline-flex items-center justify-center rounded-full px-5 h-10 text-sm font-medium border whitespace-nowrap transition-all", isActive ? "bg-ink text-ink-foreground border-ink" : "bg-background text-foreground border-border hover:border-foreground/30")}>{c.name || c.label}</button>);
          })}
        </div>

        {/* Mobile Categories */}
        <div className="mt-6 sm:hidden">
          <Select value={activeCategory} onValueChange={setActiveCategory}>
            <SelectTrigger className="w-full h-12 rounded-2xl bg-background border-border font-medium">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent className="rounded-xl max-h-[300px]">
              {allCategories.map((c) => (
                <SelectItem key={c.id} value={c.id} className="rounded-lg py-2.5 cursor-pointer">
                  {c.name || c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-5">
              {paginatedProducts.map((p, i) => (<ProductCard key={p.id} product={{...p, image: p.images?.[0] || "/placeholder.png"}} index={i} storeSlug={store.slug} />))}
            </div>
            
            {totalPages > 1 && (
              <div className="mt-12">
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage > 1) setCurrentPage(p => p - 1);
                        }}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {getPageNumbers().map((page, i) => (
                      <PaginationItem key={i}>
                        {page === "ellipsis" ? (
                          <PaginationEllipsis />
                        ) : (
                          <PaginationLink
                            href="#"
                            isActive={currentPage === page}
                            onClick={(e) => {
                              e.preventDefault();
                              setCurrentPage(page as number);
                            }}
                          >
                            {page}
                          </PaginationLink>
                        )}
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext 
                        href="#" 
                        onClick={(e) => {
                          e.preventDefault();
                          if (currentPage < totalPages) setCurrentPage(p => p + 1);
                        }}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}
        <footer className="mt-16 border-t border-border/60 py-8 text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <span>© {new Date().getFullYear()} {store.name}. All rights reserved.</span>
            <span className="hidden sm:inline">·</span>
            <span>Powered by Kozura</span>
          </div>
          <div className="flex items-center gap-4">
            {store.whatsapp_number && (
              <a 
                href={`https://wa.me/${store.whatsapp_number.replace(/\D/g, '')}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
                style={{ color: '#25D366' }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.72.94 3.659 1.437 5.634 1.437h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
            )}
            {store.social_facebook_enabled && store.social_facebook && (
              <a 
                href={ensureExternalLink(store.social_facebook)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
                style={{ color: '#1877F2' }}
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
            {store.social_instagram_enabled && store.social_instagram && (
              <a 
                href={ensureExternalLink(store.social_instagram)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
                style={{ color: '#E4405F' }}
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}
            {store.social_tiktok_enabled && store.social_tiktok && (
              <a 
                href={ensureExternalLink(store.social_tiktok)} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:opacity-80 transition-opacity"
                style={{ color: '#000000' }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
}

