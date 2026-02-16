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

  cy.get('[data-cy="signup-email-input"]')
    .should('be.visible');
  cy.get('[data-cy="signup-password-input"]')
    .should('be.visible');
  cy.get('[data-cy="signup-confirm-password-input"]')
    .should('be.visible');
});

Cypress.Commands.add(`landingToLogin`, () => {
  cy.get('[data-cy="landing-login-btn"]')
    .click();

  cy.url()
    .should('contain','/login');

  cy.get('[data-cy="login-email-input"]')
    .should('be.visible');
  cy.get('[data-cy="login-password-input"]')
    .should('be.visible');
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

  cy.get('[data-cy="login-email-input"]')
    .should('be.visible');
  cy.get('[data-cy="login-password-input"]')
    .should('be.visible');
});

Cypress.Commands.add(`loginToSignup`, () => {
  cy.get('[data-cy="login-signup-link"]')
    .click();

  cy.url()
    .should('contain','/signup');

  cy.get('[data-cy="signup-email-input"]')
    .should('be.visible');
  cy.get('[data-cy="signup-password-input"]')
    .should('be.visible');
  cy.get('[data-cy="signup-confirm-password-input"]')
    .should('be.visible');
});

Cypress.Commands.add(`eventlistToNewEventForm`, () => {
  cy.get('[data-cy="eventlist-create-event-btn"]')
    .click();

  cy.url()
    .should('contain', '/user/events/new');
})

Cypress.Commands.add(`eventlistToEditEventForm`, () => {
  cy.get('[data-cy="eventlist-create-event-btn"]')
    .click();

  cy.url()
    .should('contain', '/user/events/new');
})

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
//// Helper function to extract count
const getCountFromText = (text) => {
  const match = text.match(/\((\d+)\)/);
  return match ? Number(match[1]) : 0;
};

//// Get 1 specific user eventlist filter count
Cypress.Commands.add('userGetOneFilterCount', (filter) => {
  return cy.get(filter).invoke('text').then(getCountFromText);
});

//// Get 1 specific admin event status count
Cypress.Commands.add('adminGetOneStatusCount', (status) => {
  return cy.contains('[data-cy="dashboard-status-box"]', status)
    .invoke('text')
    .then(getCountFromText);
});

//// Get all 5 admin event status counts
Cypress.Commands.add('adminGetAllStatusCounts', () => {
  const statuses = ['All', 'Submitted', 'In Progress', 'Completed', 'Cancelled'];
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
  
  return chain.then(() => {
    cy.log('Admin Status Counts:', JSON.stringify(counts, null, 2));
    return cy.wrap(counts);
  });
});

