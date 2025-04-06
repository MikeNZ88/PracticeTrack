import React, { useState } from 'react';

const GoalCard = ({ goal, onToggleComplete, onEdit, onDelete }) => {
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
  
  const { bg, text, gradient } = getCategoryColor(goal.category);
  
  return (
    <div className="card goal-card bg-white border border-gray-200 rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      {/* Accent Bar at top - color based on category */}
      <div className={`h-2 bg-gradient-to-r ${gradient} w-full`}></div>
      
      <div className="px-6 py-5">
        {/* Header - Title & Checkbox */}
        <div className="flex items-start gap-3 mb-3">
          <button 
            onClick={() => onToggleComplete(goal.id)}
            className={`flex-shrink-0 w-6 h-6 mt-1 rounded-full border ${goal.completed ? 'bg-green-500 border-green-500' : 'border-gray-300'} flex items-center justify-center transition-colors`}
          >
            {goal.completed && (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
            )}
          </button>
          
          <h3 className={`text-lg font-bold ${goal.completed ? 'text-gray-400 line-through' : 'text-gray-800'}`}>
            {goal.title}
          </h3>
        </div>
        
        {/* Goal Description */}
        <div className={`pl-9 ${goal.completed ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
          {goal.description}
        </div>
        
        {/* Goal Details Area */}
        <div className="bg-gray-50 p-4 rounded-md border-l-4 border-blue-300 text-gray-600 mb-4">
          <div className="flex flex-col gap-2">
            {goal.targetMetric && (
              <div className="flex justify-between">
                <span>Target:</span>
                <span className="font-medium">{goal.targetMetric}</span>
              </div>
            )}
            {goal.progress && (
              <div className="mt-2">
                <div className="flex justify-between mb-1">
                  <span>Progress:</span>
                  <span>{Math.round(goal.progress)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${Math.min(100, Math.max(0, goal.progress))}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="flex flex-wrap justify-between items-center pt-3 border-t border-gray-100">
          <span className={`px-3 py-1 ${bg} ${text} rounded-full text-sm font-medium`}>
            {goal.category}
          </span>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-500 text-sm">
              {goal.completed ? `Completed: ${goal.completedDate}` : `Due: ${goal.dueDate}`}
            </span>
            
            <div className="flex gap-2">
              <button 
                onClick={() => onEdit(goal.id)} 
                className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 rounded-full transition-colors" 
                title="Edit Goal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path></svg>
              </button>
              <button 
                onClick={() => onDelete(goal.id)} 
                className="p-2 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" 
                title="Delete Goal"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalCard; 