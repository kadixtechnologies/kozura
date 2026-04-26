"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Image as ImageIcon, MoreHorizontal, Plus, Search, SlidersHorizontal, X, Edit, Trash2, Loader2 } from "lucide-react";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { StatusBadge } from "@/components/shop/StatusBadge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { deleteProduct } from "@/app/actions/products";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

const formatNGN = (amount: number) => {
  return `₦${amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}`;
};

function ActionMenu({ product, onDelete }: { product: any; onDelete: () => void }) {
  const router = useRouter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-40 rounded-2xl p-1.5">
        <DropdownMenuItem 
          className="rounded-xl px-3 py-2 cursor-pointer flex items-center gap-2" 
          onClick={() => router.push(`/seller/products/${product.id}/edit`)}
        >
          <Edit className="h-3.5 w-3.5" /> Edit
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1 border-t border-border/60" />
        <DropdownMenuItem 
          className="rounded-xl px-3 py-2 cursor-pointer flex items-center gap-2 text-destructive focus:text-destructive focus:bg-destructive/10" 
          onClick={onDelete}
        >
          <Trash2 className="h-3.5 w-3.5" /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function ClientProducts({ initialProducts, categories }: { initialProducts: any[], categories: any[] }) {
  const [productList, setProductList] = useState(initialProducts);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [deletingBulk, setDeletingBulk] = useState(false);

  const filteredProducts = useMemo(() => {
    let list = productList;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter((p) => p.name.toLowerCase().includes(q) || (p.brand && p.brand.toLowerCase().includes(q)));
    }

    if (statusFilter !== "all") {
      const isActive = statusFilter === "active";
      list = list.filter((p) => p.is_published === isActive);
    }

    if (categoryFilter !== "all") {
      list = list.filter((p) => p.category_id === categoryFilter);
    }

    return list;
  }, [searchQuery, statusFilter, categoryFilter, productList]);

  const activeFiltersCount = (statusFilter !== "all" ? 1 : 0) + (categoryFilter !== "all" ? 1 : 0);

  const handleDelete = async (id: string, name: string) => {
    const res = await deleteProduct(id);
    if (res.success) {
      setProductList((prev) => prev.filter((item) => item.id !== id)); 
      setSelectedIds((prev) => prev.filter((item) => item !== id));
      toast.success(`${name} deleted`); 
    } else {
      toast.error(res.error || "Failed to delete product");
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredProducts.length && filteredProducts.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredProducts.map(p => p.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(i => i !== id));
    } else {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm("Are you sure you want to delete the selected products?")) return;
    setDeletingBulk(true);
    let successCount = 0;
    for (const id of selectedIds) {
      const res = await deleteProduct(id);
      if (res.success) {
        successCount++;
        setProductList(prev => prev.filter(p => p.id !== id));
      }
    }
    setDeletingBulk(false);
    setSelectedIds([]);
    toast.success(`Deleted ${successCount} product(s)`);
  };

  return (
    <SellerLayout>
      <SellerTopBar
        count={String(filteredProducts.length)}
        title="Products"
        subtitle="Manage your catalog"
        action={
          <div className="flex items-center gap-2">
            {selectedIds.length > 0 && (
              <Button variant="destructive" onClick={handleBulkDelete} disabled={deletingBulk} className="gap-2 rounded-xl">
                {deletingBulk ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                Delete ({selectedIds.length})
              </Button>
            )}
            <Button asChild className="gap-2 rounded-xl">
              <Link href="/seller/products/new"><Plus className="h-4 w-4" /> Add product</Link>
            </Button>
          </div>
        }
      />

      <div className="p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-5">
          <div className="relative flex-1 w-full sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products…" 
              className="w-full h-10 pl-10 pr-10 rounded-full border border-border bg-background text-sm outline-none focus:border-foreground/30 transition-colors" 
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 text-muted-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>
          <Button 
            variant="outline" 
            className={cn("rounded-full h-10 gap-2 transition-colors", filterOpen || activeFiltersCount > 0 ? "border-ink text-ink bg-muted/40" : "")}
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 h-5 w-5 rounded-full bg-ink text-ink-foreground text-[10px] flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </Button>
        </div>

        {filterOpen && (
          <div className="mb-5 p-5 rounded-[20px] bg-background border border-border/60 animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-sm">Filter products</h3>
              {activeFiltersCount > 0 && (
                <button 
                  onClick={() => { setStatusFilter("all"); setCategoryFilter("all"); }}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Status</label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All statuses</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="inactive">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-xs text-muted-foreground mb-1.5 block">Category</label>
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="rounded-xl">
                    <SelectValue placeholder="All categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All categories</SelectItem>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )}

        <div className="rounded-[20px] border border-border/60 bg-background">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/60 text-left text-muted-foreground text-xs">
                <th className="pl-5 pr-2 py-3 w-10">
                  <Checkbox 
                    checked={filteredProducts.length > 0 && selectedIds.length === filteredProducts.length}
                    onCheckedChange={toggleSelectAll}
                  />
                </th>
                <th className="px-3 py-3 font-medium">Product</th>
                <th className="px-3 py-3 font-medium hidden sm:table-cell">Category</th>
                <th className="px-3 py-3 font-medium">Price</th>
                <th className="px-3 py-3 font-medium hidden md:table-cell">Stock</th>
                <th className="px-3 py-3 font-medium">Status</th>
                <th className="px-3 py-3 w-10"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center justify-center text-center gap-3">
                      <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center mx-auto">
                        <Search className="h-5 w-5 text-muted-foreground" />
                      </div>
                      <p className="font-semibold">No products found</p>
                      <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Try adjusting your search or filter to find what you&apos;re looking for.
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const catName = categories.find(c => c.id === p.category_id)?.name || "Uncategorized";
                  return (
                    <tr key={p.id} className={cn("border-b border-border/60 last:border-b-0 hover:bg-muted/30 transition-colors", selectedIds.includes(p.id) ? "bg-muted/40" : "")}>
                      <td className="pl-5 pr-2 py-3">
                        <Checkbox 
                          checked={selectedIds.includes(p.id)}
                          onCheckedChange={() => toggleSelect(p.id)}
                        />
                      </td>
                      <td className="px-3 py-3">
                        <Link href={`/seller/products/${p.id}/edit`} className="flex items-center gap-3 group">
                          {p.images?.[0] ? (
                            <img src={p.images[0]} alt={p.name} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                          ) : (
                            <div className="h-10 w-10 rounded-xl bg-tile-mint flex items-center justify-center shrink-0">
                              <ImageIcon className="h-4 w-4 text-foreground/20" />
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="font-medium truncate group-hover:underline">{p.name}</div>
                            <div className="text-xs text-muted-foreground">{p.brand || "No brand"}</div>
                          </div>
                        </Link>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground capitalize hidden sm:table-cell">{catName}</td>
                      <td className="px-3 py-3 font-medium">{formatNGN(p.price)}</td>
                      <td className="px-3 py-3 hidden md:table-cell">
                        {p.track_inventory ? p.stock_quantity : "Unlimited"}
                      </td>
                      <td className="px-3 py-3"><StatusBadge status={p.is_published ? "Active" : "Inactive"} /></td>
                      <td className="px-3 py-3">
                        <ActionMenu 
                          product={p} 
                          onDelete={() => handleDelete(p.id, p.name)} 
                        />
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </SellerLayout>
  );
}
