import React from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, Users, BarChart3, TrendingUp, Activity } from 'lucide-react';
import { mockTenantsDetailed } from '../../data/mockTenants';
import { ReportNav } from './ReportNav';

// Generic Bar Chart Component matching screenshot aesthetics
const BarChart = ({ data, color = "#3b82f6", height = 200, title, icon: Icon }) => {
    const width = 600;
    const padding = 40;
    const barPadding = 30;

    const maxVal = Math.max(...data.map(d => d.value)) * 1.2 || 100;
    const barWidth = (width - padding * 2) / data.length - barPadding;

    return (
        <Card className="p-6">
            <div className="flex items-center gap-2 mb-6">
                {Icon && <Icon size={18} className="text-gray-400" />}
                <h3 className="text-sm font-bold text-gray-900">{title}</h3>
            </div>
            <div className="w-full overflow-x-auto">
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
                                    rx="4"
                                    className="transition-all hover:brightness-110"
                                />
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding - individualBarHeight - 10}
                                    textAnchor="middle"
                                    fontSize="11"
                                    fill="#1e293b"
                                    className="font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    {d.value.toLocaleString()}
                                </text>
                                <text
                                    x={x + barWidth / 2}
                                    y={height - padding + 20}
                                    textAnchor="middle"
                                    fontSize="10"
                                    fill="#64748b"
                                    className="font-medium"
                                >
                                    {d.label}
                                </text>
                            </g>
                        );
                    })}
                    <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="#e2e8f0" strokeWidth="1" />
                </svg>
            </div>
        </Card>
    );
};

export function UserReport() {
    const reportData = [
        { name: 'RetailGiant', campaigns: 4, impressions: 124500, playouts: 82000, lastActivity: 'Jan 05, 2026', status: 'Active' },
        { name: 'InnoTech', campaigns: 4, impressions: 114500, playouts: 77000, lastActivity: 'Jan 05, 2026', status: 'Active' },
        { name: 'BevCo', campaigns: 4, impressions: 104500, playouts: 72000, lastActivity: 'Jan 05, 2026', status: 'Active' },
        { name: 'FashionHub', campaigns: 4, impressions: 94500, playouts: 67000, lastActivity: 'Jan 05, 2026', status: 'Active' },
    ];

    const impressionsData = reportData.map(d => ({ label: d.name, value: d.impressions }));
    const playoutsData = reportData.map(d => ({ label: d.name, value: d.playouts }));

    const handleExport = () => {
        alert('User report export started.');
    };

    return (
        <div className="space-y-6 pb-10">
            <ReportNav />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">User Reports</h1>
                    <p className="text-sm text-gray-500">Aggregated performance and activity metrics per user account.</p>
                </div>
                <Button variant="outline" size="sm" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleExport}>
                    <Download size={14} className="mr-2" /> Export
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <BarChart
                    title="Impressions by Account"
                    data={impressionsData}
                    color="#3b82f6"
                    icon={TrendingUp}
                />
                <BarChart
                    title="Playouts by Account"
                    data={playoutsData}
                    color="#10b981"
                    icon={Activity}
                />
            </div>

            <Card className="p-0 overflow-hidden text-[#1e293b]">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="font-bold">User / Account Name</TableHead>
                            <TableHead className="font-bold text-right">Total Campaigns</TableHead>
                            <TableHead className="font-bold text-right">Impressions</TableHead>
                            <TableHead className="font-bold text-right">Playouts</TableHead>
                            <TableHead className="font-bold">Last Activity</TableHead>
                            <TableHead className="font-bold">Status</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {reportData.map((tenant) => (
                            <TableRow key={tenant.name} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium">{tenant.name}</TableCell>
                                <TableCell className="text-right">{tenant.campaigns}</TableCell>
                                <TableCell className="text-right font-bold text-blue-600">{tenant.impressions.toLocaleString()}</TableCell>
                                <TableCell className="text-right font-bold text-green-600">{tenant.playouts.toLocaleString()}</TableCell>
                                <TableCell className="text-gray-500 text-sm font-medium">{tenant.lastActivity}</TableCell>
                                <TableCell>
                                    <Badge className="bg-green-50 text-green-600 border-none px-2 py-0.5 text-[10px] font-bold uppercase">{tenant.status}</Badge>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
