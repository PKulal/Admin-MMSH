export const mockReportStats = {
    activeCampaigns: 12,
    pausedCampaigns: 3,
    totalSpent: 458360,
    remainingBudget: 301157,
    currency: 'USD'
};

export const mockSpendingOverview = [
    { date: 'Jan 01', spent: 120 },
    { date: 'Jan 02', spent: 250 },
    { date: 'Jan 03', spent: 180 },
    { date: 'Jan 04', spent: 300 },
    { date: 'Jan 05', spent: 220 },
    { date: 'Jan 06', spent: 400 },
    { date: 'Jan 07', spent: 350 },
    { date: 'Jan 08', spent: 450 },
    { date: 'Jan 09', spent: 380 },
    { date: 'Jan 10', spent: 500 },
    { date: 'Jan 11', spent: 420 },
    { date: 'Jan 12', spent: 550 },
];

export const mockLineItems = [
    {
        id: 'LI-001',
        name: 'Summer Sale Video',
        campaign: 'Summer Sale 2026',
        startDate: 'Jun 12, 2024',
        endDate: 'Oct 31, 2024',
        dailyBudget: 50,
        spent: 197.16,
        plannedBudget: 498.36,
        status: 'Active'
    },
    {
        id: 'LI-002',
        name: 'Tech Launch Banner',
        campaign: 'Tech Launch Campaign',
        startDate: 'Jul 15, 2024',
        endDate: 'Aug 15, 2024',
        dailyBudget: 100,
        spent: 2200.00,
        plannedBudget: 3000.00,
        status: 'Active'
    },
    {
        id: 'LI-003',
        name: 'Brand Awareness Clip',
        campaign: 'Brand Awareness Q3',
        startDate: 'Aug 01, 2024',
        endDate: 'Sep 30, 2024',
        dailyBudget: 80,
        spent: 1200.00,
        plannedBudget: 4800.00,
        status: 'Paused'
    }
];

export const mockCampaignPerformance = {
    'CMP-001': {
        totalImpressions: [
            { date: 'Sep 24', impressions: 500, spent: 10 },
            { date: 'Sep 25', impressions: 2200, spent: 45 },
            { date: 'Sep 26', impressions: 2100, spent: 42 },
            { date: 'Sep 27', impressions: 2800, spent: 58 },
            { date: 'Sep 28', impressions: 2600, spent: 52 },
            { date: 'Sep 29', impressions: 2400, spent: 48 },
            { date: 'Sep 30', impressions: 2300, spent: 46 },
            { date: 'Oct 01', impressions: 800, spent: 15 },
        ],
        screens: [
            { date: 'Sep 24', active: 1, total: 3 },
            { date: 'Sep 25', active: 3, total: 3 },
            { date: 'Sep 26', active: 3, total: 3 },
            { date: 'Sep 27', active: 3, total: 3 },
            { date: 'Sep 28', active: 3, total: 3 },
            { date: 'Sep 29', active: 3, total: 3 },
            { date: 'Sep 30', active: 3, total: 3 },
            { date: 'Oct 01', active: 1, total: 3 },
        ],
        ecpm: [
            { date: 'Sep 24', value: 20 },
            { date: 'Sep 25', value: 20.45 },
            { date: 'Sep 26', value: 20 },
            { date: 'Sep 27', value: 20.71 },
            { date: 'Sep 28', value: 20 },
            { date: 'Sep 29', value: 20 },
            { date: 'Sep 30', value: 20 },
            { date: 'Oct 01', value: 18.75 },
        ],
        playouts: [
            { date: 'Sep 24', value: 400 },
            { date: 'Sep 25', value: 1500 },
            { date: 'Sep 26', value: 1400 },
            { date: 'Sep 27', value: 1800 },
            { date: 'Sep 28', value: 1700 },
            { date: 'Sep 29', value: 1600 },
            { date: 'Sep 30', value: 1550 },
            { date: 'Oct 01', value: 600 },
        ],
        budget: {
            spent: 197.16,
            planned: 498.36,
            remaining: 301.19,
            dailyBudget: 50,
            pacing: 'EVEN'
        },
        schedule: {
            weeklyHours: 168,
            avgDailyHours: 15,
            customHours: [
                { day: 'Mon', hours: 24 },
                { day: 'Tue', hours: 24 },
                { day: 'Wed', hours: 24 },
                { day: 'Thu', hours: 24 },
                { day: 'Fri', hours: 24 },
                { day: 'Sat', hours: 24 },
                { day: 'Sun', hours: 24 },
            ]
        }
    }
};

export const mockDemographics = {
    nationality: [
        { label: 'Kuwaiti', value: 43 },
        { label: 'Arab', value: 27 },
        { label: 'Non-Arab', value: 30 },
    ],
    gender: [
        { label: 'Male', value: 67 },
        { label: 'Female', value: 33 },
    ],
    ageGroup: [
        { label: 'Boomers (61-80)', value: 24 },
        { label: 'Gen X (45-60)', value: 28 },
        { label: 'Millennials (29-44)', value: 29 },
        { label: 'Gen Z (<28)', value: 19 },
    ]
};

export const mockDailyPerformance = {
    screens: [
        { date: 'Sep 24', value: 12 },
        { date: 'Sep 25', value: 15 },
        { date: 'Sep 26', value: 14 },
        { date: 'Sep 27', value: 18 },
        { date: 'Sep 28', value: 18 },
        { date: 'Sep 29', value: 17 },
        { date: 'Sep 30', value: 19 },
        { date: 'Oct 01', value: 16 },
    ],
    ecpm: [
        { date: 'Sep 24', value: 19 },
        { date: 'Sep 25', value: 17 },
        { date: 'Sep 26', value: 16.5 },
        { date: 'Sep 27', value: 18 },
        { date: 'Sep 28', value: 17 },
        { date: 'Sep 29', value: 16.8 },
        { date: 'Sep 30', value: 17.2 },
        { date: 'Oct 01', value: 15.8 },
    ],
    playouts: [
        { date: 'Sep 24', value: 120 },
        { date: 'Sep 25', value: 180 },
        { date: 'Sep 26', value: 165 },
        { date: 'Sep 27', value: 215 },
        { date: 'Sep 28', value: 198 },
        { date: 'Sep 29', value: 172 },
        { date: 'Sep 30', value: 190 },
        { date: 'Oct 01', value: 135 },
    ]
};
