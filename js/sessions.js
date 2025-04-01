/**
 * Sessions Module
 * Handles session management, display, creation, editing, and deletion
 */

// DOM element references - only populated when needed
const DOM = {
    sessionsList: null,
    searchInput: null,
    categoryFilter: null,
    dateRangeInputs: null,
    sessionDialog: null,
    sessionForm: null
};

// Get standard storage key
const getStorageKey = (type) => {
    return window.STORAGE_KEYS ? window.STORAGE_KEYS[type] : `practiceTrack_${type.toLowerCase()}`;
};

/**
 * Initialize sessions page 
 */
function initializeSessions() {
    console.log('Initializing sessions page');
    
    // Reset DOM references to ensure fresh start
    resetDOMReferences();
    
    try {
        // Get DOM elements
        getDOMElements();
        
        // Set up UI components
        if (DOM.sessionsList) {
            DOM.sessionsList.innerHTML = '';
            setupUI();
            loadSessions();
            console.log('Sessions page initialization complete');
        } else {
            console.error('Sessions list element not found');
        }
    } catch (error) {
        console.error('Error initializing sessions page:', error);
    }
}

/**
 * Reset all DOM references to ensure clean state
 */
function resetDOMReferences() {
    DOM.sessionsList = null;
    DOM.searchInput = null;
    DOM.categoryFilter = null;
    DOM.dateRangeInputs = null;
}

/**
 * Get all necessary DOM elements
 */
function getDOMElements() {
    DOM.sessionsList = document.getElementById('sessions-list');
    DOM.searchInput = document.querySelector('.search-input');
    DOM.categoryFilter = document.querySelector('.category-filter');
    DOM.dateRangeInputs = document.querySelectorAll('.date-input');
}

/**
 * Set up all UI components
 */
function setupUI() {
    // Set up add button
    setupAddButton();
    
    // Set up filters
    setupFilters();
    
    // Set up dialog (will create if doesn't exist)
    setupDialog();
}

/**
 * Set up Add Session button
 */
function setupAddButton() {
    // Find existing button
    const addBtn = document.getElementById('add-session-btn');
    
    if (addBtn) {
        // Replace with clone to remove existing listeners
        const newBtn = addBtn.cloneNode(true);
        if (addBtn.parentNode) {
            addBtn.parentNode.replaceChild(newBtn, addBtn);
            newBtn.addEventListener('click', handleAddClick);
        }
    } else {
        // Create the button if it doesn't exist
        const header = document.querySelector('#sessions-page .page-header');
        if (!header) return;
        
        let actionContainer = header.querySelector('.action-buttons');
        if (!actionContainer) {
            actionContainer = document.createElement('div');
            actionContainer.className = 'action-buttons';
            header.appendChild(actionContainer);
        }
        
        const btn = document.createElement('button');
        btn.id = 'add-session-btn';
        btn.className = 'primary-button';
        btn.innerHTML = '<i data-lucide="plus"></i> Add Session';
        btn.addEventListener('click', handleAddClick);
        
        actionContainer.appendChild(btn);
        
        // Initialize icons
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
    }
}

/**
 * Handle Add Session button click
 */
function handleAddClick(e) {
    if (e) e.preventDefault();
    showDialog();
}

/**
 * Set up filters
 */
function setupFilters() {
    // Set up category filter
    setupCategoryFilter();
    
    // Set up search input
    if (DOM.searchInput) {
        const newInput = DOM.searchInput.cloneNode(true);
        if (DOM.searchInput.parentNode) {
            DOM.searchInput.parentNode.replaceChild(newInput, DOM.searchInput);
            DOM.searchInput = newInput;
            DOM.searchInput.addEventListener('input', applyFilters);
        }
    }
    
    // Set up date filters
    if (DOM.dateRangeInputs) {
        DOM.dateRangeInputs.forEach((input, i) => {
            if (input.parentNode) {
                const newInput = input.cloneNode(true);
                input.parentNode.replaceChild(newInput, input);
                newInput.addEventListener('change', applyFilters);
            }
        });
    }
}

/**
 * Set up category filter dropdown
 */
