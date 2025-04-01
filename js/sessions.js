// DOM Elements
let sessionsList;
let searchInput;
let categoryFilter;
let dateRangeInputs;
let sessionDialog;
let sessionForm;

// Initialize sessions page
function initializeSessions() {
    console.log('Initializing sessions page');
    
    try {
        // Get DOM elements
        sessionsList = document.getElementById('sessions-list');
        searchInput = document.querySelector('.search-input');
        categoryFilter = document.querySelector('.category-filter');
        dateRangeInputs = document.querySelectorAll('.date-input');
        
        if (!sessionsList) {
            console.error('Sessions list element not found');
            return;
        }
        
        // Create session dialog if needed
        createSessionDialog();
        
        // Load categories into filter
        loadCategoriesIntoFilter();
        
        // Load sessions
        loadSessions();
        
        // Setup filters
        setupFilters();
        
        console.log('Sessions page initialization complete');
        
        // Initialize Lucide icons
        if (window.lucide && window.lucide.createIcons) {
            window.lucide.createIcons();
        }
    } catch (error) {
        console.error('Error initializing sessions page:', error);
    }
}

// Create session dialog dynamically
function createSessionDialog() {
    // Check if dialog already exists
    if (document.querySelector('.session-dialog')) {
        sessionDialog = document.querySelector('.session-dialog');
        sessionForm = sessionDialog.querySelector('form');
        return;
    }
    
    // Create dialog element
    sessionDialog = document.createElement('dialog');
    sessionDialog.className = 'session-dialog';
    
    // Get categories from localStorage
    const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    console.log(`Found ${categories.length} categories for session dialog`);
    
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
}

// Update session dialog categories
function updateSessionDialogCategories() {
    if (!sessionDialog) return;
    
    // Get the category select element
    const categorySelect = sessionDialog.querySelector('#session-category');
    if (!categorySelect) return;
    
    try {
        // Get categories from localStorage
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        console.log(`Found ${categories.length} categories for session dialog update`);
        
        // Store current selection
        const currentValue = categorySelect.value;
        
        // Clear current options
        categorySelect.innerHTML = '<option value="">Select Category</option>';
        
        // Add categories
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
        
        console.log('Session dialog categories updated successfully');
    } catch (error) {
        console.error('Error updating session dialog categories:', error);
    }
}

// Load sessions
function loadSessions() {
    console.log('Loading sessions');
    const sessionsList = document.getElementById('sessions-list');
    const categoryFilter = document.querySelector('.category-filter');
    
    if (!sessionsList) {
        console.error('Sessions list container not found');
        return;
    }
    
    try {
        // Clear current sessions
        sessionsList.innerHTML = '';
        
        // Get all sessions
        const sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
        console.log(`Found ${sessions.length} sessions`);
        
        // Sort by most recent first
        sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
        
        // Apply category filter if selected
        const selectedCategoryId = categoryFilter ? categoryFilter.value : '';
        const filteredSessions = selectedCategoryId 
            ? sessions.filter(session => session.categoryId === selectedCategoryId)
            : sessions;
            
        console.log(`Displaying ${filteredSessions.length} sessions after filtering`);
        
        // Get categories for display
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        
        if (filteredSessions.length === 0) {
            sessionsList.innerHTML = '<div class="no-sessions">No practice sessions recorded yet</div>';
            return;
        }
        
        // Create session elements
        filteredSessions.forEach(session => {
            const sessionElement = createSessionElement(session, categories);
            sessionsList.appendChild(sessionElement);
        });
    } catch (error) {
        console.error('Error loading sessions:', error);
        sessionsList.innerHTML = '<div class="error">Error loading sessions</div>';
    }
}

