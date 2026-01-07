import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { ArrowLeft, Upload, Download, FileSpreadsheet, CheckCircle2, AlertCircle, Info } from 'lucide-react';

export function BulkUpload() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadResult, setUploadResult] = useState(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            // Validate file type
            const validTypes = ['text/csv', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
            if (validTypes.includes(selectedFile.type) || selectedFile.name.endsWith('.csv')) {
                setFile(selectedFile);
                setUploadResult(null);
            } else {
                alert('Please upload a CSV or Excel file');
            }
        }
    };

    const handleUpload = () => {
        if (!file) return;

        setUploading(true);

        // Simulate upload process
        setTimeout(() => {
            setUploading(false);
            setUploadResult({
                success: true,
                total: 15,
                imported: 12,
                failed: 3,
                errors: [
                    { row: 5, error: 'Invalid coordinates format' },
                    { row: 8, error: 'Missing required field: location' },
                    { row: 12, error: 'Duplicate screen ID' }
                ]
            });
        }, 2000);
    };

    const handleDownloadTemplate = () => {
        // Create CSV template
        const headers = [
            'screen_id',
            'name',
            'location',
            'latitude',
            'longitude',
            'type',
            'category',
            'width_feet',
            'height_feet',
            'resolution_width',
            'resolution_height',
            'demographics',
            'active'
        ];

        const sampleData = [
            'SCR-001',
            'Avenues Mall Display',
            'Kuwait City, Kuwait',
            '29.3117',
            '47.9405',
            'indoor',
            'Shopping Mall',
            '48',
            '14',
            '1920',
            '1080',
            '18-25',
            'true'
        ];

        const csvContent = [
            headers.join(','),
            sampleData.join(',')
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'screen_upload_template.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" onClick={() => navigate('/inventory')}>
                    <ArrowLeft size={18} className="mr-2" />
                    Back
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Bulk Upload Screens</h2>
                    <p className="text-[hsl(var(--color-text-muted))]">
                        Upload multiple screens at once using CSV or Excel file
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Upload Area */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Instructions */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload Instructions</CardTitle>
                        </CardHeader>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                                    <Info size={16} />
                                </div>
                                <div>
                                    <p className="font-medium">Step 1: Download Template</p>
                                    <p className="text-[hsl(var(--color-text-muted))]">
                                        Download the CSV template to see the required format and fields
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                                    <Info size={16} />
                                </div>
                                <div>
                                    <p className="font-medium">Step 2: Fill in Your Data</p>
                                    <p className="text-[hsl(var(--color-text-muted))]">
                                        Add your screen data following the template format
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3">
                                <div className="p-2 rounded-full bg-blue-50 text-blue-600 mt-0.5">
                                    <Info size={16} />
                                </div>
                                <div>
                                    <p className="font-medium">Step 3: Upload File</p>
                                    <p className="text-[hsl(var(--color-text-muted))]">
                                        Upload your completed CSV or Excel file
                                    </p>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* Upload Area */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Upload File</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-[hsl(var(--color-border))] rounded-lg p-8 text-center hover:border-[hsl(var(--color-primary))] transition-colors">
                                <div className="flex flex-col items-center gap-4">
                                    <div className="p-4 rounded-full bg-gray-50">
                                        <FileSpreadsheet size={48} className="text-[hsl(var(--color-text-muted))]" />
                                    </div>
                                    <div>
                                        <p className="font-medium mb-1">
                                            {file ? file.name : 'Choose a file or drag it here'}
                                        </p>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                            CSV or Excel files only
                                        </p>
                                    </div>
                                    <input
                                        type="file"
                                        accept=".csv,.xlsx,.xls"
                                        onChange={handleFileChange}
                                        className="hidden"
                                        id="file-upload"
                                    />
                                    <label htmlFor="file-upload">
                                        <Button variant="outline" as="span">
                                            Select File
                                        </Button>
                                    </label>
                                </div>
                            </div>

                            {file && (
                                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <FileSpreadsheet size={24} className="text-blue-600" />
                                        <div>
                                            <p className="font-medium">{file.name}</p>
                                            <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                                {(file.size / 1024).toFixed(2)} KB
                                            </p>
                                        </div>
                                    </div>
                                    <Button
                                        onClick={() => setFile(null)}
                                        variant="ghost"
                                        size="sm"
                                    >
                                        Remove
                                    </Button>
                                </div>
                            )}

                            <Button
                                onClick={handleUpload}
                                disabled={!file || uploading}
                                className="w-full"
                            >
                                <Upload size={18} className="mr-2" />
                                {uploading ? 'Uploading...' : 'Upload Screens'}
                            </Button>
                        </div>
                    </Card>

                    {/* Upload Results */}
                    {uploadResult && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Upload Results</CardTitle>
                            </CardHeader>
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 bg-blue-50 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-blue-600">{uploadResult.total}</p>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Total Rows</p>
                                    </div>
                                    <div className="p-4 bg-green-50 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-green-600">{uploadResult.imported}</p>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Imported</p>
                                    </div>
                                    <div className="p-4 bg-red-50 rounded-lg text-center">
                                        <p className="text-2xl font-bold text-red-600">{uploadResult.failed}</p>
                                        <p className="text-sm text-[hsl(var(--color-text-muted))]">Failed</p>
                                    </div>
                                </div>

                                {uploadResult.errors.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <AlertCircle size={18} className="text-red-600" />
                                            Errors
                                        </h4>
                                        <div className="space-y-2">
                                            {uploadResult.errors.map((error, index) => (
                                                <div key={index} className="p-3 bg-red-50 rounded-lg text-sm">
                                                    <p className="font-medium text-red-600">Row {error.row}</p>
                                                    <p className="text-[hsl(var(--color-text-muted))]">{error.error}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {uploadResult.success && uploadResult.failed === 0 && (
                                    <div className="p-4 bg-green-50 rounded-lg flex items-center gap-3">
                                        <CheckCircle2 size={24} className="text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-600">Upload Successful!</p>
                                            <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                                All screens have been imported successfully
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Template</CardTitle>
                        </CardHeader>
                        <div className="space-y-4">
                            <p className="text-sm text-[hsl(var(--color-text-muted))]">
                                Download the CSV template to get started with the correct format
                            </p>
                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleDownloadTemplate}
                            >
                                <Download size={18} className="mr-2" />
                                Download Template
                            </Button>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Required Fields</CardTitle>
                        </CardHeader>
                        <div className="space-y-2 text-sm">
                            <div className="flex items-center justify-between">
                                <span>Screen ID</span>
                                <Badge variant="default">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Name</span>
                                <Badge variant="default">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Location</span>
                                <Badge variant="default">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Coordinates</span>
                                <Badge variant="default">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Type</span>
                                <Badge variant="default">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Category</span>
                                <Badge variant="default">Required</Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <span>Demographics</span>
                                <Badge variant="outline">Optional</Badge>
                            </div>
                        </div>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Valid Values</CardTitle>
                        </CardHeader>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="font-medium mb-1">Type:</p>
                                <p className="text-[hsl(var(--color-text-muted))]">indoor, outdoor</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Category:</p>
                                <p className="text-[hsl(var(--color-text-muted))]">Shopping Mall, Highway, Airport</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Demographics:</p>
                                <p className="text-[hsl(var(--color-text-muted))]">18-25, 26-35, 36-50, 50+</p>
                            </div>
                            <div>
                                <p className="font-medium mb-1">Active:</p>
                                <p className="text-[hsl(var(--color-text-muted))]">true, false</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}
