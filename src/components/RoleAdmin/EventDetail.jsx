import React, { useState } from 'react';

const AdminEventDetail = ({ setCurrentView, selectedEvent, setSelectedEvent }) => {
  const [comment, setComment] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  if (!selectedEvent) {
    setCurrentView('admin-dashboard');
    return null;
  }

  const getEventIcon = (type) => {
    const icons = {
      'Wedding': '💒',
      'Birthday': '🎂',
      'Gala': '✨',
      'Anniversary': '💐',
      'Corporate Retreat': '🏢',
      'Celebration': '🎊',
      'Other': '🎉'
    };
    return icons[type] || '🎉';
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

  const formatDate = (dateString) => {
    const [year, month, day] = dateString.split('-');
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${months[parseInt(month) - 1]} ${parseInt(day)}, ${year}`;
  };

  const handleAccept = () => {
    // Load all events from this user
    const userEvents = JSON.parse(localStorage.getItem(`events_${selectedEvent.userId}`) || '[]');
    
    // Update the event status to Planning and add admin comment
    const updated = userEvents.map(e => 
      e.id === selectedEvent.id 
        ? { 
            ...e, 
            status: 'Planning',
            adminComment: comment || 'Event accepted and moved to planning phase.',
            acceptedBy: 'Admin',
            acceptedAt: new Date().toISOString()
          }
        : e
    );
    
    localStorage.setItem(`events_${selectedEvent.userId}`, JSON.stringify(updated));
    alert('Event accepted and moved to Planning!');
    setSelectedEvent(null);
    setCurrentView('admin-dashboard');
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    const userEvents = JSON.parse(localStorage.getItem(`events_${selectedEvent.userId}`) || '[]');
    
    const updated = userEvents.map(e => 
      e.id === selectedEvent.id 
        ? { 
            ...e, 
            status: 'Cancelled',
            rejectionReason: rejectReason,
            rejectedBy: 'Admin',
            rejectedAt: new Date().toISOString()
          }
        : e
    );
    
    localStorage.setItem(`events_${selectedEvent.userId}`, JSON.stringify(updated));
    alert('Event rejected and user notified.');
    setSelectedEvent(null);
    setCurrentView('admin-dashboard');
  };

  const handleApproveCancellation = () => {
    const userEvents = JSON.parse(localStorage.getItem(`events_${selectedEvent.userId}`) || '[]');
    
    const updated = userEvents.map(e => 
      e.id === selectedEvent.id 
        ? { 
            ...e, 
            status: 'Cancelled',
            cancellationApproved: true,
            cancellationApprovedBy: 'Admin',
            cancellationApprovedAt: new Date().toISOString()
          }
        : e
    );
    
    localStorage.setItem(`events_${selectedEvent.userId}`, JSON.stringify(updated));
    alert('Cancellation approved.');
    setSelectedEvent(null);
    setCurrentView('admin-dashboard');
  };

  const handleDenyCancellation = () => {
    const userEvents = JSON.parse(localStorage.getItem(`events_${selectedEvent.userId}`) || '[]');
    
    const updated = userEvents.map(e => 
      e.id === selectedEvent.id 
        ? { 
            ...e, 
            cancellationRequest: false,
            cancellationDenied: true,
            cancellationDeniedBy: 'Admin',
            cancellationDeniedAt: new Date().toISOString()
          }
        : e
    );
    
    localStorage.setItem(`events_${selectedEvent.userId}`, JSON.stringify(updated));
    alert('Cancellation request denied.');
    setSelectedEvent(null);
    setCurrentView('admin-dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-elegant-50 to-royal-50/30 py-6 px-8">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => {
            setSelectedEvent(null);
            setCurrentView('admin-dashboard');
          }}
          className="mb-4 text-royal-700 hover:text-royal-900 font-semibold flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-royal-700 to-purple-600 p-8 text-white">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="text-6xl">{getEventIcon(selectedEvent.type)}</span>
                <div>
                  <h1 className="text-3xl font-display mb-2">{selectedEvent.name}</h1>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded text-sm ${getStatusColor(selectedEvent.status)}`}>
                      {selectedEvent.status}
                    </span>
                    <span className="text-sm">{selectedEvent.type}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Client Info */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <h3 className="font-semibold text-blue-900 mb-1">Client Information</h3>
              <p className="text-sm text-blue-800">
                Email: {selectedEvent.userEmail || 'Not available'}<br />
                User ID: #{selectedEvent.userId?.toString().slice(-4) || 'Unknown'}
              </p>
            </div>

            {/* Cancellation Request Alert */}
            {selectedEvent.cancellationRequest && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6">
                <h3 className="font-semibold text-orange-900 mb-2">🚨 Cancellation Request</h3>
                <p className="text-sm text-orange-800 mb-2">
                  <strong>Reason:</strong> {selectedEvent.cancellationReason}
                </p>
                <p className="text-xs text-orange-600">
                  Requested on: {new Date(selectedEvent.cancellationRequestDate).toLocaleString()}
                </p>
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={handleApproveCancellation}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition text-sm"
                  >
                    Approve Cancellation
                  </button>
                  <button
                    onClick={handleDenyCancellation}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition text-sm"
                  >
                    Deny Cancellation
                  </button>
                </div>
              </div>
            )}

            {/* Event Details - READ ONLY */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">📅 Event Date</div>
                <div className="font-semibold text-gray-800">{formatDate(selectedEvent.date)}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">{getLocationIcon(selectedEvent.locationType)} Venue Type</div>
                <div className="font-semibold text-gray-800">{selectedEvent.locationType}</div>
              </div>
              <div className="bg-orange-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">💰 Set Budget</div>
                <div className="font-semibold text-gray-800">
                  ${selectedEvent.setBudget?.toLocaleString() || 0}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Event Type</div>
                <div className="font-semibold text-gray-800">{selectedEvent.type}</div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">Expected Guests</div>
                <div className="font-semibold text-gray-800">{selectedEvent.guestCount || 'Not specified'}</div>
              </div>
            </div>

            {selectedEvent.description && (
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-2">Client's Vision</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedEvent.description}</p>
                </div>
              </div>
            )}

            {/* Admin Actions for Submitted Events */}
            {selectedEvent.status === 'Submitted' && !selectedEvent.cancellationRequest && (
              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Admin Actions</h3>
                
                <div className="mb-4">
                  <label className="block text-gray-700 mb-2 font-semibold">
                    Comment / Questions for Client (Optional)
                  </label>
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-royal-500"
                    rows="4"
                    placeholder="Add any comments or questions for the client..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleAccept}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    ✅ Accept & Move to Planning
                  </button>
                  <button
                    onClick={() => setShowRejectModal(true)}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                  >
                    ❌ Reject Request
                  </button>
                </div>
              </div>
            )}

            {/* Show if already processed */}
            {selectedEvent.status !== 'Submitted' && !selectedEvent.cancellationRequest && (
              <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">
                  This event has already been processed and is in <strong>{selectedEvent.status}</strong> status.
                </p>
                {selectedEvent.adminComment && (
                  <div className="mt-4 text-left bg-white p-4 rounded">
                    <p className="text-sm font-semibold text-gray-700 mb-1">Previous Admin Comment:</p>
                    <p className="text-sm text-gray-600">{selectedEvent.adminComment}</p>
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
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReject}
                className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition"
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
    </div>
  );
};

export default AdminEventDetail;