describe(`User Experience Flow`, () => {
  // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';

  describe(`User Auth.`, () => {
    before(() => {
      cy.clearCacheLoadLanding();
    });

    it(`should navigate to /signup`, () => {
      cy.landingToSignup();
    });

    it(`should error out with no email`, () => {
      cy.userSignupError('', userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'Email is required')
      .and('be.visible');
    });

    it(`should error out with an invalid email`, () => {
      cy.userSignupError('invalid@email', userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'Please enter a valid email address')
      .and('be.visible');
    });

    it(`should error out with no password`, () => {
      cy.userSignupError(userEmail, '', '');

      cy.get('[data-cy="signup-password-error"]')
      .should('exist')
      .should('contain', 'Password is required')
      .and('be.visible');
    });

    it(`should error out with an invalid password`, () => {
      cy.userSignupError(userEmail, 'short', 'short');

      cy.get('[data-cy="signup-password-error"]')
      .should('exist')
      .should('contain', 'Password must be at least 6 characters')
      .and('be.visible');
    });

    it(`should error out with no confirm password`, () => {
      cy.userSignupError(userEmail, userPassword, '');

      cy.get('[data-cy="signup-confirm-password-error"]')
      .should('exist')
      .should('contain', 'Please confirm your password')
      .and('be.visible');
    });

    it(`should error out with no matching confirm password`, () => {
      cy.userSignupError(userEmail, userPassword, '123user');

      cy.get('[data-cy="signup-confirm-password-error"]')
      .should('exist')
      .should('contain', 'Passwords do not match')
      .and('be.visible');
    });

    it(`should signup as user and navigate to /user/events`, () => {
      cy.userSignup(userEmail, userPassword, userPassword);
    });

    it(`should logout as user and navigate back to /`, () => {
      cy.userLogout();
    });

    it(`should navigate to /singup again`, () => {
      cy.landingToSignup();
    });

    it(`should error out with existing admin email`, () => {
      cy.userSignupError(adminEmail, userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'User already exists. Please login.')
      .and('be.visible');
    });

    it(`should error out with existing user email`, () => {
      cy.userSignupError(adminEmail, userPassword, userPassword);

      cy.get('[data-cy="signup-email-error"]')
      .should('exist')
      .should('contain', 'User already exists. Please login.')
      .and('be.visible');
    });

    it(`should navigate to /login`, () => {
      cy.signupToLogin();
    });

    it(`should error out with no email`, () => {
      cy.userLoginError('', userPassword);
    });

    it(`should error out with invalid email`, () => {
      cy.userLoginError('invalid@email', userPassword);
    });

    it(`should error out with non-existing email`, () => {
      cy.userLoginError('nonexisting@gmeta.com', userPassword);
    });

    it(`should error out with no password`, () => {
      cy.userLoginError(userEmail, '');
    });

    it(`should error out with invalid password`, () => {
      cy.userLoginError(userEmail, 'short');
    });

    it(`should error out with incorrect password`, () => {
      cy.userLoginError(userEmail, '123user');
    });

    it(`should login as user and navigate to /user/events`, () => {
      cy.userLogin(userEmail, userPassword);
    });

    it(`should logout as user and navigate back to /`, () => {
      cy.userLogout();
    });
  });

  describe(`User Event Mgmt.`, () => {
    describe(`User Creating New Event`, () => {
      before(() => {

      });

      it(`FAILED CASES....create event error`, () => {

      });

      it(`should create new event`, () => {

      });

      it(`should cancel creating new event`, () => {

      });
    });

    describe(`User Submitting Event Cancellation Request`, () => {
      before(() => {

      });

      it(`FAILED CASES....cancel request submission error`, () => {

      });

      it(`should submit event cancel request`, () => {

      });

      it(``, () => {

      });

      it(``, () => {

      });
    });

    // describe(``, () => {
    //   before(() => {

    //   });

    //   it(``, () => {

    //   });

    //   it(``, () => {

    //   });

    //   it(``, () => {

    //   });

    //   it(``, () => {

    //   });
    // });
  });

  describe(`User with Mock Event Seeding`, () => {
    before(() => {

    });

    it(`should display 1 event from user`, () => {

    });

    it(`should display 30 mock events from user`, () => {

    });

    it(`sbould not display 30 mock events from admin`, () => {

    });

    it(`should clear user's mock events, leaving the 1 event created by the user`, () => {

    });

    it(`should still display 30 mock events from admin if login as admin`, () => {

    });
  });

});