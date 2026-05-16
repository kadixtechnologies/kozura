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
  const q = query.trim();

  // Query 1: match by store name or slug
  const { data: byStore } = await supabase
    .from("stores")
    .select("id, name, slug, tagline, logo_url, profiles(full_name)")
    .eq("is_active", true)
    .or(`name.ilike.%${q}%,slug.ilike.%${q}%`)
    .limit(8);

  // Query 2: find profiles matching the owner name, then fetch their stores
  const { data: matchedProfiles } = await supabase
    .from("profiles")
    .select("id, full_name")
    .ilike("full_name", `%${q}%`)
    .limit(10);

  let byOwner: any[] = [];
  if (matchedProfiles && matchedProfiles.length > 0) {
    const sellerIds = matchedProfiles.map((p) => p.id);
    const { data: ownerStores } = await supabase
      .from("stores")
      .select("id, name, slug, tagline, logo_url, profiles(full_name)")
      .eq("is_active", true)
      .in("seller_id", sellerIds)
      .limit(8);
    byOwner = ownerStores ?? [];
  }

  // Merge and deduplicate by id
  const combined = [...(byStore ?? []), ...byOwner];
  const seen = new Set<string>();
  const unique = combined.filter((s) => {
    if (seen.has(s.id)) return false;
    seen.add(s.id);
    return true;
  });

  return unique.slice(0, 8).map((store: any) => ({
    id: store.id,
    name: store.name,
    slug: store.slug,
    tagline: store.tagline,
    logo_url: store.logo_url,
    owner_name: store.profiles?.full_name ?? null,
  }));
}
