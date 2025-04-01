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
        emptyStateMessage: 'No media yet. Add photos, videos, or notes to track your progress.',
        emptyStateIcon: 'image',
        createRecordElementFn: createMediaElement
    });
    
    // Set up media buttons
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
    mediaElement.className = 'media-card';
    mediaElement.dataset.id = media.id;
    
    // Format content based on media type
    let content = '';
    switch (media.type) {
        case 'photo':
            content = `<div class="media-image">
                <img src="${media.filePath}" alt="${media.name || 'Photo'}" />
            </div>`;
            break;
        case 'video':
            content = `<div class="media-video">
                <video controls>
                    <source src="${media.filePath}" type="${media.fileType}">
                    Your browser does not support the video tag.
                </video>
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
                <button class="icon-button edit-media" title="Edit Media">
                    <i data-lucide="edit"></i>
                </button>
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
            ${media.filename ? `<p class="media-filename">${media.filename}</p>` : ''}
            <div class="media-notes">
                ${media.notes ? `<p>${media.notes}</p>` : '<p class="empty-note">Add notes...</p>'}
            </div>
        </div>
    `;
    
    // Add event listeners
    const editButton = mediaElement.querySelector('.edit-media');
    if (editButton) {
        editButton.addEventListener('click', () => editMediaNotes(media));
    }
    
    const deleteButton = mediaElement.querySelector('.delete-media');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deleteMedia(media.id));
    }
    
    return mediaElement;
}

/**
 * Show naming dialog after capturing/selecting media
 * @param {File} file - The media file
 * @param {string} type - Media type (photo or video)
 */
function showNamingDialog(file, type) {
    // Prepare fields for the dialog
    const fields = [
        {
            type: 'text',
            id: 'media-name',
            label: 'Name',
            required: true
        },
        {
            type: 'textarea',
            id: 'media-notes',
            label: 'Notes',
            rows: 4
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
        fields: fields,
        onSubmit: (dialog, e) => {
            const form = e.target;
            const nameInput = form.querySelector('#media-name');
            const notesInput = form.querySelector('#media-notes');
            
            if (!nameInput.value.trim()) {
                alert('Please enter a name for this media');
                return;
            }
            
            // Create media object
            const newMedia = {
                id: `media_${Date.now()}`,
                type: type,
                name: nameInput.value.trim(),
                notes: notesInput.value,
                filename: file.name,
                fileType: file.type,
                filePath: URL.createObjectURL(file), // Create a temporary URL for display
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Save media reference to localStorage
            if (window.addItem) {
                window.addItem('MEDIA', newMedia);
            } else {
                saveMedia(newMedia);
            }
            
            dialog.close();
            
            // Reload media list
            window.UI.loadRecords('media', {
                recordType: 'MEDIA',
                createRecordElementFn: createMediaElement
            });
            
            // Show success message
            if (window.showNotification) {
                window.showNotification(`${type.charAt(0).toUpperCase() + type.slice(1)} Added`, 
                    `Your ${type} has been saved.`);
            }
        },
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save',
        cancelButtonText: 'Cancel'
    });
    
    dialog.showModal();
}

/**
 * Setup photo capture functionality
 */
function setupPhotoCapture() {
    const photoBtn = document.getElementById('add-photo');
    if (!photoBtn) return;
    
    if (isMobileDevice()) {
        // Mobile: Direct camera capture
        photoBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.capture = 'environment'; // Use the back camera
            
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    showNamingDialog(e.target.files[0], 'photo');
                }
            };
            
            input.click();
        });
    } else {
        // Desktop: File selection
        photoBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    showNamingDialog(e.target.files[0], 'photo');
                }
            };
            
            input.click();
        });
    }
}

/**
 * Setup video capture functionality
 */
function setupVideoCapture() {
    const videoBtn = document.getElementById('add-video');
    if (!videoBtn) return;
    
    if (isMobileDevice()) {
        // Mobile: Direct camera capture
        videoBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            input.capture = 'environment'; // Use the back camera
            
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    showNamingDialog(e.target.files[0], 'video');
                }
            };
            
            input.click();
        });
    } else {
        // Desktop: File selection
        videoBtn.addEventListener('click', () => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'video/*';
            
            input.onchange = function(e) {
                if (e.target.files && e.target.files[0]) {
                    showNamingDialog(e.target.files[0], 'video');
                }
            };
            
            input.click();
        });
    }
}

// Set up media buttons with individual handlers
function setupMediaButtons() {
    console.log('Setting up media buttons');
    
    // Setup photo capture
    setupPhotoCapture();
    
    // Setup video capture
    setupVideoCapture();
    
    // Setup note creation
    const noteBtn = document.getElementById('add-note');
    if (noteBtn) {
        noteBtn.addEventListener('click', () => showNoteDialog());
    }
}

