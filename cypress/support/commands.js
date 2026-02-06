// Initalize Related Commands
Cypress.Commands.add(`clearCacheLoadLanding`, () => {
    // cy.visit('http://localhost:5173', {
    //     onBeforeLoad(win) {
    //         win.localStorage.clear();
    //         win.sessionStorage.clear();
    //     }
    // })

    cy.clearLocalStorage();
    cy.visit('http://localhost:5173');
});

// Navigation Related Commands
Cypress.Commands.add(`landingToSignup`, () => {
    cy.get('[data-cy="landing-signup-btn"]')
    .click();

    cy.url()
    .should('contain','/signup');
});

Cypress.Commands.add(`landingToLogin`, () => {
    cy.get('[data-cy="landing-login-btn"]')
    .click();

    cy.url()
    .should('contain','/login');
});

Cypress.Commands.add(`returnToLanding`, () => {
    cy.get('[data-cy="nav-brand-link"]')
    .click();
    
    cy.url()
    .should('eq','http://localhost:5173/');
});

Cypress.Commands.add(`signupToLogin`, () => {
    cy.get('[data-cy="signup-login-link"]')
    .click();
    
    cy.url()
    .should('contain','/login');
});

Cypress.Commands.add(`loginToSignup`, () => {
    cy.get('[data-cy="login-signup-link"]')
    .click();
    
    cy.url()
    .should('contain','/signup');
});

// Cypress.Commands.add(``, () => {
//     // dashboard table entry action button
//         // there is 1 button
//         // depending on the button name, it will navigate to different page
// });

// Cypress.Commands.add(`adminEventViewToDashboard`, () => {
//     cy.get('[data-cy="return-dashboard-btn"]')
//     .click();

//     cy.url()
//     .should('contain','/admin/dashboard');
// });

// Cypress.Commands.add(`userEventListToEventFormNew`, () => {
//     cy.get('[data-cy="evenlist-create-event-btn"]')
//     .click();

//     cy.url()
//     .should('contain','/user/events/new');
// });



// User Auth Related Commands
Cypress.Commands.add(`userSignup`, (email, password, confirmPass = null) => {
    // cy.clearCacheLoadLanding();
    // cy.landingToSignup();

    // Fill in signup form
    cy.get('[data-cy="signup-email-input"]')
    .type(email);
    cy.get('[data-cy="signup-password-input"]')
    .type(password);
    cy.get('[data-cy="signup-confirm-password-input"]')
    .type(confirmPass || password);

    // Submit signup form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/user/events');
});

// Need to consider, with different user input (admin/user), to navigate to different link.
Cypress.Commands.add(`userLogin`, (email, password) => {
    // cy.clearCacheLoadLanding();
    // cy.landingToLogin();

    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .type(email);
    cy.get('[data-cy="login-password-input"]')
    .type(password);

    // Submit login form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/user/events');
});

// Need to consider, with different user input (admin/user), to navigate to different link.
Cypress.Commands.add(`adminLogin`, (email, password) => {
    // cy.clearCacheLoadLanding();
    // cy.landingToLogin();

    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .type(email);
    cy.get('[data-cy="login-password-input"]')
    .type(password);

    // Submit login form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/admin/dashboard');
});

Cypress.Commands.add(`userLogout`, () => {
    cy.get('[data-cy="nav-logout-btn"]')
    .click();

    cy.url()
    .should('eq','http://localhost:5173/');
});

Cypress.Commands.add(``, () => {

});


// Event Management Related Commands
// Helper function to extract count
const getCountFromText = (text) => {
  const match = text.match(/\((\d+)\)/);
  return match ? Number(match[1]) : 0;
};

Cypress.Commands.add('userGetOneFilterCount', (filter) => {
  return cy.get(filter).invoke('text').then(getCountFromText);
});

Cypress.Commands.add('adminGetOneStatusCount', (status) => {
  return cy.contains('[data-cy="dashboard-status-box"]', status)
    .invoke('text')
    .then(getCountFromText);
});

