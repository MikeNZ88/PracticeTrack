// Timer Component
class Timer {
    constructor() {
        console.log('Creating Timer instance');
        this.timerDisplay = document.querySelector('.timer-display');
        this.startButton = document.getElementById('start-timer');
        this.stopButton = document.getElementById('stop-timer');
        this.resetButton = document.getElementById('reset-timer');
        this.saveButton = document.getElementById('save-timer');
        this.progressBar = document.querySelector('.timer-progress');
        this.categorySelect = document.getElementById('practice-category');
        this.sessionNotes = document.getElementById('session-notes');
        
        this.timeElapsed = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.startTime = null;
        
        this.validateElements();
        this.setupEventListeners();
        this.resetDisplay();
        this.loadCategories();
        console.log('Timer instance created and initialized');
    }

    validateElements() {
        console.log('Validating DOM elements');
        const elements = {
            'timer-display': this.timerDisplay,
            'start-timer': this.startButton,
            'stop-timer': this.stopButton,
            'reset-timer': this.resetButton,
            'save-timer': this.saveButton,
            'timer-progress': this.progressBar,
            'practice-category': this.categorySelect,
            'session-notes': this.sessionNotes
        };

        for (const [id, element] of Object.entries(elements)) {
            if (!element) {
                console.error(`Missing required element: ${id}`);
                throw new Error(`Required element not found: ${id}`);
            }
        }
        console.log('All DOM elements validated successfully');
    }

    setupEventListeners() {
        console.log('Setting up event listeners');
        
        // Start/Pause button
        this.startButton.addEventListener('click', () => {
            console.log('Start/Pause button clicked');
            if (this.isRunning) {
                this.pauseTimer();
            } else {
                this.startTimer();
            }
        });

        // Stop button
        this.stopButton.addEventListener('click', () => {
            console.log('Stop button clicked');
            this.stopTimer();
        });

        // Reset button
        this.resetButton.addEventListener('click', () => {
            console.log('Reset button clicked');
            this.resetTimer();
        });

        // Save button
        this.saveButton.addEventListener('click', () => {
            console.log('Save button clicked');
            this.saveSession();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ignore spacebar shortcuts when focused on input elements to allow typing
            const isTypingElement = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
            
            if (e.code === 'Space' && !e.repeat && !isTypingElement) {
                e.preventDefault();
                if (this.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
            } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS' && !e.repeat) {
                e.preventDefault();
                this.saveSession();
            } else if ((e.ctrlKey || e.metaKey) && e.code === 'KeyR' && !e.repeat) {
                e.preventDefault();
                this.resetTimer();
            }
        });

        console.log('Event listeners setup complete');
    }

    updateButtonStates() {
        console.log('Updating button states');
        
        // Update Start/Pause/Resume button text and icon
        if (this.isRunning) {
            this.startButton.innerHTML = '<i data-lucide="pause"></i> Pause';
            this.startButton.classList.add('active');
        } else if (this.isPaused) {
            this.startButton.innerHTML = '<i data-lucide="play"></i> Resume';
            this.startButton.classList.remove('active');
        } else {
            this.startButton.innerHTML = '<i data-lucide="play"></i> Start';
            this.startButton.classList.remove('active');
        }
        
        // Always ensure the start button is visible
        this.startButton.classList.remove('hidden');
        
        // Show/hide Stop and Reset buttons based on state
        if (this.timeElapsed > 0) {
            this.stopButton.classList.remove('hidden');
            this.resetButton.classList.remove('hidden');
            this.saveButton.classList.remove('hidden');
        } else {
            this.stopButton.classList.add('hidden');
            this.resetButton.classList.add('hidden');
            this.saveButton.classList.add('hidden');
        }
        
        // Update Lucide icons
        lucide.createIcons();
        
        console.log('Button states updated:', {
            isRunning: this.isRunning,
            isPaused: this.isPaused,
            timeElapsed: this.timeElapsed
        });
    }

    startTimer() {
        if (!this.isRunning) {
            if (!this.categorySelect.value) {
                alert('Please select a practice category');
                return;
            }
            
            console.log('Starting timer');
            this.isRunning = true;
            this.isPaused = false;
            if (!this.startTime) {
                this.startTime = new Date();
            }
            this.timerInterval = setInterval(() => {
                this.timeElapsed++;
                this.updateDisplay();
            }, 1000);
            this.updateButtonStates();
            this.categorySelect.disabled = true;
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            console.log('Pausing timer');
            this.isRunning = false;
            this.isPaused = true;
            clearInterval(this.timerInterval);
            this.updateButtonStates();
        }
    }

    stopTimer() {
        console.log('Stopping timer');
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.updateButtonStates();
    }

