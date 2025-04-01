// DOM Elements
const sessionsList = document.getElementById('sessions-list');
const searchInput = document.querySelector('.search-input');
const categoryFilter = document.querySelector('.category-filter');
const dateRangeInputs = document.querySelectorAll('.date-input');
let sessionDialog; // Will be created dynamically
let sessionForm; // Will be created dynamically

// Initialize sessions page
const initializeSessions = () => {
    console.log('Initializing sessions page...');
    if (!sessionsList) {
        console.error('Sessions list element not found!');
        return;
    }

    // Create session dialog if it doesn't exist yet
    createSessionDialog();

    loadSessions();
    setupFilters();
    console.log('Sessions page initialization complete');
    
    // Initialize Lucide icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
};

// Create session dialog dynamically
const createSessionDialog = () => {
    // Check if dialog already exists
    if (document.querySelector('.session-dialog')) {
        sessionDialog = document.querySelector('.session-dialog');
        sessionForm = sessionDialog.querySelector('form');
        return;
    }
    
    // Create dialog element
    sessionDialog = document.createElement('dialog');
    sessionDialog.className = 'session-dialog';
    
    // Get visible categories (not hidden)
    const categories = getItems('CATEGORIES').filter(cat => !cat.isHidden) || [];
    console.log(`Found ${categories.length} visible categories for session dialog`);
    
    // Create form HTML
    sessionDialog.innerHTML = `
        <form class="session-form" id="session-form">
            <h2>Add Session</h2>
            <div class="form-group">
                <label for="session-category">Category</label>
                <select id="session-category" name="category" required>
                    <option value="">Select Category</option>
                    ${categories.map(category => 
                        `<option value="${category.id}">${category.name}</option>`
                    ).join('')}
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
    
    // Get form element
    sessionForm = sessionDialog.querySelector('form');
    
    // Add form submission handler
    sessionForm.addEventListener('submit', handleSessionSubmit);
    
    // Add cancel button handler
    const cancelButton = sessionDialog.querySelector('#cancel-session-btn');
    cancelButton.addEventListener('click', () => {
        sessionDialog.close();
    });
    
    // Add dialog to page
    document.body.appendChild(sessionDialog);
};

// Update session dialog categories to filter out hidden ones
const updateSessionDialogCategories = () => {
    if (!sessionDialog) return;
    
    // Get the category select element
    const categorySelect = sessionDialog.querySelector('#session-category');
    if (!categorySelect) return;
    
    // Get visible categories
    const categories = getItems('CATEGORIES').filter(cat => !cat.isHidden) || [];
    
    // Store current selection
    const currentValue = categorySelect.value;
    
    // Clear current options
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    // Add new options
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
    
    // Restore selection if still valid
    if (currentValue && categories.some(c => c.id === currentValue)) {
        categorySelect.value = currentValue;
    }
};

// Load and display sessions
const loadSessions = (filters = {}) => {
    try {
        console.log('Starting to load sessions...');
        
        // Check if sessionsList exists
        if (!sessionsList) {
            console.error('Sessions list element not found');
            return;
        }
        
        let sessions = getItems('SESSIONS');
        console.log('Retrieved sessions:', sessions);
        
        if (!Array.isArray(sessions)) {
            console.error('Sessions is not an array:', sessions);
            sessions = [];
        }
        
        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            sessions = sessions.filter(session => {
                const category = getItemById('CATEGORIES', session.categoryId);
                return category && (category.name.toLowerCase().includes(searchTerm) ||
                       session.notes.toLowerCase().includes(searchTerm));
            });
        }
        
        if (filters.category) {
            sessions = sessions.filter(session => session.categoryId === filters.category);
        }
        
        if (filters.startDate) {
            sessions = sessions.filter(session => 
                new Date(session.startTime) >= new Date(filters.startDate)
            );
        }
        
        if (filters.endDate) {
            sessions = sessions.filter(session => 
                new Date(session.startTime) <= new Date(filters.endDate)
            );
        }
        
        // Sort by date (newest first)
        sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        console.log('Filtered and sorted sessions:', sessions);
        
        // Display sessions
        sessionsList.innerHTML = '';
        if (sessions.length === 0) {
            sessionsList.innerHTML = '<div class="no-sessions">No practice sessions found</div>';
        } else {
            sessions.forEach(session => {
                const sessionElement = createSessionElement(session);
                if (sessionElement) {
                    sessionsList.appendChild(sessionElement);
                }
            });
        }
        
        // Update Lucide icons
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
        
        console.log('Sessions display complete');
    } catch (error) {
        console.error('Error loading sessions:', error);
        if (sessionsList) {
            sessionsList.innerHTML = '<div class="error-message">Error loading sessions</div>';
        }
    }
};

// Format time in HH:MM:SS
const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

// Create session element
const createSessionElement = (session) => {
    const category = getItemById('CATEGORIES', session.categoryId);
    if (!category) {
        console.error('Category not found for session:', session);
        return null;
    }
    
    const div = document.createElement('div');
    div.className = 'card session-card';
    div.innerHTML = `
        <div class="session-header">
            <h3>${category.name}</h3>
            <span class="session-date">${new Date(session.startTime).toLocaleDateString()}</span>
        </div>
        <div class="session-details">
            <p class="session-time">${formatTime(session.duration)}</p>
            ${session.isManual ? '<span class="manual-badge">Manual Entry</span>' : ''}
            ${session.isLesson ? '<span class="lesson-badge">Lesson</span>' : ''}
        </div>
        ${session.notes ? `<p class="session-notes">${session.notes}</p>` : ''}
        <div class="session-actions">
            ${session.isManual ? `
                <button class="icon-button edit-session" data-id="${session.id}">
                    <i data-lucide="edit"></i>
                </button>
            ` : ''}
            <button class="icon-button delete-session" data-id="${session.id}">
                <i data-lucide="trash"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    if (session.isManual) {
        const editButton = div.querySelector('.edit-session');
        editButton.addEventListener('click', () => editSession(session));
    }
    
    const deleteButton = div.querySelector('.delete-session');
    deleteButton.addEventListener('click', () => deleteSession(session.id));
    
    return div;
};

