'use client';

import { useState } from 'react';
import { Category } from '../../../_types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import { Plus, X } from 'lucide-react';
import { getRandomColor } from '../../../_utils/calculations';

interface CategoryModalProps {
    categories: Category[];
    onSubmit: (formData: FormData) => Promise<void>;
    onClose: () => void;
    editingCategory?: Category;
}

export function CategoryModal({
    categories,
    onSubmit,
    onClose,
    editingCategory
}: CategoryModalProps) {
    const [name, setName] = useState(editingCategory?.name || '');
    const [color, setColor] = useState(editingCategory?.color || getRandomColor());
    const [type, setType] = useState<'earning' | 'expense'>(editingCategory?.type || 'expense');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('name', name);
            formData.append('color', color);
            formData.append('type', type);

            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Error submitting category:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRandomColor = () => {
        setColor(getRandomColor());
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <Card className="p-6 w-96">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-gradient-primary">
                        {editingCategory ? 'Edit' : 'Add'} Category
                    </h3>
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
                            Category Name
                        </label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="e.g., Housing, Food, Salary"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Type
                        </label>
                        <select
                            value={type}
                            onChange={(e) => setType(e.target.value as 'earning' | 'expense')}
                            className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                        >
                            <option value="expense">Expense</option>
                            <option value="earning">Earning</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                            Color
                        </label>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-lg border-2 border-border"
                                style={{ backgroundColor: color }}
                            />
                            <Input
                                type="color"
                                value={color}
                                onChange={(e) => setColor(e.target.value)}
                                className="flex-1"
                            />
                            <Button
                                type="button"
                                variant="outline"
                                onClick={handleRandomColor}
                            >
                                Random
                            </Button>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-4">
                        <Button
                            type="submit"
                            disabled={isSubmitting || !name.trim()}
                            className="flex-1"
                        >
                            {isSubmitting ? (editingCategory ? 'Updating...' : 'Adding...') : (editingCategory ? 'Update' : 'Add')} Category
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
            </Card>
        </div>
    );
}
