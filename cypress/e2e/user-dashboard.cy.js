describe(`Dashboard Page`, () => {
    // Set variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';

    beforeEach(() => {
        cy.visit('http://localhost:5173');
        cy.clearLocalStorage();

        cy.get('[data-cy="landing-login-btn"]')
        .click();

        cy.get('[data-cy="login-email"]')
        .type(adminEmail);

        cy.get('[data-cy="login-password"]')
        .type(adminPassword);

        cy.get('form')
        .submit();
    });

    describe(`Dashboard Page UI/UX - General`, () => {
        beforeEach(() => {

        });

        it(`should display brand on navbar`, () => {
            cy.get('[data-cy="nav-brand-name"]')
            .should('have.text', 'Cypressifier')
            .and('be.visible');
        });

        it(`should display admin tag on navbar`, () => {
            cy.get('[data-cy="nav-user-role"]')
            .should('exist')
            .should('have.text', 'Just an Admin')
            .and('be.visible');
        });

        it(`should display admin email on navbar`, () => {
            cy.get('[data-cy="nav-user-email"]')
            .should('exist')
            .should('have.text', adminEmail)
            .and('be.visible');
        });

        it(`should display logout button on navbar`, () => {
            cy.get('[data-cy="nav-logout-btn"]')
            .should('have.text', 'Logout')
            .and('be.visible');
        });

        it(`should display copyright at footer`, () => {
            cy.get('footer')
            cy.get('[data-cy="copyright"]')
            .should('have.text', '© 2026 Cypressifier Event Planning. Crafted with excellence.')
            .and('be.visible');
        });
    });

    describe(`Dashboard - Header`, () => {
        beforeEach(() => {
            cy.get('[data-cy="dashboard"]')
            .get('[data-cy="dashboard-header"]')
            .and('be.visible');
        });

        it(`should display header title`, () => {
            cy.get('[data-cy="dashboard-header"]')
            .find('h1')
            .should('have.text', 'Admin Dashboard')
            .and('be.visible');
        });

        it(`should display header tagline`, () => {
            cy.get('[data-cy="dashboard-header"]')
            .find('p')
            .should('have.text', 'Manage all events and requests')
            .and('be.visible');
        });
    });

    describe(`Dashboard - Stat Box`, () => {
        beforeEach(() => {
            cy.get('[data-cy="dashboard"]')
            .get('[data-cy="dashboard-stat"]')
            .and('be.visible');
        });

        it(`should display 5 stat boxes`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .get('[data-cy="dashboard-stat-box"]')
            .should('have.length', 5)
            .and('be.visible');
        });

        it(`should display all stat box correctly`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .find('[data-cy="dashboard-stat-box"]:first-child')
            .should('have.text', 'All (0)')
            .should('have.css', 'color', 'rgb(55, 65, 81)')
            .should('have.css', 'background-color', 'rgb(243, 244, 246)')
            .and('be.visible');
        });

        it(`should display in review stat box correctly `, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .find('[data-cy="dashboard-stat-box"]')
            .eq(1)
            .should('have.text', 'In Review (0)')
            .should('have.css', 'color', 'rgb(29, 78, 216)')
            .should('have.css', 'background-color', 'rgb(219, 234, 254)')
            .and('be.visible');
        });

        it(`should display in progress stat box correctly`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .find('[data-cy="dashboard-stat-box"]')
            .eq(2)
            .should('have.text', 'In Progress (0)')
            .should('have.css', 'color', 'rgb(161, 98, 7)')
            .should('have.css', 'background-color', 'rgb(254, 249, 195)')
            .and('be.visible');
        });

        it(`should display completed stat box correctly`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .find('[data-cy="dashboard-stat-box"]')
            .eq(3)
            .should('have.text', 'Completed (0)')
            .should('have.css', 'color', 'rgb(21, 128, 61)')
            .should('have.css', 'background-color', 'rgb(220, 252, 231)')
            .and('be.visible');
        });

        it(`should display cancelled stat box correctly`, () => {
            cy.get('[data-cy="dashboard-stat"]')
            .find('[data-cy="dashboard-stat-box"]')
            .eq(4)
            .should('have.text', 'Cancelled (0)')
            .should('have.css', 'color', 'rgb(185, 28, 28)')
            .should('have.css', 'background-color', 'rgb(254, 226, 226)')
            .and('be.visible');
        });
    });

    describe(`Dashboard - Table`, () => {
        beforeEach(() => {

        });

        it(``, () => {

        });

        it(``, () => {

        });
    });

    describe(`Dashboard - Table Actionable Buttons`, () => {
        beforeEach(() => {

        });

        it(``, () => {

        });

        it(``, () => {

        });
    });
});