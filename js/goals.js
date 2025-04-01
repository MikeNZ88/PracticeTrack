// DOM Elements
const goalsList = document.getElementById('goals-list');
const addGoalButton = document.getElementById('add-goal-btn');
const goalsSearchInput = document.querySelector('.goals-search-input');
const goalsCategoryFilter = document.querySelector('.goals-category-filter');
const goalsStatusFilter = document.querySelector('.goals-status-filter');

// Initialize goals page
const initializeGoals = () => {
    console.log('Initializing goals page');
    loadGoals();
    setupAddGoalButton();
    setupGoalsFilters();
};

// Load and display goals
const loadGoals = (filters = {}) => {
    const goals = getItems('GOALS') || [];
    goalsList.innerHTML = '';
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    console.log('Current instrument for goals:', currentInstrument);
    
    // Filter goals by current instrument
    if (currentInstrument && goals) {
        goals = goals.filter(goal => goal.instrument === currentInstrument);
        console.log(`Filtered to ${goals.length} goals for instrument: ${currentInstrument}`);
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
    // Populate category filter
    const categories = getItems('CATEGORIES') || [];
    goalsCategoryFilter.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        if (!category.isHidden) {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            goalsCategoryFilter.appendChild(option);
        }
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
        search: goalsSearchInput.value,
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
    if (goal.categoryId) {
        const category = getItemById('CATEGORIES', goal.categoryId);
        if (category) {
            categoryName = category.name;
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
        ${categoryName ? `<p class="goal-category">${categoryName}</p>` : ''}
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
    
    // Get categories for dropdown
    const categories = getItems('CATEGORIES') || [];
    
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
                    ${categories.map(category => 
                        `<option value="${category.id}" ${goal.categoryId === category.id ? 'selected' : ''}>
                            ${category.name}
                        </option>`
                    ).join('')}
                </select>
            </div>
            <div class="form-group">
                <label for="goal-due-date">Due Date (Optional)</label>
                <input type="date" id="goal-due-date" value="${goal.dueDate ? goal.dueDate.split('T')[0] : ''}">
            </div>
            <div class="form-group">
                <label for="goal-notes">Notes (Optional)</label>
                <textarea id="goal-notes">${goal.notes || ''}</textarea>
            </div>
            ${goal.completed ? `
            <div class="form-group">
                <label>
                    <input type="checkbox" id="goal-completed" checked>
                    Mark as completed
                </label>
            </div>` : ''}
            <div class="dialog-actions">
                <button type="button" class="secondary-button cancel-button">Cancel</button>
                <button type="submit" class="primary-button">Save</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(dialog);
    dialog.showModal();
    
    // Handle form submission
    const form = dialog.querySelector('.goal-form');
    
    // Prevent spacebar from triggering unwanted actions in form fields
    form.addEventListener('keydown', (e) => {
        if (e.key === ' ' && e.target.tagName !== 'SELECT') {
            e.stopPropagation();
        }
    });
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const text = document.getElementById('goal-text').value;
        const categoryId = document.getElementById('goal-category').value || null;
        const dueDate = document.getElementById('goal-due-date').value;
        const notes = document.getElementById('goal-notes').value;
        
        // Check if completed checkbox exists and is checked
        const completedCheckbox = document.getElementById('goal-completed');
        const completed = completedCheckbox ? completedCheckbox.checked : goal.completed;
        
        goal.text = text;
        goal.categoryId = categoryId;
        goal.dueDate = dueDate || null;
        goal.notes = notes;
        goal.completed = completed;
        goal.updatedAt = new Date().toISOString();
        
        // Set completedAt timestamp when completed
        if (completed && !goal.completedAt) {
            goal.completedAt = new Date().toISOString();
        } else if (!completed) {
            goal.completedAt = null;
        }
        
        saveItem('GOALS', goal);
        dialog.close();
        applyGoalsFilters(); // Use this instead of loadGoals() to maintain filters
    });
    
    // Handle cancel
    const cancelButton = dialog.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => dialog.close());
    
    // Handle dialog close
    dialog.addEventListener('close', () => dialog.remove());
};

// Toggle goal completion
const toggleGoal = (goalId) => {
    const goal = getItemById('GOALS', goalId);
    if (goal) {
        goal.completed = !goal.completed;
        goal.updatedAt = new Date().toISOString();
        
        // Set completedAt timestamp when completed
        if (goal.completed) {
            goal.completedAt = new Date().toISOString();
        } else {
            goal.completedAt = null;
        }
        
        saveItem('GOALS', goal);
        applyGoalsFilters(); // Use this instead of loadGoals() to maintain filters
    }
};

// Delete goal
const deleteGoal = (goalId) => {
    if (confirm('Are you sure you want to delete this goal?')) {
        deleteItem('GOALS', goalId);
        applyGoalsFilters(); // Use this instead of loadGoals() to maintain filters
    }
};

// Add CSS styles for goals
const addGoalStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .goal-card {
            margin-bottom: 15px;
            padding: 15px;
            border-radius: 8px;
            border: 1px solid #eee;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            transition: background-color 0.3s;
        }
        
        .goal-card.completed {
            background-color: #f9f9f9;
            border-left: 4px solid #4caf50;
        }
        
        .goal-header {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 10px;
        }
        
        .goal-checkbox-container {
            display: flex;
            align-items: center;
            margin-top: 2px;
        }
        
        .goal-checkbox {
            margin: 0;
            cursor: pointer;
        }
        
        .goal-header h3 {
            flex: 1;
            margin: 0;
            font-size: 1.1em;
        }
        
        .completed-text {
            text-decoration: line-through;
            color: #888;
        }
        
        .goal-actions {
            display: flex;
            gap: 5px;
        }
        
        .goal-category, .goal-due-date, .goal-notes, .completed-date {
            margin: 5px 0;
            font-size: 0.9em;
            padding-left: 25px;
        }
        
        .goal-due-date {
            color: #555;
        }
        
        .goal-due-date.overdue {
            color: #d32f2f;
        }
        
        .overdue-badge {
            background-color: #d32f2f;
            color: white;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 0.8em;
            margin-left: 5px;
        }
        
        .goal-category {
            background-color: #f0f0f0;
            display: inline-block;
            padding: 3px 8px;
            border-radius: 4px;
            margin-left: 25px;
        }
        
        .goal-notes {
            color: #666;
            white-space: pre-wrap;
        }
        
        .completed-date {
            color: #4caf50;
            font-style: italic;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #888;
        }
        
        .empty-state svg {
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
        }
    `;
    document.head.appendChild(style);
};

// Add styles when DOM loads
document.addEventListener('DOMContentLoaded', addGoalStyles);

// Export function to global scope
window.initializeGoals = initializeGoals;

function createGoal(goalData) {
    try {
        // Get current instrument from settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
        const currentInstrument = settings.primaryInstrument || '';
        
        if (!currentInstrument) {
            alert('Please select an instrument in settings before creating a goal');
            return null;
        }
        
        // Create goal object with instrument
        const goal = {
            id: `g-${Date.now()}`,
            title: goalData.title,
            description: goalData.description || '',
            categoryId: goalData.categoryId,
            targetDuration: goalData.targetDuration || 0,
            dueDate: goalData.dueDate || null,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            instrument: currentInstrument
        };
        
        console.log('Creating new goal for instrument:', currentInstrument, goal);
        
        // Get existing goals
        let goals = getItems('GOALS') || [];
        
        // Add new goal
        goals.push(goal);
        
        // Save back to storage
        setItems('GOALS', goals);
        
        return goal;
    } catch (error) {
        console.error('Error creating goal:', error);
        return null;
    }
} 