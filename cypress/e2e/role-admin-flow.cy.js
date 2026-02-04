describe(`Admin Experience Flow`, () => {
    // Setup variables
    const adminEmail = 'admin@cypressifier.com';
    const adminPassword = 'admin123';
    const userEmail = 'jane.doe@example.com';
    const userPassword = 'user123';

    describe(`Admin Authentication`, () => {
        before(() => {
            cy.clearCacheLoadLanding();
        });

        it(`should navigate to /login`, () => {
            cy.landingToLogin();
        });

        it(`should login as admin and navigate to /admin/dashboard`, () => {
            cy.adminLogin(adminEmail, adminPassword);
        });

        it(`should logout as admin and navigate back to /`, () => {
            cy.userLogout();
        });
    });

    // describe(`Admin's Event Management`, () => {
    //     beforeEach(() => {

    //     });

    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });

    // describe(`Admin's Dev Tool`, () => {
    //     beforeEach(() => {

    //     });

    //     it(``, () => {

    //     });

    //     it(``, () => {

    //     });
    // });
});