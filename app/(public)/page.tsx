"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Calendar,
  Users,
  ShoppingBag,
  MessageCircle,
  Package,
  Truck,
  Activity,
  CreditCard,
  CheckCircle2,
  Store,
  Banknote,
  Zap,
  PenLine,
  Camera,
  Rocket,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import Pricing from "@/components/shadcn-space/radix/blocks/pricing-01/pricing";
import { cn } from "@/lib/utils";

const howStepsData = [
  {
    step_number: "01",
    step_icon: PenLine,
    step_title: "Create your account",
    step_description:
      "Sign up free. Tell us your store name, what you sell, and your WhatsApp number. Takes less than 5 minutes.",
  },
  {
    step_number: "02",
    step_icon: Camera,
    step_title: "Add your products",
    step_description:
      "Upload your product photos, set your prices, add variants. Your storefront updates instantly — no developer needed.",
  },
  {
    step_number: "03",
    step_icon: Rocket,
    step_title: "Share and start selling",
    step_description:
      "Copy your store link and share it everywhere. When a customer orders, you get a WhatsApp message immediately.",
  },
];

const faqGroupsData = [
  {
    title: "Getting in touch",
    icon: MessageCircle,
    questions: [
      {
        q: "What are your business hours?",
        a: "Our support team is available from 9 AM to 6 PM (WAT), Monday to Friday. However, your store remains live and processes orders 24/7.",
      },
      {
        q: "Can I visit your office in person? Do I need an appointment?",
        a: "Currently, we operate as a fully remote team to serve sellers all across Nigeria faster. The best way to reach us is via WhatsApp or email.",
      },
    ],
  },
  {
    title: "Booking a chat",
    icon: Calendar,
    questions: [
      {
        q: "How can I schedule a demo?",
        a: "You can book a direct chat with our sales team via our WhatsApp support line or by filling out the contact form.",
      },
      {
        q: "Is the onboarding call free?",
        a: "Yes! If you need help setting up your store, our team provides a free 15-minute onboarding call for all new sellers.",
      },
    ],
  },
  {
    title: "Working together",
    icon: Users,
    questions: [
      {
        q: "Do you offer custom integrations for large businesses?",
        a: "Yes, we offer custom enterprise plans that include custom domain setup, API integrations, and dedicated account management.",
      },
      {
        q: "Can I migrate my existing store to ShopLink?",
        a: "Absolutely. Our support team can help you migrate your product catalog from other platforms seamlessly.",
      },
    ],
  },
];

