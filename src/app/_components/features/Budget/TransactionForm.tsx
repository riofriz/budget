'use client';

import { useState } from 'react';
import { Person, TransactionPerson } from '../../../_types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import { getCurrencySymbol, formatCurrency, getRandomColor } from '../../../_utils/calculations';
import { Plus, X } from 'lucide-react';

interface TransactionFormProps {
  type: 'earning' | 'expense';
  people: Person[];
  onSubmit: (formData: FormData) => Promise<void>;
  onPersonCreate: (person: Omit<Person, 'id' | 'createdAt'>) => Promise<void>;
  currency?: string;
}

export function TransactionForm({ type, people, onSubmit, onPersonCreate, currency = 'USD' }: TransactionFormProps) {
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [selectedPeople, setSelectedPeople] = useState<TransactionPerson[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPersonSelector, setShowPersonSelector] = useState(false);
  const [newPersonName, setNewPersonName] = useState('');

  const currencySymbol = getCurrencySymbol(currency);

  const handleAddPerson = (personId: string, personAmount: number) => {
    setSelectedPeople(prev => [...prev, { personId, amount: personAmount }]);
    setShowPersonSelector(false);
  };

  const handleRemovePerson = (personId: string) => {
    setSelectedPeople(prev => prev.filter(p => p.personId !== personId));
  };

  const handleCreatePerson = async () => {
    if (!newPersonName.trim()) return;

    try {
      await onPersonCreate({
        name: newPersonName,
        color: getRandomColor()
      });
      setNewPersonName('');
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
      await onSubmit(formData);

      setAmount('');
      setDescription('');
      setSelectedPeople([]);
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

  return (
    <Card className="p-6">
      <div className="flex items-center mb-4">
        <span className="text-2xl font-bold text-gradient-primary mr-2">{currencySymbol}</span>
        <h3 className="text-xl font-semibold text-gradient-primary">
          Add {type === 'earning' ? 'Earning' : 'Expense'}
        </h3>
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
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">
                      {formatCurrency(person.amount, currency)}
                    </span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      onClick={() => handleRemovePerson(person.personId)}
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
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
                  onClick={() => {
                    const totalAmount = parseFloat(amount) || 0;
                    const personAmount = totalAmount / (selectedPeople.length + 1);
                    handleAddPerson(person.id, personAmount);
                  }}
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

        <Button
          type="submit"
          disabled={isSubmitting || !amount || !description || selectedPeople.length === 0}
          className="w-full"
        >
          {isSubmitting ? 'Adding...' : `Add ${type === 'earning' ? 'Earning' : 'Expense'}`}
        </Button>
      </form>

      {showPersonSelector && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="p-6 w-96">
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
  );
}
