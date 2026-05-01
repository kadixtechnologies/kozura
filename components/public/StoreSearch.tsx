"use client";

import { useState, useEffect, useRef } from "react";
import { Search, Store, ArrowRight, Loader2, User } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { searchStores, StoreSearchResult } from "@/app/actions/stores";

export function StoreSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<StoreSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (query.trim().length >= 2) {
        setIsLoading(true);
        const data = await searchStores(query);
        setResults(data);
        setIsLoading(false);
        setIsOpen(true);
      } else {
        setResults([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="relative w-full max-w-2xl mx-auto" ref={searchContainerRef}>
      <div className="relative flex items-center w-full h-14 md:h-16 rounded-full bg-background border border-border/60 overflow-hidden focus-within:ring-2 focus-within:ring-primary/20 transition-all z-20">
        <div className="flex items-center justify-center pl-6 pr-4">
          <Search className="h-5 w-5 md:h-6 md:w-6 text-muted-foreground" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            if (query.trim().length >= 2) setIsOpen(true);
          }}
          placeholder="Search for a store or seller name..."
          className="flex-1 h-full bg-transparent border-none outline-none text-base md:text-lg text-foreground placeholder:text-muted-foreground/60"
        />
        {isLoading && (
          <div className="pr-6">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        )}
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-3 bg-background border border-border/60 rounded-[24px] overflow-hidden z-50 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="p-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-4 py-2">
              {results.length > 0 ? "Search Results" : "No stores found"}
            </h3>
            
            {results.length > 0 ? (
              <ul className="max-h-[350px] overflow-y-auto custom-scrollbar">
                {results.map((store) => (
                  <li key={store.id}>
                    <Link
                      href={`/${store.slug}`}
                      onClick={() => setIsOpen(false)}
                      className="group flex items-center justify-between p-3 md:p-4 rounded-[16px] hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 shrink-0 rounded-full bg-muted flex items-center justify-center border border-border/50 overflow-hidden">
                          {store.logo_url ? (
                            <img src={store.logo_url} alt={store.name} className="h-full w-full object-cover" />
                          ) : (
                            <Store className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-foreground text-base group-hover:text-primary transition-colors line-clamp-1">
                            {store.name}
                          </span>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-sm text-muted-foreground bg-muted px-2 py-0.5 rounded-md font-medium border border-border/30">
                              /{store.slug}
                            </span>
                            {store.owner_name && (
                              <span className="text-xs text-muted-foreground flex items-center gap-1">
                                <User className="h-3 w-3" /> {store.owner_name}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="h-8 w-8 shrink-0 rounded-full bg-primary/5 group-hover:bg-primary/10 flex items-center justify-center transition-colors">
                        <ArrowRight className="h-4 w-4 text-primary opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Search className="h-5 w-5 text-muted-foreground" />
                </div>
                <p className="text-foreground font-medium mb-1">No stores match your search</p>
                <p className="text-sm text-muted-foreground">Try a different name or spelling</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