Cypress.Commands.add('userAddNewEvent', (eventName = null) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
  .then((allCount) => {

    cy.get('[data-cy="eventlist-create-event-btn"]')
    .click();

    cy.url()
    .should('contain', '/user/events/new');

    cy.get('[data-cy="eventform-name-input"]')
      .type(eventName || `Test Event ${allCount + 1}`);

    cy.get('[data-cy="eventform-date-input"]')
    .type('2026-06-28');
    cy.get('[data-cy="eventform-location-input"]')
    .type('Garden Estate');
    cy.get('[data-cy="eventform-type-input"]')
    .type('Birthday');
    cy.get('[data-cy="eventform-guestCount-input"]')
    .type('50');
    cy.get('[data-cy="eventform-budget-input"]')
    .clear()
    .type('75000');
    cy.get('[data-cy="eventform-description-input"]')
      .type(`This is test event ${allCount + 1}.`);

    cy.get('form')
    .submit();

    cy.url()
    .should('contain', '/user/events');

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
      .should('eq', allCount + 1);

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
      .should('eq', allCount + 1);
  });
});

Cypress.Commands.add('adminAcceptNewEvent', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Review')
    .then((reviewCount) => {
        cy.adminGetOneStatusCount('In Progress')
        .then((progressCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'In Review')
            .first()
            .within(() => {
                cy.get('[data-cy="dashboard-table-entry-action"]')
                .click();
            });

        cy.url()
        .should('include', '/admin/events/')
        .and('contain', '/edit');

        cy.get('[data-cy="review-new-comment-input"]')
        .should('be.visible')
        .type('After reviewing, we have accepted this request. We will  reach out shortly via email.');

        cy.get('[data-cy="accept-new-event-btn"]')
        .should('be.enabled')
        .click();

        cy.url()
        .should('contain', '/admin/dashboard');

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Review')
        .should('eq', reviewCount - 1);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', progressCount + 1);
        });
    });

  });
  
});

Cypress.Commands.add('adminDeclineNewEvent', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Review')
    .then((reviewCount) => {
        cy.adminGetOneStatusCount('Cancelled')
        .then((cancelledCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'In Review')
            .first()
            .within(() => {
                cy.get('[data-cy="dashboard-table-entry-action"]')
                .click();
            });

        cy.url()
        .should('contain', '/admin/events/')
        .and('contain', '/edit');

        cy.get('[data-cy="review-new-comment-input"]')
            .type('After much consideration, we decided to decline this request.');

        cy.get('[data-cy="decline-new-event-btn"]')
        .should('be.enabled')
        .click();

        cy.url()
        .should('contain', '/admin/dashboard');

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Review')
        .should('eq', reviewCount - 1);
        cy.adminGetOneStatusCount('Cancelled')
        .should('eq', cancelledCount + 1);
        });
    });
  });
});

Cypress.Commands.add('userSendCancellationRequest', () => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]').then((inProgressCount) => {

    cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
      const target = $entries.filter((i, el) => {
        const $el = Cypress.$(el);
        return $el.text().includes('In Progress') && !$el.text().includes('Pending');
      });

      expect(target.length).to.be.greaterThan(0);

      cy.wrap(target.first())
        .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
        .click();
    });

    cy.url()
    .should('contain', '/user/events/event_');

    cy.get('[data-cy="cancel-event-comment-input"]')
      .type('I need to cancel this event due to family reasons.');

    cy.get('[data-cy="cancel-event-submit-btn"]')
    .should('be.enabled')
    .click();

    cy.url().should('contain', '/user/events');

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
      .should('eq', inProgressCount);
  });
});

Cypress.Commands.add('adminAcceptEventCancelRequest', () => {
  cy.adminGetOneStatusCount('All').then((allCount) => {
    cy.adminGetOneStatusCount('In Progress').then((progressCount) => {
        cy.adminGetOneStatusCount('Cancelled').then((cancelledCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'Cancel Request')
            .first()
            .within(() => {
            cy.get('[data-cy="dashboard-table-entry-action"]').click();
            });

        cy.get('[data-cy="review-cancel-comment-input"]')
            .scrollIntoView()
            .type('After much consideration, we\'re unable to cancel this event at this moment.');

        cy.get('[data-cy="accept-cancel-event-btn"]')
        .should('be.enabled')
        .click();

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', progressCount - 1);
        cy.adminGetOneStatusCount('Cancelled')
        .should('eq', cancelledCount + 1);
        });
    });
  });
});

