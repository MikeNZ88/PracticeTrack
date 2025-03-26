// app.js - Main entry point for PracticeTrack application

// Import the main PracticeTrackApp component
import PracticeTrackApp from './components/PracticeTrackApp.js';

// Export for module usage
export { PracticeTrackApp };

// For direct script imports (optional)
if (typeof window !== 'undefined') {
  window.PracticeTrackApp = PracticeTrackApp;
}

// Log app initialization
console.log('PracticeTrack application initialized');
