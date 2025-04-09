// Timer Component
class Timer {
    constructor() {
        // DOM Elements
        this.timerDigits = document.querySelector('.timer-digits');
        this.timerStatus = document.querySelector('.timer-status');
        this.timerDisplayContainer = document.querySelector('.timer-display-container');
        this.startButton = document.getElementById('start-timer');
        this.resetButton = document.getElementById('reset-timer');
        this.saveButton = document.getElementById('save-timer');
        this.outerProgress = document.querySelector('.outer-progress');
        this.innerProgress = document.querySelector('.inner-progress');
        this.categorySelect = document.getElementById('practice-category');
        this.goalSelect = document.getElementById('timer-goal-select');
        this.sessionNotes = document.getElementById('session-notes');

        // SVG elements for icons
        this.playIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>';
        this.pauseIconSVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>';

        // SVG circle measurements
        this.outerCircumference = 2 * Math.PI * 50;
        this.innerCircumference = 2 * Math.PI * 35;

        // Set initial stroke-dasharray values for progress circles
        this.outerProgress.setAttribute('stroke-dasharray', this.outerCircumference);
        this.innerProgress.setAttribute('stroke-dasharray', this.innerCircumference);

        // Timer state
        this.timeElapsed = 0;
        this.timeWhenPaused = 0;
        this.isRunning = false;
        this.isPaused = false;
        this.sessionSaved = false;
        this.timerInterval = null;
        this.startTime = null;

        // Initialize
        this.setupEventListeners();
        this.resetDisplay();
        this.loadCategories();
        this.loadGoals();
    }

    setupEventListeners() {
        this.startButton.addEventListener('click', () => {
            if (this.isRunning) {
                this.pauseTimer();
            } else {
                this.startTimer();
            }
        });

        this.resetButton.addEventListener('click', () => {
            this.resetTimer();
        });

        this.saveButton.addEventListener('click', () => {
            this.saveSession();
        }, true);

        // Goal select listener to auto-set category
        this.goalSelect.addEventListener('change', (event) => {
            const goalId = event.target.value;
            if (goalId) {
                // Fetch goal data
                const goal = window.getItemById ? window.getItemById('GOALS', goalId) : null;
                if (goal && goal.categoryId) {
                    console.log(`Goal selected: ${goal.title}. Setting category to ID: ${goal.categoryId}`);
                    this.categorySelect.value = goal.categoryId;
                    this.categorySelect.disabled = true; // Disable category select when goal is chosen
                } else {
                    console.warn(`Could not find goal or categoryId for goalId: ${goalId}. Allowing manual category selection.`);
                    this.categorySelect.value = ''; // Reset category if goal lookup fails
                    this.categorySelect.disabled = false; // Ensure category select is enabled
                }
            } else {
                // No goal selected, enable category selection
                console.log("No goal selected. Enabling category dropdown.");
                this.categorySelect.disabled = false;
            }
        });

        document.addEventListener('keydown', (e) => {
            const activeElement = document.activeElement;
            const isTyping = activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable;

            if (e.code === 'Space' && !e.repeat && !isTyping) {
                e.preventDefault();
                // Toggle timer only if the focus is not on a button or select
                if (!['BUTTON', 'SELECT'].includes(activeElement.tagName)) {
                    if (this.isRunning) {
                        this.pauseTimer();
                    } else {
                        this.startTimer();
                    }
                }
            }
        });

        document.addEventListener('dataChanged', (e) => {
            console.log('[DEBUG Timer] dataChanged event received:', e.detail); // Log event detail
            if (e.detail && e.detail.type === 'CATEGORIES') {
                console.log('[DEBUG Timer] dataChanged for CATEGORIES, calling this.loadCategories()');
                // Add back optimization check before calling load
                if (!this.categorySelect || this.categorySelect.options.length <= 1) {
                     this.loadCategories();
                } else {
                     console.log('[DEBUG Timer] Skipping loadCategories as dropdown already populated.')
                }
            }
            if (e.detail && e.detail.type === 'GOALS') {
                console.log('[DEBUG Timer] dataChanged for GOALS, calling this.loadGoals()');
                // Add back optimization check before calling load
                if (!this.goalSelect || this.goalSelect.options.length <= 1) {
                     this.loadGoals();
                } else {
                     console.log('[DEBUG Timer] Skipping loadGoals as dropdown already populated.')
                }
            }
        });
    }

