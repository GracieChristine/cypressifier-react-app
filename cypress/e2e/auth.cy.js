describe('Authentication', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173');
    cy.clearLocalStorage();
  });

  it('should allow user to sign up', () => {
    cy.get('[data-cy="nav-signup"]').click();
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="confirm-password-input"]').type('password123');
    cy.get('[data-cy="signup-submit"]').click();
    cy.contains('Items Management').should('be.visible');
  });

  it('should allow user to login', () => {
    // First create an account
    cy.visit('http://localhost:5173');
    cy.get('[data-cy="nav-signup"]').click();
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="confirm-password-input"]').type('password123');
    cy.get('[data-cy="signup-submit"]').click();
    
    // Logout
    cy.get('[data-cy="logout-btn"]').click();
    
    // Now login
    cy.get('[data-cy="email-input"]').type('test@example.com');
    cy.get('[data-cy="password-input"]').type('password123');
    cy.get('[data-cy="login-submit"]').click();
    cy.contains('Items Management').should('be.visible');
  });
});