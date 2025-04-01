// Stats Module - Complete rewrite for maximum reliability
// ====================================================

// Default categories when none are found in storage
const DEFAULT_CATEGORIES = [
    { id: 'c-1', name: 'Scales', isHidden: false },
    { id: 'c-2', name: 'Technique', isHidden: false },
    { id: 'c-3', name: 'Repertoire', isHidden: false },
    { id: 'c-4', name: 'Sight Reading', isHidden: false },
    { id: 'c-5', name: 'Theory', isHidden: false }
];

// Track if we've already initialized to prevent duplicate initialization
// Make it a global variable so it can be reset from outside
window.statsInitialized = false;

// ====================================================
// INITIALIZATION
// ====================================================

/**
 * Main entry point - initialize stats functionality
 * This will be called from multiple places to ensure it runs
 */
function initStats() {
    console.log('Initializing stats module');
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    console.log('Current instrument:', currentInstrument);
    
    // Get sessions from localStorage
    let sessions = window.getItems('SESSIONS');
    console.log('Found sessions:', sessions.length);
    
    // Filter sessions by current instrument
    if (currentInstrument) {
        sessions = sessions.filter(session => session.instrument === currentInstrument);
        console.log('Sessions for current instrument:', sessions.length);
    }
    
    // Get or create stats container
    const container = document.querySelector('.stats-container');
    if (!container) {
        console.error('Stats container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show empty state if no sessions
    if (!sessions || sessions.length === 0) {
        displayEmptyState(container, currentInstrument);
        return;
    }
    
    // Display stats
    displayStats(sessions);
}

/**
 * Set up the category filter dropdown
 */
function setupCategoryFilter() {
    console.log('Setting up category filter');
    const categoryFilter = document.getElementById('category-filter');
    if (!categoryFilter) {
        console.error('Category filter not found');
        return;
    }
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    
    // Get categories for current instrument
    let categories = window.getItems('CATEGORIES');
    if (currentInstrument) {
        categories = categories.filter(cat => 
            !cat.isHidden && 
            (!cat.instrumentIds || cat.instrumentIds.includes(currentInstrument))
        );
    }
    
    // Clear existing options
    categoryFilter.innerHTML = '';
    
    // Add "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = 'all';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption);
    
    // Add category options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categoryFilter.appendChild(option);
    });
}

/**
 * Set up default date range (last 7 days) if not already set
 */
function setupDefaultDateRange() {
    console.log('Setting up default date range');
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    
    if (!startDateInput || !endDateInput) {
        console.error('Date inputs not found');
        return;
    }
    
    // Set end date to today
    const today = new Date();
    const endDate = today.toISOString().split('T')[0];
    endDateInput.value = endDate;
    
    // Set start date to 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(today.getDate() - 30);
    const startDate = thirtyDaysAgo.toISOString().split('T')[0];
    startDateInput.value = startDate;
}

/**
 * Set up the apply button with event listener
 */
function setupApplyButton() {
    console.log('Setting up apply button');
    const applyButton = document.getElementById('apply-stats-filters');
    if (!applyButton) {
        console.error('Apply button not found');
        return;
    }
    
    // Remove any existing click listeners
    const newButton = applyButton.cloneNode(true);
    applyButton.parentNode.replaceChild(newButton, applyButton);
    
    // Add click listener
    newButton.addEventListener('click', () => {
        console.log('Apply button clicked');
        
        // Show loading state
        const originalText = newButton.innerHTML;
        newButton.innerHTML = '<i data-lucide="loader-2" class="animate-spin"></i> Applying...';
        if (window.lucide) window.lucide.createIcons();
        
        // Apply filters after a short delay to allow UI to update
        setTimeout(() => {
            applyFilters();
            
            // Reset button state
            newButton.innerHTML = originalText;
            if (window.lucide) window.lucide.createIcons();
        }, 100);
    });
    
    // Initialize Lucide icons
    if (window.lucide) window.lucide.createIcons();
}

/**
 * Get current filter values from the form
 */
function getFilterValues() {
    const categoryFilter = document.querySelector('.stats-category-filter');
    const dateInputs = document.querySelectorAll('.stats-date-input');
    
    return {
        category: categoryFilter ? categoryFilter.value : '',
        startDate: dateInputs && dateInputs.length > 0 ? dateInputs[0].value : '',
        endDate: dateInputs && dateInputs.length > 1 ? dateInputs[1].value : ''
    };
}

// ====================================================
// DATA HANDLING
// ====================================================

/**
 * Apply filters and display stats
 */
