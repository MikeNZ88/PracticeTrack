
window.PracticeResourceFinder = (function() {
    // Database will be loaded from js/resource-database.js
    // Ensure resource-database.js is included before this file in your HTML.

    // We'll add this function to load the external database
    function loadResourceDatabase() {
        if (window.PracticeResourceDatabase) {
            console.log("Resource database found with keys:", Object.keys(window.PracticeResourceDatabase));
            return window.PracticeResourceDatabase;
        }
        console.error("Resource database not found. Make sure js/resource-database.js is loaded before js/resource-finder.js.");
        // Return a minimal structure to prevent errors, but functionality will be limited.
        return { all: { beginner: { theory: { any: { searchTerms: [], channels: [] } } } } };
    }

    // Default filter state
    let currentFilters = {
        instrument: 'all',
        skillLevel: 'beginner',
        topic: 'theory',
        musicStyle: 'any',
        searchQuery: ''
    };

    let dialogElement = null;
    
    // Create and manage the resource finder dialog
    function createModalHTML() {
        // Get the actual database to use
        const database = loadResourceDatabase();
        
        // Log the database structure to debug
        console.log("Database loaded in createModalHTML:", database);
        
        // Generate instrument options - explicitly list known instruments to ensure they appear
        const knownInstruments = ['all', 'piano', 'guitar', 'bass', 'drums', 'voice'];
        const databaseInstruments = Object.keys(database).filter(key => key !== 'all');
        const allInstruments = [...new Set([...knownInstruments, ...databaseInstruments])];
        
        const instrumentOptions = allInstruments
            .map(key => `<option value="${key}" ${key === currentFilters.instrument ? 'selected' : ''}>${capitalizeFirstLetter(key)}</option>`)
            .join('');
            
        // Generate skill level options
        const skillLevelOptions = ['beginner', 'intermediate', 'advanced']
            .map(level => `<option value="${level}" ${level === currentFilters.skillLevel ? 'selected' : ''}>${capitalizeFirstLetter(level)}</option>`)
            .join('');
            
        // Generate topic options
        const topicOptions = ['theory', 'technique', 'composition', 'improvisation', 'ear training', 'audio production', 'music business', 'performance']
            .map(topic => `<option value="${topic}" ${topic === currentFilters.topic ? 'selected' : ''}>${capitalizeFirstLetter(topic)}</option>`)
            .join('');
            
        // Generate music style options
        const musicStyleOptions = ['any', 'classical', 'jazz', 'rock', 'metal', 'extreme metal', 'pop', 'blues', 'folk', 'acoustic', 'hip hop', 'rnb', 'electronic', 'reggae', 'fusion', 'avante garde']
            .map(style => `<option value="${style}" ${style === currentFilters.musicStyle ? 'selected' : ''}>${capitalizeFirstLetter(style)}</option>`)
            .join('');

        return `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h2>Find Practice Resources</h2>
                    <button class="close-button" data-close-finder>
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dialog-body resource-finder-body">
                    <p>Select your criteria to find suggested YouTube search terms and channels.</p>
                    <p class="disclaimer" style="font-size: 0.8em; color: #666; margin-bottom: 15px;"><em>Note: This assistant is not affiliated with or endorsed by YouTube. It provides search suggestions to help with your practice.</em></p>
                    <div class="resource-finder-filters">
                        <div class="form-group">
                            <label for="finder-instrument">Instrument:</label>
                            <select id="finder-instrument">${instrumentOptions}</select>
                        </div>
                        <div class="form-group">
                            <label for="finder-skillLevel">Skill Level:</label>
                            <select id="finder-skillLevel">${skillLevelOptions}</select>
                        </div>
                        <div class="form-group">
                            <label for="finder-topic">Topic:</label>
                            <select id="finder-topic">${topicOptions}</select>
                        </div>
                        <div class="form-group">
                            <label for="finder-musicStyle">Music Style:</label>
                            <select id="finder-musicStyle">${musicStyleOptions}</select>
                        </div>
                        <div class="form-group search-group">
                            <label for="finder-searchQuery">Search Keywords:</label>
                            <input type="search" id="finder-searchQuery" placeholder="Filter results by keyword..." value="${currentFilters.searchQuery}">
                        </div>
                    </div>
                    <div class="resource-finder-results">
                        <p class="results-placeholder">Select filters to see results.</p>
                    </div>
                </div>
            </div>
        `;
    }

    // Find resources based on the current filters
    function findResources() {
        // Get the actual database to use
        const database = loadResourceDatabase();
        
        // Destructure filters for easier use
        const { instrument, skillLevel, topic, musicStyle, searchQuery } = currentFilters;
        
        // Initialize results
        let results = { searchTerms: [], channels: [] };
        
        try {
            console.log("Current filters:", currentFilters);
            
            // Check if we need to fall back to the 'all' instrument
            let instrumentToUse = instrument;
            if (!database[instrument] && instrument !== 'all') {
                console.log(`No data found for ${instrument}, falling back to 'all'`);
                instrumentToUse = 'all';
            }
            
            // Safely navigate resource database based on filters
            const instrumentData = database[instrumentToUse];
            if (!instrumentData) {
                console.log(`No data found for instrument: ${instrumentToUse}`);
                return results;
            }
            
            // Check if we need to fall back to 'beginner' skill level
            let skillLevelToUse = skillLevel;
            if (!instrumentData[skillLevel]) {
                console.log(`No data found for ${instrumentToUse} at ${skillLevel} level, falling back to 'beginner'`);
                skillLevelToUse = 'beginner';
            }
            
            const levelData = instrumentData[skillLevelToUse];
            if (!levelData) {
                console.log(`No data found for skill level: ${skillLevelToUse}`);
                return results;
            }
            
            // Check if we need to fall back to 'theory' topic
            let topicToUse = topic;
            if (!levelData[topic]) {
                console.log(`No data found for ${topic} under ${instrumentToUse}/${skillLevelToUse}, falling back to 'theory'`);
                topicToUse = 'theory';
            }
            
            const topicData = levelData[topicToUse];
            if (!topicData) {
                console.log(`No data found for topic: ${topicToUse}`);
                return results;
            }
            
            // Always check 'any' style as a fallback
            if (topicData.any) {
                results.searchTerms = [...topicData.any.searchTerms || []];
                results.channels = [...topicData.any.channels || []];
            }
            
            // Add specific style if selected and exists
            if (musicStyle !== 'any' && topicData[musicStyle]) {
                results.searchTerms = [
                    ...results.searchTerms,
                    ...(topicData[musicStyle].searchTerms || [])
                ];
                results.channels = [
                    ...results.channels,
                    ...(topicData[musicStyle].channels || [])
                ];
            }
            
            // If no style-specific results found and using a specific style, try the 'any' style
            if (results.searchTerms.length === 0 && results.channels.length === 0 && musicStyle !== 'any') {
                console.log(`No specific style data for ${musicStyle}, trying 'any' style`);
                if (topicData.any) {
                    results.searchTerms = [...topicData.any.searchTerms || []];
                    results.channels = [...topicData.any.channels || []];
                }
            }
            
            // Deduplicate channels by link
            const uniqueChannels = {};
            results.channels.forEach(channel => {
                if (channel.link) {
                    uniqueChannels[channel.link] = channel;
                }
            });
            results.channels = Object.values(uniqueChannels);
            
            // Deduplicate search terms
            results.searchTerms = [...new Set(results.searchTerms)];
            
            // Apply search query filtering if provided
            if (searchQuery) {
                const query = searchQuery.toLowerCase();
                results.searchTerms = results.searchTerms.filter(term => 
                    term.toLowerCase().includes(query)
                );
                results.channels = results.channels.filter(channel => 
                    channel.name.toLowerCase().includes(query) || 
                    (channel.description && channel.description.toLowerCase().includes(query))
                );
            }
            
            console.log("Found results:", results);
        } catch (error) {
            console.error("Error finding resources:", error);
        }
        
        return results;
    }

    // Render results to the dialog
    function renderResults() {
        const resultsContainer = dialogElement.querySelector('.resource-finder-results');
        if (!resultsContainer) return;
        
        const results = findResources();
        
        // Check if no results found
        if (results.searchTerms.length === 0 && results.channels.length === 0) {
            resultsContainer.innerHTML = '<p class="results-placeholder">No matching resources found for these criteria.</p>';
            return;
        }
        
        let html = '';
        
        // Render search terms section
        if (results.searchTerms.length > 0) {
            html += '<h3>Suggested YouTube Search Terms</h3><ul class="search-term-list">';
            results.searchTerms.forEach(term => {
                // Escape double quotes for safety
                const safeTerm = term.replace(/"/g, '&quot;');
                html += `
                    <li>
                        <span>${term}</span>
                        <button class="copy-button" data-term="${safeTerm}" title="Copy search term">
                            <i data-lucide="copy"></i>
                        </button>
                    </li>`;
            });
            html += '</ul>';
        }
        
        // Render channels section
        if (results.channels.length > 0) {
            html += '<h3>Recommended YouTube Channels</h3><ul class="channel-list">';
            results.channels.forEach(channel => {
                // Escape content for safety
                const safeName = channel.name.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                const safeDesc = channel.description.replace(/</g, '&lt;').replace(/>/g, '&gt;');
                html += `
                    <li>
                        <a href="${channel.link}" target="_blank" rel="noopener noreferrer" class="channel-link">
                            <span class="channel-name">${safeName}</span>
                            <span class="channel-description">${safeDesc}</span>
                        </a>
                    </li>`;
            });
            html += '</ul>';
        }
        
        resultsContainer.innerHTML = html;
        
        // Initialize Lucide icons
        if (window.lucide) {
            lucide.createIcons({
                icons: resultsContainer.querySelectorAll('[data-lucide]')
            });
        }
        
        // Add copy button functionality
        addCopyButtonListeners(resultsContainer);
    }

    // Set up copy button functionality
    function addCopyButtonListeners(container) {
        const buttons = container.querySelectorAll('.copy-button');
        buttons.forEach(button => {
            button.addEventListener('click', handleCopyClick);
        });
    }

    // Handle the copy button click event
    function handleCopyClick(event) {
        const button = event.currentTarget;
        const term = button.getAttribute('data-term');
        
        // Create temporary textarea to copy from
        const tempTextArea = document.createElement('textarea');
        tempTextArea.value = term;
        document.body.appendChild(tempTextArea);
        tempTextArea.select();
        document.execCommand('copy');
        document.body.removeChild(tempTextArea);
        
        // Give visual feedback by changing the icon temporarily
        const icon = button.querySelector('i');
        if (icon && window.lucide) {
            icon.setAttribute('data-lucide', 'check');
            lucide.createIcons({
                icons: [icon]
            });
            
            // Reset after delay
            setTimeout(() => {
                icon.setAttribute('data-lucide', 'copy');
                lucide.createIcons({
                    icons: [icon]
                });
            }, 2000);
        }
    }

    // Update filters and rerender results
    function handleFilterChange() {
        currentFilters.instrument = document.getElementById('finder-instrument').value;
        currentFilters.skillLevel = document.getElementById('finder-skillLevel').value;
        currentFilters.topic = document.getElementById('finder-topic').value;
        currentFilters.musicStyle = document.getElementById('finder-musicStyle').value;
        currentFilters.searchQuery = document.getElementById('finder-searchQuery').value;
        
        renderResults();
    }

    // Debounce function for search input
    function debounce(func, wait) {
        let timeout;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    }

    // Add CSS to ensure the dialog is centered
    function addStyles() {
        // Check if our styles already exist
        if (document.getElementById('resource-finder-styles')) return;
        
        const styleElement = document.createElement('style');
        styleElement.id = 'resource-finder-styles';
        styleElement.textContent = `
            /* Direct centering approach */
            .resource-finder-dialog {
                position: fixed !important;
                top: 50% !important;
                left: 50% !important;
                transform: translate(-50%, -50%) !important;
                z-index: 9999 !important;
                background-color: rgba(0, 0, 0, 0.5) !important;
                width: 90% !important;
                max-width: 800px !important;
                margin: 0 !important;
                border-radius: 8px !important;
                box-shadow: 0 5px 20px rgba(0, 0, 0, 0.3) !important;
                overflow: hidden !important;
            }
            
            /* Style close button */
            .resource-finder-dialog .close-button {
                position: absolute !important;
                top: 10px !important;
                right: 10px !important;
                cursor: pointer !important;
                z-index: 10 !important;
                background: none !important;
                border: none !important;
                padding: 5px !important;
            }
            
            /* Button modifications for YouTube Assistant */
            .youtube-assistant-button {
                display: flex !important;
                align-items: center !important;
                gap: 8px !important;
                background-color: #FF0000 !important; /* YouTube red */
                color: white !important;
                border: none !important;
                border-radius: 4px !important;
                padding: 8px 12px !important;
                cursor: pointer !important;
                font-weight: bold !important;
            }
            
            /* YouTube logo size */
            .youtube-assistant-button .youtube-logo {
                width: 20px !important;
                height: 20px !important;
            }
            
            /* Hide default elements */
            .standard-dialog {
                display: none !important;
            }
            
            .standard-dialog.visible {
                display: block !important;
            }
        `;
        document.head.appendChild(styleElement);
    }

    // Show the resource finder dialog
    function show() {
        // Add our custom styles
        addStyles();
        
        if (!dialogElement) {
            // Create dialog element if it doesn't exist
            dialogElement = document.createElement('div');
            dialogElement.className = 'standard-dialog resource-finder-dialog';
            dialogElement.innerHTML = createModalHTML();
            document.body.appendChild(dialogElement);
            
            // Add event listeners
            const closeBtn = dialogElement.querySelector('[data-close-finder]');
            closeBtn.addEventListener('click', hide);
            
            // Add filter change listeners
            document.getElementById('finder-instrument').addEventListener('change', handleFilterChange);
            document.getElementById('finder-skillLevel').addEventListener('change', handleFilterChange);
            document.getElementById('finder-topic').addEventListener('change', handleFilterChange);
            document.getElementById('finder-musicStyle').addEventListener('change', handleFilterChange);
            
            // Debounce search input
            const searchInput = document.getElementById('finder-searchQuery');
            searchInput.addEventListener('input', debounce(handleFilterChange, 300));
            
            // Allow clicking outside to close
            dialogElement.addEventListener('click', event => {
                if (event.target === dialogElement) hide();
            });
            
            // Allow ESC key to close
            document.addEventListener('keydown', event => {
                if (event.key === 'Escape' && dialogElement.classList.contains('visible')) {
                    hide();
                }
            });
            
            // Initialize Lucide icons
            if (window.lucide) {
                lucide.createIcons({
                    icons: dialogElement.querySelectorAll('[data-lucide]')
                });
            }
            
            // Create YouTube Assistant button
            const assistantButton = document.createElement('button');
            assistantButton.className = 'youtube-assistant-button';
            assistantButton.innerHTML = `
                <svg class="youtube-logo" viewBox="0 0 24 24" fill="white">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <span>Assistant</span>
            `;
            
            // Add assistant button to the header
            const dialogHeader = dialogElement.querySelector('.dialog-header');
            dialogHeader.insertBefore(assistantButton, dialogHeader.firstChild);
        }
        
        // Show the dialog
        dialogElement.classList.add('visible');
        
        // Render initial results
        renderResults();
    }

    // Hide the resource finder dialog
    function hide() {
        if (dialogElement) {
            dialogElement.classList.remove('visible');
        }
    }

    // Helper function to capitalize first letter
    function capitalizeFirstLetter(string) {
        if (!string) return '';
        if (string.toLowerCase() === 'rnb') return 'RnB';
        if (string.toLowerCase() === 'all') return 'All';
        return string.split(' ').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
    }

    // Return public API
    return {
        show: show,
        hide: hide
    };
})();
