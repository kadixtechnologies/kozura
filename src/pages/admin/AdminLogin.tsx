import { Link } from "react-router-dom";
import { Store } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function AdminLogin() {
  return (
    <div className="min-h-screen bg-muted/40 flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 rounded-lg">
        <div className="flex flex-col items-center text-center">
          <div className="h-12 w-12 rounded-lg bg-primary text-primary-foreground flex items-center justify-center">
            <Store className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold mt-4">ShopLink Admin</h1>
          <p className="text-sm text-muted-foreground mt-1">Sign in to manage your store</p>
        </div>
        <form className="mt-6 space-y-4">
          <div>
            <Label>Email</Label>
            <Input type="email" placeholder="you@example.com" className="mt-1.5" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" placeholder="••••••••" className="mt-1.5" />
          </div>
          <Button asChild className="w-full" size="lg" type="button">
            <Link to="/admin">Sign In</Link>
          </Button>
          <div className="text-center">
            <a href="#" className="text-sm text-primary hover:underline">Forgot password?</a>
          </div>
        </form>
      </Card>
    </div>
  );
}
