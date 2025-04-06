import React from 'react';

const SessionCard = ({ session, onEdit, onDelete }) => {
  // Determine color based on category
  const getCategoryColor = (category) => {
    switch(category.toLowerCase()) {
      case 'technique': return { bg: 'bg-blue-50', text: 'text-blue-600', gradient: 'from-blue-500 to-blue-600' };
      case 'theory': return { bg: 'bg-orange-50', text: 'text-orange-600', gradient: 'from-orange-400 to-orange-500' };
      case 'repertoire': return { bg: 'bg-teal-50', text: 'text-teal-600', gradient: 'from-teal-400 to-teal-500' };
      case 'reading': return { bg: 'bg-purple-50', text: 'text-purple-600', gradient: 'from-purple-400 to-purple-500' };
      default: return { bg: 'bg-gray-50', text: 'text-gray-600', gradient: 'from-gray-400 to-gray-500' };
    }
  };
  
  const { bg, text, gradient } = getCategoryColor(session.category);
  
  return (
    <div className="card session-card bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Accent Bar at top */}
      <div className={`h-2 bg-gradient-to-r ${gradient} w-full`}></div>
      
      <div className="px-6 py-5">
        {/* Header - Category & Duration */}
        <div className="flex justify-between items-center mb-4">
          <span className={`px-3 py-1 ${bg} ${text} rounded-full text-sm font-medium`}>
            {session.category}
          </span>
          <span className="text-blue-500 font-semibold">{session.duration}</span>
        </div>
        
        {/* Session Title */}
        <h3 className="text-lg font-bold text-gray-800 mb-3">{session.title}</h3>
        
        {/* Session Notes */}
        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-300 text-gray-600 mb-4">
          {session.notes}
        </div>
        
        {/* Bottom Actions Bar */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-gray-500 text-sm">{session.date}</span>
          <div className="flex gap-2">
            <button 
              onClick={() => onEdit(session.id)} 
              className="p-2 text-gray-500 hover:text-blue-500 hover:bg-blue-50 rounded-full transition-colors" 
              title="Edit Session"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </button>
            <button 
              onClick={() => onDelete(session.id)} 
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" 
              title="Delete Session"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionCard; 