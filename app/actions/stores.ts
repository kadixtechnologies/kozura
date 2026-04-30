"use server";

import { createAnonClient } from "@/lib/supabase/server";

export type StoreSearchResult = {
  id: string;
  name: string;
  slug: string;
  tagline: string | null;
  logo_url: string | null;
  owner_name: string | null;
};

export async function searchStores(query: string): Promise<StoreSearchResult[]> {
  if (!query || query.trim().length < 2) return [];

  const supabase = createAnonClient();
  const q = query.trim().toLowerCase();

  const { data, error } = await supabase
    .from("stores")
    .select("id, name, slug, tagline, logo_url, profiles!inner(full_name)")
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,slug.ilike.%${q}%,profiles.full_name.ilike.%${q}%`)
    .limit(8);

  if (error || !data) return [];

  return data.map((store: any) => ({
    id: store.id,
    name: store.name,
    slug: store.slug,
    tagline: store.tagline,
    logo_url: store.logo_url,
    owner_name: store.profiles?.full_name ?? null,
  }));
}
