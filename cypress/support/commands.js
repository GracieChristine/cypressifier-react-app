Cypress.Commands.add('signupUser', (email, password, confirmPass = null) => {
    // Fill in sign in form
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);
    cy.get('[data-cy="confirm-password-input"]').type(confirmPass || password);

    // Submit
    cy.get('[data-cy="signup-submit"]').click();
});

Cypress.Commands.add('loginUser', (email, password) => {
    // Fill in log in form
    cy.get('[data-cy="email-input"]').type(email);
    cy.get('[data-cy="password-input"]').type(password);

    // Submit
    cy.get('[data-cy="login-submit"]').click();
});

Cypress.Commands.add('logout', () => {
    // Log out
    cy.get('[data-cy="logout-btn"]').click();
});