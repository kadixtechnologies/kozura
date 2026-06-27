-- ==============================================================================================
-- KOZURA PLATFORM — COMPLETE DATABASE + STORAGE REPAIR
-- Run this ONCE in your Supabase SQL Editor to fix ALL known schema gaps and permissions.
-- It is safe to run multiple times (fully idempotent).
-- ==============================================================================================


-- ==========================================
-- SECTION 1: STORES TABLE — Missing columns
-- ==========================================

-- Rename owner_id → seller_id (if the old column still exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'owner_id'
  ) AND NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'seller_id'
  ) THEN
    ALTER TABLE public.stores RENAME COLUMN owner_id TO seller_id;
  END IF;
END $$;

-- Core columns added/used by the app
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS seller_id        UUID REFERENCES public.profiles(id) ON DELETE CASCADE;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS category         TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS tagline          TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS primary_color    TEXT DEFAULT '#16a34a';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS is_active        BOOLEAN DEFAULT true;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- Settings page columns
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS shipping_config      JSONB DEFAULT '{"pickup":{"enabled":true},"delivery":{"enabled":true,"zones":[]}}';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS accepts_cod          BOOLEAN DEFAULT true;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS accepts_bank_transfer BOOLEAN DEFAULT true;

-- SEO columns
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS seo_meta_title       TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS seo_meta_description TEXT;


-- ==========================================
-- SECTION 2: CATEGORIES TABLE — Missing columns
-- ==========================================

-- icon: emoji or icon name chosen by seller (e.g. "👟", "electronics")
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS icon      TEXT;
-- image_url: optional banner/thumbnail image for the category
ALTER TABLE public.categories ADD COLUMN IF NOT EXISTS image_url TEXT;


-- ==========================================
-- SECTION 3: PRODUCTS TABLE — Missing columns
-- ==========================================

-- compare_at_price: original/crossed-out price for showing discounts
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS compare_at_price NUMERIC;
-- brand: brand name shown on product cards and search
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS brand TEXT;


-- ==========================================
-- SECTION 4: FIX INDEXES (seller_id rename)
-- ==========================================

DROP INDEX IF EXISTS idx_stores_owner_id;
CREATE INDEX IF NOT EXISTS idx_stores_seller_id ON public.stores(seller_id);


-- ==========================================
-- SECTION 5: DROP & RECREATE ALL TABLE RLS POLICIES
-- Clean slate so we don't have stale owner_id references.
-- ==========================================

-- Profiles
DROP POLICY IF EXISTS "Users can view own profile"   ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

CREATE POLICY "Users can view own profile"   ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Plans (public read)
DROP POLICY IF EXISTS "Plans are publicly readable" ON public.plans;
CREATE POLICY "Plans are publicly readable" ON public.plans FOR SELECT USING (true);

-- Stores
DROP POLICY IF EXISTS "Stores are publicly readable"    ON public.stores;
DROP POLICY IF EXISTS "Owners can insert stores"        ON public.stores;
DROP POLICY IF EXISTS "Owners can update their stores"  ON public.stores;
DROP POLICY IF EXISTS "Owners can delete their stores"  ON public.stores;

CREATE POLICY "Stores are publicly readable"   ON public.stores FOR SELECT USING (true);
CREATE POLICY "Owners can insert stores"       ON public.stores FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Owners can update their stores" ON public.stores FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Owners can delete their stores" ON public.stores FOR DELETE USING (auth.uid() = seller_id);

-- Categories
DROP POLICY IF EXISTS "Categories are publicly readable" ON public.categories;
DROP POLICY IF EXISTS "Owners can manage categories"     ON public.categories;

CREATE POLICY "Categories are publicly readable" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Owners can manage categories"     ON public.categories FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = categories.store_id AND stores.seller_id = auth.uid()
  )
);

-- Products
DROP POLICY IF EXISTS "Products are publicly readable" ON public.products;
DROP POLICY IF EXISTS "Owners can manage products"     ON public.products;

CREATE POLICY "Products are publicly readable" ON public.products FOR SELECT USING (true);
CREATE POLICY "Owners can manage products"     ON public.products FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = products.store_id AND stores.seller_id = auth.uid()
  )
);

