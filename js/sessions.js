/**
 * Sessions Module
 * Manages practice sessions using the common UI framework
 */

// Session data storage
let sessionDialog = null;

/**
 * Initialize sessions page 
 */
function initializeSessions() {
    // Use the UI framework to initialize the sessions page
    window.UI.initRecordPage({
        pageId: 'sessions',
        recordType: 'SESSIONS',
        listContainerId: 'sessions-list',
        addButtonId: 'add-session-btn',
        searchInputSelector: '.search-input',
        categoryFilterSelector: '.category-filter',
        dateInputsSelector: '.date-input', // Selects both date inputs
        emptyStateMessage: 'No practice sessions recorded yet.',
        emptyStateIcon: 'list',
        addEmptyStateButtonId: 'empty-add-session',
        addEmptyStateButtonText: 'Add Your First Session',
        createRecordElementFn: createSessionElement,
        showDialogFn: showSessionDialog
    });
    
    // --- Add Date Preset Logic --- 
    const pageElement = document.getElementById('sessions-page');
    const presetFilter = pageElement ? pageElement.querySelector('.date-preset-filter') : null;
    const startDateInput = pageElement ? pageElement.querySelector('#session-start-date') : null;
    const endDateInput = pageElement ? pageElement.querySelector('#session-end-date') : null;
    const dateRangeDiv = pageElement ? pageElement.querySelector('.date-range') : null;

    if (presetFilter && startDateInput && endDateInput && dateRangeDiv) {
        presetFilter.addEventListener('change', () => {
            const selectedPreset = presetFilter.value;
            const today = new Date();
            let startDate = '';
            let endDate = '';

            // Hide/show custom inputs 
            dateRangeDiv.style.display = (selectedPreset === 'custom') ? 'flex' : 'none';

            switch (selectedPreset) {
                case 'week':
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    startDate = firstDayOfWeek.toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0]; // Today
                    break;
                case 'month':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0]; // Today
                    break;
                 case 'year':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                    break;
                case 'ytd':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0]; // Today
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
            
            // Update date inputs only if not custom 
            if (selectedPreset !== 'custom') {
                 startDateInput.value = startDate;
                 endDateInput.value = endDate;
             }
             // Trigger reload regardless of preset (UI framework handles filtering based on input values)
              window.UI.loadRecords('sessions');
        });
        
        // Update preset dropdown if custom dates are changed
         startDateInput.addEventListener('change', () => {
             presetFilter.value = 'custom';
             dateRangeDiv.style.display = 'flex';
             // loadRecords is already attached by initRecordPage
         });
         endDateInput.addEventListener('change', () => {
              presetFilter.value = 'custom';
              dateRangeDiv.style.display = 'flex';
             // loadRecords is already attached by initRecordPage
         });

        // Set initial state - Default to 'all' and hide custom range
        presetFilter.value = 'all';
        dateRangeDiv.style.display = 'none'; 
        startDateInput.value = ''; // Ensure custom dates are cleared initially
        endDateInput.value = '';

        // Trigger initial load with default 'all' time filter
        window.UI.loadRecords('sessions');
    }
    // --- End Date Preset Logic ---
}

/**
 * Create a session element for the UI
 * @param {Object} session - The session data
 * @returns {HTMLElement} - The session element
 */
