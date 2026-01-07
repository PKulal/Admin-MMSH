import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import {
    ArrowLeft,
    Info,
    Search,
    ChevronDown,
    Calendar,
    MapPin,
    Monitor,
    Users,
    Download,
    BarChart3,
    TrendingUp
} from 'lucide-react';
import { mockCampaigns } from '../../data/mockData';
import { mockCampaignPerformance, mockDemographics, mockDailyPerformance } from '../../data/mockReports';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';

export function CampaignReport() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [timeRange, setTimeRange] = useState('7 days');
    const [activeTab, setActiveTab] = useState('Dashboard');

    const campaign = mockCampaigns.find(c => c.id === id) || mockCampaigns[0];
    const performance = mockCampaignPerformance[campaign.id] || mockCampaignPerformance['CMP-001'];

    const handleExport = () => {
        alert('Report export started. Your download will begin shortly.');
    };

    // Generic Bar Chart Component matching screenshot aesthetics
    const BarChart = ({ data, color = "#10b981", height = 180, title }) => {
        const width = 800;
        const padding = 50;
        const barPadding = 20;

        const maxVal = Math.max(...data.map(d => d.value)) * 1.2 || 100;
        const barWidth = (width - padding * 2) / data.length - barPadding;

        return (
            <div className="w-full overflow-x-auto py-6">
                <svg width={width} height={height} className="overflow-visible">
                    {[0, 0.25, 0.5, 0.75, 1].map((p, idx) => (
                        <line
                            key={idx}
                            x1={padding}
                            y1={height - padding - p * (height - padding * 2)}
                            x2={width - padding}
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
                            <g key={i} className="group cursor-help">
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
                                    y={height - padding - individualBarHeight - 5}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#1e293b"
                                    className="font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {d.value}
                                </text>
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
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />
                </svg>
            </div>
        );
    };

    // Demographic Distribution Chart Helper
    const DemographicChart = ({ title, data, colors = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6"] }) => {
        return (
            <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{title}</h4>
                <div className="flex h-6 w-full rounded-full overflow-hidden border border-gray-100 shadow-inner">
                    {data.map((item, i) => (
                        <div
                            key={i}
                            style={{ width: `${item.value}%`, backgroundColor: colors[i % colors.length] }}
                            className="h-full relative group transition-all hover:brightness-110"
                        >
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <span className="text-[8px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                    {item.value}%
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="space-y-2">
                    {data.map((item, i) => (
                        <div key={i} className="flex items-center justify-between text-[10px]">
                            <div className="flex items-center gap-1.5">
                                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                                <span className="text-gray-500 font-medium">{item.label}</span>
                            </div>
                            <span className="font-bold text-gray-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Search size={16} />
                        <span>Search</span>
                    </div>
                    <div>
                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-1">
                            <span>Campaigns</span> / <span>Cake shop campaign</span> / <span className="text-gray-900">{campaign.name}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold">{campaign.name}</h1>
                            <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-none px-2 py-0 text-[10px] uppercase font-bold">Active</Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <div className="flex items-center gap-1"><MapPin size={14} /> Screens Locations: <span className="font-bold text-gray-900">United Kingdom, London +2</span></div>
                            <div className="flex items-center gap-1"><Monitor size={14} /> Selected Screens: <span className="font-bold text-gray-900">{campaign.screens.length}</span></div>
                            <div className="flex items-center gap-1"><Users size={14} /> Available Weekly Audience: <span className="font-bold text-gray-900">4.1M</span></div>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 mr-4">
                        <span className="text-sm font-medium">Deactivate</span>
                        <div className="w-10 h-5 bg-green-500 rounded-full relative cursor-pointer">
                            <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-sm" />
                        </div>
                    </div>
                    <Button variant="outline" size="sm" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleExport}>
                        <Download size={14} className="mr-2" /> Export
                    </Button>
                    <Button variant="outline" size="sm" className="font-bold" onClick={() => navigate(`/campaigns/${campaign.id}/edit`)}>Edit</Button>
                </div>
            </div>

            {/* Tabs & Controls */}
            <div className="flex justify-between items-end border-b pb-1">
                <div className="flex gap-8">
                    <button
                        onClick={() => setActiveTab('Dashboard')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'Dashboard' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('Screens')}
                        className={`text-sm font-bold pb-2 border-b-2 transition-all ${activeTab === 'Screens' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
                            }`}
                    >
                        Screens
                    </button>
                </div>
                <div className="flex gap-1 p-1 bg-gray-100 rounded-lg mb-2">
                    {['7 days', '14 days', '30 days'].map(r => (
                        <button
                            key={r}
                            onClick={() => setTimeRange(r)}
                            className={`px-3 py-1 text-[10px] font-bold rounded-md transition-all ${timeRange === r ? 'bg-white shadow-sm text-black' : 'text-gray-400'
                                }`}
                        >
                            {r}
                        </button>
                    ))}
                </div>
            </div>

            {/* Content Rendering */}
            {activeTab === 'Dashboard' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Charts Area */}
                    <div className="lg:col-span-3 space-y-4">
                        {/* 1. Active Screens Over Time */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <TrendingUp size={16} className="text-green-500" />
                                <h3 className="text-sm font-bold">Active Screens Over Time</h3>
                            </div>
                            <BarChart
                                data={mockDailyPerformance.screens}
                                color="#10b981"
                                height={220}
                            />
                        </Card>

                        {/* 2. Playouts Over Time */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-2">
                                <BarChart3 size={16} className="text-blue-500" />
                                <h3 className="text-sm font-bold">Number of Playouts Over Time</h3>
                            </div>
                            <BarChart
                                data={mockDailyPerformance.playouts}
                                color="#6366f1"
                                height={220}
                            />
                        </Card>

                        {/* Audience Demographics */}
                        <Card className="p-6">
                            <div className="flex items-center gap-2 mb-6">
                                <BarChart3 size={18} className="text-blue-600" />
                                <h3 className="text-sm font-bold">Audience Demographics</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                                <DemographicChart
                                    title="Profile by Nationality"
                                    data={mockDemographics.nationality}
                                    colors={["#1e293b", "#334155", "#475569"]}
                                />
                                <DemographicChart
                                    title="Profile by Gender"
                                    data={mockDemographics.gender}
                                    colors={["#0ea5e9", "#f472b6"]}
                                />
                                <DemographicChart
                                    title="Profile by Age Group"
                                    data={mockDemographics.ageGroup}
                                    colors={["#6366f1", "#8b5cf6", "#a855f7", "#d946ef"]}
                                />
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar Details */}
                    <div className="space-y-4">
                        <Card className="p-6 space-y-6">
                            <div className="flex justify-between items-center">
                                <h3 className="text-sm font-bold">Details</h3>
                            </div>

                            {/* Dates & Schedule */}
                            <div className="space-y-4">
                                <div>
                                    <h4 className="text-[8px] text-gray-400 font-bold uppercase mb-1">Line Item Dates</h4>
                                    <div className="flex items-center justify-between">
                                        <span className="text-[10px] font-bold">Sep 12, 2024 - Oct 31, 2024</span>
                                        <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[8px] font-bold text-gray-600">50 Days</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[8px] text-gray-400 font-bold uppercase mb-1">Schedule</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-gray-400">Weekly hours</span>
                                            <span className="text-[10px] font-bold">{performance.schedule.weeklyHours}</span>
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-[8px] text-gray-400">Avg Daily Hours</span>
                                            <span className="text-[10px] font-bold">{performance.schedule.avgDailyHours}</span>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-[8px] text-gray-400 font-bold uppercase mb-1">Pacing</h4>
                                    <span className="text-[10px] font-bold text-gray-900">{performance.budget.pacing}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="w-full mt-4 text-[10px] font-bold text-gray-400 flex items-center justify-center gap-1"
                                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                >
                                    <Eye size={14} /> Details
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <Card className="p-0 overflow-hidden">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-50/50">
                                <TableHead className="font-bold">Screen Name</TableHead>
                                <TableHead className="font-bold">Location</TableHead>
                                <TableHead className="font-bold text-right">Impressions</TableHead>
                                <TableHead className="font-bold text-right">Playouts</TableHead>
                                <TableHead className="font-bold text-right">Utilization</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {campaign.screens.map((screen) => (
                                <TableRow key={screen.id}>
                                    <TableCell
                                        className="font-medium hover:text-blue-600 transition-colors cursor-pointer"
                                        onClick={() => navigate(`/inventory/${screen.id}`)}
                                    >
                                        {screen.name}
                                    </TableCell>
                                    <TableCell className="text-gray-500">{screen.location}</TableCell>
                                    <TableCell className="text-right font-bold">12,450</TableCell>
                                    <TableCell className="text-right font-bold">8,200</TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-[10px] font-bold">92%</span>
                                            <div className="w-20 h-1 bg-gray-100 rounded-full overflow-hidden">
                                                <div className="h-full bg-blue-500" style={{ width: '92%' }} />
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Card>
            )}
        </div>
    );
}