    updateButtonStates() {
        const startButtonSpan = this.startButton.querySelector('span');

        if (this.isRunning) {
            this.startButton.innerHTML = `${this.pauseIconSVG} <span>Pause</span>`;
            this.startButton.classList.add('pause-state');
            this.timerDisplayContainer.classList.remove('paused');
            this.timerStatus.textContent = 'Running';
        } else if (this.isPaused) {
            this.startButton.innerHTML = `${this.playIconSVG} <span>Resume</span>`;
            this.startButton.classList.remove('pause-state');
            this.timerDisplayContainer.classList.add('paused');
            this.timerStatus.textContent = 'Paused';
        } else {
            this.startButton.innerHTML = `${this.playIconSVG} <span>Start</span>`;
            this.startButton.classList.remove('pause-state');
            this.timerDisplayContainer.classList.remove('paused');
            this.timerStatus.textContent = 'Ready';
        }

        // Show/hide Reset and Save buttons
        const showSecondaryButtons = this.timeElapsed > 0;
        this.resetButton.classList.toggle('hidden', !showSecondaryButtons);
        this.saveButton.classList.toggle('hidden', !showSecondaryButtons || this.isRunning || this.sessionSaved);

        // Re-enable save button if reset and not running
        if (!this.isRunning && this.timeElapsed > 0 && this.sessionSaved) {
            this.saveButton.disabled = true;
            this.saveButton.textContent = 'Saved!';
        } else if (!this.isRunning && this.timeElapsed > 0) {
            this.saveButton.disabled = false;
            this.saveButton.textContent = 'Save Session';
        }

        // Enable/Disable category select, goal select, and notes
        const inputsDisabled = this.isRunning || this.isPaused;
        console.log(`[DEBUG Timer UpdateState] isRunning: ${this.isRunning}, isPaused: ${this.isPaused} => inputsDisabled: ${inputsDisabled}`);
        this.categorySelect.disabled = inputsDisabled;
        this.goalSelect.disabled = inputsDisabled;
        this.sessionNotes.disabled = inputsDisabled;
    }

    startTimer() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.isPaused = false;
            if (!this.startTime) {
                this.startTime = new Date();
            }

            const self = this;
            this.timerInterval = setInterval(() => {
                self.timeElapsed++;
                self.updateDisplay();
            }, 1000);

