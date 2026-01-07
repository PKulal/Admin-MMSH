import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save, DollarSign } from 'lucide-react';
import { mockPricing } from '../../data/mockPricing';
import { mockScreens } from '../../data/mockData';
import { mockSlots } from '../../data/mockSlots';

export function PricingForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingPricing = isEdit ? mockPricing.find(p => p.id === id) : null;

    const [formData, setFormData] = useState(existingPricing || {
        screenId: '',
        slotId: '',
        peakType: 'off-peak',
        pricePerDay: '',
        currency: 'KWD'
    });

    const [selectedScreen, setSelectedScreen] = useState(existingPricing?.screenId || '');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving pricing:', formData);
        alert(isEdit ? 'Pricing updated successfully!' : 'Pricing rule created successfully!');
        navigate('/pricing');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleScreenChange = (screenId) => {
        setSelectedScreen(screenId);
        updateField('screenId', screenId);
        // Reset slot when screen changes
        updateField('slotId', '');
    };

    const availableSlots = mockSlots.filter(slot => slot.screenId === selectedScreen);
    const screen = mockScreens.find(s => s.id === selectedScreen);
    const slot = mockSlots.find(s => s.id === formData.slotId);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/pricing')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit Pricing Rule' : 'Add New Pricing Rule'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingPricing?.id}` : 'Configure pricing for a screen and slot'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing Details</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Screen *
                                    </label>
                                    <Select
                                        required
                                        value={selectedScreen}
                                        onChange={(e) => handleScreenChange(e.target.value)}
                                    >
                                        <option value="">Select a screen</option>
                                        {mockScreens.filter(s => s.active).map(screen => (
                                            <option key={screen.id} value={screen.id}>
                                                {screen.name} - {screen.location}
                                            </option>
                                        ))}
                                    </Select>
                                    {screen && (
                                        <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                            {screen.category} • {screen.type} • Demographics: {screen.demographics}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Slot *
                                    </label>
                                    <Select
                                        required
                                        value={formData.slotId}
                                        onChange={(e) => updateField('slotId', e.target.value)}
                                        disabled={!selectedScreen}
                                    >
                                        <option value="">Select a slot</option>
                                        {availableSlots.map(slot => (
                                            <option key={slot.id} value={slot.id}>
                                                {slot.startTime} - {slot.endTime} ({slot.days.length === 7 ? 'Daily' : `${slot.days.length} days`})
                                            </option>
                                        ))}
                                    </Select>
                                    {!selectedScreen && (
                                        <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                            Please select a screen first
                                        </p>
                                    )}
                                    {slot && (
                                        <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                            Available: {slot.available ? 'Yes' : 'No'} • Locked: {slot.locked ? 'Yes' : 'No'}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Peak Type *
                                    </label>
                                    <Select
                                        required
                                        value={formData.peakType}
                                        onChange={(e) => updateField('peakType', e.target.value)}
                                    >
                                        <option value="off-peak">Off-Peak</option>
                                        <option value="peak">Peak</option>
                                    </Select>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                        {formData.peakType === 'peak'
                                            ? 'Higher pricing for high-demand periods'
                                            : 'Standard pricing for regular periods'}
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Price per Day (KWD) *
                                    </label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={18} />
                                        <Input
                                            required
                                            type="number"
                                            min="0"
                                            step="0.01"
                                            value={formData.pricePerDay}
                                            onChange={(e) => updateField('pricePerDay', parseFloat(e.target.value))}
                                            placeholder="Enter price per day"
                                            className="pl-10"
                                        />
                                    </div>
                                    {formData.pricePerDay && (
                                        <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                            Monthly estimate: {formatCurrency(formData.pricePerDay * 30)}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </Card>

                        {/* Pricing Guidelines */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing Guidelines</CardTitle>
                            </CardHeader>
                            <div className="space-y-2 text-sm text-[hsl(var(--color-text-muted))]">
                                <p>• <strong>Peak pricing</strong>: Typically 50-100% higher than off-peak</p>
                                <p>• <strong>Shopping Malls</strong>: Higher rates during weekends and evenings</p>
                                <p>• <strong>Highways</strong>: Consistent pricing, slight peak during rush hours</p>
                                <p>• <strong>Airports</strong>: Premium pricing due to high-value audience</p>
                                <p>• <strong>Demographics</strong>: Adjust based on target audience value</p>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Pricing Summary</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">Price per Day</p>
                                    <p className="text-3xl font-bold">
                                        {formData.pricePerDay ? formatCurrency(formData.pricePerDay) : '—'}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">Estimated Weekly</p>
                                    <p className="text-xl font-semibold">
                                        {formData.pricePerDay ? formatCurrency(formData.pricePerDay * 7) : '—'}
                                    </p>
                                </div>
                                <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">Estimated Monthly</p>
                                    <p className="text-xl font-semibold">
                                        {formData.pricePerDay ? formatCurrency(formData.pricePerDay * 30) : '—'}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <div className="space-y-3">
                                <Button type="submit" className="w-full">
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update Pricing' : 'Create Pricing Rule'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/pricing')}
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