//// Get all 5 user event list filter counts
Cypress.Commands.add('userGetAllFilterCounts', () => {
  const filters = {
    'All': '[data-cy="eventlist-filter-all"]',
    'Submitted': '[data-cy="eventlist-filter-submitted"]',
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
  
  return chain.then(() => {
    cy.log('User Filter Counts:', JSON.stringify(counts, null, 2));
    return cy.wrap(counts);
  });
});

//// Create New Event
Cypress.Commands.add('userCreateEventNew', (
  eventName = null, 
  eventDate = null, 
  eventLocation = null, 
  eventType = null, 
  eventGuestCount = null, 
  eventBudget = null, 
  eventDescription = null
) => {
  cy.url().then((url) => {
    if (url.includes('/user/events/new')) {
      cy.get('[data-cy="eventform-cancel-btn"]')
        .click();

      cy.url()
        .should('contain', '/user/events')
        .and('not.contain', '/new');
    }
  });

  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
    .then((allCount) => {

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-submitted"]')
      .then((inReviewCount) => {

      cy.get('[data-cy="eventlist-create-event-btn"]')
        .click();

      cy.url()
        .should('contain', '/user/events/new');

      cy.get('[data-cy="eventform-name-input"]').clear();
      cy.get('[data-cy="eventform-date-input"]').clear();
      cy.get('[data-cy="eventform-location-input"]').invoke('val', '').trigger('change');
      cy.get('[data-cy="eventform-type-input"]').invoke('val', '').trigger('change');
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

      cy.get('form')
        .submit();

      cy.url()
        .should('contain', '/user/events');

      cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
        .should('eq', allCount + 1);

      cy.userGetOneFilterCount('[data-cy="eventlist-filter-submitted"]')
        .should('eq', inReviewCount + 1);
    }); 
  });
});

Cypress.Commands.add('userCreateEventNewError', (
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
  cy.get('[data-cy="eventform-location-input"]').invoke('val', '').trigger('change');
  cy.get('[data-cy="eventform-type-input"]').invoke('val', '').trigger('change');
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

  cy.get('form')
    .submit();

  cy.url()
    .should('contain', '/user/events/new');

  cy.get('[data-cy$="-error"]')
    .should('exist')
    .and('be.visible');
});

Cypress.Commands.add('userCancelEventNew', (
  eventName = null, 
  eventDate = null, 
  eventLocation = null, 
  eventType = null, 
  eventGuestCount = null, 
  eventBudget = null, 
  eventDescription = null
) => {
  cy.url().then((url) => {
    if (url.includes('/user/events/new')) {
      cy.get('[data-cy="eventform-cancel-btn"]')
        .click();

      cy.url()
        .should('contain', '/user/events');

      cy.url()
        .should('not.contain', '/new');
    }
  });

  cy.userGetOneFilterCount('[data-cy="eventlist-filter-all"]')
  .then((allCount) => {

    cy.userGetOneFilterCount('[data-cy="eventlist-filter-submitted"]')
      .then((inReviewCount) => {

        cy.get('[data-cy="eventlist-create-event-btn"]')
          .click();

        cy.url()
          .should('contain', '/user/events/new');

        cy.get('[data-cy="eventform-name-input"]').clear();
        cy.get('[data-cy="eventform-date-input"]').clear();
        cy.get('[data-cy="eventform-location-input"]').invoke('val', '').trigger('change');
        cy.get('[data-cy="eventform-type-input"]').invoke('val', '').trigger('change');
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

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-submitted"]')
          .should('eq', inReviewCount);
      }); 
    });
});

//// Review New Event
Cypress.Commands.add('adminAcceptEventNew', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('Submitted')
    .then((inReviewCount) => {
      cy.adminGetOneStatusCount('In Progress')
      .then((inProgressCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Submitted');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event in review');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Accepting event:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();

          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="review-new-comment-input"]')
            .should('be.visible')
            .type('After reviewing, we have accepted this request. We will reach out shortly via email.');

          cy.get('[data-cy="accept-new-event-btn"]')
            .should('be.enabled')
            .click();

          cy.url()
            .should('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'In Progress')
            .and('not.contain', 'Submitted');

          cy.adminGetOneStatusCount('All')
            .should('eq', allCount);
          cy.adminGetOneStatusCount('Submitted')
            .should('eq', inReviewCount - 1);
          cy.adminGetOneStatusCount('In Progress')
            .should('eq', inProgressCount + 1);
        });
      });
    });
  });
});

Cypress.Commands.add('adminAcceptEventNewError', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('Submitted')
    .then((inReviewCount) => {
      cy.adminGetOneStatusCount('In Progress')
      .then((inProgressCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Submitted');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event in review');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Accepting event:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();

          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="review-new-comment-input"]')
            .should('be.visible')
            .clear();

          cy.get('[data-cy="accept-new-event-btn"]')
            .should('be.disabled')

          cy.get('[data-cy="return-dashboard-btn"]')
            .click();

          cy.url()
            .should('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'Submitted')
            .and('not.contain', 'In Progress');

          cy.adminGetOneStatusCount('All')
            .should('eq', allCount);
          cy.adminGetOneStatusCount('Submitted')
            .should('eq', inReviewCount);
          cy.adminGetOneStatusCount('In Progress')
            .should('eq', inProgressCount);
        });
      });
    });
  });
});

