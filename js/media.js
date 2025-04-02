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
    let content = '';
    switch (media.type) {
        case 'photo':
            content = `<div class="media-image">
                <div class="image-placeholder">
                    <i data-lucide="image"></i>
                    <p>Photo saved to your device</p>
                    <p class="file-name">${media.name || 'Photo'}</p>
                </div>
            </div>`;
            break;
        case 'video':
            content = `<div class="media-video">
                <div class="video-placeholder">
                    <i data-lucide="video"></i>
                    <p>Video saved to your device</p>
                    <p class="file-name">${media.name || 'Video'}</p>
                </div>
            </div>`;
            break;
        case 'note':
            content = `<div class="note-content">${media.content || ''}</div>`;
            break;
    }
    
    // Format date
    const date = new Date(media.createdAt).toLocaleDateString();
    const time = new Date(media.createdAt).toLocaleTimeString();
    
    mediaElement.innerHTML = `
        <div class="media-header">
            <span class="media-date">${date} at ${time}</span>
            <div class="media-actions">
                <button class="icon-button delete-media" title="Delete Media">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
        <div class="media-content">
            ${content}
        </div>
        <div class="media-info">
            ${media.name ? `<p class="media-name">${media.name}</p>` : ''}
            ${media.description ? `<p class="media-description">${media.description}</p>` : ''}
        </div>
    `;
    
    // Add event listener for delete
    const deleteButton = mediaElement.querySelector('.delete-media');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deleteMedia(media.id));
    }
    
    // Initialize Lucide icons
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
        window.lucide.createIcons();
    }
    
    return mediaElement;
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
    console.log('[DEBUG] showNoteDialog called. Existing note:', existingNote); // Log entry
    // Set up form fields
    const fields = [
        {
            type: 'text',
            id: 'note-title',
            label: 'Title',
            required: true,
            value: existingNote ? existingNote.name || '' : `Note ${new Date().toLocaleDateString()}`
        },
        {
            type: 'textarea',
            id: 'note-content',
            label: 'Content',
            rows: 6,
            value: existingNote ? existingNote.content || '' : ''
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: existingNote ? 'Edit Note' : 'Add Note',
        fields: fields,
        onSubmit: (dialog, e) => {
            console.log('[DEBUG] Note Dialog onSubmit triggered.'); // Log entry
            const form = e.target;
            const titleInput = form.querySelector('#note-title');
            const contentInput = form.querySelector('#note-content');
            
            const title = titleInput.value.trim();
            const content = contentInput.value;
            
            if (!title) {
                alert('Please enter a title for your note');
                return;
            }
            
            if (existingNote) {
                // Update existing note
                existingNote.name = title;
                existingNote.content = content;
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
            
            dialog.close();
            
            // Reload media list
            window.UI.loadRecords('media', {
                recordType: 'MEDIA',
                createRecordElementFn: createMediaElement
            });
            
            // Show success message
            if (window.showNotification) {
                window.showNotification(existingNote ? 'Note Updated' : 'Note Added', 
                    existingNote ? 'Your note has been updated.' : 'Your note has been added.');
            }
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