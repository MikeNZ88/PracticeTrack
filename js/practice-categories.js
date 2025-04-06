// Practice Categories Module
// Manages the practice categories library and copying functionality

// Practice Categories Module - Structured by instrument family, category, and skill level
const practiceCategories = [
    // WOODWINDS
    {
        family: "Woodwinds",
        name: "Flute",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Posture and instrument position", 
                    "Breathing and breath support",
                    "Embouchure formation and development",
                    "Tone production fundamentals"
                ]
            },
            {
                category: "Core technique",
                difficulty: "B2",
                topics: [
                    "Long tone exercises",
                    "Major scales and arpeggios",
                    "Minor scales and arpeggios",
                    "Chromatic scale development",
                    "Finger dexterity exercises"
                ]
            },
            {
                category: "Articulation",
                difficulty: "I1",
                topics: [
                    "Articulation studies (legato, staccato)",
                    "Double/triple tonguing techniques",
                    "Slur patterns and exercises"
                ]
            },
            {
                category: "Register development",
                difficulty: "I1",
                topics: [
                    "Low register development",
                    "Middle register refinement",
                    "High register development"
                ]
            },
            {
                category: "Expressive techniques",
                difficulty: "I2",
                topics: [
                    "Vibrato techniques and exercises",
                    "Dynamic control exercises",
                    "Phrasing and musical line development"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "A",
                topics: [
                    "Harmonics exercises", 
                    "Flutter tonguing",
                    "Whistle tones and overtones",
                    "Circular breathing introduction",
                    "Baroque ornamentation practice"
                ]
            },
            {
                category: "Repertoire approaches",
                difficulty: "I2",
                topics: [
                    "Technical etudes (Taffanel & Gaubert, etc.)",
                    "Melodic interpretation",
                    "Orchestral excerpt study",
                    "Solo repertoire development",
                    "Chamber music skills"
                ]
            },
            {
                category: "Related skills",
                difficulty: "mixed",
                topics: [
                    "Piccolo technique (auxiliary instrument)",
                    "Sight-reading practice",
                    "Ear training for flutists",
                    "Practice planning and self-assessment"
                ]
            }
        ]
    },
    
    // Add more woodwind instruments
    {
        family: "Woodwinds",
        name: "Clarinet",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Embouchure development",
                    "Proper instrument assembly and care",
                    "Breath support and control",
                    "Basic tone production"
                ]
            },
            {
                category: "Core technique",
                difficulty: "B2",
                topics: [
                    "Scale studies (major and minor)",
                    "Crossing the break exercises",
                    "Articulation fundamentals",
                    "Long tone development"
                ]
            },
            {
                category: "Intermediate skills",
                difficulty: "I1",
                topics: [
                    "Extended scale patterns",
                    "Alternate fingerings",
                    "Advanced articulation techniques",
                    "Register control exercises"
                ]
            },
            {
                category: "Advanced repertoire",
                difficulty: "A",
                topics: [
                    "Mozart Clarinet Concerto",
                    "Weber concertos",
                    "Orchestral excerpts",
                    "Contemporary techniques"
                ]
            }
        ]
    },
    {
        family: "Woodwinds",
        name: "Saxophone",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Embouchure formation",
                    "Proper instrument position",
                    "Breath support basics",
                    "Tone production fundamentals"
                ]
            },
            {
                category: "Jazz techniques",
                difficulty: "I1",
                topics: [
                    "Blues scales and patterns",
                    "Swing articulation",
                    "Jazz phrasing concepts",
                    "Improvisation basics"
                ]
            },
            {
                category: "Classical repertoire",
                difficulty: "I2",
                topics: [
                    "Sonatas and concertos",
                    "Etudes (Ferling, Mule)",
                    "Chamber music",
                    "Solo performance techniques"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "A",
                topics: [
                    "Altissimo register",
                    "Extended techniques",
                    "Circular breathing",
                    "Multiphonics and overtones"
                ]
            }
        ]
    },
    
    // BRASS INSTRUMENTS
    {
        family: "Brass",
        name: "Trumpet",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Posture and instrument position", 
                    "Breathing and breath support",
                    "Mouthpiece placement",
                    "Tone production basics"
                ]
            },
            {
                category: "Core technique",
                difficulty: "B2",
                topics: [
                    "Lip slurs and flexibility",
                    "Major scales and arpeggios",
                    "Minor scales and arpeggios",
                    "Mouthpiece buzzing exercises"
                ]
            },
            {
                category: "Articulation",
                difficulty: "I1",
                topics: [
                    "Single tonguing technique",
                    "Double tonguing development",
                    "Triple tonguing introduction"
                ]
            },
            {
                category: "Range development",
                difficulty: "I1",
                topics: [
                    "Pedal tone exercises",
                    "Middle register refinement",
                    "Upper register development"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "A",
                topics: [
                    "Endurance training",
                    "Transposition studies",
                    "Piccolo trumpet techniques",
                    "Advanced flexibility exercises"
                ]
            },
            {
                category: "Repertoire",
                difficulty: "I2",
                topics: [
                    "Jazz Standards", 
                    "Orchestral Excerpts", 
                    "Solo Literature"
                ]
            }
        ]
    },
    {
        family: "Brass",
        name: "Trombone",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Slide position basics",
                    "Breath support techniques",
                    "Mouthpiece placement",
                    "Basic tone production"
                ]
            },
            {
                category: "Slide technique",
                difficulty: "B2",
                topics: [
                    "Legato slide movements",
                    "Position accuracy drills",
                    "Alternate positions",
                    "Slide coordination exercises"
                ]
            },
            {
                category: "Advanced skills",
                difficulty: "A",
                topics: [
                    "Multiple tonguing techniques",
                    "Bass trombone techniques",
                    "Extended range development",
                    "Jazz improvisation approaches"
                ]
            },
            {
                category: "Repertoire",
                difficulty: "I2",
                topics: [
                    "Solo works",
                    "Orchestral excerpts",
                    "Chamber music",
                    "Jazz repertoire studies"
                ]
            }
        ]
    },
    {
        family: "Brass",
        name: "French Horn",
        items: [
            {
                category: "Foundation",
                difficulty: "B1",
                topics: [
                    "Embouchure formation",
                    "Hand position in bell",
                    "Breathing techniques",
                    "Lip buzzing exercises"
                ]
            },
            {
                category: "Technical development",
                difficulty: "B2",
                topics: [
                    "Scale studies",
                    "Lip slurs",
                    "Finger dexterity",
                    "Stopped horn technique"
                ]
            },
            {
                category: "Intermediate skills",
                difficulty: "I1",
                topics: [
                    "Transposition practice",
                    "Extended range development",
                    "Advanced lip flexibility",
                    "Accuracy exercises"
                ]
            },
            {
                category: "Advanced repertoire",
                difficulty: "A",
                topics: [
                    "Mozart horn concertos",
                    "Strauss concertos",
                    "Orchestral excerpts",
                    "Chamber music literature"
                ]
            }
        ]
    },
    
    // STRINGS
    {
        family: "Strings",
        name: "Violin",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Proper instrument hold and posture",
                    "Bow hold fundamentals",
                    "Left hand position",
                    "Basic tone production"
                ]
            },
            {
                category: "Core technique",
                difficulty: "B2",
                topics: [
                    "String crossing exercises",
                    "Major scales and arpeggios",
                    "Minor scales and arpeggios",
                    "First position mastery"
                ]
            },
            {
                category: "Left hand technique",
                difficulty: "I1",
                topics: [
                    "Position work (2nd-5th)",
                    "Shifting exercises",
                    "Vibrato development",
                    "Double stop introduction"
                ]
            },
            {
                category: "Bow technique",
                difficulty: "I2",
                topics: [
                    "Detaché bowing",
                    "Martelé and staccato",
                    "Spiccato development",
                    "Expressive bow strokes"
                ]
            },
            {
                category: "Advanced studies",
                difficulty: "A",
                topics: [
                    "Virtuosic étude work",
                    "Advanced double stops",
                    "Left hand agility",
                    "High position playing"
                ]
            },
            {
                category: "Repertoire",
                difficulty: "mixed",
                topics: [
                    "Bach Sonatas and Partitas",
                    "Classical concertos",
                    "Romantic works",
                    "Contemporary pieces"
                ]
            }
        ]
    },
    {
        family: "Strings",
        name: "Cello",
        items: [
            {
                category: "Fundamentals",
                difficulty: "B1",
                topics: [
                    "Instrument setup and posture",
                    "Basic bow hold and technique",
                    "Left hand positioning",
                    "Open string exercises"
                ]
            },
            {
                category: "Basic technique",
                difficulty: "B2",
                topics: [
                    "First position studies",
                    "Basic shifting",
                    "Scale patterns",
                    "String crossing exercises"
                ]
            },
            {
                category: "Intermediate studies",
                difficulty: "I1",
                topics: [
                    "Thumb position introduction",
                    "Vibrato development",
                    "Extended position work",
                    "Legato bowing techniques"
                ]
            },
            {
                category: "Advanced repertoire",
                difficulty: "A",
                topics: [
                    "Bach Cello Suites",
                    "Concerto literature",
                    "Orchestral excerpts",
                    "Contemporary techniques"
                ]
            }
        ]
    },
    {
        family: "Strings",
        name: "Double Bass",
        items: [
            {
                category: "Basic position",
                difficulty: "B1",
                topics: [
                    "Instrument setup and posture",
                    "Basic hand positioning",
                    "Pizzicato technique",
                    "Bow hold fundamentals"
                ]
            },
            {
                category: "Technical foundation",
                difficulty: "B2",
                topics: [
                    "First position mastery",
                    "Half position studies",
                    "Scale patterns",
                    "Simple shifting"
                ]
            },
            {
                category: "Orchestral skills",
                difficulty: "I1",
                topics: [
                    "Orchestral excerpt study",
                    "Orchestra bowings",
                    "Section playing techniques",
                    "Rhythmic precision exercises"
                ]
            },
            {
                category: "Jazz techniques",
                difficulty: "I2",
                topics: [
                    "Walking bass lines",
                    "Jazz improvisation basics",
                    "Swing feel development",
                    "Jazz repertoire studies"
                ]
            }
        ]
    },
    
    // KEYBOARD INSTRUMENTS
    {
        family: "Keyboard",
        name: "Piano",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Proper posture and hand position",
                    "Finger independence exercises",
                    "Basic articulation (legato/staccato)",
                    "Five-finger patterns"
                ]
            },
            {
                category: "Core technique",
                difficulty: "B2",
                topics: [
                    "Major scales and arpeggios",
                    "Minor scales and arpeggios",
                    "Contrary motion scales",
                    "Chord progressions and inversions"
                ]
            },
            {
                category: "Intermediate technique",
                difficulty: "I1",
                topics: [
                    "Pedaling techniques",
                    "Velocity and finger agility",
                    "Octave practice",
                    "Chord voicing and balance"
                ]
            },
            {
                category: "Advanced studies",
                difficulty: "A",
                topics: [
                    "Virtuosic études (Chopin, Liszt)",
                    "Polyphonic playing",
                    "Complex rhythmic patterns",
                    "Artistic pedaling"
                ]
            },
            {
                category: "Repertoire",
                difficulty: "mixed",
                topics: [
                    "Classical sonatas",
                    "Romantic character pieces",
                    "Baroque contrapuntal works",
                    "Contemporary compositions"
                ]
            }
        ]
    },
    {
        family: "Keyboard",
        name: "Organ",
        items: [
            {
                category: "Manual technique",
                difficulty: "B1",
                topics: [
                    "Finger independence",
                    "Touch and articulation",
                    "Hand position principles",
                    "Basic registration concepts"
                ]
            },
            {
                category: "Pedal technique",
                difficulty: "B2",
                topics: [
                    "Pedal scales and exercises",
                    "Toe-heel technique",
                    "Pedal articulation",
                    "Coordination exercises"
                ]
            },
            {
                category: "Bach studies",
                difficulty: "I2",
                topics: [
                    "Chorales",
                    "Preludes and fugues",
                    "Trio sonatas",
                    "Contrapuntal techniques"
                ]
            },
            {
                category: "Advanced literature",
                difficulty: "A",
                topics: [
                    "Romantic organ works",
                    "French organ symphonies",
                    "Modern compositions",
                    "Improvisation techniques"
                ]
            }
        ]
    },
    
    // PERCUSSION
    {
        family: "Percussion",
        name: "Drums (Rock)",
        items: [
            {
                category: "Fundamentals",
                difficulty: "B1",
                topics: [
                    "Basic rock beats",
                    "Stick grip and technique",
                    "Drum set posture and setup",
                    "Reading basic drum notation"
                ]
            },
            {
                category: "Groove development",
                difficulty: "B2",
                topics: [
                    "Sixteenth note groove patterns",
                    "Hi-hat technique development",
                    "Bass drum technique",
                    "Basic fill development"
                ]
            },
            {
                category: "Intermediate techniques",
                difficulty: "I1",
                topics: [
                    "Hand and foot speed exercises",
                    "Ghost note technique",
                    "Linear drumming introduction",
                    "Dynamic control in rock context"
                ]
            },
            {
                category: "Advanced concepts",
                difficulty: "A",
                topics: [
                    "Odd time signatures",
                    "Double bass drum techniques",
                    "Polyrhythmic studies",
                    "Metal and progressive rock techniques"
                ]
            }
        ]
    },
    {
        family: "Percussion",
        name: "Drums (Jazz)",
        items: [
            {
                category: "Fundamentals",
                difficulty: "B1",
                topics: [
                    "Basic swing pattern",
                    "Ride cymbal technique",
                    "Hi-hat foot technique",
                    "Basic brush strokes"
                ]
            },
            {
                category: "Coordination",
                difficulty: "B2",
                topics: [
                    "Independence exercises",
                    "Comping patterns",
                    "Basic jazz fills",
                    "Brush pattern development"
                ]
            },
            {
                category: "Intermediate jazz",
                difficulty: "I1",
                topics: [
                    "Advanced comping",
                    "Soloing concepts",
                    "Trading fours",
                    "Different feel applications"
                ]
            },
            {
                category: "Advanced concepts",
                difficulty: "A",
                topics: [
                    "Polyrhythmic independence",
                    "Odd-meter jazz",
                    "Extended solo development",
                    "Latin jazz techniques"
                ]
            }
        ]
    },
    {
        family: "Percussion",
        name: "Mallet Percussion",
        items: [
            {
                category: "Basic technique",
                difficulty: "B1",
                topics: [
                    "Mallet grip fundamentals",
                    "Stroke types and control",
                    "Basic scales and patterns",
                    "Reading practice"
                ]
            },
            {
                category: "Four-mallet technique",
                difficulty: "I1",
                topics: [
                    "Stevens grip basics",
                    "Burton grip introduction",
                    "Interval control",
                    "Basic four-mallet patterns"
                ]
            },
            {
                category: "Repertoire approaches",
                difficulty: "I2",
                topics: [
                    "Bach transcriptions",
                    "Contemporary solo works",
                    "Chamber music techniques",
                    "Orchestra excerpt study"
                ]
            },
            {
                category: "Vibraphone jazz",
                difficulty: "A",
                topics: [
                    "Chord voicings",
                    "Dampening techniques",
                    "Pedaling concepts",
                    "Jazz improvisation techniques"
                ]
            }
        ]
    },
    
    // GUITAR AND BASS
    {
        family: "Guitar",
        name: "Guitar (Classical)",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Right hand fingerstyle technique",
                    "Left hand finger patterns",
                    "Nail shape and tone production",
                    "Basic posture and instrument position"
                ]
            },
            {
                category: "Core technique",
                difficulty: "B2",
                topics: [
                    "Major/minor scales and arpeggios",
                    "Rest stroke vs. free stroke",
                    "Slur technique (hammer-ons, pull-offs)",
                    "Basic sight-reading practice"
                ]
            },
            {
                category: "Repertoire",
                difficulty: "mixed",
                topics: [
                    "Renaissance repertoire",
                    "Baroque repertoire",
                    "Classical period repertoire",
                    "Romantic repertoire"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "A",
                topics: [
                    "Tremolo technique",
                    "Rasgueado technique",
                    "20th century techniques",
                    "Contemporary repertoire"
                ]
            }
        ]
    },
    {
        family: "Guitar",
        name: "Guitar (Electric/Rock)",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Basic chord shapes",
                    "Pick technique fundamentals",
                    "Simple scale patterns",
                    "Power chord technique"
                ]
            },
            {
                category: "Intermediate technique",
                difficulty: "I1",
                topics: [
                    "Pentatonic scale applications",
                    "String bending technique",
                    "Hammer-on and pull-off patterns",
                    "Basic improvisation concepts"
                ]
            },
            {
                category: "Lead guitar",
                difficulty: "I2",
                topics: [
                    "Advanced scales (modes)",
                    "Economy picking",
                    "Sweep picking introduction",
                    "Phrasing development"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "A",
                topics: [
                    "Tapping techniques",
                    "Sweep arpeggios",
                    "Advanced legato playing",
                    "Speed and accuracy development"
                ]
            }
        ]
    },
    {
        family: "Bass Guitar",
        name: "Electric Bass",
        items: [
            {
                category: "Fundamentals",
                difficulty: "B1",
                topics: [
                    "Right hand technique (fingers/pick)",
                    "Left hand positioning",
                    "Basic scale patterns",
                    "Simple groove playing"
                ]
            },
            {
                category: "Groove development",
                difficulty: "B2",
                topics: [
                    "Root-fifth patterns",
                    "Eighth note bass lines",
                    "Simple walking patterns",
                    "Major/minor arpeggios"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "I2",
                topics: [
                    "Slap and pop technique",
                    "Tapping approaches",
                    "Harmonics utilization",
                    "Advanced walking bass"
                ]
            },
            {
                category: "Styles",
                difficulty: "mixed",
                topics: [
                    "Rock and pop bass lines",
                    "Jazz bass concepts",
                    "Funk and R&B patterns",
                    "Latin bass techniques"
                ]
            }
        ]
    },
    {
        family: "Bass Guitar",
        name: "Jazz Bass",
        items: [
            {
                category: "Walking Bass Fundamentals",
                difficulty: "B2", // Beginner (Developing)
                topics: [
                    "Root-Fifth-Octave patterns",
                    "Scale-based walking lines",
                    "Chromatic approach notes",
                    "Basic II-V-I lines"
                ]
            },
            {
                category: "Jazz Harmony & Theory",
                difficulty: "I1", // Intermediate (Foundation)
                topics: [
                    "Understanding chord symbols",
                    "Guide tone lines",
                    "Chord scale relationships",
                    "Common jazz progressions (Blues, Rhythm Changes)"
                ]
            },
            {
                category: "Style & Feel",
                difficulty: "I1",
                topics: [
                    "Swing feel fundamentals",
                    "Latin jazz bass patterns (Bossa, Samba)",
                    "Syncopation exercises",
                    "Playing 'in the pocket'"
                ]
            },
            {
                category: "Improvisation Basics",
                difficulty: "I2", // Intermediate (Advanced)
                topics: [
                    "Arpeggio-based solos",
                    "Using pentatonic scales",
                    "Call and response phrasing",
                    "Soloing over blues changes"
                ]
            },
            {
                category: "Advanced Concepts",
                difficulty: "A", // Advanced
                topics: [
                    "Advanced walking bass lines (substitutions, passing chords)",
                    "Modal jazz improvisation",
                    "Odd meter playing",
                    "Chord melody basics on bass"
                ]
            }
        ]
    },
    
    // VOICE
    {
        family: "Voice",
        name: "Voice (Classical)",
        items: [
            {
                category: "Fundamental skills",
                difficulty: "B1",
                topics: [
                    "Breath support exercises",
                    "Vowel formation and modification",
                    "Posture and alignment",
                    "Basic vocal warm-ups"
                ]
            },
            {
                category: "Vocal technique",
                difficulty: "B2",
                topics: [
                    "Resonance development",
                    "Vocal range extension",
                    "Legato line development",
                    "Register transition techniques"
                ]
            },
            {
                category: "Diction",
                difficulty: "I1",
                topics: [
                    "Italian diction exercises",
                    "German diction exercises",
                    "French diction exercises",
                    "English diction refinement"
                ]
            },
            {
                category: "Repertoire",
                difficulty: "mixed",
                topics: [
                    "Art song repertoire",
                    "Aria study",
                    "Recitative techniques",
                    "Ensemble singing"
                ]
            }
        ]
    },
    {
        family: "Voice",
        name: "Voice (Contemporary)",
        items: [
            {
                category: "Fundamental technique",
                difficulty: "B1",
                topics: [
                    "Breath support basics",
                    "Mic technique essentials",
                    "Basic warm-up routines",
                    "Pitch accuracy exercises"
                ]
            },
            {
                category: "Style development",
                difficulty: "B2",
                topics: [
                    "Pop vocal styling",
                    "Rock voice techniques",
                    "R&B runs and riffs",
                    "Country twang development"
                ]
            },
            {
                category: "Advanced techniques",
                difficulty: "I2",
                topics: [
                    "Belt technique",
                    "Mix voice development",
                    "Vocal effects (distortion, growl)",
                    "Extended range techniques"
                ]
            },
            {
                category: "Performance skills",
                difficulty: "A",
                topics: [
                    "Vocal improvisation",
                    "Stage presence",
                    "Microphone techniques",
                    "Stylistic authenticity"
                ]
            }
        ]
    },
    {
        family: "Guitar",
        name: "Jazz Guitar",
        items: [
            {
                category: "Comping Fundamentals",
                difficulty: "B2",
                topics: [
                    "Basic jazz chord voicings (Maj7, min7, Dom7)",
                    "Shell voicings",
                    "Common comping rhythms (Charleston, Swing)",
                    "II-V-I progressions"
                ]
            },
            {
                category: "Single Note Lines & Theory",
                difficulty: "I1",
                topics: [
                    "Major scale modes for improvisation",
                    "Minor scale modes (Dorian, Aeolian)",
                    "Arpeggio studies",
                    "Guide tone lines over changes"
                ]
            },
            {
                category: "Chord Melody Basics",
                difficulty: "I1",
                topics: [
                    "Harmonizing simple melodies",
                    "Drop 2 and Drop 3 voicings",
                    "Walking bass lines with chords",
                    "Chord melody arrangements of standards"
                ]
            },
            {
                category: "Improvisation Techniques",
                difficulty: "I2",
                topics: [
                    "Bebop scales and vocabulary",
                    "Using tensions (9, 11, 13)",
                    "Soloing over Blues and Rhythm Changes",
                    "Developing melodic phrasing"
                ]
            },
             {
                category: "Advanced Harmony & Comping",
                difficulty: "A",
                topics: [
                    "Quartal harmony voicings",
                    "Chord substitutions (tritone sub, etc.)",
                    "Advanced comping rhythms",
                    "Modal comping approaches"
                ]
            }
        ]
    }
];

