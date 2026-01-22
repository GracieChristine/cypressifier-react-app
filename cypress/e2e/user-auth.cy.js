describe(``, () => {
    // Setup variables
    const userEmail = 'testuser@example.com';
    const userPassword = 'password123';
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';

    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();
    });

    describe(`Sign Up Page UI/UX`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-signup-btn"]')
            .click();
         });

        it(`should display brand on navbar`, () => {
            cy.get('[data-cy="nav-brand-name"]')
            .should('have.text', 'Cypressifier')
            .and('be.visible');
        });

        it(`should display footer`, () => {
            cy.get('footer')
            .should('contain', '© 2026 Cypressifier Event Planning. Crafted with excellence.')
            .and('be.visible');
        });

        it(`should display signup form`, () => {
            cy.get('[data-cy="signup-form"]')
            .first()
            .contains('Sign Up')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            .find('label')
            .first()
            .should('have.text', 'Email')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            .find('input')
            .eq(0)
            .should('have.attr', 'data-cy', 'signup-email')
            .should('have.attr', 'placeholder', 'john.doe@example.com')
            .should('be.empty')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            .find('label')
            .eq(1)
            .should('have.text', 'Password')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            .find('input')
            .eq(1)
            .should('have.attr', 'data-cy', 'signup-password')
            .should('have.attr', 'placeholder', '••••••••')
            .should('be.empty')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            .find('label')
            .last()
            .should('have.text', 'Confirm Password')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            .find('input')
            .eq(2)
            .should('have.attr', 'data-cy', 'signup-confirm-password')
            .should('have.attr', 'placeholder', '••••••••')
            .should('be.empty')
            .and('be.visible');

            cy.get('[data-cy="signup-submit"]')
            .should('have.text', 'Sign Up')
            .and('be.visible');

            cy.contains('Already have an account? Login')
            .and('be.visible');

            cy.get('[data-cy="signup-login-link"]')
            .should('have.attr', 'href', '/login')
        });

        it(`should navigate back to landing page`, () => {
            cy.get('[data-cy="nav-brand-name"]')
            .click();

            cy.url()
            .should('contain', '/');
        });

        it(`should navigate to login page`, () => {
            it(`should navigate back to landing page`, () => {
            cy.get('[data-cy="signup-login-link"]')
            .click();

            cy.url()
            .should('contain', '/login');
        });
        });
    });

    describe(`Sign Up Form Validation`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-signup-btn"]')
            .click();
         });

        it(`should show error when email is invalid`, () => {
            cy.get('[data-cy="signup-email"]')
            .type('notavalidemail');
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="email-error"]')
            .should('have.text', 'Please enter a valid email address')
            .and('be.visible');
        });

        it(`should show error when email is not enter`, () => {
            cy.get('[data-cy="signup-email"]')
            .should('be.empty');
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="email-error"]')
            .should('have.text', 'Email is required')
            .and('be.visible');
        });

        it(`should show error when password is invalid`, () => {
            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type('short');
            cy.get('[data-cy="signup-confirm-password"]')
            .type('short');

            cy.get('form')
            .submit();

            cy.get('[data-cy="password-error"]')
            .should('have.text', 'Password must be at least 6 characters')
            .and('be.visible');
        });

        it(`should show error when password is not enter`, () => {
            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .should('be.empty');
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="password-error"]')
            .should('have.text', 'Password is required')
            .and('be.visible');
        });

        it(`should show error when confirm password is not matching`, () => {
            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type('123password');

            cy.get('form')
            .submit();

            cy.get('[data-cy="confirm-password-error"]')
            .should('have.text', 'Passwords do not match')
            .and('be.visible');
        });

        it(`should show error when confirm password is not enter`, () => {
            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .should('be.empty');

            cy.get('form')
            .submit();

            cy.get('[data-cy="confirm-password-error"]')
            .should('have.text', 'Please confirm your password')
            .and('be.visible');
        });

        it(`should show error when email is register already`, () => {
            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="nav-logout-btn"]').click();

            cy.get('[data-cy="landing-signup-btn"]')
            .click();

            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="email-error"]')
            .should('have.text', 'User already exists. Please login.')
            .and('be.visible');
        });
    });

    describe(`Sign Up and Navigate to Dashboard`, () => {
        beforeEach(() => {

         });

        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });
    });

    describe(`Log In Page UI`, () => {
        beforeEach(() => {

         });

        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });
    });

    describe(`Log In and to Dashboard`, () => {
        beforeEach(() => {

         });

        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });

        it(``, () => {

        });
    });
});