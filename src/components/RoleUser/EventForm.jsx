import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

// Location type configurations with minimum budgets
const LOCATION_TYPES = {
  'Castle': { 
    min: 50000, 
    icon: '🏰',
    description: 'Historic castles with grand halls and royal ambiance'
  },
  'Chateau': { 
    min: 45000, 
    icon: '🏛️',
    description: 'French country estates with elegant architecture'
  },
  'Palace': { 
    min: 75000, 
    icon: '👑',
    description: 'Opulent palaces fit for royalty'
  },
  'Manor House': { 
    min: 35000, 
    icon: '🏡',
    description: 'Stately manor homes with period features'
  },
  'Garden Estate': { 
    min: 30000, 
    icon: '🌿',
    description: 'Romantic gardens and outdoor pavilions'
  },
  'Villa': { 
    min: 40000, 
    icon: '🏘️',
    description: 'Luxury villas with Mediterranean charm'
  },
  'Historic Abbey': { 
    min: 55000, 
    icon: '⛪',
    description: 'Centuries-old abbeys with Gothic grandeur'
  }
};

const EventForm = ({ setCurrentView, selectedEvent, setSelectedEvent }) => {
  const { user } = useAuth();
  
  console.log('EventForm user:', user);
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Wedding',
    date: '',
    locationType: 'Castle',
    setBudget: 50000,
    guestCount: '',
    status: 'Submitted',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const today = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (selectedEvent) {
      setFormData({
        ...selectedEvent,
        setBudget: selectedEvent.setBudget || selectedEvent.budgetTotal || selectedEvent.estimatedBudget || 50000,
        locationType: selectedEvent.locationType || 'Castle'
      });
    }
  }, [selectedEvent]);

  // Update budget when location type changes
  const handleLocationTypeChange = (newLocationType) => {
    const minBudget = LOCATION_TYPES[newLocationType].min;
    setFormData({ 
      ...formData, 
      locationType: newLocationType,
      setBudget: Math.max(formData.setBudget, minBudget) // Keep higher of current or minimum
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Event name is required';
    }

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else if (new Date(formData.date) < new Date(today)) {
      newErrors.date = 'Event date cannot be in the past';
    }

    const minBudget = LOCATION_TYPES[formData.locationType].min;
    if (formData.setBudget < minBudget) {
      newErrors.budget = `Minimum budget for ${formData.locationType} is $${minBudget.toLocaleString()}`;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const events = JSON.parse(localStorage.getItem('events') || '[]');
    
    if (selectedEvent) {
      const updated = events.map(e => e.id === selectedEvent.id ? { 
        ...formData, 
        id: selectedEvent.id,
        budgetTotal: parseFloat(formData.setBudget) || 0,
        budgetSpent: e.budgetSpent || 0,
        setBudget: parseFloat(formData.setBudget) || 0,
        locationType: formData.locationType,
        location: formData.locationType // For backward compatibility with display
      } : e);
      localStorage.setItem('events', JSON.stringify(updated));
    } else {
      const newEvent = { 
        ...formData, 
        id: Date.now(), 
        createdAt: new Date().toISOString(),
        status: 'Submitted',
        budgetTotal: parseFloat(formData.setBudget) || 0,
        budgetSpent: 0,
        setBudget: parseFloat(formData.setBudget) || 0,
        guestCount: parseInt(formData.guestCount) || 0,
        location: formData.locationType // For backward compatibility with display
      };
      localStorage.setItem('events', JSON.stringify([...events, newEvent]));
    }
    
    setSelectedEvent(null);
    setCurrentView('events');
  };

  const selectedLocationInfo = LOCATION_TYPES[formData.locationType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8">
      <div className="container mx-auto max-w-4xl px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-display">{selectedEvent ? 'Edit Event' : 'Plan Your Event'}</h2>
              <p className="text-sm text-gray-600 mt-1 font-serif">
                {selectedEvent ? 'Update your event details' : 'Create an unforgettable experience at Europe\'s finest venues'}
              </p>
            </div>
            <button
              onClick={() => {
                setSelectedEvent(null);
                setCurrentView('events');
              }}
              className="text-gray-500 hover:text-gray-700 text-2xl"
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
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.name ? 'border-red-500' : ''
                  }`}
                  placeholder="The Ashford Wedding"
                  data-cy="event-name-input"
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1" data-cy="name-error">{errors.name}</p>
                )}
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
                  <option value="Anniversary">Anniversary</option>
                  <option value="Gala">Gala</option>
                  <option value="Corporate Retreat">Corporate Retreat</option>
                  <option value="Celebration">Celebration</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Event Date *</label>
                <input
                  type="date"
                  value={formData.date}
                  min={today}
                  onChange={(e) => {
                    setFormData({ ...formData, date: e.target.value });
                    if (errors.date) setErrors({ ...errors, date: '' });
                  }}
                  className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.date ? 'border-red-500' : ''
                  }`}
                  data-cy="event-date-input"
                  required
                />
                {errors.date && (
                  <p className="text-red-500 text-sm mt-1" data-cy="date-error">{errors.date}</p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Expected Guest Count</label>
                <input
                  type="number"
                  value={formData.guestCount}
                  onChange={(e) => setFormData({ ...formData, guestCount: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="150"
                  min="0"
                  data-cy="event-guest-count-input"
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Venue Type *</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {Object.entries(LOCATION_TYPES).map(([type, info]) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleLocationTypeChange(type)}
                    className={`p-4 border-2 rounded-lg text-left transition-all ${
                      formData.locationType === type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-purple-300'
                    }`}
                    data-cy={`location-type-${type.toLowerCase().replace(' ', '-')}`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{info.icon}</span>
                      <div>
                        <div className="font-semibold text-gray-800">{type}</div>
                        <div className="text-xs text-gray-600 mt-1">{info.description}</div>
                        <div className="text-xs text-purple-600 mt-1 font-semibold">
                          From ${info.min.toLocaleString()}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Set Budget *</label>
              <div className="relative">
                <span className="absolute left-3 top-2 text-gray-500">$</span>
                <input
                  type="number"
                  value={formData.setBudget}
                  onChange={(e) => {
                    setFormData({ ...formData, setBudget: e.target.value });
                    if (errors.budget) setErrors({ ...errors, budget: '' });
                  }}
                  className={`w-full pl-7 pr-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                    errors.budget ? 'border-red-500' : ''
                  }`}
                  placeholder={selectedLocationInfo.min.toString()}
                  min={selectedLocationInfo.min}
                  data-cy="event-budget-input"
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Minimum for {formData.locationType}: ${selectedLocationInfo.min.toLocaleString()}
              </p>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1" data-cy="budget-error">{errors.budget}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 mb-2 font-semibold">Vision & Details</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Describe your vision... preferred regions, specific requirements, style preferences..."
                data-cy="event-description-input"
              />
              <p className="text-sm text-gray-500 mt-1">
                Our team will work with you to find the perfect {formData.locationType.toLowerCase()} for your event
              </p>
            </div>

            {selectedEvent && user && user.isAdmin && (
              <div>
                <label className="block text-gray-700 mb-2 font-semibold">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  data-cy="event-status-select"
                >
                  <option value="Submitted">Submitted</option>
                  <option value="Planning">Planning</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
                <p className="text-sm text-gray-500 mt-1">Update event status (Admin only)</p>
              </div>
            )}

            {!selectedEvent && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <p className="text-sm text-purple-900 font-serif">
                  <strong className="font-display">Next Steps:</strong> Our planning team will review your request and contact you within 48 hours to discuss venue options, availability, and begin crafting your perfect event.
                </p>
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 bg-royal-700 text-white py-3 rounded-lg hover:bg-royal-800 transition font-sans font-semibold shadow-lg"
                data-cy="event-submit-btn"
              >
                {selectedEvent ? 'Update Event' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSelectedEvent(null);
                  setCurrentView('events');
                }}
                className="px-6 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition font-sans"
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