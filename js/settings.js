// DOM Elements
const settingsForm = document.getElementById('settings-form');
const primaryInstrumentSelect = document.getElementById('primary-instrument');
const lessonDaySelect = document.getElementById('lesson-day');
const lessonTimeInput = document.getElementById('lesson-time');
const categoriesList = document.getElementById('categories-list');
const exportDataBtn = document.getElementById('export-data');
const importDataBtn = document.getElementById('import-data');

// Cleanup any corrupted data
const cleanupStorage = () => {
    console.log('Running storage cleanup...');
    
    try {
        // Check categories
        let categories = getItems('CATEGORIES') || [];
        let needsReset = false;
        
        // Check for potential corruption
        if (categories.length === 0) {
            console.log('No categories found, will recreate defaults');
            needsReset = true;
        } else {
            // Look for signs of corruption
            const invalidCategories = categories.filter(cat => {
                return !cat.id || typeof cat.name !== 'string' || cat.name.trim() === '';
            });
            
            if (invalidCategories.length > 0) {
                console.warn('Found invalid categories, resetting to defaults');
                needsReset = true;
            } else {
                // Check for missing default categories
                const defaultIds = ['c-1', 'c-2', 'c-3', 'c-4', 'c-5', 'c-6', 'c-7'];
                const foundIds = categories.map(cat => cat.id);
                const missingIds = defaultIds.filter(id => !foundIds.includes(id));
                
                if (missingIds.length > 0) {
                    console.warn('Missing default categories:', missingIds);
                    needsReset = true;
                }
            }
        }
        
        // Reset categories if needed
        if (needsReset) {
            console.log('Resetting categories to defaults');
            resetCategories(false); // Silent reset (no confirmation)
        }
        
        // Fix settings
        let settings = getItems('SETTINGS');
        if (settings.length === 0) {
            console.log('No settings found, will create defaults');
            saveItem('SETTINGS', {
                id: 's-1',
                primaryInstrument: '',
                lessonDay: '',
                lessonTime: '',
                hiddenCategories: [],
                theme: 'light',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
        } else {
            settings = settings[0];
            if (!settings.hasOwnProperty('hiddenCategories')) {
                settings.hiddenCategories = [];
                saveItem('SETTINGS', settings);
                console.log('Fixed settings - added hiddenCategories array');
            }
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
    
    // First, clean up any corrupted data
    cleanupStorage();
    
    // Then load settings and set up UI
    loadSettings();
    setupCategoryManager();
    addStyles();
    
    // Set up form submission handler
    if (settingsForm) {
        settingsForm.addEventListener('submit', handleSettingsSubmit);
    } else {
        console.error('Settings form not found');
    }
    
    // Set up data management buttons
    if (exportDataBtn) {
        exportDataBtn.addEventListener('click', handleExportData);
    }
    
    if (importDataBtn) {
        importDataBtn.addEventListener('click', handleImportData);
    }
    
    // Set up clear data buttons
    const clearInstrumentDataBtn = document.getElementById('clear-instrument-data');
    if (clearInstrumentDataBtn) {
        clearInstrumentDataBtn.addEventListener('click', handleClearInstrumentData);
    }
    
    const clearAllDataBtn = document.getElementById('clear-all-data');
    if (clearAllDataBtn) {
        clearAllDataBtn.addEventListener('click', handleClearAllData);
    }
};

// Load settings
const loadSettings = () => {
    // Get settings from storage
    let settings = getItems('SETTINGS');
    
    // Extract first settings object or create empty object
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    
    console.log('Loading settings:', settings);
    
    // Populate instrument select
    populateInstrumentsDropdown(settings.primaryInstrument);
    
    // Populate lesson day select
    populateLessonDayDropdown(settings.lessonDay);
    
    // Set lesson time
    if (lessonTimeInput) {
        lessonTimeInput.value = settings.lessonTime || '';
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Setup category manager
const setupCategoryManager = () => {
    if (!categoriesList) {
        console.error('Categories list element not found');
        return;
    }
    
    // Clear previous content
    categoriesList.innerHTML = '';
    
    // Add header
    const header = document.createElement('div');
    header.className = 'categories-header';
    header.innerHTML = `
        <h3>Categories</h3>
        <p>Default categories can be hidden but not deleted. You can add your own categories.</p>
    `;
    categoriesList.appendChild(header);
    
    // Add reset button
    const resetButton = document.createElement('button');
    resetButton.type = 'button';
    resetButton.className = 'secondary-button';
    resetButton.textContent = 'Reset Categories';
    resetButton.addEventListener('click', resetCategories);
    header.appendChild(resetButton);
    
    // Add new category form
    const addCategoryForm = document.createElement('div');
    addCategoryForm.className = 'add-category-form';
    addCategoryForm.innerHTML = `
        <input type="text" id="new-category-name" placeholder="New category name">
        <button type="button" id="add-category-btn" class="secondary-button">
            <i data-lucide="plus"></i> Add
        </button>
    `;
    categoriesList.appendChild(addCategoryForm);
    
    // Add event listener to the add button
    const addCategoryBtn = document.getElementById('add-category-btn');
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', addNewCategory);
    }
    
    // Ensure default categories exist
    ensureDefaultCategories();
    
    // Display categories
    populateCategoriesList();
    
    // Add event listener to instrument dropdown
    if (primaryInstrumentSelect) {
        primaryInstrumentSelect.addEventListener('change', populateCategoriesList);
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Reset categories to defaults
const resetCategories = (confirmReset = true) => {
    // Skip confirmation if explicitly disabled (for automatic cleanup)
    if (confirmReset && !confirm('This will reset all categories to their default state. Custom categories will be deleted. Continue?')) {
        return;
    }
    
    console.log('Resetting categories to defaults');
    
    try {
        // Get current settings to preserve hidden categories if they exist
        const settings = getItems('SETTINGS');
        const currentSettings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        
        // Get instruments
        const instruments = [
            'piano', 'guitar', 'violin', 'drums', 'voice', 
            'bass', 'flute', 'saxophone', 'trumpet', 'cello'
        ];
        
        // Default categories for all instruments
        const defaultCategories = [
            {
                id: 'c-1',
                name: 'Technique',
                isDefault: true,
                isHidden: false,
                instrumentIds: instruments,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'c-2',
                name: 'Repertoire',
                isDefault: true,
                isHidden: false,
                instrumentIds: instruments,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'c-3',
                name: 'Sight Reading',
                isDefault: true,
                isHidden: false,
                instrumentIds: instruments,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'c-4',
                name: 'Theory',
                isDefault: true,
                isHidden: false,
                instrumentIds: instruments,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'c-5',
                name: 'Ear Training',
                isDefault: true,
                isHidden: false,
                instrumentIds: instruments,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
        
        // Additional instrument-specific categories
        defaultCategories.push(
            {
                id: 'c-6',
                name: 'Scales',
                isDefault: true,
                isHidden: false,
                instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'saxophone', 'trumpet', 'cello', 'bass'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'c-7',
                name: 'Improvisation',
                isDefault: true,
                isHidden: false,
                instrumentIds: ['piano', 'guitar', 'saxophone', 'trumpet', 'drums', 'bass'],
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        );
        
        // Clear all existing categories
        localStorage.removeItem(STORAGE_KEYS.CATEGORIES);
        
        // Save default categories
        defaultCategories.forEach(category => {
            // If we have settings with hidden categories, restore the hidden state
            if (currentSettings && 
                currentSettings.hiddenCategories && 
                currentSettings.hiddenCategories.includes(category.id)) {
                category.isHidden = true;
            }
            
            saveItem('CATEGORIES', category);
        });
        
        // Refresh categories list
        populateCategoriesList();
        
        // Update timer categories
        if (typeof window.updateTimerCategories === 'function') {
            window.updateTimerCategories();
        }
        
        // Update sessions filters
        if (typeof window.refreshSessionsFilters === 'function') {
            window.refreshSessionsFilters();
        }
        
        // Update goals filters 
        if (typeof window.setupGoalsFilters === 'function') {
            window.setupGoalsFilters();
        }
        
        // Update stats filters
        if (typeof window.setupStatsFilters === 'function') {
            window.setupStatsFilters();
        }
        
        console.log('Categories reset complete');
    } catch (error) {
        console.error('Error resetting categories:', error);
        alert('An error occurred while resetting categories');
    }
};

// Ensure default categories exist
const ensureDefaultCategories = () => {
    console.log('Ensuring default categories exist');
    
    // Get the current instrument
    let settings = getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    
    // Get all default categories from data.js
    const defaultCategories = window.getItems('CATEGORIES').filter(c => c.isDefault) || [];
    const existingIds = defaultCategories.map(cat => cat.id);
    
    // Check for missing categories
    const existingCategories = getItems('CATEGORIES') || [];
    const existingCatIds = existingCategories.map(cat => cat.id);
    
    // Get default categories from data.js
    const allDefaultCats = window.defaultCategories || [
        { id: 'c-1', name: 'Technique', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'] },
        { id: 'c-2', name: 'Repertoire', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'] },
        { id: 'c-3', name: 'Music Theory', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'] },
        { id: 'c-4', name: 'Ear Training', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'] },
        { id: 'c-5', name: 'Sight Reading', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello'] },
        { id: 'c-6', name: 'Improvisation', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'trumpet', 'bass', 'saxophone'] },
        { id: 'c-7', name: 'Lesson', isDefault: true, instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'] }
    ];
    
    // Add any missing default categories relevant to the current instrument
    allDefaultCats.forEach(defaultCat => {
        // Only add if relevant to current instrument or if no instrument is selected
        const isRelevantToInstrument = !currentInstrument || !defaultCat.instrumentIds || 
            defaultCat.instrumentIds.includes(currentInstrument);
        
        if (!existingCatIds.includes(defaultCat.id) && isRelevantToInstrument) {
            const newCategory = {
                id: defaultCat.id,
                name: defaultCat.name,
                isHidden: false,
                isDefault: true,
                instrumentIds: defaultCat.instrumentIds,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            saveItem('CATEGORIES', newCategory);
            console.log(`Created default category: ${defaultCat.name}`);
        }
    });
    
    return true;
};

// Add new category
const addNewCategory = () => {
    const newCategoryInput = document.getElementById('new-category-name');
    if (!newCategoryInput) return;
    
    const categoryName = newCategoryInput.value.trim();
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    // Check if category with same name already exists
    const categories = getItems('CATEGORIES');
    if (categories.some(cat => cat.name.toLowerCase() === categoryName.toLowerCase())) {
        alert('A category with this name already exists');
        return;
    }
    
    // Create new category - explicitly set isHidden to false
    const newCategory = {
        id: 'c-' + Date.now(),
        name: categoryName,
        isHidden: false, // Explicitly set to false
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save category
    saveItem('CATEGORIES', newCategory);
    console.log(`New category added: ${categoryName}`, newCategory);
    
    // Clear input
    newCategoryInput.value = '';
    
    // Refresh categories list
    populateCategoriesList();
    
    // Also update timer categories
    if (typeof window.updateTimerCategories === 'function') {
        window.updateTimerCategories();
    }
};

// Populate instrument dropdown
const populateInstrumentsDropdown = (selectedInstrument) => {
    if (!primaryInstrumentSelect) return;
    
    const instruments = [
        'piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 
        'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'
    ];
    
    primaryInstrumentSelect.innerHTML = '<option value="">Select Instrument</option>';
    instruments.forEach(instrument => {
        const option = document.createElement('option');
        option.value = instrument;
        option.textContent = instrument.charAt(0).toUpperCase() + instrument.slice(1);
        option.selected = instrument === selectedInstrument;
        primaryInstrumentSelect.appendChild(option);
    });
};

// Populate lesson day dropdown
const populateLessonDayDropdown = (selectedDay) => {
    if (!lessonDaySelect) return;
    
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    lessonDaySelect.innerHTML = '<option value="">No Lesson Day</option>';
    days.forEach((day, index) => {
        const option = document.createElement('option');
        option.value = index;
        option.textContent = day;
        option.selected = index === parseInt(selectedDay);
        lessonDaySelect.appendChild(option);
    });
};

// Populate categories list
const populateCategoriesList = () => {
    if (!categoriesList) return;

    // Clear container
    const container = document.querySelector('.categories-container') || document.createElement('div');
    container.className = 'categories-container';
    container.innerHTML = '';
    
    if (!container.parentNode) {
        categoriesList.appendChild(container);
    }
    
    // Get current instrument
    let settings = getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    
    // Get categories
    const allCategories = getItems('CATEGORIES') || [];
    console.log('Total categories found:', allCategories.length);
    
    // Filter categories for the current instrument
    const categories = allCategories.filter(category => {
        // Include if it's a custom category (no instrumentIds)
        if (!category.isDefault) return true;
        
        // Include if no instrument is selected
        if (!currentInstrument) return true;
        
        // Include if it has no instrumentIds property
        if (!category.instrumentIds) return true;
        
        // Include if the current instrument is in its instrumentIds
        return category.instrumentIds.includes(currentInstrument);
    });
    
    console.log(`Categories for instrument "${currentInstrument}":`, categories.length);
    
    // No categories message
    if (categories.length === 0) {
        const noCategories = document.createElement('div');
        noCategories.className = 'no-categories';
        noCategories.textContent = 'No categories found for this instrument.';
        container.appendChild(noCategories);
        
        // Ensure defaults
        ensureDefaultCategories();
        return;
    }
    
    // Sort alphabetically
    categories.sort((a, b) => a.name.localeCompare(b.name));
    
    // Create category items
    categories.forEach(category => {
        const isDefault = category.isDefault === true;
        const isHidden = category.isHidden === true;
        
        const item = document.createElement('div');
        item.className = 'category-item';
        item.innerHTML = `
            <span class="category-name">
                ${category.name}
                ${isDefault ? '<span class="default-badge">Default</span>' : ''}
                ${isHidden ? '<span class="hidden-badge">Hidden</span>' : ''}
            </span>
            <div class="category-actions">
                ${!isDefault ? `
                <button type="button" class="delete-category" data-id="${category.id}">
                    <i data-lucide="trash-2"></i>
                </button>
                ` : ''}
                ${isHidden ? 
                    `<button type="button" class="show-category-btn" data-id="${category.id}">
                        <i data-lucide="eye"></i> Show
                    </button>` : 
                    `<button type="button" class="hide-category-btn" data-id="${category.id}">
                        <i data-lucide="eye-off"></i> Hide
                    </button>`
                }
            </div>
        `;
        container.appendChild(item);
        
        // Add event listeners
        const showBtn = item.querySelector('.show-category-btn');
        if (showBtn) {
            showBtn.addEventListener('click', () => showCategory(category.id));
        }
        
        const hideBtn = item.querySelector('.hide-category-btn');
        if (hideBtn) {
            hideBtn.addEventListener('click', () => hideCategory(category.id));
        }
        
        const deleteBtn = item.querySelector('.delete-category');
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteCategory(category.id));
        }
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Show a hidden category
const showCategory = (categoryId) => {
    console.log(`Showing category ${categoryId}`);
    
    // Get category
    const category = getItemById('CATEGORIES', categoryId);
    if (!category) {
        console.error(`Category not found: ${categoryId}`);
        return;
    }
    
    // Set isHidden to false
    category.isHidden = false;
    console.log(`Set category "${category.name}" to visible`);
    
    // Save updated category
    saveItem('CATEGORIES', category);
    
    // Update settings
    updateHiddenCategoriesInSettings();
    
    // Refresh categories list
    populateCategoriesList();
    
    // Update timer categories
    if (typeof window.updateTimerCategories === 'function') {
        window.updateTimerCategories();
    }
    
    // Update sessions filters
    if (typeof window.refreshSessionsFilters === 'function') {
        window.refreshSessionsFilters();
    }
    
    // Update goals filters 
    if (typeof window.setupGoalsFilters === 'function') {
        window.setupGoalsFilters();
    }
    
    // Update stats filters
    if (typeof window.setupStatsFilters === 'function') {
        window.setupStatsFilters();
    }
};

// Hide a visible category
const hideCategory = (categoryId) => {
    console.log(`Hiding category ${categoryId}`);
    
    // Get category
    const category = getItemById('CATEGORIES', categoryId);
    if (!category) {
        console.error(`Category not found: ${categoryId}`);
        return;
    }
    
    // Set isHidden to true
    category.isHidden = true;
    console.log(`Set category "${category.name}" to hidden`);
    
    // Save updated category
    saveItem('CATEGORIES', category);
    
    // Update settings
    updateHiddenCategoriesInSettings();
    
    // Refresh categories list
    populateCategoriesList();
    
    // Update timer categories
    if (typeof window.updateTimerCategories === 'function') {
        window.updateTimerCategories();
    }
    
    // Update sessions filters
    if (typeof window.refreshSessionsFilters === 'function') {
        window.refreshSessionsFilters();
    }
    
    // Update goals filters 
    if (typeof window.setupGoalsFilters === 'function') {
        window.setupGoalsFilters();
    }
    
    // Update stats filters
    if (typeof window.setupStatsFilters === 'function') {
        window.setupStatsFilters();
    }
};

// Delete a category (non-default only)
const deleteCategory = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This cannot be undone.')) {
        deleteItem('CATEGORIES', categoryId);
        populateCategoriesList();
        
        // Also update timer categories
        if (typeof window.updateTimerCategories === 'function') {
            window.updateTimerCategories();
        }
    }
};

// Handle settings form submission
const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Settings form submitted');
    
    // Get settings
    let settings = getItems('SETTINGS');
    
    // Extract first settings object or create a new one
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {
        id: 's-1',
        createdAt: new Date().toISOString()
    };
    
    // Update basic settings
    if (primaryInstrumentSelect) {
        settings.primaryInstrument = primaryInstrumentSelect.value;
    }
    
    if (lessonDaySelect) {
        settings.lessonDay = lessonDaySelect.value;
    }
    
    if (lessonTimeInput) {
        settings.lessonTime = lessonTimeInput.value;
    }
    
    // Update hidden categories as well
    updateHiddenCategoriesInSettings();
    
    settings.updatedAt = new Date().toISOString();
    
    // Save settings
    saveItem('SETTINGS', settings);
    
    // Refresh the timer page categories dropdown
    if (typeof window.updateTimerCategories === 'function') {
        window.updateTimerCategories();
    }
    
    // Show success state
    const submitButton = settingsForm.querySelector('button[type="submit"]');
    if (submitButton) {
        const originalText = submitButton.textContent;
        submitButton.classList.add('success');
        submitButton.textContent = 'Settings Saved!';
        
        setTimeout(() => {
            submitButton.classList.remove('success');
            submitButton.textContent = originalText;
        }, 2000);
    }
};

// Handle export data
const handleExportData = () => {
    console.log('Exporting data');
    
    const data = {
        version: 1,
        exportDate: new Date().toISOString(),
        sessions: getItems('SESSIONS'),
        goals: getItems('GOALS'),
        categories: getItems('CATEGORIES'),
        media: getItems('MEDIA'),
        settings: getItems('SETTINGS')[0] || {}
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

// Handle import data
const handleImportData = () => {
    console.log('Importing data');
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
                if (typeof window.importData === 'function') {
                    window.importData(data);
                    alert('Data imported successfully!');
                    location.reload();
                } else {
                    alert('Import function not available. Please refresh the page and try again.');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
};

// Add CSS styles programmatically
const addStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .add-category-form {
            display: flex;
            margin: 15px 0;
            gap: 10px;
        }
        .add-category-form input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        .category-actions {
            display: flex;
            gap: 8px;
        }
        .visibility-toggle, .delete-category {
            background: none;
            border: none;
            cursor: pointer;
            color: #666;
            padding: 5px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        .visibility-toggle:hover, .delete-category:hover {
            color: #000;
            background-color: #f0f0f0;
        }
        .visibility-toggle.hidden {
            color: #ccc;
        }
        
        /* New styles for show/hide buttons */
        .show-category-btn, .hide-category-btn {
            display: flex;
            align-items: center;
            gap: 5px;
            padding: 6px 10px;
            border-radius: 4px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .show-category-btn {
            background-color: #e6f7e6;
            color: #4caf50;
            border: 1px solid #4caf50;
        }
        
        .show-category-btn:hover {
            background-color: #4caf50;
            color: white;
        }
        
        .hide-category-btn {
            background-color: #ffeaea;
            color: #f44336;
            border: 1px solid #f44336;
        }
        
        .hide-category-btn:hover {
            background-color: #f44336;
            color: white;
        }
        
        /* Save Settings button */
        #settings-form button[type="submit"] {
            display: block;
            margin: 0.75rem 0 1.5rem 0;
            background: linear-gradient(to right, #3b7ff5, #2861c7);
            color: white;
            border: none;
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
            font-size: 1rem;
            min-width: 140px;
        }
        
        #settings-form button[type="submit"]:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        #settings-form button[type="submit"].success {
            background: linear-gradient(to right, #38b77c, #2a9062);
        }
        
        /* Styled delete button */
        .delete-category {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 36px;
            height: 36px;
            border-radius: 4px;
            background-color: #fff0f0;
            color: #f44336;
            border: 1px solid #f44336;
            margin-right: 8px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .delete-category:hover {
            background-color: #f44336;
            color: white;
        }
        
        .categories-header {
            margin-bottom: 15px;
        }
        .categories-header p {
            font-size: 0.9em;
            color: #666;
            margin-top: 5px;
        }
        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            border-bottom: 1px solid #eee;
        }
        .category-item:hover {
            background-color: #f9f9f9;
        }
        .default-badge, .hidden-badge {
            font-size: 0.7em;
            padding: 2px 5px;
            margin-left: 5px;
            border-radius: 4px;
        }
        .default-badge {
            background-color: #eee;
            color: #666;
        }
        .hidden-badge {
            background-color: #ffeeee;
            color: #cc5555;
        }
    `;
    document.head.appendChild(style);
};

// Expose to global scope
window.initializeSettings = initializeSettings;

// Update hidden categories in settings
const updateHiddenCategoriesInSettings = () => {
    // Get settings
    let settings = getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : { 
        id: 's-1',
        createdAt: new Date().toISOString()
    };
    
    // Get hidden category IDs
    const categories = getItems('CATEGORIES') || [];
    const hiddenCategoryIds = categories
        .filter(cat => cat.isHidden === true)
        .map(cat => cat.id);
    
    // Update settings
    settings.hiddenCategories = hiddenCategoryIds;
    settings.updatedAt = new Date().toISOString();
    
    // Save settings
    saveItem('SETTINGS', settings);
    
    console.log(`Updated settings with ${hiddenCategoryIds.length} hidden categories`);
};

// Handle clear instrument data
const handleClearInstrumentData = () => {
    // Get current instrument
    const currentInstrument = primaryInstrumentSelect ? primaryInstrumentSelect.value : '';
    
    if (!currentInstrument) {
        alert('Please select an instrument first');
        return;
    }
    
    if (confirm(`Are you sure you want to clear all data for ${currentInstrument}? This will remove all sessions, goals, media, and custom categories for this instrument. This cannot be undone.`)) {
        console.log(`Clearing data for instrument: ${currentInstrument}`);
        
        try {
            // Get all categories
            const categories = getItems('CATEGORIES');
            
            // Get default categories related to this instrument
            const instrumentDefaultCategories = categories.filter(cat => 
                cat.isDefault && cat.instrumentIds && cat.instrumentIds.includes(currentInstrument)
            ).map(cat => cat.id);
            
            // Get sessions related to the instrument categories
            const sessions = getItems('SESSIONS');
            const instrumentSessions = sessions.filter(session => 
                instrumentDefaultCategories.includes(session.categoryId)
            );
            
            // Identify custom categories used by this instrument's sessions
            // These are categories that are not default but are used in sessions with this instrument
            const customCategoryIds = new Set();
            const usedCategoryIds = new Set();
            
            // First, collect all categories used in sessions for this instrument
            instrumentSessions.forEach(session => {
                if (session.categoryId) {
                    usedCategoryIds.add(session.categoryId);
                }
            });
            
            // Then identify which of these are custom categories
            categories.forEach(cat => {
                if (!cat.isDefault && usedCategoryIds.has(cat.id)) {
                    customCategoryIds.add(cat.id);
                }
            });
            
            console.log(`Found ${customCategoryIds.size} custom categories used with ${currentInstrument}`);
            
            // Delete all custom categories for this instrument
            customCategoryIds.forEach(catId => {
                deleteItem('CATEGORIES', catId);
            });
            
            // Create a list of all categories to filter out content (default + custom)
            const allInstrumentCategoryIds = [...instrumentDefaultCategories, ...customCategoryIds];
            
            // Filter out sessions for this instrument's categories
            const remainingSessions = sessions.filter(session => 
                !allInstrumentCategoryIds.includes(session.categoryId)
            );
            localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(remainingSessions));
            console.log(`Removed ${sessions.length - remainingSessions.length} sessions related to ${currentInstrument}`);
            
            // Filter out goals for this instrument's categories
            const goals = getItems('GOALS');
            const remainingGoals = goals.filter(goal => 
                !allInstrumentCategoryIds.includes(goal.categoryId)
            );
            localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(remainingGoals));
            console.log(`Removed ${goals.length - remainingGoals.length} goals related to ${currentInstrument}`);
            
            // Filter out media for this instrument's categories
            const media = getItems('MEDIA');
            const remainingMedia = media.filter(item => {
                // If the media item has a sessionId, check if that session had a category related to this instrument
                if (item.sessionId) {
                    const session = getItemById('SESSIONS', item.sessionId);
                    return !session || !allInstrumentCategoryIds.includes(session.categoryId);
                }
                // If media has direct categoryId, check against that
                if (item.categoryId) {
                    return !allInstrumentCategoryIds.includes(item.categoryId);
                }
                // If no way to relate to instrument, keep it
                return true;
            });
            localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(remainingMedia));
            console.log(`Removed ${media.length - remainingMedia.length} media items related to ${currentInstrument}`);
            
            // Reset default categories for this instrument to visible
            const defaultInstCategories = categories.filter(cat => 
                cat.isDefault && cat.instrumentIds && cat.instrumentIds.includes(currentInstrument)
            );
            
            defaultInstCategories.forEach(cat => {
                cat.isHidden = false;
                saveItem('CATEGORIES', cat);
            });
            
            // Update settings for this instrument to defaults
            let settings = getItems('SETTINGS');
            if (settings.length > 0) {
                settings = settings[0];
                // Only reset instrument-specific settings if this is the current instrument
                if (settings.primaryInstrument === currentInstrument) {
                    settings.lessonDay = '';
                    settings.lessonTime = '';
                    settings.updatedAt = new Date().toISOString();
                    saveItem('SETTINGS', settings);
                }
            }
            
            // Update UI
            loadSettings();
            setupCategoryManager();
            
            // Reload relevant data in other tabs
            if (typeof window.updateTimerCategories === 'function') {
                window.updateTimerCategories();
            }
            if (typeof window.loadSessions === 'function') {
                window.loadSessions();
            }
            if (typeof window.loadGoals === 'function') {
                window.loadGoals();
            }
            if (typeof window.loadMedia === 'function') {
                window.loadMedia();
            }
            
            // Show success message
            alert(`Data for ${currentInstrument} has been cleared successfully`);
        } catch (error) {
            console.error('Error clearing instrument data:', error);
            alert('An error occurred while clearing data');
        }
    }
};

// Handle clear all data
const handleClearAllData = () => {
    if (confirm('Are you sure you want to clear ALL data? This will delete all sessions, goals, and media. This cannot be undone.')) {
        console.log('Clearing all application data');
        
        try {
            // Clear all storage keys
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            
            // Reinitialize with defaults
            initializeData();
            
            // Reload page to reset UI
            alert('All data has been cleared successfully. The page will now reload.');
            location.reload();
        } catch (error) {
            console.error('Error clearing all data:', error);
            alert('An error occurred while clearing data');
        }
    }
};

// Expose functions to window object
window.initializeSettings = initializeSettings;
window.loadSettings = loadSettings;
window.setupCategoryManager = setupCategoryManager;
window.resetCategories = resetCategories;
window.showCategory = showCategory;
window.hideCategory = hideCategory;
window.updateHiddenCategoriesInSettings = updateHiddenCategoriesInSettings; 