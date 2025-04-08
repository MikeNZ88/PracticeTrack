// DOM Elements
let settingsForm;
let categoriesList;
let newCategoryInput;
let addCategoryBtn;
let exportDataBtn;
let importDataBtn;
let lessonDaySelect;
let lessonTimeInput;
let instrumentSelect;
let themeToggle;
let clearDataBtn;
let lastKnownLessonTime = ''; // Variable to store the time value

// Cleanup any corrupted data
const cleanupStorage = () => {
    console.log('Running storage cleanup...');
    
    try {
        // Check for settings
        const settingsStr = localStorage.getItem('practiceTrack_settings');
        console.log('Current settings in storage:', settingsStr);
        
        if (!settingsStr) {
            console.log('No settings found, creating defaults');
            const defaultSettings = [{
                id: 's-1',
                lessonDay: '',
                lessonTime: '',
                theme: 'light',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }];
            localStorage.setItem('practiceTrack_settings', JSON.stringify(defaultSettings));
            console.log('Default settings created:', defaultSettings);
        }
        
        // Check for categories
        const categoriesStr = localStorage.getItem('practiceTrack_categories');
        console.log('Current categories in storage:', categoriesStr);
        
        if (!categoriesStr) {
            console.log('No categories found, creating empty array');
            localStorage.setItem('practiceTrack_categories', JSON.stringify([]));
        }
        
        return true;
    } catch (error) {
        console.error('Error during cleanup:', error);
        return false;
    }
};

// Initialize settings page
const initializeSettings = () => {
    console.log('Initializing settings page');
    
    try {
        // Get DOM elements
        settingsForm = document.getElementById('settings-form');
        categoriesList = document.getElementById('categories-list');
        newCategoryInput = document.getElementById('new-category-name');
        addCategoryBtn = document.getElementById('add-category-btn');
        exportDataBtn = document.getElementById('export-data');
        importDataBtn = document.getElementById('import-data');
        lessonDaySelect = document.getElementById('lesson-day');
        lessonTimeInput = document.getElementById('lesson-time');
        instrumentSelect = document.getElementById('primary-instrument');
        themeToggle = document.getElementById('theme-toggle');
        clearDataBtn = document.getElementById('clear-all-data');
        
        console.log('DOM elements found:', {
            categoriesList: !!categoriesList,
            newCategoryInput: !!newCategoryInput,
            addCategoryBtn: !!addCategoryBtn
        });
        
        // First, clean up any corrupted data
        cleanupStorage();
        
        // Then load settings and set up UI
        loadSettings();
        setupEventListeners();
        loadCategories();
        addStyles();
        
        // Initialize default categories if none exist
        initializeDefaultCategories();
        
        // --- Call Lucide Icons ONCE after everything is loaded --- 
        if (window.lucide) {
            try {
                // Use document.body or a specific container if appropriate
                window.lucide.createIcons(); // Call generally or specify context
                console.log('Lucide icons initialized globally/for settings page.');
            } catch (e) {
                console.error("Error initializing Lucide icons in initializeSettings:", e);
            }
        } else {
            console.warn('Lucide library not available during initializeSettings.');
        }
        // --- End Call Lucide Icons ---

        console.log('Settings page initialized successfully');
    } catch (error) {
        console.error('Error initializing settings:', error);
        // Display more specific error to user
        showMessage(`Initialization error: ${error.message}`, 'error'); 
    }
};

