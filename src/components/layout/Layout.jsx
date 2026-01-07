import React from 'react';
import { Sidebar } from './Sidebar';

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-[hsl(var(--color-bg))]">
            <Sidebar />
            <main className="ml-0 md:ml-20 lg:ml-64 transition-all duration-300 ease-in-out">
                <div className="p-4 md:p-6 lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
