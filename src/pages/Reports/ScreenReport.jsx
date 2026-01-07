import React, { useState } from 'react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Download, Monitor, TrendingUp } from 'lucide-react';
import { mockScreens } from '../../data/mockData';
import { ReportNav } from './ReportNav';

export function ScreenReport() {
    const [timeRange, setTimeRange] = useState('7 days');

    const handleExport = () => {
        alert('Screen utilization report export started.');
    };

    // Utilization Line Chart
    const UtilizationChart = () => {
        const height = 180;
        const width = 800;
        const padding = 40;
        const data = [
            { date: 'Mon', value: 75 },
            { date: 'Tue', value: 82 },
            { date: 'Wed', value: 78 },
            { date: 'Thu', value: 85 },
            { date: 'Fri', value: 92 },
            { date: 'Sat', value: 88 },
            { date: 'Sun', value: 85 },
        ];

        const points = data.map((d, i) => {
            const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
            const y = height - (d.value / 100) * (height - padding * 2) - padding;
            return `${x},${y}`;
        }).join(' ');

        return (
            <div className="w-full overflow-x-auto py-4">
                <svg width={width} height={height} className="overflow-visible">
                    {/* Y-axis grid */}
                    {[0, 0.5, 1].map((p, idx) => (
                        <line
                            key={idx}
                            x1={padding}
                            y1={padding + p * (height - padding * 2)}
                            x2={width - padding}
                            y2={padding + p * (height - padding * 2)}
                            stroke="#f3f4f6"
                            strokeWidth="1"
                        />
                    ))}
                    {/* X-axis labels */}
                    {data.map((d, i) => (
                        <text
                            key={i}
                            x={(i / (data.length - 1)) * (width - padding * 2) + padding}
                            y={height - padding + 20}
                            textAnchor="middle"
                            fontSize="10"
                            fill="#94a3b8"
                        >
                            {d.date}
                        </text>
                    ))}
                    {/* Area */}
                    <path
                        d={`M ${padding},${height - padding} L ${points} L ${width - padding},${height - padding} Z`}
                        fill="rgba(59, 130, 246, 0.05)"
                    />
                    {/* Line */}
                    <polyline
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="3"
                        points={points}
                        strokeLinejoin="round"
                        strokeLinecap="round"
                    />
                    {/* Data Points */}
                    {data.map((d, i) => {
                        const x = (i / (data.length - 1)) * (width - padding * 2) + padding;
                        const y = height - (d.value / 100) * (height - padding * 2) - padding;
                        return (
                            <circle
                                key={i}
                                cx={x}
                                cy={y}
                                r="4"
                                fill="#fff"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                className="transition-all hover:r-6 cursor-pointer"
                            />
                        );
                    })}
                </svg>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-10">
            <ReportNav />

            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">Screen Utilization Reports</h1>
                    <p className="text-sm text-gray-500">Detailed utilization and performance metrics for digital screens.</p>
                </div>
                <Button variant="outline" size="sm" className="font-bold border-blue-200 text-blue-600 hover:bg-blue-50" onClick={handleExport}>
                    <Download size={14} className="mr-2" /> Export
                </Button>
            </div>

            <Card className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-2">
                        <TrendingUp size={18} className="text-blue-600" />
                        <h3 className="text-sm font-bold">Overall Utilization Trend (%)</h3>
                    </div>
                    <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
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
                <UtilizationChart />
            </Card>

            {/* Demographics Grid (Matching Uploaded Image) */}
            <Card className="p-0 overflow-hidden border border-gray-200 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-10 border-b border-gray-200 bg-[#2d3748] text-white text-[10px] font-bold uppercase tracking-wider text-center">
                    <div className="md:col-span-3 py-2 border-r border-gray-600">Profile by Nationality</div>
                    <div className="md:col-span-2 py-2 border-r border-gray-600">Profile by Gender</div>
                    <div className="md:col-span-5 py-2">Profile by Age Group</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-10 bg-[#2d3748] text-white text-[11px] font-bold text-center border-b border-gray-200">
                    <div className="py-2 border-r border-gray-600">Kuwaiti</div>
                    <div className="py-2 border-r border-gray-600">Arab</div>
                    <div className="py-2 border-r border-gray-600">Non-Arab</div>
                    <div className="py-2 border-r border-gray-600">Male</div>
                    <div className="py-2 border-r border-gray-600">Female</div>
                    <div className="py-2 border-r border-gray-600">Boomers (61-80)</div>
                    <div className="py-2 border-r border-gray-600">Gen X (45-60)</div>
                    <div className="py-2 border-r border-gray-600">Millennials (29-44)</div>
                    <div className="py-2 border-r border-gray-600">Gen Z (&lt;28)</div>
                    <div className="py-2">Other</div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-10 text-center text-sm font-bold py-4">
                    <div className="border-r border-dashed border-gray-200">43%</div>
                    <div className="border-r border-dashed border-gray-200">27%</div>
                    <div className="border-r border-dashed border-gray-200">30%</div>
                    <div className="border-r border-dashed border-gray-200">67%</div>
                    <div className="border-r border-dashed border-gray-200">33%</div>
                    <div className="border-r border-dashed border-gray-200">24%</div>
                    <div className="border-r border-dashed border-gray-200">28%</div>
                    <div className="border-r border-dashed border-gray-200">29%</div>
                    <div className="border-r border-dashed border-gray-200">19%</div>
                    <div>-</div>
                </div>
            </Card>

            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-50/50">
                            <TableHead className="font-bold">Screen Name</TableHead>
                            <TableHead className="font-bold">Location</TableHead>
                            <TableHead className="font-bold text-right">Avg. Utilization</TableHead>
                            <TableHead className="font-bold text-right">Impressions</TableHead>
                            <TableHead className="font-bold text-right">Playouts</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {mockScreens.map((screen, i) => (
                            <TableRow key={screen.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell className="font-medium flex items-center gap-2">
                                    <Monitor size={14} className="text-gray-400" />
                                    {screen.name}
                                </TableCell>
                                <TableCell className="text-gray-500 text-sm">{screen.location}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex flex-col items-end gap-1">
                                        <span className="text-[10px] font-bold">{85 - i * 2}%</span>
                                        <div className="w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${85 - i * 2}%` }} />
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-bold text-blue-600">{(124500 - i * 10000).toLocaleString()}</TableCell>
                                <TableCell className="text-right text-sm">{(12450 - i * 1000).toLocaleString()}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
