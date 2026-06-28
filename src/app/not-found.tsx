import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas p-4 md:p-6 lg:p-8 selection:bg-primary/20">
      
      {/* Soft Card Container */}
      <div className="flex flex-col flex-1 relative bg-background border border-border/60 rounded-[32px] md:rounded-[48px] overflow-hidden shadow-sm">
        
        {/* Simple Header */}
        <header className="absolute top-0 inset-x-0 z-50 bg-transparent pointer-events-none">
          <div className="container mx-auto px-6 h-24 flex items-center justify-center md:justify-start">
            <div className="flex items-center gap-2.5">
              <img src="/logo.png" alt="Kozura Logo" className="h-8 w-8 object-contain" />
              <span className="font-semibold text-xl tracking-tight text-foreground">Kozura</span>
            </div>
          </div>
        </header>

        {/* 404 Content Centered */}
        <div className="flex-1 flex flex-col items-center justify-center px-4 text-center relative z-10 animate-in fade-in zoom-in-95 duration-700 ease-out">
          
          {/* Background Huge 404 */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden">
            <span className="text-[clamp(4rem,38vw,14rem)] md:text-[clamp(8rem,32vw,20rem)] lg:text-[clamp(12rem,28vw,25rem)] font-bold text-muted/40 leading-none tracking-tighter select-none">
              404
            </span>
          </div>

          {/* Foreground Content */}
          <div className="relative z-20 flex flex-col items-center mt-8 md:mt-16">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground mb-4">
              Oops! Page not found
            </h1>
            
            <p className="text-muted-foreground text-base md:text-lg max-w-sm mx-auto mb-10 leading-relaxed">
              The page you're looking for doesn't exist or has been moved.
            </p>
            
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-xl shadow-primary/20 h-14 px-8 text-base font-medium transition-all hover:-translate-y-1 duration-300">
              <Link href="/">
                Go back to Homepage
              </Link>
            </Button>
          </div>
          
        </div>
      </div>
    </div>
  );
}
