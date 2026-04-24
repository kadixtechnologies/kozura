import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { ImageUploader } from "@/components/shop/ImageUploader";
import { VariantBuilder } from "@/components/shop/VariantBuilder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/60 p-6">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminProductForm() {
  return (
    <AdminLayout>
      <AdminTopBar
        title="Add product"
        subtitle="Create a new product in your catalog"
        action={
          <>
            <Button asChild variant="outline"><Link to="/admin/products">Cancel</Link></Button>
            <Button>Save product</Button>
          </>
        }
      />

      <div className="p-7">
        <Link to="/admin/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="grid lg:grid-cols-3 gap-5 mt-5">
          <div className="lg:col-span-2 space-y-5">
            <Panel title="Product information">
              <div className="space-y-4">
                <div><Label className="text-xs text-muted-foreground">Name</Label><Input className="mt-1.5 rounded-xl" placeholder="Galaxy S24 Ultra" /></div>
                <div><Label className="text-xs text-muted-foreground">Description</Label><Textarea className="mt-1.5 rounded-2xl resize-none" rows={4} placeholder="Describe the product..." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label className="text-xs text-muted-foreground">Brand</Label><Input className="mt-1.5 rounded-xl" placeholder="Samsung" /></div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.id !== "all").map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label className="text-xs text-muted-foreground">Price (₦)</Label><Input type="number" className="mt-1.5 rounded-xl" placeholder="450000" /></div>
                  <div><Label className="text-xs text-muted-foreground">Stock</Label><Input type="number" className="mt-1.5 rounded-xl" placeholder="20" /></div>
                </div>
              </div>
            </Panel>

            <Panel title="Product variants">
              <VariantBuilder />
            </Panel>
          </div>

          <div className="space-y-5">
            <Panel title="Product images">
              <ImageUploader />
            </Panel>

            <Panel title="Product status">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Active</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Visible in storefront</div>
                </div>
                <Switch defaultChecked />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
