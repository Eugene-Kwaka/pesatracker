import type { Transaction } from '../types';
import { supabase } from '../lib/supabase';

export const api = {
    async getTransactions(): Promise<Transaction[]> {
        const { data, error } = await supabase
            .from('transactions')
            .select('*')
            .order('date', { ascending: false });

        if (error) {
            console.error('Error fetching transactions:', error);
            throw error;
        }

        // Map snake_case from DB to camelCase for frontend
        return (data || []).map(row => ({
            id: row.id,
            date: row.date,
            type: row.type,
            category: row.category,
            amount: row.amount,
            paymentMethod: row.payment_method,
            notes: row.notes,
        }));
    },

    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                date: transaction.date,
                type: transaction.type,
                category: transaction.category,
                amount: transaction.amount,
                payment_method: transaction.paymentMethod,
                notes: transaction.notes,
            }])
            .select()
            .single();

        if (error) {
            console.error('Error adding transaction:', error);
            throw error;
        }

        return {
            id: data.id,
            date: data.date,
            type: data.type,
            category: data.category,
            amount: data.amount,
            paymentMethod: data.payment_method,
            notes: data.notes,
        };
    },

    async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
        const { data, error } = await supabase
            .from('transactions')
            .update({
                ...(updates.date && { date: updates.date }),
                ...(updates.type && { type: updates.type }),
                ...(updates.category && { category: updates.category }),
                ...(updates.amount !== undefined && { amount: updates.amount }),
                ...(updates.paymentMethod !== undefined && { payment_method: updates.paymentMethod }),
                ...(updates.notes !== undefined && { notes: updates.notes }),
            })
            .eq('id', id)
            .select()
            .single();

        if (error) {
            console.error('Error updating transaction:', error);
            throw error;
        }

        return {
            id: data.id,
            date: data.date,
            type: data.type,
            category: data.category,
            amount: data.amount,
            paymentMethod: data.payment_method,
            notes: data.notes,
        };
    },

    async deleteTransaction(id: string): Promise<void> {
        console.log('Deleting transaction with ID:', id);

        const { error } = await supabase
            .from('transactions')
            .delete()
            .eq('id', id);

        if (error) {
            console.error('Error deleting transaction:', error);
            throw error;
        }

        console.log('Transaction deleted successfully');
    },
};
