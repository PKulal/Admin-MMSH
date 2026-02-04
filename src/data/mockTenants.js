// Extended mock tenant data with more details
export const mockTenantsDetailed = [
    {
        id: 'TEN-001',
        name: 'RetailGiant',
        contactName: 'Ahmed Al-Mansouri',
        email: 'ahmed@retailgiant.com',
        phone: '+965 2222 3333',
        address: 'Kuwait City, Kuwait',
        active: true,
        createdAt: '2025-01-15',
        userCount: 3
    },
    {
        id: 'TEN-002',
        name: 'InnoTech',
        contactName: 'Sara Al-Hashemi',
        email: 'sara@innotech.ae',
        phone: '+971 4 555 6666',
        address: 'Dubai, UAE',
        active: true,
        createdAt: '2025-02-20',
        userCount: 2
    },
    {
        id: 'TEN-003',
        name: 'BevCo',
        contactName: 'Mohammed Al-Thani',
        email: 'mohammed@bevco.qa',
        phone: '+974 4444 5555',
        address: 'Doha, Qatar',
        active: true,
        createdAt: '2025-03-10',
        userCount: 1
    },
    {
        id: 'TEN-004',
        name: 'FashionHub',
        contactName: 'Fatima Al-Saud',
        email: 'fatima@fashionhub.sa',
        phone: '+966 11 777 8888',
        address: 'Riyadh, Saudi Arabia',
        active: true,
        createdAt: '2025-04-05',
        userCount: 2
    },
    {
        id: 'TEN-005',
        name: 'TechStartup',
        contactName: 'Omar Al-Kuwari',
        email: 'omar@techstartup.com',
        phone: '+965 9999 0000',
        address: 'Kuwait City, Kuwait',
        active: false,
        createdAt: '2024-11-20',
        userCount: 0
    }
];

export const mockUsers = [
    {
        id: 'USR-001',
        name: 'Ahmed Al-Mansouri',
        email: 'ahmed@retailgiant.com',
        tenantId: 'TEN-001',
        tenantName: 'RetailGiant',
        role: 'Admin',
        active: true,
        createdAt: '2025-01-15',
        lastLogin: '2026-01-04'
    },
    {
        id: 'USR-SYS-001',
        name: 'System Admin',
        email: 'admin@mmsh.com',
        role: 'Admin',
        active: true,
        createdAt: '2025-01-01',
        lastLogin: '2026-02-04',
        isSystemUser: true
    },
    {
        id: 'USR-SYS-002',
        name: 'Ops Manager',
        email: 'ops@mmsh.com',
        role: 'Ops',
        active: true,
        createdAt: '2025-01-01',
        lastLogin: '2026-02-03',
        isSystemUser: true
    },
    {
        id: 'USR-SYS-003',
        name: 'Sales Lead',
        email: 'sales@mmsh.com',
        role: 'Sales team',
        active: true,
        createdAt: '2025-01-05',
        lastLogin: '2026-02-02',
        isSystemUser: true
    },
    {
        id: 'USR-SYS-004',
        name: 'Finance Approver',
        email: 'approver@mmsh.com',
        role: 'Approver',
        active: true,
        createdAt: '2025-01-10',
        lastLogin: '2026-02-01',
        isSystemUser: true
    }
];

export const mockAgencies = [
    {
        id: 'AGN-001',
        name: 'Al-Mansour Media',
        contactName: 'Fahad Al-Mansour',
        email: 'contact@almansour.com',
        phone: '+965 1234 5678',
        active: true,
        commission: 15,
        totalCampaigns: 12
    },
    {
        id: 'AGN-002',
        name: 'Global Ads Agency',
        contactName: 'Jane Smith',
        email: 'info@globalads.com',
        phone: '+971 50 123 4567',
        active: true,
        commission: 10,
        totalCampaigns: 8
    },
    {
        id: 'AGN-003',
        name: 'Desert Promotions',
        contactName: 'Omar Hassan',
        email: 'omar@desertpromo.com',
        phone: '+974 3333 4444',
        active: false,
        commission: 12,
        totalCampaigns: 3
    }
];

