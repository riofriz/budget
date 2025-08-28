'use client';

import { BudgetSummary as BudgetSummaryType } from '../../../_types';
import { formatCurrency, getCurrencySymbol } from '../../../_utils/calculations';
import { Card } from '../../ui/Card';
import { TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react';

interface BudgetSummaryProps {
    summary: BudgetSummaryType;
    currency: string;
}

export function BudgetSummary({ summary, currency }: BudgetSummaryProps) {
    const currencySymbol = getCurrencySymbol(currency);

    const stats = [
        {
            label: 'Total Earnings',
            value: formatCurrency(summary.totalEarnings, currency),
            gradientClass: 'text-gradient-success',
            icon: currencySymbol
        },
        {
            label: 'Total Expenses',
            value: formatCurrency(summary.totalExpenses, currency),
            gradientClass: 'text-gradient-danger',
            icon: currencySymbol
        },
        {
            label: 'Net Income',
            value: formatCurrency(summary.netIncome, currency),
            gradientClass: summary.netIncome >= 0 ? 'text-gradient-primary' : 'text-gradient-danger',
            icon: summary.netIncome >= 0 ? TrendingUp : TrendingDown
        },
        {
            label: 'Projected Savings',
            value: formatCurrency(summary.projectedSavings, currency),
            gradientClass: 'text-gradient-primary',
            icon: PiggyBank
        },
        {
            label: 'Max Daily Budget',
            value: formatCurrency(summary.maxDailyBudget, currency),
            gradientClass: 'text-gradient-warning',
            icon: Calendar
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {stats.map((stat, index) => (
                <Card key={index} className="text-center p-4">
                    <div className="flex justify-center mb-2">
                        {typeof stat.icon === 'string' ? (
                            <span className="text-3xl font-bold text-gradient-primary">{stat.icon}</span>
                        ) : (
                            <stat.icon className="w-8 h-8" />
                        )}
                    </div>
                    <div className={`text-lg font-semibold ${stat.gradientClass}`}>
                        {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                        {stat.label}
                    </div>
                </Card>
            ))}
        </div>
    );
}
