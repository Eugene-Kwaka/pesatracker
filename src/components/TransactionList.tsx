import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { format, parseISO } from 'date-fns';
import { Edit2, Trash2, Filter } from 'lucide-react';
import { Select } from './Select';
import { Input } from './Input';
import styles from './TransactionList.module.css';
import type { TransactionType } from '../types';

interface TransactionListProps {
    onEdit: (transaction: any) => void;
}

export const TransactionList: React.FC<TransactionListProps> = ({ onEdit }) => {
    const { transactions, deleteTransaction } = useTransactions();
    const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');

    const filteredTransactions = transactions.filter((t) => {
        if (filterType !== 'all' && t.type !== filterType) return false;

        const transactionDate = t.date.split('T')[0]; // Get YYYY-MM-DD

        if (filterDateFrom && transactionDate < filterDateFrom) return false;
        if (filterDateTo && transactionDate > filterDateTo) return false;

        return true;
    });

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this transaction?')) {
            await deleteTransaction(id);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.filters}>
                <div className={styles.filterGroup}>
                    <Filter size={20} className={styles.filterIcon} />
                    <Select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        options={[
                            { value: 'all', label: 'All Types' },
                            { value: 'income', label: 'Income' },
                            { value: 'expense', label: 'Expense' },
                            { value: 'tax', label: 'Tax' },
                            { value: 'savings', label: 'Savings' },
                            { value: 'donation', label: 'Donation' },
                            { value: 'credit_payment', label: 'Credit Payment' },
                        ]}
                        className={styles.filterSelect}
                    />
                    <Input
                        type="date"
                        value={filterDateFrom}
                        onChange={(e) => setFilterDateFrom(e.target.value)}
                        placeholder="From"
                        className={styles.filterDate}
                    />
                    <Input
                        type="date"
                        value={filterDateTo}
                        onChange={(e) => setFilterDateTo(e.target.value)}
                        placeholder="To"
                        className={styles.filterDate}
                    />
                </div>
            </div>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Date</th>
                            <th>Type</th>
                            <th>Category</th>
                            <th>Amount</th>
                            <th>Method</th>
                            <th>Notes</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.empty}>No transactions found</td>
                            </tr>
                        ) : (
                            filteredTransactions.map((t) => (
                                <tr key={t.id}>
                                    <td>{format(parseISO(t.date), 'MMM d, yyyy')}</td>
                                    <td>
                                        <span className={`${styles.badge} ${styles[t.type]}`}>
                                            {t.type.replace('_', ' ')}
                                        </span>
                                    </td>
                                    <td>{t.category}</td>
                                    <td className={t.type === 'income' ? styles.income : styles.expense}>
                                        {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                    </td>
                                    <td>{t.paymentMethod ? t.paymentMethod.replace('_', ' ') : '-'}</td>
                                    <td className={styles.notes}>{t.notes || '-'}</td>
                                    <td>
                                        <div className={styles.actions}>
                                            <button onClick={() => onEdit(t)} className={styles.actionBtn}>
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(t.id)} className={`${styles.actionBtn} ${styles.delete}`}>
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
