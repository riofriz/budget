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
        <div className="w-80 bg-card border-r border-border h-screen flex flex-col">
            {/* Header */}
            <div className="p-3 lg:p-4 border-b border-border">
                <h1 className="text-lg lg:text-xl font-bold text-gradient-primary mb-3 lg:mb-4">Budget Tracker</h1>

                {/* Summary Cards */}
                {summary && (
                    <div className="space-y-2 lg:space-y-3">
                        <Card className="p-2 lg:p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-success text-xs lg:text-sm">
                                    <TrendingUp className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                    <span>Earnings</span>
                                </div>
                                <span className="font-semibold text-success text-xs lg:text-sm">
                                    {formatCurrency(summary.totalEarnings, settings.currency)}
                                </span>
                            </div>
                        </Card>

                        <Card className="p-2 lg:p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-danger text-xs lg:text-sm">
                                    <TrendingDown className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                    <span>Expenses</span>
                                </div>
                                <span className="font-semibold text-danger text-xs lg:text-sm">
                                    {formatCurrency(summary.totalExpenses, settings.currency)}
                                </span>
                            </div>
                        </Card>

                        <Card className="p-2 lg:p-3">
                            <div className="flex items-center justify-between">
                                <span className="text-xs lg:text-sm font-medium">Available Pool</span>
                                <span className={`font-semibold text-xs lg:text-sm ${summary.netIncome >= 0 ? 'text-success' : 'text-danger'}`}>
                                    {formatCurrency(summary.netIncome, settings.currency)}
                                </span>
                            </div>
                        </Card>

                        <Card className="p-2 lg:p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-primary text-xs lg:text-sm">
                                    <PiggyBank className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                    <span>Savings</span>
                                </div>
                                <span className="font-semibold text-primary text-xs lg:text-sm">
                                    {formatCurrency(summary.projectedSavings, settings.currency)}
                                </span>
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                                {getSavingsMessage()}
                            </p>
                        </Card>

                        <Card className="p-2 lg:p-3">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center text-warning text-xs lg:text-sm">
                                    <Calendar className="w-3 h-3 lg:w-4 lg:h-4 mr-1" />
                                    <span>Daily Budget</span>
                                </div>
                                <span className="font-semibold text-warning text-xs lg:text-sm">
                                    {formatCurrency(summary.maxDailyBudget, settings.currency)}
                                </span>
                            </div>
                        </Card>
                    </div>
                )}
            </div>

            {/* Pages */}
            <div className="flex-1 overflow-y-auto p-3 lg:p-4">
                <div className="flex items-center justify-between mb-3 lg:mb-4">
                    <h2 className="text-xs lg:text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pages</h2>
                    <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setIsCreating(true)}
                    >
                        <Plus className="w-3 h-3 lg:w-4 lg:h-4" />
                    </Button>
                </div>

                {isCreating && (
                    <div className="mb-3 lg:mb-4 p-2 lg:p-3 bg-muted rounded-lg">
                        <input
                            type="text"
                            value={newPageName}
                            onChange={(e) => setNewPageName(e.target.value)}
                            placeholder="Page name..."
                            className="input-default w-full mb-2 text-xs lg:text-sm"
                            onKeyPress={(e) => e.key === 'Enter' && handleCreatePage()}
                        />
                        <div className="flex gap-1">
                            <Button
                                size="sm"
                                onClick={handleCreatePage}
                                disabled={!newPageName.trim() || isCreating}
                                className="flex-1"
                            >
                                {isCreating ? 'Creating...' : 'Create'}
                            </Button>
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                    setIsCreating(false);
                                    setNewPageName('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                )}

                <div className="space-y-1">
                    {budgetPages.map((page) => (
                        <div key={page.id} className="flex items-center gap-1">
                            {editingPageId === page.id ? (
                                <div className="flex-1 flex items-center gap-1">
                                    <input
                                        type="text"
                                        value={editingPageName}
                                        onChange={(e) => setEditingPageName(e.target.value)}
                                        className="input-default flex-1 text-xs lg:text-sm"
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
                                <>
                                    <Button
                                        variant={page.id === currentPageId ? 'primary' : 'ghost'}
                                        onClick={() => onPageChange(page.id)}
                                        className="flex-1 justify-start text-xs lg:text-sm"
                                        size="sm"
                                    >
                                        {page.name}
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        onClick={() => handleStartEdit(page)}
                                    >
                                        <Edit className="w-3 h-3" />
                                    </Button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
