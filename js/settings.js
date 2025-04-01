// DOM Elements
let settingsForm;
let instrumentSelect;
let selectedInstrumentsContainer;
let categoriesList;
let addDefaultCategoriesBtn;
let newCategoryInput;
let addCategoryBtn;
let exportDataBtn;
let importDataBtn;
let lessonDaySelect;
let lessonTimeInput;
let defaultCategoriesDialog;
let selectedInstrumentId = null;

// Available instruments with IDs and names
const AVAILABLE_INSTRUMENTS = [
    { id: 'piano', name: 'Piano' },
    { id: 'guitar', name: 'Guitar' },
    { id: 'violin', name: 'Violin' },
    { id: 'drums', name: 'Drums' },
    { id: 'voice', name: 'Voice' },
    { id: 'flute', name: 'Flute' },
    { id: 'clarinet', name: 'Clarinet' },
    { id: 'trumpet', name: 'Trumpet' },
    { id: 'bass', name: 'Bass' },
    { id: 'cello', name: 'Cello' },
    { id: 'saxophone', name: 'Saxophone' }
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
            window.setItems('SETTINGS', [{
                id: 's-1',
                instruments: [],
                lessonDay: '',
                lessonTime: '',
                theme: 'light',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }]);
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
        instrumentSelect = document.getElementById('instrument-select');
        selectedInstrumentsContainer = document.querySelector('.selected-instruments');
        categoriesList = document.getElementById('categories-list');
        addDefaultCategoriesBtn = document.getElementById('add-default-categories');
        newCategoryInput = document.getElementById('new-category-name');
        addCategoryBtn = document.getElementById('add-category-btn');
        exportDataBtn = document.getElementById('export-data');
        importDataBtn = document.getElementById('import-data');
        lessonDaySelect = document.getElementById('lesson-day');
        lessonTimeInput = document.getElementById('lesson-time');
        defaultCategoriesDialog = document.getElementById('default-categories-dialog');
        
        // Validate required elements
        if (!instrumentSelect || !selectedInstrumentsContainer || !categoriesList || !addDefaultCategoriesBtn || !defaultCategoriesDialog) {
            console.error('Required DOM elements not found:', {
                instrumentSelect: !!instrumentSelect,
                selectedInstrumentsContainer: !!selectedInstrumentsContainer,
                categoriesList: !!categoriesList,
                addDefaultCategoriesBtn: !!addDefaultCategoriesBtn,
                defaultCategoriesDialog: !!defaultCategoriesDialog
            });
            return;
        }
        
        // First, clean up any corrupted data
        cleanupStorage();
        
        // Then load settings and set up UI
        loadSettings();
        setupInstrumentManager();
        setupEventListeners();
        setupDefaultCategoriesDialog();
        addStyles();
        
        // Initialize Lucide icons
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        
        console.log('Settings page initialized successfully');
    } catch (error) {
        console.error('Error initializing settings:', error);
    }
};

