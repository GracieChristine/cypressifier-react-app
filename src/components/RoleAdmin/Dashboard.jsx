import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../utils/dateHelpers';
import { loadEventsFromStorage } from '../../utils/seedData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  // const [filter, setFilter] = useState('all');
  const filter = '';

  useEffect(() => {
    const loadEvents = () => {
      // Load from seed storage first
      let allEvents = loadEventsFromStorage();
      
      // Also load from user-specific storage and merge
      const keys = Object.keys(localStorage);
      const seenIds = new Set(allEvents.map(e => e.id)); // Track IDs from seed data
      
      keys.forEach(key => {
        if (key.startsWith('events_')) {
          try {
            const userEvents = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(userEvents)) {
              userEvents.forEach(event => {
                // Only add if we haven't seen this ID before
                if (!seenIds.has(event.id)) {
                  seenIds.add(event.id);
                  allEvents.push(event);
                }
              });
            }
          } catch (e) {
            console.error('Error parsing events:', e);
          }
        }
      });
      
      console.log('Admin Dashboard - Loading all events:', allEvents.length);
      
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
      
      setEvents(updated);
      console.log('Admin Dashboard - Events loaded:', updated.length);
    };

    loadEvents();
    
    window.addEventListener('focus', loadEvents);
    
    return () => {
      window.removeEventListener('focus', loadEvents);
    };
  }, []);

  // const filteredEvents = events.filter(event => {
  //   if (filter === 'all') return true;
  //   return event.status === filter;
  // });
  
  const statusCounts = {
    total: events.length,
    inReview: events.filter(e => e.status === 'In Review' || e.cancellationRequest).length,
    inProgress: events.filter(e => e.status === 'In Progress').length,
    completed: events.filter(e => e.status === 'Completed').length,
    cancelled: events.filter(e => e.status === 'Cancelled').length,
    cancellationRequests: events.filter(e => e.cancellationRequest && e.status !== 'Cancelled').length
  };

  const getStatusColor = (status) => {
    const colors = {
      'In Review': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
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
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8" data-cy="dashboard">
      <div className="max-w-full px-4">
        <div className="mb-8" data-cy="dashboard-header">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display text-royal-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 font-serif">Manage all events and requests</p>
        </div>

        {/* Stats Grid */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6" data-cy="dashboard-stat">
          <div className="flex gap-2 flex-wrap">
            <div className="px-4 py-2 rounded bg-gray-100 text-gray-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-stat-box">
              All ({statusCounts.total})
            </div>
            <div className="px-4 py-2 rounded bg-blue-100 text-blue-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-stat-box">
              In Review ({statusCounts.inReview})
            </div>
            <div className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-stat-box">
              In Progress ({statusCounts.inProgress})
            </div>
            <div className="px-4 py-2 rounded bg-green-100 text-green-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-stat-box">
              Completed ({statusCounts.completed})
            </div>
            <div className="px-4 py-2 rounded bg-red-100 text-red-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-stat-box">
              Cancelled ({statusCounts.cancelled})
            </div>
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
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-cy="dashboard-event-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-royal-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-sans text-sm">Event</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Client</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Due Date</th>
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
                        <div className="text-sm text-gray-700">
                          {event.userId ? `User #${event.userId.toString().slice(-4)}` : 'Unknown'}
                        </div>
                        <div className="text-xs text-gray-500">{event.userEmail || 'No email'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-700">
                          {formatDate(event.date)}
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
                          {/* Show View/Edit based on status and cancellation */}
                          <button
                            onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                            className={`px-3 py-1 text-white rounded text-sm transition ${
                              event.status === 'In Progress' && !event.cancellationRequest
                                ? 'bg-blue-500 hover:bg-blue-600'
                                : 'bg-royal-600 hover:bg-royal-700'
                            }`}
                            data-cy="admin-action-btn"
                          >
                            {event.status === 'In Progress' && !event.cancellationRequest ? 'Edit' : 'View'}
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