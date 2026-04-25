import * as React from 'react';

interface OrderConfirmationProps {
  orderNumber: string;
  storeName: string;
  date: string;
  items: {
    productName: string;
    variantLabel?: string;
    qty: number;
    price: number;
  }[];
  subtotal: number;
  shippingFee: number;
  total: number;
  shippingMethod: string;
  shippingAddress?: string;
  trackingUrl: string;
  whatsappNumber?: string;
}

export function OrderConfirmationEmail({
  orderNumber,
  storeName,
  date,
  items,
  subtotal,
  shippingFee,
  total,
  shippingMethod,
  shippingAddress,
  trackingUrl,
  whatsappNumber,
}: OrderConfirmationProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#171717' }}>
      <div style={{ textAlign: 'center', padding: '24px 0', borderBottom: '1px solid #e5e5e5' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{storeName}</h1>
      </div>
      
      <div style={{ padding: '32px 0' }}>
        <h2 style={{ fontSize: '20px', marginTop: 0 }}>Your order has been received!</h2>
        <p style={{ color: '#525252' }}>Order #{orderNumber} • {date}</p>
        
        <div style={{ margin: '32px 0', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>Order Summary</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              {items.map((item, i) => (
                <tr key={i}>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e5e5' }}>
                    <div style={{ fontWeight: '500' }}>{item.productName}</div>
                    {item.variantLabel && <div style={{ fontSize: '12px', color: '#525252' }}>{item.variantLabel}</div>}
                    <div style={{ fontSize: '12px', color: '#525252' }}>Qty: {item.qty}</div>
                  </td>
                  <td style={{ padding: '8px 0', borderBottom: '1px solid #e5e5e5', textAlign: 'right', fontWeight: '500' }}>
                    ₦{(item.price * item.qty).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          <div style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px', color: '#525252' }}>
              <span>Subtotal</span>
              <span>₦{subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '14px', color: '#525252' }}>
              <span>Shipping ({shippingMethod})</span>
              <span>₦{shippingFee.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', marginTop: '12px', borderTop: '1px solid #e5e5e5', fontWeight: 'bold' }}>
              <span>Total</span>
              <span>₦{total.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {shippingAddress && (
          <div style={{ marginBottom: '32px' }}>
            <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Delivery Address</h3>
            <p style={{ margin: 0, color: '#525252', lineHeight: '1.5' }}>
              {shippingAddress}
            </p>
          </div>
        )}

        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <a 
            href={trackingUrl}
            style={{ 
              backgroundColor: '#171717', color: '#ffffff', padding: '14px 28px', 
              borderRadius: '8px', textDecoration: 'none', fontWeight: '500', display: 'inline-block' 
            }}
          >
            Track your order
          </a>
        </div>

        {whatsappNumber && (
          <p style={{ textAlign: 'center', color: '#525252', fontSize: '14px' }}>
            Questions? Contact the store via <a href={`https://wa.me/${whatsappNumber}`} style={{ color: '#16a34a' }}>WhatsApp</a>
          </p>
        )}
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #e5e5e5', color: '#737373', fontSize: '12px' }}>
        Powered by ShopLink
      </div>
    </div>
  );
}
