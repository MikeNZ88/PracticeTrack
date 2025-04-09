// js/categories.js - New Resources Implementation

// State for expanded categories/skills
let expandedResourceCategories = new Set();
let expandedResourceSkillGroups = new Set();

// Comprehensive Practice Data
const practiceData = [
    // GUITAR PRACTICE CATEGORIES
    {
        family: "Guitar",
        name: "Guitar (Technique)",
        items: [
            {
                category: "Picking Technique Development",
                topics: [
                    "Single-string chromatic runs",
                    "String crossing patterns",
                    "Spider exercises",
                    "Paul Gilbert's 'Intense Rock' patterns",
                    "Three-note-per-string scale practice",
                    "Economy picking patterns",
                    "Cross picking exercises",
                    "Hybrid picking drills",
                    "Tremolo picking exercises",
                    "Sweep picking arpeggios"
                ]
            },
            {
                category: "Fretting Hand Development",
                topics: [
                    "Hammer-on and pull-off sequences",
                    "Legato scale runs",
                    "String skipping legato patterns",
                    "Legato trills at increasing speeds",
                    "Position shifting exercises",
                    "Barre chord transition drills",
                    "Slide technique exercises",
                    "Bend accuracy drills",
                    "Vibrato development exercises",
                    "Tapping exercises",
                    "Muting technique drills"
                ]
            },
            {
                category: "Rhythm Guitar Practice",
                topics: [
                    "16th note strumming patterns",
                    "Muted 16th note funk patterns",
                    "Syncopated rhythm exercises",
                    "Metronome displacement exercises",
                    "Strumming with dynamic control",
                    "Odd meter strumming practice",
                    "Reggae upstroke pattern practice",
                    "Palm muting rhythm exercises",
                    "Accent pattern drills",
                    "Polyrhythm strumming exercises"
                ]
            },
            {
                category: "Special Techniques Practice",
                topics: [
                    "Natural harmonics exercises",
                    "Pinch harmonic drills",
                    "Volume swell exercises",
                    "Whammy bar control drills",
                    "Slide guitar exercises",
                    "Fingerstyle pattern practice",
                    "Classical right-hand (p-i-m-a) drills",
                    "Rasgueado technique exercises",
                    "Artificial harmonics practice",
                    "Behind-the-nut bending exercises"
                ]
            },
            {
                category: "Guitar Theory Application",
                topics: [
                    "Fretboard note mapping drills",
                    "Chord construction exercises",
                    "Scale position practice",
                    "Mode application with backing tracks",
                    "Key signature exercises",
                    "Chord progression drills",
                    "Cadence identification and playing",
                    "Modulation exercises",
                    "Interval identification on fretboard",
                    "Diatonic chord sequence practice"
                ]
            },
            {
                category: "Guitar Repertoire & Performance",
                topics: [
                    "Style-specific playing exercises",
                    "Song memorization drills",
                    "Transcription practice sessions",
                    "Sight-reading exercises",
                    "Performance prep run-throughs",
                    "Band context simulation",
                    "Solo analysis and recreation",
                    "Backing track play-along sessions",
                    "Cover song learning exercises",
                    "Performance anxiety management drills"
                ]
            },
            {
                category: "Jazz Guitar Practice",
                topics: [
                    "Shell voicing exercises",
                    "II-V-I progression practice",
                    "Walking bass with chords",
                    "Chord melody arrangements",
                    "Guide tone line exercises",
                    "Jazz articulation studies",
                    "Bebop scale practice",
                    "Modal jazz comping patterns",
                    "Rhythmic comping variations",
                    "Jazz blues improvisation"
                ]
            }
        ]
    },
    {
        family: "Guitar",
        name: "Guitar (Theory)",
        items: [
            {
                category: "Fretboard Knowledge",
                topics: [
                    "Note mapping across all strings",
                    "Interval relationships on fretboard",
                    "CAGED system mastery",
                    "Octave patterns and positions",
                    "Finding notes in multiple positions",
                    "Three-notes-per-string patterns",
                    "Position shifts and connections"
                ]
            },
            {
                category: "Scales & Modes",
                topics: [
                    "Major scale in all positions",
                    "Natural minor scale patterns",
                    "Harmonic & melodic minor scales",
                    "Pentatonic scale positions",
                    "Modal scale patterns",
                    "Blues scale variations",
                    "Exotic and symmetric scales",
                    "Scale sequence exercises"
                ]
            },
            {
                category: "Chord Theory",
                topics: [
                    "Open chord construction",
                    "Barre chord principles",
                    "Extended chord voicings",
                    "Chord inversions across neck",
                    "Shell voicings for jazz",
                    "Drop 2 and Drop 3 voicings",
                    "Chord substitutions",
                    "Voice leading principles"
                ]
            },
            {
                category: "Harmony & Progression",
                topics: [
                    "Diatonic chord progressions",
                    "Common chord sequences",
                    "Secondary dominants",
                    "Modal interchange concepts",
                    "Jazz harmony fundamentals",
                    "Modulation techniques",
                    "Harmonic analysis skills",
                    "Reharmonization methods"
                ]
            }
        ]
    },
    {
        family: "Guitar",
        name: "Guitar (Improvisation)",
        items: [
            {
                category: "Rock & Blues Improvisation",
                topics: [
                    "Pentatonic scale soloing",
                    "Blues scale applications",
                    "Rock phrasing techniques",
                    "Blues turnaround licks",
                    "String bending accuracy",
                    "Rhythmic development",
                    "Call and response patterns",
                    "Solo construction methods"
                ]
            },
            {
                category: "Jazz Improvisation",
                topics: [
                    "Chord-scale relationships",
                    "II-V-I progression soloing",
                    "Bebop scale practice",
                    "Guide tone lines",
                    "Chord tone soloing",
                    "Modal jazz concepts",
                    "Rhythm changes practice",
                    "Jazz blues improvisation"
                ]
            },
            {
                category: "Lead Guitar Development",
                topics: [
                    "Melodic minor applications",
                    "Arpeggio-based soloing",
                    "Speed and accuracy drills",
                    "Phrasing techniques",
                    "Hybrid picking leads",
                    "Sweep picking solos",
                    "Legato lead lines",
                    "Tapping integration"
                ]
            },
            {
                category: "Creative Expression",
                topics: [
                    "Motif development",
                    "Theme and variation",
                    "Dynamic control",
                    "Melodic composition",
                    "Improvising over changes",
                    "Outside playing concepts",
                    "Rhythmic variation",
                    "Solo arrangement skills"
                ]
            }
        ]
    },

    // GUITAR REPERTOIRE
    {
        family: "Guitar",
        name: "Guitar (Repertoire & Styles)",
        items: [
            {
                category: "Classical Guitar Repertoire",
                topics: [
                    "Renaissance & Baroque pieces (Dowland, Bach)",
                    "Classical period works (Sor, Carcassi, Aguado)",
                    "Romantic repertoire (Tarrega, Llobet)",
                    "20th century compositions (Villa-Lobos, Brouwer)",
                    "Contemporary classical guitar works"
                ]
            },
            {
                category: "Rock & Pop Repertoire",
                topics: [
                    "Classic rock song studies",
                    "Pop guitar accompaniment patterns",
                    "Iconic guitar solos transcription",
                    "Rhythm guitar styles across decades",
                    "Alternative/indie guitar techniques"
                ]
            },
            {
                category: "Blues & Jazz Repertoire",
                topics: [
                    "Delta blues fingerstyle pieces",
                    "Chicago blues standards",
                    "Jazz standards chord melody arrangements",
                    "Great American Songbook studies",
                    "Bebop and swing guitar repertoire"
                ]
            },
            {
                category: "Metal & Progressive Repertoire",
                topics: [
                    "Heavy metal rhythm playing techniques",
                    "Thrash/speed metal studies",
                    "Progressive metal composition techniques",
                    "Djent and modern metal approaches",
                    "Technical death metal patterns"
                ]
            },
            {
                category: "Folk & Acoustic Styles",
                topics: [
                    "Fingerstyle folk patterns",
                    "Travis picking repertoire",
                    "Celtic guitar arrangements",
                    "American primitive guitar (Fahey-style)",
                    "Singer-songwriter accompaniment styles"
                ]
            }
        ]
    },

    // BASS GUITAR PRACTICE CATEGORIES
    {
        family: "Bass Guitar",
        name: "Bass Guitar (Technique)",
        items: [
            {
                category: "Right-Hand Technique",
                topics: [
                    "Alternating finger exercises",
                    "String crossing coordination drills",
                    "Right-hand finger independence patterns",
                    "Muted note exercises",
                    "Ghost note incorporation drills",
                    "Pick playing exercises",
                    "Slap technique fundamental drills",
                    "Pop technique isolation exercises",
                    "Combined slap and pop patterns",
                    "Thumb technique development",
                    "Three-finger technique exercises",
                    "Double thumbing practice"
                ]
            },
            {
                category: "Left-Hand Bass Technique",
                topics: [
                    "One-finger-per-fret exercises",
                    "Position shifting drills",
                    "Left-hand muting exercises",
                    "Hammer-on and pull-off sequences",
                    "String crossing with minimal movement",
                    "Slides and glissando exercises",
                    "Vibrato technique drills",
                    "Harmonics practice",
                    "Left-hand speed building exercises",
                    "Fretless intonation exercises"
                ]
            },
            {
                category: "Groove Development",
                topics: [
                    "Eighth note groove lock exercises",
                    "16th note variations with accent patterns",
                    "Syncopation exercises against a steady beat",
                    "Note length and articulation variations",
                    "Ahead/behind the beat feel exercises",
                    "Metronome practice with subdivisions",
                    "Playing 'in the pocket' exercises",
                    "Rhythmic variation drills",
                    "Ghost note incorporation in grooves",
                    "Dynamic groove exercises"
                ]
            },
            {
                category: "Bass-Specific Skills",
                topics: [
                    "Chord tone targeting drills",
                    "Walking bass line construction exercises",
                    "Arpeggio exercises through chord progressions",
                    "Scale patterns through different keys",
                    "Modal bass line construction",
                    "Voice leading exercises",
                    "Bass pattern recognition exercises",
                    "Bass line transcription drills",
                    "Root movement identification exercises",
                    "Harmony identification from bass perspective"
                ]
            },
            {
                category: "Style-Specific Bass Practice",
                topics: [
                    "R&B/Soul groove construction exercises",
                    "Jazz walking bass pattern drills",
                    "Funk 16th note pattern exercises",
                    "Latin bass pattern exercises",
                    "Rock/metal gallop pattern drills",
                    "Reggae one-drop pattern practice",
                    "Motown-style bass line exercises",
                    "Country bass technique drills",
                    "Afrobeat bass pattern exercises",
                    "Gospel bass run practice"
                ]
            },
            {
                category: "Jazz Bass Practice",
                topics: [
                    "Root-Fifth-Octave patterns",
                    "Guide tone line exercises",
                    "Swing feel practice",
                    "ii-V-I walking patterns",
                    "Blues walking bass lines",
                    "Latin jazz bass patterns",
                    "Bass solo construction",
                    "Chord substitution applications",
                    "Rhythmic anticipation exercises",
                    "Contour line development"
                ]
            }
        ]
    },

    // BASS GUITAR THEORY
    {
        family: "Bass Guitar",
        name: "Bass Guitar (Theory)",
        items: [
            {
                category: "Fretboard Knowledge",
                topics: [
                    "Naming notes on all strings",
                    "Finding octaves across the neck",
                    "Identifying intervals visually",
                    "Mapping scale patterns (e.g., CAGED)",
                    "Understanding note relationships"
                ]
            },
            {
                category: "Scales & Modes",
                topics: [
                    "Major scale construction & patterns",
                    "Natural, harmonic, melodic minor scales",
                    "Pentatonic scales (major/minor)",
                    "Blues scale variations",
                    "Modes of the major scale (Ionian, Dorian, etc.)",
                    "Modes of melodic minor",
                    "Symmetrical scales (diminished, whole tone)"
                ]
            },
            {
                category: "Chords & Harmony",
                topics: [
                    "Triad construction (major, minor, dim, aug)",
                    "Seventh chord construction (maj7, min7, dom7, m7b5, dim7)",
                    "Extended chords (9ths, 11ths, 13ths)",
                    "Chord inversions",
                    "Voice leading principles",
                    "Diatonic harmony (chords in a key)",
                    "Secondary dominants",
                    "Borrowed chords / Modal interchange"
                ]
            },
            {
                category: "Rhythm & Meter",
                topics: [
                    "Note values and rests",
                    "Time signatures (simple, compound, odd)",
                    "Syncopation patterns",
                    "Polyrhythms",
                    "Metric modulation concepts"
                ]
            }
        ]
    },

    // BASS GUITAR IMPROVISATION
    {
        family: "Bass Guitar",
        name: "Bass Guitar (Improvisation)",
        items: [
            {
                category: "Improvisation Basics",
                topics: [
                    "Scales and modes exploration",
                    "Chord substitution and voice leading",
                    "Basic blues and jazz patterns",
                    "Improvising over a known chord progression",
                    "Creating a bass line from a melody"
                ]
            },
            {
                category: "Advanced Improvisation Techniques",
                topics: [
                    "Harmonic minor and melodic minor scales",
                    "Modes of the major scale",
                    "Pentatonic and blues scales",
                    "Chromatic and diatonic passing tones",
                    "Improvising over altered scales and modes"
                ]
            },
            {
                category: "Jazz Improvisation",
                topics: [
                    "II-V-I progression practice",
                    "Walking bass lines",
                    "Chord melody arrangements",
                    "Improvising over a jazz standard",
                    "Creating a solo bass line"
                ]
            },
            {
                category: "Blues Improvisation",
                topics: [
                    "Basic blues scale and pattern practice",
                    "Improvising over a blues chord progression",
                    "Creating a solo bass line",
                    "Blues licks and phrases",
                    "Improvising over a simple blues progression"
                ]
            },
            {
                category: "Rock Improvisation",
                topics: [
                    "Improvising over a rock chord progression",
                    "Creating a solo bass line",
                    "Rock licks and phrases",
                    "Improvising over a simple rock progression",
                    "Rock bass patterns and fills"
                ]
            },
            {
                category: "Reggae Improvisation",
                topics: [
                    "Reggae bass line construction",
                    "Improvising over a reggae chord progression",
                    "Creating a solo bass line",
                    "Reggae licks and phrases",
                    "Improvising over a simple reggae progression"
                ]
            },
            {
                category: "Fusion Improvisation",
                topics: [
                    "Improvising over a fusion chord progression",
                    "Creating a solo bass line",
                    "Fusion licks and phrases",
                    "Improvising over a simple fusion progression",
                    "Fusion bass patterns and fills"
                ]
            },
            {
                category: "Improvisation with Chord Symbols",
                topics: [
                    "Improvising over a chord symbol progression",
                    "Creating a solo bass line",
                    "Chord symbol licks and phrases",
                    "Improvising over a simple chord symbol progression",
                    "Chord symbol patterns and fills"
                ]
            }
        ]
    },

    // BASS GUITAR REPERTOIRE
    {
        family: "Bass Guitar",
        name: "Bass Guitar (Repertoire & Styles)",
        items: [
            {
                category: "Rock Bass Repertoire",
                topics: [
                    "Classic rock bass line studies (Led Zeppelin, Pink Floyd)",
                    "Progressive rock bass techniques (Rush, Yes)",
                    "Alternative/grunge bass lines (RHCP, Nirvana)",
                    "Hard rock & metal bass styles (Iron Maiden, Metallica)",
                    "Modern rock bass approaches"
                ]
            },
            {
                category: "Funk & R&B Bass Repertoire",
                topics: [
                    "Slap bass classics (Sly & Family Stone, RHCP)",
                    "Motown bass line studies (James Jamerson)",
                    "70s funk bass grooves (Parliament, Earth Wind & Fire)",
                    "90s R&B bass techniques (D'Angelo, Erykah Badu)",
                    "Neo-soul bass approaches"
                ]
            },
            {
                category: "Jazz Bass Repertoire",
                topics: [
                    "Walking bass standards repertoire",
                    "Modal jazz bass lines (Miles Davis, John Coltrane)",
                    "Bebop bass techniques (Charlie Parker tunes)",
                    "Latin jazz basslines (Jobim standards)",
                    "Contemporary jazz bass approaches"
                ]
            },
            {
                category: "World Music Bass Styles",
                topics: [
                    "Reggae & dub bass repertoire (Bob Marley, Lee Perry)",
                    "Afrobeat bass studies (Fela Kuti)",
                    "Latin American bass patterns (salsa, cumbia)",
                    "African bass techniques (soukous, highlife)",
                    "Caribbean groove studies"
                ]
            },
            {
                category: "Pop & Session Bass Styles",
                topics: [
                    "Top 40 pop bass techniques",
                    "Country bass lines and patterns",
                    "Studio session approaches",
                    "Arrangement-focused bass playing",
                    "Contemporary production-style bass"
                ]
            }
        ]
    },

    // KEYBOARD/PIANO PRACTICE CATEGORIES
    {
        family: "Keyboard",
        name: "Piano (Technique)",
        items: [
            {
                category: "Technical Development",
                topics: [
                    "Hanon exercises",
                    "Czerny studies",
                    "Contrary motion scale exercises",
                    "Finger independence exercises",
                    "Trill development exercises",
                    "Major and minor scales practice",
                    "Scales in thirds, sixths, and tenths",
                    "Arpeggio exercises",
                    "Broken chord pattern exercises",
                    "Hand crossing exercises",
                    "Octave technique practice",
                    "Glissando technique exercises"
                ]
            },
            {
                category: "Touch and Articulation",
                topics: [
                    "Staccato vs. legato comparison exercises",
                    "Pedaling technique exercises",
                    "Dynamic control exercises",
                    "Articulation variation exercises",
                    "Voicing exercises",
                    "Legato playing exercises",
                    "Staccato control exercises",
                    "Dynamics gradient practice",
                    "Sustain pedal exercises",
                    "Voice balancing in polyphonic playing"
                ]
            },
            {
                category: "Rhythm and Timing",
                topics: [
                    "Metronome practice exercises",
                    "Polyrhythm exercises",
                    "Hand independence with different rhythms",
                    "Syncopation exercises",
                    "Rhythmic accuracy drills",
                    "Odd meter exercises",
                    "Subdividing practice",
                    "Swing feel exercises",
                    "Latin rhythm pattern practice",
                    "Rhythmic coordination exercises"
                ]
            },
            {
                category: "Piano Music Theory Application",
                topics: [
                    "Key signature and circle of fifths exercises",
                    "Chord construction exercises",
                    "Scale theory application",
                    "Harmonic analysis exercises",
                    "Modulation technique exercises",
                    "Form analysis exercises",
                    "Chord progression drills",
                    "Interval studies",
                    "Sight harmony exercises",
                    "Chord function application"
                ]
            },
            {
                category: "Reading Skills Development",
                topics: [
                    "Staff reading exercises (treble and bass clefs)",
                    "Chord chart interpretation exercises",
                    "Lead sheet reading exercises",
                    "Sight-reading progressive exercises",
                    "Grand staff reading speed drills",
                    "Score reduction exercises",
                    "Rhythm reading exercises",
                    "Chord symbol reading drills",
                    "Sight-reading with metronome",
                    "One-handed sight-reading exercises"
                ]
            },
            {
                category: "Style-Specific Piano Skills",
                topics: [
                    "Classical technique exercises",
                    "Jazz voicing exercises",
                    "Pop and rock keyboard part exercises",
                    "Gospel and church technique exercises",
                    "Stride piano exercises",
                    "Boogie-woogie pattern exercises",
                    "Baroque ornamentation exercises",
                    "Romantic style expressive exercises",
                    "New age piano technique exercises",
                    "Film score style exercises"
                ]
            },
            {
                category: "Organ Technique",
                topics: [
                    "Manual technique exercises",
                    "Pedal technique exercises",
                    "Manual-pedal coordination drills",
                    "Registration practice",
                    "Hymn playing exercises",
                    "Baroque articulation studies",
                    "Trio sonata exercises",
                    "French toccata technique",
                    "Chorale prelude interpretation",
                    "Improvisation exercises"
                ]
            }
        ]
    },
    {
        family: "Keyboard",
        name: "Piano (Theory)",
        items: [
            {
                category: "Keyboard Fundamentals",
                topics: [
                    "Note reading proficiency",
                    "Key signatures mastery",
                    "Rhythm reading skills",
                    "Interval recognition",
                    "Chord identification",
                    "Scale degree awareness",
                    "Musical terms and symbols",
                    "Basic form analysis"
                ]
            },
            {
                category: "Harmony Studies",
                topics: [
                    "Chord construction principles",
                    "Chord progressions analysis",
                    "Voice leading rules",
                    "Harmonic rhythm concepts",
                    "Modulation techniques",
                    "Secondary dominants",
                    "Extended harmonies",
                    "Contemporary harmony"
                ]
            },
            {
                category: "Advanced Theory",
                topics: [
                    "Form and analysis",
                    "Counterpoint basics",
                    "20th century techniques",
                    "Jazz theory concepts",
                    "Modal harmony",
                    "Polytonality introduction",
                    "Contemporary techniques",
                    "Score analysis skills"
                ]
            },
            {
                category: "Composition Elements",
                topics: [
                    "Melodic writing",
                    "Harmonic progression",
                    "Rhythmic development",
                    "Texture exploration",
                    "Form and structure",
                    "Style composition",
                    "Theme and variation",
                    "Arranging techniques"
                ]
            }
        ]
    },
    {
        family: "Keyboard",
        name: "Piano (Improvisation)",
        items: [
            {
                category: "Jazz Piano Skills",
                topics: [
                    "Chord voicing techniques",
                    "Left hand comping patterns",
                    "Right hand melodic lines",
                    "Rhythmic comping styles",
                    "Modal improvisation",
                    "Blues improvisation",
                    "Standards repertoire",
                    "Solo piano arrangements"
                ]
            },
            {
                category: "Classical Improvisation",
                topics: [
                    "Figured bass realization",
                    "Cadenza development",
                    "Theme embellishment",
                    "Style improvisation",
                    "Ornament application",
                    "Period techniques",
                    "Free improvisation",
                    "Structure improvisation"
                ]
            },
            {
                category: "Contemporary Styles",
                topics: [
                    "Pop piano techniques",
                    "Rock style patterns",
                    "Gospel piano methods",
                    "Latin piano patterns",
                    "R&B keyboard style",
                    "Modern jazz concepts",
                    "Fusion approaches",
                    "Electronic elements"
                ]
            },
            {
                category: "Creative Development",
                topics: [
                    "Melodic improvisation",
                    "Harmonic exploration",
                    "Rhythmic variation",
                    "Texture creation",
                    "Sound painting",
                    "Free improvisation",
                    "Cross-genre fusion",
                    "Performance techniques"
                ]
            }
        ]
    },
    
    // KEYBOARD/PIANO REPERTOIRE
    {
        family: "Keyboard",
        name: "Piano (Repertoire & Styles)",
        items: [
            {
                category: "Classical Piano Repertoire",
                topics: [
                    "Baroque keyboard works (Bach, Scarlatti)",
                    "Classical sonatas (Mozart, Haydn, Beethoven)",
                    "Romantic piano pieces (Chopin, Schumann, Liszt)",
                    "Impressionist works (Debussy, Ravel)",
                    "20th century piano repertoire (Prokofiev, Bartók)"
                ]
            },
            {
                category: "Jazz Piano Repertoire",
                topics: [
                    "Jazz standards in various styles",
                    "Bebop piano repertoire",
                    "Modal jazz pieces",
                    "Latin jazz standards",
                    "Contemporary jazz piano works"
                ]
            },
            {
                category: "Popular & Contemporary",
                topics: [
                    "Pop song arrangements for piano",
                    "Film music transcriptions",
                    "Video game music adaptations",
                    "New age piano pieces",
                    "Contemporary crossover repertoire"
                ]
            },
            {
                category: "Blues & Roots Piano",
                topics: [
                    "Boogie-woogie standards",
                    "Blues piano classics",
                    "New Orleans piano styles",
                    "Ragtime repertoire",
                    "Gospel piano traditions"
                ]
            },
            {
                category: "Collaborative Piano",
                topics: [
                    "Vocal accompaniment repertoire",
                    "Instrumental sonatas with piano",
                    "Chamber music with piano",
                    "Concerto repertoire",
                    "Orchestral reductions"
                ]
            }
        ]
    },

    // DRUMS/PERCUSSION PRACTICE CATEGORIES
    {
        family: "Drums",
        name: "Drums (Technique)",
        items: [
            {
                category: "Stick Control",
                topics: [
                    "Single stroke roll exercises",
                    "Double stroke roll development",
                    "Paradiddle variations",
                    "Five-stroke roll exercises",
                    "Accent pattern exercises",
                    "Matched grip exercises",
                    "Traditional grip exercises",
                    "French grip exercises",
                    "German grip exercises",
                    "American grip exercises",
                    "Stick control pattern practice",
                    "Rebound control exercises"
                ]
            },
            {
                category: "Hand Technique Development",
                topics: [
                    "Single stroke exercises",
                    "Double stroke exercises",
                    "Paradiddle and rudiment practice",
                    "Roll exercises (single, double, press)",
                    "Ghost note exercises",
                    "Rim shot exercises",
                    "Cross sticking practice",
                    "Finger control exercises",
                    "Wrist technique exercises",
                    "Moeller technique drills",
                    "Brush technique exercises",
                    "Hand speed development"
                ]
            },
            {
                category: "Foot Technique Development",
                topics: [
                    "Bass drum technique exercises (heel up)",
                    "Bass drum technique exercises (heel down)",
                    "Hi-hat control exercises",
                    "Double bass technique exercises",
                    "Independence between feet exercises",
                    "Slide technique exercises",
                    "Bass drum speed exercises",
                    "Hi-hat splash technique exercises",
                    "Heel-toe technique drills",
                    "Foot ostinato exercises",
                    "Foot subdivisions exercise",
                    "Dynamic control with feet"
                ]
            },
            {
                category: "Coordination Development",
                topics: [
                    "Hand-to-hand independence exercises",
                    "Hand-to-foot independence exercises",
                    "Four-way coordination exercises",
                    "Polyrhythm exercises between limbs",
                    "Ostinato exercises",
                    "Linear pattern exercises",
                    "Odd grouping coordination exercises",
                    "Paradiddle orchestration exercises",
                    "Three-limb coordination exercises",
                    "Cross-rhythm coordination exercises",
                    "Independence with odd meters",
                    "Independence with dynamics"
                ]
            },
            {
                category: "Rhythm Theory Application",
                topics: [
                    "Time signature exercises",
                    "Subdivision exercises",
                    "Polyrhythm exercises",
                    "Metric modulation exercises",
                    "Odd time signature exercises",
                    "Clave pattern exercises",
                    "Rhythmic phrasing exercises",
                    "Displacement exercises",
                    "Augmentation/diminution exercises",
                    "Hemiola exercises",
                    "Tuplet exercises",
                    "Polymetric exercises"
                ]
            },
            {
                category: "Groove Development",
                topics: [
                    "Style-specific pattern exercises",
                    "Playing with a click exercises",
                    "Time feel variation exercises",
                    "Dynamic control within grooves",
                    "Groove variation exercises",
                    "Micro-timing adjustment exercises",
                    "Groove simplification exercises",
                    "Groove embellishment exercises",
                    "Backbeat placement exercises",
                    "Ghost note incorporation exercises",
                    "Hi-hat variation exercises",
                    "Bass drum pattern exercises"
                ]
            },
            {
                category: "Jazz Drumming Techniques",
                topics: [
                    "Ride cymbal pattern exercises",
                    "Comping exercises",
                    "Brush technique exercises",
                    "Trading fours practice",
                    "Jazz independence exercises",
                    "Bebop drumming patterns",
                    "Big band setup practice",
                    "Max Roach solo transcriptions",
                    "Latin jazz pattern practice",
                    "Jazz ballad brush patterns"
                ]
            },
            {
                category: "Mallet Percussion Techniques",
                topics: [
                    "Two-mallet technique exercises",
                    "Four-mallet Stevens grip exercises",
                    "Four-mallet Burton grip exercises",
                    "Scale patterns on marimba",
                    "Dampening technique exercises",
                    "One-handed roll exercises",
                    "Interval control exercises",
                    "Double lateral stroke patterns",
                    "Single independent stroke exercises",
                    "Vibraphone pedaling technique"
                ]
            }
        ]
    },

    // DRUMS GROOVE & STYLES
    {
        family: "Percussion",
        name: "Drums (Groove & Styles)",
        items: [
            {
                category: "Groove Development",
                topics: [
                    "Style-specific pattern exercises",
                    "Playing with a click exercises",
                    "Time feel variation exercises",
                    "Dynamic control within grooves",
                    "Groove variation exercises",
                    "Micro-timing adjustment exercises",
                    "Groove simplification exercises",
                    "Groove embellishment exercises",
                    "Backbeat placement exercises",
                    "Ghost note incorporation exercises",
                    "Hi-hat variation exercises",
                    "Bass drum pattern exercises"
                ]
            },
            {
                category: "Jazz Drumming Techniques",
                topics: [
                    "Ride cymbal pattern exercises",
                    "Comping exercises",
                    "Brush technique exercises",
                    "Trading fours practice",
                    "Jazz independence exercises",
                    "Bebop drumming patterns",
                    "Big band setup practice",
                    "Max Roach solo transcriptions",
                    "Latin jazz pattern practice",
                    "Jazz ballad brush patterns"
                ]
            }
        ]
    },

    // DRUMS IMPROVISATION
    {
        family: "Percussion",
        name: "Drums (Improvisation)",
        items: [
            {
                category: "Solo Development",
                topics: [
                    "Snare drum solo concepts",
                    "Full kit solo development",
                    "Theme and variation approaches",
                    "Motivic development for drums",
                    "Call and response patterns"
                ]
            },
            {
                category: "Style-Based Improvisation",
                topics: [
                    "Jazz soloing (trading fours, eights)",
                    "Rock drum solo techniques",
                    "Latin percussion improvisation",
                    "Free improvisation concepts",
                    "Fusion drumming improvisational approaches"
                ]
            },
            {
                category: "Responsive Playing",
                topics: [
                    "Comping for soloists",
                    "Dynamics-based improvisation",
                    "Textural improvisation techniques",
                    "Space and density concepts",
                    "Interactive ensemble improvisation"
                ]
            },
            {
                category: "Technical Approaches",
                topics: [
                    "Rudiment-based improvisation",
                    "Ostinato and improvisation",
                    "Polyrhythmic solo concepts",
                    "Linear drumming improvisation",
                    "Multi-percussion improvisation approaches"
                ]
            },
            {
                category: "Conceptual Frameworks",
                topics: [
                    "Melodic drumming concepts",
                    "Storytelling through drum solos",
                    "Form and structure in improvisation",
                    "Cross-rhythmic improvisation",
                    "Sound exploration techniques"
                ]
            }
        ]
    },

    // DRUMS REPERTOIRE & STYLES
    {
        family: "Percussion",
        name: "Drums (Repertoire & Styles)",
        items: [
            {
                category: "Rock & Pop Drums",
                topics: [
                    "Classic rock drum beats and fills",
                    "Pop drum patterns across decades",
                    "Alternative and indie rock drumming",
                    "Progressive rock drum repertoire",
                    "Modern rock drumming techniques"
                ]
            },
            {
                category: "Jazz Drumming Repertoire",
                topics: [
                    "Swing and bebop drumming patterns",
                    "Classic jazz standards drum approaches",
                    "Brushwork for jazz ballads",
                    "Big band drum charts",
                    "Contemporary jazz drumming"
                ]
            },
            {
                category: "World Percussion Styles",
                topics: [
                    "Afro-Cuban patterns and techniques",
                    "Brazilian percussion traditions",
                    "Indian tabla repertoire",
                    "African drumming patterns",
                    "Middle Eastern percussion styles"
                ]
            },
            {
                category: "Metal & Extreme Drumming",
                topics: [
                    "Double bass drum patterns",
                    "Blast beat variations",
                    "Technical death metal drumming",
                    "Progressive metal odd-time patterns",
                    "Extreme metal speed techniques"
                ]
            },
            {
                category: "Electronic & Contemporary",
                topics: [
                    "Hip-hop and R&B drum patterns",
                    "Electronic music adaptations for drums",
                    "Hybrid acoustic/electronic setups",
                    "Contemporary session drumming styles",
                    "Fusion and crossover techniques"
                ]
            }
        ]
    },

    // STRING INSTRUMENTS PRACTICE CATEGORIES
    {
        family: "Strings",
        name: "String Instruments (Technique)",
        items: [
            {
                category: "Bow Technique Development",
                topics: [
                    "Long tone exercises",
                    "String crossing exercises",
                    "Détaché bowing exercises",
                    "Spiccato exercises",
                    "Sautillé development exercises",
                    "Martelé exercises",
                    "Staccato bowing exercises",
                    "Col legno technique exercises",
                    "Sul tasto exercises",
                    "Sul ponticello exercises",
                    "Double, triple, quadruple stop exercises",
                    "Bow distribution exercises"
                ]
            },
            {
                category: "Left-Hand String Technique",
                topics: [
                    "Position exercises",
                    "Position shifting exercises",
                    "Vibrato development exercises",
                    "Double stop exercises",
                    "Harmonics exercises",
                    "Trill and ornament exercises",
                    "Pizzicato technique exercises",
                    "Finger independence exercises",
                    "Finger pattern exercises",
                    "Finger speed exercises",
                    "Left-hand frame exercises",
                    "Finger pressure exercises"
                ]
            },
            {
                category: "Special String Techniques",
                topics: [
                    "Glissando exercises",
                    "Tremolo exercises",
                    "Portamento exercises",
                    "Ponticello playing exercises",
                    "Sul tasto playing exercises",
                    "Flautando technique exercises",
                    "Left-hand pizzicato exercises",
                    "Col legno battuto exercises",
                    "Sul ponticello tremolo exercises",
                    "Behind the bridge sound exercises",
                    "Scratch tone exercises",
                    "Harmonic glissando exercises"
                ]
            },
            {
                category: "String Intonation Development",
                topics: [
                    "One-octave scale exercises with drones",
                    "Double-stop tuning exercises",
                    "Slow scale exercises with tuner",
                    "Position-specific intonation exercises",
                    "Harmonic landmark exercises",
                    "Chromatic intonation exercises",
                    "Expressive intonation exercises",
                    "Interval intonation drills",
                    "Scale degree intonation exercises",
                    "Chordal intonation exercises",
                    "Modulation intonation exercises",
                    "Just intonation vs. equal temperament exercises"
                ]
            },
            {
                category: "Violin-Specific Techniques",
                topics: [
                    "First position mastery exercises",
                    "Higher position exercises (3rd-7th)",
                    "Advanced fingering patterns",
                    "Virtuosic passage work",
                    "Orchestral excerpt practice",
                    "Chamber music skills",
                    "Concerto cadenza studies",
                    "Bach partita practice",
                    "Paganini caprice studies",
                    "Contemporary extended techniques"
                ]
            },
            {
                category: "Cello-Specific Techniques",
                topics: [
                    "Thumb position exercises",
                    "Tenor clef reading practice",
                    "Bach suite studies",
                    "Orchestral section playing",
                    "Sonata repertoire practice",
                    "Bowing coordination exercises",
                    "Contemporary technique studies",
                    "Chamber music coordination",
                    "Solo concerto preparation",
                    "Duo repertoire practice"
                ]
            },
            {
                category: "Double Bass Techniques",
                topics: [
                    "Orchestral excerpt studies",
                    "Solo repertoire practice",
                    "Jazz walking bass exercises",
                    "Bow control in lower positions",
                    "Thumb position development",
                    "Pivoting exercises",
                    "Harmonic studies",
                    "Pizzicato technique development",
                    "Extended range exercises",
                    "Chamber music coordination"
                ]
            }
        ]
    },

    // --- START STRINGS (THEORY & HARMONY) ---
    {
        family: "Strings",
        name: "Strings (Theory & Harmony)",
        items: [
            {
                category: "Fingering Board Knowledge",
                topics: [
                    "Identifying notes in common positions",
                    "Finding intervals across strings",
                    "Understanding enharmonic equivalents",
                    "Mapping scale patterns",
                    "Relating open strings to harmonics"
                ]
            },
            {
                category: "Scales, Modes & Arpeggios",
                topics: [
                    "Major/Minor scale fingerings (2-3 octaves)",
                    "Practicing modes (Dorian, Lydian etc.)",
                    "Arpeggio patterns (Major, Minor, Dim, Aug)",
                    "Chromatic scale practice",
                    "Whole Tone and Diminished scales"
                ]
            },
            {
                category: "Harmony & Chord Function",
                topics: [
                    "Understanding triad and 7th chord construction",
                    "Playing double stops representing chords",
                    "Identifying chord functions in repertoire (I, IV, V, ii, vi)",
                    "Voice leading in double stops",
                    "Analyzing harmonic progressions"
                ]
            },
             {
                category: "Form & Analysis",
                topics: [
                    "Identifying common forms (Binary, Ternary, Sonata)",
                    "Recognizing modulations",
                    "Understanding key relationships",
                    "Analyzing melodic structure",
                    "Score reading and analysis"
                ]
            }
        ]
    },
    // --- END STRINGS THEORY ---
    // --- START STRINGS (REPERTOIRE & STYLES) ---
    {
        family: "Strings",
        name: "Strings (Repertoire & Styles)",
        items: [
            {
                category: "Baroque Repertoire",
                topics: [
                    "Bach Solo Sonatas/Partitas/Suites",
                    "Vivaldi Concertos",
                    "Corelli Sonatas",
                    "Handel Sonatas",
                    "Practicing Baroque bowing/articulation"
                ]
            },
            {
                category: "Classical Repertoire",
                topics: [
                    "Mozart Concertos/Sonatas",
                    "Haydn Concertos/Quartets",
                    "Beethoven Sonatas/Quartets",
                    "Boccherini Concertos/Quintets",
                    "Practicing Classical phrasing/dynamics"
                ]
            },
            {
                category: "Romantic Repertoire",
                topics: [
                    "Brahms Sonatas/Concertos",
                    "Mendelssohn Concerto",
                    "Tchaikovsky Concerto",
                    "Dvorak Concerto/Quartets",
                    "Practicing Romantic expressiveness/vibrato"
                ]
            },
            {
                category: "Modern & Contemporary",
                topics: [
                    "Shostakovich Quartets/Concertos",
                    "Bartok Concertos/Quartets",
                    "Stravinsky pieces",
                    "Learning contemporary solo/chamber works",
                    "Exploring extended techniques in repertoire"
                ]
            },
             {
                category: "Orchestral & Chamber Music",
                topics: [
                    "Practicing standard orchestral excerpts",
                    "Working on chamber music parts (Quartet, Trio, etc.)",
                    "Developing ensemble listening skills",
                    "Blending tone and intonation",
                    "Following conductor/leader cues"
                ]
            }
        ]
    },
    // --- END STRINGS REPERTOIRE ---

    // WOODWINDS PRACTICE CATEGORIES
    {
        family: "Woodwinds",
        name: "Woodwind Instruments (Technique)",
        items: [
            {
                category: "Breathing and Support Development",
                topics: [
                    "Diaphragmatic breathing exercises",
                    "Breath control exercises",
                    "Long tone development with breath focus",
                    "Breathing rhythm exercises",
                    "Breath capacity expansion practice",
                    "Breath recovery exercises",
                    "Dynamic control through breath support",
                    "Breath management in phrases",
                    "Breath pulse exercises",
                    "Circular breathing introduction"
                ]
            },
            {
                category: "Tone Development",
                topics: [
                    "Long tone exercises with tuner",
                    "Overtone exercises",
                    "Tone matching exercises",
                    "Dynamic control exercises",
                    "Tone color variation practice",
                    "Embouchure development exercises",
                    "Voicing and air direction practice",
                    "Resonance optimization exercises",
                    "Pitch bend control exercises",
                    "Tone center finding drills"
                ]
            },
            {
                category: "Articulation Practice",
                topics: [
                    "Single tongue exercises",
                    "Double tongue development",
                    "Triple tongue technique",
                    "Articulation pattern variations",
                    "Different articulation styles practice",
                    "Legato connection exercises",
                    "Staccato precision drills",
                    "Articulation speed development",
                    "Mixed articulation passages",
                    "Stylistic articulation studies"
                ]
            },
            {
                category: "Technical Facility",
                topics: [
                    "Scale pattern exercises",
                    "Arpeggio studies",
                    "Interval pattern drills",
                    "Chromatic exercise variations",
                    "Finger coordination drills",
                    "Technical etude practice",
                    "Fast passage development",
                    "Alternate fingering practice",
                    "Finger independence exercises",
                    "Key click elimination drills"
                ]
            },
            {
                category: "Flute-Specific Techniques",
                topics: [
                    "Harmonics and whistle tones",
                    "Embouchure flexibility exercises",
                    "Air stream direction control",
                    "Flutter tonguing development",
                    "Piccolo technique adaptation",
                    "Alto/bass flute adaptation exercises",
                    "Extended techniques practice",
                    "Multiphonics exploration",
                    "Jet whistle technique",
                    "Microtonal studies"
                ]
            },
            {
                category: "Clarinet-Specific Techniques",
                topics: [
                    "Crossing the break exercises",
                    "Voicing control for register changes",
                    "Altissimo register development",
                    "Multiple articulation patterns",
                    "Embouchure pressure control",
                    "Thumb rest adjustment drills",
                    "Barrel adjustment intonation studies",
                    "Reed response exercises",
                    "Glissando technique development",
                    "Multiphonics and extended techniques"
                ]
            },
            {
                category: "Saxophone-Specific Techniques",
                topics: [
                    "Altissimo register exercises",
                    "Subtone technique development",
                    "Voicing and oral cavity control",
                    "Overtone matching exercises",
                    "Slap tongue technique",
                    "Growl and multiphonic techniques",
                    "Key pearl technique development",
                    "Classical to jazz tone switching",
                    "Vibrato style variation exercises",
                    "Circular breathing application for saxophone"
                ]
            },
            {
                category: "Oboe/Bassoon-Specific Techniques",
                topics: [
                    "Reed adjustment exercises",
                    "Reed making skill practice",
                    "Stable embouchure development",
                    "Long tone stability in extreme registers",
                    "Bocal/crook placement exercises",
                    "Harmonic series exercises",
                    "Alternate fingering practice",
                    "Half-hole technique refinement",
                    "Hand position optimization",
                    "Extended finger technique development"
                ]
            }
        ]
    },

    // --- START WOODWINDS (THEORY & HARMONY) ---
    {
        family: "Woodwinds",
        name: "Woodwinds (Theory & Harmony)",
        items: [
            {
                category: "Instrument Fingering Knowledge",
                topics: [
                    "Identifying notes and fingerings",
                    "Understanding alternate fingerings",
                    "Recognizing enharmonic fingerings",
                    "Mapping scale patterns",
                    "Transposition basics (for Clarinet/Sax)"
                ]
            },
            {
                category: "Scales, Modes & Arpeggios",
                topics: [
                    "Major/Minor scale fingerings (full range)",
                    "Practicing modes (Dorian, Mixolydian etc.)",
                    "Arpeggio patterns (Major, Minor, Dim, Aug, Dom7)",
                    "Chromatic scale fluency",
                    "Whole Tone and Diminished scales"
                ]
            },
            {
                category: "Harmony & Chord Function",
                topics: [
                    "Understanding triad and 7th chord construction",
                    "Relating scales/modes to chords",
                    "Identifying chord functions in repertoire",
                    "Analyzing harmonic progressions",
                    "Playing chord tones over changes"
                ]
            },
             {
                category: "Form & Analysis",
                topics: [
                    "Identifying common forms (Binary, Ternary, Rondo)",
                    "Recognizing modulations and key areas",
                    "Understanding phrase structure",
                    "Analyzing melodic contour and motifs",
                    "Score reading and harmonic analysis"
                ]
            }
        ]
    },
    // --- END WOODWINDS THEORY ---
    // --- START WOODWINDS (REPERTOIRE & STYLES) ---
    {
        family: "Woodwinds",
        name: "Woodwinds (Repertoire & Styles)",
        items: [
            {
                category: "Baroque Repertoire",
                topics: [
                    "Bach Flute Sonatas / Cello Suites (transcribed)",
                    "Telemann Fantasias / Sonatas",
                    "Handel Sonatas",
                    "Vivaldi Concertos",
                    "Practicing Baroque ornamentation/articulation"
                ]
            },
            {
                category: "Classical Repertoire",
                topics: [
                    "Mozart Concertos / Quintets",
                    "Beethoven Sonatas (transcribed) / Chamber",
                    "Stamitz Concertos",
                    "Haydn pieces (transcribed)",
                    "Practicing Classical articulation/phrasing"
                ]
            },
            {
                category: "Romantic Repertoire",
                topics: [
                    "Schubert pieces (transcribed)",
                    "Brahms Sonatas (Clarinet)",
                    "Reinecke Flute Sonata 'Undine'",
                    "Weber Concertos (Clarinet/Bassoon)",
                    "Practicing Romantic expression/dynamics"
                ]
            },
            {
                category: "Modern & Contemporary",
                topics: [
                    "Debussy Syrinx / Rhapsody (Clarinet)",
                    "Poulenc Sonatas",
                    "Hindemith Sonatas",
                    "Ibert Flute Concerto",
                    "Learning contemporary solo/chamber works"
                ]
            },
             {
                category: "Jazz & Commercial (Sax/Clarinet/Flute)",
                topics: [
                    "Learning jazz standards",
                    "Practicing improvisation over changes",
                    "Working on characteristic tone/articulation",
                    "Reading lead sheets / big band charts",
                    "Transcribing solos"
                 ]
            },
             {
                category: "Orchestral & Band Music",
                topics: [
                    "Practicing standard orchestral/band excerpts",
                    "Working on ensemble blending and intonation",
                    "Developing section playing skills",
                    "Responding to conductor cues",
                    "Understanding role within ensemble"
                ]
            }
        ]
    },
    // --- END WOODWINDS REPERTOIRE ---

    // BRASS INSTRUMENTS PRACTICE CATEGORIES 
    {
        family: "Brass",
        name: "Brass (Technique)",
        items: [
            {
                category: "Breathing and Support Development",
                topics: [
                    "Breathing gym exercises",
                    "Air flow control exercises",
                    "Long tone breath support development",
                    "Mouthpiece buzzing with breath focus",
                    "Breath attack precision exercises",
                    "Breath capacity expansion exercises",
                    "Breath control in soft playing",
                    "Breath compression exercises",
                    "Breath recovery techniques",
                    "Breath pulse control"
                ]
            },
            {
                category: "Embouchure Development",
                topics: [
                    "Mouthpiece buzzing patterns",
                    "Lip flexibility exercises",
                    "Embouchure strength development",
                    "Corner control exercises",
                    "Aperture control drills",
                    "Lip bend exercises",
                    "Register transition exercises",
                    "Soft playing embouchure control",
                    "Loud playing embouchure stability",
                    "Embouchure endurance building"
                ]
            },
            {
                category: "Articulation Technique",
                topics: [
                    "Single tongue exercises",
                    "Double tongue development",
                    "Triple tongue technique",
                    "Tonguing speed exercises",
                    "Articulation clarity drills",
                    "Multiple articulation patterns",
                    "Legato tongue exercises",
                    "Marcato articulation development",
                    "Staccato precision exercises",
                    "Soft articulation control"
                ]
            },
            {
                category: "Range and Flexibility",
                topics: [
                    "Lip slur patterns",
                    "Range extension exercises",
                    "Interval slur exercises",
                    "Pedal tone development",
                    "High register approach exercises",
                    "Flexibilities across registers",
                    "Glissando technique development",
                    "Register crossing exercises",
                    "Arpeggiated slur patterns",
                    "Whisper tone to fortissimo exercises"
                ]
            },
            {
                category: "Technical Studies",
                topics: [
                    "Scale pattern exercises",
                    "Arpeggio studies",
                    "Finger dexterity drills",
                    "Valve/slide coordination exercises",
                    "Chromatic pattern development",
                    "Technical etude practice",
                    "Fast passage skill building",
                    "Alternate fingering/position practice",
                    "Technical accuracy exercises",
                    "Virtuosic passage practice"
                ]
            },
            {
                category: "Trumpet-Specific Techniques",
                topics: [
                    "Piccolo trumpet adaptation exercises",
                    "Harmon mute technique development",
                    "Double high C exercises",
                    "Lead trumpet style studies",
                    "Jazz phrasing exercises",
                    "Classical orchestral excerpt practice",
                    "Multiple tonguing precision drills",
                    "Rotary valve technique (for rotary trumpets)",
                    "Pedal register development",
                    "Extended techniques exploration"
                ]
            },
            {
                category: "Trombone-Specific Techniques",
                topics: [
                    "Slide position accuracy exercises",
                    "Slide legato technique development",
                    "Alternate position practice",
                    "Bass trombone register development",
                    "Trigger technique exercises",
                    "Glissando control development",
                    "Jazz tailgate technique practice",
                    "Orchestral excerpt study",
                    "Section playing precision",
                    "Extended range development"
                ]
            },
            {
                category: "Horn-Specific Techniques",
                topics: [
                    "Hand stopping technique",
                    "Muting exercises",
                    "Double horn transition fluency",
                    "Low register development",
                    "Transposition practice",
                    "Legato connection exercises",
                    "Orchestral excerpt preparation",
                    "Soft attack precision",
                    "Lip trill development",
                    "Extended techniques (flutter tongue, rips)"
                ]
            },
            {
                category: "Tuba/Euphonium-Specific Techniques",
                topics: [
                    "Breathing capacity expansion",
                    "Low register foundation exercises",
                    "Valve speed and coordination",
                    "Upper register approach exercises",
                    "Soft playing in low register",
                    "Mouthpiece buzzing for tuba/euphonium",
                    "Orchestral/band excerpt study",
                    "Technical passage accuracy",
                    "Solo repertoire technique isolation",
                    "Extended techniques practice"
                ]
            }
        ]
    },

    // --- START BRASS (THEORY & HARMONY) ---
    {
        family: "Brass",
        name: "Brass (Theory)",
        items: [
            {
                category: "Valve/Slide & Harmonic Series",
                topics: [
                    "Identifying notes for valve combinations/slide positions",
                    "Understanding the harmonic series",
                    "Recognizing partials",
                    "Relating fingerings/positions to notation",
                    "Transposition basics (Horn/Trumpet)"
                ]
            },
            {
                category: "Scales, Modes & Arpeggios",
                topics: [
                    "Major/Minor scale fingerings/positions",
                    "Practicing modes (Dorian, Mixolydian etc.)",
                    "Arpeggio patterns (Major, Minor, Dim, Aug, Dom7)",
                    "Chromatic scale fluency",
                    "Lip Slur patterns relating to harmony"
                ]
            },
            {
                category: "Harmony & Chord Function",
                topics: [
                    "Understanding triad and 7th chord construction",
                    "Playing roots/chord tones within ensemble",
                    "Identifying chord functions in repertoire",
                    "Analyzing harmonic progressions",
                    "Voice leading principles in brass writing"
                ]
            },
             {
                category: "Form & Analysis",
                topics: [
                    "Identifying common forms (March, Fanfare, Sonata)",
                    "Recognizing modulations and key areas",
                    "Understanding phrase structure in brass music",
                    "Analyzing melodic themes",
                    "Score reading (band/orchestra)"
                ]
            }
        ]
    },
    // --- END BRASS THEORY ---
    // --- START BRASS (REPERTOIRE & STYLES) ---
    {
        family: "Brass",
        name: "Brass (Repertoire & Styles)",
        items: [
            {
                category: "Solo Repertoire",
                topics: [
                    "Standard Concertos (Haydn, Hummel, Mozart Horn, etc.)",
                    "Characteristic solo pieces (Arban, Clarke)",
                    "Sonatas (Hindemith, Ewazen)",
                    "Contemporary solo works",
                    "Recital program preparation"
                ]
            },
            {
                category: "Orchestral Repertoire",
                topics: [
                    "Practicing standard orchestral excerpts (Beethoven, Mahler, Strauss)",
                    "Developing section playing skills",
                    "Understanding stylistic demands (Classical vs Romantic vs Modern)",
                    "Blending tone and intonation",
                    "Following conductor cues accurately"
                ]
            },
            {
                category: "Band Repertoire (Concert/Wind)",
                topics: [
                    "Practicing standard band literature excerpts",
                    "Working on intonation in different keys",
                    "Blending within the brass section",
                    "Understanding common band forms (Marches, Suites)",
                    "Playing soloistic passages within band context"
                ]
            },
            {
                category: "Chamber Music (Brass Quintet/Ensemble)",
                topics: [
                    "Practicing standard brass quintet repertoire",
                    "Working on small ensemble listening skills",
                    "Matching articulation and phrasing",
                    "Balancing parts within the ensemble",
                    "Rehearsal techniques"
                ]
            },
             {
                category: "Jazz & Commercial (Trumpet/Trombone)",
                topics: [
                     "Learning jazz standards melody/changes",
                     "Practicing improvisation",
                     "Big band section playing",
                     "Lead trumpet playing techniques",
                     "Characteristic jazz articulation/phrasing"
                 ]
            }
        ]
    },
    // --- END BRASS REPERTOIRE ---

    // PERCUSSION THEORY
    {
        family: "Percussion",
        name: "Drums (Theory)",
        items: [
            {
                category: "Reading Skills Development",
                topics: [
                    "Staff reading exercises (treble and bass clefs)",
                    "Chord chart interpretation exercises",
                    "Lead sheet reading exercises",
                    "Sight-reading progressive exercises",
                    "Grand staff reading speed drills",
                    "Score reduction exercises",
                    "Rhythm reading exercises",
                    "Chord symbol reading drills",
                    "Sight-reading with metronome",
                    "One-handed sight-reading exercises"
                ]
            },
            {
                category: "Rhythmic Theory",
                topics: [
                    "Note values and subdivisions",
                    "Time signatures and meter",
                    "Polyrhythm analysis and application",
                    "Rhythmic displacement concepts",
                    "Metric modulation principles"
                ]
            },
            {
                category: "Drum Notation Systems",
                topics: [
                    "Standard drum kit notation",
                    "Specialized percussion notation",
                    "Cymbal articulation notation",
                    "Ghost note notation",
                    "Dynamic markings for percussion"
                ]
            },
            {
                category: "Transcription Skills",
                topics: [
                    "Groove and fill transcription",
                    "Drum solo analysis",
                    "Style-specific notation",
                    "Transcribing from recordings",
                    "Creating lead sheets for drums"
                ]
            }
        ]
    },
    
    // BRASS REPERTOIRE & STYLES
    {
        family: "Brass",
        name: "Brass (Repertoire & Styles)",
        items: [
            {
                category: "Solo Repertoire",
                topics: [
                    "Standard Concertos (Haydn, Hummel, Mozart Horn, etc.)",
                    "Characteristic solo pieces (Arban, Clarke)",
                    "Sonatas (Hindemith, Ewazen)",
                    "Contemporary solo works",
                    "Recital program preparation"
                ]
            },
            {
                category: "Orchestral Repertoire",
                topics: [
                    "Practicing standard orchestral excerpts (Beethoven, Mahler, Strauss)",
                    "Developing section playing skills",
                    "Understanding stylistic demands (Classical vs Romantic vs Modern)",
                    "Blending tone and intonation",
                    "Following conductor cues accurately"
                ]
            },
            {
                category: "Band Repertoire (Concert/Wind)",
                topics: [
                    "Practicing standard band literature excerpts",
                    "Working on intonation in different keys",
                    "Blending within the brass section",
                    "Understanding common band forms (Marches, Suites)",
                    "Playing soloistic passages within band context"
                ]
            },
            {
                category: "Chamber Music (Brass Quintet/Ensemble)",
                topics: [
                    "Practicing standard brass quintet repertoire",
                    "Working on small ensemble listening skills",
                    "Matching articulation and phrasing",
                    "Balancing parts within the ensemble",
                    "Rehearsal techniques"
                ]
            },
             {
                category: "Jazz & Commercial (Trumpet/Trombone)",
                topics: [
                     "Learning jazz standards melody/changes",
                     "Practicing improvisation",
                     "Big band section playing",
                     "Lead trumpet playing techniques",
                     "Characteristic jazz articulation/phrasing"
                 ]
            }
        ]
    },
    
    // GUITAR PERFORMANCE
    {
        family: "Guitar",
        name: "Guitar (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Memorization techniques",
                    "Performance anxiety management",
                    "Muscle memory development",
                    "Performance run-through strategies",
                    "Recording and self-evaluation practices"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Body language and positioning",
                    "Visual presentation techniques",
                    "Audience engagement skills",
                    "Between-song communication",
                    "Performance energy management"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "Tuning in performance situations",
                    "Adapting to different acoustic environments",
                    "Managing equipment during performance",
                    "Recovery techniques for mistakes",
                    "Maintaining focus during long performances"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Ensemble communication techniques",
                    "Visual cueing methods",
                    "Balancing volume with other instruments",
                    "Following a leader/conductor",
                    "Role-switching in ensembles"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Solo recital preparation",
                    "Band/ensemble performance techniques",
                    "Recording session preparation",
                    "Competition preparation strategies",
                    "Audition techniques"
                ]
            }
        ]
    },
    
    // BASS GUITAR PERFORMANCE
    {
        family: "Bass Guitar",
        name: "Bass Guitar (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Memorization strategies for basslines",
                    "Performance anxiety management",
                    "Physical endurance building",
                    "Performance run-through approaches",
                    "Recording and self-evaluation methods"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Stage positioning for bassists",
                    "Visual presentation and engagement",
                    "Movement while maintaining timing",
                    "Interaction with rhythm section members",
                    "Performance energy management"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "On-stage tuning techniques",
                    "Adapting to different monitor mixes",
                    "Managing bass equipment during performance",
                    "Recovery techniques for timing errors",
                    "Maintaining lock with drummer during performance"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Rhythm section cohesion techniques",
                    "Visual and musical cueing methods",
                    "Volume balance with band members",
                    "Following charts/arrangements live",
                    "Supporting soloists dynamically"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Studio session preparation",
                    "Live performance preparation",
                    "Audition strategies for bassists",
                    "Festival/large venue bass techniques",
                    "Playing with in-ear monitoring systems"
                ]
            }
        ]
    },
    
    // KEYBOARD PERFORMANCE
    {
        family: "Keyboard",
        name: "Piano (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Memory security techniques",
                    "Performance anxiety management",
                    "Practice-performance transition methods",
                    "Pre-performance routines",
                    "Recording and self-evaluation practices"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Entrance and exit protocols",
                    "Body posture and hand visibility",
                    "Emotional expression through movement",
                    "Audience connection techniques",
                    "Managing program transitions"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "Adapting to different pianos/keyboards",
                    "Page turning/music management",
                    "Recovery from memory slips",
                    "Pedaling in different acoustic environments",
                    "Managing extended techniques in performance"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Accompanying techniques",
                    "Chamber music coordination",
                    "Balance with other instruments/voices",
                    "Visual communication with collaborators",
                    "Rehearsal leadership techniques"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Solo recital programming",
                    "Concerto performance preparation",
                    "Competition strategies",
                    "Recording session approaches",
                    "Lecture-recital presentation skills"
                ]
            }
        ]
    },
    
    // PERCUSSION PERFORMANCE
    {
        family: "Percussion",
        name: "Drums (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Set building and layout optimization",
                    "Mental preparation techniques",
                    "Physical endurance training",
                    "Soundcheck procedures",
                    "Equipment testing and backup planning"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Visual performance techniques",
                    "Energy projection while seated",
                    "Stick/mallet visual techniques",
                    "Audience engagement from drum position",
                    "Camera awareness for recorded performances"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "Mid-performance tuning techniques",
                    "Adapting to monitor/FOH sound differences",
                    "Managing broken heads/equipment failure",
                    "Recovery from timing errors",
                    "Maintaining tempo consistency in performance"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Band cueing techniques for drummers",
                    "Visual communication with bandmates",
                    "Following conductor/leader in large ensembles",
                    "Supporting dynamics for other performers",
                    "Transitioning between song sections/tempos"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Live venue adaptation techniques",
                    "Studio session professionalism",
                    "Drum clinics and educational performances",
                    "Percussion ensemble performances",
                    "Theatre/pit orchestra performance skills"
                ]
            }
        ]
    },
    
    // STRINGS PERFORMANCE
    {
        family: "Strings",
        name: "Strings (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Memorization security techniques",
                    "Performance anxiety management",
                    "Structured rehearsal planning",
                    "Mental practice techniques",
                    "Recording and self-evaluation methods"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Physical positioning and posture",
                    "Bow arm visibility and gesture",
                    "Communicating musical phrases visually",
                    "Interaction with accompanist/ensemble",
                    "Entrance and exit protocols"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "On-stage tuning procedures",
                    "Adapting to different acoustic spaces",
                    "Managing string changes/equipment issues",
                    "Recovery from intonation or memory slips",
                    "Performing under different lighting conditions"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Chamber ensemble communication",
                    "Orchestral section playing skills",
                    "Following conductor cues effectively",
                    "Balance with piano/other instruments",
                    "Blending within string sections"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Solo recital preparation",
                    "Concerto performance with orchestra",
                    "Competition preparation strategies",
                    "Recording session approaches",
                    "Audition preparation techniques"
                ]
            }
        ]
    },
    
    // WOODWINDS PERFORMANCE
    {
        family: "Woodwinds",
        name: "Woodwinds (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Reed/mouthpiece preparation and selection",
                    "Performance anxiety management",
                    "Physical warm-up routines",
                    "Mental rehearsal techniques",
                    "Recording and self-evaluation practices"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Posture and instrument position",
                    "Breathing visibility management",
                    "Expressive movement while playing",
                    "Audience engagement techniques",
                    "Managing program transitions"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "Quick adjustment for intonation issues",
                    "Managing condensation during performance",
                    "Reed/equipment troubleshooting on stage",
                    "Recovery from finger slips or squeaks",
                    "Adapting to different acoustic environments"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Chamber ensemble communication",
                    "Wind section coherence techniques",
                    "Blending with different instrument families",
                    "Visual cueing in small ensembles",
                    "Following conductor in large ensembles"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Solo recital programming strategies",
                    "Concerto performance preparation",
                    "Orchestral audition preparation",
                    "Band and ensemble performance roles",
                    "Recording session preparation"
                ]
            }
        ]
    },
    
    // BRASS PERFORMANCE
    {
        family: "Brass",
        name: "Brass (Performance)",
        items: [
            {
                category: "Performance Preparation",
                topics: [
                    "Embouchure conditioning for performances",
                    "Performance anxiety management",
                    "Endurance building for long performances",
                    "Pre-performance warm-up routines",
                    "Recording and self-evaluation methods"
                ]
            },
            {
                category: "Stage Presence",
                topics: [
                    "Instrument positioning and posture",
                    "Water key/condensation management",
                    "Visual presence while seated in ensembles",
                    "Solo performance presentation skills",
                    "Mute changing techniques for performances"
                ]
            },
            {
                category: "Technical Performance Skills",
                topics: [
                    "On-stage intonation adjustment",
                    "Managing fatigue during performance",
                    "Recovery from missed notes/cracked attacks",
                    "Adapting to different acoustic environments",
                    "Maintaining consistent sound across registers"
                ]
            },
            {
                category: "Collaborative Performance",
                topics: [
                    "Brass section blend techniques",
                    "Balance issues in different ensembles",
                    "Visual communication with conductor/ensemble",
                    "Chamber ensemble coordination",
                    "Supporting soloists as section player"
                ]
            },
            {
                category: "Performance Contexts",
                topics: [
                    "Orchestral audition preparation",
                    "Solo recital programming",
                    "Brass quintet/chamber ensemble performance",
                    "Band section leadership",
                    "Commercial/studio performance practices"
                ]
            }
        ]
    },

    // DRUM CATEGORIES
    {
        family: "Drums",
        name: "Drums (Technique)",
        items: [
            // ... existing code ...
        ]
    },

    // --- START DRUMS (THEORY) ---
    {
        family: "Drums",
        name: "Drums (Theory)",
        items: [
            {
                name: "Basic Theory",
                topics: ["Counting & Subdivisions", "Notation Basics", "Time Signatures", "Drum Set Notation", "Sight Reading Exercises", "Dynamics & Articulation"]
            },
            {
                name: "Advanced Theory",
                topics: ["Polyrhythms", "Odd Time Signatures", "Metric Modulation", "Rhythmic Illusions", "Compositional Concepts", "Analysis of Drum Parts"]
            },
            {
                name: "Reading & Transcription",
                topics: ["Reading Exercises", "Chart Reading", "Transcription Techniques", "Lead Sheet Interpretation", "Orchestral Scores", "Jazz Charts", "Analyzing Famous Drum Parts"]
            },
            {
                name: "Form & Structure",
                topics: ["Song Forms", "Structural Elements", "Sectional Awareness", "Counting Measures", "Arrangement Concepts", "Creating Fill Patterns"]
            }
        ]
    },

    // --- REMOVE THIS WHOLE SECTION ---
    // --- START DRUMS (READING & TRANSCRIPTION) ---
    // {
    //     family: "Drums",
    //     name: "Drums (Reading & Transcription)",
    //     items: [
    //         {
    //             name: "Reading & Transcription",
    //             topics: ["Reading Exercises", "Chart Reading", "Transcription Techniques", "Lead Sheet Interpretation", "Orchestral Scores", "Jazz Charts", "Analyzing Famous Drum Parts"]
    //         }
    //     ]
    // },
]; // End of practiceData array

