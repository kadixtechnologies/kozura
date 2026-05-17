import * as React from 'react';

const styles = {
  main: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', color: '#27272a', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header: { padding: '0 0 30px 0', textAlign: 'left' as const },
  logoImage: { height: '56px', width: 'auto', display: 'block' },
  body: { padding: '0', lineHeight: '1.6', fontSize: '16px', textAlign: 'left' as const },
  h1: { fontSize: '24px', fontWeight: 'bold', color: '#09090b', marginTop: 0, marginBottom: '20px' },
  p: { margin: '0 0 20px 0' },
  infoBox: { backgroundColor: '#f4f4f5', border: '1px solid #e4e4e7', borderRadius: '10px', padding: '20px', marginBottom: '20px' },
  button: { display: 'inline-block', backgroundColor: '#1b9f4a', color: '#ffffff', padding: '14px 28px', borderRadius: '8px', textDecoration: 'none', fontWeight: 'bold', fontSize: '16px', marginTop: '10px', marginBottom: '20px', textAlign: 'center' as const },
  footer: { paddingTop: '30px', borderTop: '1px solid #e4e4e7', textAlign: 'left' as const, color: '#71717a', fontSize: '13px', marginTop: '30px' }
};

interface Props {
  storeName: string;
  ownerName: string;
  ownerEmail: string;
  loginUrl: string;
}

export const NewStoreNotificationEmail: React.FC<Readonly<Props>> = ({
  storeName,
  ownerName,
  ownerEmail,
  loginUrl,
}) => (
  <div style={styles.main}>
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="https://www.kozura.ng/logo.png" alt="Kozura Logo" style={styles.logoImage} />
      </div>
      <div style={styles.body}>
        <h1 style={styles.h1}>New Store Created 🛍️</h1>
        <p style={styles.p}>Hello Admin,</p>
        <p style={styles.p}>A new seller has just created a store on the Kozura platform.</p>
        
        <div style={styles.infoBox}>
          <p style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#71717a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Store Details</p>
          <p style={{ margin: '0 0 5px 0' }}><strong>Store Name:</strong> {storeName}</p>
          <p style={{ margin: '0 0 5px 0' }}><strong>Owner:</strong> {ownerName}</p>
          <p style={{ margin: 0 }}><strong>Email:</strong> {ownerEmail}</p>
        </div>

        <div style={{ textAlign: 'left' as const }}>
          <a href={loginUrl} style={styles.button}>View in Admin Dashboard</a>
        </div>
      </div>
      <div style={styles.footer}>
        © {new Date().getFullYear()} Kozura. Internal Admin Notification.
      </div>
    </div>
  </div>
);
