/**
 * Sessions Module
 * Manages practice sessions using the common UI framework
 */

// Session data storage
let sessionDialog = null;

// Cache for categories to improve performance
let cachedCategories = null;

// Constants for lazy loading
const BATCH_SIZE = 30; // Increased from 20 to 30 for better initial load
let currentBatchIndex = 0;
let sessionCache = null; // Added cache for filtered sessions

/**
 * Initialize sessions page with performance optimizations
 */
function initializeSessions() {
    console.log('[DEBUG Sessions] Initializing Sessions page...');
    // Reset batch index and cache
    currentBatchIndex = 0;
    sessionCache = null;
    
    // Pre-cache categories
    cachedCategories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];

    // Use the UI framework to initialize the sessions page - RESTORED
    window.UI.initRecordPage({
        pageId: 'sessions',
        recordType: 'SESSIONS',
        listContainerId: 'sessions-list',
        addButtonId: 'add-session-btn',
        searchInputSelector: '.search-input',
        categoryFilterSelector: '.category-filter',
        dateInputsSelector: '.date-input',
        emptyStateMessage: 'No practice sessions recorded yet.',
        emptyStateIcon: 'list',
        addEmptyStateButtonId: 'empty-add-session',
        addEmptyStateButtonText: 'Add Your First Session',
        createRecordElementFn: createSessionElement, // Ensure this function exists and works
        showDialogFn: showSessionDialog // Ensure this function exists and works
    });
    
    // --- START: Event Delegation for Session Card Buttons ---
    const sessionsListContainer = document.getElementById('sessions-list');
    if (sessionsListContainer && !sessionsListContainer.dataset.delegationListenerAdded) {
        console.log('[DEBUG Sessions] Adding event delegation listener to #sessions-list');
        sessionsListContainer.addEventListener('click', (e) => {
            // Find the closest button clicked (edit or delete)
            const editButton = e.target.closest('.edit-session');
            const deleteButton = e.target.closest('.delete-session');
            
            if (editButton || deleteButton) {
                // Prevent the main card click listener from firing
                e.stopPropagation(); 
                
                // Find the parent session item to get the ID
                const sessionItem = e.target.closest('.session-item');
                if (sessionItem && sessionItem.dataset.id) {
                    const sessionId = sessionItem.dataset.id;
                    console.log(`[DEBUG Sessions Delegation] Click detected on ${editButton ? 'edit' : 'delete'} button for session ID: ${sessionId}`);
                    
                    if (editButton) {
                        showSessionDialog(sessionId);
                    } else if (deleteButton) {
                        deleteSession(sessionId);
                    }
                } else {
                    console.warn('[DEBUG Sessions Delegation] Could not find parent .session-item or its data-id for clicked button.');
                }
            }
        });
        sessionsListContainer.dataset.delegationListenerAdded = 'true'; // Mark listener as added
    }
    // --- END: Event Delegation ---
    
    // Add Date Preset Logic with optimizations - RESTORED
    const pageElement = document.getElementById('sessions-page');
    if (!pageElement) {
         console.error('[DEBUG Sessions] Sessions page element not found in initializeSessions.');
         return;
    }
    
    // Get preset filter and date inputs
    const elements = {
        presetFilter: pageElement.querySelector('.date-preset-filter'),
        dateRange: pageElement.querySelector('.date-range'),
        startDateInput: pageElement.querySelector('#sessions-start-date'),
        endDateInput: pageElement.querySelector('#sessions-end-date'),
        searchInput: pageElement.querySelector('.search-input')
    };
    
    // Skip if elements aren't found
    if (!elements.presetFilter) {
        console.error('[DEBUG Sessions] Date preset filter not found on sessions page');
        return;
    }
    
    // Function to handle preset change
    function handlePresetChange() {
        const selectedPreset = elements.presetFilter.value;
        console.log(`[DEBUG Sessions] Date preset changed to: ${selectedPreset}`);
        
        const today = new Date();
        let startDate = '';
        let endDate = '';
        
        // Show/hide custom date inputs based on preset
        if (selectedPreset === 'custom') {
            elements.dateRange.style.display = 'flex';
            return; // Don't change values when 'custom' is selected
        } else {
            elements.dateRange.style.display = 'none';
        }
        
        // Calculate date ranges based on preset
        switch (selectedPreset) {
            case 'today':
                startDate = today.toISOString().split('T')[0];
                endDate = startDate;
                break;
            case 'yesterday':
                const yesterday = new Date(today);
                yesterday.setDate(yesterday.getDate() - 1);
                startDate = yesterday.toISOString().split('T')[0];
                endDate = startDate;
                break;
            case 'thisWeek':
                const thisWeekStart = new Date(today);
                const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
                const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                thisWeekStart.setDate(today.getDate() - daysFromMonday);
                startDate = thisWeekStart.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break;
            case 'lastWeek':
                const lastWeekStart = new Date(today);
                const lastWeekEnd = new Date(today);
                const currentDayOfWeek = today.getDay() || 7; // Convert Sunday (0) to 7
                const daysToLastMonday = currentDayOfWeek + 6; // Days to previous Monday
                const daysToLastSunday = currentDayOfWeek + 0; // Days to previous Sunday
                lastWeekStart.setDate(today.getDate() - daysToLastMonday);
                lastWeekEnd.setDate(today.getDate() - daysToLastSunday);
                startDate = lastWeekStart.toISOString().split('T')[0];
                endDate = lastWeekEnd.toISOString().split('T')[0];
                break;
            case 'thisMonth':
                const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                startDate = thisMonthStart.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break;
            case 'lastMonth':
                const lastMonthStart = new Date(today.getFullYear(), today.getMonth() - 1, 1);
                const lastMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);
                startDate = lastMonthStart.toISOString().split('T')[0];
                endDate = lastMonthEnd.toISOString().split('T')[0];
                break;
            case 'thisYear':
                const thisYearStart = new Date(today.getFullYear(), 0, 1);
                startDate = thisYearStart.toISOString().split('T')[0];
                endDate = today.toISOString().split('T')[0];
                break;
            case 'all':
            default:
                startDate = '';
                endDate = '';
                break;
        }
        
        // Set input values
        if (elements.startDateInput && elements.endDateInput) {
            elements.startDateInput.value = startDate;
            elements.endDateInput.value = endDate;
        }
        
        // Use our optimized filter handling
        if (window.PerfOpt) {
            // Invalidate cache for this record type
            window.PerfOpt.invalidateCache('SESSIONS');
        }
        
        // Trigger UI framework to reload sessions with new filter
        window.UI.loadRecords('sessions');
    }
    
    // Add event listener for preset change if not already added
    if (!elements.presetFilter.dataset.listenerAdded) {
        elements.presetFilter.addEventListener('change', handlePresetChange);
        
        // Add event listeners to date inputs - optimized with debounce
        if (elements.startDateInput && elements.endDateInput) {
            const debouncedReload = window.PerfOpt ? 
                window.PerfOpt.debounce(() => window.UI.loadRecords('sessions'), 300) : 
                () => window.UI.loadRecords('sessions');
                
            elements.startDateInput.addEventListener('change', function() {
                elements.presetFilter.value = 'custom';
                elements.dateRange.style.display = 'flex';
                debouncedReload();
            });
            
            elements.endDateInput.addEventListener('change', function() {
                elements.presetFilter.value = 'custom';
                elements.dateRange.style.display = 'flex';
                debouncedReload();
            });
        }
        
        if (elements.searchInput) {
            // Use debounce for search input if available
            const debouncedSearch = window.PerfOpt ? 
                window.PerfOpt.debounce(() => {
                    // Reset cache and reload
                    currentBatchIndex = 0;
                    sessionCache = null;
                    const sessionsList = document.getElementById('sessions-list');
                    if (sessionsList) {
                        sessionsList.innerHTML = '';
                    }
                    window.UI.loadRecords('sessions');
                }, 300) : 
                () => {
                    // Fallback if PerfOpt not available
                    currentBatchIndex = 0;
                    sessionCache = null;
                    const sessionsList = document.getElementById('sessions-list');
                    if (sessionsList) {
                        sessionsList.innerHTML = '';
                    }
                    window.UI.loadRecords('sessions');
                };
                
            elements.searchInput.addEventListener('input', debouncedSearch);
        }
        
        elements.presetFilter.dataset.listenerAdded = 'true'; // Mark as added
        console.log('[DEBUG Sessions] Date filter event listeners added.');
    }

    // Set initial state to "Today"
    elements.presetFilter.value = 'today'; 
    
    // Explicitly trigger the preset change handler to apply the default filter
    handlePresetChange();

    console.log('[DEBUG Sessions] Initialization complete.');
}

