// DOM Elements
const statsGrid = document.querySelector('.stats-grid');
const practiceChart = document.querySelector('.practice-chart');
const categoryDistribution = document.querySelector('.category-distribution');
const statsCategoryFilter = document.querySelector('.stats-category-filter');
const statsDateInputs = document.querySelectorAll('.stats-date-input');

// Default categories (fallback if none are found)
const defaultCategories = [
    { id: 'c-1', name: 'Scales', isHidden: false },
    { id: 'c-2', name: 'Technique', isHidden: false },
    { id: 'c-3', name: 'Repertoire', isHidden: false },
    { id: 'c-4', name: 'Sight Reading', isHidden: false },
    { id: 'c-5', name: 'Theory', isHidden: false }
];

// Initialize stats page
const initializeStats = () => {
    console.log('Initializing stats page');
    
    // Get the stats container
    const statsPage = document.getElementById('stats-page');
    if (!statsPage) {
        console.error('Stats page not found');
        return;
    }
    
    // Get or create stats container
    let statsContainer = statsPage.querySelector('.stats-container');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        statsPage.appendChild(statsContainer);
    }
    
    // Set up filters
    setupStatsFilters();
    
    // Set default dates (last 7 days)
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    // Format dates in YYYY-MM-DD format
    const todayStr = today.toISOString().split('T')[0];
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    // Set date inputs
    const statsDateInputs = document.querySelectorAll('.stats-date-input');
    if (statsDateInputs && statsDateInputs.length >= 2) {
        statsDateInputs[0].value = weekAgoStr;
        statsDateInputs[1].value = todayStr;
    }
    
    // Display initial stats with default filter values
    const categoryFilter = document.querySelector('.stats-category-filter');
    const category = categoryFilter ? categoryFilter.value : '';
    applyStatsFilters(category, weekAgoStr, todayStr);
};

// Setup stats filters
const setupStatsFilters = () => {
    // Get filter elements
    const categoryFilter = document.querySelector('.stats-category-filter');
    const dateInputs = document.querySelectorAll('.stats-date-input');
    const filtersSection = document.querySelector('.filters');
    
    if (!filtersSection) return;
    
    // Remove any existing buttons
    const prevButtons = document.querySelectorAll('.filter-button');
    prevButtons.forEach(btn => btn.remove());
    
    // Populate categories if needed
    if (categoryFilter && categoryFilter.options.length <= 1) {
        // Add categories
        const categories = getItems('CATEGORIES') || defaultCategories;
        categories.forEach(category => {
            if (!category.isHidden) {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categoryFilter.appendChild(option);
            }
        });
    }
    
    // Create apply button
    const applyButton = document.createElement('button');
    applyButton.className = 'primary-button filter-button';
    applyButton.textContent = 'Apply Filters';
    applyButton.style.marginLeft = '10px';
    
    // Add click event
    applyButton.addEventListener('click', function() {
        // Get current values
        const category = categoryFilter ? categoryFilter.value : '';
        const startDate = dateInputs && dateInputs.length > 0 ? dateInputs[0].value : '';
        const endDate = dateInputs && dateInputs.length > 1 ? dateInputs[1].value : '';
        
        // Apply filters
        applyStatsFilters(category, startDate, endDate);
    });
    
    // Add to filters section
    filtersSection.appendChild(applyButton);
};

// Apply stats filters and display results
function applyStatsFilters(category, startDate, endDate) {
    // Get sessions data
    let sessions = getItems('SESSIONS') || [];
    
    if (sessions.length === 0) {
        sessions = generateSampleSessionData();
        localStorage.setItem('practice_sessions', JSON.stringify(sessions));
    }
    
    // Apply filters
    let filtered = [...sessions];
    
    // Category filter
    if (category) {
        filtered = filtered.filter(s => s.categoryId === category);
    }
    
    // Date filters
    if (startDate) {
        const startObj = new Date(startDate);
        startObj.setHours(0, 0, 0, 0);
        filtered = filtered.filter(s => {
            if (!s.startTime) return false;
            return new Date(s.startTime) >= startObj;
        });
    }
    
    if (endDate) {
        const endObj = new Date(endDate);
        endObj.setHours(23, 59, 59, 999);
        filtered = filtered.filter(s => {
            if (!s.startTime) return false;
            return new Date(s.startTime) <= endObj;
        });
    }
    
    // Display the filtered data
    displayStatsData(filtered);
}

