/**
 * Media Module
 * Manages practice media using the common UI framework
 */

// Media data storage
let mediaDialog = null;

// Reference to the media list container
const mediaListContainer = document.getElementById('media-list');

/**
 * Initialize media page
 */
function initializeMedia() {
    console.log('[DEBUG Media] Initializing media page with performance optimizations');
    
    // Use the UI framework to initialize the media page
    window.UI.initRecordPage({
        pageId: 'media',
        recordType: 'MEDIA',
        listContainerId: 'media-list',
        searchInputSelector: '.search-input',
        dateInputsSelector: '.date-input',
        statusFilterSelector: '.media-type-filter',
        emptyStateMessage: 'No media yet. Add photos, videos, or notes to track your progress.',
        emptyStateIcon: 'image',
        createRecordElementFn: createMediaElement
    });
    
    // Setup media buttons
    setupMediaButtons();
    
    // Add media-specific styles
    addMediaStyles();

    // Add listener for the Upload button
    const uploadButton = document.getElementById('upload-media-btn');
    if (uploadButton) {
        // Remove any existing listeners to prevent duplicates
        const newUploadButton = uploadButton.cloneNode(true);
        uploadButton.parentNode.replaceChild(newUploadButton, uploadButton);
        
        // Add new listener
        newUploadButton.addEventListener('click', handleMediaUpload);
    }
    
    // --- Add Date Preset Logic with Performance Optimizations --- 
    const pageElement = document.getElementById('media-page');
    const presetFilter = pageElement ? pageElement.querySelector('.date-preset-filter') : null;
    const startDateInput = pageElement ? pageElement.querySelector('#media-start-date') : null;
    const endDateInput = pageElement ? pageElement.querySelector('#media-end-date') : null;
    const dateRangeDiv = pageElement ? pageElement.querySelector('.date-range') : null;
    
    if (presetFilter && startDateInput && endDateInput && dateRangeDiv) {
        const handleMediaPresetChange = () => {
            const selectedPreset = presetFilter.value;
            console.log(`[DEBUG Media] Date preset changed to: ${selectedPreset}`);
            
            const today = new Date();
            let startDate = '';
            let endDate = '';
            
            // Show/hide custom date inputs based on preset
            if (selectedPreset === 'custom') {
                dateRangeDiv.style.display = 'flex';
                return; // Don't set dates for custom
            } else {
                dateRangeDiv.style.display = 'none';
            }
            
            // Calculate date ranges based on preset
            switch (selectedPreset) {
                case 'today':
                    startDate = today.toISOString().split('T')[0];
                    endDate = startDate;
                    break;
                case 'yesterday':
                    const yesterday = new Date(today);
                    yesterday.setDate(yesterday.getDate() - 1);
                    startDate = yesterday.toISOString().split('T')[0];
                    endDate = startDate;
                    break;
                case 'thisWeek':
                    const thisWeekStart = new Date(today);
                    const dayOfWeek = today.getDay(); // 0 = Sunday, 6 = Saturday
                    const daysFromMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
                    thisWeekStart.setDate(today.getDate() - daysFromMonday);
                    startDate = thisWeekStart.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                    break;
                case 'thisMonth':
                    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
                    startDate = thisMonthStart.toISOString().split('T')[0];
                    endDate = today.toISOString().split('T')[0];
                    break;
                case 'all':
                default:
                    startDate = '';
                    endDate = '';
                    // Clear date inputs
                    startDateInput.value = '';
                    endDateInput.value = '';
                    dateRangeDiv.style.display = 'none';
                    break;
            }

            // Set input values
            if (startDateInput && endDateInput && selectedPreset !== 'all') {
                startDateInput.value = startDate;
                endDateInput.value = endDate;
            }
            
            // Use optimized filtering if available
            if (window.PerfOpt) {
                window.PerfOpt.invalidateCache('MEDIA');
            }
            
            // Reload records with new filters
            window.UI.loadRecords('media');
        };
        
        // Clone elements to remove any existing event listeners
        const newPresetFilter = presetFilter.cloneNode(true);
        presetFilter.parentNode.replaceChild(newPresetFilter, presetFilter);
        
        const newStartDateInput = startDateInput.cloneNode(true);
        startDateInput.parentNode.replaceChild(newStartDateInput, startDateInput);
        
        const newEndDateInput = endDateInput.cloneNode(true);
        endDateInput.parentNode.replaceChild(newEndDateInput, endDateInput);
        
        // Attach the handler to the change event
        newPresetFilter.addEventListener('change', handleMediaPresetChange);
        
        // Custom date input handlers with debounce if available
        const dateChangeHandler = window.PerfOpt ? 
            window.PerfOpt.debounce(() => {
                newPresetFilter.value = 'custom';
                dateRangeDiv.style.display = 'flex';
                window.UI.loadRecords('media');
            }, 300) : 
            () => {
                newPresetFilter.value = 'custom';
                dateRangeDiv.style.display = 'flex';
                window.UI.loadRecords('media');
            };
        
        newStartDateInput.addEventListener('change', dateChangeHandler);
        newEndDateInput.addEventListener('change', dateChangeHandler);

        // Set initial state to "Today"
        newPresetFilter.value = 'today';
        
        // Apply the initial filter
        handleMediaPresetChange();
    }
    
    // Add optimized event listener for media type filter
    const typeFilter = pageElement ? pageElement.querySelector('.media-type-filter') : null;
    if (typeFilter && window.PerfOpt) {
        const newTypeFilter = typeFilter.cloneNode(true);
        typeFilter.parentNode.replaceChild(newTypeFilter, typeFilter);
        
        newTypeFilter.addEventListener('change', () => {
            window.PerfOpt.invalidateCache('MEDIA');
            window.UI.loadRecords('media');
        });
    }
    
    // Add optimized search input handling
    const searchInput = pageElement ? pageElement.querySelector('.search-input') : null;
    if (searchInput && window.PerfOpt) {
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        
        newSearchInput.addEventListener('input', window.PerfOpt.debounce(() => {
            window.PerfOpt.invalidateCache('MEDIA');
            window.UI.loadRecords('media');
        }, 300));
    }
    
    console.log('[DEBUG Media] Initialization complete');
}

