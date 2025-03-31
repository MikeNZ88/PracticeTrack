// DOM Elements
const sessionsList = document.getElementById('sessions-list');
const searchInput = document.querySelector('.search-input');
const categoryFilter = document.querySelector('.category-filter');
const dateRangeInputs = document.querySelectorAll('.date-input');

// Initialize sessions page
const initializeSessions = () => {
    console.log('Initializing sessions page...');
    if (!sessionsList) {
        console.error('Sessions list element not found!');
        return;
    }

    loadSessions();
    setupFilters();
    console.log('Sessions page initialization complete');
    
    // Initialize Lucide icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
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
        
        let sessions = getItems('sessions');
        console.log('Retrieved sessions:', sessions);
        
        if (!Array.isArray(sessions)) {
            console.error('Sessions is not an array:', sessions);
            sessions = [];
        }
        
        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            sessions = sessions.filter(session => {
                const category = getItemById('categories', session.categoryId);
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
    const category = getItemById('categories', session.categoryId);
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
    const categories = getItems('categories');
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
        deleteItem('sessions', sessionId);
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
    
    // Ensure the dialog is properly initialized
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
            createdAt: sessionId ? getItemById('sessions', sessionId).createdAt : new Date().toISOString(),
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
        saveItem('sessions', session);
        
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