import { Image as ImageIcon, Heart, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Product, formatNGN, store } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

const tilePalette = [
  "bg-tile-mint",
  "bg-tile-butter",
  "bg-tile-peach",
  "bg-tile-sky",
  "bg-tile-mist",
];

export function ProductCard({ product, compact = false, index = 0 }: { product: Product; compact?: boolean; index?: number }) {
  const tile = tilePalette[index % tilePalette.length];
  return (
    <Link
      to={`/${store.slug}/p/${product.slug}`}
      className="group block rounded-[24px] bg-background border border-border/60 overflow-hidden transition-all hover:border-border"
    >
      <div className={cn("relative aspect-[4/5] flex items-center justify-center overflow-hidden", tile)}>
        <ImageIcon className="h-12 w-12 text-foreground/20 transition-transform duration-500 group-hover:scale-105" />

        <button
          onClick={(e) => { e.preventDefault(); }}
          className="absolute top-3 right-3 h-8 w-8 rounded-full bg-background/90 backdrop-blur flex items-center justify-center hover:bg-background transition-colors"
        >
          <Heart className="h-3.5 w-3.5" />
        </button>

        <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-[11px] font-medium">
          {product.brand}
        </div>
      </div>

      <div className={compact ? "p-3.5" : "p-4"}>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Our Picks</div>
            <div className={cn("font-medium mt-0.5 line-clamp-1", compact ? "text-[13px]" : "text-[15px]")}>
              {product.name}
            </div>
          </div>
          <div className="inline-flex items-center gap-1 shrink-0 rounded-full bg-ink text-ink-foreground px-3 py-1.5 text-xs font-semibold">
            {formatNGN(product.price)}
            <ArrowUpRight className="h-3 w-3 -mr-0.5" />
          </div>
        </div>
      </div>
    </Link>
  );
}