            this.updateButtonStates();
            this.saveTimerState();
        }
    }

    pauseTimer() {
        if (this.isRunning) {
            this.isRunning = false;
            this.isPaused = true;
            clearInterval(this.timerInterval);
            this.timeWhenPaused = this.timeElapsed;
            this.updateButtonStates();
            this.saveTimerState();
        }
    }

    resetTimer() {
        this.isRunning = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.timeElapsed = 0;
        this.timeWhenPaused = 0;
        this.startTime = null;
        this.sessionSaved = false;

        this.resetDisplay();
        this.updateButtonStates();
        this.saveTimerState();
        this.sessionNotes.value = '';
        this.categorySelect.value = '';
        this.goalSelect.value = '';
        this.categorySelect.disabled = false;
        this.goalSelect.disabled = false;
        this.sessionNotes.disabled = false;
        console.log('Timer reset.');
    }

    saveSession() {
        if (this.timeElapsed <= 0) {
            alert('Timer has not been started yet.');
            return;
        }

        let categoryId = null;
        const goalId = this.goalSelect.value || null;

        // Determine categoryId based on goal selection first
        if (goalId) {
            const goal = window.getItemById ? window.getItemById('GOALS', goalId) : null;
            if (goal && goal.categoryId) {
                categoryId = goal.categoryId;
                console.log(`Saving session linked to goal. Using goal's categoryId: ${categoryId}`);
            } else {
                console.warn(`Could not find categoryId for selected goal ${goalId}. Category will be null.`);
                // categoryId remains null
            }
        } else {
            // No goal selected, use the category dropdown value (which is optional)
            categoryId = this.categorySelect.value || null;
            console.log(`Saving session without specific goal. Using category dropdown value: ${categoryId}`);
        }

        const sessionData = {
            id: `session_${Date.now()}`,
            categoryId: categoryId, // Use the determined categoryId
            goalId: goalId, 
            startTime: this.startTime ? this.startTime.toISOString() : new Date(Date.now() - this.timeElapsed).toISOString(),
            duration: Math.round(this.timeElapsed / 1000),
            notes: this.sessionNotes.value.trim(),
            createdAt: new Date().toISOString()
        };

        try {
            if (window.addItem) {
                window.addItem('SESSIONS', sessionData);
            } else {
                console.warn('Data layer function addItem not found. Saving session to localStorage directly.');
                let sessions = JSON.parse(localStorage.getItem('practiceTrack_sessions')) || [];
                sessions.push(sessionData);
                localStorage.setItem('practiceTrack_sessions', JSON.stringify(sessions));
            }
            
            console.log('Session saved:', sessionData);
            this.sessionSaved = true;
            this.saveButton.textContent = 'Saved!';
            this.saveButton.disabled = true;
            alert('Practice session saved successfully!');

        } catch (error) {
            console.error('Error saving session:', error);
            alert('Error saving session. Please try again.');
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
                goalId: this.goalSelect.value,
                notes: this.sessionNotes.value
            };
            localStorage.setItem('practiceTrack_timerState', JSON.stringify(timerState));
        } catch (error) {
            console.error('Error saving timer state:', error);
        }
    }

    loadTimerState() {
        try {
            const storedState = localStorage.getItem('practiceTrack_timerState');
            console.log('[DEBUG Timer LoadState] Raw state from localStorage:', storedState);
            if (storedState) {
                const timerState = JSON.parse(storedState);
                console.log('[DEBUG Timer LoadState] Parsed state:', timerState);

                this.timeElapsed = timerState.timeElapsed || 0;
                this.isPaused = timerState.isPaused || false;
                this.startTime = timerState.startTime ? new Date(timerState.startTime) : null;

                // Remove setting dropdown values from saved state
                // if (timerState.categoryId) {
                //     this.categorySelect.value = timerState.categoryId;
                // }
                // if (timerState.goalId) {
                //     this.goalSelect.value = timerState.goalId;
                // }

                // Restore notes only
                if (timerState.notes) {
                    this.sessionNotes.value = timerState.notes;
                }

                // Don't auto-start, just restore state and let user decide
                this.updateDisplay();

                // If it was running, treat it as paused on reload
                if (!this.isPaused && timerState.isRunning) { 
                    console.log("[DEBUG Timer LoadState] Timer was running on last save, setting to paused state.");
                    this.isPaused = true;
                    this.isRunning = false;
                }
                
                console.log('[DEBUG Timer LoadState] Calling updateButtonStates after loading and adjusting state.');
                this.updateButtonStates(); 
            }
        } catch (error) {
            console.error('Error loading timer state:', error);
            localStorage.removeItem('practiceTrack_timerState');
        }
    }

    updateDisplay() {
        const hours = Math.floor(this.timeElapsed / 3600);
        const minutes = Math.floor((this.timeElapsed % 3600) / 60);
        const seconds = this.timeElapsed % 60;
        this.timerDigits.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        this.updateProgressCircles();
    }

    updateProgressCircles() {
        const minuteProgress = (this.timeElapsed % 3600) / 3600;
        const outerOffset = this.outerCircumference * (1 - minuteProgress);
        this.outerProgress.style.strokeDashoffset = outerOffset;

        const hourProgress = Math.min(this.timeElapsed / 3600, 1); // Cap at 1 (1 hour)
        const innerOffset = this.innerCircumference * (1 - hourProgress);
        this.innerProgress.style.strokeDashoffset = innerOffset;
    }

    resetDisplay() {
        this.timerDigits.textContent = '00:00:00';
        this.outerProgress.style.strokeDashoffset = this.outerCircumference;
        this.innerProgress.style.strokeDashoffset = this.innerCircumference;
        this.updateButtonStates(); // Reflect reset state in buttons/UI
    }

    loadCategories() {
        const currentValue = this.categorySelect.value;
        while (this.categorySelect.options.length > 1) {
            this.categorySelect.remove(1);
        }
        let categories = [];
        try {
            let categories = window.getItems ? window.getItems('CATEGORIES') : 
                JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];

            // Filter out invalid categories before sorting
            const validCategories = categories.filter(cat => cat && typeof cat.name === 'string');

            validCategories.sort((a, b) => a.name.localeCompare(b.name));

            validCategories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                this.categorySelect.appendChild(option);
            });
            this.categorySelect.value = currentValue;
        } catch (error) {
            console.error("Error loading categories into timer dropdown:", error);
        }
    }

    loadGoals() {
        const currentValue = this.goalSelect.value;
        while (this.goalSelect.options.length > 1) {
            this.goalSelect.remove(1);
        }
        let goals = [];
        try {
            let goals = window.getItems ? window.getItems('GOALS') : 
                JSON.parse(localStorage.getItem('practiceTrack_goals')) || [];

            // Filter out invalid goals before sorting (assuming goals have a .title)
            const validGoals = goals.filter(goal => goal && typeof goal.title === 'string');

            // Sort active goals by title
            validGoals.sort((a, b) => a.title.localeCompare(b.title));

            validGoals.forEach(goal => {
                const option = document.createElement('option');
                option.value = goal.id;
                option.textContent = goal.title.length > 50 ? goal.title.substring(0, 47) + '...' : goal.title;
                option.title = goal.title;
                this.goalSelect.appendChild(option);
            });
            this.goalSelect.value = currentValue;
        } catch (error) {
            console.error("Error loading goals into timer dropdown:", error);
        }
    }
}

