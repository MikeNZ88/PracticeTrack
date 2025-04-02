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
        
        // Validate required elements
        if (!categoriesList || !newCategoryInput || !addCategoryBtn) {
            console.error('Required DOM elements not found:', {
                categoriesList: !!categoriesList,
                newCategoryInput: !!newCategoryInput,
                addCategoryBtn: !!addCategoryBtn
            });
            alert('Some required elements were not found. Please refresh the page.');
            return;
        }
        
        // First, clean up any corrupted data
        cleanupStorage();
        
        // Then load settings and set up UI
        loadSettings();
        setupEventListeners();
        loadCategories();
        addStyles();
        
        // Initialize default categories if none exist
        initializeDefaultCategories();
        
        console.log('Settings page initialized successfully');
    } catch (error) {
        console.error('Error initializing settings:', error);
        alert('Error initializing settings. Please refresh the page.');
    }
};

// Setup event listeners
const setupEventListeners = () => {
    try {
        console.log('Setting up event listeners');
        
        // Listen for categories updates from other modules
        document.addEventListener('categoriesUpdated', (event) => {
            console.log('Categories updated from another module');
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
                e.preventDefault();
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
        
        // Save lesson settings button
        const saveLessonSettingsBtn = document.getElementById('save-lesson-settings');
        if (saveLessonSettingsBtn) {
            console.log('Setting up save lesson settings button listener');
            saveLessonSettingsBtn.addEventListener('click', handleSettingsSubmit);
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
        
        let settings = settingsStr ? JSON.parse(settingsStr) : [{
            id: 's-1',
            lessonDay: '',
            lessonTime: '',
            theme: 'light',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }];
        
        console.log('Parsed settings:', settings[0]);
        
        // Populate lesson day dropdown
        if (lessonDaySelect) {
            console.log('Setting lesson day to:', settings[0].lessonDay);
            lessonDaySelect.value = settings[0].lessonDay;
        }
        
        // Set lesson time
        if (lessonTimeInput) {
            console.log('Setting lesson time to:', settings[0].lessonTime);
            lessonTimeInput.value = settings[0].lessonTime || '';
        }
    } catch (error) {
        console.error('Error loading settings:', error);
    }
};

// Populate lesson day dropdown
const populateLessonDayDropdown = (selectedDay) => {
    if (!lessonDaySelect) return;
    
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    lessonDaySelect.innerHTML = '<option value="">Select Day</option>';
    
    days.forEach(day => {
        const option = document.createElement('option');
        option.value = day;
        option.textContent = day;
        option.selected = day === selectedDay;
        lessonDaySelect.appendChild(option);
    });
};

// Notify application that categories have changed
const notifyCategoriesChanged = () => {
    try {
        console.log('Notifying application that categories have changed');
        // Dispatch a custom event that other modules can listen for
        const event = new CustomEvent('categoriesChanged', {
            detail: { timestamp: new Date().toISOString() }
        });
        document.dispatchEvent(event);
        
        // Also update any global handler if it exists
        if (typeof window.updateCategoryDropdowns === 'function') {
            console.log('Calling global updateCategoryDropdowns function');
            window.updateCategoryDropdowns();
        }
    } catch (error) {
        console.error('Error notifying categories changed:', error);
    }
};

// Handle adding a new category
function handleAddCategory() {
    console.log('Adding new category');
    
    if (!newCategoryInput || !newCategoryInput.value.trim()) {
        alert('Please enter a category name');
        return;
    }
    
    try {
        const newCategoryName = newCategoryInput.value.trim();
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        
        // Check if category already exists
        const exists = categories.some(cat => cat.name.toLowerCase() === newCategoryName.toLowerCase());
        if (exists) {
            alert(`Category "${newCategoryName}" already exists`);
            return;
        }
        
        // Add the new category
        const newCategory = {
            id: `category_${Date.now()}`,
            name: newCategoryName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            custom: true
        };
        
        categories.push(newCategory);
        localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
        
        // Clear input
        newCategoryInput.value = '';
        
        // Reload categories
        loadCategories();
        
        // Notify other modules
        console.log('Dispatching categoriesChanged event');
        document.dispatchEvent(new Event('categoriesChanged'));
        
        // Also call the global update function if available
        if (typeof window.updateCategoryDropdowns === 'function') {
            window.updateCategoryDropdowns();
        }
        
        alert('Category added successfully');
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category');
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
        
        // Notify other modules
        console.log('Dispatching categoriesChanged event');
        document.dispatchEvent(new Event('categoriesChanged'));
        
        // Also call the global update function if available
        if (typeof window.updateCategoryDropdowns === 'function') {
            window.updateCategoryDropdowns();
        }
        
        alert('Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
    }
}

// Load categories
function loadCategories() {
    console.log('Loading categories in settings');
    
    if (!categoriesList) {
        console.error('Category list container not found');
        return;
    }
    
    try {
        // Get categories from localStorage
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        console.log('Retrieved categories:', categories);
        
        // Clear list
        categoriesList.innerHTML = '';
        
        if (categories.length === 0) {
            categoriesList.innerHTML = '<p class="no-categories">No categories added yet</p>';
            return;
        }
        
        // Group categories
        const customCategories = categories.filter(cat => cat.custom);
        const defaultCategories = categories.filter(cat => !cat.custom);
        
        // Add default categories section if any exist
        if (defaultCategories.length > 0) {
            const header = document.createElement('h3');
            header.textContent = 'Default Categories';
            header.className = 'category-group-header';
            categoriesList.appendChild(header);
            
            defaultCategories.forEach(category => {
                const item = document.createElement('div');
                item.className = 'category-item';
                item.innerHTML = `
                    <span class="category-name">${category.name}</span>
                    <span class="category-actions">
                        <button class="delete-btn" data-id="${category.id}">Delete</button>
                    </span>
                `;
                categoriesList.appendChild(item);
                
                // Add delete handler
                const deleteBtn = item.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => handleDeleteCategory(category.id));
                }
            });
        }
        
        // Add custom categories section if any exist
        if (customCategories.length > 0) {
            const header = document.createElement('h3');
            header.textContent = 'Custom Categories';
            header.className = 'category-group-header';
            categoriesList.appendChild(header);
            
            customCategories.forEach(category => {
                const item = document.createElement('div');
                item.className = 'category-item';
                item.innerHTML = `
                    <span class="category-name">${category.name}</span>
                    <span class="category-actions">
                        <button class="delete-btn" data-id="${category.id}">Delete</button>
                    </span>
                `;
                categoriesList.appendChild(item);
                
                // Add delete handler
                const deleteBtn = item.querySelector('.delete-btn');
                if (deleteBtn) {
                    deleteBtn.addEventListener('click', () => handleDeleteCategory(category.id));
                }
            });
        }
    } catch (error) {
        console.error('Error loading categories:', error);
        categoriesList.innerHTML = '<p class="error">Error loading categories</p>';
    }
}

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
        
        let settings = settingsStr ? JSON.parse(settingsStr) : [{
            id: 's-1',
            lessonDay: '',
            lessonTime: '',
            theme: 'light',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }];
        
        // Get new values
        const newLessonDay = lessonDaySelect.value;
        const newLessonTime = lessonTimeInput.value;
        
        console.log('New values to save:', { newLessonDay, newLessonTime });
        
        // Update settings
        settings[0].lessonDay = newLessonDay;
        settings[0].lessonTime = newLessonTime;
        settings[0].updatedAt = new Date().toISOString();
        
        // Save to localStorage
        localStorage.setItem('practiceTrack_settings', JSON.stringify(settings));
        
        // Verify save
        const savedSettings = JSON.parse(localStorage.getItem('practiceTrack_settings'));
        console.log('Verified saved settings:', savedSettings[0]);
        
        if (savedSettings[0].lessonDay === newLessonDay && savedSettings[0].lessonTime === newLessonTime) {
            // Dispatch event
            const event = new CustomEvent('settingsUpdated', {
                detail: { settings: settings[0] }
            });
            document.dispatchEvent(event);
            
            showMessage('Settings saved successfully', 'success');
        } else {
            throw new Error('Settings verification failed');
        }
    } catch (error) {
        console.error('Error saving settings:', error);
        showMessage('Error saving settings: ' + error.message, 'error');
    }
};

