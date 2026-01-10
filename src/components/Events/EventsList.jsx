import React, { useState } from 'react';

const EventsList = ({ setCurrentView, setSelectedEvent }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });
  const [filter, setFilter] = useState('all');

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

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

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      const updated = events.filter(e => e.id !== id);
      setEvents(updated);
      localStorage.setItem('events', JSON.stringify(updated));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8">
      <div className="max-w-full">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
            <p className="text-gray-600">Manage all your events</p>
          </div>
          <button
            onClick={() => setCurrentView('event-form')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
            data-cy="create-event-btn"
          >
            + Create Event
          </button>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex gap-2 flex-wrap">
          {['all', 'Planning', 'Confirmed', 'In Progress', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded transition ${
                filter === status 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              data-cy={`filter-${status.toLowerCase().replace(' ', '-')}`}
            >
              {status === 'all' ? 'All Events' : status}
            </button>
          ))}
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center" data-cy="no-events">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started!</p>
            <button
              onClick={() => setCurrentView('event-form')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map(event => (
              <div
                key={event.id}
                className="bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden"
                data-cy="event-card"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-3xl">{getEventIcon(event.type)}</span>
                      <div>
                        <h3 className="font-bold text-lg" data-cy="event-name">{event.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <span>📅</span>
                      <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>📍</span>
                      <span className="truncate">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span>💰</span>
                      <span>${event.budgetSpent?.toLocaleString() || 0} / ${event.budgetTotal?.toLocaleString() || 0}</span>
                    </div>
                  </div>

                  {event.description && (
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setCurrentView('event-detail');
                      }}
                      className="flex-1 bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition text-sm"
                      data-cy="view-event-btn"
                    >
                      View
                    </button>
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setCurrentView('event-form');
                      }}
                      className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-sm"
                      data-cy="edit-event-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="px-4 bg-red-500 text-white py-2 rounded hover:bg-red-600 transition text-sm"
                      data-cy="delete-event-btn"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default EventsList;