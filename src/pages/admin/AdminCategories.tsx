import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";

export default function AdminCategories() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Categories</h1>
          <Button className="gap-2"><Plus className="h-4 w-4" /> Add Category</Button>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.filter((c) => c.id !== "all").map((c) => (
            <Card key={c.id} className="p-5 rounded-lg flex items-center justify-between">
              <div>
                <div className="font-semibold">{c.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5">12 products</div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon"><Pencil className="h-4 w-4" /></Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive"><Trash2 className="h-4 w-4" /></Button>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
