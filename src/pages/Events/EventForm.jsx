import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save, Calendar } from 'lucide-react';
import { mockEvents, LOCATION_OPTIONS } from '../../data/mockEvents';

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

    const [formData, setFormData] = useState(existingEvent || {
        name: '',
        startDate: '',
        endDate: '',
        location: 'All',
        peakClassification: 'peak',
        description: '',
        color: '#9333ea'
    });

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

                                <div>
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

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Peak Classification *
                                    </label>
                                    <Select
                                        required
                                        value={formData.peakClassification}
                                        onChange={(e) => updateField('peakClassification', e.target.value)}
                                    >
                                        <option value="peak">Peak</option>
                                        <option value="off-peak">Off-Peak</option>
                                    </Select>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                        {formData.peakClassification === 'peak'
                                            ? 'Indicates high-demand period with increased activity'
                                            : 'Indicates lower-demand period with reduced activity'}
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
                                        {formData.location} • {formData.peakClassification === 'peak' ? 'Peak' : 'Off-Peak'}
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
