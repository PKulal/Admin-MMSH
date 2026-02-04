import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Switch } from '../../components/ui/Switch';
import { ArrowLeft, Save, Building2 } from 'lucide-react';
import { mockAgencies } from '../../data/mockTenants';

export function AgencyForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingAgency = isEdit ? mockAgencies.find(a => a.id === id) : null;

    const [formData, setFormData] = useState(existingAgency || {
        name: '',
        contactName: '',
        email: '',
        phone: '',
        commission: 15,
        active: true
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving agency:', formData);
        alert(isEdit ? 'Agency updated successfully!' : 'Agency created successfully!');
        navigate('/users'); // Redirect back to management which has the tabs
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/users')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit Agency' : 'Add New Agency'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingAgency?.name}` : 'Register a new advertising agency'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <div className="flex items-center gap-2">
                                    <Building2 className="text-blue-600" size={24} />
                                    <CardTitle>Agency Details</CardTitle>
                                </div>
                            </CardHeader>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-6 pt-0">
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">Agency Name *</label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g., Al-Mansour Media"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Contact Person *</label>
                                    <Input
                                        required
                                        value={formData.contactName}
                                        onChange={(e) => updateField('contactName', e.target.value)}
                                        placeholder="Full Name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        placeholder="agency@example.com"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                                    <Input
                                        value={formData.phone}
                                        onChange={(e) => updateField('phone', e.target.value)}
                                        placeholder="+965 XXXX XXXX"
                                    />
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Status & Actions */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Agency Status</CardTitle>
                            </CardHeader>
                            <div className="flex items-center justify-between p-6 pt-0">
                                <div>
                                    <p className="font-medium">Active Status</p>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {formData.active ? 'Agency is enabled' : 'Agency is disabled'}
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
                            <div className="space-y-3 p-6 pt-0">
                                <Button type="submit" className="w-full">
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update Agency' : 'Register Agency'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/users')}
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
