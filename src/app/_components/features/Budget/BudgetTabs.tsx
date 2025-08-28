'use client';

import { useState } from 'react';
import { BudgetPage } from '../../../_types';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { createBudgetPageAction } from '../../../_libs/serverActions';
import { BarChart3, Plus } from 'lucide-react';

interface BudgetTabsProps {
  budgetPages: BudgetPage[];
  currentPageId: string;
  onPageChange: (pageId: string) => void;
  onPageCreate: (page: BudgetPage) => void;
}

export function BudgetTabs({
  budgetPages,
  currentPageId,
  onPageChange,
  onPageCreate,
}: BudgetTabsProps) {
  const [isAddingPage, setIsAddingPage] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const handleCreatePage = async (formData: FormData) => {
    try {
      const page = await createBudgetPageAction(formData);
      onPageCreate(page);
      setIsAddingPage(false);
      setNewPageName('');
    } catch (error) {
      console.error('Error creating page:', error);
    }
  };

  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {budgetPages.map((page) => (
          <Button
            key={page.id}
            variant={currentPageId === page.id ? 'primary' : 'ghost'}
            size="sm"
            onClick={() => onPageChange(page.id)}
            className="whitespace-nowrap"
          >
            <BarChart3 className="w-4 h-4 mr-1" />
            {page.name}
          </Button>
        ))}

        {!isAddingPage ? (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsAddingPage(true)}
            className="whitespace-nowrap"
          >
            <Plus className="w-4 h-4 mr-1" />
            New Budget
          </Button>
        ) : (
          <form action={handleCreatePage} className="flex gap-2">
            <Input
              name="name"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              placeholder="Budget name"
              className="w-32"
              required
            />
            <Button type="submit" size="sm">
              Add
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingPage(false);
                setNewPageName('');
              }}
            >
              Cancel
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
