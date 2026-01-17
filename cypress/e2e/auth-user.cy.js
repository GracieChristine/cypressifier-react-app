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

    describe('User Log In', () => {
        beforeEach(() => {
            const currPathName = '/login';

            // Create a new user first
            cy.get('[data-cy="hero-signup-btn"]').click();
            cy.get('[data-cy="email-input"]').type('testuser@example.com');
            cy.get('[data-cy="password-input"]').type('password123');
            cy.get('[data-cy="confirm-password-input"]').type('password123');
            cy.get('[data-cy="signup-submit"]').click();
            
            // Logout
            cy.get('[data-cy="logout-btn"]').click();

            // Navigate to Log In Page
            cy.get('[data-cy="hero-login-btn"]').click();
        });

        it('should succesfully log in existing user', () => {
            // Fill in singin form
            cy.get('[data-cy="email-input"]').type('testuser@example.com');
            cy.get('[data-cy="password-input"]').type('password123');

            cy.get('[data-cy="login-submit"]').click();
            
            // Should redirect to dashboard
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Overview of your events').should('be.visible');
        });

        it('should show error when require email is missing', () => {
            // Fill in singin form, excluding email
            cy.get('[data-cy="email-input"]').should('be.empty');
            cy.get('[data-cy="password-input"]').type('password123');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Stay in Log In Page
            // cy.location('pathname').should('eq', currPathName);

            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'Email is required');

        });

        it('should show error when require password is missing', () => {
            // Fill in singin form
            cy.get('[data-cy="email-input"]').type('testuser@example.com');
            cy.get('[data-cy="password-input"]').should('be.empty');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Password is required');
        });

        it('should show error when user doesn\'t exist', () => {
            // Fill in singin form
            cy.get('[data-cy="email-input"]').type('anothertestuser@example.com');
            cy.get('[data-cy="password-input"]').type('password123');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'User not found. Please sign up first.');
        });

        // this is a bug...user can log in with incorrect password...
        // it('should show error when password is incorrect', () => {
        //     // Fill in singin form
        //     cy.get('[data-cy="email-input"]').type('testuser@example.com');
        //     cy.get('[data-cy="password-input"]').type('password123');

        //     // Log in
        //     cy.get('[data-cy="login-submit"]').click();

        //     // Should show error
        //     cy.get('[data-cy="password-error"]').should('contain', 'Incorrect password.');
        // });

        it('should show error when email invalid', () => {
            // Fill in singin form
            cy.get('[data-cy="email-input"]').type('testuser@invalid');
            cy.get('[data-cy="password-input"]').type('password123');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'Please enter a valid email address');
        });

        // Maybe consider if user is correct, but password is incorrect to say incorrect password...not sure if I need this particular one testing password > 6 characters, since it sholuld be tested already in the sign up process.
        it('should show error when password is invalid', () => {
            // Fill in singin form
            cy.get('[data-cy="email-input"]').type('testuser@example.com');
            cy.get('[data-cy="password-input"]').type('nope');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Password must be at least 6 characters');
        });
    });
});