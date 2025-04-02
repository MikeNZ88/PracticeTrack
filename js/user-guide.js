// User Guide Module
window.UserGuide = (function() {
    // Create and show the user guide dialog
    function showUserGuide() {
        // Create dialog container
        const dialog = document.createElement('div');
        dialog.className = 'dialog user-guide-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h2>PracticeTrack User Guide</h2>
                    <button class="close-button">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dialog-body">
                    <iframe src="user-guide.html" frameborder="0"></iframe>
                </div>
            </div>
        `;

        // Add to document
        document.body.appendChild(dialog);

        // Initialize Lucide icons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }

        // Add close button functionality
        const closeButton = dialog.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            dialog.remove();
        });

        // Close on escape key
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });
    }

    // Initialize event listeners
    function initialize() {
        // Timer page button
        const timerButton = document.getElementById('how-to-use-btn');
        if (timerButton) {
            timerButton.addEventListener('click', showUserGuide);
        }

        // Resources page button
        const resourcesButton = document.getElementById('resources-how-to-use-btn');
        if (resourcesButton) {
            resourcesButton.addEventListener('click', showUserGuide);
        }
    }

    // Initialize when DOM is loaded
    document.addEventListener('DOMContentLoaded', initialize);

    // Make functions available globally
    return {
        showUserGuide,
        initialize
    };
})(); 