Cypress.Commands.add('adminRejectEventNew', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('Submitted')
    .then((reviewCount) => {
      cy.adminGetOneStatusCount('Cancelled')
      .then((cancelledCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Submitted');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event in review');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Rejecting event:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();

          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="review-new-comment-input"]')
            .type('After much consideration, we decided to decline this request.');

          cy.get('[data-cy="decline-new-event-btn"]')
            .should('be.enabled')
            .click();

          cy.url()
            .should('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'Cancelled');

          cy.adminGetOneStatusCount('All')
            .should('eq', allCount);
          cy.adminGetOneStatusCount('Submitted')
            .should('eq', reviewCount - 1);
          cy.adminGetOneStatusCount('Cancelled')
            .should('eq', cancelledCount + 1);
        });
      });
    });
  });
});

Cypress.Commands.add('adminConsiderEventNew', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('Submitted')
    .then((inReviewCount) => {
      cy.adminGetOneStatusCount('In Progress')
      .then((inProgressCount) => {
        cy.adminGetOneStatusCount('Cancelled')
        .then((cancelledCount) => {

          cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
            const target = $entries.filter((i, el) => {
              const $el = Cypress.$(el);
              return $el.text().includes('Submitted');
            });

            expect(target.length).to.be.greaterThan(0, 'Should have at least one event in review');

            const eventId = Cypress.$(target.first()).attr('data-event-id');

            // cy.log('Viewing event without action:', eventId);

            cy.wrap(target.first())
              .find('[data-cy="dashboard-table-entry-view-btn"]')
              .click();

            cy.url()
              .should('include', '/admin/events/')
              .and('not.contain', '/edit');

            cy.get('[data-cy="return-dashboard-btn"]')
              .scrollIntoView()
              .click();

            cy.url()
              .should('contain', '/admin/dashboard');

            cy.get(`[data-event-id="${eventId}"]`)
              .should('contain', 'Submitted');

            cy.adminGetOneStatusCount('All')
              .should('eq', allCount);
            cy.adminGetOneStatusCount('Submitted')
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
});

//// Update Existing Event
Cypress.Commands.add('userSaveEventUpdate', (updates = {}) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .as('initialCount');

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

  cy.url()
    .should('contain', '/user/events/event_')
    .and('contain', '/edit');

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

  cy.get('[data-cy="eventform-save-btn"]')
    .should('be.enabled')
    .click();

  cy.url()
    .should('contain', '/user/events');

  cy.get('@initialCount').then((count) => {
    cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
      .should('eq', count);
  });

  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && !$el.text().includes('Pending');
    });

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-edit-btn"]')
      .click();
  });

  cy.url()
    .should('contain', '/user/events/event_')
    .and('contain', '/edit');

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
        const cleanVal = val.replace(/,/g, '');
        expect(cleanVal).to.equal(updates.guestCount.toString());
      });
  }
  
  if (updates.budget !== undefined) {
    cy.get('[data-cy="eventform-budget-input"]')
      .invoke('val')
      .then((val) => {
        const cleanVal = val.replace(/,/g, '');
        expect(cleanVal).to.equal(updates.budget.toString());
      });
  }
  
  if (updates.description !== undefined) {
    cy.get('[data-cy="eventform-description-input"]')
      .should('have.value', updates.description);
  }

  cy.get('[data-cy="eventform-cancel-btn"]')
    .click();

  cy.url()
    .should('contain', '/user/events')
    .and('not.contain', '/event_');
});

Cypress.Commands.add('userSaveEventUpdateError', (updates = {}) => {
  cy.url().then((url) => {
    if (!url.includes('/user/events/event_')) {
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

      cy.url()
        .should('contain', '/user/events/event_')
        .and('contain', '/edit');
    }
  });

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

  cy.get('form')
    .submit();

  cy.url()
    .should('contain', '/user/events/event_');

  cy.get('[data-cy$="-error"]')
    .should('exist')
    .and('be.visible');

  cy.get('[data-cy="eventform-cancel-btn"]')
    .click();

  cy.url()
    .should('contain', '/user/events')
    .and('not.contain', '/event_');
});

