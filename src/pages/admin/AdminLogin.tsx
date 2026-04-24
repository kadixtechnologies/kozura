import { Link } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-canvas grid lg:grid-cols-2">
      {/* Left — promo panel */}
      <div className="hidden lg:flex p-5">
        <div className="flex-1 rounded-[28px] bg-tile-mint p-12 flex flex-col justify-between">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-semibold">S</div>
            <span className="font-semibold tracking-tight">ShopLink</span>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.18em] font-medium text-foreground/60">Sell anywhere</div>
            <h2 className="mt-3 text-4xl font-semibold tracking-tight leading-tight max-w-md">
              Run your storefront like the world's best brands.
            </h2>
            <p className="mt-3 text-sm text-foreground/70 max-w-sm">
              A friendly admin built for small teams who care about details.
            </p>
          </div>
          <div className="flex gap-2">
            <span className="h-1.5 w-6 rounded-full bg-ink" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
            <span className="h-1.5 w-1.5 rounded-full bg-ink/30" />
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex items-center justify-center p-5">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-semibold">S</div>
            <span className="font-semibold tracking-tight">ShopLink</span>
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">Welcome back</h1>
          <p className="text-sm text-muted-foreground mt-1.5">Sign in to manage your store</p>

          <form className="mt-8 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Email</Label>
              <Input type="email" placeholder="you@example.com" className="mt-1.5 rounded-xl h-11" />
            </div>
            <div>
              <div className="flex items-center justify-between">
                <Label className="text-xs text-muted-foreground">Password</Label>
                <a href="#" className="text-xs text-foreground hover:underline">Forgot?</a>
              </div>
              <Input type="password" placeholder="••••••••" className="mt-1.5 rounded-xl h-11" />
            </div>
            <Button asChild className="w-full" size="lg" type="button">
              <Link to="/admin">Sign in</Link>
            </Button>
          </form>

          <p className="mt-6 text-xs text-muted-foreground text-center">
            New to ShopLink? <a href="#" className="text-foreground font-medium hover:underline">Create an account</a>
          </p>
        </div>
      </div>
    </div>
  );
}