/**
 * Create a session element for the DOM
 * @param {Object} session - The session data
 * @param {Object} categoryMap - Map of category IDs to names
 * @returns {HTMLElement} - The session element
 */
function createSessionElement(session, categoryMap) {
    // Detailed information for sessions card
    const sessionElement = document.createElement('div');
    sessionElement.classList.add('record-card', 'session-card');
    sessionElement.setAttribute('data-id', session.id);
    
    // Get category for color class
    let categoryName = 'No Category';
    if (session.categoryId && categoryMap && categoryMap[session.categoryId]) {
        categoryName = categoryMap[session.categoryId];
    } else if (session.categoryId) {
        // Use utility function if not provided in map
        categoryName = window.Utils.getCategoryName(session.categoryId);
    }
    
    // Apply category color class - using utility function
    sessionElement.classList.add(window.Utils.getCategoryColorClass(categoryName));
    
    // Format date and time using the utility function
    const { dateStr, timeStr } = window.Utils.formatDateTime(session.startTime);
    
    // Create HTML structure for session card with important details
    sessionElement.innerHTML = `
        <div class="record-header">
            <div class="record-title">${window.Utils.escapeHTML(session.title || 'Practice Session')}</div>
            <div class="record-actions">
                <button class="icon-button edit-button edit-session" aria-label="Edit session">
                    <i data-lucide="edit-3"></i>
                </button>
                <button class="icon-button delete-button delete-session" aria-label="Delete session">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
        <div class="record-details">
            <div class="record-category">${window.Utils.escapeHTML(categoryName)}</div>
            <div class="record-date-time">
                <span class="record-date">${dateStr}</span>
                <span class="record-time">${timeStr}</span>
            </div>
            <div class="session-duration">
                <i data-lucide="clock"></i>
                <span>${formatDuration(session)}</span>
            </div>
        </div>
        ${session.notes ? `<div class="record-notes">${window.Utils.escapeHTML(session.notes)}</div>` : ''}
    `;
    
    // Initialize event listeners (now using event delegation)
    // addSessionEventListeners(sessionElement, session.id);
    
    // Initialize icons within element - using utility function
    window.Utils.initializeIcons(sessionElement);
    
    return sessionElement;
}