// Global state for expanded categories
let expandedCategories = {};

/**
 * Initialize the Resources page
 */
function initializeResources() {
    console.log('[DEBUG Resources] Initializing Resources page...');
    const searchInput = document.getElementById('resource-search');
    const familyFilterButtons = document.querySelectorAll('.resource-filters .filter-btn');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const categoriesContainer = document.getElementById('practice-categories-container');
    // Get the action buttons
    const howToUseBtn = document.getElementById('resources-how-to-use-btn');
    const howToPracticeBtn = document.getElementById('how-to-practice-btn');
    const exploreResourcesBtn = document.getElementById('explore-resources-btn');

    // Check for all essential elements, including the buttons
    if (!searchInput || !familyFilterButtons.length || !difficultyFilter || !categoriesContainer || !howToUseBtn || !howToPracticeBtn || !exploreResourcesBtn) {
        console.error('[DEBUG Resources] One or more essential elements not found for Resources page initialization (including action buttons).');
        return;
    }

    // Display initial categories
    displayPracticeCategories();

    // Filter event listeners
    searchInput.addEventListener('input', displayPracticeCategories);
    difficultyFilter.addEventListener('change', displayPracticeCategories);

    familyFilterButtons.forEach(button => {
        button.addEventListener('click', () => {
            familyFilterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            displayPracticeCategories();
        });
    });

    // --- Add Listeners for the Action Buttons --- 
    howToUseBtn.addEventListener('click', () => {
        if (window.UserGuide && typeof window.UserGuide.showUserGuide === 'function') {
             window.UserGuide.showUserGuide();
        } else {
             console.error('UserGuide.showUserGuide function not found.');
             alert('Could not open User Guide.');
        }
    });
    
    howToPracticeBtn.addEventListener('click', () => {
        if (window.UserGuide && typeof window.UserGuide.showHowToPracticeGuide === 'function') {
            window.UserGuide.showHowToPracticeGuide();
        } else {
            console.error('UserGuide.showHowToPracticeGuide function not found.');
            alert('Could not open How to Practice guide.');
        }
    });

    exploreResourcesBtn.addEventListener('click', () => {
        if (window.PracticeResourceFinder && typeof window.PracticeResourceFinder.show === 'function') {
            window.PracticeResourceFinder.show();
        } else {
            console.error('PracticeResourceFinder.show function not found.');
            alert('Could not open Resource Finder.');
        }
    });
    // --- End Action Button Listeners --- 

    console.log('[DEBUG Resources] Resources initialized.');
}

