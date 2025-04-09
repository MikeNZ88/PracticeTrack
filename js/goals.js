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
    console.log('[DEBUG Goals] Initializing goals page with performance optimizations');
    
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

    // Manually add event listener for the Smart Goal button
    const smartGoalBtn = document.getElementById('smart-goal-btn');
    if (smartGoalBtn) {
        // Remove any existing listeners to prevent duplicates
        const newSmartGoalBtn = smartGoalBtn.cloneNode(true);
        smartGoalBtn.parentNode.replaceChild(newSmartGoalBtn, smartGoalBtn);
        
        // Add new listener
        newSmartGoalBtn.addEventListener('click', () => {
            showGoalDialog(null, { isSmartGoal: true });
        });
    }
    
    // Add optimized debounced event listeners if the performance module is available
    if (window.PerfOpt) {
        const searchInput = document.querySelector('.goals-search-input');
        const categoryFilter = document.querySelector('.goals-category-filter');
        const statusFilter = document.querySelector('.goals-status-filter');
        const datePresetFilter = document.querySelector('#goals-page .date-preset-filter');
        
        // Direct event listeners instead of clone+replace which may be causing issues
        if (searchInput) {
            // Clear any existing listeners (safety measure)
            searchInput.removeEventListener('input', null);
            
            // Add direct listener
            searchInput.addEventListener('input', window.PerfOpt.debounce(() => {
                console.log('[Goals] Search input changed:', searchInput.value);
                window.PerfOpt.invalidateCache('GOALS');
                window.UI.loadRecords('goals');
            }, 300));
            console.log('[Goals Debug] Added direct listener to search input');
        }
        
        // Direct event listeners for filters
        if (categoryFilter) {
            // Clear existing listeners
            categoryFilter.removeEventListener('change', null);
            
            // Add direct listener
            categoryFilter.addEventListener('change', () => {
                console.log('[Goals] Category filter changed:', categoryFilter.value);
                window.PerfOpt.invalidateCache('GOALS');
                window.UI.loadRecords('goals');
            });
            console.log('[Goals Debug] Added direct listener to category filter');
        }
        
        if (statusFilter) {
            // Clear existing listeners
            statusFilter.removeEventListener('change', null);
            
            // Add direct listener
            statusFilter.addEventListener('change', () => {
                console.log('[Goals] Status filter changed:', statusFilter.value);
                window.PerfOpt.invalidateCache('GOALS');
                window.UI.loadRecords('goals');
            });
            console.log('[Goals Debug] Added direct listener to status filter');
        }
        
        if (datePresetFilter) {
            // Clear existing listeners
            datePresetFilter.removeEventListener('change', null);
            
            // Add direct listener
            datePresetFilter.addEventListener('change', () => {
                console.log('[Goals] Date preset changed:', datePresetFilter.value);
                window.PerfOpt.invalidateCache('GOALS');
                window.UI.loadRecords('goals');
            });
            console.log('[Goals Debug] Added direct listener to date preset filter');
        }
    }
    
    console.log('[DEBUG Goals] Initialization complete');
}

/**
 * Create a goal element for the UI
 * @param {Object} goal - The goal data
 * @returns {HTMLElement} - The goal element
 */
