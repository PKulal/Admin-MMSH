
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    Eye,
    Edit,
    FileDown,
    Printer,
    Copy,
    Download,
    ClipboardList
} from 'lucide-react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { mockQuotations } from '../../data/mockQuotations';

export function QuotationList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const filteredQuotations = mockQuotations.filter(q => {
        const matchesSearch = q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.client.toLowerCase().includes(searchTerm.toLowerCase()) ||
            q.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'All' || q.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Quotations</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Manage and generate commercial quotations for clients and agencies.
                    </p>
                </div>
                <Button
                    onClick={() => navigate('/quotations/new')}
                    className="bg-black text-white hover:bg-gray-800 rounded-xl px-6 py-6 shadow-lg shadow-black/10 transition-all hover:scale-[1.02]"
                >
                    <Plus size={20} className="mr-2" />
                    Create Quotation
                </Button>
            </div>

            {/* Filters Bar */}
            <Card className="glass-card border-none p-4">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder="Search by ID, title, or client..."
                            className="pl-10 bg-white/50 border-white/20"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex gap-2">
                        <select
                            className="bg-white/50 border border-white/20 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                        >
                            <option value="All">All Statuses</option>
                            <option value="Draft">Draft</option>
                            <option value="Finalized">Finalized</option>
                        </select>
                        <Button variant="outline" className="bg-white/50 border-white/20">
                            <Filter size={18} className="mr-2" />
                            More Filters
                        </Button>
                    </div>
                </div>
            </Card>

            {/* List Table */}
            <Card className="glass-card border-none overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-white/20 bg-black/5">
                                <th className="px-6 py-4 font-bold text-sm">Quotation No</th>
                                <th className="px-6 py-4 font-bold text-sm">Title</th>
                                <th className="px-6 py-4 font-bold text-sm">Client/Agency</th>
                                <th className="px-6 py-4 font-bold text-sm">Duration</th>
                                <th className="px-6 py-4 font-bold text-sm text-right">Total Gross</th>
                                <th className="px-6 py-4 font-bold text-sm text-right">Total Net</th>
                                <th className="px-6 py-4 font-bold text-sm">Status</th>
                                <th className="px-6 py-4 font-bold text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {filteredQuotations.map((quo) => (
                                <tr key={quo.id} className="hover:bg-white/30 transition-colors group">
                                    <td className="px-6 py-4 text-sm font-medium">{quo.id}</td>
                                    <td className="px-6 py-4 text-sm font-medium">{quo.title}</td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-semibold">{quo.client}</div>
                                        <div className="text-xs text-[hsl(var(--color-text-muted))]">{quo.agency}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm">{quo.duration}</td>
                                    <td className="px-6 py-4 text-sm text-right font-medium">
                                        {formatCurrency(quo.totalGross)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-right font-bold text-[hsl(var(--color-primary))]">
                                        {formatCurrency(quo.totalNet)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <Badge
                                            variant={quo.status === 'Finalized' ? 'success' : 'secondary'}
                                            className={quo.status === 'Finalized' ? 'bg-green-500/10 text-green-600 border-green-500/20' : 'bg-gray-500/10 text-gray-600 border-gray-500/20'}
                                        >
                                            {quo.status}
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1">
                                            <Button variant="ghost" size="sm" onClick={() => navigate(`/quotations/${quo.id}`)}>
                                                <Eye size={16} />
                                            </Button>
                                            {quo.status === 'Draft' && (
                                                <Button variant="ghost" size="sm" onClick={() => navigate(`/quotations/${quo.id}/edit`)}>
                                                    <Edit size={16} />
                                                </Button>
                                            )}
                                            <Button variant="ghost" size="sm">
                                                <Download size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Printer size={16} />
                                            </Button>
                                            <Button variant="ghost" size="sm">
                                                <Copy size={16} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {filteredQuotations.length === 0 && (
                                <tr>
                                    <td colSpan="8" className="px-6 py-12 text-center text-[hsl(var(--color-text-muted))]">
                                        <div className="flex flex-col items-center gap-2">
                                            <ClipboardList size={40} className="opacity-20" />
                                            <p>No quotations found matching your criteria.</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
