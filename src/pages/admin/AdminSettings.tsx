import { AdminLayout, AdminTopBar } from "@/components/admin/AdminSidebar";
import { ImageUploader } from "@/components/shop/ImageUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { store } from "@/lib/mock-data";

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/60 p-6">
      <h2 className="font-semibold text-sm">{title}</h2>
      <div className="mt-4">{children}</div>
    </div>
  );
}

export default function AdminSettings() {
  return (
    <AdminLayout>
      <AdminTopBar title="Settings" subtitle="Configure your store" action={<Button>Save changes</Button>} />

      <div className="p-7">
        <Tabs defaultValue="general">
          <TabsList className="bg-muted rounded-full p-1 h-auto">
            {["general", "shipping", "payments", "seo"].map((t) => (
              <TabsTrigger key={t} value={t} className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="general" className="space-y-5 mt-6">
            <Panel title="Store information">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Store name</Label><Input defaultValue={store.name} className="mt-1.5 rounded-xl" /></div>
                <div>
                  <Label className="text-xs text-muted-foreground">Store slug</Label>
                  <Input defaultValue={store.slug} className="mt-1.5 rounded-xl" />
                  <div className="text-xs text-muted-foreground mt-1.5">shoplink.app/{store.slug}</div>
                </div>
                <div><Label className="text-xs text-muted-foreground">WhatsApp number</Label><Input defaultValue={store.whatsapp} className="mt-1.5 rounded-xl" /></div>
                <div>
                  <Label className="text-xs text-muted-foreground">Currency</Label>
                  <Select defaultValue="NGN">
                    <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="NGN">NGN — Nigerian Naira</SelectItem>
                      <SelectItem value="USD">USD — US Dollar</SelectItem>
                      <SelectItem value="GHS">GHS — Ghanaian Cedi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Panel>

            <Panel title="Appearance">
              <div className="space-y-5">
                <div>
                  <Label className="text-xs text-muted-foreground">Logo</Label>
                  <div className="mt-1.5"><ImageUploader /></div>
                </div>
                <div>
                  <Label className="text-xs text-muted-foreground">Primary color</Label>
                  <div className="mt-1.5 flex items-center gap-2">
                    <div className="h-10 w-10 rounded-xl border border-border" style={{ backgroundColor: store.color }} />
                    <Input defaultValue={store.color} className="font-mono w-40 rounded-xl" />
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Store status">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Store is active</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Customers can place orders</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Password protected</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Require password to view storefront</div>
                  </div>
                  <Switch />
                </div>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="shipping" className="space-y-5 mt-6">
            <div className="grid md:grid-cols-2 gap-5">
              <Panel title="Pickup">
                <div className="space-y-3">
                  <div><Label className="text-xs text-muted-foreground">Label</Label><Input defaultValue="Pickup" className="mt-1.5 rounded-xl" /></div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Panel>
              <Panel title="Delivery">
                <div className="space-y-3">
                  <div><Label className="text-xs text-muted-foreground">Label</Label><Input defaultValue="Delivery" className="mt-1.5 rounded-xl" /></div>
                  <div><Label className="text-xs text-muted-foreground">Fee</Label><Input defaultValue="₦5,000" className="mt-1.5 rounded-xl" /></div>
                  <div className="flex items-center justify-between pt-2">
                    <span className="text-sm font-medium">Active</span>
                    <Switch defaultChecked />
                  </div>
                </div>
              </Panel>
            </div>

            <Panel title="Address fields">
              <div className="space-y-3">
                {["Address Line 1", "City", "State", "Postal Code"].map((f) => (
                  <label key={f} className="flex items-center gap-2.5 cursor-pointer">
                    <Checkbox defaultChecked={f !== "Postal Code"} />
                    <span className="text-sm">{f}</span>
                  </label>
                ))}
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="payments" className="mt-6">
            <Panel title="Payment methods">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Cash on delivery</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Customer pays on delivery</div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Bank transfer</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Show your bank details on checkout</div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </Panel>
          </TabsContent>

          <TabsContent value="seo" className="mt-6">
            <Panel title="SEO">
              <div className="space-y-4">
                <div><Label className="text-xs text-muted-foreground">Meta title</Label><Input defaultValue="Cruz Gadgets — Future Forward Gadgets" className="mt-1.5 rounded-xl" /></div>
                <div><Label className="text-xs text-muted-foreground">Meta description</Label><Input defaultValue="Shop the latest phones, laptops & accessories." className="mt-1.5 rounded-xl" /></div>
              </div>
            </Panel>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}
