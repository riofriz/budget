'use client';

import { useState } from 'react';
import { BudgetPage as BudgetPageType, AppSettings } from '../../../_types';
import { calculateBudgetSummary } from '../../../_utils/calculations';
import { formatCurrency } from '../../../_utils/calculations';
import { createBudgetPageAction, updateBudgetPageAction } from '../../../_libs/serverActions';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { Plus, TrendingUp, TrendingDown, PiggyBank, Calendar, Edit, X, Check } from 'lucide-react';

interface BudgetSidebarProps {
    budgetPages: BudgetPageType[];
    settings: AppSettings;
    currentPageId: string;
    onPageChange: (pageId: string) => void;
    onPageCreate: (page: BudgetPageType) => void;
    onPageUpdate: (page: BudgetPageType) => void;
}

export function BudgetSidebar({
    budgetPages,
    settings,
    currentPageId,
    onPageChange,
    onPageCreate,
    onPageUpdate
}: BudgetSidebarProps) {
    const [isCreating, setIsCreating] = useState(false);
    const [newPageName, setNewPageName] = useState('');
    const [editingPageId, setEditingPageId] = useState<string | null>(null);
    const [editingPageName, setEditingPageName] = useState('');

    const currentPage = budgetPages.find(page => page.id === currentPageId);
    const summary = currentPage ? calculateBudgetSummary(currentPage.earnings, currentPage.expenses) : null;

    const handleCreatePage = async () => {
        if (!newPageName.trim()) return;

        setIsCreating(true);
        try {
            const formData = new FormData();
            formData.append('name', newPageName);
            const newPage = await createBudgetPageAction(formData);
            onPageCreate(newPage);
            setNewPageName('');
        } catch (error) {
            console.error('Error creating budget page:', error);
        } finally {
            setIsCreating(false);
        }
    };

    const handleStartEdit = (page: BudgetPageType) => {
        setEditingPageId(page.id);
        setEditingPageName(page.name);
    };

    const handleSaveEdit = async () => {
        if (!editingPageId || !editingPageName.trim()) return;

        try {
            const updatedPage = await updateBudgetPageAction(editingPageId, { name: editingPageName });
            if (updatedPage) {
                onPageUpdate(updatedPage);
            }
            setEditingPageId(null);
            setEditingPageName('');
        } catch (error) {
            console.error('Error updating budget page:', error);
        }
    };

    const handleCancelEdit = () => {
        setEditingPageId(null);
        setEditingPageName('');
    };

    const getSavingsMessage = () => {
        if (!summary || summary.netIncome <= 0) return 'No savings possible';

        const reasonableDailyBudget = 50;
        if (summary.maxDailyBudget >= reasonableDailyBudget) {
            return `You can save ${formatCurrency(summary.projectedSavings, settings.currency)}/month`;
        } else {
            return `Need ${formatCurrency(Math.abs(summary.projectedSavings), settings.currency)} more/month`;
        }
    };

    return (
        <div className="w-80 bg-muted/50 h-screen flex flex-col">
            {/* Header */}
            <div className="p-3 lg:p-4 border-b border-border/50">
                <h1 className="text-lg lg:text-xl font-bold text-gradient-primary mb-3 lg:mb-4">Budget Tracker</h1>

                {/* Summary Cards */}
                {summary && (
                    <div className="space-y-2 lg:space-y-3">
                        <div className="p-2 lg:p-3 bg-background/80 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingUp className="w-4 h-4 text-success" />
                                    <span className="text-sm font-medium">Earnings</span>
                                </div>
                                <span className="text-sm font-semibold text-success">
                                    {formatCurrency(summary.totalEarnings, settings.currency)}
                                </span>
                            </div>
                        </div>

                        <div className="p-2 lg:p-3 bg-background/80 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-danger" />
                                    <span className="text-sm font-medium">Expenses</span>
                                </div>
                                <span className="text-sm font-semibold text-danger">
                                    {formatCurrency(summary.totalExpenses, settings.currency)}
                                </span>
                            </div>
                        </div>

                        <div className="p-2 lg:p-3 bg-background/80 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <PiggyBank className="w-4 h-4 text-primary" />
                                    <span className="text-sm font-medium">Available Pool</span>
                                </div>
                                <span className="text-sm font-semibold text-primary">
                                    {formatCurrency(summary.netIncome, settings.currency)}
                                </span>
                            </div>
                        </div>

                        <div className="p-2 lg:p-3 bg-background/80 rounded-lg">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-warning" />
                                    <span className="text-sm font-medium">Daily Budget</span>
                                </div>
                                <span className="text-sm font-semibold text-warning">
                                    {formatCurrency(summary.maxDailyBudget, settings.currency)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getSavingsMessage()}
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Page Navigation */}
            <div className="flex-1 p-3 lg:p-4 space-y-3 overflow-y-auto">
                <h2 className="text-sm font-semibold text-muted-foreground">Budget Pages</h2>

                <div className="space-y-2">
                    {budgetPages.map((page) => (
                        <div
                            key={page.id}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${page.id === currentPageId
                                ? 'bg-primary/10 text-primary'
                                : 'bg-background/80 hover:bg-background'
                                }`}
                            onClick={() => onPageChange(page.id)}
                        >
                            {editingPageId === page.id ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={editingPageName}
                                        onChange={(e) => setEditingPageName(e.target.value)}
                                        className="flex-1 text-sm bg-transparent border-none outline-none"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSaveEdit()}
                                        autoFocus
                                    />
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleSaveEdit}
                                    >
                                        <Check className="w-3 h-3" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={handleCancelEdit}
                                    >
                                        <X className="w-3 h-3" />
                                    </Button>
                                </div>
                            ) : (
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium truncate">{page.name}</span>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleStartEdit(page);
                                        }}
                                    >
                                        <Edit className="w-3 h-3" />
                                    </Button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Create New Page */}
                <div className="pt-2">
                    {isCreating ? (
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={newPageName}
                                onChange={(e) => setNewPageName(e.target.value)}
                                placeholder="Page name"
                                className="flex-1 text-sm bg-background/80 px-2 py-1 rounded"
                                onKeyPress={(e) => e.key === 'Enter' && handleCreatePage()}
                                autoFocus
                            />
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={handleCreatePage}
                            >
                                <Check className="w-3 h-3" />
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewPageName('');
                                }}
                            >
                                <X className="w-3 h-3" />
                            </Button>
                        </div>
                    ) : (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsCreating(true)}
                            className="w-full justify-start text-muted-foreground hover:text-foreground"
                        >
                            <Plus className="w-3 h-3 mr-2" />
                            Add New Page
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
