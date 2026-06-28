"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SellerLayout, SellerTopBar } from "@/components/seller/SellerSidebar";
import { ImageUploader } from "@/components/storefront/ImageUploader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Zap, TrendingUp, Briefcase, Crown, AlertTriangle, X, Check, Loader2, Plus, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { saveSettings, saveSlug, checkSlugAvailability, deleteAccount } from "@/actions/seller/settings";

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[20px] border border-border/60 p-4 sm:p-6">
      <div>
        <h2 className="font-semibold text-sm">{title}</h2>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DeleteDialog({ onClose }: { onClose: () => void }) {
  const [txt, setTxt] = useState("");
  const [loading, setLoading] = useState(false);
  const handle = async () => {
    setLoading(true);
    const res = await deleteAccount();
    if (res.success) { 
      toast.success("Your account has been permanently deleted."); 
      onClose();
      window.location.href = "/";
    } else {
      toast.error(res.error || "Failed to delete account");
    }
    setLoading(false);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-background rounded-[24px] border border-border/60 shadow-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-start gap-3">
            <div className="h-10 w-10 rounded-xl bg-destructive/10 flex items-center justify-center shrink-0"><AlertTriangle className="h-5 w-5 text-destructive" /></div>
            <div><h2 className="font-semibold">Delete your account</h2><p className="text-sm text-muted-foreground mt-1">This will permanently delete your store, all products, and order history. This <strong>cannot</strong> be undone.</p></div>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-full bg-muted flex items-center justify-center"><X className="h-4 w-4" /></button>
        </div>
        <Label className="text-xs text-muted-foreground">Type <span className="font-mono font-bold text-foreground">DELETE</span> to confirm</Label>
        <Input value={txt} onChange={e => setTxt(e.target.value)} placeholder="DELETE" className="mt-1.5 rounded-xl font-mono" autoFocus />
        <div className="flex gap-2 mt-5">
          <Button variant="outline" className="flex-1 rounded-xl" onClick={onClose}>Cancel</Button>
          <Button variant="destructive" className="flex-1 rounded-xl" disabled={txt !== "DELETE" || loading} onClick={handle}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null} Delete account
          </Button>
        </div>
      </div>
    </div>
  );
}

type DeliveryZone = { label: string; fee: number };

