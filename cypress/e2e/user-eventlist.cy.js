describe(`Everlisting Page`, () => {
    const userEmail = 'testuser@example.com';
    const userPassword = 'admin123';
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';

  beforeEach(() => {
        cy.clearLocalStorage();
        cy.visit('http://localhost:5173');

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
  });

  describe(`EventListing - UI Smoke`, () => {
    beforeEach(() => {
      cy.url()
      .should('contain', '/user/events');

      cy.get('[data-cy="dev-panel-expand-btn"]')
      .click();
      cy.get('[data-cy="dev-panel-add-event-btn"]')
      .click();
      cy.get('[data-cy="dev-panel-collapse-btn"]')
      .click();
    });

    it(`should display user identity in navbar`, () => {
          cy.get('[data-cy="nav-brand-name"]')
          .should('contain', 'Cypressifier');
          cy.get('[data-cy="nav-user-role"]')
          .should('contain', 'User');
          cy.get('[data-cy="nav-user-email"]')
          .should('contain', userEmail);
          cy.get('[data-cy="nav-logout-btn"]')
          .should('contain', 'Logout')
    });
    
    it(`should render eventlist header`, () => {
          cy.get('[data-cy="eventlist-header"]')
          .should('contain', 'My Events')
          .and('contain', 'Manage and track all your events');
    });

    it(`should render create event button`, () => {
      cy.get('[data-cy="eventlist-header"]')
      .within(() => {
        cy.get('[data-cy="eventlist-create-event-btn"]').should('contain', 'Create Event');
      });
    });

    it(`should render budget stat`, () => {
      cy.get('[data-cy="eventlist-stat"]')
      .should('be.visible');

      cy.get('[data-cy="eventlist-stat"]')
      .within(() => {
        cy.get('[data-cy="eventlist-stat-box"]')
        .should('have.length.at.least', 1)
      });
    });

    it(`should render upcoming events`, () => {
      cy.get('body').then($body => {
        if ($body.find('[data-cy="eventlist-events-upcoming"]').length) {
          cy.get('[data-cy="eventlist-events-upcoming"]').should('be.visible');
        }
      });
    });

    it(`should render event filter`, () => {
      cy.get('[data-cy="eventlist-event-list"]')
      .should('be.visible');

      cy.get('[data-cy="eventlist-filter"]')
      .within(() => {
        cy.get('button')
        .should('have.length.at.least', 1);
      });
      
    });

    it(`should render event list`, () => {
      cy.get('[data-cy="eventlist-events"]')
      .should('be.visible');
    });
  });

  // describe(`EventListing - User Loads Mock Events`, () => {
  //   beforeEach(() => {
  //     cy.url()
  //     .should('contain', '/user/events');

  //     cy.get('[data-cy="dev-panel-expand-btn"]')
  //     .click();
  //     cy.get('[data-cy="dev-panel-add-event-btn"]')
  //     .click();
  //     cy.get('[data-cy="dev-panel-collapse-btn"]')
  //     .click();
  //   });
    
  //   it(`should update budget stat`, () => {

  //   });
    
  //   it(`should update event filter`, () => {
      
  //   });

  //   it(`should render event entries`, () => {

  //   });
  // });

  // describe(`EventListing - User Clears Own Mock Events`, () => {
  //   beforeEach(() => {

  //   });
    
  //   it(``, () => {

  //   });
    
  //   it(``, () => {
      
  //   });
  // });

  // describe(`EventListing - User Creates New Event`, () => {
  //   beforeEach(() => {

  //   });
    
  //   it(``, () => {

  //   });
    
  //   it(``, () => {
      
  //   });
  // });

  // describe(`EventListing - User Edits Existing Event`, () => {
  //   beforeEach(() => {

  //   });
    
  //   it(``, () => {

  //   });
    
  //   it(``, () => {
      
  //   });
  // });

  // describe(`EventListing - User Requests Existing Event Cancellation`, () => {
  //   beforeEach(() => {

  //   });
    
  //   it(``, () => {

  //   });
    
  //   it(``, () => {
      
  //   });
  // });
});