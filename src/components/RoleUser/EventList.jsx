import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate, formatDateShort } from '../../utils/dateHelpers';
import { loadEventsFromStorage } from '../../utils/seedData';

const EventList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (!user) {
      setEvents([]);
      return;
    }

    const allEvents = loadEventsFromStorage();
    
    const userEvents = user.isAdmin
      ? allEvents
      : allEvents.filter(e => e.userId === user.id);
    setEvents(userEvents);
  }, [user]);

  const totalBudget = events
    .filter(e => e.status !== 'Cancelled')
    .reduce((sum, e) => sum + parseInt(e.budget || e.setBudget || e.budgetTotal || 0), 0);

  const totalSpent = events
    .filter(e => e.status === 'Completed')
    .reduce((sum, e) => sum + parseInt(e.budget || e.setBudget || e.budgetTotal || 0), 0);

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

  const filteredEvents = events.filter(event => {
    if (filter === 'all') return true;
    return event.status === filter;
  });

  const statusCounts = {
    all: events.length,
    'Submitted': events.filter(e => e.status === 'Submitted').length,
    'In Progress': events.filter(e => e.status === 'In Progress').length,
    'Completed': events.filter(e => e.status === 'Completed').length,
    'Cancelled': events.filter(e => e.status === 'Cancelled').length
  };

  const getEventIcon = (type) => {
    const icons = {
      'Anniversary': '💐',
      'Birthday': '🎂',
      'Celebration': '🎊',
      'Corporate Retreat': '🏢',
      'Gala': '✨',
      'Party': '🎊',
      'Wedding': '💒',
      'Other': '🎉'
    };
    return icons[type] || '🎉';
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
      'Villa': '🏘️',
    };
    return icons[locationType] || '🏰';
  };

  // Card renderer for upcoming events
  const renderEventCard = (event, isUpcoming = false) => {
    const isReadOnly = event.status === 'Completed' || event.status === 'Cancelled';
    const isSubmitted = event.status === 'Submitted';
    const canCancel = event.status === 'In Progress' && !event.cancellationRequest && !event.completionRequest;
    
    return (
      <div
        key={event.id}
        className={`bg-white rounded-lg shadow-md hover:shadow-xl transition overflow-hidden h-full flex flex-col min-w-[280px] ${
          isUpcoming ? 'border-2 border-purple-300' : ''
        }`}
        data-cy={isUpcoming ? "eventlist-upcoming-event-card" : "eventlist-event-list-entry"}
        data-event-id={event.id}
      >
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-lg flex-1 pr-2">{event.name}</h3>
            <div className="flex flex-col gap-1.5 items-end">
              <span
                className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${getStatusColor(event.status)}`}
              >
                {event.status}
              </span>
              {isSubmitted && (
                <span 
                  className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${getPendingBadgeStyle()}`}
                  title="Event submission pending review"
                >
                  Pending Review
                </span>
              )}

              {event.cancellationRequest && (
                <span 
                  className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${getPendingBadgeStyle()}`}
                  title="Cancellation pending"
                >
                  Pending Cancellation
                </span>
              )}

              {event.completionRequest && (
                <span 
                  className={`shrink-0 px-2 py-1 rounded text-xs font-medium ${getPendingBadgeStyle()}`}
                  title="Completion confirmation pending"
                >
                  Reviewing Completion
                </span>
              )}
            </div>
          </div>
          
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600 mb-3">
            <div className="flex items-center gap-2">
              <span>📅</span>
              <span>{formatDate(event.date)}</span>
            </div>

            <div className="flex items-center gap-2">
              <span>👥</span>
              <span>{event.guestCount} guests</span>
            </div>
          </div>
          
          <div className="flex-grow"></div>

          {/* Action buttons */}
          {isReadOnly || isSubmitted || event.cancellationRequest || event.completionRequest ? (
            <button
              onClick={() => navigate(`/user/events/${event.id}`)}
              className="w-full py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded transition text-sm font-medium" 
              data-cy={isUpcoming ? "eventlist-upcoming-event-view-btn" : "eventlist-event-list-entry-view-btn"}
            >
              View
            </button>
          ) : canCancel ? (
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/user/events/${event.id}/edit`)}
                className="flex-1 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm font-medium"
                data-cy={isUpcoming ? "eventlist-upcoming-event-edit-btn" : "eventlist-event-list-entry-edit-btn"}
              >
                Edit
              </button>
              <button
                onClick={() => navigate(`/user/events/${event.id}`)}
                className={`px-3 py-2 rounded text-sm font-medium transition whitespace-nowrap ${getPendingBadgeStyle()} hover:bg-orange-50`}
                data-cy={isUpcoming ? "eventlist-upcoming-event-cancel-btn" : "eventlist-event-list-entry-cancel-btn"}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => navigate(`/user/events/${event.id}/edit`)}
              className="w-full py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded transition text-sm font-medium"
              data-cy={isUpcoming ? "eventlist-upcoming-event-edit-btn" : "eventlist-event-list-entry-edit-btn"}
            >
              Edit
            </button>
          )}
        </div>
      </div>
    );
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-4 sm:px-6 md:px-8" data-cy="eventlist">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6" data-cy="eventlist-header">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">My Events</h1>
            <p className="text-gray-600">Manage and track all your events</p>
          </div>

          <button
            onClick={() => navigate('/user/events/new')}
            className="w-full sm:w-auto bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition shadow-lg whitespace-nowrap" 
            data-cy="eventlist-create-event-btn"
          >
            + Create Event
          </button>
        </div>

        {/* Upcoming Events */}
        {(thisWeekEvents.length > 0 || nextWeekEvents.length > 0) && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6" data-cy="eventlist-upcomings">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              Upcoming Events
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {thisWeekEvents.map(event => renderEventCard(event, true))}
              {nextWeekEvents.map(event => renderEventCard(event, true))}
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-4 mb-6" data-cy="eventlist-filters-and-event-list">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">All Events</h2>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap" data-cy="eventlist-filters">
            {['all', 'Submitted', 'In Progress', 'Completed', 'Cancelled'].map(status => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded transition ${
                  filter === status 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                } flex-1 min-w-[150px]`}
                data-cy={`eventlist-filter-${status.toLowerCase().replace(' ', '-')}`}
              >
                {status === 'all' ? 'All' : status} ({statusCounts[status]})
              </button>
            ))}
          </div>
          <br />

          {/* Event Lists */}
          {filteredEvents.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center" data-cy="eventlist-event-list-no-entry">
              <div className="text-6xl mb-4">🎉</div>
              <h3 className="text-xl font-semibold mb-2">No events yet</h3>
              <p className="text-gray-600 mb-4">Create your first event to get started!</p>
            </div>
          ) : (
            <div data-cy="eventlist-event-list">
              {/* Desktop/Tablet: Table view */}
              <div className="hidden sm:block space-y-3">
                {filteredEvents.map(event => {
                  const isReadOnly = event.status === 'Completed' || event.status === 'Cancelled';
                  const isSubmitted = event.status === 'Submitted';
                  const canCancel = event.status === 'In Progress' && !event.cancellationRequest && !event.completionRequest;
                  
                  return (
                    <div
                      key={event.id}
                      className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition"
                      data-cy="eventlist-event-list-entry"
                      data-event-id={event.id}
                    >
                      <div className="p-4 grid grid-cols-12 gap-3 items-center">
                        <div className="col-span-12 sm:col-span-3 md:col-span-2">
                          <h3 className="font-semibold text-gray-900">
                            {event.name}
                          </h3>
                        </div>
                        
                        <div className="col-span-12 sm:col-span-3 md:col-span-2">
                          <div className="text-sm text-gray-600">
                            {formatDate(event.date)}
                          </div>
                        </div>
                        
                        <div className="hidden md:block md:col-span-2 lg:col-span-1">
                          <div className="text-sm text-gray-600 font-medium">
                            {event.guestCount}
                          </div>
                        </div>

                        <div className="hidden lg:block lg:col-span-2">
                          <div className="text-sm text-gray-600 font-medium">
                            ${parseInt(event.budget || event.setBudget || event.budgetTotal || 0).toLocaleString()}
                          </div>
                        </div>
                        
                        <div className="col-span-12 sm:col-span-3 md:col-span-3 lg:col-span-2 flex flex-wrap gap-2 sm:flex-col sm:gap-1.5">
                          <span 
                            className={`px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-center ${getStatusColor(event.status)}`}
                          >
                            {event.status}
                          </span>

                          {isSubmitted && (
                            <span 
                              className={`min-w-[100px] px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-center ${getPendingBadgeStyle()}`}
                              title="Event submission pending review"
                            >
                              Pending Review
                            </span>
                          )}

                          {event.cancellationRequest && (
                            <span 
                              className={`min-w-[100px] px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-center ${getPendingBadgeStyle()}`}
                              title="Cancellation pending"
                            >
                              Pending Cancellation
                            </span>
                          )}
                          
                          {event.completionRequest && (
                            <span 
                              className={`min-w-[100px] px-3 py-1 rounded text-xs font-medium whitespace-nowrap text-center ${getPendingBadgeStyle()}`}
                              title="Completion confirmation pending"
                            >
                              Reviewing Completion
                            </span>
                          )}
                        </div>

                        <div className="col-span-12 sm:col-span-3 md:col-span-3 lg:col-span-3 flex flex-col sm:flex-row gap-2 sm:justify-end">
                          {isReadOnly || isSubmitted || event.cancellationRequest || event.completionRequest ? (
                            <button
                              onClick={() => navigate(`/user/events/${event.id}`)}
                              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-medium transition whitespace-nowrap"
                              data-cy="eventlist-event-list-entry-view-btn"
                            >
                              View
                            </button>
                          ) : canCancel ? (
                            <>
                              <button
                                onClick={() => navigate(`/user/events/${event.id}/edit`)}
                                className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm font-medium transition whitespace-nowrap"
                                data-cy="eventlist-event-list-entry-edit-btn"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => navigate(`/user/events/${event.id}`)}
                                className={`px-3 py-1.5 rounded text-sm font-medium transition whitespace-nowrap ${getPendingBadgeStyle()} border border-orange-500 hover:border-orange-600 hover:text-orange-700 hover:bg-orange-50`}
                                data-cy="eventlist-event-list-entry-cancel-btn"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <button
                              onClick={() => navigate(`/user/events/${event.id}/edit`)}
                              className="px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded text-sm font-medium transition whitespace-nowrap"
                              data-cy="eventlist-event-list-entry-edit-btn"
                            >
                              Edit
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Mobile: Card view */}
              <div className="sm:hidden space-y-4">
                {filteredEvents.map(event => renderEventCard(event, false))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EventList;