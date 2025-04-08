/**
 * Sessions Module
 * Manages practice sessions using the common UI framework
 */

// Session data storage
let sessionDialog = null;

// Cache for categories to improve performance
let cachedCategories = null;

// Constants for lazy loading
const BATCH_SIZE = 20; // Number of sessions to load per batch
let currentBatchIndex = 0;

/**
 * Initialize sessions page with performance optimizations
 */
function initializeSessions() {
    console.log('[DEBUG Sessions] Initializing Sessions page...');
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
    
    // Load the first batch of sessions
    loadSessionBatch();

    // Add Date Preset Logic with optimizations - RESTORED
    const pageElement = document.getElementById('sessions-page');
    if (!pageElement) {
         console.error('[DEBUG Sessions] Sessions page element not found in initializeSessions.');
         return;
    }

    const elements = {
        presetFilter: pageElement.querySelector('.date-preset-filter'),
        startDateInput: pageElement.querySelector('#session-start-date'),
        endDateInput: pageElement.querySelector('#session-end-date'),
        dateRangeDiv: pageElement.querySelector('.date-range')
    };

    if (!elements.presetFilter || !elements.startDateInput || 
        !elements.endDateInput || !elements.dateRangeDiv) {
        console.error('[DEBUG Sessions] One or more date filter elements not found.');
        return; // Avoid errors if elements are missing
    }

    // Optimize date preset change handler
    const handlePresetChange = () => {
        const selectedPreset = elements.presetFilter.value;
        const today = new Date();
        const todayString = today.toISOString().split('T')[0]; // Get YYYY-MM-DD for today
        let startDate = '';
        let endDate = '';

        elements.dateRangeDiv.style.display = (selectedPreset === 'custom') ? 'flex' : 'none';

        switch (selectedPreset) {
            case 'today':
                startDate = todayString;
                endDate = todayString;
                break;
            case 'week':
                const currentDay = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
                const daysSinceMonday = (currentDay === 0) ? 6 : currentDay - 1; // Calculate days passed since Monday
                const mondayDate = new Date(today);
                mondayDate.setDate(today.getDate() - daysSinceMonday);
                startDate = mondayDate.toISOString().split('T')[0];
                
                // Calculate upcoming Sunday
                const daysUntilSunday = (currentDay === 0) ? 0 : 7 - currentDay;
                const sundayDate = new Date(today);
                sundayDate.setDate(today.getDate() + daysUntilSunday);
                endDate = sundayDate.toISOString().split('T')[0];
                break;
            case 'month':
                startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                endDate = todayString; // Use todayString
                break;
            case 'year':
                startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                break;
            case 'ytd':
                startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                endDate = todayString; // Use todayString
                break;
            case 'custom':
                 startDate = elements.startDateInput.value;
                 endDate = elements.endDateInput.value;
                 // Ensure custom inputs are shown
                 elements.dateRangeDiv.style.display = 'flex'; 
                break;
            case 'all': // Explicit 'all' case
            default: 
                 startDate = ''; // Explicitly clear for filtering
                 endDate = '';   // Explicitly clear for filtering
                 // Also clear the input fields themselves
                 elements.startDateInput.value = ''; 
                 elements.endDateInput.value = '';
                 elements.dateRangeDiv.style.display = 'none'; // Hide custom inputs
                break;
        }
        
        // Set input values only if NOT custom and NOT all (already handled for all)
        if (selectedPreset !== 'custom' && selectedPreset !== 'all') {
            elements.startDateInput.value = startDate;
            elements.endDateInput.value = endDate;
        }
        
        // Trigger UI framework to reload records with the new date context
        console.log(`[DEBUG Sessions] Date preset changed to ${selectedPreset}. Filtering with Start: ${startDate || 'none'}, End: ${endDate || 'none'}`);
        window.UI.loadRecords('sessions');
    };

    // Add event listeners only once during initialization
    // Check if listeners were already added to prevent duplicates if init is called multiple times
    if (!elements.presetFilter.dataset.listenerAdded) {
        elements.presetFilter.addEventListener('change', handlePresetChange);
        elements.startDateInput.addEventListener('change', () => {
            elements.presetFilter.value = 'custom';
            elements.dateRangeDiv.style.display = 'flex';
            // No need to call handlePresetChange here, UI.loadRecords happens on input change via framework
        });
        elements.endDateInput.addEventListener('change', () => {
            elements.presetFilter.value = 'custom';
            elements.dateRangeDiv.style.display = 'flex';
             // No need to call handlePresetChange here
        });
        elements.presetFilter.dataset.listenerAdded = 'true'; // Mark as added
        console.log('[DEBUG Sessions] Date filter event listeners added.');
    }

    // Set initial state to "Today"
    elements.presetFilter.value = 'today'; 
    // elements.dateRangeDiv.style.display = 'none'; // handlePresetChange will hide/show this
    // elements.startDateInput.value = ''; // handlePresetChange will set these
    // elements.endDateInput.value = ''; // handlePresetChange will set these

    // Explicitly trigger the preset change handler to apply the default filter
    handlePresetChange();
    // REMOVED: window.UI.loadRecords('sessions'); // handlePresetChange now triggers this via UI framework

    console.log('[DEBUG Sessions] Initialization complete.');
}

