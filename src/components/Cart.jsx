export default function Cart({ items, onClose, onUpdateQuantity, onRemove, onCheckout }) {
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.drawer} onClick={(e) => e.stopPropagation()}>
        <div style={styles.header}>
          <h2 style={styles.title}>Shopping Cart</h2>
          <button onClick={onClose} style={styles.closeButton}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div style={styles.content}>
          {items.length === 0 ? (
            <div style={styles.emptyState}>
              <p style={styles.emptyText}>Your cart is empty</p>
              <button onClick={onClose} style={styles.continueButton}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              <div style={styles.items}>
                {items.map((item) => (
                  <div key={item.id} style={styles.cartItem}>
                    <img src={item.image_url} alt={item.name} style={styles.itemImage} />

                    <div style={styles.itemDetails}>
                      <h3 style={styles.itemName}>{item.name}</h3>
                      <p style={styles.itemPrice}>₹{item.price.toLocaleString()}</p>

                      <div style={styles.quantityControls}>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                          style={styles.quantityButton}
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span style={styles.quantity}>{item.quantity}</span>
                        <button
                          onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                          style={styles.quantityButton}
                        >
                          +
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={() => onRemove(item.id)}
                      style={styles.removeButton}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>

              <div style={styles.footer}>
                <div style={styles.totalRow}>
                  <span style={styles.totalLabel}>Total:</span>
                  <span style={styles.totalAmount}>₹{total.toLocaleString()}</span>
                </div>
                <button onClick={onCheckout} style={styles.checkoutButton}>
                  Proceed to Checkout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    zIndex: 2000,
    display: 'flex',
    justifyContent: 'flex-end',
  },
  drawer: {
    backgroundColor: 'white',
    width: '100%',
    maxWidth: '480px',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    boxShadow: '-4px 0 12px rgba(0,0,0,0.1)',
    animation: 'slideIn 0.3s ease',
  },
  header: {
    padding: '20px 24px',
    borderBottom: '1px solid var(--border-color)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  closeButton: {
    backgroundColor: 'transparent',
    padding: '8px',
    color: 'var(--text-secondary)',
  },
  content: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  items: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
  },
  cartItem: {
    display: 'flex',
    gap: '16px',
    padding: '16px',
    backgroundColor: 'var(--bg-gray)',
    borderRadius: '8px',
    position: 'relative',
  },
  itemImage: {
    width: '80px',
    height: '80px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  itemDetails: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  itemName: {
    fontSize: '15px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  itemPrice: {
    fontSize: '16px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  quantityControls: {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    marginTop: 'auto',
  },
  quantityButton: {
    backgroundColor: 'white',
    border: '1px solid var(--border-color)',
    width: '32px',
    height: '32px',
    borderRadius: '4px',
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  quantity: {
    fontSize: '15px',
    fontWeight: 600,
    minWidth: '24px',
    textAlign: 'center',
  },
  removeButton: {
    backgroundColor: 'transparent',
    padding: '8px',
    color: 'var(--error)',
    position: 'absolute',
    top: '16px',
    right: '16px',
  },
  footer: {
    padding: '24px',
    borderTop: '1px solid var(--border-color)',
    backgroundColor: 'white',
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '16px',
  },
  totalLabel: {
    fontSize: '18px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  totalAmount: {
    fontSize: '24px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  checkoutButton: {
    width: '100%',
    backgroundColor: 'var(--primary-orange)',
    color: 'white',
    padding: '14px',
    fontSize: '16px',
    fontWeight: 700,
    borderRadius: '4px',
  },
  emptyState: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '24px',
    padding: '48px',
  },
  emptyText: {
    fontSize: '16px',
    color: 'var(--text-secondary)',
  },
  continueButton: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: 600,
    borderRadius: '4px',
  },
};