// Device detection
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Create HTML element for a media item
 * @param {object} media - Media item data
 * @returns {HTMLElement} - The media item element
 */
function createMediaElement(media) {
    if (!media || !media.id || !media.type) {
        console.error('[Media CreateElement] Invalid media object received:', media);
        return null;
    }
    console.log(`[Media CreateElement] Creating element for ID: ${media.id}, Name: ${media.name}, Type: ${media.type}`);

    const element = document.createElement('div');
    // Add base media-card class and type-specific class for cursor
    element.className = `media-card ${media.type}`; 
    element.dataset.id = media.id;

    const { dateStr, timeStr } = formatDateTime(media.date || media.createdAt);
    const formattedDate = dateStr; // Use just the date part for display
    
    // Get category name and color (no change here)
    const categoryName = media.categoryId ? getCategoryName(media.categoryId) : 'Uncategorized';
    const categoryColorClass = getCategoryColorClass(categoryName);

    let iconType = 'file-text'; // Default icon
    let description = media.description || '';

    if (media.type === 'photo') {
        iconType = 'image';
        // Description for photo comes from media.description
    } else if (media.type === 'video') {
        iconType = 'video';
        // Description for video comes from media.description
    } else if (media.type === 'note') {
        iconType = 'sticky-note';
        // For notes, the main text is stored in media.content
        description = media.content || ''; 
    }

    // Build new HTML structure based on React component
    element.innerHTML = `
        <div class="type-indicator ${media.type}">
            <i data-lucide="${iconType}" width="16" height="16"></i>
        </div>
        <h3 class="card-title">${escapeHTML(media.name || 'Media Item')}</h3>
        ${description ? `<p class="card-description">${escapeHTML(description)}</p>` : ''}
        <p class="card-date">${formattedDate}</p>
        
        <div class="card-actions">
            <button class="action-button edit-button edit-media" title="Edit Details">
                <i data-lucide="edit" width="12" height="12"></i>
                <span>Edit</span>
            </button>
            <button class="action-button delete-button delete-media" title="Delete Record">
                <i data-lucide="trash-2" width="12" height="12"></i>
                <span>Delete</span>
            </button>
        </div>
    `;

    // Add event listeners (no change to logic, but query selectors might need update if classes changed)
    const editBtn = element.querySelector('.edit-media');
    const deleteBtn = element.querySelector('.delete-media');

    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click if needed
            showMediaDialog(media.id);
        });
    }
    if (deleteBtn) {
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click if needed
            deleteMedia(media.id);
        });
    }
    
    // Add click listener to the whole card for viewing (if applicable)
    if (media.type === 'photo' || media.type === 'video') {
        element.addEventListener('click', () => {
            viewMediaFile(media);
        });
    } else if (media.type === 'note') {
         element.addEventListener('click', () => {
             showMediaDialog(media.id); // Open edit dialog directly for notes
         });
    }

    // Initialize icons for this element
    if (window.lucide) {
        try { 
            lucide.createIcons({ context: element }); 
        } catch(e) { console.error('Error creating icons for media element:', e); }
    }

    return element;
}

// Ensure escapeHTML exists (it should from the previous step)
function escapeHTML(str) {
  if (typeof str !== 'string') return str; 
  return str.replace(/[&<>'"/]/g, function (s) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
      '/': '&#x2F;'
    }[s];
  });
}

/**
 * Handle media upload (photo/video)
 */
function handleMediaUpload() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*'; // Accept images and videos
    fileInput.multiple = false; // Allow only single file selection for simplicity

    fileInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) {
            return; // No file selected
        }

        // Determine media type based on MIME type
        let mediaType;
        if (file.type.startsWith('image/')) {
            mediaType = 'photo';
        } else if (file.type.startsWith('video/')) {
            mediaType = 'video';
        } else {
            alert('Unsupported file type.');
            return;
        }

        console.log(`[Media Upload] File selected: ${file.name}, Type detected: ${mediaType}`);

        // **** DO NOT READ FILE CONTENT ****
        // We only need metadata

        // Create initial media metadata object
        const initialMediaData = {
            id: generateUUID(),
            name: file.name, // Store original filename
            type: mediaType,
            description: '', // User adds description in dialog
            categoryId: '', // User adds category in dialog
            date: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
            // NO content or dataUrl property
        };
        
        console.log('[Media Upload] Initial metadata created:', initialMediaData);

        // --- Show Dialog to Add Description/Category --- 
        showMediaDialog(null, initialMediaData); // Pass initial data to pre-fill and signal it's a file upload

    });

    fileInput.click(); // Trigger file selection dialog
}

