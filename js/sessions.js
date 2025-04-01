// DOM Elements
let sessionsList;
let searchInput;
let categoryFilter;
let dateRangeInputs;
let sessionDialog;
let sessionForm;

// Initialize sessions page
const initializeSessions = () => {
    console.log('Initializing sessions page...');
    
    // Get DOM elements
    sessionsList = document.getElementById('sessions-list');
    searchInput = document.querySelector('.search-input');
    categoryFilter = document.querySelector('.category-filter');
    dateRangeInputs = document.querySelectorAll('.date-input');
    
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
    
    // Get settings for instruments
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const selectedInstruments = settings.instruments || [];
    
    // Get categories for selected instruments
    const categories = window.getItems('CATEGORIES') || [];
    const visibleCategories = categories.filter(cat => 
        selectedInstruments.includes(cat.instrumentId)
    );
    
    console.log(`Found ${visibleCategories.length} visible categories for session dialog`);
    
    // Group categories by instrument
    const categoriesByInstrument = {};
    selectedInstruments.forEach(instrumentId => {
        categoriesByInstrument[instrumentId] = visibleCategories.filter(cat => 
            cat.instrumentId === instrumentId
        );
    });
    
    // Create form HTML
    sessionDialog.innerHTML = `
        <form class="session-form" id="session-form">
            <h2>Add Session</h2>
            <div class="form-group">
                <label for="session-category">Category</label>
                <select id="session-category" name="category" required>
                    <option value="">Select Category</option>
                    ${selectedInstruments.map(instrumentId => {
                        const instrumentCategories = categoriesByInstrument[instrumentId];
                        if (!instrumentCategories.length) return '';
                        
                        const instrument = window.AVAILABLE_INSTRUMENTS.find(i => i.id === instrumentId);
                        return `
                            <optgroup label="${instrument ? instrument.name : instrumentId}">
                                ${instrumentCategories.map(category => 
                                    `<option value="${category.id}">${category.name}</option>`
                                ).join('')}
                            </optgroup>
                        `;
                    }).join('')}
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

// Update session dialog categories
const updateSessionDialogCategories = () => {
    if (!sessionDialog) return;
    
    // Get the category select element
    const categorySelect = sessionDialog.querySelector('#session-category');
    if (!categorySelect) return;
    
    // Get settings for instruments
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const selectedInstruments = settings.instruments || [];
    
    // Get categories for selected instruments
    const categories = window.getItems('CATEGORIES') || [];
    const visibleCategories = categories.filter(cat => 
        selectedInstruments.includes(cat.instrumentId)
    );
    
    // Store current selection
    const currentValue = categorySelect.value;
    
    // Group categories by instrument
    const categoriesByInstrument = {};
    selectedInstruments.forEach(instrumentId => {
        categoriesByInstrument[instrumentId] = visibleCategories.filter(cat => 
            cat.instrumentId === instrumentId
        );
    });
    
    // Clear current options
    categorySelect.innerHTML = '<option value="">Select Category</option>';
    
    // Add new options grouped by instrument
    selectedInstruments.forEach(instrumentId => {
        const instrumentCategories = categoriesByInstrument[instrumentId];
        if (!instrumentCategories.length) return;
        
        const instrument = window.AVAILABLE_INSTRUMENTS.find(i => i.id === instrumentId);
        const optgroup = document.createElement('optgroup');
        optgroup.label = instrument ? instrument.name : instrumentId;
        
        instrumentCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            optgroup.appendChild(option);
        });
        
        categorySelect.appendChild(optgroup);
    });
    
    // Restore selection if still valid
    if (currentValue && visibleCategories.some(c => c.id === currentValue)) {
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
        
        let sessions = window.getItems('SESSIONS');
        console.log('Retrieved sessions:', sessions);
        
        if (!Array.isArray(sessions)) {
            console.error('Sessions is not an array:', sessions);
            sessions = [];
        }
        
        // Apply filters
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            sessions = sessions.filter(session => {
                const category = window.getItemById('CATEGORIES', session.categoryId);
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
    const category = window.getItemById('CATEGORIES', session.categoryId);
    if (!category) {
        console.error('Category not found for session:', session);
        return null;
    }
    
    // Get instrument name
    const instrument = window.AVAILABLE_INSTRUMENTS.find(i => i.id === category.instrumentId);
    const instrumentName = instrument ? instrument.name : category.instrumentId;
    
    const div = document.createElement('div');
    div.className = 'card session-card';
    div.innerHTML = `
        <div class="session-header">
            <div class="session-title">
                <h3>${category.name}</h3>
                <span class="session-instrument">${instrumentName}</span>
            </div>
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
                <i data-lucide="trash-2"></i>
            </button>
        </div>
    `;
    
    // Add event listeners
    const editButton = div.querySelector('.edit-session');
    if (editButton) {
        editButton.addEventListener('click', () => editSession(session));
    }
    
    const deleteButton = div.querySelector('.delete-session');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deleteSession(session.id));
    }
    
    return div;
};

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
const editSession = (session) => {
    showSessionDialog(session);
};

// Delete session
const deleteSession = (sessionId) => {
    if (!confirm('Are you sure you want to delete this session?')) return;
    
    window.deleteItem('SESSIONS', sessionId);
    loadSessions();
};

// Format date
const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
};

// Format duration
const formatDuration = (seconds) => {
    return formatTime(seconds);
};

// Show session dialog
const showSessionDialog = (session = null) => {
    if (!sessionDialog) {
        createSessionDialog();
    }
    
    // Reset form
    sessionForm.reset();
    
    if (session) {
        // Populate form with session data
        sessionForm.querySelector('#session-category').value = session.categoryId;
        sessionForm.querySelector('#session-date').value = formatDate(session.startTime);
        sessionForm.querySelector('#session-time').value = new Date(session.startTime).toLocaleTimeString('en-US', { hour12: false });
        sessionForm.querySelector('#session-duration').value = Math.floor(session.duration / 60);
        sessionForm.querySelector('#session-notes').value = session.notes || '';
        sessionForm.querySelector('#session-is-lesson').checked = session.isLesson || false;
        
        // Add session ID to form for update
        sessionForm.dataset.sessionId = session.id;
    } else {
        // Remove session ID for new session
        delete sessionForm.dataset.sessionId;
    }
    
    // Show dialog
    sessionDialog.showModal();
};

// Handle session form submission
const handleSessionSubmit = (e) => {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(sessionForm);
    const categoryId = formData.get('category');
    const date = formData.get('date');
    const time = formData.get('time');
    const duration = parseInt(formData.get('duration')) * 60; // Convert minutes to seconds
    const notes = formData.get('notes');
    const isLesson = formData.get('isLesson') === 'on';
    
    // Get category to determine instrument
    const category = window.getItemById('CATEGORIES', categoryId);
    if (!category) {
        alert('Invalid category selected');
        return;
    }
    
    // Create session object
    const session = {
        id: sessionForm.dataset.sessionId || `s-${Date.now()}`,
        categoryId: categoryId,
        instrumentId: category.instrumentId,
        startTime: `${date}T${time}`,
        duration: duration,
        notes: notes,
        isManual: true,
        isLesson: isLesson,
        createdAt: sessionForm.dataset.sessionId ? 
            window.getItemById('SESSIONS', sessionForm.dataset.sessionId).createdAt : 
            new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save session
    if (sessionForm.dataset.sessionId) {
        window.updateItem('SESSIONS', session);
    } else {
        window.saveItems('SESSIONS', session);
    }
    
    // Close dialog and refresh list
    sessionDialog.close();
    loadSessions();
};

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

// Initialize sessions page
initializeSessions();

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

function updateSessionsList(sessions) {
    console.log('Updating sessions list');
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    console.log('Current instrument for sessions:', currentInstrument);
    
    // Filter sessions by current instrument
    if (currentInstrument && sessions) {
        sessions = sessions.filter(session => session.instrument === currentInstrument);
        console.log(`Filtered to ${sessions.length} sessions for instrument: ${currentInstrument}`);
    }
    
    // Get sessions list container
    const sessionsList = document.getElementById('sessions-list');
    if (!sessionsList) {
        console.error('Sessions list container not found');
        return;
    }
    
    // Clear existing sessions
    sessionsList.innerHTML = '';
    
    // Show message if no sessions
    if (!sessions || sessions.length === 0) {
        const noSessions = document.createElement('div');
        noSessions.className = 'no-sessions';
        noSessions.textContent = currentInstrument ? 
            `No practice sessions found for ${currentInstrument}` : 
            'No practice sessions found';
        sessionsList.appendChild(noSessions);
        return;
    }
    
    // Sort sessions by date (newest first)
    sessions.sort((a, b) => new Date(b.startTime) - new Date(a.startTime));
    
    // Add sessions to list
    sessions.forEach(session => {
        const sessionElement = createSessionElement(session);
        if (sessionElement) {
            sessionsList.appendChild(sessionElement);
        }
    });
    
    // Refresh icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
} 