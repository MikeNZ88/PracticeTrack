import React, { useState } from 'react';
import TabContainer from './components/TabContainer';

const App = () => {
  const [activeTab, setActiveTab] = useState('sessions');
  
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Practice<span className="text-orange-400">Track</span></h1>
          </div>
        </div>
      </header>
      
      {/* Tab Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="container mx-auto">
          <div className="flex overflow-x-auto">
            <button 
              onClick={() => setActiveTab('timer')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'timer' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Timer
            </button>
            <button 
              onClick={() => setActiveTab('sessions')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'sessions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Sessions
            </button>
            <button 
              onClick={() => setActiveTab('goals')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'goals' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Goals
            </button>
            <button 
              onClick={() => setActiveTab('media')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'media' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Media
            </button>
            <button 
              onClick={() => setActiveTab('metronome')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'metronome' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Metronome
            </button>
            <button 
              onClick={() => setActiveTab('resources')}
              className={`px-6 py-4 font-medium transition-colors ${activeTab === 'resources' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600 hover:text-blue-600'}`}
            >
              Resources
            </button>
          </div>
        </div>
      </nav>
      
      {/* Main Content Area */}
      <main className="py-8">
        <TabContainer activeTab={activeTab} />
      </main>
    </div>
  );
};

export default App; 