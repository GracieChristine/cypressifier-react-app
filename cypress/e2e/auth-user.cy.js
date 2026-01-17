describe('User Authentication', () => {
    // Setup variables
        const userEmail = 'testuser@example.com';
        const userPassword = 'password123';
        const adminEmail = 'admin@cypressifier.com';
        const adminPassword = 'admin123';

    // Visit the app and clear storage before each test
    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    describe('User Sign Up', () => {
        beforeEach(() => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();
        });

        it('should successfully sign up and log out a new user', () => {
            // Fill in signup form
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);
            
            // Submit
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should redirect to user dashboard
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Overview of your events').should('be.visible');

            // Logout
            cy.get('[data-cy="logout-btn"]').click();
        });

        it('should show error when email exist already', () => {
            // Fill in signup form
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();

            // Log out
            cy.get('[data-cy="logout-btn"]').click();

            // Navigate to signup again
            cy.get('[data-cy="hero-signup-btn"]').click();

            // Fill in signup form again
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);

            // Sign up again
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'User already exists. Please login.');
        });

        it('should show error when email is invalid', () => {
            // Fill in signup form, with invalid email
            cy.get('[data-cy="email-input"]').type('notanemail');
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'valid email');
        });

        it('should show error when password is invalid', () => {
            // Fill in signup form, with not matching password
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type('short');
            cy.get('[data-cy="confirm-password-input"]').type('short');
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Password must be at least 6 characters');
        });

        it('should show error when passwords do not match', () => {
            // Fill in signup form, with not matching password
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type('password456');
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="confirm-password-error"]').should('contain', 'Passwords do not match');
        });

        it('should show error when require email is missing', () => {
            // Fill in signup form, excluding email
            cy.get('[data-cy="email-input"]').should('be.empty');
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type('differentpassword');
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'Email is required');
        });

        it('should show error when require password is missing', () => {
            // Fill in signup form, excluding password
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').should('be.empty');
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Password is require');
        });

        it('should show error when require confirm password is missing', () => {
            // Fill in signup form, excluding confirm password
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').should('be.empty');
            
            // Sign up
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="confirm-password-error"]').should('contain', 'Please confirm your password');
        });
    });

    describe('User Log In', () => {
        beforeEach(() => {
            // Create a new user first
            cy.get('[data-cy="hero-signup-btn"]').click();
            cy.get('[data-cy="email-input"]').type(userEmail)
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);
            cy.get('[data-cy="signup-submit"]').click();
            
            // Logout
            cy.get('[data-cy="logout-btn"]').click();

            // Navigate to login
            cy.get('[data-cy="hero-login-btn"]').click();
        });

        it('should succesfully log in and log out existing user', () => {
            // Fill in login form
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);

            cy.get('[data-cy="login-submit"]').click();
            
            // Should redirect to user dashboard
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Overview of your events').should('be.visible');

            // Logout
            cy.get('[data-cy="logout-btn"]').click();
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

        it('should show error when password is incorrect', () => {
            // Fill in login form
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type('123password');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Incorrect password');
        });

        it('should show error when email invalid', () => {
            // Fill in login form
            cy.get('[data-cy="email-input"]').type('testuser@invalid');
            cy.get('[data-cy="password-input"]').type(userPassword);

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'Please enter a valid email address');
        });

        it('should show error when require email is missing', () => {
            // Fill in login form, excluding email
            cy.get('[data-cy="email-input"]').should('be.empty');
            cy.get('[data-cy="password-input"]').type(userPassword);

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="email-error"]').should('contain', 'Email is required');

        });

        it('should show error when require password is missing', () => {
            // Fill in login form, excluding password
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').should('be.empty');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Password is required');
        });
    });

    describe('Admin Login', () => {
        beforeEach(() => {
            // Navigate to login
            cy.get('[data-cy="hero-login-btn"]').click();
        });

        it('should succesfully log in and log out as admin ', () => {
            // Fill in login form
            cy.get('[data-cy="email-input"]').type(adminEmail);
            cy.get('[data-cy="password-input"]').type(adminPassword);

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should redirect to admin dashboard
            cy.contains('Admin Dashboard').should('be.visible');
            cy.contains('Manage all events').should('be.visible');

            // Logout
            cy.get('[data-cy="logout-btn"]').click();
        });

        it('should show error when password is incorrect', () => {
            // Fill in login form
            cy.get('[data-cy="email-input"]').type(adminEmail);
            cy.get('[data-cy="password-input"]').type('123admin');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="password-error"]').should('contain', 'Incorrect password');
        });
    });
});