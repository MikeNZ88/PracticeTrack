// Data Access Layer
const SCHEMA_VERSION = 1;

// Available Instruments
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

// Default Categories by Instrument
const DEFAULT_CATEGORIES = {
    piano: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-6', name: 'Improvisation', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    guitar: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-6', name: 'Improvisation', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    violin: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    drums: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-6', name: 'Improvisation', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    voice: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    flute: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    clarinet: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    trumpet: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-6', name: 'Improvisation', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    bass: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-6', name: 'Improvisation', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    cello: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ],
    saxophone: [
        { id: 'c-1', name: 'Technique', isDefault: true },
        { id: 'c-2', name: 'Repertoire', isDefault: true },
        { id: 'c-3', name: 'Music Theory', isDefault: true },
        { id: 'c-4', name: 'Ear Training', isDefault: true },
        { id: 'c-5', name: 'Sight Reading', isDefault: true },
        { id: 'c-6', name: 'Improvisation', isDefault: true },
        { id: 'c-7', name: 'Lesson', isDefault: true }
    ]
};

// Default Settings
const defaultSettings = {
    id: 's-1',
    instruments: [],
    lessonDay: '',
    lessonTime: '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
};

// Sample Sessions
const sampleSessions = [
    {
        id: 's-1',
        categoryId: 'c-1',
        startTime: new Date().toISOString(),
        duration: 3600, // 1 hour
        notes: 'Sample practice session',
        isManual: true,
        isLesson: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: 's-2',
        categoryId: 'c-2',
        startTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        duration: 1800, // 30 minutes
        notes: 'Sample practice session 2',
        isManual: true,
        isLesson: false,
        createdAt: new Date(Date.now() - 86400000).toISOString(),
        updatedAt: new Date(Date.now() - 86400000).toISOString()
    }
];

// Storage Keys
const STORAGE_KEYS = {
    SESSIONS: 'practiceTrack_sessions',
    GOALS: 'practiceTrack_goals',
    CATEGORIES: 'practiceTrack_categories',
    MEDIA: 'practiceTrack_media',
    SETTINGS: 'practiceTrack_settings'
};

// Get all items of a specific type
const getItems = (type) => {
    try {
        const normalizedType = type.toUpperCase();
        const key = STORAGE_KEYS[normalizedType];
        
        if (!key) {
            console.error(`Invalid storage key for type: ${type}`);
            return [];
        }
        
        const data = localStorage.getItem(key);
        const items = data ? JSON.parse(data) : [];
        console.log(`Found ${items.length} items for ${key}`);
        return items;
    } catch (error) {
        console.error(`Error getting ${type}:`, error);
        return [];
    }
};

// Get a single item by ID
const getItemById = (type, id) => {
    const items = getItems(type);
    return items.find(item => item.id === id);
};

// Save items of a specific type
const saveItems = (type, items) => {
    try {
        const normalizedType = type.toUpperCase();
        const key = STORAGE_KEYS[normalizedType];
        
        if (!key) {
            console.error(`Invalid storage key for type: ${type}`);
            return false;
        }
        
        const data = JSON.stringify(items);
        localStorage.setItem(key, data);
        console.log(`Saved ${items.length} items to ${key}`);
        return true;
    } catch (error) {
        console.error(`Error saving ${type}:`, error);
        return false;
    }
};

// Delete an item
const deleteItem = (type, id) => {
    try {
        const key = STORAGE_KEYS[type.toUpperCase()];
        if (!key) return;
        
        let items = getItems(type);
        items = items.filter(item => item.id !== id);
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error(`Error deleting item for type ${type}:`, error);
        throw error;
    }
};

// Update an item
const updateItem = (type, id, updates) => {
    try {
        const key = STORAGE_KEYS[type.toUpperCase()];
        if (!key) return;
        
        let items = getItems(type);
        const index = items.findIndex(item => item.id === id);
        
        if (index !== -1) {
            items[index] = { ...items[index], ...updates, updatedAt: new Date().toISOString() };
            localStorage.setItem(key, JSON.stringify(items));
        }
    } catch (error) {
        console.error(`Error updating item for type ${type}:`, error);
        throw error;
    }
};

// Clear all data
const clearAllData = () => {
    Object.values(STORAGE_KEYS).forEach(key => {
        localStorage.removeItem(key);
    });
};

