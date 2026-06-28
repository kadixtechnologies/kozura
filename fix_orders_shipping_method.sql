-- Run this snippet in your Supabase SQL Editor to fix the orders table schema.

ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS shipping_method TEXT DEFAULT 'delivery';
