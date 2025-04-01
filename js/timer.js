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

            // Get settings for current instruments
            let settings = window.getItems('SETTINGS');
            settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
            const selectedInstruments = settings.instruments || [];
            
            if (!selectedInstruments.length) {
                alert('Please select at least one instrument in settings before recording a session');
                return;
            }
            
            // Get existing sessions
            let sessions = window.getItems('SESSIONS');
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
                updatedAt: new Date().toISOString(),
                instruments: selectedInstruments
            };
            
            console.log('New session:', session);
            
            // Add new session and save
            sessions.push(session);
            const saved = window.saveItems('SESSIONS', sessions);
            
            if (!saved) {
                throw new Error('Failed to save session');
            }
            
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
        console.log('Loading categories for timer');
        
        // Get settings for instruments
        let settings = window.getItems('SETTINGS');
        settings = Array.isArray(settings) && settings.length > 0 ? settings[0] : {};
        const selectedInstruments = settings.instruments || [];
        
        if (!selectedInstruments.length) {
            console.log('No instruments selected, adding default option');
            this.categorySelect.innerHTML = '<option value="">Select Practice Category</option>';
            return;
        }
        
        // Get all categories
        let categories = window.getItems('CATEGORIES');
        
        // Clear existing options except the first one
        while (this.categorySelect.options.length > 1) {
            this.categorySelect.remove(1);
        }
        
        // Group categories by instrument
        const categoriesByInstrument = {};
        selectedInstruments.forEach(instrumentId => {
            categoriesByInstrument[instrumentId] = categories.filter(cat => 
                cat.instrumentId === instrumentId
            );
        });
        
        // Add categories to select element
        selectedInstruments.forEach(instrumentId => {
            const instrumentCategories = categoriesByInstrument[instrumentId];
            if (instrumentCategories.length) {
                // Add instrument header
                const headerOption = document.createElement('option');
                headerOption.value = '';
                headerOption.disabled = true;
                headerOption.textContent = `--- ${window.AVAILABLE_INSTRUMENTS.find(i => i.id === instrumentId).name} ---`;
                this.categorySelect.appendChild(headerOption);
                
                // Add categories for this instrument
                instrumentCategories.forEach(category => {
                    const option = document.createElement('option');
                    option.value = category.id;
                    option.textContent = category.name;
                    this.categorySelect.appendChild(option);
                });
            }
        });
        
        console.log('Categories loaded successfully');
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
        
        // Get category name
        const categories = window.getItems('CATEGORIES');
        const category = categories.find(c => c.id === session.categoryId);
        const categoryName = category ? category.name : 'Unknown Category';
        
        // Get instrument names
        const instrumentNames = session.instruments
            .map(id => window.AVAILABLE_INSTRUMENTS.find(i => i.id === id)?.name)
            .filter(Boolean)
            .join(', ');
        
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
                    <span class="session-instruments">${instrumentNames}</span>
                </div>
                <div class="session-time">${duration}</div>
            </div>
            <div class="session-details">
                <div class="session-date">${dateStr} ${timeStr}</div>
                ${session.notes ? `<div class="session-notes">${session.notes}</div>` : ''}
            </div>
        `;
        
        return sessionElement;
    }
}

// Make Timer class available globally
window.Timer = Timer;

// Function to update timer categories from settings page
window.updateTimerCategories = function() {
    if (window.timer) {
        console.log('Refreshing timer categories from settings');
        window.timer.loadCategories();
    }
}; 