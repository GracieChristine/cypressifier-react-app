describe('Smoke Tests - Critical User Flows', () => {
  const admin = {
    email: 'admin@cypressifier.com',
    password: 'admin123'
  };

  const user = {
    email: 'smoke.test@example.com',
    password: 'test123'
  };

  const event = {
    name: 'Smoke Test Event',
    date: '2026-12-31',
    location: 'Castle',
    type: 'Other',
    guestCount: '50',
    budget: '100000',
    description: 'Testing critical flows'
  };

  describe('User Critical Path', () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it('should complete user signup -> create event -> view event flow', () => {
      // Signup
      cy.landingToSignup();
      cy.userSignup(user.email, user.password, user.password);
      cy.url().should('contain', '/user/events');

      // Create event
      cy.eventlistToNewEventForm();
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
      
      // Verify event appears
      cy.get('[data-cy="eventlist-event-list-entry"]').should('have.length', 1);
      cy.get('[data-cy="eventlist-event-list-entry"]').should('contain', 'Submitted');

      // View event
      cy.userViewEvent('Submitted');
      cy.get('[data-cy="eventview-detail"]').should('exist');
    });

    it('should complete user login flow', () => {
      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);
      cy.url().should('contain', '/user/events');
    });
  });

  describe('Admin Critical Path', () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it('should complete admin login -> review event -> accept event flow', () => {
      // Login as admin
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
      cy.url().should('contain', '/admin/dashboard');

      // Verify event appears in dashboard
      cy.get('[data-cy="dashboard-table-entry"]').should('have.length.at.least', 1);
      cy.get('[data-cy="dashboard-table-entry"]').first().should('contain', 'Submitted');

      // Accept event
      cy.adminViewEvent('Submitted', 'Reviewing Event');
      cy.get('[data-cy="eventview-action-review-new"]').should('exist');
      cy.adminAcceptEventNew();

      // Verify status changed
      cy.get('[data-cy="dashboard-table-entry"]').first().should('contain', 'In Progress');
    });
  });

  describe('End-to-End Critical Path', () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it('should complete full lifecycle: signup -> create -> admin accept -> complete -> user confirm', () => {
      // User signup and create event
      cy.landingToSignup();
      cy.userSignup(user.email, user.password, user.password);
      cy.eventlistToNewEventForm();
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');

      // Admin accepts event
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
      cy.adminAcceptEventNew();

      // Admin submits completion
      cy.adminSubmitEventComplete();

      // User confirms completion
      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);
      cy.userAcceptEventComplete();

      // Verify final state
      cy.get('[data-cy="eventlist-event-list-entry"]').first().should('contain', 'Completed');
    });
  });

  describe('Application Health Check', () => {
    it('should load landing page', () => {
      cy.visit('/');
      cy.get('body').should('be.visible');
    });

    it('should load login page', () => {
      cy.visit('/login');
      cy.get('[data-cy="login"]').should('exist');
    });

    it('should load signup page', () => {
      cy.visit('/signup');
      cy.get('[data-cy="signup"]').should('exist');
    });
  });
});