/**
 * Create a session element for the UI
 * @param {Object} session - The session data
 * @returns {HTMLElement} - The session element
 */
function createSessionElement(session) {
    console.log(`[DEBUG Sessions CreateElement] Creating element for session ID: ${session?.id}`); // Log entry
    try {
        const sessionElement = document.createElement('div');
        // Use .session-item class for targeting
        sessionElement.className = 'session-item'; 
        sessionElement.dataset.id = session.id;

        // Format duration
        const durationStr = formatDuration(session);

        // Format date and time
        const { dateStr, timeStr } = formatDateTime(session.startTime);
        const formattedDate = dateStr; // Use just date part for card-date

        // --- Determine Category Name and Color ---
        let displayCategoryId = session.categoryId; 
        let category = null;

        if (session.goalId) {
            try {
                const goal = window.getItemById ? window.getItemById('GOALS', session.goalId) : null;
                if (goal && goal.categoryId) {
                    console.log(`[DEBUG Sessions CreateElement] Session ${session.id} linked to Goal ${session.goalId}. Using Goal's Category ID: ${goal.categoryId}`);
                    displayCategoryId = goal.categoryId; 
                } else if (goal) {
                    console.log(`[DEBUG Sessions CreateElement] Session ${session.id} linked to Goal ${session.goalId}, but Goal has no categoryId. Using session categoryId: ${session.categoryId}`);
                } else {
                    console.log(`[DEBUG Sessions CreateElement] Session ${session.id} linked to Goal ${session.goalId}, but Goal not found. Using session categoryId: ${session.categoryId}`);
                }
            } catch (err) {
                console.error(`[DEBUG Sessions CreateElement] Error fetching goal ${session.goalId} for session ${session.id}:`, err);
            }
        }
        category = getCategoryName(displayCategoryId); 
        // --- End Determine Category --- 

        // Determine Session Title (Use category name if no specific title)
        const sessionTitle = session.title || (category !== 'No Category' ? category + ' Practice' : 'Practice Session');
        const notes = session.notes || '';

        // Build HTML using new structure and classes
        sessionElement.innerHTML = `
            ${category !== 'No Category' ? `<div class="card-category-pill">${escapeHTML(category)}</div>` : ''} 
            <h3 class="card-title">${escapeHTML(sessionTitle)}</h3>
            ${notes ? `<p class="card-description">${escapeHTML(notes)}</p>` : '<p class="card-description">&nbsp;</p>' /* Add placeholder if no notes */} 
            <p class="card-date">${formattedDate} (${durationStr})</p> 
            
            <div class="card-actions">
                ${session.isLesson ? '<span class="lesson-badge">Lesson</span>' : ''} 
                <span class="action-spacer"></span> <!-- Optional spacer -->
                <button class="action-button edit-button edit-session" title="Edit Session">
                    <i data-lucide="edit" width="12" height="12"></i>
                    <span>Edit</span>
                </button>
                <button class="action-button delete-button delete-session" title="Delete Session">
                    <i data-lucide="trash-2" width="12" height="12"></i>
                    <span>Delete</span>
                </button>
            </div>
        `;

        // Add event listeners
        addSessionEventListeners(sessionElement, session.id);

        // Initialize icons
        initializeIcons(sessionElement);
        
        console.log(`[DEBUG Sessions CreateElement] Successfully created element for session ID: ${session?.id}`);
        return sessionElement;

    } catch (error) {
        console.error(`[DEBUG Sessions CreateElement] Error creating element for session ID: ${session?.id}`, session, error); // Log error
        // Return a placeholder or null to prevent breaking the loop entirely
        const errorElement = document.createElement('div');
        errorElement.className = 'card session-item error-item';
        errorElement.textContent = `Error displaying session ${session?.id}. Check console.`;
        return errorElement; // Return an error placeholder instead of null
    }
}