export function ClientSettingsPage({ store, ordersThisMonth, plans }: { store: any; ordersThisMonth: number; plans: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const success = searchParams.get('success');
    const error = searchParams.get('error');
    if (success) {
      toast.success(success);
      // Clean up the URL
      const url = new URL(window.location.href);
      url.searchParams.delete('success');
      window.history.replaceState({}, '', url);
    }
    if (error) {
      toast.error(error);
      const url = new URL(window.location.href);
      url.searchParams.delete('error');
      window.history.replaceState({}, '', url);
    }
  }, [searchParams]);
  
  const dynamicPlans = plans.map(p => ({
    id: p.name.toLowerCase(), // Or p.id if we update stores table to use plan UUIDs
    dbId: p.id,
    name: p.name,
    price: p.price_monthly === 0 ? "Free" : `₦${p.price_monthly.toLocaleString()}/mo`,
    ordersLabel: p.order_limit === -1 ? "Unlimited orders" : `${p.order_limit.toLocaleString()} orders/mo`,
    productsLabel: p.product_limit === -1 ? "Unlimited products" : `${p.product_limit.toLocaleString()} products`,
    color: p.bg_color
  }));

  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [upgradingPlan, setUpgradingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planId: string) => {
    setUpgradingPlan(planId);
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to initiate payment');
      
      // Redirect to Paystack
      window.location.href = data.authorization_url;
    } catch (error: any) {
      toast.error(error.message);
      setUpgradingPlan(null);
    }
  };

  // --- General ---
  const [name, setName] = useState(store.name || "");
  const [tagline, setTagline] = useState(store.tagline || "");
  const [description, setDescription] = useState(store.description || "");
  const [whatsapp, setWhatsapp] = useState(store.whatsapp_number || "");

  // --- Slug with availability check ---
  const [slug, setSlug] = useState(store.slug || "");
  const [slugStatus, setSlugStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const [slugTimer, setSlugTimer] = useState<ReturnType<typeof setTimeout> | null>(null);
  const [savingSlug, setSavingSlug] = useState(false);

  const handleSlugChange = (val: string) => {
    const clean = val.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setSlug(clean);
    setSlugStatus("idle");
    if (slugTimer) clearTimeout(slugTimer);
    if (clean && clean !== store.slug) {
      setSlugStatus("checking");
      const t = setTimeout(async () => {
        const res = await checkSlugAvailability(clean, store.id);
        setSlugStatus(res.available ? "available" : "taken");
      }, 600);
      setSlugTimer(t);
    }
  };

  const handleSaveSlug = async () => {
    setSavingSlug(true);
    const res = await saveSlug(slug);
    if (res.success) { toast.success("Store URL updated!"); setSlugStatus("idle"); router.refresh(); }
    else toast.error(res.error || "Failed to update slug");
    setSavingSlug(false);
  };

  // --- Appearance ---
  const [color, setColor] = useState(store.primary_color || "#16a34a");
  const [logoUrl, setLogoUrl] = useState(store.logo_url || "");

  // --- Shipping ---
  const shippingConfig = store.shipping_config || { pickup: { enabled: true }, delivery: { enabled: true, zones: [] } };
  const [pickupEnabled, setPickupEnabled] = useState(shippingConfig.pickup?.enabled ?? true);
  const [deliveryEnabled, setDeliveryEnabled] = useState(shippingConfig.delivery?.enabled ?? true);
  const [zones, setZones] = useState<DeliveryZone[]>(shippingConfig.delivery?.zones || [{ label: "Lagos Island", fee: 2000 }, { label: "Mainland", fee: 3500 }]);

  const addZone = () => setZones(z => [...z, { label: "", fee: 0 }]);
  const removeZone = (i: number) => setZones(z => z.filter((_, idx) => idx !== i));
  const updateZone = (i: number, field: keyof DeliveryZone, val: string | number) =>
    setZones(z => z.map((zone, idx) => idx === i ? { ...zone, [field]: val } : zone));

  // --- Payments ---
  const [acceptsCod, setAcceptsCod] = useState(store.accepts_cod ?? true);
  const [acceptsTransfer, setAcceptsTransfer] = useState(store.accepts_bank_transfer ?? true);
  const [bankName, setBankName] = useState(store.bank_name || "");
  const [accountName, setAccountName] = useState(store.account_name || "");
  const [accountNumber, setAccountNumber] = useState(store.account_number || "");

  // --- Store status ---
  const [isActive, setIsActive] = useState(store.is_active ?? true);

  // --- SEO ---
  const [seoTitle, setSeoTitle] = useState(store.seo_meta_title || "");
  const [seoDesc, setSeoDesc] = useState(store.seo_meta_description || "");

  // --- Socials ---
  const [socialFacebook, setSocialFacebook] = useState(store.social_facebook || "");
  const [socialInstagram, setSocialInstagram] = useState(store.social_instagram || "");
  const [socialTiktok, setSocialTiktok] = useState(store.social_tiktok || "");
  const [socialFacebookEnabled, setSocialFacebookEnabled] = useState(store.social_facebook_enabled ?? false);
  const [socialInstagramEnabled, setSocialInstagramEnabled] = useState(store.social_instagram_enabled ?? false);
  const [socialTiktokEnabled, setSocialTiktokEnabled] = useState(store.social_tiktok_enabled ?? false);

  const handleSave = async () => {
    setSaving(true);
    const fd = new FormData();
    fd.append("tab", "all"); // Tell server to save everything

    // General
    fd.append("name", name);
    fd.append("tagline", tagline);
    fd.append("description", description);
    fd.append("whatsapp_number", whatsapp);
    fd.append("currency", "NGN");
    fd.append("is_active", String(isActive));

    // Appearance
    fd.append("primary_color", color);
    if (logoUrl) fd.append("logo_url", logoUrl);

    // Shipping
    fd.append("shipping_config", JSON.stringify({
      pickup: { enabled: pickupEnabled },
      delivery: { enabled: deliveryEnabled, zones },
    }));

    // Payments
    fd.append("accepts_cod", String(acceptsCod));
    fd.append("accepts_bank_transfer", String(acceptsTransfer));
    fd.append("bank_name", bankName);
    fd.append("account_name", accountName);
    fd.append("account_number", accountNumber);

    // SEO
    fd.append("seo_meta_title", seoTitle);
    fd.append("seo_meta_description", seoDesc);

    // Socials
    fd.append("social_facebook", socialFacebook);
    fd.append("social_instagram", socialInstagram);
    fd.append("social_tiktok", socialTiktok);
    fd.append("social_facebook_enabled", String(socialFacebookEnabled));
    fd.append("social_instagram_enabled", String(socialInstagramEnabled));
    fd.append("social_tiktok_enabled", String(socialTiktokEnabled));

    const res = await saveSettings(fd);
    if (res.success) { 
      toast.success("Settings saved!"); 
      window.location.reload(); 
    }
    else toast.error(res.error || "Failed to save");
    setSaving(false);
  };

  const fallbackPlan = {
    id: "free",
    name: "Free",
    price: "Free",
    ordersLabel: "5 orders/mo",
    productsLabel: "5 products",
    color: "bg-muted"
  };

  const currentPlan = dynamicPlans.find(p => p.id === store.subscription_plan) || dynamicPlans[0] || fallbackPlan;

  return (
    <>
      <SellerLayout>
        <SellerTopBar
          title="Settings"
          subtitle="Configure your store"
          action={
            activeTab !== "plan" ? (
              <Button onClick={handleSave} disabled={saving} className="gap-2 w-full md:w-auto text-xs sm:text-sm h-8 sm:h-9">
                {saving && <Loader2 className="h-4 w-4 animate-spin" />} Save changes
              </Button>
            ) : undefined
          }
        />
        <div className="p-4 sm:p-7">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            {/* Mobile: dropdown */}
            <div className="sm:hidden mb-5">
              <Select value={activeTab} onValueChange={setActiveTab}>
                <SelectTrigger className="w-full rounded-xl bg-background h-10 px-3 text-[13px] font-medium capitalize shadow-sm border-border/60">
                  <SelectValue placeholder="Select section" />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-border/60">
                  {["general", "appearance", "shipping", "payments", "plan", "seo", "socials"].map(t => (
                    <SelectItem key={t} value={t} className="capitalize text-[13px] rounded-lg cursor-pointer">
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Desktop: pill tabs */}
            <TabsList className="hidden sm:flex bg-muted rounded-full p-1 h-auto flex-wrap gap-1">
              {["general", "appearance", "shipping", "payments", "plan", "seo", "socials"].map(t => (
                <TabsTrigger key={t} value={t} className="rounded-full data-[state=active]:bg-background data-[state=active]:shadow-sm px-4 py-1.5 text-sm capitalize">{t}</TabsTrigger>
              ))}
            </TabsList>

            {/* ── GENERAL ── */}
            <TabsContent value="general" className="space-y-5 mt-6">
              <Panel title="Store information">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Store name</Label>
                    <Input value={name} onChange={e => setName(e.target.value)} className="mt-1.5 rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Tagline</Label>
                    <Input value={tagline} onChange={e => setTagline(e.target.value)} className="mt-1.5 rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="e.g. Quality gadgets at your fingertips" />
                  </div>
                  <div className="sm:col-span-2">
                    <Label className="text-xs text-muted-foreground">Description</Label>
                    <Textarea value={description} onChange={e => setDescription(e.target.value)} className="mt-1.5 rounded-xl resize-none text-[13px] sm:text-sm" rows={3} />
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">WhatsApp number</Label>
                    <div className="flex mt-1.5">
                      <span className="inline-flex items-center h-9 sm:h-10 border border-r-0 border-input rounded-l-xl px-3 text-[13px] sm:text-sm bg-muted/60 text-foreground shrink-0">+234</span>
                      <Input value={whatsapp} onChange={e => setWhatsapp(e.target.value)} className="rounded-l-none rounded-r-xl border-l-0 text-[13px] sm:text-sm h-9 sm:h-10" placeholder="8012345678" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Currency</Label>
                    <Input value="NGN — Nigerian Naira" disabled className="mt-1.5 rounded-xl bg-muted/40 text-muted-foreground text-[13px] sm:text-sm h-9 sm:h-10" />
                  </div>
                </div>
              </Panel>

              <Panel title="Store URL" description="Your unique link customers use to find your store">
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-2 sm:items-end">
                  <div className="flex-1">
                    <Label className="text-xs text-muted-foreground">Slug</Label>
                    <div className="relative mt-1.5">
                      <Input
                        value={slug}
                        onChange={e => handleSlugChange(e.target.value)}
                        className={cn("rounded-xl pr-8 text-[13px] sm:text-sm h-9 sm:h-10", slugStatus === "taken" && "border-destructive focus-visible:ring-destructive")}
                        placeholder="your-store-name"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2">
                        {slugStatus === "checking" && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
                        {slugStatus === "available" && <CheckCircle2 className="h-4 w-4 text-success" />}
                        {slugStatus === "taken" && <XCircle className="h-4 w-4 text-destructive" />}
                      </div>
                    </div>
                    <div className={cn("text-xs mt-1.5", slugStatus === "taken" ? "text-destructive" : slugStatus === "available" ? "text-success" : "text-muted-foreground")}>
                      {slugStatus === "taken" ? "This URL is already taken." : slugStatus === "available" ? "This URL is available!" : `kozura.app/${slug}`}
                    </div>
                  </div>
                  <Button onClick={handleSaveSlug} disabled={savingSlug || slugStatus === "taken" || slugStatus === "checking" || slug === store.slug} className="rounded-xl gap-2 sm:mb-6 w-full sm:w-auto text-xs sm:text-sm h-9 sm:h-10">
                    {savingSlug ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Update URL
                  </Button>
                </div>
              </Panel>

              <Panel title="Store status">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Store is active</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Customers can browse and place orders</div>
                  </div>
                  <Switch checked={isActive} onCheckedChange={v => { setIsActive(v); }} className="scale-75 sm:scale-100 origin-right" />
                </div>
              </Panel>

              <div className="rounded-[20px] border border-destructive/40 p-4 sm:p-6">
                <h2 className="font-semibold text-sm text-destructive">Danger zone</h2>
                <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <div className="font-medium text-sm">Delete account</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Permanently remove your store, products, and all data.</div>
                  </div>
                  <Button variant="destructive" size="sm" className="shrink-0 w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9" onClick={() => setShowDelete(true)}>Delete account</Button>
                </div>
              </div>
            </TabsContent>

            {/* ── APPEARANCE ── */}
            <TabsContent value="appearance" className="space-y-5 mt-6">
              <Panel title="Logo">
                <ImageUploader
                  pathPrefix={store.id}
                  bucket="store-assets"
                  defaultUrls={logoUrl ? [logoUrl] : []}
                  onChange={(urls: string[]) => setLogoUrl(urls[0] ?? "")}
                />
              </Panel>
              <Panel title="Brand color">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-border shrink-0" style={{ backgroundColor: color }} />
                  <Input value={color} onChange={e => setColor(e.target.value)} className="font-mono w-40 rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="#16a34a" />
                  <input type="color" value={color} onChange={e => setColor(e.target.value)} className="h-9 w-9 sm:h-10 sm:w-10 rounded-xl border border-border cursor-pointer" />
                </div>
              </Panel>
            </TabsContent>

            {/* ── SHIPPING ── */}
            <TabsContent value="shipping" className="space-y-5 mt-6">
              <Panel title="Pickup">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-sm">Enable pickup</div>
                    <div className="text-xs text-muted-foreground mt-0.5">Customers can collect from your location</div>
                  </div>
                  <Switch checked={pickupEnabled} onCheckedChange={setPickupEnabled} className="scale-75 sm:scale-100 origin-right" />
                </div>
              </Panel>

              <Panel title="Delivery zones" description="Set different delivery fees per location. Customers will choose from this list at checkout.">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4 sm:gap-0">
                  <div className="flex items-center">
                    <Switch checked={deliveryEnabled} onCheckedChange={setDeliveryEnabled} className="scale-75 sm:scale-100 origin-left" />
                    <span className="text-sm font-medium ml-2 flex-1">Enable delivery</span>
                  </div>
                  <Button size="sm" variant="outline" className="gap-1.5 rounded-xl w-full sm:w-auto text-xs sm:text-sm h-8 sm:h-9" onClick={addZone}>
                    <Plus className="h-3.5 w-3.5" /> Add zone
                  </Button>
                </div>

                {zones.length === 0 && (
                  <div className="text-[13px] sm:text-sm text-muted-foreground text-center py-6 border border-dashed border-border/60 rounded-xl">
                    No delivery zones yet. Click "Add zone" to create one.
                  </div>
                )}

                <div className="space-y-3">
                  {zones.map((zone, i) => (
                    <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-muted/30 border border-border/60">
                      <div className="w-full sm:flex-1">
                        <Label className="text-xs text-muted-foreground">Location name</Label>
                        <Input
                          value={zone.label}
                          onChange={e => updateZone(i, "label", e.target.value)}
                          className="mt-1 rounded-lg h-8 sm:h-9 text-[13px] sm:text-sm"
                          placeholder="e.g. Lagos Island"
                        />
                      </div>
                      <div className="flex items-end gap-3 w-full sm:w-auto">
                        <div className="flex-1 sm:w-36">
                          <Label className="text-xs text-muted-foreground">Fee (₦)</Label>
                          <Input
                            type="number"
                            value={zone.fee}
                            onChange={e => updateZone(i, "fee", parseFloat(e.target.value) || 0)}
                            className="mt-1 rounded-lg h-8 sm:h-9 text-[13px] sm:text-sm"
                            placeholder="2000"
                          />
                        </div>
                        <button onClick={() => removeZone(i)} className="h-8 sm:h-9 w-8 sm:w-9 rounded-lg flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors shrink-0">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </Panel>
            </TabsContent>

            {/* ── PAYMENTS ── */}
            <TabsContent value="payments" className="space-y-5 mt-6">
              <Panel title="Payment methods">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Cash on delivery</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Customer pays when order arrives</div>
                    </div>
                    <Switch checked={acceptsCod} onCheckedChange={setAcceptsCod} className="scale-75 sm:scale-100 origin-right" />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-sm">Bank transfer</div>
                      <div className="text-xs text-muted-foreground mt-0.5">Show your bank details at checkout</div>
                    </div>
                    <Switch checked={acceptsTransfer} onCheckedChange={setAcceptsTransfer} className="scale-75 sm:scale-100 origin-right" />
                  </div>
                </div>
              </Panel>

              {acceptsTransfer && (
                <Panel title="Bank details" description="This will appear on your checkout page for customers to transfer payment to.">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label className="text-xs text-muted-foreground">Bank name</Label>
                      <Input value={bankName} onChange={e => setBankName(e.target.value)} className="mt-1.5 rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="Access Bank" />
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">Account name</Label>
                      <Input value={accountName} onChange={e => setAccountName(e.target.value)} className="mt-1.5 rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="Your Business Name" />
                    </div>
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Account number</Label>
                      <Input value={accountNumber} onChange={e => setAccountNumber(e.target.value)} className="mt-1.5 rounded-xl font-mono text-[13px] sm:text-sm h-9 sm:h-10" placeholder="0123456789" maxLength={10} />
                    </div>
                  </div>
                </Panel>
              )}
            </TabsContent>

            {/* ── PLAN ── */}
            <TabsContent value="plan" className="space-y-5 mt-6">
              <div className={cn("rounded-[20px] p-6 border border-border/60", currentPlan.color)}>
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-wider text-foreground/60 font-medium mb-1">Current plan</div>
                    <div className="flex items-center gap-2">
                      <span className="text-2xl font-bold">{currentPlan.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">{currentPlan.price}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">{currentPlan.ordersLabel} · {currentPlan.productsLabel}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs text-muted-foreground">Orders this month</div>
                    <div className="text-2xl font-bold mt-0.5">{ordersThisMonth}</div>
                  </div>
                </div>
              </div>

              <Panel title="Available plans">
                <div className="grid sm:grid-cols-2 gap-4">
                  {dynamicPlans.map(plan => {
                    const isCurrent = plan.id === store.subscription_plan;
                    return (
                      <div key={plan.id} className={cn("relative rounded-2xl border p-5 transition-all", isCurrent ? "border-foreground/30 bg-muted/40" : "border-border hover:border-foreground/20")}>
                        {isCurrent && <span className="absolute top-3 right-3 inline-flex items-center gap-1 bg-foreground text-background text-[10px] font-semibold px-2 py-0.5 rounded-full"><Check className="h-2.5 w-2.5" /> Current</span>}
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-sm">{plan.name}</span>
                        </div>
                        <div className="text-xl font-bold">{plan.price}</div>
                        <div className="text-xs text-muted-foreground mt-1">{plan.ordersLabel} · {plan.productsLabel}</div>
                        {!isCurrent && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="mt-4 w-full rounded-xl" 
                            disabled={upgradingPlan !== null}
                            onClick={() => handleUpgrade(plan.id)}
                          >
                            {upgradingPlan === plan.id ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                            Upgrade to {plan.name}
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </Panel>
            </TabsContent>

            {/* ── SEO ── */}
            <TabsContent value="seo" className="mt-6">
              <Panel title="SEO settings" description="These help search engines find and display your store correctly.">
                <div className="space-y-4">
                  <div>
                    <Label className="text-xs text-muted-foreground">Meta title</Label>
                    <Input value={seoTitle} onChange={e => setSeoTitle(e.target.value)} className="mt-1.5 rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder={`${name} — Shop online`} maxLength={60} />
                    <div className="text-xs text-muted-foreground mt-1">{seoTitle.length}/60 characters</div>
                  </div>
                  <div>
                    <Label className="text-xs text-muted-foreground">Meta description</Label>
                    <Textarea value={seoDesc} onChange={e => setSeoDesc(e.target.value)} className="mt-1.5 rounded-xl resize-none text-[13px] sm:text-sm" rows={3} placeholder="Describe your store in one or two sentences…" maxLength={160} />
                    <div className="text-xs text-muted-foreground mt-1">{seoDesc.length}/160 characters</div>
                  </div>
                </div>
              </Panel>
            </TabsContent>

            {/* ── SOCIALS ── */}
            <TabsContent value="socials" className="mt-6 space-y-5">
              <Panel title="Social Media" description="Link your social media profiles to display them on your storefront.">
                <div className="space-y-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Facebook</div>
                      </div>
                      <Switch checked={socialFacebookEnabled} onCheckedChange={setSocialFacebookEnabled} className="scale-75 sm:scale-100 origin-right" />
                    </div>
                    {socialFacebookEnabled && (
                      <Input value={socialFacebook} onChange={e => setSocialFacebook(e.target.value)} className="rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="https://facebook.com/yourpage" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">Instagram</div>
                      </div>
                      <Switch checked={socialInstagramEnabled} onCheckedChange={setSocialInstagramEnabled} className="scale-75 sm:scale-100 origin-right" />
                    </div>
                    {socialInstagramEnabled && (
                      <Input value={socialInstagram} onChange={e => setSocialInstagram(e.target.value)} className="rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="https://instagram.com/yourhandle" />
                    )}
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-sm">TikTok</div>
                      </div>
                      <Switch checked={socialTiktokEnabled} onCheckedChange={setSocialTiktokEnabled} className="scale-75 sm:scale-100 origin-right" />
                    </div>
                    {socialTiktokEnabled && (
                      <Input value={socialTiktok} onChange={e => setSocialTiktok(e.target.value)} className="rounded-xl text-[13px] sm:text-sm h-9 sm:h-10" placeholder="https://tiktok.com/@yourhandle" />
                    )}
                  </div>
                </div>
              </Panel>
            </TabsContent>
          </Tabs>
        </div>
      </SellerLayout>
      {showDelete && <DeleteDialog onClose={() => setShowDelete(false)} />}
    </>
  );
}
