'use client';

import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../_utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, ...props }, ref) => {
        return (
            <div className="space-y-2">
                {label && (
                    <label className="block text-sm font-medium text-foreground">
                        {label}
                    </label>
                )}
                <input
                    className={cn(
                        'input-default',
                        error && 'border-destructive focus:ring-destructive',
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-destructive">{error}</p>
                )}
            </div>
        );
    }
);

Input.displayName = 'Input';

export { Input };
