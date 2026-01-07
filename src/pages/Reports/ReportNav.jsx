import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export function ReportNav() {
    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="flex gap-8 border-b mb-8">
            <Link
                to="/reports"
                className={`pb-4 text-sm font-bold transition-all border-b-2 ${currentPath === '/reports' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
            >
                Campaigns
            </Link>
            <Link
                to="/reports/users"
                className={`pb-4 text-sm font-bold transition-all border-b-2 ${currentPath === '/reports/users' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
            >
                User
            </Link>
            <Link
                to="/reports/screens"
                className={`pb-4 text-sm font-bold transition-all border-b-2 ${currentPath === '/reports/screens' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
            >
                Screens
            </Link>
        </div>
    );
}
