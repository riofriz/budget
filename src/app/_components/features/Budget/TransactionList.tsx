'use client';

import { useState, useMemo } from 'react';
import { Earning, Expense, Person, Category } from '../../../_types';
import { formatCurrency } from '../../../_utils/calculations';
import { Card } from '../../ui/Card';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Edit, Trash2, TrendingUp, TrendingDown, Search, Filter, Plus, Calendar, PieChart } from 'lucide-react';

interface TransactionListProps {
    earnings: Earning[];
    expenses: Expense[];
    people: Person[];
    categories: Category[];
    currency: string;
    onEditEarning: (earning: Earning) => void;
    onEditExpense: (expense: Expense) => void;
    onDeleteEarning: (earningId: string) => void;
    onDeleteExpense: (expenseId: string) => void;
    onAddEarning: () => void;
    onAddExpense: () => void;
}

export function TransactionList({
    earnings,
    expenses,
    people,
    categories,
    currency,
    onEditEarning,
    onEditExpense,
    onDeleteEarning,
    onDeleteExpense,
    onAddEarning,
    onAddExpense
}: TransactionListProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string>('');
    const [selectedPerson, setSelectedPerson] = useState<string>('');
    const [showFilters, setShowFilters] = useState(false);

    // Filter categories by type
    const expenseCategories = categories.filter(cat => cat.type === 'expense');
    const earningCategories = categories.filter(cat => cat.type === 'earning');

    const filteredEarnings = useMemo(() => {
        return earnings.filter(earning => {
            const matchesSearch = earning.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || earning.categoryId === selectedCategory;
            const matchesPerson = !selectedPerson || earning.people.some(p => p.personId === selectedPerson);
            return matchesSearch && matchesCategory && matchesPerson;
        });
    }, [earnings, searchTerm, selectedCategory, selectedPerson]);

    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = !selectedCategory || expense.categoryId === selectedCategory;
            const matchesPerson = !selectedPerson || expense.people.some(p => p.personId === selectedPerson);
            return matchesSearch && matchesCategory && matchesPerson;
        });
    }, [expenses, searchTerm, selectedCategory, selectedPerson]);

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

    const getCategoryInfo = (categoryId?: string) => {
        if (!categoryId) return null;
        return categories.find(c => c.id === categoryId);
    };

    const getTransactionDate = (transaction: Earning | Expense) => {
        const createdDate = new Date(transaction.createdAt);
        return createdDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    const getRecurringInfo = (transaction: Earning | Expense) => {
        if (transaction.dueDate) {
            return `Due: ${transaction.dueDate}th • Recurring`;
        }
        return null;
    };

    const clearFilters = () => {
        setSearchTerm('');
        setSelectedCategory('');
        setSelectedPerson('');
    };

    const hasActiveFilters = searchTerm || selectedCategory || selectedPerson;

    // Spending categories chart data
    const getSpendingCategories = () => {
        const categoryMap = new Map<string, { category: Category; total: number; count: number }>();

        expenseCategories.forEach(category => {
            categoryMap.set(category.id, { category, total: 0, count: 0 });
        });

        expenses.forEach(expense => {
            const categoryId = expense.categoryId || 'other';
            const existing = categoryMap.get(categoryId);
            if (existing) {
                existing.total += expense.amount;
                existing.count += 1;
            }
        });

        return Array.from(categoryMap.values())
            .filter(data => data.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 3); // Top 3 only
    };

    const spendingCategories = getSpendingCategories();
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

    // Earning categories chart data
    const getEarningCategories = () => {
        const categoryMap = new Map<string, { category: Category; total: number; count: number }>();

        earningCategories.forEach(category => {
            categoryMap.set(category.id, { category, total: 0, count: 0 });
        });

        earnings.forEach(earning => {
            const categoryId = earning.categoryId || 'other';
            const existing = categoryMap.get(categoryId);
            if (existing) {
                existing.total += earning.amount;
                existing.count += 1;
            }
        });

        return Array.from(categoryMap.values())
            .filter(data => data.total > 0)
            .sort((a, b) => b.total - a.total)
            .slice(0, 3); // Top 3 only
    };

    const topEarningCategories = getEarningCategories();
    const totalEarnings = earnings.reduce((sum, earning) => sum + earning.amount, 0);

    if (earnings.length === 0 && expenses.length === 0) {
        return (
            <div className="p-6 text-center">
                <p className="text-muted-foreground">No transactions yet. Add some earnings or expenses to get started!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Search and Filters */}
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 bg-background"
                        />
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="w-4 h-4" />
                        Filters
                    </Button>
                    {hasActiveFilters && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={clearFilters}
                        >
                            Clear
                        </Button>
                    )}
                </div>

                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-border/50">
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Filter by Category
                            </label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 bg-background text-foreground rounded-md"
                            >
                                <option value="">All Categories</option>
                                <optgroup label="Expense Categories">
                                    {expenseCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </optgroup>
                                <optgroup label="Earning Categories">
                                    {earningCategories.map((category) => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </optgroup>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                Filter by Person
                            </label>
                            <select
                                value={selectedPerson}
                                onChange={(e) => setSelectedPerson(e.target.value)}
                                className="w-full px-3 py-2 bg-background text-foreground rounded-md"
                            >
                                <option value="">All People</option>
                                {people.map((person) => (
                                    <option key={person.id} value={person.id}>
                                        {person.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}
            </div>

            {/* Earnings Section */}
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <TrendingUp className="w-5 h-5 text-success mr-2" />
                        <h3 className="text-lg font-semibold text-success">Earnings</h3>
                        <span className="ml-2 text-sm text-muted-foreground">
                            ({filteredEarnings.length} of {earnings.length})
                        </span>
                    </div>
                    <Button
                        onClick={onAddEarning}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Earning
                    </Button>
                </div>

                {/* Top Earning Categories Summary */}
                {topEarningCategories.length > 0 && (
                    <div className="mb-4 p-3 bg-background/80 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <PieChart className="w-4 h-4 text-muted-foreground" />
                            <h4 className="text-sm font-medium">Top Earning Categories</h4>
                        </div>
                        <div className="space-y-1">
                            {topEarningCategories.map((data) => (
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
                                        <span className="font-semibold text-success">
                                            {formatCurrency(data.total, currency)}
                                        </span>
                                        <span className="text-muted-foreground text-xs">
                                            {((data.total / totalEarnings) * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {filteredEarnings.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                        {earnings.length === 0 ? 'No earnings yet.' : 'No earnings match your filters.'}
                    </p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredEarnings.map((earning) => {
                            const personColors = getPersonColors(earning.people);
                            const personNames = getPersonNames(earning.people);
                            const category = getCategoryInfo(earning.categoryId);
                            const recurringInfo = getRecurringInfo(earning);

                            return (
                                <div key={earning.id} className="flex items-center justify-between p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        {/* Category */}
                                        {category && (
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: category.color }}
                                                title={category.name}
                                            />
                                        )}

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium truncate">{earning.description}</span>
                                                {category && (
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                        {category.name}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                {/* People */}
                                                <div className="flex items-center gap-1">
                                                    <div className="flex items-center gap-1">
                                                        {personColors.map((color, index) => (
                                                            <div
                                                                key={index}
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="truncate">{personNames}</span>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{getTransactionDate(earning)}</span>
                                                </div>

                                                {/* Recurring Info */}
                                                {recurringInfo && (
                                                    <span className="text-xs bg-success/10 text-success px-2 py-1 rounded">
                                                        {recurringInfo}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount and Actions */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <span className="font-semibold text-success text-lg">
                                            +{formatCurrency(earning.amount, currency)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEditEarning(earning)}
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDeleteEarning(earning.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Expenses Section */}
            <div className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <TrendingDown className="w-5 h-5 text-danger mr-2" />
                        <h3 className="text-lg font-semibold text-danger">Expenses</h3>
                        <span className="ml-2 text-sm text-muted-foreground">
                            ({filteredExpenses.length} of {expenses.length})
                        </span>
                    </div>
                    <Button
                        onClick={onAddExpense}
                        size="sm"
                        className="flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        Add Expense
                    </Button>
                </div>

                {/* Spending Categories Summary */}
                {spendingCategories.length > 0 && (
                    <div className="mb-4 p-3 bg-background/80 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                            <PieChart className="w-4 h-4 text-muted-foreground" />
                            <h4 className="text-sm font-medium">Top Spending Categories</h4>
                        </div>
                        <div className="space-y-1">
                            {spendingCategories.map((data) => (
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
                    </div>
                )}

                {filteredExpenses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                        {expenses.length === 0 ? 'No expenses yet.' : 'No expenses match your filters.'}
                    </p>
                ) : (
                    <div className="space-y-2 max-h-96 overflow-y-auto">
                        {filteredExpenses.map((expense) => {
                            const personColors = getPersonColors(expense.people);
                            const personNames = getPersonNames(expense.people);
                            const category = getCategoryInfo(expense.categoryId);
                            const recurringInfo = getRecurringInfo(expense);

                            return (
                                <div key={expense.id} className="flex items-center justify-between p-3 bg-background/80 rounded-lg hover:bg-background transition-colors">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        {/* Category */}
                                        {category && (
                                            <div
                                                className="w-3 h-3 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: category.color }}
                                                title={category.name}
                                            />
                                        )}

                                        {/* Main Info */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium truncate">{expense.description}</span>
                                                {category && (
                                                    <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
                                                        {category.name}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                                {/* People */}
                                                <div className="flex items-center gap-1">
                                                    <div className="flex items-center gap-1">
                                                        {personColors.map((color, index) => (
                                                            <div
                                                                key={index}
                                                                className="w-2 h-2 rounded-full"
                                                                style={{ backgroundColor: color }}
                                                            />
                                                        ))}
                                                    </div>
                                                    <span className="truncate">{personNames}</span>
                                                </div>

                                                {/* Date */}
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{getTransactionDate(expense)}</span>
                                                </div>

                                                {/* Recurring Info */}
                                                {recurringInfo && (
                                                    <span className="text-xs bg-danger/10 text-danger px-2 py-1 rounded">
                                                        {recurringInfo}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Amount and Actions */}
                                    <div className="flex items-center gap-2 ml-4">
                                        <span className="font-semibold text-danger text-lg">
                                            -{formatCurrency(expense.amount, currency)}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onEditExpense(expense)}
                                            >
                                                <Edit className="w-3 h-3" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => onDeleteExpense(expense.id)}
                                            >
                                                <Trash2 className="w-3 h-3" />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
