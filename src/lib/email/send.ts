import { resend, isEmailEnabled, fromEmail } from './resend';
import { WaitlistConfirmationEmail } from './templates/waitlist-confirmation';
import { SubscriptionUpgradeEmail } from './templates/subscription-upgrade';
import { PaymentFailedWarningEmail } from './templates/payment-failed-warning';
import { SubscriptionCancelledEmail } from './templates/subscription-cancelled';
import { NewStoreNotificationEmail } from './templates/new-store-notification';
import * as React from 'react';

type EmailResponse = { success: boolean; error?: string };

export async function sendWaitlistConfirmation({ email, name }: { email: string; name: string }): Promise<EmailResponse> {
  const subject = "You're on the Kozura waitlist!";

  if (!isEmailEnabled) {
    console.log(`[Email] Skipped (EMAIL_ENABLED=false): waitlist-confirmation → ${email}`);
    return { success: true };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: email,
      subject,
      react: WaitlistConfirmationEmail({ name }) as React.ReactElement,
    });

    if (error) {
      console.error(`[Email] Failed: waitlist-confirmation → ${email}:`, error);
      return { success: false, error: error.message };
    }

    console.log(`[Email] Sent: waitlist-confirmation → ${email} (id: ${data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email] Exception: waitlist-confirmation → ${email}:`, err);
    return { success: false, error: err.message };
  }
}

export async function sendSubscriptionUpgrade({ sellerEmail, storeName, planName, amount, nextBillingDate }: any): Promise<EmailResponse> {
  const subject = `Your Kozura store has been upgraded to ${planName}!`;
  if (!isEmailEnabled) { console.log(`[Email] Skipped: subscription-upgrade → ${sellerEmail}`); return { success: true }; }

  try {
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: sellerEmail,
      subject,
      react: SubscriptionUpgradeEmail({ storeName, planName, amount, nextBillingDate }) as React.ReactElement,
    });
    if (error) { console.error(`[Email] Failed: subscription-upgrade → ${sellerEmail}:`, error); return { success: false, error: error.message }; }
    console.log(`[Email] Sent: subscription-upgrade → ${sellerEmail} (id: ${data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email] Exception: subscription-upgrade → ${sellerEmail}:`, err);
    return { success: false, error: err.message };
  }
}

export async function sendPaymentFailedWarning({ sellerEmail, storeName, daysRemaining, gracePeriodEnds }: any): Promise<EmailResponse> {
  const subject = `Action Required: Payment Failed for ${storeName}`;
  if (!isEmailEnabled) { console.log(`[Email] Skipped: payment-failed-warning → ${sellerEmail}`); return { success: true }; }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kozura.ng';
    const loginUrl = `${siteUrl}/seller/settings`;
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: sellerEmail,
      subject,
      react: PaymentFailedWarningEmail({ storeName, daysRemaining, gracePeriodEnds, loginUrl }) as React.ReactElement,
    });
    if (error) { console.error(`[Email] Failed: payment-failed-warning → ${sellerEmail}:`, error); return { success: false, error: error.message }; }
    console.log(`[Email] Sent: payment-failed-warning → ${sellerEmail} (id: ${data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email] Exception: payment-failed-warning → ${sellerEmail}:`, err);
    return { success: false, error: err.message };
  }
}

export async function sendSubscriptionCancelled({ sellerEmail, storeName }: any): Promise<EmailResponse> {
  const subject = `Your subscription for ${storeName} has been cancelled`;
  if (!isEmailEnabled) { console.log(`[Email] Skipped: subscription-cancelled → ${sellerEmail}`); return { success: true }; }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kozura.ng';
    const loginUrl = `${siteUrl}/seller/settings`;
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: sellerEmail,
      subject,
      react: SubscriptionCancelledEmail({ storeName, loginUrl }) as React.ReactElement,
    });
    if (error) { console.error(`[Email] Failed: subscription-cancelled → ${sellerEmail}:`, error); return { success: false, error: error.message }; }
    console.log(`[Email] Sent: subscription-cancelled → ${sellerEmail} (id: ${data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email] Exception: subscription-cancelled → ${sellerEmail}:`, err);
    return { success: false, error: err.message };
  }
}

export async function sendNewStoreNotification({ storeName, ownerName, ownerEmail }: { storeName: string; ownerName: string; ownerEmail: string }): Promise<EmailResponse> {
  const adminEmail = process.env.ADMIN_WHITELISTED_EMAIL;
  if (!adminEmail || !isEmailEnabled) { console.log(`[Email] Skipped: new-store-notification (no admin email or disabled)`); return { success: true }; }

  const subject = `New Store Alert: ${storeName}`;

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.kozura.ng';
    const loginUrl = `${siteUrl}/admin`;
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: adminEmail,
      subject,
      react: NewStoreNotificationEmail({ storeName, ownerName, ownerEmail, loginUrl }) as React.ReactElement,
    });
    if (error) { console.error(`[Email] Failed: new-store-notification → ${adminEmail}:`, error); return { success: false, error: error.message }; }
    console.log(`[Email] Sent: new-store-notification → ${adminEmail} (id: ${data?.id})`);
    return { success: true };
  } catch (err: any) {
    console.error(`[Email] Exception: new-store-notification → ${adminEmail}:`, err);
    return { success: false, error: err.message };
  }
}
