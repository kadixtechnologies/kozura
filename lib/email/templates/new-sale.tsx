import * as React from 'react';

interface NewSaleProps {
  orderNumber: string;
  storeName: string;
  date: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
  };
  items: {
    productName: string;
    variantLabel?: string;
    qty: number;
    price: number;
  }[];
  total: number;
  shippingMethod: string;
  shippingAddress?: string;
  orderUrl: string;
}

export function NewSaleEmail({
  orderNumber,
  storeName,
  date,
  customer,
  items,
  total,
  shippingMethod,
  shippingAddress,
  orderUrl,
}: NewSaleProps) {
  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: '600px', margin: '0 auto', color: '#171717' }}>
      <div style={{ textAlign: 'center', padding: '24px 0', borderBottom: '1px solid #e5e5e5' }}>
        <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>{storeName}</h1>
      </div>
      
      <div style={{ padding: '32px 0' }}>
        <h2 style={{ fontSize: '20px', marginTop: 0, color: '#16a34a' }}>You have a new order!</h2>
        <p style={{ color: '#525252' }}>Order #{orderNumber} • {date}</p>
        
        <div style={{ margin: '32px 0', padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '12px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>Customer Details</h3>
          <p style={{ margin: '4px 0', color: '#525252' }}><strong>Name:</strong> {customer.name}</p>
          <p style={{ margin: '4px 0', color: '#525252' }}><strong>Email:</strong> {customer.email}</p>
          {customer.phone && <p style={{ margin: '4px 0', color: '#525252' }}><strong>Phone:</strong> {customer.phone}</p>}
        </div>
        
        <div style={{ margin: '32px 0', border: '1px solid #e5e5e5', borderRadius: '12px', padding: '24px' }}>
          <h3 style={{ marginTop: 0, fontSize: '16px' }}>Order Items</h3>
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
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0', marginTop: '12px', fontWeight: 'bold' }}>
            <span>Total</span>
            <span>₦{total.toLocaleString()}</span>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>Fulfillment Method: {shippingMethod}</h3>
          {shippingAddress && (
            <p style={{ margin: 0, color: '#525252', lineHeight: '1.5' }}>
              {shippingAddress}
            </p>
          )}
        </div>

        <div style={{ textAlign: 'center', margin: '40px 0' }}>
          <a 
            href={orderUrl}
            style={{ 
              backgroundColor: '#171717', color: '#ffffff', padding: '14px 28px', 
              borderRadius: '8px', textDecoration: 'none', fontWeight: '500', display: 'inline-block' 
            }}
          >
            View Order
          </a>
        </div>
      </div>

      <div style={{ textAlign: 'center', padding: '24px 0', borderTop: '1px solid #e5e5e5', color: '#737373', fontSize: '12px' }}>
        Powered by ShopLink
      </div>
    </div>
  );
}