Cypress.Commands.add('adminDeclineEventCancelRequest', () => {
  cy.adminGetOneStatusCount('All').then((allCount) => {
    Cypress.Commands.add('adminAcceptEventCancelRequest', () => {
    cy.adminGetOneStatusCount('In Progress').then((progressCount) => {
        cy.adminGetOneStatusCount('Cancelled').then((cancelledCount) => {

            cy.contains('[data-cy="dashboard-table-entry"]', 'Cancel Request')
                .first()
                .within(() => {
                cy.get('[data-cy="dashboard-table-entry-action"]').click();
                });

            cy.url()
                .should('contain', '/admin/events/')
                .and('contain', '/edit');

              cy.get('[data-cy="review-cancel-comment-input"]')
                .scrollIntoView()
                .type('After much consideration, we\'re unable to cancel this event at this moment.');

            cy.get('[data-cy="accept-cancel-event-btn"]').click();

            cy.adminGetOneStatusCount('All').should('eq', allCount);
            cy.adminGetOneStatusCount('In Progress').should('eq', progressCount);
            cy.adminGetOneStatusCount('Cancelled').should('eq', cancelledCount);
            });
        });
    });
  });
});

Cypress.Commands.add('adminSaveEventAsCompleted', () => {
  cy.get('[data-cy="dashboard-status-box"]')
    .contains('In Progress')
    .invoke('text')
    .then((text) => {
        const inProgressCount = parseInt(text.match(/\((\d+)\)/)[1]);

      cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Progress')
        .invoke('text')
        .then((progressText) => {
          const completedCount = parseInt(progressText.match(/\((\d+)\)/)?.[1] || 0);

          // 🔑 Find FIRST row that is In Progress
          cy.get('[data-cy="dashboard-table-entry"]')
            .contains('In Progress')
            .parents('[data-cy="dashboard-table-entry"]')
            .first()
            .within(() => {
              cy.get('[data-cy="dashboard-table-entry-action"]')
                .should('contain', 'Update')
                .click();
            });

          cy.url()
            .should('contain', '/admin/events/')
            .and('contain', '/edit');

          cy.get('[data-cy="complete-event-checkbox"]')
            .click();

          cy.get('[data-cy="complete-event-comment-input"]')
            .type('All event\'s action items are done successfully. Moving it to complete.');

          cy.get('[data-cy="save-event-update-btn"]').click();

          cy.url().should('contain', '/admin/dashboard');

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('All')
            .should('contain', `(${inProgressCount - 1 + completedCount + 1})`);

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('In Progress')
            .should('contain', `(${inProgressCount - 1})`);

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('Cancelled')
            .should('contain', `(${completedCount + 1})`);
        });
    });
});

Cypress.Commands.add('adminCancelventAsCompleted', () => {
  cy.get('[data-cy="dashboard-status-box"]')
    .contains('In Progress')
    .invoke('text')
    .then((text) => {
        const inProgressCount = parseInt(text.match(/\((\d+)\)/)[1]);

      cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Progress')
        .invoke('text')
        .then((progressText) => {
          const completedCount = parseInt(progressText.match(/\((\d+)\)/)?.[1] || 0);

          // 🔑 Find FIRST row that is In Progress
          cy.get('[data-cy="dashboard-table-entry"]')
            .contains('In Progress')
            .parents('[data-cy="dashboard-table-entry"]')
            .first()
            .within(() => {
              cy.get('[data-cy="dashboard-table-entry-action"]')
                .should('contain', 'Update')
                .click();
            });

          cy.url()
            .should('contain', '/admin/events/')
            .and('contain', '/edit');

          cy.get('[data-cy="complete-event-checkbox"]')
            .click();

          cy.get('[data-cy="complete-event-comment-input"]')
            .type('All event\'s action items are done successfully. Moving it to complete.');

          cy.get('[data-cy="return-dashboard-btn"]').click();

          cy.url().should('contain', '/admin/dashboard');

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('All')
            .should('contain', `(${inProgressCount + completedCount})`);

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('In Progress')
            .should('contain', `(${inProgressCount})`);

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('Cancelled')
            .should('contain', `(${completedCount})`);
        });
    });
});


// Dev Related Commands
Cypress.Commands.add(`devExpandPanel`, () => {
    cy.get('[data-cy="dev-panel-window-min"]')
    .click();

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exisit');
});

Cypress.Commands.add(`devCollapsePanel`, () => {
    cy.get('[data-cy="dev-panel-window-max"]')
    .click();

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exisit');
});

Cypress.Commands.add(`devAddMockEvents`, () => {
    cy.get('[data-cy="dev-panel-add-event-btn"]')
    .click();

    cy.wait(100);

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exisit');

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exisit');

    cy.get('[data-cy="evenlist-filter-all"]')
    .should('contain', '30');
});

Cypress.Commands.add(`devClearMockEvents`, () => {
    cy.get('[data-cy="dev-panel-clear-event-btn"]')
    .click();

    cy.wait(100);

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exisit');

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exisit');

    cy.get('[data-cy="evenlist-filter-all"]')
    .should('contain', '0');
});