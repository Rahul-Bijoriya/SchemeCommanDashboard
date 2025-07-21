// Chart configuration utilities

function renderBarChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor || getDefaultColors(data.labels.length),
                borderColor: dataset.borderColor || '#fff',
                borderWidth: 1
            }))
        },
        options: getChartOptions(label, data.labels.length > 5)
    });
}

function renderPieChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                label: label,
                data: data.datasets[0].data,
                backgroundColor: getDefaultColors(data.labels.length),
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: getChartOptions(label)
    });
}

function renderLineChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: data.labels,
            datasets: data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)',
                borderColor: dataset.borderColor || 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                fill: true,
                tension: 0.4
            }))
        },
        options: getChartOptions(label, data.labels.length > 5)
    });
}

function renderStackedBarChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: data.datasets.map((dataset, i) => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor || getDefaultColors(data.datasets.length)[i],
                borderColor: dataset.borderColor || '#fff',
                borderWidth: 1
            }))
        },
        options: {
            ...getChartOptions(label, data.labels.length > 5),
            scales: {
                x: { stacked: true },
                y: { stacked: true }
            }
        }
    });
}

function renderDoughnutChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: data.labels,
            datasets: [{
                label: label,
                data: data.datasets[0].data,
                backgroundColor: getDefaultColors(data.labels.length),
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: getChartOptions(label)
    });
}

function renderRadarChart(canvasId, data, label) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    new Chart(ctx, {
        type: 'radar',
        data: {
            labels: data.labels,
            datasets: data.datasets.map(dataset => ({
                label: dataset.label,
                data: dataset.data,
                backgroundColor: dataset.backgroundColor || 'rgba(75, 192, 192, 0.2)',
                borderColor: dataset.borderColor || 'rgba(75, 192, 192, 1)',
                borderWidth: 2,
                pointBackgroundColor: 'rgba(75, 192, 192, 1)'
            }))
        },
        options: getChartOptions(label)
    });
}

function renderComparisonChart(canvasId, schemeData) {
    const ctx = document.getElementById(canvasId).getContext('2d');
    
    // Prepare comparison data
    const labels = Object.keys(schemeData);
    const datasets = [];
    
    // Example: Compare total beneficiaries across schemes
    labels.forEach(schemeId => {
        const data = schemeData[schemeId];
        if (data.totalBeneficiaries) {
            datasets.push({
                label: data.schemeName,
                data: [data.totalBeneficiaries],
                backgroundColor: getDefaultColors(labels.length)[labels.indexOf(schemeId)]
            });
        }
    });
    
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels.map(id => schemeData[id].schemeName),
            datasets: datasets
        },
        options: getChartOptions('Total Beneficiaries Comparison')
    });
}

function getChartOptions(label, rotateLabels = false) {
    return {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: 'circle',
                    font: {
                        family: 'Poppins',
                        size: 12
                    }
                }
            },
            title: {
                display: true,
                text: label,
                font: {
                    family: 'Poppins',
                    size: 14,
                    weight: '500'
                },
                padding: {
                    bottom: 10
                }
            },
            tooltip: {
                enabled: true,
                mode: 'index',
                intersect: false,
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleFont: {
                    family: 'Poppins',
                    size: 12,
                    weight: 'bold'
                },
                bodyFont: {
                    family: 'Poppins',
                    size: 12
                },
                padding: 10,
                cornerRadius: 4
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 12
                    },
                    maxRotation: rotateLabels ? 45 : 0,
                    minRotation: rotateLabels ? 45 : 0
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)'
                },
                ticks: {
                    font: {
                        family: 'Poppins',
                        size: 12
                    },
                    callback: function(value) {
                        if (value >= 1000000) {
                            return (value / 1000000).toFixed(1) + 'M';
                        }
                        if (value >= 1000) {
                            return (value / 1000).toFixed(1) + 'K';
                        }
                        return value;
                    }
                }
            }
        },
        animation: {
            duration: 1000
        },
        elements: {
            bar: {
                borderRadius: 4
            }
        }
    };
}

function getDefaultColors(count) {
    const colorPalette = [
        '#0f4c81', '#4b8bbe', '#ff6b6b', '#ffb347', '#2ecc71', 
        '#9b59b6', '#e74c3c', '#3498db', '#f1c40f', '#1abc9c'
    ];
    
    // If we need more colors than the palette, generate random ones
    if (count > colorPalette.length) {
        const additionalColors = [];
        for (let i = 0; i < count - colorPalette.length; i++) {
            additionalColors.push(`hsl(${Math.floor(Math.random() * 360)}, 70%, 60%)`);
        }
        return [...colorPalette, ...additionalColors];
    }
    
    return colorPalette.slice(0, count);
}