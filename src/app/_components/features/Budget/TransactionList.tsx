'use client';

import { Earning, Expense, Person } from '../../../_types';
import { formatCurrency } from '../../../_utils/calculations';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Edit, Trash2, TrendingUp, TrendingDown } from 'lucide-react';

interface TransactionListProps {
    earnings: Earning[];
    expenses: Expense[];
    people: Person[];
    currency: string;
    onEditEarning?: (earning: Earning) => void;
    onEditExpense?: (expense: Expense) => void;
    onDeleteEarning?: (earningId: string) => void;
    onDeleteExpense?: (expenseId: string) => void;
}

export function TransactionList({
    earnings,
    expenses,
    people,
    currency,
    onEditEarning,
    onEditExpense,
    onDeleteEarning,
    onDeleteExpense
}: TransactionListProps) {
    const getPersonNames = (transactionPeople: { personId: string; amount: number }[] | undefined) => {
        if (!transactionPeople || transactionPeople.length === 0) return 'Unknown';

        const names = transactionPeople.map(tp => {
            const person = people.find(p => p.id === tp.personId);
            return person?.name || 'Unknown';
        });

        return names.join(', ');
    };

    const getPersonColors = (transactionPeople: { personId: string; amount: number }[] | undefined) => {
        if (!transactionPeople || transactionPeople.length === 0) return ['#000000'];

        return transactionPeople.map(tp => {
            const person = people.find(p => p.id === tp.personId);
            return person?.color || '#000000';
        });
    };

    const getExpenseInfo = (expense: Expense) => {
        const createdDate = new Date(expense.createdAt).toLocaleDateString();

        if (expense.dueDate && expense.isRecurring) {
            return `Due: ${expense.dueDate}th • Recurring`;
        } else if (expense.dueDate) {
            return `Due: ${expense.dueDate}th`;
        } else {
            return createdDate;
        }
    };

    const getEarningInfo = (earning: Earning) => {
        const createdDate = new Date(earning.createdAt).toLocaleDateString();

        if (earning.dueDate && earning.isRecurring) {
            return `Due: ${earning.dueDate}th • Recurring`;
        } else if (earning.dueDate) {
            return `Due: ${earning.dueDate}th`;
        } else {
            return createdDate;
        }
    };

    if (earnings.length === 0 && expenses.length === 0) {
        return (
            <Card className="p-6 text-center">
                <p className="text-muted-foreground">No transactions yet. Add some earnings or expenses to get started!</p>
            </Card>
        );
    }

    return (
        <div className="space-y-4">
            {earnings.length > 0 && (
                <div>
                    <div className="flex items-center mb-3">
                        <TrendingUp className="w-5 h-5 text-success mr-2" />
                        <h3 className="text-lg font-semibold text-success">Earnings</h3>
                        <span className="ml-2 text-sm text-muted-foreground">({earnings.length})</span>
                    </div>
                    <div className="space-y-2">
                        {earnings.map((earning) => {
                            const personColors = getPersonColors(earning.people);
                            const personNames = getPersonNames(earning.people);

                            return (
                                <div key={earning.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-1">
                                            {personColors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm">{earning.description}</p>
                                                {earning.dueDate && (
                                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                        Recurring
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {personNames} • {getEarningInfo(earning)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-success text-sm">
                                            +{formatCurrency(earning.amount, currency)}
                                        </span>
                                        {onEditEarning && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEditEarning(earning)}
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                        )}
                                        {onDeleteEarning && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDeleteEarning(earning.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {expenses.length > 0 && (
                <div>
                    <div className="flex items-center mb-3">
                        <TrendingDown className="w-5 h-5 text-danger mr-2" />
                        <h3 className="text-lg font-semibold text-danger">Expenses</h3>
                        <span className="ml-2 text-sm text-muted-foreground">({expenses.length})</span>
                    </div>
                    <div className="space-y-2">
                        {expenses.map((expense) => {
                            const personColors = getPersonColors(expense.people);
                            const personNames = getPersonNames(expense.people);

                            return (
                                <div key={expense.id} className="flex items-center justify-between p-3 bg-card border border-border rounded-lg hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center space-x-1">
                                            {personColors.map((color, index) => (
                                                <div
                                                    key={index}
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: color }}
                                                />
                                            ))}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <p className="font-medium text-sm">{expense.description}</p>
                                                {expense.isRecurring && (
                                                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                                        Recurring
                                                    </span>
                                                )}
                                            </div>
                                            <p className="text-xs text-muted-foreground">
                                                {personNames} • {getExpenseInfo(expense)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="font-semibold text-danger text-sm">
                                            -{formatCurrency(expense.amount, currency)}
                                        </span>
                                        {onEditExpense && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEditExpense(expense)}
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                        )}
                                        {onDeleteExpense && (
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDeleteExpense(expense.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
}
