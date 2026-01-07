import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Megaphone,
    Monitor,
    CalendarClock,
    Calendar,
    DollarSign,
    Users,
    LogOut,
    ChevronLeft,
    Menu,
    X,
    BarChart3
} from 'lucide-react';
import { cn } from '../../lib/utils';
import { useAuth } from '../../context/AuthContext';

export function Sidebar() {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout } = useAuth();
    const navigate = useNavigate();

    // Auto-collapse on mobile
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setCollapsed(true);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: LayoutDashboard, label: "Dashboard", path: "/" },
        { icon: Megaphone, label: "Campaigns", path: "/campaigns" },
        { icon: Monitor, label: "Inventory", path: "/inventory" },
        { icon: CalendarClock, label: "Slots", path: "/slots" },
        { icon: DollarSign, label: "Pricing", path: "/pricing" },
        { icon: Calendar, label: "Events", path: "/events" },
        { icon: Users, label: "Users", path: "/users" },
        { icon: BarChart3, label: "Reports", path: "/reports" },
    ];

    const closeMobileMenu = () => {
        if (window.innerWidth < 768) {
            setMobileOpen(false);
        }
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg glass-card"
            >
                {mobileOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 z-30"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    "glass-panel flex flex-col h-screen fixed left-0 top-0 z-40 transition-all duration-300 ease-in-out",
                    collapsed ? "w-20" : "w-64",
                    // Mobile: slide in from left
                    "md:translate-x-0",
                    mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                )}
            >
                {/* Header / Logo */}
                <div className="h-16 flex items-center justify-between px-4 border-b border-[rgba(255,255,255,0.4)]">
                    {!collapsed && <span className="font-bold text-lg tracking-tight">AdScreen</span>}
                    <button
                        onClick={() => setCollapsed(!collapsed)}
                        className="hidden md:block p-2 rounded-lg hover:bg-black/5 text-[hsl(var(--color-text-muted))]"
                    >
                        {collapsed ? <Menu size={20} /> : <ChevronLeft size={20} />}
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 py-6 space-y-1 px-3 overflow-y-auto">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={closeMobileMenu}
                            className={({ isActive }) =>
                                cn(
                                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
                                    "hover:bg-black/5",
                                    isActive
                                        ? "bg-[hsl(var(--color-primary))] text-white"
                                        : "text-[hsl(var(--color-text-main))]",
                                    collapsed && "justify-center"
                                )
                            }
                        >
                            <item.icon size={20} />
                            {!collapsed && <span className="font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                {/* Logout */}
                <div className="p-3 border-t border-[rgba(255,255,255,0.4)]">
                    <button
                        onClick={handleLogout}
                        className={cn(
                            "flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200",
                            "hover:bg-red-50 text-red-600",
                            collapsed && "justify-center"
                        )}
                    >
                        <LogOut size={20} />
                        {!collapsed && <span className="font-medium">Logout</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