// Create a session element
function createSessionElement(session, categories) {
    const sessionElement = document.createElement('div');
    sessionElement.className = 'session-item';
    sessionElement.dataset.id = session.id;
    
    try {
        // Get category name
        const category = categories.find(c => c.id === session.categoryId);
        const categoryName = category ? category.name : 'Unknown Category';
        
        // Format duration
        const hours = Math.floor(session.duration / 3600);
        const minutes = Math.floor((session.duration % 3600) / 60);
        const seconds = session.duration % 60;
        const duration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Format date
        const date = new Date(session.startTime);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();
        
        sessionElement.innerHTML = `
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
        
        // Add event listeners for edit and delete buttons
        const editBtn = sessionElement.querySelector('.edit-session-btn');
        const deleteBtn = sessionElement.querySelector('.delete-session-btn');
        
        if (editBtn) {
            editBtn.addEventListener('click', () => editSession(session.id));
        }
        
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteSession(session.id));
        }
    } catch (error) {
        console.error('Error creating session element:', error);
        sessionElement.innerHTML = '<div class="session-error">Error displaying session</div>';
    }
    
    return sessionElement;
}

// Setup filters
const setupFilters = () => {
    if (!searchInput || !categoryFilter || !dateRangeInputs.length) {
        console.error('Missing filter elements');
        return;
    }
    
    // Add input event listeners
    searchInput.addEventListener('input', applyFilters);
    categoryFilter.addEventListener('change', applyFilters);
    dateRangeInputs.forEach(input => {
        input.addEventListener('change', applyFilters);
    });
};

// Apply filters
const applyFilters = () => {
    const filters = {
        search: searchInput.value.trim(),
        category: categoryFilter.value,
        startDate: dateRangeInputs[0].value,
        endDate: dateRangeInputs[1].value
    };
    
    loadSessions(filters);
};

// Edit session
function editSession(sessionId) {
    console.log('Editing session:', sessionId);
    // Implement edit functionality
    alert('Edit functionality coming soon!');
}

// Delete session
function deleteSession(sessionId) {
    console.log('Deleting session:', sessionId);
    
    if (!confirm('Are you sure you want to delete this session?')) {
        return;
    }
    
    try {
        // Get sessions
        const sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
        
        // Find session index
        const sessionIndex = sessions.findIndex(s => s.id === sessionId);
        
        if (sessionIndex === -1) {
            console.error('Session not found for deletion:', sessionId);
            alert('Error: Session not found');
            return;
        }
        
        // Remove session
        sessions.splice(sessionIndex, 1);
        
        // Save updated sessions
        localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
        
        // Update UI
        const sessionElement = document.querySelector(`.session-item[data-id="${sessionId}"]`);
        if (sessionElement) {
            sessionElement.remove();
        }
        
        // Show empty message if no sessions left
        const sessionsList = document.getElementById('sessions-list');
        if (sessionsList && sessionsList.children.length === 0) {
            sessionsList.innerHTML = '<div class="no-sessions">No practice sessions recorded yet</div>';
        }
        
        console.log('Session deleted successfully');
    } catch (error) {
        console.error('Error deleting session:', error);
        alert('Error deleting session');
    }
}

// Format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

// Format duration
const formatDuration = (seconds) => {
    return formatTime(seconds);
};

// Show session dialog
function showSessionDialog(session = null) {
    if (!sessionDialog) {
        createSessionDialog();
    }
    
    // Reset form
    sessionForm.reset();
    
    if (session) {
        try {
            console.log('Editing session:', session);
            
            // Format date and time values for inputs
            const date = new Date(session.startTime);
            const dateStr = date.toISOString().split('T')[0]; // YYYY-MM-DD
            const timeStr = date.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
            
            // Populate form with session data
            const categorySelect = sessionForm.querySelector('#session-category');
            if (categorySelect) categorySelect.value = session.categoryId;
            
            const dateInput = sessionForm.querySelector('#session-date');
            if (dateInput) dateInput.value = dateStr;
            
            const timeInput = sessionForm.querySelector('#session-time');
            if (timeInput) timeInput.value = timeStr;
            
            const durationInput = sessionForm.querySelector('#session-duration');
            if (durationInput) durationInput.value = Math.floor(session.duration / 60); // Convert seconds to minutes
            
            const notesInput = sessionForm.querySelector('#session-notes');
            if (notesInput) notesInput.value = session.notes || '';
            
            const lessonCheckbox = sessionForm.querySelector('#session-is-lesson');
            if (lessonCheckbox) lessonCheckbox.checked = session.isLesson || false;
            
            // Add session ID to form for update
            sessionForm.dataset.sessionId = session.id;
            
            // Update dialog title
            const title = sessionDialog.querySelector('h2');
            if (title) title.textContent = 'Edit Session';
        } catch (error) {
            console.error('Error populating session form:', error);
        }
    } else {
        // Remove session ID for new session
        delete sessionForm.dataset.sessionId;
        
        // Set default date to today
        const today = new Date().toISOString().split('T')[0];
        const dateInput = sessionForm.querySelector('#session-date');
        if (dateInput) dateInput.value = today;
        
        // Update dialog title
        const title = sessionDialog.querySelector('h2');
        if (title) title.textContent = 'Add Session';
    }
    
    // Show dialog
    sessionDialog.showModal();
}

// Handle session form submission
function handleSessionSubmit(e) {
    e.preventDefault();
    
    try {
        // Get form data
        const formData = new FormData(sessionForm);
        const categoryId = formData.get('category');
        const date = formData.get('date');
        const time = formData.get('time');
        const duration = parseInt(formData.get('duration')) * 60; // Convert minutes to seconds
        const notes = formData.get('notes');
        const isLesson = formData.get('isLesson') === 'on';
        
        if (!categoryId) {
            alert('Please select a category');
            return;
        }
        
        if (!date || !time || isNaN(duration) || duration <= 0) {
            alert('Please fill in all required fields');
            return;
        }
        
        // Create session object
        const sessionId = sessionForm.dataset.sessionId || `s-${Date.now()}`;
        const session = {
            id: sessionId,
            categoryId: categoryId,
            startTime: `${date}T${time}`,
            duration: duration,
            notes: notes || '',
            isManual: true,
            isLesson: isLesson,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        console.log('Saving session:', session);
        
        // Get existing sessions
        let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
        
        // If editing, remove old session
        if (sessionForm.dataset.sessionId) {
            sessions = sessions.filter(s => s.id !== sessionForm.dataset.sessionId);
        }
        
        // Add new session
        sessions.push(session);
        
        // Save to localStorage
        localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
        
        // Close dialog and refresh list
        sessionDialog.close();
        loadSessions();
        
        console.log('Session saved successfully');
    } catch (error) {
        console.error('Error saving session:', error);
        alert('Error saving session. Please try again.');
    }
}

// Refresh filters
const refreshFilters = () => {
    // Reset search input
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset category filter
    if (categoryFilter) {
        categoryFilter.value = '';
    }
    
    // Reset date range inputs
    dateRangeInputs.forEach(input => {
        input.value = '';
    });
    
    // Reload sessions
    loadSessions();
};

// Load categories into filter dropdown
function loadCategoriesIntoFilter() {
    console.log('Loading categories into sessions filter');
    const categoryFilter = document.querySelector('.category-filter');
    
    if (!categoryFilter) {
        console.error('Category filter dropdown not found');
        return;
    }
    
    // Clear existing options
    categoryFilter.innerHTML = '';
    
    // Add default "All Categories" option
    const allOption = document.createElement('option');
    allOption.value = '';
    allOption.textContent = 'All Categories';
    categoryFilter.appendChild(allOption);
    
    try {
        // Get categories from localStorage
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        console.log('Sessions: Retrieved categories:', categories);
        
        // Add categories to dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            categoryFilter.appendChild(option);
        });
        
        console.log('Sessions: Categories loaded successfully');
    } catch (error) {
        console.error('Sessions: Error loading categories:', error);
    }
}

// Update session categories (for external calls)
window.updateSessionCategories = function() {
    console.log('Updating session categories');
    loadCategoriesIntoFilter();
    loadSessions(); // Reload sessions with new categories
};

// Listen for category changes
document.addEventListener('categoriesChanged', () => {
    console.log('Sessions received categories changed event');
    loadCategoriesIntoFilter();
    loadSessions(); // Reload to update displayed category names
});

// Initialize sessions when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing sessions');
        initializeSessions();
    });
} else {
    console.log('DOM already loaded, initializing sessions immediately');
    initializeSessions();
}

// Make functions available globally
window.initializeSessions = initializeSessions;
window.loadSessions = loadSessions;
window.createSessionDialog = createSessionDialog;
window.updateSessionDialogCategories = updateSessionDialogCategories;
window.editSession = editSession;
window.deleteSession = deleteSession;
window.showSessionDialog = showSessionDialog;
window.handleSessionSubmit = handleSessionSubmit;
window.refreshFilters = refreshFilters;
window.loadCategoriesIntoFilter = loadCategoriesIntoFilter; 