Cypress.Commands.add('userCancelEventUpdate', (updates = {}) => {
  cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
    .as('initialCount');

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

  cy.url()
    .should('contain', '/user/events/event_')
    .and('contain', '/edit')

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

      cy.get('[data-cy="eventform-cancel-btn"]')
        .click();

      cy.url()
        .should('contain', '/user/events')
        .and('not.contain', '/event_');

      cy.get('@initialCount').then((count) => {
        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', count);
      });

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

      cy.get('[data-cy="eventform-cancel-btn"]')
        .click();

      cy.url()
        .should('contain', '/user/events');
    });
});

//// Submit Cancel Event
Cypress.Commands.add('userSubmitEventCancel', () => {
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

        // cy.log('Requesting cancellation for event:', eventId);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
          .click();

        cy.url()
          .should('contain', '/user/events/event_')
          .and('not.contain', '/edit')

        cy.get('[data-cy="cancel-event-comment-input"]')
          .type('I need to cancel this event due to family reasons.');

        cy.get('[data-cy="cancel-event-submit-btn"]')
          .should('be.enabled')
          .click();

        cy.url()
          .should('contain', '/user/events');

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', inProgressCount);

        cy.get(`[data-event-id="${eventId}"]`)
          .should('contain', 'In Progress')
          .and('contain', 'Pending');
      });
    });
});

Cypress.Commands.add('userSubmitEventCancelError', () => {
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

        // cy.log('Requesting cancellation for event:', eventId);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
          .click();

        cy.url()
          .should('contain', '/user/events/event_')
          .and('not.contain', '/edit')

        cy.get('[data-cy="cancel-event-comment-input"]')
          .clear();

        cy.get('[data-cy="cancel-event-submit-btn"]')
          .should('be.disabled');

        cy.get('[data-cy="cancel-event-cancel-btn"]')
          .should('be.enabled')
          .click();

        cy.url()
          .should('contain', '/user/events');

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', inProgressCount);

        cy.get(`[data-event-id="${eventId}"]`)
          .should('contain', 'In Progress')
          .and('not.contain', 'Pending');
      });
    });
});

Cypress.Commands.add('userCancelEventCancel', () => {
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

        // cy.log('Requesting cancellation for event:', eventId);

        cy.wrap(target.first())
          .find('[data-cy="eventlist-event-list-entry-cancel-btn"]')
          .click();

        cy.url()
          .should('contain', '/user/events/event_')
          .and('not.contain', '/edit')

        cy.get('[data-cy="cancel-event-comment-input"]')
          .type('I need to cancel this event due to family reasons.');

        cy.get('[data-cy="cancel-event-cancel-btn"]')
          .should('be.enabled')
          .click();

        cy.url()
          .should('contain', '/user/events');

        cy.userGetOneFilterCount('[data-cy="eventlist-filter-in-progress"]')
          .should('eq', inProgressCount);

        cy.get(`[data-event-id="${eventId}"]`)
          .should('contain', 'In Progress')
          .and('not.contain', 'Pending');
      });
    });
});

//// Review Cancel Event
Cypress.Commands.add('adminAcceptEventCancel', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
      cy.adminGetOneStatusCount('Cancelled')
      .then((cancelledCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Reviewing Cancellation');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing cancellation');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Accepting cancellation for event:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();

          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="review-cancel-comment-input"]')
            .scrollIntoView()
            .type('After much consideration, we have approved the cancellation request.');

          cy.get('[data-cy="accept-cancel-event-btn"]')
            .should('be.enabled')
            .click();

          cy.url()
            .should('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'Cancelled')
            .and('not.contain', 'Reviewing Cancellation');

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
});