// Setup event listeners
const setupEventListeners = () => {
    try {
        console.log('Setting up event listeners');
        
        // Listen for categories updates from other modules
        document.addEventListener('categoriesUpdated', (event) => {
            console.log('Received categoriesUpdated event, reloading categories list.');
            loadCategories(); // Reload the categories list
        });
        
        // Category management
        if (addCategoryBtn) {
            console.log('Setting up add category button listener');
            // Clone button to remove previous listeners
            const newBtn = addCategoryBtn.cloneNode(true);
            addCategoryBtn.parentNode.replaceChild(newBtn, addCategoryBtn);
            addCategoryBtn = newBtn;
            
            // Add click listener
            addCategoryBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent default form submission/navigation
                e.stopPropagation(); // Prevent event from bubbling up
                console.log('[Settings Add Category Listener] Clicked!'); // Log specific listener trigger
                handleAddCategory();
            });
        }
        
        if (newCategoryInput) {
            console.log('Setting up new category input listener');
            // Clone input to remove previous listeners
            const newInput = newCategoryInput.cloneNode(true);
            newCategoryInput.parentNode.replaceChild(newInput, newCategoryInput);
            newCategoryInput = newInput;
            
            // Add keypress listener for Enter
            newCategoryInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCategory();
                }
            });
        }
        
        // Data management buttons
        if (exportDataBtn) {
            const newBtn = exportDataBtn.cloneNode(true);
            exportDataBtn.parentNode.replaceChild(newBtn, exportDataBtn);
            exportDataBtn = newBtn;
            exportDataBtn.addEventListener('click', handleExportData);
        }
        
        if (importDataBtn) {
            const newBtn = importDataBtn.cloneNode(true);
            importDataBtn.parentNode.replaceChild(newBtn, importDataBtn);
            importDataBtn = newBtn;
            importDataBtn.addEventListener('click', handleImportData);
        }
        
        // Clear data button
        if (clearDataBtn) {
            const newBtn = clearDataBtn.cloneNode(true);
            clearDataBtn.parentNode.replaceChild(newBtn, clearDataBtn);
            newBtn.addEventListener('click', handleClearAllData);
        }
        
        // --- Add Listener for Time Input BLUR --- 
        const timeInput = document.getElementById('lesson-time');
        if (timeInput) {
            console.log('[setupEventListeners] Found #lesson-time element. Attaching BLUR listener.'); 
            // Remove previous input/change listeners if they were added dynamically (safer) 
            // timeInput.removeEventListener('input', ...); // Ideally, store function reference to remove
            // timeInput.removeEventListener('change', ...);

            timeInput.addEventListener('blur', (event) => { // Listen for BLUR
                lastKnownLessonTime = event.target.value;
                console.log('[Time Input Listener] BLUR event fired! New value:', lastKnownLessonTime);
            });
        } else {
            console.error('[setupEventListeners] #lesson-time element NOT FOUND!'); 
        }
        // --- End Time Input Listener ---
        
        // Save lesson settings button
        const saveLessonSettingsBtn = document.getElementById('save-lesson-settings');
        if (saveLessonSettingsBtn) {
            console.log('Setting up save lesson settings button listener');
            const newSaveBtn = saveLessonSettingsBtn.cloneNode(true);
            saveLessonSettingsBtn.parentNode.replaceChild(newSaveBtn, saveLessonSettingsBtn);
            newSaveBtn.addEventListener('click', (event) => { 
                event.preventDefault(); 
                console.log('[Save Button Listener] Clicked! Event target:', event.target);
                handleSettingsSubmit(); 
            });
        }
        
        // Lesson Day Selector Buttons
        const daySelector = document.getElementById('lesson-day-selector');
        if (daySelector) {
            const dayButtons = daySelector.querySelectorAll('.day-button');
            const hiddenInput = document.getElementById('lesson-day');

            dayButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const selectedDay = button.dataset.day;
                    hiddenInput.value = selectedDay; // Update hidden input

                    // Update active state
                    dayButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');
                    console.log('Selected lesson day:', selectedDay);
                });
            });
        }
        
        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('change', handleThemeChange);
        }
        
        console.log('Event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
};

