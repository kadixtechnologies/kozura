
# ShopLink — Visual UI Shell

**Framework note:** Built on the existing Vite + React + React Router stack (Next.js isn't available here). All 12 pages, components, mock data, and the design system stay identical — only routing syntax changes (`useParams`, `<Link>`, nested routes instead of App Router folders).

## Design System
- Primary: emerald `#16a34a` wired into `index.css` HSL tokens + Tailwind `primary`
- White surfaces, 1px subtle gray borders, `rounded-xl`, `shadow-sm`, generous whitespace
- Geist Sans loaded via `@fontsource/geist-sans` (closest equivalent to Next.js default)
- StatusBadge color map: Pending=yellow, Shipped/Active=green, Cancelled=red, Inactive=gray

## Routes (React Router)
**Storefront**
- `/:storeSlug` — Homepage (navbar, hero, category pills, 8-product grid)
- `/:storeSlug/p/:productSlug` — Product detail (gallery, variants, qty, accordion, similar)
- `/:storeSlug/cart` — Cart page + global slide-out CartDrawer (Sheet)
- `/:storeSlug/checkout` — Two-column checkout with sticky order summary
- `/:storeSlug/order/:token` — Order tracking with vertical timeline

**Admin**
- `/admin/login` — Centered card login
- `/admin` — Dashboard (4 StatCards + recent orders table)
- `/admin/products`, `/admin/products/new`, `/admin/products/:id/edit`
- `/admin/orders`, `/admin/orders/:id`
- `/admin/categories`, `/admin/settings` (tabs: General/Shipping/Payments/SEO)

Default redirect `/` → `/cruz-gadgets`. Admin pages share an `AdminLayout` with fixed 240px sidebar.

## Reusable Components (`src/components/`)
StoreNavbar, ProductCard, CartDrawer, CartItem, OrderSummaryCard, AdminSidebar, StatCard, StatusBadge, OrderTimeline, ImageUploader, VariantBuilder — all using Shadcn primitives already in the project.

## Mock Data (`src/lib/mock-data.ts`)
- `store`: Cruz Gadgets, slug `cruz-gadgets`, NGN, WhatsApp `+2348012345678`
- `products[8]`: Galaxy S24 Ultra, iPhone 15 Pro, MacBook Air M2, AirPods Pro, Samsung Tab S9, Xiaomi Redmi Note 13, JBL Speaker, USB-C Hub — each with brand, category, NGN price, Color + Storage variants, isActive
- `orders[8]`: order#, customer, items count, total, status, date, payment method
- `categories`: All, Phones, Laptops, Accessories, Audio
- `cartItems[3]` for the drawer

## Behavior
- CartDrawer toggled by `useState` from cart icon in StoreNavbar
- Variant pills, quantity steppers, checkout radios, settings toggles all use local `useState` only
- Checkout "Delivery Address" section conditionally renders when Delivery radio selected
- All forms are visual — no submit handlers, no fetching, no auth
- Fully responsive (2-col products on mobile → 4-col desktop; admin sidebar collapses on mobile via Sheet)

After approval I'll scaffold the routes, mock data, shared components, then build all 12 pages.
