describe(`Admin Experience Flow`, () => {
    // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';

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
        describe(`Admin Declines New Event`, () => {
            before(() => {
                cy.clearCacheLoadLanding();

                cy.landingToSignup();
                cy.userSignup(userEmail, userPassword);
                
                // create new event
                cy.userAddNewEvent();

                cy.userLogout();

                cy.landingToLogin();
                cy.adminLogin(adminEmail, adminPassword);
            });

            it(`should have a status of 'in review'`, () => {
                cy.get('[data-cy="dashboard-alert-box"]')
                .eq(0)
                .should('contain', '1 New Event Submission')
                .and('be.visible');
                
                cy.get('[data-cy="dashboard-status-box"]')
                .eq(0)
                .should('contain', 'All')
                .should('contain', '(1)')
                .and('be.visible');

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(1)
                .should('contain', 'In Review')
                .should('contain', '(1)')
                .and('be.visible');

                cy.get('[data-cy="dashboard-table-entry"]')
                .eq(0)
                .should('contain', "In Review")
                .should('contain', 'View')
                .and('be.visible');
            });

            it(`should click on 'view' button and navigate to /admin/event `, () => {
                cy.get('[data-cy="dashboard-table-entry-action"]')
                .click();

                cy.url()
                .should('contain', '/admin/events/event_')
                .and('contain', '/edit');

            });

            it(`should display new event submitted need reviewing `, () => {
                cy.get('[data-cy="eventview-details"]')
                .scrollIntoView;

                cy.get('[data-cy="eventview-details"]')
                .should('contain', "New Event Submission")
                .should('contain', 'Review Required')
                .and('be.visible');

            });

            it(`should decline the event and navigate back to /admin/dashboard`, () => {
                cy.get('[data-cy="review-new-comment-input"]')
                .scrollIntoView()
                .type('I\\m declining this new event submission due to x, y, and z reasoning. Thanks for your understanding.');

                cy.get('[data-cy="decline-new-event-btn"]')
                .click();

                cy.url()
                .should('contain', '/admin/dashboard')
            });

            it(`should now have a status of 'cancel'`, () => {
                cy.get('[data-cy="dashboard-alert-box"]')
                .should('not.exist');

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(0)
                .should('contain', 'All')
                .should('contain', '(1)')
                .and('be.visible');

                cy.get('[data-cy="dashboard-status-box"]')
                .eq(4)
                .should('contain', 'Cancelled')
                .should('contain', '(1)')
                .and('be.visible');

                cy.get('[data-cy="dashboard-table-entry"]')
                .eq(0)
                .should('contain', "Cancelled")
                .and('be.visible');
            });
            
        });

        describe(`Admin Declines Event Cancellation Request`, () => {
            before(() => {
                
            });

            it(``, () => {

            });
            
        });

        describe(`Admin Cancels Event Completion`, () => {
            before(() => {
                
            });

            it(``, () => {

            });
            
        });

        describe(`Admin Completes An Event`, () => {
            before(() => {
                
            });

            it(``, () => {

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