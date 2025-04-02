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
        dateInputsSelector: '.date-input',
        emptyStateMessage: 'No practice sessions recorded yet.',
        emptyStateIcon: 'list',
        addEmptyStateButtonId: 'empty-add-session',
        addEmptyStateButtonText: 'Add Your First Session',
        createRecordElementFn: createSessionElement,
        showDialogFn: showSessionDialog
    });
}

/**
 * Create a session element for the UI
 * @param {Object} session - The session data
 * @returns {HTMLElement} - The session element
 */
function createSessionElement(session) {
    const sessionElement = document.createElement('div');
    sessionElement.className = 'session-item';
    sessionElement.dataset.id = session.id;
    
    // Format date
    const date = new Date(session.startTime);
    const dateStr = date.toLocaleDateString();
    
    // Format duration
    const hours = Math.floor(session.duration / 3600);
    const minutes = Math.floor((session.duration % 3600) / 60);
    const durationStr = hours > 0 ? 
        `${hours} hr ${minutes} min` : 
        `${minutes} min`;
    
    // Get category
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    const category = categories.find(c => c.id === session.categoryId) || { name: 'Unknown' };
    
    // Create session content
    sessionElement.innerHTML = `
        <div class="session-header">
            <div class="session-date">${dateStr}</div>
            <div class="session-category">${category.name}</div>
            <div class="session-duration">${durationStr}</div>
        </div>
        <div class="session-actions">
            <button class="icon-button edit-session" title="Edit Session">
                <i data-lucide="edit"></i>
            </button>
            <button class="icon-button delete-session" title="Delete Session">
                <i data-lucide="trash"></i>
            </button>
        </div>
        ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
    `;
    
    // Add event listeners
    const editBtn = sessionElement.querySelector('.edit-session');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showSessionDialog(session.id);
        });
    }
    
    const deleteBtn = sessionElement.querySelector('.delete-session');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteSession(session.id);
        });
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
        onSubmit: (dialog, e) => handleSessionFormSubmit(dialog, e, sessionId),
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
    try {
        const form = e.target;
        const dateInput = form.querySelector('#session-date');
        const durationInput = form.querySelector('#session-duration');
        const notesInput = form.querySelector('#dialog-session-notes');
        const categorySelect = form.querySelector('#session-category');
        
        // Validate inputs - only date and duration are required
        if (!dateInput || !dateInput.value || !durationInput || !durationInput.value) {
            alert('Please enter the session date and duration');
            return;
        }
        
        // Create session object
        const sessionDate = new Date(dateInput.value);
        const sessionData = {
            id: sessionId || `session_${Date.now()}`,
            categoryId: categorySelect ? categorySelect.value : null,
            startTime: sessionDate.toISOString(),
            duration: parseInt(durationInput.value) * 60, // Convert minutes to seconds
            notes: notesInput ? notesInput.value.trim() : '',
            createdAt: new Date().toISOString()
        };
        
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
        
        // Close dialog
        dialog.close();
        
        // Reload sessions list
        window.UI.loadRecords('sessions', {
            recordType: 'SESSIONS',
            createRecordElementFn: createSessionElement
        });
        
    } catch (error) {
        console.error('Error saving session:', error);
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