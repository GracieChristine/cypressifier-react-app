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

    describe(`User Sign Up`, () => {
        beforeEach(() => {
            // Navigate to signup
            cy.get('[data-cy="hero-signup-btn"]').click();
        });

        it(`should successfully sign up and log out a new user`, () => {
            cy.signupUser(userEmail, userPassword);
            
            // Should redirect to user dashboard
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Overview of your events').should('be.visible');

            cy.logout();
        });

        it(`should show error when email exist already`, () => {
            cy.signupUser(userEmail, userPassword);

            cy.logout();

            // Navigate to signup again
            cy.get('[data-cy="hero-signup-btn"]').click();

            cy.signupUser(userEmail, userPassword);
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('be.visible').and('have.text', 'User already exists. Please login.');
        });

        it(`should show error when email is invalid`, () => {
            cy.signupUser('notanemail', userPassword);
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('be.visible').and('have.text', 'Please enter a valid email address');
        });

        // passwor is invalid if less than 6 charcter/number
        it(`should show error when password is invalid`, () => {
            cy.signupUser(userEmail, 'short');
            
            // Should show error
            cy.get('[data-cy="password-error"]').should('be.visible').and('have.text', 'Password must be at least 6 characters');
        });

        it(`should show error when passwords not matching`, () => {
            cy.signupUser(userEmail, userPassword, 'password456');
            
            // Should show error
            cy.get('[data-cy="confirm-password-error"]').should('be.visible').and('have.text', 'Passwords do not match');
        });

        it(`should show error when email not input`, () => {
            // Fill in sign in form
            cy.get('[data-cy="email-input"]').should('be.empty');
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);

            // Submit
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="email-error"]').should('be.visible').and('have.text', 'Email is required');
        });

        it(`should show error when password not input`, () => {
            // Fill in sign in form
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').should('be.empty');
            cy.get('[data-cy="confirm-password-input"]').type(userPassword);

            // Submit
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="password-error"]').should('be.visible').and('have.text', 'Password is required');
        });

        it(`should show error when confirm password not input`, () => {
            // Fill in sign in form
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').type(userPassword);
            cy.get('[data-cy="confirm-password-input"]').should('be.empty');

            // Submit
            cy.get('[data-cy="signup-submit"]').click();
            
            // Should show error
            cy.get('[data-cy="confirm-password-error"]').should('be.visible').and('have.text', 'Please confirm your password');
        });
    });

    describe('User Log In', () => {
        beforeEach(() => {
            // Create a new user first
            cy.get('[data-cy="hero-signup-btn"]').click();
            cy.signupUser(userEmail, userPassword);
            cy.logout();

            // Navigate to login
            cy.get('[data-cy="hero-login-btn"]').click();
        });

        it(`should succesfully log in and log out existing user`, () => {
            cy.loginUser(userEmail, userPassword);
            
            // Should redirect to user dashboard
            cy.contains('Dashboard').should('be.visible');
            cy.contains('Overview of your events').should('be.visible');

            cy.logout();
        });

        it(`should show error when user not existing`, () => {
            cy.loginUser('anothertestuser@example.com', userPassword);

            // Should show error
            cy.get('[data-cy="email-error"]').should('be.visible').and('have.text', 'User not found. Please sign up first.');
        });

        it(`should show error when password not correct`, () => {
            cy.loginUser(userEmail, 'password456');

            // Should show error
            cy.get('[data-cy="password-error"]').should('be.visible').and('have.text', 'Incorrect password');
        });

        it(`should show error when email invalid`, () => {
            cy.loginUser('testuser@invalid', userPassword);

            // Should show error
            cy.get('[data-cy="email-error"]').should('be.visible').and('have.text', 'Please enter a valid email address');
        });

        it(`should show error when email not input`, () => {
            // Fill in login form, excluding email
            cy.get('[data-cy="email-input"]').should('be.empty');
            cy.get('[data-cy="password-input"]').type(userPassword);

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="email-error"]').should('be.visible').and('have.text', 'Email is required');

        });

        it(`should show error when password not input`, () => {
            // Fill in login form, excluding password
            cy.get('[data-cy="email-input"]').type(userEmail);
            cy.get('[data-cy="password-input"]').should('be.empty');

            // Log in
            cy.get('[data-cy="login-submit"]').click();

            // Should show error
            cy.get('[data-cy="password-error"]').should('be.visible').and('have.text', 'Password is required');
        });
    });

    describe('Admin Login', () => {
        beforeEach(() => {
            // Navigate to login
            cy.get('[data-cy="hero-login-btn"]').click();
        });

        it(`should succesfully log in and log out as admin`, () => {
            cy.loginUser(adminEmail, adminPassword);
            
            // Should redirect to admin dashboard
            cy.contains('Admin Dashboard').should('be.visible');
            cy.contains('Manage all events').should('be.visible');

            cy.logout();
        });

        it(`should show error when password not correct`, () => {
            cy.loginUser(adminEmail, 'admin456');

            // Should show error
            cy.get('[data-cy="password-error"]').should('be.visible').and('have.text', 'Incorrect password');
        });
    });
});