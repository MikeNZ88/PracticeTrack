/**
 * Data Layer Module
 * Provides consistent data access for all application tabs
 */

// Data store types
const DATA_TYPES = {
    CATEGORIES: 'practiceTrack_categories',
    SESSIONS: 'practiceTrack_sessions',
    GOALS: 'practiceTrack_goals',
    MEDIA: 'practiceTrack_media',
    TIMER_DATA: 'practiceTrack_timer'
};

// Default categories if none exist
const DEFAULT_CATEGORIES = [
    { id: 'cat_warmup', name: 'Warm-up', color: '#4CAF50' },
    { id: 'cat_technique', name: 'Technique', color: '#2196F3' },
    { id: 'cat_repertoire', name: 'Repertoire', color: '#9C27B0' },
    { id: 'cat_sightreading', name: 'Sight-reading', color: '#FF9800' },
    { id: 'cat_theory', name: 'Theory', color: '#795548' }
];

/**
 * Get all items of a specific type
 * @param {string} type - The data type to retrieve
 * @returns {Array} - Array of items
 */
function getItems(type) {
    if (!DATA_TYPES[type]) {
        console.error(`Invalid data type: ${type}`);
        return [];
    }
    
    try {
        const stored = localStorage.getItem(DATA_TYPES[type]);
        if (stored) {
            return JSON.parse(stored);
        }
        
        // Return default categories if requesting categories and none exist
        if (type === 'CATEGORIES') {
            return DEFAULT_CATEGORIES;
        }
    } catch (e) {
        console.error(`Error reading ${type}:`, e);
    }
    
    return [];
}

/**
 * Get a specific item by ID
 * @param {string} type - The data type
 * @param {string} id - The item ID
 * @returns {Object|null} - The item or null if not found
 */
function getItemById(type, id) {
    const items = getItems(type);
    return items.find(item => item.id === id) || null;
}

/**
 * Add a new item
 * @param {string} type - The data type 
 * @param {Object} item - The item to add
 */
function addItem(type, item) {
    if (!DATA_TYPES[type]) {
        console.error(`Invalid data type: ${type}`);
        return;
    }
    
    try {
        // Make sure item has required fields
        if (!item.id) {
            item.id = `${type.toLowerCase()}_${Date.now()}`;
        }
        
        if (!item.createdAt) {
            item.createdAt = new Date().toISOString();
        }
        
        const items = getItems(type);
        items.push(item);
        
        localStorage.setItem(DATA_TYPES[type], JSON.stringify(items));
        
        // Notify any listeners
        document.dispatchEvent(new CustomEvent('dataChanged', {
            detail: { type, action: 'add', item }
        }));
    } catch (e) {
        console.error(`Error adding ${type}:`, e);
        throw e;
    }
}

/**
 * Update an existing item
 * @param {string} type - The data type
 * @param {string} id - The item ID
 * @param {Object} updates - The updates to apply
 */
function updateItem(type, id, updates) {
    if (!DATA_TYPES[type]) {
        console.error(`Invalid data type: ${type}`);
        return;
    }
    
    try {
        const items = getItems(type);
        const index = items.findIndex(item => item.id === id);
        
        if (index === -1) {
            console.error(`Item not found: ${id}`);
            return;
        }
        
        // Ensure updatedAt field
        updates.updatedAt = new Date().toISOString();
        
        // Preserve id and createdAt
        updates.id = id;
        updates.createdAt = items[index].createdAt;
        
        // Update the item
        items[index] = updates;
        
        localStorage.setItem(DATA_TYPES[type], JSON.stringify(items));
        
        // Notify any listeners
        document.dispatchEvent(new CustomEvent('dataChanged', {
            detail: { type, action: 'update', item: updates }
        }));
    } catch (e) {
        console.error(`Error updating ${type}:`, e);
        throw e;
    }
}

/**
 * Delete an item
 * @param {string} type - The data type
 * @param {string} id - The item ID
 */
function deleteItem(type, id) {
    if (!DATA_TYPES[type]) {
        console.error(`Invalid data type: ${type}`);
        return;
    }
    
    try {
        const items = getItems(type);
        const filtered = items.filter(item => item.id !== id);
        
        if (filtered.length === items.length) {
            console.warn(`Item not found: ${id}`);
            return;
        }
        
        localStorage.setItem(DATA_TYPES[type], JSON.stringify(filtered));
        
        // Notify any listeners
        document.dispatchEvent(new CustomEvent('dataChanged', {
            detail: { type, action: 'delete', id }
        }));
    } catch (e) {
        console.error(`Error deleting ${type}:`, e);
        throw e;
    }
}

/**
 * Clear all items of a specific type
 * @param {string} type - The data type
 */
function clearItems(type) {
    if (!DATA_TYPES[type]) {
        console.error(`Invalid data type: ${type}`);
        return;
    }
    
    try {
        localStorage.removeItem(DATA_TYPES[type]);
        
        // Add back default categories if clearing categories
        if (type === 'CATEGORIES') {
            localStorage.setItem(DATA_TYPES[type], JSON.stringify(DEFAULT_CATEGORIES));
        }
        
        // Notify any listeners
        document.dispatchEvent(new CustomEvent('dataChanged', {
            detail: { type, action: 'clear' }
        }));
    } catch (e) {
        console.error(`Error clearing ${type}:`, e);
        throw e;
    }
}

// Export functions to window
window.getItems = getItems;
window.getItemById = getItemById;
window.addItem = addItem;
window.updateItem = updateItem;
window.deleteItem = deleteItem;
window.clearItems = clearItems;
window.DATA_TYPES = DATA_TYPES; 