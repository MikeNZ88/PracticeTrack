import React, { useState } from 'react';
import SessionCard from './SessionCard';
import GoalCard from './GoalCard';
import MediaCard from './MediaCard';

const TabContainer = ({ activeTab }) => {
  // Mock data for demonstration
  const [sessions] = useState([
    {
      id: 1, 
      title: 'Scale Practice', 
      category: 'Technique', 
      duration: '30m',
      notes: 'Various scales at 110bpm with focus on evenness and accuracy.',
      date: 'Today at 3:15 PM'
    },
    {
      id: 2, 
      title: 'Chord Theory', 
      category: 'Theory', 
      duration: '45m',
      notes: '7th chords in G Major. Practiced chord voicings and inversions.',
      date: 'Yesterday'
    },
    {
      id: 3, 
      title: 'Bach Prelude', 
      category: 'Repertoire', 
      duration: '60m',
      notes: 'Bach prelude in C. Worked on articulation and phrasing.',
      date: '2 days ago'
    }
  ]);

  const [goals] = useState([
    {
      id: 1,
      title: 'Master Hanon Exercise #4 at 120 BPM',
      description: 'Focus on finger independence and even articulation. Start at 90 BPM and gradually increase tempo.',
      category: 'Technique',
      completed: false,
      dueDate: 'May 15, 2025',
      targetMetric: '120 BPM',
      progress: 75
    },
    {
      id: 2,
      title: 'Learn Autumn Leaves',
      description: 'Memorize lead sheet for Autumn Leaves jazz standard. Practice with metronome at quarter note = 120.',
      category: 'Repertoire',
      completed: true,
      completedDate: 'Apr 28, 2025',
      targetMetric: 'Full memorization',
      progress: 100
    }
  ]);

  const [mediaItems] = useState([
    {
      id: 1,
      title: 'Pentatonic lick in Em',
      description: 'Example of blues-rock style pentatonic phrasing with string bending',
      type: 'Video',
      dateAdded: 'May 4, 2025',
      thumbnail: '/images/video-thumbnail.jpg'
    },
    {
      id: 2,
      title: 'Lesson Feedback Notes',
      description: 'Notes from my instructor on areas to improve',
      type: 'Note',
      dateAdded: 'Apr 2, 2025',
      content: 'Focus on improving articulation in Bach\'s Prelude. Work on maintaining consistent tempo through arpeggiated sections. Try practicing in smaller chunks at slower tempo before increasing speed.'
    }
  ]);

  // Handle actions
  const handleEditSession = (id) => console.log('Edit session', id);
  const handleDeleteSession = (id) => console.log('Delete session', id);
  
  const handleToggleGoal = (id) => console.log('Toggle goal completion', id);
  const handleEditGoal = (id) => console.log('Edit goal', id);
  const handleDeleteGoal = (id) => console.log('Delete goal', id);
  
  const handleViewMedia = (id) => console.log('View media', id);
  const handleEditMedia = (id) => console.log('Edit media', id);
  const handleDeleteMedia = (id) => console.log('Delete media', id);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      {activeTab === 'sessions' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-blue-600">Practice Sessions</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search sessions..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Categories</option>
                <option>Technique</option>
                <option>Theory</option>
                <option>Repertoire</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Last 7 days</option>
                <option>This month</option>
                <option>All time</option>
              </select>
            </div>
          </div>
          
          {/* Session Cards */}
          <div className="grid gap-6">
            {sessions.map(session => (
              <SessionCard 
                key={session.id}
                session={session}
                onEdit={handleEditSession}
                onDelete={handleDeleteSession}
              />
            ))}
          </div>
          
          {/* Add Button */}
          <div className="flex justify-center mt-8">
            <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors">
              +
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'goals' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-blue-600">Practice Goals</h1>
          
          {/* Filter Controls */}
          <div className="flex gap-4 mb-6">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-sm">Active</button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg shadow-sm">Completed</button>
            <select className="ml-auto px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>All Categories</option>
              <option>Technique</option>
              <option>Theory</option>
              <option>Repertoire</option>
            </select>
          </div>
          
          {/* Goal Cards */}
          <div className="grid gap-6">
            {goals.map(goal => (
              <GoalCard 
                key={goal.id}
                goal={goal}
                onToggleComplete={handleToggleGoal}
                onEdit={handleEditGoal}
                onDelete={handleDeleteGoal}
              />
            ))}
          </div>
          
          {/* Add Button */}
          <div className="flex justify-center mt-8">
            <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors">
              +
            </button>
          </div>
        </div>
      )}
      
      {activeTab === 'media' && (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold text-blue-600">Media Library</h1>
          
          {/* Search and Filter Controls */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-grow">
              <input
                type="text"
                placeholder="Search media..."
                className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>All Types</option>
                <option>Video</option>
                <option>Audio</option>
                <option>Note</option>
                <option>Photo</option>
              </select>
              <select className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>Recent</option>
                <option>This month</option>
                <option>All time</option>
              </select>
            </div>
          </div>
          
          {/* Media Cards */}
          <div className="grid sm:grid-cols-2 gap-6">
            {mediaItems.map(media => (
              <MediaCard 
                key={media.id}
                media={media}
                onView={handleViewMedia}
                onEdit={handleEditMedia}
                onDelete={handleDeleteMedia}
              />
            ))}
          </div>
          
          {/* Add Button */}
          <div className="flex justify-center mt-8">
            <button className="w-12 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center text-2xl shadow-lg transition-colors">
              +
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabContainer; 