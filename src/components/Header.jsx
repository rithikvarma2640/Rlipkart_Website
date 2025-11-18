import { useState } from 'react';

export default function Header({ onSearch, cartCount, onCartClick, user, onLoginClick, onLogoutClick }) {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchQuery);
  };

  return (
    <header style={styles.header}>
      <div className="container" style={styles.headerContent}>
        <div style={styles.logo}>
          <h1 style={styles.logoText}>Rlipkart</h1>
          <span style={styles.logoSubtext}>Explore <span style={styles.plus}>Plus</span></span>
        </div>

        <form onSubmit={handleSearch} style={styles.searchForm}>
          <input
            type="text"
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={styles.searchInput}
          />
          <button type="submit" style={styles.searchButton}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          </button>
        </form>

        <div style={styles.actions}>
          {user ? (
            <div style={styles.userMenu}>
              <span style={styles.userName}>{user.user_metadata?.full_name || user.email}</span>
              <button onClick={onLogoutClick} style={styles.logoutButton}>Logout</button>
            </div>
          ) : (
            <button style={styles.actionButton} onClick={onLoginClick}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
              <span style={styles.actionText}>Login</span>
            </button>
          )}

          <button style={styles.actionButton} onClick={onCartClick}>
            <div style={styles.cartIconWrapper}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
            </div>
            <span style={styles.actionText}>Cart</span>
          </button>
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    padding: '12px 0',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
    position: 'sticky',
    top: 0,
    zIndex: 1000,
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  },
  logo: {
    display: 'flex',
    flexDirection: 'column',
    minWidth: '140px',
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 700,
    fontStyle: 'italic',
    letterSpacing: '-0.5px',
  },
  logoSubtext: {
    fontSize: '11px',
    fontStyle: 'italic',
    marginTop: '-4px',
  },
  plus: {
    color: 'var(--primary-yellow)',
    fontWeight: 600,
  },
  searchForm: {
    flex: 1,
    display: 'flex',
    maxWidth: '600px',
  },
  searchInput: {
    flex: 1,
    padding: '10px 16px',
    border: 'none',
    borderRadius: '2px 0 0 2px',
    fontSize: '14px',
  },
  searchButton: {
    backgroundColor: 'white',
    padding: '10px 16px',
    borderRadius: '0 2px 2px 0',
    display: 'flex',
    alignItems: 'center',
    color: 'var(--primary-blue)',
  },
  actions: {
    display: 'flex',
    gap: '24px',
    alignItems: 'center',
  },
  actionButton: {
    backgroundColor: 'transparent',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
    padding: '8px 12px',
    fontSize: '14px',
    fontWeight: 500,
  },
  actionText: {
    fontSize: '14px',
  },
  userMenu: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '13px',
    color: 'white',
    fontWeight: 500,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    color: 'white',
    padding: '6px 12px',
    fontSize: '13px',
    fontWeight: 500,
    borderRadius: '4px',
    transition: 'all 0.2s ease',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: '-8px',
    right: '-8px',
    backgroundColor: 'var(--primary-orange)',
    color: 'white',
    fontSize: '11px',
    fontWeight: 600,
    borderRadius: '50%',
    minWidth: '18px',
    height: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2px',
  },
};
