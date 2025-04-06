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

    // Add listener for the new Upload button
    const uploadButton = document.getElementById('upload-media-btn');
    if (uploadButton) {
        uploadButton.addEventListener('click', handleMediaUpload);
    }
    
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
            const todayString = today.toISOString().split('T')[0];
            let startDate = '';
            let endDate = '';

            dateRangeDiv.style.display = (selectedPreset === 'custom') ? 'flex' : 'none';

            switch (selectedPreset) {
                case 'today':
                    startDate = todayString;
                    endDate = todayString;
                    break;
                case 'week':
                    const firstDayOfWeek = new Date(today.setDate(today.getDate() - today.getDay()));
                    startDate = firstDayOfWeek.toISOString().split('T')[0];
                    endDate = todayString;
                    break;
                case 'month':
                    startDate = new Date(today.getFullYear(), today.getMonth(), 1).toISOString().split('T')[0];
                    endDate = todayString;
                    break;
                case 'year':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = new Date(today.getFullYear(), 11, 31).toISOString().split('T')[0];
                    break;
                case 'ytd':
                    startDate = new Date(today.getFullYear(), 0, 1).toISOString().split('T')[0];
                    endDate = todayString;
                    break;
                case 'custom':
                     startDate = startDateInput.value || '';
                     endDate = endDateInput.value || '';
                     // Ensure custom inputs are shown
                     dateRangeDiv.style.display = 'flex';
                    break;
                case 'all': // Explicit 'all' case
                default:
                     startDate = ''; // Explicitly clear for filtering
                     endDate = '';   // Explicitly clear for filtering
                     // Also clear the input fields themselves
                     if (startDateInput) startDateInput.value = '';
                     if (endDateInput) endDateInput.value = '';
                     dateRangeDiv.style.display = 'none'; // Hide custom inputs
                    break;
            }

            // Set input values only if NOT custom and NOT all (already handled for all)
            if (startDateInput && endDateInput && selectedPreset !== 'custom' && selectedPreset !== 'all') {
                startDateInput.value = startDate;
                endDateInput.value = endDate;
            }

            // Trigger UI framework to reload records
            console.log(`[DEBUG Media] Date preset changed to ${selectedPreset}. Filtering with Start: ${startDate || 'none'}, End: ${endDate || 'none'}`);
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

        // Set initial state to "Today"
        presetFilter.value = 'today';
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
    mediaElement.className = `card media-card ${media.type}-card`; // Add type class
    mediaElement.dataset.id = media.id;
    
    // Determine icon based on media type
    let iconName = 'file-text'; // Default for note
    if (media.type === 'photo') iconName = 'image';
    if (media.type === 'video') iconName = 'video';
    if (media.type === 'audio') iconName = 'music';

    // Format date for display using Intl.DateTimeFormat
    const formattedDate = media.createdAt 
        ? new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(media.createdAt)) 
        : 'N/A';
    
    // Determine category color class based on media type
    let categoryColorClass = 'accent-blue'; // Default for note
    if (media.type === 'photo') categoryColorClass = 'accent-orange';
    if (media.type === 'video') categoryColorClass = 'accent-purple';
    if (media.type === 'audio') categoryColorClass = 'accent-teal';

    // Different templates for visual (photo/video) vs non-visual (note/audio) media
    if (media.type === 'photo' || media.type === 'video') {
        mediaElement.innerHTML = `
            <!-- Visual media (photo/video) layout -->
            <div class="media-preview">
                <div class="media-type-badge ${media.type}">
                    ${media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                </div>
                
                <!-- Preview icon placeholder -->
                <div class="media-preview-placeholder">
                    <i data-lucide="${iconName}"></i>
                </div>
                
                <!-- Title overlay at bottom -->
                <div class="media-overlay">
                    <h4 class="media-name">${media.name || 'Untitled'}</h4>
                </div>
            </div>
            
            <div class="media-content">
                ${media.description ? `<p class="media-description">${media.description}</p>` : ''}
                
                <div class="media-footer">
                    <span class="media-date">Added ${formattedDate}</span>
                    <div class="media-actions">
                        <button class="icon-button view-media app-button app-button--secondary" title="View ${media.type}">
                            <i data-lucide="eye"></i>
                        </button>
                        <button class="icon-button edit-media app-button app-button--secondary" title="Edit Media">
                            <i data-lucide="edit"></i>
                        </button>
                        <button class="icon-button delete-media app-button app-button--secondary" title="Delete Media">
                            <i data-lucide="trash-2"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        // Note or audio type
        mediaElement.innerHTML = `
            <!-- Non-visual media (note/audio) layout -->
            <div class="accent-bar ${categoryColorClass}"></div>
            
            <div class="media-header">
                <h3 class="media-name">${media.name || 'Untitled'}</h3>
                <span class="media-type-badge ${media.type}">
                    ${media.type.charAt(0).toUpperCase() + media.type.slice(1)}
                </span>
            </div>
            
            <!-- Apply session-notes styling to content/description -->
            ${media.content || media.description ? `
                <div class="session-notes-container">
                    <div class="session-notes">
                        ${media.type === 'note' && media.content ? `
                            <div class="media-note-content">
                                ${media.content}
                            </div>
                        ` : ''}
                        ${media.description ? `<p class="media-description">${media.description}</p>` : ''}
                    </div>
                </div>
            ` : ''}
            
            <div class="media-footer">
                <span class="media-date">Added ${formattedDate}</span>
                <div class="media-actions">
                    ${media.type === 'audio' ? `
                        <button class="icon-button view-media app-button app-button--secondary" title="Play Audio">
                            <i data-lucide="play"></i>
                        </button>
                    ` : ''}
                    <button class="icon-button edit-media app-button app-button--secondary" title="Edit Media">
                        <i data-lucide="edit"></i>
                    </button>
                    <button class="icon-button delete-media app-button app-button--secondary" title="Delete Media">
                        <i data-lucide="trash-2"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // Add event listener for the View button
    const viewBtn = mediaElement.querySelector('.view-media');
    if (viewBtn) {
        viewBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent card click or other events
            viewMediaFile(media); // Call the new view function
        });
    }

    // Add event listener for the Edit button (Implement Edit Logic)
    const editBtn = mediaElement.querySelector('.edit-media');
    if (editBtn) {
        editBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            openEditMediaDialog(media); // Call the new edit dialog function
        });
    }

    // Add event listener for the Delete button (Modified to delete from IndexedDB)
    const deleteBtn = mediaElement.querySelector('.delete-media');
    if (deleteBtn) {
        deleteBtn.addEventListener('click', async (e) => { // Make listener async
            e.stopPropagation();
            if (confirm(`Are you sure you want to delete "${media.name || 'this media item'}"?`)) {
                try {
                    // Delete metadata from localStorage
                    if (window.deleteItem) {
                        window.deleteItem('MEDIA', media.id);
                    }
                    
                    // Delete the actual file from IndexedDB if it's a photo/video
                    if (media.type === 'photo' || media.type === 'video') {
                         await window.practiceTrackDB.deleteMediaFile(media.id);
                    }

                    // Remove the element from the UI
                    mediaElement.remove(); 
                    
                    // Optional: Show a success message
                    // window.UI.showToast('Media deleted successfully');

                } catch (error) {
                    console.error('Error deleting media:', error);
                    alert('Failed to delete media. Please check console.');
                }
            }
        });
    }

    // Initialize Lucide icons within the created element
    if (window.lucide) {
        window.lucide.createIcons({ context: mediaElement });
    }
    
    return mediaElement;
}

