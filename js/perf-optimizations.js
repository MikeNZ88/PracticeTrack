/**
 * Performance Optimizations Module
 * Provides performance enhancements for record tabs (goals, sessions, media)
 */

// Initialize the performance optimization namespace
window.PerfOpt = (function() {
    // Date parsing cache to avoid repeated parsing
    const dateCache = new Map();
    
    // Results cache for filtered/sorted records
    const resultsCache = new Map();
    
    // Cache expiration time (10 seconds)
    const CACHE_EXPIRATION = 10000;
    
    // Default batch size for virtual scrolling
    const DEFAULT_BATCH_SIZE = 20;
    
    /**
     * Generate a cache key from filters
     * @param {string} recordType - Type of records
     * @param {Object} filters - Filter criteria
     * @returns {string} - Cache key
     */
    function generateCacheKey(recordType, filters) {
        return `${recordType}:${JSON.stringify(filters)}`;
    }
    
    /**
     * Get cached date or parse new date
     * @param {Object} record - The record containing date
     * @returns {Date} - Parsed date
     */
    function getRecordDate(record) {
        if (!record || !record.id) return new Date(0); // Invalid date for null/invalid records
        
        if (dateCache.has(record.id)) {
            return dateCache.get(record.id);
        }
        
        const dateField = record.startTime || record.date || record.createdAt;
        const date = new Date(dateField);
        
        // Only cache valid dates
        if (!isNaN(date.getTime())) {
            dateCache.set(record.id, date);
        }
        
        return date;
    }
    
    /**
     * Get or calculate filtered and sorted records
     * @param {Array} records - Array of records
     * @param {Object} filters - Filter criteria
     * @param {string} recordType - Type of records
     * @param {Function} filterFn - Filter function
     * @param {Function} sortFn - Sort function
     * @returns {Array} - Filtered and sorted records
     */
    function getCachedOrComputeRecords(records, filters, recordType, filterFn, sortFn) {
        const cacheKey = generateCacheKey(recordType, filters);
        
        // Check if we have a valid cache entry
        if (resultsCache.has(cacheKey)) {
            const cacheEntry = resultsCache.get(cacheKey);
            // Check if cache is still valid
            if (Date.now() - cacheEntry.timestamp < CACHE_EXPIRATION) {
                console.log(`[PerfOpt] Using cached results for ${cacheKey}`);
                return cacheEntry.results;
            }
        }
        
        console.log(`[PerfOpt] Computing results for ${cacheKey}`);
        
        // Compute results
        const filteredRecords = filterFn(records, filters, recordType);
        const sortedRecords = sortFn(filteredRecords, recordType);
        
        // Cache results
        resultsCache.set(cacheKey, {
            results: sortedRecords,
            timestamp: Date.now()
        });
        
        return sortedRecords;
    }
    
    /**
     * Render records with virtual scrolling
     * @param {Array} records - Array of records to render
     * @param {HTMLElement} container - Container element
     * @param {Function} createElementFn - Function to create element for each record
     * @param {Function} showEmptyStateFn - Function to show empty state
     * @param {number} batchSize - Number of records to render initially
     */
    function renderRecordsBatched(records, container, createElementFn, showEmptyStateFn, batchSize = DEFAULT_BATCH_SIZE) {
        // Clear existing content
        container.innerHTML = '';
        
        // Show empty state if no records
        if (!records || records.length === 0) {
            if (typeof showEmptyStateFn === 'function') {
                showEmptyStateFn(container);
            }
            return;
        }
        
        // Calculate initial batch
        const initialBatch = records.slice(0, batchSize);
        
        // Use document fragment for better performance
        const fragment = document.createDocumentFragment();
        
        // Create elements for initial batch
        initialBatch.forEach(record => {
            if (typeof createElementFn === 'function') {
                const element = createElementFn(record);
                if (element) {
                    fragment.appendChild(element);
                }
            }
        });
        
        // Create load more container if there are more records
        if (records.length > batchSize) {
            const loadMoreContainer = document.createElement('div');
            loadMoreContainer.className = 'load-more-container';
            loadMoreContainer.style.display = 'flex';
            loadMoreContainer.style.justifyContent = 'center';
            loadMoreContainer.style.padding = '1rem 0';
            loadMoreContainer.style.margin = '1rem 0';
            loadMoreContainer.style.width = '100%';
            
            loadMoreContainer.innerHTML = `
                <button id="load-more-btn" class="app-button app-button--secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem;">
                    Load More (${records.length - batchSize} remaining)
                </button>
            `;
            fragment.appendChild(loadMoreContainer);
        }
        
        // Append all at once
        container.appendChild(fragment);
        
        // Add event listener for load more button
        const loadMoreBtn = container.querySelector('#load-more-btn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                // Remove the load more button
                const loadMoreContainer = loadMoreBtn.parentElement;
                loadMoreContainer.remove();
                
                // Get current count of displayed records
                const currentCount = container.querySelectorAll('.session-item, .goal-item, .media-card').length;
                
                // Calculate next batch
                const nextBatch = records.slice(currentCount, currentCount + batchSize);
                
                // Use document fragment for better performance
                const nextFragment = document.createDocumentFragment();
                
                // Create elements for next batch
                nextBatch.forEach(record => {
                    if (typeof createElementFn === 'function') {
                        const element = createElementFn(record);
                        if (element) {
                            nextFragment.appendChild(element);
                        }
                    }
                });
                
                // Create new load more container if there are still more records
                if (currentCount + nextBatch.length < records.length) {
                    const newLoadMoreContainer = document.createElement('div');
                    newLoadMoreContainer.className = 'load-more-container';
                    newLoadMoreContainer.style.display = 'flex';
                    newLoadMoreContainer.style.justifyContent = 'center';
                    newLoadMoreContainer.style.padding = '1rem 0';
                    newLoadMoreContainer.style.margin = '1rem 0';
                    newLoadMoreContainer.style.width = '100%';
                    
                    newLoadMoreContainer.innerHTML = `
                        <button id="load-more-btn" class="app-button app-button--secondary" style="display: inline-flex; align-items: center; justify-content: center; padding: 0.75rem 1.5rem;">
                            Load More (${records.length - (currentCount + nextBatch.length)} remaining)
                        </button>
                    `;
                    nextFragment.appendChild(newLoadMoreContainer);
                }
                
                // Append all at once
                container.appendChild(nextFragment);
                
                // Add event listener for new load more button
                const newLoadMoreBtn = container.querySelector('#load-more-btn');
                if (newLoadMoreBtn) {
                    newLoadMoreBtn.addEventListener('click', () => {
                        loadMoreBtn.click(); // Reuse existing handler
                    });
                }
                
                // Re-initialize icons for new elements
                if (window.lucide && typeof window.lucide.createIcons === 'function') {
                    window.lucide.createIcons({
                        scope: container
                    });
                }
            });
        }
        
        // Initialize icons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons({
                scope: container
            });
        }
    }
    
    /**
     * Create debounced version of a function
     * @param {Function} func - Function to debounce
     * @param {number} wait - Wait time in milliseconds
     * @returns {Function} - Debounced function
     */
    function debounce(func, wait = 300) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
    
    /**
     * Invalidate cache for a specific record type
     * @param {string} recordType - Type of records to invalidate
     */
    function invalidateCache(recordType) {
        console.log(`[PerfOpt] Invalidating cache for ${recordType}`);
        
        // Find and remove all cache entries for this record type
        for (const key of resultsCache.keys()) {
            if (key.startsWith(`${recordType}:`)) {
                resultsCache.delete(key);
            }
        }
    }
    
    /**
     * Optimized filtering function
     * @param {Array} records - Records to filter
     * @param {Object} filters - Filter criteria
     * @param {string} recordType - Type of records
     * @returns {Array} - Filtered records
     */
    function optimizedFilterRecords(records, filters, recordType) {
        const caller = recordType || 'Unknown';
        console.log(`[PerfOpt] Filtering ${records.length} ${caller} records with optimized filter`);
        
        let currentFilteredRecords = records.filter(record => record !== null && record !== undefined);
        const initialCount = currentFilteredRecords.length;
        
        // Skip filtering if no filters are applied
        if (!filters || (
            !filters.search && 
            (!filters.categoryId || filters.categoryId === 'all') && 
            !filters.startDate && 
            !filters.endDate && 
            (!filters.status || filters.status === 'all')
        )) {
            console.log(`[PerfOpt] No filters applied, returning all ${initialCount} records`);
            return currentFilteredRecords;
        }
        
        // Apply category filter
        if (filters.categoryId && filters.categoryId !== 'all') {
            currentFilteredRecords = currentFilteredRecords.filter(record => 
                record.categoryId === filters.categoryId
            );
            console.log(`[PerfOpt] Applied category filter: ${currentFilteredRecords.length} records remaining`);
        }
        
        // Apply status filter (for goals)
        if (filters.status && filters.status !== 'all') {
            if (filters.status === 'active') {
                currentFilteredRecords = currentFilteredRecords.filter(record => !record.completed);
            } else if (filters.status === 'completed') {
                currentFilteredRecords = currentFilteredRecords.filter(record => record.completed);
            }
            console.log(`[PerfOpt] Applied status filter: ${currentFilteredRecords.length} records remaining`);
        }
        
        // Apply date filters using the date cache
        if (filters.startDate) {
            try {
                const startDate = new Date(filters.startDate);
                startDate.setHours(0, 0, 0, 0);
                
                if (!isNaN(startDate.getTime())) {
                    currentFilteredRecords = currentFilteredRecords.filter(record => {
                        const recordDate = getRecordDate(record);
                        return recordDate >= startDate;
                    });
                    console.log(`[PerfOpt] Applied start date filter: ${currentFilteredRecords.length} records remaining`);
                }
            } catch (e) {
                console.error('[PerfOpt] Error applying start date filter:', e);
            }
        }
        
        if (filters.endDate) {
            try {
                const endDate = new Date(filters.endDate);
                endDate.setHours(23, 59, 59, 999);
                
                if (!isNaN(endDate.getTime())) {
                    currentFilteredRecords = currentFilteredRecords.filter(record => {
                        const recordDate = getRecordDate(record);
                        return recordDate <= endDate;
                    });
                    console.log(`[PerfOpt] Applied end date filter: ${currentFilteredRecords.length} records remaining`);
                }
            } catch (e) {
                console.error('[PerfOpt] Error applying end date filter:', e);
            }
        }
        
        // Apply search filter (potentially most expensive operation)
        if (filters.search && filters.search.length > 0) {
            const searchTerm = filters.search.toLowerCase();
            
            // Create a map of category IDs to names for faster lookups
            const categoryMap = new Map();
            try {
                const categories = window.getItems ? window.getItems('CATEGORIES') : [];
                categories.forEach(cat => {
                    if (cat && cat.id && cat.name) {
                        categoryMap.set(cat.id, cat.name.toLowerCase());
                    }
                });
            } catch (e) {
                console.error('[PerfOpt] Error creating category map:', e);
            }
            
            currentFilteredRecords = currentFilteredRecords.filter(record => {
                // Get category name from map
                const categoryName = record.categoryId ? categoryMap.get(record.categoryId) || '' : '';
                
                // Define searchable fields based on record type
                const searchableFields = [];
                
                // Common fields
                if (record.title) searchableFields.push(record.title.toLowerCase());
                if (record.description) searchableFields.push(record.description.toLowerCase());
                if (record.notes) searchableFields.push(record.notes.toLowerCase());
                if (categoryName) searchableFields.push(categoryName);
                
                // Record-specific fields
                if (recordType === 'MEDIA' && record.name) {
                    searchableFields.push(record.name.toLowerCase());
                }
                
                // Check if any field contains the search term
                return searchableFields.some(field => field.includes(searchTerm));
            });
            
            console.log(`[PerfOpt] Applied search filter: ${currentFilteredRecords.length} records remaining`);
        }
        
        return currentFilteredRecords;
    }
    
    /**
     * Optimized sorting function
     * @param {Array} records - Records to sort
     * @param {string} recordType - Type of records
     * @returns {Array} - Sorted records
     */
    function optimizedSortRecords(records, recordType) {
        if (!records || records.length === 0) return records;
        
        console.log(`[PerfOpt] Sorting ${records.length} ${recordType || 'unknown'} records`);
        
        return records.sort((a, b) => {
            // Get dates using cache
            const aDate = getRecordDate(a);
            const bDate = getRecordDate(b);
            
            // Handle invalid dates
            if (isNaN(aDate.getTime()) && isNaN(bDate.getTime())) return 0;
            if (isNaN(aDate.getTime())) return 1;
            if (isNaN(bDate.getTime())) return -1;
            
            // Sort by date (newest first)
            return bDate.getTime() - aDate.getTime();
        });
    }
    
    // Event listener for data changes to invalidate cache
    document.addEventListener('dataChanged', (e) => {
        if (e.detail && e.detail.type) {
            invalidateCache(e.detail.type);
        }
    });
    
    // Return public API
    return {
        getRecordDate,
        getCachedOrComputeRecords,
        renderRecordsBatched,
        debounce,
        invalidateCache,
        optimizedFilterRecords,
        optimizedSortRecords
    };
})(); 