import * as React from 'react';

const styles = {
  main: { fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif', backgroundColor: '#ffffff', color: '#27272a', margin: 0, padding: '40px 20px' },
  container: { maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff' },
  header: { padding: '0 0 30px 0', textAlign: 'left' as const },
  logoImage: { height: '56px', width: 'auto', display: 'block' },
  body: { padding: '0', lineHeight: '1.6', fontSize: '16px', textAlign: 'left' as const },
  h1: { fontSize: '24px', fontWeight: 'bold', color: '#09090b', marginTop: 0, marginBottom: '20px' },
  p: { margin: '0 0 20px 0' },
  footer: { paddingTop: '30px', borderTop: '1px solid #e4e4e7', textAlign: 'left' as const, color: '#71717a', fontSize: '13px', marginTop: '30px' }
};

interface Props {
  name: string;
}

export const WaitlistConfirmationEmail: React.FC<Readonly<Props>> = ({ name }) => (
  <div style={styles.main}>
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="https://www.kozura.ng/logo.png" alt="Kozura Logo" style={styles.logoImage} />
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