// Load settings
const loadSettings = () => {
    try {
        console.log('Loading settings...');
        
        // Get current settings
        const settingsStr = localStorage.getItem('practiceTrack_settings');
        console.log('Raw settings from storage:', settingsStr);
        
        let settings = []; // Default to empty array
        try {
            settings = settingsStr ? JSON.parse(settingsStr) : [];
        } catch (parseError) {
            console.error("Error parsing settings JSON:", parseError, "Raw:", settingsStr);
            // Optionally provide default settings here if parsing fails
            settings = [{
                id: 's-1',
                lessonDay: '',
                lessonTime: '',
                theme: 'light',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }];
        }
        
        // Ensure settings is an array and has at least one element
        if (!Array.isArray(settings) || settings.length === 0) {
            console.warn("Settings array is invalid or empty after parsing/defaulting. Using default.");
            settings = [{
                id: 's-1',
                lessonDay: '',
                lessonTime: '',
                theme: 'light',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }];
        }

        const currentSetting = settings[0]; // Use the first settings object
        console.log('Using settings object:', currentSetting);

        // Populate lesson day selector
        const daySelector = document.getElementById('lesson-day-selector');
        const hiddenLessonDayInput = document.getElementById('lesson-day'); // The hidden input
        if (daySelector && hiddenLessonDayInput && currentSetting.lessonDay !== undefined) { // Check existence and property
            const currentDay = currentSetting.lessonDay;
            hiddenLessonDayInput.value = currentDay; 
            const dayButtons = daySelector.querySelectorAll('.day-button');
            dayButtons.forEach(button => {
                if (button.dataset.day === currentDay) {
                    button.classList.add('active');
                } else {
                    button.classList.remove('active');
                }
            });
            console.log('Set active lesson day button for:', currentDay);
        } else {
             console.warn('Lesson day selector/input not found, or lessonDay missing in currentSetting');
             // Ensure no button is active if value is empty or element missing
             if (daySelector) {
                 daySelector.querySelectorAll('.day-button').forEach(btn => btn.classList.remove('active'));
             }
             if(hiddenLessonDayInput) hiddenLessonDayInput.value = '';
        }
        
        // Populate lesson time
        if (lessonTimeInput && currentSetting.lessonTime) { // Check existence and property
            console.log('Setting lesson time to:', currentSetting.lessonTime);
            lessonTimeInput.value = currentSetting.lessonTime;
            lastKnownLessonTime = currentSetting.lessonTime; // Initialize lastKnownLessonTime with saved value
        } else if (lessonTimeInput) {
            // If no time saved, set a default PM time (e.g., 1:00 PM)
            console.log('No lesson time saved, setting default to 13:00 (1 PM)');
            lessonTimeInput.value = "13:00";
            lastKnownLessonTime = "13:00"; // Update lastKnownLessonTime with the default
        }
        
        // Populate theme toggle
        if (themeToggle && currentSetting.theme) { // Check existence and property
            console.log('Setting theme to:', currentSetting.theme);
            themeToggle.value = currentSetting.theme;
            // Apply theme immediately
            document.body.classList.remove('theme-light', 'theme-dark'); // Remove existing themes first
            document.body.classList.add(`theme-${currentSetting.theme}`); // Add the correct theme class
            console.log(`Applied theme class: theme-${currentSetting.theme}`);
        } else {
             console.warn("Theme toggle element or theme property missing.");
        }
        
        // Load primary instrument 
        const primaryInstrument = localStorage.getItem('practiceTrack_primaryInstrument');
        if (instrumentSelect && primaryInstrument) {
             console.log('Primary instrument found:', primaryInstrument);
             // Example: instrumentSelect.value = primaryInstrument; 
        }
        
        // --- Display Last Import Timestamp --- 
        const lastImportInfoElement = document.getElementById('last-import-info');
        if (lastImportInfoElement) {
            const lastImportTimestamp = localStorage.getItem('practiceTrack_lastImportTimestamp');
            const sessionsStr = localStorage.getItem('practiceTrack_sessions');
            const sessionsExist = sessionsStr && sessionsStr !== '[]'; 

            if (sessionsExist && lastImportTimestamp) { 
                try {
                    const formattedDate = new Date(lastImportTimestamp).toLocaleString();
                    lastImportInfoElement.textContent = `Last successful import: ${formattedDate}`;
                    lastImportInfoElement.style.display = ''; 
                } catch (e) {
                    console.error("Error formatting last import timestamp:", e);
                    lastImportInfoElement.textContent = 'Last successful import: Invalid date stored.';
                    lastImportInfoElement.style.display = ''; 
                }
            } else {
                lastImportInfoElement.style.display = 'none'; 
            }
        } else {
             console.warn("last-import-info element not found.");
        }
        // --- End Display Last Import Timestamp ---

        console.log('Settings loaded into UI successfully');
    } catch (error) {
        console.error('Error loading settings:', error); // Log the specific error
        // Display more specific error to user
        showMessage(`Error loading settings: ${error.message}`, 'error'); 
    }
};

