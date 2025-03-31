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
    
    // Display categories
    populateCategoriesList();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
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
    
    // Create new category
    const newCategory = {
        id: 'c-' + Date.now(),
        name: categoryName,
        isHidden: false,
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save category
    saveItem('CATEGORIES', newCategory);
    
    // Clear input
    newCategoryInput.value = '';
    
    // Refresh categories list
    populateCategoriesList();
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
    
    const categories = getItems('CATEGORIES') || [];
    
    // Check if each category is a default category
    const defaultCategoryIds = ['c-1', 'c-2', 'c-3', 'c-4', 'c-5'];
    categories.forEach(category => {
        const isDefault = defaultCategoryIds.includes(category.id);
        
        const div = document.createElement('div');
        div.className = 'category-item';
        div.innerHTML = `
            <span class="category-name">
                ${category.name}
                ${isDefault ? '<span class="default-badge">Default</span>' : ''}
            </span>
            <div class="category-actions">
                <button type="button" class="visibility-toggle ${category.isHidden ? 'hidden' : ''}" 
                        data-id="${category.id}" data-hidden="${category.isHidden}">
                    <i data-lucide="${category.isHidden ? 'eye-off' : 'eye'}"></i>
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
    
    // Add some basic styling for category items
    const categoryItems = document.querySelectorAll('.category-item');
    categoryItems.forEach(item => {
        item.style.display = 'flex';
        item.style.justifyContent = 'space-between';
        item.style.alignItems = 'center';
        item.style.padding = '8px 0';
        item.style.borderBottom = '1px solid #eee';
    });
    
    // Style the default badge
    const defaultBadges = document.querySelectorAll('.default-badge');
    defaultBadges.forEach(badge => {
        badge.style.fontSize = '0.7em';
        badge.style.padding = '2px 5px';
        badge.style.marginLeft = '5px';
        badge.style.backgroundColor = '#eee';
        badge.style.borderRadius = '4px';
    });
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
    const category = getItemById('CATEGORIES', categoryId);
    if (!category) return;
    
    category.isHidden = !category.isHidden;
    saveItem('CATEGORIES', category);
    
    // Update UI
    const toggle = document.querySelector(`.visibility-toggle[data-id="${categoryId}"]`);
    if (toggle) {
        toggle.dataset.hidden = category.isHidden;
        toggle.classList.toggle('hidden', category.isHidden);
        toggle.innerHTML = `<i data-lucide="${category.isHidden ? 'eye-off' : 'eye'}"></i>`;
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
    }
};

// Handle settings form submission
const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Settings form submitted');
    
    const settings = getItems('SETTINGS')[0] || {};
    
    // Update settings
    if (primaryInstrumentSelect) {
        settings.primaryInstrument = primaryInstrumentSelect.value;
    }
    
    if (lessonDaySelect) {
        settings.lessonDay = parseInt(lessonDaySelect.value);
    }
    
    if (lessonTimeInput) {
        settings.lessonTime = lessonTimeInput.value;
    }
    
    // Get hidden categories
    settings.hiddenCategories = Array.from(document.querySelectorAll('.visibility-toggle[data-hidden="true"]'))
        .map(toggle => toggle.dataset.id);
    
    // Get theme
    const activeThemeButton = document.querySelector('.theme-button.active');
    if (activeThemeButton) {
        settings.theme = activeThemeButton.dataset.theme;
    }
    
    settings.updatedAt = new Date().toISOString();
    
    // Save settings
    saveItem('SETTINGS', settings);
    
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
    `;
    document.head.appendChild(style);
};

// Call this on initialization
document.addEventListener('DOMContentLoaded', addStyles);

// Expose to global scope
window.initializeSettings = initializeSettings; 