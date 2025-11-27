export type TransactionType = 'income' | 'expense' | 'tax' | 'savings' | 'donation' | 'credit_payment';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash';

export interface Transaction {
    id: string;
    date: string; // ISO string
    type: TransactionType;
    category: string;
    amount: number;
    paymentMethod?: PaymentMethod; // Only for expenses
    notes?: string;
}

export interface DailySummary {
    date: string;
    totalIncome: number;
    totalExpenses: number;
    transactions: Transaction[];
}

export interface MonthlySummary {
    month: string; // YYYY-MM
    totalIncome: number;
    totalExpenses: number;
    totalTaxes: number;
    totalSavings: number;
    totalDonations: number;
    totalCreditPayments: number;
    netCashFlow: number;
    balance: number;
}
