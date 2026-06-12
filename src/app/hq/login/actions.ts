"use server";

export async function verifyAdminEmail(email: string) {
  // Read from environment variables. Fallback added for testing if not set.
  const adminEmail = process.env.ADMIN_EMAIL || "admin@kozura.app";
  
  // We use a slight delay to prevent timing attacks and brute forcing
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (email.toLowerCase() === adminEmail.toLowerCase()) {
    return { success: true };
  }
  
  return { success: false, error: "Unauthorized email address." };
}

export async function verifyAdminPassword(password: string) {
  // Read from environment variables. Fallback added for testing if not set.
  const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
  
  // Delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  if (password === adminPassword) {
    // In a real app, you would set an HTTP-only cookie here
    return { success: true };
  }
  
  return { success: false, error: "Incorrect password." };
}
