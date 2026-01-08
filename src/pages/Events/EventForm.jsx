import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save, Calendar, MapPin, CheckSquare, Square } from 'lucide-react';
import { mockEvents, LOCATION_OPTIONS } from '../../data/mockEvents';
import { mockScreens } from '../../data/mockData';

const COLORS = [
    { value: '#9333ea', label: 'Purple' },
    { value: '#16a34a', label: 'Green' },
    { value: '#dc2626', label: 'Red' },
    { value: '#ea580c', label: 'Orange' },
    { value: '#0891b2', label: 'Cyan' },
    { value: '#7c3aed', label: 'Violet' },
    { value: '#059669', label: 'Emerald' },
    { value: '#2563eb', label: 'Blue' }
];

export function EventForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingEvent = isEdit ? mockEvents.find(e => e.id === id) : null;

    const [formData, setFormData] = useState({
        name: '',
        startDate: '',
        endDate: '',
        scopeMode: 'location', // 'location' or 'screens'
        location: 'All',
        eventPricePercentage: 0,
        governorate: '',
        selectedScreens: [],
        description: '',
        color: '#9333ea',
        ...existingEvent
    });

    const uniqueGovernorates = [...new Set(mockScreens.map(s => s.governorate).filter(Boolean))].sort();
    const filteredScreens = formData.governorate
        ? mockScreens.filter(s => s.governorate === formData.governorate)
        : [];

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving event:', formData);
        alert(isEdit ? 'Event updated successfully!' : 'Event created successfully!');
        navigate('/events');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const calculateDuration = () => {
        if (!formData.startDate || !formData.endDate) return null;

        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

        return diffDays;
    };

    const duration = calculateDuration();

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/events')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit Event' : 'Add New Event'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingEvent?.name}` : 'Create a new event for visibility indicators'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Details</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Event Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g., Ramadan 2026, National Day"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Start Date *
                                        </label>
                                        <Input
                                            required
                                            type="date"
                                            value={formData.startDate}
                                            onChange={(e) => updateField('startDate', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            End Date *
                                        </label>
                                        <Input
                                            required
                                            type="date"
                                            value={formData.endDate}
                                            onChange={(e) => updateField('endDate', e.target.value)}
                                            min={formData.startDate}
                                        />
                                    </div>
                                </div>

                                {duration && (
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                        Duration: {duration} {duration === 1 ? 'day' : 'days'}
                                    </p>
                                )}

                                <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                    <label className="block text-sm font-medium mb-3 text-[hsl(var(--color-text-main))] text-center">
                                        Implementation Scope *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4 p-1 bg-[hsl(var(--color-background-muted))] rounded-lg mb-6">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('scopeMode', 'location');
                                                updateField('governorate', '');
                                                updateField('selectedScreens', []);
                                            }}
                                            className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${formData.scopeMode === 'location'
                                                ? 'bg-white shadow-sm text-[hsl(var(--color-primary))]'
                                                : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text-main))]'
                                                }`}
                                        >
                                            Broad Location
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                updateField('scopeMode', 'screens');
                                                updateField('location', 'All');
                                            }}
                                            className={`py-2 px-4 rounded-md text-sm font-bold transition-all ${formData.scopeMode === 'screens'
                                                ? 'bg-white shadow-sm text-[hsl(var(--color-primary))]'
                                                : 'text-[hsl(var(--color-text-muted))] hover:text-[hsl(var(--color-text-main))]'
                                                }`}
                                        >
                                            Specific Screens
                                        </button>
                                    </div>

                                    {formData.scopeMode === 'location' ? (
                                        <div className="space-y-1">
                                            <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                                Location Scope *
                                            </label>
                                            <Select
                                                required
                                                value={formData.location}
                                                onChange={(e) => updateField('location', e.target.value)}
                                            >
                                                {LOCATION_OPTIONS.map(loc => (
                                                    <option key={loc} value={loc}>{loc}</option>
                                                ))}
                                            </Select>
                                            <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                                {formData.location === 'All'
                                                    ? 'Event applies to all locations'
                                                    : `Event applies only to ${formData.location}`}
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <h3 className="text-sm font-bold mb-2 flex items-center gap-2">
                                                <MapPin size={16} className="text-[hsl(var(--color-primary))]" />
                                                Geographical Implementation
                                            </h3>
                                            <div>
                                                <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                                    Select Governorate *
                                                </label>
                                                <Select
                                                    value={formData.governorate}
                                                    onChange={(e) => {
                                                        updateField('governorate', e.target.value);
                                                        updateField('selectedScreens', []); // Reset selections
                                                    }}
                                                >
                                                    <option value="">Choose a governorate</option>
                                                    {uniqueGovernorates.map(gov => (
                                                        <option key={gov} value={gov}>{gov}</option>
                                                    ))}
                                                </Select>
                                            </div>

                                            {formData.governorate && (
                                                <div className="bg-[hsl(var(--color-background-muted))] p-4 rounded-lg space-y-3 border border-[hsl(var(--color-border))]">
                                                    <div className="flex items-center justify-between border-b border-[hsl(var(--color-border))] pb-2 mb-2">
                                                        <label className="text-sm font-bold">Select Screens</label>
                                                        <button
                                                            type="button"
                                                            onClick={() => {
                                                                const allIds = filteredScreens.map(s => s.id);
                                                                const isAllSelected = allIds.length > 0 && allIds.every(id => formData.selectedScreens.includes(id));
                                                                updateField('selectedScreens', isAllSelected ? [] : allIds);
                                                            }}
                                                            className="text-xs font-bold text-[hsl(var(--color-primary))] hover:shadow-sm px-2 py-1 rounded bg-white border border-[hsl(var(--color-border))]"
                                                        >
                                                            {filteredScreens.every(s => formData.selectedScreens.includes(s.id)) ? 'Deselect All' : 'Select All'}
                                                        </button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto pr-2">
                                                        {filteredScreens.map(screen => {
                                                            const isSelected = formData.selectedScreens.includes(screen.id);
                                                            return (
                                                                <div
                                                                    key={screen.id}
                                                                    onClick={() => {
                                                                        const next = isSelected
                                                                            ? formData.selectedScreens.filter(id => id !== screen.id)
                                                                            : [...formData.selectedScreens, screen.id];
                                                                        updateField('selectedScreens', next);
                                                                    }}
                                                                    className={`flex items-center gap-3 p-2 rounded-md transition-all cursor-pointer border ${isSelected
                                                                        ? 'bg-white border-[hsl(var(--color-primary))] shadow-sm'
                                                                        : 'hover:bg-black/5 border-transparent'
                                                                        }`}
                                                                >
                                                                    {isSelected ? (
                                                                        <CheckSquare size={16} className="text-[hsl(var(--color-primary))]" />
                                                                    ) : (
                                                                        <Square size={16} className="text-[hsl(var(--color-text-muted))]" />
                                                                    )}
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className="text-sm font-medium truncate">{screen.name}</p>
                                                                        <p className="text-[10px] text-[hsl(var(--color-text-muted))] truncate">{screen.location}</p>
                                                                    </div>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                    <p className="text-xs text-[hsl(var(--color-text-muted))] italic">
                                                        {formData.selectedScreens.length} screen(s) selected
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>

                                <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Event Price Factor (%) *
                                    </label>
                                    <div className="relative">
                                        <Input
                                            required
                                            type="number"
                                            value={formData.eventPricePercentage}
                                            onChange={(e) => updateField('eventPricePercentage', parseFloat(e.target.value))}
                                            placeholder="e.g., 20"
                                            className="pr-8"
                                        />
                                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[hsl(var(--color-text-muted))]">%</span>
                                    </div>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                        Percentage to increase or decrease pricing during this event.
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Description
                                    </label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => updateField('description', e.target.value)}
                                        placeholder="Brief description of the event and its impact"
                                        className="w-full px-3 py-2 rounded-lg border border-[hsl(var(--color-border))] text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--color-primary))]"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Event Color *
                                    </label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {COLORS.map(color => (
                                            <button
                                                key={color.value}
                                                type="button"
                                                onClick={() => updateField('color', color.value)}
                                                className={`p-3 rounded-lg border-2 transition-all ${formData.color === color.value
                                                    ? 'border-[hsl(var(--color-primary))] scale-105'
                                                    : 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))]'
                                                    }`}
                                            >
                                                <div
                                                    className="w-full h-8 rounded"
                                                    style={{ backgroundColor: color.value }}
                                                />
                                                <p className="text-xs mt-1 text-center">{color.label}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Event Preview</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg border border-[hsl(var(--color-border))]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: formData.color }}
                                        />
                                        <p className="font-semibold">{formData.name || 'Event Name'}</p>
                                    </div>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {formData.startDate && formData.endDate
                                            ? `${new Date(formData.startDate).toLocaleDateString()} - ${new Date(formData.endDate).toLocaleDateString()}`
                                            : 'Date range not set'}
                                    </p>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                        {formData.scopeMode === 'location' ? (
                                            `${formData.location} Scope`
                                        ) : (
                                            `${formData.governorate || 'No Governorate'} • ${formData.selectedScreens.length} screens`
                                        )}
                                    </p>
                                </div>
                                <p className="text-xs text-[hsl(var(--color-text-muted))]">
                                    This is how the event will appear in the calendar
                                </p>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Usage Note</CardTitle>
                            </CardHeader>
                            <div className="text-sm text-[hsl(var(--color-text-muted))] space-y-2">
                                <p>Events are used for visibility indicators only:</p>
                                <ul className="list-disc list-inside space-y-1 ml-2">
                                    <li>Show peak periods to end users</li>
                                    <li>Highlight special occasions</li>
                                    <li>Inform pricing expectations</li>
                                </ul>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <div className="space-y-3">
                                <Button type="submit" className="w-full">
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update Event' : 'Create Event'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/events')}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </Card>
                    </div>
                </div>
            </form>
        </div>
    );
}
