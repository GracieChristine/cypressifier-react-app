describe(`Admin Experience Flow`, () => {
    // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';

    const event = {
      'name': '',
      'date': '2026-06-28',
      'location': 'Castle',
      'type': 'Other',
      'guestCount': '15',
      'budget': '125000',
      'description': ''
    };

    describe(`Admin Auth.`, () => {
        before(() => {
            cy.clearCacheLoadLanding();
        });

        it(`should navigate to /login`, () => {
            cy.landingToLogin();
        });

        it(`should error out with no email`, () => {
            cy.userLoginError('', adminPassword);
        });

        it(`should error out with invalid email`, () => {
            cy.userLoginError('invalid@email', adminPassword);
        });

        it(`should error out with non-existing email`, () => {
            cy.userLoginError('nonexisting@gmeta.com', adminPassword);
        });

        it(`should error out with no password`, () => {
            cy.userLoginError(adminEmail, '');
        });

        it(`should error out with invalid password`, () => {
            cy.userLoginError(adminEmail, 'short');
        });

        it(`should error out with incorrect password`, () => {
        cy.userLoginError(adminEmail, '123admin');
        });

        it(`should login as admin and navigate to /admin/dashboard`, () => {
            cy.adminLogin(adminEmail, adminPassword);
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
                cy.userSignup(userEmail, userPassword);
                cy.eventlistToNewEventForm();
                
                // create 3 new events
                Cypress._.times(3, () => {
                    cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
                });

                cy.userLogout();

                cy.landingToLogin();
                cy.adminLogin(adminEmail, adminPassword);
            });

            it(`should accept new event`, () => {
                cy.adminAcceptNewEvent();
            });

            it(`should decline new event`, () => {
                cy.adminDeclineNewEvent();
            });

            it(`should return with no action`, () => {
                cy.adminConsiderNewEvent();
            });
        });

        describe(`Admin Reviews Cancellation Requests`, () => {
            before(() => {
                cy.clearCacheLoadLanding();

                cy.landingToSignup();
                cy.userSignup(userEmail, userPassword);
                cy.eventlistToNewEventForm();
                
                // user creates 3 new events
                Cypress._.times(3, () => {
                    cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
                });

                cy.userLogout();

                cy.landingToLogin();
                cy.adminLogin(adminEmail, adminPassword);

                // admin accepts 3 new events
                Cypress._.times(3, () => {
                    cy.adminAcceptNewEvent();
                });

                cy.userLogout();

                cy.landingToLogin();
                cy.userLogin(userEmail, userPassword);

                // user requests 3 event cancellations
                Cypress._.times(3, () => {
                    cy.userSubmitEventCancelRequest();
                });

                cy.userLogout();

                cy.landingToLogin();
                cy.adminLogin(adminEmail, adminPassword);

            });

            it(`should approve cancellation request`, () => {
                cy.adminAcceptEventCancelRequest();
            });

            it(`should deny cancellation request`, () => {
                cy.adminDeclineEventCancelRequest();
            });

            it(`should return with no action`, () => {
                cy.adminConsiderEventCancelRequest();
            });
            
        });

        describe(`Admin Reviews Event Completion`, () => {
            before(() => {
                cy.clearCacheLoadLanding();

                cy.landingToSignup();
                cy.userSignup(userEmail, userPassword);
                cy.eventlistToNewEventForm();
                
                // user creates 3 new events
                Cypress._.times(3, () => {
                    cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
                });

                cy.userLogout();

                cy.landingToLogin();
                cy.adminLogin(adminEmail, adminPassword);

                // admin accepts 3 new events
                Cypress._.times(3, () => {
                    cy.adminAcceptNewEvent();
                });
            });

            it(`should confirm event completion`, () => {
                cy.adminSetEventAsCompleted();
            });

            it(`should return with no action`, () => {
                cy.adminConsiderEventAsCompleted();
            });
        });

        describe(`Admin Event Mgmt End-to-End`, () => {
    
            describe(`Event Lifecycle - Decline New Event Path`, () => {
                before(() => {
                    cy.clearCacheLoadLanding();
                    cy.landingToSignup();
                    cy.userSignup(userEmail, userPassword);
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                });

                it('should track counts through new event -> decline flow', () => {
                    // Step 1: Start with clean slate
                    cy.adminGetAllStatusCounts().then((initial) => {
                        expect(initial['All']).to.equal(0);
                        expect(initial['In Review']).to.equal(0);
                        expect(initial['In Progress']).to.equal(0);
                        expect(initial['Completed']).to.equal(0);
                        expect(initial['Cancelled']).to.equal(0);
                    });

                    // Step 2: User creates event
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.userLogin(userEmail, userPassword);
                    cy.eventlistToNewEventForm();
                    cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
                    cy.userLogout();

                    // Step 3: Verify In Review
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                    cy.adminGetAllStatusCounts().then((afterCreate) => {
                        expect(afterCreate['All']).to.equal(1, 'All should be 1 after event created');
                        expect(afterCreate['In Review']).to.equal(1, 'In Review should be 1');
                        expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0');
                        expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0');
                        expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0');
                    });

                    // Step 4: Admin declines
                    cy.adminDeclineNewEvent();

                    // Step 5: Verify Cancelled
                    cy.adminGetAllStatusCounts().then((afterDecline) => {
                        expect(afterDecline['All']).to.equal(1, 'All should still be 1');
                        expect(afterDecline['In Review']).to.equal(0, 'In Review should be 0 after decline');
                        expect(afterDecline['In Progress']).to.equal(0, 'In Progress should be 0');
                        expect(afterDecline['Completed']).to.equal(0, 'Completed should be 0');
                        expect(afterDecline['Cancelled']).to.equal(1, 'Cancelled should be 1 after decline');
                    });
                });
            });

            describe(`Event Lifecycle - Accept Event Cancellation Request Path`, () => {
                before(() => {
                    cy.clearCacheLoadLanding();
                    cy.landingToSignup();
                    cy.userSignup(userEmail, userPassword);
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                });

                it('should track counts through new event -> accept -> cancel request -> approve flow', () => {
                    // Step 1: Start clean
                    cy.adminGetAllStatusCounts().then((initial) => {
                        expect(initial['All']).to.equal(0);
                    });
                    
                    // Step 2: User creates event
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.userLogin(userEmail, userPassword);
                    cy.eventlistToNewEventForm();
                    cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
                    cy.userLogout();

                    // Step 3: Admin accepts
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                    cy.adminAcceptNewEvent();

                    cy.adminGetAllStatusCounts().then((afterAccept) => {
                        expect(afterAccept['All']).to.equal(1, 'All should be 1');
                        expect(afterAccept['In Review']).to.equal(0, 'In Review should be 0 after accept');
                        expect(afterAccept['In Progress']).to.equal(1, 'In Progress should be 1 after accept');
                        expect(afterAccept['Completed']).to.equal(0, 'Completed should be 0');
                        expect(afterAccept['Cancelled']).to.equal(0, 'Cancelled should be 0');
                    });

                    // Step 4: User requests cancellation
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.userLogin(userEmail, userPassword);
                    cy.userSubmitEventCancelRequest();
                    cy.userLogout();

                    // Step 5: Admin approves cancellation
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                    cy.adminAcceptEventCancelRequest();

                    cy.adminGetAllStatusCounts().then((afterCancel) => {
                        expect(afterCancel['All']).to.equal(1, 'All should still be 1');
                        expect(afterCancel['In Review']).to.equal(0, 'In Review should be 0');
                        expect(afterCancel['In Progress']).to.equal(0, 'In Progress should be 0 after cancellation');
                        expect(afterCancel['Completed']).to.equal(0, 'Completed should be 0');
                        expect(afterCancel['Cancelled']).to.equal(1, 'Cancelled should be 1 after cancellation');
                    });
                });
            });

            describe(`Event Lifecycle - Complete Event Path`, () => {
                before(() => {
                    cy.clearCacheLoadLanding();
                    cy.landingToSignup();
                    cy.userSignup(userEmail, userPassword);
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                });

                it('should track counts through new event -> accept -> complete flow', () => {
                    // Step 1: Start clean
                    cy.adminGetAllStatusCounts().then((initial) => {
                        expect(initial['All']).to.equal(0);
                    });

                    // Step 2: User creates event
                    cy.userLogout();
                    cy.landingToLogin();
                    cy.userLogin(userEmail, userPassword);
                    cy.eventlistToNewEventForm();
                    cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
                    cy.userLogout();

                    // Step 3: Admin accepts
                    cy.landingToLogin();
                    cy.adminLogin(adminEmail, adminPassword);
                    cy.adminAcceptNewEvent();

                    cy.adminGetAllStatusCounts().then((afterAccept) => {
                        expect(afterAccept['All']).to.equal(1);
                        expect(afterAccept['In Progress']).to.equal(1);
                    });

                    // Step 4: Admin completes event
                    cy.adminSetEventAsCompleted();

                    cy.adminGetAllStatusCounts().then((afterComplete) => {
                        expect(afterComplete['All']).to.equal(1, 'All should still be 1');
                        expect(afterComplete['In Review']).to.equal(0, 'In Review should be 0');
                        expect(afterComplete['In Progress']).to.equal(0, 'In Progress should be 0 after completion');
                        expect(afterComplete['Completed']).to.equal(1, 'Completed should be 1 after completion');
                        expect(afterComplete['Cancelled']).to.equal(0, 'Cancelled should be 0');
                    });
                });
            });
        });
    });

    describe(`Admin with Mock Event Seeding`, () => {
        before(() => {
            cy.clearCacheLoadLanding();
            cy.landingToSignup();
            cy.userSignup(userEmail, userPassword);
            cy.userLogout();
            cy.landingToLogin();
            cy.adminLogin(adminEmail, adminPassword);
        });

        it(`should display 1 event from user`, () => {
            // Step 1: Start with clean slate
            cy.adminGetAllStatusCounts().then((initial) => {
                expect(initial['All']).to.equal(0);
                expect(initial['In Review']).to.equal(0);
                expect(initial['In Progress']).to.equal(0);
                expect(initial['Completed']).to.equal(0);
                expect(initial['Cancelled']).to.equal(0);
            });

            // Step 2: User creates event
            cy.userLogout();
            cy.landingToLogin();
            cy.userLogin(userEmail, userPassword);
            cy.eventlistToNewEventForm();
            cy.userAddNewEvent('', event.date, event.location, event.type, event.guestCount, event.budget, '')
            cy.userLogout();

            // Step 3: Verify In Review
            cy.landingToLogin();
            cy.adminLogin(adminEmail, adminPassword);
            cy.adminGetAllStatusCounts().then((afterCreate) => {
                expect(afterCreate['All']).to.equal(1, 'All should be 1 after event created');
                expect(afterCreate['In Review']).to.equal(1, 'In Review should be 1');
                expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0');
                expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0');
                expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0');
            });
        });

        it(`should display 30 mock events from user`, () => {            
            // Step 1: Verify admin view first
            cy.adminGetAllStatusCounts().then((initial) => {
                expect(initial['All']).to.equal(1);
                expect(initial['In Review']).to.equal(1);
                expect(initial['In Progress']).to.equal(0);
                expect(initial['Completed']).to.equal(0);
                expect(initial['Cancelled']).to.equal(0);
            });

            cy.userLogout();
            cy.landingToLogin();
            cy.userLogin(userEmail, userPassword);
            cy.devAddMockEvents();
            cy.wait(500);
            cy.userLogout();
            cy.landingToLogin();
            cy.adminLogin(adminEmail, adminPassword);
            
            // Step 3: Verify admin view updated correctly
            cy.adminGetAllStatusCounts().then((afterCreate) => {
                expect(afterCreate['All']).to.equal(31, 'Admin should see 31 total events');
                expect(afterCreate['In Review']).to.equal(9, 'Admin should see 9 in review');
                expect(afterCreate['In Progress']).to.equal(12, 'Admin should see 12 in progress');
                expect(afterCreate['Completed']).to.equal(6, 'Admin should see 6 completed');
                expect(afterCreate['Cancelled']).to.equal(4, 'Admin should see 4 cancelled');
            });
        });

        it(`should display 30 mock events from admin`, () => {
            // Step 1: Checking current status
            cy.adminGetAllStatusCounts().then((initial) => {
                expect(initial['All']).to.equal(31);
                expect(initial['In Review']).to.equal(9);
                expect(initial['In Progress']).to.equal(12);
                expect(initial['Completed']).to.equal(6);
                expect(initial['Cancelled']).to.equal(4);
            });

            // Step 2: Admin loads mock events
            cy.devAddMockEvents();
            cy.wait(500);

            // Step 3: Verify In Review
            cy.adminGetAllStatusCounts().then((afterCreate) => {
                expect(afterCreate['All']).to.equal(31 + 30, 'All should be 61 after user loads mock events.');
                expect(afterCreate['In Review']).to.equal(9 + 8, 'In Review should be 17 after user loads mock events.');
                expect(afterCreate['In Progress']).to.equal(12 + 12, 'In Progress should be 24 after user loads mock events.');
                expect(afterCreate['Completed']).to.equal(6 + 6, 'Completed should be 12 after user loads mock events.');
                expect(afterCreate['Cancelled']).to.equal(4 + 4, 'Cancelled should be 8 after user loads mock events.');
            });
        });

        it(`should clear all mock events, leaving the 1 event created by the user`, () => {
            // Step 1: Checking current status
            cy.adminGetAllStatusCounts().then((initial) => {
                expect(initial['All']).to.equal(61);
                expect(initial['In Review']).to.equal(17);
                expect(initial['In Progress']).to.equal(24);
                expect(initial['Completed']).to.equal(12);
                expect(initial['Cancelled']).to.equal(8);
            });

            // Step 2: Admin clears mock events
            cy.devClearMockEvents();
            cy.wait(500);

            // Step 3: Verify In Review
            cy.adminGetAllStatusCounts().then((afterCreate) => {
                expect(afterCreate['All']).to.equal(1, 'All should be 1 after admin clears the mock events.');
                expect(afterCreate['In Review']).to.equal(1, 'In Review should be 1 after admin clears the mock events.');
                expect(afterCreate['In Progress']).to.equal(0, 'In Progress should be 0 after admin clears the mock events.');
                expect(afterCreate['Completed']).to.equal(0, 'Completed should be 0 after admin clears the mock events.');
                expect(afterCreate['Cancelled']).to.equal(0, 'Cancelled should be 0 after admin clears the mock events.');
            });
        });   
    });
});