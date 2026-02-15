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
        cy.userCreateEventNewError('', event.date, event.location, event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-name-error"]')
          .should('exist')
          .should('contain', 'Event name is required')
          .and('be.visible');
      });

      it(`should error out with no event date`, () => {
        cy.userCreateEventNewError(event.name, '', event.location, event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-date-error"]')
          .should('exist')
          .should('contain', 'date is required')
          .and('be.visible');
      });

      it(`should error out with event date that already passed`, () => {
        cy.userCreateEventNewError(event.name, '2025-01-01', event.location, event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-date-error"]')
          .should('exist')
          .should('contain', 'Event date cannot be in the past')
          .and('be.visible');
      });

      it(`should error out with no event location`, () => {
        cy.userCreateEventNewError(event.name, event.date, '', event.type, event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-location-error"]')
          .should('exist')
          .should('contain', 'Event location type is required')
          .and('be.visible');
      });

      it(`should error out with no event type`, () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, '', event.guestCount, event.budget, event.description);

        cy.get('[data-cy="eventform-type-error"]')
          .should('exist')
          .should('contain', 'Event type is required')
          .and('be.visible');
      });

      it(`should error out with no event guest count`, () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, '', event.budget, event.description);

        cy.get('[data-cy="eventform-guestCount-error"]')
          .should('exist')
          .should('contain', 'Event guest count is required')
          .and('be.visible');
      });

      it(`should error out with no event budget`, () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, event.guestCount, '', event.description);

        cy.get('[data-cy="eventform-budget-error"]')
          .should('exist')
          .should('contain', 'Event budget is required')
          .and('be.visible');
      });

      it(`should error out with invalid budget`, () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, event.guestCount, '10000', event.description);

        cy.get('[data-cy="eventform-budget-error"]')
          .should('exist')
          .should('contain', 'Event budget must be at least')
          .and('be.visible');
      });

      it(`should error out with no event description`, () => {
        cy.userCreateEventNewError(event.name, event.date, event.location, event.type, event.guestCount, event.budget, '');

        cy.get('[data-cy="eventform-description-error"]')
          .should('exist')
          .should('contain', 'Event description is required')
          .and('be.visible');
      });

      it(`should create new event`, () => {
        cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');

      });

      it(`should cancel creating new event`, () => {
        cy.eventlistToNewEventForm();

        cy.userCancelEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
      });
    });

    describe(`User Editing Existing Event`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(userEmail, userPassword, userPassword)
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');

        cy.userLogout();

        cy.landingToLogin();
        cy.adminLogin(adminEmail, adminPassword);

        cy.adminAcceptEventNew();

        cy.userLogout();

        cy.landingToLogin();
        cy.userLogin(userEmail, userPassword);
      });

      it(`should error out with event name removed`, () => {
        cy.userSaveEventUpdateError({
          name: '',
        });
      });

      it(`should error out with event date removed`, () => {
        cy.userSaveEventUpdateError({
          date: '',
        });
      });

      it(`should error out with event date that already passed`, () => {
        cy.userSaveEventUpdateError({
          date: '2025-01-01',
        });
      });

      it(`should error out with event guest count removed`, () => {
        cy.userSaveEventUpdateError({
          guestCount: '',
        });
      });

      it(`should error out with event guest count is zero`, () => {
        cy.userSaveEventUpdateError({
          guestCount: '0',
        });
      });

      it(`should error out with event budget removed`, () => {
        cy.userSaveEventUpdateError({
          budget: '',
        });
      });

      it(`should error out with invalid budget update`, () => {
        cy.userSaveEventUpdateError({
          budget: '49999',
        });
      });

      it(`should error out with event description removed`, () => {
        cy.userSaveEventUpdateError({
          description: ''
        });
      });

      it(`should update existing event`, () => {
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

      it(`should cancel upddating existing event`, () => {
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

    describe(`User Submitting Event Cancellation Request`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(userEmail, userPassword, userPassword)
        cy.eventlistToNewEventForm();
        
        // create 3 new events
        Cypress._.times(3, () => {
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
        });

        cy.userLogout();

        cy.landingToLogin();
        cy.adminLogin(adminEmail, adminPassword);

        Cypress._.times(3, () => {
          cy.adminAcceptEventNew()
        });

        cy.userLogout();

        cy.landingToLogin();
        cy.userLogin(userEmail, userPassword);
      });

      it(`should error out with no comment`, () => {
        cy.userSubmitEventCancelError();
      });

      it(`should submit event cancel request`, () => {
        cy.userSubmitEventCancel();
      });

      it(`should cancel submiting event cancel request`, () => {
        cy.userCancelEventCancel();
      });
    });

    describe(`User Event Mgmt End-to-End`, () => {
      describe(`Event Lifecycle - Cancel New Event Creation Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(userEmail, userPassword);
        });

        it(`should track counts through user cancels creating event flow`, () => {
          // Step 1: Start with clean slate
          cy.userGetAllFilterCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
            expect(initial['Submitted']).to.equal(0);
            expect(initial['In Progress']).to.equal(0);
            expect(initial['Completed']).to.equal(0);
            expect(initial['Cancelled']).to.equal(0);
          });

          // Step 2: User cancels creating event
          cy.userCancelEventNew();

          cy.userGetAllFilterCounts().then((afterCancelCreating) => {
            expect(afterCancelCreating['All']).to.equal(0, 'All should be 0 after event was not created');
            expect(afterCancelCreating['Submitted']).to.equal(0, 'Submitted should be 0 after event was not created');
            expect(afterCancelCreating['In Progress']).to.equal(0, 'In Progress should be 0');
            expect(afterCancelCreating['Completed']).to.equal(0, 'Completed should be 0');
            expect(afterCancelCreating['Cancelled']).to.equal(0, 'Cancelled should be 0');
          });
        });
      });

      describe(`Event Lifecycle - Submit Cancel Event Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(userEmail, userPassword);
        });

        it(`should track counts through user creates event -> admin accepts -> user submits cancel request -> admin approve flow`, () => {
          // Step 1: Start with clean slate
          cy.userGetAllFilterCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
            expect(initial['Submitted']).to.equal(0);
            expect(initial['In Progress']).to.equal(0);
            expect(initial['Completed']).to.equal(0);
            expect(initial['Cancelled']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userCreateEventNew();

          cy.userGetAllFilterCounts().then((afterCreate) => {
            expect(afterCreate['All']).to.equal(1);
            expect(afterCreate['Submitted']).to.equal(1);
            expect(afterCreate['In Progress']).to.equal(0);
            expect(afterCreate['Completed']).to.equal(0);
            expect(afterCreate['Cancelled']).to.equal(0);
          });

          // Step 3: Admin accepts event
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(adminEmail, adminPassword);
          cy.adminAcceptEventNew();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(userEmail, userPassword);

          cy.userGetAllFilterCounts().then((afterAccept) => {
            expect(afterAccept['All']).to.equal(1);
            expect(afterAccept['Submitted']).to.equal(0);
            expect(afterAccept['In Progress']).to.equal(1);
            expect(afterAccept['Completed']).to.equal(0);
            expect(afterAccept['Cancelled']).to.equal(0);
          });

          // Step 4: User submits cancel request
          cy.userSubmitEventCancel();

          cy.userGetAllFilterCounts().then((afterSubmit) => {
            expect(afterSubmit['All']).to.equal(1);
            expect(afterSubmit['Submitted']).to.equal(0);
            expect(afterSubmit['In Progress']).to.equal(1);
            expect(afterSubmit['Completed']).to.equal(0);
            expect(afterSubmit['Cancelled']).to.equal(0);
          });

          // Step 5: User views event with pending request
          cy.userViewEvent();

          cy.userGetAllFilterCounts().then((afterSubmit) => {
            expect(afterSubmit['All']).to.equal(1);
            expect(afterSubmit['Submitted']).to.equal(0);
            expect(afterSubmit['In Progress']).to.equal(1);
            expect(afterSubmit['Completed']).to.equal(0);
            expect(afterSubmit['Cancelled']).to.equal(0);
          });

          // Step 6: Admin accepts cancel request
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(adminEmail, adminPassword);

          cy.adminAcceptEventCancel();
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(userEmail, userPassword);

          cy.userGetAllFilterCounts().then((afterAccept) => {
            expect(afterAccept['All']).to.equal(1);
            expect(afterAccept['Submitted']).to.equal(0);
            expect(afterAccept['In Progress']).to.equal(0);
            expect(afterAccept['Completed']).to.equal(0);
            expect(afterAccept['Cancelled']).to.equal(1);
          });

          // Step 7: User views event cancelled
          cy.userViewEvent();
          cy.userGetAllFilterCounts().then((afterAccept) => {
            expect(afterAccept['All']).to.equal(1);
            expect(afterAccept['Submitted']).to.equal(0);
            expect(afterAccept['In Progress']).to.equal(0);
            expect(afterAccept['Completed']).to.equal(0);
            expect(afterAccept['Cancelled']).to.equal(1);
          });
        });
      });

      describe(`Event Lifecycle - Accept Complete Event Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(userEmail, userPassword);
        });

        it(`should track counts through user creates event -> admin accepts -> user updates event -> admin submits complete request -> user approves complete flow`, () => {
          // Step 1: Start with clean slate
          cy.userGetAllFilterCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
            expect(initial['Submitted']).to.equal(0);
            expect(initial['In Progress']).to.equal(0);
            expect(initial['Completed']).to.equal(0);
            expect(initial['Cancelled']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userCreateEventNew();

          cy.userGetAllFilterCounts().then((afterCreate) => {
            expect(afterCreate['All']).to.equal(1);
            expect(afterCreate['Submitted']).to.equal(1);
            expect(afterCreate['In Progress']).to.equal(0);
            expect(afterCreate['Completed']).to.equal(0);
            expect(afterCreate['Cancelled']).to.equal(0);
          });

          // Step 3: Admin accepts event
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(adminEmail, adminPassword);
          cy.adminAcceptEventNew();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(userEmail, userPassword);

          cy.userGetAllFilterCounts().then((afterAccept) => {
            expect(afterAccept['All']).to.equal(1);
            expect(afterAccept['Submitted']).to.equal(0);
            expect(afterAccept['In Progress']).to.equal(1);
            expect(afterAccept['Completed']).to.equal(0);
            expect(afterAccept['Cancelled']).to.equal(0);
          });

          // Step 4: User updates events
          cy.userSaveEventUpdate({
            name: 'This event title is updated',
            date: '2026-12-31',
            location: 'Garden Estate',
            type: 'Birthday',
            guestCount: '175',
            budget: '125000',
            description: 'Scrap the previous note. Here is the updated version of it. Let me know if you got any question.'
          });

          cy.userGetAllFilterCounts().then((afterUpdate) => {
            expect(afterUpdate['All']).to.equal(1);
            expect(afterUpdate['Submitted']).to.equal(0);
            expect(afterUpdate['In Progress']).to.equal(1);
            expect(afterUpdate['Completed']).to.equal(0);
            expect(afterUpdate['Cancelled']).to.equal(0);
          });

          // Step 5: Admin submits complete request
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(adminEmail, adminPassword);
          cy.adminSubmitEventComplete();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(userEmail, userPassword);

          cy.userGetAllFilterCounts().then((afterSubmit) => {
            expect(afterSubmit['All']).to.equal(1);
            expect(afterSubmit['Submitted']).to.equal(0);
            expect(afterSubmit['In Progress']).to.equal(1);
            expect(afterSubmit['Completed']).to.equal(0);
            expect(afterSubmit['Cancelled']).to.equal(0);
          });

          // Step 6: User views event with pending request
          cy.userViewEvent();

          cy.userGetAllFilterCounts().then((afterSubmit) => {
            expect(afterSubmit['All']).to.equal(1);
            expect(afterSubmit['Submitted']).to.equal(0);
            expect(afterSubmit['In Progress']).to.equal(1);
            expect(afterSubmit['Completed']).to.equal(0);
            expect(afterSubmit['Cancelled']).to.equal(0);
          });

          // Steps 7: User accepts compelte request
          cy.userAcceptEventComplete();

          cy.userGetAllFilterCounts().then((afterComplete) => {
            expect(afterComplete['All']).to.equal(1);
            expect(afterComplete['Submitted']).to.equal(0);
            expect(afterComplete['In Progress']).to.equal(0);
            expect(afterComplete['Completed']).to.equal(1);
            expect(afterComplete['Cancelled']).to.equal(0);
          });

          // Step 8: User views event completed
          cy.userViewEvent();

          cy.userGetAllFilterCounts().then((afterComplete) => {
            expect(afterComplete['All']).to.equal(1);
            expect(afterComplete['Submitted']).to.equal(0);
            expect(afterComplete['In Progress']).to.equal(0);
            expect(afterComplete['Completed']).to.equal(1);
            expect(afterComplete['Cancelled']).to.equal(0);
          });
        });
      });
    });
  });

  describe(`User with Mock Event Seeding`, () => {
    before(() => {
      cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(userEmail, userPassword);
    });

    it(`should display 1 event from user`, () => {
      // Step 1: Start with clean slate
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(0);
        expect(initial['Submitted']).to.equal(0);
        expect(initial['In Progress']).to.equal(0);
        expect(initial['Completed']).to.equal(0);
        expect(initial['Cancelled']).to.equal(0);
      });

      // Step 2: User creates event
      cy.eventlistToNewEventForm();
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')

      // Step 3: Verify Submitted
      cy.userGetAllFilterCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(1, 'All should be 1 after event created');
        expect(afterCreate['Submitted']).to.equal(1, 'Submitted should be 1');
        expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0');
        expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0');
        expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0');
      });
    });

    it(`should display 30 mock events from user`, () => {
      // Step 1: Verify user view first
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(1);
        expect(initial['Submitted']).to.equal(1);
        expect(initial['In Progress']).to.equal(0);         
        expect(initial['Completed']).to.equal(0);
        expect(initial['Cancelled']).to.equal(0);
      });
      
      // Step 2: User seeds 30 mock events
      cy.devAddMockEvents();
      cy.wait(500);

      // Step 3: Verify user view updated correctly
      cy.userGetAllFilterCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(31, 'Admin should see 31 total events');
        expect(afterCreate['Submitted']).to.equal(9, 'Admin should see 9 in review');
        expect(afterCreate['In Progress']).to.equal(12, 'Admin should see 12 in progress');
        expect(afterCreate['Completed']).to.equal(6, 'Admin should see 6 completed');
        expect(afterCreate['Cancelled']).to.equal(4, 'Admin should see 4 cancelled');
      });
    });

    it(`should not display 30 mock events from admin`, () => {
      // Step 1: Verify user view first
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
        expect(initial['Submitted']).to.equal(9);
        expect(initial['In Progress']).to.equal(12);
        expect(initial['Completed']).to.equal(6);
        expect(initial['Cancelled']).to.equal(4);
      });

      // Step 2: Admin seeds 30 mock events
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(adminEmail, adminPassword);

      cy.devAddMockEvents();
      cy.wait(500);

      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(userEmail, userPassword);

      // Step 3: Verify user view not update
      cy.userGetAllFilterCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(31, 'Admin should see 31 total events');
        expect(afterCreate['Submitted']).to.equal(9, 'Admin should see 9 in review');
        expect(afterCreate['In Progress']).to.equal(12, 'Admin should see 12 in progress');
        expect(afterCreate['Completed']).to.equal(6, 'Admin should see 6 completed');
        expect(afterCreate['Cancelled']).to.equal(4, 'Admin should see 4 cancelled');
      });
    });

    it(`should clear user's mock events, leaving the 1 event created by the user`, () => {
      // Step 1: Verify user view first
      cy.userGetAllFilterCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
        expect(initial['Submitted']).to.equal(9);
        expect(initial['In Progress']).to.equal(12);
        expect(initial['Completed']).to.equal(6);
        expect(initial['Cancelled']).to.equal(4);
      });

      // Step 2: User clears 30 mock events
      cy.devClearMockEvents();
      cy.wait(500);
      
      // Step 3: Verify user view updated correctly
      cy.userGetAllFilterCounts().then((afterClear) => {
        expect(afterClear['All']).to.equal(1, 'All should be 1 after admin clears the mock events.');
        expect(afterClear['Submitted']).to.equal(1, 'Submitted should be 1 after admin clears the mock events.');
        expect(afterClear['In Progress']).to.equal(0, 'In Progress should be 0 after admin clears the mock events.');
        expect(afterClear['Completed']).to.equal(0, 'Completed should be 0 after admin clears the mock events.');
        expect(afterClear['Cancelled']).to.equal(0, 'Cancelled should be 0 after admin clears the mock events.');
      });
    });

    it(`should still display 30 mock events from admin if login as admin`, () => {
      // Step 1: Verify admin view first
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(adminEmail, adminPassword);

      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
        expect(initial['Submitted']).to.equal(9);
        expect(initial['In Progress']).to.equal(12);
        expect(initial['Completed']).to.equal(6);
        expect(initial['Cancelled']).to.equal(4);
      });

      // Step 2: Admin clears 30 mock events
      cy.devClearMockEvents();
      cy.wait(500);

      // Step 3: Verify admin view updated correctly
      cy.adminGetAllStatusCounts().then((afterClear) => {
        expect(afterClear['All']).to.equal(1, 'All should be 1 after admin clears the mock events.');
        expect(afterClear['Submitted']).to.equal(1, 'Submitted should be 1 after admin clears the mock events.');
        expect(afterClear['In Progress']).to.equal(0, 'In Progress should be 0 after admin clears the mock events.');
        expect(afterClear['Completed']).to.equal(0, 'Completed should be 0 after admin clears the mock events.');
        expect(afterClear['Cancelled']).to.equal(0, 'Cancelled should be 0 after admin clears the mock events.');
      });
    });
  });

});