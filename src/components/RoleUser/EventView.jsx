import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { formatDate } from '../../utils/dateHelpers';
import { loadEventsFromStorage } from '../../utils/seedData';

const EventDetail = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [event, setEvent] = useState(null);

  useEffect(() => {
    const events = loadEventsFromStorage();
    const foundEvent = events.find(e => e.id === id);
    
    if (foundEvent) {
      setEvent(foundEvent);
    } else {
      // Event not found, redirect to events list
      navigate('/events');
    }
  }, [id, navigate]);

  if (!event) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

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

  const isReadOnly = event.status === 'Completed' || event.status === 'Cancelled';

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8" data-cy="event-view">
      <div className="max-w-4xl mx-auto">

        {/* Return to /user/eventlist */}
        <button
          onClick={() => navigate('/events')}
          className="mb-4 text-gray-700 hover:text-gray-900 font-semibold flex items-center gap-2"
          data-cy="event-view-to-eventlist-btn"
        >
          <span className="text-lg">← ⇦</span>Back to Event Listing
        </button>

        {/* Action Buttons - New review/delete */}
            {/* <div className="flex gap-4 pt-4 border-t">
              <button
                onClick={() => navigate('/events')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold" data-cy="event-view-to-eventlist-btn"
              >
                ← Back to Events
              </button>
              {!isReadOnly && (
                <button
                  onClick={() => navigate(`/events/${event.id}/edit`)}
                  className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                  data-cy="event-view-to-eventform-btn""
                >
                  Edit Event
                </button>
              )}
            </div> */}

        <div className="bg-white rounded-lg shadow-lg overflow-hidden" data-cy="event-view-selected-entry">

          {/* Header */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 p-6 text-white">
            <div className="flex justify-between items-start ">
              <div className="flex items-center gap-3">
                <div>
                  <h1 className="text-3xl font-bold" data-cy="event-view-selected-entry name">{event.name}</h1>
                  <p className="text-xl text-purple-100 mt-4" data-cy="event-view-selected-entry type">{event.type}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div>
                  <span className={`px-4 py-10 rounded-lg text-sm font-semibold ${getStatusColor(event.status)} bg-opacity-90`} data-cy="event-view-selected-entry status">
                    {event.status}
                  </span>
                </div>
              </div>
              
            </div>
          </div>

          {/* Detail */}
          <div className="p-6 space-y-6">

            {/* Cancellation Request Alert */}
            {event.cancellationRequest && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                <div className="flex items-center mb-2">
                  <span className="text-2xl mr-2">⚠️</span>
                  <p className="font-semibold text-orange-800">Cancellation Request Pending</p>
                </div>
                <p className="text-sm text-orange-700 ml-9">
                  Reason: {event.cancellationReason}
                </p>
                <p className="text-xs text-orange-600 ml-9 mt-1">
                  Requested on: {formatDate(event.cancellationRequestDate)}
                </p>
              </div>
            )}

            {/* Event Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-sm font-semibold mb-1">Date</label>
                  <div className="flex items-center gap-2 text-lg" data-cy="event-view-selected-entry date">
                    <span>📅</span>
                    <span className="font-semibold" data-cy="event-detail-date">{formatDate(event.date)}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm font-semibold mb-1">Location Type</label>
                  <div className="flex items-center gap-2 text-lg">
                    <span>{getLocationIcon(event.locationType)}</span>
                    <span className="font-semibold" data-cy="event-view-selected-entry location">{event.locationType}</span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm font-semibold mb-1">Guest Count</label>
                  <div className="flex items-center gap-2 text-lg">
                    <span>👥</span>
                    <span className="font-semibold" data-cy="event-view-selected-entry guest">{event.guestCount} guests</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-500 text-sm font-semibold mb-1">Total Budget</label>
                  <div className="flex items-center gap-2 text-lg">
                    <span>💰</span>
                    <span className="font-semibold text-blue-600" data-cy="event-view-selected-entry budget-total">
                      ${parseInt(event.budget || event.setBudget || event.budgetTotal || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm font-semibold mb-1">Budget Spent</label>
                  <div className="flex items-center gap-2 text-lg">
                    <span>💸</span>
                    <span className="font-semibold text-orange-600" data-cy="event-view-selected-entry budget-spent">
                      ${parseInt(event.budgetSpent || 0).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-500 text-sm font-semibold mb-1">Remaining Budget</label>
                  <div className="flex items-center gap-2 text-lg">
                    <span>💵</span>
                    <span className="font-semibold text-green-600" data-cy="event-view-selected-entry budget-remain">
                      ${(parseInt(event.budget || event.setBudget || event.budgetTotal || 0) - parseInt(event.budgetSpent || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <label className="block text-gray-500 text-sm font-semibold mb-2">Description</label>
                <p className="text-gray-700 bg-gray-50 p-4 rounded-lg" data-cy="event-view-selected-entry description">{event.description}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;