import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, Upload, Eye } from 'lucide-react';
import { mockScreens } from '../../data/mockData';

export function ScreenList() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [statusFilter, setStatusFilter] = useState('all');

    // Extract unique values for filters
    const locations = useMemo(() => {
        return [...new Set(mockScreens.map(s => s.location))];
    }, []);

    const categories = useMemo(() => {
        return [...new Set(mockScreens.map(s => s.category))];
    }, []);

    const filteredScreens = useMemo(() => {
        return mockScreens.filter(screen => {
            const matchesSearch =
                screen.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                screen.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = locationFilter === 'all' || screen.location === locationFilter;
            const matchesCategory = categoryFilter === 'all' || screen.category === categoryFilter;
            const matchesType = typeFilter === 'all' || screen.type === typeFilter;
            const matchesStatus = statusFilter === 'all' ||
                (statusFilter === 'active' && screen.active) ||
                (statusFilter === 'inactive' && !screen.active);

            return matchesSearch && matchesLocation && matchesCategory && matchesType && matchesStatus;
        });
    }, [searchTerm, locationFilter, categoryFilter, typeFilter, statusFilter]);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Screen Inventory</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Manage advertising screens and displays
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button variant="outline" onClick={() => navigate('/inventory/bulk-upload')}>
                        <Upload size={18} className="mr-2" />
                        Bulk Upload
                    </Button>
                    <Button onClick={() => navigate('/inventory/new')}>
                        <Plus size={18} className="mr-2" />
                        Add Screen
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder="Search screens..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value="all">All Locations</option>
                        {locations.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </Select>

                    <Select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        <option value="all">All Categories</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </Select>

                    <Select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        <option value="all">Indoor/Outdoor</option>
                        <option value="indoor">Indoor</option>
                        <option value="outdoor">Outdoor</option>
                    </Select>

                    <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>
            </Card>

            {/* Screen Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Screen ID</TableHead>
                            <TableHead>Screen Name</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Type</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Size (ft)</TableHead>
                            <TableHead>Resolution</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredScreens.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No screens found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredScreens.map((screen) => (
                                <TableRow
                                    key={screen.id}
                                    onClick={() => navigate(`/inventory/${screen.id}`)}
                                    className="cursor-pointer"
                                >
                                    <TableCell className="font-mono font-semibold">{screen.id}</TableCell>
                                    <TableCell className="font-medium">{screen.name}</TableCell>
                                    <TableCell className="text-sm">{screen.location}</TableCell>
                                    <TableCell>
                                        <Badge variant={screen.type === 'indoor' ? 'default' : 'outline'}>
                                            {screen.type.charAt(0).toUpperCase() + screen.type.slice(1)}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm">{screen.category}</TableCell>
                                    <TableCell className="text-sm">
                                        {screen.size.width}×{screen.size.height}
                                    </TableCell>
                                    <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {screen.resolution.width}×{screen.resolution.height}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={screen.active ? 'success' : 'default'}>
                                            {screen.active ? 'Active' : 'Inactive'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/inventory/${screen.id}`);
                                            }}
                                        >
                                            <Eye size={16} />
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
                Showing {filteredScreens.length} of {mockScreens.length} screens
            </div>
        </div>
    );
}
