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
      <div className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          <div>
            <div className="aspect-square rounded-xl bg-muted flex items-center justify-center">
              <ImageIcon className="h-20 w-20 text-muted-foreground/40" />
            </div>
            <div className="grid grid-cols-3 gap-3 mt-3">
              {[0, 1, 2].map((i) => (
                <div key={i} className="aspect-square rounded-lg bg-muted flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-primary">
                  <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="text-sm text-muted-foreground">{product.brand}</div>
            <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
            <div className="text-3xl font-bold text-primary mt-3">{formatNGN(product.price)}</div>

            <div className="space-y-5 mt-6">
              {product.variants.map((v) => (
                <div key={v.type}>
                  <div className="text-sm font-medium mb-2">{v.type}</div>
                  <div className="flex flex-wrap gap-2">
                    {v.values.map((val) => {
                      const isSel = selected[v.type] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelected({ ...selected, [v.type]: val })}
                          className={cn(
                            "px-4 py-2 rounded-full border text-sm font-medium transition-colors",
                            isSel
                              ? "bg-primary text-primary-foreground border-primary"
                              : "bg-background hover:bg-muted",
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
              <div className="text-sm font-medium mb-2">Quantity</div>
              <div className="inline-flex items-center border rounded-lg">
                <Button variant="ghost" size="icon" onClick={() => setQty(Math.max(1, qty - 1))}>
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="px-4 font-medium w-10 text-center">{qty}</span>
                <Button variant="ghost" size="icon" onClick={() => setQty(qty + 1)}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <Button size="lg" className="w-full mt-6">Add to Cart</Button>

            <Accordion type="single" collapsible className="mt-6" defaultValue="desc">
              <AccordionItem value="desc">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {product.description ?? "No description provided."}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship">
                <AccordionTrigger>Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  Free pickup available. Delivery within 2-5 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="mt-16">
          <h2 className="text-xl font-bold mb-4">Similar Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {similar.map((p) => <ProductCard key={p.id} product={p} compact />)}
          </div>
        </div>
      </div>
    </div>
  );
}
