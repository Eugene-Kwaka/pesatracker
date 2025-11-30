import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { TransactionProvider } from './context/TransactionContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';

function AppContent() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');
  const { user, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        fontSize: '1.25rem',
        color: 'var(--color-text-muted)'
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <TransactionProvider>
      <Layout activeTab={activeTab} onTabChange={setActiveTab} onSignOut={signOut}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <div style={{ padding: '2rem' }}>Settings coming soon...</div>}
      </Layout>
    </TransactionProvider>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
