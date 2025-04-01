/**
 * UI Framework Module
 * Provides shared UI patterns and utilities for all tabs
 */

// Initialize UI namespace
window.UI = (function() {
    // Cache for DOM elements
    const domCache = {};
    
    /**
     * Initialize a record listing page with standard components
     * @param {Object} options - Configuration options
     */
    function initRecordPage(options) {
        const {
            pageId,
            recordType,
            listContainerId,
            addButtonId,
            searchInputSelector,
            categoryFilterSelector,
            dateInputsSelector,
            statusFilterSelector,
            emptyStateMessage,
            emptyStateIcon,
            addEmptyStateButtonId,
            addEmptyStateButtonText,
            createRecordElementFn,
            showDialogFn
        } = options;
        
        // Clear DOM cache for this page
        domCache[pageId] = {};
        
        // Get DOM elements
        const listContainer = document.getElementById(listContainerId);
        const addButton = document.getElementById(addButtonId);
        const searchInput = document.querySelector(searchInputSelector);
        const categoryFilter = document.querySelector(categoryFilterSelector);
        const dateInputs = dateInputsSelector ? document.querySelectorAll(dateInputsSelector) : null;
        const statusFilter = statusFilterSelector ? document.querySelector(statusFilterSelector) : null;
        
        // Store references
        domCache[pageId].listContainer = listContainer;
        domCache[pageId].addButton = addButton;
        domCache[pageId].searchInput = searchInput;
        domCache[pageId].categoryFilter = categoryFilter;
        domCache[pageId].dateInputs = dateInputs;
        domCache[pageId].statusFilter = statusFilter;
        domCache[pageId].recordType = recordType;
        domCache[pageId].createRecordElementFn = createRecordElementFn;
        
        // Setup UI components
        if (categoryFilter) {
            setupCategoryFilter(categoryFilter, recordType);
        }
        
        // Add event listeners
        if (addButton) {
            addButton.addEventListener('click', () => {
                if (typeof showDialogFn === 'function') {
                    showDialogFn();
                }
            });
        }
        
        if (searchInput) {
            searchInput.addEventListener('input', () => {
                loadRecords(pageId, {
                    recordType,
                    createRecordElementFn
                });
            });
        }
        
        if (dateInputs) {
            dateInputs.forEach(input => {
                input.addEventListener('change', () => {
                    loadRecords(pageId, {
                        recordType,
                        createRecordElementFn
                    });
                });
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                loadRecords(pageId, {
                    recordType,
                    createRecordElementFn
                });
            });
        }
        
        // Store options for empty state
        domCache[pageId].emptyStateMessage = emptyStateMessage;
        domCache[pageId].emptyStateIcon = emptyStateIcon;
        domCache[pageId].addEmptyStateButtonId = addEmptyStateButtonId;
        domCache[pageId].addEmptyStateButtonText = addEmptyStateButtonText;
        domCache[pageId].showDialogFn = showDialogFn;
        
        // Initial load of records
        loadRecords(pageId, {
            recordType,
            createRecordElementFn
        });
    }
    
    /**
     * Setup category filter dropdown
     * @param {HTMLElement} filterElement - The select element
     * @param {string} recordType - The type of records
     */
    function setupCategoryFilter(filterElement, recordType) {
        if (!filterElement) return;
        
        // Clear dropdown
        filterElement.innerHTML = '';
        
        // Add "All Categories" option
        const allOption = document.createElement('option');
        allOption.value = '';
        allOption.textContent = 'All Categories';
        filterElement.appendChild(allOption);
        
        // Get categories from data layer
        const categories = window.getItems ? window.getItems('CATEGORIES') : 
            JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        
        // Add categories to dropdown
        categories.forEach(category => {
            const option = document.createElement('option');
            option.value = category.id;
            option.textContent = category.name;
            filterElement.appendChild(option);
        });
    }
    
    /**
     * Load records with filters
     * @param {string} pageId - The page ID
     * @param {Object} options - Additional options
     */
    function loadRecords(pageId, options = {}) {
        const cache = domCache[pageId];
        if (!cache) return;
        
        const {
            recordType = cache.recordType,
            createRecordElementFn = cache.createRecordElementFn
        } = options;
        
        const listContainer = cache.listContainer;
        if (!listContainer) return;
        
        // Clear list
        listContainer.innerHTML = '';
        
        try {
            // Get search filters
            const filters = {
                search: cache.searchInput ? cache.searchInput.value.trim() : '',
                categoryId: cache.categoryFilter ? cache.categoryFilter.value : '',
                status: cache.statusFilter ? cache.statusFilter.value : null
            };
            
            // Get date filters
            if (cache.dateInputs && cache.dateInputs.length > 0) {
                filters.startDate = cache.dateInputs[0].value || '';
                if (cache.dateInputs.length > 1) {
                    filters.endDate = cache.dateInputs[1].value || '';
                }
            }
            
            // Get records from data layer
            let records = window.getItems ? window.getItems(recordType) : 
                JSON.parse(localStorage.getItem(`practiceTrack_${recordType.toLowerCase()}`)) || [];
            
            // Apply filters
            records = filterRecords(records, filters);
            
            // Sort records
            records = sortRecords(records, recordType);
            
            // Show empty state if no records
            if (records.length === 0) {
                showEmptyState(pageId, listContainer);
                return;
            }
            
            // Create record elements
            records.forEach(record => {
                if (typeof createRecordElementFn === 'function') {
                    const element = createRecordElementFn(record);
                    if (element) {
                        listContainer.appendChild(element);
                    }
                }
            });
            
            // Initialize icons
            if (window.lucide && typeof window.lucide.createIcons === 'function') {
                window.lucide.createIcons();
            }
            
        } catch (error) {
            console.error(`Error loading ${recordType}:`, error);
            listContainer.innerHTML = `
                <div class="error-state">
                    <p>Error loading data. Please try again.</p>
                </div>
            `;
        }
    }
    
    /**
     * Filter records based on search criteria
     * @param {Array} records - The records to filter
     * @param {Object} filters - The filter criteria
     * @returns {Array} - Filtered records
     */
    function filterRecords(records, filters) {
        let filtered = [...records];
        
        // Filter by category
        if (filters.categoryId) {
            filtered = filtered.filter(record => record.categoryId === filters.categoryId);
        }
        
        // Filter by status (for goals)
        if (filters.status) {
            if (filters.status === 'active') {
                filtered = filtered.filter(record => !record.completed);
            } else if (filters.status === 'completed') {
                filtered = filtered.filter(record => record.completed);
            }
            // 'all' status doesn't filter
        }
        
        // Filter by search term
        if (filters.search) {
            const searchTerm = filters.search.toLowerCase();
            filtered = filtered.filter(record => {
                // Get category name
                const categories = window.getItems ? window.getItems('CATEGORIES') : 
                    JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
                const category = categories.find(c => c.id === record.categoryId);
                const categoryName = category ? category.name.toLowerCase() : '';
                
                // Search in different fields based on record type
                return (
                    // Common fields
                    (record.notes && record.notes.toLowerCase().includes(searchTerm)) ||
                    categoryName.includes(searchTerm) ||
                    
                    // Record-specific fields
                    (record.title && record.title.toLowerCase().includes(searchTerm)) ||
                    (record.description && record.description.toLowerCase().includes(searchTerm)) ||
                    (record.name && record.name.toLowerCase().includes(searchTerm))
                );
            });
        }
        
        // Filter by date range
        if (filters.startDate) {
            const startDate = new Date(filters.startDate);
            filtered = filtered.filter(record => {
                const dateField = record.startTime || record.date || record.createdAt;
                return dateField && new Date(dateField) >= startDate;
            });
        }
        
        if (filters.endDate) {
            const endDate = new Date(filters.endDate);
            endDate.setHours(23, 59, 59, 999); // End of day
            filtered = filtered.filter(record => {
                const dateField = record.startTime || record.date || record.createdAt;
                return dateField && new Date(dateField) <= endDate;
            });
        }
        
        return filtered;
    }
    
    /**
     * Sort records based on type and criteria
     * @param {Array} records - The records to sort
     * @param {string} recordType - The type of records
     * @returns {Array} - Sorted records
     */
    function sortRecords(records, recordType) {
        // Default sort is by date (newest first)
        return records.sort((a, b) => {
            if (recordType === 'GOALS') {
                // For goals, sort by completion status first, then by date
                if (a.completed !== b.completed) {
                    return a.completed ? 1 : -1; // Active goals first
                }
            }
            
            // Get date fields based on record type
            const aDate = new Date(a.startTime || a.date || a.createdAt);
            const bDate = new Date(b.startTime || b.date || b.createdAt);
            
            return bDate - aDate; // Newest first
        });
    }
    
    /**
     * Show empty state for a list
     * @param {string} pageId - The page ID
     * @param {HTMLElement} container - The container element
     */
    function showEmptyState(pageId, container) {
        const cache = domCache[pageId];
        if (!cache) return;
        
        const message = cache.emptyStateMessage || 'No records found.';
        const icon = cache.emptyStateIcon || 'file';
        const buttonId = cache.addEmptyStateButtonId;
        const buttonText = cache.addEmptyStateButtonText || 'Add New';
        
        container.innerHTML = `
            <div class="empty-state">
                <i data-lucide="${icon}"></i>
                <p>${message}</p>
                ${buttonId ? `<button id="${buttonId}" class="primary-button">${buttonText}</button>` : ''}
            </div>
        `;
        
        // Initialize Lucide icons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        
        // Add event listener for empty state button
        if (buttonId) {
            const button = document.getElementById(buttonId);
            if (button && cache.showDialogFn) {
                button.addEventListener('click', cache.showDialogFn);
            }
        }
    }
    
    /**
     * Create a standard dialog for adding/editing records
     * @param {Object} options - Dialog options
     * @returns {HTMLDialogElement} - The dialog element
     */
    function createStandardDialog(options) {
        const {
            title,
            fields,
            onSubmit,
            onCancel,
            submitButtonText = 'Save',
            cancelButtonText = 'Cancel'
        } = options;
        
        // Create dialog element
        const dialog = document.createElement('dialog');
        dialog.className = 'standard-dialog';
        
        // Create dialog content
        let fieldsHTML = '';
        
        // Generate HTML for each field
        fields.forEach(field => {
            // Determine if the field should be required
            // By default, only name fields and session duration fields are required
            const isRequired = field.required === true || 
                (field.id && (field.id.includes('name') || field.id === 'session-duration'));
            
            switch (field.type) {
                case 'text':
                case 'number':
                case 'date':
                case 'time':
                case 'email':
                    fieldsHTML += `
                        <div class="form-group">
                            <label for="${field.id}">${field.label}${isRequired ? ' *' : ''}</label>
                            <input 
                                type="${field.type}" 
                                id="${field.id}" 
                                name="${field.id}"
                                value="${field.value || ''}"
                                ${isRequired ? 'required' : ''}
                                ${field.disabled ? 'disabled' : ''}
                                ${field.min !== undefined ? `min="${field.min}"` : ''}
                                ${field.max !== undefined ? `max="${field.max}"` : ''}
                            >
                        </div>
                    `;
                    break;
                    
                case 'select':
                    fieldsHTML += `
                        <div class="form-group">
                            <label for="${field.id}">${field.label}${isRequired ? ' *' : ''}</label>
                            <select 
                                id="${field.id}" 
                                name="${field.id}"
                                ${isRequired ? 'required' : ''}
                                ${field.disabled ? 'disabled' : ''}
                            >
                                <option value="">Select ${field.label}</option>
                                ${field.options.map(option => `
                                    <option value="${option.value}" ${field.value === option.value ? 'selected' : ''}>
                                        ${option.text}
                                    </option>
                                `).join('')}
                            </select>
                        </div>
                    `;
                    break;
                    
                case 'textarea':
                    fieldsHTML += `
                        <div class="form-group">
                            <label for="${field.id}">${field.label}${isRequired ? ' *' : ''}</label>
                            <textarea 
                                id="${field.id}" 
                                name="${field.id}"
                                rows="${field.rows || 4}"
                                ${isRequired ? 'required' : ''}
                                ${field.disabled ? 'disabled' : ''}
                            >${field.value || ''}</textarea>
                        </div>
                    `;
                    break;
                    
                case 'checkbox':
                    fieldsHTML += `
                        <div class="form-group checkbox-group">
                            <input 
                                type="checkbox" 
                                id="${field.id}" 
                                name="${field.id}"
                                ${field.checked ? 'checked' : ''}
                                ${field.disabled ? 'disabled' : ''}
                            >
                            <label for="${field.id}">${field.label}</label>
                        </div>
                    `;
                    break;
            }
        });
        
        // Set dialog HTML
        dialog.innerHTML = `
            <form method="dialog">
                <h2>${title}</h2>
                ${fieldsHTML}
                <div class="dialog-buttons">
                    <button type="button" class="secondary-button cancel-btn">${cancelButtonText}</button>
                    <button type="submit" class="primary-button">${submitButtonText}</button>
                </div>
            </form>
        `;
        
        // Add event listeners
        const form = dialog.querySelector('form');
        if (form && typeof onSubmit === 'function') {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                onSubmit(dialog, e);
            });
        }
        
        const cancelBtn = dialog.querySelector('.cancel-btn');
        if (cancelBtn && typeof onCancel === 'function') {
            cancelBtn.addEventListener('click', () => {
                onCancel(dialog);
            });
        }
        
        // Add to document
        document.body.appendChild(dialog);
        
        return dialog;
    }
    
    /**
     * Create a confirmation dialog
     * @param {Object} options - Dialog options
     * @returns {Promise<boolean>} - Resolves to true if confirmed, false if canceled
     */
    function confirmDialog(options) {
        const {
            title,
            message,
            confirmText = 'Confirm',
            cancelText = 'Cancel',
            isDestructive = false
        } = options;
        
        return new Promise((resolve) => {
            // Create dialog element
            const dialog = document.createElement('dialog');
            dialog.className = 'confirm-dialog';
            
            // Set dialog HTML
            dialog.innerHTML = `
                <div class="confirm-content">
                    <h2>${title}</h2>
                    <p>${message}</p>
                    <div class="dialog-buttons">
                        <button class="secondary-button cancel-btn">${cancelText}</button>
                        <button class="primary-button ${isDestructive ? 'destructive-button' : ''} confirm-btn">${confirmText}</button>
                    </div>
                </div>
            `;
            
            // Add event listeners
            const confirmBtn = dialog.querySelector('.confirm-btn');
            confirmBtn.addEventListener('click', () => {
                dialog.close();
                resolve(true);
                // Remove dialog after closing
                setTimeout(() => {
                    document.body.removeChild(dialog);
                }, 100);
            });
            
            const cancelBtn = dialog.querySelector('.cancel-btn');
            cancelBtn.addEventListener('click', () => {
                dialog.close();
                resolve(false);
                // Remove dialog after closing
                setTimeout(() => {
                    document.body.removeChild(dialog);
                }, 100);
            });
            
            // Add to document and show
            document.body.appendChild(dialog);
            dialog.showModal();
        });
    }
    
    // Return public API
    return {
        initRecordPage,
        setupCategoryFilter,
        loadRecords,
        filterRecords,
        sortRecords,
        showEmptyState,
        createStandardDialog,
        confirmDialog
    };
})(); 