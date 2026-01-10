import React, { useState, useEffect } from 'react';

const EventForm = ({ setCurrentView, selectedEvent, setSelectedEvent }) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'Party',
    date: '',
    location: '',
    budgetTotal: 0,
    budgetSpent: 0,
    status: 'Planning',
    description: ''
  });

  useEffect(() => {
    if (selectedEvent) {
      setFormData(selectedEvent);
    }
  }, [selectedEvent]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const events = JSON.parse(localStorage.getItem('events') || '[]');
    
    if (selectedEvent) {
      const updated = events.map(e => e.id === selectedEvent.id ? { ...formData, id: selectedEvent.id } : e);
      localStorage.setItem('events', JSON.stringify(updated));
    } else {
      const newEvent = { ...formData, id: Date.now(), createdAt: new Date().toISOString() };
      localStorage.setItem('events', JSON.stringify([...events, newEvent]));
    }
    
    setSelectedEvent(null);
    setCurrentView('events');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">{selectedEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setCurrentView('events');
              }}
              className="text-gray-500 hover:text-gray-700"
              data-cy="cancel-btn"
            >
              ✕
            </button>
          </div>

          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Sarah's Wedding"
                  data-cy="event-name-input"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  data-cy="event-type-select"
                >
                  <option value="Wedding">Wedding</option>
                  <option value="Birthday">Birthday</option>
                  <option value="Corporate">Corporate</option>
                  <option value="Conference">Conference</option>
                  <option value="Party">Party</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  data-cy="event-date-input"
                  required
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  data-cy="event-status-select"
                >
                  <option value="Planning">Planning</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Location *</label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Grand Hotel Ballroom"
                data-cy="event-location-input"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Total Budget</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.budgetTotal}
                    onChange={(e) => setFormData({ ...formData, budgetTotal: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="30000"
                    data-cy="event-budget-input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Amount Spent</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    value={formData.budgetSpent}
                    onChange={(e) => setFormData({ ...formData, budgetSpent: parseFloat(e.target.value) || 0 })}
                    className="w-full pl-7 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder="15000"
                    data-cy="event-spent-input"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Add any additional details about the event..."
                data-cy="event-description-input"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                data-cy="event-submit-btn"
              >
                {selectedEvent ? 'Update Event' : 'Create Event'}
              </button>
              <button
                onClick={() => {
                  setSelectedEvent(null);
                  setCurrentView('events');
                }}
                className="px-6 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition"
                data-cy="event-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventForm;