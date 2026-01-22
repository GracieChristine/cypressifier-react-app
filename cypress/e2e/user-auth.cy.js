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
            .should('have.attr', 'href', '/')
            .and('be.visible');
        });

        it(`should display footer`, () => {
            cy.get('footer')
            .should('have.text', '© 2026 Cypressifier Event Planning. Crafted with excellence.')
            .and('be.visible');
        });

        it(`should display signup form - general`, () => {
            cy.get('[data-cy="signup-form"]')
            .first()
            .should('contain', 'Sign Up')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            cy.should('contain', 'Already have an account? Login')
            .and('be.visible');

            cy.get('[data-cy="signup-form"]')
            cy.get('[data-cy="signup-login-link"]')
            .should('have.attr', 'href', '/login');
        });

        it(`should display signup form - email`, () => {
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

            cy.get('[data-cy="email-error]')
            .and('not.exist');
        });

        it(`should display signup form - password`, () => {
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

            cy.get('[data-cy="password-error]')
            .and('not.exist');
        });

        it(`should display signup form - confirm password`, () => {
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

            cy.get('[data-cy="confirm-password-error]')
            .and('not.exist');
        });

        it(`should display signup form - button`, () => {
            cy.get('[data-cy="signup-submit"]')
            .should('have.text', 'Sign Up')
            .and('be.visible');
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

        it(`should show error when user is register already`, () => {
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
            cy.get('[data-cy="landing-signup-btn"]')
            .click();
         });

        it(`should signed in and navigate to user dashboard`, () => {
            cy.get('[data-cy="signup-email"]')
            .type(userEmail);
            cy.get('[data-cy="signup-password"]')
            .type(userPassword);
            cy.get('[data-cy="signup-confirm-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.url()
            .should('include', '/dashboard');
        });
    });

    describe(`Log In Page UI`, () => {
        beforeEach(() => {
            cy.get('[data-cy="landing-login-btn"]')
            .click();
         });

        it(`should display brand on navbar`, () => {
            cy.get('[data-cy="nav-brand-name"]')
            .should('have.text', 'Cypressifier')
            .should('have.attr', 'href', '/')
            .and('be.visible');
        });

        it(`should display footer`, () => {
            cy.get('footer')
            .should('have.text', '© 2026 Cypressifier Event Planning. Crafted with excellence.')
            .and('be.visible');
        });

        it(`should display login form - general`, () => {
            cy.get('[data-cy="login-form"]')
            .find('p:first-child')
            .should('contain', 'Login')
            .and('be.visible');

            cy.get('[data-cy="login-form"]')
            cy.should('contain', 'Don\'t have an account? Sign up')
            .and('be.visible');

            cy.get('[data-cy="login-form"]')
            cy.get('[data-cy="login-signup-link"]')
            .should('have.attr', 'href', '/signup');
        });

        it(`should display login form - email`, () => {
            cy.get('[data-cy="login-form"]')
            .find('label')
            .eq(0)
            .should('have.text', 'Email')
            .and('be.visible');

            cy.get('[data-cy="login-form"]')
            .find('input')
            .eq(0)
            .should('have.attr', 'data-cy', 'login-email')
            .should('have.attr', 'placeholder', 'john.doe@example.com')
            .should('be.empty')
            .and('be.visible');

            cy.get('[data-cy="email-error]')
            .and('not.exist');
        });

        it(`should display login form - password`, () => {
            cy.get('[data-cy="login-form"]')
            .find('label')
            .eq(1)
            .should('have.text', 'Password')
            .and('be.visible');

            cy.get('[data-cy="login-form"]')
            .find('input')
            .eq(1)
            .should('have.attr', 'data-cy', 'login-password')
            .should('have.attr', 'placeholder', '••••••••')
            .should('be.empty')
            .and('be.visible');

            cy.get('[data-cy="password-error]')
            .and('not.exist');
        });

        it(`should display login form - button`, () => {
            cy.get('[data-cy="login-form"]')
            .find('button')
            .should('have.text', 'Login')
            .should('have.attr', 'data-cy', 'login-submit')
            .and('be.visible');
        });
    });

    describe(`Log In Form Validation`, () => {
        beforeEach(() => {
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

            cy.get('[data-cy="nav-logout-btn"]').click();

            cy.get('[data-cy="landing-login-btn"]')
            .click();
         });

        it(`should show error when email is invalid`, () => {
            cy.get('[data-cy="login-email"]')
            .type('notavalidemail');
            cy.get('[data-cy="login-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="email-error"]')
            .should('have.text', 'Please enter a valid email address')
            .and('be.visible');
        });

        it(`should show error when email is not enter `, () => {
            cy.get('[data-cy="login-email"]')
            .should('be.empty');
            cy.get('[data-cy="login-password"]')
            .type(userPassword);

            cy.get('form')
            .submit();

            cy.get('[data-cy="email-error"]')
            .should('have.text', 'Email is required')
            .and('be.visible');
        });

        it(`should show error when password is invalid`, () => {
            cy.get('[data-cy="login-email"]')
            .type(userEmail);
            cy.get('[data-cy="login-password"]')
            .type('short');

            cy.get('form')
            .submit();

            cy.get('[data-cy="password-error"]')
            .should('have.text', 'Password must be at least 6 characters')
            .and('be.visible');
        });
        
        it(`should show error when password is incorrect`, () => {
            cy.get('[data-cy="login-email"]')
            .type(userEmail);
            cy.get('[data-cy="login-password"]')
            .type('123password');

            cy.get('form')
            .submit();

            cy.get('[data-cy="password-error"]')
            .should('have.text', 'Incorrect password')
            .and('be.visible');
        });

        it(`should show error when password is not enter`, () => {
            cy.get('[data-cy="login-email"]')
            .type(userEmail);
            cy.get('[data-cy="login-password"]')
            .should('be.empty')

            cy.get('form')
            .submit();

            cy.get('[data-cy="password-error"]')
            .should('have.text', 'Password is required')
            .and('be.visible');
        });

        it(`should show error when user is not register yet`, () => {
            cy.get('[data-cy="login-email"]')
            .type('anotheruser@gexample.com');
            cy.get('[data-cy="login-password"]')
            .type('password456');

            cy.get('form')
            .submit();

            cy.get('[data-cy="email-error"]')
            .should('have.text', 'User not found. Please sign up first.')
            .and('be.visible');
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

    describe(`Log Out and back to Landing Page`, () => {
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