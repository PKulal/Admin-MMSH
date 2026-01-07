import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, Building2, Users } from 'lucide-react';
import { mockTenantsDetailed } from '../../data/mockTenants';

export function TenantManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [tenants, setTenants] = useState(mockTenantsDetailed);

    const filteredTenants = useMemo(() => {
        return tenants.filter(tenant => {
            const matchesSearch =
                tenant.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                tenant.contactName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && tenant.active) ||
                (statusFilter === 'inactive' && !tenant.active);

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, tenants]);

    const handleToggleStatus = (tenantId) => {
        setTenants(prev => prev.map(tenant =>
            tenant.id === tenantId ? { ...tenant, active: !tenant.active } : tenant
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Tenant Management</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Create and manage tenant organizations
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Total Tenants</p>
                            <div className="text-2xl font-bold">{filteredTenants.length}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-50 text-green-600">
                            <Building2 size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Active Tenants</p>
                            <div className="text-2xl font-bold">
                                {filteredTenants.filter(t => t.active).length}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Total Users</p>
                            <div className="text-2xl font-bold">
                                {filteredTenants.reduce((sum, t) => sum + t.userCount, 0)}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder="Search tenants..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>
            </Card>

            {/* Tenants Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Tenant ID</TableHead>
                            <TableHead>Tenant Name</TableHead>
                            <TableHead>Contact Person</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Users</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTenants.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No tenants found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredTenants.map((tenant) => (
                                <TableRow
                                    key={tenant.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/tenants/${tenant.id}`)}
                                >
                                    <TableCell className="font-mono font-semibold">{tenant.id}</TableCell>
                                    <TableCell className="font-medium">{tenant.name}</TableCell>
                                    <TableCell className="text-sm">{tenant.contactName}</TableCell>
                                    <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {tenant.email}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline">{tenant.userCount} users</Badge>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={tenant.active}
                                                onCheckedChange={() => handleToggleStatus(tenant.id)}
                                            />
                                            <span className="text-sm">
                                                {tenant.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/tenants/${tenant.id}`);
                                            }}
                                        >
                                            Edit
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
                Showing {filteredTenants.length} of {tenants.length} tenants
            </div>
        </div>
    );
}
