import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/Table';
import {
    ArrowLeft,
    Save,
    ChevronRight,
    ChevronLeft,
    Monitor,
    Clock,
    DollarSign,
    CheckCircle2,
    Calendar,
    Building2,
    Info,
    Search,
    Eye,
    List,
    Map as MapIcon,
    FileText,
    Trash2,
    Upload,
    X
} from 'lucide-react';
import { mockCampaigns, mockTenants, mockScreens } from '../../data/mockData';
import { mockPricing } from '../../data/mockPricing';

const STEPS = [
    { id: 1, title: 'Basics', icon: Info },
    { id: 2, title: 'Screens', icon: Monitor },
    { id: 3, title: 'Scheduling', icon: Clock },
    { id: 4, title: 'Pricing', icon: DollarSign },
    { id: 5, title: 'Media', icon: FileText },
    { id: 6, title: 'Review', icon: CheckCircle2 }
];

const HOURLY_SEGMENTS = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
});

export function CampaignForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = id && id !== 'new';
    const existingCampaign = isEdit ? mockCampaigns.find(c => c.id === id) : null;

    const [currentStep, setCurrentStep] = useState(1);
    const [selectedScreenIndex, setSelectedScreenIndex] = useState(0);
    const [searchTerm, setSearchTerm] = useState('');

    // Filters for Step 2
    const [filters, setFilters] = useState({
        governorate: '',
        gender: '',
        age: '',
        screenType: '',
        nationality: ''
    });

    const [formData, setFormData] = useState({
        name: existingCampaign?.name || '',
        tenant: existingCampaign?.tenant || '',
        tenantId: existingCampaign?.tenantId || '',
        startDate: existingCampaign?.startDate || '',
        endDate: existingCampaign?.endDate || '',
        screens: existingCampaign?.screens || [],
        // screenId -> array of hours (e.g. ["08:00", "09:00"])
        hourlySegments: existingCampaign?.slots?.reduce((acc, slot) => {
            if (!acc[slot.screenId]) acc[slot.screenId] = [];
            // Handle different slot formats from mock data
            const segment = slot.startTime || (slot.timeSlot ? slot.timeSlot.split('-')[0] : null);
            if (segment && !acc[slot.screenId].includes(segment)) {
                acc[slot.screenId].push(segment);
            }
            return acc;
        }, {}) || {},
        estimatedPrice: existingCampaign?.estimatedPrice || 0,
        status: existingCampaign?.status || 'booked',
        media: existingCampaign?.media || []
    });

    const updateField = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleTenantChange = (tenantName) => {
        const tenant = mockTenants.find(t => t.name === tenantName);
        setFormData(prev => ({
            ...prev,
            tenant: tenantName,
            tenantId: tenant?.id || ''
        }));
    };

    const toggleScreen = (screen) => {
        setFormData(prev => {
            const isSelected = prev.screens.some(s => s.id === screen.id);
            if (isSelected) {
                const newScreens = prev.screens.filter(s => s.id !== screen.id);
                const newSegments = { ...prev.hourlySegments };
                delete newSegments[screen.id];
                return { ...prev, screens: newScreens, hourlySegments: newSegments };
            } else {
                return { ...prev, screens: [...prev.screens, screen] };
            }
        });
    };

    const toggleSegment = (screenId, segment) => {
        setFormData(prev => {
            const currentSegments = prev.hourlySegments[screenId] || [];
            const isSelected = currentSegments.includes(segment);

            let newSegments;
            if (isSelected) {
                newSegments = currentSegments.filter(s => s !== segment);
            } else {
                newSegments = [...currentSegments, segment];
            }

            return {
                ...prev,
                hourlySegments: {
                    ...prev.hourlySegments,
                    [screenId]: newSegments
                }
            };
        });
    };

    const handleRemoveMedia = (id) => {
        setFormData(prev => ({
            ...prev,
            media: prev.media.filter(m => m.id !== id)
        }));
    };

    const handleReplaceMedia = (id) => {
        // Simulation: update the existing item with a "replaced" tag or new URL
        setFormData(prev => ({
            ...prev,
            media: prev.media.map(m => m.id === id ? {
                ...m,
                fileName: `replaced_${m.fileName}`,
                uploadedAt: new Date().toISOString().split('T')[0],
                // In a real app, this would trigger a file picker
            } : m)
        }));
        alert('Please select the new file to replace this asset.');
    };

    const handleAddMedia = () => {
        // Simulation: just add a mock object
        const uploadScreen = formData.screens[selectedScreenIndex];
        const newMedia = {
            id: `MEDIA-${Date.now()}`,
            screenId: uploadScreen?.id,
            fileName: 'new_ad_asset.mp4',
            uploadedAt: new Date().toISOString().split('T')[0],
            url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            type: 'video'
        };
        setFormData(prev => ({
            ...prev,
            media: [...prev.media, newMedia]
        }));
    };

    const filteredScreens = useMemo(() => {
        return mockScreens.filter(screen => {
            const matchesSearch = screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                screen.location.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesType = !filters.screenType || screen.type === filters.screenType.toLowerCase();
            // In a real app, other filters would be checked against screen metadata
            return matchesSearch && matchesType;
        });
    }, [searchTerm, filters]);

    const calculatePrice = useMemo(() => {
        let total = 0;
        const start = new Date(formData.startDate);
        const end = new Date(formData.endDate);
        const diffTime = Math.abs(end - start);
        const diffDays = (isNaN(diffTime) ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;

        Object.entries(formData.hourlySegments).forEach(([screenId, segments]) => {
            if (!Array.isArray(segments)) return;
            segments.forEach(segment => {
                if (!segment || typeof segment !== 'string') return;
                const pricingRule = mockPricing.find(p => p.screenId === screenId && p.slotTime?.startsWith(segment.split(':')[0]));
                const pricePerHour = pricingRule?.pricePerDay ? pricingRule.pricePerDay / 4 : 50; // Mock calculation
                total += pricePerHour * diffDays;
            });
        });
        return total;
    }, [formData.hourlySegments, formData.startDate, formData.endDate]);

    useEffect(() => {
        if (currentStep === 4) {
            updateField('estimatedPrice', calculatePrice);
        }
    }, [currentStep, calculatePrice]);

    const handleNext = () => {
        if (currentStep < 6) setCurrentStep(prev => prev + 1);
    };

    const handleBack = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        alert(isEdit ? 'Campaign updated successfully!' : 'Campaign created successfully!');
        navigate('/campaigns');
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <Card className="max-w-2xl mx-auto">
                        <CardHeader>
                            <CardTitle>Basic Campaign Details</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-2">Campaign Name *</label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={(e) => updateField('name', e.target.value)}
                                    placeholder="Enter campaign name"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-2">Target Tenant *</label>
                                <Select
                                    required
                                    value={formData.tenant}
                                    onChange={(e) => handleTenantChange(e.target.value)}
                                >
                                    <option value="">Select a tenant</option>
                                    {mockTenants.map(t => (
                                        <option key={t.id} value={t.name}>{t.name}</option>
                                    ))}
                                </Select>
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
                );
            case 2:
                return (
                    <div className="space-y-6">
                        <div className="flex justify-between items-end">
                            <div>
                                <h1 className="text-3xl font-bold">Select Screens</h1>
                                <p className="text-[hsl(var(--color-text-muted))]">Choose the screens to your ad campaign.</p>
                            </div>
                            <div className="flex gap-1 p-1 bg-gray-100 rounded-lg">
                                <Button variant="ghost" size="sm" className="bg-white shadow-sm flex items-center gap-2">
                                    <List size={16} /> List
                                </Button>
                                <Button variant="ghost" size="sm" className="text-gray-500 flex items-center gap-2">
                                    <MapIcon size={16} /> Map
                                </Button>
                            </div>
                        </div>

                        {/* Filter Bar */}
                        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 pt-2">
                            <div className="relative col-span-2">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <Input
                                    placeholder="Search screens..."
                                    className="pl-10"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <Select value={filters.governorate} onChange={(e) => setFilters({ ...filters, governorate: e.target.value })}>
                                <option value="All">Governorate</option>
                                <option value="Capital">Capital</option>
                                <option value="Hawally">Hawally</option>
                                <option value="M.Kabeer">M.Kabeer</option>
                                <option value="Ahmadi">Ahmadi</option>
                                <option value="Jahara">Jahara</option>
                                <option value="Farwania">Farwania</option>
                            </Select>
                            <Select value={filters.gender} onChange={(e) => setFilters({ ...filters, gender: e.target.value })}>
                                <option value="All">Gender</option>
                                <option value="Male">Male 0%-30%</option>
                                <option value="Male">Male 30%-60%</option>
                                <option value="Male">Male 60%-100%</option>
                                <option value="Female">Female 0%-30%</option>
                                <option value="Female">Female 30%-60%</option>
                                <option value="Female">Female 60%-100%</option>
                            </Select>
                            <Select value={filters.age} onChange={(e) => setFilters({ ...filters, age: e.target.value })}>
                                <option value="All">Age</option>
                                <option value="Boomers (61-80)">Boomers (61-80):0%-30%</option>
                                <option value="Boomers (61-80)">Boomers (61-80):30%-60%</option>
                                <option value="Boomers (61-80)">Boomers (61-80):60%-100%</option>
                                <option value="GenX (45-60)">GenX (45-60):0%-30%</option>
                                <option value="GenX (45-60)">GenX (45-60):30%-60%</option>
                                <option value="GenX (45-60)">GenX (45-60):60%-100%</option>
                                <option value="Millennials (29 - 44)">Millennials (29 - 44):0%-30%</option>
                                <option value="Millennials (29 - 44)">Millennials (29 - 44):30%-60%</option>
                                <option value="Millennials (29 - 44)">Millennials (29 - 44):60%-100%</option>
                                <option value="Gen Z (Less Than 28)">Gen Z (Less Than 28):0%-30%</option>
                                <option value="Gen Z (Less Than 28)">Gen Z (Less Than 28):30%-60%</option>
                                <option value="Gen Z (Less Than 28)">Gen Z (Less Than 28):60%-100%</option>
                            </Select>
                            <Select value={filters.screenType} onChange={(e) => setFilters({ ...filters, screenType: e.target.value })}>
                                <option value="">Screen Types</option>
                                <option value="Outdoor">Outdoor</option>
                                <option value="Indoor">Indoor</option>
                            </Select>
                            <Select value={filters.screenType} onChange={(e) => setFilters({ ...filters, screenType: e.target.value })}>
                                <option value="All">Nationality</option>
                                <option value="Kuwaiti">Kuwaiti 0%-30%</option>
                                <option value="Kuwaiti">Kuwaiti 30%-60%</option>
                                <option value="Kuwaiti">Kuwaiti 60%-100%</option>
                                <option value="Arab">Arab 0%-30%</option>
                                <option value="Arab">Arab 30%-60%</option>
                                <option value="Arab">Arab 60%-100%</option>
                                <option value="Non Arab">Non Arab 0%-30%</option>
                                <option value="Non Arab">Non Arab 30%-60%</option>
                                <option value="Non Arab">Non Arab 60%-100%</option>
                            </Select>
                            
                        </div>

                        {/* Screen Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredScreens.map(screen => {
                                const isSelected = formData.screens.some(s => s.id === screen.id);
                                const segmentCount = formData.hourlySegments[screen.id]?.length || 0;
                                return (
                                    <Card key={screen.id} className={`overflow-hidden transition-all border-2 ${isSelected ? 'border-black' : 'border-transparent'}`}>
                                        <div className="p-5 space-y-4">
                                            <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-gray-50 border-gray-200 text-gray-500">
                                                {screen.type}
                                            </Badge>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">{screen.name}</h3>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">{screen.location}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-100">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase">Size</p>
                                                    <p className="text-sm font-medium">{screen.size?.width}ft x {screen.size?.height}ft</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase">Resolution</p>
                                                    <p className="text-sm font-medium">{screen.resolution?.width}×{screen.resolution?.height}</p>
                                                </div>
                                            </div>

                                            <div>
                                                <p className="text-[10px] text-gray-400 uppercase">Active Hourly Segments</p>
                                                <p className="text-sm font-medium">{segmentCount} / 24 hours</p>
                                            </div>

                                            <div className="flex justify-between items-center pt-2">
                                                <Link
                                                    to={`/inventory/${screen.id}`}
                                                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <Eye size={16} /> View Details
                                                </Link>
                                                <div className="flex items-center gap-3">
                                                    <span className="font-bold text-sm">50 KWD<span className="text-[10px] font-normal text-gray-400">/hr</span></span>
                                                    <Button
                                                        size="sm"
                                                        variant={isSelected ? "default" : "outline"}
                                                        className={`rounded-md h-8 px-4 ${isSelected ? "bg-black text-white hover:bg-gray-800" : "bg-white text-black border-black hover:bg-gray-50"}`}
                                                        onClick={() => toggleScreen(screen)}
                                                    >
                                                        {isSelected ? 'Selected' : 'Select'}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </Card>
                                );
                            })}
                        </div>
                    </div>
                );
            case 3:
                const currentScreen = formData.screens[selectedScreenIndex];
                const selectedSegments = formData.hourlySegments[currentScreen?.id] || [];

                return (
                    <div className="max-w-5xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                            {/* Sidebar */}
                            <div className="md:col-span-1 space-y-4">
                                <h3 className="text-sm font-bold">Your Screens ({formData.screens.length})</h3>
                                <div className="space-y-2">
                                    {formData.screens.map((screen, idx) => (
                                        <div
                                            key={screen.id}
                                            onClick={() => setSelectedScreenIndex(idx)}
                                            className={`p-4 border rounded-lg cursor-pointer transition-all ${selectedScreenIndex === idx
                                                ? 'border-black shadow-sm bg-white'
                                                : 'border-transparent bg-gray-50/50 hover:bg-gray-50 text-gray-400'
                                                }`}
                                        >
                                            <p className="text-xs font-bold leading-tight truncate">{screen.name}</p>
                                            <p className="text-[10px] mt-1">
                                                {formData.hourlySegments[screen.id]?.length > 0
                                                    ? `${formData.hourlySegments[screen.id].length} segments`
                                                    : 'None selected'}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="md:col-span-3 space-y-6">
                                <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
                                    <div>
                                        <h2 className="text-2xl font-bold">Scheduling & Segments</h2>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Review and adjust the hourly segments for each selected screen.</p>
                                    </div>

                                    {currentScreen && (
                                        <div className="py-4 border-t border-b border-gray-100">
                                            <h3 className="text-xl font-bold">{currentScreen.name}</h3>
                                            <p className="text-sm text-gray-500">{currentScreen.location} • {currentScreen.type}</p>
                                        </div>
                                    )}

                                    <div className="p-6 bg-gray-50/50 border border-gray-100 rounded-xl space-y-6">
                                        <div>
                                            <h4 className="font-bold">Select Hourly Segments</h4>
                                            <p className="text-xs text-gray-500">Choose the hours you want your ad to run. Each segment allows one 10s ad every 180s.</p>
                                        </div>

                                        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                                            {HOURLY_SEGMENTS.map(segment => {
                                                const isSelected = selectedSegments.includes(segment);
                                                return (
                                                    <Button
                                                        key={segment}
                                                        variant="outline"
                                                        className={`h-11 font-medium text-xs transition-all border-gray-200 ${isSelected
                                                            ? 'bg-black text-white border-black hover:bg-gray-800'
                                                            : 'bg-white hover:border-gray-400'
                                                            }`}
                                                        onClick={() => toggleSegment(currentScreen.id, segment)}
                                                    >
                                                        {segment}
                                                    </Button>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    <div className="flex justify-center gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            disabled={selectedScreenIndex === 0}
                                            onClick={() => setSelectedScreenIndex(prev => prev - 1)}
                                            className="px-8 border-gray-200 font-bold"
                                        >
                                            Previous Screen
                                        </Button>
                                        <Button
                                            variant="outline"
                                            disabled={selectedScreenIndex === formData.screens.length - 1}
                                            onClick={() => setSelectedScreenIndex(prev => prev + 1)}
                                            className="px-8 border-gray-200 font-bold"
                                        >
                                            Next Screen
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            case 4:
                return (
                    <Card className="max-w-3xl mx-auto">
                        <CardHeader>
                            <CardTitle>Pricing Breakdown</CardTitle>
                        </CardHeader>
                        <div className="space-y-6">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Screen / Time Segments</TableHead>
                                        <TableHead className="text-right">Price per Hour</TableHead>
                                        <TableHead className="text-right">Total Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Object.entries(formData.hourlySegments).map(([screenId, segments]) => {
                                        if (segments.length === 0) return null;
                                        const screen = mockScreens.find(s => s.id === screenId);
                                        const start = new Date(formData.startDate);
                                        const end = new Date(formData.endDate);
                                        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
                                        const totalPrice = segments.length * 50 * diffDays;

                                        return (
                                            <TableRow key={screenId}>
                                                <TableCell>
                                                    <p className="font-medium">{screen?.name}</p>
                                                    <p className="text-xs text-[hsl(var(--color-text-muted))]">{segments.length} segments selected</p>
                                                </TableCell>
                                                <TableCell className="text-right">50 KWD</TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatCurrency(totalPrice)}
                                                </TableCell>
                                            </TableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>

                            <div className="pt-6 border-t flex justify-between items-center">
                                <div>
                                    <p className="text-sm text-[hsl(var(--color-text-muted))]">Estimated Total Price</p>
                                    <p className="text-4xl font-bold text-[hsl(var(--color-primary))]">{formatCurrency(formData.estimatedPrice)}</p>
                                </div>
                                <div className="text-right text-sm text-[hsl(var(--color-text-muted))]">
                                    <p>{formData.startDate} to {formData.endDate}</p>
                                    <p>{Math.ceil(Math.abs(new Date(formData.endDate) - new Date(formData.startDate)) / (1000 * 60 * 60 * 24)) + 1} days campaign</p>
                                </div>
                            </div>
                        </div>
                    </Card>
                );
            case 5:
                const uploadScreen = formData.screens[selectedScreenIndex];
                const screenMedia = formData.media.filter(m => m.screenId === uploadScreen?.id);

                return (
                    <div className="max-w-[1100px] mx-auto">
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold tracking-tight">Media Upload</h2>
                            <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1 font-medium">
                                Upload creative assets for each screen. You can add multiple assets per location.
                            </p>
                        </div>

                        <Card className="min-h-[500px] overflow-hidden">
                            <div className="flex h-full min-h-[500px]">
                                {/* Sidebar */}
                                <div className="w-[280px] border-r border-gray-100 bg-gray-50/30 p-4 space-y-2">
                                    {formData.screens.map((screen, idx) => (
                                        <div
                                            key={screen.id}
                                            onClick={() => setSelectedScreenIndex(idx)}
                                            className={`p-4 rounded-xl cursor-pointer transition-all border ${selectedScreenIndex === idx
                                                ? 'bg-white border-gray-200 shadow-sm'
                                                : 'border-transparent text-gray-400 hover:text-gray-600'
                                                }`}
                                        >
                                            <p className={`text-sm font-bold ${selectedScreenIndex === idx ? 'text-black' : ''}`}>
                                                {screen.name}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Upload Area */}
                                <div className="flex-1 p-10 flex flex-col">
                                    {uploadScreen && (
                                        <div className="space-y-8 flex-1">
                                            <div>
                                                <h3 className="text-2xl font-bold">{uploadScreen.name}</h3>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    Required: {uploadScreen.resolution?.width}×{uploadScreen.resolution?.height} • {uploadScreen.size?.width} inch
                                                </p>
                                            </div>

                                            {/* Dotted Upload Zone */}
                                            <div className="relative border-2 border-dashed border-gray-100 rounded-2xl flex flex-center h-48 group hover:border-gray-200 transition-colors bg-white">
                                                <div className="flex flex-col items-center gap-4 py-10 w-full">
                                                    <div className="flex items-center gap-6">
                                                        <div className="bg-gray-50 rounded-md border border-gray-200 px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm">
                                                            Choose Files
                                                        </div>
                                                        <span className="text-xs text-gray-400">No file chosen</span>
                                                    </div>

                                                    <div className="flex items-center gap-3 text-gray-400">
                                                        <Upload size={24} className="stroke-[1.5]" />
                                                        <span className="text-lg font-medium">Click or drag to add media files</span>
                                                    </div>
                                                </div>
                                                <input
                                                    type="file"
                                                    multiple
                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                    onChange={handleAddMedia}
                                                />
                                            </div>

                                            {/* Preview of current screen media */}
                                            {screenMedia.length > 0 && (
                                                <div className="grid grid-cols-3 gap-4 mt-6">
                                                    {screenMedia.map((item, idx) => (
                                                        <div key={idx} className="relative group rounded-lg overflow-hidden border bg-black aspect-video">
                                                            {item.type === 'video' ? (
                                                                <video src={item.url} className="w-full h-full object-cover" muted />
                                                            ) : (
                                                                <img src={item.url} className="w-full h-full object-cover" alt="" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1.5px]">
                                                                {/* Close/Remove Button (X) */}
                                                                <button
                                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-lg z-20 transform scale-90 group-hover:scale-100"
                                                                    onClick={() => handleRemoveMedia(item.id)}
                                                                >
                                                                    <X size={16} />
                                                                </button>

                                                                {/* Replace Action */}
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-white text-black hover:bg-gray-100 font-bold px-4 py-2 rounded-lg flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-all shadow-xl"
                                                                        onClick={() => handleReplaceMedia(item.id)}
                                                                    >
                                                                        <Upload size={14} /> Replace
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    )}

                                    {/* Regulatory Note */}
                                    <div className="mt-auto pt-10 flex items-center gap-3 text-gray-400">
                                        <Info size={18} className="stroke-[1.5]" />
                                        <p className="text-sm font-medium">Content must comply with local advertising regulations.</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                );
            case 6:
                return (
                    <div className="space-y-6 max-w-4xl mx-auto">
                        <Card>
                            <CardHeader>
                                <CardTitle>Campaign Summary</CardTitle>
                            </CardHeader>
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Info className="text-[hsl(var(--color-text-muted))] mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">Campaign Name</p>
                                                <p className="font-bold text-lg">{formData.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <Building2 className="text-[hsl(var(--color-text-muted))] mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">Tenant</p>
                                                <p className="font-semibold">{formData.tenant}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start gap-3">
                                            <Calendar className="text-[hsl(var(--color-text-muted))] mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">Duration</p>
                                                <p className="font-semibold">{formData.startDate} to {formData.endDate}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <DollarSign className="text-[hsl(var(--color-text-muted))] mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">Estimated Price</p>
                                                <p className="font-bold text-xl text-[hsl(var(--color-primary))]">{formatCurrency(formData.estimatedPrice)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="pt-6 border-t">
                                    <p className="text-sm font-bold mb-4">Selected Screens & Segments</p>
                                    <div className="space-y-3">
                                        {formData.screens.map(screen => (
                                            <div key={screen.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                                <div>
                                                    <p className="font-medium text-sm">{screen.name}</p>
                                                    <div className="flex flex-wrap gap-1 mt-1">
                                                        {formData.hourlySegments[screen.id]?.map(segment => (
                                                            <Badge key={segment} variant="outline" className="text-[9px] bg-white">
                                                                {segment}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                                <p className="text-[10px] text-gray-400">{screen.location}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg flex gap-3 items-start">
                            <Info className="text-blue-600 mt-0.5" size={20} />
                            <p className="text-sm text-blue-800">
                                Review all the details carefully. Once submitted, the campaign will be booked and prepared for airing according to the configured schedule.
                            </p>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="space-y-8 max-w-[1200px] mx-auto pb-24 pt-4 px-6">
            {/* Nav Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/dashboard')} className="text-gray-500 hover:text-black">
                        <ChevronLeft size={20} className="mr-1" /> Back to Dashboard
                    </Button>
                </div>

                {/* Progress Indicators */}
                <div className="flex items-center gap-2">
                    {STEPS.map((step, idx) => {
                        const isCompleted = currentStep > step.id;
                        const isActive = currentStep === step.id;
                        return (
                            <React.Fragment key={step.id}>
                                <div className="flex items-center gap-2">
                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isCompleted ? 'bg-green-600 text-white' :
                                        isActive ? 'bg-black text-white' :
                                            'border-2 border-gray-100 text-gray-300'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 size={16} /> : step.id}
                                    </div>
                                    <span className={`text-sm font-medium ${isActive ? 'text-black' : 'text-gray-300'}`}>
                                        {step.title}
                                    </span>
                                </div>
                                {idx < STEPS.length - 1 && (
                                    <div className="w-6 h-px bg-gray-100 mx-2" />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            {/* Content area */}
            <div className="min-h-[60vh]">
                {renderStepContent()}
            </div>

            {/* Footer Navigation */}
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4 z-50 flex justify-center">
                <div className="w-full max-w-[1200px] flex justify-between items-center px-6">
                    <Button
                        variant="outline"
                        onClick={handleBack}
                        disabled={currentStep === 1}
                        className="border-gray-200 rounded-lg px-8 font-bold"
                    >
                        <ChevronLeft size={18} className="mr-2" /> Back
                    </Button>

                    {currentStep === 6 ? (
                        <Button
                            className="bg-black text-white hover:bg-gray-800 rounded-lg px-8 font-bold"
                            onClick={handleSubmit}
                        >
                            Launch Campaign
                        </Button>
                    ) : (
                        <Button
                            className="bg-black text-white hover:bg-gray-800 rounded-lg px-8 font-bold"
                            onClick={handleNext}
                            disabled={
                                (currentStep === 1 && (!formData.name || !formData.tenant)) ||
                                (currentStep === 2 && formData.screens.length === 0) ||
                                (currentStep === 3 && Object.keys(formData.hourlySegments).length === 0)
                            }
                        >
                            {currentStep === 3 ? 'Calculate Pricing' : currentStep === 5 ? 'Review Campaign' : 'Next Step'} <ChevronRight size={18} className="ml-2" />
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
