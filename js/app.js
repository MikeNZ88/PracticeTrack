// Navigation state
let currentPage = 'timer';

// DOM Elements
let mainNav;
let pages;

// Initialize app function
const initializeApp = () => {
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
};

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

// Setup navigation
const setupNavigation = () => {
    // Get DOM elements
    mainNav = document.querySelector('.main-nav');
    const mobileNav = document.querySelector('.mobile-nav');
    pages = document.querySelectorAll('.page');
    
    if (!mainNav || !pages.length) {
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
    if (mobileNav) {
        const mobileNavItems = mobileNav.querySelectorAll('.nav-item');
        mobileNavItems.forEach(item => {
            item.addEventListener('click', () => {
                const page = item.dataset.page;
                navigateToPage(page);
            });
        });
    }
    
    // Add event listener for settings button in header
    const headerSettingsButton = document.getElementById('header-settings-button');
    if (headerSettingsButton) {
        headerSettingsButton.addEventListener('click', () => {
            navigateToPage('settings');
        });
    }
};

// Navigation function
const navigateToPage = (page) => {
    if (!mainNav || !pages.length) {
        console.error('Required DOM elements not found');
        return;
    }
    
    // Update desktop nav states
    const mainNavItems = mainNav.querySelectorAll('.nav-item');
    mainNavItems.forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    // Update mobile nav states
    const mobileNav = document.querySelector('.mobile-nav');
    if (mobileNav) {
        const mobileNavItems = mobileNav.querySelectorAll('.nav-item');
        mobileNavItems.forEach(item => {
            item.classList.toggle('active', item.dataset.page === page);
        });
    }
    
    // Update page visibility
    pages.forEach(p => {
        p.classList.toggle('active', p.id === `${page}-page`);
    });
    
    // Dispatch page changed event
    document.dispatchEvent(new CustomEvent('pageChanged', {
        detail: page
    }));
    
    // Initialize page-specific content
    switch (page) {
        case 'sessions':
            if (typeof window.initializeSessions === 'function') {
                window.initializeSessions();
            }
            break;
        case 'goals':
            if (typeof window.initializeGoals === 'function') {
                window.initializeGoals();
            }
            break;
        case 'stats':
            if (typeof window.initStats === 'function') {
                window.initStats();
            }
            break;
        case 'media':
            if (typeof window.initializeMedia === 'function') {
                window.initializeMedia();
            }
            break;
        case 'timer':
            if (typeof window.activateTimerPage === 'function') {
                window.activateTimerPage();
            }
            break;
        case 'settings':
            if (typeof window.initializeSettings === 'function') {
                window.initializeSettings();
            }
            break;
        case 'resources':
            if (typeof window.initializeResources === 'function') {
                window.initializeResources();
            }
            break;
    }
    
    // Update current page
    currentPage = page;
};

// Initialize theme
const initializeTheme = () => {
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
    // Dispatch a categoriesChanged event for modules to listen to
    document.dispatchEvent(new CustomEvent('dataChanged', {
        detail: { type: 'CATEGORIES', action: 'update' }
    }));
};

// Simple notification function
window.showNotification = function(title, message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
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
    notification.style.opacity = '1';
    notification.style.transition = 'opacity 0.5s';
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        
        // Remove from DOM after fade out
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 500);
    }, 3000);
};

// Make functions available globally
window.initializeApp = initializeApp;
window.navigateToPage = navigateToPage; 