import { useState } from 'react';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { Analytics } from './components/Analytics';
import { TransactionProvider } from './context/TransactionContext';

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'analytics' | 'settings'>('dashboard');

  return (
    <TransactionProvider>
      <Layout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'analytics' && <Analytics />}
        {activeTab === 'settings' && <div style={{ padding: '2rem' }}>Settings coming soon...</div>}
      </Layout>
    </TransactionProvider>
  );
}

export default App;
