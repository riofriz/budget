import fs from 'fs';
import path from 'path';
import { AppData, Person, BudgetPage, Earning, Expense, AppSettings } from '../_types';

const CONFIG_DIR = path.join(process.cwd(), 'config');
const DATA_FILE = path.join(CONFIG_DIR, 'app-data.json');

const defaultSettings: AppSettings = {
    currency: 'USD',
    theme: 'light'
};

const defaultData: AppData = {
    people: [],
    budgetPages: [],
    settings: defaultSettings
};

export function ensureConfigDir(): void {
    if (!fs.existsSync(CONFIG_DIR)) {
        fs.mkdirSync(CONFIG_DIR, { recursive: true });
    }
}

export function loadData(): AppData {
    try {
        ensureConfigDir();
        if (!fs.existsSync(DATA_FILE)) {
            saveData(defaultData);
            return defaultData;
        }
        const data = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            ...defaultData,
            ...parsed,
            people: parsed.people || [],
            budgetPages: parsed.budgetPages || [],
            settings: { ...defaultSettings, ...parsed.settings }
        };
    } catch (error) {
        console.error('Error loading data:', error);
        return defaultData;
    }
}

export function saveData(data: AppData): void {
    try {
        ensureConfigDir();
        fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error saving data:', error);
    }
}

export function addPerson(person: Omit<Person, 'id' | 'createdAt'>): Person {
    const data = loadData();
    const newPerson: Person = {
        ...person,
        id: crypto.randomUUID(),
        createdAt: new Date()
    };
    data.people.push(newPerson);
    saveData(data);
    return newPerson;
}

export function updatePerson(id: string, updates: Partial<Person>): Person | null {
    const data = loadData();
    const index = data.people.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.people[index] = { ...data.people[index], ...updates };
    saveData(data);
    return data.people[index];
}

export function deletePerson(id: string): boolean {
    const data = loadData();
    const index = data.people.findIndex(p => p.id === id);
    if (index === -1) return false;

    data.people.splice(index, 1);
    saveData(data);
    return true;
}

export function addBudgetPage(page: Omit<BudgetPage, 'id' | 'createdAt' | 'earnings' | 'expenses'>): BudgetPage {
    const data = loadData();
    const newPage: BudgetPage = {
        ...page,
        id: crypto.randomUUID(),
        earnings: [],
        expenses: [],
        createdAt: new Date()
    };
    data.budgetPages.push(newPage);
    saveData(data);
    return newPage;
}

export function updateBudgetPage(id: string, updates: Partial<BudgetPage>): BudgetPage | null {
    const data = loadData();
    const index = data.budgetPages.findIndex(p => p.id === id);
    if (index === -1) return null;

    data.budgetPages[index] = { ...data.budgetPages[index], ...updates };
    saveData(data);
    return data.budgetPages[index];
}

export function deleteBudgetPage(id: string): boolean {
    const data = loadData();
    const index = data.budgetPages.findIndex(p => p.id === id);
    if (index === -1) return false;

    data.budgetPages.splice(index, 1);
    saveData(data);
    return true;
}

export function addEarning(pageId: string, earning: Omit<Earning, 'id' | 'createdAt' | 'updatedAt'>): Earning | null {
    const data = loadData();
    const pageIndex = data.budgetPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return null;

    const newEarning: Earning = {
        ...earning,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    data.budgetPages[pageIndex].earnings.push(newEarning);
    saveData(data);
    return newEarning;
}

export function addExpense(pageId: string, expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>): Expense | null {
    const data = loadData();
    const pageIndex = data.budgetPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return null;

    const newExpense: Expense = {
        ...expense,
        id: crypto.randomUUID(),
        createdAt: new Date(),
        updatedAt: new Date()
    };
    data.budgetPages[pageIndex].expenses.push(newExpense);
    saveData(data);
    return newExpense;
}

export function updateEarning(pageId: string, earningId: string, updates: Partial<Omit<Earning, 'id' | 'createdAt'>>): Earning | null {
    const data = loadData();
    const pageIndex = data.budgetPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return null;

    const earningIndex = data.budgetPages[pageIndex].earnings.findIndex(e => e.id === earningId);
    if (earningIndex === -1) return null;

    data.budgetPages[pageIndex].earnings[earningIndex] = {
        ...data.budgetPages[pageIndex].earnings[earningIndex],
        ...updates,
        updatedAt: new Date()
    };
    saveData(data);
    return data.budgetPages[pageIndex].earnings[earningIndex];
}

export function updateExpense(pageId: string, expenseId: string, updates: Partial<Omit<Expense, 'id' | 'createdAt'>>): Expense | null {
    const data = loadData();
    const pageIndex = data.budgetPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return null;

    const expenseIndex = data.budgetPages[pageIndex].expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) return null;

    data.budgetPages[pageIndex].expenses[expenseIndex] = {
        ...data.budgetPages[pageIndex].expenses[expenseIndex],
        ...updates,
        updatedAt: new Date()
    };
    saveData(data);
    return data.budgetPages[pageIndex].expenses[expenseIndex];
}

export function deleteEarning(pageId: string, earningId: string): boolean {
    const data = loadData();
    const pageIndex = data.budgetPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return false;

    const earningIndex = data.budgetPages[pageIndex].earnings.findIndex(e => e.id === earningId);
    if (earningIndex === -1) return false;

    data.budgetPages[pageIndex].earnings.splice(earningIndex, 1);
    saveData(data);
    return true;
}

export function deleteExpense(pageId: string, expenseId: string): boolean {
    const data = loadData();
    const pageIndex = data.budgetPages.findIndex(p => p.id === pageId);
    if (pageIndex === -1) return false;

    const expenseIndex = data.budgetPages[pageIndex].expenses.findIndex(e => e.id === expenseId);
    if (expenseIndex === -1) return false;

    data.budgetPages[pageIndex].expenses.splice(expenseIndex, 1);
    saveData(data);
    return true;
}

export function updateSettings(settings: Partial<AppSettings>): AppSettings {
    const data = loadData();
    data.settings = { ...data.settings, ...settings };
    saveData(data);
    return data.settings;
}
