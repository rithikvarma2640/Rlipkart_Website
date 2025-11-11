export default function ProductCard({ product, onAddToCart }) {
  return (
    <div style={styles.card}>
      <div style={styles.imageContainer}>
        <img
          src={product.image_url}
          alt={product.name}
          style={styles.image}
        />
      </div>

      <div style={styles.content}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.description}>{product.description}</p>

        <div style={styles.ratingContainer}>
          <span style={styles.rating}>
            {product.rating} ★
          </span>
        </div>

        <div style={styles.footer}>
          <div>
            <span style={styles.price}>₹{product.price.toLocaleString()}</span>
            <span style={styles.category}>{product.category}</span>
          </div>

          <button
            onClick={() => onAddToCart(product)}
            style={styles.addButton}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: {
    backgroundColor: 'white',
    borderRadius: '4px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  imageContainer: {
    width: '100%',
    paddingTop: '100%',
    position: 'relative',
    backgroundColor: 'var(--bg-gray)',
    overflow: 'hidden',
  },
  image: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  content: {
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    flex: 1,
  },
  name: {
    fontSize: '16px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontSize: '13px',
    color: 'var(--text-secondary)',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
    lineHeight: '1.4',
    minHeight: '36px',
  },
  ratingContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  rating: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'white',
    backgroundColor: 'var(--success)',
    padding: '2px 8px',
    borderRadius: '4px',
    display: 'inline-flex',
    alignItems: 'center',
  },
  footer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 'auto',
  },
  price: {
    fontSize: '18px',
    fontWeight: 700,
    color: 'var(--text-primary)',
    display: 'block',
  },
  category: {
    fontSize: '12px',
    color: 'var(--text-secondary)',
    display: 'block',
    marginTop: '2px',
  },
  addButton: {
    backgroundColor: 'var(--primary-orange)',
    color: 'white',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 600,
    borderRadius: '4px',
  },
};
