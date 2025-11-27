import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Card } from './Card';
import { Button } from './Button';
import { Modal } from './Modal';
import { TransactionForm } from './TransactionForm';
import { TransactionList } from './TransactionList';
import { PlusCircle, Download } from 'lucide-react';
import { format } from 'date-fns';
import type { Transaction } from '../types';
import { exportToCSV } from '../utils/exportCSV';

export const Dashboard: React.FC = () => {
    const { transactions, getMonthlySummary, addTransaction, editTransaction } = useTransactions();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState<Transaction | undefined>(undefined);

    const today = new Date();
    const monthlySummary = getMonthlySummary(today);

    const handleAddClick = () => {
        setEditingTransaction(undefined);
        setIsModalOpen(true);
    };

    const handleEditClick = (transaction: Transaction) => {
        setEditingTransaction(transaction);
        setIsModalOpen(true);
    };

    const handleSubmit = async (data: any) => {
        if (editingTransaction) {
            await editTransaction(editingTransaction.id, data);
        } else {
            await addTransaction(data);
        }
        setIsModalOpen(false);
    };

    return (
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-muted)' }}>{format(today, 'EEEE, MMMM do, yyyy')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Button variant="secondary" onClick={() => exportToCSV(transactions, `pesatrack-${format(today, 'yyyy-MM-dd')}.csv`)}>
                        <Download size={20} />
                        Export CSV
                    </Button>
                    <Button onClick={handleAddClick}>
                        <PlusCircle size={20} />
                        Add Transaction
                    </Button>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <Card title="Total Income (This Month)" value={`$${monthlySummary.totalIncome.toFixed(2)}`} />
                <Card title="Total Expenses (This Month)" value={`$${monthlySummary.totalExpenses.toFixed(2)}`} />
                <Card title="Monthly Balance" value={`$${monthlySummary.balance.toFixed(2)}`} trend={monthlySummary.balance >= 0 ? 'up' : 'down'} trendValue="Net" />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Recent Transactions</h2>
                <TransactionList onEdit={handleEditClick} />
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingTransaction ? "Edit Transaction" : "Add Transaction"}
            >
                <TransactionForm
                    initialData={editingTransaction}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsModalOpen(false)}
                />
            </Modal>
        </div>
    );
};
