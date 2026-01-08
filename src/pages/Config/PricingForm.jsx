import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ArrowLeft, Save, DollarSign, Clock, Calendar, BarChart3, TrendingUp, Percent, Users } from 'lucide-react';
import { mockPricing } from '../../data/mockPricing';
import { mockScreens } from '../../data/mockData';
import { mockSlots } from '../../data/mockSlots';

export function PricingForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingPricing = isEdit ? mockPricing.find(p => p.id === id) : null;

    const [formData, setFormData] = useState(() => {
        const defaults = {
            screenId: '',
            pricePerDay: '',
            currency: 'KWD',
            // New Fields
            startHour: '07:00',
            endHour: '06:00',
            peakDays: 'all',
            peakHour: 'all',
            imp2Weeks: '',
            calcRate4Week: '',
            calcRate2Week: '',
            sellingRate: '',
            oneDayRate: '',
            weekDayRate: '',
            weekendRate: '',
            oneHourRate: '',
            dayHourRate: '',
            eveningHourRate: '',
            peakRateDay: '',
            offPeakRateDay: '',
            peakRateHour: '',
            offPeakRateHour: '',
            oneHourExclusivity: '',
            cpm: ''
        };

        if (existingPricing) {
            return { ...defaults, ...existingPricing };
        }
        return defaults;
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

        // Auto-populate screen-dependent fields
        const screen = mockScreens.find(s => s.id === screenId);
        if (screen) {
            setFormData(prev => ({
                ...prev,
                peakDays: screen.peakDays || 'all',
                peakHour: screen.peakHour || 'all',
                imp2Weeks: screen.imp2Weeks || ''
            }));
        }
    };

    const screen = mockScreens.find(s => s.id === selectedScreen);

    const formatCurrency = (amount) => {
        if (!amount && amount !== 0) return '—';
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    // Automatic calculation logic
    React.useEffect(() => {
        const screenData = mockScreens.find(s => s.id === selectedScreen);
        const qty = parseFloat(screenData?.screenQuantity) || 1;
        const sRate = parseFloat(formData.sellingRate) || 0;
        const c4w = parseFloat(formData.calcRate4Week) || 0;
        const c2w = parseFloat(formData.calcRate2Week) || 0;

        // Mock backend calculation formula
        // Base Price = Selling Rate * Quantity
        const basePrice = sRate * qty;

        // Update calculated fields
        setFormData(prev => ({
            ...prev,
            pricePerDay: basePrice,
            oneDayRate: basePrice * 1.1, // Example multiplier
            weekDayRate: basePrice * 1.2,
            weekendRate: basePrice * 1.5,
            oneHourRate: basePrice / 24,
            dayHourRate: (basePrice / 24) * 1.2,
            eveningHourRate: (basePrice / 24) * 1.5,
            peakRateDay: basePrice * 1.3,
            offPeakRateDay: basePrice * 0.8,
            peakRateHour: (basePrice / 24) * 1.4,
            offPeakRateHour: (basePrice / 24) * 0.7,
        }));
    }, [selectedScreen, formData.sellingRate, formData.calcRate4Week, formData.calcRate2Week]);

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

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left Column: Form Details */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Section 1: Core Configuration */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Core Configuration</CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Screen *</label>
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
                                            <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">
                                                {screen.category} • {screen.type} • {screen.screenQuantity} {screen.screenQuantity === 1 ? 'Screen' : 'Screens'}
                                            </p>
                                        )}
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Base Price per Day (KWD) *</label>
                                        <div className="relative">
                                            <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 text-[hsl(var(--color-text-muted))]" size={16} />
                                            <Input
                                                readOnly
                                                type="number"
                                                value={formData.pricePerDay}
                                                className="pl-9 bg-[hsl(var(--color-background-muted))] opacity-75 cursor-not-allowed"
                                                placeholder="Calculated automatically"
                                            />
                                        </div>
                                        <p className="text-[10px] text-[hsl(var(--color-text-muted))] mt-1">This value is calculated based on business logic.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>


                        {/* Section 3: Base Rates & Impressions */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <TrendingUp size={18} className="text-green-600" />
                                    Rates
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Calc. Rate-4Week</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input type="number" value={formData.calcRate4Week} onChange={(e) => updateField('calcRate4Week', e.target.value)} className="pl-12 text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Calc. Rate-2Week</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input type="number" value={formData.calcRate2Week} onChange={(e) => updateField('calcRate2Week', e.target.value)} className="pl-12 text-sm" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Selling Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input type="number" value={formData.sellingRate} onChange={(e) => updateField('sellingRate', e.target.value)} className="pl-12 text-sm" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Section 4: Period Specific Rates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Calendar size={18} className="text-purple-600" />
                                    Period Specific Rates
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">1 Day Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input readOnly type="number" value={formData.oneDayRate} className="pl-12 text-sm bg-[hsl(var(--color-background-muted))] opacity-75" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Week Day Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input readOnly type="number" value={formData.weekDayRate} className="pl-12 text-sm bg-[hsl(var(--color-background-muted))] opacity-75" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Weekend Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input readOnly type="number" value={formData.weekendRate} className="pl-12 text-sm bg-[hsl(var(--color-background-muted))] opacity-75" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Section 5: Hourly & Performance Rates */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 size={18} className="text-orange-600" />
                                    Hourly & Performance Rates
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">1 Hour Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input readOnly type="number" value={formData.oneHourRate} className="pl-12 text-sm bg-[hsl(var(--color-background-muted))] opacity-75" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Day hour Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input readOnly type="number" value={formData.dayHourRate} className="pl-12 text-sm bg-[hsl(var(--color-background-muted))] opacity-75" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">Evening hour Rate</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input readOnly type="number" value={formData.eveningHourRate} className="pl-12 text-sm bg-[hsl(var(--color-background-muted))] opacity-75" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-orange-700 bg-orange-50/50 p-2 rounded-lg border border-orange-100 opacity-80">
                                    <label className="text-[10px] font-bold uppercase">Peak rate/Day</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">KWD</span>
                                        <Input readOnly type="number" value={formData.peakRateDay} className="pl-12 h-8 text-xs border-orange-200 bg-white/50" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-blue-700 bg-blue-50/50 p-2 rounded-lg border border-blue-100 opacity-80">
                                    <label className="text-[10px] font-bold uppercase">Off-Peak rate/Day</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">KWD</span>
                                        <Input readOnly type="number" value={formData.offPeakRateDay} className="pl-12 h-8 text-xs border-blue-200 bg-white/50" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-orange-700 bg-orange-50/50 p-2 rounded-lg border border-orange-100 opacity-80">
                                    <label className="text-[10px] font-bold uppercase">Peak rate/Hour</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">KWD</span>
                                        <Input readOnly type="number" value={formData.peakRateHour} className="pl-12 h-8 text-xs border-orange-200 bg-white/50" />
                                    </div>
                                </div>
                                <div className="space-y-1 text-blue-700 bg-blue-50/50 p-2 rounded-lg border border-blue-100 opacity-80">
                                    <label className="text-[10px] font-bold uppercase">Off-Peak rate/Hour</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs">KWD</span>
                                        <Input readOnly type="number" value={formData.offPeakRateHour} className="pl-12 h-8 text-xs border-blue-200 bg-white/50" />
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Section 6: Optimization & Advanced */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Percent size={18} className="text-red-600" />
                                    Optimization & Advanced
                                </CardTitle>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">1 Hour exclusivity</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input type="number" value={formData.oneHourExclusivity} onChange={(e) => updateField('oneHourExclusivity', e.target.value)} className="pl-12" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-[hsl(var(--color-text-muted))]">CPM</label>
                                    <div className="relative">
                                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[hsl(var(--color-text-muted))]">KWD</span>
                                        <Input type="number" value={formData.cpm} onChange={(e) => updateField('cpm', e.target.value)} className="pl-12" />
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card className="sticky top-6">
                            <CardHeader>
                                <CardTitle>Pricing Summary</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">Base Price per Day</p>
                                    <p className="text-3xl font-bold">
                                        {formData.pricePerDay ? formatCurrency(formData.pricePerDay) : '—'}
                                    </p>
                                </div>
                                {formData.sellingRate && (
                                    <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Selling Rate</p>
                                        <p className="text-xl font-semibold text-green-600">
                                            {formatCurrency(formData.sellingRate)}
                                        </p>
                                    </div>
                                )}
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

                        <Card className="sticky top-[400px]">
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
