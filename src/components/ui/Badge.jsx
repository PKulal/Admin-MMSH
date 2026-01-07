import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ className, variant = 'default', children, ...props }) {
    const variants = {
        default: "bg-[hsl(var(--color-bg))] text-[hsl(var(--color-text-main))] border border-[hsl(var(--color-border))]",
        success: "bg-[hsl(var(--status-success))] text-white",
        warning: "bg-[hsl(var(--status-warning))] text-white",
        running: "bg-[hsl(var(--status-running))] text-white",
        outline: "text-[hsl(var(--color-text-main))] border border-[hsl(var(--color-text-main))]"
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
