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

            it(`should return with no action`, () => {
                cy.get('[data-cy="dashboard-table-entry"]')
                .first()
                .find('[data-cy="dashboard-table-entry-action"]')
                .should('contain', 'View')
                .click();

                cy.url()
                .should('contain', '/admin/events/event_')
                .and('contain', '/edit');

                cy.get('[data-cy="return-dashboard-btn"]')
                .scrollIntoView()
                .click();

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(0)
                .should('contain', 'All')
                .should('contain', '3')
                .and('be.visible');

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(1)
                .should('contain', 'In Review')
                .should('contain', '3')
                .and('be.visible');
            });

            it(`should accept new event`, () => {
                cy.adminAcceptNewEvent(1);
            });

            it(`should decline new event`, () => {
                cy.adminDeclineNewEvent(2);
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
                // cy.wrap([1, 2, 3]).each(() => {
                //     cy.adminAcceptNewEvent();
                // });
            });

            it(`should return to /admin/dashboard without any action`, () => {
                cy.get('[data-cy="dashboard-status-box"]')
                .eq(0)
                .should('contain', 'All')
                .should('contain', '3')
                .and('be.visible');

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(1)
                .should('contain', 'In Review')
                .should('contain', '0')
                .and('be.visible');

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(2)
                .should('contain', 'In Progress')
                .should('contain', '3')
                .and('be.visible');
                
            });

            it(`should approve cancellation request`, () => {

            });

            it(`should deny cancellation request`, () => {

            });
            
        });

        // describe(`Admin Reviews Event Completion`, () => {
        //     before(() => {

        //     });

        //     it(`should return to /admin/dashboard without any action`, () => {

        //     });

        //     it(`should confirm event completion`, () => {

        //     });

        //     it(`should cancel event completion`, () => {

        //     });
            
        // });
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