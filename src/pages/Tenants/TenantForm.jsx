import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { mockTenantsDetailed } from '../../data/mockTenants';

export function TenantForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingTenant = isEdit ? mockTenantsDetailed.find(t => t.id === id) : null;

    const [formData, setFormData] = useState(existingTenant || {
        name: '',
        contactName: '',
        email: '',
        phone: '',
        address: '',
        active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving tenant:', formData);
        alert(isEdit ? 'Tenant updated successfully!' : 'Tenant created successfully!');
        navigate('/tenants');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/tenants')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit Tenant' : 'Add New Tenant'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingTenant?.name}` : 'Create a new tenant organization'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Tenant Information</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Tenant Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g., RetailGiant, InnoTech"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Contact Person *
                                    </label>
                                    <Input
                                        required
                                        value={formData.contactName}
                                        onChange={(e) => updateField('contactName', e.target.value)}
                                        placeholder="Full name of primary contact"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Email *
                                        </label>
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => updateField('email', e.target.value)}
                                            placeholder="contact@company.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Phone *
                                        </label>
                                        <Input
                                            required
                                            type="tel"
                                            value={formData.phone}
                                            onChange={(e) => updateField('phone', e.target.value)}
                                            placeholder="+965 XXXX XXXX"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Address *
                                    </label>
                                    <Input
                                        required
                                        value={formData.address}
                                        onChange={(e) => updateField('address', e.target.value)}
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-[hsl(var(--color-text-main))]">Active</p>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {formData.active ? 'Tenant is active' : 'Tenant is inactive'}
                                    </p>
                                </div>
                                <Switch
                                    checked={formData.active}
                                    onCheckedChange={(checked) => updateField('active', checked)}
                                />
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <div className="space-y-3">
                                <Button type="submit" className="w-full">
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update Tenant' : 'Create Tenant'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/tenants')}
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
