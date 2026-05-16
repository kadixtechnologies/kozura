import * as React from 'react';

const styles = {
  main: { fontFamily: 'Helvetica, Arial, sans-serif', backgroundColor: '#f4f4f5', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)', border: '1px solid #e4e4e7' },
  header: { backgroundColor: '#09090b', padding: '30px', textAlign: 'center' as const },
  logo: { color: '#ffffff', fontSize: '24px', fontWeight: 'bold', letterSpacing: '-0.5px', margin: 0 },
  body: { padding: '40px 30px', color: '#27272a', lineHeight: '1.6', fontSize: '16px' },
  h1: { fontSize: '22px', fontWeight: 'bold', color: '#09090b', marginTop: 0, marginBottom: '20px' },
  p: { margin: '0 0 20px 0' },
  footer: { padding: '30px', backgroundColor: '#fafafa', borderTop: '1px solid #e4e4e7', textAlign: 'center' as const, color: '#71717a', fontSize: '13px' }
};

interface Props {
  name: string;
}

export const WaitlistConfirmationEmail: React.FC<Readonly<Props>> = ({ name }) => (
  <div style={styles.main}>
    <div style={styles.container}>
      <div style={styles.header}>
        <p style={styles.logo}>Kozura</p>
      </div>
      <div style={styles.body}>
        <h1 style={styles.h1}>You're on the list, {name}! 🎉</h1>
        <p style={styles.p}>Thank you for joining the Kozura waitlist. We're thrilled to have you with us.</p>
        <p style={styles.p}>We are working hard to build the most powerful and seamless storefront experience for you. You will be among the very first to know the moment we open our doors.</p>
        <p style={styles.p}>Stay tuned for more updates, exclusive sneak peeks, and early access invitations directly to your inbox.</p>
        <p style={{ ...styles.p, margin: 0 }}>Cheers,<br/><strong>The Kozura Team</strong></p>
      </div>
      <div style={styles.footer}>
        © {new Date().getFullYear()} Kozura. All rights reserved.
      </div>
    </div>
  </div>
);
