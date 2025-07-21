async function loadSchemeData(schemeId) {
    try {
        const response = await fetch(`data/${schemeId}-distribution.json`);
        if (!response.ok) {
            throw new Error(`Failed to load data for ${schemeId}`);
        }
        return await response.json();
    } catch (error) {
        console.error(`Error loading data for ${schemeId}:`, error);
        return getFallbackData(schemeId);
    }
}

function getFallbackData(schemeId) {
    // Fallback data in case JSON files fail to load
    const schemes = {
        'laptop': {
            schemeName: 'Laptop Distribution Scheme',
            totalBeneficiaries: 12500,
            labels: ['Bhopal', 'Indore', 'Jabalpur', 'Gwalior', 'Ujjain'],
            datasets: [{
                label: 'Students Benefited',
                data: [3200, 4500, 2100, 1800, 900]
            }]
        },
        'uniform': {
            schemeName: 'Uniform Distribution Scheme',
            totalBeneficiaries: 245000,
            labels: ['Primary', 'Middle', 'High', 'Higher Secondary'],
            datasets: [{
                label: 'Uniforms Distributed',
                data: [120000, 75000, 35000, 15000]
            }]
        },
        'cycle': {
            schemeName: 'Cycle Distribution Scheme',
            totalBeneficiaries: 78000,
            labels: ['2019', '2020', '2021', '2022', '2023'],
            datasets: [{
                label: 'Cycles Distributed',
                data: [12000, 15000, 18000, 17000, 16000]
            }]
        },
        'scholarship': {
            schemeName: 'Scholarship Scheme',
            totalBeneficiaries: 185000,
            labels: ['SC', 'ST', 'OBC', 'General'],
            datasets: [
                {
                    label: 'Boys',
                    data: [45000, 50000, 30000, 20000]
                },
                {
                    label: 'Girls',
                    data: [50000, 55000, 35000, 25000]
                }
            ]
        },
        'sanitary-pad': {
            schemeName: 'Sanitary Pad Distribution Scheme',
            totalBeneficiaries: 150000,
            labels: ['Urban', 'Rural', 'Tribal'],
            datasets: [{
                label: 'Sanitary Pads Distributed',
                data: [60000, 75000, 15000]
            }]
        },
        'cwsn': {
            schemeName: 'CWSN Support Scheme',
            totalBeneficiaries: 12000,
            labels: ['Hearing Impaired', 'Visually Impaired', 'Physically Challenged', 'Learning Disabilities'],
            datasets: [{
                label: 'Support Provided',
                data: [4000, 3500, 3000, 1500]
            }]
        }
    };
    
    return schemes[schemeId] || {};
}