Cypress.Commands.add('adminAcceptEventCancelError', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
      cy.adminGetOneStatusCount('Cancelled')
      .then((cancelledCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Reviewing Cancellation');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing cancellation');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Accepting cancellation for event:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();
          
          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="review-cancel-comment-input"]')
            .scrollIntoView()
            .clear();

          cy.get('[data-cy="accept-cancel-event-btn"]')
            .should('be.disabled');
          
          cy.get('[data-cy="return-dashboard-btn"]')
            .click();

          cy.url()
            .should('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'Reviewing Cancellation')
            .and('not.contain', 'Cancelled');

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
});

Cypress.Commands.add('adminRejectEventCancel', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
      cy.adminGetOneStatusCount('Cancelled')
      .then((cancelledCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Reviewing Cancellation');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing cancellation');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Rejecting cancellation for event:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();
          
          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="review-cancel-comment-input"]')
            .scrollIntoView()
            .type('After much consideration, we\'re unable to cancel this event at this moment.');

          cy.get('[data-cy="decline-cancel-event-btn"]')
            .should('be.enabled')
            .click();

          cy.url()
            .should('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'In Progress')
            .and('not.contain', 'Reviewing Cancellation');

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
});

Cypress.Commands.add('adminConsiderEventCancel', () => {
  cy.adminGetOneStatusCount('All')
  .then((allCount) => {
    cy.adminGetOneStatusCount('In Progress')
    .then((inProgressCount) => {
      cy.adminGetOneStatusCount('Cancelled')
      .then((cancelledCount) => {

        cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
          const target = $entries.filter((i, el) => {
            const $el = Cypress.$(el);
            return $el.text().includes('Reviewing Cancellation');
          });

          expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing cancellation');

          const eventId = Cypress.$(target.first()).attr('data-event-id');

          // cy.log('Viewing cancellation request without action:', eventId);

          cy.wrap(target.first())
            .find('[data-cy="dashboard-table-entry-view-btn"]')
            .click();
          
          cy.url()
            .should('include', '/admin/events/')
            .and('not.contain', '/edit');

          cy.get('[data-cy="return-dashboard-btn"]')
            .last()
            .scrollIntoView()
            .click();

          cy.url()
          .should ('contain', '/admin/dashboard');

          cy.get(`[data-event-id="${eventId}"]`)
            .should('contain', 'Reviewing Cancellation');

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
});

//// Submit Complete Event
Cypress.Commands.add('adminSubmitEventComplete', () => {
  cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && 
             !$el.text().includes('Pending Completion') &&
             !$el.text().includes('Reviewing Cancellation');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one available In Progress event');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Submitting completion for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="dashboard-table-entry-complete-btn"]')
      .click();

    cy.url()
      .should('include', '/admin/events/')
      .and('contain', 'mode=complete');

    cy.get('[data-cy="eventview-action-complete"]')
      .should('exist');

    // NO CHECKBOX - just fill in the comment
    cy.get('[data-cy="complete-event-comment-input"]')
      .type('All tasks completed successfully.');

    cy.get('[data-cy="save-event-update-btn"]')
      .should('be.enabled')
      .click();

    cy.url().should('include', '/admin/dashboard');

    // Verify this specific event now shows "Pending Completion"
    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'In Progress')
      .and('contain', 'Pending Completion');
  });
});

Cypress.Commands.add('adminSubmitEventCompleteError', () => {
  cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && 
             !$el.text().includes('Pending Completion') &&
             !$el.text().includes('Reviewing Cancellation');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one available In Progress event');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Testing completion error for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="dashboard-table-entry-complete-btn"]')
      .click();

    cy.url()
      .should('include', '/admin/events/')
      .and('contain', 'mode=complete');

    cy.get('[data-cy="eventview-action-complete"]')
      .should('exist');

    cy.get('[data-cy="save-event-update-btn"]')
      .should('be.disabled');

    cy.get('[data-cy="return-dashboard-btn"]')
      .click();

    cy.url().should('include', '/admin/dashboard');

    // Verify this specific event does NOT show "Pending Completion"
    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'In Progress')
      .and('not.contain', 'Pending Completion');
  });
});

