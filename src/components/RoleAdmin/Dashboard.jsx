import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDateShort } from '../../utils/dateHelpers';
import { loadEventsFromStorage } from '../../utils/seedData';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const filter = '';

  useEffect(() => {
    const loadEvents = () => {
      let allEvents = loadEventsFromStorage();
      
      const keys = Object.keys(localStorage);
      const seenIds = new Set(allEvents.map(e => e.id));
      
      keys.forEach(key => {
        if (key.startsWith('events_')) {
          try {
            const userEvents = JSON.parse(localStorage.getItem(key));
            if (Array.isArray(userEvents)) {
              userEvents.forEach(event => {
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
  
  const statusCounts = {
    total: events.length,
    submitted: events.filter(e => e.status === 'Submitted').length, // REMOVE: || e.cancellationRequest || e.submissionRequest
    inProgress: events.filter(e => e.status === 'In Progress').length,
    completed: events.filter(e => e.status === 'Completed').length,
    cancelled: events.filter(e => e.status === 'Cancelled').length,
    submissionRequests: events.filter(e => !e.cancellationRequest && e.status === 'Submitted').length,
    cancellationRequests: events.filter(e => e.cancellationRequest && e.status !== 'Cancelled').length
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-700',
      'In Progress': 'bg-yellow-100 text-yellow-700',
      'Completed': 'bg-green-100 text-green-700',
      'Cancelled': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPendingBadgeStyle = () => {
    return 'border border-orange-500 text-orange-600 bg-transparent';
  };

  const getLocationIcon = (locationType) => {
    const icons = {
      'Castle': '🏰',
      'Chateau': '🏛️',
      'Garden Estate': '🌿',
      'Historic Abbey': '⛪',
      'Manor House': '🏡',
      'Villa': '🏘️'
    };
    return icons[locationType] || '🏰';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8" data-cy="dashboard">
      <div className="max-w-full px-4">

        {/* Header */}
        <div className="mb-8" data-cy="dashboard-header">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-4xl font-display text-royal-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600 font-serif">Manage all events and requests</p>
        </div>

         {/* Event Alerts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6" data-cy="dashboard-alerts">

          {/* New Event Submission Requests Alert */}
          {statusCounts.submissionRequests > 0 && (
            <div className={`border-l-4 p-4 mb-6 rounded ${getPendingBadgeStyle()}`} data-cy="dashboard-alert-box">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-semibold text-orange-800">
                     {statusCounts.submissionRequests} New Event{statusCounts.submissionRequests > 1 ? 's' : ''} Require{statusCounts.submissionRequests > 1 ? '' : 's'} Attention
                  </p>
                  <p className="text-sm text-orange-700">Review and accept/decline</p>
                </div>
              </div>
            </div>
          )}

          {/* Cancellation Requests Alert */}
          {statusCounts.cancellationRequests > 0 && (
            <div className={`border-l-4 p-4 mb-6 rounded ${getPendingBadgeStyle()}`} data-cy="dashboard-alert-box">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <p className="font-semibold text-orange-800">
                    {statusCounts.cancellationRequests} Cancel Event{statusCounts.cancellationRequests > 1 ? 's' : ''} Require{statusCounts.cancellationRequests > 1 ? '' : 's'} Attention
                  </p>
                  <p className="text-sm text-orange-700">Review and approve/deny</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Status Grid With Counts */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6" data-cy="dashboard-status">
          <div className="flex gap-2 flex-wrap">
            <div className="px-4 py-2 rounded bg-gray-100 text-gray-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-status-box">
              All ({statusCounts.total})
            </div>
            <div className="px-4 py-2 rounded bg-blue-100 text-blue-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-status-box">
              Submitted ({statusCounts.submitted})
            </div>
            <div className="px-4 py-2 rounded bg-yellow-100 text-yellow-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-status-box">
              In Progress ({statusCounts.inProgress})
            </div>
            <div className="px-4 py-2 rounded bg-green-100 text-green-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-status-box">
              Completed ({statusCounts.completed})
            </div>
            <div className="px-4 py-2 rounded bg-red-100 text-red-700 flex-1 text-center min-w-[120px] whitespace-nowrap" data-cy="dashboard-status-box">
              Cancelled ({statusCounts.cancelled})
            </div>
          </div>
        </div>

        {/* Events Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-cy="dashboard-table">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-royal-700 text-white">
                <tr>
                  <th className="px-6 py-4 text-left font-sans text-sm">Event</th>
                   <th className="px-6 py-4 text-left font-sans text-sm">Date</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Client</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Type</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Budget</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Status</th>
                  <th className="px-6 py-4 text-left font-sans text-sm">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {events.length === 0 ? (
                  <tr data-cy="dashboard-table-no-entry">
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500 font-serif">
                      No events yet
                    </td>
                  </tr>
                ) : (
                  events.map(event => {
                    const isActiveInProgress = event.status === 'In Progress' && 
                                               !event.cancellationRequest && 
                                               !event.completionRequest;
                    
                    return (
                      <tr key={event.id} className="hover:bg-gray-50 transition" data-cy="dashboard-table-entry" data-event-id={event.id}>
                        <td className="px-6 py-4">
                          <div className="font-semibold text-gray-900"> 
                            {event.name}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {formatDateShort(event.date)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {event.userId ? `User #${event.userId.toString().slice(-4)}` : 'Unknown'}
                          </div>
                          <div className="text-xs text-gray-500">{event.userEmail || 'No email'}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            {event.type}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-700">
                            ${parseInt(event.budget || event.setBudget || event.budgetTotal || 0).toLocaleString()}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex flex-col gap-2">
                            <span className={`px-3 py-1 rounded text-xs font-semibold inline-flex 
                                items-center justify-center text-center whitespace-nowrap
                                max-w-[140px] truncate ${getStatusColor(event.status)}`}
                              title={event.status}
                            >
                              {event.status}
                            </span>
                            {event.status === 'Submitted' && (
                              <span className={`px-3 py-1 rounded text-xs font-semibold inline-flex items-center justify-center max-w-[140px] truncate ${getPendingBadgeStyle()}`}>
                                Reviewing Event
                              </span>
                            )}
                            {event.cancellationRequest && (
                              <span className={`px-3 py-1 rounded text-xs font-semibold inline-flex items-center justify-center max-w-[140px] truncate ${getPendingBadgeStyle()}`}>
                                Reviewing Cancellation
                              </span>
                            )}
                            {event.completionRequest && (
                              <span className={`px-3 py-1 rounded text-xs font-semibold inline-flex items-center justify-center max-w-[140px] truncate ${getPendingBadgeStyle()}`}>
                                Pending Completion
                              </span>
                            )}
                            {event.autoCancelled && (
                              <span className="px-2 py-1 rounded text-xs inline-flex items-center justify-center max-w-[140px] truncate bg-gray-100 text-gray-600">
                                Auto-cancelled
                              </span>
                            )}
                          </div>
                        </td>
                        
                        <td className="px-6 py-4">
                          <div className="flex gap-2 justify-end"> {/* ADD justify-end here */}
                            {isActiveInProgress ? (
                              // In Progress with no tags - Show Update and Complete buttons
                              <>
                                <button
                                  onClick={() => navigate(`/admin/events/${event.id}/edit?mode=update`)}
                                  className="min-w-[90px] h-8 py-1.5 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 rounded text-sm font-medium transition whitespace-nowrap flex items-center justify-center"
                                  data-cy="dashboard-table-entry-update-btn"
                                >
                                  Update
                                </button>
                                <button
                                  onClick={() => navigate(`/admin/events/${event.id}/edit?mode=complete`)}
                                  className="min-w-[90px] h-8 py-1.5 bg-lime-100 hover:bg-lime-200 text-lime-700 rounded text-sm font-medium transition whitespace-nowrap flex items-center justify-center"
                                  data-cy="dashboard-table-entry-complete-btn"
                                >
                                  Complete
                                </button>
                              </>
                            ) : (
                              // Everything else - Show View button only
                              <button
                                onClick={() => navigate(`/admin/events/${event.id}/edit`)}
                                className="min-w-[90px] h-8 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded text-sm font-medium transition whitespace-nowrap flex items-center justify-center"
                                data-cy="dashboard-table-entry-view-btn"
                              >
                                View
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
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