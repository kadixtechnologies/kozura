"use server";

import { createClient } from "@/lib/supabase/server";
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

  const supabase = await createClient();

  // Try to insert the email and name into the waitlist table
  const { error } = await supabase.from("waitlist").insert([{ name: name.trim(), email: email.toLowerCase().trim() }]);

  if (error) {
    // Supabase returns code '23505' for unique violation
    if (error.code === "23505") {
      return { error: "You are already on the waitlist!" };
    }
    console.error("Waitlist error:", error);
    return { error: "Something went wrong. Please try again later." };
  }

  // Send confirmation email synchronously to ensure the process isn't killed early
  await sendWaitlistConfirmation({ email: email.toLowerCase().trim(), name: name.trim() });

  revalidatePath("/");
  return { success: "You've been successfully added to the waitlist!" };
}
