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
                <img src="${media.fileUrl}" alt="${media.name || 'Photo'}" />
            </div>`;
            break;
        case 'video':
            content = `<div class="media-video">
                <video controls>
                    <source src="${media.fileUrl}" type="${media.fileType}">
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
        </div>
    `;
    
    // Add event listener for delete
    const deleteButton = mediaElement.querySelector('.delete-media');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deleteMedia(media.id));
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
        // Create a hidden input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.capture = 'environment'; // Use the back camera
        
        // Handle file selection
        input.onchange = function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                
                // Create a temporary URL for preview
                const fileUrl = URL.createObjectURL(file);
                
                // Create media object
                const newMedia = {
                    id: `media_${Date.now()}`,
                    type: 'photo',
                    name: file.name,
                    fileType: file.type,
                    fileUrl: fileUrl,
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
                    window.showNotification('Photo Added', 'Your photo has been saved to your gallery.');
                }
            }
        };
        
        // Trigger the file input click
        input.click();
    });
}

/**
 * Setup video capture functionality
 */
function setupVideoCapture() {
    const videoBtn = document.getElementById('add-video');
    if (!videoBtn) return;
    
    videoBtn.addEventListener('click', () => {
        // Create a hidden input element
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'video/*';
        input.capture = 'environment'; // Use the back camera
        
        // Handle file selection
        input.onchange = function(e) {
            if (e.target.files && e.target.files[0]) {
                const file = e.target.files[0];
                
                // Create a temporary URL for preview
                const fileUrl = URL.createObjectURL(file);
                
                // Create media object
                const newMedia = {
                    id: `media_${Date.now()}`,
                    type: 'video',
                    name: file.name,
                    fileType: file.type,
                    fileUrl: fileUrl,
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
                    window.showNotification('Video Added', 'Your video has been saved to your gallery.');
                }
            }
        };
        
        // Trigger the file input click
        input.click();
    });
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
        }
    ];
    
    // Create dialog using UI framework
    const dialog = window.UI.createStandardDialog({
        title: existingNote ? 'Edit Note' : 'Add Note',
        fields: fields,
        onSubmit: (dialog, e) => {
            const form = e.target;
            const contentInput = form.querySelector('#note-content');
            
            const content = contentInput.value;
            
            if (existingNote) {
                // Update existing note
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
                    content: content,
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
        
        .media-name {
            font-weight: bold;
            font-size: 16px;
            margin: 0 0 5px 0;
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