import * as React from 'react';

const styles = {
  main: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', color: '#27272a', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header: { padding: '0 0 30px 0', textAlign: 'left' as const },
  logoImage: { height: '56px', width: 'auto', display: 'block' },
  body: { padding: '0', lineHeight: '1.6', fontSize: '16px', textAlign: 'left' as const },
  h1: { fontSize: '24px', fontWeight: 'bold', color: '#ea580c', marginTop: 0, marginBottom: '20px' }, // Orange warning color
  p: { margin: '0 0 20px 0' },
  warningBox: { backgroundColor: '#fff7ed', border: '1px solid #fdba74', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  button: { display: 'inline-block', backgroundColor: '#1b9f4a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', marginBottom: '20px', textAlign: 'center' as const },
  footer: { paddingTop: '30px', borderTop: '1px solid #e4e4e7', textAlign: 'left' as const, color: '#71717a', fontSize: '13px', marginTop: '30px' }
};

interface Props {
  storeName: string;
  daysRemaining: number;
  gracePeriodEnds: string;
  loginUrl: string;
}

export const PaymentFailedWarningEmail: React.FC<Readonly<Props>> = ({
  storeName,
  daysRemaining,
  gracePeriodEnds,
  loginUrl,
}) => (
  <div style={styles.main}>
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="https://www.kozura.ng/logo.png" alt="Kozura Logo" style={styles.logoImage} />
      </div>
      <div style={styles.body}>
        <h1 style={styles.h1}>Action Required: Payment Failed ⚠️</h1>
        <p style={styles.p}>Hi there,</p>
        <p style={styles.p}>We were unable to process the automatic renewal for your store <strong>{storeName}</strong>.</p>
        
        <div style={styles.warningBox}>
          <p style={{ margin: '0 0 10px 0', fontWeight: 'bold', color: '#c2410c' }}>Grace Period Activated</p>
          <p style={{ margin: '0 0 5px 0' }}>You have <strong>{daysRemaining} day(s)</strong> left to update your payment method.</p>
          <p style={{ margin: 0 }}>If payment is not received by <strong>{gracePeriodEnds}</strong>, your store will be downgraded to the Free plan.</p>
        </div>

        <p style={styles.p}>Please log in to your dashboard and update your subscription to avoid any interruption to your store's features.</p>
        
        <div style={{ textAlign: 'left' as const }}>
          <a href={loginUrl} style={styles.button}>Update Payment Method</a>
        </div>
        
        <p style={{ ...styles.p, margin: 0 }}>Cheers,<br/><strong>The Kozura Team</strong></p>
      </div>
      <div style={styles.footer}>
        © {new Date().getFullYear()} Kozura. All rights reserved.
      </div>
    </div>
  </div>
);
