import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ChevronLeft,
    Save,
    Calendar,
    DollarSign,
    Percent,
    Monitor,
    Info,
    CheckCircle2
} from 'lucide-react';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { mockTenantsDetailed } from '../../data/mockTenants';
import { mockScreens } from '../../data/mockData';
import { mockContracts } from '../../data/mockContracts';

export function ContractForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = !!id;

    const [formData, setFormData] = useState({
        title: '',
        tenantId: '',
        userId: '',
        startDate: '',
        endDate: '',
        pricingType: 'discount',
        pricingValue: '',
        screenSubset: 'all',
        screens: [],
        allocatedUnits: '',
        status: 'active'
    });

    useEffect(() => {
        if (isEdit) {
            const contract = mockContracts.find(c => c.id === id);
            if (contract) {
                setFormData({
                    ...contract,
                    pricingValue: contract.pricingValue.toString(),
                    allocatedUnits: contract.allocatedUnits ? contract.allocatedUnits.toString() : ''
                });
            }
        }
    }, [id, isEdit]);

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = () => {
        // Mock save logic
        alert(isEdit ? 'Contract updated successfully!' : 'Contract created successfully!');
        navigate('/contracts');
    };

    const toggleScreen = (screenId) => {
        setFormData(prev => {
            const screens = prev.screens.includes(screenId)
                ? prev.screens.filter(s => s !== screenId)
                : [...prev.screens, screenId];
            return { ...prev, screens };
        });
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto pb-12">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/contracts')} className="text-gray-500">
                        <ChevronLeft size={20} className="mr-1" /> Back to Contracts
                    </Button>
                    <h1 className="text-2xl font-bold">{isEdit ? 'Edit Contract' : 'New Contract'}</h1>
                </div>
                <Button onClick={handleSave} className="bg-black text-white hover:bg-gray-800">
                    <Save size={18} className="mr-2" /> {isEdit ? 'Update Contract' : 'Save Contract'}
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 space-y-6">
                    {/* Basic Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Basic Information</CardTitle>
                        </CardHeader>
                        <div className="p-6 pt-0 space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Contract Title *</label>
                                <Input
                                    placeholder="e.g., Annual Agency Agreement 2026"
                                    value={formData.title}
                                    onChange={(e) => updateField('title', e.target.value)}
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Target Tenant *</label>
                                    <Select
                                        value={formData.tenantId}
                                        onChange={(e) => updateField('tenantId', e.target.value)}
                                    >
                                        <option value="">Select Tenant</option>
                                        {mockTenantsDetailed.map(t => (
                                            <option key={t.id} value={t.id}>{t.name}</option>
                                        ))}
                                    </Select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Status</label>
                                    <Select
                                        value={formData.status}
                                        onChange={(e) => updateField('status', e.target.value)}
                                    >
                                        <option value="active">Active</option>
                                        <option value="pending">Pending</option>
                                        <option value="expired">Expired</option>
                                    </Select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Start Date</label>
                                    <Input
                                        type="date"
                                        value={formData.startDate}
                                        onChange={(e) => updateField('startDate', e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">End Date</label>
                                    <Input
                                        type="date"
                                        value={formData.endDate}
                                        onChange={(e) => updateField('endDate', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Pricing & Rules */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Pricing & Rules</CardTitle>
                        </CardHeader>
                        <div className="p-6 pt-0 space-y-6">
                            <div className="flex gap-4 p-1 bg-gray-50 rounded-lg w-fit">
                                <button
                                    onClick={() => updateField('pricingType', 'discount')}
                                    className={`px-4 py-2 rounded-md transition-all text-sm font-bold flex items-center gap-2 ${formData.pricingType === 'discount' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                                >
                                    <Percent size={16} /> Discount Based
                                </button>
                                <button
                                    onClick={() => updateField('pricingType', 'fixed')}
                                    className={`px-4 py-2 rounded-md transition-all text-sm font-bold flex items-center gap-2 ${formData.pricingType === 'fixed' ? 'bg-white shadow-sm text-black' : 'text-gray-500'}`}
                                >
                                    <DollarSign size={16} /> Fixed Price
                                </button>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">
                                        {formData.pricingType === 'discount' ? 'Discount Percentage (%)' : 'Fixed Price (KWD / hr)'}
                                    </label>
                                    <div className="relative">
                                        <Input
                                            type="number"
                                            placeholder={formData.pricingType === 'discount' ? 'e.g., 20' : 'e.g., 15'}
                                            value={formData.pricingValue}
                                            onChange={(e) => updateField('pricingValue', e.target.value)}
                                        />
                                        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                                            {formData.pricingType === 'discount' ? '%' : 'KWD'}
                                        </div>
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">
                                        {formData.pricingType === 'discount'
                                            ? 'This discount will be applied to standard screen rates.'
                                            : 'All selected screens will use this hourly rate regardless of peak status.'}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Allocation Limit (Hours)</label>
                                    <Input
                                        type="number"
                                        placeholder="e.g., 500 (Optional)"
                                        value={formData.allocatedUnits}
                                        onChange={(e) => updateField('allocatedUnits', e.target.value)}
                                    />
                                    <p className="mt-2 text-xs text-gray-500">
                                        Leave empty for unlimited bookings during contract duration.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Screen Scope */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Screen Inventory Scope</CardTitle>
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">Apply to All Screens</span>
                                <Switch
                                    checked={formData.screenSubset === 'all'}
                                    onCheckedChange={(checked) => updateField('screenSubset', checked ? 'all' : 'subset')}
                                />
                            </div>
                        </CardHeader>
                        <div className="p-6 pt-0">
                            {formData.screenSubset === 'subset' && (
                                <div className="space-y-4">
                                    <p className="text-sm text-gray-500">Select which screens this contract applies to:</p>
                                    <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-2">
                                        {mockScreens.map(screen => (
                                            <div
                                                key={screen.id}
                                                onClick={() => toggleScreen(screen.id)}
                                                className={`p-3 border rounded-lg cursor-pointer transition-all flex items-center justify-between ${formData.screens.includes(screen.id) ? 'border-black bg-gray-50' : 'border-gray-100'}`}
                                            >
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold">{screen.name}</span>
                                                    <span className="text-[10px] text-gray-400">{screen.location}</span>
                                                </div>
                                                {formData.screens.includes(screen.id) && <CheckCircle2 size={16} className="text-black" />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {formData.screenSubset === 'all' && (
                                <div className="bg-gray-50 p-4 rounded-lg flex gap-3">
                                    <Info className="text-blue-500 shrink-0" size={20} />
                                    <p className="text-sm text-gray-600">
                                        This contract applies to the entire inventory of screens. Any screen selected in a campaign by this tenant will trigger the contract pricing rules.
                                    </p>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase tracking-wider text-gray-500">Contract Summary</CardTitle>
                        </CardHeader>
                        <div className="p-6 pt-0 space-y-4">
                            <div className="pb-4 border-b">
                                <p className="text-xs text-gray-400">Target Tenant</p>
                                <p className="font-bold">{mockTenantsDetailed.find(t => t.id === formData.tenantId)?.name || 'Not selected'}</p>
                            </div>
                            <div className="pb-4 border-b">
                                <p className="text-xs text-gray-400">Duration</p>
                                <p className="font-bold">
                                    {formData.startDate && formData.endDate
                                        ? `${formData.startDate} to ${formData.endDate}`
                                        : 'Dates not set'}
                                </p>
                            </div>
                            <div className="pb-4 border-b">
                                <p className="text-xs text-gray-400">Pricing Effect</p>
                                <p className="font-bold text-[hsl(var(--color-primary))]">
                                    {formData.pricingValue
                                        ? (formData.pricingType === 'discount'
                                            ? `${formData.pricingValue}% Discount`
                                            : `${formData.pricingValue} KWD Fixed Rate`)
                                        : 'Pricing not set'}
                                </p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-400">Inventory</p>
                                <p className="font-bold">
                                    {formData.screenSubset === 'all'
                                        ? 'Entire Screen Network'
                                        : `${formData.screens.length} Selected Screens`}
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl space-y-3">
                        <div className="flex items-center gap-2 text-blue-700">
                            <Info size={18} />
                            <span className="text-sm font-bold">Admin Note</span>
                        </div>
                        <p className="text-xs text-blue-600 leading-relaxed">
                            Contracts take precedence over standard pricing. When a campaign is created for this tenant, the system will automatically check if dates and screens align with this agreement.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
