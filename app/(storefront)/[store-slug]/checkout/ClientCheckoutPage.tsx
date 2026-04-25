"use client";

import { useState } from "react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { OrderSummaryCard } from "@/components/shop/OrderSummaryCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Copy, Check, Building2, UploadCloud, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { placeOrder } from "@/app/actions/checkout";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", 
  "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT - Abuja", "Gombe", "Imo", "Jigawa", "Kaduna", 
  "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", 
  "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara"
];

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] bg-background border border-border/60 p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="h-7 w-7 rounded-full bg-ink text-ink-foreground text-xs font-semibold flex items-center justify-center shrink-0">{step}</span>
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

function BankTransferDetails({ onFileSelected, store }: { onFileSelected: (file: File | null) => void, store: any }) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const bankDetails = {
    bankName: store.bank_name || "Not set",
    accountName: store.account_name || store.name,
    accountNumber: store.account_number || "Not set",
  };
  
  const copyField = async (label: string, value: string) => {
    try { await navigator.clipboard.writeText(value); } catch {
      const el = document.createElement("textarea"); el.value = value; el.style.position = "fixed"; el.style.opacity = "0"; document.body.appendChild(el); el.select(); document.execCommand("copy"); document.body.removeChild(el);
    }
    setCopiedField(label); toast.success(`${label} copied!`); setTimeout(() => setCopiedField(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFileName(file.name);
      onFileSelected(file);
      toast.success("Receipt attached successfully!");
    } else {
      setFileName(null);
      onFileSelected(null);
    }
  };

  return (
    <div className="mt-5 rounded-2xl bg-muted/50 border border-border/60 overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-border/60 bg-muted/30"><Building2 className="h-4 w-4 text-muted-foreground" /><span className="text-sm font-semibold">Bank Transfer Details</span></div>
      <div className="divide-y divide-border/60">
        {[{ label: "Bank Name", value: bankDetails.bankName }, { label: "Account Name", value: bankDetails.accountName }, { label: "Account Number", value: bankDetails.accountNumber }].map((row) => (
          <div key={row.label} className="flex items-center justify-between px-5 py-3.5 gap-3">
            <div><div className="text-xs text-muted-foreground">{row.label}</div><div className="font-bold text-base mt-0.5 font-sans tracking-wide">{row.value}</div></div>
            <button onClick={() => copyField(row.label, row.value)} className={cn("h-8 w-8 rounded-lg flex items-center justify-center transition-all shrink-0", copiedField === row.label ? "bg-green-100 text-green-600" : "bg-background border border-border hover:bg-muted text-muted-foreground")}>
              {copiedField === row.label ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            </button>
          </div>
        ))}
      </div>
      
      {/* Upload Receipt Section */}
      <div className="p-5 border-t border-border/60 bg-background/50">
        <Label className="text-sm font-semibold mb-3 block">Upload Payment Receipt</Label>
        <div className="relative border-2 border-dashed border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 text-center hover:bg-muted/30 transition-colors cursor-pointer group">
          <Input 
            type="file" 
            accept="image/*,.pdf" 
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileUpload}
          />
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <UploadCloud className="h-5 w-5 text-primary" />
          </div>
          <div>
            <span className="text-sm font-medium">{fileName ? fileName : "Click to attach receipt"}</span>
            {!fileName && <p className="text-xs text-muted-foreground mt-1">PNG, JPG or PDF (max 5MB)</p>}
          </div>
        </div>
      </div>

      <div className="px-5 py-3.5 bg-amber-50 border-t border-amber-100"><p className="text-xs text-amber-700">⚠️ Transfer the exact order total and use your name as the payment reference. Your order will be confirmed once payment is verified.</p></div>
    </div>
  );
}