/**
 * Format duration into a string - keeping this locally since it's specialized
 * @param {Object} session - The session data
 * @returns {string} - Formatted duration string
 */
function formatDuration(session) {
    const durationSeconds = (session.endTime && session.startTime) 
        ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
        : session.duration || 0;

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    const durationParts = [];
    if (hours > 0) durationParts.push(`${hours}h`);
    if (minutes > 0 || hours > 0) durationParts.push(`${minutes}m`);
    durationParts.push(`${seconds}s`);
    return durationParts.join(' ');
}

/**
 * Show session dialog for adding/editing
 * @param {string} sessionId - Optional session ID for editing
 */
function showSessionDialog(sessionId) {
    // Get session data if editing
    let sessionData = null;
    
    if (sessionId) {
        sessionData = window.getItemById ? window.getItemById('SESSIONS', sessionId) : 
            (JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [])
                .find(s => s.id === sessionId);
    }
    
    // Ensure cachedCategories is up-to-date before creating options
    if (!cachedCategories) {
         cachedCategories = window.getItems ? window.getItems('CATEGORIES') : 
            JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
         // Log what categories were fetched
         console.log('[DEBUG Sessions] Fetched/Refreshed cachedCategories:', JSON.stringify(cachedCategories));
    }
    // Create options with a default "optional" entry first
    const categoryOptions = [
        { value: '', text: 'Select Category (Optional)' }, // Add default option
        ...(cachedCategories || []).map(cat => ({ value: cat.id, text: cat.name }))
    ];
    // Log the final options array being passed to the dialog
    console.log('[DEBUG Sessions] Final categoryOptions for dialog:', JSON.stringify(categoryOptions));

    // --- Fetch Goals for Dropdown ---
    let goals = [];
    try {
        goals = window.getItems ? window.getItems('GOALS') : 
            JSON.parse(localStorage.getItem('practiceTrack_goals')) || [];
    } catch (e) {
        console.error('[DEBUG Sessions] Error fetching goals for dialog:', e);
    }
    const goalOptions = [
        { value: '', text: 'Select Goal (Optional)' }, // Default option
        ...goals
            .filter(goal => goal && !goal.completed) // Only show active goals
            .sort((a, b) => a.title.localeCompare(b.title)) // Sort alphabetically
            .map(goal => ({ value: goal.id, text: goal.title }))
    ];
    console.log('[DEBUG Sessions] Final goalOptions for dialog:', JSON.stringify(goalOptions));
    // --- End Fetch Goals ---
    
    // Set default date to today if creating new session
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Set up form fields
    const fields = [
        {
            type: 'select',
            id: 'session-category',
            label: 'Category',
            options: categoryOptions,
            value: sessionData ? sessionData.categoryId : ''
        },
        {
            type: 'select',
            id: 'session-goal',
            label: 'Goal (Optional)',
            options: goalOptions,
            value: sessionData ? sessionData.goalId || '' : ''
        },
        {
            type: 'date',
            id: 'session-date',
            label: 'Date',
            required: true,
            value: sessionData ? sessionData.startTime.split('T')[0] : dateString
        },
        {
            type: 'text',
            id: 'session-duration-hms',
            label: 'Duration (HH:MM:SS)',
            required: true,
            placeholder: 'e.g., 1:25:30 or 45:00 or 90',
            pattern: "^\\d*[:]?\\d{0,2}[:]?\\d{0,2}$",
            title: "Enter duration as H:MM:SS, MM:SS, or just seconds",
            value: (sessionData && typeof sessionData.duration === 'number') ? window.Utils.formatSecondsAsHMS(sessionData.duration) : '0:00:00'
        },
        {
            type: 'textarea',
            id: 'dialog-session-notes',
            label: 'Notes',
            rows: 4,
            value: sessionData ? sessionData.notes || '' : ''
        }
    ];
    
    // Create dialog using UI framework
    sessionDialog = window.UI.createStandardDialog({
        title: sessionId ? 'Edit Session' : 'Add New Practice Session',
        fields: fields,
        onSubmit: (dialog, e) => handleSessionFormSubmit(dialog, e, sessionId),
        onCancel: (dialog) => { dialog.close(); },
        submitButtonText: 'Save Session',
        cancelButtonText: 'Cancel'
    });
    
    // Show dialog
    sessionDialog.showModal();
}

