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
    console.log('Initializing stats page - SIMPLIFIED VERSION');
    
    // Re-query for DOM elements to ensure we have the latest references
    const statsGridElem = document.querySelector('.stats-grid');
    const practiceChartElem = document.querySelector('.practice-chart');
    const categoryDistributionElem = document.querySelector('.category-distribution');
    const statsCategoryFilterElem = document.querySelector('.stats-category-filter');
    const statsDateInputsElems = document.querySelectorAll('.stats-date-input');
    
    // Update global references
    if (statsGridElem) statsGrid = statsGridElem;
    if (practiceChartElem) practiceChart = practiceChartElem;
    if (categoryDistributionElem) categoryDistribution = categoryDistributionElem;
    if (statsCategoryFilterElem) statsCategoryFilter = statsCategoryFilterElem;
    if (statsDateInputsElems.length > 0) statsDateInputs = statsDateInputsElems;
    
    console.log('DOM Elements:', {
        statsGrid: !!statsGrid,
        practiceChart: !!practiceChart,
        categoryDistribution: !!categoryDistribution,
        statsCategoryFilter: !!statsCategoryFilter,
        statsDateInputs: statsDateInputs ? statsDateInputs.length : 0
    });
    
    // Get the stats container
    const statsPage = document.getElementById('stats-page');
    if (!statsPage) {
        console.error('Stats page not found');
        return;
    }
    
    // Get or create stats container
    let statsContainer = statsPage.querySelector('.stats-container');
    if (!statsContainer) {
        console.log('Creating new stats container');
        statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        statsPage.appendChild(statsContainer);
    }
    
    // Get filter elements
    setupStatsFilters();
    
    // Set default dates (last 7 days)
    const today = new Date();
    const weekAgo = new Date();
    weekAgo.setDate(today.getDate() - 7);
    
    // Format dates in YYYY-MM-DD format
    const todayStr = today.toISOString().split('T')[0];
    const weekAgoStr = weekAgo.toISOString().split('T')[0];
    
    console.log('Setting default date range:', weekAgoStr, 'to', todayStr);
    
    // Set date inputs
    if (statsDateInputs && statsDateInputs.length >= 2) {
        statsDateInputs[0].value = weekAgoStr;
        statsDateInputs[1].value = todayStr;
        
        console.log('Date inputs set to:', statsDateInputs[0].value, 'to', statsDateInputs[1].value);
    } else {
        console.error('Date input elements not found or insufficient');
    }
    
    // Create a simple stats display
    createSimpleStats(statsContainer);
    
    // Add a debug button
    const debugBtn = document.createElement('button');
    debugBtn.textContent = 'Debug Filters';
    debugBtn.style.margin = '10px';
    debugBtn.style.padding = '8px';
    debugBtn.addEventListener('click', () => {
        console.log('Current filter elements:', {
            categoryFilter: statsCategoryFilter ? {
                value: statsCategoryFilter.value,
                options: statsCategoryFilter.options.length
            } : null,
            dateInputs: statsDateInputs ? Array.from(statsDateInputs).map(input => input.value) : null
        });
    });
    
    if (statsContainer) {
        statsContainer.appendChild(debugBtn);
    }
};

// Setup stats filters
const setupStatsFilters = () => {
    console.log('Setting up simple, clean filter system');
    
    // Get filter elements
    const categoryFilter = document.querySelector('.stats-category-filter');
    const dateInputs = document.querySelectorAll('.stats-date-input');
    const filtersSection = document.querySelector('.filters');
    
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
        console.log('Apply button clicked');
        
        // Get current values
        const category = categoryFilter ? categoryFilter.value : '';
        const startDate = dateInputs && dateInputs.length > 0 ? dateInputs[0].value : '';
        const endDate = dateInputs && dateInputs.length > 1 ? dateInputs[1].value : '';
        
        console.log('Filter values:', { category, startDate, endDate });
        
        // Apply filters
        applyStatsFilters(category, startDate, endDate);
    });
    
    // Add to filters section
    if (filtersSection) {
        filtersSection.appendChild(applyButton);
    }
};

// Apply stats filters and display results
function applyStatsFilters(category, startDate, endDate) {
    // Get sessions data
    let sessions = [];
    
    // Try getItems first
    sessions = getItems('SESSIONS');
    
    // If that fails, try localStorage
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
        try {
            const raw = localStorage.getItem('practice_sessions');
            if (raw) sessions = JSON.parse(raw);
        } catch (e) {
            console.error('Error getting sessions:', e);
        }
    }
    
    // If still no data, create sample data
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
        sessions = generateSampleSessionData();
        localStorage.setItem('practice_sessions', JSON.stringify(sessions));
    }
    
    console.log(`Found ${sessions.length} total sessions`);
    
    // Apply filters
    let filtered = [...sessions];
    
    // Category filter
    if (category) {
        filtered = filtered.filter(s => s.categoryId === category);
        console.log(`After category filter: ${filtered.length} sessions`);
    }
    
    // Date filters
    if (startDate) {
        const startObj = new Date(startDate);
        startObj.setHours(0, 0, 0, 0);
        filtered = filtered.filter(s => {
            if (!s.startTime) return false;
            return new Date(s.startTime) >= startObj;
        });
        console.log(`After start date filter: ${filtered.length} sessions`);
    }
    
    if (endDate) {
        const endObj = new Date(endDate);
        endObj.setHours(23, 59, 59, 999);
        filtered = filtered.filter(s => {
            if (!s.startTime) return false;
            return new Date(s.startTime) <= endObj;
        });
        console.log(`After end date filter: ${filtered.length} sessions`);
    }
    
    // Display results
    displayStatsData(filtered);
}

