describe(`Admin Flow`, () => {
    // Setup variables
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';

    beforeEach(() => {
        cy.visit('http://localhost:5173', {
            onBeforeLoad(win) {
                win.localStorage.clear();
                win.sessionStorage.clear();
            }
        });

        cy.get('[data-cy="landing-login-btn"]')
        .click();

        cy.get('[data-cy="login-email"]')
        .type(adminEmail);
        cy.get('[data-cy="login-password"]')
        .type(adminPassword);
        cy.get('form')
        .submit();
    });

    describe(`Admin Log In`, () => {
        it(`should login and navigate to admin dashboard`, () => {
            cy.url()
            .should('contain', '/admin/dashboard')
        });
    });

    describe(`Admin Loads Mock Events`, () => {
        beforeEach(() => {
            cy.url()
            .should('contain', '/admin/dashboard')
        });

        it(`should display no event before seeding`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .within(() => {
                cy.get('[data-cy="dashboard-stat-box"]')
                .first()
                .should('contain', 'All (0)')
                .and('be.visible');
            });

            cy.get('[data-cy="dashboard-event-table"]')
            .within(() => {
                cy.get('[data-cy="dashboard-event-empty"]')
                .should('contain', 'No events')
                .and('be.visible');
            });

        });

        it(`should display events after seeding`, () => {
            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();

            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();

            cy.get('[data-cy="dashboard-stat"]')
            .within(() => {
                cy.get('[data-cy="dashboard-stat-box"]')
                .first()
                .should('contain', 'All (60)')
                .and('be.visible');
            });

            cy.get('[data-cy="dashboard-event-table"]')
            .within(() => {
                cy.get('[data-cy="dashboard-event-entry"]')
                .should('have.length', 60)
                .and('be.visible');
            });
        });
    });

    describe(`Admin Clears Own Mock Events`, () => {
        beforeEach(() => {
            cy.url()
            .should('contain', '/admin/dashboard')

            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();

            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();
        });

        it(`should display event before clearing`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .within(() => {
                cy.get('[data-cy="dashboard-stat-box"]')
                .first()
                .should('contain', 'All (60)')
                .and('be.visible');
            });

            cy.get('[data-cy="dashboard-event-table"]')
            .within(() => {
                cy.get('[data-cy="dashboard-event-entry"]')
                .should('have.length', 60)
                .and('be.visible');
            });

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('contain', adminEmail)
            .and('be.visible');
        });

        it(`should display no event after clearing`, () => {
            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-clear-event-btn"]')
            .click();

            cy.get('[data-cy="dashboard-stat"]')
            .within(() => {
                cy.get('[data-cy="dashboard-stat-box"]')
                .first()
                .should('contain', 'All (0)')
                .and('be.visible');
            });

            cy.get('[data-cy="dashboard-event-table"]')
            .within(() => {
                cy.get('[data-cy="dashboard-event-empty"]')
                .should('contain', 'No events')
                .and('be.visible');
            });
        });
    });

    describe(`Admin Clears User-Created Mock Events`, () => {
        beforeEach(() => {
            // User logs out
            cy.get('[data-cy="nav-logout-btn"]')
            .click();

            // Landing page MUST render
            cy.url()
            .should('eq', 'http://localhost:5173/');

            // Signup page MUST render
            cy.get('[data-cy="landing-signup-btn"]')
            .should('be.visible')
            .click();

            cy.url()
            .should('contain', '/signup');

            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.url()
            .should('contain', '/user/events');

            // User loads mock events
            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();
            cy.get('[data-cy="dev-panel-add-event-btn"]')
            .click();

            cy.wait(1000);

            cy.get('[data-cy="eventlist-filter-box filter-all"]')
            .should('contain', 'All (30)');

            // User logs out
            cy.get('[data-cy="nav-logout-btn"]')
            .click();

            // Landing page MUST render
            cy.url()
            .should('eq', 'http://localhost:5173/');

            // Login page MUST render
            cy.get('[data-cy="landing-login-btn"]')
            .should('be.visible')
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
        });

        it('should display user-created events before clearing', () => {
            cy.get('[data-cy="dashboard-stat"]')
            .within(() => {
                cy.get('[data-cy="dashboard-stat-box"]')
                .first()
                .should('contain', 'All (30)');
            });

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('have.length', 30)
            .should('have.length', 30)
            .and('contain', userEmail);
        });

        it('should clear all user-created mock events', () => {
            cy.get('[data-cy="dev-panel-expand-btn"]')
            .click();

            cy.get('[data-cy="dev-panel-clear-event-btn"]')
            .should('be.visible')
            .click();

            cy.get('[data-cy="dashboard-stat"]')
            .within(() => {
                cy.get('[data-cy="dashboard-stat-box"]')
                .first()
                .should('contain', 'All (0)');
            });

            cy.get('[data-cy="dashboard-event-empty"]')
            .should('contain', 'No events')
            .and('be.visible');
        });
    });

    describe(`Admin Handle Newly Created User Events`, () => {
        beforeEach(() => {
            // User logs out
            cy.get('[data-cy="nav-logout-btn"]')
            .click();

            // Landing page MUST render
            cy.url()
            .should('eq', 'http://localhost:5173/');

            // Signup page MUST render
            cy.get('[data-cy="landing-signup-btn"]')
            .should('be.visible')
            .click();

            cy.url()
            .should('contain', '/signup');

            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.url()
            .should('contain', '/user/events');

            // User create an new event
            cy.get('[data-cy="eventlist-create-event-btn"]')
            .click();

            cy.url()
            .should('contain', '/user/events/new');

            cy.get('[data-cy="event-name-input"]')
            .type('Jane Doe\'s Celebration');
            cy.get('[data-cy="event-type-select"]')
            .select('Party');
            cy.get('[data-cy="event-date-input"]')
            .type('2030-06-28');
            cy.get('[data-cy="event-location-select"]')
            .select('Garden Estate');
            cy.get('[data-cy="event-guests-input"]')
            .type('175');
            cy.get('[data-cy="event-budget-input"]')
            .type('75000');
            cy.get('[data-cy="event-description-input"]')
            .type('Everyone has the right to freedom of thought, conscience and religion; this right includes freedom to change his religion or belief, and freedom, either alone or in community with others and in public or private, to manifest his religion or belief in teaching, practice, worship and observance.');

            cy.get('form')
            .submit();

            cy.url()
            .should('contain', '/user/events');

            cy.wait(1000);

            cy.get('[data-cy="eventlist-filter-box filter-all"]')
            .should('contain', 'All (1)');

            // User logs out
            cy.get('[data-cy="nav-logout-btn"]')
            .click();

            // Landing page MUST render
            cy.url()
            .should('eq', 'http://localhost:5173/');

            // Login page MUST render
            cy.get('[data-cy="landing-login-btn"]')
            .should('be.visible')
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

            cy.get('[data-cy="dashboard-stat-box"]')
            .eq(0)
            .should('contain', 'All (1)');

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('contain', 'In Review');
        });

        it(`should reject the new event`, () => {
            cy.get('[data-cy="admin-action-btn"]')
            .click();

            cy.url()
            .should('contain', '/admin/events')
            .should('contain', '/edit');

            cy.get('[data-cy="accept-comment"]')
            .scrollIntoView()
            .type('Everyone has the right to freedom.');

            cy.get('[data-cy="reject-submission-btn"]')
            .click();

            cy.get('[data-cy="reject-submission-confirmation"]')
            .get('[data-cy="reject-reason-input"]')
            .type('A reason for rejection...')

            cy.get('[data-cy="confirm-reject-btn"]')
            .click();

            cy.get('[data-cy="return-to-dashboard-btn"]')
            .click();

            cy.wait(1000);

            cy.url()
            .should('contain', '/admin/dashboard');

            cy.get('[data-cy="dashboard-stat-box"]')
            .eq(0)
            .should('contain', 'All (1)');

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('contain', 'Cancelled');
        });

        it(`should cancel rejecting the new event`, () => {
            cy.get('[data-cy="admin-action-btn"]')
            .click();

            cy.url()
            .should('contain', '/admin/events')
            .should('contain', '/edit');

            cy.get('[data-cy="accept-comment"]')
            .scrollIntoView()
            .type('Everyone has the right to freedom.');

            cy.get('[data-cy="reject-submission-btn"]')
            .click();

            cy.get('[data-cy="cancel-reject-btn"]')
            .click();

            cy.get('[data-cy="back-to-dashboard-btn"]')
            .scrollIntoView()
            .click();

            cy.wait(1000);

            cy.url()
            .should('contain', '/admin/dashboard');

            cy.get('[data-cy="dashboard-stat-box"]')
            .eq(0)
            .should('contain', 'All (1)');

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('contain', 'In Review');
        });

        it(`should accept the new event`, () => {
            cy.get('[data-cy="admin-action-btn"]')
            .click();

            cy.url()
            .should('contain', '/admin/events')
            .should('contain', '/edit');

            cy.get('[data-cy="accept-comment"]')
            .scrollIntoView()
            .type('Everyone has the right to freedom.');

            cy.get('[data-cy="accept-submission-btn"]')
            .click();

            cy.get('[data-cy="return-to-dashboard-btn"]')
            .click();

            cy.wait(1000);

            cy.url()
            .should('contain', '/admin/dashboard');

            cy.get('[data-cy="dashboard-stat-box"]')
            .eq(0)
            .should('contain', 'All (1)');

            cy.get('[data-cy="dashboard-event-entry"]')
            .should('contain', 'In Progress');
        });
    });

    // describe(`Admin Handle Events Cancel Request`, () => {
    //     beforeEach(() => {

    //     });

    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });

    // describe(`Admin Handle Events Completion`, () => {
    //     beforeEach(() => {

    //     });

    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });

    // describe(`Admin Log Out`, () => {
    //     beforeEach(() => {

    //     });

    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });
});