/**
 * Show dialog for adding/editing media metadata
 * @param {string} [mediaId] - Optional ID for editing
 * @param {object} [initialData] - Optional initial data (e.g., from file upload)
 */
function showMediaDialog(mediaId = null, initialData = null) {
    let existingMedia = null;
    if (mediaId && !initialData) { 
        existingMedia = window.getItemById ? window.getItemById('MEDIA', mediaId) : null; 
        if (!existingMedia) {
            console.error(`[Media Dialog] Could not find existing media with ID: ${mediaId}`);
            alert('Error: Could not load media details to edit.');
            return;
        }
    }
    
    const isNewUpload = !!initialData;
    const currentData = existingMedia || initialData || {};
    const isEditing = !!existingMedia;

    console.log(`[Media Dialog] Showing dialog. isEditing: ${isEditing}, isNewUpload: ${isNewUpload}`, currentData);

    // **** Fetch categories for the dropdown ****
    let categoryOptions = [{ value: '', text: 'Select Category' }]; // Default option
    try {
        const categories = window.getItems ? window.getItems('CATEGORIES') : JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        const validCategories = categories.filter(cat => cat && cat.name && cat.id)
                                       .sort((a, b) => a.name.localeCompare(b.name));
        validCategories.forEach(cat => {
            categoryOptions.push({ value: cat.id, text: cat.name });
        });
    } catch (error) {
        console.error('[Media Dialog] Error fetching categories:', error);
    }
    console.log('[Media Dialog] Category options created:', categoryOptions);

    // --- Define Fields Consistently --- 
    let fields = [
        {
            type: 'text',
            id: 'media-name',
            label: (currentData.type === 'note') ? 'Title' : 'Filename', // Adjust label based on type
            value: currentData.name || (currentData.type === 'note' ? 'Practice Note' : 'N/A'),
            disabled: (currentData.type === 'photo' || currentData.type === 'video'), // **** Disable only if photo/video ****
            required: (currentData.type === 'note') // Required only for notes
        },
        {
            type: 'text',
            id: 'media-type',
            label: 'Type',
            value: currentData.type || 'note',
            disabled: true 
        },
        {
            type: 'textarea',
            id: 'media-description',
            label: 'Description / Notes', 
            rows: 3,
            value: currentData.description || '' 
        },
        {
            type: 'select',
            id: 'media-category',
            label: 'Category',
            options: categoryOptions, 
            value: currentData.categoryId || ''
        },
        {
            type: 'date',
            id: 'media-date',
            label: 'Date Added/Associated', 
            value: currentData.date ? currentData.date.split('T')[0] : new Date().toISOString().split('T')[0]
        }
    ];

    // --- Handle Specific Case: Adding/Editing a Note --- 
    // This block now primarily adjusts the label/content field for notes
    if (currentData.type === 'note') {
        const descriptionField = fields.find(f => f.id === 'media-description');
        if (descriptionField) {
            descriptionField.label = 'Note Content'; 
            descriptionField.required = true; 
            descriptionField.id = 'media-content'; // Use correct ID
            descriptionField.value = currentData.content || ''; // Populate with content
        } else {
            // If adding a NEW note from scratch (no description field yet)
            if (!isEditing && !isNewUpload) {
                 fields = fields.filter(f => f.id !== 'media-description'); // Remove placeholder description field
                 fields.splice(2, 0, { // Insert content field after type
                    type: 'textarea',
                    id: 'media-content',
                    label: 'Note Content',
                    rows: 6,
                    required: true,
                    value: ''
                 });
            }
        }
    }
    
    // Determine Title
    let dialogTitle = 'Add Media Details';
    if (isEditing) {
        dialogTitle = 'Edit Media Details';
    } else if (!isNewUpload) {
        dialogTitle = 'Add New Note';
    }

    // Create and show dialog
    mediaDialog = window.UI.createStandardDialog({
        title: dialogTitle,
        fields: fields,
        onSubmit: (dialog, e) => handleMediaFormSubmit(dialog, e, mediaId, currentData), 
        submitButtonText: isEditing ? 'Save Changes' : 'Add Media Record',
        cancelButtonText: 'Cancel',
        onCancel: (dialog) => dialog.close()
    });
    mediaDialog.showModal();
}

/**
 * Handle media form submission
 * @param {HTMLDialogElement} dialog - The dialog element
 * @param {Event} e - The submit event
 * @param {string|null} mediaId - The ID of the media being edited, or null if adding
 * @param {object} originalData - The original data passed to the dialog (includes type, potentially name)
 */