// Global instance
let timerInstance = null;

// Function called when navigating TO the timer page
function activateTimerPage() {
    console.log("[DEBUG Timer] Activating Timer Page...");
    if (!timerInstance) {
        console.log("[DEBUG Timer] Creating new Timer instance...");
        timerInstance = new Timer();
        timerInstance.loadTimerState(); // Load state when created
    } else {
        console.log("[DEBUG Timer] Timer instance already exists. Loading state and categories/goals...");
        timerInstance.loadTimerState(); // Ensure state is loaded if returning to page
        timerInstance.loadCategories(); // Reload categories in case they changed
        timerInstance.loadGoals(); // Reload goals in case they changed
        timerInstance.updateButtonStates(); // Update button states based on loaded state
    }

    // Ensure the User Guide listeners (including the timer page button) are initialized
    // This needs to happen *after* the page is active and the button exists
    if (window.UserGuide && typeof window.UserGuide.initialize === 'function') {
        console.log("[DEBUG Timer] Calling UserGuide.initialize() for timer page activation.");
        window.UserGuide.initialize();
    } else {
        console.warn("[DEBUG Timer] UserGuide module or initialize function not found during timer activation.");
    }

    console.log("[DEBUG Timer] Timer Page activation complete.");
}

// Make activation function available globally
window.activateTimerPage = activateTimerPage;

// Listen for page changes to activate
document.addEventListener('pageChanged', (e) => {
    if (e.detail === 'timer') {
        activateTimerPage();
    }
});

/**
 * Show timer dialog for adding/editing
 * @param {string} timerId - Optional timer ID for editing
 */
