// DOM Elements
const settingsForm = document.getElementById('settings-form');
const instrumentSelect = document.getElementById('instrument-select');
const selectedInstrumentsContainer = document.querySelector('.selected-instruments');
const categoriesList = document.getElementById('categories-list');
const addDefaultCategoriesBtn = document.getElementById('add-default-categories');
const newCategoryInput = document.getElementById('new-category-name');
const addCategoryBtn = document.getElementById('add-category-btn');
const exportDataBtn = document.getElementById('export-data');
const importDataBtn = document.getElementById('import-data');

// Available instruments
const AVAILABLE_INSTRUMENTS = [
    'piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 
    'clarinet', 'trumpet', 'bass', 'cello', 'saxophone'
];

// Default categories per instrument
const DEFAULT_CATEGORIES = {
    piano: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training', 'Improvisation'],
    guitar: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training', 'Improvisation'],
    violin: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training'],
    drums: ['Technique', 'Repertoire', 'Theory', 'Ear Training', 'Improvisation'],
    voice: ['Technique', 'Repertoire', 'Theory', 'Ear Training'],
    flute: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training'],
    clarinet: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training'],
    trumpet: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training', 'Improvisation'],
    bass: ['Scales', 'Technique', 'Repertoire', 'Theory', 'Ear Training', 'Improvisation'],
    cello: ['Scales', 'Technique', 'Repertoire', 'Sight Reading', 'Theory', 'Ear Training'],
    saxophone: ['Scales', 'Technique', 'Repertoire', 'Theory', 'Ear Training', 'Improvisation']
};

