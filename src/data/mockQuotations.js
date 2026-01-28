
// Mock data for Quotation Module based on Excel V12.8 logic

export const BASE_RATES = {
    signature: { '1D': 150, '3D': 400, '1W': 800, '2W': 1200, '3W': 1600, '4W': 2000 },
    premium: { '1D': 100, '3D': 250, '1W': 600, '2W': 900, '3W': 1200, '4W': 1500 },
    anchors: { '1D': 80, '3D': 200, '1W': 500, '2W': 750, '3W': 1000, '4W': 1300 },
    elite: { '1D': 60, '3D': 150, '1W': 400, '2W': 600, '3W': 800, '4W': 1000 },
    avenues_grand: { '1D': 200, '3D': 500, '1W': 1000, '2W': 1500, '3W': 2000, '4W': 2500 },
    avenues_diamond: { '1D': 180, '3D': 450, '1W': 900, '2W': 1400, '3W': 1800, '4W': 2300 },
    avenues_quartz: { '1D': 160, '3D': 400, '1W': 800, '2W': 1300, '3W': 1700, '4W': 2100 },
    avenues_eyes: { '1D': 140, '3D': 350, '1W': 700, '2W': 1000, '3W': 1400, '4W': 1700 },
    residential: { '1D': 40, '3D': 100, '1W': 200, '2W': 300, '3W': 400, '4W': 500 },
    sultan_dooh: { '1D': 50, '3D': 120, '1W': 250, '2W': 400, '3W': 550, '4W': 700 },
    marina_takeover: { '1D': 250, '3D': 600, '1W': 1200, '2W': 2000, '3W': 2800, '4W': 3500 },
    radio: { '1D': 10, '3D': 25, '1W': 40, '2W': 50, '3W': 65, '4W': 80 },
    cinema: { '1D': 20, '3D': 50, '1W': 80, '2W': 100, '3W': 140, '4W': 180 },
    buses_dd: { '1D': 30, '3D': 80, '1W': 150, '2W': 200, '3W': 280, '4W': 350 },
    buses_sd: { '1D': 20, '3D': 60, '1W': 100, '2W': 150, '3W': 200, '4W': 250 },
};

export const mockQuotations = [
    {
        id: 'QUO-2026-001',
        title: 'Ramadan 2026 Campaign',
        client: 'RetailGiant Kuwait',
        agency: 'Al-Mansour Media',
        duration: '4 Weeks',
        createdBy: 'Praneeth Kulal',
        createdDate: '2026-01-20',
        status: 'Draft',
        totalGross: 12500,
        totalNet: 9375,
        items: [
            { id: 1, section: 'DOOH', category: 'Signature', element: 'Avenues Mall Entry', governorate: 'Capital', duration: '4W', qty: 12, gross: 24000, net: 14400 },
            { id: 2, section: 'DOOH', category: 'Premium', element: 'Gulf Road Billboard', governorate: 'Hawally', duration: '4W', qty: 5, gross: 7500, net: 7500 }
        ]
    },
    {
        id: 'QUO-2026-002',
        title: 'Summer Launch - New SUV',
        client: 'MotorCo',
        agency: 'Global Ads',
        duration: '2 Weeks',
        createdBy: 'Praneeth Kulal',
        createdDate: '2026-01-25',
        status: 'Finalized',
        totalGross: 8200,
        totalNet: 6150,
        items: [
            { id: 3, section: 'Sultan', category: 'DOOH', element: 'Sultan Center Salmiya', governorate: 'Hawally', duration: '2W', qty: 3, gross: 1200, net: 1200 }
        ]
    }
];

// Helper for Discount Logic
export const calculateQuotation = (items, manualDiscounts = {}) => {
    let gross = 0;
    let net = 0;

    // 1. Group items for discount triggers
    const signatureItems = items.filter(i => i.category === 'Signature' && (i.duration === '4W' || i.duration === '2W'));
    const doohItems = items.filter(i => i.section === 'DOOH');
    const residentialItems = items.filter(i => i.category === 'Residential');

    const totalSignatureQty = signatureItems.reduce((acc, current) => acc + current.qty, 0);
    const totalDoohQty = doohItems.reduce((acc, current) => acc + current.qty, 0);
    const totalResidentialQty = residentialItems.reduce((acc, current) => acc + current.qty, 0);

    // 2. Determine Signature Special Rates
    let signatureRate4W = 2000;
    let signatureRate2W = 1200;

    if (totalSignatureQty >= 15) {
        signatureRate4W = 350; // Per screen? Wait, user says 350 KD (4W) / 210 KD (2W) if >= 15
        signatureRate2W = 210;
    } else if (totalSignatureQty < 15 && totalSignatureQty >= 10) {
        signatureRate4W = 400;
        signatureRate2W = 240;
    } else if (totalSignatureQty < 10) {
        signatureRate4W = 600;
        signatureRate2W = 360;
    }

    // Apply rates and calculate gross/net
    items.forEach(item => {
        let itemGross = 0;
        let itemNet = 0;
        const rateKey = item.category.toLowerCase().replace(' ', '_');
        const baseRates = BASE_RATES[rateKey] || { '4W': 1000, '2W': 600 };

        itemGross = (baseRates[item.duration] || 0) * item.qty;

        if (item.category === 'Signature' && (item.duration === '4W' || item.duration === '2W')) {
            const specialRate = item.duration === '4W' ? signatureRate4W : signatureRate2W;
            itemNet = specialRate * item.qty;
        } else {
            itemNet = itemGross;
        }

        // Apply Residential Discount
        if (item.category === 'Residential') {
            if (totalResidentialQty >= 20) itemNet *= 0.8;
            else if (totalResidentialQty >= 10) itemNet *= 0.9;
        }

        // Apply Mix Discount
        if (item.section === 'DOOH' && totalDoohQty >= 20 && totalSignatureQty < 10) {
            itemNet *= 0.75;
        }

        item.gross = itemGross;
        item.net = itemNet;

        gross += itemGross;
        net += itemNet;
    });

    // Apply Manual Discounts
    const packageAmount = manualDiscounts?.packageAmount;
    const otherPercentage = manualDiscounts?.otherPercentage;

    if (packageAmount) {
        net = packageAmount;
    }
    if (otherPercentage) {
        net *= (1 - otherPercentage / 100);
    }

    return { gross, net };
};
