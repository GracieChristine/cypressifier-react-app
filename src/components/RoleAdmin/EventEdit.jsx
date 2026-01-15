import React, { useState } from 'react';

const AdminEventEdit = ({ setCurrentView, selectedEvent, setSelectedEvent }) => {
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');

  if (!selectedEvent) {
    setCurrentView('admin-dashboard');
    return null;
  }

  const handleSave = () => {
    const userEvents = JSON.parse(localStorage.getItem(`events_${selectedEvent.userId}`) || '[]');
    
    const updated = userEvents.map(e => 
      e.id === selectedEvent.id 
        ? { 
            ...e, 
            status: markAsCompleted ? 'Completed' : 'In Progress',
            completionNotes: markAsCompleted ? completionNotes : undefined,
            completedBy: markAsCompleted ? 'Admin' : undefined,
            completedAt: markAsCompleted ? new Date().toISOString() : undefined
          }
        : e
    );
    
    localStorage.setItem(`events_${selectedEvent.userId}`, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    
    alert(markAsCompleted ? 'Event marked as Completed!' : 'Event updated!');
    setSelectedEvent(null);
    setCurrentView('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => {
            setSelectedEvent(null);
            setCurrentView('admin-dashboard');
          }}
          className="mb-4 text-royal-700 hover:text-royal-900 font-semibold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-display mb-2">{selectedEvent.name}</h2>
          <p className="text-gray-600 mb-6 font-serif">
            Admin Event Management - {selectedEvent.status}
          </p>

          <div className="space-y-6">
            {/* Event Summary - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Client:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.date}</span>
                </div>
                <div>
                  <span className="text-gray-600">Venue Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.locationType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-semibold">${selectedEvent.setBudget?.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Guests:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.guestCount || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.type}</span>
                </div>
              </div>
              {selectedEvent.description && (
                <div className="mt-4">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-800">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            {/* Future: To-Do List, Vendor Management, etc. would go here */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
              <div className="text-4xl mb-3 text-center">📋</div>
              <h3 className="text-lg font-semibold mb-2 text-center">Planning Features</h3>
              <p className="text-gray-600 text-center text-sm">
                To-do lists, vendor management, and detailed planning tools will be added here.
              </p>
            </div>

            {/* Mark as Completed Checkbox */}
            <div className="border-t pt-6">
              <div className="flex items-start gap-3 mb-4">
                <input
                  type="checkbox"
                  id="mark-completed"
                  checked={markAsCompleted}
                  onChange={(e) => setMarkAsCompleted(e.target.checked)}
                  className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                  data-cy="mark-completed-checkbox"
                />
                <label htmlFor="mark-completed" className="cursor-pointer">
                  <div className="font-semibold text-gray-800">Mark this event as Completed</div>
                  <div className="text-sm text-gray-600">
                    Check this box when the event has been successfully completed
                  </div>
                </label>
              </div>

              {markAsCompleted && (
                <div className="ml-8 mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Completion Notes (Optional)
                  </label>
                  <textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="3"
                    placeholder="Add any final notes about how the event went..."
                    data-cy="completion-notes"
                  />
                </div>
              )}
            </div>

            {/* Save Button */}
            <div className="flex gap-3">
              <button
                onClick={handleSave}
                className={`flex-1 text-white py-3 rounded-lg transition font-semibold ${
                  markAsCompleted 
                    ? 'bg-green-600 hover:bg-green-700' 
                    : 'bg-royal-600 hover:bg-royal-700'
                }`}
                data-cy="admin-save-btn"
              >
                {markAsCompleted ? '✅ Save & Mark Completed' : '💾 Save Changes'}
              </button>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setCurrentView('admin-dashboard');
                }}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
                data-cy="admin-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventEdit;