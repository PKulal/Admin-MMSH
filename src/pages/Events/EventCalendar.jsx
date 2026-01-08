import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import { Search, Plus, Calendar, MapPin } from 'lucide-react';
import { mockEvents, LOCATION_OPTIONS } from '../../data/mockEvents';

export function EventCalendar() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('all');
    const [impactFilter, setImpactFilter] = useState('all'); // 'all', 'increase', 'decrease'

    const filteredEvents = useMemo(() => {
        return mockEvents.filter(event => {
            const matchesSearch =
                event.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                event.name.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesLocation = locationFilter === 'all' || event.location === locationFilter;
            const matchesImpact = impactFilter === 'all'
                ? true
                : impactFilter === 'increase'
                    ? event.eventPricePercentage > 0
                    : event.eventPricePercentage < 0;

            return matchesSearch && matchesLocation && matchesImpact;
        });
    }, [searchTerm, locationFilter, impactFilter]);

    const formatDateRange = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);

        const options = { month: 'short', day: 'numeric', year: 'numeric' };

        if (startDate === endDate) {
            return start.toLocaleDateString('en-US', options);
        }

        return `${start.toLocaleDateString('en-US', options)} - ${end.toLocaleDateString('en-US', options)}`;
    };

    const getDaysUntil = (startDate) => {
        const today = new Date();
        const start = new Date(startDate);
        const diffTime = start - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays < 0) return 'Past';
        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return 'Tomorrow';
        return `In ${diffDays} days`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Event Calendar</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Manage events for visibility and peak period indicators
                    </p>
                </div>
                <Button onClick={() => navigate('/events/new')}>
                    <Plus size={18} className="mr-2" />
                    Add Event
                </Button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-blue-50 text-blue-600">
                            <Calendar size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Total Events</p>
                            <div className="text-2xl font-bold">{filteredEvents.length}</div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-orange-50 text-orange-600">
                            <Plus size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Price Adjustments</p>
                            <div className="text-2xl font-bold">
                                {filteredEvents.filter(e => e.eventPricePercentage !== 0).length}
                            </div>
                        </div>
                    </div>
                </Card>
                <Card>
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-green-50 text-green-600">
                            <MapPin size={24} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-[hsl(var(--color-text-muted))]">Locations</p>
                            <div className="text-2xl font-bold">
                                {new Set(filteredEvents.map(e => e.location)).size}
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
                            placeholder="Search events..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>

                    <Select value={locationFilter} onChange={(e) => setLocationFilter(e.target.value)}>
                        <option value="all">All Locations</option>
                        {LOCATION_OPTIONS.map(loc => (
                            <option key={loc} value={loc}>{loc}</option>
                        ))}
                    </Select>

                    <Select value={impactFilter} onChange={(e) => setImpactFilter(e.target.value)}>
                        <option value="all">All Impacts</option>
                        <option value="increase">Price Increase</option>
                        <option value="decrease">Price Decrease</option>
                    </Select>
                </div>
            </Card>

            {/* Events Table */}
            <Card className="p-0 overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Event</TableHead>
                            <TableHead>Date Range</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Price Factor</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredEvents.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-8 text-[hsl(var(--color-text-muted))]">
                                    No events found matching your filters
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredEvents.map((event) => (
                                <TableRow
                                    key={event.id}
                                    className="cursor-pointer"
                                    onClick={() => navigate(`/events/${event.id}`)}
                                >
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: event.color }}
                                            />
                                            <div>
                                                <p className="font-semibold">{event.name}</p>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">{event.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm">
                                        {formatDateRange(event.startDate, event.endDate)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={14} className="text-[hsl(var(--color-text-muted))]" />
                                            <span className="text-sm">{event.location}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={event.eventPricePercentage > 0 ? 'warning' : 'default'}>
                                            {event.eventPricePercentage > 0 ? '+' : ''}{event.eventPricePercentage}%
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm text-[hsl(var(--color-text-muted))]">
                                            {getDaysUntil(event.startDate)}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                navigate(`/events/${event.id}`);
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
                Showing {filteredEvents.length} of {mockEvents.length} events
            </div>
        </div>
    );
}
