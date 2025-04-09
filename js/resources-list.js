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

## Instrument-Specific Resources

### Piano/Keyboard
- [Pianote Free Lessons](https://www.pianote.com/blog/category/free-piano-lessons/) - Free piano lessons from Pianote
- [Pianogroove](https://www.pianogroove.com/free-lessons/) - Jazz, blues and pop piano tutorials
- [Piano Society](https://www.pianosociety.com/) - Classical piano recordings and sheet music
- [Yale University Piano Lessons](https://www.youtube.com/playlist?list=PLh9mgdi4rNezhx8YiGIV8I22ICSuzslja) - Professor Wei-Yi Yang's piano lessons

### Guitar
- [Justin Guitar](https://www.justinguitar.com/) - Comprehensive free guitar lessons
- [Guitar Compass](https://www.guitarcompass.com/free-lessons/) - Free video lessons
- [Andy Guitar](https://www.andyguitar.co.uk/online-lessons/) - Free online guitar lessons
- [Fretboard Theory](https://www.fretboardtheory.com/blog/) - Blog with free guitar theory articles
- [Classical Guitar Corner Academy Blog](https://www.classicalguitarcorner.com/blog/) - Free classical guitar resources
- [Real Guitar Online Lessons](https://www.realguitarlessons.com/lessons/) - Free guitar resources

### Drums
- [Drumeo Free Lessons](https://www.drumeo.com/free/) - Free drum lessons
- [Free Drum Lessons Online](https://www.freedrumlessons.com/) - Video lessons for beginners to advanced
- [Stephen Taylor Drum Lessons](https://www.stephentaylordrums.com/free-stuff/) - Free resources and video lessons
- [Drum Rudiments](https://www.40drumrudiments.com/) - All 40 drum rudiments with video tutorials
- [Modern Drummer Educational Resources](https://www.moderndrummer.com/education/) - Selected free content from Modern Drummer magazine

### Strings (Violin, Viola, Cello, Bass)
- [Violin Lab Free Lessons](https://www.violinlab.com/free-violin-lessons/) - Free violin lessons
- [Strings Magazine Resources](https://stringsmagazine.com/category/technique-blogs/) - Free articles on string technique
- [Cello Heaven](https://celloheaven.com/free-cello-lessons/) - Free cello lessons and resources
- [The Strad Magazine](https://www.thestrad.com/playing) - Selected free articles on string playing techniques
- [String Pedagogy Notebook](https://stringpedagogy.com/articles/) - Free string pedagogy articles
- [MyViolinVideos](https://www.myviolinvideos.com/) - Professor Kurt Sassmannshaus's free violin lessons

### Woodwinds
- [The Flute Coach](https://theflutecoach.com/blog/) - Free flute resources and tutorials
- [Clarinet Institute Digital Library](https://www.clarinetinstitute.com/free-music) - Free sheet music and resources
- [David Keller's Bassoon Website](https://davidkbassoon.com/) - Free bassoon resources and articles
- [McGill Saxophone Resources](https://www.mcgill.ca/music/about-us/blog/saxophone-resources) - Free articles and resources

### Brass
- [Trumpet Excerpts](https://www.trumpetexcerpts.org/) - Orchestral trumpet excerpts with commentary
- [Trombone Excerpts](https://www.tromboneexcerpts.org/) - Orchestral trombone excerpts with commentary
- [Horn Matters](https://hornmatters.com/) - French horn articles and resources
- [The Brass Junkies Podcast](https://podcasts.apple.com/us/podcast/the-brass-junkies/id1161220133) - Interviews with brass musicians
- [International Tuba Euphonium Association Resources](https://www.iteaonline.org/index.php/resources/free-resources) - Free tuba and euphonium resources

## Technical Resources

### Music Production and Technology
- [Music Production MOOC](https://www.kadenze.com/courses/introduction-to-music-production/info) - Free introductory course to music production
- [Recording Revolution](https://www.recordingrevolution.com/blog/) - Home recording tutorials and tips
- [Pro Audio Files](https://theproaudiofiles.com/category/free-tutorials/) - Free tutorials on audio engineering
- [Sound On Sound (Selected Articles)](https://www.soundonsound.com/) - Technical articles on music production
- [Music Tech Teacher](https://www.musictechteacher.com/) - Free music technology lessons and worksheets

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

## Music Medicine and Health

### Musicians' Health Resources
- [Performing Arts Medicine Association](https://www.artsmed.org/resources) - Selected free resources
- [Musicians' Health Collective](https://musicianshealth.co.uk/blog/) - Articles on musicians' health
- [The Musician's Health Resource](https://musicianshealth.com/blog/) - Health information for musicians
- [Athletes and the Arts](https://www.athletesandthearts.com/resources/) - Resources on musician wellness

## Sheet Music Libraries

### Free Sheet Music Collections
- [Musopen](https://musopen.org/) - Free public domain music
- [Free-scores.com](https://www.free-scores.com/) - Free sheet music downloads
- [Mutopia Project](https://www.mutopiaproject.org/) - Free sheet music based on editions in the public domain
- [CPDL (Choral Public Domain Library)](https://www.cpdl.org/) - Free choral music
- [8notes](https://www.8notes.com/) - Free sheet music for different instruments
- [International Music Score Library Project (IMSLP)](https://imslp.org/wiki/Main_Page) - Free sheet music in the public domain

## Sight-Reading and Ear Training

### Interactive Tools
- [Sight Reading Factory](https://www.sightreadingfactory.com/freeresources) - Selected free sight-reading exercises
- [Good-Ear.com](https://www.good-ear.com/) - Free ear training exercises
- [Teoria Ear Training](https://www.teoria.com/en/exercises/) - Interactive ear training exercises
- [Functional Ear Trainer](https://www.miles.be/) - Free ear training application
- [EarMaster Practice](https://www.earmaster.com/free-resources/) - Selected free ear training exercises
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
        // Create modal dialog
        const dialog = document.createElement('dialog');
        dialog.className = 'standard-dialog';
        dialog.id = 'resources-modal';
        
        // Create modal content
        const content = document.createElement('div');
        content.className = 'modal-content';
        content.innerHTML = parseMarkdownToHTML(resourcesData);
        
        // Create close button
        const closeButton = document.createElement('button');
        closeButton.className = 'app-button app-button--secondary';
        closeButton.innerHTML = '<i data-lucide="x"></i> Close';
        closeButton.onclick = () => dialog.close();
        
        // Add content and button to dialog
        dialog.appendChild(content);
        dialog.appendChild(closeButton);
        
        // Add dialog to body
        document.body.appendChild(dialog);
        
        // Show dialog
        dialog.showModal();
        
        // Update Lucide icons
        lucide.createIcons();
    }

    // Initialize the module
    function init() {
        // Add click handler to the explore resources button
        const exploreResourcesBtn = document.getElementById('explore-resources-btn');
        if (exploreResourcesBtn) {
            exploreResourcesBtn.addEventListener('click', showResourcesModal);
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
    window.PracticeResourcesList.init();
}); 