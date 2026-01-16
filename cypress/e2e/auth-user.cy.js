describe('User Authentication', () => {
    // Visit the app and clear storage before each test
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    describe('User Sign Up', () => {
        it('should successfully sign up a new user', () => {
        // Navigate to signup
        cy.get('[data-cy="hero-signup-btn"]').click();
        
        // Fill in signup form
        cy.get('[data-cy="email-input"]').type('testuser@example.com');
        cy.get('[data-cy="password-input"]').type('password123');
        cy.get('[data-cy="confirm-password-input"]').type('password123');
        
        // Submit
        cy.get('[data-cy="signup-submit"]').click();
        
        // Should redirect to dashboard
        cy.contains('Dashboard').should('be.visible');
        cy.contains('Overview of your events').should('be.visible');
        });

        it('should show error when require email is missing', () => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();

            // Fill in signup form, excluding email
            cy.get('[data-cy="password-input"]').type('password123');
            cy.get('[data-cy="confirm-password-input"]').type('differentpassword');
            
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'Email is required');
        });

        it('should show error when require password is missing', () => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();

            // Fill in signup form, excluding password
            cy.get('[data-cy="email-input"]').type('testuser@example.com');
            cy.get('[data-cy="confirm-password-input"]').type('password456');
            
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Password is require');
        });

        it('should show error when require confirm password is missing', () => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();

            // Fill in signup form, excluding confirm password
            cy.get('[data-cy="email-input"]').type('testuser@example.com');
            cy.get('[data-cy="password-input"]').type('password123');
            
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="confirm-password-error"]').should('contain', 'Please confirm your password');
        });

        it('should show error when email is invalid', () => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();
      
            // Fill in signup form, with invalid email
            cy.get('[data-cy="email-input"]').type('notanemail');
            cy.get('[data-cy="password-input"]').type('password123');
            cy.get('[data-cy="confirm-password-input"]').type('password123');
            
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'valid email');
        });

        it('should show error when passwords do not match', () => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();
            
            // Fill in signup form, with not matching password
            cy.get('[data-cy="email-input"]').type('test@example.com');
            cy.get('[data-cy="password-input"]').type('password123');
            cy.get('[data-cy="confirm-password-input"]').type('password456');
            
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="confirm-password-error"]').should('contain', 'Passwords do not match');
        });
    });
});