function handleMediaFormSubmit(dialog, e, mediaId, originalData) {
    const form = dialog.querySelector('form');
    const formData = new FormData(form);
    const now = new Date().toISOString();
    const type = originalData.type || 'note'; // Determine type
    
    let contentValue = null;
    let nameValue = originalData.name; // Default to original name (from upload or note)

    // Specific handling for notes vs other types
    if (type === 'note') {
        nameValue = formData.get('media-name') || 'Practice Note'; // Get Title from form
        contentValue = formData.get('media-content') || ''; // Get Content from form (using updated ID)
    } else {
        // For photo/video, name comes from originalData, description from form
        // nameValue remains originalData.name
    }
    
    // Build the media object
    const mediaData = {
        id: mediaId || originalData.id || generateUUID(),
        name: nameValue, // Use correctly determined name/title
        type: type,
        description: type !== 'note' ? (formData.get('media-description') || '') : '', // Only save description if NOT a note
        categoryId: formData.get('media-category') || null,
        date: formData.get('media-date') ? new Date(formData.get('media-date')).toISOString() : now,
        updatedAt: now,
        createdAt: mediaId ? originalData.createdAt : now 
    };
    
    // Only add content property if it's a note and has value
    if (type === 'note') {
        mediaData.content = contentValue;
        delete mediaData.description; // Ensure description is not saved for notes
    }

    console.log('[Media Submit] Preparing to save data:', mediaData);

    // Save using data layer
    try {
        if (mediaId) {
            window.updateItem('MEDIA', mediaId, mediaData);
            console.log('[Media Submit] Media updated:', mediaId);
        } else {
            window.addItem('MEDIA', mediaData);
            console.log('[Media Submit] New media added:', mediaData.id);
        }
        window.UI.loadRecords('media'); // Refresh list
        dialog.close();
    } catch (error) {
        console.error('Error saving media metadata:', error);
        alert('Failed to save media details. Check console.');
    }
}

/**
 * Setup photo capture functionality
 */
function setupPhotoCapture() {
    const photoBtn = document.getElementById('add-photo');
    if (!photoBtn) return;
    
    photoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Prioritize rear camera

        input.onchange = function(e) {
            console.log("[Photo Capture] onchange event fired.", e.target.files);
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                console.log("[Photo Capture] File object found:", file);

                // --- REVERTED: Don't remove input explicitly --- 
                /*
                if (input.parentNode) {
                    input.parentNode.removeChild(input);
                }
                */

                // Use UI Framework to create the dialog
                const dialog = window.UI.createStandardDialog({
                    title: 'Name Your Photo',
                    fields: [
                        {
                            type: 'text',
                            id: 'photo-name',
                            label: 'Photo Name',
                            value: `Photo ${new Date().toLocaleDateString()}`,
                            required: true
                        },
                        {
                            type: 'textarea',
                            id: 'photo-description',
                            label: 'Description (Optional)',
                            rows: 3
                        }
                    ],
                    onSubmit: async (dialog, event) => { 
                        const form = event.target;
                        const nameInput = form.querySelector('#photo-name');
                        const descriptionInput = form.querySelector('#photo-description');

                        const name = nameInput.value.trim();
                        const description = descriptionInput.value.trim();

                        if (!name) {
                            alert('Please enter a name for the photo');
                            return;
                        }

                        const newMediaId = `media_${Date.now()}`;
                        const newMediaMetadata = {
                            id: newMediaId,
                            type: 'photo',
                            name: name,
                            description: description,
                            fileType: file.type,
                            // No devicePath needed in localStorage metadata anymore
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };
                        
                        // Get the actual file object again (it was available in the outer scope)
                        const photoFile = file; 

                        try {
                            // 1. Save the actual file to IndexedDB
                            await window.practiceTrackDB.saveMediaFile(newMediaId, photoFile);

                            // 2. Save the metadata to localStorage
                            if (window.addItem) {
                                window.addItem('MEDIA', newMediaMetadata);
                            }
                            
                            // --- REMOVED: Manual Download Trigger for PHOTO ---
                            /*
                            try {
                                const tempUrl = URL.createObjectURL(photoFile);
                                const downloadLink = document.createElement('a');
                                downloadLink.href = tempUrl;
                                const safeFilename = name.replace(/[^a-z0-9_.-]/gi, '_'); // Basic sanitization
                                const fileExtension = photoFile.name.split('.').pop() || 'jpg';
                                downloadLink.download = `${safeFilename}.${fileExtension}`; 
                                downloadLink.style.display = 'none';
                                document.body.appendChild(downloadLink);
                                downloadLink.click(); // Trigger the download
                                document.body.removeChild(downloadLink);
                                setTimeout(() => URL.revokeObjectURL(tempUrl), 100);
                                console.log('Photo download triggered.');
                            } catch (downloadError) {
                                console.error('Could not trigger photo download:', downloadError);
                            }
                            */
                            // --- END REMOVED ---

                            // 3. Reload the media list UI
                            window.UI.loadRecords('media', {
                                recordType: 'MEDIA',
                                createRecordElementFn: createMediaElement,
                                container: mediaListContainer,
                                storageKey: 'practiceTrack_MEDIA' // Specify storage key
                            });

                            dialog.close();
                        } catch (error) {
                            console.error('Error saving photo:', error);
                            alert('Failed to save photo. Please check console for details.');
                        }
                    },
                    onCancel: (dialog) => dialog.close(),
                    submitButtonText: 'Add Photo',
                    cancelButtonText: 'Cancel'
                });

                // Delay showing dialog slightly to allow camera context to close
                setTimeout(() => {
                    dialog.showModal();
                }, 50); 
            }
        };

        input.click(); // Trigger the file input
    });
}

