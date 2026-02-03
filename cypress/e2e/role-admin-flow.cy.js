describe(`Admin Experience Flow`, () => {
    // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';

    beforeEach(() => {
        cy.userSignup(userEmail, userPassword);

        cy.userLogout();
    });

    describe(`level 1 testing`, () => {

        it(`testing 1`, () => {
            cy.url()
            .should('eq','http://localhost:5173/');
        });

        it(`testing 1`, () => {
            cy.adminLogin(adminEmail, adminPassword);
        });
    });

    // describe(``, () => {
    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });
});