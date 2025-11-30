import React, { ReactNode } from 'react';
import styles from './Layout.module.css';
import { LayoutDashboard, PlusCircle, PieChart, Settings, LogOut } from 'lucide-react';
import clsx from 'clsx';

interface LayoutProps {
    children: ReactNode;
    activeTab?: 'dashboard' | 'analytics' | 'settings';
    onTabChange?: (tab: 'dashboard' | 'analytics' | 'settings') => void;
    onSignOut?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, activeTab = 'dashboard', onTabChange, onSignOut }) => {
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.logo}>
                    <PieChart size={28} />
                    <span>PesaTracker</span>
                </div>

                <nav className={styles.nav}>
                    <button
                        className={clsx(styles.navItem, activeTab === 'dashboard' && styles.navItemActive)}
                        onClick={() => onTabChange?.('dashboard')}
                    >
                        <LayoutDashboard size={20} />
                        Dashboard
                    </button>

                    <button
                        className={clsx(styles.navItem, activeTab === 'analytics' && styles.navItemActive)}
                        onClick={() => onTabChange?.('analytics')}
                    >
                        <PieChart size={20} />
                        Analytics
                    </button>

                    {/* Placeholder for future settings */}
                    <button
                        className={clsx(styles.navItem, activeTab === 'settings' && styles.navItemActive)}
                        onClick={() => onTabChange?.('settings')}
                    >
                        <Settings size={20} />
                        Settings
                    </button>
                </nav>

                {onSignOut && (
                    <button className={styles.signOutBtn} onClick={onSignOut}>
                        <LogOut size={20} />
                        Sign Out
                    </button>
                )}
            </aside>

            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
};
