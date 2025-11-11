import { useState, useRef, useEffect } from 'react';

export default function Chatbot({ products, onProductClick }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Hi! I am your shopping assistant. I can help you find products, answer questions about items, or guide you through your shopping journey. How can I help you today?',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const findProducts = (query) => {
    const searchTerm = query.toLowerCase();
    return products.filter(
      (p) =>
        p.name.toLowerCase().includes(searchTerm) ||
        p.description.toLowerCase().includes(searchTerm) ||
        p.category.toLowerCase().includes(searchTerm)
    );
  };

  const generateResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return 'Hello! How can I assist you with your shopping today?';
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return 'I can help you:\n• Search for products\n• Get product recommendations\n• Answer questions about pricing and availability\n• Guide you through checkout\n\nJust ask me anything!';
    }

    if (lowerMessage.includes('price') || lowerMessage.includes('cost') || lowerMessage.includes('cheap')) {
      const affordableProducts = products.filter((p) => p.price < 1500).slice(0, 3);
      if (affordableProducts.length > 0) {
        return {
          text: 'Here are some affordable options:',
          products: affordableProducts,
        };
      }
    }

    if (lowerMessage.includes('recommend') || lowerMessage.includes('suggest') || lowerMessage.includes('best')) {
      const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 3);
      return {
        text: 'Here are our top-rated products:',
        products: topRated,
      };
    }

    if (lowerMessage.includes('electronic') || lowerMessage.includes('gadget') || lowerMessage.includes('device')) {
      const electronics = products.filter((p) => p.category === 'Electronics').slice(0, 3);
      if (electronics.length > 0) {
        return {
          text: 'Here are some electronics you might like:',
          products: electronics,
        };
      }
    }

    if (lowerMessage.includes('cloth') || lowerMessage.includes('shirt') || lowerMessage.includes('wear')) {
      const clothing = products.filter((p) => p.category === 'Clothing').slice(0, 3);
      if (clothing.length > 0) {
        return {
          text: 'Check out these clothing items:',
          products: clothing,
        };
      }
    }

    const matchedProducts = findProducts(userMessage);
    if (matchedProducts.length > 0) {
      return {
        text: `I found ${matchedProducts.length} product(s) matching your search:`,
        products: matchedProducts.slice(0, 3),
      };
    }

    return "I'm not sure about that. Try asking me about specific products, categories, or for recommendations!";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateResponse(input);
      const assistantMessage = {
        role: 'assistant',
        content: typeof response === 'string' ? response : response.text,
        products: typeof response === 'object' ? response.products : null,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 800);
  };

  if (!isOpen) {
    return (
      <button onClick={() => setIsOpen(true)} style={styles.fab}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </button>
    );
  }

  return (
    <div style={styles.chatbot}>
      <div style={styles.chatHeader}>
        <div style={styles.chatTitle}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          <span>Shopping Assistant</span>
        </div>
        <button onClick={() => setIsOpen(false)} style={styles.closeBtn}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>

      <div style={styles.chatMessages}>
        {messages.map((msg, idx) => (
          <div key={idx} style={msg.role === 'user' ? styles.userMessage : styles.assistantMessage}>
            <div style={msg.role === 'user' ? styles.userBubble : styles.assistantBubble}>
              {msg.content}
            </div>
            {msg.products && (
              <div style={styles.productList}>
                {msg.products.map((product) => (
                  <div
                    key={product.id}
                    style={styles.productItem}
                    onClick={() => {
                      onProductClick(product);
                      setIsOpen(false);
                    }}
                  >
                    <img src={product.image_url} alt={product.name} style={styles.productImage} />
                    <div style={styles.productInfo}>
                      <div style={styles.productName}>{product.name}</div>
                      <div style={styles.productPrice}>₹{product.price.toLocaleString()}</div>
                      <div style={styles.productRating}>{product.rating} ★</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isTyping && (
          <div style={styles.assistantMessage}>
            <div style={styles.typingIndicator}>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div style={styles.chatInput}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          placeholder="Ask me about products..."
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.sendBtn} disabled={!input.trim()}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="22" y1="2" x2="11" y2="13" />
            <polygon points="22 2 15 22 11 13 2 9 22 2" />
          </svg>
        </button>
      </div>
    </div>
  );
}

const styles = {
  fab: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  chatbot: {
    position: 'fixed',
    bottom: '24px',
    right: '24px',
    width: '380px',
    height: '550px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    display: 'flex',
    flexDirection: 'column',
    zIndex: 1000,
    overflow: 'hidden',
  },
  chatHeader: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    padding: '16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chatTitle: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '16px',
    fontWeight: 600,
  },
  closeBtn: {
    backgroundColor: 'transparent',
    color: 'white',
    padding: '4px',
  },
  chatMessages: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    backgroundColor: 'var(--bg-gray)',
  },
  userMessage: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  assistantMessage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '8px',
  },
  userBubble: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    padding: '10px 14px',
    borderRadius: '16px 16px 4px 16px',
    maxWidth: '75%',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
  },
  assistantBubble: {
    backgroundColor: 'white',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    maxWidth: '75%',
    fontSize: '14px',
    lineHeight: '1.5',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    whiteSpace: 'pre-wrap',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '12px',
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  productImage: {
    width: '60px',
    height: '60px',
    objectFit: 'cover',
    borderRadius: '4px',
  },
  productInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  productName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
  },
  productPrice: {
    fontSize: '14px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  productRating: {
    fontSize: '12px',
    color: 'var(--success)',
    fontWeight: 600,
  },
  typingIndicator: {
    backgroundColor: 'white',
    padding: '14px 18px',
    borderRadius: '16px 16px 16px 4px',
    display: 'flex',
    gap: '6px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
  },
  chatInput: {
    padding: '16px',
    borderTop: '1px solid var(--border-color)',
    display: 'flex',
    gap: '8px',
    backgroundColor: 'white',
  },
  input: {
    flex: 1,
    padding: '10px 14px',
    border: '1px solid var(--border-color)',
    borderRadius: '20px',
    fontSize: '14px',
  },
  sendBtn: {
    backgroundColor: 'var(--primary-blue)',
    color: 'white',
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
};