/**
 * Get color class based on category name
 * @param {string} category - The category name
 * @returns {string} - CSS class for the category color
 */
function getCategoryColorClass(category) {
    category = category.toLowerCase();
    if (category.includes('technique')) return 'accent-blue';
    if (category.includes('theory')) return 'accent-orange';
    if (category.includes('repertoire')) return 'accent-teal';
    if (category.includes('reading')) return 'accent-purple';
    return 'accent-gray'; // Default
}

/**
 * Format duration into a string
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
 * Format date and time
 * @param {string} startTime - The session start time
 * @returns {Object} - Formatted date and time strings
 */
function formatDateTime(startTime) {
    const start = new Date(startTime);
    return {
        dateStr: new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(start),
        timeStr: start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
}

/**
 * Get category name
 * @param {string} categoryId - The category ID
 * @returns {string} - The category name
 */
function getCategoryName(categoryId) {
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    const category = categories.find(c => c.id === categoryId);
    // If categoryId is empty or not found, return 'No Category'
    // Otherwise, return the found category's name.
    return category ? category.name : 'No Category';
}

/**
 * Add event listeners to session element
 * @param {HTMLElement} sessionElement - The session element
 * @param {string} sessionId - The session ID
 */
function addSessionEventListeners(sessionElement, sessionId) {
    const deleteBtn = sessionElement.querySelector('.delete-session');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            deleteSession(sessionId);
        });
    }
    
    const editBtn = sessionElement.querySelector('.edit-session');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            showSessionDialog(sessionId);
        });
    }
}

/**
 * Initialize icons within a session element
 * @param {HTMLElement} sessionElement - The session element
 */
function initializeIcons(sessionElement) {
    if (window.lucide && sessionElement) {
        try {
            lucide.createIcons({ context: sessionElement });
        } catch (e) {
            console.error("Lucide icon initialization error:", e, "on element:", sessionElement);
        }
    }
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
            value: (sessionData && typeof sessionData.duration === 'number') ? formatSecondsAsHMS(sessionData.duration) : '0:00:00'
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
        title: sessionId ? 'Edit Practice Session' : 'Add Practice Session',
        fields: fields,
        onSubmit: (dialog, e) => {
            console.log('[DEBUG Sessions] onSubmit callback in createStandardDialog triggered.');
            handleSessionFormSubmit(dialog, e, sessionId);
        },
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save Session',
        cancelButtonText: 'Cancel'
    });
    
    // Show dialog
    sessionDialog.showModal();
}

/**
 * Helper function to format total seconds into HH:MM:SS string
 * @param {number} totalSeconds 
 * @returns {string} Formatted string
 */