// Cleanup any corrupted data
const cleanupStorage = () => {
    console.log('Running storage cleanup...');
    
    try {
        // Check categories
        let categories = window.getItems('CATEGORIES') || [];
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
        let settings = window.getItems('SETTINGS');
        if (settings.length === 0) {
            console.log('No settings found, will create defaults');
            window.saveItems('SETTINGS', [{
                id: 's-1',
                primaryInstrument: '',
                lessonDay: '',
                lessonTime: '',
                hiddenCategories: [],
                theme: 'light',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]);
        } else {
            settings = settings[0];
            if (!settings.hasOwnProperty('hiddenCategories')) {
                settings.hiddenCategories = [];
                window.saveItems('SETTINGS', [settings]);
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
    setupInstrumentManager();
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
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {
        id: 's-1',
        instruments: [],
        lessonDay: '',
        lessonTime: '',
        theme: 'light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    console.log('Loading settings:', settings);
    
    // Populate instruments
    populateInstrumentsDropdown(settings.instruments || []);
    
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

// Setup instrument manager
const setupInstrumentManager = () => {
    if (!instrumentSelect) return;
    
    // Populate instrument dropdown with available instruments
    AVAILABLE_INSTRUMENTS.forEach(instrument => {
        const option = document.createElement('option');
        option.value = instrument;
        option.textContent = instrument.charAt(0).toUpperCase() + instrument.slice(1);
        instrumentSelect.appendChild(option);
    });
    
    // Add change handler for instrument selection
    instrumentSelect.addEventListener('change', handleInstrumentSelect);
};

// Handle instrument selection
const handleInstrumentSelect = (e) => {
    const selectedInstrument = e.target.value;
    if (!selectedInstrument) return;
    
    // Get current settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const instruments = settings.instruments || [];
    
    // Check if already selected
    if (instruments.includes(selectedInstrument)) {
        alert('This instrument is already selected');
        return;
    }
    
    // Check if max instruments reached
    if (instruments.length >= 3) {
        alert('You can only select up to 3 instruments');
        return;
    }
    
    // Add instrument
    instruments.push(selectedInstrument);
    settings.instruments = instruments;
    window.saveItems('SETTINGS', [settings]);
    
    // Update UI
    updateSelectedInstruments(instruments);
    populateInstrumentsDropdown(instruments);
    
    // Reset select
    instrumentSelect.value = '';
};

// Update selected instruments display
const updateSelectedInstruments = (instruments) => {
    if (!selectedInstrumentsContainer) return;
    
    selectedInstrumentsContainer.innerHTML = instruments.map(instrument => `
        <div class="selected-instrument">
            <span>${instrument.charAt(0).toUpperCase() + instrument.slice(1)}</span>
            <button type="button" class="remove-instrument" data-instrument="${instrument}">
                <i data-lucide="x"></i>
            </button>
        </div>
    `).join('');
    
    // Add remove handlers
    selectedInstrumentsContainer.querySelectorAll('.remove-instrument').forEach(btn => {
        btn.addEventListener('click', () => removeInstrument(btn.dataset.instrument));
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Remove instrument
const removeInstrument = (instrument) => {
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const instruments = settings.instruments || [];
    
    // Remove instrument
    settings.instruments = instruments.filter(i => i !== instrument);
    window.saveItems('SETTINGS', [settings]);
    
    // Update UI
    updateSelectedInstruments(settings.instruments);
    populateInstrumentsDropdown(settings.instruments);
};

// Populate instruments dropdown
const populateInstrumentsDropdown = (selectedInstruments) => {
    if (!instrumentSelect) return;
    
    // Clear existing options except the first one
    while (instrumentSelect.options.length > 1) {
        instrumentSelect.remove(1);
    }
    
    // Add available instruments that aren't selected
    AVAILABLE_INSTRUMENTS.forEach(instrument => {
        if (!selectedInstruments.includes(instrument)) {
            const option = document.createElement('option');
            option.value = instrument;
            option.textContent = instrument.charAt(0).toUpperCase() + instrument.slice(1);
            instrumentSelect.appendChild(option);
        }
    });
};

// Setup category manager
const setupCategoryManager = () => {
    if (!categoriesList) {
        console.error('Categories list element not found');
        return;
    }
    
    // Add event listener for add default categories button
    if (addDefaultCategoriesBtn) {
        addDefaultCategoriesBtn.addEventListener('click', addDefaultCategories);
    }
    
    // Add event listener for add category button
    if (addCategoryBtn) {
        addCategoryBtn.addEventListener('click', addNewCategory);
    }
    
    // Display categories
    populateCategoriesList();
};

// Add default categories
const addDefaultCategories = () => {
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const instruments = settings.instruments || [];
    
    if (instruments.length === 0) {
        alert('Please select at least one instrument first');
        return;
    }
    
    // Get existing categories
    let categories = window.getItems('CATEGORIES') || [];
    const existingIds = new Set(categories.map(cat => cat.id));
    
    // Add default categories for each instrument
    instruments.forEach(instrument => {
        const defaultCats = DEFAULT_CATEGORIES[instrument] || [];
        defaultCats.forEach(catName => {
            const id = `c-${instrument}-${catName.toLowerCase().replace(/\s+/g, '-')}`;
            if (!existingIds.has(id)) {
                categories.push({
                    id,
                    name: `${instrument.charAt(0).toUpperCase() + instrument.slice(1)} - ${catName}`,
                    instrument,
                    isDefault: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                existingIds.add(id);
            }
        });
    });
    
    // Save categories
    window.saveItems('CATEGORIES', categories);
    
    // Update UI
    populateCategoriesList();
};

// Add new category
const addNewCategory = () => {
    if (!newCategoryInput) return;
    
    const categoryName = newCategoryInput.value.trim();
    if (!categoryName) {
        alert('Please enter a category name');
        return;
    }
    
    // Get current instrument
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const instruments = settings.instruments || [];
    
    if (instruments.length === 0) {
        alert('Please select at least one instrument first');
        return;
    }
    
    // Create new category
    const newCategory = {
        id: `c-custom-${Date.now()}`,
        name: categoryName,
        instrument: instruments[0], // Use first instrument for custom categories
        isDefault: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    
    // Save category
    window.saveItems('CATEGORIES', newCategory);
    
    // Clear input
    newCategoryInput.value = '';
    
    // Update UI
    populateCategoriesList();
};

// Populate categories list
const populateCategoriesList = () => {
    if (!categoriesList) return;
    
    // Get categories
    const categories = window.getItems('CATEGORIES') || [];
    
    // Sort categories by instrument and name
    categories.sort((a, b) => {
        if (a.instrument !== b.instrument) {
            return a.instrument.localeCompare(b.instrument);
        }
        return a.name.localeCompare(b.name);
    });
    
    // Group categories by instrument
    const groupedCategories = categories.reduce((acc, cat) => {
        if (!acc[cat.instrument]) {
            acc[cat.instrument] = [];
        }
        acc[cat.instrument].push(cat);
        return acc;
    }, {});
    
    // Create HTML
    let html = '';
    Object.entries(groupedCategories).forEach(([instrument, cats]) => {
        html += `
            <div class="instrument-categories">
                <h4>${instrument.charAt(0).toUpperCase() + instrument.slice(1)}</h4>
                ${cats.map(cat => `
                    <div class="category-item">
                        <span class="category-name">${cat.name}</span>
                        ${!cat.isDefault ? `
                            <button type="button" class="delete-category" data-id="${cat.id}">
                                <i data-lucide="trash-2"></i>
                            </button>
                        ` : ''}
                    </div>
                `).join('')}
            </div>
        `;
    });
    
    // Update UI
    categoriesList.innerHTML = html;
    
    // Add delete handlers
    categoriesList.querySelectorAll('.delete-category').forEach(btn => {
        btn.addEventListener('click', () => deleteCategory(btn.dataset.id));
    });
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Delete category
const deleteCategory = (categoryId) => {
    if (confirm('Are you sure you want to delete this category? This cannot be undone.')) {
        window.deleteItem('CATEGORIES', categoryId);
        populateCategoriesList();
    }
};

// Handle settings form submission
const handleSettingsSubmit = (e) => {
    e.preventDefault();
    console.log('Settings form submitted');
    
    // Get settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {
        id: 's-1',
        createdAt: new Date().toISOString()
    };
    
    // Update settings
    if (lessonDaySelect) {
        settings.lessonDay = lessonDaySelect.value;
    }
    
    if (lessonTimeInput) {
        settings.lessonTime = lessonTimeInput.value;
    }
    
    settings.updatedAt = new Date().toISOString();
    
    // Save settings
    const saved = window.saveItems('SETTINGS', [settings]);
    
    if (!saved) {
        console.error('Failed to save settings');
        alert('Failed to save settings. Please try again.');
        return;
    }
    
    console.log('Settings saved successfully:', settings);
    
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
        sessions: window.getItems('SESSIONS'),
        goals: window.getItems('GOALS'),
        categories: window.getItems('CATEGORIES'),
        media: window.getItems('MEDIA'),
        settings: window.getItems('SETTINGS')[0] || {}
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
        .instruments-container {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }
        
        .selected-instruments {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .selected-instrument {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            background-color: #f0f0f0;
            border-radius: 4px;
            font-size: 0.9em;
        }
        
        .remove-instrument {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 2px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .remove-instrument:hover {
            color: #f44336;
            background-color: #fff0f0;
        }
        
        .instrument-categories {
            margin-bottom: 20px;
        }
        
        .instrument-categories h4 {
            margin: 0 0 10px 0;
            color: #666;
            font-size: 0.9em;
        }
        
        .category-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 12px;
            background-color: #f9f9f9;
            border-radius: 4px;
            margin-bottom: 8px;
        }
        
        .category-item:hover {
            background-color: #f0f0f0;
        }
        
        .delete-category {
            background: none;
            border: none;
            color: #666;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .delete-category:hover {
            color: #f44336;
            background-color: #fff0f0;
        }
        
        .add-category-form {
            display: flex;
            gap: 10px;
            margin-top: 15px;
        }
        
        .add-category-form input {
            flex: 1;
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .add-category-form input:focus {
            outline: none;
            border-color: #4154b3;
        }
    `;
    document.head.appendChild(style);
};

// Expose functions to window object
window.initializeSettings = initializeSettings;
window.loadSettings = loadSettings;
window.setupInstrumentManager = setupInstrumentManager;
window.setupCategoryManager = setupCategoryManager;
window.addDefaultCategories = addDefaultCategories;
window.addNewCategory = addNewCategory;
window.deleteCategory = deleteCategory;
window.handleClearInstrumentData = handleClearInstrumentData;
window.handleClearAllData = handleClearAllData; 