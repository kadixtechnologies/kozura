import { useState } from "react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { OrderSummaryCard } from "@/components/shop/OrderSummaryCard";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

function Section({ step, title, children }: { step: number; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[24px] bg-background border border-border/60 p-6 sm:p-7">
      <div className="flex items-center gap-3">
        <span className="h-7 w-7 rounded-full bg-ink text-ink-foreground text-xs font-semibold flex items-center justify-center">{step}</span>
        <h2 className="font-semibold text-base">{title}</h2>
      </div>
      <div className="mt-5">{children}</div>
    </div>
  );
}

export default function Checkout() {
  const [shipping, setShipping] = useState<"pickup" | "delivery">("delivery");
  const [payment, setPayment] = useState<"cod" | "transfer">("transfer");
  const fee = shipping === "delivery" ? 5000 : 0;

  return (
    <div className="min-h-screen bg-canvas">
      <StoreNavbar />
      <div className="container py-8">
        <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-medium">Checkout</div>
        <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">Almost there</h1>

        <div className="grid lg:grid-cols-[1.6fr_1fr] gap-6 mt-7">
          <div className="space-y-5">
            <Section step={1} title="Contact details">
              <div className="grid sm:grid-cols-2 gap-4">
                <div><Label className="text-xs text-muted-foreground">Full name</Label><Input className="mt-1.5 rounded-xl" placeholder="Adaeze Okafor" /></div>
                <div><Label className="text-xs text-muted-foreground">Email</Label><Input className="mt-1.5 rounded-xl" type="email" placeholder="you@example.com" /></div>
                <div className="sm:col-span-2">
                  <Label className="text-xs text-muted-foreground">Phone</Label>
                  <div className="flex mt-1.5">
                    <span className="inline-flex items-center gap-1.5 border border-r-0 rounded-l-xl px-3 text-sm bg-muted/60">
                      🇳🇬 +234
                    </span>
                    <Input className="rounded-l-none rounded-r-xl" placeholder="801 234 5678" />
                  </div>
                </div>
              </div>
            </Section>

            <Section step={2} title="Shipping method">
              <RadioGroup value={shipping} onValueChange={(v: "pickup" | "delivery") => setShipping(v)} className="grid sm:grid-cols-2 gap-3">
                {[
                  { v: "pickup", label: "Pickup", note: "Free", desc: "Collect from our Lagos store" },
                  { v: "delivery", label: "Delivery", note: "₦5,000", desc: "2-5 business days" },
                ].map((o) => (
                  <Label
                    key={o.v}
                    htmlFor={`ship-${o.v}`}
                    className={cn(
                      "flex items-start gap-3 border rounded-2xl p-4 cursor-pointer transition-all",
                      shipping === o.v ? "border-ink bg-muted/40" : "border-border hover:border-foreground/30",
                    )}
                  >
                    <RadioGroupItem id={`ship-${o.v}`} value={o.v} className="mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm">{o.label}</span>
                        <span className="text-xs font-semibold">{o.note}</span>
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </Section>

            {shipping === "delivery" && (
              <Section step={3} title="Delivery address">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2"><Label className="text-xs text-muted-foreground">Address line 1</Label><Input className="mt-1.5 rounded-xl" placeholder="12 Allen Avenue" /></div>
                  <div><Label className="text-xs text-muted-foreground">City</Label><Input className="mt-1.5 rounded-xl" placeholder="Ikeja" /></div>
                  <div>
                    <Label className="text-xs text-muted-foreground">State</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Section>
            )}

            <Section step={shipping === "delivery" ? 4 : 3} title="Payment method">
              <RadioGroup value={payment} onValueChange={(v: "cod" | "transfer") => setPayment(v)} className="grid sm:grid-cols-2 gap-3">
                {[
                  { v: "cod", label: "Cash on delivery", desc: "Pay when it arrives" },
                  { v: "transfer", label: "Bank transfer", desc: "Show details after order" },
                ].map((o) => (
                  <Label
                    key={o.v}
                    htmlFor={`pay-${o.v}`}
                    className={cn(
                      "flex items-start gap-3 border rounded-2xl p-4 cursor-pointer transition-all",
                      payment === o.v ? "border-ink bg-muted/40" : "border-border hover:border-foreground/30",
                    )}
                  >
                    <RadioGroupItem id={`pay-${o.v}`} value={o.v} className="mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{o.label}</div>
                      <div className="text-xs text-muted-foreground mt-0.5">{o.desc}</div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </Section>
          </div>

          <div className="lg:col-span-1">
            <OrderSummaryCard shippingFee={fee} />
          </div>
        </div>
      </div>
    </div>
  );
}