function setupCategoryFilter() {
    if (!DOM.categoryFilter) return;
    
    // Store current selection
    const currentVal = DOM.categoryFilter.value;
    
    // Clear dropdown
    DOM.categoryFilter.innerHTML = '';
    
    // Add "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    DOM.categoryFilter.appendChild(allOption);
    
    // Add all categories
    getCategories().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        DOM.categoryFilter.appendChild(option);
    });
    
    // Restore selection if valid
    if (currentVal) {
        const exists = Array.from(DOM.categoryFilter.options).some(opt => opt.value === currentVal);
        if (exists) DOM.categoryFilter.value = currentVal;
    }
    
    // Replace with clone to remove any existing listeners
    const newFilter = DOM.categoryFilter.cloneNode(true);
    if (DOM.categoryFilter.parentNode) {
        DOM.categoryFilter.parentNode.replaceChild(newFilter, DOM.categoryFilter);
        DOM.categoryFilter = newFilter;
        DOM.categoryFilter.addEventListener('change', applyFilters);
    }
}

/**
 * Apply all filters and reload sessions
 */
function applyFilters() {
    const filters = {
        search: DOM.searchInput ? DOM.searchInput.value.trim() : '',
        categoryId: DOM.categoryFilter ? DOM.categoryFilter.value : '',
        startDate: DOM.dateRangeInputs && DOM.dateRangeInputs[0] ? DOM.dateRangeInputs[0].value : '',
        endDate: DOM.dateRangeInputs && DOM.dateRangeInputs[1] ? DOM.dateRangeInputs[1].value : ''
    };
    
    loadSessions(filters);
}

/**
 * Set up the session dialog
 */
function setupDialog() {
    // Check if dialog already exists
    DOM.sessionDialog = document.querySelector('.session-dialog');
    
    if (!DOM.sessionDialog) {
        createDialog();
    } else {
        // Get form reference
        DOM.sessionForm = DOM.sessionDialog.querySelector('form');
        
        // Make sure event listeners are set up
        if (DOM.sessionForm) {
            // Remove existing listeners
            const newForm = DOM.sessionForm.cloneNode(true);
            DOM.sessionForm.parentNode.replaceChild(newForm, DOM.sessionForm);
            DOM.sessionForm = newForm;
            
            // Add submit listener
            DOM.sessionForm.addEventListener('submit', handleFormSubmit);
        }
        
        // Set up cancel button
        const cancelBtn = DOM.sessionDialog.querySelector('#cancel-session-btn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => DOM.sessionDialog.close());
        }
        
        // Update categories
        updateDialogCategories();
    }
}

/**
 * Create the session dialog from scratch
 */
function createDialog() {
    // Create dialog element
    DOM.sessionDialog = document.createElement('dialog');
    DOM.sessionDialog.className = 'session-dialog';
    
    // Get categories
    const categories = getCategories();
    
    // Create form HTML
    DOM.sessionDialog.innerHTML = `
        <form class="session-form" id="session-form">
            <h2>Add Session</h2>
            <div class="form-group">
                <label for="session-category">Category</label>
                <select id="session-category" name="category" required>
                    <option value="">Select Category</option>
                    ${categories.map(c => `<option value="${c.id}">${c.name}</option>`).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="session-date">Date</label>
                <input type="date" id="session-date" name="date" required>
            </div>
            <div class="form-group">
                <label for="session-time">Time</label>
                <input type="time" id="session-time" name="time" required>
            </div>
            <div class="form-group">
                <label for="session-duration">Duration (minutes)</label>
                <input type="number" id="session-duration" name="duration" min="1" required value="30">
            </div>
            <div class="form-group">
                <label for="session-notes">Notes</label>
                <textarea id="session-notes" name="notes" rows="4"></textarea>
            </div>
            <div class="form-group">
                <label>
                    <input type="checkbox" id="session-is-lesson" name="isLesson">
                    This was a lesson
                </label>
            </div>
            <div class="dialog-actions">
                <button type="button" class="secondary-button" id="cancel-session-btn">Cancel</button>
                <button type="submit" class="primary-button">Save Session</button>
            </div>
        </form>
    `;
    
    // Add to document
    document.body.appendChild(DOM.sessionDialog);
    
    // Get form reference
    DOM.sessionForm = DOM.sessionDialog.querySelector('form');
    
    // Add event listeners
    DOM.sessionForm.addEventListener('submit', handleFormSubmit);
    
    // Add cancel button handler
    const cancelBtn = DOM.sessionDialog.querySelector('#cancel-session-btn');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', () => DOM.sessionDialog.close());
    }
}

