import React, { useState, useEffect } from 'react';
import type { Transaction, TransactionType, PaymentMethod } from '../types';
import { Input } from './Input';
import { Select } from './Select';
import { Button } from './Button';
import styles from './TransactionForm.module.css';

interface TransactionFormProps {
    initialData?: Transaction;
    onSubmit: (data: Omit<Transaction, 'id'>) => void;
    onCancel: () => void;
}

const TRANSACTION_TYPES: { value: TransactionType; label: string }[] = [
    { value: 'income', label: 'Income' },
    { value: 'expense', label: 'Expense' },
    { value: 'tax', label: 'Tax' },
    { value: 'savings', label: 'Savings' },
    { value: 'donation', label: 'Donation' },
    { value: 'credit_payment', label: 'Credit Card Payment' },
];

const PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'cash', label: 'Cash' },
];

export const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<TransactionType>('expense');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date.split('T')[0]);
            setType(initialData.type);
            setCategory(initialData.category);
            setAmount(initialData.amount.toString());
            if (initialData.paymentMethod) setPaymentMethod(initialData.paymentMethod);
            if (initialData.notes) setNotes(initialData.notes);
        }
    }, [initialData]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({
            date: new Date(date).toISOString(),
            type,
            category,
            amount: parseFloat(amount),
            paymentMethod: type === 'expense' ? paymentMethod : undefined,
            notes,
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <Input
                label="Date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
            />

            <Select
                label="Type"
                value={type}
                onChange={(e) => setType(e.target.value as TransactionType)}
                options={TRANSACTION_TYPES}
            />

            <Input
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g., Groceries, Salary, Rent"
                required
            />

            <Input
                label="Amount"
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                required
            />

            {type === 'expense' && (
                <Select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    options={PAYMENT_METHODS}
                />
            )}

            <Input
                label="Notes (Optional)"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Additional details..."
            />

            <div className={styles.actions}>
                <Button type="button" variant="ghost" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit">
                    {initialData ? 'Update Transaction' : 'Add Transaction'}
                </Button>
            </div>
        </form>
    );
};