function formatSecondsAsHMS(totalSeconds) {
    if (typeof totalSeconds !== 'number' || isNaN(totalSeconds) || totalSeconds < 0) {
        return '0:00:00'; // Default or error case
    }
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    // Pad minutes and seconds with leading zeros if needed
    const paddedMinutes = String(minutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');
    
    return `${hours}:${paddedMinutes}:${paddedSeconds}`;
}

/**
 * Helper function to parse H:M:S string into total seconds
 * @param {string} hmsString - String like "1:23:45", "45:30", "90"
 * @returns {number} Total seconds, or 0 if invalid
 */
function parseDurationHMS(hmsString) {
    if (!hmsString || typeof hmsString !== 'string') return 0;
    
    const parts = hmsString.trim().split(':').map(part => parseInt(part, 10));
    let hours = 0, minutes = 0, seconds = 0;

    if (parts.length === 3) {
        // H:M:S
        hours = parts[0] || 0;
        minutes = parts[1] || 0;
        seconds = parts[2] || 0;
    } else if (parts.length === 2) {
        // M:S
        minutes = parts[0] || 0;
        seconds = parts[1] || 0;
    } else if (parts.length === 1 && !isNaN(parts[0])) {
        // Just seconds
        seconds = parts[0];
    } else {
        // Invalid format
        return 0; 
    }
    
    // Basic validation (ensure components are numbers and within reasonable bounds)
    if (isNaN(hours) || isNaN(minutes) || isNaN(seconds) || 
        hours < 0 || minutes < 0 || seconds < 0 || 
        minutes >= 60 || seconds >= 60) { 
        return 0; 
    }
    
    return (hours * 3600) + (minutes * 60) + seconds;
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
        const totalDurationSeconds = durationHMS ? parseDurationHMS(durationHMS) : 0;

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
    // Confirm deletion
    const confirmed = await window.UI.confirmDialog({
        title: 'Delete Session',
        message: 'Are you sure you want to delete this practice session?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
    });
    
    if (!confirmed) return;
    
    try {
        // Use data layer if available
        if (window.deleteItem) {
            window.deleteItem('SESSIONS', sessionId);
        } else {
            // Legacy localStorage handling
            let sessions = [];
            try {
                const stored = localStorage.getItem('practiceTrack_sessions');
                if (stored) {
                    sessions = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Error reading sessions:', e);
                sessions = []; // Start fresh if storage is corrupted
            }
            
            // Filter out the deleted session
            sessions = sessions.filter(s => s.id !== sessionId);
            
            // Save back to storage
            localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
        }
        
        // Reload sessions list
        window.UI.loadRecords('sessions', {
            recordType: 'SESSIONS',
            createRecordElementFn: createSessionElement
        });
        
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Error deleting session. Please try again.');
    }
}

/**
 * Load a batch of sessions
 */
function loadSessionBatch() {
    const allSessions = window.getItems ? window.getItems('SESSIONS') : JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
    const start = currentBatchIndex * BATCH_SIZE;
    const end = start + BATCH_SIZE;
    const sessionBatch = allSessions.slice(start, end);

    const listContainer = document.getElementById('sessions-list');
    const fragment = document.createDocumentFragment();

    sessionBatch.forEach(session => {
        const sessionElement = createSessionElement(session);
        fragment.appendChild(sessionElement);
    });

    listContainer.appendChild(fragment);
    currentBatchIndex++;

    // Check if more sessions are available
    if (end < allSessions.length) {
        // Add scroll event listener to load more sessions
        window.addEventListener('scroll', handleScroll);
    } else {
        // Remove scroll listener if all sessions are loaded
        window.removeEventListener('scroll', handleScroll);
    }
}

/**
 * Handle scroll event to load more sessions
 */
function handleScroll() {
    const scrollPosition = window.innerHeight + window.scrollY;
    const documentHeight = document.body.offsetHeight;

    if (scrollPosition >= documentHeight - 100) { // Load more when near bottom
        loadSessionBatch();
    }
}

// Debounce function to limit the rate of function execution
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

// Modify handleScroll to use debounce
const debouncedHandleScroll = debounce(handleScroll, 200);

// Update event listener to use debounced function
window.addEventListener('scroll', debouncedHandleScroll);

// Remove the original scroll event listener
window.removeEventListener('scroll', handleScroll);

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

// Add a specific CSS rule for the session category pill
function addSessionSpecificStyles() {
     let styleEl = document.getElementById('session-styles');
     if (!styleEl) {
         styleEl = document.createElement('style');
         styleEl.id = 'session-styles';
         document.head.appendChild(styleEl);
     }
     styleEl.textContent += `
        /* Updated Category Pill Styles - Now Defaulting to Blue */
        .card-category-pill {
            position: absolute;
            top: 12px;
            right: 12px;
            padding: 3px 10px; 
            border-radius: 12px;
            font-size: 12px; 
            font-weight: 500;
            line-height: 1.5; 
            /* Apply Blue theme directly */
            background-color: #DBEAFE; /* blue-100 */
            color: #1D4ED8; /* blue-700 */
            border: 1px solid #93C5FD; /* blue-300 */
        }
        /* Specific accent classes are removed or ignored, as the base style is now blue. */
        /* Styles for lesson badge remain unchanged */
        .lesson-badge {
            font-size: 11px; 
            padding: 3px 8px; 
            background-color: #eef2ff; 
            color: #4f46e5; 
            border-radius: 12px; 
            margin-right: auto; /* Pushes edit/delete buttons right */
        }
        .action-spacer { flex-grow: 1; } /* Pushes buttons to the right */
     `;
}

// Ensure this runs when the sessions are initialized
document.addEventListener('DOMContentLoaded', addSessionSpecificStyles); // Or call from initializeSessions