/**
 * Handle click on Upload Media button.
 * Opens a file input dialog.
 */
async function handleMediaUpload() {
    console.log('Upload Media button clicked');
    
    // Create a hidden file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*,video/*'; // Accept images and videos
    fileInput.style.display = 'none';

    // Trigger click on file input when the button is clicked
    fileInput.click();

    // Handle file selection
    fileInput.onchange = async (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.log('No file selected for upload.');
            return;
        }

        console.log(`File selected: ${file.name}, Type: ${file.type}, Size: ${file.size}`);

        // Determine media type based on file MIME type
        let mediaType;
        if (file.type.startsWith('image/')) {
            mediaType = 'photo';
        } else if (file.type.startsWith('video/')) {
            mediaType = 'video';
        } else {
            alert('Unsupported file type. Please select an image or video.');
            return;
        }

        try {
            // --- Create metadata object FIRST ---
            const mediaData = {
                id: `media_${Date.now()}`,
                name: file.name,
                type: mediaType,
                description: `Uploaded ${mediaType}`,
                createdAt: new Date().toISOString(),
            };
            
            // --- THEN save the file content using the ID from mediaData ---
            await window.practiceTrackDB.saveMediaFile(mediaData.id, file);
            console.log(`[Upload] File content saved to IndexedDB for key: ${mediaData.id}`);

            // --- Now save the metadata ---
            if (window.addItem) {
                window.addItem('MEDIA', mediaData);
            }

            console.log('Media metadata saved for uploaded file:', mediaData);

            // Refresh the media list
            window.UI.loadRecords('media');
            
            // Optional: Show success message
            // window.UI.showToast(`Successfully uploaded ${mediaType}: ${file.name}`);

        } catch (error) {
            console.error('Error handling media upload:', error);
            alert('Failed to process uploaded media. See console for details.');
        }
        
        // Clean up the temporary file input
        document.body.removeChild(fileInput);
    };
    
    // Append to body temporarily to handle the change event
    document.body.appendChild(fileInput);
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
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Prioritize rear camera

        input.onchange = function(e) {
            console.log("[Photo Capture] onchange event fired.", e.target.files);
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                console.log("[Photo Capture] File object found:", file);

                // Ensure input is removed before dialog
                if (input.parentNode) {
                    input.parentNode.removeChild(input);
                }

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

                        if (!name) {
                            alert('Please enter a name for the photo');
                            return;
                        }
                        
                        // Get the actual file object again (it was available in the outer scope)
                        const photoFile = file; 

                        try {
                            // 1. Save the actual file to IndexedDB
                            await window.practiceTrackDB.saveMediaFile(newMediaId, photoFile);

                            // 2. Save the metadata to localStorage
                            if (window.addItem) {
                                window.addItem('MEDIA', newMediaMetadata);
                            }
                            
                            // --- Download Trigger --- 
                            try {
                                const tempUrl = URL.createObjectURL(photoFile);
                                const downloadLink = document.createElement('a');
                                downloadLink.href = tempUrl;
                                // Use the user-provided name for the download, fallback to a default
                                const safeFilename = name.replace(/[^a-z0-9_.-]/gi, '_'); // Basic sanitization
                                const fileExtension = photoFile.name.split('.').pop() || 'jpg';
                                downloadLink.download = `${safeFilename}.${fileExtension}`; 
                                downloadLink.style.display = 'none';
                                document.body.appendChild(downloadLink);
                                downloadLink.click(); // Trigger the download
                                document.body.removeChild(downloadLink);
                                // Revoke the temporary URL after a short delay 
                                setTimeout(() => URL.revokeObjectURL(tempUrl), 100);
                                console.log('Photo download triggered.');
                            } catch (downloadError) {
                                console.error('Could not trigger photo download:', downloadError);
                            }
                            // --- END Download Trigger --- 

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

                dialog.showModal();
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

                // >>> ADDED: Remove the input element BEFORE showing the dialog <<< 
                if (input.parentNode) {
                    input.parentNode.removeChild(input);
                }

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

                            // --- Download Trigger for VIDEO --- 
                            try {
                                const tempUrl = URL.createObjectURL(file); // Use the file object from outer scope
                                const downloadLink = document.createElement('a');
                                downloadLink.href = tempUrl;
                                // Use the user-provided name for the download, fallback to a default
                                const safeFilename = name.replace(/[^a-z0-9_.-]/gi, '_'); // Basic sanitization
                                const fileExtension = file.name.split('.').pop() || 'mp4'; // Default extension
                                downloadLink.download = `${safeFilename}.${fileExtension}`; 
                                downloadLink.style.display = 'none';
                                document.body.appendChild(downloadLink);
                                downloadLink.click(); // Trigger the download
                                document.body.removeChild(downloadLink);
                                // Revoke the temporary URL after a short delay 
                                setTimeout(() => URL.revokeObjectURL(tempUrl), 100);
                                console.log('Video download triggered.');
                            } catch (downloadError) {
                                console.error('Could not trigger video download:', downloadError);
                            }
                            // --- END Download Trigger ---

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

                dialog.showModal();
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