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
        window.initializeData();
        moduleStates.data = true;
    }
    
    // Setup navigation
    setupNavigation();
    
    // Initialize theme
    initializeTheme();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    // Initialize timer
    if (typeof window.Timer === 'function') {
        window.timer = new Timer();
        moduleStates.timer = true;
    }
    
    // Check if all modules are initialized
    if (areAllModulesInitialized()) {
        // Navigate to initial page
        navigateToPage('timer');
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
            // Reset timer when navigating to timer page
            if (window.timer) {
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

// Make functions available to window object
window.initializeApp = initializeApp;
window.setupNavigation = setupNavigation;
window.navigateToPage = navigateToPage;
window.initializeTheme = initializeTheme; 