// Helper function to get current filters
function getCurrentResourceFilters() {
    const instrumentButtons = document.querySelectorAll('.resource-instrument-filter-btn');
    const activeInstruments = Array.from(instrumentButtons)
        .filter(btn => btn.classList.contains('active'))
        .map(btn => btn.dataset.instrument);
    const searchInput = document.getElementById('resource-search');
    const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
    return { activeInstruments, searchTerm };
}

// Toggle visibility of a main instrument category
function toggleResourceCategory(instrumentName) {
    console.log(`[DEBUG Resources Toggle] toggleResourceCategory called for: ${instrumentName}`); // Log entry
    // Sanitize instrumentName for use in ID
    const instrumentIdName = instrumentName.replace(/\W/g, '');
    console.log(`[DEBUG Resources Toggle] Sanitized ID: resource-cat-${instrumentIdName}`);
    const categoryElement = document.getElementById(`resource-cat-${instrumentIdName}`);
    if (!categoryElement) {
        console.error('[DEBUG Resources Toggle] Could not find category element by ID!');
        return;
    }
    console.log('[DEBUG Resources Toggle] Found categoryElement:', categoryElement);
    console.log('[DEBUG Resources Toggle] categoryElement.innerHTML:', categoryElement.innerHTML);

    const content = categoryElement.querySelector('.resource-category-content');
    // Look for the SVG, not the initial i tag
    const iconContainer = categoryElement.querySelector('.toggle-icon'); 
    const iconSVG = iconContainer ? iconContainer.querySelector('svg') : null;

    if (!content || !iconContainer || !iconSVG) { // Check iconContainer and iconSVG
        console.error('[DEBUG Resources Toggle] Could not find content or icon container/SVG within categoryElement!'); 
        return;
    }

    const isExpanded = !content.classList.contains('hidden');
    console.log(`[DEBUG Resources Toggle] Currently expanded? ${isExpanded}`);

    // Determine new icon name
    const newIconName = isExpanded ? 'chevron-down' : 'chevron-up';

    if (isExpanded) {
        content.classList.add('hidden');
        expandedResourceCategories.delete(instrumentName);
        console.log('[DEBUG Resources Toggle] Collapsed. State:', expandedResourceCategories);
    } else {
        content.classList.remove('hidden');
        expandedResourceCategories.add(instrumentName);
        console.log('[DEBUG Resources Toggle] Expanded. State:', expandedResourceCategories);
    }

    // Replace SVG with a new i tag with the correct data-lucide attribute
    iconContainer.innerHTML = `<i data-lucide="${newIconName}"></i>`;

    // Move icon refresh to the VERY END (Lucide will convert the new i tag)
    if (window.lucide) {
        console.log('[DEBUG Resources Toggle] Calling global lucide.createIcons() at the end.');
        try {
            lucide.createIcons(); 
        } catch (e) { console.error("Error updating lucide icons:", e); }
    }
}

