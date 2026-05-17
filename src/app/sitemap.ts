import { MetadataRoute } from 'next'
import { createAnonClient } from '@/lib/supabase/server'

export const revalidate = 3600 // Revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kozura.ng'
  const supabase = createAnonClient()

  // Fetch all active stores for dynamic routes
  const { data: stores } = await supabase
    .from('stores')
    .select('slug, updated_at')
  
  const storeEntries: MetadataRoute.Sitemap = (stores || []).map((store) => ({
    url: `${siteUrl}/${store.slug}`,
    lastModified: store.updated_at ? new Date(store.updated_at) : new Date(),
    changeFrequency: 'daily',
    priority: 0.8,
  }))

  return [
    {
      url: `${siteUrl}`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${siteUrl}/terms`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    ...storeEntries,
  ]
}
