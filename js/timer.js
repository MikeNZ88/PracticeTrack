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
            
            console.log('Attempting to save session:', session);
            
            // Get existing sessions
            let sessions = [];
            try {
                const data = localStorage.getItem('practice_sessions');
                console.log('Raw localStorage data:', data);
                sessions = data ? JSON.parse(data) : [];
                console.log('Parsed sessions:', sessions);
            } catch (error) {
                console.error('Error getting existing sessions:', error);
                sessions = [];
            }
            
            // Add new session
            sessions.push(session);
            
            // Save back to localStorage
            try {
                const sessionsJson = JSON.stringify(sessions);
                console.log('Saving sessions to localStorage:', sessionsJson);
                localStorage.setItem('practice_sessions', sessionsJson);
                
                // Verify the save
                const savedData = localStorage.getItem('practice_sessions');
                console.log('Verified saved data:', savedData);
                
                if (!savedData) {
                    throw new Error('Failed to verify saved data');
                }
                
                console.log('Session saved successfully');
            } catch (error) {
                console.error('Error saving to localStorage:', error);
                throw error;
            }
            
            // Show success message
            this.saveButton.classList.add('success');
            setTimeout(() => {
                this.saveButton.classList.remove('success');
            }, 2000);

            // Reset after saving
            this.resetTimer();
            
            // Update sessions list if on sessions page
            const sessionsList = document.getElementById('sessions-list');
            if (sessionsList) {
                console.log('Updating sessions list...');
                // Create and append new session element
                const sessionElement = window.createSessionElement(session);
                if (sessionElement) {
                    // Insert at the beginning of the list
                    if (sessionsList.firstChild) {
                        sessionsList.insertBefore(sessionElement, sessionsList.firstChild);
                    } else {
                        sessionsList.appendChild(sessionElement);
                    }
                    // Update Lucide icons
                    if (window.lucide && window.lucide.createIcons) {
                        window.lucide.createIcons();
                    }
                }
            }
            
        } catch (error) {
            console.error('Error saving session:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack,
                timeElapsed: this.timeElapsed,
                categoryId: this.categorySelect.value,
                startTime: this.startTime
            });
            alert('Error saving session. Please try again.');
        }
    }

    resetTimer() {
        console.log('Resetting timer');
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.timeElapsed = 0;
        this.startTime = null;
        this.updateDisplay();
        this.updateButtonStates();
        this.categorySelect.disabled = false;
        this.categorySelect.value = '';
        this.sessionNotes.value = '';
    }

    // Format time in HH:MM:SS
    formatTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const remainingSeconds = seconds % 60;
        
        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    // Update timer display
    updateDisplay() {
        console.log('Updating display, timeElapsed:', this.timeElapsed);
        
        // Update timer display
        this.timerDisplay.textContent = this.formatTime(this.timeElapsed);
        
        // Update progress bar (completes one full cycle every minute)
        const progress = (this.timeElapsed % 60) / 60 * 100;
        this.progressBar.style.width = `${progress}%`;
        
        // Add visual feedback classes
        if (this.isRunning) {
            this.timerDisplay.classList.add('running');
            this.timerDisplay.classList.remove('paused');
        } else if (this.isPaused || this.timeElapsed > 0) {
            this.timerDisplay.classList.remove('running');
            this.timerDisplay.classList.add('paused');
        } else {
            this.timerDisplay.classList.remove('running', 'paused');
        }
    }

    // Load categories
    loadCategories() {
        try {
            console.log('Loading categories...');
            const allCategories = window.getItems('CATEGORIES') || [];
            console.log('Found categories:', allCategories.length);
            
            // Get current instrument from settings
            let settings = window.getItems('SETTINGS');
            settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
            const currentInstrument = settings.primaryInstrument || '';
            console.log('Current instrument:', currentInstrument);
            
            // Filter categories based on instrument
            const categories = allCategories.filter(category => {
                // Skip hidden categories - ensure this works correctly
                if (category.isHidden === true) {
                    console.log(`Filtering out hidden category: ${category.name}`);
                    return false;
                }
                
                // Include if it's a custom category (not default)
                if (!category.isDefault) return true;
                
                // Include if no instrument is selected
                if (!currentInstrument) return true;
                
                // Include if it has no instrumentIds property
                if (!category.instrumentIds) return true;
                
                // Include if the current instrument is in its instrumentIds
                return category.instrumentIds.includes(currentInstrument);
            });
            
            console.log(`Categories for instrument "${currentInstrument}":`, categories.length);
            console.log('Visible categories:', categories.map(c => c.name).join(', '));
            
            // Clear existing options
            while (this.categorySelect.firstChild) {
                this.categorySelect.removeChild(this.categorySelect.firstChild);
            }
            
            // Add default option
            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Select Practice Category';
            this.categorySelect.appendChild(defaultOption);
            
            // Add categories
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                this.categorySelect.appendChild(option);
            });
            
            console.log('Categories loaded successfully');
        } catch (error) {
            console.error('Error loading categories:', error);
            throw error;
        }
    }

    // Reset display
    resetDisplay() {
        console.log('Resetting display');
        this.timeElapsed = 0;
        this.isRunning = false;
        this.isPaused = false;
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
        this.updateDisplay();
        this.updateButtonStates();
        
        // Reset form elements
        if (this.categorySelect) this.categorySelect.value = '';
        if (this.sessionNotes) this.sessionNotes.value = '';
    }
}

// Create and export timer instance
window.timer = new Timer();

// Function to update timer categories from settings page
window.updateTimerCategories = function() {
    if (window.timer) {
        console.log('Refreshing timer categories from settings');
        window.timer.loadCategories();
    }
}; 