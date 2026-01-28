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
  const [acceptComment, setAcceptComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // Confirmation modals only
  const [showApproveCancelModal, setShowApproveCancelModal] = useState(false);
  const [showDenyCancelModal, setShowDenyCancelModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

  // Current logged-in admin (in production, this would come from auth context)
  const currentAdmin = 'Admin';

  // Load event from storage
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

  const updateEvent = (updatedEvent) => {
    const events = loadEventsFromStorage();
    const updated = events.map(e => e.id === selectedEvent.id ? updatedEvent : e);
    saveEventsToStorage(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAcceptSubmission = () => {
    if (!acceptComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Event Accepted',
      note: acceptComment
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
    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Event Rejected',
      note: rejectReason
    });

    const updatedEvent = {
      ...selectedEvent,
      status: 'Cancelled',
      activityLog,
      rejectedBy: currentAdmin,
      rejectedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    setShowRejectModal(false);
    navigate('/admin/dashboard');
  };

  const confirmApproveCancellation = () => {
    if (!acceptComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Cancellation Approved',
      note: acceptComment
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
    setShowApproveCancelModal(false);
    navigate('/admin/dashboard');
  };

  const confirmDenyCancellation = () => {
    if (!acceptComment.trim()) {
      return;
    }

    const activityLog = selectedEvent.activityLog || [];
    activityLog.push({
      timestamp: new Date().toISOString(),
      actor: currentAdmin,
      action: 'Cancellation Denied',
      note: acceptComment
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
    setShowDenyCancelModal(false);
    navigate('/admin/dashboard');
  };

  const handleSaveProgress = () => {
    if (markAsCompleted) {
      setShowCompletedModal(true);
    } else {
      navigate('/admin/dashboard');
    }
  };

  const confirmMarkCompleted = () => {
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
    setShowCompletedModal(false);
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
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8" data-cy="event-view">
      <div className="max-w-4xl mx-auto">

        {/* Return to Dashboard */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-4 text-royal-700 hover:text-royal-900 font-semibold flex items-center gap-2"
          data-cy="event-view-to-dashboard-btn"
        >
          Back to Dashboard
        </button>

        {/* Event View Select Entry */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="event-view-selected-entry">
          <h2 className="text-3xl font-display mb-2">{selectedEvent.name}</h2>
          <p className="text-gray-600 mb-6 font-serif">
            {isNewSubmission && 'New Event Submission - Review Required'}
            {isCancellationRequest && 'Cancellation Request - Review Required'}
            {isInProgress && 'Event In Progress - Admin Management'}
            {isReadOnly && `Event ${selectedEvent.status}`}
          </p>

          <div className="space-y-6">
            {/* Client Info - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6" data-cy="event-view-client-info">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div data-cy="client-info-name">
                  <span className="text-gray-600">User Name:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail?.split('@')[0].toUpperCase() || 'Not available'}</span>
                </div>
                <div data-cy="client-info-id">
                  <span className="text-gray-600">Client ID:</span>
                  <span className="ml-2 font-semibold">#{selectedEvent.userId?.toString().slice(-4) || 'Unknown'}</span>
                </div>
                <div data-cy="client-info-email">
                  <span className="text-gray-600">Contact Email:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail || 'Not available'}</span>
                </div>
              </div>
            </div>

            {/* Event Details - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6" data-cy="event-view-event-info">
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>

              <div className="grid grid-cols-2 gap-4 text-lg underline">
                <div data-cy="event-info-name">
                  <h4 className="mt-2 mb-6 font-semibold">{selectedEvent.name}</h4>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div data-cy="event-info-date">
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-semibold">{formatDateShort(selectedEvent.date)}</span>
                </div>
                <div data-cy="event-info-budget">
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-semibold">${parseInt(selectedEvent.budget || selectedEvent.setBudget || selectedEvent.budgetTotal || 0).toLocaleString()}</span>
                </div>

                <div data-cy="event-info-type">
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.type}</span>
                </div>
                <div data-cy="event-info-venue">
                  <span className="text-gray-600">Venue Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.locationType}</span>
                </div>

                <div data-cy="event-info-guests">
                  <span className="text-gray-600">Guests:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.guestCount || 'Not specified'}</span>
                </div>
                <div data-cy="event-info-status">
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.status}</span>
                </div>
              </div>

              {selectedEvent.description && (
                <div className="mt-4" data-cy="event-info-description">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 font-semibold text-gray-800">{selectedEvent.description}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Event View Select Entry Action */}
        {!isReadOnly && (
          <div className="bg-white rounded-lg shadow-lg p-8" data-cy="event-view-action">
            <h2 className="text-3xl font-display mb-2">Admin Actions</h2>
            <p className="text-gray-600 mb-6 font-serif">
              {isNewSubmission && 'Review and respond to new event submission'}
              {isCancellationRequest && 'Review and respond to cancellation request'}
              {isInProgress && 'Manage event and update status'}
            </p>

            <div className="space-y-6">
              <div className="bg-gray-50 border rounded-lg p-6">
                
                {/* New Event - Accept/Decline */}
                {isNewSubmission && (
                  <div data-cy="event-view-action-review-new">
                    <p className="text-lg font-semibold mb-4">Review New Event Submission</p>
                    
                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-semibold">
                        Comment for Client <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={acceptComment}
                        onChange={(e) => setAcceptComment(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                        rows="4"
                        placeholder="Add your comments or questions for the client... (required)"
                        data-cy="review-new-comment-input"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={handleAcceptSubmission}
                        disabled={!acceptComment.trim()}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="accept-new-event-btn"
                      >
                        Accept Request
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                        data-cy="decline-new-event-btn"
                      >
                        Decline Request
                      </button>
                    </div>
                  </div>
                )}

                {/* Existing Event - Cancellation Request - Approve/Deny */}
                {isCancellationRequest && (
                  <div data-cy="event-view-action-review-cancel">
                    <p className="text-lg font-semibold mb-4">Review Cancellation Request</p>
                    
                    {selectedEvent.cancellationReason && (
                      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded">
                        <p className="text-sm font-semibold text-gray-700 mb-1">Client's Cancellation Reason:</p>
                        <p className="text-sm text-gray-800">{selectedEvent.cancellationReason}</p>
                      </div>
                    )}

                    <div className="mb-4">
                      <label className="block text-gray-700 mb-2 font-semibold">
                        Response to Client <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        value={acceptComment}
                        onChange={(e) => setAcceptComment(e.target.value)}
                        required
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                        rows="4"
                        placeholder="Add your response to the client's cancellation request... (required)"
                        data-cy="review-cancel-comment-input"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        onClick={() => setShowApproveCancelModal(true)}
                        disabled={!acceptComment.trim()}
                        className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="accept-cancel-event-btn"
                      >
                        Approve Cancellation
                      </button>
                      <button
                        onClick={() => setShowDenyCancelModal(true)}
                        disabled={!acceptComment.trim()}
                        className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                        data-cy="decline-cancel-event-btn"
                      >
                        Deny Cancellation
                      </button>
                    </div>
                  </div>
                )}

                {/* WIP - Existing Event - Planning Features */}
                {isInProgress && (
                  <>
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6 mb-6" data-cy="event-view-action-plan">
                      <div className="text-4xl mb-3 text-center">📋</div>
                      <h3 className="text-lg font-semibold mb-2 text-center">Planning Features</h3>
                      <p className="text-gray-600 text-center text-sm">
                        To-do lists, vendor management, and detailed planning tools will be added here.
                      </p>
                    </div>
                  </>
                )}

                {/* Existing Event - Complete */}
                {isInProgress && (
                  <>
                    <div className="border-t pt-6" data-cy="event-view-action-complete">
                      <div className="flex items-start gap-3 mb-4">
                        <input
                          type="checkbox"
                          id="mark-completed"
                          checked={markAsCompleted}
                          onChange={(e) => setMarkAsCompleted(e.target.checked)}
                          className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                          data-cy="complete-event-checkbox"
                        />
                        <label htmlFor="mark-completed" className="cursor-pointer">
                          <div className="font-semibold text-gray-800">Mark this event as Completed</div>
                          <div className="text-sm text-gray-600">
                            Check this box when the event has been successfully completed
                          </div>
                        </label>
                      </div>

                      {markAsCompleted && (
                        <div className="mb-4">
                          <label className="block text-gray-700 mb-2 font-semibold">
                            Completion Notes (Optional)
                          </label>
                          <textarea
                            value={completionNotes}
                            onChange={(e) => setCompletionNotes(e.target.value)}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                            rows="3"
                            placeholder="Add any final notes about how the event went..."
                            data-cy="complete-event-note-input"
                          />
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveProgress}
                          className={`flex-1 text-white py-3 rounded-lg transition font-semibold ${
                            markAsCompleted 
                              ? 'bg-green-600 hover:bg-green-700' 
                              : 'bg-royal-600 hover:bg-royal-700'
                          }`}
                          data-cy="save-event-update-btn"
                        >
                          {markAsCompleted ? 'Mark as Complete' : 'Return to Dashboard'}
                        </button>
                        <button
                          onClick={() => navigate('/admin/dashboard')}
                          className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
                          data-cy="cancel-event-update-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Activity Log - Always Visible */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6" data-cy="event-view-activity-log">
          <h2 className="text-3xl font-display mb-2">Activity Log</h2>
          <p className="text-gray-600 mb-6 font-serif">
            Event history and communications
          </p>

          <div className="space-y-4" data-cy="activity-log-container">
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
                  data-cy={`activity-log-item-${isCurrentUser ? 'right' : 'left'}`}
                >
                  <div className={`max-w-md ${isCurrentUser ? 'bg-royal-100' : 'bg-gray-100'} rounded-lg p-4 shadow-sm`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm" data-cy="activity-log-actor">
                        {log.actor}
                      </span>
                      <span className="text-xs text-gray-500" data-cy="activity-log-timestamp">
                        {formatTimestamp(log.timestamp)}
                      </span>
                    </div>
                    <div className={`text-xs font-semibold mb-2 ${isCurrentUser ? 'text-royal-700' : 'text-gray-700'}`} data-cy="activity-log-action">
                      {log.action}
                    </div>
                    <div className="text-sm text-gray-800" data-cy="activity-log-note">
                      {log.note}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal - Decline New Event Request */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-cy="decline-new-event-modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Decline Event Request</h3>
            <div className="flex gap-3">
              <button
                onClick={handleRejectSubmission}
                // disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                data-cy="decline-new-event-modal confirm-btn"
              >
                Confirm Decline
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                data-cy="decline-new-event-modal cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Accept Cancellation Confirmation */}
      {showApproveCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-cy="accept-cancel-event-modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Approve Cancellation?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve this cancellation request? The event status will be changed to <strong>Cancelled</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmApproveCancellation}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
                data-cy="accept-cancel-event-modal confirm-btn"
              >
                Accept Cancellation
              </button>
              <button
                onClick={() => setShowApproveCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                data-cy="accept-cancel-event-modal cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Decline Cancellation Confirmation */}
      {showDenyCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-cy="decline-cancel-event-modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Decline Cancellation Request?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to deny this cancellation request? The event will remain <strong>{selectedEvent.status}</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDenyCancellation}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                data-cy="decline-cancel-event-modal confirm-btn"
              >
                Confirm Denial
              </button>
              <button
                onClick={() => setShowDenyCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                data-cy="decline-cancel-event-modal cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal - Mark Event as Completed Confirmation */}
      {showCompletedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" data-cy="complete-event-modal">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Mark Event as Completed?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to mark this event as <strong>Completed</strong>? This action confirms the event has been successfully finished.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmMarkCompleted}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                data-cy="complete-event-modal confirm-btn"
              >
                Confirm Completion
              </button>
              <button
                onClick={() => setShowCompletedModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
                data-cy="complete-event-modal cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventView;