import { AdminLayout } from "@/components/admin/AdminSidebar";
import { ImageUploader } from "@/components/shop/ImageUploader";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/mock-data";

export default function AdminSettings() {
  return (
    <AdminLayout>
      <div className="p-6 lg:p-8 space-y-6">
        <h1 className="text-2xl font-bold">Settings</h1>

        <Tabs defaultValue="general">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="shipping">Shipping</TabsTrigger>
            <TabsTrigger value="payments">Payments</TabsTrigger>
            <TabsTrigger value="seo">SEO</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6 mt-6">
            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Store Information</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label>Store Name</Label><Input defaultValue={store.name} className="mt-1.5" /></div>
                <div>
                  <Label>Store Slug</Label>
                  <Input defaultValue={store.slug} className="mt-1.5" />
                  <div className="text-xs text-muted-foreground mt-1">shoplink.app/{store.slug}</div>
                </div>
                <div><Label>WhatsApp Number</Label><Input defaultValue={store.whatsapp} className="mt-1.5" /></div>
                <div>
                  <Label>Currency</Label>
                  <Select defaultValue="NGN">
                    <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN — Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="GHS">GHS — Ghanaian Cedi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Appearance</h2>
              <div className="space-y-4">
                <div>
                  <Label>Logo</Label>
                  <div className="mt-1.5"><ImageUploader /></div>
                </div>
                <div>
                  <Label>Primary Color</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-md border" style={{ backgroundColor: store.color }} />
                    <Input defaultValue={store.color} className="font-mono w-40" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Store Status</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Store is Active</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Customers can place orders</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Password Protected</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Require password to view storefront</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-6 rounded-lg">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Pickup</h3>
                  <span className="inline-flex items-center rounded-full bg-success-soft text-success px-2.5 py-0.5 text-xs font-medium">FREE</span>
                </div>
                <div className="mt-4 space-y-3">
                  <div><Label>Label</Label><Input defaultValue="Pickup" className="mt-1.5" /></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>

              <Card className="p-6 rounded-lg">
                <h3 className="font-semibold">Delivery</h3>
                <div className="mt-4 space-y-3">
                  <div><Label>Label</Label><Input defaultValue="Delivery" className="mt-1.5" /></div>
                  <div><Label>Fee</Label><Input defaultValue="₦5,000" className="mt-1.5" /></div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Active</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Card>
            </div>

            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Address Fields</h2>
              <div className="space-y-3">
                {["Address Line 1", "City", "State", "Postal Code"].map((f) => (
                  <label key={f} className="flex items-center gap-2 cursor-pointer">
                    <Checkbox defaultChecked={f !== "Postal Code"} />
                    <span className="text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">Payment Methods</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Cash on Delivery</div>
                    <div className="text-xs text-muted-foreground">Customer pays on delivery</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">Bank Transfer</div>
                    <div className="text-xs text-muted-foreground">Show your bank details on checkout</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <Card className="p-6 rounded-lg">
              <h2 className="font-semibold mb-4">SEO</h2>
              <div className="space-y-4">
                <div><Label>Meta Title</Label><Input defaultValue="Cruz Gadgets — Future Forward Gadgets" className="mt-1.5" /></div>
                <div><Label>Meta Description</Label><Input defaultValue="Shop the latest phones, laptops & accessories." className="mt-1.5" /></div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end">
          <Button>Save Changes</Button>
        </div>
      </div>
    </AdminLayout>
  );
}
