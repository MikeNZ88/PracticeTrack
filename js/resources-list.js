/**
 * Resources List Module
 * Provides a comprehensive list of music learning resources for PracticeTrack
 */

window.PracticeResourcesList = (function() {
    
    // Resource categories and data
    const resourcesData = `
# Comprehensive Music Learning Resources

## General Music Theory and Education

### Academic Institutions and Libraries
- [Open Music Theory](http://openmusictheory.com/) - A free, online "textbook" for college-level music theory courses
- [MIT OpenCourseWare - Music and Theater Arts](https://ocw.mit.edu/courses/music-and-theater-arts/) - Free course materials from MIT's music program
- [Berklee Online - Free Music Resources](https://online.berklee.edu/free-music-resources) - Free tutorials and articles from Berklee College of Music
- [The Royal Conservatory's Theory Resources](https://www.rcmusic.com/learning/digital-learning) - Selected free resources from the Royal Conservatory
- [IMSLP/Petrucci Music Library](https://imslp.org/) - Public domain sheet music archive
- [Library of Congress - Music Resources](https://www.loc.gov/collections/?fa=subject:music) - Historical music collections and educational resources

### Scholarly Journals with Open Access Content
- [Journal of Research in Music Education (Selected Articles)](https://journals.sagepub.com/home/jrm) - Peer-reviewed articles (some open access)
- [Music Theory Online](https://mtosmt.org/) - Open-access scholarly journal of the Society for Music Theory
- [Journal of Music Theory Pedagogy](https://music.appstate.edu/about/jmtp) - Scholarly publication with selected free content
- [Music Performance Research](https://musicperformanceresearch.org/) - Open-access journal on music performance

### Comprehensive Learning Platforms
- [Musictheory.net](https://www.musictheory.net/) - Interactive lessons and exercises
- [Teoria.com](https://www.teoria.com/) - Music theory tutorials and exercises
- [Dave Conservatoire](https://www.daveconservatoire.org/) - Free online music school
- [Music Theory Academy](https://www.musictheoryacademy.com/free-resources/) - Free theory lessons and worksheets
- [Coursera Music Courses](https://www.coursera.org/browse/arts-and-humanities/music-and-art) - University courses with audit option (free access to course materials)
- [edX Music Courses](https://www.edx.org/learn/music) - University courses with audit option
- [Udemy Free Music Courses](https://www.udemy.com/topic/music/free/) - Free courses on various music topics

### General Music Theory and Education
- [MusicTheoryForMusicians.com](https://www.musictheoryformusicians.com/) - Comprehensive music theory lessons and resources
- [ToneSavvy](https://www.tonesavvy.com/) - Interactive music theory and ear training exercises

## Instrument-Specific Resources

### Piano/Keyboard
- [Pianote Free Lessons](https://www.pianote.com/blog/category/free-piano-lessons/) - Free piano lessons from Pianote
- [Pianogroove](https://www.pianogroove.com/free-lessons/) - Jazz, blues and pop piano tutorials
- [Piano Society](https://www.pianosociety.com/) - Classical piano recordings and sheet music
- [Yale University Piano Lessons](https://www.youtube.com/playlist?list=PLh9mgdi4rNezhx8YiGIV8I22ICSuzslja) - Professor Wei-Yi Yang's piano lessons
- [PianoNanny](https://www.pianonanny.com/) - Free online piano lessons for beginners
- [Flowkey](https://www.flowkey.com/en) - Interactive piano learning app with free trial

### Guitar
- [Justin Guitar](https://www.justinguitar.com/) - Comprehensive free guitar lessons
- [Guitar Compass](https://www.guitarcompass.com/free-lessons/) - Free video lessons
- [Andy Guitar](https://www.andyguitar.co.uk/online-lessons/) - Free online guitar lessons
- [Fretboard Theory](https://www.fretboardtheory.com/blog/) - Blog with free guitar theory articles
- [Classical Guitar Corner Academy Blog](https://www.classicalguitarcorner.com/blog/) - Free classical guitar resources
- [Real Guitar Online Lessons](https://www.realguitarlessons.com/lessons/) - Free guitar resources
- [TrueFire](https://truefire.com/) - Extensive guitar lessons and courses
- [GuitarTricks](https://www.guitartricks.com/) - Comprehensive guitar learning platform with free trial
- [Ultimate Guitar](https://www.ultimate-guitar.com/) - Extensive library of guitar tabs and chords
- [Songsterr](https://www.songsterr.com/) - Interactive guitar tabs and sheet music

### Drums
- [Drumeo Free Lessons](https://www.drumeo.com/free/) - Free drum lessons
- [Free Drum Lessons Online](https://www.freedrumlessons.com/) - Video lessons for beginners to advanced
- [Stephen Taylor Drum Lessons](https://www.stephentaylordrums.com/free-stuff/) - Free resources and video lessons
- [Drum Rudiments](https://www.40drumrudiments.com/) - All 40 drum rudiments with video tutorials
- [Modern Drummer Educational Resources](https://www.moderndrummer.com/education/) - Selected free content from Modern Drummer magazine
- [Drum Channel](https://www.drumchannel.com/) - Drum lessons and masterclasses from top drummers
- [Drum Ambition](https://www.drumambition.com/) - Beginner drum lessons with free trial

### Strings (Violin, Viola, Cello, Bass)
- [Violin Lab Free Lessons](https://www.violinlab.com/free-violin-lessons/) - Free violin lessons
- [Strings Magazine Resources](https://stringsmagazine.com/category/technique-blogs/) - Free articles on string technique
- [Cello Heaven](https://celloheaven.com/free-cello-lessons/) - Free cello lessons and resources
- [The Strad Magazine](https://www.thestrad.com/playing) - Selected free articles on string playing techniques
- [String Pedagogy Notebook](https://stringpedagogy.com/articles/) - Free string pedagogy articles
- [MyViolinVideos](https://www.myviolinvideos.com/) - Professor Kurt Sassmannshaus's free violin lessons
- [Violin Online](https://www.violinonline.com/) - Free violin lessons and resources
- [CelloBello](https://www.cellobello.org/) - Cello lessons and resources from renowned cellists

### Woodwinds
- [The Flute Coach](https://theflutecoach.com/blog/) - Free flute resources and tutorials
- [Clarinet Institute Digital Library](https://www.clarinetinstitute.com/free-music) - Free sheet music and resources
- [David Keller's Bassoon Website](https://davidkbassoon.com/) - Free bassoon resources and articles
- [McGill Saxophone Resources](https://www.mcgill.ca/music/about-us/blog/saxophone-resources) - Free articles and resources
- [Flute Tunes](https://www.flutetunes.com/) - Free flute sheet music and exercises
- [Sax on the Web](https://www.saxontheweb.net/) - Saxophone resources and forums

### Brass
- [Trumpet Excerpts](https://www.trumpetexcerpts.org/) - Orchestral trumpet excerpts with commentary
- [Trombone Excerpts](https://www.tromboneexcerpts.org/) - Orchestral trombone excerpts with commentary
- [Horn Matters](https://hornmatters.com/) - French horn articles and resources
- [The Brass Junkies Podcast](https://podcasts.apple.com/us/podcast/the-brass-junkies/id1161220133) - Interviews with brass musicians
- [International Tuba Euphonium Association Resources](https://www.iteaonline.org/index.php/resources/free-resources) - Free tuba and euphonium resources
- [Brass Musician](https://www.brassmusician.com/) - Brass instrument resources and articles
- [Tuba Peter](https://www.tubapeter.com/) - Tuba resources and lessons

## Technical Resources

### Music Production and Technology
- [Music Production MOOC](https://www.kadenze.com/courses/introduction-to-music-production/info) - Free introductory course to music production
- [Recording Revolution](https://www.recordingrevolution.com/blog/) - Home recording tutorials and tips
- [Pro Audio Files](https://theproaudiofiles.com/category/free-tutorials/) - Free tutorials on audio engineering
- [Sound On Sound (Selected Articles)](https://www.soundonsound.com/) - Technical articles on music production
- [Music Tech Teacher](https://www.musictechteacher.com/) - Free music technology lessons and worksheets
- [SoundGym](https://www.soundgym.co/) - Audio ear training and music production exercises
- [Splice](https://splice.com/) - Music production tools and community

### Music Software Tutorials
- [MuseScore Tutorials](https://musescore.org/en/tutorials) - Free notation software tutorials
- [Audacity Manual](https://manual.audacityteam.org/) - Comprehensive guide for free audio editing software
- [Reaper Blog](https://reaperblog.net/category/reaper-tutorials/) - Free Reaper DAW tutorials
- [LMMS Tutorials](https://lmms.io/documentation/) - Free DAW tutorials

### Practice and Performance Techniques
- [Bulletproof Musician](https://bulletproofmusician.com/blog/) - Performance psychology blog
- [Music Practice Tips](https://www.musicpracticetips.com/) - Effective practice strategies
- [Gerald Klickstein's Blog](https://www.geraldklickstein.com/blog) - Music practice and performance wisdom
- [The Musician's Way Blog](https://www.musiciansway.com/blog/) - Articles on practice, performance, and creativity
- [The Bulletproof Musician](https://bulletproofmusician.com/) - Performance psychology and practice strategies
- [The Practice of Practice](https://practiceofpractice.com/) - Blog and resources on effective practice methods

## Culture-Specific and World Music Resources

### World Music and Ethnomusicology
- [Smithsonian Folkways](https://folkways.si.edu/learn) - Educational resources on world music
- [World Music Network](https://www.worldmusic.net/blogs/magazine) - Articles on global music styles
- [Afropop Worldwide](https://afropop.org/) - African music resources and articles
- [Society for Ethnomusicology Resources](https://www.ethnomusicology.org/page/Resources) - Academic resources on world music
- [EVIA Digital Archive](https://media.eviada.org/eviadasb/home.html) - Ethnographic video for instruction and analysis

### Jazz Studies
- [Jazz Studies Online](https://jazzstudiesonline.org/) - Columbia University's jazz resources
- [Learn Jazz Standards](https://www.learnjazzstandards.com/blog/) - Jazz theory and improvisation
- [Jazz Advice](https://www.jazzadvice.com/) - Free jazz improvisation articles
- [Open Jazz Theory](https://www.openjazztheory.org/) - Free online jazz theory textbook
- [Jazz at Lincoln Center](https://academy.jazz.org/) - Jazz education resources and courses
- [JazzGuitarLessons.net](https://www.jazzguitarlessons.net/) - Jazz guitar lessons and resources

## Music Education Research and Pedagogy

### Research-Based Resources
- [National Association for Music Education Research](https://nafme.org/my-classroom/research-resources/) - Selected free resources
- [International Journal of Music Education (Selected Articles)](https://journals.sagepub.com/home/ijm) - Some open access content
- [Music Educators Journal (Selected Articles)](https://journals.sagepub.com/home/mej) - Some open access content
- [Journal of Music Teacher Education (Selected Articles)](https://journals.sagepub.com/home/jmt) - Some open access content

### Teaching Methods
- [The Kodály Institute](https://kodaly.hu/study/knowledge-base-110319) - Resources on Kodály method
- [Dalcroze Society of America Resources](https://dalcrozeusa.org/resources/) - Free resources on Dalcroze Eurhythmics
- [Orff Schulwerk Teacher Resources](https://aosa.org/resources/teacher-resources/) - Selected free resources on Orff approach
- [Suzuki Association Resources](https://suzukiassociation.org/teachers/resources/) - Selected free resources on Suzuki method

### Music Education Research and Pedagogy
- [The Music Teachers National Association](https://www.mtna.org/) - Resources for music educators
- [The National Association for Music Education](https://nafme.org/) - Music education resources and advocacy

## Music Medicine and Health

### Musicians' Health Resources
- [Performing Arts Medicine Association](https://www.artsmed.org/resources) - Selected free resources
- [Musicians' Health Collective](https://musicianshealth.co.uk/blog/) - Articles on musicians' health
- [The Musician's Health Resource](https://musicianshealth.com/blog/) - Health information for musicians
- [Athletes and the Arts](https://www.athletesandthearts.com/resources/) - Resources on musician wellness
- [Musicians' Health Collective](https://musicianshealth.co.uk/) - Articles on musicians' health and wellness
- [Performing Arts Medicine Association](https://artsmed.org/) - Resources on health for performing artists

## Sheet Music Libraries

### Free Sheet Music Collections
- [Musopen](https://musopen.org/) - Free public domain music
- [Free-scores.com](https://www.free-scores.com/) - Free sheet music downloads
- [Mutopia Project](https://www.mutopiaproject.org/) - Free sheet music based on editions in the public domain
- [CPDL (Choral Public Domain Library)](https://www.cpdl.org/) - Free choral music
- [8notes](https://www.8notes.com/) - Free sheet music for different instruments
- [International Music Score Library Project (IMSLP)](https://imslp.org/wiki/Main_Page) - Free sheet music in the public domain
- [Sheet Music Plus](https://www.sheetmusicplus.com/) - Free sheet music downloads and resources
- [Virtual Sheet Music](https://www.virtualsheetmusic.com/) - Free sheet music and resources

## Sight-Reading and Ear Training

### Interactive Tools
- [Sight Reading Factory](https://www.sightreadingfactory.com/freeresources) - Selected free sight-reading exercises
- [Good-Ear.com](https://www.good-ear.com/) - Free ear training exercises
- [Teoria Ear Training](https://www.teoria.com/en/exercises/) - Interactive ear training exercises
- [Functional Ear Trainer](https://www.miles.be/) - Free ear training application
- [EarMaster Practice](https://www.earmaster.com/free-resources/) - Selected free ear training exercises
- [Sight Reading Factory](https://www.sightreadingfactory.com/) - Sight-reading exercises and tools
- [EarMaster](https://www.earmaster.com/) - Ear training and sight-singing exercises
`;

    // Parse Markdown to HTML
    function parseMarkdownToHTML(markdown) {
        // Split into lines
        const lines = markdown.split('\n');
        let html = '';
        let inList = false;
        
        for (let line of lines) {
            // Heading processing
            if (line.startsWith('# ')) {
                html += `<h1>${line.substring(2)}</h1>`;
            } else if (line.startsWith('## ')) {
                html += `<h2>${line.substring(3)}</h2>`;
            } else if (line.startsWith('### ')) {
                html += `<h3>${line.substring(4)}</h3>`;
            } else if (line.startsWith('#### ')) {
                html += `<h4>${line.substring(5)}</h4>`;
            } 
            // List processing
            else if (line.startsWith('- ')) {
                if (!inList) {
                    html += '<ul>';
                    inList = true;
                }
                
                // Check if the line contains a Markdown link
                const match = line.match(/- \[(.*?)\]\((.*?)\)(.+)?/);
                
                if (match) {
                    const linkText = match[1];
                    const url = match[2];
                    const description = match[3] ? match[3] : '';
                    
                    html += `<li><a href="${url}" target="_blank" rel="noopener noreferrer">${linkText}</a>${description}</li>`;
                } else {
                    html += `<li>${line.substring(2)}</li>`;
                }
            } 
            // Empty line ends a list
            else if (line.trim() === '' && inList) {
                html += '</ul>';
                inList = false;
                html += '<p></p>';
            }
            // Regular paragraph
            else if (line.trim() !== '') {
                html += `<p>${line}</p>`;
            }
        }
        
        // Close any open list
        if (inList) {
            html += '</ul>';
        }
        
        return html;
    }

    // Create and show resources modal
    function showResourcesModal() {
        console.log("Showing resources modal requested - using static HTML modal instead");
        
        // Use the HTML modal instead of creating a new one
        const staticModal = document.getElementById('resourcesModal');
        if (staticModal) {
            staticModal.style.display = 'block';
            return;
        }
        
        // The rest of this function is kept as a fallback but shouldn't run
        console.log("Static modal not found, using dynamic modal as fallback");
        
        // Remove any existing dialog first
        const existingDialog = document.getElementById('resources-modal');
        if (existingDialog) {
            existingDialog.remove();
        }
        
        // Instead of using HTML <dialog> element which might not be well supported,
        // let's create a div with fixed positioning
        const modalContainer = document.createElement('div');
        modalContainer.className = 'resources-modal-container';
        modalContainer.id = 'resources-modal';
        
        // Add inline styles to ensure it displays correctly
        modalContainer.style.position = 'fixed';
        modalContainer.style.top = '0';
        modalContainer.style.left = '0';
        modalContainer.style.width = '100%';
        modalContainer.style.height = '100%';
        modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        modalContainer.style.display = 'flex';
        modalContainer.style.justifyContent = 'center';
        modalContainer.style.alignItems = 'center';
        modalContainer.style.zIndex = '9999';
        
        // Create modal content
        const contentWrapper = document.createElement('div');
        contentWrapper.className = 'modal-content-wrapper';
        contentWrapper.style.backgroundColor = '#fff';
        contentWrapper.style.borderRadius = '8px';
        contentWrapper.style.padding = '20px';
        contentWrapper.style.maxWidth = '80%';
        contentWrapper.style.maxHeight = '80%';
        contentWrapper.style.overflow = 'auto';
        contentWrapper.style.position = 'relative';
        
        // Create content div
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = parseMarkdownToHTML(resourcesData);
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'app-button app-button--secondary';
        closeButton.innerHTML = '<i data-lucide="x"></i> Close';
        closeButton.style.marginTop = '15px';
        closeButton.style.display = 'block';
        
        // Add content and button to dialog
        contentWrapper.appendChild(content);
        contentWrapper.appendChild(closeButton);
        modalContainer.appendChild(contentWrapper);
        
        // Add dialog to body
        document.body.appendChild(modalContainer);
        
        // Add event listeners
        closeButton.addEventListener('click', () => {
            modalContainer.remove();
        });
        
        // Close when clicking outside the content
        modalContainer.addEventListener('click', (event) => {
            if (event.target === modalContainer) {
                modalContainer.remove();
            }
        });
        
        // Close on ESC key
        document.addEventListener('keydown', function escapeClose(e) {
            if (e.key === 'Escape' && document.getElementById('resources-modal')) {
                modalContainer.remove();
                document.removeEventListener('keydown', escapeClose);
            }
        });
        
        // Update Lucide icons
        if (window.lucide) {
            try {
                lucide.createIcons();
            } catch (err) {
                console.error("Error initializing Lucide icons:", err);
            }
        }
    }

    // Initialize the module
    function init() {
        console.log("Initializing PracticeResourcesList module");
        // Add click handler to the explore resources button
        const exploreResourcesBtn = document.getElementById('explore-resources-btn');
        if (exploreResourcesBtn) {
            // Remove any existing click handlers to avoid conflicts
            exploreResourcesBtn.removeEventListener('click', showResourcesModal);
            // Add our click handler
            exploreResourcesBtn.addEventListener('click', function(event) {
                event.preventDefault();
                console.log("Explore Resources button clicked");
                showResourcesModal();
            });
            console.log("Added event listener to explore-resources-btn");
        } else {
            console.warn("Could not find explore-resources-btn element");
        }
    }
    
    // Return public API
    return {
        init,
        showResourcesModal
    };
})();

// Initialize the module when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded, initializing PracticeResourcesList");
    window.PracticeResourcesList.init();
}); 