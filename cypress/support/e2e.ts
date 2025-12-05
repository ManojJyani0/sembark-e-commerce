// Import commands.js
import './commands';

// Global beforeEach
beforeEach(() => {
  // Clear localStorage to start with fresh cart
  cy.clearLocalStorage();
  
  // Clear session storage
  cy.clearAllSessionStorage();
  
  // Clear cookies
  cy.clearCookies();
  
  // Log test start
  cy.log(`Starting test: ${Cypress.currentTest.title}`);
});

// Global afterEach
afterEach(() => {
  // Take screenshot on failure
  if (Cypress.currentTest.state === 'failed') {
    cy.log('Test failed, capturing screenshot');
    const testTitle = Cypress.currentTest.title.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    cy.screenshot(`${Cypress.spec.name}/${testTitle}`, { overwrite: true });
  }
  
  // Log test completion
  cy.log(`Completed test: ${Cypress.currentTest.title} - ${Cypress.currentTest.state}`);
});