    saveSession() {
        try {
            console.log('Starting session save...');
            if (this.timeElapsed === 0) {
                console.log('No time elapsed, preventing save');
                alert('No practice time recorded. Start the timer first.');
                return;
            }

            if (!this.categorySelect.value) {
                alert('Please select a practice category');
                return;
            }

            // Get existing sessions
            let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
            console.log('Current sessions:', sessions);
            
            // Create session object
            const session = {
                id: `s-${Date.now()}`,
                categoryId: this.categorySelect.value,
                startTime: this.startTime.toISOString(),
                duration: this.timeElapsed,
                notes: this.sessionNotes.value.trim(),
                isManual: false,
                isLesson: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            console.log('New session:', session);
            
            // Add new session and save
            sessions.push(session);
            localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
            
            console.log('Session saved successfully');
            
            // Show success message
            this.saveButton.classList.add('success');
            setTimeout(() => {
                this.saveButton.classList.remove('success');
            }, 2000);

            // Reset timer
            this.resetTimer();
            
            // Update sessions list if on sessions page
            const sessionsList = document.getElementById('sessions-list');
            if (sessionsList) {
                console.log('Updating sessions list...');
                // Create and append new session element
                const sessionElement = this.createSessionElement(session);
                sessionsList.insertBefore(sessionElement, sessionsList.firstChild);
            }
        } catch (error) {
            console.error('Error saving session:', error);
            alert('Failed to save session. Please try again.');
        }
    }

    resetTimer() {
        console.log('Resetting timer');
        this.stopTimer();
        this.timeElapsed = 0;
        this.startTime = null;
        this.updateDisplay();
        this.updateButtonStates();
        this.categorySelect.disabled = false;
        this.sessionNotes.value = '';
    }

    formatTime(seconds) {
        const hrs = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    updateDisplay() {
        this.timerDisplay.textContent = this.formatTime(this.timeElapsed);
        
        // Update progress bar
        const progress = (this.timeElapsed % 3600) / 3600 * 100;
        this.progressBar.style.width = `${progress}%`;
    }

    loadCategories() {
        console.log('Timer: Loading categories');
        
        // Use the correct property name - categorySelect
        this.categoryDropdown = this.categorySelect = document.getElementById('practice-category');
        
        if (!this.categorySelect) {
            console.error('Category dropdown not found');
            return;
        }
        
        // Clear existing options
        this.categorySelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a category';
        this.categorySelect.appendChild(defaultOption);
        
        try {
            // Get categories from storage
            let categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
            console.log('Timer: Retrieved categories:', categories);
            
            // If no categories exist, create default ones
            if (categories.length === 0) {
                console.log('Timer: No categories found, creating defaults');
                categories = [
                    { id: 'cat_warmup', name: 'Warm-up', custom: false },
                    { id: 'cat_technique', name: 'Technique', custom: false },
                    { id: 'cat_repertoire', name: 'Repertoire', custom: false },
                    { id: 'cat_sightreading', name: 'Sight-reading', custom: false },
                    { id: 'cat_theory', name: 'Theory', custom: false }
                ];
                localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
            }
            
            // Add categories to dropdown
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                this.categorySelect.appendChild(option);
            });
            
            console.log('Timer: Categories loaded successfully');
        } catch (error) {
            console.error('Timer: Error loading categories:', error);
        }
    }

    resetDisplay() {
        this.timerDisplay.textContent = '00:00:00';
        this.progressBar.style.width = '0%';
        this.updateButtonStates();
    }

    createSessionElement(session) {
        const sessionElement = document.createElement('div');
        sessionElement.className = 'session-item';
        sessionElement.dataset.id = session.id;
        
        try {
            // Get category name
            const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
            const category = categories.find(c => c.id === session.categoryId);
            const categoryName = category ? category.name : 'Unknown Category';
            
            // Format duration
            const duration = this.formatTime(session.duration);
            
            // Format date
            const date = new Date(session.startTime);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            
            sessionElement.innerHTML = `
                <div class="session-header">
                    <div class="session-title">
                        <span class="session-category">${categoryName}</span>
                    </div>
                    <div class="session-time">${duration}</div>
                </div>
                <div class="session-details">
                    <div class="session-date">${dateStr} ${timeStr}</div>
                    ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
                </div>
            `;
        } catch (error) {
            console.error('Error creating session element:', error);
            sessionElement.innerHTML = `<div class="session-error">Error displaying session</div>`;
        }
        
        return sessionElement;
    }
}

// Update timer categories from settings
function updateTimerCategories() {
    console.log('Refreshing timer categories from settings');
    if (window.timer && typeof window.timer.loadCategories === 'function') {
        window.timer.loadCategories();
    } else {
        console.error('Timer instance not found or loadCategories method not available');
    }
}

// Make function available globally
window.updateTimerCategories = updateTimerCategories;

// Listen for category changes
document.addEventListener('categoriesChanged', () => {
    console.log('Timer received categories changed event');
    if (window.timer && typeof window.timer.loadCategories === 'function') {
        window.timer.loadCategories();
    } else {
        console.error('Timer instance not found or loadCategories method not available');
    }
});

// Initialize timer
const initTimer = () => {
    try {
        console.log('Initializing timer...');
        
        // Ensure all required DOM elements are present
        const timerContainer = document.querySelector('.timer-container');
        const categorySelect = document.getElementById('practice-category');
        
        if (!timerContainer || !categorySelect) {
            console.error('Timer initialization failed: required DOM elements not found', {
                timerContainer: !!timerContainer,
                categorySelect: !!categorySelect
            });
            return;
        }
        
        // Initialize the Timer instance
        window.timer = new Timer();
        
        // Initialize the categories dropdown
        console.log('Initializing timer categories...');
        setTimeout(() => {
            if (window.timer) {
                window.timer.loadCategories();
                console.log('Timer categories initialized with delay');
            }
        }, 100);
        
        console.log('Timer initialized successfully');
    } catch (error) {
        console.error('Error initializing timer:', error);
    }
};

// Initialize timer when DOM is loaded and update categories
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing timer');
    initTimer();
});

// Re-initialize timer when navigating to timer page
window.activateTimerPage = function() {
    console.log('Activating timer page');
    if (!window.timer) {
        initTimer();
    } else {
        window.timer.loadCategories();
    }
};

// Make the Timer class and functions available globally
window.Timer = Timer;
window.initTimer = initTimer; 