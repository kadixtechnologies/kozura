import { Plus, Pencil, Trash2 } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";

const tilePalette = ["bg-tile-mint", "bg-tile-butter", "bg-tile-peach", "bg-tile-sky", "bg-tile-mist"];

export default function AdminCategories() {
  return (
    <AdminLayout>
      <AdminTopBar
        title="Categories"
        subtitle="Organize your catalog"
        action={<Button className="gap-1.5"><Plus className="h-4 w-4" /> Add category</Button>}
      />
      <div className="p-7">
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.filter((c) => c.id !== "all").map((c, i) => (
            <div key={c.id} className={`${tilePalette[i % tilePalette.length]} rounded-[20px] p-5 flex items-center justify-between`}>
              <div>
                <div className="font-semibold">{c.label}</div>
                <div className="text-xs text-foreground/60 mt-1">12 products</div>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/60"><Pencil className="h-3.5 w-3.5" /></Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-background/60 text-foreground/60 hover:text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