/**
 * Display practice categories based on current filters
 */
function displayPracticeCategories() {
    const container = document.getElementById('practice-categories-container');
    const searchInput = document.getElementById('resource-search');
    const difficultyFilter = document.getElementById('difficulty-filter');
    const activeFamilyButton = document.querySelector('.resource-filters .filter-btn.active');

    if (!container || !searchInput || !difficultyFilter || !activeFamilyButton) return;

    const searchTerm = searchInput.value.toLowerCase().trim();
    const selectedDifficulty = difficultyFilter.value;
    const selectedFamily = activeFamilyButton.dataset.family;

    console.log(`[DEBUG Resources Display] Filtering - Search: '${searchTerm}', Difficulty: ${selectedDifficulty}, Family: ${selectedFamily}`);

    container.innerHTML = ''; // Clear previous content
    let foundItems = false;

    // Filter and Sort practiceCategories before iterating
    const categoriesToDisplay = practiceCategories
        .filter(instrument => selectedFamily === 'all' || instrument.family === selectedFamily)
        .sort((a, b) => {
            // First sort by family name
            if (a.family < b.family) return -1;
            if (a.family > b.family) return 1;
            // Then sort by instrument name within the family
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
        });

    categoriesToDisplay.forEach(instrument => {
        // Filter instrument items based on difficulty and search term
        const filteredItems = instrument.items.filter(item => {
            // Ensure case-insensitive comparison for difficulty
            const difficultyMatch = selectedDifficulty === 'all' || 
                                (item.difficulty && item.difficulty.toLowerCase() === selectedDifficulty);
            
            if (selectedDifficulty !== 'all') {
                console.log(`[DEBUG Difficulty Filter] Item: ${item.category}, Item Difficulty: ${item.difficulty}, Selected: ${selectedDifficulty}, Match: ${difficultyMatch}`);
            }
            const searchMatch = searchTerm === '' || 
                                instrument.name.toLowerCase().includes(searchTerm) ||
                                item.category.toLowerCase().includes(searchTerm) || 
                                item.topics.some(topic => topic.toLowerCase().includes(searchTerm));
            return difficultyMatch && searchMatch;
        });

        // If no items match after filtering, skip this instrument
        if (filteredItems.length === 0) {
            return;
        }
        
        foundItems = true; // Mark that we found something to display

        // Create instrument section
        const instrumentSection = document.createElement('section');
        instrumentSection.className = 'instrument-section card'; // Add card class
        instrumentSection.innerHTML = `<h3>${instrument.name} (${instrument.family})</h3>`;

        filteredItems.forEach(item => {
            const categoryId = `${instrument.name}-${item.category}`.replace(/\s+/g, '-'); // Unique ID
            const isExpanded = expandedCategories[categoryId] || false;

            const categoryElement = document.createElement('div');
            categoryElement.className = 'category-item';
            
            const difficultyColor = getDifficultyColor(item.difficulty);
            const difficultyText = getDifficultyText(item.difficulty);

            categoryElement.innerHTML = `
                <div class="category-header" data-category-id="${categoryId}">
                    <div class="category-info">
                        <h4>${item.category}</h4>
                        <span class="difficulty-tag" style="background-color: ${difficultyColor};">
                            ${difficultyText}
                        </span>
                    </div>
                    <button class="expand-btn">
                        <i data-lucide="${isExpanded ? 'chevron-up' : 'chevron-down'}"></i>
                    </button>
                </div>
                <div class="topics-grid ${isExpanded ? '' : 'hidden'}">
                    ${item.topics.map(topic => `
                        <div class="topic-item">
                            <span>${topic}</span>
                            <button class="add-topic-btn" data-topic="${topic}" title="Add to my practice categories">
                                <i data-lucide="plus-circle"></i>
                            </button>
                        </div>
                    `).join('')}
                </div>
            `;
            instrumentSection.appendChild(categoryElement);
        });
        container.appendChild(instrumentSection);
    });

    // Show empty state if no items were found across all instruments
    if (!foundItems) {
        container.innerHTML = '<div class="empty-state">No resources match your current filters.</div>';
    }

    // Add event listeners for new elements
    addDynamicEventListeners(container);
    
    // Initialize Lucide icons for the new elements
    if (window.lucide) {
        window.lucide.createIcons({ context: container });
    }
}