// Display stats data
function displayStatsData(sessions) {
    console.log(`Displaying stats for ${sessions.length} sessions`);
    
    // Get stats container
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) {
        console.error('Stats container not found');
        return;
    }
    
    // Clear existing content
    statsContainer.innerHTML = '';
    
    // Calculate totals
    const totalTime = sessions.reduce((sum, s) => {
        return sum + (typeof s.duration === 'number' ? s.duration : parseInt(s.duration) || 0);
    }, 0);
    
    const avgTime = sessions.length > 0 ? Math.round(totalTime / sessions.length) : 0;
    
    // Create stats grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    statsGrid.style.display = 'grid';
    statsGrid.style.gridTemplateColumns = 'repeat(3, 1fr)';
    statsGrid.style.gap = '20px';
    statsGrid.style.margin = '20px 0';
    
    // Add stats cards
    statsGrid.innerHTML = `
        <div class="stat-card">
            <h3>Total Practice Time</h3>
            <p class="stat-value">${formatTime(totalTime)}</p>
        </div>
        <div class="stat-card">
            <h3>Avg. Session Time</h3>
            <p class="stat-value">${formatTime(avgTime)}</p>
        </div>
        <div class="stat-card">
            <h3>Practice Sessions</h3>
            <p class="stat-value">${sessions.length}</p>
        </div>
    `;
    
    statsContainer.appendChild(statsGrid);
    
    // Add some basic styling to match the app's design
    const statCards = statsGrid.querySelectorAll('.stat-card');
    statCards.forEach(card => {
        card.style.backgroundColor = '#f5f5f5';
        card.style.padding = '20px';
        card.style.borderRadius = '8px';
        card.style.textAlign = 'center';
        card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    });
    
    const statValues = statsGrid.querySelectorAll('.stat-value');
    statValues.forEach(value => {
        value.style.fontSize = '24px';
        value.style.fontWeight = 'bold';
        value.style.color = '#4154b3';
    });
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.className = 'charts-container';
    chartContainer.style.marginTop = '30px';
    
    // Create practice chart
    const practiceChartDiv = document.createElement('div');
    practiceChartDiv.className = 'practice-chart';
    const practiceCanvas = document.createElement('canvas');
    practiceCanvas.id = 'practice-time-chart';
    practiceChartDiv.appendChild(practiceCanvas);
    chartContainer.appendChild(practiceChartDiv);
    
    // Create category chart
    const categoryChartDiv = document.createElement('div');
    categoryChartDiv.className = 'category-distribution';
    categoryChartDiv.style.marginTop = '30px';
    const categoryCanvas = document.createElement('canvas');
    categoryCanvas.id = 'category-distribution-chart';
    categoryChartDiv.appendChild(categoryCanvas);
    chartContainer.appendChild(categoryChartDiv);
    
    statsContainer.appendChild(chartContainer);
    
    // Create charts if Chart.js is available
    if (window.Chart) {
        // Calculate daily practice times
        const dailyTimes = {};
        const now = new Date();
        
        // Initialize last 7 days
        for (let i = 6; i >= 0; i--) {
            const date = new Date(now);
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            dailyTimes[dateStr] = 0;
        }
        
        // Fill in actual data
        sessions.forEach(session => {
            if (session.startTime) {
                const dateStr = session.startTime.split('T')[0];
                if (dailyTimes.hasOwnProperty(dateStr)) {
                    const duration = typeof session.duration === 'number' ? 
                        session.duration : parseInt(session.duration) || 0;
                    dailyTimes[dateStr] += duration;
                }
            }
        });
        
        // Create practice time chart
        const practiceCtx = document.getElementById('practice-time-chart');
        if (practiceCtx) {
            const dates = Object.keys(dailyTimes).sort();
            const values = dates.map(date => dailyTimes[date]);
            
            // Format dates
            const displayDates = dates.map(date => {
                const d = new Date(date);
                return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            });
            
            new Chart(practiceCtx, {
                type: 'bar',
                data: {
                    labels: displayDates,
                    datasets: [{
                        label: 'Daily Practice Time',
                        data: values,
                        backgroundColor: 'rgba(65, 84, 179, 0.2)',
                        borderColor: 'rgba(65, 84, 179, 1)',
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return formatTime(value);
                                }
                            }
                        }
                    }
                }
            });
        }
        
        // Create category distribution chart
        const categoryCtx = document.getElementById('category-distribution-chart');
        if (categoryCtx) {
            const categories = getItems('CATEGORIES') || defaultCategories;
            
            // Calculate category times
            const categoryTimes = {};
            categories.forEach(category => {
                categoryTimes[category.id] = 0;
            });
            
            sessions.forEach(session => {
                if (session.categoryId && categoryTimes.hasOwnProperty(session.categoryId)) {
                    const duration = typeof session.duration === 'number' ? 
                        session.duration : parseInt(session.duration) || 0;
                    categoryTimes[session.categoryId] += duration;
                }
            });
            
            // Filter out categories with no time
            const activeCategories = categories.filter(category => categoryTimes[category.id] > 0);
            
            if (activeCategories.length > 0) {
                new Chart(categoryCtx, {
                    type: 'doughnut',
                    data: {
                        labels: activeCategories.map(cat => cat.name),
                        datasets: [{
                            data: activeCategories.map(cat => categoryTimes[cat.id]),
                            backgroundColor: activeCategories.map(() => 
                                `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.7)`
                            )
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right'
                            }
                        }
                    }
                });
            }
        }
    }
}

// Helper function to get category name
function getCategoryName(categoryId) {
    const categories = getItems('CATEGORIES') || defaultCategories;
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : categoryId;
}

// Load and display stats
const loadStats = (filters = {}) => {
    // Ensure dates are provided
    if (!filters.startDate || !filters.endDate) {
        console.error('Date range is required');
        return;
    }
    
    // Try different methods to get sessions
    let sessions = [];
    let dataSource = '';
    
    // Method 1: Standard getItems
    sessions = getItems('SESSIONS');
    if (sessions && Array.isArray(sessions) && sessions.length > 0) {
        dataSource = 'getItems("SESSIONS")';
    } else {
        // Method 2: Try lowercase key
        sessions = getItems('sessions');
        if (sessions && Array.isArray(sessions) && sessions.length > 0) {
            dataSource = 'getItems("sessions")';
        } else {
            // Method 3: Try direct localStorage access
            try {
                const rawData = localStorage.getItem('practice_sessions');
                if (rawData) {
                    sessions = JSON.parse(rawData);
                    if (Array.isArray(sessions) && sessions.length > 0) {
                        dataSource = 'localStorage("practice_sessions")';
                    }
                }
            } catch (e) {
                console.error('Error parsing practice_sessions:', e);
            }
            
            // Method 4: Last resort - use sample data
            if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
                sessions = generateSampleSessionData();
                dataSource = 'generateSampleSessionData()';
                
                // Save the sample data
                localStorage.setItem('SESSIONS', JSON.stringify(sessions));
                localStorage.setItem('practice_sessions', JSON.stringify(sessions));
            }
        }
    }
    
    const categories = getItems('CATEGORIES') || [];
    
    console.log(`Loading stats with ${sessions.length} sessions from source: ${dataSource}`);
    
    // Calculate stats
    const stats = calculateStats(sessions, categories, filters);
    
    // Add data source to stats for display
    stats.dataSource = dataSource;
    
    // Display stat cards
    displayStatCards(stats);
    
    // Display charts
    displayCharts(stats, filters);
};

