import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateHelpers';
import { loadEventsFromStorage, saveEventsToStorage } from '../../utils/seedData';

const EventsList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [cancelModalEvent, setCancelModalEvent] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelError, setCancelError] = useState('');

  // Load events on mount
  useEffect(() => {
    if (!user) {
      setEvents([]);
      return;
    }

    const allEvents = loadEventsFromStorage();
    setEvents(allEvents);
  }, [user]);

  // Calculate stats
  const totalBudget = events
    .filter(e => e.status !== 'Cancelled')
    .reduce((sum, e) => sum + parseInt(e.budget || e.setBudget || e.budgetTotal || 0), 0);

  const totalSpent = events
    .filter(e => e.status === 'Completed')
    .reduce((sum, e) => sum + parseInt(e.budget || e.setBudget || e.budgetTotal || 0), 0);

  // Get upcoming events for this week and next week
  const today = new Date();
  const nextWeek = new Date(today);
  nextWeek.setDate(today.getDate() + 7);
  const twoWeeksOut = new Date(today);
  twoWeeksOut.setDate(today.getDate() + 14);

  const thisWeekEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate >= today && eventDate <= nextWeek && 
           e.status !== 'Completed' && e.status !== 'Cancelled';
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  const nextWeekEvents = events.filter(e => {
    const eventDate = new Date(e.date);
    return eventDate > nextWeek && eventDate <= twoWeeksOut && 
           e.status !== 'Completed' && e.status !== 'Cancelled';
  }).sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filter events by status
  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  // Count events by status
  const statusCounts = {
    all: events.length,
    'In Review': events.filter(e => e.status === 'In Review').length,
    'In Progress': events.filter(e => e.status === 'In Progress').length,
    'Completed': events.filter(e => e.status === 'Completed').length,
    'Cancelled': events.filter(e => e.status === 'Cancelled').length
  };

  const getEventIcon = (type) => {
    const icons = {
      'Wedding': '💒',
      'Birthday': '🎂',
      'Corporate': '💼',
      'Conference': '🎤',
      'Party': '🎊',
      'Other': '🎉',
      'Gala': '✨',
      'Anniversary': '💐',
      'Corporate Retreat': '🏢',
      'Celebration': '🎊'
    };
    return icons[type] || '🎉';
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

  const handleCancelRequest = () => {
    if (!cancelReason.trim()) {
      setCancelError('Please provide a reason for cancellation');
      return;
    }

    const allEvents = loadEventsFromStorage();
    
    const updated = allEvents.map(e => 
      e.id === cancelModalEvent.id 
        ? { 
            ...e, 
            cancellationRequest: true, 
            cancellationReason: cancelReason,
            cancellationRequestDate: new Date().toISOString(),
            userId: user.id
          }
        : e
    );
    
    setEvents(updated);
    saveEventsToStorage(updated);
    
    setCancelModalEvent(null);
    setCancelReason('');
    setCancelError('');
  };

  const renderEventCard = (event, isUpcoming = false) => {
    const isReadOnly = event.status === 'Completed' || event.status === 'Cancelled';
    
    return (
      <div
        key={event.id}
        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full flex flex-col ${
          isUpcoming ? 'border-2 border-purple-300' : ''
        }`}
        data-cy="event-card"
      >
        <div className="p-6 flex flex-col flex-1">
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
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{getLocationIcon(event.locationType)}</span>
              <span className="truncate">{event.locationType}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>💰</span>
              <span>${parseInt(event.budget || event.setBudget || event.budgetTotal || 0).toLocaleString()}</span>
            </div>
          </div>

          {event.description && (
            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{event.description}</p>
          )}
          
          <div className="flex-grow"></div>

          {event.cancellationRequest && (
            <div className="bg-orange-50 border border-orange-200 rounded p-2 mb-4">
              <p className="text-xs text-orange-800 font-semibold">
                ⏳ Cancellation request pending review
              </p>
            </div>
          )}

          {isReadOnly ? (
            <button
              onClick={() => navigate(`/events/${event.id}`)}
              className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition text-sm"
              data-cy="view-event-btn"
            >
              👁️ View Details
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/events/${event.id}/edit`)}
                className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition text-sm"
                data-cy="edit-event-btn"
              >
                Edit
              </button>
              <button
                onClick={() => {
                  setCancelModalEvent(event);
                  setCancelReason('');
                  setCancelError('');
                }}
                className="px-4 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                data-cy="cancel-request-btn"
                disabled={event.cancellationRequest}
              >
                {event.cancellationRequest ? '⏳' : '🚫'}
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8">
      <div className="max-w-full px-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
            <p className="text-gray-600">Manage and track all your events</p>
          </div>
          <button
            onClick={() => navigate('/events/new')}
            className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg"
            data-cy="create-event-btn"
          >
            + Create Event
          </button>
        </div>

        {/* Budget Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Budget</div>
            <div className="text-3xl font-bold text-blue-600" data-cy="stat-total-budget">
              ${totalBudget.toLocaleString()}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="text-gray-500 text-sm mb-1">Total Spent</div>
            <div className="text-3xl font-bold text-orange-600" data-cy="stat-total-spent">
              ${totalSpent.toLocaleString()}
            </div>
          </div>
        </div>

        {/* Upcoming Events - This Week */}
        {thisWeekEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span>🔥</span> This Week
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thisWeekEvents.map(event => renderEventCard(event, true))}
            </div>
          </div>
        )}

        {/* Upcoming Events - Next Week */}
        {nextWeekEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {nextWeekEvents.map(event => renderEventCard(event, true))}
            </div>
          </div>
        )}

        {/* Filter Buttons with Counts */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">All Events</h2>
          <div className="flex gap-2 flex-wrap">
            {['all', 'In Review', 'In Progress', 'Completed', 'Cancelled'].map(status => (
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
                {status === 'all' ? 'All' : status} ({statusCounts[status]})
              </button>
            ))}
          </div>
        </div>

        {/* All Events - Compact Row Style */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center" data-cy="no-events">
            <div className="text-6xl mb-4">🎉</div>
            <h3 className="text-xl font-semibold mb-2">No events yet</h3>
            <p className="text-gray-600 mb-4">Create your first event to get started!</p>
            <button
              onClick={() => navigate('/events/new')}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition"
            >
              Create Event
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredEvents.map(event => {
              const isReadOnly = event.status === 'Completed' || event.status === 'Cancelled';
              
              return (
                <div
                  key={event.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 flex items-center justify-between gap-4"
                  data-cy="event-card"
                >
                  {/* Left: Event Info */}
                  <div className="flex items-center gap-4 flex-1 min-w-0">
                    <span className="text-3xl flex-shrink-0">{getEventIcon(event.type)}</span>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-lg truncate" data-cy="event-name">
                          {event.name}
                        </h3>
                        <span className={`px-2 py-1 rounded text-xs flex-shrink-0 ${getStatusColor(event.status)}`}>
                          {event.status}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-1">
                          <span>📅</span>
                          <span>{formatDate(event.date)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>{getLocationIcon(event.locationType)}</span>
                          <span>{event.locationType}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span>💰</span>
                          <span>${parseInt(event.budget || event.setBudget || event.budgetTotal || 0).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Cancellation Request Badge */}
                      {event.cancellationRequest && (
                        <div className="mt-2">
                          <span className="inline-block bg-orange-50 border border-orange-200 rounded px-2 py-1 text-xs text-orange-800 font-semibold">
                            ⏳ Cancellation pending
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right: Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    {isReadOnly ? (
                      <button
                        onClick={() => navigate(`/events/${event.id}`)}
                        className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition text-sm whitespace-nowrap"
                        data-cy="view-event-btn"
                      >
                        👁️ View
                      </button>
                    ) : (
                      <>
                        <button
                          onClick={() => navigate(`/events/${event.id}/edit`)}
                          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition text-sm"
                          data-cy="edit-event-btn"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setCancelModalEvent(event);
                            setCancelReason('');
                            setCancelError('');
                          }}
                          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 transition text-sm disabled:bg-gray-300 disabled:cursor-not-allowed"
                          data-cy="cancel-request-btn"
                          disabled={event.cancellationRequest}
                        >
                          {event.cancellationRequest ? '⏳' : '🚫'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Cancel Request Modal */}
      {cancelModalEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Request Cancellation</h3>
            <p className="text-gray-600 mb-4">
              Event: <strong>{cancelModalEvent.name}</strong>
            </p>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Reason for Cancellation *
              </label>
              <textarea
                value={cancelReason}
                onChange={(e) => {
                  setCancelReason(e.target.value);
                  if (cancelError) setCancelError('');
                }}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-orange-500 ${
                  cancelError ? 'border-red-500' : ''
                }`}
                rows="4"
                placeholder="Please explain why you need to cancel this event..."
                data-cy="cancel-reason-input"
              />
              {cancelError && (
                <p className="text-red-500 text-sm mt-1" data-cy="cancel-reason-error">{cancelError}</p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCancelRequest}
                className="flex-1 bg-orange-500 text-white py-2 rounded hover:bg-orange-600 transition"
                data-cy="confirm-cancel-request"
              >
                Submit Request
              </button>
              <button
                onClick={() => {
                  setCancelModalEvent(null);
                  setCancelReason('');
                  setCancelError('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                data-cy="cancel-modal-close"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;