import * as React from 'react';

interface StatusUpdateProps {
  orderNumber: string;
  storeName: string;
  status: string;
  trackingUrl: string;
  whatsappNumber?: string;
  total: number;
}

export function StatusUpdateEmail({
  orderNumber,
  storeName,
  status,
  trackingUrl,
  whatsappNumber,
  total,
}: StatusUpdateProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#171717' }}>
      <div style={{ textAlign: 'center', padding: '24px 0', borderBottom: '1px solid #e5e5e5' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{storeName}</h1>
      </div>
      
      <div style={{ padding: '32px 0', textAlign: 'center' }}>
        <h2 style={{ fontSize: '20px', marginTop: 0 }}>
          Your order #{orderNumber} has been {status}.
        </h2>
        
        <div style={{ margin: '32px 0', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px', textAlign: 'left' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
            <span style={{ color: '#525252' }}>Order Total:</span>
            <span style={{ fontWeight: 'bold' }}>₦{total.toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', marginTop: '8px' }}>
            <span style={{ color: '#525252' }}>Status:</span>
            <span style={{ fontWeight: 'bold', textTransform: 'uppercase' }}>{status}</span>
          </div>
        </div>

        <div style={{ margin: '40px 0' }}>
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
          <p style={{ color: '#525252', fontSize: '14px', marginTop: '24px' }}>
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
