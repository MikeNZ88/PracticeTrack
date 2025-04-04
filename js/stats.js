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
    
    // Get or create containers
    const statsContainer = document.querySelector('.stats-container');
    const countdownContainer = document.getElementById('lesson-countdown-container'); // Get new container
    if (!statsContainer || !countdownContainer) {
        console.error('Required containers (.stats-container or #lesson-countdown-container) not found');
        return;
    }
    
    // Clear existing content
    statsContainer.innerHTML = '';
    countdownContainer.innerHTML = ''; // Clear countdown container too
    
    // Update lesson countdown (always do this)
    updateLessonCountdown(countdownContainer);
    
    // Get sessions from localStorage
    let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    console.log('Found sessions:', sessions.length);
    
    // Show empty state in stats container if no sessions initially
    if (!sessions || sessions.length === 0) {
        displayEmptyState(statsContainer);
        // Don't return, still need filters
    } else {
        // Initial display of stats (unfiltered)
        displayStats(sessions, statsContainer);
    }
    
    // Load category filter
    loadCategoryFilter();
    
    // Setup date input listeners
    setupDateInputListeners();
    
    // --- Add Date Preset Logic --- 
    const pageElement = document.getElementById('stats-page');
    const presetFilter = pageElement ? pageElement.querySelector('.date-preset-filter') : null;
    const startDateInput = pageElement ? pageElement.querySelector('#stats-start-date') : null; 
    const endDateInput = pageElement ? pageElement.querySelector('#stats-end-date') : null; 
    const dateRangeDiv = pageElement ? pageElement.querySelector('.date-range') : null;

    if (presetFilter && startDateInput && endDateInput && dateRangeDiv) {
        presetFilter.addEventListener('change', () => {
            const selectedPreset = presetFilter.value;
            const today = new Date();
            let startDate = '';
            let endDate = '';

            dateRangeDiv.style.display = (selectedPreset === 'custom') ? 'flex' : 'none';

            switch (selectedPreset) {
                case 'week':
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    startDate = firstDayOfWeek.toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                    break;
                case 'month':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                    break;
                case 'year':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                    break;
                case 'ytd':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                    break;
                case 'all':
                    startDate = '';
                    endDate = '';
                    break;
                case 'custom':
                     startDate = startDateInput.value;
                     endDate = endDateInput.value;
                    break;
            }
            
            if (selectedPreset !== 'custom') {
                 startDateInput.value = startDate;
                 endDateInput.value = endDate;
             }
            // Apply filters directly in stats
             applyFilters(); 
        });
        
         // Ensure changing custom dates updates preset and triggers filter
         startDateInput.addEventListener('change', () => {
             presetFilter.value = 'custom';
             dateRangeDiv.style.display = 'flex';
             applyFilters(); // Trigger filter
         });
         endDateInput.addEventListener('change', () => {
              presetFilter.value = 'custom';
              dateRangeDiv.style.display = 'flex';
              applyFilters(); // Trigger filter
         });

        // Set initial state - Default to 'all' and hide custom range
        presetFilter.value = 'all';
        dateRangeDiv.style.display = 'none'; 
        startDateInput.value = ''; // Ensure custom dates are cleared initially
        endDateInput.value = '';

        // Apply initial filters (defaulting to 'all' time)
        applyFilters(); 
    }
    // --- End Date Preset Logic ---
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

