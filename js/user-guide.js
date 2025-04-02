// User Guide Module
window.UserGuide = (function() {
    // Create and show the user guide dialog
    function showUserGuide() {
        // Remove any existing dialog
        const existingDialog = document.querySelector('.user-guide-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

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
                    <div class="filter-container">
                        <div class="filter-buttons guide-filter-buttons">
                            <button class="filter-button all active" data-section="all">Overview</button>
                            <button class="filter-button" data-section="timer">Timer</button>
                            <button class="filter-button" data-section="sessions">Sessions</button>
                            <button class="filter-button" data-section="goals">Goals</button>
                            <button class="filter-button" data-section="media">Media</button>
                            <button class="filter-button" data-section="resources">Resources</button>
                            <button class="filter-button" data-section="settings">Settings</button>
                        </div>
                    </div>

                    <div class="guide-content">
                        <div class="section-overview visible" data-section="all">
                            <p><strong>PracticeTrack uses your browser's local storage to save your practice data directly on your device.</strong> This provides privacy and allows the app to work offline. For the best experience, it is recommended to add PracticeTrack to your mobile phone's home screen and use it consistently on the same device.</p>
                            
                            <div class="tip">
                                <h3>Add to Home Screen</h3>
                                <p><strong>On iPhone (Safari):</strong></p>
                                <ol class="steps">
                                    <li>Open PracticeTrack in Safari</li>
                                    <li>Tap the share icon (square with an arrow) at the bottom of the screen</li>
                                    <li>Scroll down and tap "Add to Home Screen"</li>
                                    <li>Name the shortcut "PracticeTrack" and tap "Add"</li>
                                </ol>
                                <p><strong>On Android (Chrome):</strong></p>
                                <ol class="steps">
                                    <li>Open PracticeTrack in Chrome</li>
                                    <li>Tap the three dots (⋮) menu in the top-right</li>
                                    <li>Tap "Add to Home screen"</li>
                                    <li>Confirm by tapping "Add"</li>
                                </ol>
                            </div>
                            
                            <div class="note">
                                <h3>Using on Multiple Devices</h3>
                                <p>If you want to use PracticeTrack on more than one device, you'll need to <strong>manually transfer your data</strong>:</p>
                                <ol class="steps">
                                    <li>On your primary device, go to Settings and use the "Export Data" button to save your data file</li>
                                    <li>Transfer this file to your secondary device (via email, cloud storage, etc.)</li>
                                    <li>On your secondary device, go to Settings and use the "Import Data" button to load the file</li>
                                </ol>
                            </div>

                            <h3>Getting Started</h3>
                            <ol class="steps">
                                <li>Set up your practice categories in the Settings tab</li>
                                <li>Configure your lesson day and time (optional)</li>
                                <li>Explore existing practice categories in the Resources tab</li>
                                <li>Create practice goals in the Goals tab (optional)</li>
                                <li>View practice statistics in the Stats tab</li>
                                <li>Create practice or lesson notes, or record photos or videos</li>
                            </ol>
                        </div>

                        <div class="section-timer" data-section="timer">
                            <h3>Using the Timer</h3>
                            <p>The timer is your main practice tool. Here's how to use it:</p>
                            <ol class="steps">
                                <li>Select a practice category from the dropdown menu (optional)</li>
                                <li>Click "Start" to begin your practice session</li>
                                <li>The timer will begin counting up, tracking your practice time</li>
                                <li>Use "Pause" to temporarily stop the timer</li>
                                <li>Click "Reset" to clear the timer and start over</li>
                                <li>Add notes about your practice session in the text area</li>
                                <li>When finished, click "Save Session" to record your practice time</li>
                            </ol>

                            <div class="note">
                                <h3>Note</h3>
                                <p>Your practice session is automatically saved when you click "Save Session." Don't forget to add notes about what you practiced before saving!</p>
                            </div>
                        </div>

                        <div class="section-sessions" data-section="sessions">
                            <h3>Tracking Your Sessions</h3>
                            <p>The Sessions tab allows you to view and manage your practice history:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>View History</h4>
                                    <p>Access all your past practice sessions with detailed information about each one.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Filter & Search</h4>
                                    <p>Filter sessions by category or date range, and search for specific practice content.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Delete Sessions</h4>
                                    <p>Remove practice sessions that were recorded incorrectly.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Manual Entry</h4>
                                    <p>Add practice sessions manually that you didn't track with the timer.</p>
                                </div>
                            </div>
                            
                            <div class="tip">
                                <h3>Pro Tip</h3>
                                <p>Use the "Add Session" button to manually add practice sessions you didn't track with the timer, such as practice you did away from your device.</p>
                            </div>
                        </div>

                        <div class="section-goals" data-section="goals">
                            <h3>Setting Goals</h3>
                            <p>The Goals tab helps you stay motivated by setting and tracking practice goals:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Create Goals</h4>
                                    <p>Set specific, measurable practice goals to work toward.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Target Dates</h4>
                                    <p>Assign deadlines to keep yourself accountable and on track.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Goal History</h4>
                                    <p>View a record of your past and current practice goals.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Mark Completed</h4>
                                    <p>Celebrate your achievements by marking goals as completed.</p>
                                </div>
                            </div>
                        </div>

                        <div class="section-media" data-section="media">
                            <h3>Tracking Media</h3>
                            <p>The Media tab allows you to document your progress visually and with notes:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Photos</h4>
                                    <p>Capture photos during practice to document technique or progress.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Videos</h4>
                                    <p>Record videos of your playing to review your form and sound.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Notes</h4>
                                    <p>Create text notes about techniques, insights, or feedback.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Organization</h4>
                                    <p>Tag and categorize your media for easy reference and retrieval.</p>
                                </div>
                            </div>
                            
                            <div class="note">
                                <h3>Note</h3>
                                <p>Photos and videos are saved to your device's gallery. PracticeTrack keeps track of their references to help you organize your progress documentation.</p>
                            </div>
                        </div>

                        <div class="section-resources" data-section="resources">
                            <h3>Practice Categories</h3>
                            <p>PracticeTrack uses categories to organize your practice sessions:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Browse Resources</h4>
                                    <p>Explore predefined categories by instrument family in the Resources tab.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Add Categories</h4>
                                    <p>Add categories to your personal list with just one click.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Custom Categories</h4>
                                    <p>Create your own practice categories, including specific songs, in the Settings tab.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Better Analysis</h4>
                                    <p>Categorize sessions for more detailed practice statistics.</p>
                                </div>
                            </div>
                            
                            <div class="tip">
                                <h3>Pro Tip</h3>
                                <p>Use the search function in the Resources tab to quickly find specific practice categories for your instrument.</p>
                            </div>
                        </div>

                        <div class="section-settings" data-section="settings">
                            <h3>Settings & Data Management</h3>
                            <p>The Settings tab allows you to customize PracticeTrack and manage your data:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Lesson Schedule</h4>
                                    <p>Set your regular lesson day and time for countdown display.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Categories</h4>
                                    <p>Create, edit, and organize your practice categories.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Export Data</h4>
                                    <p>Save your practice data for backup or transfer to another device.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Import Data</h4>
                                    <p>Load previously exported data to restore or sync between devices.</p>
                                </div>
                            </div>
                        </div>
                    </div>
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

        // Add tab navigation functionality
        const filterButtons = dialog.querySelectorAll('.guide-filter-buttons .filter-button');
        const sections = dialog.querySelectorAll('.guide-content > div[data-section]');

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to current button
                button.classList.add('active');
                
                // Hide all sections
                sections.forEach(section => section.classList.remove('visible'));
                
                // Show selected section
                const sectionName = button.getAttribute('data-section');
                if (sectionName === 'all') {
                    // Show only the overview section
                    dialog.querySelector('.section-overview').classList.add('visible');
                } else {
                    // Show the specific section
                    dialog.querySelector(`.section-${sectionName}`).classList.add('visible');
                }
            });
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
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // Make functions available globally
    return {
        showUserGuide,
        initialize
    };
})(); 