// Toggle visibility of a skill group within an instrument category
function toggleResourceSkillGroup(instrumentName, skillGroupName) {
    // Sanitize names for use in ID
    const instrumentIdName = instrumentName.replace(/\W/g, '');
    const skillGroupIdName = skillGroupName.replace(/\W/g, '');
    const skillGroupElement = document.getElementById(`resource-skill-${instrumentIdName}-${skillGroupIdName}`);
    if (!skillGroupElement) {
        console.warn('Could not find skill group element for:', instrumentName, skillGroupName);
        return;
    }
    
    const content = skillGroupElement.querySelector('.resource-skill-group-content');
    // Look for the SVG, not the initial i tag
    const iconContainer = skillGroupElement.querySelector('.toggle-icon'); 
    const iconSVG = iconContainer ? iconContainer.querySelector('svg') : null;

     if (!content || !iconContainer || !iconSVG) { // Check iconContainer and iconSVG
        console.warn('Could not find content or icon container/SVG for skill group:', instrumentName, skillGroupName); 
        return;
    }

    const isExpanded = !content.classList.contains('hidden');
    const stateKey = `${instrumentName}::${skillGroupName}`;
    
    // Determine new icon name
    const newIconName = isExpanded ? 'chevron-right' : 'chevron-down';

    if (isExpanded) {
        content.classList.add('hidden');
        expandedResourceSkillGroups.delete(stateKey);
    } else {
        content.classList.remove('hidden');
        expandedResourceSkillGroups.add(stateKey);
    }

    // Replace SVG with a new i tag with the correct data-lucide attribute
    iconContainer.innerHTML = `<i data-lucide="${newIconName}"></i>`;
    
    // Move icon refresh to the VERY END (Lucide will convert the new i tag)
    if (window.lucide) {
         console.log('[DEBUG Resources Toggle Skill] Calling global lucide.createIcons() at the end.');
         try {
             lucide.createIcons(); 
         } catch (e) { console.error("Error updating lucide icons:", e); }
    }
}

