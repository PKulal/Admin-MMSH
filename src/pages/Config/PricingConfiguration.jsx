import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, DollarSign } from 'lucide-react';
import { mockPricing } from '../../data/mockPricing';
import { mockScreens } from '../../data/mockData';

export function PricingConfiguration() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [screenFilter, setScreenFilter] = useState('all');
    const [peakFilter, setPeakFilter] = useState('all');

    const filteredPricing = useMemo(() => {
        return mockPricing.filter(price => {
            const matchesSearch =
                price.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                price.screenName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesScreen = screenFilter === 'all' || price.screenId === screenFilter;
            const matchesPeak = peakFilter === 'all' || price.peakType === peakFilter;

            return matchesSearch && matchesScreen && matchesPeak;
        });
    }, [searchTerm, screenFilter, peakFilter]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const getTotalRevenuePotential = () => {
        return filteredPricing.reduce((sum, price) => sum + price.pricePerDay, 0);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Pricing Configuration</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Configure pricing for screens and slots
                    </p>
                </div>
                <Button onClick={() => navigate('/pricing/new')}>
                    <Plus size={18} className="mr-2" />
                    Add Pricing Rule
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Total Rules</p>
                            <div className="text-2xl font-bold">{filteredPricing.length}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-50 text-green-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Avg. Price/Day</p>
                            <div className="text-2xl font-bold">
                                {formatCurrency(filteredPricing.length > 0 ? getTotalRevenuePotential() / filteredPricing.length : 0)}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-purple-50 text-purple-600">
                            <DollarSign size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Peak Rules</p>
                            <div className="text-2xl font-bold">
                                {filteredPricing.filter(p => p.peakType === 'peak').length}
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
                            placeholder="Search by ID or Screen..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={screenFilter} onChange={(e) => setScreenFilter(e.target.value)}>
                        <option value="all">All Screens</option>
                        {mockScreens.filter(s => s.active).map(screen => (
                            <option key={screen.id} value={screen.id}>{screen.name}</option>
                        ))}
                    </Select>

                    <Select value={peakFilter} onChange={(e) => setPeakFilter(e.target.value)}>
                        <option value="all">All Peak Types</option>
                        <option value="peak">Peak</option>
                        <option value="off-peak">Off-Peak</option>
                    </Select>
                </div>
            </Card>

            {/* Pricing Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pricing ID</TableHead>
                            <TableHead>Screen</TableHead>
                            <TableHead>Slot Time</TableHead>
                            <TableHead>Peak Type</TableHead>
                            <TableHead className="text-right">Price/Day</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredPricing.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No pricing rules found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredPricing.map((price) => (
                                <TableRow
                                    key={price.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/pricing/${price.id}`)}
                                >
                                    <TableCell className="font-mono font-semibold">{price.id}</TableCell>
                                    <TableCell className="font-medium">{price.screenName}</TableCell>
                                    <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {price.slotTime}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={price.peakType === 'peak' ? 'warning' : 'default'}>
                                            {price.peakType === 'peak' ? 'Peak' : 'Off-Peak'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right font-bold text-lg">
                                        {formatCurrency(price.pricePerDay)}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/pricing/${price.id}`);
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
                Showing {filteredPricing.length} of {mockPricing.length} pricing rules
            </div>
        </div>
    );
}