// Setup filters
const setupFilters = () => {
    // Populate category filter
    const categories = getItems('CATEGORIES');
    categoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        if (!category.isHidden) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        }
    });
    
    // Add filter event listeners
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    dateRangeInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
};

// Apply filters
const applyFilters = () => {
    const filters = {
        search: searchInput.value,
        category: categoryFilter.value,
        startDate: dateRangeInputs[0].value,
        endDate: dateRangeInputs[1].value
    };
    
    loadSessions(filters);
};

// Edit session
const editSession = (session) => {
    showSessionDialog(session);
};

// Delete session
const deleteSession = (sessionId) => {
    if (confirm('Are you sure you want to delete this session?')) {
        deleteItem('SESSIONS', sessionId);
        loadSessions();
    }
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
};

// Format duration
const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
};

// Show session dialog
const showSessionDialog = (session = null) => {
    // Make sure dialog exists
    if (!sessionDialog) {
        createSessionDialog();
    }
    
    // Update categories to ensure hidden ones are filtered out
    updateSessionDialogCategories();
    
    const title = session ? 'Edit Session' : 'Add Manual Session';
    const submitText = session ? 'Save Changes' : 'Add Session';
    
    sessionDialog.querySelector('h2').textContent = title;
    sessionForm.querySelector('button[type="submit"]').textContent = submitText;
    
    if (session) {
        // For editing existing session
        if (session.id) {
            sessionForm.dataset.sessionId = session.id;
        }
        sessionForm.querySelector('#session-category').value = session.categoryId || '';
        sessionForm.querySelector('#session-date').value = session.startTime ? session.startTime.split('T')[0] : '';
        sessionForm.querySelector('#session-time').value = session.startTime ? session.startTime.split('T')[1].slice(0, 5) : '';
        sessionForm.querySelector('#session-duration').value = session.duration || 30;
        sessionForm.querySelector('#session-notes').value = session.notes || '';
        sessionForm.querySelector('#session-is-lesson').checked = session.isLesson || false;
    } else {
        // For new session, pre-fill with current date/time
        const now = new Date();
        const dateStr = now.toISOString().split('T')[0];
        const timeStr = now.toTimeString().slice(0, 5);
        
        sessionForm.reset();
        delete sessionForm.dataset.sessionId;
        sessionForm.querySelector('#session-date').value = dateStr;
        sessionForm.querySelector('#session-time').value = timeStr;
        sessionForm.querySelector('#session-duration').value = 30; // Default 30 minutes
    }
    
    // Show dialog
    if (typeof sessionDialog.showModal === 'function') {
        sessionDialog.showModal();
    } else {
        // Fallback for browsers that don't support dialog element
        sessionDialog.style.display = 'block';
        sessionDialog.setAttribute('open', '');
        // Add backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'dialog-backdrop';
        document.body.appendChild(backdrop);
        backdrop.addEventListener('click', () => {
            sessionDialog.style.display = 'none';
            sessionDialog.removeAttribute('open');
            backdrop.remove();
        });
    }
};

