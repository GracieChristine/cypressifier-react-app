describe(`User Experience Flow`, () => {
  // Setup variables
  const admin = {
    'email': 'admin@cypressifier.com',
    'password': 'admin123'
  };

  const user = {
    'email': 'jane.doe@example.com',
    'password': 'user123'
  };

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
      cy.userSignupError('', user.password, user.password);

      cy.get('[data-cy="signup-email-error"]')
        .should('exist')
        .should('contain', 'Email is required')
        .and('be.visible');
    });

    it(`should error out with an invalid email`, () => {
      cy.userSignupError('invalid@email', user.password, user.password);

      cy.get('[data-cy="signup-email-error"]')
        .should('exist')
        .should('contain', 'Please enter a valid email address')
        .and('be.visible');
    });

    it(`should error out with no password`, () => {
      cy.userSignupError(user.email, '', '');

      cy.get('[data-cy="signup-password-error"]')
        .should('exist')
        .should('contain', 'Password is required')
        .and('be.visible');
    });

    it(`should error out with an invalid password`, () => {
      cy.userSignupError(user.email, 'short', 'short');

      cy.get('[data-cy="signup-password-error"]')
        .should('exist')
        .should('contain', 'Password must be at least 6 characters')
        .and('be.visible');
    });

    it(`should error out with no confirm password`, () => {
      cy.userSignupError(user.email, user.password, '');

      cy.get('[data-cy="signup-confirm-password-error"]')
        .should('exist')
        .should('contain', 'Please confirm your password')
        .and('be.visible');
    });

    it(`should error out with no matching confirm password`, () => {
      cy.userSignupError(user.email, user.password, '123user');

      cy.get('[data-cy="signup-confirm-password-error"]')
        .should('exist')
        .should('contain', 'Passwords do not match')
        .and('be.visible');
    });

    it(`should signup as user and navigate to /user/events`, () => {
      cy.userSignup(user.email, user.password, user.password);
    });

    it(`should logout as user and navigate back to /`, () => {
      cy.userLogout();
    });

    it(`should error out with existing admin email`, () => {
      cy.landingToSignup();
      cy.userSignupError(admin.email, user.password, user.password);

      cy.get('[data-cy="signup-email-error"]')
        .should('exist')
        .should('contain', 'User already exists. Please login.')
        .and('be.visible');
    });

    it(`should error out with existing user email`, () => {
      cy.userSignupError(admin.email, user.password, user.password);

      cy.get('[data-cy="signup-email-error"]')
        .should('exist')
        .should('contain', 'User already exists. Please login.')
        .and('be.visible');
    });

    it(`should navigate to /login`, () => {
      cy.signupToLogin();
    });

    it(`should error out with no email`, () => {
      cy.userLoginError('', user.password);
    });

    it(`should error out with invalid email`, () => {
      cy.userLoginError('invalid@email', user.password);
    });

    it(`should error out with non-existing email`, () => {
      cy.userLoginError('nonexisting@gmeta.com', user.password);
    });

    it(`should error out with no password`, () => {
      cy.userLoginError(user.email, '');
    });

    it(`should error out with invalid password`, () => {
      cy.userLoginError(user.email, 'short');
    });

    it(`should error out with incorrect password`, () => {
      cy.userLoginError(user.email, '123user');
    });

    it(`should login as user and navigate to /user/events`, () => {
      cy.userLogin(user.email, user.password);
    });

    it(`should logout as user and navigate back to /`, () => {
      cy.userLogout();
    });
  });

  describe(`User Event Mgmt.`, () => {
    describe(`User Creating New Events`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password)
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

    describe(`User Editing Existing Events`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password)
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

    describe(`User Submitting Event Cancellation Requests`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password)
        cy.eventlistToNewEventForm();
        
        // create 3 new events
        Cypress._.times(3, () => {
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
        });

        cy.userLogout();

        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);

        Cypress._.times(3, () => {
          cy.adminAcceptEventNew()
        });

        cy.userLogout();

        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
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

    describe(`User Reviewing Event Completion Requests `, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password)
        cy.eventlistToNewEventForm();
        
        // create 3 new events
        Cypress._.times(3, () => {
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
        });

        cy.userLogout();

        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);

        Cypress._.times(3, () => {
          cy.adminAcceptEventNew()
        });

        Cypress._.times(3, () => {
          cy.adminSubmitEventComplete()
        });

        cy.userLogout();

        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
      });

      it(`should error out with no comment`, () => {
        cy.userAcceptEventCompleteError();
      });

      it(`should accept evnet complete request`, () => {
        cy.userAcceptEventComplete();
      });

      it(`should reject event complete request`, () => {
        cy.userRejectEventComplete();
      });

      it(`should return with no action`, () => {
        cy.userConsiderEventComplete();
      });
    });

    describe(`User Viewing Events`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password, user.password);
        
        // Event 1: Submitted (don't accept this one!)
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();
        
        // Event 2: In Progress with Pending Cancellation
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();
        
        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew(); // Accepts Event 2
        
        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
        cy.userSubmitEventCancel(); // Cancel Event 2
        
        // Event 3: In Progress with Reviewing Completion
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();
        
        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew(); // Accepts Event 3
        cy.adminSubmitEventComplete(); // Request completion for Event 3
        
        // Event 4: Completed
        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();
        
        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminAcceptEventNew(); // Accepts Event 4
        cy.adminSubmitEventComplete(); // Request completion for Event 4
        
        cy.userLogout();
        cy.landingToLogin();
        cy.userLogin(user.email, user.password);
        cy.userAcceptEventComplete(); // Accept completion for Event 4
        
        // Event 5: Cancelled
        cy.eventlistToNewEventForm();
        cy.userCreateEventNew();
        
        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
        cy.adminRejectEventNew(); // Rejects Event 5
        
        // IMPORTANT: Log back in as user for the tests!
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

    describe(`User Event Mgmt. End-to-End`, () => {
      describe(`Event Lifecycle - Cancel New Event Creation Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
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
          cy.userSignup(user.email, user.password);
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
          cy.eventlistToNewEventForm(); // ADD THIS
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
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventNew();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

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
          cy.userViewEvent('In Progress', 'Pending Cancellation');

          cy.userGetAllFilterCounts().then((afterView) => {
            expect(afterView['All']).to.equal(1);
            expect(afterView['Submitted']).to.equal(0);
            expect(afterView['In Progress']).to.equal(1);
            expect(afterView['Completed']).to.equal(0);
            expect(afterView['Cancelled']).to.equal(0);
          });

          // Step 6: Admin accepts cancel request
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventCancel();
          
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

          cy.userGetAllFilterCounts().then((afterCancel) => {
            expect(afterCancel['All']).to.equal(1);
            expect(afterCancel['Submitted']).to.equal(0);
            expect(afterCancel['In Progress']).to.equal(0);
            expect(afterCancel['Completed']).to.equal(0);
            expect(afterCancel['Cancelled']).to.equal(1);
          });

          // Step 7: User views cancelled event
          cy.userViewEvent('Cancelled');

          cy.userGetAllFilterCounts().then((final) => {
            expect(final['All']).to.equal(1);
            expect(final['Submitted']).to.equal(0);
            expect(final['In Progress']).to.equal(0);
            expect(final['Completed']).to.equal(0);
            expect(final['Cancelled']).to.equal(1);
          });
        });
      });

      describe(`Event Lifecycle - Accept Complete Event Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
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
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventNew();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

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
          cy.adminLogin(admin.email, admin.password);
          cy.adminSubmitEventComplete();

          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);

          cy.userGetAllFilterCounts().then((afterSubmit) => {
            expect(afterSubmit['All']).to.equal(1);
            expect(afterSubmit['Submitted']).to.equal(0);
            expect(afterSubmit['In Progress']).to.equal(1);
            expect(afterSubmit['Completed']).to.equal(0);
            expect(afterSubmit['Cancelled']).to.equal(0);
          });

          // Step 6: User views event with pending request
          cy.userViewEvent('In Progress', 'Reviewing Completion');

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
          cy.userViewEvent('Completed');

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
        cy.userSignup(user.email, user.password);
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
      cy.adminLogin(admin.email, admin.password);

      cy.devAddMockEvents();
      cy.wait(500);

      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);

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
      cy.adminLogin(admin.email, admin.password);

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