// Show message notification
const showMessage = (message, type = 'success') => {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.classList.add('message-hide');
        setTimeout(() => messageElement.remove(), 300);
    }, 3000);
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
                
                // Import data
                window.saveItems('SETTINGS', data.settings);
                window.saveItems('CATEGORIES', data.categories);
                if (data.sessions) window.saveItems('SESSIONS', data.sessions);
                if (data.goals) window.saveItems('GOALS', data.goals);
                if (data.media) window.saveItems('MEDIA', data.media);
                
                // Reload settings
                loadSettings();
                loadCategories();
                
                alert('Data imported successfully');
            } catch (error) {
                console.error('Error importing data:', error);
                alert('Error importing data. Please check the file format.');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
};

// Handle clearing all data
const handleClearAllData = () => {
    if (!confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) return;
    
    try {
        // Clear all data from localStorage
        localStorage.removeItem('practiceTrack_settings');
        localStorage.removeItem('practiceTrack_categories');
        localStorage.removeItem('practiceTrack_sessions');
        localStorage.removeItem('practiceTrack_goals');
        localStorage.removeItem('practiceTrack_media');
        localStorage.removeItem('practiceTrack_timer');
        
        // Reset settings to default
        localStorage.setItem('practiceTrack_settings', JSON.stringify([{
            id: 's-1',
            lessonDay: '',
            lessonTime: '',
            theme: 'light',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }]));
        
        // Reset UI
        loadSettings();
        loadCategories();
        
        // Show success message
        alert('All data cleared successfully');
        
        // Reload the page to ensure all data is refreshed
        window.location.reload();
    } catch (error) {
        console.error('Error clearing data:', error);
        alert('Error clearing data. Please try again.');
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
            background: #f5f5f5;
            border-radius: 4px;
            font-size: 0.95rem;
        }
        
        .category-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .edit-category,
        .delete-category {
            background: none;
            border: none;
            cursor: pointer;
            font-size: 1rem;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            transition: background 0.2s;
        }
        
        .edit-category:hover {
            background: #e3f2fd;
            color: #1976d2;
        }
        
        .delete-category:hover {
            background: #ffebee;
            color: #d32f2f;
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
    styleSheet.textContent = styles;
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