// Display stats data
function displayStatsData(sessions) {
    // Get the stats container
    const statsPage = document.getElementById('stats-page');
    if (!statsPage) return;
    
    let statsContainer = statsPage.querySelector('.stats-container');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        statsPage.appendChild(statsContainer);
    }
    
    // Clear existing stats
    statsContainer.innerHTML = '';
    
    // If no sessions, show empty state
    if (!sessions || sessions.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i data-lucide="bar-chart-2"></i>
            <p>No practice data to display. Start practicing to see your stats!</p>
        `;
        statsContainer.appendChild(emptyState);
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        return;
    }
    
    // Calculate basic stats
    const totalDuration = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const averageDuration = Math.round(totalDuration / sessions.length);
    const sessionCount = sessions.length;
    
    // Create stats cards
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    statsGrid.style.display = 'grid';
    statsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    statsGrid.style.gap = '20px';
    statsGrid.style.marginBottom = '30px';
    
    statsGrid.innerHTML = `
        <div class="stat-card" style="background-color: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom:10px;">Total Practice Time</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">${formatTime(totalDuration)}</p>
        </div>
        <div class="stat-card" style="background-color: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom:10px;">Average Session Time</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">${formatTime(averageDuration)}</p>
        </div>
        <div class="stat-card" style="background-color: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3 style="margin-bottom:10px;">Practice Sessions</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">${sessionCount}</p>
        </div>
    `;
    
    statsContainer.appendChild(statsGrid);
    
    // Create charts
    createPracticeTimeChart(statsContainer, sessions);
    createCategoryDistributionChart(statsContainer, sessions);
}

// Format time display
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Create practice time chart
function createPracticeTimeChart(container, sessions) {
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'practice-chart';
    const practiceCanvas = document.createElement('canvas');
    practiceCanvas.id = 'practice-time-chart';
    chartContainer.appendChild(practiceCanvas);
    
    // Add to container
    container.appendChild(chartContainer);
    
    // Create practice time chart
    const practiceCtx = document.getElementById('practice-time-chart');
    if (practiceCtx && window.Chart) {
        // Calculate daily practice times
        const dailyTimes = {};
        
        sessions.forEach(session => {
            if (!session.startTime) return;
            
            // Get date part only
            const date = session.startTime.split('T')[0];
            
            // Add duration to daily total
            if (!dailyTimes[date]) {
                dailyTimes[date] = 0;
            }
            
            dailyTimes[date] += session.duration || 0;
        });
        
        // Sort dates
        const sortedDates = Object.keys(dailyTimes).sort();
        
        // Create chart
        new Chart(practiceCtx, {
            type: 'bar',
            data: {
                labels: sortedDates.map(date => formatDate(date)),
                datasets: [{
                    label: 'Practice Time (minutes)',
                    data: sortedDates.map(date => Math.round(dailyTimes[date] / 60)),
                    backgroundColor: 'rgba(65, 84, 179, 0.7)',
                    borderColor: 'rgba(65, 84, 179, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Minutes'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Practice Time',
                        font: {
                            size: 16
                        }
                    },
                    legend: {
                        display: false
                    }
                }
            }
        });
    }
}

// Create category distribution chart
function createCategoryDistributionChart(container, sessions) {
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'category-distribution';
    const categoryCanvas = document.createElement('canvas');
    categoryCanvas.id = 'category-distribution-chart';
    chartContainer.appendChild(categoryCanvas);
    
    // Add to container
    container.appendChild(chartContainer);
    
    // Create category distribution chart
    const categoryCtx = document.getElementById('category-distribution-chart');
    if (categoryCtx && window.Chart) {
        // Get categories
        const categories = getItems('CATEGORIES') || defaultCategories;
        
        // Calculate time per category
        const categoryTimes = {};
        sessions.forEach(session => {
            if (!session.categoryId) return;
            
            if (!categoryTimes[session.categoryId]) {
                categoryTimes[session.categoryId] = 0;
            }
            
            categoryTimes[session.categoryId] += session.duration || 0;
        });
        
        // Filter to categories that actually have data
        const categoriesWithData = categories.filter(cat => categoryTimes[cat.id] > 0);
        
        // Create chart
        new Chart(categoryCtx, {
            type: 'pie',
            data: {
                labels: categoriesWithData.map(cat => cat.name),
                datasets: [{
                    data: categoriesWithData.map(cat => categoryTimes[cat.id]),
                    backgroundColor: categoriesWithData.map(() => 
                        `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.7)`
                    )
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    title: {
                        display: true,
                        text: 'Practice Time by Category',
                        font: {
                            size: 16
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => {
                                const value = context.raw;
                                const percentage = Math.round((value / sessions.reduce((sum, s) => sum + (s.duration || 0), 0)) * 100);
                                return `${formatTime(value)} (${percentage}%)`;
                            }
                        }
                    }
                }
            }
        });
    }
}

// Helper function to get category name
function getCategoryName(categoryId) {
    const categories = getItems('CATEGORIES') || defaultCategories;
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// Format date for display
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
}

// Generate sample session data for testing
const generateSampleSessionData = () => {
    console.log('Generating sample session data');
    
    const categories = getItems('CATEGORIES') || defaultCategories;
    const categoryIds = categories.map(c => c.id);
    
    // Generate sessions for the last 14 days
    const sessions = [];
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 14);
    
    // Create 1-3 sessions per day
    let currentDate = new Date(startDate);
    while (currentDate <= endDate) {
        const sessionsPerDay = Math.floor(Math.random() * 3) + 1;
        
        for (let i = 0; i < sessionsPerDay; i++) {
            const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
            const duration = (Math.floor(Math.random() * 6) + 1) * 15 * 60; // 15-90 minutes in seconds
            
            const session = {
                id: `s-${Date.now()}-${i}`,
                categoryId,
                startTime: new Date(currentDate).toISOString(),
                duration,
                notes: `Sample practice session`,
                isManual: true,
                isLesson: Math.random() > 0.8,
                createdAt: new Date(currentDate).toISOString(),
                updatedAt: new Date(currentDate).toISOString()
            };
            
            sessions.push(session);
        }
        
        // Next day
        currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return sessions;
};

// Expose to window object
window.initializeStats = initializeStats;
window.applyStatsFilters = applyStatsFilters; 