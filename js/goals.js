/**
 * Goals Module
 * Manages practice goals using the common UI framework
 */

// Goal data storage
let goalDialog = null;

/**
 * Initialize goals page 
 */
function initializeGoals() {
    // Use the UI framework to initialize the goals page
    window.UI.initRecordPage({
        pageId: 'goals',
        recordType: 'GOALS',
        listContainerId: 'goals-list',
        addButtonId: 'add-goal-btn',
        searchInputSelector: '.goals-search-input',
        categoryFilterSelector: '.goals-category-filter',
        statusFilterSelector: '.goals-status-filter',
        emptyStateMessage: 'No goals set yet.',
        emptyStateIcon: 'target',
        addEmptyStateButtonId: 'empty-add-goal',
        addEmptyStateButtonText: 'Set Your First Goal',
        createRecordElementFn: createGoalElement,
        showDialogFn: showGoalDialog
    });
}

/**
 * Create a goal element for the UI
 * @param {Object} goal - The goal data
 * @returns {HTMLElement} - The goal element
 */
function createGoalElement(goal) {
    const goalElement = document.createElement('div');
    goalElement.className = 'goal-item';
    goalElement.dataset.id = goal.id;
    
    // Get category
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    const category = categories.find(c => c.id === goal.categoryId) || { name: 'Unknown' };
    
    // Format target date
    const targetDate = goal.targetDate ? new Date(goal.targetDate) : null;
    const targetDateStr = targetDate ? targetDate.toLocaleDateString() : 'No deadline';
    
    // Create goal content
    goalElement.innerHTML = `
        <div class="goal-header">
            <div class="goal-status ${goal.completed ? 'completed' : 'active'}">
                <button class="toggle-goal-btn">
                    <i data-lucide="${goal.completed ? 'check-circle' : 'circle'}"></i>
                </button>
            </div>
            <div class="goal-title">${goal.title}</div>
            <div class="goal-category">${category.name}</div>
            <div class="goal-due-date">${targetDateStr}</div>
            <div class="goal-actions">
                <button class="icon-button edit-goal" title="Edit Goal">
                    <i data-lucide="edit"></i>
                </button>
                <button class="icon-button delete-goal" title="Delete Goal">
                    <i data-lucide="trash"></i>
                </button>
            </div>
        </div>
        ${goal.description ? `<div class="goal-description">${goal.description}</div>` : ''}
    `;
    
    // Initialize icons
    if (window.lucide) {
        window.lucide.createIcons({ icons: ['check-circle', 'circle', 'edit', 'trash'] });
    }
    
    // Add event listeners
    const toggleBtn = goalElement.querySelector('.toggle-goal-btn');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            toggleGoal(goal.id);
        });
    }
    
    const editBtn = goalElement.querySelector('.edit-goal');
    if (editBtn) {
        editBtn.addEventListener('click', () => {
            showGoalDialog(goal.id);
        });
    }
    
    const deleteBtn = goalElement.querySelector('.delete-goal');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            deleteGoal(goal.id);
        });
    }
    
    return goalElement;
}

/**
 * Show goal dialog for adding/editing
 * @param {string} goalId - Optional goal ID for editing
 */
function showGoalDialog(goalId) {
    // Get goal data if editing
    let goalData = null;
    
    if (goalId) {
        goalData = window.getItemById ? window.getItemById('GOALS', goalId) : 
            (JSON.parse(localStorage.getItem('practiceTrack_goals')) || [])
                .find(g => g.id === goalId);
    }
    
    // Get categories for dropdown
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        text: cat.name
    }));
    
    // Set up form fields
    const fields = [
        {
            type: 'text',
            id: 'goal-title',
            label: 'Goal Title',
            required: true,
            value: goalData ? goalData.title : ''
        },
        {
            type: 'select',
            id: 'goal-category',
            label: 'Category',
            required: true,
            options: categoryOptions,
            value: goalData ? goalData.categoryId : ''
        },
        {
            type: 'date',
            id: 'goal-target-date',
            label: 'Target Date',
            value: goalData && goalData.targetDate ? goalData.targetDate.split('T')[0] : ''
        },
        {
            type: 'textarea',
            id: 'goal-description',
            label: 'Description',
            rows: 4,
            value: goalData ? goalData.description || '' : ''
        },
        {
            type: 'checkbox',
            id: 'goal-completed',
            label: 'Mark as completed',
            checked: goalData ? goalData.completed : false
        }
    ];
    
    // Create dialog using UI framework
    goalDialog = window.UI.createStandardDialog({
        title: goalId ? 'Edit Goal' : 'Add New Goal',
        fields: fields,
        onSubmit: (dialog, e) => handleGoalFormSubmit(dialog, e, goalId),
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save Goal',
        cancelButtonText: 'Cancel'
    });
    
    // Show dialog
    goalDialog.showModal();
}

