"use client";

import Link from "next/link";
import { ArrowLeft, Loader2 } from "lucide-react";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { ImageUploader } from "@/components/storefront/ImageUploader";
import { VariantBuilder } from "@/components/storefront/VariantBuilder";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { saveProduct } from "@/actions/seller/products";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/60 p-6">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export function ClientNewProductPage({ categories }: { categories: any[] }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [stockQuantity, setStockQuantity] = useState("");
  const [isPublished, setIsPublished] = useState(true);
  const [variants, setVariants] = useState<any[]>([]);
  const [images, setImages] = useState<string[]>([]);

  const handlePublish = async () => {
    if (!name || !price) return toast.error("Name and price are required");
    
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("categoryId", categoryId);
      formData.append("stockQuantity", stockQuantity);
      formData.append("isPublished", isPublished ? "true" : "false");
      formData.append("variants", JSON.stringify(variants));
      formData.append("images", JSON.stringify(images));

      const res = await saveProduct(formData);
      if (res.success) {
        toast.success("Product created successfully");
        router.push("/seller/products");
      } else {
        toast.error(res.error || "Failed to create product");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SellerLayout>
      <SellerTopBar 
        title="New product" 
        subtitle="Add a product to your store" 
        action={
          <Button onClick={handlePublish} disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Publish
          </Button>
        } 
      />

      <div className="p-7">
        <Link href="/seller/products" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to products
        </Link>

        <div className="grid lg:grid-cols-[1.2fr_1fr] gap-5 mt-5">
          <div className="space-y-5">
            <Panel title="Basic info">
              <div className="space-y-4">
                <div>
                  <Label className="text-xs text-muted-foreground">Product name</Label>
                  <Input className="mt-1.5 rounded-xl" placeholder="e.g. iPhone 15 Pro" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Description</Label>
                  <textarea className="mt-1.5 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring min-h-[100px] resize-none" placeholder="Describe your product…" value={description} onChange={(e) => setDescription(e.target.value)} />
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Price (₦)</Label>
                    <Input type="number" className="mt-1.5 rounded-xl" placeholder="0" value={price} onChange={(e) => setPrice(e.target.value)} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Category</Label>
                    <Select value={categoryId} onValueChange={setCategoryId}>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select" /></SelectTrigger>
                      <SelectContent>
                        {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Stock quantity</Label>
                  <Input type="number" className="mt-1.5 rounded-xl" placeholder="0" value={stockQuantity} onChange={(e) => setStockQuantity(e.target.value)} />
                </div>
              </div>
            </Panel>
            <Panel title="Variants">
              <VariantBuilder onChange={setVariants} />
            </Panel>
          </div>
          <div className="space-y-5">
            <Panel title="Media">
              <ImageUploader onChange={setImages} />
            </Panel>
            <Panel title="Visibility">
              <div className="flex items-center justify-between">
                <div><div className="font-medium text-sm">Active</div><div className="text-xs text-muted-foreground mt-0.5">Product visible on storefront</div></div>
                <Switch checked={isPublished} onCheckedChange={setIsPublished} />
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
