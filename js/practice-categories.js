// Practice Categories Module
// Manages the practice categories library and copying functionality

// Data: Default Practice Categories
const defaultCategories = [
    {
        family: "Woodwinds",
        name: "Flute",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Long tone exercises", "Breathing and breath control", "Tone quality and articulation",
            "Finger dexterity exercises", "Dynamic control exercises", "Low register development",
            "High register development", "Vibrato techniques", "Technical etudes (Taffanel & Gaubert, etc.)",
            "Melodic interpretation", "Orchestral excerpt study", "Solo repertoire development",
            "Chamber music skills", "Piccolo technique (auxiliary instrument)", "Extended techniques (flutter tonguing, harmonics)"
        ]
    },
    {
        family: "Woodwinds",
        name: "Clarinet",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Embouchure development", "Long tone exercises", "Breathing techniques",
            "Finger flexibility exercises", "Articulation studies (legato, staccato, marcato)",
            "Crossing the break exercises", "Register transitions", "Technical etudes (Rose, Klosé, etc.)",
            "Tone color variations", "Dynamic control", "Classical repertoire study",
            "Orchestral excerpt practice", "Chamber music skills", "Auxiliary clarinet studies (Eb, bass clarinet)",
            "Vibrato techniques (for jazz applications)"
        ]
    },
    {
        family: "Woodwinds",
        name: "Saxophone (Classical)",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Embouchure development", "Long tone exercises", "Overtone studies", "Vibrato development",
            "Articulation studies", "Technical etudes (Ferling, Mule, etc.)", "Tone quality exercises",
            "Classical repertoire study", "Altissimo register development", "Dynamic control across registers",
            "Chamber music skills", "Contemporary extended techniques", "Orchestral excerpt practice",
            "Circular breathing introduction", "Subtone techniques"
        ]
    },
    {
        family: "Woodwinds",
        name: "Saxophone (Jazz)",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Jazz tone development", "Blues scales and patterns", "Bebop scale practice",
            "ii-V-I progression patterns", "Jazz articulation techniques", "Swing feel development",
            "Improvisation over chord changes", "Transcription of jazz solos", "Jazz repertoire (standards) practice",
            "Jazz etudes", "Rhythmic development exercises", "Guide tone lines",
            "Pentatonic pattern development", "Modal scale exercises", "Altissimo register for jazz application"
        ]
    },
    {
        family: "Woodwinds",
        name: "Oboe",
        items: [
            "Reed making and adjustment", "Long tone exercises", "Embouchure development",
            "Breath support techniques", "Articulation studies", "Major/minor scales and arpeggios",
            "Finger dexterity exercises", "Vibrato development", "Dynamic control practice",
            "Technical etudes (Barret, Ferling, etc.)", "Orchestral excerpt study", "Baroque ornamentations",
            "Sight-reading practice", "Interval studies", "Tone quality development", "Chamber music skills",
            "Extended registers practice", "Phrasing and musical interpretation", "English horn introduction (auxiliary)",
            "Performance preparation/memorization"
        ]
    },
    {
        family: "Woodwinds",
        name: "Bassoon",
        items: [
            "Reed adjustment and making", "Long tone exercises", "Embouchure development",
            "Breath support and control", "Finger coordination exercises", "Articulation techniques",
            "Major/minor scales and arpeggios", "Venting techniques", "Tenor clef reading practice",
            "Technical etudes (Weissenborn, Milde, etc.)", "Orchestral excerpt study", "Vibrato development",
            "Half-hole technique refinement", "Flicking technique mastery", "High register development",
            "Sight-reading practice", "Contrabassoon introduction (auxiliary)", "Chamber music skills",
            "Phrasing and musical interpretation", "Performance preparation/memorization"
        ]
    },
    // Brass Instruments
    {
        family: "Brass Instruments",
        name: "Trumpet (Classical)",
        items: [
            "Lip slurs and flexibility", "Long tone development", "Breathing exercises",
            "Tonguing techniques (single, double, triple)", "Major/minor scales and arpeggios",
            "Mouthpiece buzzing exercises", "Pedal tone development", "Technical etudes (Arban, Clarke, etc.)",
            "Range extension exercises", "Transposition studies", "Orchestral excerpt practice",
            "Dynamic control across registers", "Endurance training", "Sight-reading practice",
            "Piccolo trumpet studies", "Baroque ornamentations", "Chamber music skills",
            "Mute technique development", "Clean attacks and releases", "Performance preparation/memorization"
        ]
    },
    {
        family: "Brass Instruments",
        name: "Trumpet (Jazz)",
        items: [
            "Jazz tone development", "Improvisation over chord changes", "Jazz articulation patterns",
            "Swing feel development", "Blues scales and patterns", "Bebop scale practice",
            "ii-V-I progression patterns", "Guide tone lines", "Jazz repertoire study",
            "Jazz transcription practice", "Big band style studies", "Lead trumpet techniques",
            "Jazz phrasing concepts", "Plunger mute techniques", "Growling techniques",
            "High note development for jazz", "Lip flexibility for jazz application",
            "Pentatonic pattern development", "Playing by ear exercises", "Trading fours/eights practice"
        ]
    },
    {
        family: "Brass Instruments",
        name: "Trombone (Classical)",
        items: [
            "Slide position exercises", "Long tone development", "Lip slurs and flexibility",
            "Legato playing techniques", "Major/minor scales and arpeggios", "Breathing exercises",
            "Articulation studies", "Tenor clef reading practice", "Alto clef reading (for alto trombone)",
            "Technical etudes (Bordogni, Rochut, etc.)", "Orchestral excerpt study", "Chamber music skills",
            "Range extension exercises", "Dynamic control practice", "Alternate position studies",
            "Sight-reading practice", "Trigger/valve technique (if applicable)", "Mute techniques",
            "Endurance training", "Performance preparation/memorization"
        ]
    },
    {
        family: "Brass Instruments",
        name: "Trombone (Jazz)",
        items: [
            "Jazz tone development", "Swing articulation patterns", "Improvisation over chord changes",
            "Blues scales and patterns", "Jazz slide technique", "Bebop scale practice",
            "Plunger mute techniques", "ii-V-I progression patterns", "Guide tone lines",
            "Jazz repertoire study", "Jazz transcription practice", "Big band style studies",
            "Growling techniques", "Fall and glissando techniques", "Jazz phrasing concepts",
            "Pentatonic pattern development", "Vibrato techniques for jazz", "Playing by ear exercises",
            "Rhythmic development exercises", "Trading fours/eights practice"
        ]
    },
    {
        family: "Brass Instruments",
        name: "French Horn",
        items: [
            "Lip slurs and flexibility", "Long tone development", "Breathing exercises",
            "Hand position in bell techniques", "Major/minor scales and arpeggios", "Transposition studies",
            "Mouthpiece buzzing exercises", "Stopped horn technique", "Technical etudes (Kopprasch, Kling, etc.)",
            "Orchestral excerpt study", "Range extension exercises", "Articulation studies",
            "Endurance training", "Dynamic control across registers", "Finger technique for valves",
            "Chamber music skills", "Accuracy exercises", "Sight-reading practice", "Muted techniques",
            "Performance preparation/memorization"
        ]
    },
    {
        family: "Brass Instruments",
        name: "Euphonium/Baritone",
        items: [
            "Long tone development", "Lip slurs and flexibility", "Breathing exercises",
            "Major/minor scales and arpeggios", "Articulation studies", "Technical etudes (Arban, Rochut, etc.)",
            "Range extension exercises", "Bass clef and treble clef reading", "Finger technique for valves",
            "Dynamic control practice", "Orchestral/band excerpt study", "Chamber music skills",
            "Solo repertoire development", "Mouthpiece buzzing exercises", "Endurance training",
            "Sight-reading practice", "Vibrato development", "Tonguing exercises (single, double, triple)",
            "Muted techniques", "Performance preparation/memorization"
        ]
    },
    {
        family: "Brass Instruments",
        name: "Tuba",
        items: [
            "Long tone development", "Breathing exercises and breath control", "Lip slurs and flexibility",
            "Major/minor scales and arpeggios", "Articulation studies", "Technical etudes (Bordogni, Blazhevich, etc.)",
            "Low register development", "High register extension", "Finger technique for valves",
            "Dynamic control practice", "Orchestral excerpt study", "Mouthpiece buzzing exercises",
            "Endurance training", "Sight-reading practice", "Solo repertoire development", "Chamber music skills",
            "Bass clef reading proficiency", "Tonguing exercises (single, double)", "Sound projection techniques",
            "Performance preparation/memorization"
        ]
    },
    // Strings
    {
        family: "Strings",
        name: "Violin",
        items: [
            "Left hand finger patterns", "Bow control exercises", "String crossing techniques",
            "Vibrato development", "Major/minor scales and arpeggios", "Position work (1st through 7th)",
            "Shifting exercises", "Double stop practice", "Etudes (Kreutzer, Dont, etc.)",
            "Spiccato and other bow strokes", "Tone production exercises", "Orchestral excerpt study",
            "Dynamic control practice", "Sight-reading exercises", "Chamber music skills",
            "Solo repertoire development", "Harmonics techniques", "Baroque bow technique",
            "Phrasing and musical interpretation", "Performance preparation/memorization"
        ]
    },
    {
        family: "Strings",
        name: "Viola",
        items: [
            "Left hand finger patterns", "Bow control exercises", "String crossing techniques",
            "Vibrato development", "Major/minor scales and arpeggios", "Position work (1st through 5th)",
            "Shifting exercises", "Alto clef reading mastery", "Double stop practice",
            "Etudes (Kreutzer, Campagnoli, etc.)", "Tone production exercises", "Orchestral excerpt study",
            "Dynamic control practice", "Sight-reading exercises", "Chamber music skills",
            "Solo repertoire development", "Harmonics techniques", "Sound projection techniques",
            "Phrasing and musical interpretation", "Performance preparation/memorization"
        ]
    },
    {
        family: "Strings",
        name: "Cello",
        items: [
            "Left hand finger patterns", "Bow control exercises", "String crossing techniques",
            "Vibrato development", "Major/minor scales and arpeggios", "Position work (1st through thumb)",
            "Shifting exercises", "Double stop practice", "Etudes (Dotzauer, Popper, etc.)",
            "Pizzicato techniques", "Tenor and treble clef reading", "Orchestral excerpt study",
            "Tone production exercises", "Dynamic control practice", "Thumb position development",
            "Sight-reading exercises", "Chamber music skills", "Solo repertoire development",
            "Harmonics techniques", "Performance preparation/memorization"
        ]
    },
    {
        family: "Strings",
        name: "Double Bass",
        items: [
            "Left hand finger patterns", "Bow control exercises", "String crossing techniques",
            "Position work (1/2 through thumb)", "Shifting exercises", "Major/minor scales and arpeggios",
            "Pizzicato techniques", "Orchestral excerpt study", "Etudes (Simandl, Hrabe, etc.)",
            "Thumb position development", "Vibrato development", "Tone production exercises",
            "Dynamic control practice", "Sight-reading exercises", "Chamber music skills",
            "Solo repertoire development", "French bow vs. German bow techniques", "Jazz bass introduction",
            "Extended techniques", "Performance preparation/memorization"
        ]
    },
    {
        family: "Strings",
        name: "Double Bass (Jazz)",
        items: [
            "Walking bass line development", "Jazz tone development", "Swing feel exercises",
            "ii-V-I progression patterns", "Chord-scale relationships", "Pizzicato technique for jazz",
            "Jazz bowing techniques", "Blues patterns and progressions", "Transcription of jazz bass lines",
            "Jazz standard repertoire", "Rhythmic development exercises", "Soloing techniques for bass",
            "Playing by ear exercises", "Accompanying skills", "Slap and pop techniques",
            "Jazz phrasing concepts", "Improvisation development", "Latin jazz patterns",
            "Duo playing with piano/drums", "Trading fours/eights practice"
        ]
    },
    // Bass Guitar
    {
        family: "Bass Guitar",
        name: "Electric Bass (Jazz)",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Walking bass line development", "Jazz tone production", "Swing feel development",
            "ii-V-I pattern exercises", "Chord-scale relationships", "Finger technique for jazz",
            "Blues progressions and patterns", "Jazz standard repertoire", "Transcription of jazz bass lines",
            "Soloing techniques for jazz bass", "Jazz phrasing concepts", "Reading bass clef notation",
            "Reading tablature", "Improvisation development", "Trading fours/eights practice"
        ]
    },
    {
        family: "Bass Guitar",
        name: "Electric Bass (Rock/Pop)",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Finger technique development", "Pick technique", "Major/minor scales and patterns",
            "Slap and pop techniques", "Groove development exercises", "Rhythmic accuracy training",
            "Rock/pop song repertoire", "Chord progressions and arpeggios", "Pentatonic patterns",
            "Octave techniques", "Fretboard knowledge development", "Reading bass clef notation",
            "Reading tablature", "Playing with a drummer exercises", "Dynamic control practice"
        ]
    },
    // Keyboard Instruments
    {
        family: "Keyboard Instruments",
        name: "Piano (Classical)",
        items: [
            "Five-finger exercises", "Major/minor scales and arpeggios", "Hanon technical exercises",
            "Chord progressions and inversions", "Finger independence exercises", "Sight-reading practice",
            "Pedaling techniques", "Dynamics and articulation control", "Etudes (Czerny, Clementi, etc.)",
            "Bach inventions/preludes study", "Classical sonata repertoire", "Romantic period repertoire",
            "Impressionist style study", "Contemporary techniques", "Chamber music/accompanying skills",
            "Octave technique development", "Contrapuntal playing", "Memorization techniques",
            "Performance practice by era", "Performance preparation/recital skills"
        ]
    },
    {
        family: "Keyboard Instruments",
        name: "Piano (Jazz)",
        items: [
            "Jazz chord voicings", "Comping techniques", "Blues progressions and scales",
            "ii-V-I progression patterns", "Bebop scale practice", "Jazz standard repertoire",
            "Left-hand walking bass with right-hand chords", "Modal jazz techniques", "Stride piano techniques",
            "Improvisation development", "Jazz articulation and phrasing", "Transcription of jazz solos",
            "Rhythmic comping patterns", "Latin jazz styles", "Jazz trio playing techniques",
            "Reharmonization techniques", "Playing by ear exercises", "Guide tone line practice",
            "Solo piano arrangements", "Trading fours/eights practice"
        ]
    },
    // Percussion
    {
        family: "Percussion",
        name: "Snare Drum",
        items: [
            "Warm-up routines", "Sight-reading", "Ear training", "Stick control exercises",
            "Rudiment practice (40 essential rudiments)", "Reading rhythmic notation", "Accent patterns",
            "Roll development (closed to open)", "Dynamic control exercises", "Technical etudes (Peters, Cirone, etc.)",
            "Orchestral excerpt study", "Rudimental drumming style", "Concert/orchestral style",
            "Stick heights and technique", "Multiple bounce control", "Rhythm accuracy exercises",
            "Hand speed development", "Endurance training", "Brush technique introduction", "Marching percussion techniques"
        ]
    },
    {
        family: "Percussion",
        name: "Timpani",
        items: [
            "Mallet technique development", "Pitch ear training", "Tuning exercises", "Roll development",
            "Dampening techniques", "Cross-sticking techniques", "Technical etudes", "Orchestral excerpt study",
            "Sight-reading practice", "Different mallet selection", "Dynamic control across drums",
            "Multiple timpani exercises", "Glissando techniques", "Muffling techniques",
            "Rhythm accuracy exercises", "Pedal technique", "Double-stop techniques",
            "Coordination exercises", "Articulation development", "Performance preparation/memorization"
        ]
    },
    {
        family: "Percussion",
        name: "Mallet Percussion (Marimba, Xylophone, Vibraphone)",
        items: [
            "Mallet technique (Stevens, Burton, etc.)", "Two-mallet exercises", "Four-mallet exercises",
            "Major/minor scales and arpeggios", "Chord progressions", "Reading exercises",
            "Dampening techniques (vibraphone)", "Pedaling techniques (vibraphone)", "Roll development",
            "Technical etudes", "Sight-reading practice", "Orchestral excerpt study", "Solo repertoire development",
            "Chamber music skills", "Dynamic control", "Speed and accuracy exercises", "One-handed roll techniques",
            "Interval studies", "Repertoire by era (baroque to contemporary)", "Performance preparation/memorization"
        ]
    },
    {
        family: "Percussion",
        name: "Vibraphone (Jazz)",
        items: [
            "Four-mallet technique", "Jazz chord voicings", "Dampening techniques", "Pedaling techniques",
            "Blues progressions", "ii-V-I progression patterns", "Comping techniques", "Jazz standard repertoire",
            "Improvisation development", "Guide tone line practice", "Bebop scale application", "Modal jazz techniques",
            "Mallet dampening for articulation", "Transcription of jazz solos", "Playing by ear exercises",
            "Jazz phrasing concepts", "Rhythmic development exercises", "Solo vibraphone arrangements",
            "Jazz combo playing techniques", "Trading fours/eights practice"
        ]
    },
    {
        family: "Percussion",
        name: "Drums (Jazz)",
        items: [
            "Warm-up routines", "Sight-reading", "Ear training", "Basic coordination exercises",
            "Jazz ride cymbal patterns", "Comping with snare and bass", "Brush technique development",
            "Jazz independence exercises", "Swing feel development", "Big band style and figures",
            "Trading fours/eights practice", "Small group jazz techniques", "Reading big band charts",
            "Solo development", "Jazz waltz patterns", "Jazz standard repertoire timing",
            "Ballad brush patterns", "Bebop drumming style", "Latin jazz patterns", "Jazz time feel exercises"
        ]
    },
    {
        family: "Percussion",
        name: "Drums (Rock)",
        items: [
            "Basic rock beats", "Sixteenth note groove patterns", "Hi-hat technique development",
            "Bass drum technique", "Fill development", "Hand and foot speed exercises", "Double bass drum techniques",
            "Odd time signatures", "Groove variation exercises", "Linear drumming techniques", "Ghost note technique",
            "Dynamic control in rock context", "Rock song repertoire", "Coordination exercises", "Reading drum charts",
            "Drum solos in rock context", "Polyrhythmic studies", "Metal drumming techniques", "Progressive rock techniques",
            "Performance preparation skills"
        ]
    },
    // Guitar
    {
        family: "Guitar",
        name: "Guitar (Classical)",
        items: [
            "Right hand fingerstyle technique", "Left hand finger patterns", "Major/minor scales and arpeggios",
            "Slur technique (hammer-ons, pull-offs)", "Sight-reading practice", "Nail shape and tone production",
            "Rest stroke vs. free stroke", "Etudes (Carcassi, Sor, etc.)", "Renaissance repertoire",
            "Baroque repertoire", "Classical period repertoire", "Romantic repertoire", "20th century techniques",
            "Contemporary repertoire", "Chamber music skills", "Dynamic control", "Tremolo technique",
            "Rasgueado technique", "Musical interpretation by era", "Performance preparation/memorization"
        ]
    },
    {
        family: "Guitar",
        name: "Guitar (Jazz)",
        items: [
            "Jazz chord voicings", "Comping techniques", "Walking bass lines", "Blues progressions",
            "ii-V-I progression patterns", "Jazz standard repertoire", "Chord-melody arrangements",
            "Bebop scale application", "Improvisation development", "Guide tone line practice",
            "Transcription of jazz solos", "Swing feel development", "Jazz articulation techniques",
            "Modal jazz theory application", "Playing by ear exercises", "Jazz phrasing concepts",
            "Reading standard notation", "Reading tablature (where applicable)", "Solo jazz guitar arrangements",
            "Trading fours/eights practice"
        ]
    },
    {
        family: "Guitar",
        name: "Guitar (Rock)",
        items: [
            "Open chord techniques", "Barre chord techniques", "Power chord progressions", "Alternate picking technique",
            "Blues scale patterns", "Pentatonic scale patterns", "Palm muting techniques", "Basic tapping techniques",
            "Rhythm guitar patterns", "Lead guitar techniques", "Hammer-on/pull-off exercises", "String bending techniques",
            "Vibrato development", "Rock song repertoire", "Improvisation over rock progressions", "Guitar effects usage",
            "Hybrid picking techniques", "Rock song structure study", "Rock guitar solos transcription",
            "Performance preparation skills"
        ]
    },
    {
        family: "Guitar",
        name: "Electric Bass (Rock/Pop)", // Note: Duplicate from Bass Guitar section, maybe consolidate later?
        items: [
            "Finger technique development", "Pick technique", "Major/minor scales and patterns", "Slap and pop techniques",
            "Groove development exercises", "Rhythmic accuracy training", "Rock/pop song repertoire", "Chord progressions and arpeggios",
            "Pentatonic patterns", "Octave techniques", "Walking bass introduction", "Improvisation exercises",
            "Two-finger vs. three-finger technique", "Muting techniques", "Fretboard knowledge development",
            "Reading bass clef and tab", "Playing with a drummer exercises", "Dynamic control practice", "Bass solo techniques",
            "Performance preparation skills"
        ]
    },
    // Voice
    {
        family: "Voice",
        name: "Voice (Classical)",
        items: [
            "Breath support exercises", "Vowel formation and modification", "Resonance development",
            "Vocal range extension", "Vocal agility exercises", "Legato line development",
            "Diction exercises (Italian, German, French)", "Sight-singing practice", "Art song repertoire",
            "Aria study", "Vocal pedagogy awareness", "Dynamic control exercises", "Vibrato development",
            "Register transition techniques", "Classical ensemble singing", "Recitative techniques",
            "Phrasing and interpretation", "Foreign language pronunciation", "Acting for classical singing",
            "Performance preparation/memorization"
        ]
    },
    {
        family: "Voice",
        name: "Voice (Jazz)",
        items: [
            "Jazz tone development", "Blues scale application", "Scat singing techniques",
            "Jazz phrasing concepts", "Swing feel development", "Jazz standard repertoire",
            "Microphone technique", "Improvisation development", "Transcription of jazz vocalists",
            "Bebop patterns for voice", "ii-V-I progression patterns", "Guide tone line practice",
            "Jazz articulation techniques", "Rhythmic development exercises", "Playing by ear exercises",
            "Jazz vocal stylings", "Working with a rhythm section", "Jazz vocal interpretation",
            "Vocalese techniques", "Performance preparation skills"
        ]
    },
    {
        family: "Voice",
        name: "Voice (Rock/Pop)",
        items: [
            "Warm-up routines", "Scales", "Arpeggios", "Sight-reading", "Ear training",
            "Contemporary vocal technique", "Mixed voice development", "Belt technique",
            "Vocal effects (growl, distortion)", "Contemporary vibrato styles", "Microphone technique",
            "Rock/pop song repertoire", "Contemporary runs and riffs", "Vocal range extension",
            "Contemporary vocal agility", "Stage presence for rock/pop", "Breath support for contemporary styles",
            "Voice care for high-energy singing", "Stylistic interpretation", "Rock/pop phrasing concepts"
        ]
    },
    {
        "family": "General Exercises",
        "name": "General Musicianship",
        "items": [
            "Sight-reading practice (various clefs/instruments)",
            "Ear training (intervals, chords, melodies)",
            "Rhythm practice (clapping, tapping, using metronome)",
            "Music theory review (harmony, form, analysis)",
            "Transcription (solos, melodies, chord progressions)",
            "Improvisation practice (over backing tracks or changes)",
            "Memorization techniques",
            "Mental practice / visualization",
            "Score study",
            "Performance preparation skills"
        ]
    }
];

