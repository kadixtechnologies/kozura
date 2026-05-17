"use server";

import { createAnonClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

import { sendWaitlistConfirmation } from "@/lib/email/send";

export async function joinWaitlist(formData: FormData) {
  const email = formData.get("email") as string;
  const name = formData.get("name") as string;

  if (!name || name.trim().length < 2) {
    return { error: "Please enter a valid name." };
  }

  if (!email || !email.includes("@")) {
    return { error: "Please enter a valid email address." };
  }

  // Guard: ensure env vars are present
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("Waitlist error: Missing Supabase environment variables.");
    return { error: "Something went wrong. Please try again later." };
  }

  const supabase = createAnonClient();

  // Try to insert the email and name into the waitlist table
  const { error } = await supabase
    .from("waitlist")
    .insert([{ name: name.trim(), email: email.toLowerCase().trim() }]);

  if (error) {
    // Supabase returns code '23505' for unique violation (duplicate email)
    if (error.code === "23505") {
      return { error: "You are already on the waitlist!" };
    }
    console.error("Waitlist DB error:", { code: error.code, message: error.message, details: error.details, hint: error.hint });
    return { error: "Something went wrong. Please try again later." };
  }

  // Send confirmation email synchronously to ensure the process isn't killed early
  await sendWaitlistConfirmation({ email: email.toLowerCase().trim(), name: name.trim() });

  revalidatePath("/");
  return { success: "You've been successfully added to the waitlist!" };
}
