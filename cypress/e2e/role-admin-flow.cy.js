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