describe(`Dashboard Page`, () => {
    // Set variables
    const userEmail = 'testuser@example.com';
    const userPassword = 'admin123';
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';

    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    describe(`Dashboard - UI Smoke`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-login-btn"]')
            .click();
            cy.get('[data-cy="login-email"]')
            .type(adminEmail);
            cy.get('[data-cy="login-password"]')
            .type(adminPassword);
            cy.get('form')
            .submit();
        });

        it(`should display admin identity in navbar`, () => {
            cy.get('[data-cy="nav-brand-name"]')
            .should('contain', 'Cypressifier');
            cy.get('[data-cy="nav-user-role"]')
            .should('contain', 'Admin');
            cy.get('[data-cy="nav-user-email"]')
            .should('contain', adminEmail);
            cy.get('[data-cy="nav-logout-btn"]')
            .should('contain', 'Logout')
        });

        it(`should render dashboard header`, () => {
            cy.get('[data-cy="dashboard-header"]')
            .should('contain', 'Admin Dashboard')
            .and('contain', 'Manage all events');
        });

        it(`should render event stat`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .should('be.visible');

            cy.get('[data-cy="dashboard-stat"]')
            .get('[data-cy="dashboard-stat-box"]')
            .should('have.length.at.least', 5);
        });

        it(`should render event table`, () => {
            cy.get('[data-cy="dashboard-event-table"]')
            .should('be.visible');
        });
    });

    describe(`Dashboard – Admin Loads Mock Events`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-login-btn"]')
            .click();
            cy.get('[data-cy="login-email"]')
            .type(adminEmail);
            cy.get('[data-cy="login-password"]')
            .type(adminPassword);
            cy.get('form')
            .submit();

            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-collapse-btn"]')
            .click();
        });

        it(`should load 30 events`, () => {
            cy.get('[data-cy="dashboard-event-entry"]')
            .should('have.length.at.least', 30);
        });

        it(`should update stat counts`, () => {
            cy.get('[data-cy="dashboard-stat-box"]').first()
            .should('contain', 'All')
            .and('not.contain', '(0)');
        });

        it(`should update table`, () => {
            cy.get('[data-cy="dashboard-event-entry"]')
            .first()
            .within(() => {
                cy.contains(/User #/);
                cy.contains(/In Review|In Progress|Completed|Cancelled/);
                cy.get('[data-cy="admin-action-btn"]').should('exist');
            });
        });
    });

    describe(`Dashboard – Admin Clears Own Mock Events`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-login-btn"]')
            .click();
            cy.get('[data-cy="login-email"]')
            .type(adminEmail);
            cy.get('[data-cy="login-password"]')
            .type(adminPassword);
            cy.get('form')
            .submit();

            // Ensure events exist
            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-collapse-btn"]')
            .click();

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('have.length.at.least', 1);
        });

        it(`should clear all admin-created mock events`, () => {
            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-clear-event-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-collapse-btn"]')
            .click();

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('not.exist');
            cy.get('[data-cy="dashboard-event-empty"]')
            .should('be.visible');
        });

        // it(`should clear all user-created mock events`, () => {
        //     cy.get('[data-cy="nav-logout-btn"]')
        //     .should('be.visible')
        //     .click();
        //     cy.visit('/');

        //     cy.get('[data-cy="landing-signup-btn"]')
        //     .should('be.visible')
        //     .click();
        //     cy.visit('/signup');

        //     cy.get('[data-cy="signup-email"]')
        //     .should('be.visible')
        //     .type(userEmail);
        //     cy.get('[data-cy="signup-password"]')
        //     .should('be.visible')
        //     .type(userPassword);
        //     cy.get('[data-cy="signup-confirm-password"]')
        //     .should('be.visible')
        //     .type(userPassword);
        //     cy.get('form')
        //     .submit();

        //     cy.get('[data-cy="dev-panel-expand-btn"]')
        //     .click();
        //     cy.get('[data-cy="dev-panel-clear-event-btn"]')
        //     .click();
        //     cy.get('[data-cy="dev-panel-collapse-btn"]')
        //     .click();
            
        //     cy.get('[data-cy="nav-logout-btn"]')
        //     .should('be.visible')
        //     .click();
        //     cy.visit('/');

        //     cy.get('[data-cy="landing-login-btn"]')
        //     .should('be.visible')
        //     .click();
        //     cy.visit('/login');

        //     cy.get('[data-cy="login-email"]')
        //     .should('be.visible')
        //     .type(adminEmail);
        //     cy.get('[data-cy="login-password"]')
        //     .should('be.visible')
        //     .type(adminPassword);
        //     cy.get('form')
        //     .submit();

        //     cy.visit('/admin/dashboard');

        //     cy.get('[data-cy="dashboard-event-entry"]')
        //     .should('have.length.at.least', 60);
            
        //     cy.get('[data-cy="dev-panel-expand-btn"]')
        //     .click();
        //     cy.get('[data-cy="dev-panel-clear-event-btn"]')
        //     .click();
        //     cy.get('[data-cy="dev-panel-collapse-btn"]')
        //     .click();

        //     cy.get('[data-cy="dashboard-event-entry"]')
        //     .should('not.exist');
        //     cy.get('[data-cy="dashboard-event-empty"]')
        //     .should('be.visible');
        // });
    });

    describe(`Dashboard – Admin Clears User-Created Mock Events`, () => {
        it(`should clears all user-created mock events`, () => {
            // User signup & seed
            cy.get('[data-cy="landing-signup-btn"]')
            .click();

            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);
            cy.get('form')
            .submit();

            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-collapse-btn"]')
            .click();

            cy.get('[data-cy="eventlist-event-entry"]')
            .should('have.length.at.least', 30);

            cy.get('[data-cy="nav-logout-btn"]')
            .click();

            // Admin login
            cy.get('[data-cy="landing-login-btn"]')
            .click();
            cy.url()
            .should('contain', '/login');

            cy.get('[data-cy="login-email"]')
            .type(adminEmail);
            cy.get('[data-cy="login-password"]')
            .type(adminPassword);
            cy.get('form')
            .submit();

            cy.url()
            .should('contain', '/admin/dashboard');

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('have.length.at.least', 1);

            cy.get('[data-cy="dev-panel-expand-btn"]').click();
            cy.get('[data-cy="dev-panel-clear-event-btn"]').click();
            cy.get('[data-cy="dev-panel-collapse-btn"]').click();

            cy.get('[data-cy="dashboard-event-entry"]').should('not.exist');
            cy.get('[data-cy="dashboard-event-empty"]').should('be.visible');
        });
    });

    // describe(`Dashboard - Admin Handles In Review Events`, () => {
    //     beforeEach(() => {

    //     });
        
    //     it(``, () => {

    //     });
        
    //     it(``, () => {
        
    //     });
    // });

    // describe(`Dashboard - Admin Handles Events Cancel Request`, () => {
    //     beforeEach(() => {

    //     });
        
    //     it(``, () => {

    //     });
        
    //     it(``, () => {
        
    //     });
    // });

    // describe(`Dashboard - Admin Moves Events to Completed`, () => {
    //     beforeEach(() => {

    //     });
        
    //     it(``, () => {

    //     });
        
    //     it(``, () => {
        
    //     });
    // });
});