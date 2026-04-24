import { Image as ImageIcon, Upload, X } from "lucide-react";

export function ImageUploader() {
  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-muted/30 cursor-pointer hover:bg-muted/50 transition-colors">
        <div className="h-10 w-10 rounded-full bg-background border border-border mx-auto flex items-center justify-center">
          <Upload className="h-4 w-4 text-muted-foreground" />
        </div>
        <p className="mt-3 font-medium text-sm">Drag & drop or click to upload</p>
        <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
      </div>
      <div className="grid grid-cols-3 gap-3">
        {["bg-tile-mint", "bg-tile-butter", "bg-tile-peach"].map((c, i) => (
          <div key={i} className={`relative aspect-square rounded-2xl ${c} flex items-center justify-center group`}>
            <ImageIcon className="h-6 w-6 text-foreground/30" />
            <button className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-ink text-ink-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <X className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
