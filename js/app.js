// Navigation state
let currentPage = 'timer';

// DOM Elements
let mainNav;
let mobileNav;
let pages;

// Module initialization state
const moduleStates = {
    data: false,
    timer: false,
    settings: false,
    stats: false,
    sessions: false,
    goals: false,
    media: false
};

// Check if all modules are initialized
const areAllModulesInitialized = () => {
    return Object.values(moduleStates).every(state => state === true);
};

// Initialize app function
const initializeApp = () => {
    console.log('Initializing app');
    
    // Initialize data layer first
    if (typeof window.initializeData === 'function') {
        window.initializeData(); // Use data.js's function if available
    } else {
        initializeDataLayer(); // Fallback to local implementation
    }
    
    // Setup navigation
    setupNavigation();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Navigate to initial page
    navigateToPage(currentPage || 'timer');
    
    console.log('App initialization complete');
};

// Initialize data layer
const initializeDataLayer = () => {
    console.log('Initializing data layer');
    
    try {
        // Import keys from data.js if available
        const KEYS = window.STORAGE_KEYS || {
            CATEGORIES: 'practiceTrack_categories',
            SESSIONS: 'practiceTrack_sessions',
            GOALS: 'practiceTrack_goals',
            MEDIA: 'practiceTrack_media',
            SETTINGS: 'practiceTrack_settings'
        };
        
        // Ensure localStorage has practiceTrack_categories
        const categories = JSON.parse(localStorage.getItem(KEYS.CATEGORIES)) || [];
        if (categories.length === 0) {
            // Add some default categories
            const defaultCategories = [
                { id: 'cat_warmup', name: 'Warm-up', custom: false },
                { id: 'cat_technique', name: 'Technique', custom: false },
                { id: 'cat_repertoire', name: 'Repertoire', custom: false },
                { id: 'cat_sightreading', name: 'Sight-reading', custom: false },
                { id: 'cat_theory', name: 'Theory', custom: false }
            ];
            localStorage.setItem(KEYS.CATEGORIES, JSON.stringify(defaultCategories));
            console.log('Added default categories');
        }
        
        // Ensure localStorage has practiceTrack_sessions
        const sessions = JSON.parse(localStorage.getItem(KEYS.SESSIONS)) || [];
        if (!Array.isArray(sessions)) {
            localStorage.setItem(KEYS.SESSIONS, JSON.stringify([]));
            console.log('Initialized empty sessions array');
        }
        
        moduleStates.data = true;
        console.log('Data layer initialized successfully');
    } catch (error) {
        console.error('Error initializing data layer:', error);
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app initialization');
    initializeApp();
});

// Create sample data if initialization function is missing
const createSampleData = () => {
    console.log('Creating sample data as fallback');
    
    // Sample sessions
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
    
    // Sample categories
    const sampleCategories = [
        { id: 'c-1', name: 'Scales', isHidden: false },
        { id: 'c-2', name: 'Technique', isHidden: false },
        { id: 'c-3', name: 'Repertoire', isHidden: false },
        { id: 'c-4', name: 'Sight Reading', isHidden: false },
        { id: 'c-5', name: 'Theory', isHidden: false }
    ];
    
    // Store in localStorage
    try {
        localStorage.setItem('practice_sessions', JSON.stringify(sampleSessions));
        localStorage.setItem('practice_categories', JSON.stringify(sampleCategories));
        console.log('Sample data created successfully');
    } catch (e) {
        console.error('Error creating sample data:', e);
    }
};

// Setup navigation
const setupNavigation = () => {
    console.log('Setting up navigation');
    
    // Get DOM elements
    mainNav = document.querySelector('.main-nav');
    mobileNav = document.querySelector('.mobile-nav');
    pages = document.querySelectorAll('.page');
    
    if (!mainNav || !mobileNav || !pages.length) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Add event listeners to main nav items
    const mainNavItems = mainNav.querySelectorAll('.nav-item');
    mainNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Add event listeners to mobile nav items
    const mobileNavItems = mobileNav.querySelectorAll('.nav-item');
    mobileNavItems.forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Add event listener for settings button in header
    const headerSettingsButton = document.getElementById('header-settings-button');
    if (headerSettingsButton) {
        headerSettingsButton.addEventListener('click', () => {
            navigateToPage('settings');
        });
    }
};

