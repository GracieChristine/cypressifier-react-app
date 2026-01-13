import React, { useState, useEffect } from 'react';

const AdminDashboard = ({ setCurrentView, setSelectedEvent }) => {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    const loadEvents = () => {
      // Load all events
      const saved = localStorage.getItem('events');
      const allEvents = saved ? JSON.parse(saved) : [];
      
      // Auto-cancel past events that aren't completed
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const updated = allEvents.map(event => {
        const eventDate = new Date(event.date);
        eventDate.setHours(0, 0, 0, 0);
        
        if (eventDate < today && event.status !== 'Completed' && event.status !== 'Cancelled') {
          return { ...event, status: 'Cancelled', autoCancelled: true };
        }
        return event;
      });
      
      localStorage.setItem('events', JSON.stringify(updated));
      setEvents(updated);
      console.log('Admin Dashboard - Events loaded:', updated.length);
    };

    // Load immediately
    loadEvents();
    
    // Also load when window gets focus (handles navigation back)
    window.addEventListener('focus', loadEvents);
    
    return () => {
      window.removeEventListener('focus', loadEvents);
    };
  }, []);

  const statusCounts = {
    total: events.length,
    submitted: events.filter(e => e.status === 'Submitted').length,
    planning: events.filter(e => e.status === 'Planning').length,
    confirmed: events.filter(e => e.status === 'Confirmed').length,
    inProgress: events.filter(e => e.status === 'In Progress').length,
    completed: events.filter(e => e.status === 'Completed').length,
    cancelled: events.filter(e => e.status === 'Cancelled').length,
    cancellationRequests: events.filter(e => e.cancellationRequest).length
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-700',
      'Planning': 'bg-yellow-100 text-yellow-700',
      'Confirmed': 'bg-green-100 text-green-700',
      'In Progress': 'bg-purple-100 text-purple-700',
      'Completed': 'bg-gray-100 text-gray-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getLocationIcon = (locationType) => {
    const icons = {
      'Castle': '🏰',
      'Chateau': '🏛️',
      'Palace': '👑',
      'Manor House': '🏡',
      'Garden Estate': '🌿',
      'Villa': '🏘️',
      'Historic Abbey': '⛪'
    };
    return icons[locationType] || '🏰';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8">
      <div className="max-w-full px-4">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">👑</span>
            <h1 className="text-4xl font-display text-royal-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 font-serif">Manage all events and requests</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Events</div>
            <div className="text-2xl font-bold text-royal-700">{statusCounts.total}</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg shadow-md border border-blue-200">
            <div className="text-blue-700 text-sm mb-1 font-semibold">Submitted</div>
            <div className="text-2xl font-bold text-blue-700">{statusCounts.submitted}</div>
          </div>
          <div className="bg-yellow-50 p-4 rounded-lg shadow-md border border-yellow-200">
            <div className="text-yellow-700 text-sm mb-1 font-semibold">Planning</div>
            <div className="text-2xl font-bold text-yellow-700">{statusCounts.planning}</div>
          </div>
          <div className="bg-green-50 p-4 rounded-lg shadow-md border border-green-200">
            <div className="text-green-700 text-sm mb-1 font-semibold">Confirmed</div>
            <div className="text-2xl font-bold text-green-700">{statusCounts.confirmed}</div>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg shadow-md border border-purple-200">
            <div className="text-purple-700 text-sm mb-1 font-semibold">In Progress</div>
            <div className="text-2xl font-bold text-purple-700">{statusCounts.inProgress}</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg shadow-md border border-gray-200">
            <div className="text-gray-700 text-sm mb-1 font-semibold">Completed</div>
            <div className="text-2xl font-bold text-gray-700">{statusCounts.completed}</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg shadow-md border border-red-200">
            <div className="text-red-700 text-sm mb-1 font-semibold">Cancelled</div>
            <div className="text-2xl font-bold text-red-700">{statusCounts.cancelled}</div>
          </div>
        </div>

        {/* Cancellation Requests Alert */}
        {statusCounts.cancellationRequests > 0 && (
          <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded">
            <div className="flex items-center">
              <span className="text-2xl mr-3">⚠️</span>
              <div>
                <p className="font-semibold text-orange-800">
                  {statusCounts.cancellationRequests} Cancellation Request{statusCounts.cancellationRequests > 1 ? 's' : ''} Pending
                </p>
                <p className="text-sm text-orange-700">Review and approve/deny cancellation requests</p>
              </div>
            </div>
          </div>
        )}

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-royal-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-sans text-sm">Event</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Client</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Date</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Venue Type</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Budget</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Status</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-serif">
                      No events yet
                    </td>
                  </tr>
                ) : (
                  events.map(event => (
                    <tr key={event.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{event.name}</div>
                        <div className="text-sm text-gray-500">{event.type}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">User #{event.id.toString().slice(-4)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {new Date(event.date).toLocaleDateString('en-US', { 
                            month: 'short', 
                            day: 'numeric', 
                            year: 'numeric' 
                          })}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">{getLocationIcon(event.locationType)}</span>
                          <span className="text-sm text-gray-700">{event.locationType}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700 font-semibold">
                          ${event.setBudget?.toLocaleString() || event.budgetTotal?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <span className={`px-3 py-1 rounded text-xs font-semibold inline-block ${getStatusColor(event.status)}`}>
                            {event.status}
                          </span>
                          {event.cancellationRequest && (
                            <span className="px-3 py-1 rounded text-xs font-semibold bg-orange-100 text-orange-700 inline-block">
                              🚨 Cancel Request
                            </span>
                          )}
                          {event.autoCancelled && (
                            <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600 inline-block">
                              Auto-cancelled
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setCurrentView('admin-event-detail');
                            }}
                            className="px-3 py-1 bg-royal-600 text-white rounded text-sm hover:bg-royal-700 transition"
                            data-cy="admin-view-btn"
                          >
                            View
                          </button>
                          <button
                            onClick={() => {
                              setSelectedEvent(event);
                              setCurrentView('admin-event-edit');
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition"
                            data-cy="admin-edit-btn"
                          >
                            Edit
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;