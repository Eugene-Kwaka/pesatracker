import type { Transaction } from '../types';

const API_URL = 'http://localhost:3000/api/transactions';

export const api = {
    async getTransactions(): Promise<Transaction[]> {
        const res = await fetch(API_URL);
        if (!res.ok) throw new Error('Failed to fetch transactions');
        return res.json();
    },

    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
        });
        if (!res.ok) throw new Error('Failed to add transaction');
        return res.json();
    },

    async updateTransaction(id: string, transaction: Partial<Transaction>): Promise<Transaction> {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(transaction),
        });
        if (!res.ok) throw new Error('Failed to update transaction');
        return res.json();
    },

    async deleteTransaction(id: string): Promise<void> {
        const res = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });
        if (!res.ok) throw new Error('Failed to delete transaction');
    },
};
