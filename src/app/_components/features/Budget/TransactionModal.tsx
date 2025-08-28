'use client';

import { useState, useEffect } from 'react';
import { Person, TransactionPerson, Earning, Expense, Category } from '../../../_types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import { getCurrencySymbol } from '../../../_utils/calculations';
import { Plus, X, Settings } from 'lucide-react';
import { getRandomColor } from '../../../_utils/calculations';
import { CategoryModal } from './CategoryModal';

interface TransactionModalProps {
    type: 'earning' | 'expense';
    people: Person[];
    categories: Category[];
    onSubmit: (formData: FormData) => Promise<void>;
    onPersonCreate: (formData: FormData) => Promise<void>;
    onCategoryCreate: (formData: FormData) => Promise<void>;
    onClose: () => void;
    currency?: string;
    editingTransaction?: Earning | Expense;
}

export function TransactionModal({
    type,
    people,
    categories,
    onSubmit,
    onPersonCreate,
    onCategoryCreate,
    onClose,
    currency = 'USD',
    editingTransaction
}: TransactionModalProps) {
    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [selectedPeople, setSelectedPeople] = useState<TransactionPerson[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showPersonSelector, setShowPersonSelector] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [newPersonName, setNewPersonName] = useState('');
    const [categoryId, setCategoryId] = useState('');

    const currencySymbol = getCurrencySymbol(currency);
    const relevantCategories = categories.filter(cat => cat.type === type);

    useEffect(() => {
        if (editingTransaction) {
            setAmount(editingTransaction.amount.toString());
            setDescription(editingTransaction.description);
            setSelectedPeople(editingTransaction.people);
            setCategoryId(editingTransaction.categoryId || '');

            if ('dueDate' in editingTransaction) {
                setDueDate(editingTransaction.dueDate?.toString() || '');
            }
        }
    }, [editingTransaction, type]);

    const handleAddPerson = (personId: string) => {
        setSelectedPeople(prev => [...prev, { personId, amount: 0 }]);
        setShowPersonSelector(false);
    };

    const handleRemovePerson = (personId: string) => {
        setSelectedPeople(prev => prev.filter(p => p.personId !== personId));
    };

    const handleCreatePerson = async () => {
        if (!newPersonName.trim()) return;

        try {
            const formData = new FormData();
            formData.append('name', newPersonName);
            formData.append('color', getRandomColor());
            await onPersonCreate(formData);
            setNewPersonName('');
            setShowPersonSelector(false);
        } catch (error) {
            console.error('Error creating person:', error);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || selectedPeople.length === 0) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('amount', amount);
            formData.append('description', description);
            formData.append('people', JSON.stringify(selectedPeople));

            // Add category if selected
            if (categoryId) {
                formData.append('categoryId', categoryId);
            }

            // Add due date if provided (indicates recurring transaction)
            if (dueDate) {
                formData.append('dueDate', dueDate);
            }

            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting transaction:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const getPersonName = (personId: string) => {
        const person = people.find(p => p.id === personId);
        return person?.name || 'Unknown';
    };

    const getPersonColor = (personId: string) => {
        const person = people.find(p => p.id === personId);
        return person?.color || '#000000';
    };

    const availablePeople = people.filter(person =>
        !selectedPeople.some(sp => sp.personId === person.id)
    );

    const isEditing = !!editingTransaction;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 w-96 max-h-[90vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                        <span className="text-2xl font-bold text-gradient-primary mr-2">{currencySymbol}</span>
                        <h3 className="text-xl font-semibold text-gradient-primary">
                            {isEditing ? 'Edit' : 'Add'} {type === 'earning' ? 'Earning' : 'Expense'}
                        </h3>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClose}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Total Amount ({currency})
                        </label>
                        <Input
                            type="number"
                            step="0.01"
                            min="0"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="0.00"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Description
                        </label>
                        <Input
                            type="text"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder={`${type === 'earning' ? 'Salary, bonus, etc.' : 'Rent, food, etc.'}`}
                            required
                        />
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-sm font-medium text-muted-foreground">
                                Category
                            </label>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCategoryModal(true)}
                                className="flex items-center gap-1"
                            >
                                <Settings className="w-3 h-3" />
                                Manage
                            </Button>
                        </div>
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                            <option value="">Select a category</option>
                            {relevantCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Due Date (Day of Month) - Optional
                        </label>
                        <Input
                            type="number"
                            min="1"
                            max="31"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            placeholder={`${type === 'earning' ? '15 (salary day)' : '15 (rent day)'}`}
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                            Leave empty for one-time transactions. Adding a day makes it recurring monthly.
                        </p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            People ({selectedPeople.length} selected)
                        </label>

                        {selectedPeople.length > 0 && (
                            <div className="space-y-2 mb-3">
                                {selectedPeople.map((person) => (
                                    <div key={person.personId} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                                        <div className="flex items-center">
                                            <div
                                                className="w-3 h-3 rounded-full mr-2"
                                                style={{ backgroundColor: getPersonColor(person.personId) }}
                                            />
                                            <span className="text-sm">{getPersonName(person.personId)}</span>
                                        </div>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => handleRemovePerson(person.personId)}
                                        >
                                            <X className="w-3 h-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {availablePeople.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-3">
                                {availablePeople.map((person) => (
                                    <Button
                                        key={person.id}
                                        type="button"
                                        size="sm"
                                        variant="outline"
                                        onClick={() => handleAddPerson(person.id)}
                                        className="flex items-center gap-1"
                                    >
                                        <div
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: person.color }}
                                        />
                                        {person.name}
                                    </Button>
                                ))}
                            </div>
                        )}

                        <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => setShowPersonSelector(true)}
                            className="w-full"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add New Person
                        </Button>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !amount || !description || selectedPeople.length === 0}
                            className="flex-1"
                        >
                            {isSubmitting ? (isEditing ? 'Updating...' : 'Adding...') : (isEditing ? 'Update' : 'Add')} {type === 'earning' ? 'Earning' : 'Expense'}
                        </Button>
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={onClose}
                        >
                            Cancel
                        </Button>
                    </div>
                </form>

                {showPersonSelector && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <Card className="p-6 w-80">
                            <h4 className="text-lg font-semibold mb-4">Add New Person</h4>
                            <div className="space-y-4">
                                <Input
                                    type="text"
                                    value={newPersonName}
                                    onChange={(e) => setNewPersonName(e.target.value)}
                                    placeholder="Person name"
                                    onKeyPress={(e) => e.key === 'Enter' && handleCreatePerson()}
                                />
                                <div className="flex gap-2">
                                    <Button
                                        onClick={handleCreatePerson}
                                        disabled={!newPersonName.trim()}
                                        className="flex-1"
                                    >
                                        Add Person
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        onClick={() => {
                                            setShowPersonSelector(false);
                                            setNewPersonName('');
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </Card>

            {showCategoryModal && (
                <CategoryModal
                    categories={categories}
                    onSubmit={onCategoryCreate}
                    onClose={() => setShowCategoryModal(false)}
                />
            )}
        </div>
    );
}
