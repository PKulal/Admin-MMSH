import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, UserPlus, Building2, Upload, FileDown, FileSpreadsheet } from 'lucide-react';
import { mockUsers, mockTenantsDetailed, mockAgencies } from '../../data/mockTenants';

export function UserManagement() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('system'); // 'system' or 'agencies'
    const [searchTerm, setSearchTerm] = useState('');
    const [tenantFilter, setTenantFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');
    const [users, setUsers] = useState(mockUsers);
    const [agencies, setAgencies] = useState(mockAgencies);
    const [isBulkAdding, setIsBulkAdding] = useState(false);
    const [bulkText, setBulkText] = useState('');

    const filteredUsers = useMemo(() => {
        return users.filter(user => {
            // Filter only system users for system tab, or all for others? 
            // User says "two section one is the table which shows the RBAC users... and one more section for agencies"
            const matchesTab = activeTab === 'system' ? user.isSystemUser : !user.isSystemUser;

            const matchesSearch =
                user.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                user.email.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesTenant = tenantFilter === 'all' || user.tenantId === tenantFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && user.active) ||
                (statusFilter === 'inactive' && !user.active);

            return matchesTab && matchesSearch && matchesTenant && matchesStatus;
        });
    }, [searchTerm, tenantFilter, statusFilter, users, activeTab]);

    const filteredAgencies = useMemo(() => {
        return agencies.filter(agency => {
            const matchesSearch =
                agency.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                agency.contactName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && agency.active) ||
                (statusFilter === 'inactive' && !agency.active);

            return matchesSearch && matchesStatus;
        });
    }, [searchTerm, statusFilter, agencies]);

    const handleToggleUserStatus = (userId) => {
        setUsers(prev => prev.map(user =>
            user.id === userId ? { ...user, active: !user.active } : user
        ));
    };

    const handleToggleAgencyStatus = (agencyId) => {
        setAgencies(prev => prev.map(agency =>
            agency.id === agencyId ? { ...agency, active: !agency.active } : agency
        ));
    };

    const handleDownloadSample = () => {
        const headers = 'Agency Name,Contact Person,Email,Phone\n';
        const sampleData = 'Al-Mansouri Media,Fahad,contact@almansour.com,+965 1234 5678\nGlobal Ads,Jane Smith,info@globalads.com,+971 50 123 4567';
        const blob = new Blob([headers + sampleData], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'agency_upload_sample.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    };

    const handleBulkAdd = () => {
        const lines = bulkText.split('\n').filter(line => line.trim());
        const newAgencies = lines.map((line, index) => {
            const [name, contact, email] = line.split(',').map(s => s.trim());
            return {
                id: `AGN-NEW-${Math.floor(Math.random() * 1000)}`,
                name: name || `Agency ${index + 1}`,
                contactName: contact || 'TBD',
                email: email || 'TBD',
                phone: 'TBD',
                active: true,
                commission: 0,
                totalCampaigns: 0
            };
        });
        setAgencies(prev => [...prev, ...newAgencies]);
        setBulkText('');
        setIsBulkAdding(false);
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

            {/* Tabs */}
            <div className="flex border-b border-[hsl(var(--color-border))] overflow-x-auto">
                <button
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'system'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))]'
                        }`}
                    onClick={() => setActiveTab('system')}
                >
                    System Users (RBAC)
                </button>
                <button
                    className={`px-6 py-3 text-sm font-medium transition-colors border-b-2 ${activeTab === 'agencies'
                        ? 'border-blue-600 text-blue-600'
                        : 'border-transparent text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text))]'
                        }`}
                    onClick={() => setActiveTab('agencies')}
                >
                    Ad Agencies
                </button>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="relative md:col-span-2">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder={activeTab === 'system' ? "Search users..." : "Search agencies..."}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    {activeTab === 'system' && (
                        <Select value={tenantFilter} onChange={(e) => setTenantFilter(e.target.value)}>
                            <option value="all">All Tenants</option>
                            {mockTenantsDetailed.filter(t => t.active).map(tenant => (
                                <option key={tenant.id} value={tenant.id}>{tenant.name}</option>
                            ))}
                        </Select>
                    )}

                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>

                    {activeTab === 'agencies' && (
                        <div className="flex gap-2">
                            <Button variant="outline" className="h-10 px-4" onClick={() => setIsBulkAdding(!isBulkAdding)}>
                                <FileSpreadsheet size={16} className="mr-2" />
                                Bulk Upload
                            </Button>
                            <Button className="h-10 px-4" onClick={() => navigate('/agencies/new')}>
                                <Plus size={16} className="mr-2" />
                                Add Agency
                            </Button>
                        </div>
                    )}
                </div>
            </Card>

            {/* Bulk Add Section */}
            {activeTab === 'agencies' && isBulkAdding && (
                <Card className="bg-blue-50/50 border-blue-100">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <FileSpreadsheet className="text-blue-600" size={20} />
                                <h3 className="font-semibold text-blue-900">Bulk Upload Agencies</h3>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="ghost" size="sm" onClick={handleDownloadSample} className="text-blue-700 hover:text-blue-800 hover:bg-blue-100">
                                    <FileDown size={14} className="mr-1" />
                                    Download Sample
                                </Button>
                                <Button variant="ghost" size="sm" onClick={() => setIsBulkAdding(false)}>Cancel</Button>
                            </div>
                        </div>
                        <p className="text-sm text-blue-700">
                            Upload a <strong>CSV</strong> or <strong>Excel</strong> file, or paste your data below (Format: Name, Contact, Email)
                        </p>
                        <div className="relative group">
                            <textarea
                                className="w-full min-h-[120px] p-3 rounded-md border border-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-sm"
                                placeholder="Al-Mansouri Media, Fahad, contact@almansour.com&#10;Global Ads, Jane Smith, info@globalads.com"
                                value={bulkText}
                                onChange={(e) => setBulkText(e.target.value)}
                            />
                            {!bulkText && (
                                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-[hsl(var(--color-text-muted))]">
                                    <Upload size={24} className="mb-2 opacity-50" />
                                    <p className="text-xs">Drag and drop CSV/Excel or paste data here</p>
                                </div>
                            )}
                        </div>
                        <div className="flex justify-end gap-3">
                            <input type="file" id="file-upload" className="hidden" accept=".csv, .xlsx, .xls" onChange={(e) => {
                                // In a real app, parse file here
                                alert('File uploaded: ' + e.target.files[0].name);
                                setBulkText('Sample Agency, John Doe, john@example.com');
                            }} />
                            <Button variant="outline" onClick={() => document.getElementById('file-upload').click()}>
                                Select File
                            </Button>
                            <Button onClick={handleBulkAdd} disabled={!bulkText.trim()}>
                                Process Upload
                            </Button>
                        </div>
                    </div>
                </Card>
            )}

            {/* Content Table */}
            <Card className="p-0 overflow-hidden">
                {activeTab === 'system' ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>User ID</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                        No users found
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
                                        <TableCell>
                                            <Badge variant={
                                                user.role === 'Admin' ? 'default' :
                                                    user.role === 'Ops' ? 'outline' :
                                                        user.role === 'Sales team' ? 'outline' : 'outline'
                                            }>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell onClick={(e) => e.stopPropagation()}>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={user.active}
                                                    onCheckedChange={() => handleToggleUserStatus(user.id)}
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
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Agency ID</TableHead>
                                <TableHead>Agency Name</TableHead>
                                <TableHead>Contact Person</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredAgencies.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                        No agencies found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredAgencies.map((agency) => (
                                    <TableRow key={agency.id}>
                                        <TableCell className="font-mono font-semibold">{agency.id}</TableCell>
                                        <TableCell className="font-medium">{agency.name}</TableCell>
                                        <TableCell>{agency.contactName}</TableCell>
                                        <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                            {agency.email}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Switch
                                                    checked={agency.active}
                                                    onCheckedChange={() => handleToggleAgencyStatus(agency.id)}
                                                />
                                                <span className="text-sm">
                                                    {agency.active ? 'Active' : 'Inactive'}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => navigate(`/agencies/${agency.id}`)}
                                            >
                                                Edit
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}
            </Card>

            {/* Summary */}
            <div className="text-sm text-[hsl(var(--color-text-muted))]">
                {activeTab === 'system'
                    ? `Showing ${filteredUsers.length} of ${users.filter(u => u.isSystemUser).length} system users`
                    : `Showing ${filteredAgencies.length} of ${agencies.length} agencies`
                }
            </div>
        </div>
    );
}