// Helper function to get the icon name for a family
function getFamilyIcon(familyName) {
    switch (familyName) {
        case "Woodwinds": return "wind";
        case "Brass": return "trumpet";
        case "Strings": return "violin";
        case "Bass Guitar": return "guitar";
        case "Keyboard": return "piano";
        case "Percussion": return "drum";
        case "Guitar": return "guitar";
        case "Voice": return "mic";
        default: return "music";
    }
}

// Function to display practice categories dynamically
function displayPracticeCategories() {
    const container = document.getElementById('practice-categories-container');
    if (!container) {
        console.error('[DEBUG Resources] Practice categories container not found!');
        return;
    }
    container.innerHTML = ''; // Clear existing content

    // Group categories by family first
    const families = {};
    defaultCategories.forEach(category => {
        if (!families[category.family]) {
            families[category.family] = [];
        }
        families[category.family].push(category);
    });

    // Generate HTML for each family
    for (const familyName in families) {
        const familyData = families[familyName];
        
        const familySection = document.createElement('section');
        familySection.className = 'family-section';
        familySection.dataset.family = familyName;

        // Add family title with icon
        const familyIcon = getFamilyIcon(familyName);
        familySection.innerHTML = `
            <h2 class="family-title">
                <i data-lucide="${familyIcon}"></i>${familyName}
            </h2>
        `;

        // Generate HTML for each instrument within the family
        familyData.forEach(instrument => {
            const instrumentSection = document.createElement('div');
            instrumentSection.className = 'instrument-section';
            
            instrumentSection.innerHTML = `<h3 class="instrument-title">${instrument.name}</h3>`;
            
            const categoriesList = document.createElement('ul');
            categoriesList.className = 'categories-list';
            
            instrument.items.forEach(item => {
                const listItem = document.createElement('li');
                listItem.className = 'category-item';
                listItem.dataset.categoryName = item.toLowerCase();
                listItem.innerHTML = `
                    <span class="category-name">${item}</span>
                    <button class="copy-button" data-category="${item}" title="Add to My Categories">
                        <i data-lucide="plus"></i>
                        Add
                    </button>
                `;
                categoriesList.appendChild(listItem);
            });
            
            instrumentSection.appendChild(categoriesList);
            familySection.appendChild(instrumentSection);
        });

        container.appendChild(familySection);
    }

    // Initialize Lucide icons for the newly added elements
    if (window.lucide) {
        console.log("[DEBUG Resources] Initializing icons for newly added elements");
        lucide.createIcons();
    } else {
        console.warn("[DEBUG Resources] Lucide not available for icon initialization");
    }

    // Add event listeners to copy buttons after they are created
    container.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => handleCopy(button));
    });
}

