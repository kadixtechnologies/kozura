"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Check } from "lucide-react";
import { motion, Variants } from "framer-motion";
import { useState } from "react";
import Link from "next/link";

type PricingPlan = {
  plan_bg_color: string;
  plan_name: string;
  plan_descp: string;
  plan_price: number;
  plan_limit: string;
  plan_feature: string[];
  popular?: boolean;
};

const pricingData: PricingPlan[] = [
  {
    plan_bg_color: "bg-slate-500/10 dark:bg-slate-500/20",
    plan_name: "Free",
    plan_descp: "Perfect to get started",
    plan_price: 0,
    plan_limit: "Up to 20 orders/month",
    plan_feature: [
      "1 store",
      "Up to 10 products",
      "WhatsApp order alerts",
      "Customer order tracking",
      "ShopLink subdomain",
    ],
  },
  {
    plan_bg_color: "bg-primary/20 ring-2 ring-primary scale-105 z-10",
    plan_name: "Starter",
    plan_descp: "For sellers getting serious",
    plan_price: 2500,
    plan_limit: "Up to 100 orders/month",
    plan_feature: [
      "Everything in Free",
      "Up to 50 products",
      "Custom categories",
      "Coupon codes",
      "Basic analytics",
    ],
    popular: true,
  },
  {
    plan_bg_color: "bg-blue-500/10 dark:bg-blue-500/20",
    plan_name: "Hustle",
    plan_descp: "For fast-growing businesses",
    plan_price: 6000,
    plan_limit: "Up to 500 orders/month",
    plan_feature: [
      "Everything in Starter",
      "Unlimited products",
      "Priority WhatsApp support",
      "Advanced analytics",
      "Custom store colors & logo",
    ],
  },
  {
    plan_bg_color: "bg-purple-500/10 dark:bg-purple-500/20",
    plan_name: "Boss",
    plan_descp: "For high-volume sellers",
    plan_price: 15000,
    plan_limit: "Unlimited orders",
    plan_feature: [
      "Everything in Hustle",
      "Multiple stores",
      "Dedicated account manager",
      "Early access to new features",
      "Custom domain support",
    ],
  },
];

const Pricing = () => {
  const [isYearly, setIsYearly] = useState(false);

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 80,
    },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: index * 0.2,
        duration: 0.6,
        ease: "easeInOut" as const,
      },
    }),
  };

  return (
    <section id="pricing" className="bg-canvas py-10 xl:py-0 w-full">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 xl:px-16 lg:py-24 sm:py-16 py-8">
        <div className="flex flex-col gap-8 md:gap-12 justify-center items-center w-full">
          {/* Heading */}
          <div className="flex flex-col gap-4 justify-center items-center animate-in fade-in slide-in-from-top-8 duration-700 ease-in-out">
            <span className="text-primary font-bold tracking-wider text-sm uppercase block">PRICING</span>
            
            <div className="max-w-3xs sm:max-w-2xl mx-auto text-center">
              <h2 className="text-foreground text-4xl sm:text-5xl font-bold tracking-tight mb-4">
                Simple pricing, no surprises
              </h2>
              <p className="text-lg text-muted-foreground mb-10">Start free. Upgrade when your business grows.</p>
              
              <div className="inline-flex items-center p-1 rounded-full bg-background border border-border shadow-sm mx-auto">
                <button 
                  onClick={() => setIsYearly(false)}
                  className={cn("px-6 py-2.5 rounded-full text-sm font-semibold transition-colors", !isYearly ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                >
                  Monthly
                </button>
                <button 
                  onClick={() => setIsYearly(true)}
                  className={cn("px-6 py-2.5 rounded-full text-sm font-semibold transition-colors flex items-center gap-2", isYearly ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground')}
                >
                  Yearly <span className={cn("text-[10px] uppercase font-bold px-2 py-0.5 rounded-full", isYearly ? 'bg-white/20 text-white' : 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-400')}>Save 20%</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Pricing Plans */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 items-center justify-center grow gap-6 w-full">
            {pricingData?.map((items: PricingPlan, index: number) => (
              <motion.div
                key={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index}
                className="w-full relative"
              >
                {items.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-sm z-20">
                    ⭐ Most Popular
                  </div>
                )}
                <Card
                  className={cn(
                    items.plan_bg_color,
                    "p-6 sm:p-8 rounded-3xl ring-0 w-full shadow-sm relative",
                  )}
                  key={index}
                >
                  <CardContent className="flex flex-col gap-6 items-start self-stretch px-0 h-full w-full">
                    <div className="flex flex-col items-start justify-between self-stretch gap-6">
                      <div className="flex flex-col gap-3">
                        <Badge className="py-1 px-3 text-sm font-normal leading-5 w-fit h-7 bg-background text-foreground border-border">
                          {items.plan_name}
                        </Badge>
                        <p className="text-sm font-medium text-muted-foreground min-h-[40px]">
                          {items.plan_descp}
                        </p>
                      </div>
                      <div className="flex flex-col gap-4 w-full">
                        <p className="text-4xl sm:text-5xl font-bold text-card-foreground flex items-end">
                          <span className="text-2xl mb-1 mr-1">₦</span>
                          {isYearly ? (items.plan_price * 0.8).toLocaleString() : items.plan_price.toLocaleString()}
                          <span className="text-sm font-normal text-muted-foreground mb-1 ml-1">
                            /mo
                          </span>
                        </p>
                        <div className="bg-background/80 p-2 rounded-xl text-xs font-semibold text-center text-foreground/80 w-full mb-2">
                          {items.plan_limit}
                        </div>
                        
                        <Button asChild className="relative bg-ink text-ink-foreground hover:bg-ink/90 text-sm font-medium rounded-full h-12 p-1 ps-6 pe-14 group transition-all duration-500 hover:ps-14 hover:pe-6 w-full overflow-hidden cursor-pointer">
                          <Link href="/seller/login">
                            <span className="relative z-10 transition-all duration-500 text-center w-full block">
                              {items.plan_name === 'Free' ? 'Start Free' : items.plan_name === 'Boss' ? 'Go Boss' : 'Get Started'}
                            </span>
                            <div className="absolute right-1 w-10 h-10 bg-white text-black dark:bg-black dark:text-white rounded-full flex items-center justify-center transition-all duration-500 group-hover:right-[calc(100%-44px)] group-hover:rotate-45 shadow-sm">
                              <ArrowUpRight size={16} />
                            </div>
                          </Link>
                        </Button>
                      </div>
                    </div>
                    
                    <Separator
                      orientation="horizontal"
                      className="block w-full opacity-50"
                    />
                    
                    <div className="flex flex-col items-start gap-4 grow w-full">
                      <p className="text-card-foreground text-sm font-bold">
                        Features
                      </p>
                      <ul className="flex flex-col items-start self-stretch gap-3">
                        {items.plan_feature?.map(
                          (feature: string, index: number) => {
                            return (
                              <li
                                key={index}
                                className="flex items-start gap-3 text-card-foreground text-sm font-medium tracking-normal w-full"
                              >
                                <Check size={18} className="text-primary shrink-0 mt-0.5" aria-hidden="true" />
                                <span className="opacity-90">{feature}</span>
                              </li>
                            );
                          },
                        )}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
