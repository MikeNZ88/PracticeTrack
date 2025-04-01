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
    
    // Initialize data layer
    initializeDataLayer();
    
    // Setup navigation
    setupNavigation();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Initialize timer if on timer page
    if (document.querySelector('.timer-container')) {
        console.log('Initializing timer from app');
        if (typeof window.initTimer === 'function') {
            window.initTimer();
            moduleStates.timer = true;
        }
    }
    
    // Navigate to initial page
    navigateToPage(currentPage || 'timer');
    
    console.log('App initialization complete');
};

// Initialize data layer
const initializeDataLayer = () => {
    console.log('Initializing data layer');
    
    try {
        // Ensure localStorage has practiceTrack_categories
        const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        if (categories.length === 0) {
            // Add some default categories
            const defaultCategories = [
                { id: 'cat_warmup', name: 'Warm-up', custom: false },
                { id: 'cat_technique', name: 'Technique', custom: false },
                { id: 'cat_repertoire', name: 'Repertoire', custom: false },
                { id: 'cat_sightreading', name: 'Sight-reading', custom: false },
                { id: 'cat_theory', name: 'Theory', custom: false }
            ];
            localStorage.setItem('practiceTrack_categories', JSON.stringify(defaultCategories));
            console.log('Added default categories');
        }
        
        // Ensure localStorage has practiceTrack_sessions
        const sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
        if (!Array.isArray(sessions)) {
            localStorage.setItem('practiceTrack_sessions', JSON.stringify([]));
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
            if (typeof window.initializeSettings === 'function' && !moduleStates.settings) {
                window.initializeSettings();
                moduleStates.settings = true;
            }
            break;
        case 'stats':
            if (typeof window.initializeStats === 'function' && !moduleStates.stats) {
                window.initializeStats();
                moduleStates.stats = true;
            }
            break;
        case 'sessions':
            if (typeof window.initializeSessions === 'function' && !moduleStates.sessions) {
                window.initializeSessions();
                moduleStates.sessions = true;
            }
            break;
        case 'goals':
            if (typeof window.initializeGoals === 'function' && !moduleStates.goals) {
                window.initializeGoals();
                moduleStates.goals = true;
            }
            break;
        case 'media':
            if (typeof window.initializeMedia === 'function' && !moduleStates.media) {
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
    document.dispatchEvent(new Event('categoriesChanged'));
    
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
    updateCategoryDropdowns();
});

// Set up global access to the updateCategoryDropdowns function
window.updateCategoryDropdowns = updateCategoryDropdowns;

// Initialize app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('DOM loaded, initializing app');
        initNavigation();
        
        // Initialize category dropdowns
        updateCategoryDropdowns();
    });
} else {
    console.log('DOM already loaded, initializing app immediately');
    initNavigation();
    
    // Initialize category dropdowns
    updateCategoryDropdowns();
}

// Make functions available to window object
window.initializeApp = initializeApp;
window.setupNavigation = setupNavigation;
window.navigateToPage = navigateToPage;
window.initializeTheme = initializeTheme; 