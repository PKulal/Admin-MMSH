import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/ui/Card';
import { Badge } from '../components/ui/Badge';
import { Button } from '../components/ui/Button';
import {
    Megaphone,
    Monitor,
    CalendarClock,
    DollarSign,
    Calendar,
    Building2,
    Users,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';

export function Dashboard() {
    const navigate = useNavigate();

    // Mock statistics
    const stats = {
        campaigns: {
            total: 42,
            submitted: 8,
            running: 12,
            completed: 22
        },
        screens: {
            total: 8,
            active: 6,
            inactive: 2
        },
        slots: {
            total: 24,
            available: 18,
            locked: 6
        },
        tenants: {
            total: 5,
            active: 4
        },
        users: {
            total: 8,
            active: 7
        }
    };

    const recentActivity = [
        { id: 1, type: 'campaign', message: 'New campaign "Summer Sale 2026" submitted', time: '2 hours ago', status: 'pending', targetId: 'CMP-001' },
        { id: 2, type: 'screen', message: 'Screen "Dubai Mall LED" activated', time: '5 hours ago', status: 'success', targetId: 'SCR-002' },
        { id: 3, type: 'user', message: 'New user "Layla Hassan" created', time: '1 day ago', status: 'success', targetId: 'USR-004' },
        { id: 4, type: 'pricing', message: 'Pricing updated for "Hamad Airport"', time: '2 days ago', status: 'success', targetId: 'SCR-003' }
    ];


    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };


    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
                <p className="text-[hsl(var(--color-text-muted))]">
                    Welcome to AdScreen Admin Portal
                </p>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => navigate('/campaigns')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Total Campaigns</p>
                            <div className="text-3xl font-bold mt-1 group-hover:text-blue-600 transition-colors">{stats.campaigns.total}</div>
                            <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                                {stats.campaigns.running} running
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600 transition-transform group-hover:scale-110">
                            <Megaphone size={24} />
                        </div>
                    </div>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => navigate('/inventory')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Active Screens</p>
                            <div className="text-3xl font-bold mt-1 group-hover:text-green-600 transition-colors">{stats.screens.active}</div>
                            <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                                of {stats.screens.total} total
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-50 text-green-600 transition-transform group-hover:scale-110">
                            <Monitor size={24} />
                        </div>
                    </div>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => navigate('/slots')}
                >
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Available Slots</p>
                            <div className="text-3xl font-bold mt-1 group-hover:text-purple-600 transition-colors">{stats.slots.available}</div>
                            <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                                {stats.slots.locked} locked
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-50 text-purple-600 transition-transform group-hover:scale-110">
                            <CalendarClock size={24} />
                        </div>
                    </div>
                </Card>

            </div>

            {/* Secondary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => navigate('/users')}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-indigo-50 text-indigo-600 transition-transform group-hover:scale-110">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Active Tenants</p>
                            <div className="text-2xl font-bold group-hover:text-indigo-600 transition-colors">{stats.tenants.active}</div>
                        </div>
                    </div>
                </Card>

                <Card
                    className="cursor-pointer hover:shadow-md transition-shadow group"
                    onClick={() => navigate('/users')}
                >
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-cyan-50 text-cyan-600 transition-transform group-hover:scale-110">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Active Users</p>
                            <div className="text-2xl font-bold group-hover:text-cyan-600 transition-colors">{stats.users.active}</div>
                        </div>
                    </div>
                </Card>
            </div>


            {/* Recent Activity */}
            < Card >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Recent Activity</h3>
                    <Button variant="ghost" size="sm">
                        View All
                    </Button>
                </div>
                <div className="space-y-3">
                    {recentActivity.map(activity => (
                        <div
                            key={activity.id}
                            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group"
                            onClick={() => {
                                if (activity.type === 'campaign') navigate(`/campaigns/${activity.targetId}`);
                                if (activity.type === 'screen' || activity.type === 'pricing') navigate(`/inventory/${activity.targetId}`);
                                if (activity.type === 'user') navigate(`/users`);
                            }}
                        >
                            <div className={`p-2 rounded-full transition-transform group-hover:scale-110 ${activity.status === 'success' ? 'bg-green-50 text-green-600' : 'bg-orange-50 text-orange-600'
                                }`}>
                                {activity.status === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                            </div>
                            <div className="flex-1">
                                <p className="font-medium group-hover:text-blue-600 transition-colors">{activity.message}</p>
                                <p className="text-sm text-[hsl(var(--color-text-muted))]">{activity.time}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card >

        </div >
    );
}