function showTimerDialog(timerId) {
    // Get timer data if editing
    let timerData = null;
    
    if (timerId) {
        timerData = window.getItemById ? window.getItemById('TIMERS', timerId) : 
            (JSON.parse(localStorage.getItem('practiceTrack_timers')) || [])
                .find(t => t.id === timerId);
    }
    
    // Get categories for dropdown
    const categories = window.getItems ? window.getItems('CATEGORIES') : 
        JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    const categoryOptions = categories.map(cat => ({
        value: cat.id,
        text: cat.name
    }));
    
    // Set up form fields
    const fields = [
        {
            type: 'text',
            id: 'timer-name',
            label: 'Timer Name',
            required: true,
            value: timerData ? timerData.name : ''
        },
        {
            type: 'select',
            id: 'timer-category',
            label: 'Category',
            required: false,
            options: categoryOptions,
            value: timerData ? timerData.categoryId : ''
        },
        {
            type: 'number',
            id: 'timer-duration',
            label: 'Duration (minutes)',
            required: true,
            min: 1,
            value: timerData ? timerData.duration / 60 : ''
        },
        {
            type: 'textarea',
            id: 'timer-notes',
            label: 'Notes',
            rows: 4,
            value: timerData ? timerData.notes || '' : ''
        }
    ];
    
    // Create dialog using UI framework
    timerDialog = window.UI.createStandardDialog({
        title: timerId ? 'Edit Timer' : 'Add New Timer',
        fields: fields,
        onSubmit: (dialog, e) => handleTimerFormSubmit(dialog, e, timerId),
        onCancel: (dialog) => dialog.close(),
        submitButtonText: 'Save Timer',
        cancelButtonText: 'Cancel'
    });
    
    // Show dialog
    timerDialog.showModal();
}

/**
 * Handle timer form submission
 * @param {HTMLElement} dialog - The dialog element
 * @param {Event} e - The submit event
 * @param {string} timerId - Optional timer ID for editing
 */
function handleTimerFormSubmit(dialog, e, timerId) {
    try {
        const form = e.target;
        const nameInput = form.querySelector('#timer-name');
        const categorySelect = form.querySelector('#timer-category');
        const durationInput = form.querySelector('#timer-duration');
        const notesInput = form.querySelector('#timer-notes');
        
        // Validate inputs - only name and duration are required
        if (!nameInput || !nameInput.value || !durationInput || !durationInput.value) {
            alert('Please enter the timer name and duration');
            return;
        }
        
        // Create timer object
        const timerData = {
            id: timerId || `timer_${Date.now()}`,
            name: nameInput.value.trim(),
            categoryId: categorySelect ? categorySelect.value : null,
            duration: parseInt(durationInput.value) * 60, // Convert minutes to seconds
            notes: notesInput ? notesInput.value.trim() : '',
            createdAt: new Date().toISOString()
        };
        
        // Save timer using the data layer
        if (window.addItem && window.updateItem) {
            if (timerId) {
                window.updateItem('TIMERS', timerId, timerData);
            } else {
                window.addItem('TIMERS', timerData);
            }
        } else {
            // Legacy localStorage handling
            let timers = [];
            try {
                const stored = localStorage.getItem('practiceTrack_timers');
                if (stored) {
                    timers = JSON.parse(stored);
                }
            } catch (e) {
                console.error('Error reading timers:', e);
                timers = [];
            }
            
            if (timerId) {
                // Update existing timer
                const index = timers.findIndex(t => t.id === timerId);
                if (index !== -1) {
                    timers[index] = timerData;
                }
            } else {
                // Add new timer
                timers.push(timerData);
            }
            
            // Save to localStorage
            localStorage.setItem('practiceTrack_timers', JSON.stringify(timers));
        }
        
        // Close dialog
        dialog.close();
        
        // Reload timers list
        window.UI.loadRecords('timers', {
            recordType: 'TIMERS',
            createRecordElementFn: createTimerElement
        });
        
    } catch (error) {
        console.error('Error saving timer:', error);
        alert('There was an error saving the timer.');
    }
}