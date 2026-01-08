import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import {
    ArrowLeft,
    Calendar,
    Building2,
    Monitor,
    Clock,
    DollarSign,
    FileText,
    Upload,
    Edit2,
    CheckCircle,
    PlayCircle,
    FileCheck,
    Eye
} from 'lucide-react';
import { mockCampaigns } from '../../data/mockData';

const statusVariants = {
    submitted: 'warning',
    booked: 'default',
    running: 'running',
    completed: 'success'
};

const statusLabels = {
    submitted: 'Submitted',
    booked: 'Booked',
    running: 'Running',
    completed: 'Completed'
};

export function CampaignDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const campaign = mockCampaigns.find(c => c.id === id);

    const [finalPrice, setFinalPrice] = useState(campaign?.finalPrice || campaign?.estimatedPrice || 0);
    const [adminComment, setAdminComment] = useState(campaign?.adminComment || '');
    const [isEditingPrice, setIsEditingPrice] = useState(false);
    const [previewMedia, setPreviewMedia] = useState(null);

    if (!campaign) {
        return (
            <div className="space-y-6">
                <Button variant="ghost" onClick={() => navigate('/campaigns')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back to Campaigns
                </Button>
                <Card>
                    <div className="text-center py-12">
                        <p className="text-[hsl(var(--color-text-muted))]">Campaign not found</p>
                    </div>
                </Card>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-KW', {
            style: 'currency',
            currency: 'KWD',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleSavePricing = () => {
        console.log('Saving pricing:', { finalPrice, adminComment });
        setIsEditingPrice(false);
        alert('Pricing updated successfully');
    };

    const handleStatusTransition = (newStatus) => {
        console.log('Transitioning status to:', newStatus);
        alert(`Campaign status updated to: ${statusLabels[newStatus]}`);
    };

    const handleReportUpload = () => {
        alert('Report upload functionality would be implemented here');
    };

    const getNextStatus = () => {
        const statusFlow = {
            booked: 'running',
            running: 'completed'
        };
        return statusFlow[campaign.status];
    };

    const getStatusAction = () => {
        const actions = {
            booked: { label: 'Mark as Running', icon: PlayCircle },
            running: { label: 'Mark as Completed', icon: FileCheck }
        };
        return actions[campaign.status];
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" onClick={() => navigate('/campaigns')}>
                        <ArrowLeft size={18} className="mr-2" />
                        Back
                    </Button>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">{campaign.name}</h2>
                        <p className="text-[hsl(var(--color-text-muted))]">{campaign.id}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Button variant="outline" onClick={() => navigate(`/campaigns/${id}/edit`)}>
                        <Edit2 size={18} className="mr-2" />
                        Edit Campaign
                    </Button>
                    <Badge variant={statusVariants[campaign.status]} className="text-sm px-4 py-2">
                        {statusLabels[campaign.status]}
                    </Badge>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Campaign Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Campaign Details</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <Building2 size={20} className="text-[hsl(var(--color-text-muted))] mt-0.5" />
                                    <div>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Tenant</p>
                                        <p className="font-semibold">{campaign.tenant}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Monitor size={20} className="text-[hsl(var(--color-text-muted))] mt-0.5" />
                                    <div>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Screens Selected</p>
                                        <p className="font-semibold">{campaign.screens.length}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <Calendar size={20} className="text-[hsl(var(--color-text-muted))] mt-0.5" />
                                    <div>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Date Range</p>
                                        <p className="font-semibold">{campaign.dateRange}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Screen & Slot Selections */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Screen & Slot Selections</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            {campaign.screens.map((screen) => {
                                const slot = campaign.slots.find(s => s.screenId === screen.id);
                                const media = campaign.media.find(m => m.screenId === screen.id);

                                return (
                                    <div key={screen.id} className="p-4 rounded-lg border border-[hsl(var(--color-border))] space-y-3">
                                        <div className="flex items-start gap-3">
                                            <Monitor size={20} className="text-[hsl(var(--color-text-muted))] mt-0.5" />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <p
                                                        className="font-semibold hover:text-blue-600 transition-colors cursor-pointer"
                                                        onClick={() => navigate(`/inventory/${screen.id}`)}
                                                    >
                                                        {screen.name}
                                                    </p>
                                                    <Badge variant="secondary" className="text-[10px] bg-blue-50 text-blue-600 border-blue-100">
                                                        Qty: {screen.bookedQuantity || 1}
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">{screen.location}</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                                            {slot && (
                                                <div className="flex items-center gap-2 text-sm">
                                                    <Clock size={16} className="text-[hsl(var(--color-text-muted))]" />
                                                    <span className="text-[hsl(var(--color-text-muted))]">
                                                        {slot.timeSlot} • {slot.days}
                                                    </span>
                                                </div>
                                            )}

                                            {media && (
                                                <div className="flex items-center justify-between gap-2 text-sm bg-gray-50/50 p-2 rounded-md">
                                                    <div className="flex items-center gap-2">
                                                        <FileText size={16} className="text-[hsl(var(--color-text-muted))]" />
                                                        <span className="text-sm font-medium truncate max-w-[150px]">
                                                            {media.fileName}
                                                        </span>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                                        onClick={() => setPreviewMedia(media)}
                                                    >
                                                        <Eye size={14} className="mr-1" />
                                                        Preview
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    {/* Post-Campaign Reports (if completed) */}
                    {campaign.status === 'completed' && campaign.reports && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Execution Reports</CardTitle>
                            </CardHeader>
                            <div className="space-y-2">
                                {campaign.reports.map((report, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg border border-[hsl(var(--color-border))]">
                                        <div className="flex items-center gap-3">
                                            <FileCheck size={20} className="text-green-600" />
                                            <div>
                                                <p className="font-medium">{report.fileName}</p>
                                                <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                                    Uploaded: {report.uploadedAt}
                                                </p>
                                            </div>
                                        </div>
                                        <Button variant="ghost" size="sm" onClick={() => alert(`Opening report: ${report.fileName}`)}>View</Button>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <DollarSign size={20} />
                                Pricing
                            </CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-[hsl(var(--color-text-muted))] mb-1">Estimated Price</p>
                                <p className="text-2xl font-bold">{formatCurrency(campaign.estimatedPrice)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-[hsl(var(--color-text-muted))] mb-1">Total Screens</p>
                                <p className="text-lg font-semibold">{campaign.screens.length} Screens</p>
                            </div>

                            <div className="pt-4 border-t border-[hsl(var(--color-border))]">
                                <p className="text-sm text-[hsl(var(--color-text-muted))] mb-2">Final Price</p>
                                <p className="text-2xl font-bold">
                                    {formatCurrency(finalPrice)}
                                </p>
                                {adminComment && (
                                    <p className="text-sm text-[hsl(var(--color-text-muted))] mt-2 p-2 bg-gray-50 rounded">
                                        {adminComment}
                                    </p>
                                )}
                            </div>
                        </div>
                    </Card>

                    {/* Status Actions */}
                    {campaign.status !== 'completed' && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Actions</CardTitle>
                            </CardHeader>
                            <div className="space-y-3">
                                {getStatusAction() && (
                                    <Button
                                        className="w-full"
                                        onClick={() => handleStatusTransition(getNextStatus())}
                                    >
                                        {React.createElement(getStatusAction().icon, { size: 18, className: 'mr-2' })}
                                        {getStatusAction().label}
                                    </Button>
                                )}
                            </div>
                        </Card>
                    )}

                    {/* Upload Report (for running/completed campaigns) */}
                    {(campaign.status === 'running' || campaign.status === 'completed') && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Execution Report</CardTitle>
                            </CardHeader>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleReportUpload}
                            >
                                <Upload size={18} className="mr-2" />
                                Upload Report
                            </Button>
                        </Card>
                    )}
                </div>
            </div>

            {/* Media Preview Modal */}
            {previewMedia && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setPreviewMedia(null)}
                >
                    <Card
                        className="w-full max-w-2xl max-h-[80vh] overflow-hidden flex flex-col shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="p-4 border-b border-[hsl(var(--color-border))] flex items-center justify-between bg-white sticky top-0 z-10">
                            <div>
                                <h3 className="text-lg font-bold text-black">{previewMedia.fileName}</h3>
                                <p className="text-xs text-[hsl(var(--color-text-muted))]">Screen: {previewMedia.screenId}</p>
                            </div>
                            <Button variant="ghost" size="sm" onClick={() => setPreviewMedia(null)}>Close</Button>
                        </div>
                        <div className="p-0 bg-black flex-1 flex items-center justify-center overflow-hidden min-h-[300px]">
                            <div className="text-white/20 text-sm flex flex-col items-center gap-2">
                                <PlayCircle size={48} className="opacity-20" />
                                <span>Media Preview Placeholder</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
}
