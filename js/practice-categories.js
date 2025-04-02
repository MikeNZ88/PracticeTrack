// Practice Categories Module
// Manages the practice categories library and copying functionality

// Initialize resources page
function initializeResources() {
    console.log('Initializing resources page');
    
    const searchInput = document.getElementById('search-input');
    const filterButtons = document.querySelectorAll('.filter-button');
    const copyButtons = document.querySelectorAll('.copy-button');

    // Set up search functionality
    if (searchInput) {
        searchInput.addEventListener('input', handleSearch);
    }

    // Set up filter buttons
    filterButtons.forEach(button => {
        button.addEventListener('click', () => handleFilter(button));
    });

    // Set up copy buttons
    copyButtons.forEach(button => {
        button.addEventListener('click', () => handleCopy(button));
    });

    // Initialize Lucide icons
    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Handle search input
function handleSearch(event) {
    console.log('Search triggered');
    const searchTerm = event.target.value.trim().toLowerCase();
    console.log('Search term:', searchTerm);
    
    const filterButtons = document.querySelectorAll('.filter-button');
    
    // If there's a search term, disable and grey out filter buttons
    if (searchTerm) {
        filterButtons.forEach(button => {
            button.classList.add('disabled');
            button.disabled = true;
        });
    } else {
        filterButtons.forEach(button => {
            button.classList.remove('disabled');
            button.disabled = false;
        });
    }
    
    // Get all elements
    const categoryItems = document.querySelectorAll('.category-item');
    const instrumentSections = document.querySelectorAll('.instrument-section');
    const familySections = document.querySelectorAll('.family-section');
    
    console.log('Found elements:', {
        categoryItems: categoryItems.length,
        instrumentSections: instrumentSections.length,
        familySections: familySections.length
    });
    
    // First, handle all category items
    categoryItems.forEach(item => {
        const categoryName = item.querySelector('.category-name')?.textContent.toLowerCase() || '';
        const instrumentTitle = item.closest('.instrument-section')?.querySelector('.instrument-title')?.textContent.toLowerCase() || '';
        const familyTitle = item.closest('.family-section')?.querySelector('.family-title')?.textContent.toLowerCase() || '';
        
        console.log('Checking item:', {
            categoryName,
            instrumentTitle,
            familyTitle
        });
        
        const matchesSearch = searchTerm === '' || 
            categoryName.includes(searchTerm) ||
            instrumentTitle.includes(searchTerm) ||
            familyTitle.includes(searchTerm);
        
        item.style.display = matchesSearch ? 'block' : 'none';
    });
    
    // Then handle instrument sections
    instrumentSections.forEach(section => {
        const visibleItems = section.querySelectorAll('.category-item[style="display: block"]');
        const instrumentTitle = section.querySelector('.instrument-title')?.textContent.toLowerCase() || '';
        const familyTitle = section.closest('.family-section')?.querySelector('.family-title')?.textContent.toLowerCase() || '';
        
        console.log('Checking instrument section:', {
            instrumentTitle,
            familyTitle,
            visibleItems: visibleItems.length
        });
        
        const matchesSearch = searchTerm === '' || 
            instrumentTitle.includes(searchTerm) ||
            familyTitle.includes(searchTerm) ||
            visibleItems.length > 0;
        
        section.style.display = matchesSearch ? 'block' : 'none';
    });
    
    // Finally handle family sections
    familySections.forEach(section => {
        const visibleInstruments = section.querySelectorAll('.instrument-section[style="display: block"]');
        const familyTitle = section.querySelector('.family-title')?.textContent.toLowerCase() || '';
        
        console.log('Checking family section:', {
            familyTitle,
            visibleInstruments: visibleInstruments.length
        });
        
        const matchesSearch = searchTerm === '' || 
            familyTitle.includes(searchTerm) ||
            visibleInstruments.length > 0;
        
        section.style.display = matchesSearch ? 'block' : 'none';
    });
}

// Handle filter button clicks
function handleFilter(button) {
    const family = button.dataset.family;
    const searchInput = document.getElementById('search-input');
    const searchTerm = searchInput.value.toLowerCase();
    
    // If there's a search term, don't apply filters
    if (searchTerm) {
        return;
    }
    
    // Update active state of filter buttons
    document.querySelectorAll('.filter-button').forEach(btn => {
        btn.classList.remove('active');
    });
    button.classList.add('active');
    
    // Show/hide sections based on filter
    document.querySelectorAll('.family-section').forEach(section => {
        if (family === 'all' || section.dataset.family === family) {
            section.style.display = 'block';
            // Show all category items within this family
            section.querySelectorAll('.category-item').forEach(item => {
                item.style.display = 'block';
            });
            // Show all instrument sections within this family
            section.querySelectorAll('.instrument-section').forEach(instrument => {
                instrument.style.display = 'block';
            });
        } else {
            section.style.display = 'none';
        }
    });
}

// Handle copy button clicks
function handleCopy(button) {
    const categoryName = button.dataset.category;
    const instrumentFamily = button.classList.contains('brass') ? 'brass' :
                            button.classList.contains('drums') ? 'drums' :
                            button.classList.contains('keyboard') ? 'keyboard' :
                            button.classList.contains('stringed') ? 'stringed' :
                            button.classList.contains('woodwind') ? 'woodwind' : '';

    // Get existing categories
    const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    // Check if category already exists
    const existingCategory = categories.find(c => c.name === categoryName && c.family === instrumentFamily);
    if (existingCategory) {
        showMessage('Category already exists!', 'warning');
        return;
    }
    
    // Add new category
    const newCategory = {
        id: Date.now().toString(),
        name: categoryName,
        family: instrumentFamily,
        isDefault: false,
        isVisible: true
    };
    
    categories.push(newCategory);
    localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
    
    // Show success message
    showMessage('Category added successfully!', 'success');
}

// Show message notification
function showMessage(text, type = 'success') {
    // Remove any existing message
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create new message
    const message = document.createElement('div');
    message.className = `message message-${type}`;
    message.textContent = text;
    
    // Add to document
    document.body.appendChild(message);
    
    // Remove after 3 seconds
    setTimeout(() => {
        message.classList.add('message-hide');
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Make functions available globally
window.initializeResources = initializeResources;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('resources-page')) {
        initializeResources();
    }
});

// Initialize when page changes to resources
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'resources') {
        initializeResources();
    }
}); 