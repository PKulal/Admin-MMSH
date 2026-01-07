import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { ArrowLeft, Save, Lock } from 'lucide-react';
import { mockSlots } from '../../data/mockSlots';
import { mockScreens } from '../../data/mockData';

const DAYS_OF_WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function SlotForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingSlot = isEdit ? mockSlots.find(s => s.id === id) : null;

    const [formData, setFormData] = useState(existingSlot || {
        screenId: '',
        startTime: '',
        endTime: '',
        days: [],
        available: true,
        locked: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving slot:', formData);
        alert(isEdit ? 'Slot updated successfully!' : 'Slot created successfully!');
        navigate('/slots');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleDay = (day) => {
        setFormData(prev => ({
            ...prev,
            days: prev.days.includes(day)
                ? prev.days.filter(d => d !== day)
                : [...prev.days, day]
        }));
    };

    const selectAllDays = () => {
        setFormData(prev => ({ ...prev, days: [...DAYS_OF_WEEK] }));
    };

    const clearAllDays = () => {
        setFormData(prev => ({ ...prev, days: [] }));
    };

    const selectedScreen = mockScreens.find(s => s.id === formData.screenId);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/slots')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit Slot' : 'Add New Slot'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingSlot?.id}` : 'Create a new time slot for a screen'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Slot Details</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Screen *
                                    </label>
                                    <Select
                                        required
                                        value={formData.screenId}
                                        onChange={(e) => updateField('screenId', e.target.value)}
                                    >
                                        <option value="">Select a screen</option>
                                        {mockScreens.filter(s => s.active).map(screen => (
                                            <option key={screen.id} value={screen.id}>
                                                {screen.name} - {screen.location}
                                            </option>
                                        ))}
                                    </Select>
                                    {selectedScreen && (
                                        <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                            {selectedScreen.category} • {selectedScreen.type}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Start Time *
                                        </label>
                                        <Input
                                            required
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => updateField('startTime', e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            End Time *
                                        </label>
                                        <Input
                                            required
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => updateField('endTime', e.target.value)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <div className="flex items-center justify-between">
                                    <CardTitle>Applicable Days *</CardTitle>
                                    <div className="flex gap-2">
                                        <Button type="button" variant="ghost" size="sm" onClick={selectAllDays}>
                                            Select All
                                        </Button>
                                        <Button type="button" variant="ghost" size="sm" onClick={clearAllDays}>
                                            Clear All
                                        </Button>
                                    </div>
                                </div>
                            </CardHeader>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                {DAYS_OF_WEEK.map(day => (
                                    <button
                                        key={day}
                                        type="button"
                                        onClick={() => toggleDay(day)}
                                        className={`p-3 rounded-lg border-2 transition-all ${formData.days.includes(day)
                                                ? 'border-[hsl(var(--color-primary))] bg-[hsl(var(--color-primary))] text-white'
                                                : 'border-[hsl(var(--color-border))] hover:border-[hsl(var(--color-primary))]'
                                            }`}
                                    >
                                        <div className="font-semibold text-sm">{day.slice(0, 3)}</div>
                                        <div className="text-xs opacity-80">{day}</div>
                                    </button>
                                ))}
                            </div>
                            {formData.days.length === 0 && (
                                <p className="text-sm text-red-600 mt-2">Please select at least one day</p>
                            )}
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Availability</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium text-[hsl(var(--color-text-main))]">Available</p>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                            {formData.available ? 'Slot is available for booking' : 'Slot is unavailable'}
                                        </p>
                                    </div>
                                    <Switch
                                        checked={formData.available}
                                        onCheckedChange={(checked) => updateField('available', checked)}
                                        disabled={formData.locked}
                                    />
                                </div>

                                <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-medium text-[hsl(var(--color-text-main))]">Lock Slot</p>
                                            <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                                {formData.locked ? 'Slot is locked' : 'Slot can be modified'}
                                            </p>
                                        </div>
                                        <Switch
                                            checked={formData.locked}
                                            onCheckedChange={(checked) => updateField('locked', checked)}
                                        />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <div className="space-y-3">
                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={formData.days.length === 0}
                                >
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update Slot' : 'Create Slot'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/slots')}
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
