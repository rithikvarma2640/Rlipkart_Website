import { useState, useRef, useEffect } from 'react';

export default function AdvancedChatbot({ products, onProductClick, user }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: user
        ? `Welcome back, ${user.user_metadata?.full_name || 'User'}! I'm your advanced shopping assistant. I can help you find products, get personalized recommendations based on your preferences, track orders, and much more!`
        : 'Hi! I am your advanced shopping assistant. I can help you find products, get recommendations, answer questions, and guide you through shopping. Login to unlock personalized features!',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversationContext, setConversationContext] = useState({
    budget: null,
    preferences: [],
    lastSearchResults: [],
  });
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

  const analyzeUserPreferences = (message) => {
    const lower = message.toLowerCase();
    const prefs = [...conversationContext.preferences];

    if (lower.includes('budget') || lower.includes('₹')) {
      const budgetMatch = message.match(/₹?(\d+)/);
      if (budgetMatch) {
        setConversationContext((prev) => ({
          ...prev,
          budget: parseInt(budgetMatch[1]),
        }));
      }
    }

    return prefs;
  };

  const generateSmartResponse = (userMessage) => {
    const lowerMessage = userMessage.toLowerCase();
    analyzeUserPreferences(userMessage);

    if (lowerMessage.includes('my budget') || lowerMessage.includes('under')) {
      const budgetMatch = userMessage.match(/₹?(\d+)/);
      if (budgetMatch) {
        const budget = parseInt(budgetMatch[1]);
        const affordableProducts = products.filter((p) => p.price <= budget).sort((a, b) => b.rating - a.rating).slice(0, 4);

        if (affordableProducts.length > 0) {
          return {
            text: `Great! I found ${affordableProducts.length} excellent products within your ₹${budget} budget, sorted by rating:`,
            products: affordableProducts,
          };
        }
      }
    }

    if (lowerMessage.includes('best seller') || lowerMessage.includes('most popular')) {
      const topRated = [...products].sort((a, b) => b.rating - a.rating).slice(0, 4);
      return {
        text: 'Our best-selling and top-rated products:',
        products: topRated,
      };
    }

    if (lowerMessage.includes('what\'s new') || lowerMessage.includes('latest')) {
      const latest = [...products].slice(0, 4);
      return {
        text: 'Check out our latest arrivals:',
        products: latest,
      };
    }

    if (lowerMessage.includes('compare')) {
      const comparison = products.sort((a, b) => a.price - b.price).slice(0, 3);
      return {
        text: 'Here are products we recommend for comparison:',
        products: comparison,
      };
    }

    if (lowerMessage.includes('help') || lowerMessage.includes('what can you do')) {
      return `I'm your advanced shopping assistant! Here's what I can do:

💰 Budget Recommendations: Tell me your budget and I'll find the best options
⭐ Best Sellers: Ask for most popular or top-rated items
🆕 Latest Products: I can show you what's new
🔍 Smart Search: Find exactly what you're looking for
📊 Price Comparison: Compare prices across products
🎯 Personalized Suggestions: Based on your preferences
✨ Smart Filtering: By category, price, rating
${user ? '📦 Order Tracking: Check your order history\n👤 Account Info: Manage your profile' : '\n🔐 Login to unlock: Order tracking, wishlist, personalized recommendations'}

Just ask me anything!`;
    }

    if (lowerMessage.includes('discount') || lowerMessage.includes('offer') || lowerMessage.includes('sale')) {
      const discountedProducts = products.filter((p) => p.price < 1500).slice(0, 3);
      return {
        text: 'Great savings available on these products:',
        products: discountedProducts,
      };
    }

    if (lowerMessage.includes('smartphone') || lowerMessage.includes('phone') || lowerMessage.includes('mobile')) {
      const phones = products.filter((p) => p.category === 'Electronics' && p.name.toLowerCase().includes('phone')).slice(0, 3);
      if (phones.length > 0) {
        return {
          text: 'Smartphones in our collection:',
          products: phones,
        };
      }
    }

    if (lowerMessage.includes('fashion') || lowerMessage.includes('clothes') || lowerMessage.includes('wear')) {
      const fashion = products.filter((p) => p.category === 'Clothing').slice(0, 4);
      if (fashion.length > 0) {
        return {
          text: 'Latest fashion items:',
          products: fashion,
        };
      }
    }

    if (lowerMessage.includes('review') || lowerMessage.includes('rating') || lowerMessage.includes('quality')) {
      const highRated = products.filter((p) => p.rating >= 4.5).slice(0, 3);
      if (highRated.length > 0) {
        return {
          text: 'Products with excellent reviews (4.5+ stars):',
          products: highRated,
        };
      }
    }

    const matchedProducts = findProducts(userMessage);
    if (matchedProducts.length > 0) {
      return {
        text: `Found ${matchedProducts.length} product(s) matching your search:`,
        products: matchedProducts.slice(0, 4),
      };
    }

    const responses = [
      "I can help! Try asking about:\n• Products in specific categories\n• Items within your budget\n• Best-selling items\n• Products with high ratings",
      "Not sure about that! You can ask me to:\n• Find products under a certain price\n• Show top-rated items\n• Search for specific products\n• Compare prices",
      "Let me help you find what you're looking for! You can:\n• Ask about electronics, clothing, shoes, etc.\n• Set a budget (e.g., 'under 2000')\n• Request recommendations\n• Ask for latest products",
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(() => {
      const response = generateSmartResponse(input);
      const assistantMessage = {
        role: 'assistant',
        content: typeof response === 'string' ? response : response.text,
        products: typeof response === 'object' ? response.products : null,
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1000);
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
          <div>
            <span style={styles.titleText}>Advanced Assistant</span>
            {user && <span style={styles.userBadge}>Premium</span>}
          </div>
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
                      <div style={styles.productRating}>
                        <span style={styles.star}>★</span> {product.rating}
                      </div>
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
          placeholder="Ask me anything..."
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
    width: '420px',
    height: '600px',
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
  },
  titleText: {
    fontSize: '16px',
    fontWeight: 600,
  },
  userBadge: {
    fontSize: '11px',
    backgroundColor: 'var(--primary-orange)',
    color: 'white',
    padding: '2px 8px',
    borderRadius: '12px',
    marginTop: '2px',
    display: 'inline-block',
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
    maxWidth: '80%',
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  assistantBubble: {
    backgroundColor: 'white',
    color: 'var(--text-primary)',
    padding: '10px 14px',
    borderRadius: '16px 16px 16px 4px',
    maxWidth: '80%',
    fontSize: '13px',
    lineHeight: '1.6',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)',
    whiteSpace: 'pre-wrap',
    wordWrap: 'break-word',
  },
  productList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    width: '100%',
    maxWidth: '340px',
  },
  productItem: {
    backgroundColor: 'white',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    gap: '12px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid var(--border-color)',
  },
  productImage: {
    width: '70px',
    height: '70px',
    objectFit: 'cover',
    borderRadius: '4px',
    flexShrink: 0,
  },
  productInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
    justifyContent: 'center',
  },
  productName: {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-primary)',
    lineHeight: '1.3',
  },
  productPrice: {
    fontSize: '15px',
    fontWeight: 700,
    color: 'var(--text-primary)',
  },
  productRating: {
    fontSize: '12px',
    color: 'var(--success)',
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },
  star: {
    color: 'var(--primary-orange)',
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
    fontSize: '13px',
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
