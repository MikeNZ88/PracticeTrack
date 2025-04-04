/**
 * Media Module
 * Manages practice media using the common UI framework
 */

// Media data storage
let mediaDialog = null;

/**
 * Initialize media page
 */
function initializeMedia() {
    console.log('Initializing media page');
    
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
    
    // --- Add Date Preset Logic --- 
    const pageElement = document.getElementById('media-page');
    const presetFilter = pageElement ? pageElement.querySelector('.date-preset-filter') : null;
    const startDateInput = pageElement ? pageElement.querySelector('#media-start-date') : null;
    const endDateInput = pageElement ? pageElement.querySelector('#media-end-date') : null;
    const dateRangeDiv = pageElement ? pageElement.querySelector('.date-range') : null;

    if (presetFilter && startDateInput && endDateInput && dateRangeDiv) {
        // Define the handler function
        const handleMediaPresetChange = () => {
            const selectedPreset = presetFilter.value;
            const today = new Date();
            let startDate = '';
            let endDate = '';

            dateRangeDiv.style.display = (selectedPreset === 'custom') ? 'flex' : 'none';

            switch (selectedPreset) {
                case 'week':
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    startDate = firstDayOfWeek.toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                    break;
                case 'month':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                    break;
                case 'year':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                    break;
                case 'ytd':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date().toISOString().split('T')[0];
                    break;
                case 'custom': // Keep custom values if selected
                     startDate = startDateInput.value;
                     endDate = endDateInput.value;
                     break;
                 case 'all': // Default case for 'all'
                 default:
                    startDate = '';
                    endDate = '';
                    break;
            }
            
            if (selectedPreset !== 'custom') {
                 startDateInput.value = startDate;
                 endDateInput.value = endDate;
             }
             // Trigger UI framework load
             window.UI.loadRecords('media');
        };
        
        // Attach the handler to the change event
        presetFilter.addEventListener('change', handleMediaPresetChange);
        
        // Custom date input handlers
        startDateInput.addEventListener('change', () => {
             presetFilter.value = 'custom';
             dateRangeDiv.style.display = 'flex';
             // loadRecords is already attached by initRecordPage
         });
         endDateInput.addEventListener('change', () => {
              presetFilter.value = 'custom';
              dateRangeDiv.style.display = 'flex';
             // loadRecords is already attached by initRecordPage
         });

        // Set initial state to 'week'
        presetFilter.value = 'week';
        // dateRangeDiv.style.display = 'none'; // Handler will set this
        // startDateInput.value = ''; // Handler will set this
        // endDateInput.value = ''; // Handler will set this

        // Apply the initial filter by calling the handler
        handleMediaPresetChange();
        // REMOVED: window.UI.loadRecords('media'); // Handler calls this now
    }
    // --- End Date Preset Logic ---
}

// Device detection
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

/**
 * Create a media element for the UI
 * @param {Object} media - The media data
 * @returns {HTMLElement} - The media element
 */
function createMediaElement(media) {
    const mediaElement = document.createElement('div');
    mediaElement.className = 'card media-card';
    mediaElement.dataset.id = media.id;
    
    // Format content based on media type
    let contentHtml = '';
    switch (media.type) {
        case 'photo':
            contentHtml = `<div class="media-image">
                <div class="image-placeholder">
                    <i data-lucide="image"></i>
                    <p>Photo saved to your device</p>
                </div>
            </div>`;
            break;
        case 'video':
            contentHtml = `<div class="media-video">
                <div class="video-placeholder">
                    <i data-lucide="video"></i>
                    <p>Video saved to your device</p>
                </div>
            </div>`;
            break;
        case 'note':
            contentHtml = `<div class="note-content">${media.content || ''}</div>`;
            break;
    }
    
    // Format date and time
    const createdAt = new Date(media.createdAt);
    const dateStr = createdAt.toLocaleDateString();
    const timeStr = createdAt.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    // Construct the card HTML with the new order
    mediaElement.innerHTML = `
        ${media.name ? `<h3 class="media-name card-name-pill">${media.name}</h3>` : '<h3 class="media-name card-name-pill">Untitled Media</h3>'} 
        
        <div class="media-content">
            ${contentHtml} 
        </div>

        ${media.description ? `<p class="media-description">${media.description}</p>` : ''}

        <div class="media-footer">
            <span class="media-date">${dateStr} at ${timeStr}</span>
            <div class="media-actions">
                <button class="icon-button edit-media app-button app-button--secondary" title="Edit Media">
                    <i data-lucide="edit"></i>
                </button>
                <button class="icon-button delete-media app-button app-button--secondary" title="Delete Media">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
    `;
    
    // Add event listener for delete
    const deleteButton = mediaElement.querySelector('.delete-media');
    if (deleteButton) {
        deleteButton.addEventListener('click', (e) => {
             e.stopPropagation(); // Prevent card click or other actions
             deleteMedia(media.id)
        });
    }

    // Add event listener for edit
    const editButton = mediaElement.querySelector('.edit-media');
    if (editButton) {
        editButton.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click or other actions
            showMediaDialog(media.id); // Call function to show edit dialog
        });
    }
    
    // Initialize Lucide icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        // Make sure to include the 'edit' icon
        window.lucide.createIcons({ icons: ['trash-2', 'edit', 'image', 'video'], context: mediaElement });
    }
    
    return mediaElement;
}

