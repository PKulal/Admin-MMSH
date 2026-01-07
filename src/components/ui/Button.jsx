import React from 'react';
import { cn } from '../../lib/utils';

export function Button({ className, variant = 'primary', size = 'default', children, ...props }) {
    const variants = {
        primary: "bg-[hsl(var(--color-primary))] text-white hover:opacity-90",
        secondary: "bg-white border border-[hsl(var(--color-border))] text-[hsl(var(--color-text-main))] hover:bg-gray-50",
        ghost: "bg-transparent hover:bg-black/5 text-[hsl(var(--color-text-main))]",
        outline: "border border-[hsl(var(--color-text-main))] text-[hsl(var(--color-text-main))] hover:bg-[hsl(var(--color-text-main))] hover:text-white"
    };

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-8 px-3 text-sm",
        lg: "h-12 px-8 text-lg",
        icon: "h-10 w-10 p-0 flex items-center justify-center"
    };

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none",
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    );
}
