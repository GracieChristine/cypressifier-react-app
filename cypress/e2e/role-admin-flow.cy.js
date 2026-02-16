describe('Admin Experience Flow', () => {
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

  describe('Admin Authentication', () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it('should navigate to login page', () => {
      cy.landingToLogin();
    });

    it('should error with no email', () => {
      cy.userLoginError('', admin.password);
    });

    it('should error with invalid email format', () => {
      cy.userLoginError('invalid@email', admin.password);
    });

    it('should error with non-existing email', () => {
      cy.userLoginError('nonexisting@gmeta.com', admin.password);
    });

    it('should error with no password', () => {
      cy.userLoginError(admin.email, '');
    });

    it('should error with short password', () => {
      cy.userLoginError(admin.email, 'short');
    });

    it('should error with incorrect password', () => {
      cy.userLoginError(admin.email, '123admin');
    });

    it('should login successfully', () => {
      cy.adminLogin(admin.email, admin.password);
    });

    it('should logout successfully', () => {
      cy.userLogout();
    });
  });

  describe('Admin Event Management', () => {
    describe('Reviewing New Event Submissions', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password);
        cy.eventlistToNewEventForm();

        Cypress._.times(3, () => {
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
        });

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
      });

      it('should error with no comment', () => {
        cy.adminAcceptEventNewError();
      });

      it('should accept new event successfully', () => {
        cy.adminAcceptEventNew();
      });

      it('should decline new event successfully', () => {
        cy.adminRejectEventNew();
      });

      it('should return without taking action', () => {
        cy.adminConsiderEventNew();
      });
    });

    describe('Reviewing Event Cancellation Requests', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password);
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

        Cypress._.times(3, () => {
          cy.userSubmitEventCancel();
        });

        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
      });

      it('should error with no comment', () => {
        cy.adminAcceptEventCancelError();
      });

      it('should approve cancellation request successfully', () => {
        cy.adminAcceptEventCancel();
      });

      it('should deny cancellation request successfully', () => {
        cy.adminRejectEventCancel();
      });

      it('should return without taking action', () => {
        cy.adminConsiderEventCancel();
      });
    });

    describe('Submitting Event Completion Requests', () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password);
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
      });

      it('should error with no comment', () => {
        cy.adminSubmitEventCompleteError();
      });

      it('should submit completion request successfully', () => {
        cy.adminSubmitEventComplete();
      });

      it('should return without taking action', () => {
        cy.adminCancelEventComplete();
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

        // Event 2: In Progress with Reviewing Cancellation
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

        // Event 3: In Progress with Pending Completion
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
      });

      it('should view submitted event with Reviewing Event badge', () => {
        cy.adminViewEvent('Submitted', 'Reviewing Event');
      });

      it('should view in progress event with reviewing cancellation badge', () => {
        cy.adminViewEvent('In Progress', 'Reviewing Cancellation');
      });

      it('should view in progress event with pending completion badge', () => {
        cy.adminViewEvent('In Progress', 'Pending Completion');
      });

      it('should view completed event', () => {
        cy.adminViewEvent('Completed');
      });

      it('should view cancelled event', () => {
        cy.adminViewEvent('Cancelled');
      });
    });

    describe('Event Lifecycle End-to-End', () => {
      describe('Decline New Event Flow', () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
        });

        it('should track counts through create -> decline flow', () => {
          // Step 1: Start with clean slate
          cy.adminGetAllStatusCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
          cy.userLogout();

          // Step 3: Admin checks status counts
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);

          cy.adminGetAllStatusCounts().then((after) => {
            expect(after['Submitted']).to.equal(1);
          });

          // Step 4: Admin views new event
          cy.adminViewEvent('Submitted', 'Reviewing Event');

          // Step 5: Admin declines event
          cy.adminRejectEventNew();

          cy.adminGetAllStatusCounts().then((after) => {
            expect(after['Cancelled']).to.equal(1);
          });

          // Step 6: Admin views declined event
          cy.adminViewEvent('Cancelled');
        });
      });

      describe('Accept and Cancel Event Flow', () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
        });

        it('should track counts through create -> accept -> cancel request -> approve cancellation flow', () => {
          // Step 1: Start with clean slate
          cy.adminGetAllStatusCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
          cy.userLogout();

          // Step 3: Admin checks status counts
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);

          // Step 4: Admin views new event
          cy.adminViewEvent('Submitted', 'Reviewing Event');

          // Step 5: Admin accepts event
          cy.adminAcceptEventNew();

          // Step 6: User requests cancellation
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.userSubmitEventCancel();
          cy.userLogout();

          // Step 7: Admin views cancellation request
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);

          cy.adminViewEvent('In Progress', 'Reviewing Cancellation');

          // Step 8: Admin approves cancellation
          cy.adminAcceptEventCancel();

          cy.adminGetAllStatusCounts().then((after) => {
            expect(after['Cancelled']).to.equal(1);
          });

          // Step 9: Admin views cancelled event
          cy.adminViewEvent('Cancelled');
        });
      });

      describe('Complete Event Flow', () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
        });

        it('should track counts through create -> accept -> complete request -> approve completion flow', () => {
          // Step 1: Start with clean slate
          cy.adminGetAllStatusCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
          cy.userLogout();

          // Step 3: Admin checks status counts
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);

          // Step 4: Admin views new event
          cy.adminViewEvent('Submitted', 'Reviewing Event');

          // Step 5: Admin accepts event
          cy.adminAcceptEventNew();

          // Step 6: Admin submits completion request
          cy.adminSubmitEventComplete();

          // Step 7: Admin views pending completion event
          cy.adminViewEvent('In Progress', 'Pending Completion');

          // Step 8: User accepts completion
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.userAcceptEventComplete();
          cy.userLogout();

          // Step 9: Admin verifies completion
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);

          cy.adminGetAllStatusCounts().then((after) => {
            expect(after['Completed']).to.equal(1);
          });

          // Step 10: Admin views completed event
          cy.adminViewEvent('Completed');
        });
      });
    });
  });

  describe('Mock Event Seeding', () => {
    before(() => {
      cy.clearCacheLoadLanding();
      cy.landingToSignup();
      cy.userSignup(user.email, user.password);
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
    });

    it('should display single user-created event', () => {
      // Step 1: Start with clean slate
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(0);
      });

      // Step 2: User creates event
      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);
      cy.eventlistToNewEventForm();
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '');
      cy.userLogout();

      // Step 3: Admin verifies count
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);

      cy.adminGetAllStatusCounts().then((after) => {
        expect(after['All']).to.equal(1);
        expect(after['Submitted']).to.equal(1);
      });
    });

    it('should display 30 user-seeded mock events', () => {
      // Step 1: Verify admin current count
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(1);
      });

      // Step 2: User seeds 30 mock events
      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);
      cy.devAddMockEvents();
      cy.wait(500);
      cy.userLogout();

      // Step 3: Admin verifies updated count
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);

      cy.adminGetAllStatusCounts().then((after) => {
        expect(after['All']).to.equal(31);
        expect(after['Submitted']).to.equal(9);
        expect(after['In Progress']).to.equal(12);
        expect(after['Completed']).to.equal(6);
        expect(after['Cancelled']).to.equal(4);
      });
    });

    it('should display 30 admin-seeded mock events', () => {
      // Step 1: Verify current count
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
      });

      // Step 2: Admin seeds 30 mock events
      cy.devAddMockEvents();
      cy.wait(500);

      // Step 3: Verify updated count
      cy.adminGetAllStatusCounts().then((after) => {
        expect(after['All']).to.equal(61);
        expect(after['Submitted']).to.equal(17);
        expect(after['In Progress']).to.equal(24);
        expect(after['Completed']).to.equal(12);
        expect(after['Cancelled']).to.equal(8);
      });
    });

    it('should clear all mock events while preserving user-created event', () => {
      // Step 1: Verify current count
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(61);
      });

      // Step 2: Admin clears mock events
      cy.devClearMockEvents();
      cy.wait(500);

      // Step 3: Verify only user-created event remains
      cy.adminGetAllStatusCounts().then((after) => {
        expect(after['All']).to.equal(1);
        expect(after['Submitted']).to.equal(1);
      });
    });
  });
});