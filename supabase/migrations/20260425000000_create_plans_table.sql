-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    price_monthly NUMERIC NOT NULL DEFAULT 0,
    order_limit INTEGER NOT NULL DEFAULT 0, -- -1 for unlimited
    product_limit INTEGER NOT NULL DEFAULT 0, -- -1 for unlimited
    features TEXT[] DEFAULT '{}',
    popular BOOLEAN DEFAULT false,
    bg_color TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Allow public read access" ON plans FOR SELECT USING (true);
CREATE POLICY "Allow admin all access" ON plans FOR ALL USING (
    EXISTS (
        SELECT 1 FROM profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'super_admin'
    )
);

-- Seed initial data
INSERT INTO plans (name, description, price_monthly, order_limit, product_limit, features, popular, bg_color)
VALUES 
('Free', 'Perfect to get started', 0, 20, 10, ARRAY['1 store', 'Up to 10 products', 'WhatsApp order alerts', 'Customer order tracking', 'ShopLink subdomain'], false, 'bg-slate-500/10 dark:bg-slate-500/20'),
('Starter', 'For sellers getting serious', 2500, 100, 50, ARRAY['Everything in Free', 'Up to 50 products', 'Custom categories', 'Coupon codes', 'Basic analytics'], true, 'bg-primary/20 ring-2 ring-primary scale-105 z-10'),
('Hustle', 'For fast-growing businesses', 6000, 500, -1, ARRAY['Everything in Starter', 'Unlimited products', 'Priority WhatsApp support', 'Advanced analytics', 'Custom store colors & logo'], false, 'bg-blue-500/10 dark:bg-blue-500/20'),
('Boss', 'For high-volume sellers', 15000, -1, -1, ARRAY['Everything in Hustle', 'Multiple stores', 'Dedicated account manager', 'Early access to new features', 'Custom domain support'], false, 'bg-purple-500/10 dark:bg-purple-500/20')
ON CONFLICT DO NOTHING;
