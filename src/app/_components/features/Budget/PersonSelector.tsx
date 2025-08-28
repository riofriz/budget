'use client';

import { useState } from 'react';
import { Person } from '../../../_types';
import { Badge } from '../../ui/Badge';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { getRandomColor } from '../../../_utils/calculations';
import { cn } from '../../../_utils/cn';

interface PersonSelectorProps {
    people: Person[];
    selectedPersonId?: string;
    onPersonSelect: (personId: string | undefined) => void;
    onPersonCreate: (person: Omit<Person, 'id' | 'createdAt'>) => void;
}

export function PersonSelector({
    people,
    selectedPersonId,
    onPersonSelect,
    onPersonCreate
}: PersonSelectorProps) {
    const [isAdding, setIsAdding] = useState(false);
    const [newPersonName, setNewPersonName] = useState('');

    const handleAddPerson = () => {
        if (newPersonName.trim()) {
            onPersonCreate({
                name: newPersonName.trim(),
                color: getRandomColor()
            });
            setNewPersonName('');
            setIsAdding(false);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Person (Optional)
            </label>

            <div className="flex flex-wrap gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onPersonSelect(undefined)}
                    className={cn(
                        'border-2',
                        !selectedPersonId
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-gray-300 dark:border-gray-600'
                    )}
                >
                    None
                </Button>

                {people.map((person) => (
                    <Button
                        key={person.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => onPersonSelect(person.id)}
                        className={cn(
                            'border-2',
                            selectedPersonId === person.id
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-300 dark:border-gray-600'
                        )}
                    >
                        <Badge color={person.color} className="mr-1">
                            {person.name}
                        </Badge>
                    </Button>
                ))}

                <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsAdding(true)}
                >
                    + Add Person
                </Button>
            </div>

            {isAdding && (
                <div className="flex gap-2 mt-2">
                    <Input
                        value={newPersonName}
                        onChange={(e) => setNewPersonName(e.target.value)}
                        placeholder="Enter person name"
                        onKeyPress={(e) => e.key === 'Enter' && handleAddPerson()}
                        className="flex-1"
                    />
                    <Button size="sm" onClick={handleAddPerson}>
                        Add
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setIsAdding(false);
                            setNewPersonName('');
                        }}
                    >
                        Cancel
                    </Button>
                </div>
            )}
        </div>
    );
}


