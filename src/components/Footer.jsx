export default function Footer() {
  const socialLinks = [
    {
      name: 'LinkedIn',
      url: 'https://www.linkedin.com/in/rithik-varma/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
        </svg>
      ),
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/varma.rithik/',
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
          <circle cx="17.5" cy="6.5" r="1.5" />
        </svg>
      ),
    },
  ];

  return (
    <footer style={styles.footer}>
      <div className="container" style={styles.content}>
        <div style={styles.section}>
          <h3 style={styles.title}>Rlipkart</h3>
          <p style={styles.description}>Your trusted online shopping destination</p>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Connect With Me</h4>
          <div style={styles.socialLinks}>
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={styles.socialLink}
                title={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>

        <div style={styles.section}>
          <h4 style={styles.heading}>Quick Links</h4>
          <ul style={styles.links}>
            <li><a href="#" style={styles.link}>About</a></li>
            <li><a href="#" style={styles.link}>Contact</a></li>
            <li><a href="#" style={styles.link}>Privacy Policy</a></li>
            <li><a href="#" style={styles.link}>Terms & Conditions</a></li>
          </ul>
        </div>
      </div>

      <div style={styles.bottom}>
        <p style={styles.copyright}>© 2025 Rlipkart. All rights reserved.</p>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    backgroundColor: '#212121',
    color: 'white',
    marginTop: '64px',
    paddingTop: '48px',
    paddingBottom: '0',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    paddingBottom: '32px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  title: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
  },
  heading: {
    fontSize: '16px',
    fontWeight: 600,
    marginBottom: '8px',
  },
  description: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    lineHeight: '1.6',
  },
  socialLinks: {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
  },
  socialLink: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  },
  links: {
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  link: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    transition: 'color 0.2s ease',
    textDecoration: 'none',
  },
  bottom: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    padding: '20px 0',
    textAlign: 'center',
  },
  copyright: {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.6)',
  },
};