/**
 * Update categories in the dialog
 */
function updateDialogCategories() {
    if (!DOM.sessionDialog) return;
    
    const select = DOM.sessionDialog.querySelector('#session-category');
    if (!select) return;
    
    // Save current value
    const currentVal = select.value;
    
    // Clear options
    select.innerHTML = '<option value="">Select Category</option>';
    
    // Add categories
    getCategories().forEach(cat => {
        const option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.name;
        select.appendChild(option);
    });
    
    // Restore selection if valid
    if (currentVal) {
        const exists = Array.from(select.options).some(opt => opt.value === currentVal);
        if (exists) select.value = currentVal;
    }
}

/**
 * Show the dialog for adding or editing a session
 */
function showDialog(session = null) {
    if (!DOM.sessionDialog) {
        setupDialog();
    } else {
        updateDialogCategories();
    }
    
    if (!DOM.sessionForm) {
        DOM.sessionForm = DOM.sessionDialog.querySelector('form');
        if (!DOM.sessionForm) {
            console.error('Session form not found');
            return;
        }
    }
    
    // Reset form
    DOM.sessionForm.reset();
    delete DOM.sessionForm.dataset.sessionId;
    delete DOM.sessionForm.dataset.createdAt;
    
    // Set title
    const title = DOM.sessionDialog.querySelector('h2');
    
    if (!session) {
        // New session - set today's date
        if (title) title.textContent = 'Add Session';
        
        const today = new Date().toISOString().split('T')[0];
        const dateInput = DOM.sessionForm.querySelector('#session-date');
        if (dateInput) dateInput.value = today;
    } else {
        // Edit session - populate form
        if (title) title.textContent = 'Edit Session';
        
        try {
            // Format date and time
            const date = new Date(session.startTime);
            const dateStr = date.toISOString().split('T')[0];
            const timeStr = date.toTimeString().split(' ')[0].substring(0, 5);
            
            // Set form fields
            const fields = {
                '#session-category': session.categoryId,
                '#session-date': dateStr,
                '#session-time': timeStr,
                '#session-duration': Math.floor(session.duration / 60),
                '#session-notes': session.notes || '',
                '#session-is-lesson': session.isLesson
            };
            
            // Apply values to form
            Object.entries(fields).forEach(([selector, value]) => {
                const element = DOM.sessionForm.querySelector(selector);
                if (!element) return;
                
                if (element.type === 'checkbox') {
                    element.checked = !!value;
                } else {
                    element.value = value;
                }
            });
            
            // Store session ID and created date for updates
            DOM.sessionForm.dataset.sessionId = session.id;
            DOM.sessionForm.dataset.createdAt = session.createdAt;
        } catch (error) {
            console.error('Error populating form:', error);
        }
    }
    
    // Show the dialog
    DOM.sessionDialog.showModal();
}

/**
 * Handle form submission
 */
