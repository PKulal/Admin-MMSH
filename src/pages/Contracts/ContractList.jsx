import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Plus,
    Search,
    Filter,
    MoreVertical,
    Eye,
    Edit,
    Trash2,
    FileText,
    Calendar,
    ArrowUpRight,
    CheckCircle,
    Clock,
    XCircle
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell
} from '../../components/ui/Table';
import { mockContracts } from '../../data/mockContracts';

export function ContractList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const getStatusBadge = (status) => {
        switch (status) {
            case 'active':
                return <Badge className="bg-green-100 text-green-700 hover:bg-green-100 border-green-200"><CheckCircle size={12} className="mr-1" /> Active</Badge>;
            case 'expired':
                return <Badge className="bg-gray-100 text-gray-700 hover:bg-gray-100 border-gray-200"><XCircle size={12} className="mr-1" /> Expired</Badge>;
            case 'pending':
                return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100 border-yellow-200"><Clock size={12} className="mr-1" /> Pending</Badge>;
            default:
                return <Badge variant="outline">{status}</Badge>;
        }
    };

    const filteredContracts = mockContracts.filter(contract =>
        contract.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contract.tenantName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
                    <p className="text-[hsl(var(--color-text-muted))]">Manage long-term agreements and pricing rules for agencies.</p>
                </div>
                <Button onClick={() => navigate('/contracts/new')} className="bg-black text-white hover:bg-gray-800">
                    <Plus size={18} className="mr-2" /> New Contract
                </Button>
            </div>

            <Card>
                <CardHeader className="pb-3">
                    <div className="flex items-center gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <Input
                                placeholder="Search contracts or tenants..."
                                className="pl-10"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <Button variant="outline" className="flex items-center gap-2">
                            <Filter size={18} /> Filter
                        </Button>
                    </div>
                </CardHeader>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Contract Details</TableHead>
                            <TableHead>Tenant/Agency</TableHead>
                            <TableHead>Duration</TableHead>
                            <TableHead>Pricing Rule</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Usage</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredContracts.map((contract) => (
                            <TableRow key={contract.id}>
                                <TableCell>
                                    <div>
                                        <p className="font-bold text-sm">{contract.title}</p>
                                        <p className="text-xs text-gray-500">{contract.id}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-[10px] font-bold">
                                            {contract.tenantName.substring(0, 2).toUpperCase()}
                                        </div>
                                        <p className="text-sm font-medium">{contract.tenantName}</p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="space-y-1">
                                        <div className="flex items-center text-xs text-gray-500">
                                            <Calendar size={12} className="mr-1" />
                                            {contract.startDate} to {contract.endDate}
                                        </div>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="text-sm font-semibold">
                                        {contract.pricingType === 'discount' ? (
                                            <span className="text-blue-600">{contract.pricingValue}% Off</span>
                                        ) : (
                                            <span className="text-indigo-600">{contract.pricingValue} KWD / hr</span>
                                        )}
                                        <p className="text-[10px] text-gray-400 font-normal">
                                            {contract.screenSubset === 'all' ? 'All Screens' : 'Selected Screens'}
                                        </p>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    {getStatusBadge(contract.status)}
                                </TableCell>
                                <TableCell>
                                    <div className="w-24 space-y-1">
                                        <div className="flex justify-between text-[10px] font-medium">
                                            <span>{contract.usedUnits || 0} used</span>
                                            {contract.allocatedUnits && <span>{contract.allocatedUnits} total</span>}
                                        </div>
                                        {contract.allocatedUnits ? (
                                            <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                                                <div
                                                    className="bg-black h-full transition-all"
                                                    style={{ width: `${(contract.usedUnits / contract.allocatedUnits) * 100}%` }}
                                                />
                                            </div>
                                        ) : (
                                            <p className="text-[10px] text-gray-400">No limit</p>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button variant="ghost" size="sm" onClick={() => navigate(`/contracts/${contract.id}`)}>
                                            <Edit size={16} />
                                        </Button>
                                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                            <Trash2 size={16} />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>
        </div>
    );
}
