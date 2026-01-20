// Mock contracts data
export const mockContracts = [
    {
        id: 'CON-001',
        title: 'RetailGiant Global Discount',
        tenantId: 'TEN-001', // RetailGiant
        tenantName: 'RetailGiant',
        userId: 'USR-001',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        pricingType: 'discount',
        pricingValue: 20, // 20% discount
        screenSubset: 'all',
        status: 'active',
        allocatedUnits: null,
        usedUnits: 0,
        createdAt: '2025-12-15'
    },
    {
        id: 'CON-002',
        title: 'InnoTech Fixed Price Agreement',
        tenantId: 'TEN-002', // InnoTech
        tenantName: 'InnoTech',
        userId: 'USR-004',
        startDate: '2026-01-01',
        endDate: '2026-12-31',
        pricingType: 'fixed',
        pricingValue: 15, // 15 KWD per hour
        screenSubset: 'all',
        status: 'active',
        allocatedUnits: 500, // hours
        usedUnits: 120,
        createdAt: '2025-12-20'
    },
    {
        id: 'CON-003',
        title: 'BevCo Promotional Rate',
        tenantId: 'TEN-003', // BevCo
        tenantName: 'BevCo',
        userId: 'USR-006',
        startDate: '2025-06-01',
        endDate: '2025-12-31',
        pricingType: 'discount',
        pricingValue: 50, // 50% discount
        screenSubset: 'all',
        status: 'expired',
        allocatedUnits: null,
        usedUnits: 300,
        createdAt: '2025-05-10'
    }
];
