document.addEventListener('DOMContentLoaded', function() {
    // Set current date
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    document.getElementById('current-date').textContent = new Date().toLocaleDateString('en-IN', options);
    
    // Initialize dashboard
    initDashboard();
    
    // Scheme card toggle functionality
    const schemeCards = document.querySelectorAll('.scheme-card');
    schemeCards.forEach(card => {
        const header = card.querySelector('.scheme-header');
        header.addEventListener('click', () => {
            card.classList.toggle('active');
        });
    });
});

async function initDashboard() {
    try {
        // Load all scheme data
        const schemes = [
            { id: 'laptop', name: 'Laptop Distribution' },
            { id: 'uniform', name: 'Uniform Distribution' },
            { id: 'cycle', name: 'Cycle Distribution' },
            { id: 'scholarship', name: 'Scholarship Scheme' },
            { id: 'sanitary-pad', name: 'Sanitary Pad Distribution' },
            { id: 'cwsn', name: 'CWSN Support Scheme' }
        ];
        
        const schemeData = {};
        for (const scheme of schemes) {
            const data = await loadSchemeData(scheme.id);
            schemeData[scheme.id] = data;
        }
        
        // Process data and render charts
        renderAllCharts(schemeData);
        
        // Update summary cards
        updateSummaryCards(schemeData);
        
        // Initialize district selector
        initDistrictSelector(schemeData);
        
    } catch (error) {
        console.error('Error initializing dashboard:', error);
    }
}

function renderAllCharts(schemeData) {
    // Laptop Distribution - Bar Chart
    renderBarChart('laptop-chart', schemeData.laptop, 'Students Benefited');
    
    // Uniform Distribution - Pie Chart
    renderPieChart('uniform-chart', schemeData.uniform, 'Uniforms Distributed');
    
    // Cycle Distribution - Line Chart
    renderLineChart('cycle-chart', schemeData.cycle, 'Cycles Distributed');
    
    // Scholarship Scheme - Stacked Bar Chart
    renderStackedBarChart('scholarship-chart', schemeData.scholarship, 'Scholarship Amount (₹)');
    
    // Sanitary Pad Distribution - Doughnut Chart
    renderDoughnutChart('sanitary-pad-chart', schemeData['sanitary-pad'], 'Sanitary Pads Distributed');
    
    // CWSN Support Scheme - Radar Chart
    renderRadarChart('cwsn-chart', schemeData.cwsn, 'Support Provided');
    
    // Comparison Chart - Combined data
    renderComparisonChart('comparison-chart', schemeData);
}

function updateSummaryCards(schemeData) {
    // Calculate total beneficiaries across all schemes
    let totalBeneficiaries = 0;
    Object.values(schemeData).forEach(data => {
        if (data.totalBeneficiaries) {
            totalBeneficiaries += data.totalBeneficiaries;
        }
    });
    
    document.getElementById('total-beneficiaries').textContent = totalBeneficiaries.toLocaleString();
    
    // Calculate fund utilization (example calculation)
    const fundUtilization = Math.min(100, Math.round(totalBeneficiaries / 50000 * 100));
    document.getElementById('fund-utilization').textContent = `${fundUtilization}%`;
    document.getElementById('fund-progress').style.width = `${fundUtilization}%`;
    
    // Find top district (example)
    const districts = {};
    Object.values(schemeData).forEach(data => {
        if (data.districts) {
            data.districts.forEach(district => {
                if (!districts[district.name]) districts[district.name] = 0;
                districts[district.name] += district.value;
            });
        }
    });
    
    let topDistrict = '';
    let maxValue = 0;
    for (const [district, value] of Object.entries(districts)) {
        if (value > maxValue) {
            maxValue = value;
            topDistrict = district;
        }
    }
    
    document.getElementById('top-district').textContent = topDistrict || '-';
    document.getElementById('top-district-value').textContent = `${maxValue.toLocaleString()} beneficiaries`;
}

function initDistrictSelector(schemeData) {
    const selector = document.getElementById('district-selector');
    
    // Get unique districts from all schemes
    const districts = new Set();
    Object.values(schemeData).forEach(data => {
        if (data.districts) {
            data.districts.forEach(district => {
                districts.add(district.name);
            });
        }
    });
    
    // Add options to selector
    districts.forEach(district => {
        const option = document.createElement('option');
        option.value = district;
        option.textContent = district;
        selector.appendChild(option);
    });
    
    // Add event listener for filtering
    selector.addEventListener('change', function() {
        const selectedDistrict = this.value;
        filterChartsByDistrict(selectedDistrict, schemeData);
    });
}

function filterChartsByDistrict(district, schemeData) {
    if (district === 'all') {
        // Show all data
        renderAllCharts(schemeData);
        return;
    }
    
    // Filter data for each chart by district
    const filteredData = {};
    
    for (const [schemeId, data] of Object.entries(schemeData)) {
        if (data.districts) {
            const districtData = data.districts.find(d => d.name === district);
            if (districtData) {
                filteredData[schemeId] = {
                    ...data,
                    districts: [districtData],
                    labels: [district],
                    datasets: data.datasets.map(dataset => ({
                        ...dataset,
                        data: [dataset.data[data.labels.indexOf(district)]]
                    }))
                };
            }
        }
    }
    
    // Re-render charts with filtered data
    renderAllCharts(filteredData);
}