// Notify application that categories have changed
function notifyCategoriesChanged() {
    // Dispatch event to notify other components
    const event = new CustomEvent('dataChanged', {
        detail: {
            type: 'CATEGORIES',
            timestamp: Date.now()
        }
    });
    document.dispatchEvent(event);
}

// Handle adding a new category
function handleAddCategory() {
    try {
        console.log('Handling add category');
        
        // --- Get fresh reference to input --- 
        const categoryNameInput = document.getElementById('new-category-name');
        if (!categoryNameInput || !categoryNameInput.value.trim()) { // Check using the fresh reference
            console.log('No category name provided or element not found.');
            showMessage('Please enter a category name', 'error');
            return;
        }
        
        const categoryName = categoryNameInput.value.trim();
        
        // --- Debug Logs (using fresh reference) --- 
        console.log('[handleAddCategory] categoryNameInput element:', categoryNameInput);
        console.log('[handleAddCategory] Value read from input element:', categoryNameInput.value);
        console.log('[handleAddCategory] categoryName after trim():', categoryName);
        // --- End Debug Logs ---

        console.log('Adding category:', categoryName);
        
        // Get existing categories
        const categoriesStr = localStorage.getItem('practiceTrack_categories');
        let categories = categoriesStr ? JSON.parse(categoriesStr) : [];
        
        // Check if category already exists (more robust check)
        const lowerCaseCategoryName = categoryName.toLowerCase(); // Convert the NEW name once
        const exists = categories.some(cat => {
            // Check 1: Does the category and its name property exist and is it a string?
            if (!cat || typeof cat.name !== 'string') {
                console.warn('[handleAddCategory] Found invalid category object in storage:', cat); 
                return false; // Skip this invalid category
            }
            // Check 2: If name is valid, compare it (case-insensitive)
            return cat.name.toLowerCase() === lowerCaseCategoryName;
        });

        if (exists) {
            console.log('Category already exists');
            showMessage('This category already exists', 'error');
            return;
        }
        
        // Add new category
        const newCategory = {
            id: `c-${Date.now()}`,
            name: categoryName,
            custom: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        categories.push(newCategory);
        localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
        
        // Clear input (using fresh reference)
        categoryNameInput.value = '';
        
        // Reload categories and notify app
        loadCategories();
        
        // Dispatch event to notify other components
        const event = new CustomEvent('dataChanged', {
            detail: {
                type: 'CATEGORIES',
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
        
        // --- Button Feedback --- 
        if (addCategoryBtn) {
            const originalText = addCategoryBtn.textContent;
            addCategoryBtn.textContent = 'Added!';
            addCategoryBtn.classList.add('button-saved');
            addCategoryBtn.disabled = true;
            setTimeout(() => {
                addCategoryBtn.textContent = originalText;
                addCategoryBtn.classList.remove('button-saved');
                addCategoryBtn.disabled = false;
            }, 1500); // Revert after 1.5 seconds
        }
        // --- End Button Feedback ---
        
        console.log('Category added successfully:', newCategory);
    } catch (error) {
        console.error('Error adding category:', error);
        showMessage('Error adding category', 'error');
    }
}

// Handle editing a category
const handleEditCategory = (categoryId) => {
    try {
        // Get categories
        let categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        const category = categories.find(cat => cat.id === categoryId);
        
        if (!category) return;
        
        // Prompt for new name
        const newName = prompt('Enter new category name:', category.name);
        
        if (!newName || newName.trim() === '') return;
        
        // Check if category already exists
        const exists = categories.some(cat => 
            cat.id !== categoryId && 
            cat.name.toLowerCase() === newName.trim().toLowerCase()
        );
        
        if (exists) {
            alert('A category with this name already exists');
            return;
        }
        
        // Update category
        category.name = newName.trim();
        category.updatedAt = new Date().toISOString();
        
        // Save categories
        localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
        
        // Reload categories
        loadCategories();
        
        // Notify application that categories have changed
        notifyCategoriesChanged();
        
        // Show success message
        alert('Category updated successfully');
    } catch (error) {
        console.error('Error editing category:', error);
    }
};

// Handle deleting a category
function handleDeleteCategory(categoryId) {
    console.log('Deleting category:', categoryId);
    
    if (!categoryId) {
        console.error('No category ID provided');
        return;
    }
    
    try {
        // Get current categories
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        
        // Find category
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) {
            console.error('Category not found:', categoryId);
            return;
        }
        
        // Confirm deletion
        if (!confirm(`Are you sure you want to delete "${category.name}"?`)) {
            return;
        }
        
        // Filter out the category
        const updatedCategories = categories.filter(cat => cat.id !== categoryId);
        
        // Save updated categories
        localStorage.setItem('practiceTrack_categories', JSON.stringify(updatedCategories));
        
        // Reload categories
        loadCategories();
        
        // Dispatch event to notify other components
        const event = new CustomEvent('dataChanged', {
            detail: {
                type: 'CATEGORIES',
                timestamp: Date.now()
            }
        });
        document.dispatchEvent(event);
        
        alert('Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
    }
}

// Create category list item element
const createCategoryElement = (category) => {
    // Basic check for valid category object
    if (!category || typeof category.name !== 'string' || typeof category.id !== 'string') {
        console.warn('[Settings] Skipping invalid category object during element creation:', category);
        return null; // Skip this category
    }

    const listItem = document.createElement('li');
    listItem.className = 'category-item';
    listItem.dataset.categoryId = category.id;
    
    const categoryNameSpan = document.createElement('span');
    categoryNameSpan.className = 'category-name';
    categoryNameSpan.textContent = category.name;
    listItem.appendChild(categoryNameSpan);
    
    // Category Actions Container
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'category-actions';
    
    // Delete Button
    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'icon-button delete-category app-button app-button--secondary'; // Match existing button classes
    deleteBtn.title = 'Delete Category';
    deleteBtn.innerHTML = '<i data-lucide="trash-2"></i>'; // Use lucide icon
    deleteBtn.addEventListener('click', (e) => { 
        e.stopPropagation(); // Prevent potential parent handlers
        handleDeleteCategory(category.id); // Ensure handleDeleteCategory exists and is accessible
    });
    actionsDiv.appendChild(deleteBtn);
    
    listItem.appendChild(actionsDiv);
    
    // We need to initialize the icon for the button we just created
    if (window.lucide) {
        try {
            lucide.createIcons({ context: deleteBtn });
        } catch (iconError) {
            console.error('Error creating icon for delete button:', iconError);
        }
    }
    
    return listItem;
};

// Load categories
const loadCategories = () => {
    try {
        console.log('Loading categories for settings page');
        if (!categoriesList) {
            console.error('Categories list element not found in loadCategories.');
            return;
        }
        
        categoriesList.innerHTML = ''; // Clear existing list
        
        const categories = window.getItems ? window.getItems('CATEGORIES') : 
            JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        
        console.log(`Found ${categories ? categories.length : 0} raw categories.`);

        if (categories && categories.length > 0) {
            // **** Filter out invalid categories BEFORE processing ****
            const validCategories = categories.filter(cat => cat && typeof cat.name === 'string' && cat.name.trim() !== '');
            console.log(`Found ${validCategories.length} valid categories after filtering.`);

            // Sort valid categories alphabetically by name, case-insensitive
            validCategories.sort((a, b) => a.name.localeCompare(b.name, undefined, { sensitivity: 'base' })); 

            validCategories.forEach(category => {
                const categoryElement = createCategoryElement(category);
                categoriesList.appendChild(categoryElement);
            });
        } else {
            console.log('No categories found or category array is empty.');
            // Optionally display an empty state message here
            // categoriesList.innerHTML = '<p class="empty-state">No categories defined yet.</p>';
        }
        
        // Initialize Lucide icons for the category list - Moved here
        if (window.lucide) {
             try {
                 window.lucide.createIcons({ context: categoriesList });
             } catch (e) {
                 console.error("Error initializing Lucide icons within loadCategories:", e);
             }
        }

    } catch (error) {
        console.error('Error loading categories:', error);
        if (categoriesList) {
            categoriesList.innerHTML = '<li class="error-message">Error loading categories.</li>';
        }
    }
};

// Test settings storage
const testSettingsStorage = () => {
    try {
        console.log('Testing settings storage...');
        
        // Test writing to localStorage
        const testSettings = [{
            id: 'test-1',
            lessonDay: 'Monday',
            lessonTime: '14:00',
            theme: 'light',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }];
        
        localStorage.setItem('practiceTrack_settings', JSON.stringify(testSettings));
        console.log('Test settings written to localStorage');
        
        // Test reading from localStorage
        const savedSettings = JSON.parse(localStorage.getItem('practiceTrack_settings'));
        console.log('Test settings read from localStorage:', savedSettings);
        
        if (savedSettings && savedSettings[0].lessonDay === 'Monday') {
            console.log('Settings storage test successful');
            return true;
        } else {
            console.error('Settings storage test failed');
            return false;
        }
    } catch (error) {
        console.error('Error testing settings storage:', error);
        return false;
    }
};

// Handle settings form submission
const handleSettingsSubmit = () => {
    try {
        console.log('Starting settings save...');
        
        // Get current settings
        const settingsStr = localStorage.getItem('practiceTrack_settings');
        console.log('Current settings from storage:', settingsStr);
        
        let settings = []; // Default to empty
        try {
            settings = settingsStr ? JSON.parse(settingsStr) : [];
        } catch (parseError) {
            console.error("Error parsing settings JSON during save:", parseError, "Raw:", settingsStr);
            settings = []; // Ensure it's an empty array on parse error
        }

        // --- Ensure settings structure exists --- 
        if (!Array.isArray(settings) || settings.length === 0) {
            console.warn('Settings array was empty or invalid during save. Initializing.');
            settings = [{
                id: 's-1', // Default ID
                lessonDay: '',
                lessonTime: '',
                theme: 'light', // Keep theme even if unused for now
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }];
        }
        // --- End Ensure structure ---
        
        // Get fresh reference for DAY input only
        const currentLessonDayInput = document.getElementById('lesson-day'); 
        const newLessonDay = currentLessonDayInput ? currentLessonDayInput.value : '';

        // Use the stored time value
        const newLessonTime = lastKnownLessonTime; // Use value captured by input listener

        // --- Log the values being read/used --- 
        console.log('[handleSettingsSubmit] Value used for time input:', newLessonTime);
        console.log('[handleSettingsSubmit] Value read from day input:', newLessonDay);
        // --- End Log ---

        console.log('New values to save:', { newLessonDay, newLessonTime });

        // Update settings object
        settings[0].lessonDay = newLessonDay;
        settings[0].lessonTime = newLessonTime;
        settings[0].updatedAt = new Date().toISOString();

        console.log('[handleSettingsSubmit] Settings object BEFORE saving:', settings);

        // Save to localStorage
        localStorage.setItem('practiceTrack_settings', JSON.stringify(settings));

        // Verify save
        const savedSettings = JSON.parse(localStorage.getItem('practiceTrack_settings'));
        console.log('Verified saved settings:', savedSettings[0]);

        if (savedSettings && savedSettings[0] && savedSettings[0].lessonDay === newLessonDay && savedSettings[0].lessonTime === newLessonTime) {
            const event = new CustomEvent('settingsUpdated', {
                detail: { settings: settings[0] }
            });
            document.dispatchEvent(event);
            showMessage('Settings saved successfully', 'success');
        } else {
            console.error('Settings verification failed!', { 
                expected: { day: newLessonDay, time: newLessonTime }, 
                saved: savedSettings ? savedSettings[0] : 'null' 
            });
            throw new Error('Settings verification failed after save.');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showMessage(`Error saving settings: ${error.message}`, 'error');
    }
};

// Show message notification
const showMessage = (message, type = 'success') => {
    console.log(`Message suppressed: [${type}] ${message}`); // Optional: Log suppressed messages instead
};

// Handle data export
const handleExportData = () => {
    const data = {
        settings: window.getItems('SETTINGS'),
        categories: window.getItems('CATEGORIES'),
        sessions: window.getItems('SESSIONS'),
        goals: window.getItems('GOALS'),
        media: window.getItems('MEDIA')
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `practicetrack-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

// Handle data import
const handleImportData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const data = JSON.parse(event.target.result);
                
                // Validate data structure
                if (!data.settings || !data.categories) {
                    throw new Error('Invalid backup file format');
                }
                
                // Import data using localStorage.setItem
                localStorage.setItem('practiceTrack_settings', JSON.stringify(data.settings));
                localStorage.setItem('practiceTrack_categories', JSON.stringify(data.categories));
                if (data.sessions) localStorage.setItem('practiceTrack_sessions', JSON.stringify(data.sessions));
                if (data.goals) localStorage.setItem('practiceTrack_goals', JSON.stringify(data.goals));
                if (data.media) localStorage.setItem('practiceTrack_media', JSON.stringify(data.media));
                
                // Reload settings and categories to reflect imported data
                loadSettings();
                loadCategories();
                
                // --- Save Timestamp --- 
                localStorage.setItem('practiceTrack_lastImportTimestamp', new Date().toISOString());
                // --- End Save Timestamp ---

                showMessage('Data imported successfully', 'success');
            } catch (error) {
                console.error('Error importing data:', error);
                showMessage('Error importing data: ' + error.message, 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
};

// Handle clearing all data
const handleClearAllData = () => {
    console.log('Clear All Data button clicked');
    // Confirmation Dialog
    const isConfirmed = confirm(
        'Are you absolutely sure you want to clear ALL data?\n\n' +
        'This includes: \n' +
        '- All practice sessions\n' +
        '- All goals\n' +
        '- All media items\n' +
        '- All custom categories\n' +
        '- All settings (lesson day/time, theme)\n\n' +
        'This action CANNOT be undone!'
    );

    if (isConfirmed) {
        console.log('User confirmed data clearing.');
        try {
            // Clear all relevant localStorage items
            localStorage.removeItem('practiceTrack_sessions');
            localStorage.removeItem('practiceTrack_goals');
            localStorage.removeItem('practiceTrack_categories');
            localStorage.removeItem('practiceTrack_settings');
            localStorage.removeItem('practiceTrack_media');
            localStorage.removeItem('practiceTrack_timerState');
            localStorage.removeItem('practiceTrack_primaryInstrument'); // If you store this
            localStorage.removeItem('practiceTrack_lastImportTimestamp');

            console.log('All PracticeTrack data cleared from localStorage.');

            // Optionally reset UI elements or reload the page
            // Reset settings form
            if (settingsForm) settingsForm.reset();
            if (document.getElementById('lesson-day-selector')) {
                document.getElementById('lesson-day-selector').querySelectorAll('.day-button').forEach(btn => btn.classList.remove('active'));
            }
            if (document.getElementById('lesson-day')) {
                document.getElementById('lesson-day').value = '';
            }

            // Reload categories (will show defaults if implemented)
            initializeDefaultCategories();
            loadCategories();

            // Show success message
            showMessage('All data cleared successfully!');

            // Consider reloading the page for a clean slate
            // window.location.reload();

        } catch (error) {
            console.error('Error clearing data:', error);
            showMessage('Error clearing data. Please check the console.', 'error');
        }
    } else {
        console.log('User cancelled data clearing.');
    }
};

// Add styles
const addStyles = () => {
    const styles = `
        .settings-section {
            margin-bottom: 2rem;
            padding: 1.5rem;
            background: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .settings-section h2 {
            margin: 0 0 1rem;
            font-size: 1.25rem;
            color: #333;
        }
        
        .settings-row {
            margin-bottom: 1rem;
        }
        
        .form-group {
            margin-bottom: 1rem;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #555;
        }
        
        .form-group select,
        .form-group input {
            width: 100%;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .categories-container {
            margin-top: 1rem;
        }
        
        .categories-list {
            list-style: none;
            padding: 0;
            margin: 1rem 0;
        }
        
        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem 1rem;
            margin-bottom: 0.5rem;
            background: var(--card-background); /* Use theme variable */
            border-radius: var(--radius-md); /* Use theme variable */
            border: 1px solid var(--border-color); /* Use theme variable */
            font-size: var(--font-sm); /* Use theme variable */
            min-height: 44px; /* Ensure consistent height */
        }
        
        .category-name {
            flex-grow: 1; /* Allow name to take available space */
            margin-right: var(--space-sm); /* Space before actions */
            /* Ellipsis styles */
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            min-width: 0; /* Important for flex items to allow shrinking */
            color: var(--text-dark); /* Use theme variable */
        }
        
        .category-actions {
            display: flex;
            gap: 0.5rem;
            flex-shrink: 0; /* Prevent actions from shrinking */
        }

        /* Style for the new icon button */
        .category-actions .delete-btn {
            background-color: transparent;
            border: none;
            color: var(--text-medium); /* Use theme variable */
            cursor: pointer;
            padding: var(--space-xs); /* Adjust padding for icon */
            border-radius: var(--radius-full);
            display: flex; /* Align icon nicely */
            align-items: center;
            justify-content: center;
            transition: background-color 0.2s, color 0.2s;
        }

        .category-actions .delete-btn:hover {
            background-color: var(--color-danger-background); /* Use theme variable */
            color: var(--color-danger-text); /* Use theme variable */
        }

        .category-actions .delete-btn i {
            width: var(--icon-size-sm); /* Adjust icon size */
            height: var(--icon-size-sm);
        }
        
        .add-category-form {
            display: flex;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .add-category-form input {
            flex: 1;
            padding: 0.5rem;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 1rem;
        }
        
        .data-buttons {
            display: flex;
            gap: 1rem;
            margin-top: 1rem;
        }
        
        .clear-data-section {
            margin-top: 2rem;
            padding-top: 1rem;
            border-top: 1px solid #eee;
        }
        
        .clear-data-section h4 {
            margin: 0 0 1rem;
            color: #333;
        }
        
        .danger-button {
            background: #f44336;
            color: white;
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles; // Use only base styles
    document.head.appendChild(styleSheet);
};

// Initialize default categories if none exist
function initializeDefaultCategories() {
    try {
        // Check if categories exist
        const existingCategories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        
        if (existingCategories.length === 0) {
            console.log('No categories found, initializing default categories');
            
            // Default categories
            const defaultCategories = [
                { id: 'cat_warmup', name: 'Warm-up', custom: false },
                { id: 'cat_technique', name: 'Technique', custom: false },
                { id: 'cat_repertoire', name: 'Repertoire', custom: false },
                { id: 'cat_sightreading', name: 'Sight-reading', custom: false },
                { id: 'cat_theory', name: 'Theory', custom: false }
            ];
            
            // Save default categories
            localStorage.setItem('practiceTrack_categories', JSON.stringify(defaultCategories));
            console.log('Default categories initialized');
        }
    } catch (error) {
        console.error('Error initializing default categories:', error);
    }
}

// Initialize settings page when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing settings page');
        if (document.getElementById('settings-page')) {
            initializeSettings();
        }
    });
} else {
    console.log('DOM already loaded, initializing settings page immediately');
    if (document.getElementById('settings-page')) {
        initializeSettings();
    }
}

// Make functions available globally
window.initializeSettings = initializeSettings;
window.loadSettings = loadSettings;
window.loadCategories = loadCategories;
window.handleAddCategory = handleAddCategory;
window.handleEditCategory = handleEditCategory;
window.handleDeleteCategory = handleDeleteCategory;
window.handleSettingsSubmit = handleSettingsSubmit;
window.handleExportData = handleExportData;
window.handleImportData = handleImportData;
window.handleClearAllData = handleClearAllData; 