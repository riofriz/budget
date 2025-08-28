'use server';

import { revalidatePath } from 'next/cache';
import {
    addPerson,
    updatePerson,
    deletePerson,
    addBudgetPage,
    updateBudgetPage,
    deleteBudgetPage,
    addEarning,
    addExpense,
    updateEarning,
    updateExpense,
    deleteEarning,
    deleteExpense,
    updateSettings,
    loadData
} from './dataStorage';
import { Person, BudgetPage, Earning, Expense, AppSettings, TransactionPerson } from '../_types';

export async function createPersonAction(formData: FormData): Promise<Person> {
    const name = formData.get('name') as string;
    const color = formData.get('color') as string;

    if (!name || !color) {
        throw new Error('Name and color are required');
    }

    const person = addPerson({ name, color });
    revalidatePath('/');
    return person;
}

export async function updatePersonAction(id: string, updates: Partial<Person>): Promise<Person | null> {
    const person = updatePerson(id, updates);
    revalidatePath('/');
    return person;
}

export async function deletePersonAction(id: string): Promise<boolean> {
    const success = deletePerson(id);
    revalidatePath('/');
    return success;
}

export async function createBudgetPageAction(formData: FormData): Promise<BudgetPage> {
    const name = formData.get('name') as string;

    if (!name) {
        throw new Error('Name is required');
    }

    const page = addBudgetPage({ name });
    revalidatePath('/');
    return page;
}

export async function updateBudgetPageAction(id: string, updates: Partial<BudgetPage>): Promise<BudgetPage | null> {
    const page = updateBudgetPage(id, updates);
    revalidatePath('/');
    return page;
}

export async function deleteBudgetPageAction(id: string): Promise<boolean> {
    const success = deleteBudgetPage(id);
    revalidatePath('/');
    return success;
}

export async function createEarningAction(pageId: string, formData: FormData): Promise<Earning | null> {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const peopleData = formData.get('people') as string;
    const dueDateStr = formData.get('dueDate') as string;

    if (!amount || !description) {
        throw new Error('Amount and description are required');
    }

    let people: TransactionPerson[] = [];
    if (peopleData) {
        try {
            people = JSON.parse(peopleData);
        } catch (error) {
            console.error('Error parsing people data:', error);
        }
    }

    const dueDate = dueDateStr ? parseInt(dueDateStr) : undefined;

    const earning = addEarning(pageId, {
        amount,
        description,
        people,
        dueDate
    });
    revalidatePath('/');
    return earning;
}

export async function createExpenseAction(pageId: string, formData: FormData): Promise<Expense | null> {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const peopleData = formData.get('people') as string;
    const dueDateStr = formData.get('dueDate') as string;

    if (!amount || !description) {
        throw new Error('Amount and description are required');
    }

    let people: TransactionPerson[] = [];
    if (peopleData) {
        try {
            people = JSON.parse(peopleData);
        } catch (error) {
            console.error('Error parsing people data:', error);
        }
    }

    const dueDate = dueDateStr ? parseInt(dueDateStr) : undefined;

    const expense = addExpense(pageId, {
        amount,
        description,
        people,
        dueDate
    });
    revalidatePath('/');
    return expense;
}

export async function updateEarningAction(pageId: string, earningId: string, formData: FormData): Promise<Earning | null> {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const peopleData = formData.get('people') as string;
    const dueDateStr = formData.get('dueDate') as string;

    if (!amount || !description) {
        throw new Error('Amount and description are required');
    }

    let people: TransactionPerson[] = [];
    if (peopleData) {
        try {
            people = JSON.parse(peopleData);
        } catch (error) {
            console.error('Error parsing people data:', error);
        }
    }

    const dueDate = dueDateStr ? parseInt(dueDateStr) : undefined;

    const earning = updateEarning(pageId, earningId, {
        amount,
        description,
        people,
        dueDate
    });
    revalidatePath('/');
    return earning;
}

export async function updateExpenseAction(pageId: string, expenseId: string, formData: FormData): Promise<Expense | null> {
    const amount = parseFloat(formData.get('amount') as string);
    const description = formData.get('description') as string;
    const peopleData = formData.get('people') as string;
    const dueDateStr = formData.get('dueDate') as string;

    if (!amount || !description) {
        throw new Error('Amount and description are required');
    }

    let people: TransactionPerson[] = [];
    if (peopleData) {
        try {
            people = JSON.parse(peopleData);
        } catch (error) {
            console.error('Error parsing people data:', error);
        }
    }

    const dueDate = dueDateStr ? parseInt(dueDateStr) : undefined;

    const expense = updateExpense(pageId, expenseId, {
        amount,
        description,
        people,
        dueDate
    });
    revalidatePath('/');
    return expense;
}

export async function deleteEarningAction(pageId: string, earningId: string): Promise<boolean> {
    const success = deleteEarning(pageId, earningId);
    revalidatePath('/');
    return success;
}

export async function deleteExpenseAction(pageId: string, expenseId: string): Promise<boolean> {
    const success = deleteExpense(pageId, expenseId);
    revalidatePath('/');
    return success;
}

export async function updateSettingsAction(settings: Partial<AppSettings>): Promise<AppSettings> {
    const updatedSettings = updateSettings(settings);
    revalidatePath('/');
    return updatedSettings;
}

export async function getDataAction() {
    return loadData();
}
