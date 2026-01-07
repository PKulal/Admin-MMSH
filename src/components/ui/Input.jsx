import React from 'react';
import { cn } from '../../lib/utils';

export function Input({ className, type = 'text', ...props }) {
    return (
        <input
            type={type}
            className={cn(
                "flex h-10 w-full rounded-lg border border-[hsl(var(--color-border))] bg-white px-3 py-2 text-sm",
                "placeholder:text-[hsl(var(--color-text-muted))]",
                "focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))] focus:border-transparent",
                "disabled:cursor-not-allowed disabled:opacity-50",
                "transition-all",
                className
            )}
            {...props}
        />
    );
}
