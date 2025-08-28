export interface Person {
    id: string;
    name: string;
    color: string;
    createdAt: Date;
}

export interface TransactionPerson {
    personId: string;
    amount: number;
}

export interface Category {
    id: string;
    name: string;
    color: string;
    type: 'earning' | 'expense';
    createdAt: Date;
}

export interface Earning {
    id: string;
    amount: number;
    description: string;
    people: TransactionPerson[];
    categoryId?: string;
    dueDate?: number;
    isRecurring?: boolean;
    createdAt: Date;
    updatedAt: Date;
    personId?: string;
}

export interface Expense {
    id: string;
    amount: number;
    description: string;
    people: TransactionPerson[];
    categoryId?: string;
    dueDate?: number;
    isRecurring?: boolean;
    createdAt: Date;
    updatedAt: Date;
    personId?: string;
}

export interface BudgetPage {
    id: string;
    name: string;
    earnings: Earning[];
    expenses: Expense[];
    createdAt: Date;
}

export interface AppSettings {
    currency: string;
    theme: 'light' | 'dark';
}

export interface AppData {
    people: Person[];
    categories: Category[];
    budgetPages: BudgetPage[];
    settings: AppSettings;
}

export interface BudgetSummary {
    totalEarnings: number;
    totalExpenses: number;
    netIncome: number;
    projectedSavings: number;
    maxDailyBudget: number;
}