function createSessionElement(session) {
    const sessionElement = document.createElement('div');
    sessionElement.className = 'card session-item';
    sessionElement.dataset.id = session.id;

    // Find category name
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    const category = categories.find(c => c.id === session.categoryId) || { name: 'Unknown' };

    // Format duration precisely
    let durationStr = '';
    const durationSeconds = (session.endTime && session.startTime) 
        ? Math.round((new Date(session.endTime).getTime() - new Date(session.startTime).getTime()) / 1000)
        : session.duration || 0; // Fallback to stored duration if no end/start time

    const hours = Math.floor(durationSeconds / 3600);
    const minutes = Math.floor((durationSeconds % 3600) / 60);
    const seconds = durationSeconds % 60;

    if (hours > 0) {
        durationStr += `${hours}h `;
    }
    if (minutes > 0 || hours > 0) { // Show minutes if hours exist or minutes > 0
        durationStr += `${minutes}m `;
    }
    durationStr += `${seconds}s`; // Always show seconds

    // Format date and time
    const startTime = new Date(session.startTime);
    const dateStr = startTime.toLocaleDateString();
    const timeStr = startTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    sessionElement.innerHTML = `
        <div class="session-header">
             <span class="session-category card-name-pill">${category.name}</span>
             <span class="session-duration">${durationStr.trim()}</span>
        </div>
        ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
        <div class="session-actions"> 
            <span class="session-date">${dateStr} at ${timeStr}</span> 
            <div class="action-buttons"> <!-- Wrap buttons -->
                ${session.isLesson ? '<span class="lesson-badge">Lesson</span>' : ''}
                <button class="icon-button edit-session" title="Edit Session">
                    <i data-lucide="edit"></i>
                </button>
                <button class="icon-button delete-session" title="Delete Session">
                    <i data-lucide="trash"></i>
                </button>
            </div>
        </div>
    `;

    // Add event listeners
    const editBtn = sessionElement.querySelector('.edit-session');
    if (editBtn) {
        editBtn.addEventListener('click', () => showSessionDialog(session.id));
    }

    const deleteBtn = sessionElement.querySelector('.delete-session');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => deleteSession(session.id));
    }
    
    // Initialize icons
     if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons({ context: sessionElement }); 
    }

    return sessionElement;
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
    
    // Get categories for dropdown
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        text: cat.name
    }));
    
    // Set default date to today if creating new session
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    // Set up form fields
    const fields = [
        {
            type: 'select',
            id: 'session-category',
            label: 'Category',
            required: true,
            options: categoryOptions,
            value: sessionData ? sessionData.categoryId : ''
        },
        {
            type: 'date',
            id: 'session-date',
            label: 'Date',
            required: true,
            value: sessionData ? sessionData.startTime.split('T')[0] : dateString
        },
        {
            type: 'number',
            id: 'session-duration',
            label: 'Duration (minutes)',
            required: true,
            min: 1,
            value: sessionData ? Math.round(sessionData.duration / 60) : ''
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
        // Moved the original log inside the try block
        console.log('[DEBUG Sessions] Inside try block. Session ID:', sessionId);
        
        // Fetch original record if editing to preserve createdAt
        let originalCreatedAt = null;
        if (sessionId) {
            const originalRecord = window.getItemById ? window.getItemById('SESSIONS', sessionId) : 
                (JSON.parse(localStorage.getItem('practiceTrack_sessions')) || []).find(s => s.id === sessionId);
            if (originalRecord && originalRecord.createdAt) {
                originalCreatedAt = originalRecord.createdAt;
                console.log('[DEBUG Sessions] Editing session. Found original createdAt:', originalCreatedAt);
            }
        }

        // Get form data
        const formData = new FormData(dialog.querySelector('form'));
        const categoryId = formData.get('session-category');
        const dateValue = formData.get('session-date'); // YYYY-MM-DD
        const durationMinutes = parseInt(formData.get('session-duration'), 10);
        const notes = formData.get('dialog-session-notes');

        // <<< Log values BEFORE validation check >>>
        console.log(`[DEBUG Sessions] Values for validation: categoryId='${categoryId}', dateValue='${dateValue}', durationMinutes=${durationMinutes}`);

        // Validate required fields
        if (!categoryId || !dateValue || isNaN(durationMinutes) || durationMinutes <= 0) {
            console.error('[DEBUG Sessions] Validation failed:', { categoryId, dateValue, durationMinutes });
            // Replace non-existent showNotification with a simple alert
            alert('Missing Information: Please fill in Category, Date, and a valid Duration (minutes).');
            return; // Stop processing if validation fails
        }
        
        // --- Calculate startTime and endTime --- 
        const sessionDate = new Date(dateValue); // Parses YYYY-MM-DD
        // IMPORTANT: Set time to noon in the LOCAL timezone to avoid UTC conversion issues
        // When just YYYY-MM-DD is parsed, it defaults to UTC midnight.
        sessionDate.setHours(12, 0, 0, 0); 
        console.log(`[DEBUG Sessions] Parsed date value: ${dateValue}, Created Date object: ${sessionDate.toString()}`);

        const sessionStartTime = sessionDate.getTime(); // Milliseconds since epoch
        const durationSeconds = durationMinutes * 60;
        const sessionEndTime = sessionStartTime + (durationSeconds * 1000);
        
        const startTimeISO = new Date(sessionStartTime).toISOString();
        const endTimeISO = new Date(sessionEndTime).toISOString();
        
        console.log(`[DEBUG Sessions] Calculated Times:
                     Duration: ${durationMinutes} min (${durationSeconds} sec)
                     Start (ms): ${sessionStartTime}, Start (ISO): ${startTimeISO}
                     End (ms): ${sessionEndTime}, End (ISO): ${endTimeISO}`);
        // --- End Time Calculation --- 
        
        // Prepare session data object
        const sessionData = {
            categoryId,
            startTime: startTimeISO, // Store as ISO string
            endTime: endTimeISO,   // Store as ISO string
            duration: durationSeconds, // Store duration in seconds
            notes: notes || '',
            isLesson: false, // Assuming manual entries are not lessons by default
            updatedAt: new Date().toISOString(),
            createdAt: sessionId ? originalCreatedAt : new Date().toISOString(),
            // Add id if editing, or generate if new
            ...(sessionId ? { id: sessionId } : { id: `session_${Date.now()}` })
        };

        console.log('[DEBUG Sessions] Prepared session data:', JSON.parse(JSON.stringify(sessionData)));

        // Save session using the data layer
        if (window.addItem && window.updateItem) {
            if (sessionId) {
                window.updateItem('SESSIONS', sessionId, sessionData);
            } else {
                window.addItem('SESSIONS', sessionData);
            }
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
                sessions = [];
            }
            
            if (sessionId) {
                // Update existing session
                const index = sessions.findIndex(s => s.id === sessionId);
                if (index !== -1) {
                    sessions[index] = sessionData;
                }
            } else {
                // Add new session
                sessions.push(sessionData);
            }
            
            // Save to localStorage
            localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
        }
        
        const saveButton = dialog.querySelector('button[type="submit"]');
        if (saveButton) {
            saveButton.textContent = 'Saved!';
            saveButton.classList.add('success');
            saveButton.disabled = true; // Briefly disable button
            setTimeout(() => {
                saveButton.textContent = 'Save Session'; // Restore original text
                saveButton.classList.remove('success');
                saveButton.disabled = false; // Re-enable
            }, 1500); 
        }
        // Close dialog immediately
        console.log('[DEBUG Sessions] Attempting to close dialog...', dialog); 
        dialog.close();
        console.log('[DEBUG Sessions] Dialog close() called.'); 
        
        // Reload sessions list
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
                return;
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

// Initialize when page changes to sessions
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'sessions') {
        initializeSessions();
    }
});

// Make function available globally
window.initializeSessions = initializeSessions;
window.initializeSessions = initializeSessions;