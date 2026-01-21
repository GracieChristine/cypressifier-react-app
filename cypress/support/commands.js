// Navigation Related Commands
Cypress.Commands.add(`landingToSignup`, () => {
    // Navigate from landing page to signup
    cy.get('[data-cy="landing-signup-btn"]')
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
    cy.get('[data-cy="login-signup-link"]'

    ).click();
});

Cypress.Commands.add(`backToLanding`, () => {
    // Navigate back to landing page
    cy.get('[data-cy="nav-brand-name"]')
    .click();
});

// User Auth Related Commands
Cypress.Commands.add(`signupUser`, (email, password, confirmPass = null) => {
    // Fill in sign in form
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="confirm-password-input"]').type(confirmPass || password);

    // Submit
    cy.get('[data-cy="signup-submit"]').click();
});

Cypress.Commands.add(`loginUser`, (email, password) => {
    // Fill in log in form
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);

    // Submit
    cy.get('[data-cy="login-submit"]').click();
});

Cypress.Commands.add(`logout`, () => {
    // Log out
    cy.get('[data-cy="logout-btn"]').click();
});