// Display resources based on filters and expanded state
function displayResources() {
    const listContainer = document.getElementById('dynamic-resource-list');
    if (!listContainer) {
        console.error('Resource list container #dynamic-resource-list not found.');
        return;
    }

    const { activeInstruments, searchTerm } = getCurrentResourceFilters();
    // --- START DEBUG LOGS ---
    console.log(`[DEBUG Filters] Active instruments:`, activeInstruments);
    console.log(`[DEBUG Search] Term: '${searchTerm}'`);
    // --- END DEBUG LOGS ---
    listContainer.innerHTML = ''; // Clear existing list
    let hasResults = false;

    practiceData.forEach(instrumentGroup => {
        // Filter by instrument family only if filters are active
        if (activeInstruments.length > 0 && !activeInstruments.includes(instrumentGroup.family)) {
            console.log(`[DEBUG Filters] Skipping ${instrumentGroup.family} - not in active filters`);
            return; // Skip if not selected
        }

        console.log(`[DEBUG Filters] Including ${instrumentGroup.family} - ${instrumentGroup.name}`);
        const instrumentName = instrumentGroup.name;
        const instrumentIdName = instrumentName.replace(/\W/g, ''); // Sanitize for ID
        const isCategoryExpanded = expandedResourceCategories.has(instrumentName);

        // Filter items (skill groups) within the group based on search term
        const matchingSkillGroups = []; // Keep track of skill groups that actually match
        const filteredItems = instrumentGroup.items.filter(item => {
            if (!searchTerm) return true; // Show all if no search term
            
            const categoryMatch = item.category.toLowerCase().includes(searchTerm);
            const topicMatch = item.topics.some(topic => topic.toLowerCase().includes(searchTerm));
            
            // --- AUTO-EXPAND LOGIC --- 
            if (categoryMatch || topicMatch) {
                console.log(`[DEBUG AutoExpand] Match found in '${instrumentGroup.name}' -> '${item.category}'. Expanding category.`);
                expandedResourceCategories.add(instrumentGroup.name); // Expand parent category
                matchingSkillGroups.push(item); // Add to list of matching skill groups for later check
            }
            // --- END AUTO-EXPAND LOGIC --- 

            return categoryMatch || topicMatch;
        });
        
        // --- START SEARCH DEBUG LOGS ---
        if (filteredItems.length > 0) {
            console.log(`[DEBUG Search] Found ${filteredItems.length} matching skill groups in '${instrumentGroup.name}'.`);
        } else if (searchTerm) {
             console.log(`[DEBUG Search] No matching skill groups found in '${instrumentGroup.name}'.`);
        }
        // --- END SEARCH DEBUG LOGS ---

        if (filteredItems.length === 0) {
            return; // Skip this instrument group if no skill groups match search
        }
        hasResults = true; 
        
        const categoryElement = document.createElement('div');
        categoryElement.className = 'resource-category card'; 
        categoryElement.id = `resource-cat-${instrumentIdName}`;
        categoryElement.innerHTML = `
            <div class="resource-category-header card-header"> 
                <h3>${escapeHTML(instrumentName)}</h3>
                <span class="toggle-icon">
                    <i data-lucide="${isCategoryExpanded ? 'chevron-up' : 'chevron-down'}"></i>
                </span>
            </div>
            <div class="resource-category-content ${isCategoryExpanded ? '' : 'hidden'}">
                <!-- Skill groups will be appended here -->
            </div>
        `;

        const categoryContent = categoryElement.querySelector('.resource-category-content');

        filteredItems.forEach(item => {
            const skillGroupName = item.category;
            const skillGroupIdName = skillGroupName.replace(/\W/g, '');
            const stateKey = `${instrumentName}::${skillGroupName}`;

            // --- AUTO-EXPAND LOGIC for Skill Group ---
            // Check if this specific skill group was one that matched the search
            const didSkillGroupMatchSearch = matchingSkillGroups.some(match => match.category === skillGroupName);
            if (searchTerm && didSkillGroupMatchSearch) {
                console.log(`[DEBUG AutoExpand] Skill group '${skillGroupName}' matched search. Expanding.`);
                expandedResourceSkillGroups.add(stateKey);
            }
            // --- END AUTO-EXPAND LOGIC ---
            
            const isSkillGroupExpanded = expandedResourceSkillGroups.has(stateKey);
            
            // Filter topics ONLY if the search term exists AND the category itself didn't match
            let topicsToDisplay = item.topics;
            const categoryNameMatched = item.category.toLowerCase().includes(searchTerm);
            if (searchTerm && !categoryNameMatched) {
                topicsToDisplay = item.topics.filter(topic => topic.toLowerCase().includes(searchTerm));
            }
            
            if (topicsToDisplay.length === 0) return; // Skip if no topics match after filtering
            
            const skillGroupElement = document.createElement('div');
            skillGroupElement.className = 'resource-skill-group';
            skillGroupElement.id = `resource-skill-${instrumentIdName}-${skillGroupIdName}`;
            skillGroupElement.innerHTML = `
                <div class="resource-skill-group-header">
                    <h4>${escapeHTML(skillGroupName)}</h4>
                    <span class="toggle-icon">
                        <i data-lucide="${isSkillGroupExpanded ? 'chevron-down' : 'chevron-right'}"></i> 
                    </span>
                </div>
                <ul class="resource-skill-group-content ${isSkillGroupExpanded ? '' : 'hidden'}">
                    ${topicsToDisplay.map(topic => `
                        <li>
                            <span>${escapeHTML(topic)}</span>
                            <button class="add-topic-btn app-button app-button--secondary app-button--small" 
                                    data-topic="${escapeHTML(topic)}" 
                                    aria-label="Add ${escapeHTML(topic)} as practice category">
                                <i data-lucide="plus"></i> Add
                            </button>
                        </li>
                    `).join('')}
                </ul>
            `;
            categoryContent.appendChild(skillGroupElement);

            // *** ATTACH LISTENER TO skillGroupElement ITSELF ***
            skillGroupElement.addEventListener('click', (event) => {
                // Check if the click target is within the header
                if (event.target.closest('.resource-skill-group-header')) {
                    toggleResourceSkillGroup(instrumentName, skillGroupName);
                }
            });
        });

        // Append the completed category element to the main list
        listContainer.appendChild(categoryElement);

        // *** ATTACH LISTENER TO categoryElement ITSELF ***
        categoryElement.addEventListener('click', (event) => {
            // Check if the click target is within the header
            if (event.target.closest('.resource-category-header')) {
                toggleResourceCategory(instrumentName);
            }
        });
    });

    // Show message if no results found
    if (!hasResults) {
        // --- START SEARCH DEBUG LOGS ---
        console.log(`[DEBUG Search] Overall: No results found for term '${searchTerm}'.`);
        // --- END SEARCH DEBUG LOGS ---
        listContainer.innerHTML = '<p class="empty-state">No resources found matching your criteria.</p>';
    }

    // Initialize Lucide icons for the entire list
    if (window.lucide) {
        try {
            lucide.createIcons({ context: listContainer });
        } catch (e) { console.error("Error creating Lucide icons for resource list:", e); }
    }
}

