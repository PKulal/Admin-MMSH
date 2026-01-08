// Mock campaign data
export const mockCampaigns = [
    {
        id: 'CMP-001',
        name: 'Summer Sale 2026',
        tenant: 'RetailGiant',
        tenantId: 'TEN-001',
        dateRange: '2026-06-01 to 2026-06-30',
        startDate: '2026-06-01',
        endDate: '2026-06-30',
        status: 'booked',
        estimatedPrice: 13500,
        finalPrice: null,
        screens: [
            { id: 'SCR-001', name: 'Avenues Mall Display', location: 'Kuwait City, Kuwait', bookedQuantity: 2 },
            { id: 'SCR-002', name: 'Dubai Mall LED Screen', location: 'Dubai, UAE', bookedQuantity: 1 }
        ],
        slots: [
            { screenId: 'SCR-001', timeSlot: '08:00-12:00', days: 'Mon-Fri' },
            { screenId: 'SCR-002', timeSlot: '18:00-22:00', days: 'Daily' }
        ],
        media: [
            { screenId: 'SCR-001', fileName: 'summer_sale_v1.mp4', uploadedAt: '2026-05-15', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', type: 'video' }
        ]
    },
    {
        id: 'CMP-002',
        name: 'Tech Launch Campaign',
        tenant: 'InnoTech',
        tenantId: 'TEN-002',
        dateRange: '2026-07-15 to 2026-08-15',
        startDate: '2026-07-15',
        endDate: '2026-08-15',
        status: 'booked',
        estimatedPrice: 23400,
        finalPrice: 22500,
        adminComment: 'Discounted for long-term partnership',
        screens: [
            { id: 'SCR-003', name: 'Hamad International Airport', location: 'Doha, Qatar', bookedQuantity: 1 }
        ],
        slots: [
            { screenId: 'SCR-003', timeSlot: '06:00-23:00', days: 'Daily' }
        ],
        media: [
            { screenId: 'SCR-003', fileName: 'tech_product_launch.mp4', uploadedAt: '2026-07-01', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', type: 'video' }
        ]
    },
    {
        id: 'CMP-003',
        name: 'Brand Awareness Q3',
        tenant: 'BevCo',
        tenantId: 'TEN-003',
        dateRange: '2026-08-01 to 2026-09-30',
        startDate: '2026-08-01',
        endDate: '2026-09-30',
        status: 'running',
        estimatedPrice: 36000,
        finalPrice: 36000,
        screens: [
            { id: 'SCR-001', name: 'Avenues Mall Display', location: 'Kuwait City, Kuwait', bookedQuantity: 1 },
            { id: 'SCR-004', name: 'King Fahd Highway Billboard', location: 'Riyadh, Saudi Arabia', bookedQuantity: 1 }
        ],
        slots: [
            { screenId: 'SCR-001', timeSlot: '12:00-18:00', days: 'Daily' },
            { screenId: 'SCR-004', timeSlot: '10:00-22:00', days: 'Daily' }
        ],
        media: [
            { screenId: 'SCR-001', fileName: 'bevco_brand_v2.mp4', uploadedAt: '2026-07-20', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'video' },
            { screenId: 'SCR-004', fileName: 'bevco_brand_v2.mp4', uploadedAt: '2026-07-20', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', type: 'video' }
        ]
    },
    {
        id: 'CMP-004',
        name: 'Holiday Special 2025',
        tenant: 'RetailGiant',
        tenantId: 'TEN-001',
        dateRange: '2025-12-01 to 2025-12-31',
        startDate: '2025-12-01',
        endDate: '2025-12-31',
        status: 'completed',
        estimatedPrice: 28500,
        finalPrice: 28500,
        screens: [
            { id: 'SCR-002', name: 'Dubai Mall LED Screen', location: 'Dubai, UAE', bookedQuantity: 1 }
        ],
        slots: [
            { screenId: 'SCR-002', timeSlot: '00:00-23:59', days: 'Daily' }
        ],
        media: [
            { screenId: 'SCR-002', fileName: 'holiday_promo.mp4', uploadedAt: '2025-11-15', url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', type: 'video' }
        ],
        reports: [
            { fileName: 'execution_report_dec2025.pdf', uploadedAt: '2026-01-05' }
        ]
    },
    {
        id: 'CMP-005',
        name: 'Spring Collection Launch',
        tenant: 'FashionHub',
        tenantId: 'TEN-004',
        dateRange: '2026-03-01 to 2026-03-31',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        status: 'completed',
        estimatedPrice: 18600,
        finalPrice: 18000,
        adminComment: 'Early bird discount applied',
        screens: [
            { id: 'SCR-005', name: 'Marina Mall Display', location: 'Abu Dhabi, UAE', bookedQuantity: 1 }
        ],
        slots: [
            { screenId: 'SCR-005', timeSlot: '09:00-21:00', days: 'Daily' }
        ],
        media: [
            { screenId: 'SCR-005', fileName: 'spring_fashion_2026.mp4', uploadedAt: '2026-02-15' }
        ],
        reports: [
            { fileName: 'campaign_performance_march.pdf', uploadedAt: '2026-04-02' }
        ]
    }
];

export const mockTenants = [
    { id: 'TEN-001', name: 'RetailGiant' },
    { id: 'TEN-002', name: 'InnoTech' },
    { id: 'TEN-003', name: 'BevCo' },
    { id: 'TEN-004', name: 'FashionHub' }
];

export const mockScreens = [
    {
        id: 'SCR-001',
        name: 'Avenues Mall Display',
        location: 'Kuwait City, Kuwait',
        geoCoordinates: { lat: 29.3117, lng: 47.9405 },
        type: 'indoor',
        category: 'Shopping Mall',
        size: { width: 48, height: 14 },
        resolution: { width: 1920, height: 1080 },
        audienceMetadata: 'High foot traffic shopping mall, 500K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 43, arab: 27, nonArab: 30 },
            gender: { male: 67, female: 33 },
            ageGroup: { boomers: 24, genX: 28, millennials: 29, genZ: 19 }
        },
        peakDays: 'Thursday - Sunday',
        peakHour: '18:00 - 23:00',
        imp2Weeks: 250000,
        governorate: 'Capital',
        active: true,
        screenQuantity: 3
    },
    {
        id: 'SCR-002',
        name: 'Dubai Mall LED Screen',
        location: 'Dubai, UAE',
        geoCoordinates: { lat: 25.1972, lng: 55.2744 },
        type: 'indoor',
        category: 'Shopping Mall',
        size: { width: 55, height: 20 },
        resolution: { width: 3840, height: 2160 },
        audienceMetadata: 'Premium shopping destination, 800K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 10, arab: 20, nonArab: 70 },
            gender: { male: 55, female: 45 },
            ageGroup: { boomers: 15, genX: 25, millennials: 40, genZ: 20 }
        },
        peakDays: 'weekends',
        peakHour: 'morning',
        imp2Weeks: 150000,
        governorate: 'Dubai',
        active: true,
        screenQuantity: 1
    },
    {
        id: 'SCR-003',
        name: 'Hamad International Airport',
        location: 'Doha, Qatar',
        geoCoordinates: { lat: 25.2731, lng: 51.6080 },
        type: 'indoor',
        category: 'Airport',
        size: { width: 60, height: 12 },
        resolution: { width: 3840, height: 2160 },
        audienceMetadata: 'International travelers, 200K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 70, arab: 20, nonArab: 10 },
            gender: { male: 70, female: 30 },
            ageGroup: { boomers: 30, genX: 35, millennials: 25, genZ: 10 }
        },
        peakDays: 'all',
        peakHour: 'day',
        imp2Weeks: 300000,
        governorate: 'Doha',
        active: true,
        screenQuantity: 1
    },
    {
        id: 'SCR-004',
        name: 'King Fahd Highway Billboard',
        location: 'Riyadh, Saudi Arabia',
        geoCoordinates: { lat: 24.7136, lng: 46.6753 },
        type: 'outdoor',
        category: 'Highway',
        size: { width: 48, height: 14 },
        resolution: { width: 1920, height: 1080 },
        audienceMetadata: 'Major highway traffic, 400K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 60, arab: 30, nonArab: 10 },
            gender: { male: 75, female: 25 },
            ageGroup: { boomers: 20, genX: 35, millennials: 30, genZ: 15 }
        },
        governorate: 'Riyadh',
        active: true,
        screenQuantity: 1
    },
    {
        id: 'SCR-005',
        name: 'Marina Mall Display',
        location: 'Abu Dhabi, UAE',
        geoCoordinates: { lat: 24.4764, lng: 54.3227 },
        type: 'indoor',
        category: 'Shopping Mall',
        size: { width: 40, height: 22 },
        resolution: { width: 2560, height: 1440 },
        audienceMetadata: 'Upscale shopping center, 300K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 35, arab: 35, nonArab: 30 },
            gender: { male: 50, female: 50 },
            ageGroup: { boomers: 25, genX: 25, millennials: 30, genZ: 20 }
        },
        peakDays: 'weekdays',
        peakHour: 'afternoon',
        imp2Weeks: 180000,
        governorate: 'Abu Dhabi',
        active: true,
        screenQuantity: 1
    },
    {
        id: 'SCR-006',
        name: 'Kuwait International Airport',
        location: 'Kuwait City, Kuwait',
        geoCoordinates: { lat: 29.2267, lng: 47.9689 },
        type: 'indoor',
        category: 'Airport',
        size: { width: 50, height: 10 },
        resolution: { width: 1920, height: 1080 },
        audienceMetadata: 'International and domestic travelers, 150K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 20, arab: 30, nonArab: 50 },
            gender: { male: 60, female: 40 },
            ageGroup: { boomers: 20, genX: 30, millennials: 35, genZ: 15 }
        },
        peakDays: 'all',
        peakHour: 'all',
        imp2Weeks: 400000,
        governorate: 'Farwaniya',
        active: true,
        screenQuantity: 1
    },
    {
        id: 'SCR-007',
        name: 'Sheikh Zayed Highway Billboard',
        location: 'Dubai, UAE',
        geoCoordinates: { lat: 25.1124, lng: 55.1390 },
        type: 'outdoor',
        category: 'Highway',
        size: { width: 48, height: 14 },
        resolution: { width: 1920, height: 1080 },
        audienceMetadata: 'Premium highway location, 600K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 15, arab: 35, nonArab: 50 },
            gender: { male: 70, female: 30 },
            ageGroup: { boomers: 20, genX: 30, millennials: 30, genZ: 20 }
        },
        governorate: 'Dubai',
        active: true,
        screenQuantity: 1
    },
    {
        id: 'SCR-008',
        name: 'King Abdullah Highway Billboard',
        location: 'Jeddah, Saudi Arabia',
        geoCoordinates: { lat: 21.5433, lng: 39.1728 },
        type: 'outdoor',
        category: 'Highway',
        size: { width: 50, height: 15 },
        resolution: { width: 1920, height: 1080 },
        audienceMetadata: 'Coastal highway traffic, 350K+ daily impressions',
        demographics: {
            nationality: { kuwaiti: 55, arab: 30, nonArab: 15 },
            gender: { male: 65, female: 35 },
            ageGroup: { boomers: 25, genX: 30, millennials: 25, genZ: 20 }
        },
        governorate: 'Jeddah',
        active: false,
        screenQuantity: 1
    }
];
