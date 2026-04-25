import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, SearchX } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas font-sans selection:bg-primary/20">
      <header className="absolute top-0 inset-x-0 z-50 bg-transparent">
        <div className="container mx-auto px-6 h-24 flex items-center">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <div className="h-8 w-8 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-sm font-bold shadow-sm">
              S
            </div>
            <span className="font-semibold text-xl tracking-tight text-foreground">ShopLink</span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 text-center animate-in fade-in zoom-in-95 duration-700 ease-out">
        <div className="relative mb-8 mt-12">
          <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full" />
          <div className="h-24 w-24 rounded-3xl bg-background border border-border/60 shadow-xl flex items-center justify-center relative z-10 mx-auto">
            <SearchX className="h-10 w-10 text-muted-foreground" />
          </div>
        </div>
        
        <h1 className="text-7xl md:text-9xl font-bold tracking-tighter text-foreground mb-4">
          4<span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-emerald-400">0</span>4
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground mb-4">
          Oops! Page not found
        </h2>
        
        <p className="text-muted-foreground text-lg max-w-md mx-auto mb-10 leading-relaxed">
          The page you're looking for doesn't exist, has been removed, or is temporarily unavailable.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-center w-full sm:w-auto">
          <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 h-14 px-8 text-base transition-all hover:scale-105 duration-300 w-full sm:w-auto">
            <Link href="/">
              <ArrowLeft className="mr-2 h-5 w-5" /> Back to Home
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full bg-background border-border shadow-sm hover:bg-muted h-14 px-8 text-base transition-all w-full sm:w-auto">
            <Link href="/seller/login">Go to Dashboard</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
