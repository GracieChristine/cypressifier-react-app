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

Cypress.Commands.add(`eventlistToNewEventForm`, () => {
  cy.get('[data-cy="eventlist-create-event-btn"]').click();

  cy.url().should('contain', '/user/events/new');
})

Cypress.Commands.add(`eventlistToEditEventForm`, () => {
  cy.get('[data-cy="eventlist-create-event-btn"]').click();

  cy.url().should('contain', '/user/events/new');
})

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
// });`

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
    // Clear all fields first
    cy.get('[data-cy="signup-email-input"]')
    .should('be.visible')
    .clear();

    cy.get('[data-cy="signup-password-input"]')
    .should('be.visible')
    .clear();

    cy.get('[data-cy="signup-confirm-password-input"]')
    .should('be.visible')
    .clear();

    // Fill in only if values provided
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

    // Verify error appears
    cy.get('[data-cy="signup-email-error"], [data-cy="signup-password-error"], [data-cy="signup-confirm-password-error"]')
    .should('exist')
    .and('be.visible');
    
    // Verify still on signup page
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
    // Clear all fields first
    cy.get('[data-cy="login-email-input"]')
    .should('be.visible')
    .clear();

    cy.get('[data-cy="login-password-input"]')
    .should('be.visible')
    .clear();

    // Fill in only if values provided
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

    // Verify error appears
    cy.get('[data-cy="login-email-error"], [data-cy="login-password-error"]')
    .should('exist')
    .and('be.visible');
    
    // Verify still on login page
    cy.url()
    .should('contain', '/login');
});

Cypress.Commands.add(`adminLogin`, (email, password) => {
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
    .should('contain','/admin/dashboard');
});

