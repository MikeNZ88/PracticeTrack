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
        showDialogFn: showGoalDialog,
        filterFn: (item, filters) => {
            const searchTerm = filters.search ? filters.search.toLowerCase() : '';
            const categoryFilter = filters.category || 'all';
            const statusFilter = filters.status || 'all';

            const nameMatch = !searchTerm || (item.title && item.title.toLowerCase().includes(searchTerm));
            const descriptionMatch = !searchTerm || (item.description && item.description.toLowerCase().includes(searchTerm));
            const categoryMatch = categoryFilter === 'all' || item.categoryId === categoryFilter;
            
            let statusMatch = true;
            if (statusFilter === 'active') statusMatch = !item.completed;
            if (statusFilter === 'completed') statusMatch = item.completed;

            return (nameMatch || descriptionMatch) && categoryMatch && statusMatch;
        }
    });

    // Manually add event listener for the Smart Goal button
    const smartGoalBtn = document.getElementById('smart-goal-btn');
    if (smartGoalBtn) {
        // Remove existing listener to prevent duplicates if initializeGoals is called multiple times
        smartGoalBtn.removeEventListener('click', handleSmartGoalClick); 
        smartGoalBtn.addEventListener('click', handleSmartGoalClick);
        console.log('Added click listener to Smart Goal button.');
    } else {
        console.warn('Smart Goal button (#smart-goal-btn) not found on goals page during initialization.');
    }
}

/**
 * Create a goal element for the UI
 * @param {Object} goal - The goal data
 * @returns {HTMLElement} - The goal element
 */
function createGoalElement(goal) {
    const goalElement = document.createElement('div');
    goalElement.className = 'card goal-item';
    goalElement.dataset.id = goal.id;
    
    // Format dates using Intl.DateTimeFormat
    const formatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateFormatter = new Intl.DateTimeFormat('en-US', formatOptions);
    
    const dateStr = dateFormatter.format(new Date(goal.createdAt));
    const targetDateStr = goal.targetDate ? dateFormatter.format(new Date(goal.targetDate)) : null;

    // Get category name and color using the correct data layer function
    const category = window.getItemById ? window.getItemById('CATEGORIES', goal.categoryId) : { name: 'Unknown', color: 'gray' }; // Default if category not found
    const categoryColorClass = getCategoryColorClass(category?.name || 'Unknown'); // Use optional chaining and fallback for color
    
    // Determine status class and icon
    const statusClass = goal.completed ? 'completed' : 'active';
    const statusIcon = goal.completed ? 'check' : '';
    
    // Calculate progress if available
    const hasProgress = goal.progress !== undefined;
    const progressPercentage = hasProgress ? Math.min(100, Math.max(0, goal.progress)) : 0;

    // Create goal content with enhanced design
    // Construct the display string for the main content
    let goalContentDetail = '';
    if (goal.title) { // Start with the title
        goalContentDetail = goal.title;
    }
    if (goal.measureHelper) { // Append the measure helper if it exists
        goalContentDetail += ` (Measured By: ${goal.measureHelper})`;
    }
    // If title and measureHelper are missing, fall back to description or empty
    if (!goalContentDetail && goal.description) {
        goalContentDetail = goal.description;
    } 

    goalElement.innerHTML = `
        <!-- Accent Bar at top -->
        <div class="accent-bar ${categoryColorClass}"></div>
        
        <div class="goal-main-content">
            <div class="goal-header">
                <div class="goal-checkbox ${statusClass}" title="Toggle Goal Status">
                    ${statusIcon ? `<i data-lucide="${statusIcon}"></i>` : ''}
                </div>
                <h3 class="goal-title card-title ${statusClass}">${goal.title}</h3>
            </div>
            
            <!-- Display the constructed goal detail string -->
            ${goalContentDetail ? `
                <div class="session-notes-container">
                    <div class="session-notes goal-details-display">
                       ${goalContentDetail} 
                    </div>
                </div>
            ` : ''}
        </div>
        
        <div class="goal-footer">
             <span class="goal-category card-name-pill">${category?.name || 'Unknown'}</span>
             
             <span class="goal-date-time">
                ${goal.completed 
                    ? `Completed: ${dateStr}` 
                    : targetDateStr ? `Due: ${targetDateStr}` : `Created: ${dateStr}`}
             </span> 
             
             <div class="goal-actions">
                <button class="icon-button edit-goal app-button app-button--secondary" title="Edit Goal">
                    <i data-lucide="edit"></i>
                </button>
                <button class="icon-button delete-goal app-button app-button--secondary" title="Delete Goal">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `;
    
    // Initialize icons - include check icon for completed goals
    if (window.lucide) {
        window.lucide.createIcons({ 
             icons: ['check', 'edit', 'trash-2'],
             context: goalElement 
        }); 
    }
    
    // Add event listeners
    // Listener for the checkbox
    const checkbox = goalElement.querySelector('.goal-checkbox');
    if (checkbox) {
        checkbox.addEventListener('click', () => {
            toggleGoal(goal.id);
        });
    }
    
    // Edit and Delete listeners (target buttons within footer)
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
 * Get color class based on category name
 * @param {string} category - The category name
 * @returns {string} - CSS class for the category color
 */
function getCategoryColorClass(category) {
    category = category.toLowerCase();
    if (category.includes('technique')) return 'accent-blue';
    if (category.includes('theory')) return 'accent-orange';
    if (category.includes('repertoire')) return 'accent-teal';
    if (category.includes('reading')) return 'accent-purple';
    return 'accent-gray'; // Default
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

function handleSmartGoalClick() {
    console.log('Smart Goal button clicked!');
    
    // Define initial data for the goal dialog - NO default description needed now
    const smartInitialData = {
        isSmartGoal: true, 
        title: '', // Title is auto-generated, not shown in form
        description: '', // Start with empty description
        categoryId: '', 
        targetDate: ''   
    };

    // Call the existing showGoalDialog function with the pre-filled data
    showGoalDialog(null, smartInitialData); 
}

// Initialize when page changes to goals
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'goals') {
        initializeGoals();
    }
});

// Make function available globally
window.initializeGoals = initializeGoals; 