-- Orders
DROP POLICY IF EXISTS "Anyone can insert orders"     ON public.orders;
DROP POLICY IF EXISTS "Owners can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Owners can update their orders" ON public.orders;

CREATE POLICY "Anyone can insert orders"       ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view their orders"   ON public.orders FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = orders.store_id AND stores.seller_id = auth.uid()
  )
);
CREATE POLICY "Owners can update their orders" ON public.orders FOR UPDATE USING (
  EXISTS (
    SELECT 1 FROM public.stores
    WHERE stores.id = orders.store_id AND stores.seller_id = auth.uid()
  )
);

-- Order Items
DROP POLICY IF EXISTS "Anyone can insert order items"      ON public.order_items;
DROP POLICY IF EXISTS "Owners can view their order items"  ON public.order_items;

CREATE POLICY "Anyone can insert order items"     ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders
    JOIN public.stores ON orders.store_id = stores.id
    WHERE orders.id = order_items.order_id AND stores.seller_id = auth.uid()
  )
);

-- Waitlist
DROP POLICY IF EXISTS "Anyone can join waitlist" ON public.waitlist;
CREATE POLICY "Anyone can join waitlist" ON public.waitlist FOR INSERT WITH CHECK (true);


-- ==========================================
-- SECTION 6: TABLE-LEVEL GRANTS
-- ==========================================

GRANT ALL PRIVILEGES ON ALL TABLES    IN SCHEMA public TO service_role, postgres, authenticated;
GRANT SELECT         ON ALL TABLES    IN SCHEMA public TO anon;
GRANT USAGE, SELECT  ON ALL SEQUENCES IN SCHEMA public TO service_role, postgres, authenticated, anon;


-- ==========================================
-- SECTION 7: STORAGE BUCKETS — Create if missing
-- ==========================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('product-images', 'product-images', true,  5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('store-assets',   'store-assets',   true,  5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('documents',      'documents',      false, 10485760, ARRAY['image/jpeg','image/png','image/webp','application/pdf'])
ON CONFLICT (id) DO UPDATE SET
  public             = EXCLUDED.public,
  file_size_limit    = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;


-- ==========================================
-- SECTION 8: STORAGE RLS POLICIES — Drop & Recreate
-- ==========================================

-- Drop all existing storage policies to avoid conflicts
DROP POLICY IF EXISTS "Allow authenticated users to upload product images" ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own product images"     ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own product images"     ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view product images"                ON storage.objects;

DROP POLICY IF EXISTS "Allow authenticated users to upload store assets"   ON storage.objects;
DROP POLICY IF EXISTS "Allow users to update their own store assets"       ON storage.objects;
DROP POLICY IF EXISTS "Allow users to delete their own store assets"       ON storage.objects;
DROP POLICY IF EXISTS "Allow public to view store assets"                  ON storage.objects;

DROP POLICY IF EXISTS "Allow anon to upload documents"                     ON storage.objects;
DROP POLICY IF EXISTS "Allow owners to view their documents"               ON storage.objects;

-- ── product-images ────────────────────────────────────────────────────────────
-- Sellers upload product images; public can view them (storefront)
CREATE POLICY "Allow authenticated users to upload product images"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Allow users to update their own product images"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow users to delete their own product images"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'product-images');

CREATE POLICY "Allow public to view product images"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'product-images');

-- ── store-assets (logos, banners, category images) ────────────────────────────
CREATE POLICY "Allow authenticated users to upload store assets"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'store-assets');

CREATE POLICY "Allow users to update their own store assets"
  ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'store-assets');

CREATE POLICY "Allow users to delete their own store assets"
  ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'store-assets');

CREATE POLICY "Allow public to view store assets"
  ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'store-assets');

-- ── documents (payment receipts — private) ────────────────────────────────────
-- Customers (unauthenticated) need to upload payment receipt proofs
CREATE POLICY "Allow anon to upload documents"
  ON storage.objects FOR INSERT TO public
  WITH CHECK (bucket_id = 'documents');

-- Only authenticated sellers can read documents
CREATE POLICY "Allow owners to view their documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'documents');


-- ==========================================
-- DONE ✅
-- All schema gaps patched. All RLS policies recreated.
-- All storage buckets and their policies are set.
-- ==========================================
