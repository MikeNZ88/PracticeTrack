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

// Refactored Handle search input
function handleSearch(event) {
    console.log('[DEBUG] Search triggered');
    const searchTerm = event.target.value.trim().toLowerCase();
    console.log('[DEBUG] Search term:', searchTerm);

    const filterButtons = document.querySelectorAll('.filter-button');
    filterButtons.forEach(button => {
        button.disabled = !!searchTerm;
        button.classList.toggle('disabled', !!searchTerm);
    });

    const familySections = document.querySelectorAll('.family-section');

    familySections.forEach(familySection => {
        const familyTitle = familySection.querySelector('.family-title')?.textContent.toLowerCase() || '';
        let familyShouldBeVisible = familyTitle.includes(searchTerm); // Visible if title matches

        const instrumentSections = familySection.querySelectorAll('.instrument-section');
        instrumentSections.forEach(instrumentSection => {
            const instrumentTitle = instrumentSection.querySelector('.instrument-title')?.textContent.toLowerCase() || '';
            let instrumentShouldBeVisible = instrumentTitle.includes(searchTerm); // Visible if title matches

            const categoryItems = instrumentSection.querySelectorAll('.category-item');
            categoryItems.forEach(item => {
                const categoryName = item.querySelector('.category-name')?.textContent.toLowerCase() || '';
                // Item is visible if its name, instrument title, or family title matches
                const itemMatchesSearch = categoryName.includes(searchTerm) || instrumentTitle.includes(searchTerm) || familyTitle.includes(searchTerm);

                item.style.display = itemMatchesSearch ? 'block' : 'none';

                // If an item is visible, its parent instrument section should also be visible
                if (itemMatchesSearch) {
                    instrumentShouldBeVisible = true;
                }
            });

            instrumentSection.style.display = instrumentShouldBeVisible ? 'block' : 'none';

            // If an instrument section is visible, its parent family section should also be visible
            if (instrumentShouldBeVisible) {
                familyShouldBeVisible = true;
            }
        });

        familySection.style.display = familyShouldBeVisible ? 'block' : 'none';
    });

    // If search term is empty, ensure everything is visible and filters enabled
    if (searchTerm === '') {
        document.querySelectorAll('.family-section, .instrument-section, .category-item').forEach(el => {
            el.style.display = 'block';
        });
         // Re-apply the active filter if search is cleared
         const activeFilter = document.querySelector('.filter-button.active');
         if (activeFilter && activeFilter.dataset.family !== 'all') {
             handleFilter(activeFilter); // Re-apply filter
         }
    }
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
        showResourceMessage('Category already exists!', 'warning');
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
    showResourceMessage('Category added successfully!', 'success');
}

// Show message notification (Renamed Function)
function showResourceMessage(text, type = 'success') {
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