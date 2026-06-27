import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ "store-slug": string }> }): Promise<Metadata> {
  const { "store-slug": slug } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("name, seo_meta_title, seo_meta_description, logo_url")
    .eq("slug", slug)
    .single();

  if (!store) {
    return { title: "Store Not Found" };
  }

  return {
    title: {
      template: `%s | ${store.name}`,
      default: store.seo_meta_title || store.name,
    },
    description: store.seo_meta_description || `Welcome to ${store.name}`,
    icons: store.logo_url ? {
      icon: store.logo_url,
      shortcut: store.logo_url,
      apple: store.logo_url,
    } : undefined,
  };
}

export default async function StoreLayout({ 
  children,
  params
}: { 
  children: React.ReactNode,
  params: Promise<{ "store-slug": string }>
}) {
  const { "store-slug": slug } = await params;
  const supabase = await createClient();

  const { data: store } = await supabase
    .from("stores")
    .select("is_active, name")
    .eq("slug", slug)
    .single();

  if (!store) {
    notFound();
  }

  if (store.is_active === false) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-canvas p-6 text-center">
        <div className="bg-background rounded-[24px] border border-border/60 p-10 max-w-md w-full shadow-sm">
          <div className="h-16 w-16 bg-muted rounded-2xl mx-auto flex items-center justify-center mb-6">
            <span className="text-2xl font-bold text-muted-foreground">{store.name.charAt(0)}</span>
          </div>
          <h1 className="text-2xl font-semibold tracking-tight mb-2">Store Unavailable</h1>
          <p className="text-muted-foreground">This store is currently inactive. Please check back later or contact the seller.</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