Cypress.Commands.add(`userLogout`, () => {
    cy.get('[data-cy="nav-logout-btn"]')
    .should('be.visible')
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

Cypress.Commands.add('userAddNewEvent', (
  eventName = null, eventDate = null, 
  eventLocation = null, 
  eventType = null, 
  eventGuestCount = null, 
  eventBudget = null, 
  eventDescription = null
) => {
  // First, ensure we're on the event list page to get counts
  cy.url().then((url) => {
    if (url.includes('/user/events/new')) {
      cy.get('[data-cy="eventform-cancel-btn"]').click();
      cy.url().should('contain', '/user/events');
      cy.url().should('not.contain', '/new');
    }
  });

  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
  .then((allCount) => {

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
    .then((inReviewCount) => {

      // Navigate to form
      cy.get('[data-cy="eventlist-create-event-btn"]').click();
      cy.url().should('contain', '/user/events/new');

      // Clear form
      cy.get('[data-cy="eventform-name-input"]').clear();
      cy.get('[data-cy="eventform-date-input"]').clear();
      cy.get('[data-cy="eventform-location-input"]')
        .invoke('val', '')
        .trigger('change');
      cy.get('[data-cy="eventform-type-input"]')
        .invoke('val', '')
        .trigger('change');
      cy.get('[data-cy="eventform-guestCount-input"]').clear();
      cy.get('[data-cy="eventform-budget-input"]').clear();
      cy.get('[data-cy="eventform-description-input"]').clear();

      // Fill form
      cy.get('[data-cy="eventform-name-input"]')
        .type(eventName || `Test Event ${allCount + 1}`);
      cy.get('[data-cy="eventform-date-input"]')
        .type(eventDate || '2050-06-28');
      cy.get('[data-cy="eventform-location-input"]')
        .select(eventLocation || 'Garden Estate');
      cy.get('[data-cy="eventform-type-input"]')
        .select(eventType || 'Birthday');
      cy.get('[data-cy="eventform-guestCount-input"]')
        .type(eventGuestCount || '50');
      cy.get('[data-cy="eventform-budget-input"]')
        .type(eventBudget || '75000');
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

Cypress.Commands.add('userAddNewEventError', (
  eventName = null,
  eventDate = null,
  eventLocation = null,
  eventType = null,
  eventGuestCount = null,
  eventBudget = null,
  eventDescription = null
) => {
  cy.get('[data-cy="eventform-name-input"]').clear();
  cy.get('[data-cy="eventform-date-input"]').clear();
  cy.get('[data-cy="eventform-location-input"]')
    .invoke('val', '')
    .trigger('change');
  cy.get('[data-cy="eventform-type-input"]')
    .invoke('val', '')
    .trigger('change');
  cy.get('[data-cy="eventform-guestCount-input"]').clear();
  cy.get('[data-cy="eventform-budget-input"]').clear();
  cy.get('[data-cy="eventform-description-input"]').clear();

  if (eventName) {
    cy.get('[data-cy="eventform-name-input"]').type(eventName);
  }

  if (eventDate) {
    cy.get('[data-cy="eventform-date-input"]').type(eventDate);
  }

  if (eventLocation) {
    cy.get('[data-cy="eventform-location-input"]').select(eventLocation);
  }

  if (eventType) {
    cy.get('[data-cy="eventform-type-input"]').select(eventType);
  }

  if (eventGuestCount) {
    cy.get('[data-cy="eventform-guestCount-input"]').type(eventGuestCount);
  }

  if (eventBudget) {
    cy.get('[data-cy="eventform-budget-input"]').type(eventBudget);
  }

  if (eventDescription) {
    cy.get('[data-cy="eventform-description-input"]').type(eventDescription);
  }

  cy.get('form').submit();

  cy.url().should('contain', '/user/events/new');

  cy.get('[data-cy$="-error"]')
    .should('exist')
    .and('be.visible');
});

Cypress.Commands.add('userCancelNewEvent', (
  eventName = null, 
  eventDate = null, 
  eventLocation = null, 
  eventType = null, 
  eventGuestCount = null, 
  eventBudget = null, 
  eventDescription = null
) => {
  // First, ensure we're on the event list page to get counts
  cy.url().then((url) => {
    if (url.includes('/user/events/new')) {
      cy.get('[data-cy="eventform-cancel-btn"]').click();
      cy.url().should('contain', '/user/events');
      cy.url().should('not.contain', '/new');
    }
  });

  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
  .then((allCount) => {

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-review"]')
    .then((inReviewCount) => {

      // Navigate to form
      cy.get('[data-cy="eventlist-create-event-btn"]').click();
      cy.url().should('contain', '/user/events/new');

      // Clear and fill form
      cy.get('[data-cy="eventform-name-input"]').clear();
      cy.get('[data-cy="eventform-date-input"]').clear();
      cy.get('[data-cy="eventform-location-input"]')
        .invoke('val', '')
        .trigger('change');
      cy.get('[data-cy="eventform-type-input"]')
        .invoke('val', '')
        .trigger('change');
      cy.get('[data-cy="eventform-guestCount-input"]').clear();
      cy.get('[data-cy="eventform-budget-input"]').clear();
      cy.get('[data-cy="eventform-description-input"]').clear();

      cy.get('[data-cy="eventform-name-input"]')
        .type(eventName || `Test Event ${allCount + 1}`);
      cy.get('[data-cy="eventform-date-input"]')
        .type(eventDate || '2050-06-28');
      cy.get('[data-cy="eventform-location-input"]')
        .select(eventLocation || 'Garden Estate');
      cy.get('[data-cy="eventform-type-input"]')
        .select(eventType || 'Birthday');
      cy.get('[data-cy="eventform-guestCount-input"]')
        .type(eventGuestCount || '50');
      cy.get('[data-cy="eventform-budget-input"]')
        .type(eventBudget || '75000');
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

Cypress.Commands.add('userSaveUpdateEvent', (updates = {}) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .as('initialCount');

  // Navigate to event edit form
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && !$el.text().includes('Pending');
    });

    expect(target.length).to.be.greaterThan(0);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-edit-btn"]')
      .click();
  });

  cy.url().should('contain', '/user/events/event_');

  // Update only provided fields
  if (updates.name !== undefined) {
    cy.get('[data-cy="eventform-name-input"]').clear().type(updates.name);
  }
  if (updates.date !== undefined) {
    cy.get('[data-cy="eventform-date-input"]').clear().type(updates.date);
  }
  if (updates.location !== undefined) {
    cy.get('[data-cy="eventform-location-input"]').select(updates.location);
  }
  if (updates.type !== undefined) {
    cy.get('[data-cy="eventform-type-input"]').select(updates.type);
  }
  if (updates.guestCount !== undefined) {
    cy.get('[data-cy="eventform-guestCount-input"]').clear().type(updates.guestCount);
  }
  if (updates.budget !== undefined) {
    cy.get('[data-cy="eventform-budget-input"]').clear().type(updates.budget);
  }
  if (updates.description !== undefined) {
    cy.get('[data-cy="eventform-description-input"]').clear().type(updates.description);
  }

  // Save
  cy.get('[data-cy="eventform-save-btn"]').should('be.enabled').click();
  cy.url().should('contain', '/user/events');

  // Verify count unchanged
  cy.get('@initialCount').then((count) => {
    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
      .should('eq', count);
  });

  // Navigate BACK to the same event to verify changes were saved
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && !$el.text().includes('Pending');
    });

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-edit-btn"]')
      .click();
  });

  cy.url().should('contain', '/user/events/event_');

  // Verify each updated field persisted
  if (updates.name !== undefined) {
    cy.get('[data-cy="eventform-name-input"]')
      .should('have.value', updates.name);
  }
  
  if (updates.date !== undefined) {
    cy.get('[data-cy="eventform-date-input"]')
      .should('have.value', updates.date);
  }
  
  if (updates.location !== undefined) {
    cy.get('[data-cy="eventform-location-input"]')
      .should('have.value', updates.location);
  }
  
  if (updates.type !== undefined) {
    cy.get('[data-cy="eventform-type-input"]')
      .should('have.value', updates.type);
  }
  
  if (updates.guestCount !== undefined) {
    cy.get('[data-cy="eventform-guestCount-input"]')
      .invoke('val')
      .then((val) => {
        // Remove thousand separator formatting for comparison
        const cleanVal = val.replace(/,/g, '');
        expect(cleanVal).to.equal(updates.guestCount.toString());
      });
  }
  
  if (updates.budget !== undefined) {
    cy.get('[data-cy="eventform-budget-input"]')
      .invoke('val')
      .then((val) => {
        // Remove thousand separator formatting for comparison
        const cleanVal = val.replace(/,/g, '');
        expect(cleanVal).to.equal(updates.budget.toString());
      });
  }
  
  if (updates.description !== undefined) {
    cy.get('[data-cy="eventform-description-input"]')
      .should('have.value', updates.description);
  }

  // Navigate back to event list
  cy.get('[data-cy="eventform-cancel-btn"]').click();
  cy.url().should('contain', '/user/events');
  cy.url().should('not.contain', '/event_');
});

Cypress.Commands.add('userUpdateEventError', (updates = {}) => {
  // Check if already on form page, if not navigate to it
  cy.url().then((url) => {
    if (!url.includes('/user/events/event_')) {
      // Navigate to event edit form from event list
      cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
        const target = $entries.filter((i, el) => {
          const $el = Cypress.$(el);
          return $el.text().includes('In Progress') && !$el.text().includes('Pending');
        });

        expect(target.length).to.be.greaterThan(0);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-edit-btn"]')
          .click();
      });

      cy.url().should('contain', '/user/events/event_');
    }
  });

  // Clear fields if they should be empty
  if (updates.name === '') {
    cy.get('[data-cy="eventform-name-input"]').clear();
  } else if (updates.name !== undefined) {
    cy.get('[data-cy="eventform-name-input"]').clear().type(updates.name);
  }
  
  if (updates.date === '') {
    cy.get('[data-cy="eventform-date-input"]').clear();
  } else if (updates.date !== undefined) {
    cy.get('[data-cy="eventform-date-input"]').clear().type(updates.date);
  }

  if (updates.location === '') {
    cy.get('[data-cy="eventform-location-input"]').select('');
  } else if (updates.location !== undefined) {
    cy.get('[data-cy="eventform-location-input"]').select(updates.location);
  }
  
  if (updates.type === '') {
    cy.get('[data-cy="eventform-type-input"]').select('');
  } else if (updates.type !== undefined) {
    cy.get('[data-cy="eventform-type-input"]').select(updates.type);
  }
  
  if (updates.guestCount === '') {
    cy.get('[data-cy="eventform-guestCount-input"]').clear();
  } else if (updates.guestCount !== undefined) {
    cy.get('[data-cy="eventform-guestCount-input"]').clear().type(updates.guestCount);
  }
  
  if (updates.budget === '') {
    cy.get('[data-cy="eventform-budget-input"]').clear();
  } else if (updates.budget !== undefined) {
    cy.get('[data-cy="eventform-budget-input"]').clear().type(updates.budget);
  }
  
  if (updates.description === '') {
    cy.get('[data-cy="eventform-description-input"]').clear();
  } else if (updates.description !== undefined) {
    cy.get('[data-cy="eventform-description-input"]').clear().type(updates.description);
  }

  // Try to submit (should fail with errors)
  cy.get('form').submit();

  // Should still be on the form page
  cy.url().should('contain', '/user/events/event_');

  // At least one error should be visible
  cy.get('[data-cy$="-error"]')
    .should('exist')
    .and('be.visible');

  // Navigate back to event list for next test
  cy.get('[data-cy="eventform-cancel-btn"]').click();
  cy.url().should('contain', '/user/events');
  cy.url().should('not.contain', '/event_');
});

Cypress.Commands.add('userCancelUpdateEvent', (updates = {}) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .as('initialCount');

  // Navigate to event edit form
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && !$el.text().includes('Pending');
    });

    expect(target.length).to.be.greaterThan(0);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-edit-btn"]')
      .click();
  });

  cy.url().should('contain', '/user/events/event_');

  // Capture original values before any changes
  const originalValues = {};
  
  cy.get('[data-cy="eventform-name-input"]')
    .invoke('val')
    .then((val) => { originalValues.name = val; });
  
  cy.get('[data-cy="eventform-date-input"]')
    .invoke('val')
    .then((val) => { originalValues.date = val; });
  
  cy.get('[data-cy="eventform-location-input"]')
    .invoke('val')
    .then((val) => { originalValues.location = val; });
  
  cy.get('[data-cy="eventform-type-input"]')
    .invoke('val')
    .then((val) => { originalValues.type = val; });
  
  cy.get('[data-cy="eventform-guestCount-input"]')
    .invoke('val')
    .then((val) => { originalValues.guestCount = val; });
  
  cy.get('[data-cy="eventform-budget-input"]')
    .invoke('val')
    .then((val) => { originalValues.budget = val; });
  
  cy.get('[data-cy="eventform-description-input"]')
    .invoke('val')
    .then((val) => {
      originalValues.description = val;

      // Now make changes (inside last .then() to ensure all values captured)
      if (updates.name !== undefined) {
        cy.get('[data-cy="eventform-name-input"]').clear().type(updates.name);
      }
      if (updates.date !== undefined) {
        cy.get('[data-cy="eventform-date-input"]').clear().type(updates.date);
      }
      if (updates.location !== undefined) {
        cy.get('[data-cy="eventform-location-input"]').select(updates.location);
      }
      if (updates.type !== undefined) {
        cy.get('[data-cy="eventform-type-input"]').select(updates.type);
      }
      if (updates.guestCount !== undefined) {
        cy.get('[data-cy="eventform-guestCount-input"]').clear().type(updates.guestCount);
      }
      if (updates.budget !== undefined) {
        cy.get('[data-cy="eventform-budget-input"]').clear().type(updates.budget);
      }
      if (updates.description !== undefined) {
        cy.get('[data-cy="eventform-description-input"]').clear().type(updates.description);
      }

      // Cancel instead of save
      cy.get('[data-cy="eventform-cancel-btn"]').click();
      cy.url().should('contain', '/user/events');
      cy.url().should('not.contain', '/event_');

      // Verify count unchanged
      cy.get('@initialCount').then((count) => {
        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', count);
      });

      // Navigate back to verify changes were NOT saved (original values remain)
      cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
        const target = $entries.filter((i, el) => {
          const $el = Cypress.$(el);
          return $el.text().includes('In Progress') && !$el.text().includes('Pending');
        });

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-edit-btn"]')
          .click();
      });

      cy.url().should('contain', '/user/events/event_');

      // Verify original values are still there
      cy.get('[data-cy="eventform-name-input"]')
        .should('have.value', originalValues.name);
      
      cy.get('[data-cy="eventform-date-input"]')
        .should('have.value', originalValues.date);
      
      cy.get('[data-cy="eventform-location-input"]')
        .should('have.value', originalValues.location);
      
      cy.get('[data-cy="eventform-type-input"]')
        .should('have.value', originalValues.type);
      
      cy.get('[data-cy="eventform-guestCount-input"]')
        .invoke('val')
        .should('equal', originalValues.guestCount);
      
      cy.get('[data-cy="eventform-budget-input"]')
        .invoke('val')
        .should('equal', originalValues.budget);
      
      cy.get('[data-cy="eventform-description-input"]')
        .should('have.value', originalValues.description);

      // Go back to event list
      cy.get('[data-cy="eventform-cancel-btn"]').click();
      cy.url().should('contain', '/user/events');
    });
});

