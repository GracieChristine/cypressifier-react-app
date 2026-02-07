describe(`Admin Experience Flow`, () => {
    // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';
    const numEvent = 0;

    describe(`Admin Authentication`, () => {
        before(() => {
            cy.clearCacheLoadLanding();
        });

        it(`should navigate to /login`, () => {
            cy.landingToLogin();
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
                
                // create 3 new events
                Cypress._.times(3, () => {
                    cy.userAddNewEvent();
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
                
                // user creates 3 new events
                Cypress._.times(3, () => {
                    cy.userAddNewEvent();
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
                    cy.userSendCancellationRequest();
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
                
                // user creates 3 new events
                Cypress._.times(3, () => {
                    cy.userAddNewEvent();
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
                    cy.userAddNewEvent();
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
                    cy.userAddNewEvent();
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
                    cy.userSendCancellationRequest();
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
                    cy.userAddNewEvent();
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

    // describe(`Admin's Dev Tool`, () => {
    //     beforeEach(() => {

    //     });

    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });
});