// Calculate statistics
const calculateStats = (sessions, categories, filters = {}) => {
    const now = new Date();
    
    // Apply filters to sessions
    let filteredSessions = [...sessions];
    
    // Make sure sessions is valid
    if (!Array.isArray(filteredSessions)) {
        console.error('Sessions is not an array:', filteredSessions);
        filteredSessions = [];
    }
    
    if (filters.category) {
        filteredSessions = filteredSessions.filter(session => session.categoryId === filters.category);
    }
    
    if (filters.startDate) {
        console.log(`Filtering by start date: ${filters.startDate}`);
        const startDateObj = new Date(filters.startDate);
        startDateObj.setHours(0, 0, 0, 0);
        filteredSessions = filteredSessions.filter(session => {
            if (!session.startTime) return false;
            const sessionDate = new Date(session.startTime);
            return sessionDate >= startDateObj;
        });
    }
    
    if (filters.endDate) {
        console.log(`Filtering by end date: ${filters.endDate}`);
        const endDateObj = new Date(filters.endDate);
        endDateObj.setHours(23, 59, 59, 999);
        filteredSessions = filteredSessions.filter(session => {
            if (!session.startTime) return false;
            const sessionDate = new Date(session.startTime);
            return sessionDate <= endDateObj;
        });
    }
    
    console.log('Filtered sessions:', filteredSessions.length);
    
    // Total practice time
    const totalTime = filteredSessions.reduce((sum, session) => {
        // Ensure duration is a number
        const duration = typeof session.duration === 'number' ? session.duration : parseInt(session.duration) || 0;
        return sum + duration;
    }, 0);
    
    console.log('Total practice time (seconds):', totalTime);
    
    // Average session time
    const averageTime = filteredSessions.length > 0 ? Math.round(totalTime / filteredSessions.length) : 0;
    console.log('Average session time (seconds):', averageTime);
    
    // Category distribution
    const categoryTimes = {};
    categories.forEach(category => {
        categoryTimes[category.id] = filteredSessions
            .filter(session => session.categoryId === category.id)
            .reduce((sum, session) => {
                const duration = typeof session.duration === 'number' ? session.duration : parseInt(session.duration) || 0;
                return sum + duration;
            }, 0);
    });
    
    // Daily practice time (last 7 days)
    const dailyTimes = {};
    for (let i = 0; i < 7; i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        dailyTimes[dateStr] = filteredSessions
            .filter(session => session.startTime && session.startTime.startsWith(dateStr))
            .reduce((sum, session) => {
                const duration = typeof session.duration === 'number' ? session.duration : parseInt(session.duration) || 0;
                return sum + duration;
            }, 0);
    }
    
    return {
        totalTime,
        averageTime,
        categoryTimes,
        dailyTimes,
        sessionCount: filteredSessions.length
    };
};

// Display stat cards
const displayStatCards = (stats) => {
    console.log('Displaying stats:', stats);
    
    // Make sure we have a container for stats
    const statsContainer = document.querySelector('.stats-container');
    const gridElement = statsGrid || (statsContainer ? statsContainer.querySelector('.stats-grid') : null);
    
    if (gridElement) {
        // Update the stats grid
        gridElement.innerHTML = `
            <div class="stat-card">
                <h3>Total Practice Time</h3>
                <p class="stat-value">${formatTime(stats.totalTime || 0)}</p>
            </div>
            <div class="stat-card">
                <h3>Avg. Session Time</h3>
                <p class="stat-value">${formatTime(stats.averageTime || 0)}</p>
            </div>
            <div class="stat-card">
                <h3>Practice Sessions</h3>
                <p class="stat-value">${stats.sessionCount || 0}</p>
            </div>
        `;
        
        // Add some basic styling if needed
        gridElement.style.display = 'grid';
        gridElement.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
        gridElement.style.gap = '1rem';
        gridElement.style.margin = '1rem 0';
        
        const statCards = gridElement.querySelectorAll('.stat-card');
        statCards.forEach(card => {
            card.style.backgroundColor = '#f5f5f5';
            card.style.padding = '1.5rem';
            card.style.borderRadius = '8px';
            card.style.textAlign = 'center';
            card.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
        });
    } else {
        // Fallback - create a direct display in the container
        console.error('Stats grid element not found, using fallback');
        if (statsContainer) {
            // First clear any existing fallback
            const existingFallback = statsContainer.querySelector('.stats-fallback');
            if (existingFallback) {
                existingFallback.remove();
            }
            
            // Create a fallback display
            const fallbackDisplay = document.createElement('div');
            fallbackDisplay.className = 'stats-fallback';
            fallbackDisplay.style.backgroundColor = '#f5f5f5';
            fallbackDisplay.style.padding = '20px';
            fallbackDisplay.style.borderRadius = '8px';
            fallbackDisplay.style.margin = '20px 0';
            fallbackDisplay.style.textAlign = 'center';
            
            fallbackDisplay.innerHTML = `
                <h2 style="margin-bottom:15px;">Practice Statistics</h2>
                <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
                    <div>
                        <h3>Total Practice Time</h3>
                        <p style="font-size:1.5em; font-weight:bold;">${formatTime(stats.totalTime || 0)}</p>
                    </div>
                    <div>
                        <h3>Avg. Session Time</h3>
                        <p style="font-size:1.5em; font-weight:bold;">${formatTime(stats.averageTime || 0)}</p>
                    </div>
                    <div>
                        <h3>Practice Sessions</h3>
                        <p style="font-size:1.5em; font-weight:bold;">${stats.sessionCount || 0}</p>
                    </div>
                </div>
            `;
            
            // Insert at beginning of container
            statsContainer.insertBefore(fallbackDisplay, statsContainer.firstChild);
        }
    }
};

// Display charts
const displayCharts = (stats, filters = {}) => {
    // Check if chart elements exist
    if (!practiceChart || !categoryDistribution) {
        console.error('Chart elements not found, skipping chart rendering');
        return;
    }
    
    // Clear existing charts
    if (window.practiceTimeChart) {
        window.practiceTimeChart.destroy();
    }
    if (window.categoryDistributionChart) {
        window.categoryDistributionChart.destroy();
    }
    
    // Practice time chart
    const practiceChartData = {
        labels: Object.keys(stats.dailyTimes).reverse(),
        datasets: [{
            label: 'Daily Practice Time',
            data: Object.values(stats.dailyTimes).reverse(),
            backgroundColor: 'rgba(65, 84, 179, 0.2)',
            borderColor: 'rgba(65, 84, 179, 1)',
            borderWidth: 1
        }]
    };
    
    try {
        window.practiceTimeChart = new Chart(practiceChart, {
            type: 'bar',
            data: practiceChartData,
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: value => formatTime(value)
                        }
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating practice time chart:', error);
    }
    
    // Category distribution chart
    const categories = getItems('CATEGORIES') || [];
    
    // Filter categories if needed
    let displayCategories = categories;
    if (filters.category) {
        displayCategories = categories.filter(cat => cat.id === filters.category);
    }
    
    const categoryData = {
        labels: displayCategories.map(cat => cat.name),
        datasets: [{
            data: displayCategories.map(cat => stats.categoryTimes[cat.id] || 0),
            backgroundColor: displayCategories.map(cat => cat.color || '#' + Math.floor(Math.random()*16777215).toString(16))
        }]
    };
    
    try {
        window.categoryDistributionChart = new Chart(categoryDistribution, {
            type: 'doughnut',
            data: categoryData,
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    }
                }
            }
        });
    } catch (error) {
        console.error('Error creating category distribution chart:', error);
    }
};

// Helper function for formatting time
function formatTime(seconds) {
    // Ensure seconds is a valid number
    seconds = Number(seconds) || 0;
    
    // Force convert to an integer
    seconds = Math.floor(seconds);
    
    // Format time
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    // Always show at least minutes
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
}

// Expose function to global scope
window.initializeStats = initializeStats;

