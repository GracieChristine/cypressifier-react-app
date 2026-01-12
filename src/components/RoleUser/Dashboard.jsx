import React, { useState } from 'react';

const Dashboard = ({ setCurrentView, setSelectedEvent }) => {
  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('events');
    return saved ? JSON.parse(saved) : [];
  });

  const upcomingEvents = events
    .filter(e => new Date(e.date) >= new Date() && e.status !== 'Completed' && e.status !== 'Cancelled')
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 3);

  const totalEvents = events.length;
  const completedEvents = events.filter(e => e.status === 'Completed').length;
  const totalBudget = events.reduce((sum, e) => sum + (e.budgetTotal || 0), 0);
  const totalSpent = events.reduce((sum, e) => sum + (e.budgetSpent || 0), 0);

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
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8">
      <div className="max-w-full px-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-600">Overview of your events</p>
          </div>
          <button
            onClick={() => setCurrentView('event-form')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
            data-cy="create-event-btn"
          >
            + Create Event
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Events</div>
            <div className="text-3xl font-bold text-purple-600" data-cy="stat-total-events">{totalEvents}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Completed</div>
            <div className="text-3xl font-bold text-green-600" data-cy="stat-completed-events">{completedEvents}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Budget</div>
            <div className="text-3xl font-bold text-blue-600" data-cy="stat-total-budget">${totalBudget.toLocaleString()}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Spent</div>
            <div className="text-3xl font-bold text-orange-600" data-cy="stat-total-spent">${totalSpent.toLocaleString()}</div>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold mb-4">Upcoming Events</h2>
          {upcomingEvents.length === 0 ? (
            <div className="text-center py-12 text-gray-500" data-cy="no-upcoming-events">
              <div className="text-5xl mb-4">📅</div>
              <p className="text-lg mb-2">No upcoming events</p>
              <p className="text-sm">Create your first event to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {upcomingEvents.map(event => (
                <div
                  key={event.id}
                  className="border rounded-lg p-4 hover:shadow-lg transition cursor-pointer"
                  onClick={() => {
                    setSelectedEvent(event);
                    setCurrentView('event-detail');
                  }}
                  data-cy="event-card"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{getEventIcon(event.type)}</span>
                        <h3 className="text-lg font-semibold" data-cy="event-name">{event.name}</h3>
                        <span className={`px-2 py-1 rounded text-xs ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <div>📅 {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</div>
                        <div>📍 {event.location}</div>
                        <div>💰 ${event.budgetSpent?.toLocaleString() || 0} / ${event.budgetTotal?.toLocaleString() || 0}</div>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setCurrentView('event-detail');
                      }}
                      className="text-purple-600 hover:text-purple-800 font-semibold"
                      data-cy="view-details-btn"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          {events.length > 3 && (
            <button
              onClick={() => setCurrentView('events')}
              className="w-full mt-4 text-purple-600 hover:text-purple-800 font-semibold"
            >
              View All Events →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;