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

    cy.get('[data-cy="signup-email-input"]').should('be.visible');
    cy.get('[data-cy="signup-password-input"]').should('be.visible');
    cy.get('[data-cy="signup-confirm-password-input"]').should('be.visible');
});

Cypress.Commands.add(`landingToLogin`, () => {
    cy.get('[data-cy="landing-login-btn"]')
    .click();

    cy.url()
    .should('contain','/login');

    cy.get('[data-cy="login-email-input"]').should('be.visible');
    cy.get('[data-cy="login-password-input"]').should('be.visible');
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

    cy.get('[data-cy="login-email-input"]').should('be.visible');
    cy.get('[data-cy="login-password-input"]').should('be.visible');
});

Cypress.Commands.add(`loginToSignup`, () => {
    cy.get('[data-cy="login-signup-link"]')
    .click();
    
    cy.url()
    .should('contain','/signup');

    cy.get('[data-cy="signup-email-input"]').should('be.visible');
    cy.get('[data-cy="signup-password-input"]').should('be.visible');
    cy.get('[data-cy="signup-confirm-password-input"]').should('be.visible');
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
    // Fill in signup form
    cy.get('[data-cy="signup-email-input"]')
    .should('be.visible')
    .clear()
    .type(email);
    cy.get('[data-cy="signup-password-input"]')
    .should('be.visible')
    .clear()
    .type(password);
    cy.get('[data-cy="signup-confirm-password-input"]')
    .should('be.visible')
    .clear()
    .type(confirmPass || password);

    // Submit signup form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/user/events');
});

Cypress.Commands.add(`userSignupError`, (email, password, confirmPass) => {
  // Fill in signup form
    cy.get('[data-cy="signup-email-input"]')
    .should('be.visible')
    .clear();

    cy.get('[data-cy="signup-password-input"]')
    .should('be.visible')
    .clear();

    cy.get('[data-cy="signup-confirm-password-input"]')
    .should('be.visible')
    .clear();

    if (email) {
        cy.get('[data-cy="signup-email-input"]')
        .type(email);
    }

    if (password) {
        cy.get('[data-cy="signup-password-input"]')
        .type(password);
    }
    
    if (confirmPass) {
        cy.get('[data-cy="signup-confirm-password-input"]')
        .type(confirmPass);
    }

    // Submit signup form
    cy.get('form')
    .submit();

    cy.get('[data-cy="signup-email-error"], [data-cy="signup-password-error"], [data-cy="signup-confirm-password-error"]')
    .should('exist')
    .and('be.visible');
    
    cy.url()
    .should('contain', '/signup');
});

Cypress.Commands.add(`userLogin`, (email, password) => {
    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .should('be.visible')
    .clear()
    .type(email);
    cy.get('[data-cy="login-password-input"]')
    .should('be.visible')
    .clear()
    .type(password);

    // Submit login form
    cy.get('form')
    .submit();

    cy.url()
    .should('contain','/user/events');
});

Cypress.Commands.add(`userLoginError`, (email, password) => {
    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .should('be.visible')
    .clear();

    cy.get('[data-cy="login-password-input"]')
    .should('be.visible')
    .clear();

    if (email) {
        cy.get('[data-cy="login-email-input"]')
        .type(email);
    }
    
    if (password) {
        cy.get('[data-cy="login-password-input"]')
        .type(password);
    }

    // Submit login form
    cy.get('form')
    .submit();

    cy.get('[data-cy="login-email-error"], [data-cy="login-password-error"]')
    .should('exist')
    .and('be.visible');
    
    cy.url()
    .should('contain', '/login');
});

