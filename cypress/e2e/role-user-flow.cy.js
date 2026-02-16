describe('User Experience Flow', () => {
  const admin = {
    email: 'admin@cypressifier.com',
    password: 'admin123'
  };

  const user = {
    email: 'jane.doe@example.com',
    password: 'user123'
  };

  const event = {
    name: 'Just a test event',
    date: '2026-06-28',
    location: 'Castle',
    type: 'Other',
    guestCount: '15',
    budget: '125000',
    description: 'Just a description for a test event.'
  };

  describe('User Authentication', () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it('should navigate to signup page', () => {
      cy.landingToSignup();
    });

    it('should error with no email', () => {
      cy.userSignupError('', user.password, user.password);
      cy.get('[data-cy="signup-email-error"]')
        .should('contain', 'Email is required');
    });

    it('should error with invalid email format', () => {
      cy.userSignupError('invalid@email', user.password, user.password);
      cy.get('[data-cy="signup-email-error"]')
        .should('contain', 'Please enter a valid email address');
    });

    it('should error with no password', () => {
      cy.userSignupError(user.email, '', '');
      cy.get('[data-cy="signup-password-error"]')
        .should('contain', 'Password is required');
    });

    it('should error with short password', () => {
      cy.userSignupError(user.email, 'short', 'short');
      cy.get('[data-cy="signup-password-error"]')
        .should('contain', 'Password must be at least 6 characters');
    });

    it('should error with no password confirmation', () => {
      cy.userSignupError(user.email, user.password, '');
      cy.get('[data-cy="signup-confirm-password-error"]')
        .should('contain', 'Please confirm your password');
    });

    it('should error with mismatched password confirmation', () => {
      cy.userSignupError(user.email, user.password, '123user');
      cy.get('[data-cy="signup-confirm-password-error"]')
        .should('contain', 'Passwords do not match');
    });

    it('should signup successfully', () => {
      cy.userSignup(user.email, user.password, user.password);
    });

    it('should logout successfully', () => {
      cy.userLogout();
    });

    it('should error with existing admin email', () => {
      cy.landingToSignup();
      cy.userSignupError(admin.email, user.password, user.password);
      cy.get('[data-cy="signup-email-error"]')
        .should('contain', 'User already exists. Please login.');
    });

    it('should error with existing user email', () => {
      cy.userSignupError(user.email, user.password, user.password);
      cy.get('[data-cy="signup-email-error"]')
        .should('contain', 'User already exists. Please login.');
    });

    it('should navigate to login page', () => {
      cy.signupToLogin();
    });

    it('should error with no email on login', () => {
      cy.userLoginError('', user.password);
    });

    it('should error with invalid email format on login', () => {
      cy.userLoginError('invalid@email', user.password);
    });

    it('should error with non-existing email', () => {
      cy.userLoginError('nonexisting@gmeta.com', user.password);
    });

    it('should error with no password on login', () => {
      cy.userLoginError(user.email, '');
    });

    it('should error with short password on login', () => {
      cy.userLoginError(user.email, 'short');
    });

    it('should error with incorrect password', () => {
      cy.userLoginError(user.email, '123user');
    });

    it('should login successfully', () => {
      cy.userLogin(user.email, user.password);
    });

    it('should logout successfully after login', () => {
      cy.userLogout();
    });
  });

  describe('User Event Management', () => {
    describe('Creating New Events', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password);
      });

      it('should navigate to new event form', () => {
        cy.eventlistToNewEventForm();
      });

      it('should error with no event name', () => {
        cy.userCreateEventNewError('', event.date, event.location, event.type, event.guestCount, event.budget, event.description);
        cy.get('[data-cy="eventform-name-error"]')
          .should('contain', 'Event name is required');
      });

      it('should error with no event date', () => {
        cy.userCreateEventNewError(event.name, '', event.location, event.type, event.guestCount, event.budget, event.description);
        cy.get('[data-cy="eventform-date-error"]')
          .should('contain', 'date is required');
      });

      it('should error with past event date', () => {
        cy.userCreateEventNewError(event.name, '2025-01-01', event.location, event.type, event.guestCount, event.budget, event.description);
        cy.get('[data-cy="eventform-date-error"]')
          .should('contain', 'Event date cannot be in the past');
      });

      it('should error with no event location', () => {
        cy.userCreateEventNewError(event.name, event.date, '', event.type, event.guestCount, event.budget, event.description);
        cy.get('[data-cy="eventform-location-error"]')
          .should('contain', 'Event location type is required');
      });

      it('should error with no event type', () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, '', event.guestCount, event.budget, event.description);
        cy.get('[data-cy="eventform-type-error"]')
          .should('contain', 'Event type is required');
      });

      it('should error with no guest count', () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, '', event.budget, event.description);
        cy.get('[data-cy="eventform-guestCount-error"]')
          .should('contain', 'Event guest count is required');
      });

      it('should error with no budget', () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, event.guestCount, '', event.description);
        cy.get('[data-cy="eventform-budget-error"]')
          .should('contain', 'Event budget is required');
      });

      it('should error with budget below minimum', () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, event.guestCount, '10000', event.description);
        cy.get('[data-cy="eventform-budget-error"]')
          .should('contain', 'Event budget must be at least');
      });

      it('should error with no description', () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, event.guestCount, event.budget, '');
        cy.get('[data-cy="eventform-description-error"]')
          .should('contain', 'Event description is required');
      });

      it('should create new event successfully', () => {
        cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
      });

      it('should cancel creating new event', () => {
        cy.eventlistToNewEventForm();
        cy.userCancelEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
      });
    });

    describe('Editing Existing Events', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password);
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
      });

      it('should error when removing event name', () => {
        cy.userSaveEventUpdateError({ name: '' });
      });

      it('should error when removing event date', () => {
        cy.userSaveEventUpdateError({ date: '' });
      });

      it('should error with past event date', () => {
        cy.userSaveEventUpdateError({ date: '2025-01-01' });
      });

      it('should error when removing guest count', () => {
        cy.userSaveEventUpdateError({ guestCount: '' });
      });

      it('should error with zero guest count', () => {
        cy.userSaveEventUpdateError({ guestCount: '0' });
      });

      it('should error when removing budget', () => {
        cy.userSaveEventUpdateError({ budget: '' });
      });

      it('should error with budget below minimum', () => {
        cy.userSaveEventUpdateError({ budget: '49999' });
      });

      it('should error when removing description', () => {
        cy.userSaveEventUpdateError({ description: '' });
      });

      it('should update event successfully', () => {
        cy.userSaveEventUpdate({
          name: 'This event title is updated',
          date: '2026-12-31',
          location: 'Garden Estate',
          type: 'Birthday',
          guestCount: '175',
          budget: '125000',
          description: 'Scrap the previous note. Here is the updated version of it. Let me know if you got any question.'
        });
      });

      it('should cancel updating event', () => {
        cy.userCancelEventUpdate({
          name: 'This event title is updated for the 2nd time',
          date: '2026-05-23',
          location: 'Historic Abbey',
          type: 'Anniversary',
          guestCount: '65',
          budget: '250000',
          description: 'Scrap the previous note. Here is the updated version of it. Let me know if you got any question.'
        });
      });
    });

    describe('Submitting Event Cancellation Requests', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password);
        cy.eventlistToNewEventForm();

        Cypress._.times(3, () => {
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
        });

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);

        Cypress._.times(3, () => {
          cy.adminAcceptEventNew();
        });

        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
      });

      it('should error with no cancellation reason', () => {
        cy.userSubmitEventCancelError();
      });

      it('should submit cancellation request successfully', () => {
        cy.userSubmitEventCancel();
      });

      it('should cancel submitting cancellation request', () => {
        cy.userCancelEventCancel();
      });
    });

    describe('Reviewing Event Completion Requests', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password);
        cy.eventlistToNewEventForm();

        Cypress._.times(3, () => {
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
        });

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);

        Cypress._.times(3, () => {
          cy.adminAcceptEventNew();
        });

        Cypress._.times(3, () => {
          cy.adminSubmitEventComplete();
        });

        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
      });

      it('should error with no comment', () => {
        cy.userAcceptEventCompleteError();
      });

      it('should accept completion request successfully', () => {
        cy.userAcceptEventComplete();
      });

      it('should reject completion request successfully', () => {
        cy.userRejectEventComplete();
      });

      it('should return without taking action', () => {
        cy.userConsiderEventComplete();
      });
    });

    describe('Viewing Events', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password);

        // Event 1: Submitted
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();

        // Event 2: In Progress with Pending Cancellation
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
        cy.userSubmitEventCancel();

        // Event 3: In Progress with Reviewing Completion
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew();
        cy.adminSubmitEventComplete();

        // Event 4: Completed
        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew();
        cy.adminSubmitEventComplete();

        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
        cy.userAcceptEventComplete();

        // Event 5: Cancelled
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminRejectEventNew();

        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
      });

      it('should view submitted event', () => {
        cy.userViewEvent('Submitted');
      });

      it('should view in progress event with pending cancellation', () => {
        cy.userViewEvent('In Progress', 'Pending Cancellation');
      });

      it('should view in progress event with reviewing completion', () => {
        cy.userViewEvent('In Progress', 'Reviewing Completion');
      });

      it('should view completed event', () => {
        cy.userViewEvent('Completed');
      });

      it('should view cancelled event', () => {
        cy.userViewEvent('Cancelled');
      });
    });

    describe('Event Lifecycle End-to-End', () => {
      describe('Cancel New Event Creation Flow', () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
        });

        it('should maintain zero count when canceling event creation', () => {
          // Step 1: Start with clean slate
          cy.userGetAllFilterCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User cancels creating event
          cy.userCancelEventNew();

          cy.userGetAllFilterCounts().then((after) => {
            expect(after['All']).to.equal(0);
            expect(after['Submitted']).to.equal(0);
          });
        });
      });

      describe('Submit and Cancel Event Flow', () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
        });

        it('should track counts through create -> accept -> cancel request -> approve cancellation flow', () => {
          // Step 1: Start with clean slate
          cy.userGetAllFilterCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew();

          cy.userGetAllFilterCounts().then((after) => {
            expect(after['Submitted']).to.equal(1);
          });

          // Step 3: Admin accepts event
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventNew();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

          cy.userGetAllFilterCounts().then((after) => {
            expect(after['In Progress']).to.equal(1);
          });

          // Step 4: User submits cancel request
          cy.userSubmitEventCancel();

          // Step 5: User views event with pending request
          cy.userViewEvent('In Progress', 'Pending Cancellation');

          // Step 6: Admin accepts cancel request
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventCancel();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

          cy.userGetAllFilterCounts().then((after) => {
            expect(after['Cancelled']).to.equal(1);
          });

          // Step 7: User views cancelled event
          cy.userViewEvent('Cancelled');
        });
      });

      describe('Complete Event Flow', () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
        });

        it('should track counts through create -> accept -> update -> complete request -> approve completion flow', () => {
          // Step 1: Start with clean slate
          cy.userGetAllFilterCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userCreateEventNew();

          // Step 3: Admin accepts event
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventNew();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

          // Step 4: User updates event
          cy.userSaveEventUpdate({
            name: 'This event title is updated',
            date: '2026-12-31',
            location: 'Garden Estate',
            type: 'Birthday',
            guestCount: '175',
            budget: '125000',
            description: 'Scrap the previous note. Here is the updated version.'
          });

          // Step 5: Admin submits complete request
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminSubmitEventComplete();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

          // Step 6: User views event with pending request
          cy.userViewEvent('In Progress', 'Reviewing Completion');

          // Step 7: User accepts complete request
          cy.userAcceptEventComplete();

          cy.userGetAllFilterCounts().then((after) => {
            expect(after['Completed']).to.equal(1);
          });

          // Step 8: User views completed event
          cy.userViewEvent('Completed');
        });
      });
    });
  });

  describe('Mock Event Seeding', () => {
    before(() => {
      cy.clearCacheLoadLanding();
      cy.landingToSignup();
      cy.userSignup(user.email, user.password);
    });

    it('should display single user-created event', () => {
      // Step 1: Start with clean slate
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(0);
      });

      // Step 2: User creates event
      cy.eventlistToNewEventForm();
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');

      // Step 3: Verify count
      cy.userGetAllFilterCounts().then((after) => {
        expect(after['All']).to.equal(1);
        expect(after['Submitted']).to.equal(1);
      });
    });

    it('should display 30 mock events when seeded', () => {
      // Step 1: Verify current count
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(1);
      });

      // Step 2: User seeds 30 mock events
      cy.devAddMockEvents();
      cy.wait(500);

      // Step 3: Verify updated count
      cy.userGetAllFilterCounts().then((after) => {
        expect(after['All']).to.equal(31);
        expect(after['Submitted']).to.equal(9);
        expect(after['In Progress']).to.equal(12);
        expect(after['Completed']).to.equal(6);
        expect(after['Cancelled']).to.equal(4);
      });
    });

    it('should not display admin-seeded mock events', () => {
      // Step 1: Verify user current count
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
      });

      // Step 2: Admin seeds 30 mock events
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
      cy.devAddMockEvents();
      cy.wait(500);

      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);

      // Step 3: Verify user count unchanged
      cy.userGetAllFilterCounts().then((after) => {
        expect(after['All']).to.equal(31);
      });
    });

    it('should clear user mock events while preserving user-created event', () => {
      // Step 1: Verify current count
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
      });

      // Step 2: User clears mock events
      cy.devClearMockEvents();
      cy.wait(500);

      // Step 3: Verify only user-created event remains
      cy.userGetAllFilterCounts().then((after) => {
        expect(after['All']).to.equal(1);
        expect(after['Submitted']).to.equal(1);
      });
    });

    it('should show admin mock events persist after user clears', () => {
      // Step 1: Verify admin view
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);

      cy.adminGetAllStatusCounts().then((after) => {
        expect(after['All']).to.equal(31);
      });

      // Step 2: Admin clears mock events
      cy.devClearMockEvents();
      cy.wait(500);

      // Step 3: Verify only user-created event remains
      cy.adminGetAllStatusCounts().then((after) => {
        expect(after['All']).to.equal(1);
      });
    });
  });
});