import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
export const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';
export const fromEmail = process.env.RESEND_FROM_EMAIL || 'noreply@shoplink.com';