function createGoalElement(goal) {
    // Create goal element
    const goalElement = document.createElement('div');
    goalElement.classList.add('record-card', 'goal-card');
    goalElement.setAttribute('data-id', goal.id);
    
    // Add completed class if goal is completed
    if (goal.completed) {
        goalElement.classList.add('completed');
    }
    
    // Get category name
    let categoryName = 'No Category';
    if (goal.categoryId) {
        categoryName = window.Utils.getCategoryName(goal.categoryId);
    }
    
    // Add category color class
    goalElement.classList.add(window.Utils.getCategoryColorClass(categoryName));
    
    // Format date strings
    let targetDateStr = '';
    if (goal.targetDate) {
        const targetDate = new Date(goal.targetDate);
        targetDateStr = new Intl.DateTimeFormat('en-US', { 
            month: 'short', 
            day: 'numeric',
            year: 'numeric'
        }).format(targetDate);
    }
    
    // Calculate days left or overdue
    let daysLeftText = '';
    let daysLeftClass = '';
    
    if (goal.targetDate) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const targetDate = new Date(goal.targetDate);
        targetDate.setHours(0, 0, 0, 0);
        
        const diffTime = targetDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        if (diffDays < 0 && !goal.completed) {
            daysLeftText = `${Math.abs(diffDays)} day${Math.abs(diffDays) !== 1 ? 's' : ''} overdue`;
            daysLeftClass = 'overdue';
        } else if (diffDays === 0) {
            daysLeftText = 'Due today';
            daysLeftClass = 'due-today';
        } else if (diffDays > 0) {
            daysLeftText = `${diffDays} day${diffDays !== 1 ? 's' : ''} left`;
            daysLeftClass = diffDays <= 3 ? 'due-soon' : '';
        }
    }
    
    // Create the goal element HTML
    goalElement.innerHTML = `
        <div class="record-header">
            <div class="record-title">${window.Utils.escapeHTML(goal.title)}</div>
            <div class="record-actions">
                <button class="icon-button edit-button edit-goal" aria-label="Edit goal">
                    <i data-lucide="edit-3"></i>
                </button>
                <button class="icon-button delete-button delete-goal" aria-label="Delete goal">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
        <div class="record-details">
            <div class="record-category">${window.Utils.escapeHTML(categoryName)}</div>
            ${goal.targetDate ? `
                <div class="goal-dates">
                    <div class="goal-target-date">Target: ${targetDateStr}</div>
                    ${daysLeftText ? `<div class="goal-days-left ${daysLeftClass}">${daysLeftText}</div>` : ''}
                </div>
            ` : ''}
            <div class="goal-status">
                <button class="goal-toggle-button ${goal.completed ? 'completed' : ''}" 
                        aria-label="${goal.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                    <i data-lucide="${goal.completed ? 'check-circle' : 'circle'}"></i>
                    <span>${goal.completed ? 'Completed' : 'Incomplete'}</span>
                </button>
            </div>
        </div>
        ${goal.description ? `<div class="record-description">${window.Utils.escapeHTML(goal.description)}</div>` : ''}
    `;
    
    // Set up toggle event
    const toggleButton = goalElement.querySelector('.goal-toggle-button');
    if (toggleButton) {
        toggleButton.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleGoal(goal.id);
        });
    }
    
    // Initialize icons in the element
    window.Utils.initializeIcons(goalElement);
    
    return goalElement;
}

/**
 * Show goal dialog for adding/editing
 * @param {string} [goalId] - Optional goal ID for editing
 * @param {object} [initialData] - Optional initial data to pre-fill the form
 */
