/**
 * UI Framework Module
 * Provides shared UI patterns and utilities for all tabs
 */

// Initialize UI namespace
window.UI = (function() {
    // Cache for DOM elements
    const domCache = {};
    const initializedPages = {}; // Add a flag object
    const activeCategoryFilters = []; // Keep track of active filter dropdowns
    let categoriesNeedRefresh = false; // **** ADD Flag ****
    
    // Add cache for rendered tab content
    const tabRenderCache = {};
    let currentActiveTab = null;
    
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
        
        // Flag to track if page was already initialized
        const wasAlreadyInitialized = initializedPages[pageId];
        if (wasAlreadyInitialized) {
            console.warn(`[UI Framework] initRecordPage called again for already initialized page: ${pageId}. Skipping listener setup.`);
        } else {
             console.log(`[UI Framework] Initializing page: ${pageId}`); // Log initialization attempt
        }
        
        // >>> Always update DOM cache references <<< 
        // (Useful if elements were dynamically added/removed)
        domCache[pageId] = {}; 
        
        // Get DOM elements
        const pageElement = document.getElementById(`${pageId}-page`);
        if (!pageElement) {
            console.error(`[UI Framework] Page element #${pageId}-page not found! Cannot initialize.`);
            return; // Still need to return if page element is missing
        }
        
        // Get elements, scoping filters within the specific pageElement
        const listContainer = document.getElementById(listContainerId); 
        const addButton = addButtonId ? document.getElementById(addButtonId) : null; 
        const searchInput = searchInputSelector ? pageElement.querySelector(searchInputSelector) : null;
        const categoryFilter = categoryFilterSelector ? pageElement.querySelector(categoryFilterSelector) : null;
        const dateInputs = dateInputsSelector ? pageElement.querySelectorAll(dateInputsSelector) : null;
        const statusFilter = statusFilterSelector ? pageElement.querySelector(statusFilterSelector) : null;

        // Add checks (optional, but keep if useful)
        if (searchInputSelector && !searchInput) {
            console.warn(`[UI Framework - ${pageId}] Search input not found...`);
        }
        if (categoryFilterSelector && !categoryFilter) {
             console.warn(`[UI Framework - ${pageId}] Category filter not found...`);
        }
        
        // Store references in cache
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
        
        // --- Only setup listeners ONCE --- 
        if (!wasAlreadyInitialized) {
            // Add event listeners
            if (addButton) {
                console.log(`[UI Framework] Attaching listener to Add button for page: ${pageId}`);
                addButton.addEventListener('click', () => {
                    if (typeof showDialogFn === 'function') {
                        showDialogFn();
                    }
                });
            }
            
            if (searchInput) {
                searchInput.addEventListener('input', (event) => {
                    console.log(`[DEBUG ${pageId} Search Input] Event fired! Value:`, event.target.value);
                    loadRecords(pageId);
                });
            }

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
        } 

        // --- ALWAYS Check if Category Filter needs Refresh on Init/Activation --- 
        if (categoryFilter && categoriesNeedRefresh) {
            console.log(`[UI Framework Init ${pageId}] categoriesNeedRefresh is true. Calling setupCategoryFilter.`);
            setupCategoryFilter(categoryFilter, recordType);
            categoriesNeedRefresh = false; // Reset the flag after refresh
        } else if (categoryFilter && !wasAlreadyInitialized) {
            // If it wasn't previously initialized, populate filter even if no refresh needed
             console.log(`[UI Framework Init ${pageId}] First initialization. Calling setupCategoryFilter.`);
            setupCategoryFilter(categoryFilter, recordType);
        }
        // --- End Refresh Check ---
        
        // >>> Always call loadRecords <<< 
        // Only load records immediately if this is the current active tab
        if (document.querySelector(`#${pageId}-page:not([style*="display: none"])`)) {
            console.log(`[UI Framework] Page ${pageId} is visible, loading records immediately.`);
            loadRecords(pageId);
            currentActiveTab = pageId;
        } else {
            console.log(`[UI Framework] Page ${pageId} is not visible, deferring record loading.`);
        }
        
        // Set the initialized flag for this page at the end
        initializedPages[pageId] = true;
        console.log(`[UI Framework] Page ${pageId} marked as initialized.`);

        // Store category filter info for potential refresh
        if (categoryFilterSelector) {
             domCache[pageId].categoryFilterSelector = categoryFilterSelector;
             domCache[pageId].recordType = recordType; // Need recordType too
        }
    }
    
    /**
     * Setup category filter dropdown
     * @param {HTMLElement} filterElement - The select element
     * @param {string} recordType - The type of records
     */
    function setupCategoryFilter(filterElement, recordType) {
        if (!filterElement) {
            console.error('[UI Framework SetupFilter] Filter element provided is null or undefined.');
            return;
        }
        
        console.log(`[UI Framework SetupFilter] Setting up/refreshing category filter:`, filterElement);
        const currentValue = filterElement.value; // Preserve current selection
        
        // Clear dropdown
        filterElement.innerHTML = '';
        
        // **** ALWAYS get CATEGORIES - now with includeArchived=false for UI ****
        const categories = window.getItems('CATEGORIES', false); 
        // **** Log raw categories ****
        console.log('[UI Framework SetupFilter] Active categories fetched:', JSON.stringify(categories));

        filterElement.innerHTML = '<option value="all">All categories</option>'; 

        if (categories && categories.length > 0) {
            // Filter out invalid categories
            const validCategories = categories.filter(cat => 
                cat && 
                typeof cat.name === 'string'
            );
            // **** Log valid categories ****
            console.log(`[UI Framework SetupFilter] Filtered to ${validCategories.length} valid categories:`, JSON.stringify(validCategories));

            validCategories.sort((a, b) => {
                 return a.name.localeCompare(b.name);
             });

            // **** Log each category being added ****
            validCategories.forEach((category, index) => {
                console.log(`[UI Framework SetupFilter] Adding option ${index}: ID=${category.id}, Name=${category.name}`);
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                filterElement.appendChild(option); 
            });
        } else {
            console.log('[UI Framework SetupFilter] No categories found or array was empty.');
        }

        // Restore previous selection if possible, or default to "all"
        console.log(`[UI Framework SetupFilter] Attempting to restore selected value to: ${currentValue || 'all'}`);
        filterElement.value = currentValue || 'all';
        console.log(`[UI Framework SetupFilter] Current dropdown value after restore: ${filterElement.value}`);
    }
    
    /**
     * Load records with filters
     * @param {string} pageId - The page ID
     */
    function loadRecords(pageId) { 
        console.log(`[DEBUG ${pageId} Load] loadRecords function called.`);
        const cache = domCache[pageId];
        if (!cache || !cache.listContainer) {
            console.error(`Cache or list container not found for pageId: ${pageId}`);
            return;
        }

        // Set as current active tab
        currentActiveTab = pageId;
        
        const { recordType, createRecordElementFn, listContainer } = cache;
        
        try {
            // Get filter values directly from cache
            const filters = {
                search: cache.searchInput ? cache.searchInput.value.trim().toLowerCase() : '',
                categoryId: cache.categoryFilter ? cache.categoryFilter.value : 'all',
                status: cache.statusFilter ? cache.statusFilter.value : null,
                startDate: (cache.dateInputs && cache.dateInputs[0]) ? cache.dateInputs[0].value : '',
                endDate: (cache.dateInputs && cache.dateInputs[1]) ? cache.dateInputs[1].value : ''
            };
            
            // Generate a cache key from the filters
            const cacheKey = JSON.stringify(filters);
            
            // Check if we have cached results for these exact filters
            if (tabRenderCache[pageId] && tabRenderCache[pageId][cacheKey]) {
                console.log(`[DEBUG ${pageId} Load] Using cached results for filters:`, cacheKey);
                // Instead of rebuilding, just restore the cached content
                listContainer.innerHTML = tabRenderCache[pageId][cacheKey];
                
                // Restore event listeners for dynamic elements if needed
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons();
                }
                
                return;
            }
            
            // Get records from data layer
            let records = window.getItems ? window.getItems(recordType) : 
                JSON.parse(localStorage.getItem(`practiceTrack_${recordType}`)) || [];
            
            console.log(`[DEBUG ${recordType} Load] Raw records loaded: ${records.length}, Filters:`, JSON.stringify(filters));
            
            // Clear the container first
            listContainer.innerHTML = '';
            
            // Check if we have the performance optimization module available
            if (window.PerfOpt) {
                // Use optimized filtering, sorting, and rendering
                const processedRecords = window.PerfOpt.getCachedOrComputeRecords(
                    records, 
                    filters, 
                    recordType,
                    window.PerfOpt.optimizedFilterRecords,
                    window.PerfOpt.optimizedSortRecords
                );
                
                // Render with virtual scrolling
                window.PerfOpt.renderRecordsBatched(
                    processedRecords,
                    listContainer,
                    createRecordElementFn,
                    () => showEmptyState(pageId, listContainer)
                );
            } else {
                // Fallback to original implementation
                records = filterRecords(records, filters, recordType);
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
            }
            
            // Cache the rendered HTML for these filters
            if (!tabRenderCache[pageId]) {
                tabRenderCache[pageId] = {};
            }
            tabRenderCache[pageId][cacheKey] = listContainer.innerHTML;
            
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
     * @param {string} [recordType] - Optional: The type of record being filtered (GOALS, SESSIONS, MEDIA) - Used for type-specific search logic.
     * @returns {Array} - Filtered records
     */
    function filterRecords(records, filters, recordType = null) {
        const caller = recordType ? recordType : 'Stats'; // Identify caller for logging
        console.log(`[DEBUG ${caller} Filter] Starting filterRecords. Input records: ${records ? records.length : 0}`, 'Filters:', JSON.parse(JSON.stringify(filters)));

        if (!records || !Array.isArray(records)) {
            console.warn(`[DEBUG ${caller} Filter] Input records are invalid or not an array.`);
            return [];
        }
        
        let currentFilteredRecords = [...records]; // Start with all records
        let initialCount = currentFilteredRecords.length;

        // --- Category Filter --- 
        console.log(`[DEBUG ${caller} Filter] Checking Category Filter. filters.categoryId = '${filters.categoryId}' (Type: ${typeof filters.categoryId})`);
        // **** Only filter if categoryId is valid, not 'all', and not the missing placeholder ****
        if (filters.categoryId && filters.categoryId !== 'all' && filters.categoryId !== '[FilterElement Missing]') { 
            // Validate category exists before filtering
            const categoryExists = window.getItems ? 
                window.getItems('CATEGORIES').some(cat => cat.id === filters.categoryId) : false;
            
            if (categoryExists) {
                currentFilteredRecords = currentFilteredRecords.filter(record => record.categoryId === filters.categoryId);
                console.log(`[DEBUG ${caller} Filter] -> Applied Category filter for ID: ${filters.categoryId}. Records remaining: ${currentFilteredRecords.length} (from ${initialCount})`);
            } else {
                console.log(`[DEBUG ${caller} Filter] -> Skipping Category filter (Category ID ${filters.categoryId} not found)`);
            }
            initialCount = currentFilteredRecords.length; // Update count for next filter
        } else {
            console.log(`[DEBUG ${caller} Filter] -> Skipping Category filter (Value was '${filters.categoryId}')`);
        }

        // --- Status Filter --- 
        console.log(`[DEBUG ${caller} Filter] Checking Status Filter. filters.status = '${filters.status}'`);
        if (filters.status && filters.status !== 'all') { // Added 'all' check
            if (recordType === 'GOALS') {
                if (filters.status === 'active') {
                    currentFilteredRecords = currentFilteredRecords.filter(record => record.completed === false);
                } else if (filters.status === 'completed') {
                    currentFilteredRecords = currentFilteredRecords.filter(record => record.completed === true);
                }
            } else if (recordType === 'MEDIA') {
                 if (['photo', 'video', 'note'].includes(filters.status)) {
                     currentFilteredRecords = currentFilteredRecords.filter(record => record.type === filters.status);
                 }
            }
            console.log(`[DEBUG ${caller} Filter] -> Applied Status/Type filter '${filters.status}'. Records remaining: ${currentFilteredRecords.length} (from ${initialCount})`);
            initialCount = currentFilteredRecords.length;
        } else {
            console.log(`[DEBUG ${caller} Filter] -> Skipping Status/Type filter (Value was '${filters.status}')`);
        }

        // --- Search Filter --- 
        console.log(`[DEBUG ${caller} Filter] Checking Search Filter. filters.search = '${filters.search}'`);
        if (filters.search && filters.search.length > 0) {
            const searchTerm = filters.search; // Already lowercase from loadRecords
            
            // Get all categories once for efficiency
            const allCategories = window.getItems ? window.getItems('CATEGORIES') : [];
            // **** Filter categories BEFORE mapping to ensure name exists ****
            const categoryMap = new Map(
                 allCategories
                     .filter(cat => cat && typeof cat.id === 'string' && typeof cat.name === 'string') // Ensure valid id and name
                     .map(cat => [cat.id, cat.name.toLowerCase()])
            );
            console.log('[DEBUG Filter] Created categoryMap with size:', categoryMap.size); // Log map size

            currentFilteredRecords = currentFilteredRecords.filter(record => {
                // **** Add check for null/undefined record ****
                if (!record) {
                    console.warn(`[DEBUG ${caller} Search Detail] Skipping null/undefined record.`);
                    return false;
                }
                
                // **** Log the record ID being processed by search ****
                console.log(`[DEBUG ${caller} Search Detail] Checking Record ID: ${record.id}`);
                
                // Safely get category name
                const categoryName = (record.categoryId && categoryMap.has(record.categoryId)) 
                                     ? categoryMap.get(record.categoryId) 
                                     : 'unknown';
                
                let fieldsToSearch = [];
                 if (recordType === 'GOALS') {
                     // GOALS: Search title, description, and category name
                     fieldsToSearch = [
                        (typeof record.title === 'string') ? record.title.toLowerCase() : '',
                        categoryName,
                        (typeof record.description === 'string') ? record.description.toLowerCase() : '' 
                    ];
                 } else if (recordType === 'SESSIONS') {
                     // SESSIONS: Search notes and category name
                     // **** More robust checks ****
                     const safeNotes = (record.notes && typeof record.notes === 'string') ? record.notes.toLowerCase() : '';
                     fieldsToSearch = [
                        categoryName, 
                        safeNotes
                    ];
                 } else if (recordType === 'MEDIA') {
                     // MEDIA: Search name (title/filename), description, and category name
                     fieldsToSearch = [
                        record.name ? record.name.toLowerCase() : '',
                        categoryName,
                        record.description ? record.description.toLowerCase() : '' 
                    ];
                 } else { 
                     // Default/Fallback
                      fieldsToSearch = [
                          record.name ? record.name.toLowerCase() : '', 
                          record.title ? record.title.toLowerCase() : '',
                          categoryName,
                          (record.notes && typeof record.notes === 'string') ? record.notes.toLowerCase() : '', // Add safety here too
                          (record.description && typeof record.description === 'string') ? record.description.toLowerCase() : '' // Add safety here too
                      ].filter(Boolean); 
                 }
                
                 // **** Log the fields being searched for this record ****
                 console.log(`[DEBUG ${caller} Search Detail] Record ID: ${record.id} - Fields:`, fieldsToSearch);
                 
                 // Check if any field contains the search term
                 let found = false; // Start assuming not found
                 fieldsToSearch.forEach((field, index) => {
                     // Ensure field is a string before calling includes
                     const isMatch = typeof field === 'string' && field.includes(searchTerm);
                     // **** Log each field comparison ****
                     console.log(`[DEBUG ${caller} Search Compare] Record ID: ${record.id}, Field[${index}]: "${field}", Term: "${searchTerm}", Match: ${isMatch}`);
                     if (isMatch) {
                         found = true;
                     }
                 });
                 
                 // **** Log the final result for this record ****
                 console.log(`[DEBUG ${caller} Search Detail] Record ID: ${record.id} - Overall Found? ${found}`);
                 
                 return found;
            });
            console.log(`[DEBUG ${caller} Filter] -> Applied Search filter '${filters.search}'. Records remaining: ${currentFilteredRecords.length} (from ${initialCount})`);
            initialCount = currentFilteredRecords.length;
        } else {
             console.log(`[DEBUG ${caller} Filter] -> Skipping Search filter (Value was '${filters.search}')`);
        }

        // --- Start Date Filter --- 
        console.log(`[DEBUG ${caller} Filter] Checking Start Date Filter. filters.startDate = '${filters.startDate}'`);
        if (filters.startDate) {
            try {
                const startDate = new Date(filters.startDate);
                if (!isNaN(startDate.getTime())) { 
                    startDate.setHours(0, 0, 0, 0); 
                    currentFilteredRecords = currentFilteredRecords.filter(record => {
                        if (!record) return false;
                        const dateField = record.startTime || record.date || record.createdAt;
                        if (!dateField) return false;
                        try {
                            const recordDate = new Date(dateField);
                            return !isNaN(recordDate.getTime()) && recordDate >= startDate;
                        } catch { return false; }
                    });
                    console.log(`[DEBUG ${caller} Filter] -> Applied Start Date filter '${filters.startDate}'. Records remaining: ${currentFilteredRecords.length} (from ${initialCount})`);
                    initialCount = currentFilteredRecords.length;
                } else {
                     console.warn(`[DEBUG ${caller} Filter] Invalid start date format: '${filters.startDate}'`);
                }
            } catch (e) { console.error("[DEBUG ${caller} Filter] Error parsing start date:", filters.startDate, e); }
        } else {
            console.log(`[DEBUG ${caller} Filter] -> Skipping Start Date filter.`);
        }
        
        // --- End Date Filter --- 
        console.log(`[DEBUG ${caller} Filter] Checking End Date Filter. filters.endDate = '${filters.endDate}'`);
        if (filters.endDate) {
             try {
                const endDate = new Date(filters.endDate);
                if (!isNaN(endDate.getTime())) { 
                    endDate.setHours(23, 59, 59, 999); 
                    currentFilteredRecords = currentFilteredRecords.filter(record => {
                        if (!record) return false;
                        const dateField = record.startTime || record.date || record.createdAt;
                        if (!dateField) return false;
                         try {
                            const recordDate = new Date(dateField);
                            return !isNaN(recordDate.getTime()) && recordDate <= endDate;
                         } catch { return false; }
                    });
                    console.log(`[DEBUG ${caller} Filter] -> Applied End Date filter '${filters.endDate}'. Records remaining: ${currentFilteredRecords.length} (from ${initialCount})`);
                    initialCount = currentFilteredRecords.length;
                 } else {
                     console.warn(`[DEBUG ${caller} Filter] Invalid end date format: '${filters.endDate}'`);
                 }
            } catch (e) { console.error("[DEBUG ${caller} Filter] Error parsing end date:", filters.endDate, e); }
        } else {
             console.log(`[DEBUG ${caller} Filter] -> Skipping End Date filter.`);
        }
        
        console.log(`[DEBUG ${caller} Filter] Finished filterRecords. Final output records: ${currentFilteredRecords.length}`);
        return currentFilteredRecords;
    }
    
    /**
     * Sort records (default: newest first based on startTime/date/createdAt)
     * @param {Array} records - Array of records
     * @param {string} recordType - Type of records (e.g., SESSIONS, GOALS)
     * @returns {Array} - Sorted array
     */
    function sortRecords(records, recordType) {
        if (!records || records.length === 0) return records;

        // Create a Map for faster date lookups
        const dateMap = new Map();
        
        return records.sort((a, b) => {
            // Get or calculate dates
            let aDate = dateMap.get(a.id);
            if (!aDate) {
                aDate = new Date(a.startTime || a.date || a.createdAt);
                dateMap.set(a.id, aDate);
            }
            
            let bDate = dateMap.get(b.id);
            if (!bDate) {
                bDate = new Date(b.startTime || b.date || b.createdAt);
                dateMap.set(b.id, bDate);
            }

            // Handle invalid dates
            if (isNaN(aDate.getTime()) && isNaN(bDate.getTime())) return 0;
            if (isNaN(aDate.getTime())) return 1;
            if (isNaN(bDate.getTime())) return -1;

            // Primary sort by date
            const timeDiff = bDate.getTime() - aDate.getTime();
            
            // Secondary sort by createdAt if dates are equal
            if (timeDiff === 0) {
                const aCreatedAt = new Date(a.createdAt);
                const bCreatedAt = new Date(b.createdAt);
                
                if (isNaN(aCreatedAt.getTime()) && isNaN(bCreatedAt.getTime())) return 0;
                if (isNaN(aCreatedAt.getTime())) return 1;
                if (isNaN(bCreatedAt.getTime())) return -1;
                
                return bCreatedAt.getTime() - aCreatedAt.getTime();
            }
            
            return timeDiff;
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
     * Create a standard dialog with form fields
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
        console.log('[DEBUG UI Framework] Setting up listeners for dialog:', dialog); // Log 1: Dialog element
        
        // ADDED direct click listener to submit button
        const submitBtn = dialog.querySelector('button[type="submit"]');
        console.log('[DEBUG UI Framework] Found submit button:', submitBtn); // Log 2: Button element
        console.log('[DEBUG UI Framework] Type of onSubmit function:', typeof onSubmit); // Log 3: Type check

        if (submitBtn && typeof onSubmit === 'function') {
             console.log('[DEBUG UI Framework] Attempting to add click listener to submit button...'); // Log 4: Before adding listener
            submitBtn.addEventListener('click', (e) => {
                e.preventDefault(); 
                console.log('[DEBUG UI Framework] Submit button CLICKED, calling onSubmit callback...'); // Log 5: Inside listener
                const form = dialog.querySelector('form'); 
                onSubmit(dialog, { target: form }); 
            });
             console.log('[DEBUG UI Framework] Click listener ADDED to submit button.'); // Log 6: After adding listener
        } else {
             console.warn('[DEBUG UI Framework] Could not add submit listener. Button found:', !!submitBtn, 'Is onSubmit a function:', typeof onSubmit === 'function'); // Log 7: If listener not added
        }

        const cancelBtn = dialog.querySelector('.cancel-btn');
        console.log('[DEBUG UI Framework] Found cancel button:', cancelBtn); // Log 8: Cancel button check
        if (cancelBtn && typeof onCancel === 'function') {
            cancelBtn.addEventListener('click', () => {
                onCancel(dialog);
            });
        }
        
        // Add to document
        document.body.appendChild(dialog);
        
        // Initialize icons in the dialog using the shared utility
        if (window.Utils) {
            window.Utils.initializeIcons(dialog);
        } else if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
        
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
    
    // --- Global Event Listener for Category Updates --- 
    document.addEventListener('categoriesUpdated', () => {
        console.log('[UI Framework] Received categoriesUpdated event. Refreshing active category filters.');
        activeCategoryFilters.forEach(filterElement => {
            // Check if the element is still in the DOM before trying to update
            if (document.body.contains(filterElement)) {
                setupCategoryFilter(filterElement); // Rebuild the options
            } else {
                console.warn('[UI Framework] Found a stale category filter reference. Removing it.');
                // Optional: Remove stale references from activeCategoryFilters array here if needed
            }
        });
    });

    // --- Add Global Event Listener for Data Changes --- 
    document.addEventListener('dataChanged', (e) => {
        console.log('[UI Framework] Received dataChanged event:', e.detail);
        if (e.detail && e.detail.type === 'CATEGORIES') {
            console.log('[UI Framework] Category data changed. Setting refresh flag.');
            categoriesNeedRefresh = true; // **** Set the flag ****
            // --- REMOVE logic that tried to refresh immediately --- 
            /* // REMOVED BLOCK
            let refreshedFilter = false; 
            Object.keys(domCache).forEach(pageId => { 
                 // ... code to find active page and refresh filter ... 
            });
            if (!refreshedFilter) { 
                 console.log('[UI Framework] No active page requiring category filter refresh was found.');
            }
            */
        }
    });

    // Add a function to optimize tab switching
    function optimizeTabSwitching() {
        // Get all tab buttons
        const tabButtons = document.querySelectorAll('.nav-item');
        if (!tabButtons || tabButtons.length === 0) {
            console.warn('[UI Framework] No tab buttons found for tab switch optimization');
            return;
        }
        
        console.log('[UI Framework] Setting up optimized tab switching for', tabButtons.length, 'tabs');
        
        // Map tab buttons to their respective page IDs
        const tabToPageMap = {
            'timer': 'timer',
            'sessions': 'sessions',
            'goals': 'goals',
            'stats': 'stats',
            'media': 'media',
            'resources': 'resources'
        };
        
        // Add click listeners to tab buttons for optimized switching
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.getAttribute('data-tab') || this.id;
                const pageId = tabToPageMap[tabId];
                
                if (!pageId) {
                    console.warn(`[UI Framework] Could not map tab ${tabId} to a page ID`);
                    return;
                }
                
                console.log(`[UI Framework] Tab switch detected to ${pageId}`);
                
                // If we have cached data and the page is initialized, load it
                if (initializedPages[pageId] && pageId !== currentActiveTab) {
                    // Set short timeout to allow the DOM to update first
                    setTimeout(() => {
                        console.log(`[UI Framework] Loading records for newly visible tab: ${pageId}`);
                        loadRecords(pageId);
                    }, 10);
                }
            });
        });
        
        console.log('[UI Framework] Tab switching optimization complete');
    }

    // Initialize tab switching optimization when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        setTimeout(optimizeTabSwitching, 100);
    });
    
    // Clear the render cache when data changes
    document.addEventListener('dataChanged', function(e) {
        if (e.detail && e.detail.type) {
            const recordType = e.detail.type;
            console.log(`[UI Framework] Data changed for ${recordType}, clearing render cache`);
            
            // Clear relevant tab caches
            Object.keys(tabRenderCache).forEach(pageId => {
                if (domCache[pageId] && domCache[pageId].recordType === recordType) {
                    console.log(`[UI Framework] Clearing render cache for ${pageId}`);
                    tabRenderCache[pageId] = {};
                }
            });
        }
    });

    // Return public API
    return {
        initRecordPage,
        setupCategoryFilter,
        loadRecords,
        filterRecords,
        sortRecords,
        showEmptyState,
        createStandardDialog,
        confirmDialog,
        optimizeTabSwitching
    };
})(); 