Cypress.Commands.add(`adminLogin`, (email, password) => {
    // cy.clearCacheLoadLanding();
    // cy.landingToLogin();

    // Fill in login form
    cy.get('[data-cy="login-email-input"]')
    .should('be.visible')
    .type(email);
    cy.get('[data-cy="login-password-input"]')
    .should('be.visible')
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

// Event Management Related Commands

// Helper function to extract count
const getCountFromText = (text) => {
  const match = text.match(/\((\d+)\)/);
  return match ? Number(match[1]) : 0;
};

// Get 1 specific user eventlist filter count
Cypress.Commands.add('userGetOneFilterCount', (filter) => {
  return cy.get(filter).invoke('text').then(getCountFromText);
});

// Get 1 specific  admin event status count
Cypress.Commands.add('adminGetOneStatusCount', (status) => {
  return cy.contains('[data-cy="dashboard-status-box"]', status)
    .invoke('text')
    .then(getCountFromText);
});

// Get all 5 admin event status counts
Cypress.Commands.add('adminGetAllStatusCounts', () => {
  const statuses = ['All', 'In Review', 'In Progress', 'Completed', 'Cancelled'];
  const counts = {};
  
  let chain = cy.wrap(null);
  
  statuses.forEach(status => {
    chain = chain.then(() => {
      return cy.contains('[data-cy="dashboard-status-box"]', status)
        .invoke('text')
        .then(getCountFromText)
        .then(count => {
          counts[status] = count;
        });
    });
  });
  
  // DON'T return counts directly - wrap it properly
  return chain.then(() => {
    cy.log('Admin Status Counts:', JSON.stringify(counts, null, 2));
    return cy.wrap(counts);  // ← Use cy.wrap() instead of returning directly
  });
});

// Get all 5 user event list filter counts
Cypress.Commands.add('userGetAllFilterCounts', () => {
  const filters = {
    'All': '[data-cy="eventlist-filter-all"]',
    'In Review': '[data-cy="eventlist-filter-in-review"]',
    'In Progress': '[data-cy="eventlist-filter-in-progress"]',
    'Completed': '[data-cy="eventlist-filter-completed"]',
    'Cancelled': '[data-cy="eventlist-filter-cancelled"]'
  };
  
  const counts = {};
  let chain = cy.wrap(null);
  
  Object.entries(filters).forEach(([status, selector]) => {
    chain = chain.then(() => {
      return cy.get(selector)
        .invoke('text')
        .then(getCountFromText)
        .then(count => {
          counts[status] = count;
        });
    });
  });
  
  // DON'T return counts directly - wrap it properly
  return chain.then(() => {
    cy.log('User Filter Counts:', JSON.stringify(counts, null, 2));
    return cy.wrap(counts);  // ← Use cy.wrap() instead of returning directly
  });
});

Cypress.Commands.add('userAddNewEvent', (eventName = null, eventDate = null, eventLocation = null, eventType = null, eventGuestCount = null, eventbudget = null, eventDescription) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
  .then((allCount) => {

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
    .then((inReviewCount) => {

      cy.get('[data-cy="eventlist-create-event-btn"]')
    .click();

      cy.url()
      .should('contain', '/user/events/new');

      cy.get('[data-cy="eventform-name-input"]')
        .type(eventName || `Test Event ${allCount + 1}`);

      cy.get('[data-cy="eventform-date-input"]')
      .type(eventDate || '2050-06-28');
      cy.get('[data-cy="eventform-location-input"]')
      .type(eventLocation || 'Garden Estate');
      cy.get('[data-cy="eventform-type-input"]')
      .type(eventType || 'Birthday');
      cy.get('[data-cy="eventform-guestCount-input"]')
      .type(eventGuestCount || '50');
      cy.get('[data-cy="eventform-budget-input"]')
      .clear()
      .type(eventbudget || '75000');
      cy.get('[data-cy="eventform-description-input"]')
        .type(eventDescription || `This is test event ${allCount + 1}.`);

      cy.get('form')
      .submit();

      cy.url()
      .should('contain', '/user/events');

      cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
        .should('eq', allCount + 1);

      cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
        .should('eq', inReviewCount + 1);

    }); 
  });
});

Cypress.Commands.add('userCancelNewEvent', (eventName = null, eventDate = null, eventLocation = null, eventType = null, eventGuestCount = null, eventbudget = null, eventDescription) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
  .then((allCount) => {

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
    .then((inReviewCount) => {

      cy.get('[data-cy="eventlist-create-event-btn"]')
    .click();

      cy.url()
      .should('contain', '/user/events/new');

      cy.get('[data-cy="eventform-name-input"]')
        .type(eventName || `Test Event ${allCount + 1}`);

      cy.get('[data-cy="eventform-date-input"]')
      .type(eventDate || '2050-06-28');
      cy.get('[data-cy="eventform-location-input"]')
      .type(eventLocation || 'Garden Estate');
      cy.get('[data-cy="eventform-type-input"]')
      .type(eventType || 'Birthday');
      cy.get('[data-cy="eventform-guestCount-input"]')
      .type(eventGuestCount || '50');
      cy.get('[data-cy="eventform-budget-input"]')
      .clear()
      .type(eventbudget || '75000');
      cy.get('[data-cy="eventform-description-input"]')
        .type(eventDescription || `This is test event ${allCount + 1}.`);

      cy.get('[data-cy="eventform-cancel-btn"]')
      .click();

      cy.url()
      .should('contain', '/user/events');

      cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
        .should('eq', allCount);

      cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
        .should('eq', inReviewCount);

    }); 
  });
});

