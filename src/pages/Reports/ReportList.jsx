import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import {
    Plus,
    Info,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Search,
    ChevronRight,
    Download,
    TrendingUp,
    Megaphone,
    Eye
} from 'lucide-react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ReportNav } from './ReportNav';
import { mockReportStats, mockSpendingOverview, mockLineItems, mockDailyPerformance } from '../../data/mockReports';
import { mockCampaigns } from '../../data/mockData';

export function ReportList() {
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('7 Days');
    const [tableTab, setTableTab] = useState('Campaigns');

    const handleExport = () => {
        alert('Master report export started.');
    };

    const statusVariants = {
        submitted: 'warning',
        booked: 'default',
        running: 'running',
        completed: 'success'
    };

    const statusLabels = {
        submitted: 'Submitted',
        booked: 'Booked',
        running: 'Running',
        completed: 'Completed'
    };

    // Generic Bar Chart Component matching screenshot aesthetics
    const BarChart = ({ data, color = "#10b981", height = 180 }) => {
        const chartWidth = 800;
        const padding = 50;
        const barPadding = 20;

        const maxVal = Math.max(...data.map(d => d.value)) * 1.2 || 100;
        const barWidth = (chartWidth - padding * 2) / data.length - barPadding;

        return (
            <div className="w-full overflow-x-auto py-6">
                <svg width={chartWidth} height={height} className="overflow-visible">
                    {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                        <line
                            key={idx}
                            x1={padding}
                            y1={height - padding - p * (height - padding * 2)}
                            x2={chartWidth - padding}
                            y2={height - padding - p * (height - padding * 2)}
                            stroke="#f1f5f9"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    ))}
                    {data.map((d, i) => {
                        const x = padding + i * (barWidth + barPadding) + barPadding / 2;
                        const individualBarHeight = (d.value / maxVal) * (height - padding * 2);
                        return (
                            <g key={i} className="group">
                                <rect
                                    x={x}
                                    y={height - padding - individualBarHeight}
                                    width={barWidth}
                                    height={individualBarHeight}
                                    fill={color}
                                    rx="2"
                                    className="transition-all hover:brightness-110"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding + 20}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#94a3b8"
                                    className="font-medium"
                                >
                                    {d.date}
                                </text>
                            </g>
                        );
                    })}
                    <line x1={padding} y1={height - padding} x2={chartWidth - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />
                </svg>
            </div>
        );
    };

    const location = useLocation();
    const currentPath = location.pathname;

    return (
        <div className="space-y-8 pb-10">
            <ReportNav />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Reports Overview</h1>
                    <p className="text-sm text-gray-500">Comprehensive overview of campaign performance and system utilization.</p>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" size="sm" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleExport}>
                        <Download size={14} className="mr-2" /> Export
                    </Button>
                    <Button className="bg-[hsl(var(--color-primary))] text-white hover:opacity-90 font-bold" onClick={() => navigate('/campaigns/new')}>
                        <Plus size={18} className="mr-2" /> Create New
                    </Button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {[
                    { label: 'Active Campaigns', value: mockReportStats.activeCampaigns, icon: MegaphoneIcon },
                    { label: 'Paused Campaigns', value: mockReportStats.pausedCampaigns, icon: megaphonePausedIcon },
                ].map((stat, idx) => (
                    <Card key={idx} className="flex items-center gap-4 p-4 hover:shadow-md transition-shadow">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center bg-gray-50">
                            <stat.icon />
                        </div>
                        <div>
                            <div>
                                <span className="text-3xl font-bold">{stat.value}</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">{stat.label}</span>
                                <Info size={12} className="text-gray-400" />
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* Visual Charts Overview */}
            <div className="space-y-6">
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-green-500" />
                        <h3 className="text-sm font-bold">Active Screens Over Time</h3>
                    </div>
                    <BarChart data={mockDailyPerformance.screens} color="#10b981" height={220} />
                </Card>

                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                        <TrendingUp size={16} className="text-blue-500" />
                        <h3 className="text-sm font-bold">Number of Playouts Over Time</h3>
                    </div>
                    <BarChart data={mockDailyPerformance.playouts} color="#6366f1" height={180} />
                </Card>
            </div>

            {/* Items Section */}
            <div>
                <div className="flex justify-between items-center mb-6">
                    <div className="flex gap-4 border-b w-full">
                        <button
                            onClick={() => setTableTab('Campaigns')}
                            className={`pb-4 text-sm font-bold transition-all border-b-2 ${tableTab === 'Campaigns' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Campaign Status View
                        </button>
                        <button
                            onClick={() => setTableTab('LineItems')}
                            className={`pb-4 text-sm font-bold transition-all border-b-2 ${tableTab === 'LineItems' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'}`}
                        >
                            Performance Line Items
                        </button>
                    </div>
                </div>

                <Card className="p-0 overflow-hidden shadow-sm border-gray-100">
                    <Table>
                        {tableTab === 'Campaigns' ? (
                            <>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Campaign</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Tenant</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Date Range</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Screens</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Status</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400 text-right">Activity</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockCampaigns.map((campaign) => (
                                        <TableRow key={campaign.id} className="cursor-pointer hover:bg-gray-50/50 group" onClick={() => navigate(`/reports/campaign/${campaign.id}`)}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm group-hover:text-blue-600 transition-colors">{campaign.name}</span>
                                                    <span className="text-[10px] text-gray-400 font-mono">{campaign.id}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-gray-600">{campaign.tenant}</TableCell>
                                            <TableCell className="text-sm text-gray-500">{campaign.dateRange || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Badge variant="outline" className="text-[10px]">{campaign.screens?.length || 0} Screens</Badge>
                                            </TableCell>
                                            <TableCell>
                                                <Badge variant={statusVariants[campaign.status] || 'default'} className="text-[10px] uppercase font-bold">
                                                    {statusLabels[campaign.status] || campaign.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <ChevronRight size={16} className="inline text-gray-300 group-hover:text-blue-500 transition-colors" />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </>
                        ) : (
                            <>
                                <TableHeader>
                                    <TableRow className="bg-gray-50/50">
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Line Item</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Start Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">End Date</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Impressions</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Playouts</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400">Status</TableHead>
                                        <TableHead className="text-[10px] uppercase font-bold text-gray-400 text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockLineItems.map((item) => (
                                        <TableRow key={item.id} className="cursor-pointer hover:bg-gray-50/50 group" onClick={() => navigate(`/reports/campaign/CMP-001`)}>
                                            <TableCell>
                                                <div className="flex flex-col">
                                                    <span className="font-bold text-sm group-hover:text-blue-600 transition-colors">{item.name}</span>
                                                    <span className="text-[10px] text-gray-400">{item.campaign}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-sm font-medium text-gray-600">{item.startDate}</TableCell>
                                            <TableCell className="text-sm font-medium text-gray-600">{item.endDate}</TableCell>
                                            <TableCell className="text-sm font-bold">12,450</TableCell>
                                            <TableCell className="text-sm font-bold">8,200</TableCell>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    <div className={`w-2 h-2 rounded-full ${item.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`} />
                                                    <span className="text-sm font-medium">{item.status}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        navigate(`/reports/campaign/CMP-001`);
                                                    }}
                                                >
                                                    <Eye size={14} className="mr-1" />
                                                    View
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </>
                        )}
                    </Table>
                </Card>
            </div>
        </div>
    );
}

// Helper components for the table header filters
const SearchInput = ({ placeholder, showFilter }) => (
    <div className="relative group">
        <input
            type="text"
            placeholder={placeholder}
            className="w-full text-[10px] py-1 border-none focus:ring-0 placeholder-gray-300"
        />
        {showFilter && (
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center">
                <Filter size={10} className="text-gray-300 cursor-pointer hover:text-gray-600" />
            </div>
        )}
    </div>
);

// Custom icons matching the screenshot
const MegaphoneIcon = () => (
    <div className="text-black">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 7V3L2 9h4v10h2V9h4v-2z" />
            <path d="M11 13c1.9 0 3.5 1.6 3.5 3.5S12.9 20 11 20s-3.5-1.6-3.5-3.5 1.6-3.5 3.5-3.5z" />
        </svg>
    </div>
);

const megaphonePausedIcon = () => (
    <div className="text-gray-400">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M11 5L6 9H2v6h4l5 4V5z" strokeDasharray="2 2" />
        </svg>
    </div>
);