/**
 * Setup video capture functionality
 */
function setupVideoCapture() {
    const videoBtn = document.getElementById('add-video');
    if (!videoBtn) return;
    
    videoBtn.addEventListener('click', () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.capture = 'environment'; // Prioritize rear camera

        input.onchange = function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];

                // --- REVERTED: Don't remove input explicitly --- 
                /*
                if (input.parentNode) {
                    input.parentNode.removeChild(input);
                }
                */

                const dialog = window.UI.createStandardDialog({
                    title: 'Name Your Video',
                    fields: [
                        {
                            type: 'text',
                            id: 'video-name',
                            label: 'Video Name',
                            value: `Video ${new Date().toLocaleDateString()}`,
                            required: true
                        },
                        {
                            type: 'textarea',
                            id: 'video-description',
                            label: 'Description (Optional)',
                            rows: 3
                        }
                    ],
                    onSubmit: async (dialog, event) => {
                        const form = event.target;
                        const nameInput = form.querySelector('#video-name');
                        const descriptionInput = form.querySelector('#video-description');

                        const name = nameInput.value.trim();
                        const description = descriptionInput.value.trim();

                        if (!name) {
                            alert('Please enter a name for the video');
                            return;
                        }

                        const newMediaId = `media_${Date.now()}`;
                        const newMediaMetadata = {
                            id: newMediaId,
                            type: 'video',
                            name: name,
                            description: description,
                            fileType: file.type,
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        };

                        try {
                            // Save the actual file to IndexedDB
                            await window.practiceTrackDB.saveMediaFile(newMediaId, file);

                            // Save the metadata to localStorage
                            if (window.addItem) {
                                window.addItem('MEDIA', newMediaMetadata);
                            }

                            // --- REMOVED: Manual Trigger Download for VIDEO ---
                            /* 
                            try {
                                const tempUrl = URL.createObjectURL(file); // Use the file object from outer scope
                                const downloadLink = document.createElement('a');
                                downloadLink.href = tempUrl;
                                const safeFilename = name.replace(/[^a-z0-9_.-]/gi, '_'); // Basic sanitization
                                const fileExtension = file.name.split('.').pop() || 'mp4'; // Default extension
                                downloadLink.download = `${safeFilename}.${fileExtension}`; 
                                downloadLink.style.display = 'none';
                                document.body.appendChild(downloadLink);
                                downloadLink.click(); // Trigger the download
                                document.body.removeChild(downloadLink);
                                setTimeout(() => URL.revokeObjectURL(tempUrl), 100);
                                console.log('Video download triggered.');
                            } catch (downloadError) {
                                console.error('Could not trigger video download:', downloadError);
                            }
                            */
                            // --- END REMOVED ---

                            // Reload the media list UI
                            window.UI.loadRecords('media', {
                                recordType: 'MEDIA',
                                createRecordElementFn: createMediaElement,
                                container: mediaListContainer,
                                storageKey: 'practiceTrack_MEDIA' // Specify storage key
                            });

                            dialog.close();
                        } catch (error) {
                            console.error('Error saving video:', error);
                            alert('Failed to save video. Please check console for details.');
                        }
                    },
                    onCancel: (dialog) => dialog.close(),
                    submitButtonText: 'Add Video',
                    cancelButtonText: 'Cancel'
                });

                // Delay showing dialog slightly to allow camera context to close
                setTimeout(() => {
                    dialog.showModal();
                }, 50);
            }
        };

        input.click();
    });
}

/**
 * Show dialog to name media before capture
 * @param {string} mediaType - Type of media (photo or video)
 * @param {Function} callback - Callback function after name is entered
 */
function showMediaNameDialog(mediaType, callback) {
    // Set up form fields
    const fields = [
        {
            type: 'text',
            id: 'media-name',
            label: `${mediaType === 'photo' ? 'Photo' : 'Video'} Name`,
            required: true,
            value: `${mediaType === 'photo' ? 'Photo' : 'Video'} ${new Date().toLocaleDateString()}`
        },
        {
            type: 'textarea',
            id: 'media-description',
            label: 'Description (optional)',
            rows: 3,
            value: ''
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: mediaType === 'photo' ? 'Name Your Photo' : 'Name Your Video',
        fields: fields,
        onSubmit: (dialog, e) => {
            const form = e.target;
            const nameInput = form.querySelector('#media-name');
            const descriptionInput = form.querySelector('#media-description');
            
            const name = nameInput.value.trim();
            const description = descriptionInput.value.trim();
            
            if (!name) {
                alert('Please enter a name for your media');
                return;
            }
            
            dialog.close();
            callback(name, description);
        },
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Continue',
        cancelButtonText: 'Cancel'
    });
    
    dialog.showModal();
}

