/**
 * Practice Categories Module
 * Manages the practice categories library and copying functionality
 */

// DOM Elements
let practiceCategoriesList;
let searchInput;
let instrumentFilter;
let copyDialog;
let copyDialogName;
let copyDialogDescription;
let copyDialogDifficulty;
let copyDialogNotes;

// Practice categories data
const practiceCategories = [
    {
        id: 'pc_1',
        name: 'Scales and Arpeggios',
        description: 'Practice major and minor scales, arpeggios, and broken chords in all keys.',
        difficulty: 'Beginner',
        notes: 'Start with C major and gradually add more keys. Focus on evenness and accuracy.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_2',
        name: 'Sight Reading',
        description: 'Practice reading new music at first sight without prior preparation.',
        difficulty: 'Intermediate',
        notes: 'Use appropriate level material. Focus on rhythm and pitch accuracy.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_3',
        name: 'Ear Training',
        description: 'Develop ability to identify intervals, chords, and melodies by ear.',
        difficulty: 'Beginner',
        notes: 'Start with simple intervals and progress to more complex exercises.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_4',
        name: 'Technique Exercises',
        description: 'Specific exercises to improve technical skills and dexterity.',
        difficulty: 'Intermediate',
        notes: 'Focus on proper form and gradually increase speed and complexity.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_5',
        name: 'Repertoire Practice',
        description: 'Work on pieces from your current repertoire.',
        difficulty: 'All Levels',
        notes: 'Break down difficult sections and practice with various techniques.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_6',
        name: 'Improvisation',
        description: 'Practice creating music spontaneously within given parameters.',
        difficulty: 'Advanced',
        notes: 'Start with simple chord progressions and gradually add complexity.',
        instrumentIds: ['piano', 'guitar', 'violin', 'trumpet', 'bass']
    },
    {
        id: 'pc_7',
        name: 'Theory Study',
        description: 'Learn and apply music theory concepts.',
        difficulty: 'All Levels',
        notes: 'Combine theoretical knowledge with practical application.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_8',
        name: 'Rhythm Practice',
        description: 'Focus on developing rhythmic accuracy and complexity.',
        difficulty: 'Beginner',
        notes: 'Use metronome and gradually increase tempo and complexity.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_9',
        name: 'Performance Practice',
        description: 'Simulate performance conditions and practice stage presence.',
        difficulty: 'Intermediate',
        notes: 'Record yourself and analyze performance aspects.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    },
    {
        id: 'pc_10',
        name: 'Ensemble Skills',
        description: 'Practice playing with others or backing tracks.',
        difficulty: 'Intermediate',
        notes: 'Focus on listening and maintaining consistent tempo.',
        instrumentIds: ['piano', 'guitar', 'violin', 'flute', 'clarinet', 'trumpet', 'bass', 'cello']
    }
];

// Initialize practice categories page
function initializePracticeCategories() {
    console.log('Initializing practice categories page');
    
    try {
        // Get DOM elements
        practiceCategoriesList = document.getElementById('practice-categories-list');
        searchInput = document.getElementById('practice-categories-search');
        instrumentFilter = document.getElementById('practice-categories-instrument-filter');
        
        // Validate required elements
        if (!practiceCategoriesList || !searchInput || !instrumentFilter) {
            console.error('Required DOM elements not found');
            return;
        }
        
        // Set up event listeners
        setupEventListeners();
        
        // Load initial categories
        loadCategories();
        
        console.log('Practice categories page initialized successfully');
    } catch (error) {
        console.error('Error initializing practice categories:', error);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Search input
    searchInput.addEventListener('input', (e) => {
        filterCategories(e.target.value);
    });
    
    // Instrument filter
    instrumentFilter.addEventListener('change', (e) => {
        filterCategories(searchInput.value, e.target.value);
    });
}

// Load categories
function loadCategories(searchTerm = '', selectedInstrument = '') {
    if (!practiceCategoriesList) return;
    
    // Filter categories based on search term and instrument
    const filteredCategories = practiceCategories.filter(category => {
        const matchesSearch = searchTerm === '' || 
            category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            category.description.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesInstrument = selectedInstrument === '' || 
            category.instrumentIds.includes(selectedInstrument);
        
        return matchesSearch && matchesInstrument;
    });
    
    // Clear list
    practiceCategoriesList.innerHTML = '';
    
    if (filteredCategories.length === 0) {
        practiceCategoriesList.innerHTML = '<p class="no-categories">No categories found</p>';
        return;
    }
    
    // Add categories to list
    filteredCategories.forEach(category => {
        const item = document.createElement('div');
        item.className = 'practice-category-item';
        item.innerHTML = `
            <div class="practice-category-content">
                <h3>${category.name}</h3>
                <p class="practice-category-description">${category.description}</p>
                <div class="practice-category-meta">
                    <span class="practice-category-difficulty">${category.difficulty}</span>
                    <span class="practice-category-notes">${category.notes}</span>
                </div>
            </div>
            <button class="copy-category-btn" data-id="${category.id}">
                <i data-lucide="copy"></i>
                Copy
            </button>
        `;
        practiceCategoriesList.appendChild(item);
        
        // Add copy button handler
        const copyBtn = item.querySelector('.copy-category-btn');
        if (copyBtn) {
            copyBtn.addEventListener('click', () => showCopyDialog(category));
        }
    });
}

// Filter categories
function filterCategories(searchTerm = '', selectedInstrument = '') {
    loadCategories(searchTerm, selectedInstrument);
}

// Show copy dialog
function showCopyDialog(category) {
    // Create dialog if it doesn't exist
    if (!copyDialog) {
        copyDialog = document.createElement('dialog');
        copyDialog.className = 'standard-dialog';
        copyDialog.innerHTML = `
            <form method="dialog">
                <h2>Copy Practice Category</h2>
                <div class="form-group">
                    <label for="copy-category-name">Name</label>
                    <input type="text" id="copy-category-name" required>
                </div>
                <div class="form-group">
                    <label for="copy-category-description">Description</label>
                    <textarea id="copy-category-description" rows="3"></textarea>
                </div>
                <div class="form-group">
                    <label for="copy-category-difficulty">Difficulty</label>
                    <select id="copy-category-difficulty">
                        <option value="Beginner">Beginner</option>
                        <option value="Intermediate">Intermediate</option>
                        <option value="Advanced">Advanced</option>
                        <option value="All Levels">All Levels</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="copy-category-notes">Notes</label>
                    <textarea id="copy-category-notes" rows="3"></textarea>
                </div>
                <div class="dialog-buttons">
                    <button type="button" class="secondary-button cancel-btn">Cancel</button>
                    <button type="submit" class="primary-button">Copy to Settings</button>
                </div>
            </form>
        `;
        
        // Get form elements
        copyDialogName = copyDialog.querySelector('#copy-category-name');
        copyDialogDescription = copyDialog.querySelector('#copy-category-description');
        copyDialogDifficulty = copyDialog.querySelector('#copy-category-difficulty');
        copyDialogNotes = copyDialog.querySelector('#copy-category-notes');
        
        // Add event listeners
        const form = copyDialog.querySelector('form');
        form.addEventListener('submit', (e) => handleCopySubmit(e, category));
        
        const cancelBtn = copyDialog.querySelector('.cancel-btn');
        cancelBtn.addEventListener('click', () => copyDialog.close());
        
        // Add to document
        document.body.appendChild(copyDialog);
    }
    
    // Set initial values
    copyDialogName.value = category.name;
    copyDialogDescription.value = category.description;
    copyDialogDifficulty.value = category.difficulty;
    copyDialogNotes.value = category.notes;
    
    // Show dialog
    copyDialog.showModal();
}

// Handle copy submit
function handleCopySubmit(e, category) {
    e.preventDefault();
    
    try {
        // Create new category object
        const newCategory = {
            id: `cat_${Date.now()}`,
            name: copyDialogName.value.trim(),
            description: copyDialogDescription.value.trim(),
            difficulty: copyDialogDifficulty.value,
            notes: copyDialogNotes.value.trim(),
            custom: true,
            createdAt: new Date().toISOString()
        };
        
        // Save to localStorage
        let categories = [];
        try {
            const stored = localStorage.getItem('practiceTrack_categories');
            if (stored) {
                categories = JSON.parse(stored);
            }
        } catch (e) {
            console.error('Error reading categories:', e);
            categories = [];
        }
        
        categories.push(newCategory);
        localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
        
        // Close dialog
        copyDialog.close();
        
        // Show success message
        alert('Category copied successfully. You can find it in Settings.');
        
    } catch (error) {
        console.error('Error copying category:', error);
        alert('Error copying category. Please try again.');
    }
}

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        if (document.getElementById('practice-categories-page')) {
            initializePracticeCategories();
        }
    });
} else {
    if (document.getElementById('practice-categories-page')) {
        initializePracticeCategories();
    }
}

// Make functions available globally
window.initializePracticeCategories = initializePracticeCategories; 