/**
 * Add event listeners to dynamically created elements (expand buttons, add buttons)
 * @param {HTMLElement} container - The container holding the dynamic content
 */
function addDynamicEventListeners(container) {
    // Expand/Collapse buttons
    container.querySelectorAll('.category-header .expand-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation(); // Prevent header click if needed
            const header = button.closest('.category-header');
            const categoryId = header.dataset.categoryId;
            expandedCategories[categoryId] = !expandedCategories[categoryId]; // Toggle state
            displayPracticeCategories(); // Re-render to reflect changes
        });
    });

    // Add Topic buttons
    container.querySelectorAll('.add-topic-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            const topic = button.dataset.topic;
            handleAddCategoryFromResource(topic); // Call the renamed handler function
        });
    });
}

/**
 * Handles adding a topic from the resources page to the user's categories
 * @param {string} topic - The topic string to add
 */
function handleAddCategoryFromResource(topic) { // Renamed function
  console.log('[Resources] handleAddCategoryFromResource called for:', topic); // Updated log prefix

  // --- Add check for undefined topic --- 
  if (topic === undefined || topic === null) {
      console.error('[Resources] handleAddCategoryFromResource called with invalid topic:', topic);
      alert('Error: Could not determine topic to add.');
      return; // Prevent adding undefined
  }
  // --- End check ---

  // Create a basic category object
  const newCategory = {
      id: `custom_${Date.now()}`,
      name: topic,
      // Add other properties if your category object needs them (e.g., color, isDefault)
      // family: 'Custom', // Example: You might want to assign a family
      isDefault: false
  };

  try {
      // Use data layer to add the category
      if (window.addItem) {
          window.addItem('CATEGORIES', newCategory);
          console.log('[DEBUG Resources] Category added via window.addItem:', newCategory);
          
          // Trigger dropdown updates across the app
          if (window.updateCategoryDropdowns) {
              window.updateCategoryDropdowns();
              console.log('[DEBUG Resources] Called window.updateCategoryDropdowns()');
          } else {
               console.warn('[DEBUG Resources] window.updateCategoryDropdowns function not found.');
          }

          // Optional: Show success feedback (can replace alert)
          if (window.showNotification) {
             window.showNotification('Category Added', `"${topic}" added to your practice categories.`);
          } else {
             alert(`"${topic}" added to your practice categories!`);
          }

      } else {
          console.error('[DEBUG Resources] window.addItem function not found. Cannot add category.');
          alert('Error: Could not add category. Data layer missing.');
      }
  } catch (error) {
       console.error('[DEBUG Resources] Error adding category:', error);
       alert('An error occurred while adding the category.');
  }
}

