// DOM Elements
let goalsList;
let addGoalButton;
let goalsSearchInput;
let goalsCategoryFilter;
let goalsStatusFilter;

// Initialize goals page
const initializeGoals = () => {
    console.log('Initializing goals page');
    
    // Get DOM elements
    goalsList = document.getElementById('goals-list');
    addGoalButton = document.getElementById('add-goal-btn');
    goalsSearchInput = document.querySelector('.goals-search-input');
    goalsCategoryFilter = document.querySelector('.goals-category-filter');
    goalsStatusFilter = document.querySelector('.goals-status-filter');
    
    loadGoals();
    setupAddGoalButton();
    setupGoalsFilters();
    console.log('Goals page initialized successfully');
};

// Load and display goals
const loadGoals = (filters = {}) => {
    const goals = window.getItems('GOALS') || [];
    goalsList.innerHTML = '';
    
    // Get current settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const selectedInstruments = settings.instruments || [];
    console.log('Selected instruments for goals:', selectedInstruments);
    
    // Filter goals by selected instruments
    if (selectedInstruments.length && goals) {
        goals = goals.filter(goal => 
            goal.instruments.some(id => selectedInstruments.includes(id))
        );
        console.log(`Filtered to ${goals.length} goals for selected instruments`);
    }
    
    // Apply filters
    let filteredGoals = [...goals];
    
    // Filter by search term
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredGoals = filteredGoals.filter(goal => 
            goal.text.toLowerCase().includes(searchTerm) || 
            (goal.notes && goal.notes.toLowerCase().includes(searchTerm))
        );
    }
    
    // Filter by category
    if (filters.category) {
        filteredGoals = filteredGoals.filter(goal => goal.categoryId === filters.category);
    }
    
    // Filter by status
    if (filters.status) {
        if (filters.status === 'active') {
            filteredGoals = filteredGoals.filter(goal => !goal.completed);
        } else if (filters.status === 'completed') {
            filteredGoals = filteredGoals.filter(goal => goal.completed);
        }
        // 'all' status doesn't filter
    }
    
    // Sort by completion status and then by created date (newest first)
    filteredGoals.sort((a, b) => {
        // First sort by completion status
        if (a.completed !== b.completed) {
            return a.completed ? 1 : -1; // Active goals first
        }
        // Then sort by creation date (newest first)
        return new Date(b.createdAt) - new Date(a.createdAt);
    });
    
    if (filteredGoals.length === 0) {
        // Show empty state message
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i data-lucide="target"></i>
            <p>No goals found. ${filters.status === 'completed' ? 'Complete some goals to see them here.' : 'Add a new goal to get started!'}</p>
        `;
        goalsList.appendChild(emptyState);
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        return;
    }
    
    // Create elements for filtered goals
    filteredGoals.forEach(goal => {
        const goalElement = createGoalElement(goal);
        goalsList.appendChild(goalElement);
    });
    
    // Refresh Lucide icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
};

// Setup goals filters
const setupGoalsFilters = () => {
    // Get current settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const selectedInstruments = settings.instruments || [];
    
    // Get categories for selected instruments
    const categories = window.getItems('CATEGORIES') || [];
    const visibleCategories = categories.filter(cat => 
        selectedInstruments.includes(cat.instrumentId)
    );
    
    // Group categories by instrument
    const categoriesByInstrument = {};
    selectedInstruments.forEach(instrumentId => {
        categoriesByInstrument[instrumentId] = visibleCategories.filter(cat => 
            cat.instrumentId === instrumentId
        );
    });
    
    // Clear existing options
    goalsCategoryFilter.innerHTML = '<option value="">All Categories</option>';
    
    // Add categories grouped by instrument
    selectedInstruments.forEach(instrumentId => {
        const instrumentCategories = categoriesByInstrument[instrumentId];
        if (!instrumentCategories.length) return;
        
        const instrument = window.AVAILABLE_INSTRUMENTS.find(i => i.id === instrumentId);
        const optgroup = document.createElement('optgroup');
        optgroup.label = instrument ? instrument.name : instrumentId;
        
        instrumentCategories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            optgroup.appendChild(option);
        });
        
        goalsCategoryFilter.appendChild(optgroup);
    });
    
    // Add filter event listeners
    goalsSearchInput.addEventListener('input', applyGoalsFilters);
    goalsCategoryFilter.addEventListener('change', applyGoalsFilters);
    
    // Add status filter event listener
    if (goalsStatusFilter) {
        goalsStatusFilter.addEventListener('change', applyGoalsFilters);
    }
    
    // Apply default filters (active goals)
    applyGoalsFilters();
};

// Apply goals filters
const applyGoalsFilters = () => {
    const filters = {
        search: goalsSearchInput.value.trim(),
        category: goalsCategoryFilter.value,
        status: goalsStatusFilter ? goalsStatusFilter.value : 'active'
    };
    
    loadGoals(filters);
};

// Create goal element
const createGoalElement = (goal) => {
    const div = document.createElement('div');
    div.className = 'card goal-card';
    if (goal.completed) {
        div.classList.add('completed');
    }
    
    // Get category name if categoryId exists
    let categoryName = '';
    let instrumentName = '';
    if (goal.categoryId) {
        const category = window.getItemById('CATEGORIES', goal.categoryId);
        if (category) {
            categoryName = category.name;
            const instrument = window.AVAILABLE_INSTRUMENTS.find(i => i.id === category.instrumentId);
            instrumentName = instrument ? instrument.name : category.instrumentId;
        }
    }
    
    div.innerHTML = `
        <div class="goal-header">
            <div class="goal-checkbox-container">
                <input type="checkbox" class="goal-checkbox" id="goal-${goal.id}" ${goal.completed ? 'checked' : ''}>
                <label for="goal-${goal.id}" class="checkbox-label"></label>
            </div>
            <h3 class="${goal.completed ? 'completed-text' : ''}">${goal.text}</h3>
            <div class="goal-actions">
                <button class="icon-button edit-goal" data-id="${goal.id}">
                    <i data-lucide="edit"></i>
                </button>
                <button class="icon-button delete-goal" data-id="${goal.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
        ${goal.dueDate ? `<p class="goal-due-date ${isOverdue(goal) ? 'overdue' : ''}">
            Due: ${new Date(goal.dueDate).toLocaleDateString()}
            ${isOverdue(goal) ? '<span class="overdue-badge">Overdue</span>' : ''}
        </p>` : ''}
        ${categoryName ? `
            <p class="goal-category">
                <span class="category-name">${categoryName}</span>
                <span class="instrument-name">${instrumentName}</span>
            </p>
        ` : ''}
        ${goal.notes ? `<p class="goal-notes">${goal.notes}</p>` : ''}
        ${goal.completed ? `<p class="completed-date">Completed: ${new Date(goal.completedAt || goal.updatedAt).toLocaleDateString()}</p>` : ''}
    `;
    
    // Add event listeners
    const checkbox = div.querySelector('.goal-checkbox');
    checkbox.addEventListener('change', () => toggleGoal(goal.id));
    
    const editButton = div.querySelector('.edit-goal');
    editButton.addEventListener('click', () => editGoal(goal));
    
    const deleteButton = div.querySelector('.delete-goal');
    deleteButton.addEventListener('click', () => deleteGoal(goal.id));
    
    return div;
};

// Check if goal is overdue
const isOverdue = (goal) => {
    if (!goal.dueDate || goal.completed) return false;
    
    const dueDate = new Date(goal.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    return dueDate < today;
};

// Setup add goal button
const setupAddGoalButton = () => {
    console.log('Setting up add goal button');
    if (addGoalButton) {
        addGoalButton.addEventListener('click', () => {
            console.log('Add goal button clicked');
            const goal = {
                id: `g-${Date.now()}`,
                text: '',
                completed: false,
                categoryId: null,
                instruments: [],
                dueDate: null,
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            editGoal(goal);
        });
    } else {
        console.error('Add goal button not found');
    }
};

// Edit goal
const editGoal = (goal) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'goal-dialog';
    
    // Get current settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const selectedInstruments = settings.instruments || [];
    
    // Get categories for selected instruments
    const categories = window.getItems('CATEGORIES') || [];
    const visibleCategories = categories.filter(cat => 
        selectedInstruments.includes(cat.instrumentId)
    );
    
    // Group categories by instrument
    const categoriesByInstrument = {};
    selectedInstruments.forEach(instrumentId => {
        categoriesByInstrument[instrumentId] = visibleCategories.filter(cat => 
            cat.instrumentId === instrumentId
        );
    });
    
    dialog.innerHTML = `
        <form class="goal-form">
            <h2>${goal.id ? 'Edit Goal' : 'New Goal'}</h2>
            <div class="form-group">
                <label for="goal-text">Goal Text</label>
                <input type="text" id="goal-text" required value="${goal.text}">
            </div>
            <div class="form-group">
                <label for="goal-category">Category (Optional)</label>
                <select id="goal-category">
                    <option value="">No Category</option>
                    ${selectedInstruments.map(instrumentId => {
                        const instrumentCategories = categoriesByInstrument[instrumentId];
                        if (!instrumentCategories.length) return '';
                        
                        const instrument = window.AVAILABLE_INSTRUMENTS.find(i => i.id === instrumentId);
                        return `
                            <optgroup label="${instrument ? instrument.name : instrumentId}">
                                ${instrumentCategories.map(category => 
                                    `<option value="${category.id}" ${goal.categoryId === category.id ? 'selected' : ''}>
                                        ${category.name}
                                    </option>`
                                ).join('')}
                            </optgroup>
                        `;
                    }).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="goal-due-date">Due Date (Optional)</label>
                <input type="date" id="goal-due-date" value="${goal.dueDate ? goal.dueDate.split('T')[0] : ''}">
            </div>
            <div class="form-group">
                <label for="goal-notes">Notes (Optional)</label>
                <textarea id="goal-notes" rows="4">${goal.notes || ''}</textarea>
            </div>
            <div class="dialog-actions">
                <button type="button" class="secondary-button" id="cancel-goal-btn">Cancel</button>
                <button type="submit" class="primary-button">Save Goal</button>
            </div>
        </form>
    `;
    
    // Add form submission handler
    const form = dialog.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const categoryId = formData.get('category');
        
        // Get category to determine instrument
        const category = window.getItemById('CATEGORIES', categoryId);
        if (category) {
            goal.instruments = [category.instrumentId];
        }
        
        // Update goal data
        goal.text = formData.get('text');
        goal.categoryId = categoryId;
        goal.dueDate = formData.get('due-date') || null;
        goal.notes = formData.get('notes');
        goal.updatedAt = new Date().toISOString();
        
        // Save goal
        if (goal.id.startsWith('g-')) {
            window.saveItems('GOALS', goal);
        } else {
            window.updateItem('GOALS', goal);
        }
        
        // Close dialog and refresh list
        dialog.close();
        loadGoals();
    });
    
    // Add cancel button handler
    const cancelButton = dialog.querySelector('#cancel-goal-btn');
    cancelButton.addEventListener('click', () => {
        dialog.close();
    });
    
    // Add dialog to page and show it
    document.body.appendChild(dialog);
    dialog.showModal();
};

// Toggle goal completion
const toggleGoal = (goalId) => {
    const goal = window.getItemById('GOALS', goalId);
    if (!goal) return;
    
    goal.completed = !goal.completed;
    if (goal.completed) {
        goal.completedAt = new Date().toISOString();
    }
    goal.updatedAt = new Date().toISOString();
    
    window.updateItem('GOALS', goal);
    loadGoals();
};

// Delete goal
const deleteGoal = (goalId) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    window.deleteItem('GOALS', goalId);
    loadGoals();
};

// Add styles
const addGoalStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .goal-card {
            margin-bottom: 1rem;
            padding: 1rem;
            border-radius: 0.5rem;
            background-color: var(--color-background-alt);
        }
        
        .goal-card.completed {
            opacity: 0.7;
        }
        
        .goal-header {
            display: flex;
            align-items: center;
            gap: 1rem;
            margin-bottom: 0.5rem;
        }
        
        .goal-checkbox-container {
            position: relative;
            width: 1.5rem;
            height: 1.5rem;
        }
        
        .goal-checkbox {
            position: absolute;
            opacity: 0;
            cursor: pointer;
            height: 0;
            width: 0;
        }
        
        .checkbox-label {
            position: absolute;
            top: 0;
            left: 0;
            height: 1.5rem;
            width: 1.5rem;
            background-color: var(--color-background);
            border: 2px solid var(--color-primary);
            border-radius: 0.25rem;
            cursor: pointer;
        }
        
        .goal-checkbox:checked + .checkbox-label {
            background-color: var(--color-primary);
        }
        
        .goal-checkbox:checked + .checkbox-label::after {
            content: '';
            position: absolute;
            left: 0.5rem;
            top: 0.25rem;
            width: 0.25rem;
            height: 0.5rem;
            border: solid white;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }
        
        .goal-header h3 {
            flex: 1;
            margin: 0;
            font-size: 1.1rem;
        }
        
        .completed-text {
            text-decoration: line-through;
            color: var(--color-text-muted);
        }
        
        .goal-actions {
            display: flex;
            gap: 0.5rem;
        }
        
        .icon-button {
            background: none;
            border: none;
            padding: 0.25rem;
            cursor: pointer;
            color: var(--color-text-muted);
        }
        
        .icon-button:hover {
            color: var(--color-primary);
        }
        
        .goal-due-date {
            margin: 0.5rem 0;
            color: var(--color-text-muted);
        }
        
        .goal-due-date.overdue {
            color: var(--color-error);
        }
        
        .overdue-badge {
            display: inline-block;
            padding: 0.25rem 0.5rem;
            background-color: var(--color-error-light);
            color: var(--color-error);
            border-radius: 0.25rem;
            font-size: 0.875rem;
            margin-left: 0.5rem;
        }
        
        .goal-category {
            margin: 0.5rem 0;
            color: var(--color-text-muted);
        }
        
        .goal-category .category-name {
            font-weight: 500;
        }
        
        .goal-category .instrument-name {
            margin-left: 0.5rem;
            font-size: 0.875rem;
            color: var(--color-text-muted);
        }
        
        .goal-notes {
            margin: 0.5rem 0;
            color: var(--color-text-muted);
            font-size: 0.9rem;
        }
        
        .completed-date {
            margin: 0.5rem 0;
            color: var(--color-success);
            font-size: 0.875rem;
        }
        
        .goal-dialog {
            padding: 1.5rem;
            border: none;
            border-radius: 0.5rem;
            background-color: var(--color-background);
        }
        
        .goal-dialog::backdrop {
            background-color: rgba(0, 0, 0, 0.5);
        }
        
        .goal-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }
        
        .form-group label {
            font-weight: 500;
        }
        
        .form-group input,
        .form-group select,
        .form-group textarea {
            padding: 0.5rem;
            border: 1px solid var(--color-border);
            border-radius: 0.25rem;
            background-color: var(--color-background-alt);
            color: var(--color-text);
        }
        
        .form-group input:focus,
        .form-group select:focus,
        .form-group textarea:focus {
            outline: none;
            border-color: var(--color-primary);
        }
        
        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 0.5rem;
            margin-top: 1rem;
        }
        
        .secondary-button {
            padding: 0.5rem 1rem;
            border: 1px solid var(--color-border);
            border-radius: 0.25rem;
            background-color: var(--color-background);
            color: var(--color-text);
            cursor: pointer;
        }
        
        .secondary-button:hover {
            background-color: var(--color-background-alt);
        }
        
        .primary-button {
            padding: 0.5rem 1rem;
            border: none;
            border-radius: 0.25rem;
            background-color: var(--color-primary);
            color: white;
            cursor: pointer;
        }
        
        .primary-button:hover {
            background-color: var(--color-primary-dark);
        }
    `;
    document.head.appendChild(style);
};

// Add styles
addGoalStyles();

// Make functions available globally
window.initializeGoals = initializeGoals;
window.loadGoals = loadGoals;
window.editGoal = editGoal;
window.deleteGoal = deleteGoal;
window.toggleGoal = toggleGoal; 