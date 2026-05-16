import { createClient } from './client'

type BucketName = 'product-images' | 'store-assets' | 'documents'

/**
 * Uploads a product image to the 'product-images' bucket
 * Folder structure: {store_id}/{product_id}/{filename}
 */
export async function uploadProductImage(file: File, storeId: string, productId: string): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${storeId}/${productId}/${fileName}`

  const { data, error } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Error uploading product image:', error)
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  return getPublicUrl('product-images', data.path)
}

/**
 * Uploads a store asset to the 'store-assets' bucket
 * Folder structure: {store_id}/{type}/{filename}
 */
export async function uploadStoreAsset(
  file: File, 
  storeId: string, 
  type: 'logo' | 'banner' | 'category'
): Promise<string> {
  const supabase = createClient()
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  const filePath = `${storeId}/${type}/${fileName}`

  const { data, error } = await supabase.storage
    .from('store-assets')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error(`Error uploading store ${type}:`, error)
    throw new Error(`Failed to upload ${type}: ${error.message}`)
  }

  return getPublicUrl('store-assets', data.path)
}

/**
 * Deletes a file from the specified bucket
 * Can accept either the raw storage path or the full public URL
 */
export async function deleteFile(bucket: BucketName, path: string): Promise<void> {
  const supabase = createClient()
  
  let filePath = path
  
  // If a full URL is passed, extract just the file path
  // E.g., https://xyz.supabase.co/storage/v1/object/public/product-images/store/product/file.jpg
  if (path.startsWith('http')) {
    const urlParts = path.split(`/public/${bucket}/`)
    if (urlParts.length === 2) {
      filePath = urlParts[1]
    } else {
      console.warn('Could not extract file path from URL:', path)
      return
    }
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([filePath])

  if (error) {
    console.error(`Error deleting file from ${bucket}:`, error)
    throw new Error(`Failed to delete file: ${error.message}`)
  }
}

/**
 * Returns the full public URL for a given file path in a bucket
 */
export function getPublicUrl(bucket: BucketName, path: string): string {
  const supabase = createClient()
  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return data.publicUrl
}
