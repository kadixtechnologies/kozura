import { useState } from "react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { OrderSummaryCard } from "@/components/shop/OrderSummaryCard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

export default function Checkout() {
  const [shipping, setShipping] = useState<"pickup" | "delivery">("delivery");
  const [payment, setPayment] = useState<"cod" | "transfer">("transfer");
  const fee = shipping === "delivery" ? 5000 : 0;

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container py-8">
        <h1 className="text-2xl font-bold">Checkout</h1>
        <div className="grid lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg">Contact Details</h2>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div><Label>Full Name</Label><Input className="mt-1.5" placeholder="Adaeze Okafor" /></div>
                <div><Label>Email</Label><Input className="mt-1.5" type="email" placeholder="you@example.com" /></div>
                <div className="sm:col-span-2">
                  <Label>Phone</Label>
                  <div className="flex mt-1.5">
                    <span className="inline-flex items-center gap-1.5 border border-r-0 rounded-l-md px-3 text-sm bg-muted/40">
                      🇳🇬 +234
                    </span>
                    <Input className="rounded-l-none" placeholder="801 234 5678" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg">Shipping Method</h2>
              <RadioGroup value={shipping} onValueChange={(v: "pickup" | "delivery") => setShipping(v)} className="grid sm:grid-cols-2 gap-3 mt-4">
                {[
                  { v: "pickup", label: "Pickup", note: "FREE" },
                  { v: "delivery", label: "Delivery", note: "₦5,000" },
                ].map((o) => (
                  <Label
                    key={o.v}
                    htmlFor={`ship-${o.v}`}
                    className={cn(
                      "flex items-center justify-between border rounded-xl p-4 cursor-pointer transition-colors",
                      shipping === o.v && "border-primary bg-primary-soft",
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <RadioGroupItem id={`ship-${o.v}`} value={o.v} />
                      <span className="font-medium">{o.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-primary">{o.note}</span>
                  </Label>
                ))}
              </RadioGroup>
            </Card>

            {shipping === "delivery" && (
              <Card className="p-6 rounded-xl shadow-sm">
                <h2 className="font-semibold text-lg">Delivery Address</h2>
                <div className="grid sm:grid-cols-2 gap-4 mt-4">
                  <div className="sm:col-span-2"><Label>Address Line 1</Label><Input className="mt-1.5" placeholder="12 Allen Avenue" /></div>
                  <div><Label>City</Label><Input className="mt-1.5" placeholder="Ikeja" /></div>
                  <div>
                    <Label>State</Label>
                    <Select>
                      <SelectTrigger className="mt-1.5"><SelectValue placeholder="Select state" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lagos">Lagos</SelectItem>
                        <SelectItem value="abuja">Abuja</SelectItem>
                        <SelectItem value="rivers">Rivers</SelectItem>
                        <SelectItem value="kano">Kano</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </Card>
            )}

            <Card className="p-6 rounded-xl shadow-sm">
              <h2 className="font-semibold text-lg">Payment Method</h2>
              <RadioGroup value={payment} onValueChange={(v: "cod" | "transfer") => setPayment(v)} className="grid sm:grid-cols-2 gap-3 mt-4">
                {[{ v: "cod", label: "Cash on Delivery" }, { v: "transfer", label: "Bank Transfer" }].map((o) => (
                  <Label
                    key={o.v}
                    htmlFor={`pay-${o.v}`}
                    className={cn(
                      "flex items-center gap-3 border rounded-xl p-4 cursor-pointer transition-colors",
                      payment === o.v && "border-primary bg-primary-soft",
                    )}
                  >
                    <RadioGroupItem id={`pay-${o.v}`} value={o.v} />
                    <span className="font-medium">{o.label}</span>
                  </Label>
                ))}
              </RadioGroup>
            </Card>
          </div>

          <div className="lg:col-span-1">
            <OrderSummaryCard shippingFee={fee} />
          </div>
        </div>
      </div>
    </div>
  );
}
