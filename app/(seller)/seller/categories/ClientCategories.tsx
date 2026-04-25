"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check, Loader2 } from "lucide-react";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { saveCategory, deleteCategory as deleteCategoryAction } from "@/app/actions/categories";

export function ClientCategories({ initialCategories }: { initialCategories: any[] }) {
  const [cats, setCats] = useState(initialCategories);
  const [adding, setAdding] = useState(false);
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const addCategory = async () => {
    if (!newName.trim()) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", newName.trim());

    const res = await saveCategory(formData);
    if (res.success) {
      toast.success(`"${newName.trim()}" added`);
      setCats([...cats, { id: res.id || Date.now().toString(), name: newName.trim(), count: 0 }]);
      setNewName(""); setAdding(false);
    } else {
      toast.error(res.error || "Failed to add category");
    }
    setIsLoading(false);
  };

  const startEdit = (cat: typeof cats[number]) => { setEditingId(cat.id); setEditName(cat.name); };
  
  const saveEdit = async (id: string) => {
    if (!editName.trim()) return;
    setIsLoading(true);
    const formData = new FormData();
    formData.append("id", id);
    formData.append("name", editName.trim());

    const res = await saveCategory(formData);
    if (res.success) {
      toast.success("Category updated");
      setCats(cats.map((c) => c.id === id ? { ...c, name: editName.trim() } : c));
      setEditingId(null);
    } else {
      toast.error(res.error || "Failed to update category");
    }
    setIsLoading(false);
  };

  const deleteCategory = async (id: string) => {
    const name = cats.find((c) => c.id === id)?.name;
    setIsLoading(true);
    const res = await deleteCategoryAction(id);
    
    if (res.success) {
      setCats(cats.filter((c) => c.id !== id));
      toast.success(`"${name}" deleted`);
    } else {
      toast.error(res.error || "Failed to delete category");
    }
    setIsLoading(false);
  };

  return (
    <SellerLayout>
      <SellerTopBar
        count={String(cats.length)}
        title="Categories"
        subtitle="Organize your products"
        action={<Button className="gap-2" onClick={() => setAdding(true)} disabled={isLoading}><Plus className="h-4 w-4" /> Add category</Button>}
      />
      <div className="p-7">
        <div className="rounded-[20px] border border-border/60 overflow-hidden bg-background divide-y divide-border/60">
          {cats.length === 0 && !adding && (
            <div className="px-5 py-8 text-center text-sm text-muted-foreground">No categories found. Add one to get started!</div>
          )}
          {cats.map((cat) => (
            <div key={cat.id} className="flex items-center justify-between px-5 py-4 hover:bg-muted/30 transition-colors">
              {editingId === cat.id ? (
                <div className="flex items-center gap-2 flex-1">
                  <Input value={editName} onChange={(e) => setEditName(e.target.value)} className="rounded-xl h-9 max-w-xs" autoFocus onKeyDown={(e) => e.key === "Enter" && saveEdit(cat.id)} disabled={isLoading} />
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => saveEdit(cat.id)} disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}</Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)} disabled={isLoading}><X className="h-4 w-4" /></Button>
                </div>
              ) : (
                <>
                  <div><div className="font-medium text-sm">{cat.name}</div><div className="text-xs text-muted-foreground mt-0.5">{cat.count} products</div></div>
                  <div className="flex items-center gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => startEdit(cat)} disabled={isLoading}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive" onClick={() => deleteCategory(cat.id)} disabled={isLoading}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </>
              )}
            </div>
          ))}
          {adding && (
            <div className="px-5 py-4 flex items-center gap-2">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Category name" className="rounded-xl h-9 max-w-xs" autoFocus onKeyDown={(e) => e.key === "Enter" && addCategory()} disabled={isLoading} />
              <Button size="sm" onClick={addCategory} disabled={isLoading}>{isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Add"}</Button>
              <Button size="sm" variant="ghost" onClick={() => { setAdding(false); setNewName(""); }} disabled={isLoading}>Cancel</Button>
            </div>
          )}
        </div>
      </div>
    </SellerLayout>
  );
}
