-- ==============================================================================================
-- KOZURA PLATFORM - FIX: PDF Receipt Upload
-- Run this in your Supabase SQL Editor.
-- 
-- Problem: The 'store-assets' bucket was created with only image MIME types allowed
--          (image/jpeg, image/png, image/webp). When customers upload a PDF payment
--          receipt, Supabase Storage rejects it at the bucket level before RLS is
--          even checked, causing the "Failed to upload payment receipt" error.
--
-- Fix: Update the bucket to also allow application/pdf uploads.
-- ==============================================================================================

UPDATE storage.buckets
SET allowed_mime_types = ARRAY[
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf'
]
WHERE id = 'store-assets';

-- Verify the update
SELECT id, name, allowed_mime_types, file_size_limit
FROM storage.buckets
WHERE id = 'store-assets';