// Navigation function
window.navigateToPage = navigateToPage = (page) => {
    console.log(`Navigating to page: ${page}`);
    
    if (!mainNav || !mobileNav || !pages.length) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Update nav states
    const mainNavItems = mainNav.querySelectorAll('.nav-item');
    mainNavItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    const mobileNavItems = mobileNav.querySelectorAll('.nav-item');
    mobileNavItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Update page visibility
    pages.forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });
    
    // Initialize page-specific content
    switch (page) {
        case 'settings':
            if (typeof window.initializeSettings === 'function') {
                window.initializeSettings();
                moduleStates.settings = true;
            }
            break;
        case 'stats':
            if (typeof window.initializeStats === 'function') {
                window.initializeStats();
                moduleStates.stats = true;
            }
            break;
        case 'sessions':
            // Always make sure data is initialized first
            if (typeof window.initializeData === 'function') {
                window.initializeData();
            }
            
            // Then initialize sessions page
            if (typeof window.initializeSessions === 'function') {
                window.initializeSessions();
                moduleStates.sessions = true;
            } else {
                console.error('Sessions initialization function not found');
            }
            break;
        case 'goals':
            if (typeof window.initializeGoals === 'function') {
                window.initializeGoals();
                moduleStates.goals = true;
            }
            break;
        case 'media':
            if (typeof window.initializeMedia === 'function') {
                window.initializeMedia();
                moduleStates.media = true;
            }
            break;
        case 'timer':
            // Activate timer page
            if (typeof window.activateTimerPage === 'function') {
                window.activateTimerPage();
            } else if (window.timer) {
                // Reset timer when navigating to timer page
                window.timer.resetTimer();
                window.timer.loadCategories();
            }
            break;
    }
    
    // Update current page
    currentPage = page;
};

// Initialize theme
const initializeTheme = () => {
    console.log('Initializing theme');
    
    // Get theme from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.toggle('theme-dark', savedTheme === 'dark');
    
    // Add theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const isDark = document.body.classList.toggle('theme-dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
        });
    }
};

// Function to update category dropdowns across the app
window.updateCategoryDropdowns = function() {
    console.log('Updating all category dropdowns');
    
    // Dispatch a categoriesChanged event for other modules to listen to
    document.dispatchEvent(new CustomEvent('categoriesChanged', {
        detail: { timestamp: new Date().toISOString() }
    }));
    console.log('categoriesChanged event dispatched');
    
    // Show a debug notification
    if (window.showNotification) {
        window.showNotification('Categories updated', 'All category dropdowns have been refreshed');
    }
    
    // Ensure categories are properly updated in sessions page if it's the current page
    if (currentPage === 'sessions' && typeof window.initializeSessions === 'function') {
        console.log('Reinitializing sessions page after category update');
        window.initializeSessions();
    }
    
    // Also update the Timer instance if it exists
    if (window.timer && typeof window.timer.loadCategories === 'function') {
        console.log('Updating Timer instance categories');
        window.timer.loadCategories();
    }
    
    // Call specific update functions if they exist
    if (typeof window.updateTimerCategories === 'function') {
        console.log('Calling updateTimerCategories');
        window.updateTimerCategories();
    }
    
    if (typeof window.updateSessionCategories === 'function') {
        console.log('Calling updateSessionCategories');
        window.updateSessionCategories();
    }
    
    console.log('Category dropdowns updated successfully');
};

// Listen for categoriesChanged event
document.addEventListener('categoriesChanged', (event) => {
    console.log('Categories changed event received:', event.detail);
    // Don't call updateCategoryDropdowns here to avoid circular reference
});

// Only keep the initialization at the top of the file - remove duplicate initialization at the bottom
// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app');
        initializeApp();
    });
} else {
    console.log('DOM already loaded, initializing app immediately');
    initializeApp();
}

// Make functions available to window object
window.initializeApp = initializeApp;
window.setupNavigation = setupNavigation;
window.navigateToPage = navigateToPage;
window.initializeTheme = initializeTheme;

// Simple notification function for debugging
window.showNotification = function(title, message) {
    console.log(`NOTIFICATION: ${title} - ${message}`);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'debug-notification';
    notification.innerHTML = `
        <h4>${title}</h4>
        <p>${message}</p>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#4CAF50';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    notification.style.maxWidth = '300px';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        // Remove from DOM after fade out
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 500);
    }, 3000);
}; 