// Set up media buttons with individual handlers
function setupMediaButtons() {
    console.log('[DEBUG] setupMediaButtons called'); // Log entry
    
    // Setup photo capture
    setupPhotoCapture();
    
    // Setup video capture
    setupVideoCapture();
    
    // Setup note creation
    const noteBtn = document.getElementById('add-note');
    if (noteBtn) {
        console.log('[DEBUG] Found #add-note button. Attaching listener.'); // Log button found
        noteBtn.addEventListener('click', () => {
            console.log('[DEBUG] #add-note button clicked!'); // Log click event
            showNoteDialog();
        });
    } else {
        console.error('[DEBUG] #add-note button NOT FOUND!'); // Log if button not found
    }
}

/**
 * Show dialog for adding a new note
 * @param {Object} existingNote - Optional existing note for editing
 */
function showNoteDialog(existingNote = null) {
    console.log('Opening note dialog. Editing:', !!existingNote);
    
    // Define dialog fields
    const fields = [
        {
            type: 'text',
            id: 'media-note-name',
            label: 'Title (Optional)', // Keep a title field distinct from notes
            value: existingNote ? existingNote.name || '' : '',
            placeholder: 'e.g., Scale Practice Observations'
        },
        {
            type: 'textarea',
            id: 'media-note-content', // ID remains content
            label: 'Notes', // <<< Changed label from 'Content' to 'Notes'
            required: true,
            rows: 8,
            value: existingNote ? existingNote.content || '' : '',
            placeholder: 'Enter your practice notes here...'
        },
        {
            type: 'textarea',
            id: 'media-note-description',
            label: 'Description (Optional)', // Keep description separate if needed
            rows: 3,
            value: existingNote ? existingNote.description || '' : '',
            placeholder: 'Add a brief description or context'
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: existingNote ? 'Edit Note' : 'Add Note',
        fields: fields,
        onSubmit: (dialog, e) => {
            console.log('[DEBUG] Note Dialog onSubmit triggered.'); // Log entry
            const form = e.target;
            const titleInput = form.querySelector('#media-note-name');
            const contentInput = form.querySelector('#media-note-content');
            const descriptionInput = form.querySelector('#media-note-description');
            
            const title = titleInput.value.trim();
            const content = contentInput.value;
            const description = descriptionInput.value.trim();
            
            if (!title) {
                alert('Please enter a title for your note');
                return;
            }
            
            if (existingNote) {
                // Update existing note
                existingNote.name = title;
                existingNote.content = content;
                existingNote.description = description;
                existingNote.updatedAt = new Date().toISOString();
                
                // Save the updated note
                if (window.updateItem) {
                    window.updateItem('MEDIA', existingNote.id, existingNote);
                } else {
                    saveMedia(existingNote);
                }
            } else {
                // Create new note
                const newNote = {
                    id: `media_${Date.now()}`,
                    type: 'note',
                    name: title,
                    content: content,
                    description: description,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                // Save the new note
                console.log('[DEBUG Note Save] Created newNote object:', JSON.stringify(newNote)); // Log the object
                if (window.addItem) {
                    console.log('[DEBUG Note Save] Attempting save via window.addItem...'); // Log path
                    window.addItem('MEDIA', newNote);
                } else {
                    console.log('[DEBUG Note Save] Attempting save via saveMedia...'); // Log path
                    saveMedia(newNote);
                }
                console.log('[DEBUG Note Save] Save function called. Reloading list...'); // Log after call
            }
            
            // Show success feedback on button (optional)
            const saveButton = dialog.querySelector('button[type="submit"]');
            const originalButtonText = existingNote ? 'Save' : 'Save'; // Assuming default is 'Save'
            if (saveButton) {
                saveButton.textContent = 'Saved!';
                saveButton.classList.add('success');
                saveButton.disabled = true; // Briefly disable button
                setTimeout(() => {
                    saveButton.textContent = originalButtonText;
                    saveButton.classList.remove('success');
                    saveButton.disabled = false; // Re-enable
                }, 1500); 
            }
             // Close dialog immediately
            dialog.close();

            // Reload media list (already moved outside timeout)
            window.UI.loadRecords('media');
        },
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save',
        cancelButtonText: 'Cancel'
    });
    
    dialog.showModal();
}

/**
 * Delete a media item
 * @param {string} mediaId - The ID of the media to delete
 */
async function deleteMedia(mediaId) {
    // Confirm deletion using UI framework
    const confirmed = await window.UI.confirmDialog({
        title: 'Delete Media',
        message: 'Are you sure you want to delete this media reference? Note that the actual media file on your device will not be deleted.',
        confirmText: 'Delete',
        cancelText: 'Cancel',
        isDestructive: true
    });
    
    if (!confirmed) return;
    
    try {
        // Delete reference from localStorage
        if (window.deleteItem) {
            window.deleteItem('MEDIA', mediaId);
        } else {
            // Legacy localStorage handling
            let mediaItems = [];
            try {
                const stored = localStorage.getItem('practiceTrack_media');
                if (stored) {
                    mediaItems = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Error reading media:', e);
                return;
            }
            
            // Filter out the deleted media
            mediaItems = mediaItems.filter(item => item.id !== mediaId);
            
            // Save back to storage
            localStorage.setItem('practiceTrack_media', JSON.stringify(mediaItems));
        }
        
        // Reload media list
        window.UI.loadRecords('media', {
            recordType: 'MEDIA',
            createRecordElementFn: createMediaElement
        });
        
        // Show success message
        if (window.showNotification) {
            window.showNotification('Media Deleted', 'The media reference has been deleted.');
        }
    } catch (error) {
        console.error('Error deleting media:', error);
        alert('Error deleting media. Please try again.');
    }
}

/**
 * Save media to localStorage (legacy method)
 * @param {Object} media - The media to save
 */
function saveMedia(media) {
    const storageKey = 'practiceTrack_media';
    let mediaItems = [];
    
    try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            mediaItems = JSON.parse(stored);
        }
    } catch (e) {
        console.error('Error reading media:', e);
        mediaItems = [];
    }
    
    // Find existing item or add new
    const index = mediaItems.findIndex(item => item.id === media.id);
    if (index !== -1) {
        mediaItems[index] = media;
    } else {
        mediaItems.push(media);
    }
    
    // Save to localStorage
    localStorage.setItem(storageKey, JSON.stringify(mediaItems));
}

