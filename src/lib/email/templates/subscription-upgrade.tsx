import * as React from 'react';

const styles = {
  main: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', color: '#27272a', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header: { padding: '0 0 30px 0', textAlign: 'left' as const },
  logoImage: { height: '56px', width: 'auto', display: 'block' },
  body: { padding: '0', lineHeight: '1.6', fontSize: '16px', textAlign: 'left' as const },
  h1: { fontSize: '24px', fontWeight: 'bold', color: '#09090b', marginTop: 0, marginBottom: '20px' },
  p: { margin: '0 0 20px 0' },
  highlightBox: { backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  button: { display: 'inline-block', backgroundColor: '#1b9f4a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', marginBottom: '20px', textAlign: 'center' as const },
  footer: { paddingTop: '30px', borderTop: '1px solid #e4e4e7', textAlign: 'left' as const, color: '#71717a', fontSize: '13px', marginTop: '30px' }
};

interface Props {
  storeName: string;
  planName: string;
  amount: number | string;
  nextBillingDate: string;
}

export const SubscriptionUpgradeEmail: React.FC<Readonly<Props>> = ({
  storeName,
  planName,
  amount,
  nextBillingDate,
}) => (
  <div style={styles.main}>
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="https://www.kozura.ng/logo.png" alt="Kozura Logo" style={styles.logoImage} />
      </div>
      <div style={styles.body}>
        <h1 style={styles.h1}>You've been upgraded! 🚀</h1>
        <p style={styles.p}>Hi there,</p>
        <p style={styles.p}>Great news! Your store <strong>{storeName}</strong> has been successfully upgraded to the <strong>{planName}</strong> plan.</p>
        
        <div style={styles.highlightBox}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#71717a' }}>Subscription Details:</p>
          <p style={{ margin: '0 0 5px 0' }}><strong>Plan:</strong> {planName}</p>
          <p style={{ margin: '0 0 5px 0' }}><strong>Amount:</strong> {typeof amount === 'number' ? `NGN ${amount.toLocaleString()}` : amount}/month</p>
          <p style={{ margin: 0 }}><strong>Next Billing Date:</strong> {new Date(nextBillingDate).toLocaleDateString()}</p>
        </div>

        <p style={styles.p}>You now have access to all the features included in your new plan. Go ahead and start exploring the new tools available to scale your business.</p>
        
        <p style={{ ...styles.p, margin: 0 }}>Cheers,<br/><strong>The Kozura Team</strong></p>
      </div>
      <div style={styles.footer}>
        © {new Date().getFullYear()} Kozura. All rights reserved.
      </div>
    </div>
  </div>
);
