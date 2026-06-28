import { Image as ImageIcon, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { formatNGN } from "@/lib/format";

const tilePalette = [
  "bg-tile-mint",
  "bg-tile-butter",
  "bg-tile-peach",
  "bg-tile-sky",
  "bg-tile-mist",
];

export function ProductCard({ product, compact = false, index = 0, storeSlug }: { product: any; compact?: boolean; index?: number; storeSlug: string }) {
  const tile = tilePalette[index % tilePalette.length];
  return (
    <Link
      href={`/${storeSlug}/p/${product.slug}`}
      className="group block rounded-[24px] bg-background border border-border/60 overflow-hidden transition-all hover:border-border"
    >
      <div className={cn("relative aspect-[4/5] flex items-center justify-center overflow-hidden", tile)}>
        {product.images?.[0] ? (
          <Image src={product.images[0]} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : product.image && product.image !== "/placeholder.png" ? (
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <ImageIcon className="h-12 w-12 text-foreground/20 transition-transform duration-500 group-hover:scale-105" />
        )}

        {product.brand && (
          <div className="absolute top-3 left-3 inline-flex items-center gap-1 rounded-full bg-background/90 backdrop-blur px-2.5 py-1 text-xs font-medium">
            {product.brand}
          </div>
        )}
      </div>

      <div className={compact ? "p-3" : "p-3 sm:p-4"}>
        <div className="flex flex-col gap-2 sm:gap-3">
          <div className="min-w-0">
            <div className={cn("font-medium line-clamp-2", compact ? "text-[12px] sm:text-[13px]" : "text-[13px] sm:text-[15px]")}>
              {product.name}
            </div>
          </div>
          <div className="flex justify-end">
            <div className="inline-flex items-center gap-1 shrink-0 rounded-full bg-ink text-ink-foreground px-2.5 py-1 sm:px-3 sm:py-1.5 text-[11px] sm:text-xs font-semibold">
              {formatNGN(product.price)}
              <ArrowUpRight className="h-3 w-3 -mr-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
