import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Edit2, Eye } from 'lucide-react';
import { mockCampaigns, mockTenants } from '../../data/mockData';

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

export function CampaignList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [tenantFilter, setTenantFilter] = useState('all');

    const filteredCampaigns = useMemo(() => {
        return mockCampaigns.filter(campaign => {
            const matchesSearch =
                campaign.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                campaign.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' || campaign.status === statusFilter;
            const matchesTenant = tenantFilter === 'all' || campaign.tenant === tenantFilter;

            return matchesSearch && matchesStatus && matchesTenant;
        });
    }, [searchTerm, statusFilter, tenantFilter]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Campaign Management</h2>
                <p className="text-[hsl(var(--color-text-muted))]">
                    View and manage all advertising campaigns across tenants
                </p>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder="Search by Campaign ID or Name..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Statuses</option>
                        <option value="submitted">Submitted</option>
                        <option value="booked">Booked</option>
                        <option value="running">Running</option>
                        <option value="completed">Completed</option>
                    </Select>

                    <Select value={tenantFilter} onChange={(e) => setTenantFilter(e.target.value)}>
                        <option value="all">All Tenants</option>
                        {mockTenants.map(tenant => (
                            <option key={tenant.id} value={tenant.name}>{tenant.name}</option>
                        ))}
                    </Select>
                </div>
            </Card>

            {/* Campaign Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Campaign ID</TableHead>
                            <TableHead>Campaign Name</TableHead>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Date Range</TableHead>
                            <TableHead>No. of Screens</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Price</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredCampaigns.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No campaigns found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCampaigns.map((campaign) => (
                                <TableRow
                                    key={campaign.id}
                                    onClick={() => navigate(`/campaigns/${campaign.id}`)}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-mono font-semibold">{campaign.id}</TableCell>
                                    <TableCell className="font-medium">{campaign.name}</TableCell>
                                    <TableCell>{campaign.tenant}</TableCell>
                                    <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {campaign.dateRange}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">
                                            {campaign.screens?.length || 0}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={statusVariants[campaign.status]}>
                                            {statusLabels[campaign.status]}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold">
                                        {formatCurrency(campaign.finalPrice || campaign.estimatedPrice)}
                                    </TableCell>
                                    <TableCell className="text-right flex items-center justify-end gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/campaigns/${campaign.id}`);
                                            }}
                                        >
                                            <Eye size={16} />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/campaigns/${campaign.id}/edit`);
                                            }}
                                        >
                                            <Edit2 size={16} />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </Card>

            {/* Summary */}
            <div className="text-sm text-[hsl(var(--color-text-muted))]">
                Showing {filteredCampaigns.length} of {mockCampaigns.length} campaigns
            </div>
        </div>
    );
}
