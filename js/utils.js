/**
 * PracticeTrack Utilities
 * Shared utility functions used across the application
 */

/**
 * Get color class for a category based on its name
 * @param {string} category - The category name
 * @returns {string} - CSS class for accent color
 */
function getCategoryColorClass(category) {
    category = category.toLowerCase();
    if (category.includes('technique')) return 'accent-blue';
    if (category.includes('theory')) return 'accent-orange';
    if (category.includes('repertoire')) return 'accent-teal';
    if (category.includes('reading')) return 'accent-purple';
    return 'accent-gray'; // Default
}

/**
 * Get category name from category ID
 * @param {string} categoryId - The category ID
 * @returns {string} - The category name
 */
function getCategoryName(categoryId) {
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'No Category';
}

/**
 * Initialize Lucide icons within a specific element
 * @param {HTMLElement} element - The element to initialize icons within
 */
function initializeIcons(element) {
    if (window.lucide && element) {
        try {
            lucide.createIcons({ context: element });
        } catch (e) {
            console.error("Lucide icon initialization error:", e, "on element:", element);
        }
    }
}

/**
 * Format date and time
 * @param {string} dateTime - The date/time string
 * @returns {Object} - Formatted date and time strings
 */
function formatDateTime(dateTime) {
    const date = new Date(dateTime);
    return {
        dateStr: new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(date),
        timeStr: date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })
    };
}

/**
 * Format seconds as HH:MM:SS
 * @param {number} totalSeconds - Total seconds to format
 * @returns {string} - Formatted time string
 */
function formatSecondsAsHMS(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

/**
 * Debounce function to limit how often a function can be called
 * @param {Function} func - The function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} - Debounced function
 */
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * Escape HTML to prevent XSS
 * @param {string} str - String to escape
 * @returns {string} - Escaped string
 */
function escapeHTML(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Export utility functions to global scope for use in other modules
window.Utils = {
    getCategoryColorClass,
    getCategoryName,
    initializeIcons,
    formatDateTime,
    formatSecondsAsHMS,
    debounce,
    escapeHTML
}; 