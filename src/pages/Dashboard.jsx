import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session?.user) {
        window.location.href = '/';
        return;
      }

      setUser(sessionData.session.user);

      const { data: loginHistory } = await supabase
        .from('login_history')
        .select('*')
        .eq('user_id', sessionData.session.user.id)
        .order('login_at', { ascending: false });

      setOrders(loginHistory || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Dashboard</h1>
        <button onClick={handleLogout} style={styles.logoutBtn}>
          Logout
        </button>
      </div>

      {user && (
        <div style={styles.card}>
          <h2>Welcome, {user.user_metadata?.full_name || user.email}!</h2>
          <div style={styles.info}>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Account Created:</strong>{' '}
              {new Date(user.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      )}

      <div style={styles.card}>
        <h2>Login History</h2>
        {orders.length > 0 ? (
          <div style={styles.table}>
            <div style={styles.tableHeader}>
              <div style={styles.tableCell}>Email</div>
              <div style={styles.tableCell}>IP Address</div>
              <div style={styles.tableCell}>Login Time</div>
            </div>
            {orders.map((order) => (
              <div key={order.id} style={styles.tableRow}>
                <div style={styles.tableCell}>{order.email}</div>
                <div style={styles.tableCell}>{order.ip_address || 'N/A'}</div>
                <div style={styles.tableCell}>
                  {new Date(order.login_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p>No login history available.</p>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '40px 20px',
    fontFamily: 'Inter, sans-serif',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '40px',
    paddingBottom: '20px',
    borderBottom: '2px solid #E0E0E0',
  },
  logoutBtn: {
    backgroundColor: '#D32F2F',
    color: 'white',
    padding: '10px 20px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  },
  info: {
    marginTop: '16px',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  tableHeader: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    padding: '12px',
    backgroundColor: '#F5F5F5',
    borderRadius: '8px 8px 0 0',
    fontWeight: 600,
    borderBottom: '2px solid #E0E0E0',
  },
  tableRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '16px',
    padding: '12px',
    borderBottom: '1px solid #E0E0E0',
  },
  tableCell: {
    padding: '8px 0',
  },
};