/**
 * Add media-specific styles
 */
function addMediaStyles() {
    // Create a style element if it doesn't exist
    let styleEl = document.getElementById('media-styles');
    if (!styleEl) {
        styleEl = document.createElement('style');
        styleEl.id = 'media-styles';
        document.head.appendChild(styleEl);
    }
    
    // Add media-specific CSS
    styleEl.textContent = `
        .media-item { 
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            margin-bottom: var(--space-lg);
            background-color: var(--card-background);
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-normal);
            display: flex; 
            flex-direction: column; 
            overflow: hidden; /* Prevent content overflow issues */
            /* min-height: 200px; /* Optional: Adjust if needed */
        }
        
        .media-item:hover { 
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: rgba(59, 127, 245, 0.2);
        }

        /* Accent bar remains outside body/footer */
        .accent-bar {
             /* Styles defined elsewhere? If not, add height/bg-color */
             height: 4px; 
             width: 100%;
             border-top-left-radius: var(--radius-lg); /* Match card radius */
             border-top-right-radius: var(--radius-lg);
        }

        .media-body { 
            flex-grow: 1; /* Allow body to expand */
            padding: var(--space-lg); /* Add padding to the main content area */
            padding-bottom: var(--space-md); /* Reduce bottom padding slightly */
        }
        
        .media-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
        }

        /* Title style */
        .media-title {
             font-weight: 600;
             font-size: var(--font-lg);
             margin: var(--space-xs) 0 var(--space-md) 0;
             color: var(--text-dark);
        }

        /* Style for note content or file info */
        .media-content {
             margin-top: var(--space-md);
        }

        .media-file-info p {
             margin-bottom: var(--space-sm); 
             font-size: var(--font-sm);
        }
         .media-file-info p:last-child {
             margin-bottom: 0;
         }
        .media-file-info .help-text {
             color: var(--text-light);
             font-style: italic;
        }
        
        .media-note-content p {
            background-color: var(--background-light);
            border-radius: var(--radius-md);
            padding: var(--space-md);
            border-left: 3px solid var(--border-color);
            font-size: var(--font-sm);
            line-height: 1.6;
            white-space: pre-wrap;
        }
        
        .media-footer { 
            margin-top: auto; /* **** CRITICAL: Pushes footer down **** */
            padding: var(--space-md) var(--space-lg); /* Adjust padding */
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-top: 1px solid var(--background-light); /* Optional separator */
            background-color: var(--card-footer-background, var(--background-default)); /* Optional distinct background */
        }

        .media-date {
            font-size: var(--font-sm);
            color: var(--text-light);
        }
        
        .media-actions { 
            display: flex;
            gap: var(--space-xs);
        }
    `;
}

// Make function available globally
window.initializeMedia = initializeMedia;

// --- New Function to View Media from IndexedDB ---

async function viewMediaFile(media) {
    if (media.type !== 'photo' && media.type !== 'video') return;

    try {
        // Retrieve the file Blob/File from IndexedDB using the media ID
        const fileData = await window.practiceTrackDB.getMediaFile(media.id);

        if (!fileData) {
            alert('Media file not found in local database. It might have been cleared or failed to save.');
            return;
        }

        // Create a temporary blob URL for display *only when viewing*
        const tempUrl = URL.createObjectURL(fileData);

        const dialog = document.createElement('dialog');
        dialog.className = 'media-view-dialog'; // Use class for styling

        let mediaElementHTML;
        if (media.type === 'photo') {
            mediaElementHTML = `<img src="${tempUrl}" alt="${media.name}" style="max-width: 100%; max-height: 70vh; object-fit: contain;">`;
        } else { // video
            mediaElementHTML = `<video src="${tempUrl}" controls style="max-width: 100%; max-height: 70vh; object-fit: contain;"></video>`;
        }

        dialog.innerHTML = `
            <div class="media-view-main">
                <div class="media-view-content">
                    <h2>${media.name || 'Media'}</h2>
                    <p>${media.description || 'No description.'}</p>
                    ${mediaElementHTML}
                </div>
            </div>
            <div class="dialog-actions centered">
                 <button data-close class="app-button app-button--secondary">Close</button>
            </div>
        `;

        document.body.appendChild(dialog);
        
        // Add close functionality
        const closeButton = dialog.querySelector('button[data-close]');
        closeButton.addEventListener('click', () => dialog.close());

        // ADDED: Close dialog on backdrop click
        dialog.addEventListener('click', (event) => {
            // Check if the click was directly on the dialog element (the backdrop)
            if (event.target === dialog) {
                dialog.close();
            }
        });
        // END ADDED

        dialog.showModal();

        // Clean up the temporary blob URL when the dialog is closed
        dialog.addEventListener('close', () => {
            URL.revokeObjectURL(tempUrl);
            document.body.removeChild(dialog);
            console.log('Blob URL revoked');
        });

    } catch (error) {
        console.error('Error viewing media file:', error);
        alert('Could not load media file for viewing.');
    }
}

