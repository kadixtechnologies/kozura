import { Image as ImageIcon, Upload, X } from "lucide-react";
import { Card } from "@/components/ui/card";

export function ImageUploader() {
  return (
    <div className="space-y-4">
      <Card className="border-2 border-dashed rounded-lg p-8 text-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
        <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
        <p className="mt-3 font-medium">Drag & drop images or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
      </Card>
      <div className="grid grid-cols-3 gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="relative aspect-square rounded-lg bg-muted flex items-center justify-center group">
            <ImageIcon className="h-6 w-6 text-muted-foreground/40" />
            <button className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