// Handle session form submission
const handleSessionSubmit = (e) => {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = new FormData(sessionForm);
        const sessionId = sessionForm.dataset.sessionId;
        
        // Validate required fields
        const category = formData.get('category');
        const date = formData.get('date');
        const time = formData.get('time');
        const duration = formData.get('duration');
        
        if (!category) {
            alert('Please select a category');
            return;
        }
        if (!date || !time) {
            alert('Please enter date and time');
            return;
        }
        if (!duration || duration <= 0) {
            alert('Please enter a valid duration');
            return;
        }
        
        // Create session object
        const session = {
            id: sessionId || `s-${Date.now()}`,
            categoryId: category,
            startTime: `${date}T${time}:00.000Z`,
            duration: parseInt(duration),
            notes: formData.get('notes') || '',
            isLesson: formData.get('isLesson') === 'on',
            isManual: true,
            createdAt: sessionId ? getItemById('SESSIONS', sessionId).createdAt : new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Validate session
        const errors = validateSession(session);
        if (errors.length > 0) {
            alert(errors.join('\n'));
            return;
        }
        
        // Save session
        console.log('Saving session:', session);
        saveItem('SESSIONS', session);
        
        // Close dialog and reload sessions
        sessionDialog.close();
        loadSessions();
        
        // Show success message
        const successMessage = document.createElement('div');
        successMessage.className = 'success-message';
        successMessage.textContent = 'Session saved successfully';
        document.querySelector('.sessions-container').appendChild(successMessage);
        setTimeout(() => successMessage.remove(), 3000);
        
    } catch (error) {
        console.error('Error saving session:', error);
        alert('Error saving session. Please try again.');
    }
};

// Update filters when category visibility changes 
// (This can be called after category visibility changes in settings)
const refreshFilters = () => {
    setupFilters(); // Refresh the filters dropdown
    updateSessionDialogCategories(); // Refresh the session dialog dropdown
};

// Initialize on page load
initializeSessions();

// Expose functions to window object
window.initializeSessions = initializeSessions;
window.loadSessions = loadSessions;
window.createSessionElement = createSessionElement;
window.setupFilters = setupFilters;
window.applyFilters = applyFilters;
window.showSessionDialog = showSessionDialog;
window.handleSessionSubmit = handleSessionSubmit;
window.editSession = editSession;
window.deleteSession = deleteSession;
window.refreshSessionsFilters = refreshFilters; 