// Function to get display text for difficulty
function getDifficultyText(difficultyCode) {
    if (!difficultyCode) return "Mixed";
    
    const code = difficultyCode.toString().toLowerCase();
    if (code.includes('b1')) return "Beginner (Foundation)";
    if (code.includes('b2')) return "Beginner (Developing)";
    if (code.includes('beginner')) return "Beginner";
    if (code.includes('i1')) return "Intermediate (Foundation)";
    if (code.includes('i2')) return "Intermediate (Advanced)";
    if (code.includes('inter')) return "Intermediate";
    if (code.includes('a')) return "Advanced";
    if (code.includes('adv')) return "Advanced";
    if (code.includes('mixed')) return "All Levels";
    return "Mixed Levels";
}

// Function to get color for difficulty level
function getDifficultyColor(difficulty) {
    if (!difficulty) return "#777";
    
    const level = difficulty.toString().toLowerCase();
    if (level.includes('b1') || level.includes('beginner')) return "#4caf50";
    if (level.includes('b2') || level.includes('begin')) return "#8bc34a";
    if (level.includes('i1') || level.includes('inter')) return "#ff9800";
    if (level.includes('i2')) return "#f57c00";
    if (level.includes('a') || level.includes('adv')) return "#e91e63";
    return "#2196f3"; // Default for mixed or undefined
}

// Expose necessary functions globally if needed (initializeResources is likely called from app.js)
window.initializeResources = initializeResources;