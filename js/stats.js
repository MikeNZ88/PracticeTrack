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

/**
 * Calculates practice streaks based on session data.
 * @param {Array<Object>} sessions - Array of session objects with startTime.
 * @returns {Object} An object containing { currentStreak, longestStreak }.
 */
function calculateStreaks(sessions) {
    if (!sessions || sessions.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // 1. Get unique practice dates (YYYY-MM-DD format)
    const practiceDates = new Set();
    sessions.forEach(session => {
        if (session && session.startTime) {
            try {
                const date = new Date(session.startTime);
                if (!isNaN(date.getTime())) { // Check if date is valid
                    // Use UTC dates to avoid timezone shifts affecting date logic
                    const year = date.getUTCFullYear();
                    const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
                    const day = String(date.getUTCDate()).padStart(2, '0');
                    practiceDates.add(`${year}-${month}-${day}`);
                }
            } catch (e) {
                console.warn("Error processing session date for streak:", session.startTime, e);
            }
        }
    });

    // Convert set to sorted array
    const sortedDates = Array.from(practiceDates).sort();

    if (sortedDates.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // 2. Calculate streaks
    let currentStreak = 0;
    let longestStreak = 0;
    let currentCount = 0;

    for (let i = 0; i < sortedDates.length; i++) {
        const currentDate = new Date(`${sortedDates[i]}T00:00:00Z`); // Treat as UTC
        
        if (i === 0) {
            // First date in the list
            currentCount = 1;
        } else {
            const previousDate = new Date(`${sortedDates[i-1]}T00:00:00Z`);
            // Check if the difference is exactly one day (in milliseconds)
            const diff = currentDate.getTime() - previousDate.getTime();
            if (diff === 24 * 60 * 60 * 1000) {
                currentCount++;
            } else {
                // Streak broken
                if (currentCount > longestStreak) {
                    longestStreak = currentCount;
                }
                currentCount = 1; // Start new streak
            }
        }
    }
    // Update longest streak one last time after the loop
    if (currentCount > longestStreak) {
        longestStreak = currentCount;
    }

    // 3. Check current streak based on today/yesterday
    const today = new Date();
    const todayYear = today.getUTCFullYear();
    const todayMonth = String(today.getUTCMonth() + 1).padStart(2, '0');
    const todayDay = String(today.getUTCDate()).padStart(2, '0');
    const todayStr = `${todayYear}-${todayMonth}-${todayDay}`;
    
    const yesterday = new Date(today);
    yesterday.setUTCDate(today.getUTCDate() - 1);
    const yesterdayYear = yesterday.getUTCFullYear();
    const yesterdayMonth = String(yesterday.getUTCMonth() + 1).padStart(2, '0');
    const yesterdayDay = String(yesterday.getUTCDate()).padStart(2, '0');
    const yesterdayStr = `${yesterdayYear}-${yesterdayMonth}-${yesterdayDay}`;

    if (practiceDates.has(todayStr) || practiceDates.has(yesterdayStr)) {
        // If practiced today or yesterday, the current streak is the last calculated count
        currentStreak = currentCount;
    } else {
        // If no practice today or yesterday, current streak is 0
        currentStreak = 0;
    }

    return { currentStreak, longestStreak };
}

/**
 * Displays the practice streak card.
 * @param {Object} streakData - Object with { currentStreak, longestStreak }.
 * @param {HTMLElement} container - The container element (#streak-card-container).
 */
function displayStreakCard(streakData, container) {
    if (!container) {
        console.error("Streak card container not provided.");
        return;
    }
    
    const { currentStreak, longestStreak } = streakData;
    
    container.innerHTML = `
        <h3><i data-lucide="flame"></i> Practice Streaks</h3>
        <div class="streak-content">
            <div class="streak-item">
                <div class="streak-value">${currentStreak}</div>
                <div class="streak-label">Current Streak${currentStreak === 1 ? ' day' : ' days'}</div>
            </div>
            <div class="streak-item">
                <div class="streak-value">${longestStreak}</div>
                <div class="streak-label">Longest Streak${longestStreak === 1 ? ' day' : ' days'}</div>
            </div>
        </div>
        <p class="stat-description">Consecutive days with practice recorded.</p>
    `;
    
    // Initialize icon
    if (window.lucide) {
        window.lucide.createIcons({ context: container });
    }
}

// Stats Module
function initStats() {
    console.log('Initializing stats module');
    
    // Get or create containers
    const statsContainer = document.querySelector('.stats-container');
    const countdownContainer = document.getElementById('lesson-countdown-container'); 
    if (!statsContainer || !countdownContainer) {
        console.error('Required containers (.stats-container, #lesson-countdown-container) not found');
        return;
    }
    
    // Clear existing content
    statsContainer.innerHTML = '';
    countdownContainer.innerHTML = ''; 

    // Update lesson countdown (always do this)
    updateLessonCountdown(countdownContainer);
    
    // Filter sessions based on initial date filter for main stats display
    // Note: We re-fetch here or use a filtered version for displayStats
    let initialFilteredSessions = [];
    try {
        initialFilteredSessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
         // TODO: Apply initial date filter ('week') here before passing to displayStats
    } catch (e) {
        console.error("Error fetching sessions for initial display:", e);
    }
    
    // Show empty state or stats based on potentially filtered sessions
    if (!initialFilteredSessions || initialFilteredSessions.length === 0) {
        displayEmptyState(statsContainer);
    } else {
        // Apply initial filters before displaying stats (important!)
        // The applyFilters function will call displayStats with filtered data
        // applyFilters(); // This will be called later after setup
        // For now, let's display based on unfiltered, will be replaced by applyFilters call
        // displayStats(initialFilteredSessions, statsContainer);
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
        // Define the handler function
        const handleStatsPresetChange = () => {
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
                case 'custom': // Keep custom values if selected
                     startDate = startDateInput.value;
                     endDate = endDateInput.value;
                     break;
                 case 'all': // Default case for 'all'
                 default:
                    startDate = '';
                    endDate = '';
                    break;
            }
            
            if (selectedPreset !== 'custom') {
                 startDateInput.value = startDate;
                 endDateInput.value = endDate;
             }
            // Apply filters directly in stats
             applyFilters(); 
        };
        
        // Attach the handler
        presetFilter.addEventListener('change', handleStatsPresetChange);
        
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

        // Set initial state to 'week'
        presetFilter.value = 'week';
        // dateRangeDiv.style.display = 'none'; // Handler will set this
        // startDateInput.value = ''; // Handler will set this
        // endDateInput.value = ''; // Handler will set this

        // Apply initial filters by calling the handler
        handleStatsPresetChange(); 
        // REMOVED: applyFilters(); // Handler calls this now
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

function displayStats(sessions, container, previousPeriodStats) {
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

    // --- Calculate Streaks (using ALL sessions) ---
    let allSessionsForStreaks = [];
    try {
        allSessionsForStreaks = window.getItems ? window.getItems('SESSIONS') : 
            JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    } catch(e) {
        console.error("Error fetching sessions for streak calculation in displayStats:", e);
    }
    const { currentStreak, longestStreak } = calculateStreaks(allSessionsForStreaks);
    // --- End Streak Calculation ---

    // --- Calculate Base Session Stats (using FILTERED sessions) --- 
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
        // Keep N/A if no frequency found
        mostFrequentCategoryDays = maxDays; // Store max days regardless of ties
    }
    
    console.log('Calculated stats for display:', {
        totalTime, avgTime, sessionCount,
        mostPracticed: { name: mostPracticedCategoryName, time: mostPracticedCategoryTime },
        mostFrequent: { name: mostFrequentCategoryName, days: mostFrequentCategoryDays },
        completedGoals, totalGoals
    });

    // --- Helper to generate comparison string ---
    const getComparisonHTML = (currentValue, previousValue) => {
        if (previousPeriodStats === null || previousValue === undefined || currentValue === undefined) {
            return '<span class="stat-comparison no-data">--</span>'; // No comparison possible
        }
        if (previousValue === 0) {
            return '<span class="stat-comparison increase"><i data-lucide="trending-up"></i> New</span>'; // Increase from zero
        }
        
        const change = currentValue - previousValue;
        const percentChange = Math.round((change / previousValue) * 100);
        
        if (percentChange > 0) {
            return `<span class="stat-comparison increase"><i data-lucide="trending-up"></i> +${percentChange}%</span>`;
        } else if (percentChange < 0) {
            return `<span class="stat-comparison decrease"><i data-lucide="trending-down"></i> ${percentChange}%</span>`;
        } else {
            return '<span class="stat-comparison no-change">No Change</span>';
        }
    };

    // --- Create Stats Grid HTML ---
    const statsGridHTML = `
        <div class="stat-card">
            <h3>Total Practice Time</h3>
            <div class="stat-value">${formatTime(totalTime)}</div>
            <p class="stat-description">
                Total time spent practicing 
                ${getComparisonHTML(totalTime, previousPeriodStats?.totalTime)}
            </p>
        </div>
        <div class="stat-card">
            <h3>Average Session</h3>
            <div class="stat-value">${formatTime(avgTime)}</div>
            <p class="stat-description">
                Average duration per session 
                ${getComparisonHTML(avgTime, previousPeriodStats?.avgTime)}
            </p>
        </div>
        <div class="stat-card">
            <h3>Completed Goals</h3>
            <div class="stat-value">${completedGoals} / ${totalGoals}</div>
            <p class="stat-description">Completed / Total Goals</p> <!-- No comparison for goals -->
        </div>
        <div class="stat-card">
            <h3>Number of Sessions</h3>
            <div class="stat-value">${sessionCount}</div>
            <p class="stat-description">
                Total practice sessions recorded 
                ${getComparisonHTML(sessionCount, previousPeriodStats?.sessionCount)}
            </p>
        </div>
        <div class="stat-card"> <!-- Practice Streaks Card -->
            <h3><i data-lucide="flame"></i> Practice Streaks</h3>
            <div class="stat-value-compound">
                 <div class="stat-item">
                     <span class="stat-sub-value">${currentStreak}</span>
                     <span class="stat-sub-label">Current</span>
                 </div>
                 <div class="stat-item">
                     <span class="stat-sub-value">${longestStreak}</span>
                     <span class="stat-sub-label">Longest</span>
                 </div>
             </div>
            <p class="stat-description">Consecutive days practiced</p> <!-- No comparison for streaks -->
        </div>
        <div class="stat-card">
            <h3>Most Frequent</h3>
            <div class="stat-value">${mostFrequentCategoryName}</div>
            <p class="stat-description">Category practiced most days (${mostFrequentCategoryDays} days)</p> <!-- No comparison for most frequent -->
        </div>
    `;
    // --- End Stats Grid HTML ---
    
    container.innerHTML = statsGridHTML;
    
    // Initialize Lucide icons within the stats grid
    if (window.lucide) {
        window.lucide.createIcons({ context: container });
    }
    
    // Add any specific chart rendering logic here if needed
    // renderCharts(sessions, container);
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
    
    const startDateInput = document.getElementById('stats-start-date');
    const endDateInput = document.getElementById('stats-end-date');
    const startDateStr = startDateInput ? startDateInput.value : '';
    const endDateStr = endDateInput ? endDateInput.value : '';
    
    console.log('Filters:', {
        category: selectedCategory,
        startDate: startDateStr,
        endDate: endDateStr
    });
    
    // Clear current stats display while loading
    if (statsContainer) {
        statsContainer.innerHTML = '<p class="loading-stats">Loading stats...</p>';
    }

    const allSessions = window.getItems ? window.getItems('SESSIONS') : JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    
    // Filter sessions based on category and date
    const categoryId = categoryFilter ? categoryFilter.value : '';
    const filterStartDate = startDateStr ? new Date(startDateStr + 'T00:00:00') : null;
    const filterEndDate = endDateStr ? new Date(endDateStr + 'T23:59:59') : null;
    
    const filteredSessions = allSessions.filter(session => {
        let keep = true;
        if (categoryId && session.categoryId !== categoryId) {
            keep = false;
        }
        if (filterStartDate && new Date(session.startTime) < filterStartDate) {
            keep = false;
        }
        if (filterEndDate && new Date(session.startTime) > filterEndDate) {
            keep = false;
        }
        return keep;
    });
    
    // --- Calculate Previous Period Stats --- 
    let previousPeriodStats = null;
    if (filterStartDate && filterEndDate) {
        try {
            const currentStartMs = filterStartDate.getTime();
            const currentEndMs = filterEndDate.getTime();
            const currentDurationMs = currentEndMs - currentStartMs;
            
            // Calculate previous period dates
            const prevEndMs = currentStartMs - (24 * 60 * 60 * 1000); // Day before current start
            const prevStartMs = prevEndMs - currentDurationMs; 
            
            const prevStartDate = new Date(prevStartMs);
            const prevEndDate = new Date(prevEndMs);
            
            // Filter sessions for the previous period
            const previousSessions = allSessions.filter(session => {
                 const sessionTime = new Date(session.startTime).getTime();
                 return sessionTime >= prevStartMs && sessionTime <= prevEndMs && 
                        (!categoryId || session.categoryId === categoryId); // Apply category filter too
            });
            
            // Calculate stats for the previous period
            if (previousSessions.length > 0) {
                const previousTotalTime = previousSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
                const previousSessionCount = previousSessions.length;
                const previousAvgTime = previousSessionCount > 0 ? Math.round(previousTotalTime / previousSessionCount) : 0;
                
                previousPeriodStats = {
                    totalTime: previousTotalTime,
                    sessionCount: previousSessionCount,
                    avgTime: previousAvgTime
                };
                console.log("[Stats] Previous Period Data:", previousPeriodStats);
            } else {
                 previousPeriodStats = { totalTime: 0, sessionCount: 0, avgTime: 0 }; // Set to zero if no data
                 console.log("[Stats] No data found for the previous period.");
            }
        } catch (e) {
            console.error("Error calculating previous period stats:", e);
            previousPeriodStats = null; // Ensure it's null on error
        }
    }
    // --- End Previous Period Stats --- 

    // Display filtered stats, passing previous period data
    if (statsContainer) {
        displayStats(filteredSessions, statsContainer, previousPeriodStats);
    } else {
        console.error("Stats container not found when trying to display results.");
    }
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