/**
 * Handle goal form submission
 * @param {HTMLElement} dialog - The dialog element
 * @param {Event} e - The submit event
 * @param {string} goalId - Optional goal ID for editing
 */
function handleGoalFormSubmit(dialog, e, goalId) {
    try {
        const form = e.target;
        const titleInput = form.querySelector('#goal-title');
        const categorySelect = form.querySelector('#goal-category');
        const targetDateInput = form.querySelector('#goal-target-date');
        const descriptionInput = form.querySelector('#goal-description');
        const completedCheckbox = form.querySelector('#goal-completed');
        
        // Validate inputs - only title is required
        if (!titleInput || !titleInput.value) {
            alert('Please enter a goal title');
            return;
        }
        
        // Create goal object
        const goalData = {
            id: goalId || `goal_${Date.now()}`,
            title: titleInput.value.trim(),
            categoryId: categorySelect ? categorySelect.value : null,
            targetDate: targetDateInput && targetDateInput.value ? new Date(targetDateInput.value).toISOString() : null,
            description: descriptionInput ? descriptionInput.value.trim() : '',
            completed: completedCheckbox ? completedCheckbox.checked : false,
            createdAt: new Date().toISOString()
        };
        
        // Save goal using the data layer
        if (window.addItem && window.updateItem) {
            if (goalId) {
                window.updateItem('GOALS', goalId, goalData);
            } else {
                window.addItem('GOALS', goalData);
            }
        } else {
            // Legacy localStorage handling
            let goals = [];
            try {
                const stored = localStorage.getItem('practiceTrack_goals');
                if (stored) {
                    goals = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Error reading goals:', e);
                goals = [];
            }
            
            if (goalId) {
                // Update existing goal
                const index = goals.findIndex(g => g.id === goalId);
                if (index !== -1) {
                    goals[index] = goalData;
                }
            } else {
                // Add new goal
                goals.push(goalData);
            }
            
            // Save to localStorage
            localStorage.setItem('practiceTrack_goals', JSON.stringify(goals));
        }
        
        // Close dialog
        dialog.close();
        
        // Reload goals list
        window.UI.loadRecords('goals', {
            recordType: 'GOALS',
            createRecordElementFn: createGoalElement
        });
        
    } catch (error) {
        console.error('Error saving goal:', error);
        alert('There was an error saving the goal.');
    }
}

/**
 * Toggle goal completion status
 * @param {string} goalId - The goal ID to toggle
 */
function toggleGoal(goalId) {
    try {
        // Get the goal data
        const goalData = window.getItemById ? window.getItemById('GOALS', goalId) : 
            (JSON.parse(localStorage.getItem('practiceTrack_goals')) || [])
                .find(g => g.id === goalId);
        
        if (!goalData) {
            console.error('Goal not found:', goalId);
            return;
        }
        
        // Toggle completion state
        goalData.completed = !goalData.completed;
        
        // Update the goal
        if (window.updateItem) {
            window.updateItem('GOALS', goalId, goalData);
        } else {
            // Legacy localStorage handling
            let goals = [];
            try {
                const stored = localStorage.getItem('practiceTrack_goals');
                if (stored) {
                    goals = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Error reading goals:', e);
                return;
            }
            
            const index = goals.findIndex(g => g.id === goalId);
            if (index !== -1) {
                goals[index] = goalData;
                localStorage.setItem('practiceTrack_goals', JSON.stringify(goals));
            }
        }
        
        // Reload goals list with current filters
        window.UI.loadRecords('goals', {
            recordType: 'GOALS',
            createRecordElementFn: createGoalElement
        });
        
    } catch (error) {
        console.error('Error toggling goal:', error);
    }
}

/**
 * Delete a goal
 * @param {string} goalId - The goal ID to delete
 */
async function deleteGoal(goalId) {
    // Confirm deletion
    const confirmed = await window.UI.confirmDialog({
        title: 'Delete Goal',
        message: 'Are you sure you want to delete this goal?',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
    });
    
    if (!confirmed) return;
    
    try {
        // Use data layer if available
        if (window.deleteItem) {
            window.deleteItem('GOALS', goalId);
        } else {
            // Legacy localStorage handling
            let goals = [];
            try {
                const stored = localStorage.getItem('practiceTrack_goals');
                if (stored) {
                    goals = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Error reading goals:', e);
                return;
            }
            
            // Filter out the deleted goal
            goals = goals.filter(g => g.id !== goalId);
            
            // Save back to storage
            localStorage.setItem('practiceTrack_goals', JSON.stringify(goals));
        }
        
        // Reload goals list
        window.UI.loadRecords('goals', {
            recordType: 'GOALS',
            createRecordElementFn: createGoalElement
        });
        
    } catch (error) {
        console.error('Error deleting goal:', error);
        alert('Error deleting goal. Please try again.');
    }
}

// Initialize when page changes to goals
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'goals') {
        initializeGoals();
    }
});

// Make function available globally
window.initializeGoals = initializeGoals; 