/**
 * Handle session form submission
 * @param {HTMLElement} dialog - The dialog element
 * @param {Event} e - The submit event
 * @param {string} sessionId - Optional session ID for editing
 */
function handleSessionFormSubmit(dialog, e, sessionId) {
    // <<< Log arguments immediately on entry >>>
    console.log('[DEBUG Sessions] handleSessionFormSubmit received dialog:', dialog);
    console.log('[DEBUG Sessions] handleSessionFormSubmit received event object (e):', e);
    console.log('[DEBUG Sessions] handleSessionFormSubmit received sessionId:', sessionId);
    
    try {
        console.log('[DEBUG Sessions] Inside try block. Session ID:', sessionId);
        
        // --- Edit Specific Logging --- 
        if (sessionId) {
            console.log(`[DEBUG Sessions EDIT] Attempting to edit session ID: ${sessionId}`);
        }
        // --- End Edit Specific Logging --- 

        // Fetch original record if editing to preserve createdAt
        let originalCreatedAt = null;
        if (sessionId) {
            const originalRecord = window.getItemById ? window.getItemById('SESSIONS', sessionId) : 
                (JSON.parse(localStorage.getItem('practiceTrack_sessions')) || []).find(s => s.id === sessionId);
            if (originalRecord) { // <<< Log even if createdAt is missing
                originalCreatedAt = originalRecord.createdAt;
                console.log('[DEBUG Sessions EDIT] Found original record:', originalRecord);
                console.log('[DEBUG Sessions EDIT] Using original createdAt:', originalCreatedAt);
            } else {
                 console.warn(`[DEBUG Sessions EDIT] Could not find original record for ID: ${sessionId}`);
                 // Decide how to handle - maybe prevent save?
                 alert('Error: Could not find the original session record to edit.');
                 return;
            }
        }

        // Get form data and parse, defaulting empty/invalid to 0
        const formData = new FormData(dialog.querySelector('form'));
        const categoryId = formData.get('session-category');
        const goalId = formData.get('session-goal');
        const dateValue = formData.get('session-date'); // YYYY-MM-DD
        const durationHMS = formData.get('session-duration-hms');
        const notes = formData.get('dialog-session-notes');

        // --- Detailed Validation --- 
        let validationError = null;
        const totalDurationSeconds = durationHMS ? window.Utils.parseDurationHMS(durationHMS) : 0;

        // REMOVED Category Check: Category is now optional
        /* 
        if (!categoryId) {
            validationError = 'Category not selected.';
        } else */ 
        
        // Check Date and Duration
        if (!dateValue) {
            validationError = 'Date not selected.';
        } else if (totalDurationSeconds <= 0) { // Check total duration is positive and parsing was successful
             validationError = 'Duration must be a valid time (e.g., H:MM:SS, MM:SS, or seconds) and greater than 0.';
        }
        
        // Log validation result
        console.log(`[DEBUG Sessions VALIDATION] Category='${categoryId}', Date='${dateValue}', Duration='${durationHMS || "N/A"}' (Parsed Total: ${totalDurationSeconds}s). Error: ${validationError || 'None'}`);

        // Check if validation failed
        if (validationError) { 
            console.error('[DEBUG Sessions] Validation failed:', validationError);
            // Show specific error in alert
            alert(`Invalid Input: ${validationError}`); 
            return; // Stop processing
        }
        // --- End Detailed Validation ---
        
        // Validation passed, proceed with calculation
        console.log('[DEBUG Sessions] Validation passed.');

        // --- Calculate startTime and endTime ---
        const sessionDate = new Date(dateValue); // Parses YYYY-MM-DD
        // IMPORTANT: Set time to noon in the LOCAL timezone to avoid UTC conversion issues
        // When just YYYY-MM-DD is parsed, it defaults to UTC midnight.
        sessionDate.setHours(12, 0, 0, 0); 
        console.log(`[DEBUG Sessions] Parsed date value: ${dateValue}, Created Date object: ${sessionDate.toString()}`);

        const sessionStartTime = sessionDate.getTime(); // Milliseconds since epoch
        const sessionEndTime = sessionStartTime + (totalDurationSeconds * 1000);
        
        const startTimeISO = new Date(sessionStartTime).toISOString();
        const endTimeISO = new Date(sessionEndTime).toISOString();
        
        console.log(`[DEBUG Sessions] Calculated Times:
                     Duration: ${durationHMS || 'N/A'}
                     Start (ms): ${sessionStartTime}, Start (ISO): ${startTimeISO}
                     End (ms): ${sessionEndTime}, End (ISO): ${endTimeISO}`);
        // --- End Time Calculation --- 
        
        // Prepare session data object
        const sessionData = {
            categoryId: categoryId || '', // Ensure empty string if null/undefined
            startTime: startTimeISO, // Store as ISO string
            endTime: endTimeISO,   // Store as ISO string
            duration: totalDurationSeconds, // Store calculated total duration in seconds
            notes: notes || '',
            goalId: goalId || null, // <<< Add Goal ID (null if none selected)
            isLesson: false, // Assuming manual entries are not lessons by default
            updatedAt: new Date().toISOString(),
            createdAt: sessionId ? originalCreatedAt : new Date().toISOString(),
            // Add id if editing, or generate if new
            ...(sessionId ? { id: sessionId } : { id: `session_${Date.now()}` })
        };

        console.log('[DEBUG Sessions] Prepared session data:', JSON.parse(JSON.stringify(sessionData)));

        // Save session using the data layer
        if (sessionId) {
             console.log('[DEBUG Sessions EDIT] Updating existing item with ID:', sessionId);
             window.updateItem('SESSIONS', sessionId, sessionData); // Assumes updateItem exists
        } else {
             window.addItem('SESSIONS', sessionData); // Assumes addItem exists
        }
        
        console.log('[DEBUG Sessions] Session save/update call potentially successful.'); 
        
        const saveButton = dialog.querySelector('button[type="submit"]');
        if (saveButton) {
            saveButton.textContent = 'Saved!';
            saveButton.classList.add('success');
            saveButton.disabled = true; // Briefly disable button
            setTimeout(() => {
                // Check if dialog still exists before updating button
                if (dialog && dialog.open) { 
                    saveButton.textContent = 'Save Session';
                    saveButton.classList.remove('success');
                    saveButton.disabled = false;
                }
            }, 1500); 
        }
        // Close dialog immediately
        console.log('[DEBUG Sessions] Attempting to close dialog...', dialog); 
        dialog.close();
        console.log('[DEBUG Sessions] Dialog close() called.'); 
        
        // Reload sessions list
        console.log('[DEBUG Sessions] Calling UI.loadRecords after save/update.');
        window.UI.loadRecords('sessions');
        
    } catch (error) {
        console.error('Error saving session:', error); // <<< Keep original error log
        // <<< Add more detailed error logging >>>
        console.error('[DEBUG Sessions] Caught error details - Message:', error.message);
        console.error('[DEBUG Sessions] Caught error details - Stack:', error.stack);
        alert('There was an error saving the session.');
    }
}

