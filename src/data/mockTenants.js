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
        id: 'USR-002',
        name: 'Layla Hassan',
        email: 'layla@retailgiant.com',
        tenantId: 'TEN-001',
        tenantName: 'RetailGiant',
        role: 'User',
        active: true,
        createdAt: '2025-01-20',
        lastLogin: '2026-01-03'
    },
    {
        id: 'USR-003',
        name: 'Khalid Ibrahim',
        email: 'khalid@retailgiant.com',
        tenantId: 'TEN-001',
        tenantName: 'RetailGiant',
        role: 'User',
        active: true,
        createdAt: '2025-02-01',
        lastLogin: '2026-01-02'
    },
    {
        id: 'USR-004',
        name: 'Sara Al-Hashemi',
        email: 'sara@innotech.ae',
        tenantId: 'TEN-002',
        tenantName: 'InnoTech',
        role: 'Admin',
        active: true,
        createdAt: '2025-02-20',
        lastLogin: '2026-01-04'
    },
    {
        id: 'USR-005',
        name: 'Yusuf Rahman',
        email: 'yusuf@innotech.ae',
        tenantId: 'TEN-002',
        tenantName: 'InnoTech',
        role: 'User',
        active: true,
        createdAt: '2025-03-01',
        lastLogin: '2026-01-01'
    },
    {
        id: 'USR-006',
        name: 'Mohammed Al-Thani',
        email: 'mohammed@bevco.qa',
        tenantId: 'TEN-003',
        tenantName: 'BevCo',
        role: 'Admin',
        active: true,
        createdAt: '2025-03-10',
        lastLogin: '2026-01-03'
    },
    {
        id: 'USR-007',
        name: 'Fatima Al-Saud',
        email: 'fatima@fashionhub.sa',
        tenantId: 'TEN-004',
        tenantName: 'FashionHub',
        role: 'Admin',
        active: true,
        createdAt: '2025-04-05',
        lastLogin: '2026-01-04'
    },
    {
        id: 'USR-008',
        name: 'Noor Al-Fahad',
        email: 'noor@fashionhub.sa',
        tenantId: 'TEN-004',
        tenantName: 'FashionHub',
        role: 'User',
        active: false,
        createdAt: '2025-04-10',
        lastLogin: '2025-12-15'
    }
];
