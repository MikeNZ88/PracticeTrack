// User Guide Module
window.UserGuide = (function() {
    // Create and show the user guide dialog
    function showUserGuide() {
        console.log("[UserGuide] showUserGuide function called"); // Entry point
        
        // Remove any existing dialog
        const existingDialog = document.querySelector('.user-guide-dialog');
        if (existingDialog) {
            console.log("[UserGuide] Removing existing dialog.");
            existingDialog.remove();
        }

        console.log("[UserGuide] Creating new dialog container...");
        // Create dialog container
        const dialog = document.createElement('div');
        dialog.className = 'dialog user-guide-dialog';
        // Add explicit inline styles to ensure dialog appears correctly
        dialog.style.position = 'fixed !important';
        dialog.style.top = '0';
        dialog.style.left = '0';
        dialog.style.width = '100% !important';
        dialog.style.height = '100% !important';
        dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        dialog.style.display = 'flex !important';
        dialog.style.justifyContent = 'center';
        dialog.style.alignItems = 'center';
        dialog.style.zIndex = '9999 !important';
        dialog.style.opacity = '1 !important';
        dialog.style.visibility = 'visible !important';
        
        console.log("[UserGuide] Setting dialog innerHTML...");
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
                            <button class="filter-button" data-section="timer">Timer & Metronome</button>
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
                                <li>Set up your initial practice categories in the Settings tab</li>
                                <li>Configure your lesson day and time for the countdown (optional)</li>
                                <li>Explore predefined practice categories in the Resources tab and copy useful ones to your list</li>
                                <li>Set practice goals in the Goals tab (optional)</li>
                                <li>Track your practice using the Timer and Metronome</li>
                                <li>Review your practice history and progress in the Sessions and Stats tabs</li>
                                <li>Add photos, videos, or notes about your practice in the Media tab</li>
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

                            <h3>Using the Metronome</h3>
                            <p>A metronome is built into the Timer page to help you keep time:</p>
                            <ol class="steps">
                                <li>Adjust the Beats Per Minute (BPM) using the slider or +/- buttons</li>
                                <li>Select a common or complex time signature using the buttons</li>
                                <li>Choose a metronome sound (Click, Wood, Digital, Soft)</li>
                                <li>Click the "Start" button below the BPM control to start/stop the metronome</li>
                                <li>Visual beat indicators show the current beat and accent</li>
                            </ol>

                            <div class="note">
                                <h3>Note</h3>
                                <p>Your practice session is automatically saved when you click "Save Session." Don't forget to add notes about what you practiced before saving! The metronome runs independently of the main practice timer.</p>
                            </div>
                        </div>

                        <div class="section-sessions" data-section="sessions">
                            <h3>Tracking Your Sessions</h3>
                            <p>The Sessions tab allows you to view and manage your practice history:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>View History</h4>
                                    <p>Access your past practice sessions. By default, it shows sessions from "This Week".</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Filter & Search</h4>
                                    <p>Filter sessions by category or date range (using presets or custom dates), and search notes.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Edit & Delete</h4>
                                    <p>Correct mistakes by editing session details (category, notes) or remove sessions entirely.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Manual Entry</h4>
                                    <p>Use the "Add Session" button to log practice you didn't track with the timer.</p>
                                </div>
                            </div>
                            
                            <div class="tip">
                                <h3>Pro Tip</h3>
                                <p>Regularly review your session notes to reinforce learning and track progress over time.</p>
                            </div>
                        </div>

                        <div class="section-goals" data-section="goals">
                            <h3>Setting Goals</h3>
                            <p>The Goals tab helps you stay motivated by setting and tracking practice goals:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Create Goals</h4>
                                    <p>Set specific, measurable practice goals (e.g., "Master C Major scale at 120 bpm").</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Target Dates</h4>
                                    <p>Assign optional target dates to keep yourself accountable.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Categorize</h4>
                                    <p>Link goals to your practice categories for better organization.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Track Progress</h4>
                                    <p>Mark goals as completed as you achieve them.</p>
                                </div>
                            </div>
                        </div>

                        <div class="section-media" data-section="media">
                            <h3>Tracking Media</h3>
                            <p>The Media tab allows you to document your progress visually and with notes:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Photos</h4>
                                    <p>Capture photos (e.g., hand position, sheet music setup) using your device camera.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Videos</h4>
                                    <p>Record videos of your playing to review form and sound later.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Notes</h4>
                                    <p>Create standalone text notes for quick thoughts, feedback, or ideas.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Organization</h4>
                                    <p>Filter media by type or date range. Give items names and descriptions.</p>
                                </div>
                            </div>
                            
                            <div class="note">
                                <h3>Note</h3>
                                <p>Photos and videos are saved directly to your device's gallery or files. PracticeTrack only stores a reference, description, and timestamp.</p>
                            </div>
                        </div>

                        <div class="section-resources" data-section="resources">
                            <h3>Practice Resources</h3>
                            <p>The Resources tab provides a library of predefined practice categories:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Browse Categories</h4>
                                    <p>Explore structured categories organized by instrument family (Woodwinds, Brass, Guitar, etc.).</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Filter & Search</h4>
                                    <p>Use the filter buttons to show specific instrument families or search for keywords.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Add to Your List</h4>
                                    <p>Click the '+' button next to a category name to add it to your personal list in Settings.</p>
                                </div>
                                 <div class="feature-card">
                                    <h4>Difficulty Levels</h4>
                                    <p>Categories are tagged with suggested difficulty levels (Beginner, Intermediate, Advanced).</p>
                                </div>
                            </div>
                            
                            <div class="tip">
                                <h3>Pro Tip</h3>
                                <p>Use the Resources tab to quickly populate your category list with relevant techniques and concepts for your instrument.</p>
                            </div>
                        </div>

                        <div class="section-settings" data-section="settings">
                            <h3>Settings & Data Management</h3>
                            <p>The Settings tab allows you to customize PracticeTrack and manage your data:</p>
                            
                            <div class="feature-grid">
                                <div class="feature-card">
                                    <h4>Lesson Schedule</h4>
                                    <p>Set your lesson day/time to see a countdown on the Stats page.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Manage Categories</h4>
                                    <p>Create custom categories (like specific songs) or hide/show default/copied ones from dropdowns.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Export Data</h4>
                                    <p>Save all your sessions, goals, media references, and categories to a file for backup.</p>
                                </div>
                                <div class="feature-card">
                                    <h4>Import Data</h4>
                                    <p>Load data from an exported file to restore or sync between devices.</p>
                                </div>
                                 <div class="feature-card">
                                    <h4>Clear Data</h4>
                                    <p>Permanently delete all stored data (sessions, goals, etc.). Use with caution!</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        console.log("[UserGuide] Appending dialog to body...");
        // Add to document
        try {
            document.body.appendChild(dialog);
            console.log("[UserGuide] Dialog appended successfully.");
            
            // Make sure dialog is visible - redundant due to inline style but safe check
            dialog.style.display = 'flex';
            console.log("[UserGuide] Dialog display style set to flex.");

            // --- Explicitly make overview visible AFTER appending ---
            const overviewSection = dialog.querySelector('.guide-content > div[data-section="all"]');
            if (overviewSection) {
                overviewSection.classList.add('visible');
                console.log("[UserGuide] Explicitly added 'visible' class to overview section.");
            } else {
                console.warn("[UserGuide] Overview content section not found after appending dialog.");
            }
            // --- End explicit visibility fix ---

        } catch (appendError) {
            console.error("[UserGuide] Error appending dialog to body:", appendError);
            return; // Stop if appending fails
        }

        console.log("[UserGuide] Initializing Lucide icons inside dialog...");
        // Initialize Lucide icons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            try {
                window.lucide.createIcons({ context: dialog }); // Target context to dialog
                console.log("[UserGuide] Lucide icons initialized successfully.");
            } catch (err) {
                console.error("[UserGuide] Error initializing Lucide icons:", err);
                // Don't necessarily stop execution, dialog might still work without icons
            }
        } else {
            console.warn("[UserGuide] Lucide library not found.");
        }

        console.log("[UserGuide] Adding event listeners to dialog...");
        // Add close button functionality
        const closeButton = dialog.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                console.log("[UserGuide] Close button clicked.");
                dialog.remove();
            });
        } else {
            console.warn("[UserGuide] Close button not found in dialog.");
        }

        // Add click outside to close
        dialog.addEventListener('click', (event) => {
            if (event.target === dialog) {
                console.log("[UserGuide] Dialog backdrop clicked.");
                dialog.remove();
            }
        });

        // Add tab navigation functionality
        const filterButtons = dialog.querySelectorAll('.guide-filter-buttons .filter-button');
        const contentSections = dialog.querySelectorAll('.guide-content > div[data-section]');

        if (filterButtons.length > 0 && contentSections.length > 0) {
            filterButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const targetSection = button.dataset.section;
                    console.log(`[UserGuide] Filter button clicked: ${targetSection}`);
                    // Update button active state
                    filterButtons.forEach(btn => btn.classList.remove('active'));
                    button.classList.add('active');

                    // Show/Hide content sections
                    contentSections.forEach(section => {
                        section.classList.toggle('visible', section.dataset.section === targetSection || targetSection === 'all');
                    });
                });
            });
            console.log("[UserGuide] Filter button listeners added.");
        } else {
            console.warn("[UserGuide] Filter buttons or content sections not found for listeners.");
        }
        
        // Close dialog on escape key
        const closeOnEscape = (e) => {
            if (e.key === 'Escape') {
                console.log("[UserGuide] Escape key pressed.");
                const currentDialog = document.querySelector('.user-guide-dialog'); // Re-query in case of issues
                if (currentDialog) {
                    currentDialog.remove();
                }
                document.removeEventListener('keydown', closeOnEscape);
            }
        };
        document.addEventListener('keydown', closeOnEscape);
        // Store the listener reference to be able to remove it if dialog is closed by other means
        dialog.dataset.escapeListenerAttached = 'true'; 

        console.log("[UserGuide] showUserGuide function finished.");
    }

    // Create and show the "How to Practice" dialog
    function showHowToPracticeGuide() {
        console.log("showHowToPracticeGuide function called");
        // Remove any existing dialog
        const existingDialog = document.querySelector('.how-to-practice-dialog');
        if (existingDialog) {
            existingDialog.remove();
        }

        // Create dialog container
        const dialog = document.createElement('div');
        dialog.className = 'dialog how-to-practice-dialog'; // Use a specific class
        // Add explicit inline styles to ensure dialog appears correctly
        dialog.style.position = 'fixed';
        dialog.style.top = '0';
        dialog.style.left = '0';
        dialog.style.width = '100%';
        dialog.style.height = '100%';
        dialog.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        dialog.style.display = 'flex';
        dialog.style.justifyContent = 'center';
        dialog.style.alignItems = 'center';
        dialog.style.zIndex = '9999';
        
        const guideContentHTML = `
            <h3>General Practice Principles</h3>
            <ul>
                <li>
                    <strong>Have clear objectives:</strong> 
                    Know what you want to improve in each session, even if it's broad (e.g., smoother transitions, better tone, learn section A). This focuses your effort.
                </li>
                <li>
                    <strong>Warm up properly:</strong> 
                    Prepare your body and instrument. Gentle exercises, scales, or light technical work prevent injury and improve focus.
                </li>
                <li>
                    <strong>Focus on challenges & practice slowly:</strong> 
                    Isolate difficult passages. Slow down drastically, focusing on accuracy and clean execution before gradually increasing tempo. Accuracy first, speed later.
                </li>
                 <li>
                    <strong>Use "Chunking":</strong> 
                    Break down complex pieces or exercises into smaller, manageable sections (chunks). Master each chunk before connecting them.
                </li>
                <li>
                    <strong>Use a metronome:</strong> 
                    Develop solid timing and rhythm. Use it consistently for scales, exercises, and challenging sections of pieces.
                </li>
                <li>
                    <strong>Record and listen/watch back:</strong> 
                    Use the Media tab to record yourself. Objective feedback helps identify issues you might not notice while playing. Reviewing past recordings over time can also clearly show your progress.
                </li>
                <li>
                    <strong>Practice consistently:</strong> 
                    Regular, focused sessions (even shorter ones) are more effective than infrequent marathon sessions. Build a routine.
                </li>
            </ul>
            <h3>Structuring a Session (Example Percentages)</h3>
            <p>This is just a sample structure. Adapt it to your needs:</p>
            <ol>
                <li><strong>Warm-up (~10-15%):</strong> Physical preparation, simple scales, long tones.</li>
                <li><strong>Technique (~25-30%):</strong> Focused exercises (scales, arpeggios, specific techniques) targeting areas for improvement.</li>
                <li><strong>Repertoire (~35-45%):</strong> Work on pieces. Apply technical skills, focus on musicality, use chunking for difficult parts.</li>
                <li><strong>Sight-Reading/Improvisation/Theory (~10-15%):</strong> Develop related musical skills. Choose one area per session or rotate.</li>
                <li><strong>Cool-down/Review (~5-10%):</strong> Play something enjoyable, review what you worked on, make notes for next session.</li>
            </ol>
            <p><em>Remember: Quality of focus is more important than just logging hours. Use PracticeTrack to guide mindful, effective practice!</em></p>
        `;

        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <h2>How to Practice Effectively</h2>
                    <button class="close-button">
                        <i data-lucide="x"></i>
                    </button>
                </div>
                <div class="dialog-body">
                    ${guideContentHTML} 
                </div>
            </div>
        `;

        // Append to body and show
        document.body.appendChild(dialog);
        // Explicitly set display style
        dialog.style.display = 'flex'; // Show the dialog

        // Add close functionality
        const closeButton = dialog.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                dialog.remove();
            });
        }
        
        dialog.addEventListener('click', (e) => {
            if (e.target === dialog) { // Close if backdrop is clicked
                dialog.remove();
            }
        });
        
        // Add Escape key listener
        document.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                dialog.remove();
                document.removeEventListener('keydown', closeOnEscape);
            }
        });

        // Initialize icons
        if (window.lucide) {
            try {
                window.lucide.createIcons({ context: dialog });
            } catch (err) {
                console.error("Error initializing Lucide icons:", err);
            }
        }
    }

    // Function to initialize the guide button
    function initialize() {
        console.log("Initializing User Guide Module...");
        const userGuideButton = document.getElementById('show-user-guide');
        const howToPracticeButton = document.getElementById('show-how-to-practice');
        const timerHowToUseButton = document.getElementById('timer-how-to-use-button');
        const resourcesHowToUseBtn = document.getElementById('resources-how-to-use-btn');
        const howToPracticeBtn = document.getElementById('how-to-practice-btn');

        // Helper function to add listener only once
        const addListenerOnce = (button, handlerFn) => {
            if (button && !button.dataset.listenerAdded) {
                button.addEventListener('click', handlerFn);
                button.dataset.listenerAdded = 'true';
                console.log(`Listener added to button: #${button.id}`);
            } else if (button) {
                console.log(`Listener already present on button: #${button.id}`);
            }
        };

        // Add listeners using the helper
        addListenerOnce(userGuideButton, (event) => {
            event.preventDefault(); 
            showUserGuide();
        });

        addListenerOnce(timerHowToUseButton, (event) => {
            event.preventDefault(); 
            showUserGuide(); // Open the same guide
        });

        addListenerOnce(resourcesHowToUseBtn, (event) => {
            event.preventDefault();
            showUserGuide(); // Open the same guide
            console.log("Resources How To Use button clicked");
        });

        addListenerOnce(howToPracticeBtn, (event) => {
            event.preventDefault();
            showHowToPracticeGuide();
            console.log("How To Practice button clicked");
        });

        addListenerOnce(howToPracticeButton, (event) => {
            event.preventDefault(); 
            showHowToPracticeGuide();
        });

        console.log("User Guide Module initialization attempt complete.");
    }

    console.log("[DEBUG UserGuide] UserGuide module fully defined, attaching to window.");

    // Expose public functions
    return {
        initialize,
        showUserGuide,
        showHowToPracticeGuide
    };
})();

// REMOVED: Initialize the guide when the DOM is ready
// document.addEventListener('DOMContentLoaded', window.UserGuide.initialize); 