import * as React from 'react';

const styles = {
  main: { fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#f4f4f5', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7' },
  header: { backgroundColor: '#09090b', padding: '30px', textAlign: 'center' as const },
  logo: { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px', margin: 0 },
  body: { padding: '40px 30px', color: '#27272a', lineHeight: '1.6', fontSize: '16px' },
  h1: { fontSize: '22px', fontWeight: 'bold', color: '#dc2626', marginTop: 0, marginBottom: '20px' }, // Red critical color
  p: { margin: '0 0 20px 0' },
  criticalBox: { backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  button: { display: 'inline-block', backgroundColor: '#09090b', color: '#ffffff', padding: '14px 28px', borderRadius: '10px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', marginBottom: '20px' },
  footer: { padding: '30px', backgroundColor: '#fafafa', borderTop: '1px solid #e4e4e7', textAlign: 'center' as const, color: '#71717a', fontSize: '13px' }
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
        <p style={styles.logo}>Kozura</p>
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
        
        <div style={{ textAlign: 'center' as const }}>
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
