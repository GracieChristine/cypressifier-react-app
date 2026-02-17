import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { formatDateShort } from '../../utils/dateHelpers';
import { loadEventsFromStorage, saveEventsToStorage } from '../../utils/seedData';

const AdminEventView = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [adminComment, setAdminComment] = useState('');

  const currentAdmin = 'Admin';

  // Get mode from URL query parameter
  const queryParams = new URLSearchParams(location.search);
  const mode = queryParams.get('mode') || 'view';

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

  const isUpdateMode = mode === 'update';
  const isCompleteMode = mode === 'complete';
  const isViewMode = mode === 'view';

  const isSubmitted = selectedEvent.status === 'Submitted' && !selectedEvent.cancellationRequest;
  const isCancellationRequest = selectedEvent.cancellationRequest && selectedEvent.status !== 'Cancelled';
  const isReadOnly = selectedEvent.status === 'Completed' || selectedEvent.status === 'Cancelled';
  
  const isSubmittedWithCancellation = selectedEvent.status === 'Submitted' && selectedEvent.cancellationRequest;
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

  const handleRequestCompletion = () => {
    if (!completionNotes.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Completion Requested',
      note: completionNotes
    });

    const updatedEvent = {
      ...selectedEvent,
      completionRequest: true,
      completionNotes: completionNotes,
      completionRequestDate: new Date().toISOString(),
      completionRequestedBy: currentAdmin,
      activityLog
    };
    
    updateEvent(updatedEvent);
    navigate('/admin/dashboard');
  };

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
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-4 px-3 sm:py-6 sm:px-6 lg:px-8" data-cy="eventview">
      <div className="max-w-4xl mx-auto">

        {/* Event View Details */}
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:p-8 mb-6" data-cy="eventview-details">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-display mb-2">{selectedEvent.name}</h2>
            </div>

            {/* Status Badge - Prominent like user view */}
            <div className="flex flex-wrap gap-2 sm:flex-col sm:items-end">
              <span className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                selectedEvent.status === 'Submitted' ? 'bg-blue-100 text-blue-700' :
                selectedEvent.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
                selectedEvent.status === 'Completed' ? 'bg-green-100 text-green-700' :
                selectedEvent.status === 'Cancelled' ? 'bg-red-100 text-red-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {selectedEvent.status}
              </span>

              {/* Reviewing Event Badge */}
              {selectedEvent.status === 'Submitted' && (
                <span className="px-3 py-2 rounded text-xs font-semibold border border-orange-500 text-orange-600 bg-transparent whitespace-nowrap">
                  Reviewing Event
                </span>
              )}

              {/* Reviewing Cancellation Badge */}
              {selectedEvent.cancellationRequest && (
                <span className="px-3 py-1 rounded text-xs font-semibold border border-orange-500 text-orange-600 bg-transparent whitespace-nowrap">
                  Reviewing Cancellation
                </span>
              )}

              {/* Pending Completion Badge */}
              {selectedEvent.completionRequest && (
                <span className="px-3 py-1 rounded text-xs font-semibold border border-orange-500 text-orange-600 bg-transparent whitespace-nowrap">
                  Pending Completion
                </span>
              )}
            </div>
          </div>
          <div className="space-y-6">

            {/* Client Info - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
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

            {/* Return to Dashboard for read-only */}
            {isViewMode && isReadOnly && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="w-full sm:flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                  data-cy="return-dashboard-btn"
                >
                  Close and Return to Dashboard
                </button>
              </div>
            )}

          </div>
        </div>

        {/* UPDATE MODE - Show planning features only */}
        {isUpdateMode && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="eventview-action">
            <h2 className="text-3xl font-display mb-2">Event Management</h2>
            <p className="text-gray-600 mb-6 font-serif">
              Plan and manage event details
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 border rounded-lg p-6">
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6" data-cy="eventview-action-plan">
                  <div className="text-4xl mb-3 text-center">📋</div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Planning Features</h3>
                  <p className="text-gray-600 text-center text-sm">
                    To-do lists, vendor management, and detailed planning tools will be added here.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="w-full sm:flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                    data-cy="return-dashboard-btn"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COMPLETE MODE - Show completion form only (NO CHECKBOX) */}
        {isCompleteMode && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="eventview-action">
            <h2 className="text-3xl font-display mb-2">Mark Event as Complete</h2>
            <p className="text-gray-600 mb-6 font-serif">
              Submit completion request for client review
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 border rounded-lg p-6" data-cy="eventview-action-complete">
                <div className="mb-4">
                  <label className="block text-sm text-gray-700 mb-2 font-semibold">
                    Comment to Client <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={completionNotes}
                    onChange={(e) => setCompletionNotes(e.target.value)}
                    required
                    className="w-full px-3 py-2.5 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                    rows="4"
                    placeholder="Add any final notes about how the event went and what was completed..."
                    data-cy="complete-event-comment-input"
                  />
                </div>

                <div className="flex gap-3 mb-3">
                  <button
                    onClick={handleRequestCompletion}
                    disabled={!completionNotes.trim()}
                    className="w-full sm:flex-1 px-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    data-cy="save-event-update-btn"
                  >
                    Send Completion for Review
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/admin/dashboard')}
                    className="w-full sm:flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                    data-cy="return-dashboard-btn"
                  >
                    Return to Dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW MODE - Show review/action sections */}
        {isViewMode && !isReadOnly && (
          <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="eventview-action">
            <h2 className="text-3xl font-display mb-2">Admin Actions</h2>
            <p className="text-gray-600 mb-6 font-serif">
              {(isSubmitted || isSubmittedWithCancellation) && 'Review and respond to new event submission'}
              {isCancellationRequest && !isSubmittedWithCancellation && !isInProgressWithCancellation && 'Review and respond to cancellation request'}
              {isInProgressWithCancellation && 'Review cancellation request'}
              {selectedEvent.completionRequest && 'Event completion pending client review'}
            </p>

            <div className="space-y-6">
              
              {/* New Event Request Review */}
              {(isSubmitted || isSubmittedWithCancellation) && (
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
                        className="w-full px-3 py-2.5 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                        rows="4"
                        placeholder="Add your response to the decision..."
                        data-cy="review-new-comment-input"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleAcceptSubmission}
                        disabled={!adminComment.trim()}
                        className="w-full sm:flex-1 px-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="accept-new-event-btn"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={handleRejectSubmission}
                        disabled={!adminComment.trim()}
                        className="w-full sm:flex-1 px-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="decline-new-event-btn"
                      >
                        Decline Request
                      </button>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full sm:flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                        data-cy="return-dashboard-btn"
                      >
                        Return to Dashboard
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* Event Cancellation Request Review */}
              {(isCancellationRequest || isSubmittedWithCancellation || isInProgressWithCancellation) && (
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
                        className="w-full px-3 py-2.5 sm:py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                        rows="4"
                        placeholder="Add your response to the client's cancellation request..."
                        data-cy="review-cancel-comment-input"
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <button
                        onClick={handleApproveCancellation}
                        disabled={!adminComment.trim()}
                        className="w-full sm:flex-1 px-6 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="accept-cancel-event-btn"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={handleDenyCancellation}
                        disabled={!adminComment.trim()}
                        className="w-full sm:flex-1 px-6 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="decline-cancel-event-btn"
                      >
                        Decline Request
                      </button>
                    </div>

                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => navigate('/admin/dashboard')}
                        className="w-full sm:flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                        data-cy="return-dashboard-btn"
                      >
                        Return to Dashboard
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Completion Request - Just show info, no actions */}
              {selectedEvent.completionRequest && (
                <div className="bg-gray-50 border rounded-lg p-6">
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                    <div className="text-4xl mb-3 text-center">✅</div>
                    <h3 className="text-lg font-semibold mb-2 text-center">Completion Pending Client Review</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                      Waiting for client to review and approve event completion.
                    </p>
                    {selectedEvent.completionNotes && (
                      <div className="bg-white border rounded p-3 text-sm">
                        <p className="font-semibold mb-1">Your completion notes:</p>
                        <p className="text-gray-700">{selectedEvent.completionNotes}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-3">
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      className="w-full sm:flex-1 px-6 bg-gray-300 text-gray-700 font-semibold py-3 rounded-lg hover:bg-gray-400 transition"
                      data-cy="return-dashboard-btn"
                    >
                      Return to Dashboard
                    </button>
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