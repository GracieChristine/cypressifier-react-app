import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loadEventsFromStorage, saveEventsToStorage } from '../../utils/seedData';

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

const EventForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    type: 'Wedding',
    date: '',
    locationType: 'Castle',
    budget: '50000', // Default to Castle minimum
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
    
    const budgetValue = parseInt(formData.budget);
    const minBudget = LOCATION_TYPES[formData.locationType].min;
    
    if (!formData.budget || isNaN(budgetValue) || budgetValue <= 0) {
      newErrors.budget = 'Valid budget is required';
    } else if (budgetValue < minBudget) {
      newErrors.budget = `Budget must be at least $${minBudget.toLocaleString()} for ${formData.locationType}`;
    }
    
    if (!formData.guestCount || formData.guestCount <= 0) {
      newErrors.guestCount = 'Valid guest count is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const events = loadEventsFromStorage();
    
    // In the handleSubmit function, replace the localStorage.setItem lines:

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
      saveEventsToStorage(updatedEvents); // Only this line - remove the user-specific save
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
      saveEventsToStorage(updatedEvents); // Only this line - remove the user-specific save
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

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    const minBudget = LOCATION_TYPES[newLocation].min;
    
    setFormData(prev => ({
      ...prev,
      locationType: newLocation,
      budget: minBudget.toString() // Auto-set to minimum
    }));
    
    // Clear budget error if it existed
    if (errors.budget) {
      setErrors(prev => ({ ...prev, budget: '' }));
    }
  };

  const currentMinBudget = LOCATION_TYPES[formData.locationType].min;
  const currentBudgetValue = parseInt(formData.budget) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8" data-cy="eventform">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6" data-cy="eventform-header">
            <p className="text-3xl font-bold text-gray-800">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-cy="eventform new-event-form">
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
                placeholder="John Doe's Celebration Party"
                data-cy="new-event-name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1" error-name>{errors.name}</p>
              )}
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
                data-cy="new-event-date"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1" data-cy="error-date">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Budget ($) *
              </label>
              <input
                type="number"
                name="budget"
                value={formData.budget.toLocaleString()}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.budget ? 'border-red-500' : ''
                }`}
                placeholder={currentMinBudget.toLocaleString()}
                min={currentMinBudget.toLocaleString()}
                data-cy="new-event-budget"
              />
              <p className="text-sm text-gray-600 mt-1">
                Minimum budget for {formData.locationType}: ${currentMinBudget.toLocaleString()}
              </p>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1" data-cy="error-budget">{errors.budget}</p>
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
                data-cy="new-event-type"
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
                Location Type *
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleLocationChange}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                data-cy="new-event-location"
              >
                {Object.entries(LOCATION_TYPES).map(([name, data]) => (
                  <option key={name} value={name}>
                    {data.icon} {name}
                  </option>
                ))}
              </select>
              <p className="text-sm text-gray-600 mt-1">
                {LOCATION_TYPES[formData.locationType].description}
              </p>
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
                data-cy="new-event-guest"
              />
              {errors.guestCount && (
                <p className="text-red-500 text-sm mt-1" data-cy="error-guest">{errors.guestCount}</p>
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
                data-cy="new-event-description"
              />
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                data-cy="new-event-create-btn"
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                data-cy="new-event-cancel-btn"
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