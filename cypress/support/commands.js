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
Cypress.Commands.add(`userAddNewEvent`, (eventName = null) => {
    cy.get('[data-cy="eventlist-filter-all"]')
    .invoke('text')
    .then((text) => {
        const totalCount = parseInt(text.match(/\((\d+)\)/)[1] || 0);

        cy.get('[data-cy="eventlist-create-event-btn"]')
        .click();

        cy.url()
        .should('contain', '/user/events/new');

        cy.get('[data-cy="eventform-name-input"]')
        .type(eventName || `Test Event ${totalCount + 1}`);

        cy.get('[data-cy="eventform-date-input"]')
        .scrollIntoView()
        .type('2026-06-28');

        cy.get('[data-cy="eventform-location-input"]')
        .scrollIntoView()
        .type('Garden Estate');

        cy.get('[data-cy="eventform-type-input"]')
        .scrollIntoView()
        .type('Brithday');

        cy.get('[data-cy="eventform-guestCount-input"]')
        .scrollIntoView()
        .type('50');

        cy.get('[data-cy="eventform-budget-input"]')
        .scrollIntoView()
        .clear()
        .type('75000');

        cy.get('[data-cy="eventform-description-input"]')
        .scrollIntoView()
        .type(`This is just test event ${totalCount + 1} created for testing sake.`);

        cy.get('form')
        .submit();

        cy.wait(100);

        cy.url()
        .should('contain', '/user/events');

        cy.get('[data-cy="eventlist-filter-all"]')
        .scrollIntoView()
        .should('contain', `(${totalCount + 1})`)
        .and('be.visible');

        cy.get('[data-cy="eventlist-filter-in-review"]')
        .scrollIntoView()
        .should('contain', `(${totalCount + 1})`)
        .and('be.visible');
    });
});

Cypress.Commands.add('adminAcceptNewEvent', () => {
  cy.get('[data-cy="dashboard-status-box"]')
    .contains('In Review')
    .invoke('text')
    .then((text) => {
      const inReviewCount = parseInt(text.match(/\((\d+)\)/)[1]);

      cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Progress')
        .invoke('text')
        .then((progressText) => {
          const inProgressCount = parseInt(progressText.match(/\((\d+)\)/)?.[1] || 0);

          // 🔑 Find FIRST row that is In Review
          cy.get('[data-cy="dashboard-table-entry"]')
            .contains('In Review')
            .parents('[data-cy="dashboard-table-entry"]')
            .first()
            .within(() => {
              cy.get('[data-cy="dashboard-table-entry-action"]')
                .should('contain', 'View')
                .click();
            });

          cy.url()
            .should('contain', '/admin/events/')
            .and('contain', '/edit');

          cy.get('[data-cy="review-new-comment-input"]')
            .type(
              'After reviewing, we have decided to accept this request. We will reach out shortly via email.'
            );

          cy.get('[data-cy="accept-new-event-btn"]').click();

          cy.url().should('contain', '/admin/dashboard');

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('In Review')
            .should('contain', `(${inReviewCount - 1})`);

          cy.get('[data-cy="dashboard-status-box"]')
            .contains('In Progress')
            .should('contain', `(${inProgressCount + 1})`);
        });
    });
});

Cypress.Commands.add(`adminDeclineNewEvent`, (position = 0) => {
    cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Review')
        .invoke('text')
        .then((text) => {
            const inReviewCount = parseInt(text.match(/\((\d+)\)/)[1]);
            
            cy.get('[data-cy="dashboard-status-box"]')
                .contains('Cancelled')
                .invoke('text')
                .then((cancelledText) => {
                    const cancelledCount = parseInt(cancelledText.match(/\((\d+)\)/)?.[1] || 0);
                    
                    cy.get('[data-cy="dashboard-table-entry"]')
                        .should('have.length.greaterThan', 0)
                        .eq(position)
                        .find('[data-cy="dashboard-table-entry-action"]')
                        .should('contain', 'View')
                        .click();

                    cy.url()
                        .should('contain', '/admin/events/event_')
                        .and('contain', '/edit');

                    cy.get('[data-cy="review-new-comment-input"]')
                        .scrollIntoView()
                        .type('Unfortunately, we cannot accommodate this event request due to scheduling conflicts.');

                    cy.get('[data-cy="decline-new-event-btn"]')
                        .scrollIntoView()
                        .click();

                    cy.url()
                        .should('contain', '/admin/dashboard');
                    
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('In Review')
                        .should('contain', `(${inReviewCount - 1})`);
                    
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('Cancelled')
                        .should('contain', `(${cancelledCount + 1})`);
                });
        });
});

