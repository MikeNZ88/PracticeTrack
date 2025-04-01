// DOM Elements
const settingsForm = document.getElementById('settings-form');
const primaryInstrumentSelect = document.getElementById('primary-instrument');
const lessonDaySelect = document.getElementById('lesson-day');
const lessonTimeInput = document.getElementById('lesson-time');
const categoriesList = document.getElementById('categories-list');
const themeButtons = document.querySelectorAll('.theme-button');
const exportDataBtn = document.getElementById('export-data');
const importDataBtn = document.getElementById('import-data');

// Initialize settings page
const initializeSettings = () => {
    console.log('Initializing settings page');
    loadSettings();
    setupThemeButtons();
    setupCategoryManager();
    
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
};

// Load settings
const loadSettings = () => {
    const settings = getItems('SETTINGS')[0] || {};
    console.log('Loading settings:', settings);
    
    // Populate instrument select
    populateInstrumentsDropdown(settings.primaryInstrument);
    
    // Populate lesson day select
    populateLessonDayDropdown(settings.lessonDay);
    
    // Set lesson time
    if (lessonTimeInput) {
        lessonTimeInput.value = settings.lessonTime || '';
    }
    
    // Set theme
    if (themeButtons) {
        themeButtons.forEach(button => {
            button.classList.toggle('active', button.dataset.theme === settings.theme);
        });
    }
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Setup category manager
const setupCategoryManager = () => {
    if (!categoriesList) return;
    
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

// Ensure default categories exist
const ensureDefaultCategories = () => {
    const defaultCategoryIds = ['c-1', 'c-2', 'c-3', 'c-4', 'c-5'];
    const defaultCategoryNames = ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory'];
    
    const existingCategories = getItems('CATEGORIES') || [];
    const existingIds = existingCategories.map(cat => cat.id);
    
    // Check each default category
    defaultCategoryIds.forEach((id, index) => {
        if (!existingIds.includes(id)) {
            // This default category is missing, create it
            const newCategory = {
                id: id,
                name: defaultCategoryNames[index],
                isHidden: false,
                isDefault: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Save the new category
            saveItem('CATEGORIES', newCategory);
            console.log(`Created missing default category: ${defaultCategoryNames[index]}`);
        }
    });
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
        isHidden: false, // Explicitly set to false, not undefined
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
    lessonDaySelect.innerHTML = '<option value="-1">No Lesson Day</option>';
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
    
    // Get categories container or create it
    let categoriesContainer = document.querySelector('.categories-container');
    if (!categoriesContainer) {
        categoriesContainer = document.createElement('div');
        categoriesContainer.className = 'categories-container';
        categoriesList.appendChild(categoriesContainer);
    } else {
        categoriesContainer.innerHTML = '';
    }
    
    // Get ALL categories regardless of hidden status
    const categories = getItems('CATEGORIES') || [];
    console.log('Categories found:', categories.length);
    
    // Fix any potentially corrupted isHidden values (convert undefined/null to false)
    categories.forEach(cat => {
        if (cat.isHidden !== true) {
            cat.isHidden = false;
        }
    });
    
    // Check for each category if it's a default
    const defaultCategoryIds = ['c-1', 'c-2', 'c-3', 'c-4', 'c-5'];
    
    // Group categories
    const customVisible = [];
    const customHidden = [];
    const defaultVisible = [];
    const defaultHidden = [];
    
    // Categorize items
    categories.forEach(category => {
        const isDefault = defaultCategoryIds.includes(category.id);
        const isHidden = category.isHidden === true;
        
        // Add to the appropriate array
        if (isDefault) {
            if (isHidden) {
                defaultHidden.push(category);
            } else {
                defaultVisible.push(category);
            }
        } else {
            if (isHidden) {
                customHidden.push(category);
            } else {
                customVisible.push(category);
            }
        }
    });
    
    // Sort each group alphabetically
    const sortByName = (a, b) => a.name.localeCompare(b.name);
    customVisible.sort(sortByName);
    customHidden.sort(sortByName);
    defaultVisible.sort(sortByName);
    defaultHidden.sort(sortByName);
    
    // Order: 1) custom visible 2) default visible 3) custom hidden 4) default hidden
    const orderedCategories = [
        ...customVisible,
        ...defaultVisible,
        ...customHidden,
        ...defaultHidden
    ];
    
    // Display all categories
    orderedCategories.forEach(category => {
        const isDefault = defaultCategoryIds.includes(category.id);
        const isHidden = category.isHidden === true;
        
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <span class="category-name">
                ${category.name}
                ${isDefault ? '<span class="default-badge">Default</span>' : ''}
                ${isHidden ? '<span class="hidden-badge">Hidden</span>' : ''}
            </span>
            <div class="category-actions">
                <button type="button" class="visibility-toggle ${isHidden ? 'hidden' : ''}" 
                        data-id="${category.id}" data-hidden="${isHidden}">
                    <i data-lucide="${isHidden ? 'eye-off' : 'eye'}"></i>
                </button>
                ${!isDefault ? `
                <button type="button" class="delete-category" data-id="${category.id}">
                    <i data-lucide="trash-2"></i>
                </button>
                ` : ''}
            </div>
        `;
        categoriesContainer.appendChild(div);
        
        // Add event listener for visibility toggle
        const toggle = div.querySelector('.visibility-toggle');
        if (toggle) {
            toggle.addEventListener('click', () => toggleCategoryVisibility(category.id));
        }
        
        // Add event listener for delete button (only for non-default categories)
        if (!isDefault) {
            const deleteBtn = div.querySelector('.delete-category');
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteCategory(category.id));
            }
        }
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Delete a category (non-default only)
const deleteCategory = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This cannot be undone.')) {
        deleteItem('CATEGORIES', categoryId);
        populateCategoriesList();
    }
};

// Setup theme buttons
const setupThemeButtons = () => {
    if (!themeButtons) return;
    
    themeButtons.forEach(button => {
        button.addEventListener('click', () => {
            themeButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Apply theme immediately
            document.body.dataset.theme = button.dataset.theme;
        });
    });
};

// Toggle category visibility
const toggleCategoryVisibility = (categoryId) => {
    console.log(`Toggling visibility for category ${categoryId}`);
    
    // Get the category
    const category = getItemById('CATEGORIES', categoryId);
    if (!category) {
        console.error(`Category not found: ${categoryId}`);
        return;
    }
    
    // Get current state and toggle it - explicitly check for true/false
    const isCurrentlyHidden = category.isHidden === true;
    console.log(`Category "${category.name}" is currently ${isCurrentlyHidden ? 'hidden' : 'visible'}`);
    
    // Toggle the isHidden property with explicit boolean
    category.isHidden = isCurrentlyHidden ? false : true;
    console.log(`Setting category "${category.name}" to ${category.isHidden ? 'hidden' : 'visible'}`);
    
    // Save the updated category
    saveItem('CATEGORIES', category);
    
    // Also update settings with hidden categories
    updateHiddenCategoriesInSettings();
    
    // Refresh the categories display
    populateCategoriesList();
};

// Update hidden categories in settings
const updateHiddenCategoriesInSettings = () => {
    const settings = getItems('SETTINGS')[0] || {};
    const categories = getItems('CATEGORIES') || [];
    
    // Get IDs of hidden categories
    const hiddenCategoryIds = categories
        .filter(cat => cat.isHidden === true)
        .map(cat => cat.id);
    
    console.log(`Found ${hiddenCategoryIds.length} hidden categories to save in settings`);
    settings.hiddenCategories = hiddenCategoryIds;
    settings.updatedAt = new Date().toISOString();
    
    // Save settings
    saveItem('SETTINGS', settings);
};

// Handle settings form submission
const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Settings form submitted');
    
    const settings = getItems('SETTINGS')[0] || {};
    
    // Update basic settings
    if (primaryInstrumentSelect) {
        settings.primaryInstrument = primaryInstrumentSelect.value;
    }
    
    if (lessonDaySelect) {
        settings.lessonDay = parseInt(lessonDaySelect.value);
    }
    
    if (lessonTimeInput) {
        settings.lessonTime = lessonTimeInput.value;
    }
    
    // Get theme
    const activeThemeButton = document.querySelector('.theme-button.active');
    if (activeThemeButton) {
        settings.theme = activeThemeButton.dataset.theme;
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
        settings: getItems('SETTINGS')[0]
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
                importData(data);
                alert('Data imported successfully!');
                location.reload();
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
        }
        .visibility-toggle:hover, .delete-category:hover {
            color: #000;
        }
        .visibility-toggle.hidden {
            color: #ccc;
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
            padding: 8px 0;
            border-bottom: 1px solid #eee;
        }
        .default-badge, .hidden-badge {
            font-size: 0.7em;
            padding: 2px 5px;
            margin-left: 5px;
            border-radius: 4px;
        }
        .default-badge {
            background-color: #eee;
        }
        .hidden-badge {
            background-color: #ffeeee;
            color: #cc5555;
        }
        .success {
            background-color: #4caf50 !important;
            color: white !important;
        }
        @keyframes pulse {
            0% { box-shadow: 0 0 0 0 rgba(65, 84, 179, 0.4); }
            70% { box-shadow: 0 0 0 10px rgba(65, 84, 179, 0); }
            100% { box-shadow: 0 0 0 0 rgba(65, 84, 179, 0); }
        }
    `;
    document.head.appendChild(style);
};

// Call this on initialization
document.addEventListener('DOMContentLoaded', addStyles);

// Expose to global scope
window.initializeSettings = initializeSettings; 