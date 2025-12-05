/// <reference types="cypress" />

declare global {
  namespace Cypress {
    interface Chainable {
      /**
       * Wait for products to load
       */
      waitForProducts(): Chainable<Element>;
      
      /**
       * Add product to cart by index
       */
      addToCart(index?: number): Chainable<Element>;
      
      /**
       * Navigate to cart
       */
      goToCart(): Chainable<Element>;
      
      /**
       * Get cart item count
       */
      getCartCount(): Chainable<number>;
    }
  }
}

Cypress.Commands.add('waitForProducts', () => {
  cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
});

Cypress.Commands.add('addToCart', (index = 0) => {
  cy.get('[data-testid="product-card"]').eq(index).within(() => {
    cy.contains('button', 'Add to Cart').click();
  });
});

Cypress.Commands.add('goToCart', () => {
  cy.visit('/cart');
});

Cypress.Commands.add('getCartCount', () => {
  return cy.get('[data-testid="cart-count"]').invoke('text').then(parseInt);
});