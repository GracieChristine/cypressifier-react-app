describe(`Landing Page`, () => {
    // Visit landing page and clear storage before each test
    beforeEach(() => {
        cy.visit(`http://localhost:5173`);
        cy.clearLocalStorage();
    });

    describe(`Landing Page UI`, () => {
        it(`should display brand`, () => {
            cy.get(`splash-brand-name`)
            .contains(`Cypressifier`)
            .and(`be.visible`);
        });
        
        it(`should display description`, () => {
            cy.get(`splash-brand-tag`)
            .contains(`An Event Planning & Design Experience`)
            .and(`be.visible`);
        });

        it(`should display signup button`, () => {
            cy.get(`splash-signup-btn`)
            .contain(`Sign Up`)
            .and(`be.visible`);
        });

        it(`should display signup button first`, () => {
            cy.get(`splash-btns`)
            .find(`button`)
            .first()
            .should(`have.attr`, `data-cy`, `splash-signin-btn`)
            .and(`be.visible`);
        });

        it(`should display login button`, () => {
            cy.get(`splash-login-btn`)
            .contain(`Login`)
            .and(`be.visible`);
        });

        it(`should display login button last`, () => {
            cy.get(`splash-btns`)
            .get(`button:last-child`)
            .should(`have.attr`, `data-cy`, `splash-login-btn`)
            .and(`be.visible`);
        });
    });
});