Cypress.Commands.add(`splashToSignup`, () => {
    // Navigate to signup from splash page
    cy.get('[data-cy="hero-signup-btn"]').click();
});

Cypress.Commands.add(`navToSignup`, () => {
    // Navigate to signup from nav
    cy.get('[data-cy="nav-signup"]').click();
});

Cypress.Commands.add(`linkToSignup`, () => {
    // Navigate to signup from nav
    cy.get('[data-cy="signup-link"]').click();
});

Cypress.Commands.add(`signupUser`, (email, password, confirmPass = null) => {
    // Fill in sign in form
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="confirm-password-input"]').type(confirmPass || password);

    // Submit
    cy.get('[data-cy="signup-submit"]').click();
});

Cypress.Commands.add(`splashToLogin`, () => {
    // Navigate to login from splash page
    cy.get('[data-cy="hero-login-btn"]').click();
});

Cypress.Commands.add(`navToLogin`, () => {
    // Navigate to login from nav
    cy.get('[data-cy="nav-login"]').click();
});

Cypress.Commands.add(`linkToLogin`, () => {
    // Navigate to login from nav
    cy.get('[data-cy="login-link"]').click();
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