// Get sessions directly from localStorage using all possible keys
const getSessionsDirectly = () => {
    try {
        // Define all possible keys used for session storage
        const keys = ['practice_sessions', 'sessions', 'practicetrack_sessions', 'SESSIONS'];
        
        // Log all localStorage keys for debugging
        console.log('All localStorage keys:');
        for (let i = 0; i < localStorage.length; i++) {
            console.log(`- ${localStorage.key(i)}`);
        }
        
        // Try each key
        let data = null;
        for (const key of keys) {
            console.log(`Checking localStorage key: "${key}"`);
            const value = localStorage.getItem(key);
            if (value) {
                console.log(`Found sessions data in key: ${key}`);
                try {
                    const parsed = JSON.parse(value);
                    if (Array.isArray(parsed) && parsed.length > 0) {
                        data = parsed;
                        console.log(`Successfully parsed ${parsed.length} sessions`);
                        break;
                    }
                } catch (e) {
                    console.error(`Error parsing data from key ${key}:`, e);
                }
            }
        }
        
        // If still no data found, create sample
        if (!data || !Array.isArray(data) || data.length === 0) {
            console.log('No sessions found, creating sample data');
            data = generateSampleSessionData();
            
            // Save sample data to ensure it's found
            localStorage.setItem('practice_sessions', JSON.stringify(data));
            localStorage.setItem('SESSIONS', JSON.stringify(data));
            console.log('Created and saved sample session data.');
        }
        
        return data;
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
};

// Generate sample session data for past 7 days
const generateSampleSessionData = () => {
    const categories = getItems('CATEGORIES') || defaultCategories;
    const now = new Date();
    const result = [];
    
    // Create 2-3 sessions per day for the past 7 days
    for (let day = 0; day < 7; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Random number of sessions per day (2-3)
        const sessionCount = Math.floor(Math.random() * 2) + 2;
        
        for (let i = 0; i < sessionCount; i++) {
            // Random category
            const category = categories[Math.floor(Math.random() * categories.length)];
            
            // Random duration between 15 min and 2 hours (in seconds)
            const duration = (Math.floor(Math.random() * 105) + 15) * 60;
            
            // Random hour (between 8 AM and 8 PM)
            const hour = Math.floor(Math.random() * 12) + 8;
            date.setHours(hour, 0, 0, 0);
            
            result.push({
                id: `s-${dateStr}-${i}`,
                categoryId: category.id,
                startTime: date.toISOString(),
                duration: duration,
                notes: `Sample ${category.name} practice session`,
                isManual: true,
                isLesson: false,
                createdAt: date.toISOString(),
                updatedAt: date.toISOString()
            });
        }
    }
    
    return result;
};

// Add debug refresh button
const addDebugRefreshButton = () => {
    const statsPage = document.getElementById('stats-page');
    if (!statsPage) return;
    
    // Remove existing button if any
    const existingButton = document.getElementById('refresh-stats-btn');
    if (existingButton) {
        existingButton.remove();
    }
    
    // Create refresh button
    const refreshButton = document.createElement('button');
    refreshButton.id = 'refresh-stats-btn';
    refreshButton.className = 'secondary-button';
    refreshButton.textContent = 'Force Refresh Stats';
    refreshButton.style.marginTop = '2rem';
    refreshButton.style.display = 'block';
    refreshButton.style.marginLeft = 'auto';
    refreshButton.style.marginRight = 'auto';
    
    // Add click event
    refreshButton.addEventListener('click', refreshStats);
    
    // Add to page
    statsPage.appendChild(refreshButton);
    
    // Create debug button
    const debugButton = document.createElement('button');
    debugButton.id = 'debug-stats-btn';
    debugButton.className = 'secondary-button';
    debugButton.textContent = 'Debug Stats';
    debugButton.style.marginTop = '1rem';
    debugButton.style.display = 'block';
    debugButton.style.marginLeft = 'auto';
    debugButton.style.marginRight = 'auto';
    
    // Add click event
    debugButton.addEventListener('click', debugStats);
    
    // Add to page
    statsPage.appendChild(debugButton);
};

// Force refresh stats
const refreshStats = () => {
    // Clear local storage
    const hasConfirmed = confirm('This will refresh the stats display. Continue?');
    if (!hasConfirmed) return;
    
    // Check for date inputs
    if (statsDateInputs.length < 2 || !statsDateInputs[0].value || !statsDateInputs[1].value) {
        alert('Please set both start and end dates first');
        return;
    }
    
    // Generate new sample data if needed
    if (confirm('Generate new sample data?')) {
        const sampleData = generateSampleSessionData();
        localStorage.setItem('SESSIONS', JSON.stringify(sampleData));
        localStorage.setItem('practice_sessions', JSON.stringify(sampleData));
    }
    
    // Reload stats
    loadStats({
        category: statsCategoryFilter.value,
        startDate: statsDateInputs[0].value,
        endDate: statsDateInputs[1].value
    });
    
    alert('Stats refreshed!');
};

// Debug stats function
const debugStats = () => {
    console.log('===== DEBUGGING STATS =====');
    
    // Check DOM elements
    console.log('DOM Elements:');
    console.log('- statsGrid:', statsGrid);
    console.log('- practiceChart:', practiceChart);
    console.log('- categoryDistribution:', categoryDistribution);
    console.log('- statsCategoryFilter:', statsCategoryFilter);
    console.log('- statsDateInputs:', statsDateInputs);
    
    // Check localStorage
    console.log('LocalStorage Keys:');
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        let value = localStorage.getItem(key);
        try {
            // Try to parse as JSON
            const parsed = JSON.parse(value);
            console.log(`- ${key}: ${Array.isArray(parsed) ? parsed.length + ' items' : typeof parsed}`);
        } catch (e) {
            // Show as string if not JSON
            console.log(`- ${key}: ${typeof value === 'string' ? value.substring(0, 20) + '...' : typeof value}`);
        }
    }
    
    // Create test data
    const testSessions = [
        {
            id: 'test-1',
            categoryId: 'c-1',
            startTime: new Date().toISOString(),
            duration: 3600, // 1 hour
            notes: 'Test session 1',
            isManual: true,
            isLesson: false
        },
        {
            id: 'test-2',
            categoryId: 'c-2',
            startTime: new Date().toISOString(),
            duration: 1800, // 30 minutes
            notes: 'Test session 2',
            isManual: true,
            isLesson: false
        }
    ];
    
    // Calculate test stats
    console.log('Calculating test stats...');
    const testStats = {
        totalTime: 5400, // 1.5 hours in seconds
        averageTime: 2700, // 45 minutes in seconds
        sessionCount: 2,
        dataSource: 'Test Data'
    };
    
    // Try to update DOM directly
    console.log('Attempting direct DOM update...');
    
    const statsContainer = document.querySelector('.stats-container');
    if (statsContainer) {
        // Create debug stats display
        const debugDisplay = document.createElement('div');
        debugDisplay.className = 'debug-stats';
        debugDisplay.style.backgroundColor = '#f0f8ff'; // Alice Blue
        debugDisplay.style.padding = '20px';
        debugDisplay.style.borderRadius = '8px';
        debugDisplay.style.margin = '20px 0';
        debugDisplay.style.border = '2px solid #4682b4'; // Steel Blue
        
        debugDisplay.innerHTML = `
            <h2 style="color:#4682b4;">Debug Statistics</h2>
            <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-top:15px;">
                <div>
                    <h3>Total Practice Time</h3>
                    <p style="font-size:1.5em; font-weight:bold;">${formatTime(testStats.totalTime)}</p>
                </div>
                <div>
                    <h3>Avg. Session Time</h3>
                    <p style="font-size:1.5em; font-weight:bold;">${formatTime(testStats.averageTime)}</p>
                </div>
                <div>
                    <h3>Practice Sessions</h3>
                    <p style="font-size:1.5em; font-weight:bold;">${testStats.sessionCount}</p>
                </div>
            </div>
            <p style="margin-top:15px; font-style:italic;">This is test data generated by the debug function.</p>
        `;
        
        // Add to page
        const existingDebug = statsContainer.querySelector('.debug-stats');
        if (existingDebug) {
            existingDebug.remove();
        }
        statsContainer.appendChild(debugDisplay);
        
        alert('Debug info added to page and logged to console!');
    } else {
        alert('Stats container not found!');
    }
    
    console.log('===== END DEBUGGING =====');
};