function showGoalDialog(goalId, initialData = null) {
    // Get goal data if editing
    let goalData = null;
    if (goalId) {
        goalData = window.getItemById ? window.getItemById('GOALS', goalId) : 
            (JSON.parse(localStorage.getItem('practiceTrack_goals')) || [])
                .find(g => g.id === goalId);
    }
    
    // Get categories for dropdown (only needed if not Smart Goal)
    let categories = [];
    if (!initialData?.isSmartGoal) { // Check the flag here
        categories = window.getItems ? window.getItems('CATEGORIES') : 
            JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    }
    
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        text: cat.name
    }));
    
    // Define prompts for different goal actions
    const prompts = {
        improve: {
            itemLabel: 'Skill to Improve:',
            itemPlaceholder: 'e.g., Alternate Picking'
        },
        understand: {
            itemLabel: 'Concept to Understand:',
            itemPlaceholder: 'e.g., Chord Inversions'
        },
        learn: {
            itemLabel: 'Piece/Song to Learn:',
            itemPlaceholder: 'e.g., Bach Prelude in C'
        },
        default: {
            itemLabel: 'Specific Item:',
            itemPlaceholder: 'e.g., C Major Scale'
        }
    };

    // --- Define fields based on flow --- 
    let fields = [];
    const isSmart = initialData?.isSmartGoal;

    // Define field sets
    const standardStartFields = [
        {
            type: 'text',
            id: 'goal-title',
            label: 'Goal Title',
            required: true,
            value: goalData ? goalData.title : (initialData ? initialData.title : '')
        },
        {
            type: 'select',
            id: 'goal-category',
            label: 'Category',
            required: true,
            options: categoryOptions,
            value: goalData ? goalData.categoryId : (initialData ? initialData.categoryId : '')
        }
    ];

    const smartGoalHelperFields = [
        { type: 'divider', label: 'Goal Details' },
        {
            type: 'select',
            id: 'goal-action-helper',
            label: 'Action:',
            options: [
                { value: '', text: '-- Select Action --' },
                { value: 'improve', text: 'Improve Skill' },
                { value: 'understand', text: 'Understand Concept' },
                { value: 'learn', text: 'Learn Piece/Song' }
            ],
            value: '' // Start empty for smart goal
        },
        {
            type: 'text',
            id: 'goal-item-helper',
            label: 'Specific Item (This will be the Category)',
            required: true, 
            placeholder: prompts.default.itemPlaceholder,
            value: '' // Start empty for smart goal
        },
        {
            type: 'text',
            id: 'goal-measure-helper',
            label: 'Measured By:',
            placeholder: 'e.g., Play at 120 BPM / Explain clearly',
            value: '' // Start empty for smart goal
        },
        { type: 'divider' },
    ];

    const sharedEndFields = [
        {
            type: 'date',
            id: 'goal-target-date',
            label: 'Target Date',
            value: goalData && goalData.targetDate ? goalData.targetDate.split('T')[0] : (initialData ? initialData.targetDate : '')
        },
        {
            type: 'textarea',
            id: 'goal-description',
            label: 'Description / Notes',
            rows: 4,
            value: goalData ? goalData.description || '' : (initialData ? initialData.description : '') 
        }
    ];

    // Combine fields based on flow
    if (isSmart) {
        // Smart Goal: Helpers + Date/Description
        fields = [...smartGoalHelperFields, ...sharedEndFields];
    } else {
        // Regular Add/Edit Goal: Title/Category + Date/Description
        fields = [...standardStartFields, ...sharedEndFields];
    }
    
    // Create dialog using UI framework
    goalDialog = window.UI.createStandardDialog({
        title: goalId ? 'Edit Goal' : (isSmart ? 'Create Smart Goal' : 'Add New Goal'),
        fields: fields,
        onSubmit: (dialog, e) => handleGoalFormSubmit(dialog, e, goalId, isSmart), 
        onCancel: (dialog) => { dialog.close(); },
        submitButtonText: 'Save Goal',
        cancelButtonText: 'Cancel',
        onRender: (dialogElement) => {
            const form = dialogElement.querySelector('form');
            const actionSelect = dialogElement.querySelector('#goal-action-helper');
            const itemInput = dialogElement.querySelector('#goal-item-helper');
            const itemLabel = dialogElement.querySelector(`label[for='goal-item-helper']`);
            const descriptionTextarea = dialogElement.querySelector('#goal-description');
            
            let descriptionManuallyEdited = false;

            // No longer need to mark the form dataset
            // if (isSmart) {
            //     console.log('[onRender] Setting form dataset flow to smart for element:', form);
            // }

            // --- Logic to update helper item label/placeholder based on Action --- 
            if (actionSelect && itemInput && itemLabel) {
                const updateHelperItemField = (selectedAction) => {
                    const config = prompts[selectedAction] || prompts.default;
                    // Only update placeholder, label is set in field definition now
                    itemInput.placeholder = config.itemPlaceholder; 
                };
                actionSelect.addEventListener('change', (event) => {
                    updateHelperItemField(event.target.value);
                });
                updateHelperItemField(actionSelect.value || 'default'); 
            }
            
            // --- Listener for Manual Description Edits --- 
            if (descriptionTextarea) {
                descriptionTextarea.addEventListener('input', () => {
                    if (!descriptionManuallyEdited) {
                        console.log("Manual edit detected in description.");
                    }
                    descriptionManuallyEdited = true; // Set flag on first manual input
                }, { once: true }); // Optimization: only need to set the flag once
            }

            // --- Logic to populate description based on itemInput (Smart Goal only) ---
            if (isSmart && itemInput && descriptionTextarea) { 
                const populateDescriptionFromItem = () => {
                    // Only populate if user hasn't manually edited description yet
                    if (!descriptionManuallyEdited) { 
                        const itemValue = itemInput.value.trim();
                        // Update description - even if itemValue is empty, clear the description
                        descriptionTextarea.value = itemValue; 
                    }
                };
                itemInput.addEventListener('input', populateDescriptionFromItem);
                console.log("Added input listener to itemInput for description population (respects manual edits).");
            }
        }
    });
    
    // Show dialog
    goalDialog.showModal();
}

