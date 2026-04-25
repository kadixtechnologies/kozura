import { resend, isEmailEnabled, fromEmail } from './resend';
import { OrderConfirmationEmail } from './templates/order-confirmation';
import { NewSaleEmail } from './templates/new-sale';
import { StatusUpdateEmail } from './templates/status-update';
import { createClient } from '@/lib/supabase/server';
import * as React from 'react';

type EmailResponse = { success: boolean; error?: string };

async function logEmailToDatabase(
  toEmail: string, 
  subject: string, 
  templateName: string, 
  status: 'sent' | 'failed' | 'disabled', 
  errorMsg?: string
) {
  try {
    const supabase = await createClient();
    await supabase.from('email_logs').insert({
      to_email: toEmail,
      subject,
      template_name: templateName,
      status,
      error_message: errorMsg
    });
  } catch (err) {
    console.error('Failed to log email to database:', err);
  }
}

export async function sendOrderConfirmation({ order, store }: any): Promise<EmailResponse> {
  const subject = `Order #${order.order_number} confirmed — ${store.name}`;
  
  if (!isEmailEnabled) {
    console.log(`Email skipped (disabled): ${subject}`);
    await logEmailToDatabase(order.customer_email, subject, 'order-confirmation', 'disabled');
    return { success: true };
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const trackingUrl = `${siteUrl}/${store.slug}/order/${order.id}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: subject,
      react: OrderConfirmationEmail({
        orderNumber: order.order_number,
        storeName: store.name,
        date: new Date(order.created_at).toLocaleDateString(),
        items: order.items.map((item: any) => ({
          productName: item.product_name,
          variantLabel: item.variant_label,
          qty: item.quantity,
          price: item.unit_price,
        })),
        subtotal: order.subtotal_amount,
        shippingFee: order.shipping_fee,
        total: order.total_amount,
        shippingMethod: order.shipping_method,
        shippingAddress: order.shipping_address ? `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}` : undefined,
        trackingUrl,
        whatsappNumber: store.whatsapp_number,
      }) as React.ReactElement,
    });

    if (error) {
      await logEmailToDatabase(order.customer_email, subject, 'order-confirmation', 'failed', error.message);
      return { success: false, error: error.message };
    }

    await logEmailToDatabase(order.customer_email, subject, 'order-confirmation', 'sent');
    return { success: true };
  } catch (err: any) {
    await logEmailToDatabase(order.customer_email, subject, 'order-confirmation', 'failed', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendNewSaleAlert({ order, store, sellerEmail }: any): Promise<EmailResponse> {
  const subject = `New order #${order.order_number} on ${store.name}`;
  
  if (!isEmailEnabled) {
    console.log(`Email skipped (disabled): ${subject}`);
    await logEmailToDatabase(sellerEmail, subject, 'new-sale', 'disabled');
    return { success: true };
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const orderUrl = `${siteUrl}/seller/orders/${order.id}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: sellerEmail,
      subject: subject,
      react: NewSaleEmail({
        orderNumber: order.order_number,
        storeName: store.name,
        date: new Date(order.created_at).toLocaleDateString(),
        customer: {
          name: order.customer_name,
          email: order.customer_email,
          phone: order.customer_phone,
        },
        items: order.items.map((item: any) => ({
          productName: item.product_name,
          variantLabel: item.variant_label,
          qty: item.quantity,
          price: item.unit_price,
        })),
        total: order.total_amount,
        shippingMethod: order.shipping_method,
        shippingAddress: order.shipping_address ? `${order.shipping_address}, ${order.shipping_city}, ${order.shipping_state}` : undefined,
        orderUrl,
      }) as React.ReactElement,
    });

    if (error) {
      await logEmailToDatabase(sellerEmail, subject, 'new-sale', 'failed', error.message);
      return { success: false, error: error.message };
    }

    await logEmailToDatabase(sellerEmail, subject, 'new-sale', 'sent');
    return { success: true };
  } catch (err: any) {
    await logEmailToDatabase(sellerEmail, subject, 'new-sale', 'failed', err.message);
    return { success: false, error: err.message };
  }
}

export async function sendStatusUpdate({ order, store, newStatus }: any): Promise<EmailResponse> {
  const subject = `Your order #${order.order_number} has been ${newStatus}`;
  
  if (!isEmailEnabled) {
    console.log(`Email skipped (disabled): ${subject}`);
    await logEmailToDatabase(order.customer_email, subject, 'status-update', 'disabled');
    return { success: true };
  }

  try {
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const trackingUrl = `${siteUrl}/${store.slug}/order/${order.id}`;

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: order.customer_email,
      subject: subject,
      react: StatusUpdateEmail({
        orderNumber: order.order_number,
        storeName: store.name,
        status: newStatus,
        trackingUrl,
        whatsappNumber: store.whatsapp_number,
        total: order.total_amount,
      }) as React.ReactElement,
    });

    if (error) {
      await logEmailToDatabase(order.customer_email, subject, 'status-update', 'failed', error.message);
      return { success: false, error: error.message };
    }

    await logEmailToDatabase(order.customer_email, subject, 'status-update', 'sent');
    return { success: true };
  } catch (err: any) {
    await logEmailToDatabase(order.customer_email, subject, 'status-update', 'failed', err.message);
    return { success: false, error: err.message };
  }
}
