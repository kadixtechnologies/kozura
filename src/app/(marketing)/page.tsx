"use client";
import Link from "next/link";
import { WaitlistForm } from "@/components/marketing/WaitlistForm";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function WaitlistLandingPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    
    const checkRedirect = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        // Fetch user profile role
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", session.user.id)
          .single();

        if (profile?.role === "super_admin") {
          router.push("/hq");
        } else {
          // Check if store exists
          const { data: store } = await supabase
            .from("stores")
            .select("id")
            .eq("seller_id", session.user.id)
            .single();

          if (store) {
            router.push("/seller/dashboard");
          } else {
            router.push("/seller/onboarding");
          }
        }
      }
    };

    checkRedirect();
  }, [router]);

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 scroll-smooth overflow-x-hidden">
      <main>
        {/* HERO CONTAINER CARD */}
        <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8 min-h-[90vh] flex flex-col">
          <section className="relative mx-auto max-w-[1400px] w-full flex-1 bg-canvas border border-border/60 rounded-[32px] md:rounded-[48px] px-4 md:px-10 pb-20 md:pb-32 shadow-sm flex flex-col">
            {/* Subtle Background Layering */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none rounded-[32px] md:rounded-[48px] overflow-hidden" />

            {/* SECTION 1 — IN-CARD NAVBAR */}
            <header className="relative z-50 flex items-center justify-between pt-6 md:pt-8 mb-16 md:mb-24">
              {/* Side 1: Logo */}
              <div className="flex items-center gap-2.5">
                <img src="/logo.png" alt="Kozura Logo" className="h-10 w-10 object-contain" />
                <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
                  Kozura
                </span>
              </div>
            </header>

            {/* HERO CONTENT */}
            <div className="container mx-auto max-w-6xl relative z-10 flex-1 flex flex-col justify-center">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                {/* Left Column: Text Content */}
                <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0 relative z-50">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium mb-6 shadow-sm text-foreground">
                    Something Big is Coming
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-foreground leading-[1.05] mb-6">
                    Your Business Deserves <br className="hidden md:block" />
                    <span className="text-primary">a Real Store</span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground mb-5 leading-relaxed lg:max-w-[90%]">
                    Stop posting on your WhatsApp Status everyday. Kozura gives you a
                    professional storefront, linked directly to your WhatsApp. 
                    <br /><br />
                    <b>Join the waitlist to get early access.</b>
                  </p>

                  <div className="w-full mt-1 relative z-[100] flex justify-center lg:justify-start">
                    <WaitlistForm />
                  </div>
                </div>

                {/* Right Column: Visual Element */}
                <div className="flex-1 w-full flex items-center justify-center lg:justify-end mt-20 lg:mt-0">
                  <div className="relative w-full max-w-[900px] flex items-center justify-center lg:justify-end">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/25 blur-[150px] rounded-full pointer-events-none" />
                    <div className="relative w-full h-full overflow-hidden [mask-image:radial-gradient(circle_at_center,black_40%,transparent_100%)]">
                      <img
                        src="/hero_image.png"
                        alt="Store Dashboard Interface"
                        className="w-full h-full object-contain relative z-10 scale-125 lg:scale-150 transition-transform duration-1000 hover:scale-130 lg:hover:scale-155"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* MINIMAL FOOTER */}
      <footer className="mx-4 md:mx-6 lg:mx-8 mb-4 md:mb-6 lg:mb-8 rounded-[40px] bg-ink text-ink-foreground py-12 px-8 md:px-16 overflow-hidden relative">
        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <img src="/logo.png" alt="Kozura Logo" className="h-8 w-8 object-contain opacity-80" />
            <span className="font-semibold text-xl tracking-tight text-white/80">
              Kozura
            </span>
          </div>
          <div>
            <Link href="/terms#privacy" className="text-sm text-white/50 hover:text-white/80 hover:underline transition-colors">
              Privacy Policy
            </Link>
          </div>
        </div>

        <div className="w-full h-px bg-white/10 mb-8" />

        {/* 3. Bottom Bar */}
        <div className="container mx-auto max-w-7xl relative z-10 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
          <p>
            Copyright © {new Date().getFullYear()} Kozura | Designed for
            Nigerian Sellers
          </p>
          <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="font-medium text-white/80">
              All systems operational
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
