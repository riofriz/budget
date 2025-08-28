'use client';

import { Earning, Expense, Category } from '../../../_types';
import { formatCurrency } from '../../../_utils/calculations';
import { Card } from '../../ui/Card';
import { TrendingUp, TrendingDown, PieChart } from 'lucide-react';

interface BudgetChartProps {
    earnings: Earning[];
    expenses: Expense[];
    categories: Category[];
    currency: string;
}

interface CategoryData {
    category: Category;
    total: number;
    count: number;
}

export function BudgetChart({ earnings, expenses, categories, currency }: BudgetChartProps) {
    const getCategoryData = (): CategoryData[] => {
        const categoryMap = new Map<string, CategoryData>();

        // Initialize with all expense categories
        categories
            .filter(cat => cat.type === 'expense')
            .forEach(category => {
                categoryMap.set(category.id, {
                    category,
                    total: 0,
                    count: 0
                });
            });

        // Sum up expenses by category
        expenses.forEach(expense => {
            const categoryId = expense.categoryId || 'other';
            const existing = categoryMap.get(categoryId);
            if (existing) {
                existing.total += expense.amount;
                existing.count += 1;
            }
        });

        // Convert to array and sort by total amount (highest first)
        return Array.from(categoryMap.values())
            .filter(data => data.total > 0) // Only show categories with expenses
            .sort((a, b) => b.total - a.total)
            .slice(0, 5); // Only show top 5 categories
    };

    const categoryData = getCategoryData();
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);

    if (categoryData.length === 0) {
        return null; // Don't render anything if no expenses
    }

    return (
        <Card className="p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <PieChart className="w-4 h-4 text-muted-foreground" />
                    <h3 className="text-sm font-medium">Top Spending Categories</h3>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <div className="flex items-center text-success">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        <span>{formatCurrency(totalEarnings, currency)}</span>
                    </div>
                    <div className="flex items-center text-danger">
                        <TrendingDown className="w-3 h-3 mr-1" />
                        <span>{formatCurrency(totalExpenses, currency)}</span>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {categoryData.map((data) => (
                    <div key={data.category.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: data.category.color }}
                            />
                            <span className="font-medium">{data.category.name}</span>
                            <span className="text-muted-foreground">
                                ({data.count})
                            </span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-danger">
                                {formatCurrency(data.total, currency)}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {((data.total / totalExpenses) * 100).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">Net Income</span>
                    <span className={`font-semibold ${totalEarnings - totalExpenses >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(totalEarnings - totalExpenses, currency)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
