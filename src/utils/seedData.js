// Frontend-only seed data generator

const EVENT_NAMES = {
  'Wedding': [
    'Enchanted Garden Wedding',
    'Royal Romance Celebration',
    'Vintage Countryside Wedding',
    'Elegant Summer Soirée',
    'Rustic Charm Wedding'
  ],
  'Birthday': [
    'Golden Jubilee Celebration',
    'Sweet Sixteen Extravaganza',
    '40th Birthday Bash',
    'Milestone Birthday Gala',
    'Garden Birthday Party'
  ],
  'Corporate': [
    'Annual Company Gala',
    'Executive Leadership Summit',
    'Team Building Retreat',
    'Corporate Awards Ceremony',
    'Business Networking Event'
  ],
  'Conference': [
    'International Tech Conference',
    'Innovation Summit 2026',
    'Industry Leaders Forum',
    'Annual Professional Gathering',
    'Strategic Planning Conference'
  ],
  'Party': [
    'New Year\'s Eve Celebration',
    'Holiday Gala',
    'Masquerade Ball',
    'Charity Fundraiser',
    'Summer Garden Party'
  ],
  'Other': [
    'Product Launch Event',
    'Art Exhibition Opening',
    'Charity Auction',
    'Cultural Festival',
    'Community Gathering'
  ]
};

const LOCATION_TYPES = [
  'Castle',
  'Chateau',
  'Manor House',
  'Garden Estate',
  'Villa',
  'Historic Abbey'
];

const LOCATION_MINIMUMS = {
  'Castle': 50000,
  'Chateau': 45000,
  'Manor House': 35000,
  'Garden Estate': 30000,
  'Villa': 40000,
  'Historic Abbey': 55000
};

const DESCRIPTIONS = [
  'An unforgettable experience in a stunning historic venue.',
  'Beautiful celebration with exquisite attention to detail.',
  'Elegant gathering featuring world-class amenities.',
  'Sophisticated event in a breathtaking location.',
  'Memorable occasion with exceptional service and ambiance.',
  'Grand celebration showcasing timeless elegance.',
  'Intimate gathering in a picture-perfect setting.',
  'Spectacular event with luxurious accommodations.'
];

// Helper function to generate random date
function getRandomDate(daysOffset, range = 90) {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset + Math.floor(Math.random() * range));
  return date.toISOString().split('T')[0];
}

// Helper function to get random item from array
function getRandomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// Generate a unique ID
let eventIdCounter = 1;
function generateId() {
  return `event_${Date.now()}_${eventIdCounter++}`;
}

// Generate a single event
function generateEvent(status) {
  const type = getRandomItem(Object.keys(EVENT_NAMES));
  const locationType = getRandomItem(LOCATION_TYPES);
  const basePrice = LOCATION_MINIMUMS[locationType];
  const budget = basePrice + Math.floor(Math.random() * 50000);
  const guestCount = 50 + Math.floor(Math.random() * 251); // 50-300 guests
  
  // Date logic based on status
  let date;
  switch(status) {
    case 'Completed':
      date = getRandomDate(-180, 90); // 90-180 days ago
      break;
    case 'Cancelled':
      date = Math.random() > 0.5 
        ? getRandomDate(-90, 90)  // Past cancellation
        : getRandomDate(0, 180);   // Future cancellation
      break;
    case 'In Progress':
      date = getRandomDate(30, 120); // 30-150 days from now
      break;
    case 'In Review':
      date = getRandomDate(60, 180); // 60-240 days from now
      break;
    default:
      date = getRandomDate(0, 180);
  }

  return {
    id: generateId(),
    name: getRandomItem(EVENT_NAMES[type]),
    type: type,
    date: date,
    locationType: locationType,
    budget: budget.toString(),
    guestCount: guestCount.toString(),
    description: getRandomItem(DESCRIPTIONS),
    status: status,
    isMockData: true
  };
}

// Main seed function
export function generateSeedEvents(clearExisting = false) {
  const events = [];
  
  // Generate varied amounts for each status
  // In Review: 8 events
  for (let i = 0; i < 8; i++) {
    events.push(generateEvent('In Review'));
  }
  
  // In Progress: 6 events
  for (let i = 0; i < 6; i++) {
    events.push(generateEvent('In Progress'));
  }
  
  // Completed: 12 events
  for (let i = 0; i < 12; i++) {
    events.push(generateEvent('Completed'));
  }
  
  // Cancelled: 4 events
  for (let i = 0; i < 4; i++) {
    events.push(generateEvent('Cancelled'));
  }

  return {
    events,
    count: {
      'In Review': 8,
      'In Progress': 6,
      'Completed': 12,
      'Cancelled': 4,
      'Total': events.length
    }
  };
}

// Helper to save to localStorage
export function saveEventsToStorage(events) {
  localStorage.setItem('cypressifier_events', JSON.stringify(events));
}

// Helper to load from localStorage
export function loadEventsFromStorage() {
  const stored = localStorage.getItem('cypressifier_events');
  return stored ? JSON.parse(stored) : [];
}

// Helper to clear events
export function clearEventsFromStorage() {
  localStorage.removeItem('cypressifier_events');
}