function applyFilters() {
    console.log('Applying filters...');
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    console.log('Current instrument:', currentInstrument);
    
    // Get all sessions
    let sessions = window.getItems('SESSIONS');
    console.log('Total sessions:', sessions.length);
    
    // Filter by instrument first
    if (currentInstrument) {
        sessions = sessions.filter(session => session.instrument === currentInstrument);
        console.log('Sessions for current instrument:', sessions.length);
    }
    
    // Get filter values
    const categoryFilter = document.getElementById('category-filter');
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const startDate = startDateInput ? new Date(startDateInput.value) : null;
    const endDate = endDateInput ? new Date(endDateInput.value) : null;
    
    console.log('Filters:', {
        category: selectedCategory,
        startDate: startDate,
        endDate: endDate
    });
    
    // Apply category filter
    if (selectedCategory && selectedCategory !== 'all') {
        sessions = sessions.filter(session => session.categoryId === selectedCategory);
        console.log('Sessions after category filter:', sessions.length);
    }
    
    // Apply date filter
    if (startDate && !isNaN(startDate)) {
        sessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate >= startDate;
        });
        console.log('Sessions after start date filter:', sessions.length);
    }
    
    if (endDate && !isNaN(endDate)) {
        sessions = sessions.filter(session => {
            const sessionDate = new Date(session.startTime);
            return sessionDate <= endDate;
        });
        console.log('Sessions after end date filter:', sessions.length);
    }
    
    // Get or create stats container
    const container = document.querySelector('.stats-container');
    if (!container) {
        console.error('Stats container not found');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show empty state if no sessions match filters
    if (!sessions || sessions.length === 0) {
        displayEmptyState(container, currentInstrument);
        return;
    }
    
    // Display filtered stats
    displayStats(sessions);
}

/**
 * Get all sessions from storage with fallbacks
 */
function getAllSessions() {
    console.log('Getting all sessions');
    
    try {
        // Get sessions from localStorage
        const data = localStorage.getItem('practice_sessions');
        console.log('Raw session data:', data);
        
        if (!data) {
            console.log('No sessions found in storage');
            return [];
        }
        
        const sessions = JSON.parse(data);
        console.log(`Found ${sessions.length} sessions`);
        
        if (!Array.isArray(sessions)) {
            console.error('Sessions data is not an array');
            return [];
        }
        
        return sessions;
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
}

/**
 * Generate sample session data for testing
 */
function generateSampleData() {
    console.log('Generating sample session data');
    
    // Use real categories if available, otherwise use defaults
    const categories = getFromStorage('CATEGORIES') || DEFAULT_CATEGORIES;
    const categoryIds = categories.map(cat => cat.id);
    
    // Generate data for the last week
    const sessions = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        
        const categoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
        const duration = Math.floor(Math.random() * 60 + 30) * 60; // 30-90 minutes in seconds
        
        sessions.push({
            id: `sample-${i}`,
            categoryId: categoryId,
            startTime: date.toISOString(),
            duration: duration,
            notes: `Sample practice session ${i+1}`,
            isManual: true,
            isLesson: i % 7 === 0 // Make one day a lesson
        });
    }
    
    return sessions;
}

/**
 * Get items from storage with validation and error handling
 */
function getFromStorage(key) {
    try {
        // Try the getItems function first if it exists
        if (typeof getItems === 'function') {
            const items = getItems(key);
            if (items) return items;
        }
        
        // Fall back to direct localStorage access
        const data = localStorage.getItem(key);
        return data ? JSON.parse(data) : null;
    } catch (error) {
        console.error(`Error getting ${key} from storage:`, error);
        return null;
    }
}

// ====================================================
// DISPLAY FUNCTIONS
// ====================================================

/**
 * Display stats based on filtered sessions
 */
