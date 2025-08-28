'use client';

import { useState } from 'react';
import { useTheme } from 'next-themes';
import { Button } from '../../ui/Button';
import { Card } from '../../ui/Card';
import { AppSettings } from '../../../_types';
import { Sun, Moon, X } from 'lucide-react';

interface SettingsModalProps {
    settings: AppSettings;
    onSettingsUpdate: (settings: Partial<AppSettings>) => void;
    onClose: () => void;
}

export function SettingsModal({ settings, onSettingsUpdate, onClose }: SettingsModalProps) {
    const { theme, setTheme } = useTheme();
    const [currency, setCurrency] = useState(settings.currency);

    const handleSave = () => {
        const updates: Partial<AppSettings> = {};

        if (currency !== settings.currency) {
            updates.currency = currency;
        }

        if (theme !== settings.theme) {
            updates.theme = theme as 'light' | 'dark';
        }

        if (Object.keys(updates).length > 0) {
            onSettingsUpdate(updates);
        }

        onClose();
    };

    const currencies = [
        { code: 'USD', symbol: '$', name: 'US Dollar' },
        { code: 'EUR', symbol: '€', name: 'Euro' },
        { code: 'GBP', symbol: '£', name: 'British Pound' },
        { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
        { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
        { code: 'JPY', symbol: '¥', name: 'Japanese Yen' }
    ];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-md space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gradient-primary">
                        Settings
                    </h2>
                    <Button variant="ghost" size="sm" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                <div className="space-y-6">
                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                            Theme
                        </label>
                        <div className="flex gap-2">
                            <Button
                                variant={theme === 'light' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setTheme('light')}
                                className="flex-1"
                            >
                                <Sun className="w-4 h-4 mr-1" />
                                Light
                            </Button>
                            <Button
                                variant={theme === 'dark' ? 'primary' : 'ghost'}
                                size="sm"
                                onClick={() => setTheme('dark')}
                                className="flex-1"
                            >
                                <Moon className="w-4 h-4 mr-1" />
                                Dark
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-sm font-medium text-foreground">
                            Currency
                        </label>
                        <select
                            value={currency}
                            onChange={(e) => setCurrency(e.target.value)}
                            className="input-default"
                        >
                            {currencies.map((curr) => (
                                <option key={curr.code} value={curr.code}>
                                    {curr.symbol} {curr.name} ({curr.code})
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="flex gap-2">
                    <Button onClick={handleSave} className="flex-1">
                        Save Settings
                    </Button>
                    <Button variant="ghost" onClick={onClose}>
                        Cancel
                    </Button>
                </div>
            </Card>
        </div>
    );
}
