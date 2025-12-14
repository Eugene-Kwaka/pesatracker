import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Transaction, DailySummary, MonthlySummary } from '../types';
import { api } from '../utils/api';
import { format } from 'date-fns';

interface TransactionContextType {
    transactions: Transaction[];
    addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
    editTransaction: (id: string, updatedTransaction: Partial<Transaction>) => Promise<void>;
    deleteTransaction: (id: string) => Promise<void>;
    getDailySummary: (date: Date) => DailySummary;
    getMonthlySummary: (date: Date) => MonthlySummary;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchTransactions = async () => {
        try {
            const data = await api.getTransactions();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    // Helper function to sort transactions by date in descending order
    const sortTransactions = (transactions: Transaction[]): Transaction[] => {
        return [...transactions].sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA; // Descending order (newest first)
        });
    };

    const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
        try {
            const newTransaction = await api.addTransaction(transaction);
            setTransactions((prev) => sortTransactions([newTransaction, ...prev]));
        } catch (error) {
            console.error('Error adding transaction:', error);
        }
    };

    const editTransaction = async (id: string, updatedTransaction: Partial<Transaction>) => {
        try {
            const updated = await api.updateTransaction(id, updatedTransaction);
            setTransactions((prev) =>
                sortTransactions(prev.map((t) => (t.id === id ? updated : t)))
            );
        } catch (error) {
            console.error('Error updating transaction:', error);
        }
    };

    const deleteTransaction = async (id: string) => {
        try {
            await api.deleteTransaction(id);
            setTransactions((prev) => prev.filter((t) => t.id !== id));
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    const getDailySummary = (date: Date): DailySummary => {
        const targetDate = format(date, 'yyyy-MM-dd');
        const dailyTransactions = transactions.filter((t) => t.date.startsWith(targetDate));

        const totalIncome = dailyTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const totalExpenses = dailyTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        return {
            date: date.toISOString(),
            totalIncome,
            totalExpenses,
            transactions: dailyTransactions,
        };
    };

    const getMonthlySummary = (date: Date): MonthlySummary => {
        // Calculate billing cycle from 8th to 8th
        const currentDay = date.getDate();

        let cycleStartDate: Date;
        let cycleEndDate: Date;

        if (currentDay >= 8) {
            cycleStartDate = new Date(date.getFullYear(), date.getMonth(), 8);
            cycleEndDate = new Date(date.getFullYear(), date.getMonth() + 1, 8);
        } else {
            cycleStartDate = new Date(date.getFullYear(), date.getMonth() - 1, 8);
            cycleEndDate = new Date(date.getFullYear(), date.getMonth(), 8);
        }

        // Filter transactions within the billing cycle using date strings
        const cycleStart = format(cycleStartDate, 'yyyy-MM-dd');
        const cycleEnd = format(cycleEndDate, 'yyyy-MM-dd');

        const monthlyTransactions = transactions.filter((t) => {
            const transactionDate = t.date.split('T')[0];
            return transactionDate >= cycleStart && transactionDate < cycleEnd;
        });

        const totalIncome = monthlyTransactions
            .filter((t) => t.type === 'income')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const totalExpenses = monthlyTransactions
            .filter((t) => t.type === 'expense')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const totalTaxes = monthlyTransactions
            .filter((t) => t.type === 'tax')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const totalSavings = monthlyTransactions
            .filter((t) => t.type === 'savings')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const totalRemittances = monthlyTransactions
            .filter((t) => t.type === 'remittance')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const totalCreditPayments = monthlyTransactions
            .filter((t) => t.type === 'credit_payment')
            .reduce((sum, t) => Number(sum) + Number(t.amount), 0);

        const balance = totalIncome - totalExpenses - totalTaxes - totalSavings - totalRemittances;

        return {
            month: format(cycleStartDate, 'MMM d') + ' - ' + format(cycleEndDate, 'MMM d, yyyy'),
            totalIncome,
            totalExpenses,
            totalTaxes,
            totalSavings,
            totalRemittances,
            totalCreditPayments,
            netCashFlow: balance,
            balance,
        };
    };

    return (
        <TransactionContext.Provider
            value={{
                transactions,
                addTransaction,
                editTransaction,
                deleteTransaction,
                getDailySummary,
                getMonthlySummary,
            }}
        >
            {children}
        </TransactionContext.Provider>
    );
};

export const useTransactions = () => {
    const context = useContext(TransactionContext);
    if (context === undefined) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
};