// Export data to JSON
const exportData = () => {
    return {
        version: SCHEMA_VERSION,
        exportDate: new Date().toISOString(),
        sessions: getItems('SESSIONS'),
        goals: getItems('GOALS'),
        settings: getItems('SETTINGS')[0] || {},
        media: getItems('MEDIA'),
        categories: getItems('CATEGORIES')
    };
};

// Import data from JSON
const importData = (data) => {
    if (data.sessions) localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(data.sessions));
    if (data.goals) localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(data.goals));
    if (data.settings) localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify([data.settings]));
    if (data.media) localStorage.setItem(STORAGE_KEYS.MEDIA, JSON.stringify(data.media));
    if (data.categories) localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(data.categories));
};

// Validation Functions
const validateSession = (session) => {
    const errors = [];
    
    if (!session.categoryId) {
        errors.push('Category is required');
    }
    
    if (!session.startTime) {
        errors.push('Start time is required');
    }
    
    if (typeof session.duration !== 'number' || session.duration < 0) {
        errors.push('Duration must be a positive number');
    }
    
    return errors;
};

const validateGoal = (goal) => {
    const errors = [];
    
    if (!goal.text) {
        errors.push('Goal text is required');
    }
    
    if (goal.dueDate && new Date(goal.dueDate) < new Date()) {
        errors.push('Due date cannot be in the past');
    }
    
    return errors;
};

const validateMediaReference = (mediaRef) => {
    const errors = [];
    
    if (!mediaRef.sessionId) {
        errors.push('Session ID is required');
    }
    
    if (!mediaRef.type) {
        errors.push('Media type is required');
    }
    
    if (!mediaRef.url) {
        errors.push('Media URL is required');
    }
    
    return errors;
};

// Storage Management
const checkStorageCapacity = () => {
    const total = 5 * 1024 * 1024; // 5MB limit
    let used = 0;
    
    for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
            used += localStorage[key].length * 2; // UTF-16 uses 2 bytes per character
        }
    }
    
    const percentage = (used / total) * 100;
    return {
        used,
        total,
        percentage,
        approaching: percentage > 80,
        exceeded: percentage > 90
    };
};

const pruneOldMediaIfNeeded = () => {
    const capacity = checkStorageCapacity();
    if (!capacity.exceeded) return;
    
    const media = getItems('MEDIA');
    media.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    
    while (capacity.exceeded && media.length > 0) {
        const oldestMedia = media.shift();
        deleteItem('MEDIA', oldestMedia.id);
        capacity = checkStorageCapacity();
    }
};

// Initialize data layer
const initializeData = () => {
    console.log('Initializing data layer');
    
    try {
        // Initialize settings if not exists
        let settings = getItems('SETTINGS')[0];
        if (!settings) {
            settings = { ...defaultSettings };
            saveItems('SETTINGS', [settings]);
        }
        
        // Initialize categories if not exists
        let categories = getItems('CATEGORIES');
        if (!categories.length) {
            // Get selected instruments from settings
            const selectedInstruments = settings.instruments || [];
            
            // Add default categories for each selected instrument
            selectedInstruments.forEach(instrumentId => {
                if (DEFAULT_CATEGORIES[instrumentId]) {
                    categories.push(...DEFAULT_CATEGORIES[instrumentId]);
                }
            });
            
            // Save categories
            saveItems('CATEGORIES', categories);
        }
        
        // Initialize other data types if needed
        if (!getItems('SESSIONS').length) {
            saveItems('SESSIONS', []);
        }
        if (!getItems('GOALS').length) {
            saveItems('GOALS', []);
        }
        if (!getItems('MEDIA').length) {
            saveItems('MEDIA', []);
        }
        
        console.log('Data layer initialized successfully');
        return true;
    } catch (error) {
        console.error('Error initializing data layer:', error);
        return false;
    }
};

// Make functions available to window object
window.getItems = getItems;
window.getItemById = getItemById;
window.saveItems = saveItems;
window.deleteItem = deleteItem;
window.updateItem = updateItem;
window.clearAllData = clearAllData;
window.exportData = exportData;
window.importData = importData;
window.validateSession = validateSession;
window.validateGoal = validateGoal;
window.validateMediaReference = validateMediaReference;
window.checkStorageCapacity = checkStorageCapacity;
window.initializeData = initializeData;
window.AVAILABLE_INSTRUMENTS = AVAILABLE_INSTRUMENTS;
window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;

// Initialize data layer immediately when script loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing data layer');
        initializeData();
    });
} else {
    console.log('DOM already loaded, initializing data layer immediately');
    initializeData();
} 