Cypress.Commands.add('userSubmitEventCancelRequest', () => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .then((inProgressCount) => {

      cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {

        const target = $entries.filter((i, el) => {
          const $el = Cypress.$(el);
          return $el.text().includes('In Progress') &&
                 !$el.text().includes('Pending');
        });

        expect(target.length).to.be.greaterThan(0);

        const eventId = Cypress.$(target.first()).attr('data-event-id');
        cy.log('Requesting cancellation for event:', eventId);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
          .click();

        // Everything that depends on eventId stays inside here

        cy.url().should('contain', '/user/events/event_');

        cy.get('[data-cy="cancel-event-comment-input"]')
          .type('I need to cancel this event due to family reasons.');

        cy.get('[data-cy="cancel-event-submit-btn"]')
          .should('be.enabled')
          .click();

        cy.url().should('contain', '/user/events');

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', inProgressCount);

        cy.get(`[data-event-id="${eventId}"]`)
          .should('contain', 'In Progress')
          .and('contain', 'Pending');
      });
    });
});

Cypress.Commands.add('userSubmitEventCancelRequestError', () => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .then((inProgressCount) => {

      cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {

        const target = $entries.filter((i, el) => {
          const $el = Cypress.$(el);
          return $el.text().includes('In Progress') &&
                 !$el.text().includes('Pending');
        });

        expect(target.length).to.be.greaterThan(0);

        const eventId = Cypress.$(target.first()).attr('data-event-id');
        cy.log('Requesting cancellation for event:', eventId);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
          .click();

        cy.url().should('contain', '/user/events/event_');

        cy.get('[data-cy="cancel-event-comment-input"]').clear();

        cy.get('[data-cy="cancel-event-submit-btn"]')
          .should('be.disabled');

        cy.get('[data-cy="cancel-event-cancel-btn"]')
          .should('be.enabled')
          .click();

        cy.url().should('contain', '/user/events');

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', inProgressCount);

        cy.get(`[data-event-id="${eventId}"]`)
          .should('contain', 'In Progress')
          .and('not.contain', 'Pending');
      });
    });
});

Cypress.Commands.add('userCancelEventCancelRequest', () => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .then((inProgressCount) => {

      cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {

        const target = $entries.filter((i, el) => {
          const $el = Cypress.$(el);
          return $el.text().includes('In Progress') &&
                 !$el.text().includes('Pending');
        });

        expect(target.length).to.be.greaterThan(0);

        const eventId = Cypress.$(target.first()).attr('data-event-id');
        cy.log('Requesting cancellation for event:', eventId);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
          .click();

        cy.url().should('contain', '/user/events/event_');

        cy.get('[data-cy="cancel-event-comment-input"]')
          .type('I need to cancel this event due to family reasons.');

        cy.get('[data-cy="cancel-event-cancel-btn"]')
          .should('be.enabled')
          .click();

        cy.url().should('contain', '/user/events');

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', inProgressCount);

        cy.get(`[data-event-id="${eventId}"]`)
          .should('contain', 'In Progress')
          .and('not.contain', 'Pending');
      });
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
