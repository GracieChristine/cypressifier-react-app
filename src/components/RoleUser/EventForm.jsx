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
  'Garden Estate': { 
    min: 30000, 
    icon: '🌿',
    description: 'Romantic gardens and outdoor pavilions'
  },
  'Historic Abbey': { 
    min: 55000, 
    icon: '⛪',
    description: 'Centuries-old abbeys with Gothic grandeur'
  },
  'Manor House': { 
    min: 35000, 
    icon: '🏡',
    description: 'Stately manor homes with period features'
  },
  'Villa': { 
    min: 40000, 
    icon: '🏘️',
    description: 'Luxury villas with Mediterranean charm'
  }
};

const EventForm = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    date: '',
    locationType: '',
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
          type: event.type || '',
          date: event.date || '',
          locationType: event.locationType || '',
          budget: (event.budget || event.setBudget || event.budgetTotal || '').toString(),
          guestCount: (event.guestCount || '').toString(),
          description: event.description || ''
        });
      }
    }
  }, [id, isEditing]);

  // Format number with thousand separators
  const formatNumber = (value) => {
    if (!value) return '';
    const num = value.replace(/,/g, '');
    if (isNaN(num)) return value;
    return parseInt(num).toLocaleString();
  };

  // Remove formatting to get raw number
  const parseNumber = (value) => {
    return value.replace(/,/g, '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Event name is required';

    if (!formData.date) {
      newErrors.date = 'Event date is required';
    } else {
      const selectedDate = new Date(formData.date);
      const today = new Date();

      // Normalize time to avoid timezone edge cases
      selectedDate.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);

      if (selectedDate < today) {
        newErrors.date = 'Event date cannot be in the past';
      }
    }

    if (!formData.type) newErrors.type = 'Event type is required';
    
    if (!formData.locationType) newErrors.locationType = 'Event location type is required';

    const budgetValue = parseInt(parseNumber(formData.budget));
    const minBudget = formData.locationType ? LOCATION_TYPES[formData.locationType].min : 0;
    
    if (!formData.budget || isNaN(budgetValue) || budgetValue <= 0) {
      newErrors.budget = 'Event budget is required';
    } else if (formData.locationType && budgetValue < minBudget) {
      newErrors.budget = `Event budget must be at least $${minBudget.toLocaleString()} for ${formData.locationType}`;
    }
    
    const guestCountValue = parseInt(parseNumber(formData.guestCount));
    if (!formData.guestCount || isNaN(guestCountValue) || guestCountValue <= 0) {
      newErrors.guestCount = 'Event guest count is required';
    }

    if (!formData.description.trim()) newErrors.description = 'Event description is required';

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
              budget: budgetValue,
              guestCount: guestCountValue,
              setBudget: budgetValue,
              budgetTotal: budgetValue
            }
          : e
      );
      saveEventsToStorage(updatedEvents);
    } else {
      // Create new event
      const newEvent = {
        id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        ...formData,
        budget: budgetValue,
        guestCount: guestCountValue,
        status: 'In Review',
        setBudget: budgetValue,
        budgetTotal: budgetValue,
        budgetSpent: 0,
        userId: user.id,
        userEmail: user.email,
        createdAt: new Date().toISOString()
      };
      
      const updatedEvents = [...events, newEvent];
      saveEventsToStorage(updatedEvents);
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

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const rawValue = parseNumber(value);
    
    // Only allow numbers
    if (rawValue === '' || !isNaN(rawValue)) {
      setFormData(prev => ({ ...prev, [name]: rawValue }));
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    }
  };

  const handleLocationChange = (e) => {
    const newLocation = e.target.value;
    
    setFormData(prev => ({
      ...prev,
      locationType: newLocation
    }));
    
    // Clear errors
    if (errors.locationType) {
      setErrors(prev => ({ ...prev, locationType: '' }));
    }
  };

  const getBudgetPlaceholder = () => {
    if (formData.locationType && LOCATION_TYPES[formData.locationType]) {
      return LOCATION_TYPES[formData.locationType].min.toLocaleString();
    }
    return '10,000';
  };

  const currentMinBudget = formData.locationType ? LOCATION_TYPES[formData.locationType].min : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 py-6 px-8" data-cy="eventform">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <p className="text-3xl font-bold text-gray-800">
              {isEditing ? 'Edit Event' : 'Create New Event'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Name
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
                data-cy="eventform-name-input"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-name-error">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.date ? 'border-red-500' : ''
                }`}
                data-cy="eventform-date-input"
              />
              {errors.date && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-date-error">{errors.date}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Location Type
              </label>
              <select
                name="locationType"
                value={formData.locationType}
                onChange={handleLocationChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.locationType ? 'border-red-500' : ''
                } ${!formData.locationType ? 'text-gray-400' : 'text-gray-900'}`}
                data-cy="eventform-location-input"
              >
                <option value="" disabled hidden>Select a location type</option>
                {Object.entries(LOCATION_TYPES).map(([name, data]) => (
                  <option key={name} value={name}>
                    {data.icon} {name}
                  </option>
                ))}
              </select>
              {formData.locationType && (
                <p className="text-sm text-gray-600 mt-1">
                  {LOCATION_TYPES[formData.locationType].description}
                </p>
              )}
              {errors.locationType && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-location-error">{errors.locationType}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Event Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.type ? 'border-red-500' : ''
                } ${!formData.type ? 'text-gray-400' : 'text-gray-900'}`}
                data-cy="eventform-type-input"
              >
                <option value="" disabled hidden>Select an event type</option>
                <option value="Anniversary">💐 Anniversary</option>
                <option value="Birthday">🎂 Birthday</option>
                <option value="Celebration">🎊 Celebration</option>
                <option value="Corporate Retreat">🏢 Corporate Retreat</option>
                <option value="Gala">✨ Gala</option>
                <option value="Party">🎊 Party</option>
                <option value="Wedding">💒 Wedding</option>
                <option value="Other">🎉 Other</option>
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-type-error">{errors.type}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Guest Count
              </label>
              <input
                type="text"
                name="guestCount"
                value={formatNumber(formData.guestCount)}
                onChange={handleNumberChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.guestCount ? 'border-red-500' : ''
                }`}
                placeholder="150"
                data-cy="eventform-guestCount-input"
              />
              {errors.guestCount && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-guestCount-error">{errors.guestCount}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Budget ($)
              </label>
              <input
                type="text"
                name="budget"
                value={formatNumber(formData.budget)}
                onChange={handleNumberChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.budget ? 'border-red-500' : ''
                }`}
                placeholder={getBudgetPlaceholder()}
                data-cy="eventform-budget-input"
              />
              {formData.locationType && (
                <p className="text-sm text-gray-600 mt-1">
                  Minimum budget for {formData.locationType}: ${currentMinBudget.toLocaleString()}
                </p>
              )}
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-budget-error">{errors.budget}</p>
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
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                  errors.description ? 'border-red-500' : ''
                }`}
                rows="4"
                placeholder="Brief description of your event..."
                data-cy="eventform-description-input"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1" data-cy="eventform-description-error">{errors.description}</p>
              )}
            </div>

            {/* Form Buttons */}
            <div className="flex gap-4">
              <button
                type="submit"
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition font-semibold"
                data-cy="eventform-save-btn"
              >
                {isEditing ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/events')}
                className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg hover:bg-gray-400 transition font-semibold"
                data-cy="eventform-cancel-btn"
              >
                Cancel and Close
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EventForm;