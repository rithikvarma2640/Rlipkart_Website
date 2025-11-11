export default function CategoryBar({ onCategorySelect, selectedCategory }) {
  const categories = [
    'All',
    'Electronics',
    'Clothing',
    'Footwear',
    'Home & Kitchen',
    'Sports',
    'Accessories',
  ];

  return (
    <div style={styles.container}>
      <div className="container" style={styles.content}>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => onCategorySelect(category)}
            style={{
              ...styles.categoryButton,
              ...(selectedCategory === category ? styles.activeCategory : {}),
            }}
          >
            {category}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: 'white',
    borderBottom: '1px solid var(--border-color)',
    boxShadow: '0 1px 2px rgba(0,0,0,0.05)',
  },
  content: {
    display: 'flex',
    gap: '8px',
    padding: '12px 0',
    overflowX: 'auto',
  },
  categoryButton: {
    backgroundColor: 'transparent',
    color: 'var(--text-primary)',
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: 500,
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    transition: 'all 0.2s ease',
  },
  activeCategory: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
  },
};
