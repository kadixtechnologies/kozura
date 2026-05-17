import * as React from 'react';

const styles = {
  main: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', color: '#27272a', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header: { padding: '0 0 30px 0', textAlign: 'left' as const },
  logoImage: { height: '56px', width: 'auto', display: 'block' },
  body: { padding: '0', lineHeight: '1.6', fontSize: '16px', textAlign: 'left' as const },
  h1: { fontSize: '24px', fontWeight: 'bold', color: '#dc2626', marginTop: 0, marginBottom: '20px' },
  p: { margin: '0 0 20px 0' },
  criticalBox: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  button: { display: 'inline-block', backgroundColor: '#1b9f4a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', marginBottom: '20px', textAlign: 'center' as const },
  footer: { paddingTop: '30px', borderTop: '1px solid #e4e4e7', textAlign: 'left' as const, color: '#71717a', fontSize: '13px', marginTop: '30px' }
};

interface Props {
  storeName: string;
  loginUrl: string;
}

export const SubscriptionCancelledEmail: React.FC<Readonly<Props>> = ({
  storeName,
  loginUrl,
}) => (
  <div style={styles.main}>
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="https://www.kozura.ng/logo.png" alt="Kozura Logo" style={styles.logoImage} />
      </div>
      <div style={styles.body}>
        <h1 style={styles.h1}>Subscription Cancelled</h1>
        <p style={styles.p}>Hi there,</p>
        <p style={styles.p}>Your grace period has ended, and we were unable to process the payment for your store <strong>{storeName}</strong>.</p>
        
        <div style={styles.criticalBox}>
          <p style={{ margin: '0 0 5px 0', fontWeight: 'bold', color: '#b91c1c' }}>Plan Downgraded</p>
          <p style={{ margin: 0, color: '#991b1b' }}>Your store has been automatically downgraded to the Free plan. Some premium features may no longer be available.</p>
        </div>

        <p style={styles.p}>You can restore your premium features at any time by logging into your dashboard and subscribing to a new plan.</p>
        
        <div style={{ textAlign: 'left' as const }}>
          <a href={loginUrl} style={styles.button}>Go to Dashboard</a>
        </div>
        
        <p style={{ ...styles.p, margin: 0 }}>Cheers,<br/><strong>The Kozura Team</strong></p>
      </div>
      <div style={styles.footer}>
        © {new Date().getFullYear()} Kozura. All rights reserved.
      </div>
    </div>
  </div>
);
