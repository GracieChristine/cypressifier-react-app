describe(`Landing Page`, () => {
    // Visit landing page and clear storage before each test
    beforeEach(() => {
        cy.visit(`http://localhost:5173`);
        cy.clearLocalStorage();
    });

    describe(`Landing Page UI`, () => {
        it(`should display brand`, () => {
            cy.get('[data-cy="landing-brand-name"]')
            .should('have.text', 'Cypressifier')
            .and('be.visible');
        });
        
        it(`should display description`, () => {
            cy.get('[data-cy="landing-brand-tag"]')
            .should('have.text', 'An Event Planning & Design Experience')
            .and('be.visible');
        });

        it(`should display signup button first`, () => {
            cy.get('[data-cy="landing-btns"]')
            .find('button')
            .first()
            .should('have.attr', 'data-cy', 'landing-signup-btn')
            .should('have.text', 'Sign Up')
            .and('be.visible');
        });

        it(`should display login button last`, () => {
            cy.get('[data-cy="landing-btns"]')
            .get('button:last-child')
            .should('have.attr', 'data-cy', 'landing-login-btn')
            .and('be.visible');
        });
    });

    describe(`Navigate to Sign Up`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-signup-btn"]')
            .click();
        });

        it(`should navigate to signup page`, () => {
            cy.url()
            .should('include', '/signup');
        });

        it(`should display signup form`, () => {
            cy.get('[data-cy="signup-form"]')
            .should('be.visible');
        });

        it(`should navigate to login`, () => {
            cy.get('[data-cy="signup-login-link"]')
            .click();

            cy.url()
            .should('include', '/login');
        });

        it(`should navigate back to landing page`, () => {
            cy.get('[data-cy="nav-brand-name"]')
            .click();

            cy.url()
            .should('include', '/');
        });
    });

    describe(`Navigate to Log In`, () => {
        beforeEach(() => {

        });
        
        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });
    });
});