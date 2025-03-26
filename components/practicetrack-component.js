// components/PracticeTrackApp.js
import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  BarChart3, 
  Settings, 
  Play, 
  Pause, 
  Save, 
  List,
  RefreshCw,
  Trash2,
  Camera,
  Video,
  Image,
  X,
  CheckCircle,
  Download,
  Upload,
  AlertCircle
} from 'lucide-react';
import storageManager from '../utils/StorageManager.js';

// Sample data for demonstration (in a real app, this would come from IndexedDB)
const PRACTICE_CATEGORIES = [
  'Improvisation',
  'Scales',
  'Chords',
  'Technique',
  'Arpeggios',
  'Rhythmic Exercises',
  'Licks & Vocabulary',
  'Songs',
  'Songwriting',
  'Theory & Concepts',
  'Something Else'
];

// Technique Subcategories
const TECHNIQUE_SUBCATEGORIES = [
  'Alternate Picking',
  'Legato',
  'Sweep Picking',
  'Tapping',
  'Strumming',
  'Finger Picking',
  'Other'
];

// Simulated database for preview
const SimulatedDB = {
  sessions: [
    {
      id: 1,
      date: new Date(2025, 2, 25).toISOString(),
      category: 'Scales',
      subcategory: '',
      duration: 600,
      notes: 'Practiced major scales in all 12 keys',
      synced: true,
      media: null
    },
    {
      id: 2,
      date: new Date(2025, 2, 24).toISOString(),
      category: 'Technique',
      subcategory: 'Alternate Picking',
      duration: 900,
      notes: 'Working on economy picking exercises',
      synced: true,
      media: {
        type: 'photo',
        url: 'https://placehold.co/400x300/0D5CFF/FFF?text=Guitar+Practice',
        id: 'sim_photo_1'
      }
    }
  ],
  
  // Sample placeholder images for simulation
  placeholderImages: [
    'https://placehold.co/400x300/0D5CFF/FFF?text=Guitar+Practice',
    'https://placehold.co/400x300/FF4C4C/FFF?text=Piano+Practice',
    'https://placehold.co/400x300/90EE90/333?text=Drum+Practice',
    'https://placehold.co/400x300/FFD700/333?text=Bass+Practice'
  ],
  
  // Video placeholder
  placeholderVideo: 'https://placehold.co/400x300/333/FFF?text=Practice+Video'
};

