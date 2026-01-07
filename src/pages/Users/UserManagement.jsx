import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, UserPlus } from 'lucide-react';
import { mockUsers, mockTenantsDetailed } from '../../data/mockTenants';

export function UserManagement() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [tenantFilter, setTenantFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [users, setUsers] = useState(mockUsers);

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            const matchesSearch =
                user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTenant = tenantFilter === 'all' || user.tenantId === tenantFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && user.active) ||
                (statusFilter === 'inactive' && !user.active);

            return matchesSearch && matchesTenant && matchesStatus;
        });
    }, [searchTerm, tenantFilter, statusFilter, users]);

    const handleToggleStatus = (userId) => {
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, active: !user.active } : user
        ));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">User Management</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Create and manage end users
                    </p>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Total Users</p>
                            <div className="text-2xl font-bold">{filteredUsers.length}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-50 text-green-600">
                            <UserPlus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Active Users</p>
                            <div className="text-2xl font-bold">
                                {filteredUsers.filter(u => u.active).length}
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder="Search users..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={tenantFilter} onChange={(e) => setTenantFilter(e.target.value)}>
                        <option value="all">All Tenants</option>
                        {mockTenantsDetailed.filter(t => t.active).map(tenant => (
                            <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                        ))}
                    </Select>

                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>
            </Card>

            {/* Users Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>User ID</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Tenant</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredUsers.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No users found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredUsers.map((user) => (
                                <TableRow
                                    key={user.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/users/${user.id}`)}
                                >
                                    <TableCell className="font-mono font-semibold">{user.id}</TableCell>
                                    <TableCell className="font-medium">{user.name}</TableCell>
                                    <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {user.email}
                                    </TableCell>
                                    <TableCell className="text-sm">{user.tenantName}</TableCell>
                                    <TableCell>
                                        <Badge variant={user.role === 'Admin' ? 'default' : 'outline'}>
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={user.active}
                                                onCheckedChange={() => handleToggleStatus(user.id)}
                                            />
                                            <span className="text-sm">
                                                {user.active ? 'Active' : 'Inactive'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/users/${user.id}`);
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
                Showing {filteredUsers.length} of {users.length} users
            </div>
        </div>
    );
}
