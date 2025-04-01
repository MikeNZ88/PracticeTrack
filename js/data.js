// Data Access Layer
const SCHEMA_VERSION = 1;

// Default Data
const defaultCategories = [
    { 
        id: 'c-1', 
        name: 'Technique', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone']
    },
    { 
        id: 'c-2', 
        name: 'Repertoire', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone']
    },
    { 
        id: 'c-3', 
        name: 'Music Theory', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone']
    },
    { 
        id: 'c-4', 
        name: 'Ear Training', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone']
    },
    { 
        id: 'c-5', 
        name: 'Sight Reading', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    { 
        id: 'c-6', 
        name: 'Improvisation', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'trumpet', 'bass', 'saxophone']
    },
    { 
        id: 'c-7', 
        name: 'Lesson', 
        isHidden: false,
        isDefault: true,
        instrumentIds: ['piano', 'guitar', 'violin', 'drums', 'voice', 'flute', 'clarinet', 'trumpet', 'bass', 'cello', 'saxophone']
    }
];

const defaultSettings = {
    id: 's-1',
    primaryInstrument: '',
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
    SESSIONS: 'practice_sessions',
    GOALS: 'practice_goals',
    CATEGORIES: 'practice_categories',
    MEDIA: 'practice_media',
    SETTINGS: 'practice_settings'
};

// Get all items of a specific type
const getItems = (type) => {
    try {
        // Get the storage key for the type
        const normalizedType = type.toUpperCase();
        const key = STORAGE_KEYS[normalizedType];
        
        if (!key) {
            console.error(`Invalid storage key for type: ${type}`);
            return [];
        }
        
        // Try to get data from primary key
        const data = localStorage.getItem(key);
        
        // If looking for sessions and no data found, try alternative keys
        if (!data || data === '[]' || data === 'null') {
            console.log(`No data found for ${key}, checking alternates...`);
            
            // For sessions, try all possible keys
            if (normalizedType === 'SESSIONS') {
                // Possible keys to check
                const alternateKeys = ['sessions', 'practice_sessions', 'SESSIONS', 'practicetrack_sessions'];
                
                for (const altKey of alternateKeys) {
                    const altData = localStorage.getItem(altKey);
                    if (altData && altData !== '[]' && altData !== 'null') {
                        console.log(`Found sessions under alternate key: ${altKey}`);
                        try {
                            const parsed = JSON.parse(altData);
                            if (Array.isArray(parsed) && parsed.length > 0) {
                                // Also save to the primary key
                                localStorage.setItem(key, altData);
                                return parsed;
                            }
                        } catch (e) {
                            console.error(`Error parsing data from ${altKey}:`, e);
                        }
                    }
                }
                
                // If still no data found, create sample sessions
                console.log('No session data found, creating samples');
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
                    },
                    {
                        id: 's-3',
                        categoryId: 'c-3',
                        startTime: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
                        duration: 2700, // 45 minutes
                        notes: 'Sample practice session 3',
                        isManual: true,
                        isLesson: false,
                        createdAt: new Date(Date.now() - 172800000).toISOString(),
                        updatedAt: new Date(Date.now() - 172800000).toISOString()
                    }
                ];
                
                // Save sample sessions to all potential keys
                const sampleJSON = JSON.stringify(sampleSessions);
                localStorage.setItem(key, sampleJSON);
                localStorage.setItem('practice_sessions', sampleJSON);
                localStorage.setItem('sessions', sampleJSON);
                
                return sampleSessions;
            }
            
            // For categories, if none found, use defaults
            if (normalizedType === 'CATEGORIES') {
                // Save default categories
                localStorage.setItem(key, JSON.stringify(defaultCategories));
                return defaultCategories;
            }
            
            return [];
        }
        
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error(`Error getting items for type ${type}:`, error);
        
        // If there's an error for sessions, return sample data
        if (type.toUpperCase() === 'SESSIONS') {
            return sampleSessions;
        }
        
        // If there's an error for categories, return defaults
        if (type.toUpperCase() === 'CATEGORIES') {
            return defaultCategories;
        }
        
        return [];
    }
};

// Get a single item by ID
const getItemById = (type, id) => {
    const items = getItems(type);
    return items.find(item => item.id === id);
};

// Save an item (create or update)
const saveItem = (type, item) => {
    try {
        const key = STORAGE_KEYS[type.toUpperCase()];
        if (!key) return;
        
        let items = getItems(type);
        const index = items.findIndex(i => i.id === item.id);
        
        if (index >= 0) {
            items[index] = item;
        } else {
            items.push(item);
        }
        
        localStorage.setItem(key, JSON.stringify(items));
    } catch (error) {
        console.error(`Error saving item for type ${type}:`, error);
        throw error;
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

// Initialize data
const initializeData = () => {
    console.log('Initializing data layer...');
    
    // Check if any categories exist, if not, create defaults
    const categories = getItems('CATEGORIES');
    if (!categories || categories.length === 0) {
        console.log('No categories found, creating defaults...');
        defaultCategories.forEach(category => {
            saveItem('CATEGORIES', category);
        });
    }
    
    // Check if settings exist, if not, create defaults
    const settings = getItems('SETTINGS');
    if (!settings || settings.length === 0) {
        console.log('No settings found, creating defaults...');
        saveItem('SETTINGS', defaultSettings);
    }
    
    // Check if sessions exist
    const sessions = getItems('SESSIONS');
    if (!sessions || sessions.length === 0) {
        console.log('No sessions found, initializing with sample data');
        localStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(sampleSessions));
    }
    
    console.log('Data initialization complete');
};

// Expose functions to window object
window.initializeData = initializeData;
window.getItems = getItems;
window.getItemById = getItemById;
window.saveItem = saveItem;
window.deleteItem = deleteItem;
window.updateItem = updateItem;
window.clearAllData = clearAllData;
window.exportData = exportData;
window.importData = importData;
window.validateSession = validateSession;
window.validateGoal = validateGoal;
window.validateMediaReference = validateMediaReference;
window.checkStorageCapacity = checkStorageCapacity;
window.defaultCategories = defaultCategories;

// Initialize data layer immediately when script loads
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing data layer immediately');
    initializeData();
}); 