describe('User Event Management', () => {
  // Setup variables
  const userEmail = 'eventuser@example.com';
  const userPassword = 'password123';
  
  // Sample event data
  const eventData = {
    name: "Mochi's Surprise Party",
    type: 'Celebration',
    date: '2026-12-04',
    locationType: 'Garden Estate',
    budget: '75000',
    guestCount: '120',
    description: 'Beautiful outdoor wedding in the English countryside.'
  };

  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.clearLocalStorage();
    
    // Sign up and login before each test
    cy.splashToSignup();
    cy.signupUser(userEmail, userPassword);
  });

  describe('Event Creation', () => {
    // Got a bug...the event-card and the text is not in the same tag...
    it('should successfully create a new event', () => {
      // Click create event button
      cy.get('[data-cy="create-event-btn"]').click();
      
      // Fill in event form
      cy.get('[data-cy="event-name-input"]').type(eventData.name);
      cy.get('[data-cy="event-type-select"]').select(eventData.type);
      cy.get('[data-cy="event-date-input"]').type(eventData.date);
      cy.get('[data-cy="event-guest-count-input"]').type(eventData.guestCount);
      
      // Select location type - Castle
      cy.get('[data-cy="location-type-castle"]').click();
      
      cy.get('[data-cy="event-budget-input"]').clear().type(eventData.budget);
      cy.get('[data-cy="event-description-input"]').type(eventData.description);
      
      // Submit
      cy.get('[data-cy="event-submit-btn"]').click();
      
      // Should be back on events list
      cy.get('[data-cy="event-card"]').should('exist');
      cy.get('[data-cy="event-name"]').should('have.text', eventData.name);
    });

    it('should show validation error when event name is missing', () => {
      cy.get('[data-cy="create-event-btn"]').click();
      
      // Leave name empty, fill other fields
      cy.get('[data-cy="event-type-select"]').select(eventData.type);
      cy.get('[data-cy="event-date-input"]').type(eventData.date);
      
      // Try to submit
      cy.get('[data-cy="event-submit-btn"]').click();
      
      // Should show error
      cy.get('[data-cy="name-error"]').should('have.text', 'Event name is required');
    });

    it('should show validation error when date is missing', () => {
      cy.get('[data-cy="create-event-btn"]').click();
      
      cy.get('[data-cy="event-name-input"]').type(eventData.name);
      // Leave date empty
      
      cy.get('[data-cy="event-submit-btn"]').click();
      
      cy.get('[data-cy="date-error"]').should('have.text', 'Event date is required');
    });

    it('should show validation error when date is in the past', () => {
      cy.get('[data-cy="create-event-btn"]').click();
      
      cy.get('[data-cy="event-name-input"]').type(eventData.name);
      cy.get('[data-cy="event-date-input"]').type('2020-01-01'); // Past date
      
      cy.get('[data-cy="event-submit-btn"]').click();
      
      cy.get('[data-cy="date-error"]').should('have.text', 'Event date cannot be in the past');
    });

    it('should enforce minimum budget based on location type', () => {
      cy.get('[data-cy="create-event-btn"]').click();
      
      cy.get('[data-cy="event-name-input"]').type(eventData.name);
      cy.get('[data-cy="event-date-input"]').type(eventData.date);
      
      // Select Palace (min $55,000)
      cy.get('[data-cy="location-type-historic-abbey"]').click();
      
      // Try to set budget below minimum
      cy.get('[data-cy="event-budget-input"]').clear().type('50000');
      
      cy.get('[data-cy="event-submit-btn"]').click();
      
      cy.get('[data-cy="budget-error"]').should('contain', 'Minimum budget for Historic Abbey is $55,000');
    });

    it('should create multiple events and display them all', () => {
      // Create first event
      cy.get('[data-cy="create-event-btn"]').click();
      cy.get('[data-cy="event-name-input"]').type('Event One');
      cy.get('[data-cy="event-date-input"]').type('2026-07-01');
      cy.get('[data-cy="location-type-villa"]').click();
      cy.get('[data-cy="event-submit-btn"]').click();
      
      // Create second event
      cy.get('[data-cy="create-event-btn"]').click();
      cy.get('[data-cy="event-name-input"]').type('Event Two');
      cy.get('[data-cy="event-date-input"]').type('2026-08-01');
      cy.get('[data-cy="location-type-chateau"]').click();
      cy.get('[data-cy="event-submit-btn"]').click();
      
      // Should see both events
      cy.get('[data-cy="event-card"]').should('have.length', 2);
      cy.contains('Event One').should('be.visible');
      cy.contains('Event Two').should('be.visible');
    });
  });
  
  describe('Event Editing', () => {
    beforeEach(() => {
      // Create an event to edit
      cy.get('[data-cy="create-event-btn"]').click();
      cy.get('[data-cy="event-name-input"]').type(eventData.name);
      cy.get('[data-cy="event-type-select"]').select(eventData.type);
      cy.get('[data-cy="event-date-input"]').type(eventData.date);
      cy.get('[data-cy="location-type-castle"]').click();
      cy.get('[data-cy="event-description-input"]').type(eventData.description);
      cy.get('[data-cy="event-submit-btn"]').click();
    });

    it('should successfully edit an event', () => {
      // Click edit button
      cy.get('[data-cy="edit-event-btn"]').first().click();
      
      // Update event name
      cy.get('[data-cy="event-name-input"]').clear().type('Updated Event Name');
      
      // Submit
      cy.get('[data-cy="event-submit-btn"]').click();
      
      // Should see updated name
      cy.get('[data-cy="event-name"]').should('have.text', 'Updated Event Name');
    });

    it('should not allow editing completed events', () => {
      // Note: This would require the event to be completed first
      // We'll test this in the admin workflow tests
      // For now, just verify the edit button exists for In Review events
      cy.get('[data-cy="edit-event-btn"]').should('be.visible');
    });

    it('should cancel editing and return to events list', () => {
      cy.get('[data-cy="edit-event-btn"]').first().click();
      
      // Make a change
      cy.get('[data-cy="event-name-input"]').clear().type('This Should Not Save');
      
      // Click cancel
      cy.get('[data-cy="event-cancel-btn"]').click();
      
      // Should be back on events list with original name
      cy.get('[data-cy="event-name"]').should('have.text', eventData.name);
    });
  });

  // Create events with different statuses
  // For now, all will be "In Review" - we'll need admin to change status
  describe('Event Filtering', () => {
    beforeEach(() => {
      // Create an event to edit
      cy.get('[data-cy="create-event-btn"]').click();
      cy.get('[data-cy="event-name-input"]').type(eventData.name);
      cy.get('[data-cy="event-type-select"]').select(eventData.type);
      cy.get('[data-cy="event-date-input"]').type(eventData.date);
      cy.get('[data-cy="location-type-castle"]').click();
      cy.get('[data-cy="event-description-input"]').type(eventData.description);
      cy.get('[data-cy="event-submit-btn"]').click();
    });

    it('should show all events when "All Events" filter is selected', () => {
      cy.get('[data-cy="filter-all"]').click();
      
      cy.get('[data-cy="event-card"]').should('exist');
    });

    it('should show all events when "In Review" filter is selected', () => {
      cy.get('[data-cy="filter-in-review"]').click();
      
      cy.get('[data-cy="event-card"]').should('exist');
    });

    it('should show all events when "In Progress" filter is selected', () => {
      cy.get('[data-cy="filter-in-progress"]').click();
      
    //   cy.get('[data-cy="event-card"]').should('exist');

      // Should show no events message
      cy.get('[data-cy="no-events"]').should('be.visible');
    });

    it('should show all events when "Completed" filter is selected', () => {
      cy.get('[data-cy="filter-completed"]').click();
      
    //   cy.get('[data-cy="event-card"]').should('exist');

      // Should show no events message
      cy.get('[data-cy="no-events"]').should('be.visible');
    });

    it('should show all events when "Cancelled" filter is selected', () => {
      cy.get('[data-cy="filter-cancelled"]').click();
      
    //   cy.get('[data-cy="event-card"]').should('exist');

      // Should show no events message
      cy.get('[data-cy="no-events"]').should('be.visible');
    });
  });
});