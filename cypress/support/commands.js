// ------------ NEW / UPDATED ONES ------------





// Navigation Related Commands
Cypress.Commands.add(`landingToSignup`, () => {
    // Navigate from landing page to signup
    cy.get('[data-cy="landing-signup-btn"]')
    .should('be.visible')
    .click();
});

Cypress.Commands.add(`landingToLogin`, () => {
    // Navigate from landing page to login
    cy.get('[data-cy="landing-login-btn"]')
    .click();
});

Cypress.Commands.add(`signupToLogin`, () => {
    // Navigate from singup to login
    cy.get('[data-cy="signup-login-link"]')
    .click();
});

Cypress.Commands.add(`loginToSignup`, () => {
    // Navigate from login to signup
    cy.get('[data-cy="login-signup-link"]')
    .click();
});

Cypress.Commands.add(`userEventToEventNew`, () => {
    // Navigate from user/events to user/events
    cy.get('[data-cy="eventlist-create-event-btn"]')
    .click();
});

// User Auth Related Commands
Cypress.Commands.add(`signupUser`, (email, password, confirmPass = null) => {
    // Fill in sign in form
    cy.get('[data-cy="email-input"]')
    .type(email);
    cy.get('[data-cy="password-input"]')
    .type(password);
    cy.get('[data-cy="confirm-password-input"]')
    .type(confirmPass || password);

    // Submit
    cy.get('form')
    .submit();
});

Cypress.Commands.add(`loginUser`, (email, password) => {
    // Fill in log in form
    cy.get('[data-cy="email-input"]')
    .type(email);
    cy.get('[data-cy="password-input"]')
    .type(password);

    // Submit
    cy.get('form')
    .submit();
});

Cypress.Commands.add(`logoutUser`, () => {
    // Log out
    cy.get('[data-cy="logout-btn"]')
    .click();
});

// Check URL Related Commands
Cypress.Commands.add(`checkCurrentPage`, (urlPath) => {
    cy.url()
    .should('contain', urlPath)
});

// Dev - Mock Events Commands
Cypress.Commands.add(`loadMockEvents`, () => {
    // Expand dev panel
    cy.get('[data-cy="dev-panel-expand-btn"]')
    .click();

    // Seed 30 mock events
    cy.get('[data-cy="dev-panel-add-event-btn"]')
    .click();
});

Cypress.Commands.add(`clearMockEvents`, () => {
    // Expand dev panel
    cy.get('[data-cy="dev-panel-expand-btn"]')
    .click();

    // Clear all mock events (user will only clear their own)
    cy.get('[data-cy="dev-panel-clear-event-btn"]')
    .click();
});

// Admin - Check Amount Of Events Commands
Cypress.Commands.add(`admin_checkTotalNumOfEvents`, (numOfEvent) => {
    cy.get('[data-cy="dashboard-stat"]')
    .within(() => {
        cy.get('[data-cy="dashboard-stat-box"]')
        .first()
        .should('contain', 'All')
        .should('contain', numOfEvent)
        .and('be.visible');
    });
});

Cypress.Commands.add(`admin_checkTableIsEmpty`, () => {
    cy.get('[data-cy="dashboard-event-table"]')
    .within(() => {
        cy.get('[data-cy="dashboard-event-entry"]')
        .should('not.exist');
        cy.get('[data-cy="dashboard-event-empty"]')
        .should('contain', 'No events')
        .and('be.visible');
    });
});

Cypress.Commands.add(`admin_checkTableEventEntries`, (numOfEvent) => {
    cy.get('[data-cy="dashboard-event-table"]')
    .within(() => {
        cy.get('[data-cy="dashboard-event-empty"]')
        .should('not.exist');
        cy.get('[data-cy="dashboard-event-entry"]')
        .should('have.length', numOfEvent)
        .and('be.visible');
    });
});

// User - Check Amount Of Events Commands
Cypress.Commands.add(`user_checkTotalNumOfEvents`, (numOfEvent) => {
    cy.get('[data-cy="eventlist-event-list"]')
    cy.get('[data-cy="eventlist-filter"]')
    .within(() => {
        cy.get('[data-cy="eventlist-filter-box filter-all"]')
        .should('contain', 'All')
        .should('contain', numOfEvent)
        .and('be.visible');
    });
});

// User - Create/Edit Events Commands
Cypress.Commands.add(`user_createNewEvent`, () => {
    // Fill in new event form
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

    // Submit
    cy.get('form')
    .submit();
});

// ------------ OLD / EXISTING / NEED REVIEW ONES ------------




// Navigation Related Commands


Cypress.Commands.add(`backToLanding`, () => {
    // Navigate back to landing page
    cy.get('[data-cy="nav-brand-name"]')
    .click();
});