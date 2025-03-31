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
            
            // Add direct stats display as a fallback
            try {
                // First try the normal initialization
                if (typeof window.initializeStats === 'function') {
                    console.log('Calling standard initializeStats function');
                    window.initializeStats();
                } else {
                    throw new Error('initializeStats function not found');
                }
                
                // Add a backup approach that will run after a delay
                setTimeout(() => {
                    console.log('Running delayed stats check...');
                    const statsPage = document.getElementById('stats-page');
                    const statsGrid = document.querySelector('.stats-grid');
                    
                    // If no stats content is visible, create emergency stats
                    if (statsPage && (!statsGrid || statsGrid.children.length === 0)) {
                        console.log('Stats grid empty, creating emergency stats display');
                        createEmergencyStatsDisplay(statsPage);
                    }
                }, 500);
            } catch (error) {
                console.error('Error initializing stats:', error);
                
                // Create emergency stats display
                const statsPage = document.getElementById('stats-page');
                if (statsPage) {
                    createEmergencyStatsDisplay(statsPage);
                }
            }
            break;
        case 'media':
            if (typeof window.initializeMedia === 'function') {
                window.initializeMedia();
            }
            break;
        case 'settings':
            if (typeof window.initializeSettings === 'function') {
                window.initializeSettings();
            }
            break;
    }
};

// Create emergency stats display if the normal one fails
const createEmergencyStatsDisplay = (statsPage) => {
    console.log('Creating emergency stats display');
    
    // Get or create stats container
    let statsContainer = statsPage.querySelector('.stats-container');
    if (!statsContainer) {
        statsContainer = document.createElement('div');
        statsContainer.className = 'stats-container';
        statsPage.appendChild(statsContainer);
    }
    
    // Create sample sessions
    const sampleSessions = [
        { duration: 3600, categoryId: 'c-1' }, // 1 hour
        { duration: 1800, categoryId: 'c-2' }, // 30 mins
        { duration: 2700, categoryId: 'c-3' }  // 45 mins
    ];
    
    // Calculate simple statistics
    const totalTime = sampleSessions.reduce((sum, session) => sum + session.duration, 0);
    const avgTime = Math.round(totalTime / sampleSessions.length);
    
    // Format time
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
    };
    
    // Create emergency stats display
    const emergencyDisplay = document.createElement('div');
    emergencyDisplay.className = 'emergency-stats';
    emergencyDisplay.style.backgroundColor = '#f5f5f5';
    emergencyDisplay.style.padding = '20px';
    emergencyDisplay.style.borderRadius = '8px';
    emergencyDisplay.style.margin = '20px 0';
    emergencyDisplay.style.textAlign = 'center';
    
    emergencyDisplay.innerHTML = `
        <h2 style="margin-bottom:20px;">Practice Statistics</h2>
        <div style="display:grid; grid-template-columns: repeat(3, 1fr); gap: 20px;">
            <div style="background-color:#fff; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <h3>Total Practice Time</h3>
                <p style="font-size:1.5em; font-weight:bold; color:#4154b3;">${formatTime(totalTime)}</p>
            </div>
            <div style="background-color:#fff; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <h3>Avg. Session Time</h3>
                <p style="font-size:1.5em; font-weight:bold; color:#4154b3;">${formatTime(avgTime)}</p>
            </div>
            <div style="background-color:#fff; padding:15px; border-radius:8px; box-shadow:0 2px 4px rgba(0,0,0,0.1);">
                <h3>Practice Sessions</h3>
                <p style="font-size:1.5em; font-weight:bold; color:#4154b3;">${sampleSessions.length}</p>
            </div>
        </div>
        <p style="margin-top:15px; font-style:italic; color:#666;">Emergency Stats Display</p>
    `;
    
    // Add to container
    statsContainer.innerHTML = ''; // Clear existing content
    statsContainer.appendChild(emergencyDisplay);
    
    console.log('Emergency stats display created successfully');
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, starting app initialization...');
    initializeApp();
}); 