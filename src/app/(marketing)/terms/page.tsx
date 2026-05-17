"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function TermsPage() {
  const [activeTab, setActiveTab] = useState("terms");

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100;
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["terms", "privacy", "policy"];
      let current = "terms";
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120) {
            current = section;
          }
        }
      }
      setActiveTab(current);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-canvas selection:bg-primary/20 scroll-smooth">
      {/* HEADER */}
      <header className="sticky top-0 z-50 bg-canvas/80 backdrop-blur-md border-b border-border/40">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 hover:opacity-90 transition-opacity">
            <img src="/logo.png" alt="Kozura Logo" className="h-9 w-9 object-contain" />
            <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">Kozura</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6">
              <Link href="/#features" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Features</Link>
              <Link href="/#pricing" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Pricing</Link>
              <Link href="/#faq" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">FAQ</Link>
            </nav>
            {/* <Button asChild className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 shadow-sm">
              <Link href="/seller/login">Open account</Link>
            </Button> */}
          </div>
        </div>
      </header>

      {/* HERO / TITLE SECTION */}
      <div className="py-16 md:py-24 px-6 text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
          Terms & conditions
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto mb-12">
          Please read these terms carefully before using our platform.
        </p>

        {/* STICKY TABS */}
        <div className="sticky top-24 z-40 flex items-center justify-center">
          <div className="flex items-center p-1.5 bg-background border border-border/60 rounded-full shadow-sm overflow-x-auto max-w-full">
            {[
              { id: "terms", label: "Terms & Conditions" },
              { id: "privacy", label: "Privacy Policy" },
              { id: "policy", label: "User Policy" }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => scrollToSection(tab.id)}
                className={cn(
                  "px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap",
                  activeTab === tab.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* MAIN CONTENT CONTAINER */}
      <main className="container mx-auto px-4 md:px-6 max-w-4xl pb-24 relative z-10">
        <div className="bg-background rounded-[32px] md:rounded-[48px] border border-border/60 p-8 md:p-16 shadow-sm animate-in fade-in zoom-in-95 duration-700 delay-150 fill-mode-both">
          
          {/* SECTION 1: TERMS & CONDITIONS */}
          <section id="terms" className="scroll-mt-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Terms & conditions</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              Welcome to Kozura. By accessing or using our platform, you agree to be bound by these terms. We provide a digital storefront solution that allows sellers to easily display products and receive orders via WhatsApp.
            </p>

            <h3 className="text-xl font-bold mb-4 text-foreground mt-8">Use of our platform</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Kozura grants you a limited, non-exclusive, non-transferable, and revocable license to use our services for your business. You agree not to reproduce, duplicate, copy, sell, resell, or exploit any portion of the service without express written permission from us.
            </p>

            <h3 className="text-xl font-bold mb-4 text-foreground mt-8">Account responsibilities</h3>
            <p className="text-muted-foreground leading-relaxed mb-12">
              You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. Kozura cannot and will not be liable for any loss or damage from your failure to comply with this security obligation.
            </p>
          </section>

          <div className="w-full h-px bg-border/40 my-12" />

          {/* SECTION 2: PROHIBITED ACTIVITIES */}
          <section id="prohibited" className="mb-12">
            <h3 className="text-xl font-bold mb-4 text-foreground">Prohibited Activities</h3>
            <p className="text-muted-foreground leading-relaxed mb-6">
              When using Kozura, you agree not to engage in any of the following activities:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground marker:text-primary/70">
              <li>Misuse of the platform or distributing malicious code.</li>
              <li>Fraudulent activities, including selling fake or illegal products.</li>
              <li>Violation of applicable local, state, national, or international laws.</li>
              <li>Unauthorized access, interference, or disruption of our servers or networks.</li>
            </ul>
          </section>

          <div className="w-full h-px bg-border/40 my-12" />

          {/* SECTION 3: PRIVACY POLICY */}
          <section id="privacy" className="scroll-mt-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">Privacy policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              Your privacy is extremely important to us. This section explains how we collect, use, and protect your personal data when you interact with the Kozura platform.
            </p>

            <h3 className="text-xl font-bold mb-4 text-foreground mt-8">Data collection & usage</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We collect information that you provide directly to us, such as your name, email address, store name, and WhatsApp number. We use this information solely to provide, maintain, and improve our services, and to communicate with you about your account.
            </p>

            <h3 className="text-xl font-bold mb-4 text-foreground mt-8">Cookies & tracking</h3>
            <p className="text-muted-foreground leading-relaxed mb-4">
              We use cookies and similar tracking technologies to track the activity on our service and hold certain information:
            </p>
            <ul className="list-disc pl-6 space-y-3 text-muted-foreground mb-12 marker:text-primary/70">
              <li><strong>Essential cookies:</strong> Required for core platform functionality.</li>
              <li><strong>Analytics cookies:</strong> Used to understand how users navigate the platform and to improve performance.</li>
              <li><strong>Optional tracking:</strong> Tracking cookies for tailored marketing (which you can opt out of).</li>
            </ul>
          </section>

          <div className="w-full h-px bg-border/40 my-12" />

          {/* SECTION 4: USER POLICY */}
          <section id="policy" className="scroll-mt-32">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-foreground">User policy</h2>
            <p className="text-muted-foreground leading-relaxed mb-8 text-lg">
              This policy outlines the expected behavior for all users on the Kozura platform to ensure a safe and trustworthy environment for both sellers and buyers.
            </p>

            <h3 className="text-xl font-bold mb-4 text-foreground mt-8">User conduct</h3>
            <p className="text-muted-foreground leading-relaxed mb-8">
              All interactions between sellers and buyers must remain professional and respectful. Sellers must accurately represent their products, fulfill orders promptly, and handle customer inquiries with integrity.
            </p>

            <h3 className="text-xl font-bold mb-4 text-foreground mt-8">Account suspension</h3>
            <p className="text-muted-foreground leading-relaxed">
              Kozura reserves the right to suspend or terminate accounts that violate our terms, engage in fraudulent behavior, or receive consistent negative reports from buyers. In the event of a suspension, the seller will be notified via email with details regarding the violation.
            </p>
          </section>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="mx-4 md:mx-6 lg:mx-8 mb-4 md:mb-6 lg:mb-8 rounded-[40px] bg-ink text-ink-foreground pt-16 pb-8 px-8 md:px-16 overflow-hidden relative">
        <div className="container mx-auto max-w-7xl relative z-10">
          
          {/* 1. Branding Area */}
          <div className="flex flex-col items-center md:items-start mb-16">
            <div className="flex items-center gap-3 mb-8">
              <img src="/logo.png" alt="Kozura Logo" className="h-10 w-10 object-contain" />
              <span className="font-semibold text-2xl tracking-tight text-white">Kozura</span>
            </div>
            
            <div className="flex items-center gap-6 text-white/60">
              <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </Link>
              <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </Link>
              <Link href="#" className="hover:text-white hover:scale-110 transition-all duration-300">
                <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </Link>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 mb-16" />

          {/* 2. Navigation Links Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16 text-left">
            {/* Column 1 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Product</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Features</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">How it works</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Pricing</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">FAQ</Link></li>
              </ul>
            </div>
            
            {/* Column 2 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white hover:underline transition-all">About Us</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Careers</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Contact Support</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Partner Program</Link></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Portal</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Seller Login</Link></li>
                <li><Link href="#" className="hover:text-white hover:underline transition-all">Create Store</Link></li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li><Link href="/terms" className="hover:text-white hover:underline transition-all">Terms of Service</Link></li>
                <li><Link href="/terms#privacy" className="hover:text-white hover:underline transition-all">Privacy Policy</Link></li>
                <li><Link href="/terms#policy" className="hover:text-white hover:underline transition-all">User Policy</Link></li>
                <li><Link href="/404" className="hover:text-white hover:underline transition-all">404 Demo</Link></li>
              </ul>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 mb-8" />

          {/* 3. Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
            <p>Copyright © {new Date().getFullYear()} Kozura | Designed for Nigerian Sellers</p>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-white/80">All systems operational</span>
            </div>
          </div>

        </div>
      </footer>
    </div>
  );
}
