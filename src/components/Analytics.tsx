import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Card } from './Card';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, LineChart, Line } from 'recharts';
import styles from './Analytics.module.css';

const COLORS = ['#00f2ff', '#7000ff', '#10b981', '#f59e0b', '#ef4444', '#3b82f6'];

export const Analytics: React.FC = () => {
    const { transactions } = useTransactions();

    // Spending breakdown by payment method
    const paymentMethodData = [
        {
            name: 'Credit Card',
            value: transactions.filter(t => t.type === 'expense' && t.paymentMethod === 'credit_card').reduce((sum, t) => sum + Number(t.amount), 0)
        },
        {
            name: 'Debit Card',
            value: transactions.filter(t => t.type === 'expense' && t.paymentMethod === 'debit_card').reduce((sum, t) => sum + Number(t.amount), 0)
        },
        {
            name: 'Cash',
            value: transactions.filter(t => t.type === 'expense' && t.paymentMethod === 'cash').reduce((sum, t) => sum + Number(t.amount), 0)
        },
    ].filter(item => item.value > 0);

    // Spending by category
    const categoryData = transactions
        .filter(t => t.type === 'expense')
        .reduce((acc, t) => {
            const existing = acc.find(item => item.name === t.category);
            if (existing) {
                existing.value += Number(t.amount);
            } else {
                acc.push({ name: t.category, value: Number(t.amount) });
            }
            return acc;
        }, [] as { name: string; value: number }[])
        .sort((a, b) => b.value - a.value)
        .slice(0, 6);

    // Income vs Expenses by type
    const typeData = [
        {
            name: 'Income',
            amount: transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0)
        },
        {
            name: 'Expenses',
            amount: transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0)
        },
        {
            name: 'Taxes',
            amount: transactions.filter(t => t.type === 'tax').reduce((sum, t) => sum + Number(t.amount), 0)
        },
        {
            name: 'Savings',
            amount: transactions.filter(t => t.type === 'savings').reduce((sum, t) => sum + Number(t.amount), 0)
        },
        {
            name: 'Remittances',
            amount: transactions.filter(t => t.type === 'remittance').reduce((sum, t) => sum + Number(t.amount), 0)
        },
    ].filter(item => item.amount > 0);

    // Monthly trend (last 6 months)
    const monthlyTrend = transactions.reduce((acc, t) => {
        const month = t.date.substring(0, 7); // YYYY-MM
        const existing = acc.find(item => item.month === month);
        const amount = Number(t.amount);

        if (existing) {
            if (t.type === 'income') existing.income += amount;
            if (t.type === 'expense') existing.expenses += amount;
        } else {
            acc.push({
                month,
                income: t.type === 'income' ? amount : 0,
                expenses: t.type === 'expense' ? amount : 0,
            });
        }
        return acc;
    }, [] as { month: string; income: number; expenses: number }[])
        .sort((a, b) => a.month.localeCompare(b.month))
        .slice(-6);

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Analytics</h1>

            <div className={styles.grid}>
                <Card title="Total Transactions" value={transactions.length.toString()} />
                <Card
                    title="Total Income"
                    value={`$${transactions.filter(t => t.type === 'income').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}`}
                />
                <Card
                    title="Total Expenses"
                    value={`$${transactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + Number(t.amount), 0).toFixed(2)}`}
                />
            </div>

            <div className={styles.chartsGrid}>
                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Spending by Payment Method</h2>
                    {paymentMethodData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={paymentMethodData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {paymentMethodData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                            </PieChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={styles.noData}>No expense data available</p>
                    )}
                </div>

                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Top Spending Categories</h2>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={categoryData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                <Bar dataKey="value" fill="#00f2ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={styles.noData}>No category data available</p>
                    )}
                </div>

                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Income vs Expenses by Type</h2>
                    {typeData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={typeData}>
                                <XAxis dataKey="name" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                <Legend />
                                <Bar dataKey="amount" fill="#7000ff" />
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={styles.noData}>No transaction data available</p>
                    )}
                </div>

                <div className={styles.chartCard}>
                    <h2 className={styles.chartTitle}>Monthly Trend (Last 6 Months)</h2>
                    {monthlyTrend.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={monthlyTrend}>
                                <XAxis dataKey="month" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <Tooltip formatter={(value: number) => `$${value.toFixed(2)}`} />
                                <Legend />
                                <Line type="monotone" dataKey="income" stroke="#10b981" strokeWidth={2} />
                                <Line type="monotone" dataKey="expenses" stroke="#ef4444" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <p className={styles.noData}>No trend data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};
