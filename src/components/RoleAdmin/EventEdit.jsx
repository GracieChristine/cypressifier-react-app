import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { loadEventsFromStorage, saveEventsToStorage } from '../../utils/seedData';

const AdminEventEdit = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [markAsCompleted, setMarkAsCompleted] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [acceptComment, setAcceptComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  
  // New modals
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [showApproveCancelModal, setShowApproveCancelModal] = useState(false);
  const [showDenyCancelModal, setShowDenyCancelModal] = useState(false);
  const [showCompletedModal, setShowCompletedModal] = useState(false);

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
  const isReadOnly = selectedEvent.status === 'Completed' || (selectedEvent.status === 'Cancelled' && !selectedEvent.cancellationRequest);

  const updateEvent = (updatedEvent) => {
    const events = loadEventsFromStorage();
    const updated = events.map(e => e.id === selectedEvent.id ? updatedEvent : e);
    saveEventsToStorage(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const handleAcceptSubmission = () => {
    const updatedEvent = {
      ...selectedEvent,
      status: 'In Progress',
      adminComment: acceptComment || 'Event accepted and moved to In Progress.',
      acceptedBy: 'Admin',
      acceptedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    setSuccessMessage('Event accepted and moved to In Progress!');
    setShowSuccessModal(true);
  };

  const handleRejectSubmission = () => {
    if (!rejectReason.trim()) {
      return;
    }

    const updatedEvent = {
      ...selectedEvent,
      status: 'Cancelled',
      rejectionReason: rejectReason,
      rejectedBy: 'Admin',
      rejectedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    setShowRejectModal(false);
    setSuccessMessage('Event has been rejected.');
    setShowSuccessModal(true);
  };

  const confirmApproveCancellation = () => {
    const updatedEvent = {
      ...selectedEvent,
      status: 'Cancelled',
      cancellationRequest: false,
      cancellationApproved: true,
      cancellationApprovedBy: 'Admin',
      cancellationApprovedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    setShowApproveCancelModal(false);
    setSuccessMessage('Cancellation approved. Event status changed to Cancelled.');
    setShowSuccessModal(true);
  };

  const confirmDenyCancellation = () => {
    const updatedEvent = {
      ...selectedEvent,
      cancellationRequest: false,
      cancellationDenied: true,
      cancellationDeniedBy: 'Admin',
      cancellationDeniedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    setShowDenyCancelModal(false);
    setSuccessMessage('Cancellation request has been denied.');
    setShowSuccessModal(true);
  };

  const handleSaveProgress = () => {
    if (markAsCompleted) {
      setShowCompletedModal(true);
    } else {
      const updatedEvent = {
        ...selectedEvent,
        status: 'In Progress'
      };
      
      updateEvent(updatedEvent);
      setSuccessMessage('Event updated successfully!');
      setShowSuccessModal(true);
    }
  };

  const confirmMarkCompleted = () => {
    const updatedEvent = {
      ...selectedEvent,
      status: 'Completed',
      completionNotes: completionNotes,
      completedBy: 'Admin',
      completedAt: new Date().toISOString()
    };
    
    updateEvent(updatedEvent);
    setShowCompletedModal(false);
    setSuccessMessage('Event has been marked as Completed!');
    setShowSuccessModal(true);
  };

  const closeSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/admin/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8">
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="mb-4 text-royal-700 hover:text-royal-900 font-semibold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-3xl font-display mb-2">{selectedEvent.name}</h2>
          <p className="text-gray-600 mb-6 font-serif">
            {isNewSubmission && 'New Event Submission - Review Required'}
            {isCancellationRequest && 'Cancellation Request - Review Required'}
            {isInProgress && 'Event In Progress - Admin Management'}
            {isReadOnly && `Event ${selectedEvent.status}`}
          </p>

          <div className="space-y-6">
            {/* Event Details - Read Only */}
            <div className="bg-gray-50 border rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Client Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">User Name:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail?.split('@')[0].toUpperCase() || 'Not available'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Client ID</span>
                  <span className="ml-2 font-semibold">#{selectedEvent.userId?.toString().slice(-4) || 'Unknown'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Contact Email:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.userEmail || 'Not available'}</span>
                </div>
              </div>
              <br/>
              <h3 className="text-lg font-semibold mb-4">Event Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.status}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.date}</span>
                </div>
                <div>
                  <span className="text-gray-600">Venue Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.locationType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Budget:</span>
                  <span className="ml-2 font-semibold">${parseInt(selectedEvent.budget || selectedEvent.setBudget || selectedEvent.budgetTotal || 0).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-gray-600">Guests:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.guestCount || 'Not specified'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-semibold">{selectedEvent.type}</span>
                </div>
              </div>
              {selectedEvent.description && (
                <div className="mt-4">
                  <span className="text-gray-600">Description:</span>
                  <p className="mt-1 text-gray-800">{selectedEvent.description}</p>
                </div>
              )}
            </div>

            {/* New Submission - Accept/Reject */}
            {isNewSubmission && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Review Submission</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Comment / Questions for Client (Optional)
                  </label>
                  <textarea
                    value={acceptComment}
                    onChange={(e) => setAcceptComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                    rows="4"
                    placeholder="Add any comments or questions for the client..."
                    data-cy="accept-comment"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAcceptSubmission}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                    data-cy="accept-submission-btn"
                  >
                    ✅ Accept & Move to In Progress
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                    data-cy="reject-submission-btn"
                  >
                    ❌ Reject Request
                  </button>
                </div>
              </div>
            )}

            {/* Cancellation Request Alert */}
            {isCancellationRequest && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4">
                <h3 className="font-semibold text-orange-900 mb-2">🚨 Cancellation Request</h3>
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Reason:</strong> {selectedEvent.cancellationReason}
                </p>
                <p className="text-xs text-orange-600 mb-4">
                  Requested on: {new Date(selectedEvent.cancellationRequestDate).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowApproveCancelModal(true)}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                    data-cy="approve-cancellation-btn"
                  >
                    Approve Cancellation
                  </button>
                  <button
                    onClick={() => setShowDenyCancelModal(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                    data-cy="deny-cancellation-btn"
                  >
                    Deny Cancellation
                  </button>
                </div>
              </div>
            )}

            {/* In Progress - Planning & Completion */}
            {isInProgress && (
              <>
                <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                  <div className="text-4xl mb-3 text-center">📋</div>
                  <h3 className="text-lg font-semibold mb-2 text-center">Planning Features</h3>
                  <p className="text-gray-600 text-center text-sm">
                    To-do lists, vendor management, and detailed planning tools will be added here.
                  </p>
                </div>

                <div className="border-t pt-6">
                  <div className="flex items-start gap-3 mb-4">
                    <input
                      type="checkbox"
                      id="mark-completed"
                      checked={markAsCompleted}
                      onChange={(e) => setMarkAsCompleted(e.target.checked)}
                      className="mt-1 w-5 h-5 text-green-600 rounded focus:ring-2 focus:ring-green-500"
                      data-cy="mark-completed-checkbox"
                    />
                    <label htmlFor="mark-completed" className="cursor-pointer">
                      <div className="font-semibold text-gray-800">Mark this event as Completed</div>
                      <div className="text-sm text-gray-600">
                        Check this box when the event has been successfully completed
                      </div>
                    </label>
                  </div>

                  {markAsCompleted && (
                    <div className="ml-8 mb-4">
                      <label className="block text-gray-700 mb-2 font-semibold">
                        Completion Notes (Optional)
                      </label>
                      <textarea
                        value={completionNotes}
                        onChange={(e) => setCompletionNotes(e.target.value)}
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                        rows="3"
                        placeholder="Add any final notes about how the event went..."
                        data-cy="completion-notes"
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
                      data-cy="admin-save-btn"
                    >
                      {markAsCompleted ? '✅ Save & Mark Completed' : '💾 Save Changes'}
                    </button>
                    <button
                      onClick={() => navigate('/admin/dashboard')}
                      className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
                      data-cy="admin-cancel-btn"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Read Only - Completed/Cancelled */}
            {isReadOnly && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  This event is <strong>{selectedEvent.status}</strong> and cannot be modified.
                </p>
                {selectedEvent.adminComment && (
                  <div className="mt-4 text-left bg-white p-4 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Admin Comment:</p>
                    <p className="text-sm text-gray-600">{selectedEvent.adminComment}</p>
                  </div>
                )}
                {selectedEvent.rejectionReason && (
                  <div className="mt-4 text-left bg-white p-4 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Rejection Reason:</p>
                    <p className="text-sm text-gray-600">{selectedEvent.rejectionReason}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Reject Event Request</h3>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2 font-semibold">
                Reason for Rejection *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
                rows="4"
                placeholder="Explain why this request cannot be accommodated..."
                data-cy="reject-reason-input"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleRejectSubmission}
                disabled={!rejectReason.trim()}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                data-cy="confirm-reject-btn"
              >
                Confirm Rejection
              </button>
              <button
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectReason('');
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Approve Cancellation Confirmation Modal */}
      {showApproveCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Approve Cancellation?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to approve this cancellation request? The event status will be changed to <strong>Cancelled</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmApproveCancellation}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
              >
                Yes, Approve
              </button>
              <button
                onClick={() => setShowApproveCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Deny Cancellation Confirmation Modal */}
      {showDenyCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Deny Cancellation Request?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to deny this cancellation request? The event will remain <strong>{selectedEvent.status}</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmDenyCancellation}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Yes, Deny Request
              </button>
              <button
                onClick={() => setShowDenyCancelModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mark as Completed Confirmation Modal */}
      {showCompletedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Mark Event as Completed?</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to mark this event as <strong>Completed</strong>? This action confirms the event has been successfully finished.
            </p>
            <div className="flex gap-3">
              <button
                onClick={confirmMarkCompleted}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
              >
                Yes, Mark Completed
              </button>
              <button
                onClick={() => setShowCompletedModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-xl font-bold mb-4">Success!</h3>
              <p className="text-gray-700 mb-6">{successMessage}</p>
              <button
                onClick={closeSuccessModal}
                className="w-full bg-royal-600 text-white py-2 rounded hover:bg-royal-700 transition"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminEventEdit;