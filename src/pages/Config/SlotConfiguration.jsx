import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, Lock, Unlock } from 'lucide-react';
import { mockSlots } from '../../data/mockSlots';
import { mockScreens } from '../../data/mockData';

export function SlotConfiguration() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [screenFilter, setScreenFilter] = useState('all');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [slots, setSlots] = useState(mockSlots);

    const filteredSlots = useMemo(() => {
        return slots.filter(slot => {
            const matchesSearch =
                slot.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                slot.screenName.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesScreen = screenFilter === 'all' || slot.screenId === screenFilter;
            const matchesAvailability = availabilityFilter === 'all' ||
                (availabilityFilter === 'available' && slot.available) ||
                (availabilityFilter === 'unavailable' && !slot.available);

            return matchesSearch && matchesScreen && matchesAvailability;
        });
    }, [searchTerm, screenFilter, availabilityFilter, slots]);

    const handleToggleAvailability = (slotId) => {
        setSlots(prev => prev.map(slot =>
            slot.id === slotId ? { ...slot, available: !slot.available } : slot
        ));
    };

    const handleToggleLock = (slotId) => {
        setSlots(prev => prev.map(slot =>
            slot.id === slotId ? { ...slot, locked: !slot.locked } : slot
        ));
    };

    const formatDays = (days) => {
        if (days.length === 7) return 'Daily';
        if (days.length === 5 && !days.includes('Saturday') && !days.includes('Sunday')) return 'Weekdays';
        if (days.length === 2 && days.includes('Saturday') && days.includes('Sunday')) return 'Weekends';
        return days.join(', ');
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Slot Configuration</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Manage time slots and availability for advertising screens
                    </p>
                </div>
                <Button onClick={() => navigate('/slots/new')}>
                    <Plus size={18} className="mr-2" />
                    Add Slot
                </Button>
            </div>

            {/* Filters */}
            <Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                        <Input
                            placeholder="Search by Slot ID or Screen..."
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

                    <Select value={availabilityFilter} onChange={(e) => setAvailabilityFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        <option value="available">Available</option>
                        <option value="unavailable">Unavailable</option>
                    </Select>
                </div>
            </Card>

            {/* Slots Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Slot ID</TableHead>
                            <TableHead>Screen</TableHead>
                            <TableHead>Time Range</TableHead>
                            <TableHead>Days</TableHead>
                            <TableHead>Availability</TableHead>
                            <TableHead>Lock Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredSlots.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No slots found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredSlots.map((slot) => (
                                <TableRow
                                    key={slot.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/slots/${slot.id}`)}
                                >
                                    <TableCell className="font-mono font-semibold">{slot.id}</TableCell>
                                    <TableCell className="font-medium">{slot.screenName}</TableCell>
                                    <TableCell className="text-sm">
                                        {slot.startTime} - {slot.endTime}
                                    </TableCell>
                                    <TableCell className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {formatDays(slot.days)}
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <div className="flex items-center gap-2">
                                            <Switch
                                                checked={slot.available}
                                                onCheckedChange={() => handleToggleAvailability(slot.id)}
                                                disabled={slot.locked}
                                            />
                                            <span className="text-sm">
                                                {slot.available ? 'Available' : 'Unavailable'}
                                            </span>
                                        </div>
                                    </TableCell>
                                    <TableCell onClick={(e) => e.stopPropagation()}>
                                        <Badge variant={slot.locked ? 'default' : 'outline'}>
                                            {slot.locked ? (
                                                <>
                                                    <Lock size={12} className="mr-1" />
                                                    Locked
                                                </>
                                            ) : (
                                                <>
                                                    <Unlock size={12} className="mr-1" />
                                                    Unlocked
                                                </>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleToggleLock(slot.id)}
                                        >
                                            {slot.locked ? <Unlock size={16} /> : <Lock size={16} />}
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
                Showing {filteredSlots.length} of {slots.length} slots
            </div>
        </div>
    );
}
