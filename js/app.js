// Navigation state
let currentPage = 'timer';

// DOM Elements
let mainNav;
let mobileNav;
let pages;

// Initialize app
const initializeApp = () => {
    try {
        console.log('Starting app initialization...');
        
        // Get DOM elements
        mainNav = document.querySelector('.main-nav');
        mobileNav = document.querySelector('.mobile-nav');
        pages = document.querySelectorAll('.page');

        if (!mainNav || !mobileNav || !pages.length) {
            throw new Error('Required DOM elements not found');
        }
        console.log('DOM elements found successfully');

        // Initialize data layer first
        if (typeof window.initializeData === 'function') {
            console.log('Initializing data layer...');
            window.initializeData();
            console.log('Data layer initialized');
        } else {
            console.error('Data layer initialization function not found');
            // Try to create some sample data directly
            createSampleData();
        }
        
        // Initialize theme
        if (typeof window.initializeTheme === 'function') {
            console.log('Initializing theme...');
            window.initializeTheme();
            console.log('Theme initialized');
        }
        
        // Check storage capacity
        if (typeof window.checkStorageCapacity === 'function') {
            console.log('Checking storage capacity...');
            window.checkStorageCapacity();
            console.log('Storage capacity checked');
        }
        
        // Initialize Lucide icons
        if (typeof window.lucide === 'object') {
            console.log('Initializing Lucide icons...');
            window.lucide.createIcons();
            console.log('Lucide icons initialized');
        }
        
        // Setup navigation
        console.log('Setting up navigation...');
        setupNavigation();
        console.log('Navigation setup complete');
        
        // Add event listener for the header settings button
        const headerSettingsButton = document.getElementById('header-settings-button');
        if (headerSettingsButton) {
            headerSettingsButton.addEventListener('click', () => {
                navigateToPage('settings');
            });
        }
        
        // Navigate to initial page and initialize timer
        console.log('Navigating to initial page...');
        navigateToPage('timer');
    } catch (error) {
        console.error('Error during app initialization:', error);
        alert('There was an error initializing the application. Please refresh the page.');
    }
};

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
    // Desktop navigation
    mainNav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
    
    // Mobile navigation
    mobileNav.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateToPage(page);
        });
    });
};

// Navigate to page
const navigateToPage = (pageId) => {
    console.log('Navigating to:', pageId);
    
    // Update page visibility
    pages.forEach(page => {
        page.classList.remove('active');
        if (page.id === `${pageId}-page`) {
            page.classList.add('active');
        }
    });
    
    // Update navigation state
    currentPage = pageId;
    
    // Update navigation UI
    updateNavigationUI();
    
    // Initialize page-specific functionality
    initializePage(pageId);
};

// Update navigation UI
const updateNavigationUI = () => {
    // Desktop navigation
    mainNav.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === currentPage);
    });
    
    // Mobile navigation
    mobileNav.querySelectorAll('.nav-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === currentPage);
    });
};

// Initialize page-specific functionality
const initializePage = (pageId) => {
    console.log('Initializing page:', pageId);
    
    switch(pageId) {
        case 'timer':
            if (typeof window.initializeTimer === 'function') {
                window.initializeTimer();
            }
            break;
        case 'sessions':
            if (typeof window.initializeSessions === 'function') {
                window.initializeSessions();
            }
            break;
        case 'goals':
            console.log('Attempting to initialize goals page');
            if (typeof window.initializeGoals === 'function') {
                console.log('initializeGoals function found, calling it');
                window.initializeGoals();
            } else {
                console.error('initializeGoals function not found on window object');
            }
            break;
        case 'stats':
            console.log('Initializing stats page...');
            if (typeof window.initializeStats === 'function') {
                window.initializeStats();
            } else {
                console.error('initializeStats function not found');
            }
            break;
        case 'media':
            if (typeof window.initializeMedia === 'function') {
                console.log('Initializing media page...');
                window.initializeMedia();
                
                // Force a reload of media list after a brief delay
                setTimeout(() => {
                    if (typeof window.loadMedia === 'function') {
                        console.log('Reloading media items...');
                        window.loadMedia();
                    }
                }, 100);
            }
            break;
        case 'settings':
            if (typeof window.initializeSettings === 'function') {
                window.initializeSettings();
            }
            break;
    }
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app initialization...');
    initializeApp();
}); 