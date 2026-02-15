describe(``, () => {
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

  describe(`Admin Auth.`, () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it(`should navigate to /login`, () => {
      cy.landingToLogin();
    });

    it(`should error out with no email`, () => {
      cy.userLoginError('', admin.password);
    });

    it(`should error out with invalid email`, () => {
      cy.userLoginError('invalid@email', admin.password);
    });

    it(`should error out with non-existing email`, () => {
      cy.userLoginError('nonexisting@gmeta.com', admin.password);
    });

    it(`should error out with no password`, () => {
      cy.userLoginError(admin.email, '');
    });

    it(`should error out with invalid password`, () => {
      cy.userLoginError(admin.email, 'short');
    });

    it(`should error out with incorrect password`, () => {
    cy.userLoginError(admin.email, '123admin');
    });

    it(`should login as admin and navigate to /admin/dashboard`, () => {
      cy.adminLogin(admin.email, admin.password);
    });

    it(`should logout as admin and navigate back to /`, () => {
      cy.userLogout();
    });
  });

  describe(`Admin Event Mgmt.`, () => {
    describe(`Admin Reviewing New Events`, () => {
      before(() => {
    cy.clearCacheLoadLanding();

    cy.landingToSignup();
      cy.userSignup(user.email, user.password);
      cy.eventlistToNewEventForm();

      // create 3 new events
      Cypress._.times(3, () => {
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
      });

      cy.userLogout();

      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
      });

      it(`should accept new event`, () => {
      cy.adminAcceptEventNew();
      });

      it(`should decline new event`, () => {
      cy.adminRejectEventNew();
      });

      it(`should return with no action`, () => {
      cy.adminConsiderEventNew();
      });
    });

    describe(`Admin Reviewing Event Cancellation Requests`, () => {
      before(() => {
      cy.clearCacheLoadLanding();

      cy.landingToSignup();
      cy.userSignup(user.email, user.password);
      cy.eventlistToNewEventForm();

      // user creates 3 new events
      Cypress._.times(3, () => {
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
      });

      cy.userLogout();

      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);

      // admin accepts 3 new events
      Cypress._.times(3, () => {
      cy.adminAcceptEventNew();
      });

      cy.userLogout();

      cy.landingToLogin();
      cy.userLogin(user.email, user.password);

      // user requests 3 event cancellations
      Cypress._.times(3, () => {
      cy.userSubmitEventCancel();
      });

      cy.userLogout();

      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);

      });

      it(`should approve cancellation request`, () => {
      cy.adminAcceptEventCancel();
      });

      it(`should deny cancellation request`, () => {
      cy.adminRejectEventCancel();
      });

      it(`should return with no action`, () => {
      cy.adminConsiderEventCancel();
      });
    });

    describe(`Admin Submiting Event Completion Requests`, () => {
      before(() => {
      cy.clearCacheLoadLanding();

      cy.landingToSignup();
      cy.userSignup(user.email, user.password);
      cy.eventlistToNewEventForm();

      // user creates 3 new events
      Cypress._.times(3, () => {
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
      });

      cy.userLogout();

      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);

      // admin accepts 3 new events
      Cypress._.times(3, () => {
      cy.adminAcceptEventNew();
      });
      });

      it(`should error out with no commen`, () => {
      cy.adminSubmitEventCompleteError();
      });

      it(`should confirm event completion`, () => {
      cy.adminSubmitEventComplete();
      });

      it(`should return with no action`, () => {
      cy.adminCancelEventComplete();
      });
    });

    // describe(`Admin Viewing Events`, () => {
    //   before(() => {

    //   });

    //   it(``, () => {

    //   });

    //   it(``, () => {

    //   });
    // });

    describe(`Admin Event Mgmt. End-to-End`, () => {
      describe(`Event Lifecycle - Decline New Event Path`, () => {
      before(() => {
        cy.clearCacheLoadLanding();
        cy.landingToSignup();
        cy.userSignup(user.email, user.password);
        cy.userLogout();
        cy.landingToLogin();
        cy.adminLogin(admin.email, admin.password);
      });

      it('should track counts through user creates event -> admin declines flow', () => {
          // Step 1: Start with clean slate
          cy.adminGetAllStatusCounts().then((initial) => {
                expect(initial['All']).to.equal(0);
                expect(initial['Submitted']).to.equal(0);
                expect(initial['In Progress']).to.equal(0);
                expect(initial['Completed']).to.equal(0);
                expect(initial['Cancelled']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
          cy.userLogout();

          // Step 3: Verify Submitted
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminGetAllStatusCounts().then((afterCreate) => {
                expect(afterCreate['All']).to.equal(1, 'All should be 1 after event created');
                expect(afterCreate['Submitted']).to.equal(1, 'Submitted should be 1');
                expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0');
                expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0');
                expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0');
          });

          // Step 4: Admin declines
          cy.adminRejectEventNew();

          // Step 5: Verify Cancelled
          cy.adminGetAllStatusCounts().then((afterDecline) => {
            expect(afterDecline['All']).to.equal(1, 'All should still be 1');
            expect(afterDecline['Submitted']).to.equal(0, 'Submitted should be 0 after decline');
            expect(afterDecline['In Progress']).to.equal(0, 'In Progress should be 0');
            expect(afterDecline['Completed']).to.equal(0, 'Completed should be 0');
            expect(afterDecline['Cancelled']).to.equal(1, 'Cancelled should be 1 after decline');
          });
        });
      });

      describe(`Event Lifecycle - Accept Event Cancel Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
        });

        it('should track counts through user creates event -> admin accepts -> user submits cancel requests -> admin approves flow', () => {
          // Step 1: Start clean
          cy.adminGetAllStatusCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
          cy.userLogout();

          // Step 3: Admin accepts
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventNew();

          cy.adminGetAllStatusCounts().then((afterAccept) => {
            expect(afterAccept['All']).to.equal(1, 'All should be 1');
            expect(afterAccept['Submitted']).to.equal(0, 'Submitted should be 0 after accept');
            expect(afterAccept['In Progress']).to.equal(1, 'In Progress should be 1 after accept');
            expect(afterAccept['Completed']).to.equal(0, 'Completed should be 0');
            expect(afterAccept['Cancelled']).to.equal(0, 'Cancelled should be 0');
          });

          // Step 4: User requests cancellation
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.userSubmitEventCancel();
          cy.userLogout();

          // Step 5: Admin approves cancellation
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventCancel();

          cy.adminGetAllStatusCounts().then((afterCancel) => {
            expect(afterCancel['All']).to.equal(1, 'All should still be 1');
            expect(afterCancel['Submitted']).to.equal(0, 'Submitted should be 0');
            expect(afterCancel['In Progress']).to.equal(0, 'In Progress should be 0 after cancellation');
            expect(afterCancel['Completed']).to.equal(0, 'Completed should be 0');
            expect(afterCancel['Cancelled']).to.equal(1, 'Cancelled should be 1 after cancellation');
          });
        });
      });

      describe(`Event Lifecycle - Submit Complete Event Path`, () => {
        before(() => {
          cy.clearCacheLoadLanding();
          cy.landingToSignup();
          cy.userSignup(user.email, user.password);
          cy.userLogout();
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
        });

        it('should track counts through user creates event -> admin accepts -> user updates event -> admin sees update -> admin submits complete request -> user approves complete flow', () => {
          // Step 1: Start clean
          cy.adminGetAllStatusCounts().then((initial) => {
            expect(initial['All']).to.equal(0);
          });

          // Step 2: User creates event
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.eventlistToNewEventForm();
          cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
          cy.userLogout();

          // Step 3: Admin accepts
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminAcceptEventNew();

          cy.adminGetAllStatusCounts().then((afterAccept) => {
            expect(afterAccept['All']).to.equal(1);
            expect(afterAccept['In Progress']).to.equal(1);
          });

          // Step 4: Admin submit event complete
          cy.adminSubmitEventComplete();

          cy.adminGetAllStatusCounts().then((afterComplete) => {
            expect(afterComplete['All']).to.equal(1, 'All should still be 1');
            expect(afterComplete['Submitted']).to.equal(0, 'Submitted should be 0');
            expect(afterComplete['In Progress']).to.equal(1, 'In Progress should be 1 after sending complete request');
            expect(afterComplete['Completed']).to.equal(0, 'Completed should be 0 after sending complete request');
            expect(afterComplete['Cancelled']).to.equal(0, 'Cancelled should be 0');
          });

          // Step 5: User accepts event completion
          cy.userLogout();
          cy.landingToLogin();
          cy.userLogin(user.email, user.password);
          cy.userAcceptEventComplete();
          cy.userLogout();

          // Step 6: Verify Completed count unchanged
          cy.landingToLogin();
          cy.adminLogin(admin.email, admin.password);
          cy.adminGetAllStatusCounts().then((afterUserAcceptComplete) => {
            expect(afterUserAcceptComplete['All']).to.equal(1, 'All should still be 1');
            expect(afterUserAcceptComplete['Submitted']).to.equal(0, 'Submitted should be 0');
            expect(afterUserAcceptComplete['In Progress']).to.equal(0, 'In Progress should be 0');
            expect(afterUserAcceptComplete['Completed']).to.equal(1, 'Completed should still be 1 after user accepts completion');
            expect(afterUserAcceptComplete['Cancelled']).to.equal(0, 'Cancelled should be 0');
          });
        });
      });
    });
  });

  describe(`Admin with Mock Event Seeding`, () => {
    before(() => {
      cy.clearCacheLoadLanding();
      cy.landingToSignup();
      cy.userSignup(user.email, user.password);
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
    });

    it(`should display 1 event from user`, () => {
      // Step 1: Start with clean slate
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(0);
        expect(initial['Submitted']).to.equal(0);
        expect(initial['In Progress']).to.equal(0);
        expect(initial['Completed']).to.equal(0);
        expect(initial['Cancelled']).to.equal(0);
      });

      // Step 2: User creates event
      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);
      cy.eventlistToNewEventForm();
      cy.userCreateEventNew('', event.date, event.location, event.type, event.guestCount, event.budget, '')
      cy.userLogout();

      // Step 3: Verify Submitted
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
      cy.adminGetAllStatusCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(1, 'All should be 1 after event created');
        expect(afterCreate['Submitted']).to.equal(1, 'Submitted should be 1');
        expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0');
        expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0');
        expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0');
      });
    });

    it(`should display 30 mock events from user`, () => {       
      // Step 1: Verify admin view first
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(1);
        expect(initial['Submitted']).to.equal(1);
        expect(initial['In Progress']).to.equal(0);
        expect(initial['Completed']).to.equal(0);
        expect(initial['Cancelled']).to.equal(0);
      });

      cy.userLogout();
      cy.landingToLogin();
      cy.userLogin(user.email, user.password);
      cy.devAddMockEvents();
      cy.wait(500);
      cy.userLogout();
      cy.landingToLogin();
      cy.adminLogin(admin.email, admin.password);
      
      // Step 3: Verify admin view updated correctly
      cy.adminGetAllStatusCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(31, 'Admin should see 31 total events');
        expect(afterCreate['Submitted']).to.equal(9, 'Admin should see 9 in review');
        expect(afterCreate['In Progress']).to.equal(12, 'Admin should see 12 in progress');
        expect(afterCreate['Completed']).to.equal(6, 'Admin should see 6 completed');
        expect(afterCreate['Cancelled']).to.equal(4, 'Admin should see 4 cancelled');
      });
    });

    it(`should display 30 mock events from admin`, () => {
      // Step 1: Checking current status
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(31);
        expect(initial['Submitted']).to.equal(9);
        expect(initial['In Progress']).to.equal(12);
        expect(initial['Completed']).to.equal(6);
        expect(initial['Cancelled']).to.equal(4);
      });

      // Step 2: Admin loads mock events
      cy.devAddMockEvents();
      cy.wait(500);

      // Step 3: Verify Submitted
      cy.adminGetAllStatusCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(31 + 30, 'All should be 61 after user loads mock events.');
        expect(afterCreate['Submitted']).to.equal(9 + 8, 'Submitted should be 17 after user loads mock events.');
        expect(afterCreate['In Progress']).to.equal(12 + 12, 'In Progress should be 24 after user loads mock events.');
        expect(afterCreate['Completed']).to.equal(6 + 6, 'Completed should be 12 after user loads mock events.');
        expect(afterCreate['Cancelled']).to.equal(4 + 4, 'Cancelled should be 8 after user loads mock events.');
      });
    });

    it(`should clear all mock events, leaving the 1 event created by the user`, () => {
      // Step 1: Checking current status
      cy.adminGetAllStatusCounts().then((initial) => {
        expect(initial['All']).to.equal(61);
        expect(initial['Submitted']).to.equal(17);
        expect(initial['In Progress']).to.equal(24);
        expect(initial['Completed']).to.equal(12);
        expect(initial['Cancelled']).to.equal(8);
      });

      // Step 2: Admin clears mock events
      cy.devClearMockEvents();
      cy.wait(500);

      // Step 3: Verify Submitted
      cy.adminGetAllStatusCounts().then((afterCreate) => {
        expect(afterCreate['All']).to.equal(1, 'All should be 1 after admin clears the mock events.');
        expect(afterCreate['Submitted']).to.equal(1, 'Submitted should be 1 after admin clears the mock events.');
        expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0 after admin clears the mock events.');
        expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0 after admin clears the mock events.');
        expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0 after admin clears the mock events.');
      });
    });   
  });
});