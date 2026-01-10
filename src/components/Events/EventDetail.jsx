import React from 'react';

const EventDetail = ({ setCurrentView, selectedEvent, setSelectedEvent }) => {
  if (!selectedEvent) {
    setCurrentView('events');
    return null;
  }

  const getEventIcon = (type) => {
    const icons = {
      'Wedding': '💒',
      'Birthday': '🎂',
      'Corporate': '💼',
      'Conference': '🎤',
      'Party': '🎊',
      'Other': '🎉'
    };
    return icons[type] || '🎉';
  };

  const getStatusColor = (status) => {
    const colors = {
      'Planning': 'bg-blue-100 text-blue-700',
      'Confirmed': 'bg-green-100 text-green-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-gray-100 text-gray-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 p-6">
      <div className="container mx-auto max-w-5xl">
        <button
          onClick={() => {
            setSelectedEvent(null);
            setCurrentView('events');
          }}
          className="mb-4 text-purple-600 hover:text-purple-800 font-semibold flex items-center gap-2"
          data-cy="back-to-events"
        >
          ← Back to Events
        </button>

        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{getEventIcon(selectedEvent.type)}</span>
                <div>
                  <h1 className="text-3xl font-bold mb-2">{selectedEvent.name}</h1>
                  <div className="flex items-center gap-3 text-sm">
                    <span className={`px-3 py-1 rounded ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                    <span>{selectedEvent.type}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setCurrentView('event-form')}
                className="bg-white text-purple-600 px-4 py-2 rounded-lg hover:bg-gray-100 transition"
                data-cy="edit-event-detail-btn"
              >
                Edit Event
              </button>
            </div>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">📅 Date</div>
                <div className="font-semibold">
                  {new Date(selectedEvent.date).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">📍 Location</div>
                <div className="font-semibold">{selectedEvent.location}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">💰 Budget</div>
                <div className="font-semibold">
                  ${selectedEvent.budgetSpent?.toLocaleString() || 0} / ${selectedEvent.budgetTotal?.toLocaleString() || 0}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {selectedEvent.budgetTotal > 0 
                    ? `${Math.round((selectedEvent.budgetSpent / selectedEvent.budgetTotal) * 100)}% spent`
                    : 'No budget set'
                  }
                </div>
              </div>
            </div>

            {selectedEvent.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-gray-600">{selectedEvent.description}</p>
              </div>
            )}

            <div className="bg-purple-50 border-2 border-purple-200 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🚧</div>
              <h3 className="text-lg font-semibold mb-2">More Features Coming Soon!</h3>
              <p className="text-gray-600 mb-4">
                Guests, Vendors, Tasks, and Budget details will be added in the next phases.
              </p>
              <div className="flex gap-2 justify-center text-sm flex-wrap">
                <span className="bg-white px-3 py-1 rounded">📋 Phase 2: Guests</span>
                <span className="bg-white px-3 py-1 rounded">🏪 Phase 3: Vendors</span>
                <span className="bg-white px-3 py-1 rounded">✅ Phase 4: Tasks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;