Cypress.Commands.add('adminCancelEventComplete', () => {
  cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('In Progress') && 
             !$el.text().includes('Pending Completion') &&
             !$el.text().includes('Reviewing Cancellation');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one available In Progress event');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Testing cancel completion for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="dashboard-table-entry-complete-btn"]')
      .click();

    cy.url()
      .should('include', '/admin/events/')
      .and('contain', 'mode=complete');

    cy.get('[data-cy="eventview-action-complete"]')
      .should('exist');

    // Fill in comment but then cancel
    cy.get('[data-cy="complete-event-comment-input"]')
      .type('Testing cancel flow.');

    cy.get('[data-cy="return-dashboard-btn"]')
      .click();

    cy.url().should('include', '/admin/dashboard');

    // Verify this specific event does NOT show "Pending Completion"
    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'In Progress')
      .and('not.contain', 'Pending Completion');
  });
});

//// Review Complete Event
Cypress.Commands.add('userAcceptEventComplete', () => {
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('Reviewing Completion');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing completion');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Accepting completion for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-view-btn"]')
      .click();

    cy.url()
      .should('include', '/user/events/event_')
      .and('not.contain', '/edit');

    cy.get('[data-cy="confirm-completion-section"]')
      .should('exist');

    cy.get('[data-cy="confirm-completion-comment-input"]')
      .type('Everything was completed perfectly. Thank you.');

    cy.get('[data-cy="confirm-completion-submit-btn"]')
      .should('be.enabled')
      .click();

    cy.url().should('include', '/user/events');

    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'Completed')
      .and('not.contain', 'Reviewing Completion');
  });
});

Cypress.Commands.add('userAcceptEventCompleteError', () => {
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('Reviewing Completion');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing completion');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Testing completion error for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-view-btn"]')
      .click();

    cy.url()
      .should('include', '/user/events/event_')
      .and('not.contain', '/edit');

    cy.get('[data-cy="confirm-completion-section"]')
      .should('exist');

    // Do NOT enter feedback - both buttons should be disabled
    cy.get('[data-cy="confirm-completion-submit-btn"]')
      .should('be.disabled');
    
    cy.get('[data-cy="decline-completion-submit-btn"]')
      .should('be.disabled');

    // Use the new return button instead of cy.visit
    cy.get('[data-cy="return-eventlist-btn"]')
      .should('be.enabled')
      .click();

    cy.url().should('include', '/user/events');

    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'Reviewing Completion');
  });
});

Cypress.Commands.add('userRejectEventComplete', () => {
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('Reviewing Completion');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing completion');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Rejecting completion for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-view-btn"]')
      .click();

    cy.url().should('include', '/user/events/event_');

    cy.get('[data-cy="confirm-completion-section"]')
      .should('exist')
      .and('not.contain', '/edit');

    cy.get('[data-cy="confirm-completion-comment-input"]')
      .type('Some details still need attention.');

    cy.get('[data-cy="decline-completion-submit-btn"]')
      .should('be.enabled')
      .click();

    cy.url().should('include', '/user/events');

    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'In Progress')
      .and('not.contain', 'Reviewing Completion');
  });
});

Cypress.Commands.add('userConsiderEventComplete', () => {
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      return $el.text().includes('Reviewing Completion');
    });

    expect(target.length).to.be.greaterThan(0, 'Should have at least one event reviewing completion');

    const eventId = Cypress.$(target.first()).attr('data-event-id');

    // cy.log('Considering completion for event:', eventId);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-view-btn"]')
      .click();

    cy.url()
      .should('include', '/user/events/event_')
      .and('not.contain', '/edit');

    cy.get('[data-cy="confirm-completion-section"]')
    .should('exist');

    // Use the new return button instead of cy.visit
    cy.get('[data-cy="return-eventlist-btn"]')
      .should('be.enabled')
      .click();

    cy.url()
      .should('include', '/user/events');

    cy.get(`[data-event-id="${eventId}"]`)
      .should('contain', 'Reviewing Completion');
  });
});