// Handle adding a category from a resource topic
function handleAddCategoryFromResource(event) {
    if (!event.target.classList.contains('add-topic-btn') && !event.target.closest('.add-topic-btn')) {
        return; // Exit if click wasn't on an add button or its children (like the icon)
    }

    const button = event.target.closest('.add-topic-btn');
    if (!button) return; // Should not happen if the first check passed, but good practice

    const topicName = button.dataset.topic;
    if (!topicName) {
        console.error('[Resources] Could not find topic name from button data attribute.');
        return;
    }

    console.log(`[Resources] Add button clicked for topic: ${topicName}`);

    // Check if category already exists (case-insensitive)
    try {
        const categories = window.getItems ? window.getItems('CATEGORIES') : JSON.parse(localStorage.getItem('practiceTrack_categories')) || [];
        const existingCategory = categories.find(cat => cat && typeof cat.name === 'string' && cat.name.toLowerCase() === topicName.toLowerCase());

        if (existingCategory) {
            console.log(`[Resources] Category '${topicName}' already exists.`);
            if (window.showNotification) {
                window.showNotification('Category Exists', `The category "${escapeHTML(topicName)}" already exists.`);
            } else {
                alert(`Category "${escapeHTML(topicName)}" already exists.`);
            }
            return;
        }

        // Create new category object
        const newCategory = {
            id: generateUUID(),
            name: topicName,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            // Add any other default properties your categories need
        };

        console.log('[Resources] Preparing to add category object:', newCategory);

        // Use data layer to add the category
        if (window.addItem) {
            window.addItem('CATEGORIES', newCategory);
            console.log('[Resources] Category added via window.addItem:', newCategory);
            // Dispatch 'dataChanged' event
            console.log('[Resources] Dispatching dataChanged event for CATEGORIES');
            document.dispatchEvent(new CustomEvent('dataChanged', { detail: { type: 'CATEGORIES' } }));

            // Show success feedback
            if (window.showNotification) {
                window.showNotification('Category Added', `"${escapeHTML(topicName)}" added to your categories.`);
            } else {
                alert(`Category "${escapeHTML(topicName)}" added.`);
            }
        } else {
            console.error('[Resources] window.addItem function not found. Cannot add category.');
            alert('Error: Could not add category. Data function missing.');
        }
    } catch (error) {
        console.error('[Resources] Error adding category:', error);
        alert('An error occurred while adding the category. Please try again.');
    }
}