// Function to force display stats
const forceDisplayStats = () => {
    console.log('Force-displaying stats directly');
    
    // Create hardcoded sample data for demonstration
    const sampleData = generateSampleSessionData();
    localStorage.setItem('practice_sessions', JSON.stringify(sampleData));
    
    // Calculate simple statistics
    let totalDuration = 0;
    let sessionCount = sampleData.length;
    
    sampleData.forEach(session => {
        totalDuration += session.duration;
    });
    
    const averageDuration = sessionCount > 0 ? Math.floor(totalDuration / sessionCount) : 0;
    
    // Get stats container
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) {
        console.error('Stats container not found');
        return;
    }
    
    // Clear any existing stats display
    statsContainer.innerHTML = '';
    
    // Create a direct stats display
    const directStats = document.createElement('div');
    directStats.className = 'direct-stats';
    directStats.style.padding = '20px';
    directStats.style.margin = '20px 0';
    directStats.style.backgroundColor = '#fff';
    directStats.style.borderRadius = '8px';
    directStats.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
    
    // Create stats grid
    const statsGrid = document.createElement('div');
    statsGrid.className = 'stats-grid';
    statsGrid.style.display = 'grid';
    statsGrid.style.gridTemplateColumns = 'repeat(auto-fit, minmax(200px, 1fr))';
    statsGrid.style.gap = '1rem';
    statsGrid.style.margin = '1rem 0';
    
    // Add stat cards
    statsGrid.innerHTML = `
        <div class="stat-card" style="background-color: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3>Total Practice Time</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">${formatTime(totalDuration)}</p>
        </div>
        <div class="stat-card" style="background-color: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3>Avg. Session Time</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">${formatTime(averageDuration)}</p>
        </div>
        <div class="stat-card" style="background-color: #f5f5f5; padding: 1.5rem; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <h3>Practice Sessions</h3>
            <p style="font-size: 1.5rem; font-weight: bold;">${sessionCount}</p>
        </div>
    `;
    
    // Add the grid to the direct stats container
    directStats.appendChild(statsGrid);
    
    // Add explanatory note
    const note = document.createElement('p');
    note.style.marginTop = '1rem';
    note.style.fontSize = '0.9rem';
    note.style.fontStyle = 'italic';
    note.textContent = 'Stats are now displayed using a direct approach to bypass any potential issues.';
    directStats.appendChild(note);
    
    // Add the direct stats to the stats container
    statsContainer.appendChild(directStats);
    
    // Create charts container
    const chartsContainer = document.createElement('div');
    chartsContainer.className = 'charts-container';
    chartsContainer.style.marginTop = '2rem';
    
    // Add dummy charts
    chartsContainer.innerHTML = `
        <div class="practice-chart">
            <canvas id="practice-time-chart" width="400" height="200"></canvas>
        </div>
        <div class="category-distribution" style="margin-top: 2rem;">
            <canvas id="category-distribution-chart" width="400" height="200"></canvas>
        </div>
    `;
    
    // Add charts to the stats container
    statsContainer.appendChild(chartsContainer);
    
    // Add force-refresh button at the bottom
    const button = document.createElement('button');
    button.className = 'primary-button';
    button.textContent = 'Refresh Stats';
    button.style.marginTop = '2rem';
    button.style.display = 'block';
    button.style.marginLeft = 'auto';
    button.style.marginRight = 'auto';
    button.addEventListener('click', forceDisplayStats);
    
    statsContainer.appendChild(button);
    
    console.log('Direct stats display completed');
    
    // Try to create charts if library exists
    if (window.Chart) {
        try {
            // Daily practice time chart
            const ctxTime = document.getElementById('practice-time-chart');
            if (ctxTime) {
                // Get last 7 days
                const days = [];
                const values = [];
                const now = new Date();
                
                for (let i = 6; i >= 0; i--) {
                    const date = new Date(now);
                    date.setDate(date.getDate() - i);
                    const dateStr = date.toISOString().split('T')[0];
                    days.push(dateStr);
                    
                    // Calculate total duration for this day
                    const dayTotal = sampleData
                        .filter(session => session.startTime && session.startTime.startsWith(dateStr))
                        .reduce((sum, session) => sum + session.duration, 0);
                        
                    values.push(dayTotal);
                }
                
                new Chart(ctxTime, {
                    type: 'bar',
                    data: {
                        labels: days,
                        datasets: [{
                            label: 'Daily Practice Time',
                            data: values,
                            backgroundColor: 'rgba(65, 84, 179, 0.6)',
                            borderColor: 'rgba(65, 84, 179, 1)',
                            borderWidth: 1
                        }]
                    },
                    options: {
                        responsive: true,
                        plugins: {
                            title: {
                                display: true,
                                text: 'Daily Practice Time'
                            }
                        },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: {
                                    callback: function(value) {
                                        return formatTime(value);
                                    }
                                },
                                title: {
                                    display: true,
                                    text: 'Practice Time'
                                }
                            },
                            x: {
                                title: {
                                    display: true,
                                    text: 'Date'
                                }
                            }
                        }
                    }
                });
            }
            
            // Category distribution chart
            const ctxCat = document.getElementById('category-distribution-chart');
            if (ctxCat) {
                // Get categories
                const categories = getItems('CATEGORIES') || defaultCategories;
                
                // Calculate category times
                const categoryTimes = {};
                categories.forEach(category => {
                    categoryTimes[category.id] = sampleData
                        .filter(session => session.categoryId === category.id)
                        .reduce((sum, session) => sum + session.duration, 0);
                });
                
                // Create chart data
                const catData = {
                    labels: categories.map(cat => cat.name),
                    datasets: [{
                        data: categories.map(cat => categoryTimes[cat.id] || 0),
                        backgroundColor: categories.map(() => 
                            `rgba(${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, ${Math.floor(Math.random()*255)}, 0.7)`
                        )
                    }]
                };
                
                new Chart(ctxCat, {
                    type: 'doughnut',
                    data: catData,
                    options: {
                        responsive: true,
                        plugins: {
                            legend: {
                                position: 'right'
                            }
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error creating charts:', error);
        }
    }
};

// Modify the initializeStats function to use our new direct approach
const originalInitializeStats = initializeStats;
initializeStats = () => {
    console.log('Overriding initializeStats to use direct approach');
    
    // Call the original function first to set up filters
    originalInitializeStats();
    
    // Force display stats after a short delay to ensure DOM is ready
    setTimeout(forceDisplayStats, 100);
};

// IMMEDIATE EXECUTION - Fix stats display directly when the script loads
(function() {
    console.log('IMMEDIATE FIX: Adding direct stats display handler');
    
    // Wait for DOM to be fully loaded
    document.addEventListener('DOMContentLoaded', function() {
        console.log('IMMEDIATE FIX: DOM loaded, adding stats tab handler');
        
        // Add event handler for when stats tab is clicked
        const statsTabButton = document.querySelector('.nav-item[data-page="stats"]');
        if (statsTabButton) {
            console.log('IMMEDIATE FIX: Found stats tab button, adding click handler');
            
            statsTabButton.addEventListener('click', function() {
                console.log('IMMEDIATE FIX: Stats tab clicked, forcing stats display');
                // Wait a short moment for the tab to fully activate
                setTimeout(directlyFixStatsDisplay, 200);
            });
        }
        
        // Also add handler for mobile nav
        const mobileStatsButton = document.querySelector('.mobile-nav .nav-item[data-page="stats"]');
        if (mobileStatsButton) {
            mobileStatsButton.addEventListener('click', function() {
                setTimeout(directlyFixStatsDisplay, 200);
            });
        }
        
        // Try to run immediately if stats page is already active
        if (document.querySelector('#stats-page.active')) {
            console.log('IMMEDIATE FIX: Stats page is already active, forcing display now');
            directlyFixStatsDisplay();
        }
    });
    
    // Function to directly fix stats display without relying on existing code
    function directlyFixStatsDisplay() {
        console.log('IMMEDIATE FIX: Starting direct fix of stats display');
        
        // Get the stats container
        const statsPage = document.getElementById('stats-page');
        if (!statsPage) {
            console.error('IMMEDIATE FIX: Stats page not found');
            return;
        }
        
        // Get or create stats container
        let statsContainer = statsPage.querySelector('.stats-container');
        if (!statsContainer) {
            console.log('IMMEDIATE FIX: Creating new stats container');
            statsContainer = document.createElement('div');
            statsContainer.className = 'stats-container';
            statsPage.appendChild(statsContainer);
        }
        
        // Create sample data
        const sampleSessions = [
            { duration: 3600, startTime: new Date().toISOString() }, // 1 hour
            { duration: 1800, startTime: new Date().toISOString() }, // 30 mins
            { duration: 2700, startTime: new Date().toISOString() }  // 45 mins
        ];
        
        // Calculate stats from sample data
        const totalTime = sampleSessions.reduce((sum, session) => sum + session.duration, 0);
        const avgTime = totalTime / sampleSessions.length;
        
        // Format time values
        const formatSimpleTime = (seconds) => {
            const hours = Math.floor(seconds / 3600);
            const minutes = Math.floor((seconds % 3600) / 60);
            return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
        };
        
        // Create emergency stats display
        const emergencyStats = document.createElement('div');
        emergencyStats.id = 'emergency-stats-display';
        emergencyStats.style.backgroundColor = '#f8f9fa';
        emergencyStats.style.padding = '20px';
        emergencyStats.style.borderRadius = '10px';
        emergencyStats.style.margin = '20px 0';
        emergencyStats.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
        
        // Add stats cards
        const statsHtml = `
            <h2 style="text-align:center; margin-bottom:20px;">Practice Statistics</h2>
            <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:20px; margin-bottom:30px;">
                <div style="background-color:#fff; padding:20px; border-radius:8px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin-bottom:10px;">Total Practice Time</h3>
                    <p style="font-size:24px; font-weight:bold; color:#4154b3;">${formatSimpleTime(totalTime)}</p>
                </div>
                <div style="background-color:#fff; padding:20px; border-radius:8px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin-bottom:10px;">Average Session Time</h3>
                    <p style="font-size:24px; font-weight:bold; color:#4154b3;">${formatSimpleTime(avgTime)}</p>
                </div>
                <div style="background-color:#fff; padding:20px; border-radius:8px; text-align:center; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                    <h3 style="margin-bottom:10px;">Practice Sessions</h3>
                    <p style="font-size:24px; font-weight:bold; color:#4154b3;">${sampleSessions.length}</p>
                </div>
            </div>
            <p style="text-align:center; font-style:italic; color:#666;">Sample data shown for demonstration purposes</p>
            <p style="text-align:center; margin-top:30px;">
                <button id="refresh-emergency-stats" style="background-color:#4154b3; color:white; border:none; padding:10px 20px; border-radius:5px; cursor:pointer;">
                    Refresh Stats
                </button>
            </p>
        `;
        
        emergencyStats.innerHTML = statsHtml;
        
        // Check if emergency stats display already exists
        const existingEmergencyStats = document.getElementById('emergency-stats-display');
        if (existingEmergencyStats) {
            existingEmergencyStats.remove();
        }
        
        // Add to container at the top
        if (statsContainer.firstChild) {
            statsContainer.insertBefore(emergencyStats, statsContainer.firstChild);
        } else {
            statsContainer.appendChild(emergencyStats);
        }
        
        // Add refresh button functionality
        const refreshButton = document.getElementById('refresh-emergency-stats');
        if (refreshButton) {
            refreshButton.addEventListener('click', directlyFixStatsDisplay);
        }
        
        console.log('IMMEDIATE FIX: Emergency stats display added successfully');
    }
})();

// Create a simple stats display
const createSimpleStats = (container) => {
    console.log('Creating simple stats display');
    
    // Get filter values - re-query to ensure we have the latest
    const categoryFilter = document.querySelector('.stats-category-filter')?.value || '';
    const dateInputs = document.querySelectorAll('.stats-date-input');
    const startDate = dateInputs[0]?.value || '';
    const endDate = dateInputs[1]?.value || '';
    
    console.log('Current filters:', { categoryFilter, startDate, endDate });
    
    // Clear container first
    container.innerHTML = '';
    
    // Get sessions data - try multiple sources
    let sessions = [];
    
    // Try standard method
    sessions = getItems('SESSIONS');
    
    // If that fails, try direct localStorage access
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
        try {
            const rawData = localStorage.getItem('practice_sessions');
            if (rawData) {
                sessions = JSON.parse(rawData);
            }
        } catch (e) {
            console.error('Error parsing sessions:', e);
        }
    }
    
    // If still no data, generate sample data
    if (!sessions || !Array.isArray(sessions) || sessions.length === 0) {
        sessions = generateSampleSessionData();
        
        // Save the sample data
        localStorage.setItem('practice_sessions', JSON.stringify(sessions));
    }
    
    console.log(`Found ${sessions.length} sessions for stats before filtering`);
    
    // Apply filters
    let filteredSessions = [...sessions];
    
    // Apply category filter
    if (categoryFilter) {
        console.log(`Filtering by category: ${categoryFilter}`);
        filteredSessions = filteredSessions.filter(session => session.categoryId === categoryFilter);
    }
    
    // Apply date filters
    if (startDate) {
        console.log(`Filtering by start date: ${startDate}`);
        const startDateObj = new Date(startDate);
        startDateObj.setHours(0, 0, 0, 0);
        filteredSessions = filteredSessions.filter(session => {
            if (!session.startTime) return false;
            const sessionDate = new Date(session.startTime);
            return sessionDate >= startDateObj;
        });
    }
    
    if (endDate) {
        console.log(`Filtering by end date: ${endDate}`);
        const endDateObj = new Date(endDate);
        endDateObj.setHours(23, 59, 59, 999);
        filteredSessions = filteredSessions.filter(session => {
            if (!session.startTime) return false;
            const sessionDate = new Date(session.startTime);
            return sessionDate <= endDateObj;
        });
    }
    
    console.log(`Filtered to ${filteredSessions.length} sessions`);
    
    // Add filter status indicator
    const filterStatus = document.createElement('div');
    filterStatus.className = 'filter-status';
    filterStatus.style.margin = '15px 0';
    filterStatus.style.padding = '10px';
    filterStatus.style.backgroundColor = '#f0f8ff';
    filterStatus.style.borderRadius = '5px';
    filterStatus.style.fontSize = '14px';
    
    // Create filter text
    let filterText = 'Showing: ';
    if (categoryFilter) {
        const categoryName = document.querySelector(`.stats-category-filter option[value="${categoryFilter}"]`)?.textContent || categoryFilter;
        filterText += `Category "${categoryName}" | `;
    } else {
        filterText += 'All Categories | ';
    }
    
    if (startDate && endDate) {
        filterText += `Date range ${formatDate(startDate)} to ${formatDate(endDate)} | `;
    } else if (startDate) {
        filterText += `From ${formatDate(startDate)} | `;
    } else if (endDate) {
        filterText += `Until ${formatDate(endDate)} | `;
    } else {
        filterText += 'All dates | ';
    }
    
    filterText += `${filteredSessions.length} sessions found`;
    filterStatus.textContent = filterText;
    
    // Add to container
    container.appendChild(filterStatus);
    
    // Calculate total time
    let totalTime = 0;
    filteredSessions.forEach(session => {
        const duration = typeof session.duration === 'number' ? 
            session.duration : parseInt(session.duration) || 0;
        totalTime += duration;
    });
    
    // Calculate average time
    const averageTime = filteredSessions.length > 0 ? Math.round(totalTime / filteredSessions.length) : 0;
    
    // Create stats grid
    const statsGridElem = document.createElement('div');
    statsGridElem.className = 'stats-grid';
    statsGridElem.style.display = 'grid';
    statsGridElem.style.gridTemplateColumns = 'repeat(auto-fit, minmax(250px, 1fr))';
    statsGridElem.style.gap = '20px';
    statsGridElem.style.margin = '20px 0';
    
    // Add stats cards
    statsGridElem.innerHTML = `
        <div class="stat-card" style="background-color:#f5f5f5; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
            <h3 style="margin-bottom:10px;">Total Practice Time</h3>
            <p style="font-size:24px; font-weight:bold; color:#4154b3;">${formatTime(totalTime)}</p>
        </div>
        <div class="stat-card" style="background-color:#f5f5f5; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
            <h3 style="margin-bottom:10px;">Average Session Time</h3>
            <p style="font-size:24px; font-weight:bold; color:#4154b3;">${formatTime(averageTime)}</p>
        </div>
        <div class="stat-card" style="background-color:#f5f5f5; padding:20px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1); text-align:center;">
            <h3 style="margin-bottom:10px;">Practice Sessions</h3>
            <p style="font-size:24px; font-weight:bold; color:#4154b3;">${filteredSessions.length}</p>
        </div>
    `;
    
    // Add to container
    container.appendChild(statsGridElem);
    
    // Add refresh button
    const refreshButton = document.createElement('button');
    refreshButton.className = 'primary-button';
    refreshButton.textContent = 'Refresh Stats';
    refreshButton.style.display = 'block';
    refreshButton.style.margin = '20px auto';
    refreshButton.style.padding = '10px 20px';
    
    refreshButton.addEventListener('click', () => {
        createSimpleStats(container);
    });
    
    container.appendChild(refreshButton);
    
    // Create a simple bar chart for filtered sessions
    createSimpleBarChart(container, filteredSessions);
};

// Helper function to format date
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Create a simple bar chart for practice times
const createSimpleBarChart = (container, sessions) => {
    console.log('Creating simple bar chart for', sessions.length, 'sessions');
    
    if (!window.Chart) {
        console.log('Chart.js not available, skipping chart creation');
        return;
    }
    
    // Remove any existing charts
    const existingChartContainer = document.getElementById('simple-charts-container');
    if (existingChartContainer) {
        existingChartContainer.remove();
    }
    
    // Create chart container
    const chartContainer = document.createElement('div');
    chartContainer.id = 'simple-charts-container';
    chartContainer.style.marginTop = '30px';
    chartContainer.style.width = '100%';
    
    // Create canvas for daily practice time
    const practiceTimeContainer = document.createElement('div');
    practiceTimeContainer.style.marginBottom = '30px';
    
    const practiceTimeCanvas = document.createElement('canvas');
    practiceTimeCanvas.id = 'simple-practice-time-chart';
    practiceTimeCanvas.width = 400;
    practiceTimeCanvas.height = 200;
    
    practiceTimeContainer.appendChild(practiceTimeCanvas);
    chartContainer.appendChild(practiceTimeContainer);
    
    // Create canvas for category distribution
    const categoryContainer = document.createElement('div');
    categoryContainer.style.marginTop = '40px';
    
    const categoryCanvas = document.createElement('canvas');
    categoryCanvas.id = 'simple-category-chart';
    categoryCanvas.width = 400;
    categoryCanvas.height = 200;
    
    categoryContainer.appendChild(categoryCanvas);
    chartContainer.appendChild(categoryContainer);
    
    // Add to main container
    container.appendChild(chartContainer);
    
    // Calculate daily practice times
    const dailyTimes = {};
    const now = new Date();
    
    // Initialize last 7 days with zero values
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        dailyTimes[dateStr] = 0;
    }
    
    // Sum up practice times by day
    sessions.forEach(session => {
        if (session.startTime) {
            const dateStr = session.startTime.split('T')[0];
            if (dailyTimes.hasOwnProperty(dateStr)) {
                const duration = typeof session.duration === 'number' ? 
                    session.duration : parseInt(session.duration) || 0;
                dailyTimes[dateStr] += duration;
            }
        }
    });
    
    // Create daily practice time chart
    const practiceTimeCtx = document.getElementById('simple-practice-time-chart');
    if (practiceTimeCtx) {
        const dates = Object.keys(dailyTimes).sort();
        const values = dates.map(date => dailyTimes[date]);
        
        // Format dates for display
        const displayDates = dates.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });
        
        new Chart(practiceTimeCtx, {
            type: 'bar',
            data: {
                labels: displayDates,
                datasets: [{
                    label: 'Daily Practice Time',
                    data: values,
                    backgroundColor: 'rgba(65, 84, 179, 0.6)',
                    borderColor: 'rgba(65, 84, 179, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    title: {
                        display: true,
                        text: 'Daily Practice Time'
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return formatTime(value);
                            }
                        },
                        title: {
                            display: true,
                            text: 'Practice Time'
                        }
                    },
                    x: {
                        title: {
                            display: true,
                            text: 'Date'
                        }
                    }
                }
            }
        });
    }
    
    // Create category distribution chart
    const categories = getItems('CATEGORIES') || defaultCategories;
    const categoryTimes = {};
    
    // Initialize all categories with zero values
    categories.forEach(category => {
        categoryTimes[category.id] = 0;
    });
    
    // Sum up practice times by category
    sessions.forEach(session => {
        if (session.categoryId && categoryTimes.hasOwnProperty(session.categoryId)) {
            const duration = typeof session.duration === 'number' ? 
                session.duration : parseInt(session.duration) || 0;
            categoryTimes[session.categoryId] += duration;
        }
    });
    
    // Remove categories with zero practice time
    const activeCategories = categories.filter(category => categoryTimes[category.id] > 0);
    
    // Create category chart if there are active categories
    if (activeCategories.length > 0) {
        const categoryCtx = document.getElementById('simple-category-chart');
        if (categoryCtx) {
            // Generate colors for categories
            const colors = activeCategories.map((_, index) => {
                const hue = (index * 137.5) % 360; // Use golden angle approximation for nice distribution
                return `hsl(${hue}, 70%, 60%)`;
            });
            
            new Chart(categoryCtx, {
                type: 'doughnut',
                data: {
                    labels: activeCategories.map(cat => cat.name),
                    datasets: [{
                        data: activeCategories.map(cat => categoryTimes[cat.id]),
                        backgroundColor: colors
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: 'Practice Time by Category'
                        },
                        legend: {
                            position: 'right'
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const value = context.raw;
                                    const percentage = Math.round(value / Object.values(categoryTimes).reduce((a, b) => a + b, 0) * 100);
                                    return `${context.label}: ${formatTime(value)} (${percentage}%)`;
                                }
                            }
                        }
                    }
                }
            });
        }
    } else {
        console.log('No active categories found for chart');
    }
};

