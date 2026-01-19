import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loadEventsFromStorage, saveEventsToStorage } from '../../utils/seedData';

const EventForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams(); // Get event ID from URL if editing
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Wedding',
    date: '',
    locationType: 'Castle',
    budget: '',
    guestCount: '',
    description: ''
  });

  const [errors, setErrors] = useState({});
  const isEditing = !!id;

  // Load event data if editing
  useEffect(() => {
    if (isEditing) {
      const events = loadEventsFromStorage();
      const event = events.find(e => e.id === id);
      
      if (event) {
        setFormData({
          name: event.name || '',
          type: event.type || 'Wedding',
          date: event.date || '',
          locationType: event.locationType || 'Castle',
          budget: event.budget || event.setBudget || event.budgetTotal || '',
          guestCount: event.guestCount || '',
          description: event.description || ''
        });
      }
    }
  }, [id, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.budget || formData.budget <= 0) newErrors.budget = 'Valid budget is required';
    if (!formData.guestCount || formData.guestCount <= 0) newErrors.guestCount = 'Valid guest count is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const events = loadEventsFromStorage();
    
    if (isEditing) {
      // Update existing event
      const updatedEvents = events.map(e => 
        e.id === id 
          ? { 
              ...e, 
              ...formData,
              setBudget: parseInt(formData.budget),
              budgetTotal: parseInt(formData.budget)
            }
          : e
      );
      saveEventsToStorage(updatedEvents);
      localStorage.setItem(`events_${user.id}`, JSON.stringify(updatedEvents));
    } else {
      // Create new event
      const newEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        status: 'In Review',
        setBudget: parseInt(formData.budget),
        budgetTotal: parseInt(formData.budget),
        budgetSpent: 0,
        userId: user.id,
        userEmail: user.email,
        createdAt: new Date().toISOString()
      };
      
      const updatedEvents = [...events, newEvent];
      saveEventsToStorage(updatedEvents);
      localStorage.setItem(`events_${user.id}`, JSON.stringify(updatedEvents));
    }

    navigate('/events');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </h1>
            <button
              onClick={() => navigate('/events')}
              className="text-gray-600 hover:text-gray-800"
            >
              ← Back to Events
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Event Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.name ? 'border-red-500' : ''
                }`}
                placeholder="e.g., Annual Company Gala"
                data-cy="event-name-input"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Event Type *
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                data-cy="event-type-select"
              >
                <option value="Wedding">💒 Wedding</option>
                <option value="Birthday">🎂 Birthday</option>
                <option value="Corporate">💼 Corporate</option>
                <option value="Conference">🎤 Conference</option>
                <option value="Party">🎊 Party</option>
                <option value="Other">🎉 Other</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Event Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.date ? 'border-red-500' : ''
                }`}
                data-cy="event-date-input"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location Type *
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                data-cy="event-location-select"
              >
                <option value="Castle">🏰 Castle</option>
                <option value="Chateau">🏛️ Chateau</option>
                <option value="Manor House">🏡 Manor House</option>
                <option value="Garden Estate">🌿 Garden Estate</option>
                <option value="Villa">🏘️ Villa</option>
                <option value="Historic Abbey">⛪ Historic Abbey</option>
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Budget ($) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.budget ? 'border-red-500' : ''
                }`}
                placeholder="50000"
                min="0"
                data-cy="event-budget-input"
              />
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Guest Count *
              </label>
              <input
                type="number"
                name="guestCount"
                value={formData.guestCount}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.guestCount ? 'border-red-500' : ''
                }`}
                placeholder="150"
                min="1"
                data-cy="event-guests-input"
              />
              {errors.guestCount && (
                <p className="text-red-500 text-sm mt-1">{errors.guestCount}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                rows="4"
                placeholder="Brief description of your event..."
                data-cy="event-description-input"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                data-cy="event-submit-btn"
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                data-cy="event-cancel-btn"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;