
import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Save,
    Download,
    Printer,
    Copy,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Info,
    CheckCircle2,
    XCircle,
    Percent,
    DollarSign,
    Calculator
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Badge } from '../../components/ui/Badge';
import { BASE_RATES, calculateQuotation, mockQuotations } from '../../data/mockQuotations';
import { cn } from '../../lib/utils';

const SECTIONS = [
    'DOOH',
    'Sultan',
    'Marina Mall',
    'Indoor Screens',
    'In Mall Branding',
    'Buses',
    'Cinema',
    'Radio',
    'Others'
];

const CATEGORY_OPTIONS = [
    'Signature', 'Premium', 'Anchors', 'Elite',
    'Avenues Grand', 'Avenues Diamond', 'Avenues Quartz', 'Avenues Eyes',
    'Residential', 'DOOH', 'Sultan DOOH', 'Marina Takeover', 'Radio', 'Cinema', 'Buses DD', 'Buses SD'
];

const DURATION_OPTIONS = ['1D', '3D', '1W', '2W', '3W', '4W'];

export function QuotationForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id && id !== 'new';

    const [formData, setFormData] = useState({
        id: `QUO-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
        title: '',
        client: '',
        cc: '',
        agency: '',
        date: new Date().toISOString().split('T')[0],
        duration: '',
        spotDuration: '',
        status: 'Draft',
        items: [],
        manualDiscounts: {
            packageAmount: null,
            otherPercentage: 0
        }
    });

    const [activeSection, setActiveSection] = useState('DOOH');

    useEffect(() => {
        if (isEdit) {
            const existing = mockQuotations.find(q => q.id === id);
            if (existing) {
                setFormData(prev => ({
                    ...prev,
                    ...existing,
                    manualDiscounts: existing.manualDiscounts || prev.manualDiscounts
                }));
            }
        }
    }, [id, isEdit]);

    const totals = useMemo(() => {
        return calculateQuotation(formData.items, formData.manualDiscounts);
    }, [formData.items, formData.manualDiscounts]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addItem = (section) => {
        const newItem = {
            id: Date.now(),
            section,
            category: 'Premium',
            element: '',
            governorate: '',
            duration: '4W',
            qty: 1,
            gross: 0,
            net: 0,
            notes: ''
        };
        setFormData(prev => ({ ...prev, items: [...prev.items, newItem] }));
    };

    const removeItem = (itemId) => {
        setFormData(prev => ({ ...prev, items: prev.items.filter(i => i.id !== itemId) }));
    };

    const updateItem = (itemId, field, value) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.map(item => item.id === itemId ? { ...item, [field]: value } : item)
        }));
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="space-y-6 pb-20">
            {/* Header / Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/quotations')}>
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isEdit ? 'Edit Quotation' : 'Create Quotation'}
                        </h2>
                        <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="bg-white/50 border-white/20">
                                {formData.id}
                            </Badge>
                            <Badge className={cn("rounded-full", formData.status === 'Finalized' ? 'bg-green-500' : 'bg-gray-400')}>
                                {formData.status}
                            </Badge>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" className="glass-card">
                        <Save size={18} className="mr-2" />
                        Save Draft
                    </Button>
                    <Button
                        onClick={() => updateField('status', 'Finalized')}
                        className="bg-black text-white hover:bg-gray-800"
                    >
                        <CheckCircle2 size={18} className="mr-2" />
                        Finalize
                    </Button>
                    <div className="h-8 w-px bg-white/20 mx-2" />
                    <Button variant="ghost" className="glass-card">
                        <Download size={18} />
                    </Button>
                    <Button variant="ghost" className="glass-card">
                        <Printer size={18} />
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-3 space-y-6">
                    {/* Quotation Header Details */}
                    <Card className="glass-card border-none p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">To (Client Name)</label>
                                <Input
                                    value={formData.client}
                                    onChange={(e) => updateField('client', e.target.value)}
                                    placeholder="e.g. RetailGiant Kuwait"
                                    className="bg-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">Company / Agency</label>
                                <Input
                                    value={formData.agency}
                                    onChange={(e) => updateField('agency', e.target.value)}
                                    placeholder="e.g. Al-Mansour Media"
                                    className="bg-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                    placeholder="e.g. Ramadan 2026 Campaign"
                                    className="bg-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">Campaign Duration</label>
                                <Input
                                    value={formData.duration}
                                    onChange={(e) => updateField('duration', e.target.value)}
                                    placeholder="e.g. 4 Weeks"
                                    className="bg-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">Date of Quotation</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => updateField('date', e.target.value)}
                                    className="bg-white/50"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">CC (Optional)</label>
                                <Input
                                    value={formData.cc}
                                    onChange={(e) => updateField('cc', e.target.value)}
                                    placeholder="e.g. marketing@agency.com"
                                    className="bg-white/50"
                                />
                            </div>
                        </div>
                    </Card>

                    {/* Section Selector Tabs */}
                    <div className="flex overflow-x-auto gap-2 p-1 bg-white/10 rounded-xl no-scrollbar">
                        {SECTIONS.map(section => (
                            <button
                                key={section}
                                onClick={() => setActiveSection(section)}
                                className={cn(
                                    "px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap transition-all",
                                    activeSection === section
                                        ? "bg-black text-white shadow-lg"
                                        : "text-[hsl(var(--color-text-muted))] hover:bg-white/20"
                                )}
                            >
                                {section}
                                {formData.items.filter(i => i.section === section).length > 0 && (
                                    <span className="ml-2 bg-white/20 text-[10px] px-1.5 py-0.5 rounded-full">
                                        {formData.items.filter(i => i.section === section).length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Line Item Table for Active Section */}
                    <Card className="glass-card border-none overflow-hidden">
                        <div className="p-4 border-b border-white/20 bg-white/5 flex items-center justify-between">
                            <h3 className="font-bold flex items-center gap-2">
                                <Plus size={18} className="text-black" />
                                {activeSection} Line Items
                            </h3>
                            <div className="flex gap-2">
                                <Button size="sm" variant="ghost" className="text-xs uppercase font-bold text-[hsl(var(--color-text-muted))]">
                                    Gross: {formatCurrency(formData.items.filter(i => i.section === activeSection).reduce((acc, curr) => acc + curr.gross, 0))}
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs uppercase font-bold text-[hsl(var(--color-primary))]">
                                    Net: {formatCurrency(formData.items.filter(i => i.section === activeSection).reduce((acc, curr) => acc + curr.net, 0))}
                                </Button>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-white/20 bg-black/5 text-[10px] uppercase font-bold tracking-wider">
                                        <th className="px-4 py-3 w-40">Category</th>
                                        <th className="px-4 py-3">Screen / Element</th>
                                        <th className="px-4 py-3 w-40">Gov / Units</th>
                                        <th className="px-4 py-3 w-28">Duration</th>
                                        <th className="px-4 py-3 w-20">Qty</th>
                                        <th className="px-4 py-3 w-28 text-right">Gross</th>
                                        <th className="px-4 py-3 w-28 text-right">Net</th>
                                        <th className="px-4 py-3 w-10"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/10">
                                    {formData.items.filter(i => i.section === activeSection).map((item) => (
                                        <tr key={item.id} className="hover:bg-white/30 transition-colors">
                                            <td className="px-4 py-3">
                                                <select
                                                    className="bg-transparent border-none text-sm font-medium w-full focus:ring-0"
                                                    value={item.category}
                                                    onChange={(e) => updateItem(item.id, 'category', e.target.value)}
                                                >
                                                    {CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-gray-400"
                                                    value={item.element}
                                                    onChange={(e) => updateItem(item.id, 'element', e.target.value)}
                                                    placeholder="Screen Name..."
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <input
                                                    className="bg-transparent border-none text-sm w-full focus:ring-0 placeholder:text-gray-400"
                                                    value={item.governorate}
                                                    onChange={(e) => updateItem(item.id, 'governorate', e.target.value)}
                                                    placeholder="e.g. Capital"
                                                />
                                            </td>
                                            <td className="px-4 py-3">
                                                <select
                                                    className="bg-transparent border-none text-sm w-full focus:ring-0"
                                                    value={item.duration}
                                                    onChange={(e) => updateItem(item.id, 'duration', e.target.value)}
                                                >
                                                    {DURATION_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                                                </select>
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <input
                                                    type="number"
                                                    className="bg-transparent border-none text-sm w-full text-center focus:ring-0"
                                                    value={item.qty}
                                                    onChange={(e) => updateItem(item.id, 'qty', parseInt(e.target.value) || 0)}
                                                />
                                            </td>
                                            <td className="px-4 py-3 text-right text-xs font-medium text-[hsl(var(--color-text-muted))]">
                                                {formatCurrency(item.gross)}
                                            </td>
                                            <td className="px-4 py-3 text-right text-sm font-bold text-[hsl(var(--color-primary))]">
                                                {formatCurrency(item.net)}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700 opacity-50 hover:opacity-100 transition-all">
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                    {formData.items.filter(i => i.section === activeSection).length === 0 && (
                                        <tr>
                                            <td colSpan="8" className="px-4 py-8 text-center text-[hsl(var(--color-text-muted))] text-sm italic">
                                                No items added to this section yet.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                        <div className="p-4 bg-white/5 border-t border-white/20">
                            <Button
                                variant="ghost"
                                className="w-full border-2 border-dashed border-white/30 hover:border-black/20 hover:bg-white/50 py-6"
                                onClick={() => addItem(activeSection)}
                            >
                                <Plus size={18} className="mr-2" />
                                Add {activeSection} Line Item
                            </Button>
                        </div>
                    </Card>

                    {/* Terms & Conditions Block */}
                    <Card className="glass-card border-none p-6">
                        <CardTitle className="text-lg mb-4 flex items-center gap-2">
                            <Info size={18} className="text-blue-500" />
                            Terms & Conditions
                        </CardTitle>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-xs text-[hsl(var(--color-text-muted))] leading-relaxed">
                            <ul className="space-y-2 list-disc list-inside">
                                <li>Quotation is valid for one week from the date of issuance.</li>
                                <li>100% down payment is required for booking confirmation.</li>
                                <li>Exclusivity requests are subject to a 50% penalty on cancellation.</li>
                                <li>Clients must provide content 3 working days prior to campaign start.</li>
                            </ul>
                            <div className="p-4 bg-white/30 border border-white/40 rounded-lg">
                                <p className="font-bold mb-2 uppercase">Agreement for Extenuating Circumstances</p>
                                <p>Both parties agree that in the event of force majeure or government-mandated lockdowns, campaign durations will be paused or extended without additional fees.</p>
                            </div>
                        </div>
                    </Card>

                    {/* Signatures */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card className="glass-card border-none p-8 flex flex-col items-center justify-center text-center opacity-70 border-2 border-dashed border-white/20">
                            <div className="w-full border-b border-black mb-4 h-12" />
                            <p className="font-bold uppercase tracking-widest text-sm">For M2R Group</p>
                            <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">Commercial Director</p>
                        </Card>
                        <Card className="glass-card border-none p-8 flex flex-col items-center justify-center text-center opacity-70 border-2 border-dashed border-white/20">
                            <div className="w-full border-b border-black mb-4 h-12" />
                            <p className="font-bold uppercase tracking-widest text-sm">Accepted by Client</p>
                            <p className="text-xs text-[hsl(var(--color-text-muted))] mt-1">Name & Title</p>
                        </Card>
                    </div>
                </div>

                {/* Sidebar: Discounts & Incentives */}
                <div className="space-y-6 sticky top-6 self-start">
                    <Card className="glass-card border-none p-6">
                        <div className="mb-6">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-[hsl(var(--color-text-muted))] flex items-center justify-between">
                                Summary
                                <Calculator size={16} />
                            </h3>
                            <div className="mt-4 space-y-4">
                                <div>
                                    <p className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">Total Gross</p>
                                    <p className="text-2xl font-bold">{formatCurrency(totals.gross)}</p>
                                </div>
                                <div className="pt-4 border-t border-white/20">
                                    <p className="text-xs font-bold uppercase text-[hsl(var(--color-text-muted))]">Total Net</p>
                                    <p className="text-4xl font-black text-[hsl(var(--color-primary))]">{formatCurrency(totals.net)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--color-text-muted))]">
                                Auto-Discounts Triggers
                            </h3>
                            <div className="space-y-2">
                                {/* Signature Trigger */}
                                <div className={cn(
                                    "p-3 rounded-lg border text-xs flex items-center gap-3 transition-all",
                                    formData.items.filter(i => i.category === 'Signature').reduce((acc, c) => acc + c.qty, 0) >= 10
                                        ? "bg-green-500/10 border-green-500/30 text-green-700"
                                        : "bg-white/30 border-white/40 opacity-50"
                                )}>
                                    <CheckCircle2 size={16} />
                                    <span>Signature Benefit Enabled</span>
                                </div>
                                {/* Residential Trigger */}
                                <div className={cn(
                                    "p-3 rounded-lg border text-xs flex items-center gap-3 transition-all",
                                    formData.items.filter(i => i.category === 'Residential').reduce((acc, c) => acc + c.qty, 0) >= 10
                                        ? "bg-green-500/10 border-green-500/30 text-green-700"
                                        : "bg-white/30 border-white/40 opacity-50"
                                )}>
                                    <CheckCircle2 size={16} />
                                    <span>Residential Tier {formData.items.filter(i => i.category === 'Residential').reduce((acc, c) => acc + c.qty, 0) >= 20 ? '2' : '1'}</span>
                                </div>
                                {/* Mix Trigger */}
                                <div className={cn(
                                    "p-3 rounded-lg border text-xs flex items-center gap-3 transition-all",
                                    (formData.items.filter(i => i.section === 'DOOH').reduce((acc, c) => acc + c.qty, 0) >= 20 && formData.items.filter(i => i.category === 'Signature').reduce((acc, c) => acc + c.qty, 0) < 10)
                                        ? "bg-green-500/10 border-green-500/30 text-green-700"
                                        : "bg-white/30 border-white/40 opacity-50"
                                )}>
                                    <CheckCircle2 size={16} />
                                    <span>Mix & Bundle Incentive</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/20 space-y-4">
                                <h3 className="text-xs font-bold uppercase tracking-widest text-[hsl(var(--color-text-muted))]">
                                    Manual Adjustments
                                </h3>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase">Special Package (KWD)</label>
                                        <div className="relative">
                                            <DollarSign size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
                                            <Input
                                                type="number"
                                                className="pl-8 bg-white/50 h-8 text-xs"
                                                value={formData.manualDiscounts.packageAmount || ''}
                                                onChange={(e) => updateField('manualDiscounts', { ...formData.manualDiscounts, packageAmount: parseFloat(e.target.value) || null })}
                                                placeholder="Fixed amount..."
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold uppercase">Agency Discount (%)</label>
                                        <div className="relative">
                                            <Percent size={14} className="absolute left-2 top-1/2 -translate-y-1/2 opacity-50" />
                                            <Input
                                                type="number"
                                                className="pl-8 bg-white/50 h-8 text-xs"
                                                value={formData.manualDiscounts.otherPercentage}
                                                onChange={(e) => updateField('manualDiscounts', { ...formData.manualDiscounts, otherPercentage: parseFloat(e.target.value) || 0 })}
                                                placeholder="Percentage..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="glass-card border-none p-4 bg-orange-500/10 border-orange-500/20">
                        <div className="flex gap-3">
                            <Info size={20} className="text-orange-600 shrink-0" />
                            <div>
                                <p className="text-[10px] font-bold uppercase text-orange-700">Print Note</p>
                                <p className="text-[10px] text-orange-600 leading-tight mt-1">
                                    Calculator V12.8 – Print in landscape – Attach to finance checklist. 100% downpayment required.
                                </p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
