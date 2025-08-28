'use client';

import { useState } from 'react';
import { Earning, Expense } from '../../../_types';
import { formatCurrency } from '../../../_utils/calculations';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { ChevronLeft, ChevronRight, TrendingUp, TrendingDown } from 'lucide-react';

interface BudgetChartProps {
    earnings: Earning[];
    expenses: Expense[];
    currency: string;
}

interface ChartData {
    date: string;
    earnings: number;
    expenses: number;
    net: number;
    dayName: string;
    dayNumber: number;
}

export function BudgetChart({ earnings, expenses, currency }: BudgetChartProps) {
    const [weekOffset, setWeekOffset] = useState(0);

    const getChartData = (): ChartData[] => {
        const dataMap = new Map<string, ChartData>();
        const today = new Date();

        // Calculate the start of the current week (Sunday)
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay() + (weekOffset * 7));

        // Generate 7 days starting from the week start
        for (let i = 0; i < 7; i++) {
            const date = new Date(startOfWeek);
            date.setDate(startOfWeek.getDate() + i);
            const dateStr = date.toISOString().split('T')[0];

            dataMap.set(dateStr, {
                date: dateStr,
                earnings: 0,
                expenses: 0,
                net: 0,
                dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
                dayNumber: date.getDate()
            });
        }

        // Add earnings based on due date or creation date
        earnings.forEach(earning => {
            let dateStr: string;

            if (earning.dueDate) {
                // If due date exists, it's recurring - find the matching day in the week
                const matchingDay = Array.from(dataMap.values()).find(day => day.dayNumber === earning.dueDate);
                if (matchingDay) {
                    dateStr = matchingDay.date;
                } else {
                    return; // Skip if day not in current week
                }
            } else {
                dateStr = new Date(earning.createdAt).toISOString().split('T')[0];
            }

            if (dataMap.has(dateStr)) {
                const data = dataMap.get(dateStr)!;
                data.earnings += earning.amount;
                data.net = data.earnings - data.expenses;
            }
        });

        expenses.forEach(expense => {
            let dateStr: string;

            if (expense.dueDate) {
                // If due date exists, it's recurring - find the matching day in the week
                const matchingDay = Array.from(dataMap.values()).find(day => day.dayNumber === expense.dueDate);
                if (matchingDay) {
                    dateStr = matchingDay.date;
                } else {
                    return; // Skip if day not in current week
                }
            } else {
                dateStr = new Date(expense.createdAt).toISOString().split('T')[0];
            }

            if (dataMap.has(dateStr)) {
                const data = dataMap.get(dateStr)!;
                data.expenses += expense.amount;
                data.net = data.earnings - data.expenses;
            }
        });

        return Array.from(dataMap.values());
    };

    const chartData = getChartData();
    const maxValue = Math.max(
        ...chartData.map(d => Math.max(d.earnings, d.expenses))
    );

    const getBarHeight = (value: number) => {
        if (maxValue === 0) return 0;
        const height = (value / maxValue) * 100;
        return Math.max(height, 4);
    };

    const totalEarnings = chartData.reduce((sum, d) => sum + d.earnings, 0);
    const totalExpenses = chartData.reduce((sum, d) => sum + d.expenses, 0);
    const netIncome = totalEarnings - totalExpenses;

    const getWeekLabel = () => {
        const firstDay = new Date(chartData[0]?.date || new Date());
        const lastDay = new Date(chartData[6]?.date || new Date());

        if (weekOffset === 0) {
            return 'This Week';
        } else if (weekOffset === -1) {
            return 'Last Week';
        } else if (weekOffset === 1) {
            return 'Next Week';
        } else {
            return `${firstDay.toLocaleDateString()} - ${lastDay.toLocaleDateString()}`;
        }
    };

    return (
        <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold">{getWeekLabel()}</h3>
                    <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center text-success">
                            <TrendingUp className="w-4 h-4 mr-1" />
                            <span>Earnings: {formatCurrency(totalEarnings, currency)}</span>
                        </div>
                        <div className="flex items-center text-danger">
                            <TrendingDown className="w-4 h-4 mr-1" />
                            <span>Expenses: {formatCurrency(totalExpenses, currency)}</span>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(prev => prev - 1)}
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(0)}
                        disabled={weekOffset === 0}
                    >
                        Today
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setWeekOffset(prev => prev + 1)}
                    >
                        <ChevronRight className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="h-64 flex items-end justify-between gap-1">
                {chartData.map((data, index) => (
                    <div key={data.date} className="flex-1 flex flex-col items-center">
                        <div className="w-full h-full flex items-end justify-center gap-1 pb-12">
                            {/* Earnings bar */}
                            <div
                                className="w-1/2 bg-success rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                                style={{ height: `${getBarHeight(data.earnings)}%` }}
                                title={`Earnings: ${formatCurrency(data.earnings, currency)}`}
                            />
                            {/* Expenses bar */}
                            <div
                                className="w-1/2 bg-danger rounded-t-sm transition-all duration-300 hover:opacity-80 cursor-pointer"
                                style={{ height: `${getBarHeight(data.expenses)}%` }}
                                title={`Expenses: ${formatCurrency(data.expenses, currency)}`}
                            />
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-medium text-muted-foreground">
                                {data.dayName} {data.dayNumber}
                            </div>
                            <div className={`text-xs font-semibold mt-1 ${data.net >= 0 ? 'text-success' : 'text-danger'}`}>
                                {formatCurrency(data.net, currency)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 pt-4 border-t border-border">
                <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Net Income ({getWeekLabel()})</span>
                    <span className={`font-semibold ${netIncome >= 0 ? 'text-success' : 'text-danger'}`}>
                        {formatCurrency(netIncome, currency)}
                    </span>
                </div>
            </div>
        </Card>
    );
}
