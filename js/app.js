// Navigation state
let currentPage = 'timer';

// DOM Elements
let mainNav;
let mobileNav;
let pages;

// Initialize app function
const initializeApp = () => {
    console.log('Initializing app');
    
    // Setup navigation
    setupNavigation();
    
    // Initialize theme from settings
    initializeTheme();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app initialization...');
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
    const mainNav = document.querySelector('.main-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const pages = document.querySelectorAll('.page');
    
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
    
    // Navigate to initial page
    navigateToPage('timer');
};

// Navigation function
window.navigateToPage = navigateToPage = (page) => {
    console.log(`Navigating to page: ${page}`);
    
    // Get DOM elements
    const mainNav = document.querySelector('.main-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    const pages = document.querySelectorAll('.page');
    
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
    
    // Initialize page-specific content if needed
    if (page === 'settings' && typeof window.initializeSettings === 'function') {
        window.initializeSettings();
    } else if (page === 'stats' && typeof window.initializeStats === 'function') {
        window.initializeStats();
    } else if (page === 'sessions' && typeof window.initializeSessions === 'function') {
        window.initializeSessions();
    } else if (page === 'goals' && typeof window.initializeGoals === 'function') {
        window.initializeGoals();
    } else if (page === 'media' && typeof window.initializeMedia === 'function') {
        window.initializeMedia();
    }
};

// Initialize theme
const initializeTheme = () => {
    console.log('Initializing theme');
    
    // Implementation of initializeTheme function
};

// Add event listener for the header settings button
const headerSettingsButton = document.getElementById('header-settings-button');
if (headerSettingsButton) {
    headerSettingsButton.addEventListener('click', () => {
        navigateToPage('settings');
    });
} 