function FaqGroup({
  group,
  isOpen,
  onToggle,
}: {
  group: any;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex flex-col border border-border/40 rounded-[24px] overflow-hidden transition-all duration-300 bg-background">
      {/* Group Header */}
      <button
        onClick={onToggle}
        className={cn(
          "flex items-center justify-between p-4 md:p-6 w-full text-left transition-colors",
          isOpen ? "bg-muted/30" : "bg-muted/10 hover:bg-muted/20",
        )}
      >
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
            <group.icon className="h-5 w-5" />
          </div>
          <span className="font-bold text-lg text-foreground">
            {group.title}
          </span>
        </div>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-muted-foreground transition-transform duration-300",
            isOpen && "rotate-180",
          )}
        />
      </button>

      {/* Group Content */}
      <div
        className={cn(
          "grid transition-all duration-300 ease-in-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="overflow-hidden">
          <div className="p-4 md:p-6 flex flex-col pt-0">
            <Accordion type="single" collapsible className="w-full">
              {group.questions.map((item: any, qIndex: number) => (
                <AccordionItem
                  key={qIndex}
                  value={`item-${qIndex}`}
                  className="border-b-border/60 last:border-0"
                >
                  <AccordionTrigger className="text-left font-bold text-base hover:text-primary transition-colors py-4">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [openFaqGroup, setOpenFaqGroup] = useState<number>(0);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const testimonials = [
    {
      quote:
        "I love how simple it is to move my offline business online. The dashboard feels modern, and everything works without delays.",
      initials: "AO",
      name: "Amaka O.",
      handle: "@amakafashion",
    },
    {
      quote:
        "ShopLink transformed how I handle orders. I used to rely entirely on Instagram DMs, but now my customers just check out via my link.",
      initials: "EJ",
      name: "Emeka J.",
      handle: "@cruzgadgets",
    },
    {
      quote:
        "The WhatsApp order alerts are a game changer. I get notified immediately when someone pays, making fulfillment so much faster.",
      initials: "FA",
      name: "Fatima A.",
      handle: "@fati_treats",
    },
  ];

  const nextTestimonial = () =>
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  const prevTestimonial = () =>
    setCurrentTestimonial(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );

  return (
    <div className="min-h-screen bg-background selection:bg-primary/20 scroll-smooth">
      <main>
        {/* HERO CONTAINER CARD */}
        <div className="p-4 md:p-6 lg:p-8 pt-6 md:pt-8">
          <section className="relative mx-auto max-w-[1400px] bg-canvas border border-border/60 rounded-[32px] md:rounded-[48px] overflow-hidden px-4 md:px-10 pb-20 md:pb-32 shadow-sm">
            {/* Subtle Background Layering */}
            <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />

            {/* SECTION 1 — IN-CARD NAVBAR */}
            <header className="relative z-50 flex items-center justify-between pt-6 md:pt-8 mb-16 md:mb-24">
              {/* Side 1: Logo */}
              <div className="flex items-center gap-2.5">
                <div className="h-10 w-10 rounded-xl bg-ink text-ink-foreground flex items-center justify-center text-lg font-bold shadow-sm">
                  S
                </div>
                <span className="font-bold text-xl tracking-tight text-foreground hidden sm:block">
                  ShopLink
                </span>
              </div>

              {/* Side 2: Nav Links & Button combined */}
              <div className="flex items-center bg-background/80 backdrop-blur-xl border border-border/60 p-1.5 rounded-full shadow-sm">
                <nav className="hidden md:flex items-center gap-6 px-5">
                  <Link
                    href="#features"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Features
                  </Link>
                  <Link
                    href="#how-it-works"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    How It Works
                  </Link>
                  <Link
                    href="#pricing"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Pricing
                  </Link>
                  <Link
                    href="#faq"
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    FAQ
                  </Link>
                </nav>

                <Button
                  asChild
                  className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6 font-medium shadow-sm h-10 md:h-11"
                >
                  <Link href="/seller/login">Open account</Link>
                </Button>
              </div>
            </header>

            {/* HERO CONTENT */}
            <div className="container mx-auto max-w-6xl relative z-10">
              <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">
                {/* Left Column: Text Content */}
                <div className="flex-1 text-center lg:text-left flex flex-col items-center lg:items-start max-w-2xl mx-auto lg:mx-0">
                  <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-background border border-border text-sm font-medium mb-6 shadow-sm text-foreground">
                    Built for Nigerian Sellers
                  </div>

                  <h1 className="text-5xl md:text-6xl lg:text-[72px] font-bold tracking-tight text-foreground leading-[1.05] mb-6">
                    Your Business Deserves <br className="hidden md:block" />
                    <span className="text-primary">a Real Store</span>
                  </h1>

                  <p className="text-lg md:text-xl text-muted-foreground mb-10 leading-relaxed lg:max-w-[90%]">
                    Stop sending price lists on WhatsApp. ShopLink gives you a
                    professional storefront, linked directly to your WhatsApp —
                    set up in minutes, not months.
                  </p>

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
                    <Button
                      asChild
                      size="lg"
                      className="h-14 px-8 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm w-full sm:w-auto"
                    >
                      <Link href="/seller/login">
                        Open account <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button
                      asChild
                      size="lg"
                      variant="outline"
                      className="h-14 px-8 text-base rounded-full bg-background hover:bg-muted transition-all border-border text-foreground w-full sm:w-auto"
                    >
                      <Link href="/cruz-gadgets">See a Live Store</Link>
                    </Button>
                  </div>

                  <div className="mt-8 flex items-center gap-2 text-sm text-muted-foreground font-medium">
                    <span className="text-yellow-400 text-lg">⭐</span> Trusted
                    by 500+ Nigerian sellers
                  </div>
                </div>

                {/* Right Column: Visual Element */}
                <div className="flex-1 w-full flex items-center justify-center lg:justify-end">
                  <div className="relative w-full max-w-[500px] aspect-[4/5] lg:aspect-square flex items-center justify-center">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />
                    <img
                      src="/hero_store_ui.png"
                      alt="Store Dashboard Interface"
                      className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* SECTION 3 — SOCIAL PROOF BAR */}
        <section className="py-24 px-6 bg-canvas">
          <div className="container mx-auto max-w-6xl">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground">
                Sellers across Nigeria are already winning
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Card 1 */}
              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-background border border-border/60 hover:scale-[1.02] transition-transform duration-300">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Store className="h-7 w-7" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  500+
                </div>
                <div className="text-base text-muted-foreground font-medium">
                  Active Stores
                </div>
              </div>

              {/* Card 2 */}
              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-background border border-border/60 hover:scale-[1.02] transition-transform duration-300">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Package className="h-7 w-7" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  12,000+
                </div>
                <div className="text-base text-muted-foreground font-medium">
                  Orders Processed
                </div>
              </div>

              {/* Card 3 */}
              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-background border border-border/60 hover:scale-[1.02] transition-transform duration-300">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Banknote className="h-7 w-7" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  ₦180M+
                </div>
                <div className="text-base text-muted-foreground font-medium">
                  in Sales Generated
                </div>
              </div>

              {/* Card 4 */}
              <div className="flex flex-col items-center text-center p-8 rounded-[32px] bg-background border border-border/60 hover:scale-[1.02] transition-transform duration-300">
                <div className="h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-6">
                  <Zap className="h-7 w-7" />
                </div>
                <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                  5 Mins
                </div>
                <div className="text-base text-muted-foreground font-medium">
                  Average Setup Time
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 — FEATURES */}
        <section id="features" className="py-24 px-6 bg-canvas">
          <div className="container mx-auto max-w-6xl">
            {/* Header Layout: Left heading, Right CTA */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1]">
                  Everything you need to sell online
                </h2>
              </div>
              <Button
                asChild
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 w-fit shrink-0 font-medium"
              >
                <Link href="/seller/login">Open account</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: ShoppingBag,
                  title: "Your Own Storefront",
                  desc: "Get a clean, professional store page with your brand name, logo, and colors. Share the link anywhere — Instagram, Twitter, WhatsApp.",
                },
                {
                  icon: MessageCircle,
                  title: "WhatsApp Order Alerts",
                  desc: "Every order goes straight to your WhatsApp. No missed sales, no checking dashboards — just a message with the full order details.",
                },
                {
                  icon: Package,
                  title: "Easy Product Management",
                  desc: "Add products, set prices, upload photos, and manage variants like color and size — all from one simple dashboard.",
                },
                {
                  icon: Truck,
                  title: "Flexible Shipping Options",
                  desc: "Offer pickup, fixed delivery fees, or free delivery above a certain order amount. You set the rules.",
                },
                {
                  icon: Activity,
                  title: "Order Tracking for Customers",
                  desc: "Give every customer a unique tracking link so they can follow their order — reducing 'where is my order?' messages.",
                },
                {
                  icon: CreditCard,
                  title: "Multiple Payment Methods",
                  desc: "Accept cash on delivery, bank transfer, or any payment method that works for your business.",
                },
              ].map((feat, i) => (
                <div
                  key={i}
                  className="flex flex-col p-8 rounded-[32px] bg-background border border-border/60"
                >
                  <div className="flex items-start justify-between mb-16">
                    <feat.icon
                      className="h-8 w-8 text-primary"
                      strokeWidth={2}
                    />
                    <button className="h-10 w-10 rounded-full bg-canvas flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors shrink-0">
                      <ArrowUpRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-auto">
                    <h3 className="text-xl font-bold mb-3 text-foreground">
                      {feat.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {feat.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 5 — HOW IT WORKS */}
        <section
          id="how-it-works"
          className="py-24 px-4 md:px-6 bg-canvas border-y border-border/60"
        >
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <span className="text-primary font-bold tracking-wider text-sm uppercase mb-4 block">
                How it works
              </span>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Your store, live in 3 steps
              </h2>
              <p className="text-lg text-muted-foreground">
                Seriously. Three steps.
              </p>
            </div>

            <div className="flex flex-col relative">
              {/* Vertical Connector Line (Desktop) */}
              <div className="hidden md:block absolute left-[63px] top-12 bottom-12 w-[2px] bg-border/50 z-0" />

              {howStepsData.map((step, i) => (
                <div
                  key={i}
                  className="group flex flex-col md:flex-row gap-6 md:gap-8 bg-background p-6 md:p-8 rounded-[32px] border border-border/60 mb-6 last:mb-0 transition-all duration-300 relative z-10"
                >
                  {/* Left Icon Area */}
                  <div className="flex items-start shrink-0">
                    <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary relative overflow-hidden group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300 shadow-sm border border-primary/10">
                      <step.step_icon className="h-8 w-8" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border/50">
                        Step {step.step_number}
                      </span>
                      <h3 className="text-2xl font-bold text-foreground">
                        {step.step_title}
                      </h3>
                    </div>
                    <p className="text-muted-foreground leading-relaxed text-base md:text-lg">
                      {step.step_description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 6 — PRICING */}
        <Pricing />

        {/* SECTION 7 — TESTIMONIALS */}
        <section className="py-24 px-6 bg-canvas border-y border-border/60">
          <div className="container mx-auto max-w-6xl">
            {/* Header Layout */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
              <div className="max-w-xl">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-[1.1] mb-4">
                  What our customers think
                </h2>
                <p className="text-lg text-muted-foreground">
                  Thousands of Nigerian sellers trust ShopLink to run their
                  online stores effortlessly.
                </p>
              </div>
              <Button
                asChild
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-8 h-12 w-fit shrink-0 font-medium"
              >
                <Link href="/seller/login">Open account</Link>
              </Button>
            </div>

            {/* Main Content Layout */}
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-6">
              {/* Left Column: Testimonial Card */}
              <div className="p-8 md:p-12 rounded-[32px] bg-background border border-border/60 flex flex-col justify-between">
                <div className="flex items-center justify-between mb-16">
                  <span className="text-sm font-medium text-muted-foreground">
                    Customer stories
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={prevTestimonial}
                      className="h-10 w-10 rounded-full bg-canvas flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={nextTestimonial}
                      className="h-10 w-10 rounded-full bg-ink flex items-center justify-center text-ink-foreground hover:bg-ink/90 transition-colors"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div
                  className="animate-in fade-in slide-in-from-right-4 duration-500"
                  key={currentTestimonial}
                >
                  <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold leading-snug mb-10 text-foreground">
                    "{testimonials[currentTestimonial].quote}"
                  </h3>

                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary flex items-center justify-center font-bold text-lg text-primary-foreground">
                      {testimonials[currentTestimonial].initials}
                    </div>
                    <div>
                      <div className="font-bold text-foreground">
                        {testimonials[currentTestimonial].name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {testimonials[currentTestimonial].handle}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Stats Card */}
              <div className="p-8 md:p-12 rounded-[32px] bg-primary text-primary-foreground flex flex-col justify-between">
                <span className="text-sm font-medium text-primary-foreground/80 mb-16">
                  Facts & numbers
                </span>

                <div>
                  <div className="text-7xl md:text-8xl lg:text-[100px] font-bold mb-4 tracking-tighter leading-none">
                    99%
                  </div>
                  <div className="text-xl md:text-2xl font-medium text-primary-foreground/90 leading-tight max-w-sm">
                    of customers recommended ShopLink to other sellers
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 8 — FAQ */}
        <section id="faq" className="py-24 px-4 md:px-6 bg-canvas">
          <div className="container mx-auto max-w-3xl">
            {/* Header */}
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
                Have questions?
              </h2>
              <p className="text-lg text-muted-foreground">
                Everything you need to know about setting up and running your
                online business.
              </p>
            </div>

            {/* FAQ Container */}
            <div className="bg-background rounded-[32px] p-4 md:p-8 border border-border/60 shadow-sm flex flex-col gap-4">
              {/* Grouped Accordions */}
              {faqGroupsData.map((group, groupIndex) => (
                <FaqGroup
                  key={groupIndex}
                  group={group}
                  isOpen={openFaqGroup === groupIndex}
                  onToggle={() =>
                    setOpenFaqGroup(
                      openFaqGroup === groupIndex ? -1 : groupIndex,
                    )
                  }
                />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 9 — FINAL CTA */}
        <section className="py-24 px-4 md:px-6">
          <div className="container mx-auto max-w-6xl">
            <div className="bg-ink text-ink-foreground rounded-[40px] overflow-hidden flex flex-col lg:flex-row relative shadow-2xl border border-white/10 group">
              {/* Left Side: Programmatic 3D Glass/Wave Visualization */}
              <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-ink to-background/50">
                {/* Dynamic Ambient Light */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] bg-primary/20 blur-[120px] rounded-full pointer-events-none transition-opacity duration-700 group-hover:opacity-70" />

                {/* CSS Glass Rings Sequence */}
                <div className="relative z-10 flex items-center justify-center translate-x-[-15%] lg:translate-x-[-20%] group-hover:translate-x-[-10%] transition-transform duration-1000 ease-out">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute rounded-full border border-white/20 bg-white/5 backdrop-blur-md shadow-2xl transition-all duration-700 ease-in-out hover:scale-105"
                      style={{
                        width: `${240 + i * 20}px`,
                        height: `${240 + i * 20}px`,
                        transform: `translateX(${i * 45}px) scaleX(0.4) rotateY(15deg)`,
                        opacity: 1 - i * 0.12,
                        zIndex: 10 - i,
                        boxShadow:
                          "inset 20px 0 40px rgba(255,255,255,0.05), inset -10px 0 20px rgba(0,0,0,0.5)",
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* Right Side: Content & Action */}
              <div className="lg:w-1/2 p-10 md:p-16 flex flex-col justify-center relative z-20">
                <h2 className="text-4xl md:text-5xl lg:text-[56px] font-bold tracking-tight mb-6 leading-[1.1]">
                  Ready to take your <br /> business online?
                </h2>

                <p className="text-lg md:text-xl text-ink-foreground/80 mb-10 leading-relaxed max-w-md">
                  Join hundreds of Nigerian sellers already using ShopLink to
                  sell smarter. Setup takes 5 minutes.
                </p>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 transition-all duration-300 shadow-xl shadow-primary/20"
                  >
                    <Link href="/seller/login">Create Your Free Store</Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto h-14 px-8 text-base rounded-full bg-transparent border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-all duration-300"
                  >
                    <Link href="#">Talk to us on WhatsApp</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* SECTION 10 — FOOTER */}
      <footer className="mx-4 md:mx-6 lg:mx-8 mb-4 md:mb-6 lg:mb-8 rounded-[40px] bg-ink text-ink-foreground pt-16 pb-8 px-8 md:px-16 overflow-hidden relative">
        <div className="container mx-auto max-w-7xl relative z-10">
          {/* 1. Branding Area */}
          <div className="flex flex-col items-center md:items-start mb-16">
            <div className="flex items-center gap-3 mb-8">
              <div className="h-10 w-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center text-lg font-bold shadow-sm">
                S
              </div>
              <span className="font-semibold text-2xl tracking-tight text-white">
                ShopLink
              </span>
            </div>

            <div className="flex items-center gap-6 text-white/60">
              <Link
                href="#"
                className="hover:text-white hover:scale-110 transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="hover:text-white hover:scale-110 transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </Link>
              <Link
                href="#"
                className="hover:text-white hover:scale-110 transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-5 h-5"
                  fill="currentColor"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
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
                <li>
                  <Link
                    href="#features"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    href="#how-it-works"
                    className="hover:text-white hover:underline transition-all"
                  >
                    How it works
                  </Link>
                </li>
                <li>
                  <Link
                    href="#pricing"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    href="#faq"
                    className="hover:text-white hover:underline transition-all"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 2 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Company</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li>
                  <Link
                    href="#"
                    className="hover:text-white hover:underline transition-all"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Careers
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Partner Program
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Portal</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li>
                  <Link
                    href="/seller/login"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Seller Login
                  </Link>
                </li>
                <li>
                  <Link
                    href="/seller/login"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Create Store
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div>
              <h4 className="font-semibold text-white mb-6">Legal</h4>
              <ul className="space-y-4 text-sm text-white/60">
                <li>
                  <Link
                    href="/terms"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms#privacy"
                    className="hover:text-white hover:underline transition-all"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms#policy"
                    className="hover:text-white hover:underline transition-all"
                  >
                    User Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/404"
                    className="hover:text-white hover:underline transition-all"
                  >
                    404 Demo
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full h-px bg-white/10 mb-8" />

          {/* 3. Bottom Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-white/50">
            <p>
              Copyright © {new Date().getFullYear()} ShopLink | Designed for
              Nigerian Sellers
            </p>
            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-lg border border-white/10 hover:bg-white/10 transition-colors cursor-pointer">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="font-medium text-white/80">
                All systems operational
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