//// View Event
Cypress.Commands.add('userViewEvent', (status, badge = null) => {
  cy.get('[data-cy="eventlist-event-list-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      const text = $el.text();
      
      // If status is provided, filter by it
      if (status) {
        const hasStatus = text.includes(status);
        
        // If badge is also provided, filter by both
        if (badge) {
          return hasStatus && text.includes(badge);
        }
        
        // If only status, check for specific combinations
        if (status === 'In Progress' && !badge) {
          // In Progress without any badges (clean In Progress)
          return hasStatus && 
                 !text.includes('Pending Cancellation') && 
                 !text.includes('Reviewing Completion');
        }
        
        return hasStatus;
      }
      
      // Default behavior: any viewable event
      return (
        text.includes('Submitted') ||
        (text.includes('In Progress') &&
          (text.includes('Pending Cancellation') || 
           text.includes('Reviewing Completion'))) ||
        text.includes('Completed') || 
        text.includes('Cancelled')
      );
    });

    expect(target.length).to.be.greaterThan(0, `Should have at least one event with status: ${status}${badge ? ` and badge: ${badge}` : ''}`);

    const eventId = Cypress.$(target.first()).attr('data-event-id');
    const eventText = Cypress.$(target.first()).text();
    
    // Determine expected sections
    let shouldHaveCompletionSection = false;
    let shouldHaveCancelSection = false;
    
    if (eventText.includes('Reviewing Completion')) {
      shouldHaveCompletionSection = true;
    } else if (eventText.includes('In Progress') && 
               !eventText.includes('Pending Cancellation') && 
               !eventText.includes('Reviewing Completion')) {
      // Clean In Progress can cancel
      shouldHaveCancelSection = true;
    }

    cy.log(`Viewing event ${eventId} - Status: ${status || 'any'}${badge ? `, Badge: ${badge}` : ''}`);

    cy.wrap(target.first())
      .find('[data-cy="eventlist-event-list-entry-view-btn"]')
      .click();

    cy.url()
      .should('contain', '/user/events/event_')
      .and('not.contain', '/edit');

    cy.get('[data-cy="eventview-detail"]')
      .should('exist');

    // Verify sections
    if (shouldHaveCompletionSection) {
      cy.get('[data-cy="confirm-completion-section"]').should('exist');
      cy.get('[data-cy="cancel-event-section"]').should('not.exist');
    } else if (shouldHaveCancelSection) {
      cy.get('[data-cy="cancel-event-section"]').should('exist');
      cy.get('[data-cy="confirm-completion-section"]').should('not.exist');
    } else {
      cy.get('[data-cy="confirm-completion-section"]').should('not.exist');
      cy.get('[data-cy="cancel-event-section"]').should('not.exist');
    }

    cy.get('[data-cy="return-eventlist-btn"]')
      .should('be.enabled')
      .click();

    cy.url().should('contain', '/user/events');
    cy.url().should('not.contain', '/event_');

    // Verify the event status hasn't changed - use the original eventText to determine what to check
    cy.get(`[data-event-id="${eventId}"]`).then($event => {
      const updatedText = $event.text();
      
      // Check that the status we originally filtered for is still there
      if (status) {
        expect(updatedText).to.contain(status);
        
        // If we also filtered by badge, check that too
        if (badge) {
          expect(updatedText).to.contain(badge);
        }
      } else {
        // If no status was specified, just check it's still viewable
        const isStillViewable = updatedText.includes('Submitted') ||
                                updatedText.includes('In Progress') ||
                                updatedText.includes('Completed') ||
                                updatedText.includes('Cancelled');
        expect(isStillViewable).to.be.true;
      }
    });
  });
});