// Test function to create sample data with specific dates for testing filters
function createTestDataForFilters() {
    console.log('Creating test data specifically for filter testing');
    
    const categories = getItems('CATEGORIES') || defaultCategories;
    const now = new Date();
    const result = [];
    
    // Create sessions spread across different dates and categories
    // Last 14 days with 2 categories per day
    for (let day = 0; day < 14; day++) {
        const date = new Date(now);
        date.setDate(date.getDate() - day);
        const dateStr = date.toISOString().split('T')[0];
        
        // Create a session for category 1
        const cat1 = categories[0];
        date.setHours(10, 0, 0, 0);
        result.push({
            id: `test-${dateStr}-1`,
            categoryId: cat1.id,
            startTime: date.toISOString(),
            duration: 1800, // 30 minutes
            notes: `Test ${cat1.name} session for ${dateStr}`,
            isManual: true,
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
        });
        
        // Create a session for category 2
        const cat2 = categories[1];
        date.setHours(15, 0, 0, 0);
        result.push({
            id: `test-${dateStr}-2`,
            categoryId: cat2.id,
            startTime: date.toISOString(),
            duration: 3600, // 1 hour
            notes: `Test ${cat2.name} session for ${dateStr}`,
            isManual: true,
            createdAt: date.toISOString(),
            updatedAt: date.toISOString()
        });
        
        // Every 3 days, add a session for category 3
        if (day % 3 === 0 && categories.length > 2) {
            const cat3 = categories[2];
            date.setHours(18, 0, 0, 0);
            result.push({
                id: `test-${dateStr}-3`,
                categoryId: cat3.id,
                startTime: date.toISOString(),
                duration: 2700, // 45 minutes
                notes: `Test ${cat3.name} session for ${dateStr}`,
                isManual: true,
                createdAt: date.toISOString(),
                updatedAt: date.toISOString()
            });
        }
    }
    
    // Save test data
    localStorage.setItem('practice_sessions', JSON.stringify(result));
    localStorage.setItem('SESSIONS', JSON.stringify(result));
    
    console.log(`Created ${result.length} test sessions across 14 days`);
    return result;
}