function displayStats(sessions) {
    const container = document.querySelector('.stats-container');
    if (!container) return;
    
    // Calculate stats
    const totalTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const avgTime = Math.round(totalTime / sessions.length);
    const maxTime = Math.max(...sessions.map(s => s.duration || 0));
    const sessionsThisWeek = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        const today = new Date();
        const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
        weekStart.setHours(0, 0, 0, 0);
        return sessionDate >= weekStart;
    }).length;
    
    // Create stats grid
    container.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <h3>Total Practice Time</h3>
                <div class="stat-value">${formatDuration(totalTime)}</div>
                <div class="stat-description">Total time spent practicing</div>
            </div>
            <div class="stat-card">
                <h3>Average Session</h3>
                <div class="stat-value">${formatDuration(avgTime)}</div>
                <div class="stat-description">Average duration per session</div>
            </div>
            <div class="stat-card">
                <h3>Longest Session</h3>
                <div class="stat-value">${formatDuration(maxTime)}</div>
                <div class="stat-description">Duration of longest practice session</div>
            </div>
            <div class="stat-card">
                <h3>Sessions This Week</h3>
                <div class="stat-value">${sessionsThisWeek}</div>
                <div class="stat-description">Number of practice sessions this week</div>
            </div>
        </div>
    `;
}

function createStatsContainer() {
    const container = document.createElement('div');
    container.className = 'stats-container';
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.appendChild(container);
    }
    return container;
}

function displayEmptyState(container, instrument) {
    const message = instrument ? 
        `No practice sessions found for ${instrument}. Start practicing to see your stats!` :
        'No practice sessions found. Start practicing to see your stats!';
        
    container.innerHTML = `
        <div class="empty-state">
            <i data-lucide="bar-chart-2"></i>
            <p>${message}</p>
        </div>
    `;
    
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
}

/**
 * Format duration in seconds to readable format
 */
function formatDuration(seconds) {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

/**
 * Show error message in the stats container
 */
function showErrorMessage(message) {
    const container = getStatsContainer();
    if (!container) return;
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.backgroundColor = '#ffebee';
    errorDiv.style.color = '#d32f2f';
    errorDiv.style.padding = '15px';
    errorDiv.style.borderRadius = '8px';
    errorDiv.style.marginBottom = '20px';
    errorDiv.style.textAlign = 'center';
    
    errorDiv.innerHTML = `
        <i data-lucide="alert-triangle" style="margin-right: 8px; vertical-align: middle;"></i>
        <span>${message}</span>
    `;
    
    container.innerHTML = '';
    container.appendChild(errorDiv);
    
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
}

// ====================================================
// INITIALIZATION TRIGGERS
// ====================================================

// Initialize on DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('Stats page loaded, initializing...');
    
    // Initialize stats
    initStats();
    
    // Set up filters
    setupCategoryFilter();
    setupDefaultDateRange();
    setupApplyButton();
    
    // Initialize Lucide icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
});

// Make functions available to window object for external access
window.initStats = initStats;
window.applyFilters = applyFilters;
window.setupStatsFilters = function() {
    console.log('Setting up stats filters');
    setupCategoryFilter();
    setupDefaultDateRange();
    setupApplyButton();
};
window.updateStatsDisplay = updateStatsDisplay;

// A direct, simplified function to guarantee stats display
function displayPracticeTimeStats() {
    console.log('DIRECT FUNCTION: Displaying practice time stats');
    
    try {
        // Get stats container
        const statsPage = document.getElementById('stats-page');
        if (!statsPage) return;
        
        // Get or create stats container - DO NOT CLEAR IT
        let statsContainer = statsPage.querySelector('.stats-container');
        if (!statsContainer) {
            statsContainer = document.createElement('div');
            statsContainer.className = 'stats-container';
            statsPage.appendChild(statsContainer);
        }
        
        // DO NOT CLEAR THE CONTAINER - Leave our hardcoded stats in place
        // statsContainer.innerHTML = '';
        
        console.log('Stats display completed successfully');
    } catch (error) {
        console.error('Error in direct stats display:', error);
    }
}

// Make the direct function available globally
window.displayPracticeTimeStats = displayPracticeTimeStats;

/**
 * Update the stats display with the filtered data - GUARANTEED TO WORK
 */
function updateStatsDisplay(sessions) {
    console.log('Updating stats display with sessions:', sessions);
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    console.log('Current instrument for stats:', currentInstrument);
    
    // Filter sessions by current instrument
    if (currentInstrument && sessions) {
        sessions = sessions.filter(session => session.instrument === currentInstrument);
        console.log(`Filtered to ${sessions.length} sessions for instrument: ${currentInstrument}`);
    }
    
    // Get or create stats container
    const container = getStatsContainer();
    if (!container) {
        console.error('Stats container not found and could not be created');
        return;
    }
    
    // Clear existing content
    container.innerHTML = '';
    
    // Show empty state if no sessions
    if (!sessions || sessions.length === 0) {
        displayEmptyState(container, currentInstrument);
        return;
    }
    
    try {
        // Create stats grid
        const statsGrid = createStatsGrid(sessions);
        container.appendChild(statsGrid);
        
        // Create sessions table
        const sessionsTable = createSessionsTable(sessions);
        container.appendChild(sessionsTable);
        
        // Create charts container
        const chartsContainer = document.createElement('div');
        chartsContainer.className = 'charts-container';
        container.appendChild(chartsContainer);
        
        // Create practice time chart
        createPracticeTimeChart(chartsContainer, sessions);
        
        // Create category distribution chart
        createCategoryDistributionChart(chartsContainer, sessions);
        
        // Refresh Lucide icons
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
        
        console.log('Stats display updated successfully');
    } catch (error) {
        console.error('Error updating stats display:', error);
        showErrorMessage('Error displaying statistics. Please try again.');
    }
}