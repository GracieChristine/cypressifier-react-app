// Initalize Related Commands
Cypress.Commands.add(`clearCacheLoadLanding`, () => {
    // cy.visit('http://localhost:5173', {
    //     onBeforeLoad(win) {
    //         win.localStorage.clear();
    //         win.sessionStorage.clear();
    //     }
    // })

    cy.clearLocalStorage();
    cy.visit('http://localhost:5173');
});

// Navigation Related Commands
Cypress.Commands.add(`landingToSignup`, () => {
    cy.get('[data-cy="landing-signup-btn"]')
    .click();

    cy.url()
    .should('contain','/signup');
});

Cypress.Commands.add(`landingToLogin`, () => {
    cy.get('[data-cy="landing-login-btn"]')
    .click();

    cy.url()
    .should('contain','/login');
});

Cypress.Commands.add(`returnToLanding`, () => {
    cy.get('[data-cy="nav-brand-link"]')
    .click();
    
    cy.url()
    .should('eq','http://localhost:5173/');
});

Cypress.Commands.add(`signupToLogin`, () => {
    cy.get('[data-cy="signup-login-link"]')
    .click();
    
    cy.url()
    .should('contain','/login');
});

Cypress.Commands.add(`loginToSignup`, () => {
    cy.get('[data-cy="login-signup-link"]')
    .click();
    
    cy.url()
    .should('contain','/signup');
});

// Cypress.Commands.add(``, () => {
//     // dashboard table entry action button
//         // there is 1 button
//         // depending on the button name, it will navigate to different page
// });

// Cypress.Commands.add(`adminEventViewToDashboard`, () => {
//     cy.get('[data-cy="return-dashboard-btn"]')
//     .click();

//     cy.url()
//     .should('contain','/admin/dashboard');
// });

// Cypress.Commands.add(`userEventListToEventFormNew`, () => {
//     cy.get('[data-cy="evenlist-create-event-btn"]')
//     .click();

//     cy.url()
//     .should('contain','/user/events/new');
// });

// Dev Related Commands
Cypress.Commands.add(`devExpandPanel`, () => {
    cy.get('[data-cy="dev-panel-window-min"]')
    .click();

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exisit');
});

Cypress.Commands.add(`devCollapsePanel`, () => {
    cy.get('[data-cy="dev-panel-window-max"]')
    .click();

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exisit');
});

Cypress.Commands.add(`devAddMockEvents`, () => {
    cy.get('[data-cy="dev-panel-add-event-btn"]')
    .click();

    cy.wait(100);

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exisit');

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exisit');

    cy.get('[data-cy="evenlist-filter-all"]')
    .should('contain', '30');
});

Cypress.Commands.add(`devClearMockEvents`, () => {
    cy.get('[data-cy="dev-panel-clear-event-btn"]')
    .click();

    cy.wait(100);

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exisit');

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exisit');

    cy.get('[data-cy="evenlist-filter-all"]')
    .should('contain', '0');
});

// User Auth Related Commands
Cypress.Commands.add(`userSignup`, (email, password, confirmPass = null) => {
    cy.clearCacheLoadLanding();
    cy.landingToSignup();

    // Fill in signup form
    cy.get('[data-cy="signup-email-input"]')
    .type(email);
    cy.get('[data-cy="signup-password-input"]')
    .type(password);
    cy.get('[data-cy="signup-confirm-password-input"]')
    .type(confirmPass || password);

    // Submit signup form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/user/events');
});

// Need to consider, with different user input (admin/user), to navigate to different link.
Cypress.Commands.add(`userLogin`, (email, password) => {
    cy.clearCacheLoadLanding();
    cy.landingToLogin();

    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .type(email);
    cy.get('[data-cy="login-password-input"]')
    .type(password);

    // Submit login form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/user/evelist');
});

// Need to consider, with different user input (admin/user), to navigate to different link.
Cypress.Commands.add(`adminLogin`, (email, password) => {
    cy.clearCacheLoadLanding();
    cy.landingToLogin();

    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .type(email);
    cy.get('[data-cy="login-password-input"]')
    .type(password);

    // Submit login form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/admin/dashboard');
});

Cypress.Commands.add(`userLogout`, () => {
    cy.get('[data-cy="nav-logout-btn"]')
    .click();

    cy.url()
    .should('eq','http://localhost:5173/');
});

Cypress.Commands.add(``, () => {

});
