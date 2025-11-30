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
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated');
        }

        const { data, error } = await supabase
            .from('transactions')
            .insert([{
                date: transaction.date,
                type: transaction.type,
                ...(transaction.category && { category: transaction.category }),
                amount: transaction.amount,
                payment_method: transaction.paymentMethod,
                notes: transaction.notes,
                user_id: user.id,
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
        const updateData: any = {};

        if (updates.date) updateData.date = updates.date;
        if (updates.type) updateData.type = updates.type;
        if (updates.category !== undefined) updateData.category = updates.category;
        if (updates.amount !== undefined) updateData.amount = updates.amount;
        if (updates.paymentMethod !== undefined) updateData.payment_method = updates.paymentMethod;
        if (updates.notes !== undefined) updateData.notes = updates.notes;

        const { data, error } = await supabase
            .from('transactions')
            .update(updateData)
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
