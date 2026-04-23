import { Link } from "react-router-dom";
import { AdminLayout } from "@/components/admin/AdminSidebar";
import { ImageUploader } from "@/components/shop/ImageUploader";
import { VariantBuilder } from "@/components/shop/VariantBuilder";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { categories } from "@/lib/mock-data";

export default function AdminProductForm() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Add Product</h1>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-4">Product Information</h2>
              <div className="space-y-4">
                <div><Label>Name</Label><Input className="mt-1.5" placeholder="Galaxy S24 Ultra" /></div>
                <div><Label>Description</Label><Textarea className="mt-1.5" rows={4} placeholder="Describe the product..." /></div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div><Label>Brand</Label><Input className="mt-1.5" placeholder="Samsung" /></div>
                  <div>
                    <Label>Category</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select category" /></SelectTrigger>
                      <SelectContent>
                        {categories.filter(c => c.id !== "all").map((c) => <SelectItem key={c.id} value={c.id}>{c.label}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div><Label>Price (₦)</Label><Input type="number" className="mt-1.5" placeholder="450000" /></div>
                  <div><Label>Stock (optional)</Label><Input type="number" className="mt-1.5" placeholder="20" /></div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-4">Product Variants</h2>
              <VariantBuilder />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-4">Product Images</h2>
              <ImageUploader />
            </Card>

            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold mb-4">Product Status</h2>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Active</div>
                  <div className="text-xs text-muted-foreground mt-0.5">Product visible in storefront</div>
                </div>
                <Switch defaultChecked />
              </div>
            </Card>
          </div>
        </div>

        <div className="flex gap-3 justify-end">
          <Button asChild variant="outline"><Link to="/admin/products">Cancel</Link></Button>
          <Button>Save Product</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