function displayStats(sessions, container) {
    console.log('Displaying stats for sessions:', sessions.length);
    
    if (!container) {
        console.error('Stats container element not provided to displayStats');
        return;
    }
    
    // Clear only the stats grid container before displaying
    container.innerHTML = '';
    
    // If no sessions after filtering, show empty state in stats container
    if (sessions.length === 0) {
        displayEmptyState(container);
        return;
    }

    // --- Calculate Base Session Stats --- 
    const totalTime = sessions.reduce((sum, session) => sum + (session.duration || 0), 0);
    const sessionCount = sessions.length;
    const avgTime = sessionCount > 0 ? Math.round(totalTime / sessionCount) : 0;
    
    // --- Calculate Goal Stats ---
    let completedGoals = 0;
    let totalGoals = 0;
    try {
        const allGoals = window.getItems ? window.getItems('GOALS') : 
            JSON.parse(localStorage.getItem('practiceTrack_goals')) || [];
        totalGoals = allGoals.length;
        completedGoals = allGoals.filter(goal => goal.completed).length;
        console.log(`[Stats Display] Found ${completedGoals} completed goals out of ${totalGoals} total.`);
    } catch (e) {
        console.error("Error fetching or processing goals for stats display:", e);
    }
    // --- End Goal Stats ---

    // --- Calculate Most Practiced & Most Frequent Categories --- 
    let mostPracticedCategoryName = 'N/A';
    let mostPracticedCategoryTime = 0;
    let mostFrequentCategoryName = 'N/A';
    let mostFrequentCategoryDays = 0;
    const categories = window.getItems ? window.getItems('CATEGORIES') : JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    if (sessionCount > 0 && categories.length > 0) {
        const durationByCategory = {};
        const daysByCategory = {};

        sessions.forEach(session => {
            if (!session.categoryId) return; // Skip sessions without category
            
            // Duration
            durationByCategory[session.categoryId] = (durationByCategory[session.categoryId] || 0) + (session.duration || 0);
            
            // Frequency (Unique Days)
            if (session.startTime) { // Need startTime for date calculation
                const datePart = new Date(session.startTime).toISOString().split('T')[0];
                if (!daysByCategory[session.categoryId]) {
                    daysByCategory[session.categoryId] = new Set();
                }
                daysByCategory[session.categoryId].add(datePart);
            }
        });

        // Find Most Practiced
        let maxDuration = 0;
        let mostPracticedIds = []; // Store IDs of tied categories
        for (const categoryId in durationByCategory) {
            const currentDuration = durationByCategory[categoryId];
            if (currentDuration > maxDuration) {
                maxDuration = currentDuration;
                mostPracticedIds = [categoryId]; // New leader
            } else if (currentDuration === maxDuration && maxDuration > 0) {
                mostPracticedIds.push(categoryId); // Tie
            }
        }
        // Determine display name based on ties
        if (mostPracticedIds.length === 1) {
            const category = categories.find(c => c.id === mostPracticedIds[0]);
            mostPracticedCategoryName = category ? category.name : 'Unknown';
        } else if (mostPracticedIds.length > 1) {
            mostPracticedCategoryName = 'Multiple'; // Indicate a tie
        }
        // Keep N/A if no duration found
        mostPracticedCategoryTime = maxDuration; // Store the max time regardless of ties

        // Find Most Frequent
        let maxDays = 0;
        let mostFrequentIds = []; // Store IDs of tied categories
        for (const categoryId in daysByCategory) {
            const currentDays = daysByCategory[categoryId].size;
            if (currentDays > maxDays) {
                maxDays = currentDays;
                mostFrequentIds = [categoryId]; // New leader
            } else if (currentDays === maxDays && maxDays > 0) {
                mostFrequentIds.push(categoryId); // Tie
            }
        }
        // Determine display name based on ties
        if (mostFrequentIds.length === 1) {
            const category = categories.find(c => c.id === mostFrequentIds[0]);
            mostFrequentCategoryName = category ? category.name : 'Unknown';
        } else if (mostFrequentIds.length > 1) {
            mostFrequentCategoryName = 'Multiple'; // Indicate a tie
        }
        // Keep N/A if no days found
        mostFrequentCategoryDays = maxDays; // Store the max days regardless of ties
    }
    
    console.log('Calculated stats for display:', {
        totalTime, avgTime, sessionCount,
        mostPracticed: { name: mostPracticedCategoryName, time: mostPracticedCategoryTime },
        mostFrequent: { name: mostFrequentCategoryName, days: mostFrequentCategoryDays },
        completedGoals, totalGoals
    });

    // --- Create stats grid HTML (Corrected) --- 
    container.innerHTML = `
        <div class="stats-grid">
            <div class="card stat-card">
                <h3>Total Practice Time</h3>
                <div class="stat-value">${formatDuration(totalTime)}</div>
                <div class="stat-description">Total time spent practicing</div>
            </div>
            <div class="card stat-card">
                <h3>Average Session</h3>
                <div class="stat-value">${formatDuration(avgTime)}</div>
                <div class="stat-description">Average duration per session</div>
            </div>
            <div class="card stat-card">
                <h3>Completed Goals</h3>
                <div class="stat-value">${completedGoals} / ${totalGoals}</div>
                <div class="stat-description">Completed / Total Goals</div>
            </div>
            <div class="card stat-card">
                <h3>Number of Sessions</h3>
                <div class="stat-value">${sessionCount}</div>
                <div class="stat-description">Total practice sessions recorded</div>
            </div>
            <div class="card stat-card">
                <h3>Most Practiced</h3>
                <div class="stat-value">${mostPracticedCategoryName}</div>
                <div class="stat-description">Category with most time (${formatDuration(mostPracticedCategoryTime)})</div>
            </div>
            <div class="card stat-card">
                <h3>Most Frequent</h3>
                <div class="stat-value">${mostFrequentCategoryName}</div>
                <div class="stat-description">Category practiced most days (${mostFrequentCategoryDays} ${mostFrequentCategoryDays === 1 ? 'day' : 'days'})</div>
            </div>
        </div>
    `;

    // Initialize Lucide icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
}

function displayEmptyState(container) {
    console.log('Displaying empty state in:', container);
    const message = 'No practice sessions match the current filters.';
        
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
    if (!seconds || seconds === 0) return '0m'; // Handle 0 explicitly
    seconds = parseInt(seconds);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
}