Cypress.Commands.add('adminAcceptNewEvent', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Review')
    .then((inReviewCount) => {
        cy.adminGetOneStatusCount('In Progress')
        .then((inProgressCount) => {

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
        .should('eq', inReviewCount - 1);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', inProgressCount + 1);
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

Cypress.Commands.add('adminConsiderNewEvent', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Review')
    .then((inReviewCount) => {
        cy.adminGetOneStatusCount('In Progress')
        .then((inProgressCount) => {

          cy.adminGetOneStatusCount('Cancelled')
          .then((cancelledCount) => {

            cy.contains('[data-cy="dashboard-table-entry"]', 'In Review')
            .first()
            .within(() => {
                cy.get('[data-cy="dashboard-table-entry-action"]')
                .click();
            });

            cy.url()
            .should('include', '/admin/events/')
            .and('contain', '/edit');

            cy.get('[data-cy="return-dashboard-btn"]')
            .scrollIntoView()
            .click();

            cy.url()
            .should('contain', '/admin/dashboard');

            cy.adminGetOneStatusCount('All')
            .should('eq', allCount);
            cy.adminGetOneStatusCount('In Review')
            .should('eq', inReviewCount);
            cy.adminGetOneStatusCount('In Progress')
            .should('eq', inProgressCount);
            cy.adminGetOneStatusCount('Cancelled')
            .should('eq', cancelledCount);
            });
            
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
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
        cy.adminGetOneStatusCount('Cancelled')
        .then((cancelledCount) => {

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
        .should('eq', inProgressCount - 1);
        cy.adminGetOneStatusCount('Cancelled')
        .should('eq', cancelledCount + 1);
        });
    });
  });
});

Cypress.Commands.add('adminDeclineEventCancelRequest', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
        cy.adminGetOneStatusCount('Cancelled')
        .then((cancelledCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'Cancel Request')
            .first()
            .within(() => {
            cy.get('[data-cy="dashboard-table-entry-action"]').click();
            });

        cy.get('[data-cy="review-cancel-comment-input"]')
            .scrollIntoView()
            .type('After much consideration, we\'re unable to cancel this event at this moment.');

        cy.get('[data-cy="decline-cancel-event-btn"]')
        .should('be.enabled')
        .click();

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', inProgressCount);
        cy.adminGetOneStatusCount('Cancelled')
        .should('eq', cancelledCount);
        });
    });
  });
});

Cypress.Commands.add('adminConsiderEventCancelRequest', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
        cy.adminGetOneStatusCount('Cancelled')
        .then((cancelledCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'Cancel Request')
            .first()
            .within(() => {
            cy.get('[data-cy="dashboard-table-entry-action"]').click();
            });

        cy.get('[data-cy="return-dashboard-btn"]')
        .last()
        .scrollIntoView()
        .click();

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', inProgressCount);
        cy.adminGetOneStatusCount('Cancelled')
        .should('eq', cancelledCount);
        });
    });
  });
});

Cypress.Commands.add('adminSetEventAsCompleted', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
        cy.adminGetOneStatusCount('Completed')
        .then((completedCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'Update')
            .first()
            .within(() => {
            cy.get('[data-cy="dashboard-table-entry-action"]').click();
            });

        cy.get('[data-cy="complete-event-checkbox"]')
            .click();

        cy.get('[data-cy="complete-event-comment-input"]')
            .scrollIntoView()
            .type('All event\'s action items are done successfully. Moving it to complete.');

        cy.get('[data-cy="save-event-update-btn"]')
        .should('be.enabled')
        .click();

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', inProgressCount - 1);
        cy.adminGetOneStatusCount('Completed')
        .should('eq', completedCount + 1);
        });
    });
  });
});

Cypress.Commands.add('adminConsiderEventAsCompleted', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
        cy.adminGetOneStatusCount('Completed')
        .then((completedCount) => {

        cy.contains('[data-cy="dashboard-table-entry"]', 'Update')
            .first()
            .within(() => {
            cy.get('[data-cy="dashboard-table-entry-action"]').click();
            });

        cy.get('[data-cy="return-dashboard-btn"]')
        .scrollIntoView()
        .click();

        cy.adminGetOneStatusCount('All')
        .should('eq', allCount);
        cy.adminGetOneStatusCount('In Progress')
        .should('eq', inProgressCount);
        cy.adminGetOneStatusCount('Completed')
        .should('eq', completedCount);
        });
    });
  });
});


// Dev Related Commands
Cypress.Commands.add(`devExpandPanel`, () => {
    cy.get('[data-cy="dev-panel-expand-btn"]')
    .click();

    cy.get('[data-cy="dev-panel-window-max"]')
    .should('exist')
    .and('be.visible');
});

Cypress.Commands.add(`devCollapsePanel`, () => {
    cy.get('[data-cy="dev-panel-collapse-btn"]')
    .click();

    cy.get('[data-cy="dev-panel-window-min"]')
    .should('exist')
    .and('be.visible');
});


Cypress.Commands.add(`devAddMockEvents`, () => {
    cy.devExpandPanel();

    cy.get('[data-cy="dev-panel-add-event-btn"]')
    .click();

    cy.wait(500);
});

Cypress.Commands.add(`devClearMockEvents`, () => {
    cy.devExpandPanel();

    cy.get('[data-cy="dev-panel-clear-event-btn"]')
    .click();

    cy.wait(500);
});