/**
 * Handle goal form submission
 * @param {HTMLElement} dialog - The dialog element
 * @param {Event} e - The submit event
 * @param {string} [goalId] - Optional goal ID for editing
 * @param {boolean} isSmart - Flag indicating if it's the Smart Goal flow
 */
function handleGoalFormSubmit(dialog, e, goalId, isSmart) {
    try {
        let originalGoalData = null;
        if (goalId) {
            originalGoalData = window.getItemById ? window.getItemById('GOALS', goalId) : 
                (JSON.parse(localStorage.getItem('practiceTrack_goals')) || [])
                    .find(g => g.id === goalId);
        }

        const form = e.target;
        // Remove console log and use the passed isSmart parameter directly
        // console.log('[handleGoalFormSubmit] Form dataset flow:', form.dataset.flow);
        // const isSmart = form.dataset.flow === 'smart'; 

        // Get common elements
        const targetDateInput = form.querySelector('#goal-target-date');
        const descriptionInput = form.querySelector('#goal-description');
        const actionSelect = form.querySelector('#goal-action-helper');
        const itemInput = form.querySelector('#goal-item-helper');
        const measureInput = form.querySelector('#goal-measure-helper');
        
        let categoryId = null;
        let goalTitle = null;

        if (isSmart) {
            // --- Smart Goal Flow --- 
            const actionValue = actionSelect ? actionSelect.value : '';
            const itemValue = itemInput ? itemInput.value.trim() : '';
            
            // Validate required fields for Smart Goal
            if (!itemValue) {
                alert('Please enter a Specific Item (this will also be the category).');
                itemInput?.focus();
                return;
            }
            // Optionally validate action or measure if needed
            // if (!actionValue) { ... }
            // if (!measureInput || !measureInput.value.trim()) { ... }

            // Generate Title
            const actionText = actionSelect ? actionSelect.options[actionSelect.selectedIndex]?.text : 'Goal';
            goalTitle = `${actionText}: ${itemValue}`; 

            // Determine/Create Category based on itemValue
            const categoryName = itemValue; // Specific Item is the category name
            const allCategories = window.getItems ? window.getItems('CATEGORIES') : 
                                 JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
            const existingCategory = allCategories.find(cat => cat.name.toLowerCase() === categoryName.toLowerCase());

            if (existingCategory) {
                categoryId = existingCategory.id;
                console.log(`Using existing category '${categoryName}' for Smart Goal.`);
            } else {
                // Category does not exist - Create it automatically
                console.log(`Category '${categoryName}' not found. Creating automatically.`);
                const newCategory = {
                    id: `category_${Date.now()}`,
                    name: categoryName,
                    createdAt: new Date().toISOString()
                };
                if (window.addItem) {
                    window.addItem('CATEGORIES', newCategory);
                    categoryId = newCategory.id;
                    document.dispatchEvent(new CustomEvent('categoriesUpdated'));
                    console.log(`Created and added new category: '${categoryName}'`);
                } else {
                    console.error('Data layer function window.addItem not found. Cannot add category.');
                    alert('Error: Could not add the new category.');
                    return; 
                }
            }
        } else {
            // --- Standard Add/Edit Goal Flow --- 
            const titleInput = form.querySelector('#goal-title');
            const categorySelect = form.querySelector('#goal-category'); 

            // Validate standard fields
            if (!titleInput || !titleInput.value.trim()) {
                alert('Please enter a goal title');
                titleInput?.focus(); 
                return;
            }
             if (!categorySelect || !categorySelect.value) {
                 alert('Please select a category');
                 categorySelect?.focus(); 
                 return;
            }
            goalTitle = titleInput.value.trim();
            categoryId = categorySelect.value;
        }
        
        // --- Final Checks and Data Assembly --- 
        if (!goalTitle) {
             console.error('Failed to determine Goal Title.');
             alert('Error setting goal title. Cannot save.');
             return;
        }
        if (!categoryId) {
             console.error('Failed to determine Category ID.');
             alert('Error setting category for the goal. Cannot save.');
             return;
        }

        const isCompleted = goalId && originalGoalData ? originalGoalData.completed : false;

        // Base goal data common to both flows
        const goalData = {
            id: goalId || `goal_${Date.now()}`,
            title: goalTitle, 
            categoryId: categoryId, 
            targetDate: targetDateInput && targetDateInput.value ? new Date(targetDateInput.value).toISOString() : null,
            description: descriptionInput ? descriptionInput.value.trim() : '', 
            completed: isCompleted,
            createdAt: (goalId && originalGoalData) ? originalGoalData.createdAt : new Date().toISOString()
        };

        // Conditionally add helper fields ONLY for smart goals
        if (isSmart) {
            goalData.actionHelper = actionSelect ? actionSelect.value : null; 
            goalData.itemHelper = itemInput ? itemInput.value.trim() : null; 
            goalData.measureHelper = measureInput ? measureInput.value.trim() : null;
        } // For standard goals, these fields will just be absent
        
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
            } catch (err) { // Use different variable name
                console.error('Error reading goals:', err);
                goals = [];
            }
            
            if (goalId) {
                const index = goals.findIndex(g => g.id === goalId);
                if (index !== -1) {
                    goals[index] = goalData;
                }
            } else {
                goals.push(goalData);
            }
            
            localStorage.setItem('practiceTrack_goals', JSON.stringify(goals));
        }
        
        // Success feedback & close dialog
        const saveButton = dialog.querySelector('button[type="submit"]');
        if (saveButton) {
            saveButton.textContent = 'Saved!';
            saveButton.classList.add('button-saved'); 
            saveButton.disabled = true; 
            setTimeout(() => {
                 dialog.close(); 
            }, 500); // Close after 0.5 seconds
        } else {
             dialog.close(); 
        }
        
        window.UI.loadRecords('goals'); 
        
    } catch (error) {
        console.error('Error saving goal:', error);
        alert('Error saving goal. Please try again.'); 
        // Ensure dialog closes even on error
        if (dialog) {
             dialog.close(); 
        }
        // Re-enable save button if necessary (might not be needed if dialog closes)
        const submitButton = dialog?.querySelector('button[type="submit"]'); // Renamed variable for clarity
        if (submitButton) {
            submitButton.textContent = 'Save Goal'; 
            submitButton.classList.remove('button-saved');
            submitButton.disabled = false;
        }
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
/* // REMOVING this listener to prevent re-initialization
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'goals') {
        initializeGoals();
    }
});
*/

// Make function available globally
window.initializeGoals = initializeGoals;

// Add CSS for goal-specific elements (progress bar, checkbox)
function addGoalSpecificStyles() {
     let styleEl = document.getElementById('goal-styles');
     if (!styleEl) {
         styleEl = document.createElement('style');
         styleEl.id = 'goal-styles';
         document.head.appendChild(styleEl);
     }
     styleEl.textContent += `
        .goal-progress {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 8px;
        }
        .progress-bar-bg {
            flex-grow: 1;
            height: 8px;
            background-color: #e5e7eb; /* gray-200 */
            border-radius: 4px;
            overflow: hidden;
        }
        .progress-bar-fill {
            height: 100%;
            background-color: #3b82f6; /* blue-500 */
            border-radius: 4px;
            transition: width 0.3s ease;
        }
        .progress-bar-fill.completed { 
            background-color: #22c55e; /* green-500 */
        }
        .goal-progress span {
            font-size: 12px;
            color: #6b7280; /* gray-500 */
        }
        .goal-checkbox {
            /* Base styles like padding, border-radius, font-size, display, align-items, gap 
               are inherited from .action-button (defined in styles.css) */
            
            /* Specific styles for the default (active) state */
            background-color: rgba(107, 114, 128, 0.1); /* gray-100 equivalent */
            color: #4b5563; /* gray-600 */ 
            cursor: pointer; 
        }
        .goal-checkbox:hover {
            background-color: rgba(107, 114, 128, 0.2); /* Slightly darker gray on hover */
        }
        /* Icon size is set in HTML */

        .goal-checkbox.completed {
            /* Specific styles for the completed state */
            background-color: rgba(34, 197, 94, 0.1); /* green-100 equivalent */
            color: #15803d; /* green-700 */
        }
        .goal-checkbox.completed:hover {
            background-color: rgba(34, 197, 94, 0.2); /* Slightly darker green on hover */
        }
        .action-spacer { flex-grow: 1; } /* Pushes buttons right */
     `;
}

document.addEventListener('DOMContentLoaded', addGoalSpecificStyles); // Or call from initializeGoals 