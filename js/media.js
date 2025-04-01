// DOM Elements
const mediaList = document.getElementById('media-list');
const addPhotoButton = document.getElementById('add-photo');
const addVideoButton = document.getElementById('add-video');
const addNoteButton = document.getElementById('add-note');
const mediaContainer = document.querySelector('.media-container');

// Device detection
const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
};

// Initialize media page
const initializeMedia = () => {
    console.log('Initializing media page');
    
    if (!mediaList) {
        console.error('Media list element not found');
        return;
    }
    
    // Clear the media list before populating it
    mediaList.innerHTML = '';
    
    loadMedia();
    setupMediaButtons();
    setupMediaFilters();
    addMediaStyles();
    
    // Debugging - log media items after loading
    const mediaItems = getItems('MEDIA') || [];
    console.log(`Media list initialized with ${mediaItems.length} items`);
};

// Setup media filters
const setupMediaFilters = () => {
    // Add filters before media list if they don't exist
    if (!document.querySelector('.media-filters')) {
        const filtersDiv = document.createElement('div');
        filtersDiv.className = 'filters media-filters';
        filtersDiv.innerHTML = `
            <input type="text" class="search-input" placeholder="Search media...">
            <div class="date-range">
                <input type="date" class="date-input" placeholder="Start Date">
                <input type="date" class="date-input" placeholder="End Date">
            </div>
        `;
        
        // Insert before media list
        if (mediaContainer) {
            mediaContainer.insertBefore(filtersDiv, mediaList);
            
            // Add event listeners
            const searchInput = filtersDiv.querySelector('.search-input');
            const dateInputs = filtersDiv.querySelectorAll('.date-input');
            
            searchInput.addEventListener('input', applyMediaFilters);
            dateInputs.forEach(input => input.addEventListener('change', applyMediaFilters));
        }
    }
};

// Apply media filters
const applyMediaFilters = () => {
    const searchInput = document.querySelector('.media-filters .search-input');
    const dateInputs = document.querySelectorAll('.media-filters .date-input');
    
    if (!searchInput || dateInputs.length < 2) return;
    
    const searchTerm = searchInput.value.toLowerCase();
    const startDate = dateInputs[0].value ? new Date(dateInputs[0].value) : null;
    const endDate = dateInputs[1].value ? new Date(dateInputs[1].value) : null;
    
    if (endDate) {
        // Set end date to end of day
        endDate.setHours(23, 59, 59, 999);
    }
    
    const mediaItems = document.querySelectorAll('.media-card');
    
    mediaItems.forEach(item => {
        const mediaId = item.dataset.id;
        const media = getItemById('MEDIA', mediaId);
        
        if (!media) return;
        
        let visible = true;
        
        // Filter by search term
        if (searchTerm) {
            const mediaName = media.filename || '';
            const mediaNotes = media.notes || '';
            const mediaContent = media.content || '';
            
            visible = mediaName.toLowerCase().includes(searchTerm) || 
                     mediaNotes.toLowerCase().includes(searchTerm) ||
                     mediaContent.toLowerCase().includes(searchTerm);
        }
        
        // Filter by date range
        if (visible && startDate) {
            const mediaDate = new Date(media.createdAt);
            visible = mediaDate >= startDate;
        }
        
        if (visible && endDate) {
            const mediaDate = new Date(media.createdAt);
            visible = mediaDate <= endDate;
        }
        
        item.style.display = visible ? '' : 'none';
    });
};

