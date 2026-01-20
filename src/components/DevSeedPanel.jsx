import React, { useState } from 'react';
import { Sprout, Trash2, Loader2, X, Plus } from 'lucide-react';
import { generateSeedEvents, saveEventsToStorage, clearEventsFromStorage } from '../utils/seedData';

const DevSeedPanel = ({ onSeedComplete }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [isMinimized, setIsMinimized] = useState(true); // Changed to true for minimized by default

  const handleSeed = () => {
    setLoading(true);
    setResult(null);
    
    setTimeout(() => {
      try {
        // Generate new seed data
        const { events, count } = generateSeedEvents();
        
        // Save to localStorage (this adds to existing)
        const existing = JSON.parse(localStorage.getItem('cypressifier_events') || '[]');
        const allEvents = [...existing, ...events];
        saveEventsToStorage(allEvents);
        
        setResult({
          type: 'success',
          message: `Added ${events.length} new events (Total: ${allEvents.length})`,
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
        clearEventsFromStorage();
        
        setResult({
          type: 'success',
          message: 'All test events cleared successfully',
          count: null
        });
        
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
           onClick={() => setIsMinimized(false)}>
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-sm">DEV</span>
          <Plus className="w-4 h-4 text-yellow-400" />
        </div>
      </div>
    );
  }

  // Expanded view
  return (
    <div className="fixed bottom-4 right-4 bg-gray-900 text-white p-4 rounded-lg shadow-2xl border-2 border-yellow-500 max-w-sm z-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sprout className="w-5 h-5 text-yellow-400" />
          <span className="font-bold text-sm">🔧 DEV MODE - Frontend Only</span>
        </div>
        <button 
          onClick={() => setIsMinimized(true)}
          className="text-gray-400 hover:text-white transition-colors"
          title="Minimize"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      <div className="space-y-2">
        <button
          onClick={handleSeed}
          disabled={loading}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded flex items-center justify-center gap-2 text-sm transition-colors"
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
        >
          <Trash2 className="w-4 h-4" />
          Clear All Test Data
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
              <p>⚙️ In Progress: {result.count['In Progress']}</p>
              <p>✅ Completed: {result.count['Completed']}</p>
              <p>❌ Cancelled: {result.count['Cancelled']}</p>
              <p className="font-bold mt-1">Total Generated: {result.count.Total}</p>
            </div>
          )}
        </div>
      )}
      
      <p className="text-xs text-gray-400 mt-3">
        💾 Data stored in localStorage
      </p>
      <p className="text-xs text-yellow-400 mt-1">
        ⚠️ Remember to upgrade to PostgreSQL backend later!
      </p>
    </div>
  );
};

export default DevSeedPanel;