// Set up default categories dialog
const setupDefaultCategoriesDialog = () => {
    try {
        if (!defaultCategoriesDialog) {
            console.error('Default categories dialog not found');
            return;
        }
        
        // Get dialog elements
        const instrumentList = defaultCategoriesDialog.querySelector('.instrument-list');
        const closeBtn = defaultCategoriesDialog.querySelector('[data-close]');
        const addBtn = defaultCategoriesDialog.querySelector('[data-add]');
        
        if (!instrumentList || !closeBtn || !addBtn) {
            console.error('Required dialog elements not found');
            return;
        }
        
        // Get current settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        
        if (!settings || !settings.instruments || settings.instruments.length === 0) {
            console.log('No instruments selected');
            return;
        }
        
        // Clear and populate instrument list
        instrumentList.innerHTML = '';
        settings.instruments.forEach(instrumentId => {
            const instrumentItem = document.createElement('div');
            instrumentItem.className = 'instrument-item';
            instrumentItem.dataset.instrument = instrumentId;
            
            const radio = document.createElement('input');
            radio.type = 'radio';
            radio.name = 'instrument';
            radio.value = instrumentId;
            radio.id = `radio-${instrumentId}`;
            
            const label = document.createElement('label');
            label.htmlFor = `radio-${instrumentId}`;
            label.textContent = instrumentId;
            
            instrumentItem.appendChild(radio);
            instrumentItem.appendChild(label);
            instrumentList.appendChild(instrumentItem);
            
            // Add click handler
            instrumentItem.addEventListener('click', () => {
                // Clear all selected states
                instrumentList.querySelectorAll('.instrument-item').forEach(item => {
                    item.classList.remove('selected');
                });
                // Set selected state
                instrumentItem.classList.add('selected');
                // Check radio button
                radio.checked = true;
                selectedInstrumentId = instrumentId;
            });
        });
        
        // Add button handlers
        closeBtn.addEventListener('click', () => {
            defaultCategoriesDialog.close();
            selectedInstrumentId = null;
        });
        
        addBtn.addEventListener('click', () => {
            if (!selectedInstrumentId) {
                alert('Please select an instrument');
                return;
            }
            
            handleAddDefaultCategories(selectedInstrumentId);
            defaultCategoriesDialog.close();
            selectedInstrumentId = null;
        });
        
        // Add click outside to close
        defaultCategoriesDialog.addEventListener('click', (e) => {
            if (e.target === defaultCategoriesDialog) {
                defaultCategoriesDialog.close();
                selectedInstrumentId = null;
            }
        });
        
        console.log('Default categories dialog setup complete');
    } catch (error) {
        console.error('Error setting up default categories dialog:', error);
    }
};

// Show default categories dialog
const showDefaultCategoriesDialog = () => {
    try {
        if (!defaultCategoriesDialog) {
            console.error('Default categories dialog not found');
            return;
        }
        
        // Get current settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        
        if (!settings || !settings.instruments || settings.instruments.length === 0) {
            alert('Please select at least one instrument first');
            return;
        }
        
        // Reset selected instrument
        selectedInstrumentId = null;
        
        // Setup dialog before showing
        setupDefaultCategoriesDialog();
        
        // Show dialog
        defaultCategoriesDialog.showModal();
        
        console.log('Showing default categories dialog');
    } catch (error) {
        console.error('Error showing default categories dialog:', error);
    }
};

// Handle instrument selection
const handleInstrumentSelect = () => {
    try {
        if (!instrumentSelect) return;
        
        const selectedInstrument = instrumentSelect.value;
        if (!selectedInstrument) return;
        
        // Get current settings
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
        
        // Check if instrument is already selected
        if (settings.instruments.includes(selectedInstrument)) {
            alert('This instrument is already selected');
            instrumentSelect.value = '';
            return;
        }
        
        // Check maximum instruments limit
        if (settings.instruments.length >= 3) {
            alert('You can only select up to 3 instruments');
            instrumentSelect.value = '';
            return;
        }
        
        // Add instrument to settings
        settings.instruments.push(selectedInstrument);
        settings.updatedAt = new Date().toISOString();
        
        // Save settings
        window.setItems('SETTINGS', [settings]);
        
        // Update UI
        updateSelectedInstruments(settings.instruments);
        instrumentSelect.value = '';
        
        // Add default categories for the new instrument
        const defaultCategories = window.DEFAULT_CATEGORIES[selectedInstrument] || [];
        if (defaultCategories.length > 0) {
            if (confirm('Would you like to add default categories for this instrument?')) {
                handleAddDefaultCategories(selectedInstrument);
            }
        }
        
        // Reload categories
        loadCategories();
    } catch (error) {
        console.error('Error handling instrument selection:', error);
    }
};

