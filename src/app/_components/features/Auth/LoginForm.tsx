'use client';

import { useState } from 'react';
import { Button } from '../../ui/Button';
import { Input } from '../../ui/Input';
import { Card } from '../../ui/Card';
import { loginAction } from '../../../_libs/authActions';

export function LoginForm() {
    const [error, setError] = useState('');

    const handleSubmit = async (formData: FormData) => {
        try {
            await loginAction(formData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-funky p-4">
            <Card className="w-full max-w-md space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold text-gradient-primary">
                        Budget Tracker
                    </h1>
                    <p className="text-muted-foreground">
                        Enter your password to access your budget
                    </p>
                </div>

                <form action={handleSubmit} className="space-y-4">
                    <Input
                        name="password"
                        type="password"
                        label="Password"
                        placeholder="Enter your password"
                        required
                        error={error}
                    />

                    <Button
                        type="submit"
                        className="w-full"
                    >
                        Sign In
                    </Button>
                </form>
            </Card>
        </div>
    );
}