// Load and display media
const loadMedia = () => {
    const media = getItems('MEDIA') || [];
    console.log(`Loading ${media.length} media items`);
    
    if (!mediaList) {
        console.error('Media list element not found in loadMedia');
        return;
    }
    
    // Clear the existing content
    mediaList.innerHTML = '';
    
    if (media.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i data-lucide="image"></i>
            <p>No media yet. Add photos, videos, or notes to track your progress.</p>
        `;
        mediaList.appendChild(emptyState);
        
        if (typeof lucide !== 'undefined' && lucide.createIcons) {
            lucide.createIcons();
        }
        return;
    }
    
    // Sort media by newest first
    media.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Add each media item to the list
    media.forEach(item => {
        const mediaElement = createMediaElement(item);
        mediaList.appendChild(mediaElement);
    });
    
    // Update icons
    if (typeof lucide !== 'undefined' && lucide.createIcons) {
        lucide.createIcons();
    }
    
    console.log(`Media list updated with ${media.length} items`);
};

// Create media element
const createMediaElement = (media) => {
    const div = document.createElement('div');
    div.className = 'card media-card';
    div.dataset.id = media.id;
    
    let content = '';
    switch (media.type) {
        case 'photo':
            // Always show placeholder for photos
            content = `<div class="media-placeholder">
                <i data-lucide="image"></i>
                <p class="reference-text">Photo Reference: ${media.filename}</p>
            </div>`;
            break;
        case 'video':
            // Always show placeholder for videos
            content = `<div class="media-placeholder">
                <i data-lucide="video"></i>
                <p class="reference-text">Video Reference: ${media.filename}</p>
            </div>`;
            break;
        case 'note':
            content = `<div class="note-content">${media.content}</div>`;
            break;
    }
    
    const date = new Date(media.createdAt).toLocaleDateString();
    const time = new Date(media.createdAt).toLocaleTimeString();
    
    div.innerHTML = `
        <div class="media-header">
            <span class="media-date">${date} at ${time}</span>
            <div class="media-actions">
                <button class="icon-button edit-notes" data-id="${media.id}">
                    <i data-lucide="edit"></i>
                </button>
                <button class="icon-button delete-media" data-id="${media.id}">
                    <i data-lucide="trash-2"></i>
                </button>
            </div>
        </div>
        <div class="media-content">
            ${content}
        </div>
        <div class="media-info">
            ${media.filename ? `<p class="media-filename">${media.filename}</p>` : ''}
            <div class="media-notes">
                ${media.notes ? `<p>${media.notes}</p>` : '<p class="empty-note">Add notes...</p>'}
            </div>
        </div>
    `;
    
    // Add event listeners
    const deleteButton = div.querySelector('.delete-media');
    if (deleteButton) {
        deleteButton.addEventListener('click', () => deleteMedia(media.id));
    }
    
    const editButton = div.querySelector('.edit-notes');
    if (editButton) {
        editButton.addEventListener('click', () => editMediaNotes(media));
    }
    
    return div;
};

// Setup media buttons
const setupMediaButtons = () => {
    const isMobile = isMobileDevice();
    
    if (addPhotoButton) {
        if (isMobile) {
            // Mobile: Use device camera
            addPhotoButton.addEventListener('click', capturePhoto);
        } else {
            // Desktop: Disable camera functionality
            addPhotoButton.classList.add('disabled');
            addPhotoButton.title = 'Camera functionality is only available on mobile devices';
            addPhotoButton.addEventListener('click', showDesktopCameraMessage);
        }
    }
    
    if (addVideoButton) {
        if (isMobile) {
            // Mobile: Use device camera
            addVideoButton.addEventListener('click', captureVideo);
        } else {
            // Desktop: Disable camera functionality
            addVideoButton.classList.add('disabled');
            addVideoButton.title = 'Camera functionality is only available on mobile devices';
            addVideoButton.addEventListener('click', showDesktopCameraMessage);
        }
    }
    
    if (addNoteButton) {
        addNoteButton.addEventListener('click', () => showNoteDialog());
    }
};

// Show message for desktop users
const showDesktopCameraMessage = () => {
    alert('Camera functionality is only available on mobile devices.');
};

// Capture photo using device camera
const capturePhoto = () => {
    // Create a hidden file input for camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'camera'; // This will open the camera on supported mobile devices
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Get the file extension
        const extension = file.name.split('.').pop().toLowerCase();
        
        // Show naming dialog after capture
        showNamingDialog(file, 'photo', extension);
    };
    
    input.click();
};

// Capture video using device camera
const captureVideo = () => {
    // Create a hidden file input for camera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.capture = 'camcorder'; // This will open the video camera on supported mobile devices
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Get the file extension
        const extension = file.name.split('.').pop().toLowerCase();
        
        // Show naming dialog after capture
        showNamingDialog(file, 'video', extension);
    };
    
    input.click();
};

// Show naming dialog after capture
const showNamingDialog = (file, type, extension) => {
    const fileSize = file.size / 1024 / 1024; // size in MB
    if (fileSize > 5) {
        alert('File is too large. Please choose a file under 5MB.');
        return;
    }
    
    // Create a dialog for naming
    const dialog = document.createElement('dialog');
    dialog.className = 'naming-dialog';
    
    // Create a sensible default name
    const defaultName = `practice_${type}_${new Date().toISOString().split('T')[0]}`;
    
    dialog.innerHTML = `
        <form class="naming-form">
            <h2>Name Your ${type.charAt(0).toUpperCase() + type.slice(1)}</h2>
            <p>Please provide a name for this ${type} to help you identify it later.</p>
            <div class="form-group">
                <label for="media-name">Name</label>
                <input type="text" id="media-name" value="${defaultName}" required>
                <span class="extension">.${extension}</span>
            </div>
            <div class="form-group">
                <label for="media-notes">Notes (optional)</label>
                <textarea id="media-notes" rows="3"></textarea>
            </div>
            <div class="dialog-actions">
                <button type="button" class="secondary-button cancel-button">Cancel</button>
                <button type="submit" class="primary-button">Save</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(dialog);
    dialog.showModal();
    
    // Focus the name input
    setTimeout(() => {
        const nameInput = document.getElementById('media-name');
        if (nameInput) {
            nameInput.focus();
            nameInput.select();
        }
    }, 100);
    
    // Handle form submission
    const form = dialog.querySelector('.naming-form');
    form.addEventListener('submit', (evt) => {
        evt.preventDefault();
        
        const filename = `${document.getElementById('media-name').value}.${extension}`;
        const notes = document.getElementById('media-notes').value;
        
        // Create a reference to the media (not storing the actual file)
        const media = {
            id: `m-${Date.now()}`,
            type,
            filename,
            notes,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Save the media reference
        saveItem('MEDIA', media);
        dialog.close();
        
        // Reload the media list to reflect the new media item
        loadMedia();
        
        // Show success message
        alert(`Your ${type} reference "${filename}" has been saved.`);
    });
    
    // Handle cancel
    const cancelButton = dialog.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => {
        dialog.close();
    });
    
    // Handle dialog close
    dialog.addEventListener('close', () => {
        dialog.remove();
    });
};

// Show note dialog
const showNoteDialog = (existingNote = null) => {
    const dialog = document.createElement('dialog');
    dialog.className = 'note-dialog';
    dialog.innerHTML = `
        <form class="note-form">
            <h2>${existingNote ? 'Edit' : 'Add'} Note</h2>
            <div class="form-group">
                <label for="note-content">Content</label>
                <textarea id="note-content" required>${existingNote?.content || ''}</textarea>
            </div>
            <div class="form-group">
                <label for="note-notes">Additional Notes</label>
                <textarea id="note-notes">${existingNote?.notes || ''}</textarea>
            </div>
            <div class="dialog-actions">
                <button type="button" class="secondary-button cancel-button">Cancel</button>
                <button type="submit" class="primary-button">Save</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(dialog);
    dialog.showModal();
    
    // Handle form submission
    const form = dialog.querySelector('.note-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const content = document.getElementById('note-content').value;
        const notes = document.getElementById('note-notes').value;
        
        if (existingNote) {
            // Update existing note
            existingNote.content = content;
            existingNote.notes = notes;
            existingNote.updatedAt = new Date().toISOString();
            
            saveItem('MEDIA', existingNote);
        } else {
            // Create new note
            const media = {
                id: `m-${Date.now()}`,
                type: 'note',
                content,
                notes,
                filename: `note_${new Date().toISOString().split('T')[0]}.txt`,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            saveItem('MEDIA', media);
        }
        
        dialog.close();
        loadMedia();
    });
    
    // Handle cancel
    const cancelButton = dialog.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => dialog.close());
    
    // Handle dialog close
    dialog.addEventListener('close', () => dialog.remove());
};

// Edit media notes
const editMediaNotes = (media) => {
    if (media.type === 'note') {
        showNoteDialog(media);
        return;
    }
    
    const dialog = document.createElement('dialog');
    dialog.className = 'edit-dialog';
    dialog.innerHTML = `
        <form class="edit-form">
            <h2>Edit Details</h2>
            ${media.filename ? `
            <div class="form-group">
                <label>Filename</label>
                <p class="filename-display">${media.filename}</p>
            </div>
            ` : ''}
            <div class="form-group">
                <label for="media-notes">Notes</label>
                <textarea id="media-notes" rows="4">${media.notes || ''}</textarea>
            </div>
            <div class="dialog-actions">
                <button type="button" class="secondary-button cancel-button">Cancel</button>
                <button type="submit" class="primary-button">Save</button>
            </div>
        </form>
    `;
    
    document.body.appendChild(dialog);
    dialog.showModal();
    
    // Handle form submission
    const form = dialog.querySelector('.edit-form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        media.notes = document.getElementById('media-notes').value;
        media.updatedAt = new Date().toISOString();
        
        saveItem('MEDIA', media);
        dialog.close();
        loadMedia();
    });
    
    // Handle cancel
    const cancelButton = dialog.querySelector('.cancel-button');
    cancelButton.addEventListener('click', () => dialog.close());
    
    // Handle dialog close
    dialog.addEventListener('close', () => dialog.remove());
};

// Handle media upload (fallback for desktop)
const handleMediaUpload = (event, type) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Get the file extension
    const extension = file.name.split('.').pop().toLowerCase();
    
    // Show naming dialog
    showNamingDialog(file, type, extension);
};

// Delete media
const deleteMedia = (mediaId) => {
    if (confirm('Are you sure you want to delete this media?')) {
        deleteItem('MEDIA', mediaId);
        loadMedia();
    }
};

// Add CSS styles for media
const addMediaStyles = () => {
    const style = document.createElement('style');
    style.textContent = `
        .media-filters {
            margin-bottom: 20px;
        }
        
        .media-list {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
            gap: 20px;
            margin-top: 20px;
        }
        
        .media-card {
            border: 1px solid #eee;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            background: #fff;
        }
        
        .media-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 10px;
            background: #f5f5f5;
            border-bottom: 1px solid #eee;
        }
        
        .media-content {
            max-height: 250px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
        }
        
        .media-content img, 
        .media-content video {
            width: 100%;
            object-fit: cover;
        }
        
        .media-placeholder {
            height: 200px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            background: #f9f9f9;
            color: #aaa;
            padding: 20px;
            text-align: center;
        }
        
        .media-placeholder svg {
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
        }
        
        .reference-text {
            font-size: 0.9em;
            color: #777;
            margin-top: 10px;
            word-break: break-word;
        }
        
        .note-content {
            padding: 15px;
            width: 100%;
            min-height: 100px;
            background: #f9f9f9;
            white-space: pre-wrap;
        }
        
        .media-info {
            padding: 10px;
        }
        
        .media-filename {
            font-weight: bold;
            margin-bottom: 5px;
            word-break: break-all;
        }
        
        .media-notes {
            font-size: 0.9em;
            color: #555;
            border-top: 1px solid #eee;
            padding-top: 5px;
        }
        
        .empty-note {
            color: #aaa;
            font-style: italic;
        }
        
        .icon-button {
            background: none;
            border: none;
            cursor: pointer;
            color: #555;
            padding: 5px;
            border-radius: 4px;
        }
        
        .icon-button:hover {
            background: #eee;
        }
        
        .empty-state {
            text-align: center;
            padding: 40px;
            color: #888;
        }
        
        .empty-state svg {
            width: 48px;
            height: 48px;
            margin-bottom: 10px;
        }
        
        .loading-message {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
        }
        
        .naming-dialog,
        .note-dialog,
        .edit-dialog {
            padding: 20px;
            border-radius: 8px;
            border: 1px solid #eee;
            box-shadow: 0 2px 20px rgba(0,0,0,0.2);
            max-width: 500px;
            width: 100%;
        }
        
        .naming-form,
        .note-form,
        .edit-form {
            display: flex;
            flex-direction: column;
            gap: 15px;
        }
        
        .form-group {
            display: flex;
            flex-direction: column;
            gap: 5px;
        }
        
        .form-group label {
            font-weight: bold;
        }
        
        .form-group input,
        .form-group textarea {
            padding: 8px;
            border: 1px solid #ddd;
            border-radius: 4px;
        }
        
        .extension {
            color: #888;
            display: inline-block;
            margin-left: 5px;
        }
        
        .filename-display {
            padding: 8px;
            background: #f5f5f5;
            border-radius: 4px;
            word-break: break-all;
        }
        
        .dialog-actions {
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            margin-top: 10px;
        }
        
        .disabled {
            opacity: 0.6;
            cursor: not-allowed;
        }
    `;
    document.head.appendChild(style);
};

// Expose to global scope
window.initializeMedia = initializeMedia;
window.loadMedia = loadMedia;  // Make loadMedia globally accessible 

function updateMediaList(mediaItems) {
    console.log('Updating media list');
    
    // Get current instrument from settings
    let settings = window.getItems('SETTINGS');
    settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
    const currentInstrument = settings.primaryInstrument || '';
    console.log('Current instrument for media:', currentInstrument);
    
    // Filter media by current instrument
    if (currentInstrument && mediaItems) {
        mediaItems = mediaItems.filter(item => item.instrument === currentInstrument);
        console.log(`Filtered to ${mediaItems.length} media items for instrument: ${currentInstrument}`);
    }
    
    // Get media list container
    const mediaList = document.getElementById('media-list');
    if (!mediaList) {
        console.error('Media list container not found');
        return;
    }
    
    // Clear existing media items
    mediaList.innerHTML = '';
    
    // Show message if no media
    if (!mediaItems || mediaItems.length === 0) {
        const noMedia = document.createElement('div');
        noMedia.className = 'no-media';
        noMedia.textContent = currentInstrument ? 
            `No media found for ${currentInstrument}` : 
            'No media found';
        mediaList.appendChild(noMedia);
        return;
    }
    
    // Sort media by date (newest first)
    mediaItems.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Add media items to list
    mediaItems.forEach(item => {
        const mediaElement = createMediaElement(item);
        if (mediaElement) {
            mediaList.appendChild(mediaElement);
        }
    });
    
    // Refresh icons
    if (window.lucide && window.lucide.createIcons) {
        window.lucide.createIcons();
    }
}

function addMediaItem(mediaData) {
    try {
        // Get current instrument from settings
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
        const currentInstrument = settings.primaryInstrument || '';
        
        if (!currentInstrument) {
            alert('Please select an instrument in settings before adding media');
            return null;
        }
        
        // Create media object with instrument
        const mediaItem = {
            id: `m-${Date.now()}`,
            type: mediaData.type,
            title: mediaData.title,
            content: mediaData.content,
            description: mediaData.description || '',
            categoryId: mediaData.categoryId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            instrument: currentInstrument
        };
        
        console.log('Adding new media item for instrument:', currentInstrument, mediaItem);
        
        // Get existing media
        let mediaItems = getItems('MEDIA') || [];
        
        // Add new item
        mediaItems.push(mediaItem);
        
        // Save back to storage
        setItems('MEDIA', mediaItems);
        
        return mediaItem;
    } catch (error) {
        console.error('Error adding media item:', error);
        return null;
    }
} 