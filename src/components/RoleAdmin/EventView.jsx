import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { formatDateShort } from '../../utils/dateHelpers';
import { loadEventsFromStorage, saveEventsToStorage } from '../../utils/seedData';

const AdminEventView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [adminComment, setAdminComment] = useState('');

  const currentAdmin = 'Admin';

  useEffect(() => {
    const events = loadEventsFromStorage();
    const event = events.find(e => e.id === id);
    
    if (event) {
      setSelectedEvent(event);
    } else {
      navigate('/admin/dashboard');
    }
  }, [id, navigate]);

  if (!selectedEvent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⏳</div>
          <p className="text-gray-600">Loading event...</p>
        </div>
      </div>
    );
  }

  const isNewSubmission = selectedEvent.status === 'In Review' && !selectedEvent.cancellationRequest;
  const isCancellationRequest = selectedEvent.cancellationRequest && selectedEvent.status !== 'Cancelled';
  const isInProgress = selectedEvent.status === 'In Progress' && !selectedEvent.cancellationRequest;
  const isReadOnly = selectedEvent.status === 'Completed' || selectedEvent.status === 'Cancelled';
  
  // Additional checks for combined states
  const isInReviewWithCancellation = selectedEvent.status === 'In Review' && selectedEvent.cancellationRequest;
  const isInProgressWithCancellation = selectedEvent.status === 'In Progress' && selectedEvent.cancellationRequest;

  const updateEvent = (updatedEvent) => {
    const events = loadEventsFromStorage();
    const updated = events.map(e => e.id === selectedEvent.id ? updatedEvent : e);
    saveEventsToStorage(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAcceptSubmission = () => {
    if (!adminComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Event Accepted',
      note: adminComment
    });

    const updatedEvent = {
      ...selectedEvent,
      status: 'In Progress',
      activityLog,
      acceptedBy: currentAdmin,
      acceptedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    navigate('/admin/dashboard');
  };

  const handleRejectSubmission = () => {
    if (!adminComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Event Rejected',
      note: adminComment
    });

    const updatedEvent = {
      ...selectedEvent,
      status: 'Cancelled',
      activityLog,
      rejectedBy: currentAdmin,
      rejectedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    navigate('/admin/dashboard');
  };

  const handleApproveCancellation = () => {
    if (!adminComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Cancellation Approved',
      note: adminComment
    });

    const updatedEvent = {
      ...selectedEvent,
      status: 'Cancelled',
      cancellationRequest: false,
      cancellationApproved: true,
      activityLog,
      cancellationApprovedBy: currentAdmin,
      cancellationApprovedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    navigate('/admin/dashboard');
  };

  const handleDenyCancellation = () => {
    if (!adminComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Cancellation Denied',
      note: adminComment
    });

    const updatedEvent = {
      ...selectedEvent,
      cancellationRequest: false,
      cancellationDenied: true,
      activityLog,
      cancellationDeniedBy: currentAdmin,
      cancellationDeniedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    navigate('/admin/dashboard');
  };

  const handleSaveProgress = () => {
    if (markAsCompleted) {
      handleMarkCompleted();
    } else {
      navigate('/admin/dashboard');
    }
  };

  const handleMarkCompleted = () => {
    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Event Completed',
      note: completionNotes || 'Event marked as completed'
    });

    const updatedEvent = {
      ...selectedEvent,
      status: 'Completed',
      activityLog,
      completedBy: currentAdmin,
      completedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    navigate('/admin/dashboard');
  };

  // Format timestamp for display
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8" data-cy="eventview">
      <div className="max-w-4xl mx-auto">

        {/* Event View Details */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="eventview-details">
          <h2 className="text-3xl font-display mb-2">{selectedEvent.name}</h2>
          <p className="text-gray-600 mb-6 font-serif">
            {isNewSubmission && 'New Event Submission - Review Required'}
            {isInReviewWithCancellation && 'New Event Submission with Cancellation Request - Review Required'}
            {isCancellationRequest && !isInReviewWithCancellation && 'Cancellation Request - Review Required'}
            {isInProgress && 'Event In Progress - Admin Management'}
            {isInProgressWithCancellation && 'Event In Progress with Cancellation Request - Review Required'}
            {isReadOnly && `Event ${selectedEvent.status}`}
          </p>

          <div className="space-y-6">

            {/* Client Info - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail?.split('@')[0].toUpperCase() || 'Not available'}</span>
                </div>
                <div>
                  <span className="text-gray-600">ID:</span>
                  <span className="ml-2 font-semibold">#{selectedEvent.userId?.toString().slice(-4) || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Contact Email:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail || 'Not available'}</span>
                </div>
              </div>
            </div>

            {/* Event Details - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-semibold">{formatDateShort(selectedEvent.date)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Venue Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.locationType}</span>
                </div>

                <div>
                  <span className="text-gray-600">Event Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Guest Count:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.guestCount || 'Not specified'}</span>
                </div>

                <div>
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-semibold">${parseInt(selectedEvent.budget || selectedEvent.setBudget || selectedEvent.budgetTotal || 0).toLocaleString()}</span>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="mt-4 text-sm">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 font-semibold text-gray-800">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            {/* Return to Dashboard */}
            {isReadOnly && (
              <div className="flex gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                  data-cy="return-dashboard-btn"
                >
                  Close and Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>

        {/* Event View Select Entry Action */}
        {!isReadOnly && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="eventview-action">
            <h2 className="text-3xl font-display mb-2">Admin Actions</h2>
            <p className="text-gray-600 mb-6 font-serif">
              {(isNewSubmission || isInReviewWithCancellation) && 'Review and respond to new event submission'}
              {isCancellationRequest && !isInReviewWithCancellation && !isInProgressWithCancellation && 'Review and respond to cancellation request'}
              {(isInProgress || isInProgressWithCancellation) && 'Manage event and update status'}
            </p>

            <div className="space-y-6">
              
              {/* New Event Request Review */}
              {(isNewSubmission || isInReviewWithCancellation) && (
                <div className="bg-gray-50 border rounded-lg p-6">
                  <div data-cy="eventview-action-review-new">
                    <p className="text-lg font-semibold mb-4">Review New Event Submission</p>
                    
                    <div className="mb-4">
                      <label className="block text-sm text-gray-700 font-semibold mb-2">
                        Response to Client <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                        rows="4"
                        placeholder="Add your response to the decision..."
                        data-cy="review-new-comment-input"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAcceptSubmission}
                        disabled={!adminComment.trim()}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="accept-new-event-btn"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={handleRejectSubmission}
                        disabled={!adminComment.trim()}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="decline-new-event-btn"
                      >
                        Decline Request
                      </button>
                    </div>

                    {/* Always show Return to Dashboard button */}
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                        data-cy="return-dashboard-btn"
                      >
                        Return to Dashboard
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* WIP - Existing Event - Planning Features (shown for In Progress, even with cancellation) */}
              {(isInProgress || isInProgressWithCancellation) && (
                <div className="bg-gray-50 border rounded-lg p-6">
                  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6" data-cy="eventview-action-plan">
                    <div className="text-4xl mb-3 text-center">📋</div>
                    <h3 className="text-lg font-semibold mb-2 text-center">Planning Features</h3>
                    <p className="text-gray-600 text-center text-sm">
                      To-do lists, vendor management, and detailed planning tools will be added here.
                    </p>
                  </div>

                  {/* Existing Event Mark As Complete */}
                  <div className="border-t pt-6" data-cy="eventview-action-complete">
                    <div className="flex items-start gap-3 mb-4">
                      <input
                        type="checkbox"
                        id="mark-completed"
                        checked={markAsCompleted}
                        onChange={(e) => setMarkAsCompleted(e.target.checked)}
                        className="mt-3 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                        data-cy="complete-event-checkbox"
                      />
                      <label htmlFor="mark-completed" className="cursor-pointer">
                        <div className="font-semibold text-gray-800">All Task Completed</div>
                        <div className="text-sm text-gray-600">
                          Check this box when all tasks have been successfully completed
                        </div>
                      </label>
                    </div>

                    {markAsCompleted && (
                      <div className="mb-4">
                        <label className="block text-sm text-gray-700 mb-2 font-semibold">
                          Comment to Client <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          value={completionNotes}
                          onChange={(e) => setCompletionNotes(e.target.value)}
                          required
                          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                          rows="3"
                          placeholder="Add any final notes about how the event went..."
                          data-cy="complete-event-note-input"
                        />
                      </div>
                    )}

                    {markAsCompleted && (
                      <div className="flex gap-3 mb-3">
                        <button
                          onClick={handleSaveProgress}
                          disabled={markAsCompleted && !completionNotes.trim()}
                          className="flex-1 px-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                          data-cy="save-event-update-btn"
                        >
                          Event is Completed
                        </button>
                      </div>
                    )}

                    {/* Always show Return to Dashboard button */}
                    <div className="flex gap-3">
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                        data-cy="return-dashboard-btn"
                      >
                        Return to Dashboard
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* Event Cancellation Request Review */}
              {(isCancellationRequest || isInReviewWithCancellation || isInProgressWithCancellation) && (
                <div className="bg-gray-50 border rounded-lg p-6">
                  <div data-cy="eventview-action-review-cancel">
                    <p className="text-lg font-semibold mb-4">Review Cancellation Request</p>
                    
                    {selectedEvent.cancellationReason && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Client's Reason:</p>
                        <p className="text-sm text-gray-800">{selectedEvent.cancellationReason}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-gray-700 text-sm font-semibold mb-2">
                        Response to Client <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={adminComment}
                        onChange={(e) => setAdminComment(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                        rows="4"
                        placeholder="Add your response to the client's cancellation request..."
                        data-cy="review-cancel-comment-input"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleApproveCancellation}
                        disabled={!adminComment.trim()}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="accept-cancel-event-btn"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={handleDenyCancellation}
                        disabled={!adminComment.trim()}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="decline-cancel-event-btn"
                      >
                        Decline Request
                      </button>
                    </div>

                    {/* Always show Return to Dashboard button */}
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                        data-cy="return-dashboard-btn"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Event View Activity Log - Always Visible */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="eventview-log">
          <h2 className="text-3xl font-display mb-2">Activity Log</h2>
          <p className="text-gray-600 mb-6 font-serif">
            Event history and communications
          </p>

          <div className="space-y-4">
            {(!selectedEvent.activityLog || selectedEvent.activityLog.length === 0) && (
              <div className="text-center py-8 text-gray-500">
                <p>No activity recorded yet</p>
              </div>
            )}

            {selectedEvent.activityLog && selectedEvent.activityLog.map((log, index) => {
              const isCurrentUser = log.actor === currentAdmin;
              return (
                <div
                  key={index}
                  className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
                  data-cy={`eventview-log-${isCurrentUser ? 'right' : 'left'}`}
                >
                  <div className={`max-w-md ${isCurrentUser ? 'bg-royal-100' : 'bg-gray-100'} rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">
                        {log.actor}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold mb-2 ${isCurrentUser ? 'text-royal-700' : 'text-gray-700'}`}>
                      {log.action}
                    </div>
                    <div className="text-sm text-gray-800">
                      {log.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};


export default AdminEventView;