describe('Slash Page', () => {
    beforeEach(() => {
        // Visit the app and clear storage before each test
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    it('should display the splash page with correct branding', () => {
        // Check the main title
        cy.contains('Cypressifier').should('be.visible');
        cy.contains('European Estate Events').should('be.visible');

        // Check the tagline
        cy.contains('Create extraordinary moments').should('be.visible');

        // Check the CTA buttons exisit
        cy.get('[data-cy="hero-signup-btn"]').should('be.visible').and('contain', 'Begin Your Journey');
        cy.get('[data-cy="hero-login-btn"]').should('be.visible').and('contain', 'Log In');

        // Check the offer
        cy.contains('Curated Selection').should('be.visible');
        cy.contains('Bespoke Service').should('be.visible');
        cy.contains('Unforgettable').should('be.visible');

        // Check the record
        cy.contains('Historic Venues').should('be.visible');
        cy.contains('Countries').should('be.visible');
        cy.contains('Celebrations').should('be.visible');

        // Check the footer
        cy.contains('© 2026 Cypressifier Event Planning.').should('be.visible');
    });

});