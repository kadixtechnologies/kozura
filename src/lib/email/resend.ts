import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);
export const isEmailEnabled = process.env.EMAIL_ENABLED === 'true';

const fromName = process.env.RESEND_FROM_NAME || 'Kozura';
const fromAddress = process.env.RESEND_FROM_EMAIL || 'noreply@kozura.ng';
export const fromEmail = `${fromName} <${fromAddress}>`;