// --- Debounce Utility --- 
let debounceTimer;
function debounce(func, delay = 300) {
    return function(...args) {
        console.log(`[DEBUG Debounce] Timer cleared for ${func.name}`); // Log timer clear
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            console.log(`[DEBUG Debounce] FIRING debounced function: ${func.name}`);
            func.apply(this, args);
        }, delay);
    }
}

// Setup event listeners for filters and add buttons
function setupResourceEventListeners() {
    console.log('>>> [DEBUG Resources Setup] Setting up event listeners...'); 
    // Instrument filter buttons
    const instrumentButtons = document.querySelectorAll('.resource-instrument-filter-btn');
    if (instrumentButtons.length > 0) {
        instrumentButtons.forEach(button => {
            button.removeEventListener('click', handleInstrumentFilterClick);
            button.addEventListener('click', handleInstrumentFilterClick);
        });
        console.log(`>>> [DEBUG Resources Setup] Attached listeners to ${instrumentButtons.length} instrument buttons.`);
    } else {
        console.warn('>>> [DEBUG Resources Setup] No instrument filter buttons found.');
    }

    // Search input - APPLY DEBOUNCE
    const searchInput = document.getElementById('resource-search');
    if (searchInput) {
        console.log('>>> [DEBUG Resources Setup] Found #resource-search. Attaching debounced listener...');
        const debouncedDisplayResources = debounce(displayResources, 300);
        searchInput.removeEventListener('input', displayResources); // Remove direct listener if exists
        searchInput.removeEventListener('input', debouncedDisplayResources); // Remove debounced listener if somehow exists
        searchInput.addEventListener('input', debouncedDisplayResources); // Add debounced listener
        console.log('>>> [DEBUG Resources Setup] Attached DEBOUNCED listener to search input.');
    } else {
         console.error('>>> [DEBUG Resources Setup] Resource search input #resource-search not found.'); 
    }

    // Add button delegation (attach listener to the list container)
    const listContainer = document.getElementById('dynamic-resource-list');
    if (listContainer) {
        listContainer.removeEventListener('click', handleAddCategoryFromResource);
        listContainer.addEventListener('click', handleAddCategoryFromResource);
        console.log('>>> [DEBUG Resources Setup] Attached listener to list container for add buttons.');
    } else {
        console.error('>>> [DEBUG Resources Setup] List container #dynamic-resource-list not found for attaching add button listener.');
    }

    // **** ADD Listeners for How-To Buttons ****
    const howToUseBtn = document.getElementById('resources-how-to-use-btn');
    if (howToUseBtn) {
        howToUseBtn.removeEventListener('click', handleHowToUseClick);
        howToUseBtn.addEventListener('click', handleHowToUseClick);
        console.log('>>> [DEBUG Resources Setup] Attached listener to How To Use button.');
    } else {
        console.warn('>>> [DEBUG Resources Setup] #resources-how-to-use-btn not found.');
    }

    const howToPracticeBtn = document.getElementById('how-to-practice-btn');
    if (howToPracticeBtn) {
        howToPracticeBtn.removeEventListener('click', handleHowToPracticeClick);
        howToPracticeBtn.addEventListener('click', handleHowToPracticeClick);
        console.log('>>> [DEBUG Resources Setup] Attached listener to How To Practice button.');
    } else {
        console.warn('>>> [DEBUG Resources Setup] #how-to-practice-btn not found.');
    }

    // Remove the conflicting event listener for explore-resources-btn
    // It's already being handled by PracticeResourcesList.init() in resources-list.js
    /* Remove this block to avoid conflicts
    const assistantBtn = document.getElementById('explore-resources-btn');
    if (assistantBtn) {
        assistantBtn.removeEventListener('click', handleAssistantClick);
        assistantBtn.addEventListener('click', handleAssistantClick);
        console.log('>>> [DEBUG Resources Setup] Attached listener to Assistant button.');
    } else {
        console.warn('>>> [DEBUG Resources Setup] #explore-resources-btn not found.');
    }
    */
    // **** END Listeners for How-To Buttons ****
}