// Handle adding default categories
const handleAddDefaultCategories = (instrumentId) => {
    try {
        if (!instrumentId) return;
        
        // Get current categories
        let categories = window.getItems('CATEGORIES') || [];
        
        // Get default categories for the instrument
        const defaultCategories = window.DEFAULT_CATEGORIES[instrumentId] || [];
        if (!defaultCategories.length) {
            console.warn('No default categories found for instrument:', instrumentId);
            return;
        }
        
        // Add each default category if it doesn't already exist
        let addedCount = 0;
        defaultCategories.forEach(category => {
            const exists = categories.some(cat => 
                cat.instrumentId === instrumentId && 
                cat.name.toLowerCase() === category.name.toLowerCase()
            );
            
            if (!exists) {
                categories.push({
                    id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                    name: category.name,
                    instrumentId: instrumentId,
                    isDefault: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                addedCount++;
            }
        });
        
        if (addedCount > 0) {
            // Save categories
            window.setItems('CATEGORIES', categories);
            
            // Reload categories
            loadCategories();
            
            // Show success message
            alert(`Added ${addedCount} default categories for ${instrumentId}`);
        } else {
            alert('All default categories already exist for this instrument');
        }
    } catch (error) {
        console.error('Error adding default categories:', error);
    }
};

// Handle adding a new category
const handleAddCategory = () => {
    try {
        if (!newCategoryInput || !instrumentSelect) return;
        
        const newCategoryName = newCategoryInput.value.trim();
        const selectedInstrument = instrumentSelect.value;
        
        // Validate input
        if (!newCategoryName) {
            alert('Please enter a category name');
            return;
        }
        
        if (!selectedInstrument) {
            alert('Please select an instrument for the category');
            return;
        }
        
        // Get current categories
        let categories = window.getItems('CATEGORIES') || [];
        
        // Check if category already exists for this instrument
        const exists = categories.some(cat => 
            cat.instrumentId === selectedInstrument && 
            cat.name.toLowerCase() === newCategoryName.toLowerCase()
        );
        
        if (exists) {
            alert('This category already exists for the selected instrument');
            return;
        }
        
        // Create new category
        const newCategory = {
            id: `c-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: newCategoryName,
            instrumentId: selectedInstrument,
            isDefault: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add category
        categories.push(newCategory);
        
        // Save categories
        window.setItems('CATEGORIES', categories);
        
        // Clear input and reset instrument select
        newCategoryInput.value = '';
        instrumentSelect.value = '';
        
        // Reload categories
        loadCategories();
        
        // Show success message
        alert('Category added successfully');
    } catch (error) {
        console.error('Error adding category:', error);
    }
};

// Setup event listeners
const setupEventListeners = () => {
    try {
        console.log('Setting up event listeners');
        
        // Remove existing listeners first
        if (addDefaultCategoriesBtn) {
            const newBtn = addDefaultCategoriesBtn.cloneNode(true);
            addDefaultCategoriesBtn.parentNode.replaceChild(newBtn, addDefaultCategoriesBtn);
            addDefaultCategoriesBtn = newBtn;
            addDefaultCategoriesBtn.addEventListener('click', showDefaultCategoriesDialog);
        }
        
        if (addCategoryBtn) {
            const newBtn = addCategoryBtn.cloneNode(true);
            addCategoryBtn.parentNode.replaceChild(newBtn, addCategoryBtn);
            addCategoryBtn = newBtn;
            addCategoryBtn.addEventListener('click', handleAddCategory);
        }
        
        if (newCategoryInput) {
            const newInput = newCategoryInput.cloneNode(true);
            newCategoryInput.parentNode.replaceChild(newInput, newCategoryInput);
            newCategoryInput = newInput;
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
        
        // Clear data buttons
        const clearInstrumentDataBtn = document.getElementById('clear-instrument-data');
        if (clearInstrumentDataBtn) {
            const newBtn = clearInstrumentDataBtn.cloneNode(true);
            clearInstrumentDataBtn.parentNode.replaceChild(newBtn, clearInstrumentDataBtn);
            newBtn.addEventListener('click', handleClearInstrumentData);
        }
        
        const clearAllDataBtn = document.getElementById('clear-all-data');
        if (clearAllDataBtn) {
            const newBtn = clearAllDataBtn.cloneNode(true);
            clearAllDataBtn.parentNode.replaceChild(newBtn, clearAllDataBtn);
            newBtn.addEventListener('click', handleClearAllData);
        }
        
        // Lesson day and time changes
        if (lessonDaySelect) {
            const newSelect = lessonDaySelect.cloneNode(true);
            lessonDaySelect.parentNode.replaceChild(newSelect, lessonDaySelect);
            lessonDaySelect = newSelect;
            lessonDaySelect.addEventListener('change', handleSettingsSubmit);
        }
        
        if (lessonTimeInput) {
            const newInput = lessonTimeInput.cloneNode(true);
            lessonTimeInput.parentNode.replaceChild(newInput, lessonTimeInput);
            lessonTimeInput = newInput;
            lessonTimeInput.addEventListener('change', handleSettingsSubmit);
        }
        
        console.log('Event listeners setup complete');
    } catch (error) {
        console.error('Error setting up event listeners:', error);
    }
};

// Load settings
const loadSettings = () => {
    try {
        // Get current settings
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
        
        // Populate lesson day dropdown
        populateLessonDayDropdown(settings.lessonDay);
        
        // Set lesson time
        if (lessonTimeInput) {
            lessonTimeInput.value = settings.lessonTime || '';
        }
        
        // Load categories
        loadCategories();
        
        // Add change handlers for lesson day and time
        if (lessonDaySelect) {
            lessonDaySelect.addEventListener('change', handleSettingsSubmit);
        }
        if (lessonTimeInput) {
            lessonTimeInput.addEventListener('change', handleSettingsSubmit);
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

// Set up instrument manager
const setupInstrumentManager = () => {
    try {
        // Get current settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        
        // Populate instruments dropdown
        populateInstrumentsDropdown();
        
        // Update selected instruments display
        if (settings && settings.instruments) {
            updateSelectedInstruments(settings.instruments);
        }
        
        // Add event listener for instrument selection
        if (instrumentSelect) {
            instrumentSelect.addEventListener('change', handleInstrumentSelect);
        }
    } catch (error) {
        console.error('Error setting up instrument manager:', error);
    }
};

// Populate instruments dropdown
const populateInstrumentsDropdown = () => {
    try {
        if (!instrumentSelect) return;
        
        // Clear existing options
        instrumentSelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select an instrument';
        instrumentSelect.appendChild(defaultOption);
        
        // Get current settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        const selectedInstruments = settings?.instruments || [];
        
        // Add available instruments that aren't already selected
        AVAILABLE_INSTRUMENTS.forEach(instrument => {
            if (!selectedInstruments.includes(instrument)) {
                const option = document.createElement('option');
                option.value = instrument;
                option.textContent = instrument;
                instrumentSelect.appendChild(option);
            }
        });
    } catch (error) {
        console.error('Error populating instruments dropdown:', error);
    }
};

// Update selected instruments display
const updateSelectedInstruments = (instruments = []) => {
    try {
        if (!selectedInstrumentsContainer) return;
        
        // Clear existing instruments
        selectedInstrumentsContainer.innerHTML = '';
        
        // Add each instrument with remove button
        instruments.forEach(instrument => {
            const instrumentElement = document.createElement('div');
            instrumentElement.className = 'selected-instrument';
            
            const instrumentName = document.createElement('span');
            instrumentName.textContent = instrument;
            instrumentElement.appendChild(instrumentName);
            
            const removeButton = document.createElement('button');
            removeButton.className = 'remove-instrument';
            removeButton.innerHTML = '×';
            removeButton.addEventListener('click', () => removeInstrument(instrument));
            instrumentElement.appendChild(removeButton);
            
            selectedInstrumentsContainer.appendChild(instrumentElement);
        });
        
        // Update instruments dropdown
        populateInstrumentsDropdown();
    } catch (error) {
        console.error('Error updating selected instruments:', error);
    }
};

// Remove instrument
const removeInstrument = (instrumentToRemove) => {
    try {
        // Get current settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        
        if (!settings) return;
        
        // Remove instrument from settings
        settings.instruments = settings.instruments.filter(instrument => instrument !== instrumentToRemove);
        settings.updatedAt = new Date().toISOString();
        
        // Save settings
        window.setItems('SETTINGS', [settings]);
        
        // Update UI
        updateSelectedInstruments(settings.instruments);
        
        // Reload categories to remove instrument's categories
        loadCategories();
    } catch (error) {
        console.error('Error removing instrument:', error);
    }
};

// Load categories
const loadCategories = () => {
    try {
        if (!categoriesList) return;
        
        // Clear existing categories
        categoriesList.innerHTML = '';
        
        // Get current settings and categories
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : null;
        let categories = window.getItems('CATEGORIES') || [];
        
        if (!settings || !settings.instruments || settings.instruments.length === 0) {
            categoriesList.innerHTML = '<p>Please select at least one instrument first.</p>';
            return;
        }
        
        // Group categories by instrument
        const categoriesByInstrument = {};
        settings.instruments.forEach(instrument => {
            categoriesByInstrument[instrument] = categories.filter(cat => cat.instrumentId === instrument);
        });
        
        // Create sections for each instrument's categories
        settings.instruments.forEach(instrument => {
            const instrumentCategories = categoriesByInstrument[instrument];
            
            // Create instrument section
            const section = document.createElement('div');
            section.className = 'categories-section';
            
            // Add instrument header
            const header = document.createElement('h3');
            header.textContent = `${instrument} Categories`;
            section.appendChild(header);
            
            // Add categories
            if (instrumentCategories.length > 0) {
                const list = document.createElement('ul');
                list.className = 'categories-list';
                
                instrumentCategories.forEach(category => {
                    const item = document.createElement('li');
                    item.className = 'category-item';
                    
                    const name = document.createElement('span');
                    name.textContent = category.name;
                    item.appendChild(name);
                    
                    const deleteBtn = document.createElement('button');
                    deleteBtn.className = 'delete-category';
                    deleteBtn.innerHTML = '×';
                    deleteBtn.addEventListener('click', () => handleDeleteCategory(category.id));
                    item.appendChild(deleteBtn);
                    
                    list.appendChild(item);
                });
                
                section.appendChild(list);
            } else {
                const empty = document.createElement('p');
                empty.textContent = 'No categories added yet.';
                section.appendChild(empty);
            }
            
            categoriesList.appendChild(section);
        });
    } catch (error) {
        console.error('Error loading categories:', error);
    }
};

// Handle deleting a category
const handleDeleteCategory = (categoryId) => {
    try {
        if (!categoryId) return;
        
        // Confirm deletion
        if (!confirm('Are you sure you want to delete this category?')) {
            return;
        }
        
        // Get current categories
        let categories = window.getItems('CATEGORIES') || [];
        
        // Remove category
        categories = categories.filter(cat => cat.id !== categoryId);
        
        // Save categories
        window.setItems('CATEGORIES', categories);
        
        // Reload categories
        loadCategories();
        
        // Show success message
        alert('Category deleted successfully');
    } catch (error) {
        console.error('Error deleting category:', error);
    }
};

// Handle settings form submission
const handleSettingsSubmit = (e) => {
    try {
        // Get current settings
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

        // Update settings
        if (lessonDaySelect) {
            settings.lessonDay = lessonDaySelect.value;
        }
        if (lessonTimeInput) {
            settings.lessonTime = lessonTimeInput.value;
        }

        // Save settings
        window.saveItems('SETTINGS', [settings]);
        
        // Update timer categories if timer exists
        if (typeof window.updateTimerCategories === 'function') {
            window.updateTimerCategories();
        }
        
        // Show success message
        alert('Settings saved successfully');
    } catch (error) {
        console.error('Error saving settings:', error);
        alert('Error saving settings. Please try again.');
    }
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

// Handle clearing instrument data
const handleClearInstrumentData = () => {
    if (!confirm('Are you sure you want to clear all data for the selected instruments? This cannot be undone.')) return;
    
    // Get current settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const selectedInstruments = settings.instruments || [];
    
    // Clear categories for selected instruments
    let categories = window.getItems('CATEGORIES') || [];
    categories = categories.filter(cat => !selectedInstruments.includes(cat.instrumentId));
    window.saveItems('CATEGORIES', categories);
    
    // Clear sessions for selected instruments
    let sessions = window.getItems('SESSIONS') || [];
    sessions = sessions.filter(session => 
        !session.instruments || !session.instruments.some(id => selectedInstruments.includes(id))
    );
    window.saveItems('SESSIONS', sessions);
    
    // Clear goals for selected instruments
    let goals = window.getItems('GOALS') || [];
    goals = goals.filter(goal => 
        !goal.instruments || !goal.instruments.some(id => selectedInstruments.includes(id))
    );
    window.saveItems('GOALS', goals);
    
    // Update UI
    loadCategories();
    
    alert('Instrument data cleared successfully');
};

// Handle clearing all data
const handleClearAllData = () => {
    if (!confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) return;
    
    // Clear all data
    window.saveItems('SETTINGS', [{
        id: 's-1',
        instruments: [],
        lessonDay: '',
        lessonTime: '',
        theme: 'light',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }]);
    window.saveItems('CATEGORIES', []);
    window.saveItems('SESSIONS', []);
    window.saveItems('GOALS', []);
    window.saveItems('MEDIA', []);
    
    // Reset UI
    loadSettings();
    
    alert('All data cleared successfully');
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
        
        .selected-instruments {
            display: flex;
            flex-wrap: wrap;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .selected-instrument {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            background: #f5f5f5;
            border-radius: 20px;
            font-size: 0.875rem;
        }
        
        .selected-instrument .instrument-name {
            color: #333;
        }
        
        .selected-instrument .remove-instrument {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 20px;
            height: 20px;
            padding: 0;
            border: none;
            background: none;
            color: #666;
            cursor: pointer;
            transition: color 0.2s;
        }
        
        .selected-instrument .remove-instrument:hover {
            color: #ff4444;
        }
        
        .categories-container {
            margin-top: 1rem;
        }
        
        .categories-list {
            margin: 1rem 0;
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
        
        .warning-button {
            background: #ff9800;
            color: white;
        }
        
        .danger-button {
            background: #f44336;
            color: white;
        }
        
        .settings-dialog {
            padding: 1.5rem;
            border: none;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .settings-dialog::backdrop {
            background: rgba(0, 0, 0, 0.5);
        }
        
        .settings-dialog h2 {
            margin: 0 0 1rem;
            font-size: 1.25rem;
            color: #333;
        }
        
        .settings-dialog p {
            margin: 0 0 1rem;
            color: #666;
        }
        
        .instrument-list {
            margin: 1rem 0;
            max-height: 300px;
            overflow-y: auto;
        }
        
        .instrument-item {
            display: flex;
            align-items: center;
            padding: 0.5rem;
            cursor: pointer;
            transition: background 0.2s;
        }
        
        .instrument-item:hover {
            background: #f5f5f5;
        }
        
        .instrument-item.selected {
            background: #e3f2fd;
        }
        
        .instrument-item input[type="radio"] {
            margin-right: 0.5rem;
        }
        
        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 1rem;
            margin-top: 1.5rem;
        }
    `;
    
    // Add styles to document
    const styleSheet = document.createElement('style');
    styleSheet.textContent = styles;
    document.head.appendChild(styleSheet);
};

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
window.setupInstrumentManager = setupInstrumentManager;
window.setupCategoryManager = setupCategoryManager;
window.handleAddDefaultCategories = handleAddDefaultCategories;
window.handleAddCategory = handleAddCategory;
window.deleteCategory = deleteCategory;
window.handleSettingsSubmit = handleSettingsSubmit;
window.handleExportData = handleExportData;
window.handleImportData = handleImportData;
window.handleClearInstrumentData = handleClearInstrumentData;
window.handleClearAllData = handleClearAllData; 