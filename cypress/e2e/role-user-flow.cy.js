describe(`User Experience Flow`, () => {
  // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';

    const event = {
      'name': 'Just a test event',
      'date': '2026-06-28',
      'location': 'Castle',
      'type': 'Other',
      'guestCount': '15',
      'budget': '125000',
      'description': 'Jsut a description for a test event.'
    };

  describe(`User Auth.`, () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it(`should navigate to /signup`, () => {
      cy.landingToSignup();
    });

    it(`should error out with no email`, () => {
      cy.userSignupError('', userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'Email is required')
      .and('be.visible');
    });

    it(`should error out with an invalid email`, () => {
      cy.userSignupError('invalid@email', userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'Please enter a valid email address')
      .and('be.visible');
    });

    it(`should error out with no password`, () => {
      cy.userSignupError(userEmail, '', '');

      cy.get('[data-cy="signup-password-error"]')
      .should('exist')
      .should('contain', 'Password is required')
      .and('be.visible');
    });

    it(`should error out with an invalid password`, () => {
      cy.userSignupError(userEmail, 'short', 'short');

      cy.get('[data-cy="signup-password-error"]')
      .should('exist')
      .should('contain', 'Password must be at least 6 characters')
      .and('be.visible');
    });

    it(`should error out with no confirm password`, () => {
      cy.userSignupError(userEmail, userPassword, '');

      cy.get('[data-cy="signup-confirm-password-error"]')
      .should('exist')
      .should('contain', 'Please confirm your password')
      .and('be.visible');
    });

    it(`should error out with no matching confirm password`, () => {
      cy.userSignupError(userEmail, userPassword, '123user');

      cy.get('[data-cy="signup-confirm-password-error"]')
      .should('exist')
      .should('contain', 'Passwords do not match')
      .and('be.visible');
    });

    it(`should signup as user and navigate to /user/events`, () => {
      cy.userSignup(userEmail, userPassword, userPassword);
    });

    it(`should logout as user and navigate back to /`, () => {
      cy.userLogout();
    });

    it(`should error out with existing admin email`, () => {
      cy.landingToSignup();
      cy.userSignupError(adminEmail, userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'User already exists. Please login.')
      .and('be.visible');
    });

    it(`should error out with existing user email`, () => {
      cy.userSignupError(adminEmail, userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'User already exists. Please login.')
      .and('be.visible');
    });

    it(`should navigate to /login`, () => {
      cy.signupToLogin();
    });

    it(`should error out with no email`, () => {
      cy.userLoginError('', userPassword);
    });

    it(`should error out with invalid email`, () => {
      cy.userLoginError('invalid@email', userPassword);
    });

    it(`should error out with non-existing email`, () => {
      cy.userLoginError('nonexisting@gmeta.com', userPassword);
    });

    it(`should error out with no password`, () => {
      cy.userLoginError(userEmail, '');
    });

    it(`should error out with invalid password`, () => {
      cy.userLoginError(userEmail, 'short');
    });

    it(`should error out with incorrect password`, () => {
      cy.userLoginError(userEmail, '123user');
    });

    it(`should login as user and navigate to /user/events`, () => {
      cy.userLogin(userEmail, userPassword);
    });

    it(`should logout as user and navigate back to /`, () => {
      cy.userLogout();
    });
  });

  describe(`User Event Mgmt.`, () => {
    describe(`User Creating New Event`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(userEmail, userPassword, userPassword)
      });

      it(`should navigate to /user/events/new`, () => {
        cy.eventlistToNewEventForm();
      });

      it(`should error out with no event name`, () => {
        cy.userAddNewEventError('', event.date, event.location, event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-name-error"]')
          .should('exist')
          .should('contain', 'Event name is required')
          .and('be.visible');
      });

      it(`should error out with no event date`, () => {
        cy.userAddNewEventError(event.name, '', event.location, event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-date-error"]')
          .should('exist')
          .should('contain', 'Date is required')
          .and('be.visible');
      });

      it(`should error out with no event location`, () => {
        cy.userAddNewEventError(event.name, event.date, '', event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-location-error"]')
          .should('exist')
          .should('contain', 'Event location type is required')
          .and('be.visible');
      });

      it(`should error out with no event type`, () => {
        cy.userAddNewEventError(event.name, event.date, event.location, '', event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-type-error"]')
          .should('exist')
          .should('contain', 'Event type is required')
          .and('be.visible');
      });

      it(`should error out with no event guest count`, () => {
        cy.userAddNewEventError(event.name, event.date, event.location, event.type, '', event.budget, event.description);

        cy.get('[data-cy="eventform-guestCount-error"]')
          .should('exist')
          .should('contain', 'Event guest count is required')
          .and('be.visible');
      });

      it(`should error out with no event budget`, () => {
        cy.userAddNewEventError(event.name, event.date, event.location, event.type, event.guestCount, '', event.description);

        cy.get('[data-cy="eventform-budget-error"]')
          .should('exist')
          .should('contain', 'Event budget is required')
          .and('be.visible');
      });

      it(`should error out with invalid budget`, () => {
        cy.userAddNewEventError(event.name, event.date, event.location, event.type, event.guestCount, '10000', event.description);

        cy.get('[data-cy="eventform-budget-error"]')
          .should('exist')
          .should('contain', 'Event budget must be at least')
          .and('be.visible');
      });

      it(`should error out with no event description`, () => {
        cy.userAddNewEventError(event.name, event.date, event.location, event.type, event.guestCount, event.budget, '');

        cy.get('[data-cy="eventform-description-error"]')
          .should('exist')
          .should('contain', 'Event description is required')
          .and('be.visible');
      });

      it(`should create new event`, () => {
        cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '');

      });

      it(`should cancel creating new event`, () => {
        cy.eventlistToNewEventForm();

        cy.userCancelNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '');
      });
    });

    describe(`User Editing Existing Event`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(userEmail, userPassword, userPassword)
        cy.eventlistToNewEventForm();
        cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '');

        cy.userLogout();

        cy.landingToLogin();
        cy.adminLogin(adminEmail, adminPassword);

        cy.adminAcceptNewEvent();

        cy.userLogout();

        cy.landingToLogin();
        cy.userLogin(userEmail, userPassword);
      });

      it(`should navigate to /user/events/event_{eventId}/edit`, () => {

        cy.url()
          .should('contain', '/user/events/event')
          .and('contain', '/edit');

        cy.get('[data-cy="eventform"]')
          .should('contain', 'Event Edit')
          .and('be.visible');
      });

      it(`should error out with event name removed`, () => {

      });

      it(`should error out with event date removed`, () => {

      });

      it(`should error out with event location removed`, () => {

      });

      it(`should error out with event type removed`, () => {

      });

      it(`should error out with event guest count removed`, () => {

      });

      it(`should error out with event budget removed`, () => {

      });

      it(`should error out with invalid budget update`, () => {

      });

      it(`should error out with event description removed`, () => {

      });

      it(`should update existing event`, () => {
      });

      it(`should cancel upddating existing event`, () => {

      });
    });

    describe(`User Submitting Event Cancellation Request`, () => {
      before(() => {

      });

      it(`FAILED CASES....cancel request submission error`, () => {

      });

      it(`should submit event cancel request`, () => {

      });

      it(``, () => {

      });

      it(``, () => {

      });
    });

    describe(`User Event Mgmt End-to-End`, () => {
      before(() => {

      });

      it(``, () => {

      });

      it(``, () => {

      });

      it(``, () => {

      });

      it(``, () => {

      });
    });
  });

  describe(`User with Mock Event Seeding`, () => {
    before(() => {

    });

    it(`should display 1 event from user`, () => {

    });

    it(`should display 30 mock events from user`, () => {

    });

    it(`sbould not display 30 mock events from admin`, () => {

    });

    it(`should clear user's mock events, leaving the 1 event created by the user`, () => {

    });

    it(`should still display 30 mock events from admin if login as admin`, () => {

    });
  });

});