// --- New Function to Open Edit Dialog ---

function openEditMediaDialog(media) {
    console.log('Opening edit dialog for:', media);
    if (!media) {
        console.error('Cannot edit null media item.');
        return;
    }

    // Define fields based on media type
    let fields = [
        {
            type: 'text',
            id: 'edit-media-name',
            label: 'Name',
            value: media.name || '',
            required: true
        },
        {
            type: 'textarea',
            id: 'edit-media-description',
            label: 'Description',
            rows: 4,
            value: media.description || ''
        },
        {
            type: 'static', // Display type, but don't allow editing
            label: 'Type',
            value: media.type.charAt(0).toUpperCase() + media.type.slice(1)
        }
    ];

    // If it's a note, replace description with a content textarea
    if (media.type === 'note') {
        fields = [
            {
                type: 'text',
                id: 'edit-media-name',
                label: 'Title', // Use Title for notes
                value: media.name || '',
                required: true
            },
            {
                type: 'textarea',
                id: 'edit-media-content', // Use content ID for notes
                label: 'Note Content',
                rows: 8,
                required: true,
                value: media.description || '' // Assume note content is stored in description
            },
             {
                type: 'static',
                label: 'Type',
                value: 'Note'
            }
        ];
    }

    // Create dialog using UI framework
    const editDialog = window.UI.createStandardDialog({
        title: 'Edit Media Details',
        fields: fields,
        onSubmit: (dialog, e) => {
            const form = e.target;
            const nameInput = form.querySelector('#edit-media-name');
            let descriptionOrContent = '';

            if (media.type === 'note') {
                const contentInput = form.querySelector('#edit-media-content');
                descriptionOrContent = contentInput ? contentInput.value.trim() : '';
            } else {
                const descriptionInput = form.querySelector('#edit-media-description');
                descriptionOrContent = descriptionInput ? descriptionInput.value.trim() : '';
            }
            
            const name = nameInput ? nameInput.value.trim() : '';

            // Basic validation
            if (!name || (media.type === 'note' && !descriptionOrContent)) {
                 alert(media.type === 'note' ? 'Please enter a Title and Note Content.' : 'Please enter a Name.');
                 return;
            }

            // Get existing data to preserve fields we don't explicitly edit (like ID, createdAt)
            // Assuming window.getItemById exists or similar functionality
            const existingData = window.getItemById ? window.getItemById('MEDIA', media.id) : media; // Fallback to passed media
             if (!existingData) {
                 console.error(`Failed to retrieve existing media data for ID: ${media.id}`);
                 alert('Error saving changes. Could not find original media item.');
                 return;
             }

            // Create updated media metadata object
            const updatedMediaMetadata = {
                ...existingData, // Copy existing fields (ID, type, createdAt, fileType etc.)
                name: name,
                description: descriptionOrContent, // Store note content in description field
                updatedAt: new Date().toISOString() // Update timestamp
            };

            // Save updated media data using the data layer
            if (window.updateItem) {
                try {
                    window.updateItem('MEDIA', media.id, updatedMediaMetadata);
                    console.log('Media item updated:', updatedMediaMetadata);
                    
                    // Reload the media list UI to show changes
                    window.UI.loadRecords('media', {
                        recordType: 'MEDIA',
                        createRecordElementFn: createMediaElement,
                        container: mediaListContainer,
                        storageKey: 'practiceTrack_MEDIA' 
                    });
                    
                    dialog.close(); // Close the dialog on success

                } catch (error) {
                    console.error('Error updating media item:', error);
                     alert('An error occurred while saving media details. Please try again.');
                     // Keep dialog open on error
                }

            } else {
                console.error('window.updateItem function not found. Cannot save media updates.');
                alert('Error: Could not save media updates. Update function missing.');
                // Keep dialog open if update function is missing
            }
        },
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save Changes',
        cancelButtonText: 'Cancel'
    });
    
    // Show dialog
    editDialog.showModal();
}

// Ensure this runs after the DOM is loaded and other scripts are ready
// Typically called from app.js or when the media page becomes active
document.addEventListener('DOMContentLoaded', () => {
    // If media page is loaded initially, initialize it
    // Otherwise, app.js navigation logic should call initializeMedia
    if (document.getElementById('media-page') && document.getElementById('media-page').classList.contains('active')) {
         initializeMedia();
    }
});