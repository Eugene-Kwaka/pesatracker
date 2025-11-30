import React, { useState, useMemo, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { format } from 'date-fns';
import { Edit2, Trash2, Filter, AlertTriangle, ChevronLeft, ChevronRight } from 'lucide-react';
import { Select } from './Select';
import { Input } from './Input';
import { Modal } from './Modal';
import { Button } from './Button';
import styles from './TransactionList.module.css';
import type { TransactionType, PaymentMethod } from '../types';

interface TransactionListProps {
    onEdit: (transaction: any) => void;
}

const ITEMS_PER_PAGE = 25;

export const TransactionList: React.FC<TransactionListProps> = ({ onEdit }) => {
    const { transactions, deleteTransaction } = useTransactions();
    const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
    const [filterPaymentMethod, setFilterPaymentMethod] = useState<PaymentMethod | 'all'>('all');
    const [filterDateFrom, setFilterDateFrom] = useState('');
    const [filterDateTo, setFilterDateTo] = useState('');
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    // Filter transactions
    const filteredTransactions = useMemo(() => {
        return transactions.filter((t) => {
            if (filterType !== 'all' && t.type !== filterType) return false;
            if (filterPaymentMethod !== 'all' && t.paymentMethod !== filterPaymentMethod) return false;

            const transactionDate = t.date.split('T')[0];

            if (filterDateFrom && transactionDate < filterDateFrom) return false;
            if (filterDateTo && transactionDate > filterDateTo) return false;

            return true;
        });
    }, [transactions, filterType, filterPaymentMethod, filterDateFrom, filterDateTo]);

    // Calculate totals
    const totals = useMemo(() => {
        const income = filteredTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const expenses = filteredTransactions
            .filter((t) => t.type !== 'income')
            .reduce((sum, t) => sum + Number(t.amount), 0);

        const total = income - expenses;

        return { income, expenses, total };
    }, [filteredTransactions]);

    // Pagination calculations
    const totalPages = Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [filterType, filterPaymentMethod, filterDateFrom, filterDateTo]);

    const handleDeleteClick = (id: string) => {
        setTransactionToDelete(id);
        setDeleteModalOpen(true);
    };

    const confirmDelete = async () => {
        if (!transactionToDelete) return;

        try {
            await deleteTransaction(transactionToDelete);
            setDeleteModalOpen(false);
            setTransactionToDelete(null);
        } catch (error) {
            console.error('Delete failed:', error);
            alert('Failed to delete transaction. Please try again.');
        }
    };

    const cancelDelete = () => {
        setDeleteModalOpen(false);
        setTransactionToDelete(null);
    };

    const goToPage = (page: number) => {
        setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    };

    const getPageNumbers = () => {
        const pages: (number | string)[] = [];
        const maxVisible = 5;

        if (totalPages <= maxVisible) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            if (currentPage <= 3) {
                for (let i = 1; i <= 4; i++) pages.push(i);
                pages.push('...');
                pages.push(totalPages);
            } else if (currentPage >= totalPages - 2) {
                pages.push(1);
                pages.push('...');
                for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
            } else {
                pages.push(1);
                pages.push('...');
                pages.push(currentPage - 1);
                pages.push(currentPage);
                pages.push(currentPage + 1);
                pages.push('...');
                pages.push(totalPages);
            }
        }

        return pages;
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
                    <Select
                        value={filterPaymentMethod}
                        onChange={(e) => setFilterPaymentMethod(e.target.value as any)}
                        options={[
                            { value: 'all', label: 'All Methods' },
                            { value: 'credit_card', label: 'Credit Card' },
                            { value: 'debit_card', label: 'Debit Card' },
                            { value: 'cash', label: 'Cash' },
                            { value: 'online_payment', label: 'Online Payment' },
                            { value: 'check', label: 'Check' },
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

            <div className={styles.summary}>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Income:</span>
                    <span className={styles.summaryValue} style={{ color: 'var(--color-success)' }}>
                        +${totals.income.toFixed(2)}
                    </span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Total Expenses:</span>
                    <span className={styles.summaryValue} style={{ color: 'var(--color-danger)' }}>
                        -${totals.expenses.toFixed(2)}
                    </span>
                </div>
                <div className={styles.summaryItem}>
                    <span className={styles.summaryLabel}>Net Total:</span>
                    <span className={`${styles.summaryValue} ${styles.summaryTotal}`} style={{
                        color: totals.total >= 0 ? 'var(--color-success)' : 'var(--color-danger)'
                    }}>
                        {totals.total >= 0 ? '+' : ''}${totals.total.toFixed(2)}
                    </span>
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
                        {paginatedTransactions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className={styles.empty}>No transactions found</td>
                            </tr>
                        ) : (
                            paginatedTransactions.map((t) => {
                                const dateOnly = t.date.split('T')[0];
                                const displayDate = new Date(dateOnly + 'T12:00:00');

                                return (
                                    <tr key={t.id}>
                                        <td>{format(displayDate, 'MMM d, yyyy')}</td>
                                        <td>
                                            <span className={`${styles.badge} ${styles[t.type]}`}>
                                                {t.type.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td>{t.category || '-'}</td>
                                        <td className={t.type === 'income' ? styles.income : styles.expense}>
                                            {t.type === 'income' ? '+' : '-'}${t.amount.toFixed(2)}
                                        </td>
                                        <td>{t.paymentMethod ? t.paymentMethod.replace('_', ' ') : '-'}</td>
                                        <td className={styles.notes}>{t.notes || '-'}</td>
                                        <td>
                                            <div className={styles.actions}>
                                                <button onClick={() => onEdit(t)} className={styles.actionBtn} type="button">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteClick(t.id)}
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    type="button"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {filteredTransactions.length > 0 && (
                <div className={styles.pagination}>
                    <div className={styles.paginationInfo}>
                        Showing {startIndex + 1}-{Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
                    </div>
                    <div className={styles.paginationControls}>
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            disabled={currentPage === 1}
                            className={styles.paginationBtn}
                        >
                            <ChevronLeft size={16} />
                        </button>
                        {getPageNumbers().map((page, index) => (
                            typeof page === 'number' ? (
                                <button
                                    key={index}
                                    onClick={() => goToPage(page)}
                                    className={`${styles.paginationBtn} ${currentPage === page ? styles.active : ''}`}
                                >
                                    {page}
                                </button>
                            ) : (
                                <span key={index} className={styles.paginationEllipsis}>
                                    {page}
                                </span>
                            )
                        ))}
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className={styles.paginationBtn}
                        >
                            <ChevronRight size={16} />
                        </button>
                    </div>
                </div>
            )}

            <Modal isOpen={deleteModalOpen} onClose={cancelDelete} title="Delete Transaction">
                <div className={styles.deleteModal}>
                    <div className={styles.deleteIcon}>
                        <AlertTriangle size={48} />
                    </div>
                    <p className={styles.deleteMessage}>
                        Are you sure you want to delete this transaction? This action cannot be undone.
                    </p>
                    <div className={styles.deleteActions}>
                        <Button variant="secondary" onClick={cancelDelete}>
                            Cancel
                        </Button>
                        <Button variant="primary" onClick={confirmDelete} style={{ backgroundColor: 'var(--color-danger)' }}>
                            Delete
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
