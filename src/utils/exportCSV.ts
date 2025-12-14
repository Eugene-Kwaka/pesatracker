import type { Transaction } from '../types';

const escapeCSVField = (value: string | number): string => {
    const stringValue = String(value);
    if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
    }
    return stringValue;
};

export const exportToCSV = (transactions: Transaction[], filename: string = 'transactions.csv') => {
    if (!transactions || transactions.length === 0) {
        alert('No transactions to export');
        return;
    }

    try {
        const headers = ['Date', 'Type', 'Category', 'Amount', 'Payment Method', 'Notes'];

        const rows = transactions.map(t => [
            escapeCSVField(new Date(t.date).toLocaleDateString()),
            escapeCSVField(t.type),
            escapeCSVField(t.category || ''),
            escapeCSVField(t.amount.toFixed(2)),
            escapeCSVField(t.paymentMethod || ''),
            escapeCSVField(t.notes || '')
        ]);

        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.join(','))
        ].join('\r\n');

        const BOM = '\ufeff';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);

        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';

        document.body.appendChild(link);
        link.click();

        setTimeout(() => {
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }, 100);

        console.log(`Successfully exported ${transactions.length} transactions to ${filename}`);
    } catch (error) {
        console.error('Error exporting CSV:', error);
        alert('Failed to export CSV. Please try again.');
    }
};