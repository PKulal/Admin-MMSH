import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Switch } from '../../components/ui/Switch';
import { ArrowLeft, Save, Plus, X, Users, PlayCircle as MediaIcon } from 'lucide-react';
import { mockScreens } from '../../data/mockData';

export function ScreenForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingScreen = isEdit ? mockScreens.find(s => s.id === id) : null;

    const [formData, setFormData] = useState(() => {
        const defaults = {
            name: '',
            location: '',
            geoCoordinates: { lat: '', lng: '' },
            type: 'outdoor',
            category: '',
            size: { width: '', height: '' },
            resolution: { width: '', height: '' },
            audienceMetadata: '',
            screenQuantity: 1,
            imp2Weeks: 0,
            demographics: {
                nationality: { kuwaiti: 0, arab: 0, nonArab: 0 },
                gender: { male: 0, female: 0 },
                ageGroup: { boomers: 0, genX: 0, millennials: 0, genZ: 0 }
            },
            previewMedia: [],
            active: true
        };

        if (existingScreen) {
            return {
                ...defaults,
                ...existingScreen,
                demographics: {
                    nationality: { ...defaults.demographics.nationality, ...(existingScreen.demographics?.nationality || {}) },
                    gender: { ...defaults.demographics.gender, ...(existingScreen.demographics?.gender || {}) },
                    ageGroup: { ...defaults.demographics.ageGroup, ...(existingScreen.demographics?.ageGroup || {}) }
                },
                previewMedia: existingScreen.previewMedia || existingScreen.previewImages || []
            };
        }
        return defaults;
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Saving screen:', formData);
        alert(isEdit ? 'Screen updated successfully!' : 'Screen created successfully!');
        navigate('/inventory');
    };

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: { ...prev[parent], [field]: value }
        }));
    };

    const updateDeepNestedField = (parent, subParent, field, value) => {
        setFormData(prev => ({
            ...prev,
            [parent]: {
                ...prev[parent],
                [subParent]: { ...prev[parent][subParent], [field]: value }
            }
        }));
    };

    const handleAddMedia = () => {
        const id = Math.random().toString(36).substr(2, 9);
        setFormData(prev => ({
            ...prev,
            previewMedia: [...(prev.previewMedia || []), { id, url: 'https://placehold.co/600x400/000000/FFFFFF/png?text=Preview+Media' }]
        }));
    };

    const handleRemoveMedia = (id) => {
        setFormData(prev => ({
            ...prev,
            previewMedia: prev.previewMedia.filter(img => img.id !== id)
        }));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/inventory')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEdit ? 'Edit Screen' : 'Add New Screen'}
                    </h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        {isEdit ? `Editing ${existingScreen?.name}` : 'Create a new advertising screen'}
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Form */}
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Basic Information</CardTitle>
                            </CardHeader>
                            <div className="p-6 pt-0 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Screen Name *
                                    </label>
                                    <Input
                                        required
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        placeholder="e.g., Times Square Billboard"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Location *
                                    </label>
                                    <Input
                                        required
                                        value={formData.location}
                                        onChange={(e) => updateField('location', e.target.value)}
                                        placeholder="e.g., New York, NY"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Latitude
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={formData.geoCoordinates.lat}
                                            onChange={(e) => updateNestedField('geoCoordinates', 'lat', parseFloat(e.target.value))}
                                            placeholder="40.758"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Longitude
                                        </label>
                                        <Input
                                            type="number"
                                            step="any"
                                            value={formData.geoCoordinates.lng}
                                            onChange={(e) => updateNestedField('geoCoordinates', 'lng', parseFloat(e.target.value))}
                                            placeholder="-73.9855"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Screen Quantity *
                                        </label>
                                        <Input
                                            required
                                            type="number"
                                            min="1"
                                            value={formData.screenQuantity}
                                            onChange={(e) => updateField('screenQuantity', parseInt(e.target.value) || 1)}
                                            placeholder="e.g., 1"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            IMP-2weeks *
                                        </label>
                                        <div className="relative">
                                            <Input
                                                required
                                                type="number"
                                                min="0"
                                                value={formData.imp2Weeks}
                                                onChange={(e) => updateField('imp2Weeks', parseInt(e.target.value) || 0)}
                                                placeholder="e.g., 250000"
                                            />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-[hsl(var(--color-text-muted))] uppercase tracking-wider">
                                                IMP
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Screen Specifications</CardTitle>
                            </CardHeader>
                            <div className="p-6 pt-0 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Type *
                                        </label>
                                        <Select
                                            required
                                            value={formData.type}
                                            onChange={(e) => updateField('type', e.target.value)}
                                        >
                                            <option value="outdoor">Outdoor</option>
                                            <option value="indoor">Indoor</option>
                                        </Select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                            Category *
                                        </label>
                                        <Input
                                            required
                                            value={formData.category}
                                            onChange={(e) => updateField('category', e.target.value)}
                                            placeholder="e.g., Billboard, LED Wall"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Size (feet) *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            required
                                            type="number"
                                            value={formData.size.width}
                                            onChange={(e) => updateNestedField('size', 'width', parseFloat(e.target.value))}
                                            placeholder="Width"
                                        />
                                        <Input
                                            required
                                            type="number"
                                            value={formData.size.height}
                                            onChange={(e) => updateNestedField('size', 'height', parseFloat(e.target.value))}
                                            placeholder="Height"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-[hsl(var(--color-text-main))]">
                                        Resolution (pixels) *
                                    </label>
                                    <div className="grid grid-cols-2 gap-4">
                                        <Input
                                            required
                                            type="number"
                                            value={formData.resolution.width}
                                            onChange={(e) => updateNestedField('resolution', 'width', parseInt(e.target.value))}
                                            placeholder="Width (e.g., 1920)"
                                        />
                                        <Input
                                            required
                                            type="number"
                                            value={formData.resolution.height}
                                            onChange={(e) => updateNestedField('resolution', 'height', parseInt(e.target.value))}
                                            placeholder="Height (e.g., 1080)"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-6 pt-4 border-t border-[hsl(var(--color-border))]">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Users size={18} className="text-blue-600" />
                                        <h3 className="text-sm font-bold">Audience Demographics (%)</h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Nationality */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold uppercase text-[hsl(var(--color-text-muted))]">Nationality</p>
                                            <div className="space-y-2">
                                                {['kuwaiti', 'arab', 'nonArab'].map(field => (
                                                    <div key={field} className="flex items-center gap-2">
                                                        <label className="text-xs font-medium w-16 capitalize">{field === 'nonArab' ? 'Non-Arab' : field}</label>
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            className="h-8 text-xs"
                                                            value={formData.demographics.nationality[field]}
                                                            onChange={(e) => updateDeepNestedField('demographics', 'nationality', field, parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Gender */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold uppercase text-[hsl(var(--color-text-muted))]">Gender</p>
                                            <div className="space-y-2">
                                                {['male', 'female'].map(field => (
                                                    <div key={field} className="flex items-center gap-2">
                                                        <label className="text-xs font-medium w-16 capitalize">{field}</label>
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            className="h-8 text-xs"
                                                            value={formData.demographics.gender[field]}
                                                            onChange={(e) => updateDeepNestedField('demographics', 'gender', field, parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Age Groups */}
                                        <div className="space-y-3">
                                            <p className="text-[10px] font-bold uppercase text-[hsl(var(--color-text-muted))]">Age Groups</p>
                                            <div className="space-y-2">
                                                {['boomers', 'genX', 'millennials', 'genZ'].map(field => (
                                                    <div key={field} className="flex items-center gap-2">
                                                        <label className="text-xs font-medium w-16 capitalize">{field}</label>
                                                        <Input
                                                            type="number"
                                                            size="sm"
                                                            className="h-8 text-xs"
                                                            value={formData.demographics.ageGroup[field]}
                                                            onChange={(e) => updateDeepNestedField('demographics', 'ageGroup', field, parseInt(e.target.value))}
                                                        />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Preview Media */}
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                <div className="flex items-center gap-2">
                                    <MediaIcon size={18} className="text-blue-600" />
                                    <CardTitle>Preview Media</CardTitle>
                                </div>
                                <Button type="button" size="sm" onClick={handleAddMedia} className="h-8">
                                    <Plus size={14} className="mr-1" /> Add Media
                                </Button>
                            </CardHeader>
                            <div className="p-6">
                                {!formData.previewMedia || formData.previewMedia.length === 0 ? (
                                    <div className="border-2 border-dashed border-gray-200 rounded-lg p-12 text-center">
                                        <MediaIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                        <p className="text-sm text-gray-500">No preview media added yet.</p>
                                        <p className="text-xs text-gray-400 mt-1">Add media to show how the screen looks in its environment.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {formData.previewMedia.map((img) => (
                                            <div key={img.id} className="group relative aspect-video rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
                                                <img src={img.url} alt="Preview" className="w-full h-full object-cover" />
                                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-200 flex items-center justify-center">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleRemoveMedia(img.id)}
                                                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-all transform scale-90 group-hover:scale-100"
                                                    >
                                                        <X size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <div className="p-6 pt-0 flex items-center justify-between">
                                <div>
                                    <p className="font-medium text-[hsl(var(--color-text-main))]">Active</p>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                        {formData.active ? 'Screen is active' : 'Screen is inactive'}
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
                            <div className="p-6 pt-0 space-y-3">
                                <Button type="submit" className="w-full">
                                    <Save size={18} className="mr-2" />
                                    {isEdit ? 'Update Screen' : 'Create Screen'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="w-full"
                                    onClick={() => navigate('/inventory')}
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