const PracticeTrackApp = () => {
  // State Management
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubcategory, setSelectedSubcategory] = useState('');
  const [notes, setNotes] = useState('');
  const [currentView, setCurrentView] = useState('timer');
  const [practiceHistory, setPracticeHistory] = useState([...SimulatedDB.sessions]);
  const [lastSavedSession, setLastSavedSession] = useState(null);
  const [syncStatus, setSyncStatus] = useState('');
  
  // Media states
  const [showMediaCapture, setShowMediaCapture] = useState(false);
  const [captureType, setCaptureType] = useState(null); // 'photo' or 'video'
  const [mediaData, setMediaData] = useState(null);
  const [captureSuccess, setCaptureSuccess] = useState(false);
  
  // Import/Export states
  const [exportStatus, setExportStatus] = useState('');
  const [importStatus, setImportStatus] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Initialize storage manager and load data
  useEffect(() => {
    const initializeApp = async () => {
      try {
        await storageManager.init();
        console.log('Storage initialized');
        
        // Try to load real data
        const sessions = await storageManager.getSessionsWithMedia();
        if (sessions && sessions.length > 0) {
          setPracticeHistory(sessions);
        }
      } catch (error) {
        console.error('Error initializing app:', error);
      }
    };
    
    initializeApp();
  }, []);

  // Timer Logic
  useEffect(() => {
    let interval;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  // Format time to MM:SS
  const formatTime = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };
  
  // Simulated media capture functions
  const startCapture = (type) => {
    setShowMediaCapture(true);
    setCaptureType(type);
    setCaptureSuccess(false);
  };
  
  const simulateCapture = () => {
    // Simulate a delay for realism
    setTimeout(() => {
      const url = captureType === 'photo' 
        ? SimulatedDB.placeholderImages[Math.floor(Math.random() * SimulatedDB.placeholderImages.length)]
        : SimulatedDB.placeholderVideo;
      
      setMediaData({
        type: captureType,
        url: url,
        id: `sim_${captureType}_${Date.now()}`
      });
      
      setCaptureSuccess(true);
      
      // Close the capture UI after a success notification
      setTimeout(() => {
        setShowMediaCapture(false);
      }, 1500);
    }, 1000);
  };
  
  // Clear captured media
  const clearMedia = () => {
    setMediaData(null);
  };

  // Save Practice Session
  const savePracticeSession = async () => {
    const newSession = {
      id: Date.now(),
      date: new Date().toISOString(),
      category: selectedCategory,
      subcategory: selectedSubcategory,
      duration: elapsedTime,
      notes: notes,
      synced: false,
      media: mediaData
    };
    
    try {
      // In a real implementation, we would save to IndexedDB
      // await storageManager.addSession(newSession);
      
      // For demo, just update state
      setPracticeHistory(prev => [newSession, ...prev]);
      setLastSavedSession(newSession);
      
      // Reset form
      setElapsedTime(0);
      setSelectedCategory('');
      setSelectedSubcategory('');
      setNotes('');
      setMediaData(null);
      setIsTimerRunning(false);
    } catch (error) {
      console.error('Error saving session:', error);
      alert('Error saving practice session');
    }
  };
  
  // Simulated export to CSV
  const handleExport = () => {
    setIsExporting(true);
    setExportStatus('Exporting data...');
    
    // Simulate export process
    setTimeout(() => {
      setExportStatus('Export completed successfully!');
      setIsExporting(false);
      
      // Clear status after a delay
      setTimeout(() => setExportStatus(''), 3000);
    }, 2000);
  };
  
  // Simulated import from CSV
  const handleImport = () => {
    setIsImporting(true);
    setImportStatus('Importing data...');
    
    // Simulate import process
    setTimeout(() => {
      setImportStatus('Import completed successfully!');
      setIsImporting(false);
      setShowImportModal(false);
      
      // Clear status after a delay
      setTimeout(() => setImportStatus(''), 3000);
    }, 2000);
  };
  
  // Media Capture UI
  const renderMediaCapture = () => {
    if (!showMediaCapture) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">
              {captureSuccess 
                ? 'Capture Successful!' 
                : captureType === 'photo' 
                  ? 'Take a Photo' 
                  : 'Record Video'}
            </h3>
            <button 
              onClick={() => setShowMediaCapture(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          {captureSuccess ? (
            <div className="flex flex-col items-center justify-center mb-4">
              <CheckCircle size={64} className="text-green-500 mb-2" />
              <p className="text-center">Media captured successfully!</p>
            </div>
          ) : (
            <>
              <div className="bg-black rounded-lg overflow-hidden mb-4 relative">
                <div className="w-full h-64 flex items-center justify-center text-white">
                  {captureType === 'photo' 
                    ? "Camera preview would appear here" 
                    : "Video preview would appear here"}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-white rounded-full"></div>
                </div>
              </div>
              
              <div className="flex justify-center space-x-4 mb-2">
                <button 
                  onClick={simulateCapture}
                  className={`${captureType === 'photo' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-500 hover:bg-red-600'} text-white p-3 rounded-full`}
                >
                  {captureType === 'photo' ? <Camera size={24} /> : <Video size={24} />}
                </button>
              </div>
              
              <p className="text-xs text-center text-gray-500 mt-2">
                This is a simulation. In a real app, this would access your device's camera.
              </p>
            </>
          )}
        </div>
      </div>
    );
  };
  
  // Import Modal UI
  const renderImportModal = () => {
    if (!showImportModal) return null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-4 w-full max-w-md mx-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Import Practice Data</h3>
            <button 
              onClick={() => setShowImportModal(false)}
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <X size={20} />
            </button>
          </div>
          
          <p className="text-sm text-gray-600 mb-4">
            Import your practice data from CSV files. This will replace your current data.
          </p>
          
          <div className="space-y-3 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Sessions CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">
                Categories CSV File
              </label>
              <input
                type="file"
                accept=".csv"
                className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
          </div>
          
          <button 
            onClick={handleImport}
            disabled={isImporting}
            className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center disabled:bg-gray-400"
          >
            {isImporting ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Upload size={16} className="mr-2" />
            )}
            Import Data
          </button>
          
          {importStatus && (
            <div className="text-sm mt-2 text-center text-green-500">
              {importStatus}
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render Media Preview
  const renderMediaPreview = () => {
    if (!mediaData) return null;
    
    return (
      <div className="mt-4 rounded-lg overflow-hidden border border-gray-300 relative">
        {mediaData.type === 'photo' ? (
          <img 
            src={mediaData.url} 
            alt="Captured" 
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gray-900 flex items-center justify-center">
            <div className="text-white text-center">
              <Video size={32} className="mx-auto mb-2" />
              <p>Video Preview</p>
              <p className="text-xs mt-1 text-gray-400">(Simulated)</p>
            </div>
          </div>
        )}
        
        <button 
          onClick={clearMedia}
          className="absolute top-2 right-2 bg-black bg-opacity-50 text-white p-1 rounded-full hover:bg-opacity-75"
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  // Render Timer View
  const renderTimerView = () => (
    <div className="p-4 space-y-4">
      <div className="bg-gray-100 rounded-lg p-4 text-center">
        <div className="text-4xl font-bold text-gray-600 mb-2">
          {formatTime(elapsedTime)}
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          {!isTimerRunning ? (
            <button 
              onClick={() => setIsTimerRunning(true)} 
              className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition-colors"
            >
              <Play size={24} />
            </button>
          ) : (
            <button 
              onClick={() => setIsTimerRunning(false)} 
              className="bg-red-500 text-white p-3 rounded-full hover:bg-red-600 transition-colors"
            >
              <Pause size={24} />
            </button>
          )}
        </div>
      </div>

      {/* Practice Session Form */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-600 mb-1">
          Practice Category
        </label>
        <select 
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            // Reset subcategory if not Technique
            if (e.target.value !== 'Technique') {
              setSelectedSubcategory('');
            }
          }}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select Category</option>
          {PRACTICE_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>

        {/* Technique Subcategory */}
        {selectedCategory === 'Technique' && (
          <select 
            value={selectedSubcategory}
            onChange={(e) => setSelectedSubcategory(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md mt-2"
          >
            <option value="">Select Technique</option>
            {TECHNIQUE_SUBCATEGORIES.map(technique => (
              <option key={technique} value={technique}>
                {technique}
              </option>
            ))}
          </select>
        )}

        {/* Notes Input */}
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Optional practice notes..."
          className="w-full p-2 border border-gray-300 rounded-md mt-2 h-20"
        />

        {/* Media Capture Buttons */}
        <div className="flex space-x-2 mt-2">
          <button 
            onClick={() => startCapture('photo')}
            className="flex-1 bg-gray-100 text-gray-700 p-2 rounded flex items-center justify-center hover:bg-gray-200"
          >
            <Camera size={16} className="mr-2" />
            Take Photo
          </button>
          <button 
            onClick={() => startCapture('video')}
            className="flex-1 bg-gray-100 text-gray-700 p-2 rounded flex items-center justify-center hover:bg-gray-200"
          >
            <Video size={16} className="mr-2" />
            Record Video
          </button>
        </div>

        {/* Media Preview */}
        {renderMediaPreview()}

        {/* Save Session Button */}
        <button 
          onClick={savePracticeSession}
          disabled={!selectedCategory}
          className="w-full bg-blue-600 text-white p-2 rounded mt-4 disabled:bg-gray-400 hover:bg-blue-700 transition-colors flex justify-center items-center"
        >
          <Save size={16} className="mr-2" />
          Save Practice Session
        </button>
      </div>
    </div>
  );

  // Render History View
  const renderHistoryView = () => {
    const handleDeleteSession = (id) => {
      setPracticeHistory(prev => prev.filter(session => session.id !== id));
    };

    return (
      <div className="p-4">
        <h2 className="text-xl font-bold mb-4 text-gray-800">Practice History</h2>
        {practiceHistory.length === 0 ? (
          <p className="text-gray-600 text-center">No practice sessions yet</p>
        ) : (
          <div className="space-y-2">
            {practiceHistory.map((session) => (
              <div 
                key={session.id} 
                className="bg-white shadow-sm rounded-lg p-3 flex justify-between items-center border border-gray-300"
              >
                <div className="flex-1">
                  <div className="font-medium text-gray-800 flex items-center">
                    {session.category} 
                    {session.subcategory && ` - ${session.subcategory}`}
                    {session.media && (
                      <span className="ml-2">
                        {session.media.type === 'photo' ? (
                          <Image size={12} className="text-blue-500" />
                        ) : (
                          <Video size={12} className="text-blue-500" />
                        )}
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(session.date).toLocaleDateString()} - {formatTime(session.duration)}
                  </div>
                  {session.notes && (
                    <div className="text-xs text-gray-500 mt-1">
                      {session.notes}
                    </div>
                  )}
                </div>
                {session.media && session.media.url && (
                  <div className="mx-2 w-12 h-12 rounded overflow-hidden border border-gray-200">
                    {session.media.type === 'photo' ? (
                      <img 
                        src={session.media.url} 
                        alt="Session media" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
                        <Video size={8} className="text-white" />
                      </div>
                    )}
                  </div>
                )}
                <button 
                  onClick={() => handleDeleteSession(session.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded ml-2"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  // Render Stats View
  const renderStatsView = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Practice Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {practiceHistory.length}
          </div>
          <div className="text-sm text-gray-600">Total Sessions</div>
        </div>
        <div className="bg-gray-100 p-4 rounded-lg text-center">
          <div className="text-2xl font-bold text-blue-600">
            {formatTime(practiceHistory.reduce((total, session) => total + session.duration, 0))}
          </div>
          <div className="text-sm text-gray-600">Total Practice Time</div>
        </div>
      </div>
      <div className="mt-4">
        <h3 className="font-semibold mb-2 text-gray-800">Practice by Category</h3>
        {(() => {
          const categoryTotals = practiceHistory.reduce((acc, session) => {
            acc[session.category] = (acc[session.category] || 0) + session.duration;
            return acc;
          }, {});

          return Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .map(([category, duration]) => (
              <div 
                key={category} 
                className="flex justify-between items-center bg-gray-100 p-2 rounded mb-1"
              >
                <span className="text-gray-800">{category}</span>
                <span className="font-medium text-blue-600">{formatTime(duration)}</span>
              </div>
            ));
        })()}
      </div>
    </div>
  );

  // Render Settings View with Sync
  const renderSettingsView = () => (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Settings</h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Default Lesson Day
          </label>
          <select className="w-full p-2 border border-gray-300 rounded-md">
            <option>Monday</option>
            <option>Tuesday</option>
            <option>Wednesday</option>
            <option>Thursday</option>
            <option>Friday</option>
            <option>Saturday</option>
            <option>Sunday</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-2">
            Default Lesson Time
          </label>
          <input 
            type="time" 
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      
      <div className="bg-gray-100 p-4 rounded-lg">
        <h3 className="font-medium text-lg mb-3">Data Sync</h3>
        <p className="text-sm text-gray-600 mb-4">
          Sync your practice data between devices using CSV files
        </p>
        
        <div className="space-y-3">
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center disabled:bg-gray-400"
          >
            {isExporting ? (
              <RefreshCw size={16} className="mr-2 animate-spin" />
            ) : (
              <Download size={16} className="mr-2" />
            )}
            Export to CSV
          </button>
          
          <button 
            onClick={() => setShowImportModal(true)}
            className="w-full bg-blue-600 text-white p-2 rounded flex items-center justify-center"
          >
            <Upload size={16} className="mr-2" />
            Import from CSV
          </button>
        </div>
        
        {exportStatus && (
          <div className="text-sm mt-2 text-center text-green-500">
            <CheckCircle size={16} className="inline mr-1" />
            {exportStatus}
          </div>
        )}
      </div>
    </div>
  );

  // Main App Component
  return (
    <div className="max-w-md mx-auto bg-white min-h-screen flex flex-col">
      <div className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Practice<span className="text-yellow-300">Track</span></h1>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-grow">
        {currentView === 'timer' && renderTimerView()}
        {currentView === 'history' && renderHistoryView()}
        {currentView === 'stats' && renderStatsView()}
        {currentView === 'settings' && renderSettingsView()}
      </div>
      
      {/* Bottom Navigation */}
      <div className="flex justify-between bg-white border-t border-gray-200 p-2">
        <button 
          onClick={() => setCurrentView('timer')}
          className={`flex flex-col items-center p-2 ${currentView === 'timer' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Clock size={20} />
          <span className="text-xs mt-1">Timer</span>
        </button>
        <button 
          onClick={() => setCurrentView('history')}
          className={`flex flex-col items-center p-2 ${currentView === 'history' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <List size={20} />
          <span className="text-xs mt-1">History</span>
        </button>
        <button 
          onClick={() => setCurrentView('stats')}
          className={`flex flex-col items-center p-2 ${currentView === 'stats' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <BarChart3 size={20} />
          <span className="text-xs mt-1">Stats</span>
        </button>
        <button 
          onClick={() => setCurrentView('settings')}
          className={`flex flex-col items-center p-2 ${currentView === 'settings' ? 'text-blue-600' : 'text-gray-500'}`}
        >
          <Settings size={20} />
          <span className="text-xs mt-1">Settings</span>
        </button>
      </div>
      
      {/* Modals */}
      {renderMediaCapture()}
      {renderImportModal()}
      
      {/* Demo notification */}
      <div className="fixed bottom-4 left-0 right-0 mx-auto w-max bg-gray-800 text-white text-xs py-1 px-3 rounded-full opacity-70">
        This app includes simulated localStorage persistence
      </div>
    </div>
  );
};

export default PracticeTrackApp;
