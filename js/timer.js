// Timer Component
class Timer {
    constructor() {
        // DOM Elements
        this.timerDisplay = document.querySelector('.timer-display');
        this.startButton = document.getElementById('start-timer');
        this.stopButton = document.getElementById('stop-timer');
        this.resetButton = document.getElementById('reset-timer');
        this.saveButton = document.getElementById('save-timer');
        this.progressBar = document.querySelector('.timer-progress');
        this.categorySelect = document.getElementById('practice-category');
        this.sessionNotes = document.getElementById('session-notes');
        
        // Timer state
        this.timeElapsed = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.timerInterval = null;
        this.startTime = null;
        
        // Initialize
        this.setupEventListeners();
        this.resetDisplay();
        this.loadCategories();
    }

    setupEventListeners() {
        // Start/Pause button
        this.startButton.addEventListener('click', () => {
            if (this.isRunning) {
                this.pauseTimer();
            } else {
                this.startTimer();
            }
        });

        // Stop button
        this.stopButton.addEventListener('click', () => {
            this.stopTimer();
        });

        // Reset button
        this.resetButton.addEventListener('click', () => {
            this.resetTimer();
        });

        // Save button
        this.saveButton.addEventListener('click', () => {
            this.saveSession();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            const isTypingElement = e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'SELECT';
            
            if (e.code === 'Space' && !e.repeat && !isTypingElement) {
                e.preventDefault();
                if (this.isRunning) {
                    this.pauseTimer();
                } else {
                    this.startTimer();
                }
            }
        });
        
        // Listen for category data changes
        document.addEventListener('dataChanged', (e) => {
            if (e.detail && e.detail.type === 'CATEGORIES') {
                this.loadCategories();
            }
        });
    }

    updateButtonStates() {
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
        
        // Show/hide Stop, Reset and Save buttons based on state
        this.stopButton.classList.toggle('hidden', this.timeElapsed === 0);
        this.resetButton.classList.toggle('hidden', this.timeElapsed === 0);
        this.saveButton.classList.toggle('hidden', this.timeElapsed === 0);
        
        // Update Lucide icons
        if (window.lucide && typeof window.lucide.createIcons === 'function') {
            window.lucide.createIcons();
        }
    }

    startTimer() {
        if (!this.isRunning) {
            if (!this.categorySelect.value) {
                alert('Please select a practice category');
                return;
            }
            
            this.isRunning = true;
            this.isPaused = false;
            if (!this.startTime) {
                this.startTime = new Date();
            }
            
            // Use local variable to ensure 'this' is captured correctly
            const self = this;
            this.timerInterval = setInterval(function() {
                self.timeElapsed++;
                self.updateDisplay();
            }, 1000);
            
            this.updateButtonStates();
            this.categorySelect.disabled = true;
            
            // Save timer state
            this.saveTimerState();
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            clearInterval(this.timerInterval);
            this.updateButtonStates();
            
            // Save timer state
            this.saveTimerState();
        }
    }

    stopTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.updateButtonStates();
        
        // Save timer state
        this.saveTimerState();
    }

    saveSession() {
        try {
            if (this.timeElapsed === 0) {
                alert('No practice time recorded. Start the timer first.');
                return;
            }

            if (!this.categorySelect.value) {
                alert('Please select a practice category');
                return;
            }

            // Create session object
            const session = {
                id: `session_${Date.now()}`,
                categoryId: this.categorySelect.value,
                startTime: this.startTime.toISOString(),
                duration: this.timeElapsed,
                notes: this.sessionNotes.value.trim(),
                createdAt: new Date().toISOString()
            };
            
            // Use data layer to save session
            if (window.addItem) {
                window.addItem('SESSIONS', session);
            } else {
                // Legacy localStorage fallback
                let sessions = [];
                try {
                    const storedSessions = localStorage.getItem('practiceTrack_sessions');
                    if (storedSessions) {
                        sessions = JSON.parse(storedSessions);
                    }
                } catch (e) {
                    console.error('Error reading sessions:', e);
                    sessions = [];
                }
                
                sessions.push(session);
                localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
            }
            
            // Show success notification
            if (window.showNotification) {
                window.showNotification('Session Saved', 'Your practice session has been saved successfully.');
            } else {
                alert('Practice session saved successfully');
            }
            
            // Reset timer
            this.resetTimer();
        } catch (error) {
            console.error('Error saving session:', error);
            alert('Failed to save session. Please try again.');
        }
    }

    saveTimerState() {
        try {
            const timerState = {
                timeElapsed: this.timeElapsed,
                isRunning: this.isRunning,
                isPaused: this.isPaused,
                startTime: this.startTime ? this.startTime.toISOString() : null,
                categoryId: this.categorySelect.value,
                notes: this.sessionNotes.value
            };
            
            // Save to localStorage
            localStorage.setItem('practiceTrack_timer', JSON.stringify(timerState));
        } catch (error) {
            console.error('Error saving timer state:', error);
        }
    }

    loadTimerState() {
        try {
            const storedState = localStorage.getItem('practiceTrack_timer');
            if (!storedState) return false;
            
            const timerState = JSON.parse(storedState);
            
            // Only restore if there was time recorded
            if (timerState.timeElapsed > 0) {
                this.timeElapsed = timerState.timeElapsed;
                this.isPaused = timerState.isPaused;
                this.startTime = timerState.startTime ? new Date(timerState.startTime) : null;
                
                if (timerState.categoryId) {
                    this.categorySelect.value = timerState.categoryId;
                    this.categorySelect.disabled = true;
                }
                
                if (timerState.notes) {
                    this.sessionNotes.value = timerState.notes;
                }
                
                this.updateDisplay();
                this.updateButtonStates();
                
                // Prompt to resume or discard
                if (confirm('Previous timer session found. Resume it?')) {
                    return true;
                } else {
                    this.resetTimer();
                    return false;
                }
            }
            
            return false;
        } catch (error) {
            console.error('Error loading timer state:', error);
            return false;
        }
    }

    resetTimer() {
        this.stopTimer();
        this.timeElapsed = 0;
        this.startTime = null;
        this.updateDisplay();
        this.updateButtonStates();
        this.categorySelect.disabled = false;
        this.sessionNotes.value = '';
        
        // Clear saved timer state
        localStorage.removeItem('practiceTrack_timer');
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
        // Clear existing options
        this.categorySelect.innerHTML = '';
        
        // Add default option
        const defaultOption = document.createElement('option');
        defaultOption.value = '';
        defaultOption.textContent = 'Select a category';
        this.categorySelect.appendChild(defaultOption);
        
        try {
            // Get categories from data layer
            const categories = window.getItems ? window.getItems('CATEGORIES') :
                JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
            
            // Add categories to dropdown
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                this.categorySelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading categories:', error);
        }
    }

    resetDisplay() {
        this.timerDisplay.textContent = '00:00:00';
        this.progressBar.style.width = '0%';
        this.updateButtonStates();
    }
}

// Initialize timer when page activates
function activateTimerPage() {
    if (!window.timer) {
        window.timer = new Timer();
    }
    
    // Check for saved timer state
    window.timer.loadTimerState();
}

// Make timer functionality available globally
window.activateTimerPage = activateTimerPage;

// Initialize when page changes to timer
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'timer') {
        activateTimerPage();
    }
});