/**
 * Delete a session
 * @param {string} sessionId - The session ID to delete
 */
async function deleteSession(sessionId) {
    // Ask for confirmation
    if (!confirm('Are you sure you want to delete this session?')) {
        return;
    }

    try {
        // Delete the session data
        const success = window.deleteItem 
            ? await window.deleteItem('SESSIONS', sessionId)
            : await new Promise(resolve => {
                // Fallback for local storage
                let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
                sessions = sessions.filter(s => s.id !== sessionId);
                localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
                resolve(true);
            });
        
        if (success) {
            // Remove from DOM
            const sessionElement = document.querySelector(`.session-card[data-id="${sessionId}"]`);
            if (sessionElement) {
                sessionElement.remove();
            }
            
            // Check if list is now empty
            updateEmptyState();
        }
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Failed to delete session. Please try again.');
    }
}

/**
 * Load a batch of sessions
 */
function loadSessionBatch() {
    // Use cached filtered sessions if available
    if (!sessionCache) {
        // Get filters
        const pageElement = document.getElementById('sessions-page');
        const presetFilter = pageElement ? pageElement.querySelector('.date-preset-filter') : null;
        const startDateInput = pageElement ? pageElement.querySelector('#session-start-date') : null;
        const endDateInput = pageElement ? pageElement.querySelector('#session-end-date') : null;
        const categoryFilter = pageElement ? pageElement.querySelector('.category-filter') : null;
        const searchInput = pageElement ? pageElement.querySelector('.search-input') : null;
        
        // Get all sessions
        const allSessions = window.getItems ? window.getItems('SESSIONS') : 
            JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
            
        // Apply any active filters
        const selectedPreset = presetFilter ? presetFilter.value : 'all';
        const startDate = startDateInput && startDateInput.value ? new Date(startDateInput.value + 'T00:00:00') : null;
        const endDate = endDateInput && endDateInput.value ? new Date(endDateInput.value + 'T23:59:59') : null;
        const categoryId = categoryFilter && categoryFilter.value && categoryFilter.value !== 'all' ? categoryFilter.value : null;
        const searchTerm = searchInput && searchInput.value ? searchInput.value.trim().toLowerCase() : '';
        
        // Pre-fetch categories for search
        const categories = cachedCategories;
        const categoryMap = new Map();
        categories.forEach(cat => {
            if (cat && cat.id && cat.name) {
                categoryMap.set(cat.id, cat.name.toLowerCase());
            }
        });
        
        // Apply filters
        const filteredSessions = allSessions.filter(session => {
            if (!session) return false;
            
            let keep = true;
            
            // Apply date filters if active
            if (startDate && new Date(session.startTime) < startDate) {
                keep = false;
            }
            if (endDate && new Date(session.startTime) > endDate) {
                keep = false;
            }
            
            // Apply category filter if active
            if (categoryId && session.categoryId !== categoryId) {
                keep = false;
            }
            
            // Apply search filter if active
            if (searchTerm && keep) {
                const matchesSearch = (
                    // Check if notes contain the search term
                    (session.notes && session.notes.toLowerCase().includes(searchTerm)) ||
                    // Check if category name contains the search term
                    (session.categoryId && categoryMap.has(session.categoryId) && 
                     categoryMap.get(session.categoryId).includes(searchTerm))
                );
                if (!matchesSearch) {
                    keep = false;
                }
            }
            
            return keep;
        });
        
        // Sort sessions by date (newest first)
        filteredSessions.sort((a, b) => {
            const aDate = new Date(a.startTime || a.createdAt);
            const bDate = new Date(b.startTime || b.createdAt);
            return bDate - aDate;
        });
        
        // Cache the filtered and sorted sessions
        sessionCache = filteredSessions;
        
        // Show empty state if no sessions
        if (filteredSessions.length === 0) {
            const listContainer = document.getElementById('sessions-list');
            if (listContainer) {
                listContainer.innerHTML = `
                    <div class="empty-state">
                        <i data-lucide="list"></i>
                        <p>No practice sessions found with the current filters.</p>
                        <button id="empty-add-session" class="primary-button">Add New Session</button>
                    </div>
                `;
                
                // Initialize Lucide icons
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
                
                // Add listener to the add button
                const addButton = document.getElementById('empty-add-session');
                if (addButton) {
                    addButton.addEventListener('click', showSessionDialog);
                }
            }
            return;
        }
    }
    
    // Get current batch
    const start = currentBatchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const sessionBatch = sessionCache.slice(start, end);
    
    if (sessionBatch.length === 0) {
        // No more sessions to load
        window.removeEventListener('scroll', debouncedHandleScroll);
        return;
    }

    const listContainer = document.getElementById('sessions-list');
    if (!listContainer) return;
    
    // Use document fragment for better performance
    const fragment = document.createDocumentFragment();

    // Pre-calculate common values for performance
    const cachedCategoryMap = new Map();
    // Get all categories, including archived ones, for displaying session cards
    const allCategories = window.getItems ? window.getItems('CATEGORIES', true) : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    allCategories.forEach(category => {
        cachedCategoryMap.set(category.id, category);
    });

    sessionBatch.forEach(session => {
        const sessionElement = createSessionElement(session, cachedCategoryMap);
        fragment.appendChild(sessionElement);
    });

    listContainer.appendChild(fragment);
    currentBatchIndex++;

    // Check if more sessions are available
    if (end < sessionCache.length) {
        // Add scroll event listener to load more sessions
        window.addEventListener('scroll', debouncedHandleScroll);
    } else {
        // Remove scroll listener if all sessions are loaded
        window.removeEventListener('scroll', debouncedHandleScroll);
    }
}

/**
 * Handle scroll event to load more sessions
 */
function handleScroll() {
    // Use the utility debounce function
    const debouncedScroll = window.Utils.debounce(() => {
        const scrollY = window.scrollY;
        const innerHeight = window.innerHeight;
        const scrollHeight = document.body.scrollHeight;
        
        // If we're close to the bottom of the page, load more sessions
        if (scrollY + innerHeight >= scrollHeight - 200) {
            loadSessionBatch();
        }
    }, 100);
    
    debouncedScroll();
}

// Remove original debounce function since it's now in utils.js

// Initialize when page changes to sessions
// document.addEventListener('pageChanged', (e) => {
//     if (e.detail === 'sessions') {
//         console.log('[DEBUG Sessions] pageChanged detected, calling initializeSessions...'); // Restore log
//         initializeSessions();
//     }
// });

// Make function available globally
window.initializeSessions = initializeSessions;

// Add a basic HTML escaping function if not already present globally
function escapeHTML(str) {
  if (typeof str !== 'string') return str; // Handle non-strings gracefully
  return str.replace(/[&<>'"/]/g, function (s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    }[s];
  });
}