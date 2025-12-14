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
    { value: 'remittance', label: 'Remittance' },
    { value: 'credit_payment', label: 'Credit Card Payment' },
];

const EXPENSE_PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'credit_card', label: 'Credit Card' },
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'cash', label: 'Cash' },
];

const REMITTANCE_PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'debit_card', label: 'Debit Card' },
    { value: 'cash', label: 'Cash' },
];

const INCOME_PAYMENT_METHODS: { value: PaymentMethod; label: string }[] = [
    { value: 'online_payment', label: 'Online Payment' },
    { value: 'check', label: 'Check' },
    { value: 'cash', label: 'Cash' },
];

export const TransactionForm: React.FC<TransactionFormProps> = ({ initialData, onSubmit, onCancel }) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [type, setType] = useState<TransactionType>('expense');
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [displayAmount, setDisplayAmount] = useState('0.00');
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('credit_card');
    const [notes, setNotes] = useState('');

    useEffect(() => {
        if (initialData) {
            setDate(initialData.date.split('T')[0]);
            setType(initialData.type);
            setCategory(initialData.category || '');
            const amountValue = initialData.amount.toString();
            setAmount(amountValue);
            setDisplayAmount(parseFloat(amountValue).toFixed(2));
            if (initialData.paymentMethod) setPaymentMethod(initialData.paymentMethod);
            if (initialData.notes) setNotes(initialData.notes);
        }
    }, [initialData]);

    // Update payment method when type changes (only for new transactions, not when editing)
    useEffect(() => {
        // Don't auto-set payment method if we're editing an existing transaction
        if (initialData) return;

        if (type === 'remittance') {
            setPaymentMethod('debit_card');
        } else if (type === 'income') {
            setPaymentMethod('online_payment');
        } else if (type === 'expense') {
            setPaymentMethod('credit_card');
        }
    }, [type, initialData]);

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const input = e.target.value.replace(/[^\d]/g, ''); // Remove non-digits

        if (input === '') {
            setAmount('');
            setDisplayAmount('0.00');
            return;
        }

        // Convert cents to dollars
        const cents = parseInt(input, 10);
        const dollars = cents / 100;

        setAmount(dollars.toString());
        setDisplayAmount(dollars.toFixed(2));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const transactionData: Omit<Transaction, 'id'> = {
            date: new Date(date).toISOString(),
            type,
            amount: parseFloat(amount) || 0,
            notes,
        };

        // Only include category for types that need it
        if (type !== 'remittance' && type !== 'income') {
            transactionData.category = category;
        }

        // Include payment method for expense, remittance, and income
        if (type === 'expense' || type === 'remittance' || type === 'income') {
            transactionData.paymentMethod = paymentMethod;
        }

        onSubmit(transactionData);
    };

    // Determine which payment methods to show
    const getPaymentMethods = () => {
        if (type === 'remittance') return REMITTANCE_PAYMENT_METHODS;
        if (type === 'income') return INCOME_PAYMENT_METHODS;
        return EXPENSE_PAYMENT_METHODS;
    };

    // Determine if category should be shown
    const showCategory = type !== 'remittance' && type !== 'income';

    // Determine if payment method should be shown
    const showPaymentMethod = type === 'expense' || type === 'remittance' || type === 'income';

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

            {showCategory && (
                <Input
                    label="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Groceries, Salary, Rent"
                    required
                />
            )}

            <Input
                label="Amount"
                type="text"
                value={displayAmount}
                onChange={handleAmountChange}
                placeholder="0.00"
                required
            />

            {showPaymentMethod && (
                <Select
                    label="Payment Method"
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                    options={getPaymentMethods()}
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
