describe('Slash Page', () => {
    // Visit the app and clear storage before each test
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    describe('Splash Page UI/UX', () => {
        it('should display brand', () => {
            cy.contains('Cypressifier').should('be.visible');
            cy.contains('European Estate Events').should('be.visible');
            cy.contains('Castles').should('be.visible');
            cy.contains('Châteaux').should('be.visible');
            cy.contains('Palaces').should('be.visible');
            cy.contains('Manor Houses').should('be.visible');
        });
        it('should display tagline & offering', () => {
            cy.contains('Create extraordinary moments').should('be.visible');
            cy.contains('Curated Selection').should('be.visible');
            cy.contains('Bespoke Service').should('be.visible');
            cy.contains('Unforgettable').should('be.visible');
        });
        it('should display buttons', () => {
            cy.get('[data-cy="hero-signup-btn"]').should('be.visible').and('contain', 'Begin Your Journey');
            cy.get('[data-cy="hero-login-btn"]').should('be.visible').and('contain', 'Log In');
        });
        it('should display statistics', () => {
            cy.contains('Historic Venues').should('be.visible');
            cy.contains('Countries').should('be.visible');
            cy.contains('Celebrations').should('be.visible');
        });
        it('should display footter', () => {
            cy.contains('© 2026 Cypressifier Event Planning.').should('be.visible');
        });
    });

    describe('Splash Page Navigate to Sign Up Page', () => {
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

            // Check navbar
            cy.contains('Cypressifier').should('be.visible');
            cy.get('[data-cy="nav-login"]').should('be.visible');
            cy.get('[data-cy="nav-signup"]').should('be.visible');

            // Check footer
            cy.contains('© 2026 Cypressifier Event Planning.').should('be.visible');

            // Navigating back to splash page
            cy.contains('Cypressifier').click();
        });
    });

    describe('Splash Page Navigate to Log In Page', () => {
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

            // Check navbar
            cy.contains('Cypressifier').should('be.visible');
            cy.get('[data-cy="nav-login"]').should('be.visible');
            cy.get('[data-cy="nav-signup"]').should('be.visible');

            // Check footer
            cy.contains('© 2026 Cypressifier Event Planning.').should('be.visible');

            // Navigating back to splash page
            cy.contains('Cypressifier').click();
        });
    });
});