Cypress.Commands.add(`adminAcceptEventCancelRequest`, (eventPosition = 0) => {
    cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Progress')
        .invoke('text')
        .then((text) => {
            const inProgressCount = parseInt(text.match(/\((\d+)\)/)[1]);
            
            cy.get('[data-cy="dashboard-status-box"]')
                .contains('Cancelled')
                .invoke('text')
                .then((cancelledText) => {
                    const cancelledCount = parseInt(cancelledText.match(/\((\d+)\)/)?.[1] || 0);
                    
                    cy.get('[data-cy="dashboard-table-entry"]')
                        .eq(eventPosition)
                        .find('[data-cy="dashboard-table-entry-action"]')
                        .click();
                    
                    cy.url()
                        .should('contain', '/admin/events/event_')
                        .and('contain', '/edit');
                    
                    cy.get('[data-cy="review-cancel-comment-input"]')
                        .scrollIntoView()
                        .type('We understand the situation and approve this cancellation request.');
                    
                    cy.get('[data-cy="accept-cancel-event-btn"]')
                        .scrollIntoView()
                        .click();
                    
                    cy.url()
                        .should('contain', '/admin/dashboard');
                    
                    // Verify counts changed
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('In Progress')
                        .should('contain', `(${inProgressCount - 1})`);
                    
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('Cancelled')
                        .should('contain', `(${cancelledCount + 1})`);
                });
        });
});

Cypress.Commands.add(`adminDeclineEventCancelRequest`, (eventPosition = 0) => {
    cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Progress')
        .invoke('text')
        .then((text) => {
            const inProgressCount = parseInt(text.match(/\((\d+)\)/)[1]);
            
            cy.get('[data-cy="dashboard-status-box"]')
                .contains('Cancelled')
                .invoke('text')
                .then((cancelledText) => {
                    const cancelledCount = parseInt(cancelledText.match(/\((\d+)\)/)?.[1] || 0);
                    
                    cy.get('[data-cy="dashboard-table-entry"]')
                        .eq(eventPosition)
                        .find('[data-cy="dashboard-table-entry-action"]')
                        .click();
                    
                    cy.url()
                        .should('contain', '/admin/events/event_')
                        .and('contain', '/edit');
                    
                    cy.get('[data-cy="review-cancel-comment-input"]')
                        .scrollIntoView()
                        .type('We understand the situation and approve this cancellation request.');
                    
                    cy.get('[data-cy="decline-cancel-event-btn"]')
                        .scrollIntoView()
                        .click();
                    
                    cy.url()
                        .should('contain', '/admin/dashboard');
                    
                    // Verify counts changed
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('In Progress')
                        .should('contain', `(${inProgressCount})`);
                    
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('Cancelled')
                        .should('contain', `(${cancelledCount})`);
                });
        });
});

Cypress.Commands.add(`adminCompleteEvent`, (eventPosition = 0) => {
    cy.get('[data-cy="dashboard-status-box"]')
        .contains('In Progress')
        .invoke('text')
        .then((text) => {
            const inProgressCount = parseInt(text.match(/\((\d+)\)/)[1]);
            
            cy.get('[data-cy="dashboard-status-box"]')
                .contains('Completed')
                .invoke('text')
                .then((completedText) => {
                    const completedCount = parseInt(completedText.match(/\((\d+)\)/)?.[1] || 0);
                    
                    cy.get('[data-cy="dashboard-table-entry"]')
                        .eq(eventPosition)
                        .find('[data-cy="dashboard-table-entry-action"]')
                        .click();
                    
                    cy.url()
                        .should('contain', '/admin/events/event_');
                    
                    cy.get('[data-cy="complete-event-checkbox"]')
                        .scrollIntoView()
                        .check();
                    
                    cy.get('[data-cy="complete-event-note-input"]')
                        .scrollIntoView()
                        .type('All event\'s action items are done successfully. Moving it to complete.');
                    
                    cy.get('[data-cy="save-event-update-btn"]')
                        .scrollIntoView()
                        .click();
                    
                    cy.url()
                        .should('contain', '/admin/dashboard');
                    
                    // Verify counts
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('In Progress')
                        .should('contain', `(${inProgressCount - 1})`);
                    
                    cy.get('[data-cy="dashboard-status-box"]')
                        .contains('Completed')
                        .should('contain', `(${completedCount + 1})`);
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