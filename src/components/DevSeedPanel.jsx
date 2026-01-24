import React, { useState } from 'react';
import { Sprout, Trash2, Loader2, X, Plus } from 'lucide-react';
import { generateSeedEvents, saveEventsToStorage, clearEventsFromStorage, loadEventsFromStorage } from '../utils/seedData';
import { useAuth } from '../context/AuthContext';

const DevSeedPanel = ({ onSeedComplete }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true);

  // Only show when user is logged in
  if (!user) {
    return null;
  }
  
  const handleSeed = () => {
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      try {
        // Load existing events
        const existingEvents = loadEventsFromStorage();
        
        // Generate new seed data with current user info
        const { events, count } = generateSeedEvents(user.id, user.email);  // Pass user here
        
        // Combine existing + new events
        const allEvents = [...existingEvents, ...events];
        
        // Save to seed storage
        saveEventsToStorage(allEvents);
        
        setResult({
          type: 'success',
          message: `Added ${events.length} new events as ${user.isAdmin ? 'Admin' : user.email} (Total: ${allEvents.length})`,  // Updated message
          count: count
        });
        
        if (onSeedComplete) {
          onSeedComplete();
        }
      } catch (error) {
        setResult({
          type: 'error',
          message: 'Failed to seed events: ' + error.message
        });
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const handleClear = () => {
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      try {
        // Load all events
        const allEvents = loadEventsFromStorage();
        
        if (user.isAdmin) {
          // Admin can clear ALL mock data
          const userEvents = allEvents.filter(event => !event.isMockData);
          saveEventsToStorage(userEvents);
          
          const removedCount = allEvents.length - userEvents.length;
          
          setResult({
            type: 'success',
            message: `Cleared ${removedCount} mock events (all users). ${userEvents.length} user events kept.`,
            count: null
          });
        } else {
          // Regular user can only clear THEIR mock data
          const userEvents = allEvents.filter(event => 
            !event.isMockData || event.userId !== user.id
          );
          saveEventsToStorage(userEvents);
          
          const removedCount = allEvents.length - userEvents.length;
          
          setResult({
            type: 'success',
            message: `Cleared ${removedCount} of your mock events. ${userEvents.length} events kept.`,
            count: null
          });
        }
        
        if (onSeedComplete) {
          onSeedComplete();
        }
      } catch (error) {
        setResult({
          type: 'error',
          message: 'Failed to clear events: ' + error.message
        });
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  // Minimized view
  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-3 rounded-lg shadow-2xl border-2 border-yellow-500 z-50 cursor-pointer hover:bg-gray-800 transition-colors"
           onClick={() => setIsMinimized(false)} data-cy="dev-panel-window-min">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-sm">DEV</span>
          <Plus className="w-4 h-4 text-yellow-400" data-cy="dev-panel-expand-btn"/>
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-2xl border-2 border-yellow-500 max-w-sm z-50" data-cy="dev-panel-window-max">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-sm">
            DEV MODE {user.isAdmin ? '- Admin' : `- ${user.email.split('@')[0]}`}
          </span>
        </div>
        <button 
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Minimize"
          data-cy="dev-panel-collapse-btn"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 text-sm transition-colors"
          data-cy="dev-panel-add-event-btn"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Seeding...
            </>
          ) : (
            <>
              <Sprout className="w-4 h-4" />
              Add Test Events
            </>
          )}
        </button>
        
        <button
          onClick={handleClear}
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 text-sm transition-colors"
          data-cy="dev-panel-clear-event-btn"
        >
          <Trash2 className="w-4 h-4" />
          {user.isAdmin ? 'Clear All Mock Data' : 'Clear My Mock Data'}
        </button>
      </div>

      {result && (
        <div className={`mt-3 p-3 rounded text-xs ${
          result.type === 'success' 
            ? 'bg-green-900 text-green-100' 
            : 'bg-red-900 text-red-100'
        }`}>
          <p className="font-semibold mb-1">{result.message}</p>
          {result.count && (
            <div className="space-y-1 text-xs opacity-90">
              <p>📋 In Review: {result.count['In Review']}</p>
              <p>⚙️ In Progress: {result.count['In Process']}</p>
              <p>✅ Completed: {result.count['Completed']}</p>
              <p>❌ Cancelled: {result.count['Cancelled']}</p>
              <p className="font-bold mt-1">Total Generated: {result.count.Total}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DevSeedPanel;