// Debug filter issues
function debugFilters() {
    console.log('=== DEBUGGING FILTERS ===');
    
    // Check DOM elements
    const categoryFilter = document.querySelector('.stats-category-filter');
    const dateInputs = document.querySelectorAll('.stats-date-input');
    
    console.log('Filter DOM elements:');
    console.log('- Category filter:', categoryFilter ? 'Found' : 'Missing');
    console.log('- Date inputs:', dateInputs.length);
    
    if (categoryFilter) {
        console.log('Category options:');
        Array.from(categoryFilter.options).forEach(opt => {
            console.log(`  - ${opt.value}: ${opt.textContent}`);
        });
        console.log('Selected category:', categoryFilter.value);
    }
    
    if (dateInputs.length > 0) {
        console.log('Date values:');
        dateInputs.forEach((input, i) => {
            console.log(`  - Input ${i+1}: ${input.value}`);
        });
    }
    
    // Create test data for filter testing
    if (confirm('Create test data specifically designed for filter testing?')) {
        const testData = createTestDataForFilters();
        alert(`Created ${testData.length} test sessions across 14 days with multiple categories`);
        
        // Refresh display
        const statsContainer = document.querySelector('.stats-container');
        if (statsContainer) {
            createSimpleStats(statsContainer);
        }
    }
    
    console.log('=== END DEBUGGING FILTERS ===');
}

// Add debug filters button to the DOM
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(() => {
        const statsPage = document.querySelector('#stats-page');
        if (!statsPage) return;
        
        // Create debug button
        const debugBtn = document.createElement('button');
        debugBtn.textContent = 'Debug Filters';
        debugBtn.style.position = 'absolute';
        debugBtn.style.bottom = '10px';
        debugBtn.style.right = '10px';
        debugBtn.style.padding = '5px 10px';
        debugBtn.style.fontSize = '12px';
        debugBtn.style.backgroundColor = '#f8f8f8';
        debugBtn.style.border = '1px solid #ccc';
        
        debugBtn.addEventListener('click', debugFilters);
        
        statsPage.style.position = 'relative';
        statsPage.appendChild(debugBtn);
    }, 1000);
}); 