export type TransactionType = 'income' | 'expense' | 'tax' | 'savings' | 'remittance' | 'credit_payment';
export type PaymentMethod = 'credit_card' | 'debit_card' | 'cash' | 'online_payment' | 'check';

export interface Transaction {
    id: string;
    date: string; // ISO string
    type: TransactionType;
    category?: string; // Optional - not used for remittances and income
    amount: number;
    paymentMethod?: PaymentMethod; // For expenses, remittances, and income
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
    totalRemittances: number;
    totalCreditPayments: number;
    netCashFlow: number;
    balance: number;
}