Cypress.Commands.add('adminViewEvent', (status, badge = null) => {
  cy.get('[data-cy="dashboard-table-entry"]').then($entries => {
    const target = $entries.filter((i, el) => {
      const $el = Cypress.$(el);
      const text = $el.text();
      
      // If status is provided, filter by it
      if (status) {
        const hasStatus = text.includes(status);
        
        // If badge is also provided, filter by both
        if (badge) {
          return hasStatus && text.includes(badge);
        }
        
        // If only status, check for specific combinations
        if (status === 'Submitted' && !badge) {
          // Submitted without any other badges (should have Reviewing Submission)
          return hasStatus && text.includes('Reviewing Event');
        }

        if (status === 'In Progress' && !badge) {
          // In Progress without any badges (clean In Progress - no Pending/Reviewing)
          return hasStatus && 
                 !text.includes('Pending Completion') && 
                 !text.includes('Reviewing Cancellation');
        }
        return hasStatus;
      }
      
      // Default behavior: any viewable event (has action sections or is read-only)
      return (
        (text.includes('Submitted') && text.includes('Reviewing Submission')) ||
        (text.includes('In Progress') &&
          (text.includes('Pending Completion') || 
           text.includes('Reviewing Cancellation'))) ||
        text.includes('Completed') || 
        text.includes('Cancelled')
      );
    });

    expect(target.length).to.be.greaterThan(0, `Should have at least one event with status: ${status}${badge ? ` and badge: ${badge}` : ''}`);

    const eventId = Cypress.$(target.first()).attr('data-event-id');
    const eventText = Cypress.$(target.first()).text();
    
    // Determine if action section should exist
    let shouldHaveActionSection = false;
    
    // Action section exists for:
    // - Submitted (review submission)
    // - In Progress with Reviewing Cancellation
    // Note: In Progress with Pending Completion shows info only, no action buttons
    if (eventText.includes('Submitted') || 
        eventText.includes('Reviewing Cancellation')) {
      shouldHaveActionSection = true;
    }

    cy.log(`Viewing event ${eventId} - Status: ${status || 'any'}${badge ? `, Badge: ${badge}` : ''}`);

    cy.wrap(target.first())
      .find('[data-cy="dashboard-table-entry-view-btn"]')
      .click();
      
    cy.url()
      .should('contain', '/admin/events/event_')
      .and('not.contain', '/edit');

    cy.get('[data-cy="eventview-details"]')
      .should('exist');

    // Verify action section presence
    if (shouldHaveActionSection) {
      cy.get('[data-cy="eventview-action"]').should('exist');
      
      // Verify specific subsections
      if (eventText.includes('Submitted')) {
        cy.get('[data-cy="eventview-action-review-new"]').should('exist');
      } else if (eventText.includes('Reviewing Cancellation')) {
        cy.get('[data-cy="eventview-action-review-cancel"]').should('exist');
      }
    } else {
      // Read-only events (Completed, Cancelled, Pending Completion) have no action section with buttons
      // Pending Completion shows info section inside eventview-action but no action buttons
      if (eventText.includes('Pending Completion')) {
        cy.get('[data-cy="eventview-action"]').should('exist'); // Info section exists
        cy.get('[data-cy="eventview-action-review-new"]').should('not.exist');
        cy.get('[data-cy="eventview-action-review-cancel"]').should('not.exist');
      } else {
        cy.get('[data-cy="eventview-action"]').should('not.exist');
      }
    }

    cy.get('[data-cy="return-dashboard-btn"]')
      .should('be.enabled')
      .click();

    cy.url().should('contain', '/admin/dashboard');

    // Verify the event status hasn't changed
    cy.get(`[data-event-id="${eventId}"]`).then($event => {
      const updatedText = $event.text();
      
      // Check that the status we originally filtered for is still there
      if (status) {
        expect(updatedText).to.contain(status);
        
        // If we also filtered by badge, check that too
        if (badge) {
          expect(updatedText).to.contain(badge);
        }
      } else {
        // If no status was specified, just check it's still viewable
        const isStillViewable = updatedText.includes('Submitted') ||
                                updatedText.includes('In Progress') ||
                                updatedText.includes('Completed') ||
                                updatedText.includes('Cancelled');
        expect(isStillViewable).to.be.true;
      }
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
