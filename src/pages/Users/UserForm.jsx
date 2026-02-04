import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { ArrowLeft, Save, UserPlus } from 'lucide-react';
import { mockUsers, mockTenantsDetailed } from '../../data/mockTenants';

export function UserForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingUser = isEdit ? mockUsers.find(u => u.id === id) : null;

    const [formData, setFormData] = useState(existingUser || {
        name: '',
        email: '',
        tenantId: '',
        role: 'User',
        active: true,
        isSystemUser: false
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving user:', formData);
        alert(isEdit ? 'User updated successfully!' : 'User created successfully!');
        navigate('/users');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const selectedTenant = mockTenantsDetailed.find(t => t.id === formData.tenantId);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/users')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit User' : 'Add New User'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingUser?.name}` : 'Create a new end user'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>User Information</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Full Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g., Ahmed Al-Mansouri"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Email *
                                    </label>
                                    <Input
                                        required
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => updateField('email', e.target.value)}
                                        placeholder="user@company.com"
                                    />
                                </div>

                                {!formData.isSystemUser && (
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Assign to Tenant *
                                        </label>
                                        <Select
                                            required
                                            value={formData.tenantId}
                                            onChange={(e) => updateField('tenantId', e.target.value)}
                                        >
                                            <option value="">Select a tenant</option>
                                            {mockTenantsDetailed.filter(t => t.active).map(tenant => (
                                                <option key={tenant.id} value={tenant.id}>
                                                    {tenant.name}
                                                </option>
                                            ))}
                                        </Select>
                                        {selectedTenant && (
                                            <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                                Contact: {selectedTenant.contactName} • {selectedTenant.email}
                                            </p>
                                        )}
                                    </div>
                                )}

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Role *
                                    </label>
                                    <Select
                                        required
                                        disabled={formData.isSystemUser}
                                        value={formData.role}
                                        onChange={(e) => updateField('role', e.target.value)}
                                    >
                                        <option value="Admin">Admin</option>
                                        <option value="Ops">Ops</option>
                                        <option value="Sales team">Sales team</option>
                                        <option value="Approver">Approver</option>
                                        <option value="User">User</option>
                                    </Select>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1">
                                        {formData.role === 'Admin'
                                            ? 'Full access to tenant campaigns and settings'
                                            : 'Can create and manage campaigns'}
                                    </p>
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
                                        {formData.active ? 'User can login' : 'User is deactivated'}
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
                                    {isEdit ? 'Update User' : 'Create User'}
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
