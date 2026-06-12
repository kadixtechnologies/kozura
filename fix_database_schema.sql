-- ==============================================================================================
-- KOZURA PLATFORM - DATABASE SCHEMA REPAIR & PERMISSIONS FIX
-- Run this in your Supabase SQL Editor to align your database schema with the codebase.
-- ==============================================================================================

-- 1. Drop existing RLS policies that reference owner_id (so we can rename/recreate cleanly)
DROP POLICY IF EXISTS "Owners can insert stores" ON public.stores;
DROP POLICY IF EXISTS "Owners can update their stores" ON public.stores;
DROP POLICY IF EXISTS "Owners can delete their stores" ON public.stores;
DROP POLICY IF EXISTS "Owners can manage categories" ON public.categories;
DROP POLICY IF EXISTS "Owners can manage products" ON public.products;
DROP POLICY IF EXISTS "Owners can view their orders" ON public.orders;
DROP POLICY IF EXISTS "Owners can update their orders" ON public.orders;
DROP POLICY IF EXISTS "Owners can view their order items" ON public.order_items;

-- 2. Rename owner_id to seller_id in stores table (or add if it doesn't exist)
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'stores' AND column_name = 'owner_id') THEN
    ALTER TABLE public.stores RENAME COLUMN owner_id TO seller_id;
  END IF;
END $$;

-- 3. Add missing columns to stores table
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS category TEXT;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS primary_color TEXT DEFAULT '#16a34a';
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;
ALTER TABLE public.stores ADD COLUMN IF NOT EXISTS subscription_plan TEXT DEFAULT 'free';

-- 4. Recreate RLS policies referencing seller_id
CREATE POLICY "Owners can insert stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = seller_id);
CREATE POLICY "Owners can update their stores" ON public.stores FOR UPDATE USING (auth.uid() = seller_id);
CREATE POLICY "Owners can delete their stores" ON public.stores FOR DELETE USING (auth.uid() = seller_id);

CREATE POLICY "Owners can manage categories" ON public.categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = categories.store_id AND stores.seller_id = auth.uid())
);

CREATE POLICY "Owners can manage products" ON public.products FOR ALL USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = products.store_id AND stores.seller_id = auth.uid())
);

CREATE POLICY "Owners can view their orders" ON public.orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.seller_id = auth.uid())
);

CREATE POLICY "Owners can update their orders" ON public.orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.stores WHERE stores.id = orders.store_id AND stores.seller_id = auth.uid())
);

CREATE POLICY "Owners can view their order items" ON public.order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.orders 
    JOIN public.stores ON orders.store_id = stores.id 
    WHERE orders.id = order_items.order_id AND stores.seller_id = auth.uid()
  )
);

-- 5. Fix permissions on profiles table
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO postgres;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO anon;
