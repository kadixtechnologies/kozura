import { useState } from "react";
import { useParams } from "react-router-dom";
import { Image as ImageIcon, Minus, Plus } from "lucide-react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { products, formatNGN } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ProductDetail() {
  const { productSlug } = useParams();
  const product = products.find((p) => p.slug === productSlug) ?? products[0];
  const [qty, setQty] = useState(1);
  const [selected, setSelected] = useState<Record<string, string>>(
    product.variants.reduce((acc, v) => ({ ...acc, [v.type]: v.values[0] }), {}),
  );
  const similar = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <StoreNavbar />
      <div className="container py-10">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="aspect-square rounded-lg bg-muted border flex items-center justify-center">
              <ImageIcon className="h-16 w-16 text-muted-foreground/40" />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="aspect-square rounded-md bg-muted border flex items-center justify-center cursor-pointer">
                  <ImageIcon className="h-5 w-5 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-xs text-muted-foreground uppercase tracking-wide">{product.brand}</div>
            <h1 className="text-2xl font-semibold tracking-tight mt-2">{product.name}</h1>
            <div className="text-2xl font-semibold mt-4">{formatNGN(product.price)}</div>

            <div className="space-y-5 mt-8">
              {product.variants.map((v) => (
                <div key={v.type}>
                  <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">{v.type}</div>
                  <div className="flex flex-wrap gap-2">
                    {v.values.map((val) => {
                      const isSel = selected[v.type] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelected({ ...selected, [v.type]: val })}
                          className={cn(
                            "px-3.5 py-1.5 rounded-md border text-sm font-medium transition-colors",
                            isSel
                              ? "bg-foreground text-background border-foreground"
                              : "bg-background text-foreground border-border",
                          )}
                        >
                          {val}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6">
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-2">Quantity</div>
              <div className="inline-flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="h-3.5 w-3.5" />
                </Button>
                <span className="px-4 text-sm font-medium w-10 text-center">{qty}</span>
                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-none" onClick={() => setQty(qty + 1)}>
                  <Plus className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full mt-8">Add to cart</Button>

            <Accordion type="single" collapsible className="mt-8" defaultValue="desc">
              <AccordionItem value="desc">
                <AccordionTrigger className="text-sm">Description</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {product.description ?? "No description provided."}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship">
                <AccordionTrigger className="text-sm">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Free pickup available. Delivery within 2-5 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="mt-20 pt-10 border-t">
          <h2 className="text-base font-semibold mb-5">Similar products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>
      </div>
    </div>
  );
}