function applyFilters() {
    console.log('Applying filters...');
    
    // Get containers
    const statsContainer = document.querySelector('.stats-container');
    if (!statsContainer) {
        console.error('Stats container not found during applyFilters');
        return;
    }
    
    // Get all sessions
    let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    console.log('Total sessions:', sessions.length);
    
    // Get filter values
    const categoryFilter = document.getElementById('category-filter');
    const selectedCategory = categoryFilter ? categoryFilter.value : '';
    
    const startDateInput = document.getElementById('start-date');
    const endDateInput = document.getElementById('end-date');
    const startDate = startDateInput && startDateInput.value ? startDateInput.value : '';
    const endDate = endDateInput && endDateInput.value ? endDateInput.value : '';
    
    console.log('Filters:', {
        category: selectedCategory,
        startDate: startDate,
        endDate: endDate
    });
    
    // Use the common filterRecords function from UI framework
    let filteredSessions = [];
    if (window.UI && typeof window.UI.filterRecords === 'function') {
        filteredSessions = window.UI.filterRecords(sessions, {
            categoryId: selectedCategory,
            startDate: startDate,
            endDate: endDate
        });
    } else {
        // Fallback logic (keep for safety, though unlikely needed)
        console.warn('UI.filterRecords not found, using fallback filtering.');
        filteredSessions = sessions; // Start with all
        if (selectedCategory) {
            filteredSessions = filteredSessions.filter(session => session.categoryId === selectedCategory);
        }
        if (startDate) {
            // ... (fallback date logic) ...
        }
        if (endDate) {
            // ... (fallback date logic) ...
        }
    }
    
    // Display filtered stats (pass the specific container)
    displayStats(filteredSessions, statsContainer);
}

// Listen for categories changed event
document.addEventListener('categoriesChanged', () => {
    console.log('Stats received categories changed event');
    loadCategoryFilter();
});

// Calculate days until next lesson
const calculateDaysUntilLesson = () => {
    try {
        // Get settings
        const settings = JSON.parse(localStorage.getItem('practiceTrack_settings')) || [];
        if (!Array.isArray(settings) || settings.length === 0) {
            console.log('No settings found');
            return null;
        }
        
        const { lessonDay, lessonTime } = settings[0];
        if (!lessonDay || !lessonTime) {
            console.log('No lesson day or time set');
            return null;
        }
        
        // Get current date
        const now = new Date();
        const currentDay = now.getDay();
        
        // Convert lesson day to number (0 = Sunday, 1 = Monday, etc.)
        const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const lessonDayNum = days.indexOf(lessonDay);
        
        // Calculate next lesson date
        let daysUntilLesson = lessonDayNum - currentDay;
        if (daysUntilLesson <= 0) {
            daysUntilLesson += 7; // Add a week if the lesson day has passed
        }
        
        // Create lesson date
        const lessonDate = new Date(now);
        lessonDate.setDate(now.getDate() + daysUntilLesson);
        
        // Set lesson time
        const [hours, minutes] = lessonTime.split(':');
        lessonDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
        
        // Check if lesson time has passed
        if (daysUntilLesson === 0 && now > lessonDate) {
            daysUntilLesson = 7; // Move to next week
            lessonDate.setDate(lessonDate.getDate() + 7);
        }
        
        console.log('Calculated lesson info:', { daysUntilLesson, lessonDate });
        return {
            days: daysUntilLesson,
            date: lessonDate
        };
    } catch (error) {
        console.error('Error calculating days until lesson:', error);
        return null;
    }
};

// Update lesson countdown card
const updateLessonCountdown = (container) => {
    console.log('Updating lesson countdown in:', container);
    if (!container) {
        console.error('Lesson countdown container not provided');
        return;
    }
    
    // Clear existing card
    container.innerHTML = ''; // Clear the specific container
    
    const lessonInfo = calculateDaysUntilLesson();
    let cardHtml = '';
    
    if (!lessonInfo) {
        console.log('No lesson info available');
        cardHtml = `
            <div class="lesson-countdown-card">
            <div class="card-header">
                <h3>Next Lesson</h3>
                <i data-lucide="calendar"></i>
            </div>
            <div class="card-content">
                <p>No lesson scheduled</p>
                </div>
            </div>
        `;
    } else {
    console.log('Creating countdown card with info:', lessonInfo);
        cardHtml = `
            <div class="lesson-countdown-card card">
        <div class="card-header">
            <h3>Next Lesson</h3>
            <i data-lucide="calendar"></i>
        </div>
                <div class="card-content countdown-content">
                    <div class="countdown-item">
                         <span class="countdown-value">${lessonInfo.days}</span>
                         <span class="countdown-label">days</span>
                    </div>
                    <div class="countdown-separator"></div>
                    <div class="countdown-item">
                        <span class="countdown-label">${lessonInfo.date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                        <span class="countdown-label">${lessonInfo.date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</span>
                    </div>
                </div>
        </div>
    `;
    }
    
    // Insert the card HTML into the container
    container.innerHTML = cardHtml;
    
    // Initialize icon if needed
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons({ context: container });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('stats-page')) {
        initStats();
    }
});

// Update navigation handler to initialize stats page
document.addEventListener('navigation', (event) => {
    if (event.detail.page === 'stats') {
        initStats();
    }
});

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

// Add a new function to setup date input listeners
function setupDateInputListeners() {
    const startDateInput = document.getElementById('stats-start-date');
    const endDateInput = document.getElementById('stats-end-date');
    
    if (startDateInput) {
        startDateInput.addEventListener('change', applyFilters);
    }
    
    if (endDateInput) {
        endDateInput.addEventListener('change', applyFilters);
    }
}