/**
 * Show media dialog for editing
 * @param {string} mediaId - The ID of the media item to edit
 */
function showMediaDialog(mediaId) {
    if (!mediaId) {
        console.error('showMediaDialog called without mediaId');
        return;
    }
    
    // Get media data
    const mediaData = window.getItemById ? window.getItemById('MEDIA', mediaId) : null;
    
    if (!mediaData) {
        console.error(`Media item not found: ${mediaId}`);
        alert('Could not find the media item to edit.');
        return;
    }
    
    // Set up form fields for editing (Name and Description only)
    const fields = [
        {
            type: 'text',
            id: 'media-name',
            label: 'Name',
            value: mediaData.name || '',
            required: false // Name is optional
        },
        {
            type: 'textarea',
            id: 'media-description',
            label: 'Description',
            rows: 4,
            value: mediaData.description || ''
        },
        {
            type: 'static', // Display type, but don't allow editing
            label: 'Type',
            value: mediaData.type.charAt(0).toUpperCase() + mediaData.type.slice(1) // Capitalize first letter
        }
    ];
    
    // Create dialog using UI framework
    const editDialog = window.UI.createStandardDialog({
        title: 'Edit Media Details',
        fields: fields,
        onSubmit: (dialog, e) => handleMediaFormSubmit(dialog, e, mediaId), // Pass mediaId
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save Changes',
        cancelButtonText: 'Cancel'
    });
    
    // Show dialog
    editDialog.showModal();
}

/**
 * Handle media form submission for editing
 * @param {HTMLElement} dialog - The dialog element
 * @param {Event} e - The submit event
 * @param {string} mediaId - The ID of the media item being edited
 */
function handleMediaFormSubmit(dialog, e, mediaId) {
    try {
        const form = e.target;
        const nameInput = form.querySelector('#media-name');
        const descriptionInput = form.querySelector('#media-description');
        
        // Get existing data to preserve fields we don't edit
        const existingData = window.getItemById ? window.getItemById('MEDIA', mediaId) : null;
        if (!existingData) {
             throw new Error(`Failed to retrieve existing media data for ID: ${mediaId}`);
        }

        // Create updated media object
        const updatedData = {
            ...existingData, // Copy existing fields
            name: nameInput ? nameInput.value.trim() : existingData.name, // Update name
            description: descriptionInput ? descriptionInput.value.trim() : existingData.description, // Update description
            updatedAt: new Date().toISOString() // Update timestamp
        };
        
        // Save updated media data using the data layer
        if (window.updateItem) {
            window.updateItem('MEDIA', mediaId, updatedData);
             if (window.showNotification) {
                 window.showNotification('Media Updated', 'Your media details have been saved.');
             }
        } else {
            console.error('window.updateItem function not found. Cannot save media updates.');
            alert('Error: Could not save media updates.');
            return; // Prevent dialog close if save failed
        }
        
        dialog.close(); // Close the dialog on success

    } catch (error) {
        console.error('Error handling media form submission:', error);
        alert('An error occurred while saving media details. Please try again.');
        // Keep dialog open on error
    }
}

/**
 * Setup photo capture functionality
 */
function setupPhotoCapture() {
    const photoBtn = document.getElementById('add-photo');
    if (!photoBtn) return;
    
    photoBtn.addEventListener('click', () => {
        // Show file naming dialog first
        showMediaNameDialog('photo', (name, description) => {
            // Create a hidden input element with capture attribute
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment'; // Use the environment-facing camera (usually back camera)
            
            // Handle file selection
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    
                    // Create a URL to the file
                    const fileUrl = URL.createObjectURL(file);
                    
                    // Create a download link to save the file
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.download = name || file.name;
                    downloadLink.style.display = 'none';
                    document.body.appendChild(downloadLink);
                    
                    // Trigger the download
                    downloadLink.click();
                    
                    // Clean up
                    setTimeout(() => {
                        URL.revokeObjectURL(fileUrl);
                        document.body.removeChild(downloadLink);
                    }, 100);
                    
                    // Create media reference object
                    const newMedia = {
                        id: `media_${Date.now()}`,
                        type: 'photo',
                        name: name || file.name,
                        description: description || '',
                        fileType: file.type,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    
                    // Save media reference to localStorage
                    if (window.addItem) {
                        window.addItem('MEDIA', newMedia);
                    } else {
                        saveMedia(newMedia);
                    }
                    
                    // Reload media list
                    window.UI.loadRecords('media', {
                        recordType: 'MEDIA',
                        createRecordElementFn: createMediaElement
                    });
                    
                    // Show success message
                    if (window.showNotification) {
                        window.showNotification('Photo Captured', 'Your photo has been saved to your device.');
                    }
                }
            };
            
            // Trigger the file input click
            input.click();
        });
    });
}

