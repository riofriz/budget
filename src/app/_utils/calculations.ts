import { BudgetSummary, Earning, Expense } from '../_types';

export function calculateBudgetSummary(earnings: Earning[], expenses: Expense[]): BudgetSummary {
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const netIncome = totalEarnings - totalExpenses;
    const maxDailyBudget = netIncome > 0 ? netIncome / 30 : 0;

    // Smart savings calculation: if daily budget is reasonable, show potential monthly savings
    // If daily budget is too low, show how much more you'd need to earn
    let projectedSavings = 0;
    if (netIncome > 0) {
        const reasonableDailyBudget = 50; // Assume $50/day is reasonable
        if (maxDailyBudget >= reasonableDailyBudget) {
            // You can save the excess above reasonable daily budget
            projectedSavings = (maxDailyBudget - reasonableDailyBudget) * 30;
        } else {
            // Daily budget is too low, show how much more you'd need
            projectedSavings = (reasonableDailyBudget - maxDailyBudget) * 30;
        }
    }

    return {
        totalEarnings,
        totalExpenses,
        netIncome,
        projectedSavings,
        maxDailyBudget
    };
}

export function formatCurrency(amount: number, currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).format(amount);
}

export function getCurrencySymbol(currency: string = 'USD'): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency
    }).formatToParts(0).find(part => part.type === 'currency')?.value || '$';
}

export function getRandomColor(): string {
    const colors = [
        '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
        '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
}
