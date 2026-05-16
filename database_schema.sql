-- ==============================================================================================
-- KOZURA PLATFORM - FULL DATABASE SCHEMA
-- This file contains all table definitions, enums, and required schema to recreate the database.
-- You can copy and paste this into the Supabase SQL Editor.
-- ==============================================================================================

-- ==========================================
-- 0. CUSTOM ENUMS & EXTENSIONS
-- ==========================================
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Define order status enum
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'order_status') THEN
    CREATE TYPE order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'returned', 'cancelled');
  END IF;
END $$;


-- ==========================================
-- 1. PROFILES (Users)
-- Stores user data linked to Supabase Auth
-- ==========================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    role TEXT DEFAULT 'seller' CHECK (role IN ('seller', 'super_admin')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 2. PLANS (Subscriptions)
-- Subscription tiers available for sellers
-- ==========================================
CREATE TABLE IF NOT EXISTS public.plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_monthly NUMERIC NOT NULL DEFAULT 0,
    order_limit INTEGER NOT NULL DEFAULT 0, -- -1 for unlimited
    product_limit INTEGER NOT NULL DEFAULT 0, -- -1 for unlimited
    category_limit INTEGER NOT NULL DEFAULT -1, -- -1 for unlimited
    image_limit INTEGER NOT NULL DEFAULT 5,
    features TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT false,
    bg_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Seed Initial Plans
INSERT INTO plans (name, description, price_monthly, order_limit, product_limit, category_limit, image_limit, features, popular, bg_color)
VALUES 
('Free', 'Perfect to get started', 0, 5, 5, 2, 1, ARRAY['Up to 5 orders/mo', 'Up to 5 products', 'Up to 2 categories', '1 image per product', 'WhatsApp order alerts', 'Kozura subdomain'], false, 'bg-slate-500/10 dark:bg-slate-500/20'),
('Starter', 'For sellers getting serious', 2500, 80, 50, 10, 3, ARRAY['Up to 80 orders/mo', 'Up to 50 products', 'Up to 10 categories', '3 images per product', 'Custom categories', 'Basic analytics'], true, 'bg-primary/20 ring-2 ring-primary scale-105 z-10'),
('Hustle', 'For fast-growing businesses', 6500, 200, 100, 25, 5, ARRAY['Up to 200 orders/mo', 'Up to 100 products', 'Up to 25 categories', '5 images per product', 'Priority WhatsApp support', 'Advanced analytics'], false, 'bg-blue-500/10 dark:bg-blue-500/20'),
('Boss', 'For high-volume sellers', 15000, -1, -1, -1, 8, ARRAY['Unlimited orders/mo', 'Unlimited products', 'Unlimited categories', '8 images per product', 'Multiple stores', 'Dedicated account manager'], false, 'bg-purple-500/10 dark:bg-purple-500/20')
ON CONFLICT DO NOTHING;


-- ==========================================
-- 3. STORES (Seller storefronts)
-- Stores configuration, branding, & settings
-- ==========================================
CREATE TABLE IF NOT EXISTS public.stores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    currency TEXT DEFAULT 'NGN',
    whatsapp_number TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    logo_url TEXT,
    cover_url TEXT,
    delivery_zones JSONB DEFAULT '[]'::jsonb,
    
    -- Banking Details
    bank_name TEXT,
    account_number TEXT,
    account_name TEXT,
    
    -- Subscription Tracking
    plan_id UUID REFERENCES public.plans(id),
    plan_status TEXT DEFAULT 'inactive',
    subscription_code TEXT,
    next_billing_date TIMESTAMP WITH TIME ZONE,
    grace_period_ends TIMESTAMP WITH TIME ZONE,
    
    -- Social Media Configurations
    social_facebook TEXT,
    social_instagram TEXT,
    social_tiktok TEXT,
    social_facebook_enabled BOOLEAN DEFAULT false,
    social_instagram_enabled BOOLEAN DEFAULT false,
    social_tiktok_enabled BOOLEAN DEFAULT false,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_stores_slug ON public.stores(slug);
CREATE INDEX IF NOT EXISTS idx_stores_owner_id ON public.stores(owner_id);


-- ==========================================
-- 4. CATEGORIES (Product grouping)
-- Custom categories created by sellers
-- ==========================================
CREATE TABLE IF NOT EXISTS public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(store_id, slug)
);


