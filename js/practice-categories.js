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
    
    filterCategories(searchTerm);
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
    document.querySelectorAll('.category-item').forEach(item => {
        const title = item.querySelector('h3').textContent.toLowerCase();
        const description = item.querySelector('p').textContent.toLowerCase();
        const notes = item.querySelector('.notes')?.textContent.toLowerCase() || '';
        
        const matchesSearch = searchTerm === '' || 
            title.includes(searchTerm) || 
            description.includes(searchTerm) || 
            notes.includes(searchTerm);
        
        // Show/hide based only on search term, ignoring instrument filters
        item.style.display = matchesSearch ? 'block' : 'none';
        
        // Show parent sections if any items are visible
        const parentSection = item.closest('.family-section');
        const visibleItems = Array.from(parentSection.querySelectorAll('.category-item'))
            .some(cat => cat.style.display !== 'none');
        parentSection.style.display = visibleItems ? 'block' : 'none';
    });
}

// Handle copying a category
function handleCopy(button) {
    const categoryItem = button.closest('.category-item');
    const title = categoryItem.querySelector('h3').textContent;
    const description = categoryItem.querySelector('p').textContent;
    const notes = categoryItem.querySelector('.notes')?.textContent || '';
    
    // Get existing categories from localStorage
    const existingCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    
    // Check if category already exists
    const categoryExists = existingCategories.some(cat => cat.title === title);
    
    if (categoryExists) {
        showMessage('Category already exists in your list', 'warning');
        return;
    }
    
    // Add new category
    const newCategory = {
        id: generateId(),
        title,
        description,
        notes,
        createdAt: new Date().toISOString()
    };
    
    existingCategories.push(newCategory);
    localStorage.setItem('categories', JSON.stringify(existingCategories));
    
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