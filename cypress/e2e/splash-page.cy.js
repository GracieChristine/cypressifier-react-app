describe('Slash Page', () => {
    beforeEach(() => {
        // Visit the app and clear storage before each test
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    it('should display the splash page with correct branding and ui', () => {
        // Check the main title
        cy.contains('Cypressifier').should('be.visible');
        cy.contains('European Estate Events').should('be.visible');

        // Check that all 4 venue types are shown
        cy.contains('Castles').should('be.visible');
        cy.contains('Châteaux').should('be.visible');
        cy.contains('Palaces').should('be.visible');
        cy.contains('Gardens').should('be.visible');

        // Check the tagline
        cy.contains('Create extraordinary moments').should('be.visible');

        // Check the CTA buttons exisit
        cy.get('[data-cy="hero-signup-btn"]').should('be.visible').and('contain', 'Begin Your Journey');
        cy.get('[data-cy="hero-login-btn"]').should('be.visible').and('contain', 'Log In');

        // Check the offering
        cy.contains('Curated Selection').should('be.visible');
        cy.contains('Bespoke Service').should('be.visible');
        cy.contains('Unforgettable').should('be.visible');

        // Check the statistics
        cy.contains('Historic Venues').should('be.visible');
        cy.contains('Countries').should('be.visible');
        cy.contains('Celebrations').should('be.visible');

        // Check the footer
        cy.contains('© 2026 Cypressifier Event Planning.').should('be.visible');
    });

    it('should navigate to signup page when clicking Begin Your Journey button', () => {
        // Navigate to sign up page
        cy.get('[data-cy="hero-signup-btn"]').click();

        // Check it is indeed sign up page
        cy.contains('Create Account').should('be.visible');
        cy.contains('Start planning amazing events').should('be.visible');
        cy.get('[data-cy="email-input"]').should('be.visible');
        cy.get('[data-cy="password-input"]').should('be.visible');
        cy.get('[data-cy="confirm-password-input"]').should('be.visible');
        cy.get('[data-cy="signup-submit"]').should('be.visible');
        cy.contains('Already have an account? Login').should('be.visible');

        // Navigating back to splash page
        cy.contains('Cypressifier').click();
    });

    it('should navigate to login page when clicking on Log In button', () => {
        // Navigate to login page
        cy.get('[data-cy="hero-login-btn"]').click();

        /// Check it is indeed login page
        cy.contains('Welcome Back!').should('be.visible');
        cy.contains('Login to manage your events').should('be.visible');
        cy.get('[data-cy="email-input"]').should('be.visible');
        cy.get('[data-cy="password-input"]').should('be.visible');
        cy.get('[data-cy="login-submit"]').should('be.visible');
        cy.contains('Don\'t have an account? Sign up').should('be.visible');

        // Navigating back to splash page
        cy.contains('Cypressifier').click();
    });
});