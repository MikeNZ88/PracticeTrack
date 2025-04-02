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
        const searchInput = searchInputSelector ? document.querySelector(searchInputSelector) : null;
        const categoryFilter = categoryFilterSelector ? document.querySelector(categoryFilterSelector) : null;
        const dateInputs = dateInputsSelector ? document.querySelectorAll(dateInputsSelector) : null;
        const statusFilter = statusFilterSelector ? document.querySelector(statusFilterSelector) : null;
        
        // Store references
        domCache[pageId] = {
            listContainer,
            addButton,
            searchInput,
            categoryFilter,
            dateInputs,
            statusFilter,
            recordType,
            createRecordElementFn,
            emptyStateMessage,
            emptyStateIcon,
            addEmptyStateButtonId,
            addEmptyStateButtonText,
            showDialogFn
        };
        
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
                loadRecords(pageId);
            });
        }

        // *** Add listener for category filter ***
        if (categoryFilter) {
            categoryFilter.addEventListener('change', () => {
                loadRecords(pageId);
            });
        }
        
        if (dateInputs) {
            dateInputs.forEach(input => {
                input.addEventListener('change', () => {
                    loadRecords(pageId);
                });
            });
        }
        
        if (statusFilter) {
            statusFilter.addEventListener('change', () => {
                loadRecords(pageId);
            });
        }
        
        // Initial load of records
        loadRecords(pageId);
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
     */
    function loadRecords(pageId) { // Removed options, always use cache
        const cache = domCache[pageId];
        if (!cache || !cache.listContainer) {
            console.error(`Cache or list container not found for pageId: ${pageId}`);
            return;
        }
        
        const { recordType, createRecordElementFn, listContainer } = cache;
        
        // Clear list
        listContainer.innerHTML = '';
        
        try {
            // Get filter values directly from cache
            const filters = {
                search: cache.searchInput ? cache.searchInput.value.trim().toLowerCase() : '',
                categoryId: cache.categoryFilter ? cache.categoryFilter.value : '',
                status: cache.statusFilter ? cache.statusFilter.value : null,
                startDate: (cache.dateInputs && cache.dateInputs[0]) ? cache.dateInputs[0].value : '',
                endDate: (cache.dateInputs && cache.dateInputs[1]) ? cache.dateInputs[1].value : ''
            };
            
            // Get records from data layer
            let records = window.getItems ? window.getItems(recordType) : 
                JSON.parse(localStorage.getItem(`practiceTrack_${recordType}`)) || [];
            
            // *** Add logging before filtering ***
            console.log(`[DEBUG ${recordType} Load] Raw records loaded:`, records.length > 0 ? JSON.parse(JSON.stringify(records)) : '[]', 'Filters to apply:', JSON.parse(JSON.stringify(filters)));

            // Apply filters (pass recordType for specific search)
            records = filterRecords(records, filters, recordType);
            
            // Sort records
            records = sortRecords(records, recordType);
            
            // Show empty state if no records
            if (records.length === 0) {
                showEmptyState(pageId, listContainer);
            } else {
                // Create record elements
                records.forEach(record => {
                    if (typeof createRecordElementFn === 'function') {
                        const element = createRecordElementFn(record);
                        if (element) {
                            listContainer.appendChild(element);
                        }
                    }
                });
            }
            
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
     * This function handles filtering for all tabs with a consistent implementation:
     * 
     * Goals Tab:
     * - Search: .goals-search-input (searches title, description, notes, and category)
     * - Category: .goals-category-filter (filters by category)
     * - Status: .goals-status-filter (active/completed/all)
     *
     * Sessions Tab:
     * - Search: .search-input (searches notes and category) -> Now: name, category, notes
     * - Category: .category-filter (filters by category)
     * - Date: .date-input (filters by date range)
     *
     * Media Tab:
     * - Search: .search-input (searches name, description, and content) -> Now: name, category, description, content
     * - Type: .media-type-filter (photo/video/note)
     * - Date: .date-input (filters by date range)
     *
     * Stats Tab:
     * - Category: #category-filter (filters by category)
     * - Date: #start-date and #end-date (filters by date range)
     *
     * @param {Array} records - The records to filter
     * @param {Object} filters - The filter criteria
     * @param {string} recordType - The type of record being filtered (GOALS, SESSIONS, MEDIA)
     * @returns {Array} - Filtered records
     */
    function filterRecords(records, filters, recordType) { // Added recordType parameter
        if (!records || !Array.isArray(records)) {
            return [];
        }
        
        let filtered = [...records];
        
        // Filter by category
        if (filters.categoryId) {
            filtered = filtered.filter(record => record.categoryId === filters.categoryId);
        }
        
        // Filter by status for goals or type for media
        if (filters.status) {
            if (recordType === 'GOALS') {
                if (filters.status === 'active') {
                    filtered = filtered.filter(record => record.completed === false);
                } else if (filters.status === 'completed') {
                    filtered = filtered.filter(record => record.completed === true);
                }
            } else if (recordType === 'MEDIA') {
                 if (['photo', 'video', 'note'].includes(filters.status)) {
                     filtered = filtered.filter(record => record.type === filters.status);
                 }
            }
            // 'all' status doesn't filter anything
        }
        
        // Filter by search term (now uses recordType)
        if (filters.search && filters.search.length > 0) { // Simplified check
            const searchTerm = filters.search; // Already lowercase from loadRecords
            
            filtered = filtered.filter(record => {
                if (!record) return false;
                
                // Get category name once
                let categoryName = '';
                if (record.categoryId) {
                    const categories = window.getItems ? window.getItems('CATEGORIES') : 
                        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
                    const category = categories.find(c => c.id === record.categoryId);
                    categoryName = category ? category.name.toLowerCase() : 'unknown';
                } else {
                    categoryName = 'unknown';
                }
                
                // Determine searchable fields based on recordType
                let fieldsToSearch = [];
                if (recordType === 'GOALS') {
                    // Goals: name (title), category, description
                     fieldsToSearch = [
                        record.title ? record.title.toLowerCase() : '',
                        categoryName,
                        record.description ? record.description.toLowerCase() : ''
                    ];
                } else if (recordType === 'SESSIONS') {
                    // Sessions: name (not available), category, notes
                     fieldsToSearch = [
                        categoryName, 
                        record.notes ? record.notes.toLowerCase() : ''
                        // Assuming session doesn't have a name/title field to search
                    ];
                    // *** Add specific logging for Sessions search ***
                    if (searchTerm.length > 0) { // Log only when searching
                        console.log(`[DEBUG Sessions Filter] Searching for: "${searchTerm}" | Record Category: "${categoryName}" | Record Notes: "${record.notes ? record.notes.toLowerCase() : ''}"`);
                    }
                } else if (recordType === 'MEDIA') {
                     // Media: name, category, description, content
                     fieldsToSearch = [
                        record.name ? record.name.toLowerCase() : '',
                        categoryName,
                        record.description ? record.description.toLowerCase() : '',
                        record.content ? record.content.toLowerCase() : '' // For notes
                    ];
                }
                
                // Check if any specified field contains the search term
                return fieldsToSearch.some(field => field && field.includes(searchTerm));
            });
        }
        
        // Filter by date range
        if (filters.startDate) {
            try {
                const startDate = new Date(filters.startDate);
                if (!isNaN(startDate.getTime())) { 
                    startDate.setHours(0, 0, 0, 0); 
                    filtered = filtered.filter(record => {
                        if (!record) return false;
                        const dateField = record.startTime || record.date || record.createdAt;
                        if (!dateField) return false;
                        const recordDate = new Date(dateField);
                        return !isNaN(recordDate.getTime()) && recordDate >= startDate;
                    });
                }
            } catch (e) { console.error("Error parsing start date:", filters.startDate, e); }
        }
        
        if (filters.endDate) {
             try {
                const endDate = new Date(filters.endDate);
                if (!isNaN(endDate.getTime())) { 
                    endDate.setHours(23, 59, 59, 999); 
                    filtered = filtered.filter(record => {
                        if (!record) return false;
                        const dateField = record.startTime || record.date || record.createdAt;
                        if (!dateField) return false;
                        const recordDate = new Date(dateField);
                        return !isNaN(recordDate.getTime()) && recordDate <= endDate;
                    });
                }
            } catch (e) { console.error("Error parsing end date:", filters.endDate, e); }
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
            // Only name fields and session duration are required
            const isRequired = field.required === true && 
                (field.id.includes('name') || field.id === 'session-duration');
            
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