// Handler for instrument filter clicks (separated for clarity)
function handleInstrumentFilterClick(event) {
    const clickedButton = event.currentTarget;
    const allButtons = document.querySelectorAll('.resource-instrument-filter-btn');
    
    // Check if the clicked button is already active
    if (clickedButton.classList.contains('active') && document.querySelectorAll('.resource-instrument-filter-btn.active').length === 1) {
        // If this is the only active button and it's clicked, make all buttons active
        allButtons.forEach(btn => btn.classList.add('active'));
        console.log('[DEBUG Filters] All instrument buttons activated');
    } else {
        // Make only this button active, deactivate all others
        allButtons.forEach(btn => btn.classList.remove('active'));
        clickedButton.classList.add('active');
        console.log(`[DEBUG Filters] Single instrument activated: ${clickedButton.dataset.instrument}`);
    }
    
    displayResources(); // Re-render list on filter change
}

// Initialize the resources page
function initializeResources() {
    console.log('>>> [DEBUG Resources Init] initializeResources() CALLED.'); // Log entry
    const container = document.getElementById('resources-page');
    if (!container) {
        console.error('>>> [DEBUG Resources Init] Resources page container #resources-page not found.');
        return;
    }
    // Check if already initialized to prevent duplicate listeners
    if (container.dataset.initialized === 'true') {
        console.log('>>> [DEBUG Resources Init] Resources page already initialized. Skipping setup.');
        displayResources(); // Ensure list is displayed correctly if re-navigating
        return;
    }
    
    console.log('>>> [DEBUG Resources Init] Running setupResourceEventListeners...');
    setupResourceEventListeners();
    console.log('>>> [DEBUG Resources Init] Running displayResources...');
    displayResources(); // Initial display
    container.dataset.initialized = 'true'; // Mark as initialized
    console.log('>>> [DEBUG Resources Init] Resources page initialization COMPLETE.');
}