// Handle copy button clicks
function handleCopy(button) {
    const categoryName = button.dataset.category;
    const instrumentFamily = button.closest('.family-section').dataset.family;

    // Get existing categories
    const categories = JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
    
    // Check if category already exists
    const existingCategory = categories.find(c => c.name === categoryName);
    if (existingCategory) {
        showResourceMessage('Category already exists!', 'warning');
        return;
    }
    
    // Add new category
    const newCategory = {
        id: Date.now().toString(),
        name: categoryName,
        family: instrumentFamily,
        isDefault: false,
        isVisible: true
    };
    
    categories.push(newCategory);
    localStorage.setItem('practiceTrack_categories', JSON.stringify(categories));
    
    // Show success message
    showResourceMessage('Category added successfully!', 'success');

    // Update any category dropdowns
    window.updateCategoryDropdowns();
}

// Show message notification
function showResourceMessage(text, type = 'success') {
    window.showNotification(text, type);
}

// Function to filter categories based on search term and family
function filterCategories(searchTerm, familyFilter) {
    const sections = document.querySelectorAll('#practice-categories-container .family-section');
    sections.forEach(section => {
        const sectionFamily = section.dataset.family;
        const items = section.querySelectorAll('.category-item');
        let sectionHasVisibleItems = false;

        items.forEach(item => {
            const categoryName = item.dataset.categoryName;
            const matchesSearch = categoryName.includes(searchTerm);
            const matchesFamily = familyFilter === 'all' || sectionFamily === familyFilter;

            if (matchesSearch && matchesFamily) {
                item.style.display = 'flex'; // Or 'block'
                sectionHasVisibleItems = true;
            } else {
                item.style.display = 'none';
            }
        });

        if ((familyFilter === 'all' || sectionFamily === familyFilter) && sectionHasVisibleItems) {
            section.classList.remove('hidden-family');
        } else {
             section.classList.add('hidden-family');
        }
    });
}

