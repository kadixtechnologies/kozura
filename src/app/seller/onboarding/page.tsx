"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, ArrowLeft, Upload, Image as ImageIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { completeOnboarding } from "@/actions/seller/onboarding";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

const steps = ["Store Info", "Contact", "Payout", "Ready"];

export default function SellerOnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [storeName, setStoreName] = useState("");
  const [category, setCategory] = useState("other");
  const [whatsappNumber, setWhatsappNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#16a34a");

  const slug = storeName.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");

  const handleNext = () => {
    if (step === 0 && !storeName.trim()) return toast.error("Store name is required");
    if (step === 1 && !whatsappNumber.trim()) return toast.error("WhatsApp number is required");
    if (step === 2 && (!bankName || !accountNumber || !accountName)) return toast.error("All bank details are required");
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const formData = new FormData();
      if (logoFile) {
        formData.append("logoFile", logoFile);
      }
      formData.append("storeName", storeName);
      formData.append("category", category);
      formData.append("whatsappNumber", whatsappNumber);
      formData.append("bankName", bankName);
      formData.append("accountNumber", accountNumber);
      formData.append("accountName", accountName);
      formData.append("primaryColor", primaryColor);

      const res = await completeOnboarding(formData);
      if (res.success) {
        toast.success("Store created successfully!");
        setStep(3);
      } else {
        toast.error(res.error || "Failed to create store");
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-canvas grid lg:grid-cols-2">
      {/* Left */}
      <div className="hidden lg:flex p-5">
        <div className="flex-1 rounded-[28px] bg-ink text-ink-foreground p-12 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Kozura Logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold tracking-tight">Kozura</span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] font-medium text-ink-foreground/60">Step {step + 1} of {steps.length}</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight leading-tight max-w-md">
              {step === 0 && "Tell us about your store."}
              {step === 1 && "How can customers reach you?"}
              {step === 2 && "Where should we send your payouts?"}
              {step === 3 && "You're all set!"}
            </h2>
          </div>
          <div className="flex gap-2">
            {steps.map((_, i) => (
              <span key={i} className={`h-1.5 rounded-full transition-all ${i <= step ? "w-6 bg-background" : "w-1.5 bg-background/30"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <img src="/logo.png" alt="Kozura Logo" className="h-8 w-8 object-contain" />
            <span className="font-semibold tracking-tight">Kozura</span>
          </div>

          <div className="flex items-center gap-2 mb-6 lg:hidden">
            {steps.map((s, i) => (
              <div key={i} className={`flex-1 h-1 rounded-full ${i <= step ? "bg-ink" : "bg-border"}`} />
            ))}
          </div>

          {step === 0 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Store details</h1>
                <p className="text-sm text-muted-foreground mt-1">We just need a few things to get started.</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Store name</Label>
                <Input className="mt-1.5 rounded-xl" placeholder="e.g. Cruz Gadgets" value={storeName} onChange={(e) => setStoreName(e.target.value)} />
                {slug && <div className="text-xs text-muted-foreground mt-1.5">kozura.app/<span className="font-medium text-foreground">{slug}</span></div>}
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="mt-1.5 rounded-xl"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="electronics">Electronics</SelectItem>
                    <SelectItem value="gadgets">Gadgets & Accessories</SelectItem>
                    <SelectItem value="fashion">Fashion & Clothing</SelectItem>
                    <SelectItem value="food">Food & Beverages</SelectItem>
                    <SelectItem value="beauty">Beauty & Skincare</SelectItem>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="home">Home & Kitchen</SelectItem>
                    <SelectItem value="sports">Sports & Outdoors</SelectItem>
                    <SelectItem value="books">Books & Stationery</SelectItem>
                    <SelectItem value="toys">Toys & Games</SelectItem>
                    <SelectItem value="art">Art & Collectibles</SelectItem>
                    <SelectItem value="services">Services</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Logo (Optional)</Label>
                <Input
                  type="file"
                  className="mt-1.5"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file && file.size > 1024 * 1024) {
                      toast.error("The logo image is more than 1MB");
                      e.target.value = '';
                      setLogoFile(null);
                    } else {
                      setLogoFile(file || null);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground mt-1.5">Size not more than 1MB</p>
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Contact</h1>
                <p className="text-sm text-muted-foreground mt-1">Your WhatsApp number for orders and inquiries.</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">WhatsApp number</Label>
                <Input className="mt-1.5 rounded-xl" placeholder="+234 801 234 5678" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Primary color</Label>
                <div className="mt-1.5 flex gap-3">
                  {["#16a34a", "#2563eb", "#9333ea", "#e11d48", "#f97316", "#0d0d0d"].map((c) => (
                    <button key={c} onClick={() => setPrimaryColor(c)} className={`h-10 w-10 rounded-xl border-2 transition-all ${primaryColor === c ? 'border-foreground' : 'border-transparent hover:border-foreground/30'}`} style={{ backgroundColor: c }} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-5">
              <div>
                <h1 className="text-2xl font-semibold tracking-tight">Payout Details</h1>
                <p className="text-sm text-muted-foreground mt-1">Where should we send your money?</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Bank Name</Label>
                <Input className="mt-1.5 rounded-xl" placeholder="e.g. GTBank" value={bankName} onChange={(e) => setBankName(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Account Number</Label>
                <Input className="mt-1.5 rounded-xl" placeholder="0123456789" value={accountNumber} onChange={(e) => setAccountNumber(e.target.value)} />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Account Name</Label>
                <Input className="mt-1.5 rounded-xl" placeholder="John Doe" value={accountName} onChange={(e) => setAccountName(e.target.value)} />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-5 text-center">
              <div className="h-20 w-20 rounded-2xl bg-tile-mint flex items-center justify-center mx-auto overflow-hidden">
                {logoFile ? (
                  <img src={URL.createObjectURL(logoFile)} alt="Store Logo" className="h-full w-full object-cover" />
                ) : (
                  <ImageIcon className="h-8 w-8 text-foreground/30" />
                )}
              </div>
              <h1 className="text-2xl font-semibold tracking-tight">Your store is ready!</h1>
              <p className="text-sm text-muted-foreground">Start adding products and share your link with the world.</p>
              <Button className="w-full" size="lg" onClick={() => router.push("/seller/dashboard")}>
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          )}

          {step < 3 && (
            <div className="flex items-center gap-3 mt-8">
              {step > 0 && (
                <Button variant="outline" onClick={() => setStep(step - 1)} className="gap-2" disabled={isLoading}>
                  <ArrowLeft className="h-4 w-4" /> Back
                </Button>
              )}
              {step < 2 ? (
                <Button className="flex-1 gap-2" onClick={handleNext}>
                  Continue <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button className="flex-1 gap-2" onClick={handleSubmit} disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Complete Setup"}
                  {!isLoading && <ArrowRight className="h-4 w-4" />}
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
