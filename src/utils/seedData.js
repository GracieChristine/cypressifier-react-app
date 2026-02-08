// Frontend-only seed data generator

const EVENT_NAMES = {
  'Anniversary': [
    'Platinum Jubilee Celebration',
    '20th Year Memorial',
    'The Synergy Soirée',
    'The 10-Year Toast',
    'A Decade of Memories'
  ],
  'Birthday': [
    'Golden Jubilee Celebration',
    'Sweet Sixteen Extravaganza',
    '40th Birthday Bash',
    'Milestone Birthday Gala',
    'Garden Birthday Party'
  ],
  'Celebration': [
    'Product Launch Event',
    'Cultural Festival',
    'Community Gathering',
    'Endless Summer Party',
    'Hearts of Hope Fundraiser'
  ],
  'Corporate Retreat': [
    'Annual Company Gala',
    'Executive Leadership Summit',
    'Team Building Retreat',
    'Corporate Awards Ceremony',
    'Business Networking Event'
  ],
  'Gala': [
    'Midnight Masquerade Ball',
    'Art Exhibition Opening',
    'Echoes of Elegance Charity Auction',
    'Starlight Symphony',
    'GalaGleam'
  ],
  'Party': [
    'New Year\'s Eve Celebration',
    'Holiday Gala',
    'Masquerade Ball',
    'Charity Fundraiser',
    'Summer Garden Party'
  ],
  'Wedding': [
    'Enchanted Garden Wedding',
    'Royal Romance Celebration',
    'Vintage Countryside Wedding',
    'Elegant Summer Soirée',
    'Rustic Charm Wedding'
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
  'Historic Abbey': 55000,
  'Garden Estate': 30000,
  'Manor House': 35000,
  'Villa': 40000
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
function generateEvent(status, userId, userEmail) {
  const type = getRandomItem(Object.keys(EVENT_NAMES));
  const locationType = getRandomItem(LOCATION_TYPES);
  const basePrice = LOCATION_MINIMUMS[locationType];
  const budget = basePrice + Math.floor(Math.random() * 50000);
  const guestCount = 50 + Math.floor(Math.random() * 251);
  
  let date;
  switch(status) {
    case 'Completed':
      date = getRandomDate(-180, 90);
      break;
    case 'Cancelled':
      date = Math.random() > 0.5 
        ? getRandomDate(-90, 90)
        : getRandomDate(0, 180);
      break;
    case 'In Progress':
      date = getRandomDate(30, 120);
      break;
    case 'In Review':
      date = getRandomDate(60, 180);
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
    isMockData: true,
    userId: userId,
    userEmail: userEmail
  };
}

// Main seed function
export function generateSeedEvents(userId, userEmail) {
  const events = [];
  
  // Generate varied amounts for each status
  // In Review: 8 events
  for (let i = 0; i < 8; i++) {
    events.push(generateEvent('In Review', userId, userEmail));
  }
  
  // In Progress: 12 events
  for (let i = 0; i < 12; i++) {
    events.push(generateEvent('In Progress', userId, userEmail));
  }
  
  // Completed: 6 events
  for (let i = 0; i < 6; i++) {
    events.push(generateEvent('Completed', userId, userEmail));
  }
  
  // Cancelled: 4 events
  for (let i = 0; i < 4; i++) {
    events.push(generateEvent('Cancelled', userId, userEmail));
  }

  return {
    events,
    count: {
      'In Review': 8,
      'In Progress': 12,
      'Completed': 6,
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