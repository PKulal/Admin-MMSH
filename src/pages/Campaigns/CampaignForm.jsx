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
    X,
    Sun,
    Moon,
    Zap,
    Plus,
    Users
} from 'lucide-react';
import { mockCampaigns, mockTenants, mockScreens } from '../../data/mockData';
import { mockPricing } from '../../data/mockPricing';
import { mockContracts } from '../../data/mockContracts';

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

const PEAK_HOURS = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];
const NON_PEAK_HOURS = HOURLY_SEGMENTS.filter(h => !PEAK_HOURS.includes(h));

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
        governorate: 'All',
        screenType: 'All',
        genderType: 'All',
        genderMin: 0,
        ageType: 'All',
        ageMin: 0,
        nationalityType: 'All',
        nationalityMin: 0
    });

    const [formData, setFormData] = useState({
        name: existingCampaign?.name || '',
        tenant: existingCampaign?.tenant || '',
        tenantId: existingCampaign?.tenantId || '',
        startDate: existingCampaign?.startDate || '',
        endDate: existingCampaign?.endDate || '',
        bookings: existingCampaign?.screens?.map((s, idx) => ({
            id: `BOOK-${Date.now()}-${idx}`,
            screenId: s.id,
            screenName: s.name,
            location: s.location,
            type: s.type,
            startDate: existingCampaign.startDate,
            endDate: existingCampaign.endDate,
            quantity: s.bookedQuantity || 1,
            segments: existingCampaign.slots
                ?.filter(slot => slot.screenId === s.id)
                ?.map(slot => slot.startTime || (slot.timeSlot ? slot.timeSlot.split('-')[0] : null))
                ?.filter(Boolean) || []
        })) || [],
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

    const addBooking = (screen) => {
        const newBooking = {
            id: `BOOK-${Date.now()}`,
            screenId: screen.id,
            screenName: screen.name,
            location: screen.location,
            type: screen.type,
            resolution: screen.resolution,
            size: screen.size,
            startDate: formData.startDate,
            endDate: formData.endDate,
            quantity: 1,
            segments: []
        };
        setFormData(prev => ({
            ...prev,
            bookings: [...prev.bookings, newBooking]
        }));
    };

    const removeBooking = (bookingId) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.filter(b => b.id !== bookingId)
        }));
    };

    const updateBooking = (bookingId, updates) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, ...updates } : b)
        }));
    };

    const toggleSegment = (bookingId, segment) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => {
                if (b.id !== bookingId) return b;
                const isSelected = b.segments.includes(segment);
                return {
                    ...b,
                    segments: isSelected
                        ? b.segments.filter(s => s !== segment)
                        : [...b.segments, segment]
                };
            })
        }));
    };

    const toggleAllSegments = (bookingId) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, segments: [...HOURLY_SEGMENTS] } : b)
        }));
    };

    const togglePeakSegments = (bookingId) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, segments: [...PEAK_HOURS] } : b)
        }));
    };

    const toggleNonPeakSegments = (bookingId) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, segments: [...NON_PEAK_HOURS] } : b)
        }));
    };

    const clearSegments = (bookingId) => {
        setFormData(prev => ({
            ...prev,
            bookings: prev.bookings.map(b => b.id === bookingId ? { ...b, segments: [] } : b)
        }));
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
        const currentBooking = formData.bookings[selectedScreenIndex];
        const newMedia = {
            id: `MEDIA-${Date.now()}`,
            bookingId: currentBooking?.id,
            screenId: currentBooking?.screenId,
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
            const matchesSearch = !searchTerm ||
                screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                screen.location.toLowerCase().includes(searchTerm.toLowerCase());

            const matchesType = filters.screenType === 'All' || screen.type.toLowerCase() === filters.screenType.toLowerCase();
            const matchesGovernorate = filters.governorate === 'All' || screen.governorate === filters.governorate;

            // Demographic Matching
            const matchesGender = filters.genderType === 'All' ||
                (screen.demographics?.gender?.[filters.genderType.toLowerCase()] || 0) >= filters.genderMin;

            const matchesAge = filters.ageType === 'All' ||
                (screen.demographics?.ageGroup?.[filters.ageType] || 0) >= filters.ageMin;

            const matchesNationality = filters.nationalityType === 'All' ||
                (screen.demographics?.nationality?.[filters.nationalityType] || 0) >= filters.nationalityMin;

            return matchesSearch && matchesType && matchesGovernorate && matchesGender && matchesAge && matchesNationality;
        });
    }, [searchTerm, filters]);

    const calculatePrice = useMemo(() => {
        let total = 0;

        // Find active contract for this tenant and date range
        const activeContract = mockContracts.find(c =>
            c.tenantName === formData.tenant &&
            c.status === 'active' &&
            new Date(formData.startDate) >= new Date(c.startDate) &&
            new Date(formData.endDate) <= new Date(c.endDate)
        );

        formData.bookings.forEach(booking => {
            const start = new Date(booking.startDate || formData.startDate);
            const end = new Date(booking.endDate || formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = (isNaN(diffTime) ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;

            booking.segments.forEach(segment => {
                let pricePerHour = 50; // Fallback

                // Check if contract applies to this screen
                const contractApplies = activeContract && (
                    activeContract.screenSubset === 'all' ||
                    (activeContract.screens && activeContract.screens.includes(booking.screenId))
                );

                if (contractApplies && activeContract.pricingType === 'fixed') {
                    pricePerHour = activeContract.pricingValue;
                } else {
                    const pricingRule = mockPricing.find(p => p.screenId === booking.screenId && p.slotTime?.startsWith(segment.split(':')[0]));
                    pricePerHour = pricingRule?.pricePerDay ? pricingRule.pricePerDay / 4 : 50;

                    // Apply discount if contract is discount-based
                    if (contractApplies && activeContract.pricingType === 'discount') {
                        pricePerHour = pricePerHour * (1 - (activeContract.pricingValue / 100));
                    }
                }

                total += pricePerHour * diffDays * (booking.quantity || 1);
            });
        });
        return total;
    }, [formData.bookings, formData.startDate, formData.endDate, formData.tenant]);

    const calculateImpressions = useMemo(() => {
        let total = 0;
        formData.bookings.forEach(booking => {
            const screen = mockScreens.find(s => s.id === booking.screenId);
            if (!screen) return;

            const start = new Date(booking.startDate || formData.startDate);
            const end = new Date(booking.endDate || formData.endDate);
            const diffTime = Math.abs(end - start);
            const diffDays = (isNaN(diffTime) ? 0 : Math.ceil(diffTime / (1000 * 60 * 60 * 24))) + 1;

            // Simple calculation: (imp2Weeks / 14) * days * (hours selected / 24) * qty
            const dailyRate = (screen.imp2Weeks || 0) / 14;
            const hourWeight = (booking.segments?.length || 0) / 24;
            const subtotal = dailyRate * diffDays * hourWeight * (booking.quantity || 1);
            if (!isNaN(subtotal)) total += subtotal;
        });
        return Math.round(total);
    }, [formData.bookings, formData.startDate, formData.endDate]);

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
                        <div className="space-y-4 pt-2">
                            {/* Row 1: Basic Filters */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                <div className="relative col-span-2">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                    <Input
                                        placeholder="Search screens by name or location..."
                                        className="pl-10 h-10"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                    />
                                </div>
                                <Select value={filters.governorate} onChange={(e) => setFilters({ ...filters, governorate: e.target.value })} className="h-10">
                                    <option value="All">All Governorates</option>
                                    <option value="Capital">Capital</option>
                                    <option value="Hawally">Hawally</option>
                                    <option value="M.Kabeer">M.Kabeer</option>
                                    <option value="Ahmadi">Ahmadi</option>
                                    <option value="Jahara">Jahara</option>
                                    <option value="Farwania">Farwania</option>
                                </Select>
                                <Select value={filters.screenType} onChange={(e) => setFilters({ ...filters, screenType: e.target.value })} className="h-10">
                                    <option value="All">All Screen Types</option>
                                    <option value="Outdoor">Outdoor</option>
                                    <option value="Indoor">Indoor</option>
                                </Select>
                            </div>

                            {/* Row 2: Demographic Sliders */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100">
                                {/* Gender Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Gender Targeting</label>
                                        <span className="text-[10px] font-bold text-blue-600">{filters.genderMin}% Min</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Select
                                            value={filters.genderType}
                                            onChange={(e) => setFilters({ ...filters, genderType: e.target.value, genderMin: e.target.value === 'All' ? 0 : filters.genderMin })}
                                            className="h-8 text-[11px] w-[100px]"
                                        >
                                            <option value="All">All Genders</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </Select>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            disabled={filters.genderType === 'All'}
                                            value={filters.genderMin}
                                            onChange={(e) => setFilters({ ...filters, genderMin: parseInt(e.target.value) })}
                                            className="h-8 flex-1 accent-black"
                                        />
                                    </div>
                                </div>

                                {/* Age Slider */}
                                <div className="space-y-2 border-x border-gray-100 px-6">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Age Group</label>
                                        <span className="text-[10px] font-bold text-blue-600">{filters.ageMin}% Min</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Select
                                            value={filters.ageType}
                                            onChange={(e) => setFilters({ ...filters, ageType: e.target.value, ageMin: e.target.value === 'All' ? 0 : filters.ageMin })}
                                            className="h-8 text-[11px] w-[120px]"
                                        >
                                            <option value="All">All Ages</option>
                                            <option value="boomers">Boomers (61-80)</option>
                                            <option value="genX">GenX (45-60)</option>
                                            <option value="millennials">Millennials (29-44)</option>
                                            <option value="genZ">Gen Z ({"<"}28)</option>
                                        </Select>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            disabled={filters.ageType === 'All'}
                                            value={filters.ageMin}
                                            onChange={(e) => setFilters({ ...filters, ageMin: parseInt(e.target.value) })}
                                            className="h-8 flex-1 accent-black"
                                        />
                                    </div>
                                </div>

                                {/* Nationality Slider */}
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center">
                                        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Nationality</label>
                                        <span className="text-[10px] font-bold text-blue-600">{filters.nationalityMin}% Min</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <Select
                                            value={filters.nationalityType}
                                            onChange={(e) => setFilters({ ...filters, nationalityType: e.target.value, nationalityMin: e.target.value === 'All' ? 0 : filters.nationalityMin })}
                                            className="h-8 text-[11px] w-[120px]"
                                        >
                                            <option value="All">All Nationalities</option>
                                            <option value="kuwaiti">Kuwaiti</option>
                                            <option value="arab">Arab</option>
                                            <option value="nonArab">Non-Arab</option>
                                        </Select>
                                        <Input
                                            type="range"
                                            min="0"
                                            max="100"
                                            step="5"
                                            disabled={filters.nationalityType === 'All'}
                                            value={filters.nationalityMin}
                                            onChange={(e) => setFilters({ ...filters, nationalityMin: parseInt(e.target.value) })}
                                            className="h-8 flex-1 accent-black"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Screen Cards Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredScreens.map(screen => {
                                const screenBookingsCount = formData.bookings.filter(b => b.screenId === screen.id).length;
                                const isSelected = screenBookingsCount > 0;
                                const totalReserved = formData.bookings
                                    .filter(b => b.screenId === screen.id)
                                    .reduce((sum, b) => sum + (b.quantity || 1), 0);
                                const availableQty = (screen.screenQuantity || 1) - totalReserved;

                                return (
                                    <Card key={screen.id} className={`overflow-hidden transition-all border-2 ${isSelected ? 'border-primary' : 'border-transparent'}`}>
                                        <div className="p-5 space-y-4">
                                            <div className="flex justify-between items-start">
                                                <Badge variant="outline" className="text-[10px] uppercase tracking-wider bg-gray-50 border-gray-200 text-gray-500">
                                                    {screen.type}
                                                </Badge>
                                                <div className="flex gap-2">
                                                    <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100">
                                                        Available: {availableQty}/{screen.screenQuantity || 1}
                                                    </Badge>
                                                    {isSelected && (
                                                        <Badge className="bg-black text-white text-[10px]">
                                                            {screenBookingsCount} {screenBookingsCount === 1 ? 'Booking' : 'Bookings'}
                                                        </Badge>
                                                    )}
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-lg leading-tight">{screen.name}</h3>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">{screen.location}</p>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-gray-100">
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase">Size</p>
                                                    <p className="text-sm font-medium">{screen.size?.width}m x {screen.size?.height}m</p>
                                                </div>
                                                <div>
                                                    <p className="text-[10px] text-gray-400 uppercase">Resolution</p>
                                                    <p className="text-sm font-medium">{screen.resolution?.width}×{screen.resolution?.height}</p>
                                                </div>
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
                                                        className={`rounded-md h-8 px-4 transition-all ${isSelected ? 'bg-black text-white hover:bg-gray-800' : 'border-gray-200 hover:border-black'}`}
                                                        onClick={() => addBooking(screen)}
                                                        disabled={availableQty <= 0}
                                                    >
                                                        {availableQty <= 0 ? 'Fully Booked' : (isSelected ? 'Add Booking' : 'Select Screen')}
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
            case 3: {
                const currentBooking = formData.bookings[selectedScreenIndex];
                const selectedSegments = currentBooking?.segments || [];

                return (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            {/* Bookings Sidebar */}
                            <div className="md:col-span-1 space-y-4">
                                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Bookings ({formData.bookings.length})</h4>
                                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
                                        {formData.bookings.map((booking, index) => (
                                            <div
                                                key={booking.id}
                                                onClick={() => setSelectedScreenIndex(index)}
                                                className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedScreenIndex === index
                                                    ? 'border-black bg-white shadow-sm ring-1 ring-black text-black'
                                                    : 'border-transparent bg-gray-50/50 hover:bg-gray-50 text-gray-400'
                                                    }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <p className="text-xs font-bold leading-tight truncate">{booking.screenName}</p>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-6 w-6 p-0 text-gray-300 hover:text-red-500"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            removeBooking(booking.id);
                                                            if (selectedScreenIndex >= index && selectedScreenIndex > 0) setSelectedScreenIndex(prev => prev - 1);
                                                        }}
                                                    >
                                                        <Trash2 size={12} />
                                                    </Button>
                                                </div>
                                                <p className="text-[10px] mt-1 font-medium">
                                                    {booking.startDate ? new Date(booking.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Set Date'} - {booking.endDate ? new Date(booking.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : 'Set Date'}
                                                </p>
                                                <p className="text-[10px]">
                                                    {booking.segments.length > 0
                                                        ? `${booking.segments.length} segments`
                                                        : 'None selected'}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                    <Button
                                        variant="outline"
                                        className="w-full mt-4 text-xs h-9 border-dashed"
                                        onClick={() => setCurrentStep(2)}
                                    >
                                        <Plus size={14} className="mr-2" /> Add More
                                    </Button>
                                </div>
                            </div>

                            {/* Main Grid */}
                            <div className="md:col-span-3 space-y-6">
                                <div className="bg-white p-6 border rounded-2xl shadow-sm space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h2 className="text-2xl font-bold">Scheduling & Segments</h2>
                                            <p className="text-sm text-[hsl(var(--color-text-muted))]">Define specific dates and hours for this booking.</p>
                                        </div>
                                        <Badge variant="outline" className="bg-gray-50">
                                            Booking #{selectedScreenIndex + 1}
                                        </Badge>
                                    </div>

                                    {currentBooking && (
                                        <div className="space-y-6">
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                        <Monitor size={16} /> Screen Details
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold">{currentBooking.screenName}</p>
                                                        <p className="text-xs text-gray-500">{currentBooking.location} • {currentBooking.type}</p>
                                                    </div>
                                                </div>
                                                <div className="space-y-4">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-gray-700">
                                                        <Calendar size={16} /> Booking Dates
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex-1">
                                                            <p className="text-[10px] text-gray-400 uppercase mb-1">From</p>
                                                            <Input
                                                                type="date"
                                                                className="h-9 text-xs"
                                                                min={formData.startDate}
                                                                max={formData.endDate}
                                                                value={currentBooking.startDate}
                                                                onChange={(e) => updateBooking(currentBooking.id, { startDate: e.target.value })}
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <p className="text-[10px] text-gray-400 uppercase mb-1">To</p>
                                                            <Input
                                                                type="date"
                                                                className="h-9 text-xs"
                                                                min={currentBooking.startDate || formData.startDate}
                                                                max={formData.endDate}
                                                                value={currentBooking.endDate}
                                                                onChange={(e) => updateBooking(currentBooking.id, { endDate: e.target.value })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-8 bg-white border border-gray-100 rounded-3xl shadow-sm space-y-8">
                                                <div className="flex justify-between items-end">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl font-bold text-gray-900">Select Hourly Segments</h4>
                                                        <p className="text-sm text-gray-500">Choose the hours for this specific booking period.</p>
                                                    </div>
                                                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                            className="text-[10px] h-7 px-2"
                                                            onClick={() => togglePeakSegments(currentBooking.id)}
                                                        > Peak </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                            className="text-[10px] h-7 px-2"
                                                            onClick={() => toggleNonPeakSegments(currentBooking.id)}
                                                        > Non-Peak </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                            className="text-[10px] h-7 px-2"
                                                            onClick={() => toggleAllSegments(currentBooking.id)}
                                                        > All </Button>
                                                        <Button
                                                            size="xs"
                                                            variant="outline"
                                                            className="text-[10px] h-7 px-2 text-red-500 hover:bg-red-50"
                                                            onClick={() => clearSegments(currentBooking.id)}
                                                        > Clear </Button>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
                                                    {HOURLY_SEGMENTS.map(segment => {
                                                        const isSelected = selectedSegments.includes(segment);
                                                        return (
                                                            <Button
                                                                key={segment}
                                                                variant="outline"
                                                                className={`h-10 text-xs font-bold rounded-lg transition-all border-gray-200 ${isSelected
                                                                    ? 'border-black bg-white shadow-sm ring-1 ring-black'
                                                                    : 'bg-white hover:border-gray-400 opacity-80'
                                                                    }`}
                                                                onClick={() => toggleSegment(currentBooking.id, segment)}
                                                            >
                                                                {segment}
                                                            </Button>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-center gap-4 pt-4">
                                        <Button
                                            variant="outline"
                                            disabled={selectedScreenIndex === 0}
                                            onClick={() => setSelectedScreenIndex(prev => prev - 1)}
                                            className="px-8 border-gray-200 font-bold"
                                        >
                                            Previous Booking
                                        </Button>
                                        <Button
                                            variant="outline"
                                            disabled={selectedScreenIndex === formData.bookings.length - 1}
                                            onClick={() => setSelectedScreenIndex(prev => prev + 1)}
                                            className="px-8 border-gray-200 font-bold"
                                        >
                                            Next Booking
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );
            }
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
                                        <TableHead className="text-right">Quantity</TableHead>
                                        <TableHead className="text-right">Price per Hour</TableHead>
                                        <TableHead className="text-right">Total Price</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {formData.bookings.map((booking) => {
                                        if (booking.segments.length === 0) return null;

                                        const start = new Date(booking.startDate || formData.startDate);
                                        const end = new Date(booking.endDate || formData.endDate);
                                        const diffDays = Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1;
                                        const qty = booking.quantity || 1;

                                        // Contract check for UI
                                        const activeContract = mockContracts.find(c =>
                                            c.tenantName === formData.tenant &&
                                            c.status === 'active' &&
                                            new Date(formData.startDate) >= new Date(c.startDate) &&
                                            new Date(formData.endDate) <= new Date(c.endDate)
                                        );
                                        const contractApplies = activeContract && (
                                            activeContract.screenSubset === 'all' ||
                                            (activeContract.screens && activeContract.screens.includes(booking.screenId))
                                        );

                                        let pricePerHour = 50;
                                        let originalPrice = 50;

                                        if (contractApplies && activeContract.pricingType === 'fixed') {
                                            pricePerHour = activeContract.pricingValue;
                                        } else {
                                            const pricingRule = mockPricing.find(p => p.screenId === booking.screenId && p.slotTime?.startsWith(booking.segments[0]?.split(':')[0]));
                                            originalPrice = pricingRule?.pricePerDay ? pricingRule.pricePerDay / 4 : 50;
                                            pricePerHour = originalPrice;
                                            if (contractApplies && activeContract.pricingType === 'discount') {
                                                pricePerHour = originalPrice * (1 - (activeContract.pricingValue / 100));
                                            }
                                        }

                                        const totalPrice = booking.segments.length * pricePerHour * diffDays * qty;

                                        return (
                                            <TableRow key={booking.id}>
                                                <TableCell>
                                                    <p className="font-medium">{booking.screenName}</p>
                                                    <p className="text-[10px] text-gray-500">
                                                        {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                    </p>
                                                    <p className="text-xs text-[hsl(var(--color-text-muted))]">{booking.segments.length} segments</p>
                                                </TableCell>
                                                <TableCell className="text-right font-medium">{qty}</TableCell>
                                                <TableCell className="text-right">
                                                    {contractApplies ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-xs line-through text-gray-400">{originalPrice} KWD</span>
                                                            <span className="text-blue-600 font-bold">{pricePerHour} KWD</span>
                                                        </div>
                                                    ) : (
                                                        <span>{pricePerHour} KWD</span>
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right font-semibold">
                                                    {formatCurrency(totalPrice)}
                                                    {contractApplies && (
                                                        <p className={`text-[10px] font-bold ${activeContract.pricingType === 'fixed' ? 'text-indigo-500' : 'text-blue-500'}`}>
                                                            {activeContract.pricingType === 'fixed' ? 'Fixed Price' : `${activeContract.pricingValue}% Off`}
                                                        </p>
                                                    )}
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
            case 5: {
                const uploadBooking = formData.bookings[selectedScreenIndex];
                const bookingMedia = formData.media.filter(m => m.bookingId === uploadBooking?.id);

                return (
                    <div className="max-w-[1100px] mx-auto">
                        <div className="mb-6">
                            <h2 className="text-3xl font-extrabold tracking-tight">Media Upload</h2>
                            <p className="text-sm text-[hsl(var(--color-text-muted))] mt-1 font-medium">
                                Upload creative assets for each booking. Each booking entry can have its own media.
                            </p>
                        </div>

                        <Card className="min-h-[500px] overflow-hidden">
                            <div className="flex h-full min-h-[500px]">
                                {/* Sidebar */}
                                <div className="w-[300px] border-r border-gray-100 bg-gray-50/30 p-4 space-y-2 overflow-y-auto">
                                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 mb-2">Select Booking</h4>
                                    {formData.bookings.map((booking, idx) => (
                                        <div
                                            key={booking.id}
                                            onClick={() => setSelectedScreenIndex(idx)}
                                            className={`p-3 rounded-xl cursor-pointer transition-all border ${selectedScreenIndex === idx
                                                ? 'bg-white border-black shadow-sm'
                                                : 'border-transparent text-gray-400 hover:bg-gray-50'
                                                }`}
                                        >
                                            <p className={`text-xs font-bold ${selectedScreenIndex === idx ? 'text-black' : ''} truncate`}>
                                                {booking.screenName}
                                            </p>
                                            <p className="text-[9px] mt-0.5">
                                                {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                            </p>
                                            <div className="flex items-center gap-1 mt-1">
                                                <Badge className="text-[8px] h-3.5 px-1 bg-gray-100 text-gray-500">
                                                    {formData.media.filter(m => m.bookingId === booking.id).length} files
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Main Area */}
                                <div className="flex-1 p-10 flex flex-col">
                                    {uploadBooking && (
                                        <div className="space-y-8 flex-1">
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <Badge variant="outline" className="bg-blue-50 text-blue-600 text-[10px]">Booking #{selectedScreenIndex + 1}</Badge>
                                                    <h3 className="text-2xl font-bold">{uploadBooking.screenName}</h3>
                                                </div>
                                                <p className="text-sm text-gray-500 font-medium">
                                                    Required: {uploadBooking.resolution?.width}×{uploadBooking.resolution?.height} • {uploadBooking.size?.width} m
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

                                            {/* Preview of current booking media */}
                                            {bookingMedia.length > 0 && (
                                                <div className="grid grid-cols-3 gap-4 mt-6">
                                                    {bookingMedia.map((item, idx) => (
                                                        <div key={idx} className="relative group rounded-lg overflow-hidden border bg-black aspect-video">
                                                            {item.type === 'video' ? (
                                                                <video src={item.url} className="w-full h-full object-cover" muted />
                                                            ) : (
                                                                <img src={item.url} className="w-full h-full object-cover" alt="" />
                                                            )}
                                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[1.5px]">
                                                                <button
                                                                    className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-600 text-white flex items-center justify-center hover:bg-red-700 transition-all shadow-lg z-20"
                                                                    onClick={() => handleRemoveMedia(item.id)}
                                                                >
                                                                    <X size={16} />
                                                                </button>
                                                                <div className="absolute inset-0 flex items-center justify-center">
                                                                    <Button
                                                                        size="sm"
                                                                        className="bg-white text-black hover:bg-gray-100 font-bold px-4 py-2 rounded-lg flex items-center gap-2"
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
            }
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
                                            <Users className="text-blue-600 mt-1" size={20} />
                                            <div>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">Total Impressions</p>
                                                <p className="font-bold text-xl">{calculateImpressions.toLocaleString()}</p>
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
                                    <p className="text-sm font-bold mb-4">Bookings Summary</p>
                                    <div className="space-y-3">
                                        {formData.bookings.map((booking, idx) => (
                                            <div key={booking.id} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <div className="flex justify-between items-start mb-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-[10px] font-bold text-gray-400 uppercase">Booking #{idx + 1}</span>
                                                            <p className="font-bold text-sm">{booking.screenName}</p>
                                                        </div>
                                                        <p className="text-[10px] text-gray-500 font-medium">
                                                            {new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="text-right">
                                                        <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100">
                                                            Qty: {booking.quantity || 1}
                                                        </Badge>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-1 mt-2">
                                                    {booking.segments?.map(segment => (
                                                        <Badge key={segment} variant="outline" className="text-[9px] bg-white text-gray-600">
                                                            {segment}
                                                        </Badge>
                                                    ))}
                                                    {(booking.segments?.length === 0 || !booking.segments) && <span className="text-[10px] text-red-400 italic">No segments selected</span>}
                                                </div>
                                                <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-6">
                                                    <div className="flex items-center gap-1.5">
                                                        <Users size={12} className="text-blue-500" />
                                                        <span className="text-[10px] text-gray-500 font-bold">
                                                            {(() => {
                                                                const scr = mockScreens.find(s => s.id === booking.screenId);
                                                                if (!scr) return '0';
                                                                const days = Math.ceil(Math.abs(new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)) + 1;
                                                                const segs = booking.segments?.length || 0;
                                                                return Math.round((scr.imp2Weeks / 14 / 24) * days * segs * (booking.quantity || 1)).toLocaleString();
                                                            })()} Impressions
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1.5">
                                                        <FileText size={12} className="text-gray-400" />
                                                        <span className="text-[10px] text-gray-500">
                                                            {formData.media.filter(m => m.bookingId === booking.id).length} assets
                                                        </span>
                                                    </div>
                                                </div>
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
                                (currentStep === 2 && formData.bookings.length === 0) ||
                                (currentStep === 3 && (formData.bookings.length === 0 || formData.bookings.some(b => b.segments.length === 0)))
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
