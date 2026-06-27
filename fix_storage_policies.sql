-- ==============================================================================================
-- KOZURA PLATFORM - STORAGE BUCKET RLS POLICIES FIX
-- Run this in your Supabase SQL Editor to fix the "row-level security policy" error
-- that occurs when sellers try to upload product images.
-- ==============================================================================================

-- ==========================================
-- STEP 1: Create the storage buckets if they don't exist
-- ==========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'product-images',
    'product-images',
    true,                    -- Public bucket (images are shown in storefronts)
    5242880,                 -- 5MB max file size
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'store-assets',
    'store-assets',
    true,                    -- Public bucket (logos, banners shown in storefronts)
    5242880,                 -- 5MB max file size
    ARRAY['image/jpeg', 'image/png', 'image/webp']
  )
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp'];

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  (
    'documents',
    'documents',
    false,                   -- Private bucket (payment receipts etc.)
    10485760,                -- 10MB max file size
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
  )
ON CONFLICT (id) DO UPDATE SET
  public = false,
  file_size_limit = 10485760;


-- ==========================================
-- STEP 2: Drop existing storage policies (clean slate)
-- ==========================================

DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view product images" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated users to upload store assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own store assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own store assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view store assets" ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated users to upload documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to view their documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow anon to upload documents" ON storage.objects;


-- ==========================================
-- STEP 3: product-images bucket policies
-- Files are stored as: {store_id}/{filename}
-- Only the store owner can upload/manage; anyone can read (public storefront)
-- ==========================================

-- Allow any authenticated user to upload to the product-images bucket.
-- The folder structure uses their store_id as the prefix.
CREATE POLICY "Allow authenticated users to upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'product-images');

-- Allow authenticated users to update (overwrite) their own uploads
CREATE POLICY "Allow users to update their own product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Allow users to delete their own product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow anyone to VIEW product images (needed for public storefront)
CREATE POLICY "Allow public to view product images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');


-- ==========================================
-- STEP 4: store-assets bucket policies
-- Files are stored as: {store_id}/{type}/{filename}
-- ==========================================

CREATE POLICY "Allow authenticated users to upload store assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'store-assets');

CREATE POLICY "Allow users to update their own store assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow users to delete their own store assets"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'store-assets' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Allow public to view store assets"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'store-assets');


-- ==========================================
-- STEP 5: documents bucket policies (payment receipts)
-- Anonymous users (customers) must be able to upload receipts.
-- Only the store owner should be able to read them.
-- ==========================================

-- Anyone (including unauthenticated customers) can upload receipts
CREATE POLICY "Allow anon to upload documents"
ON storage.objects FOR INSERT
TO public
WITH CHECK (bucket_id = 'documents');

-- Authenticated sellers can view documents in their own store's folder
CREATE POLICY "Allow owners to view their documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'documents');