export function ClientCheckoutPage({ store }: { store: any }) {
  const router = useRouter();

  const [shipping, setShipping] = useState<"pickup" | "delivery">("delivery");
  const [payment, setPayment] = useState<"cod" | "transfer">("transfer");
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");

  const shippingConfig = store.shipping_config || { pickup: { enabled: true }, delivery: { enabled: true, zones: [] } };
  const deliveryZones: { label: string; fee: number }[] = shippingConfig.delivery?.zones || [];
  const [selectedZone, setSelectedZone] = useState<string>(deliveryZones[0]?.label || "");

  const fee = shipping === "delivery" ? (deliveryZones.find(z => z.label === selectedZone)?.fee || 0) : 0;
  const paymentStep = shipping === "delivery" ? 4 : 3;

  const isPlaceOrderDisabled = (payment === "transfer" && !receiptFile) || isLoading;
  
  const { items: allItems, clearCart } = useCart();
  const storeItems = allItems.filter(i => i.storeId === store.id);

  const handlePlaceOrder = async () => {
    if (!name || !email || !phone) return toast.error("Please fill in your contact details.");
    if (shipping === "delivery" && (!address || !city || !state)) return toast.error("Please provide delivery address.");
    if (storeItems.length === 0) return toast.error("Your cart is empty.");

    setIsLoading(true);
    
    const subtotal = storeItems.reduce((s, i) => s + i.price * i.qty, 0);
    const totalAmount = subtotal + fee;

    const formData = new FormData();
    formData.append("storeId", store.id);
    formData.append("customerName", name);
    formData.append("customerEmail", email);
    formData.append("customerPhone", phone);
    formData.append("shippingMethod", shipping);
    formData.append("shippingFee", fee.toString());
    formData.append("shippingAddress", address);
    formData.append("shippingCity", city);
    formData.append("shippingState", state);
    formData.append("paymentMethod", payment);
    formData.append("subtotalAmount", subtotal.toString());
    formData.append("totalAmount", totalAmount.toString());
    
    if (receiptFile) {
      formData.append("receiptFile", receiptFile);
    }
    
    const formattedItems = storeItems.map(item => ({
      productId: item.productId, // Use productId because item.id is cart unique identifier
      name: item.name,
      variantLabel: item.variantLabel,
      quantity: item.qty,
      price: item.price
    }));
    formData.append("items", JSON.stringify(formattedItems));

    try {
      const res = await placeOrder(formData);
      if (res.success) {
        toast.success("Order placed successfully!");
        clearCart(store.id);
        router.push(`/${store.slug}/order-confirmation?orderId=${res.orderId}`);
      } else {
        toast.error(res.error || "Failed to place order.");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas relative">
      {isLoading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="bg-background border border-border p-5 rounded-2xl flex flex-col items-center shadow-lg">
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
            <p className="mt-3 font-medium text-sm">Processing order...</p>
          </div>
        </div>
      )}
      <StoreNavbar store={store} />
      <div className="container py-8">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">Checkout</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Almost there</h1>
        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mt-7">
          <div className="space-y-5">
            <Section step={1} title="Contact details">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Full name</Label><Input value={name} onChange={(e) => setName(e.target.value)} className="mt-1.5 rounded-xl" placeholder="Adaeze Okafor" disabled={isLoading} /></div>
                <div><Label className="text-xs text-muted-foreground">Email</Label><Input value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 rounded-xl" type="email" placeholder="you@example.com" disabled={isLoading} /></div>
                <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">Phone</Label>
                  <div className="flex mt-1.5 h-10"><span className="inline-flex items-center gap-1.5 h-full border border-r-0 border-input rounded-l-xl px-3 text-sm bg-muted/60 text-foreground whitespace-nowrap shrink-0 select-none">🇳🇬 +234</span><Input value={phone} onChange={(e) => setPhone(e.target.value)} className="rounded-l-none rounded-r-xl border-l-0 h-full focus-visible:ring-offset-0" placeholder="801 234 5678" type="tel" disabled={isLoading} /></div>
                </div>
              </div>
            </Section>
            <Section step={2} title="Shipping method">
              <RadioGroup value={shipping} onValueChange={(v: "pickup" | "delivery") => setShipping(v)} className="grid sm:grid-cols-2 gap-3" disabled={isLoading}>
                {shippingConfig.pickup?.enabled && (
                  <Label htmlFor="ship-pickup" className={cn("flex items-start gap-3 border rounded-2xl p-4 cursor-pointer transition-all", shipping === "pickup" ? "border-ink bg-muted/40" : "border-border hover:border-foreground/30")}>
                    <RadioGroupItem id="ship-pickup" value="pickup" className="mt-0.5" />
                    <div className="flex-1"><div className="flex items-center justify-between gap-2"><span className="font-medium text-sm">Pickup</span><span className="text-xs font-semibold">Free</span></div><div className="text-xs text-muted-foreground mt-0.5">Collect from our store</div></div>
                  </Label>
                )}
                {shippingConfig.delivery?.enabled && (
                  <Label htmlFor="ship-delivery" className={cn("flex items-start gap-3 border rounded-2xl p-4 cursor-pointer transition-all", shipping === "delivery" ? "border-ink bg-muted/40" : "border-border hover:border-foreground/30")}>
                    <RadioGroupItem id="ship-delivery" value="delivery" className="mt-0.5" />
                    <div className="flex-1"><div className="flex items-center justify-between gap-2"><span className="font-medium text-sm">Delivery</span><span className="text-xs font-semibold">{deliveryZones.length > 0 ? "Zone-based" : "Available"}</span></div><div className="text-xs text-muted-foreground mt-0.5">Delivered to your address</div></div>
                  </Label>
                )}
              </RadioGroup>
            </Section>
            {shipping === "delivery" && (
              <Section step={3} title="Delivery address">
                <div className="grid sm:grid-cols-2 gap-4">
                  {deliveryZones.length > 0 && (
                    <div className="sm:col-span-2">
                      <Label className="text-xs text-muted-foreground">Delivery zone</Label>
                      <Select value={selectedZone} onValueChange={setSelectedZone} disabled={isLoading}>
                        <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select your zone" /></SelectTrigger>
                        <SelectContent>
                          {deliveryZones.map(z => (
                            <SelectItem key={z.label} value={z.label}>{z.label} — ₦{z.fee.toLocaleString()}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">Address line 1</Label><Input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1.5 rounded-xl" placeholder="12 Allen Avenue" disabled={isLoading} /></div>
                  <div><Label className="text-xs text-muted-foreground">City</Label><Input value={city} onChange={(e) => setCity(e.target.value)} className="mt-1.5 rounded-xl" placeholder="Ikeja" disabled={isLoading} /></div>
                  <div><Label className="text-xs text-muted-foreground">State</Label>
                    <Select value={state} onValueChange={setState} disabled={isLoading}><SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select state" /></SelectTrigger><SelectContent>
                      {NIGERIAN_STATES.map((s) => (<SelectItem key={s} value={s}>{s}</SelectItem>))}
                    </SelectContent></Select>
                  </div>
                </div>
              </Section>
            )}
            <Section step={paymentStep} title="Payment method">
              <RadioGroup value={payment} onValueChange={(v: "cod" | "transfer") => setPayment(v)} className="grid sm:grid-cols-2 gap-3" disabled={isLoading}>
                {[{ v: "cod", label: "Cash on delivery", desc: "Pay when it arrives" }, { v: "transfer", label: "Bank transfer", desc: "Pay to our account" }].map((o) => (
                  <Label key={o.v} htmlFor={`pay-${o.v}`} className={cn("flex items-start gap-3 border rounded-2xl p-4 cursor-pointer transition-all", payment === o.v ? "border-ink bg-muted/40" : "border-border hover:border-foreground/30")}>
                    <RadioGroupItem id={`pay-${o.v}`} value={o.v} className="mt-0.5" />
                    <div><div className="font-medium text-sm">{o.label}</div><div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div></div>
                  </Label>
                ))}
              </RadioGroup>
              {payment === "transfer" && <BankTransferDetails onFileSelected={setReceiptFile} store={store} />}
            </Section>
          </div>
          <div className="lg:col-span-1">
            <OrderSummaryCard 
              shippingFee={fee} 
              isPlaceOrderDisabled={isPlaceOrderDisabled} 
              onPlaceOrder={handlePlaceOrder}
              store={store}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