function handleFormSubmit(e) {
    e.preventDefault();
    
    const form = e.target;
    
    try {
        // Get form data
        const formData = new FormData(form);
        
        // Validate required fields
        const categoryId = formData.get('category');
        const date = formData.get('date');
        const time = formData.get('time');
        const duration = parseInt(formData.get('duration'));
        
        if (!categoryId || !date || !time || isNaN(duration) || duration <= 0) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Determine if editing or creating
        const isEdit = !!form.dataset.sessionId;
        const sessionId = isEdit ? 
            form.dataset.sessionId : 
            `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Create session object
        const session = {
            id: sessionId,
            categoryId: categoryId,
            startTime: `${date}T${time}`,
            duration: duration * 60, // Convert to seconds
            notes: formData.get('notes') || '',
            isManual: true,
            isLesson: formData.get('isLesson') === 'on',
            createdAt: isEdit ? 
                form.dataset.createdAt || new Date().toISOString() : 
                new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save the session
        saveSession(session, isEdit);
        
        // Close dialog and reload sessions
        DOM.sessionDialog.close();
        loadSessions();
        
        // Show notification
        if (window.showNotification) {
            window.showNotification(
                'Success', 
                isEdit ? 'Session updated successfully' : 'Session created successfully'
            );
        }
    } catch (error) {
        console.error('Error saving session:', error);
        alert('Error saving session');
    }
}

/**
 * Edit a session
 */
function editSession(sessionId) {
    try {
        // Get the session
        const session = getSessionById(sessionId);
        
        if (!session) {
            console.error('Session not found:', sessionId);
            alert('Session not found');
            return;
        }
        
        // Show dialog with session data
        showDialog(session);
    } catch (error) {
        console.error('Error editing session:', error);
        alert('Error editing session');
    }
}

/**
 * Delete a session
 */
function deleteSession(sessionId) {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    try {
        // Get all sessions
        const sessions = getSessions();
        
        // Filter out the session to delete
        const newSessions = sessions.filter(s => s.id !== sessionId);
        
        // Check if session was found
        if (sessions.length === newSessions.length) {
            console.error('Session not found for deletion:', sessionId);
            alert('Session not found');
            return;
        }
        
        // Save the new list
        const success = saveSessions(newSessions);
        
        if (success) {
            // Update UI
            const element = document.querySelector(`.session-item[data-id="${sessionId}"]`);
            if (element) element.remove();
            
            // Show empty message if needed
            if (DOM.sessionsList && DOM.sessionsList.children.length === 0) {
                DOM.sessionsList.innerHTML = '<div class="no-sessions">No sessions found</div>';
            }
            
            // Show notification
            if (window.showNotification) {
                window.showNotification('Success', 'Session deleted successfully');
            }
        } else {
            alert('Error deleting session');
        }
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Error deleting session');
    }
}

/**
 * Load and display sessions
 */
function loadSessions(filters = {}) {
    if (!DOM.sessionsList) return;
    
    try {
        // Clear current list
        DOM.sessionsList.innerHTML = '';
        
        // Get all sessions
        let sessions = getSessions();
        
        // Sort by most recent
        sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        // Apply filters
        if (filters) {
            // Text search
            if (filters.search) {
                const searchTerm = filters.search.toLowerCase();
                sessions = sessions.filter(s => 
                    (s.notes && s.notes.toLowerCase().includes(searchTerm))
                );
            }
            
            // Category filter
            if (filters.categoryId) {
                sessions = sessions.filter(s => s.categoryId === filters.categoryId);
            }
            
            // Date range
            if (filters.startDate) {
                const startDate = new Date(filters.startDate);
                startDate.setHours(0, 0, 0, 0);
                sessions = sessions.filter(s => new Date(s.startTime) >= startDate);
            }
            
            if (filters.endDate) {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                sessions = sessions.filter(s => new Date(s.startTime) <= endDate);
            }
        }
        
        // Display sessions or empty message
        if (sessions.length === 0) {
            DOM.sessionsList.innerHTML = '<div class="no-sessions">No sessions found</div>';
            return;
        }
        
        // Get categories for display
        const categories = getCategories();
        
        // Create session elements
        sessions.forEach(session => {
            const element = createSessionElement(session, categories);
            if (element) DOM.sessionsList.appendChild(element);
        });
    } catch (error) {
        console.error('Error loading sessions:', error);
        DOM.sessionsList.innerHTML = '<div class="error">Error loading sessions</div>';
    }
}

/**
 * Create a single session element
 */
function createSessionElement(session, categories) {
    if (!session || !session.id) return null;
    
    const element = document.createElement('div');
    element.className = 'session-item';
    element.dataset.id = session.id;
    
    try {
        // Format data for display
        const category = categories.find(c => c.id === session.categoryId);
        const categoryName = category ? category.name : 'Unknown';
        
        const date = new Date(session.startTime);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();
        
        const hours = Math.floor(session.duration / 3600);
        const minutes = Math.floor((session.duration % 3600) / 60);
        const seconds = session.duration % 60;
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Create inner HTML
        element.innerHTML = `
            <div class="session-header">
                <div class="session-title">
                    <span class="session-category">${categoryName}</span>
                </div>
                <div class="session-time">${duration}</div>
            </div>
            <div class="session-details">
                <div class="session-date">${dateStr} ${timeStr}</div>
                ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
                <div class="session-actions">
                    <button class="edit-session-btn" data-id="${session.id}">Edit</button>
                    <button class="delete-session-btn" data-id="${session.id}">Delete</button>
                </div>
            </div>
        `;
        
        // Add click handler using event delegation
        element.addEventListener('click', event => {
            const button = event.target;
            if (!button.matches('button')) return;
            
            const id = button.dataset.id;
            if (!id) return;
            
            if (button.matches('.edit-session-btn')) {
                editSession(id);
            } else if (button.matches('.delete-session-btn')) {
                deleteSession(id);
            }
        });
        
        return element;
    } catch (error) {
        console.error('Error creating session element:', error);
        return null;
    }
}

/**
 * Get sessions from storage
 */
function getSessions() {
    try {
        let sessions = [];
        
        // Try data layer first
        if (typeof window.getItems === 'function') {
            sessions = window.getItems('SESSIONS') || [];
        } else {
            // Otherwise use localStorage
            const key = getStorageKey('SESSIONS');
            const data = localStorage.getItem(key);
            
            if (data) {
                sessions = JSON.parse(data);
                if (!Array.isArray(sessions)) sessions = [];
            }
        }
        
        // Filter invalid entries
        sessions = sessions.filter(s => s && s.id && s.categoryId);
        
        // Deduplicate by ID
        const uniqueSessions = {};
        sessions.forEach(s => {
            uniqueSessions[s.id] = s;
        });
        
        return Object.values(uniqueSessions);
    } catch (error) {
        console.error('Error getting sessions:', error);
        return [];
    }
}

/**
 * Save all sessions
 */
function saveSessions(sessions) {
    if (!Array.isArray(sessions)) {
        console.error('Invalid sessions data');
        return false;
    }
    
    try {
        // Deduplicate by ID
        const uniqueSessions = {};
        sessions.forEach(s => {
            if (s && s.id) uniqueSessions[s.id] = s;
        });
        
        const sessionsArray = Object.values(uniqueSessions);
        
        // Try data layer first
        if (typeof window.saveItems === 'function') {
            return window.saveItems('SESSIONS', sessionsArray);
        } else {
            // Otherwise use localStorage
            const key = getStorageKey('SESSIONS');
            localStorage.setItem(key, JSON.stringify(sessionsArray));
            return true;
        }
    } catch (error) {
        console.error('Error saving sessions:', error);
        return false;
    }
}

/**
 * Save a single session (add or update)
 */
function saveSession(session, isEdit) {
    if (!session || !session.id) {
        console.error('Invalid session data');
        return false;
    }
    
    try {
        // Get current sessions
        const sessions = getSessions();
        
        // If editing, remove old version
        const filteredSessions = isEdit 
            ? sessions.filter(s => s.id !== session.id) 
            : sessions;
        
        // Add the new/updated session
        filteredSessions.push(session);
        
        // Save all sessions
        return saveSessions(filteredSessions);
    } catch (error) {
        console.error('Error saving session:', error);
        return false;
    }
}

/**
 * Get a session by ID
 */
function getSessionById(id) {
    if (!id) return null;
    
    try {
        // Try data layer first
        if (typeof window.getItemById === 'function') {
            return window.getItemById('SESSIONS', id);
        } else {
            // Otherwise search in all sessions
            const sessions = getSessions();
            return sessions.find(s => s.id === id) || null;
        }
    } catch (error) {
        console.error('Error getting session by ID:', error);
        return null;
    }
}

/**
 * Get categories from storage
 */
function getCategories() {
    try {
        // Try data layer first
        if (typeof window.getItems === 'function') {
            return window.getItems('CATEGORIES') || [];
        } else {
            // Otherwise use localStorage
            const key = getStorageKey('CATEGORIES');
            const data = localStorage.getItem(key);
            
            if (data) {
                const categories = JSON.parse(data);
                return Array.isArray(categories) ? categories : [];
            }
            
            return [];
        }
    } catch (error) {
        console.error('Error getting categories:', error);
        return [];
    }
}

/**
 * Update sessions UI when categories change
 */
function updateSessionCategories() {
    setupCategoryFilter();
    updateDialogCategories();
    loadSessions();
}

// Listen for category changes
document.addEventListener('categoriesChanged', () => {
    updateSessionCategories();
});

// Export only the necessary functions
window.initializeSessions = initializeSessions;
window.updateSessionCategories = updateSessionCategories; 
window.updateSessionCategories = updateSessionCategories; 