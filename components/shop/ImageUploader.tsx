"use client";

import { Image as ImageIcon, Upload, X, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { v4 as uuidv4 } from "uuid";

export function ImageUploader({ 
  defaultUrls = [], 
  onChange,
  bucket = "product-images",
  pathPrefix = ""
}: { 
  defaultUrls?: string[], 
  onChange?: (urls: string[]) => void,
  bucket?: string,
  pathPrefix?: string
}) {
  const [urls, setUrls] = useState<string[]>(defaultUrls);
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const maxFiles = 3 - urls.length;
    if (maxFiles <= 0) {
      toast.error("You can only upload up to 3 images per product.");
      if (e.target) e.target.value = '';
      return;
    }

    const files = Array.from(e.target.files || []).slice(0, maxFiles);
    if (files.length === 0) return;

    const oversizedFiles = files.filter(f => f.size > 5 * 1024 * 1024);
    if (oversizedFiles.length > 0) {
      toast.error("Each file size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} image${files.length > 1 ? 's' : ''}...`);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        throw new Error("You must be logged in to upload images");
      }

      let baseFolder = pathPrefix;
      
      if (!baseFolder) {
        // Fetch the user's store_id to use as the base folder
        const { data: store } = await supabase
          .from("stores")
          .select("id")
          .eq("seller_id", user.id)
          .single();
          
        if (!store) throw new Error("Store not found for this user");
        baseFolder = store.id;
      }

      const uploadPromises = files.map(async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExt}`;
        const filePath = `${baseFolder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        return publicUrl;
      });

      const uploadedUrls = await Promise.all(uploadPromises);

      const newUrls = [...urls, ...uploadedUrls];
      setUrls(newUrls);
      if (onChange) onChange(newUrls);
      
      toast.success(`Successfully uploaded ${files.length} image${files.length > 1 ? 's' : ''}!`, { id: toastId });
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || "Failed to upload images", { id: toastId });
    } finally {
      setIsUploading(false);
      if (e.target) {
        e.target.value = ''; // Reset input
      }
    }
  };

  const removeImage = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
    if (onChange) onChange(newUrls);
  };

  return (
    <div className="space-y-4">
      {urls.length < 3 && (
        <div className="border-2 border-dashed border-border rounded-2xl p-8 text-center bg-muted/30 relative overflow-hidden group">
          <input 
            type="file" 
            multiple
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
            accept="image/jpeg,image/png,image/webp" 
            onChange={handleUpload} 
            disabled={isUploading}
          />
          <div className="h-10 w-10 rounded-full bg-background border border-border mx-auto flex items-center justify-center group-hover:bg-muted transition-colors">
            {isUploading ? <Loader2 className="h-4 w-4 text-primary animate-spin" /> : <Upload className="h-4 w-4 text-muted-foreground" />}
          </div>
          <p className="mt-3 font-medium text-sm">Drag & drop or click to upload</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, WEBP up to 5MB</p>
        </div>
      )}
      {urls.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {urls.map((url, i) => (
            <div key={i} className="relative aspect-square rounded-2xl flex items-center justify-center group border border-border/50 bg-muted/20 overflow-hidden">
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button 
                onClick={(e) => { e.preventDefault(); removeImage(i); }} 
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-ink text-ink-foreground flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10"
                disabled={isUploading}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