-- ==========================================
-- 5. PRODUCTS (Items for sale)
-- Product details, stock, pricing, variants
-- ==========================================
CREATE TABLE IF NOT EXISTS public.products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    price NUMERIC NOT NULL DEFAULT 0,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    images JSONB DEFAULT '[]'::jsonb,
    variants JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(store_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_products_store_id ON public.products(store_id);


-- ==========================================
-- 6. ORDERS (Customer Purchases)
-- Order tracking, shipping, and totals
-- ==========================================
CREATE TABLE IF NOT EXISTS public.orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    order_number TEXT NOT NULL UNIQUE,
    
    -- Customer Info
    customer_name TEXT NOT NULL,
    customer_email TEXT NOT NULL,
    customer_phone TEXT,
    
    -- Shipping Info
    shipping_address TEXT,
    shipping_city TEXT,
    shipping_state TEXT,
    
    -- Pricing
    subtotal_amount NUMERIC NOT NULL DEFAULT 0,
    shipping_fee NUMERIC NOT NULL DEFAULT 0,
    total_amount NUMERIC NOT NULL DEFAULT 0,
    
    -- Status & Payment
    status order_status DEFAULT 'pending',
    payment_method TEXT,
    payment_status TEXT DEFAULT 'pending',
    payment_receipt_url TEXT,
    
    -- Timeline / Admin Notes
    notes JSONB DEFAULT '[]'::jsonb,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_orders_store_id ON public.orders(store_id);


-- ==========================================
-- 7. ORDER ITEMS (Products within an Order)
-- Snapshot of product state at time of purchase
-- ==========================================
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
    
    product_name TEXT NOT NULL,
    variant_label TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC NOT NULL DEFAULT 0,
    total_price NUMERIC NOT NULL DEFAULT 0,
    image TEXT, -- Snapshot of the image used at time of order
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);


-- ==========================================
-- 8. WAITLIST (Pre-launch Signups)
-- Stores emails and names of interested users
-- ==========================================
CREATE TABLE IF NOT EXISTS public.waitlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ==========================================
-- 9. ROW LEVEL SECURITY (RLS) POLICIES
-- Security definitions for client access
-- ==========================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read and update their own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Plans: Publicly readable
CREATE POLICY "Plans are publicly readable" ON plans FOR SELECT USING (true);

-- Stores: Publicly readable, owners can update
CREATE POLICY "Stores are publicly readable" ON stores FOR SELECT USING (true);
CREATE POLICY "Owners can insert stores" ON stores FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Owners can update their stores" ON stores FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Owners can delete their stores" ON stores FOR DELETE USING (auth.uid() = owner_id);

-- Categories: Publicly readable, owners can manage
CREATE POLICY "Categories are publicly readable" ON categories FOR SELECT USING (true);
CREATE POLICY "Owners can manage categories" ON categories FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = categories.store_id AND stores.owner_id = auth.uid())
);

-- Products: Publicly readable, owners can manage
CREATE POLICY "Products are publicly readable" ON products FOR SELECT USING (true);
CREATE POLICY "Owners can manage products" ON products FOR ALL USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = products.store_id AND stores.owner_id = auth.uid())
);

-- Orders: Publicly insertable, owners can view and manage their store's orders
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view their orders" ON orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
);
CREATE POLICY "Owners can update their orders" ON orders FOR UPDATE USING (
  EXISTS (SELECT 1 FROM stores WHERE stores.id = orders.store_id AND stores.owner_id = auth.uid())
);

-- Order Items: Publicly insertable, owners can view
CREATE POLICY "Anyone can insert order items" ON order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Owners can view their order items" ON order_items FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM orders 
    JOIN stores ON orders.store_id = stores.id 
    WHERE orders.id = order_items.order_id AND stores.owner_id = auth.uid()
  )
);

-- Waitlist: Publicly insertable, read-only via service role
CREATE POLICY "Anyone can join waitlist" ON waitlist FOR INSERT WITH CHECK (true);