// Restore initializeResources to handle setup directly
function initializeResources() {
    console.log("[DEBUG Resources] Initializing resources page...");

    // Check if the resources page container exists - prevents errors on other pages
    const resourcesPage = document.getElementById('resources-page');
    if (!resourcesPage) {
        console.log("[DEBUG Resources] Resources page element not found, skipping initialization.");
        return; // Exit if not on the correct page
    }

    displayPracticeCategories(); // Generate the HTML for categories

    // Initialize Lucide icons
    if (window.lucide) {
        console.log("[DEBUG Resources] Lucide found, calling createIcons().");
        lucide.createIcons();
    } else {
        console.error("[DEBUG Resources] Lucide object not found during initializeResources!");
    }

    const searchInput = document.getElementById('resource-search');
    const filterButtons = document.querySelectorAll('#resources-page .filter-btn'); // Scope to resources page
    const categoriesContainer = document.getElementById('practice-categories-container');

    if (!categoriesContainer) {
        console.error("[DEBUG Resources] Practice categories container not found after display!");
        return;
    }
    
    // Add event listener for search input
    if (searchInput) {
        searchInput.addEventListener('input', () => {
             const activeFilter = document.querySelector('#resources-page .filter-btn.active');
             filterCategories(searchInput.value.toLowerCase(), activeFilter?.dataset.family || 'all');
        });
    } else {
        console.warn("[DEBUG Resources] Resource search input not found!");
    }

    // Add event listeners for filter buttons
    filterButtons.forEach(button => {
        // Remove previous listeners if any to prevent duplicates (optional but good practice)
        // Note: This simple removal might not work if the listener function is anonymous.
        // A more robust approach involves named functions or storing listener references.
        // For now, we assume initializeResources is called only once per page load/view.
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const family = button.dataset.family;
            filterCategories(searchInput?.value.toLowerCase() || '', family);
        });
    });

    // Initial filter display
    const initialActiveFilter = document.querySelector('#resources-page .filter-btn.active');
    filterCategories('', initialActiveFilter?.dataset.family || 'all');
    console.log("[DEBUG Resources] Resources page initialization complete.");
}

// Ensure initializeResources is available globally for app.js to call
window.initializeResources = initializeResources;

// Call initializeResources when the page is navigated to (handled by app.js navigateToPage)
// We might also need an initial call if the app loads directly onto the resources page
// Check if the current page is resources on initial load
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    // Check hash or path to see if we are on resources page initially
    if (window.location.hash === '#resources' || document.getElementById('resources-page')?.classList.contains('active')) {
        console.log("[DEBUG Resources] Initializing resources on direct load.")
        initializeResources();
    }
} else {
    document.addEventListener('DOMContentLoaded', () => {
        if (window.location.hash === '#resources' || document.getElementById('resources-page')?.classList.contains('active')) {
             console.log("[DEBUG Resources] Initializing resources on direct load (DOMContentLoaded).")
            initializeResources();
        }
    });
}