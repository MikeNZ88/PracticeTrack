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
    const searchTerm = event.target.value.toLowerCase();
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
    
    // Get all category items
    const categoryItems = document.querySelectorAll('.category-item');
    
    // First, handle all category items
    categoryItems.forEach(item => {
        // Get all text content from the item and its parent instrument section
        const categoryName = item.querySelector('.category-name')?.textContent.toLowerCase() || '';
        const instrumentTitle = item.closest('.instrument-section')?.querySelector('.instrument-title')?.textContent.toLowerCase() || '';
        const familyTitle = item.closest('.family-section')?.querySelector('.family-title')?.textContent.toLowerCase() || '';
        
        // Check if any of the text content matches the search term
        const matchesSearch = searchTerm === '' || 
            categoryName.includes(searchTerm) ||
            instrumentTitle.includes(searchTerm) ||
            familyTitle.includes(searchTerm);
        
        // Show/hide based on search term
        item.style.display = matchesSearch ? 'block' : 'none';
    });
    
    // Then handle all instrument sections
    document.querySelectorAll('.instrument-section').forEach(section => {
        const sectionItems = section.querySelectorAll('.category-item');
        const hasVisibleItems = Array.from(sectionItems)
            .some(item => item.style.display !== 'none');
        
        // Show/hide section based on whether it has any visible items
        section.style.display = hasVisibleItems ? 'block' : 'none';
    });
    
    // Finally handle all family sections
    document.querySelectorAll('.family-section').forEach(familySection => {
        const instrumentSections = familySection.querySelectorAll('.instrument-section');
        const hasVisibleSections = Array.from(instrumentSections)
            .some(section => section.style.display !== 'none');
        
        // Show/hide family section based on whether it has any visible instrument sections
        familySection.style.display = hasVisibleSections ? 'block' : 'none';
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
        } else {
            section.style.display = 'none';
        }
    });
}

// Filter categories based on search term
function filterCategories(searchTerm) {
    // Get all instrument sections
    const instrumentSections = document.querySelectorAll('.instrument-section');
    
    // First, handle all category items
    instrumentSections.forEach(section => {
        const categoryItems = section.querySelectorAll('.category-item');
        let hasVisibleItems = false;
        
        categoryItems.forEach(item => {
            const title = item.querySelector('h3')?.textContent.toLowerCase() || '';
            const description = item.querySelector('p')?.textContent.toLowerCase() || '';
            const notes = item.querySelector('.notes')?.textContent.toLowerCase() || '';
            
            const matchesSearch = searchTerm === '' || 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                notes.includes(searchTerm);
            
            // Show/hide based on search term
            item.style.display = matchesSearch ? 'block' : 'none';
            if (matchesSearch) hasVisibleItems = true;
        });
        
        // Show/hide instrument section based on whether it has any visible items
        section.style.display = hasVisibleItems ? 'block' : 'none';
    });
    
    // Then handle all family sections
    document.querySelectorAll('.family-section').forEach(familySection => {
        const instrumentSections = familySection.querySelectorAll('.instrument-section');
        const hasVisibleInstrumentSections = Array.from(instrumentSections)
            .some(section => section.style.display !== 'none');
        
        // Show/hide family section based on whether it has any visible instrument sections
        familySection.style.display = hasVisibleInstrumentSections ? 'block' : 'none';
    });
}

// Handle copying a category
function handleCopy(button) {
    const categoryItem = button.closest('.category-item');
    const categoryName = categoryItem.querySelector('.category-name')?.textContent || '';
    const description = categoryItem.querySelector('.description')?.textContent || '';
    const notes = categoryItem.querySelector('.notes')?.textContent || '';
    
    // Get existing categories from localStorage
    const existingCategories = JSON.parse(localStorage.getItem('practiceTrack_categories') || '[]');
    
    // Check if category already exists
    const categoryExists = existingCategories.some(cat => cat.name === categoryName);
    
    if (categoryExists) {
        showMessage('Category already exists in your list', 'warning');
        return;
    }
    
    // Add new category
    const newCategory = {
        id: `category_${Date.now()}`,
        name: categoryName,
        description,
        notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        custom: true
    };
    
    existingCategories.push(newCategory);
    localStorage.setItem('practiceTrack_categories', JSON.stringify(existingCategories));
    
    // Dispatch a custom event to notify that categories have been updated
    const event = new CustomEvent('categoriesUpdated', {
        detail: { categories: existingCategories }
    });
    document.dispatchEvent(event);
    
    showMessage('Category added to your list', 'success');
}

// Generate a unique ID for new categories
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Show message notification
function showMessage(message, type = 'success') {
    const messageElement = document.createElement('div');
    messageElement.className = `message message-${type}`;
    messageElement.textContent = message;
    
    document.body.appendChild(messageElement);
    
    // Remove message after 3 seconds
    setTimeout(() => {
        messageElement.classList.add('message-hide');
        setTimeout(() => messageElement.remove(), 300);
    }, 3000);
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('resources-page')) {
        initializeResources();
    }
});

// Update navigation handler to initialize resources page
document.addEventListener('navigation', (event) => {
    if (event.detail.page === 'resources') {
        initializeResources();
    }
}); 