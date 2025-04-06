import React from 'react';

const MediaCard = ({ media, onView, onEdit, onDelete }) => {
  // Determine styles based on media type
  const getMediaTypeStyles = (type) => {
    switch(type.toLowerCase()) {
      case 'video': 
        return { 
          bg: 'bg-purple-50', 
          text: 'text-purple-600', 
          gradient: 'from-purple-500 to-purple-600',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#4154b3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"></polygon>
            </svg>
          )
        };
      case 'audio': 
        return { 
          bg: 'bg-green-50', 
          text: 'text-green-600', 
          gradient: 'from-green-500 to-green-600',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#38b77c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18V5l12-2v13"></path>
              <circle cx="6" cy="18" r="3"></circle>
              <circle cx="18" cy="16" r="3"></circle>
            </svg>
          )
        };
      case 'note': 
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-600', 
          gradient: 'from-blue-500 to-blue-600',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#3b7ff5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
              <polyline points="10 9 9 9 8 9"></polyline>
            </svg>
          )
        };
      case 'photo': 
        return { 
          bg: 'bg-amber-50', 
          text: 'text-amber-600', 
          gradient: 'from-amber-500 to-amber-600',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
              <circle cx="8.5" cy="8.5" r="1.5"></circle>
              <polyline points="21 15 16 10 5 21"></polyline>
            </svg>
          )
        };
      default: 
        return { 
          bg: 'bg-gray-50', 
          text: 'text-gray-600', 
          gradient: 'from-gray-500 to-gray-600',
          icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M13 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"></path>
              <polyline points="13 2 13 9 20 9"></polyline>
            </svg>
          )
        };
    }
  };

  const { bg, text, gradient, icon } = getMediaTypeStyles(media.type);
  
  // For video and photo media types, show a preview area
  const showPreview = ['video', 'photo'].includes(media.type.toLowerCase());
  
  return (
    <div className="card media-card bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {showPreview ? (
        // Media Preview for video/photo
        <div className="relative bg-gray-100 aspect-video">
          {/* Media thumbnail or image preview */}
          {media.thumbnail && (
            <img 
              src={media.thumbnail} 
              alt={media.title} 
              className="absolute inset-0 w-full h-full object-cover"
            />
          )}
          
          {/* Video/Image Placeholder/Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            {icon}
          </div>
          
          {/* Type Badge */}
          <div className={`absolute top-3 left-3 px-2 py-1 ${text} ${bg} text-xs rounded font-medium`}>
            {media.type}
          </div>
          
          {/* Media Title Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
            <h3 className="text-white font-bold text-lg">{media.title}</h3>
          </div>
        </div>
      ) : (
        // For notes and other non-visual media types
        <>
          {/* Accent Bar at top - color based on type */}
          <div className={`h-2 bg-gradient-to-r ${gradient} w-full`}></div>
          
          <div className="px-6 pt-5">
            {/* Header - with media type indicator */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-800">{media.title}</h3>
              <span className={`px-3 py-1 ${bg} ${text} rounded-full text-sm font-medium`}>
                {media.type}
              </span>
            </div>
          </div>
        </>
      )}
      
      <div className="px-6 py-4">
        {/* Media Description */}
        {media.description && (
          <p className="text-gray-600 mb-4">
            {media.description}
          </p>
        )}
        
        {/* Note Content - only for type "note" */}
        {media.type.toLowerCase() === 'note' && media.content && (
          <div className={`${bg} p-4 rounded-md border-l-4 border-blue-300 text-gray-700 mb-4 italic`}>
            {media.content}
          </div>
        )}
        
        {/* Bottom Info */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <span className="text-gray-500 text-sm">Added {media.dateAdded}</span>
          
          <div className="flex gap-2">
            <button 
              onClick={() => onView(media.id)} 
              className={`p-2 text-gray-500 hover:${text} hover:${bg} rounded-full transition-colors`} 
              title="View Media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
            </button>
            <button 
              onClick={() => onEdit(media.id)} 
              className={`p-2 text-gray-500 hover:${text} hover:${bg} rounded-full transition-colors`} 
              title="Edit Media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
            </button>
            <button 
              onClick={() => onDelete(media.id)} 
              className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" 
              title="Delete Media"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaCard; 