/**
 * Setup video capture functionality
 */
function setupVideoCapture() {
    const videoBtn = document.getElementById('add-video');
    if (!videoBtn) return;
    
    videoBtn.addEventListener('click', () => {
        // Show file naming dialog first
        showMediaNameDialog('video', (name, description) => {
            // Create a hidden input element with capture attribute
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.capture = 'environment'; // Use the environment-facing camera (usually back camera)
            
            // Handle file selection
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    const file = e.target.files[0];
                    
                    // Create a URL to the file
                    const fileUrl = URL.createObjectURL(file);
                    
                    // Create a download link to save the file
                    const downloadLink = document.createElement('a');
                    downloadLink.href = fileUrl;
                    downloadLink.download = name || file.name;
                    downloadLink.style.display = 'none';
                    document.body.appendChild(downloadLink);
                    
                    // Trigger the download
                    downloadLink.click();
                    
                    // Clean up
                    setTimeout(() => {
                        URL.revokeObjectURL(fileUrl);
                        document.body.removeChild(downloadLink);
                    }, 100);
                    
                    // Create media reference object
                    const newMedia = {
                        id: `media_${Date.now()}`,
                        type: 'video',
                        name: name || file.name,
                        description: description || '',
                        fileType: file.type,
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString()
                    };
                    console.log('[DEBUG Video Save] Created newMedia object:', JSON.stringify(newMedia)); // Log the object

                    // Save media reference to localStorage
                    if (window.addItem) {
                        console.log('[DEBUG Video Save] Attempting save via window.addItem...'); // Log path
                        window.addItem('MEDIA', newMedia);
                    } else {
                        console.log('[DEBUG Video Save] Attempting save via saveMedia...'); // Log path
                        saveMedia(newMedia);
                    }
                    console.log('[DEBUG Video Save] Save function called. Reloading list...'); // Log after call

                    // Reload media list
                    window.UI.loadRecords('media', {
                        recordType: 'MEDIA',
                        createRecordElementFn: createMediaElement
                    });
                    
                    // Show success message
                    if (window.showNotification) {
                        window.showNotification('Video Recorded', 'Your video has been saved to your device.');
                    }
                }
            };
            
            // Trigger the file input click
            input.click();
        });
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
        .media-card {
            border: 1px solid var(--border-color);
            border-radius: var(--radius-lg);
            padding: var(--space-lg);
            margin-bottom: var(--space-lg);
            background-color: var(--card-background);
            box-shadow: var(--shadow-sm);
            transition: all var(--transition-normal);
        }
        
        .media-card:hover {
            transform: translateY(-2px);
            box-shadow: var(--shadow-md);
            border-color: rgba(59, 127, 245, 0.2);
        }
        
        .media-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: var(--space-md);
        }
        
        .media-date {
            font-size: var(--font-sm);
            color: var(--text-light);
            background-color: var(--background-light);
            padding: var(--space-xs) var(--space-sm);
            border-radius: var(--radius-md);
        }
        
        .media-actions {
            display: flex;
            gap: var(--space-xs);
        }
        
        .media-content {
            margin: var(--space-md) 0;
        }
        
        .image-placeholder, .video-placeholder {
            background-color: var(--background-light);
            border-radius: var(--radius-md);
            padding: var(--space-xl);
            text-align: center;
            color: var(--text-medium);
            border: 1px dashed var(--border-color);
        }
        
        .image-placeholder i, .video-placeholder i {
            width: 48px;
            height: 48px;
            color: var(--primary-blue-light);
            margin-bottom: var(--space-md);
        }
        
        .image-placeholder p, .video-placeholder p {
            margin: var(--space-xs) 0;
        }
        
        .file-name {
            font-weight: 600;
            color: var(--text-dark);
        }
        
        .media-name {
            font-weight: 600;
            font-size: var(--font-lg);
            margin: var(--space-xs) 0;
            color: var(--text-dark);
        }
        
        .media-description {
            color: var(--text-medium);
            margin: var(--space-xs) 0;
        }
        
        .note-content {
            padding: var(--space-md);
            background-color: var(--background-light);
            border-radius: var(--radius-md);
            white-space: pre-wrap;
            font-size: var(--font-sm);
            line-height: 1.7;
            border-left: 3px solid var(--border-color);
        }
    `;
}

// Make function available globally
window.initializeMedia = initializeMedia;