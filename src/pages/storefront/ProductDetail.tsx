import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Image as ImageIcon, Minus, Plus, ArrowLeft, Star, Truck, ShieldCheck, RotateCcw } from "lucide-react";
import { StoreNavbar } from "@/components/shop/StoreNavbar";
import { ProductCard } from "@/components/shop/ProductCard";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { products, formatNGN, store } from "@/lib/mock-data";
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
    <div className="min-h-screen bg-canvas">
      <StoreNavbar />

      <div className="container py-6">
        <Link to={`/${store.slug}`} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4" /> Back to shop
        </Link>

        <div className="mt-5 grid lg:grid-cols-[1.1fr_1fr] gap-6 lg:gap-10">
          {/* Image gallery */}
          <div className="space-y-3">
            <div className="relative aspect-square rounded-[28px] bg-tile-mint flex items-center justify-center overflow-hidden">
              <ImageIcon className="h-24 w-24 text-foreground/15" />
              <div className="absolute top-5 left-5 inline-flex items-center gap-2 rounded-full bg-background/90 backdrop-blur px-3 py-1.5 text-xs font-medium">
                {product.brand}
              </div>
              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                <div className="rounded-full bg-ink text-ink-foreground px-4 py-2 text-sm font-semibold">
                  {formatNGN(product.price)}
                </div>
                <div className="text-right text-xs text-foreground/70">See more</div>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-3">
              {[
                "bg-tile-butter",
                "bg-tile-peach",
                "bg-tile-sky",
                "bg-tile-mist",
              ].map((c, i) => (
                <div key={i} className={cn("aspect-square rounded-2xl flex items-center justify-center cursor-pointer border border-transparent hover:border-foreground/20 transition-colors", c)}>
                  <ImageIcon className="h-6 w-6 text-foreground/20" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="lg:pt-3">
            <div className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">{product.brand}</div>
            <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight mt-2">{product.name}</h1>

            <div className="flex items-center gap-3 mt-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map((i) => <Star key={i} className="h-3.5 w-3.5 fill-foreground text-foreground" />)}
              </div>
              <span className="text-sm text-muted-foreground">4.9 (41 Reviews)</span>
            </div>

            <div className="mt-5 inline-flex items-baseline gap-3">
              <span className="text-3xl font-semibold tracking-tight">{formatNGN(product.price)}</span>
              <span className="text-sm text-muted-foreground line-through">{formatNGN(Math.round(product.price * 1.15))}</span>
            </div>

            <div className="space-y-5 mt-7">
              {product.variants.map((v) => (
                <div key={v.type}>
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{v.type}</div>
                    <div className="text-xs text-foreground">{selected[v.type]}</div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2.5">
                    {v.values.map((val) => {
                      const isSel = selected[v.type] === val;
                      return (
                        <button
                          key={val}
                          onClick={() => setSelected({ ...selected, [v.type]: val })}
                          className={cn(
                            "h-10 min-w-12 px-4 rounded-full border text-sm font-medium transition-all",
                            isSel
                              ? "bg-ink text-ink-foreground border-ink"
                              : "bg-background text-foreground border-border hover:border-foreground/30",
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

            <div className="flex items-center gap-3 mt-7">
              <div className="inline-flex items-center bg-muted rounded-full p-1">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="h-9 w-9 rounded-full bg-background flex items-center justify-center hover:bg-background/80 transition-colors">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-4 text-sm font-medium w-10 text-center">{qty}</span>
                <button onClick={() => setQty(qty + 1)} className="h-9 w-9 rounded-full bg-background flex items-center justify-center hover:bg-background/80 transition-colors">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <Button size="lg" className="flex-1">Buy now</Button>
            </div>

            {/* Trust badges */}
            <div className="mt-6 grid grid-cols-3 gap-2 text-center">
              {[
                { icon: Truck, label: "Free pickup" },
                { icon: ShieldCheck, label: "1-yr warranty" },
                { icon: RotateCcw, label: "7-day returns" },
              ].map((t) => (
                <div key={t.label} className="rounded-2xl bg-background border border-border/60 py-3">
                  <t.icon className="h-4 w-4 mx-auto text-muted-foreground" />
                  <div className="text-[11px] text-muted-foreground mt-1">{t.label}</div>
                </div>
              ))}
            </div>

            <Accordion type="single" collapsible className="mt-6" defaultValue="desc">
              <AccordionItem value="desc" className="border-b-0 border-t border-border/60">
                <AccordionTrigger className="text-sm hover:no-underline">Description</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  {product.description ?? "No description provided."}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="ship" className="border-b-0 border-t border-border/60">
                <AccordionTrigger className="text-sm hover:no-underline">Shipping & Returns</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground leading-relaxed">
                  Free pickup available. Delivery within 2-5 business days.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <div className="mt-16 border-t border-border/60 pt-10">
          <div className="flex items-baseline justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">More all you need</h2>
            <Link to={`/${store.slug}`} className="text-sm text-muted-foreground hover:text-foreground">See all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">
            {similar.map((p, i) => <ProductCard key={p.id} product={p} compact index={i} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
