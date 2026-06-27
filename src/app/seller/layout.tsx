import { createClient } from "@/lib/supabase/server";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Kozura - Sell Anywhere, Scale Everywhere",
    default: "Kozura - Sell Anywhere, Scale Everywhere",
  },
};

export default function SellerGroupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
