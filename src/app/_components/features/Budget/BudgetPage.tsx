'use client';

import { useState, useEffect } from 'react';
import { BudgetPage as BudgetPageType, Person, Earning, Expense, AppSettings, Category } from '../../../_types';
import { BudgetSidebar } from './BudgetSidebar';
import { TransactionList } from './TransactionList';
import { TransactionModal } from './TransactionModal';
import { BudgetChart } from './BudgetChart';
import { Button } from '../../ui/Button';
import { SettingsModal } from '../Settings/SettingsModal';
import { Plus, Settings as SettingsIcon, Menu } from 'lucide-react';
import {
    createEarningAction,
    createExpenseAction,
    createPersonAction,
    createCategoryAction,
    createBudgetPageAction,
    updateEarningAction,
    updateExpenseAction,
    deleteEarningAction,
    deleteExpenseAction,
    updateSettingsAction,
    getDataAction
} from '../../../_libs/serverActions';

interface BudgetPageProps {
    initialData: {
        people: Person[];
        categories: Category[];
        budgetPages: BudgetPageType[];
        settings: AppSettings;
    };
}

export function BudgetPage({ initialData }: BudgetPageProps) {
    const [currentPeople, setCurrentPeople] = useState<Person[]>(initialData.people);
    const [currentCategories, setCurrentCategories] = useState<Category[]>(initialData.categories);
    const [currentBudgetPages, setCurrentBudgetPages] = useState<BudgetPageType[]>(initialData.budgetPages);
    const [currentSettings, setCurrentSettings] = useState<AppSettings>(initialData.settings);
    const [currentPageId, setCurrentPageId] = useState<string>('');
    const [showEarningModal, setShowEarningModal] = useState(false);
    const [showExpenseModal, setShowExpenseModal] = useState(false);
    const [editingEarning, setEditingEarning] = useState<Earning | undefined>();
    const [editingExpense, setEditingExpense] = useState<Expense | undefined>();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showSettings, setShowSettings] = useState(false);

    const currentPage = currentBudgetPages.find(page => page.id === currentPageId);
    const currentEarnings = currentPage?.earnings || [];
    const currentExpenses = currentPage?.expenses || [];

    useEffect(() => {
        if (currentBudgetPages.length > 0 && !currentPageId) {
            setCurrentPageId(currentBudgetPages[0].id);
        }
    }, [currentBudgetPages, currentPageId]);

    const refreshData = async () => {
        try {
            const data = await getDataAction();
            setCurrentPeople(data.people);
            setCurrentCategories(data.categories);
            setCurrentBudgetPages(data.budgetPages);
            setCurrentSettings(data.settings);
        } catch (error) {
            console.error('Error refreshing data:', error);
        }
    };

    const handleCreateEarning = async (formData: FormData) => {
        if (!currentPageId) return;
        await createEarningAction(currentPageId, formData);
        await refreshData();
    };

    const handleCreateExpense = async (formData: FormData) => {
        if (!currentPageId) return;
        await createExpenseAction(currentPageId, formData);
        await refreshData();
    };

    const handleEditEarning = async (formData: FormData) => {
        if (!currentPageId || !editingEarning) return;
        await updateEarningAction(currentPageId, editingEarning.id, formData);
        setEditingEarning(undefined);
        await refreshData();
    };

    const handleEditExpense = async (formData: FormData) => {
        if (!currentPageId || !editingExpense) return;
        await updateExpenseAction(currentPageId, editingExpense.id, formData);
        setEditingExpense(undefined);
        await refreshData();
    };

    const handleDeleteEarning = async (earningId: string) => {
        if (!currentPageId) return;
        await deleteEarningAction(currentPageId, earningId);
        await refreshData();
    };

    const handleDeleteExpense = async (expenseId: string) => {
        if (!currentPageId) return;
        await deleteExpenseAction(currentPageId, expenseId);
        await refreshData();
    };

    const handleCreatePerson = async (formData: FormData) => {
        await createPersonAction(formData);
        await refreshData();
    };

    const handleCreateCategory = async (formData: FormData) => {
        await createCategoryAction(formData);
        await refreshData();
    };

    const handleCreateFirstBudget = async (formData: FormData) => {
        await createBudgetPageAction(formData);
        await refreshData();
    };

    const handlePageCreate = (newPage: BudgetPageType) => {
        setCurrentBudgetPages(prev => [...prev, newPage]);
        setCurrentPageId(newPage.id);
    };

    const handlePageUpdate = (updatedPage: BudgetPageType) => {
        setCurrentBudgetPages(prev =>
            prev.map(page => page.id === updatedPage.id ? updatedPage : page)
        );
    };

    const handleSettingsUpdate = async (settings: Partial<AppSettings>) => {
        const updatedSettings = await updateSettingsAction(settings);
        setCurrentSettings(updatedSettings);
    };

    const handleEditEarningClick = (earning: Earning) => {
        setEditingEarning(earning);
        setShowEarningModal(true);
    };

    const handleEditExpenseClick = (expense: Expense) => {
        setEditingExpense(expense);
        setShowExpenseModal(true);
    };

    const handleCloseEarningModal = () => {
        setShowEarningModal(false);
        setEditingEarning(undefined);
    };

    const handleCloseExpenseModal = () => {
        setShowExpenseModal(false);
        setEditingExpense(undefined);
    };

    if (currentBudgetPages.length === 0) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4">Welcome to Budget Tracker</h1>
                    <p className="text-muted-foreground mb-6">Create your first budget page to get started</p>
                    <form action={handleCreateFirstBudget} className="flex gap-2 justify-center">
                        <input
                            type="text"
                            name="name"
                            placeholder="Budget page name"
                            className="px-3 py-2 border border-border rounded-md bg-background text-foreground"
                            required
                        />
                        <Button type="submit">Create Budget</Button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed left-0 top-0 h-full w-80 bg-card border-r border-border z-50 transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <BudgetSidebar
                    budgetPages={currentBudgetPages}
                    settings={currentSettings}
                    currentPageId={currentPageId}
                    onPageChange={setCurrentPageId}
                    onPageCreate={handlePageCreate}
                    onPageUpdate={handlePageUpdate}
                />
            </div>

            {/* Main content */}
            <div className="lg:ml-80">
                {/* Header */}
                <div className="sticky top-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-4">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSidebarOpen(!sidebarOpen)}
                                className="lg:hidden"
                            >
                                <Menu className="w-5 h-5" />
                            </Button>
                            <h1 className="text-xl font-semibold">{currentPage?.name || 'Budget'}</h1>
                        </div>
                        <div className="flex items-center gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowEarningModal(true)}
                                className="hidden sm:flex"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Earning
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowEarningModal(true)}
                                className="sm:hidden"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowExpenseModal(true)}
                                className="hidden sm:flex"
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Expense
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowExpenseModal(true)}
                                className="sm:hidden"
                            >
                                <Plus className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setShowSettings(true)}
                            >
                                <SettingsIcon className="w-5 h-5" />
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 space-y-6">
                    <TransactionList
                        earnings={currentEarnings}
                        expenses={currentExpenses}
                        people={currentPeople}
                        categories={currentCategories}
                        currency={currentSettings.currency}
                        onEditEarning={handleEditEarningClick}
                        onEditExpense={handleEditExpenseClick}
                        onDeleteEarning={handleDeleteEarning}
                        onDeleteExpense={handleDeleteExpense}
                        onAddEarning={() => setShowEarningModal(true)}
                        onAddExpense={() => setShowExpenseModal(true)}
                    />
                </div>
            </div>

            {/* Modals */}
            {showEarningModal && (
                <TransactionModal
                    type="earning"
                    people={currentPeople}
                    categories={currentCategories}
                    onSubmit={editingEarning ? handleEditEarning : handleCreateEarning}
                    onPersonCreate={handleCreatePerson}
                    onCategoryCreate={handleCreateCategory}
                    onClose={handleCloseEarningModal}
                    currency={currentSettings.currency}
                    editingTransaction={editingEarning}
                />
            )}

            {showExpenseModal && (
                <TransactionModal
                    type="expense"
                    people={currentPeople}
                    categories={currentCategories}
                    onSubmit={editingExpense ? handleEditExpense : handleCreateExpense}
                    onPersonCreate={handleCreatePerson}
                    onCategoryCreate={handleCreateCategory}
                    onClose={handleCloseExpenseModal}
                    currency={currentSettings.currency}
                    editingTransaction={editingExpense}
                />
            )}

            {showSettings && (
                <SettingsModal
                    settings={currentSettings}
                    onSettingsUpdate={handleSettingsUpdate}
                    onClose={() => setShowSettings(false)}
                />
            )}
        </div>
    );
}
