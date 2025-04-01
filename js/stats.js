// Simple and robust stats functionality
// Eliminates complex initialization chains and redundant code

// DOM Elements
const statsContainer = document.querySelector('.stats-container');
const categoryFilter = document.querySelector('.stats-category-filter');
const dateInputs = document.querySelectorAll('.stats-date-input');
const applyFiltersBtn = document.getElementById('apply-stats-filters');

// Format time in hours and minutes
function formatTime(seconds) {
    if (!seconds) return '0m';
    seconds = parseInt(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

// Stats Module
function initStats() {
    console.log('Initializing stats module');
    
    // Get sessions from localStorage
    let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    console.log('Found sessions:', sessions.length);
    
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
        displayEmptyState(container);
        return;
    }
    
    // Display stats
    displayStats(sessions);
    
    // Load category filter
    loadCategoryFilter();
}

function loadCategoryFilter() {
    console.log('Loading category filter');
    const categoryFilter = document.getElementById('category-filter');
    
    if (!categoryFilter) {
        console.error('Category filter not found');
        return;
    }
    
    // Clear existing options
    categoryFilter.innerHTML = '';
    
    // Add "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption);
    
    try {
        // Get categories from localStorage
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        console.log('Stats: Retrieved categories:', categories);
        
        // Add categories to filter
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        // Add change event listener
        categoryFilter.addEventListener('change', () => {
            applyFilters();
        });
        
        console.log('Stats: Category filter loaded successfully');
    } catch (error) {
        console.error('Stats: Error loading category filter:', error);
    }
}

function displayStats(sessions) {
    console.log('Displaying stats for sessions:', sessions);
    
    const container = document.querySelector('.stats-container');
    if (!container) {
        console.error('Stats container not found');
        return;
    }
    
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
    
    console.log('Calculated stats:', {
        totalTime,
        avgTime,
        maxTime,
        sessionsThisWeek
    });
    
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

function displayEmptyState(container) {
    console.log('Displaying empty state');
    const message = 'No practice sessions found. Start practicing to see your stats!';
        
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

function formatDuration(seconds) {
    if (!seconds) return '0m';
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function applyFilters() {
    console.log('Applying filters...');
    
    // Get all sessions
    let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    console.log('Total sessions:', sessions.length);
    
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
    if (selectedCategory) {
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
        displayEmptyState(container);
        return;
    }
    
    // Display filtered stats
    displayStats(sessions);
}

// Listen for categories changed event
document.addEventListener('categoriesChanged', () => {
    console.log('Stats received categories changed event');
    loadCategoryFilter();
});

// Initialize stats page
window.initializeStats = function() {
    console.log('Initializing stats page');
    
    // Initialize stats display
    initStats();
    
    // Set up apply button
    const applyButton = document.getElementById('apply-stats-filters');
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }
    
    // Add styles
    addStatsStyles();
    
    console.log('Stats page initialized successfully');
};

// Add styles for stats elements
const addStatsStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            transition: transform 0.2s;
        }
        
        .stat-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 4px 8px rgba(0,0,0,0.15);
        }
        
        .stat-title {
            font-size: 14px;
            font-weight: 600;
            color: #555;
            margin-bottom: 8px;
        }
        
        .stat-value {
            font-size: 28px;
            font-weight: 700;
            color: #3b7ff5;
            margin-bottom: 4px;
        }
        
        .stat-description {
            font-size: 12px;
            color: #888;
        }
        
        .sessions-by-category {
            background-color: white;
            border-radius: 8px;
            padding: 20px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            margin-bottom: 40px;
        }
        
        .sessions-by-category h3 {
            font-size: 18px;
            margin-bottom: 20px;
            color: #333;
        }
        
        .category-bar-item {
            display: grid;
            grid-template-columns: 150px 1fr 80px;
            gap: 10px;
            align-items: center;
            margin-bottom: 15px;
        }
        
        .category-bar-label {
            font-weight: 500;
            font-size: 14px;
            color: #444;
        }
        
        .category-bar-container {
            position: relative;
            height: 24px;
            background-color: #eee;
            border-radius: 12px;
            overflow: hidden;
        }
        
        .category-bar {
            height: 100%;
            background: linear-gradient(to right, #3b7ff5, #5f9bff);
            border-radius: 12px;
        }
        
        .category-bar-value {
            position: absolute;
            top: 50%;
            left: 12px;
            transform: translateY(-50%);
            font-size: 12px;
            font-weight: 600;
            color: white;
            text-shadow: 0 1px 2px rgba(0,0,0,0.2);
        }
        
        .category-bar-count {
            font-size: 13px;
            color: #666;
            text-align: right;
        }
        
        .empty-state {
            text-align: center;
            padding: 60px 20px;
            color: #888;
        }
        
        .empty-state svg {
            width: 48px;
            height: 48px;
            margin-bottom: 15px;
            color: #bbb;
        }
        
        .empty-state h3 {
            margin-bottom: 10px;
            color: #555;
        }
        
        .loading-stats {
            text-align: center;
            padding: 40px;
            color: #888;
            font-style: italic;
        }
        
        @media (max-width: 768px) {
            .category-bar-item {
                grid-template-columns: 1fr;
                gap: 5px;
                margin-bottom: 25px;
            }
            
            .category-bar-count {
                text-align: left;
            }
        }
    `;
    document.head.appendChild(style);
};