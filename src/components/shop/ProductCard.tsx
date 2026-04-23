import { Image as ImageIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product, formatNGN, store } from "@/lib/mock-data";

export function ProductCard({ product, compact = false }: { product: Product; compact?: boolean }) {
  const hasVariants = product.variants.length > 0;
  return (
    <Card className="overflow-hidden">
      <Link to={`/${store.slug}/p/${product.slug}`} className="block">
        <div className="aspect-square bg-muted flex items-center justify-center border-b">
          <ImageIcon className="h-10 w-10 text-muted-foreground/40" />
        </div>
      </Link>
      <div className={compact ? "p-3" : "p-4"}>
        <div className="text-xs text-muted-foreground">{product.brand}</div>
        <Link to={`/${store.slug}/p/${product.slug}`}>
          <div className={`font-medium mt-1 line-clamp-1 ${compact ? "text-sm" : "text-[15px]"}`}>
            {product.name}
          </div>
        </Link>
        <div className={`font-semibold mt-1.5 ${compact ? "text-sm" : "text-base"}`}>
          {formatNGN(product.price)}
        </div>
        {!compact && (
          <Button variant="outline" className="w-full mt-3" size="sm">
            {hasVariants ? "See options" : "Add to cart"}
          </Button>
        )}
      </div>
    </Card>
  );
}