/**
 * Show dialog for adding a new note
 * @param {Object} existingNote - Optional existing note for editing
 */
function showNoteDialog(existingNote = null) {
    // Set up form fields
    const fields = [
        {
            type: 'textarea',
            id: 'note-content',
            label: 'Content',
            rows: 6,
            value: existingNote ? existingNote.content || '' : ''
        },
        {
            type: 'textarea',
            id: 'note-notes',
            label: 'Additional Notes',
            rows: 3,
            value: existingNote ? existingNote.notes || '' : ''
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: existingNote ? 'Edit Note' : 'Add Note',
        fields: fields,
        onSubmit: (dialog, e) => {
            const form = e.target;
            const contentInput = form.querySelector('#note-content');
            const notesInput = form.querySelector('#note-notes');
            
            const content = contentInput.value;
            const notes = notesInput.value;
            
            if (existingNote) {
                // Update existing note
                existingNote.content = content;
                existingNote.notes = notes;
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
                    content: content,
                    notes: notes,
                    filename: `note_${new Date().toISOString().split('T')[0]}.txt`,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                
                // Save the new note
                if (window.addItem) {
                    window.addItem('MEDIA', newNote);
                } else {
                    saveMedia(newNote);
                }
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
 * Edit media notes
 * @param {Object} media - The media to edit
 */
function editMediaNotes(media) {
    // For note type, use the note dialog
    if (media.type === 'note') {
        showNoteDialog(media);
        return;
    }
    
    // For photos and videos, show a simpler dialog
    const fields = [
        {
            type: 'text',
            id: 'media-filename',
            label: 'Filename',
            value: media.filename || '',
            disabled: true
        },
        {
            type: 'textarea',
            id: 'media-notes',
            label: 'Notes',
            rows: 4,
            value: media.notes || ''
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: `Edit ${media.type.charAt(0).toUpperCase() + media.type.slice(1)} Details`,
        fields: fields,
        onSubmit: (dialog, e) => {
            const form = e.target;
            const notesInput = form.querySelector('#media-notes');
            
            // Update media object
            media.notes = notesInput.value;
            media.updatedAt = new Date().toISOString();
            
            // Save updates
            if (window.updateItem) {
                window.updateItem('MEDIA', media.id, media);
            } else {
                saveMedia(media);
            }
            
            dialog.close();
            
            // Reload media list
            window.UI.loadRecords('media', {
                recordType: 'MEDIA',
                createRecordElementFn: createMediaElement
            });
            
            // Show success message
            if (window.showNotification) {
                window.showNotification('Media Updated', 'Your media details have been updated.');
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
        message: 'Are you sure you want to delete this media?',
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
            window.showNotification('Media Deleted', 'The media has been deleted.');
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
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            background-color: #fff;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
        }
        
        .media-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 10px;
        }
        
        .media-date {
            font-size: 14px;
            color: #666;
        }
        
        .media-actions {
            display: flex;
            gap: 8px;
        }
        
        .media-content {
            margin-bottom: 15px;
        }
        
        .media-image img {
            max-width: 100%;
            max-height: 300px;
            border-radius: 4px;
            display: block;
            margin: 0 auto;
        }
        
        .media-video video {
            max-width: 100%;
            max-height: 300px;
            border-radius: 4px;
            display: block;
            margin: 0 auto;
        }
        
        .media-placeholder {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background-color: #f9f9f9;
            padding: 20px;
            border-radius: 4px;
            text-align: center;
        }
        
        .media-placeholder i {
            color: #999;
            margin-bottom: 10px;
            width: 40px;
            height: 40px;
        }
        
        .reference-text {
            color: #666;
            font-size: 14px;
            margin: 0;
        }
        
        .note-content {
            background-color: #ffffd0;
            padding: 15px;
            border-radius: 4px;
            white-space: pre-wrap;
            min-height: 100px;
        }
        
        .media-name {
            font-weight: bold;
            font-size: 16px;
            margin: 0 0 5px 0;
        }
        
        .media-filename {
            color: #666;
            font-size: 14px;
            margin: 0 0 10px 0;
            font-style: italic;
        }
        
        .media-notes {
            border-top: 1px solid #eee;
            padding-top: 10px;
            margin-top: 10px;
        }
        
        .empty-note {
            color: #999;
            font-style: italic;
        }
    `;
}

// Initialize when page changes to media
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'media') {
        initializeMedia();
    }
});

// Initialize IndexedDB when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initMediaDB().catch(error => {
        console.error('Error initializing media database:', error);
    });
});

// Make function available globally
window.initializeMedia = initializeMedia; 