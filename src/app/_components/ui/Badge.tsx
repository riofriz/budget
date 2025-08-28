'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '../../_utils/cn';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    color?: string;
    variant?: 'default' | 'outline';
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
    ({ className, color, variant = 'default', children, ...props }, ref) => {
        return (
            <span
                className={cn(
                    'badge-default',
                    variant === 'default' && 'text-white',
                    variant === 'outline' && 'border border-current',
                    className
                )}
                style={color ? { backgroundColor: color } : undefined}
                ref={ref}
                {...props}
            >
                {children}
            </span>
        );
    }
);

Badge.displayName = 'Badge';

export { Badge };