// --- Helper: generateUUID (if not globally available) ---
if (typeof generateUUID === 'undefined') {
    function generateUUID() { 
        let d = new Date().getTime();
        let d2 = (performance && performance.now && (performance.now() * 1000)) || 0;
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            let r = Math.random() * 16;
            if (d > 0) {
                r = (d + r) % 16 | 0;
                d = Math.floor(d / 16);
            } else {
                r = (d2 + r) % 16 | 0;
                d2 = Math.floor(d2 / 16);
            }
            return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
        });
    }
}

// Ensure escapeHTML exists (copy if not global)
if (typeof escapeHTML === 'undefined') {
    function escapeHTML(str) {
      if (typeof str !== 'string') return str; 
      return str.replace(/[&<>'"/]/g, function (s) {
        return {
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          '"': '&quot;',
          "'": '&#39;',
          '/': '&#x2F;'
        }[s];
      });
    }
}

// **** ADD Handlers for How-To Buttons ****
function handleHowToUseClick() {
    console.log('[DEBUG Categories] handleHowToUseClick called.');
    if (window.UserGuide && typeof window.UserGuide.showUserGuide === 'function') {
        console.log('[DEBUG Categories] Found window.UserGuide.showUserGuide, calling it.');
        try {
            window.UserGuide.showUserGuide();
        } catch (error) {
            console.error("Error calling UserGuide.showUserGuide:", error);
            alert('Error displaying User Guide. Try refreshing the page.');
        }
    } else {
        console.error('[DEBUG Categories] window.UserGuide or window.UserGuide.showUserGuide is not available.');
        console.log('[DEBUG Categories] Current value of window.UserGuide:', window.UserGuide);
        alert('User Guide is not available. Please refresh the page or check if JavaScript is enabled.');
    }
}

function handleHowToPracticeClick() {
    console.log("How to Practice button clicked");
    if (window.UserGuide && typeof window.UserGuide.showHowToPracticeGuide === 'function') {
        try {
            window.UserGuide.showHowToPracticeGuide();
        } catch (error) {
            console.error("Error calling UserGuide.showHowToPracticeGuide:", error);
            alert('Error displaying How to Practice guide. Try refreshing the page.');
        }
    } else {
        console.error('[DEBUG Categories] window.UserGuide or window.UserGuide.showHowToPracticeGuide is not available.');
        console.log('[DEBUG Categories] Current value of window.UserGuide:', window.UserGuide);
        alert('How to Practice guide is not available. Please refresh the page or check if JavaScript is enabled.');
    }
}

// Remove handleAssistantClick function as it's handled by PracticeResourcesList
/* 
function handleAssistantClick() {
    console.log("[DEBUG Categories] Assistant button clicked.");
    // Check for the NEW MusicChannelFinder module
    if (window.MusicChannelFinder && typeof window.MusicChannelFinder.show === 'function') {
        console.log("[DEBUG Categories] Found MusicChannelFinder.show, calling it.");
        try {
            window.MusicChannelFinder.show(); // Call the new finder's show method
        } catch (error) {
            console.error("Error calling MusicChannelFinder.show:", error);
            alert('Could not open the Channel Finder. Check console.');
        }
    } else {
        // Log if the new finder isn't available
        console.error('[DEBUG Categories] window.MusicChannelFinder or its show method is not available.');
        console.log('[DEBUG Categories] Current value of window.MusicChannelFinder:', window.MusicChannelFinder);
        alert('Channel Finder feature is not available yet.'); // Fallback alert
    }
}
*/
// --- END Restore deleted code ---

// Expose the initializeResources function to the window object
window.initializeResources = initializeResources;