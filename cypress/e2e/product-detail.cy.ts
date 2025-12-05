describe('Product Detail Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
    // Wait for products to load
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
  });

  it('should navigate to product detail page', () => {
    // Get first product title
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('h3').invoke('text').then((productTitle) => {
        // Click on product to go to detail page
        cy.get('a').first().click();
        
        // Verify we're on product detail page
        cy.url().should('include', '/product/');
        cy.contains(productTitle).should('be.visible');
      });
    });
  });

  it('should display product details correctly', () => {
    // Navigate to first product detail page
    cy.get('[data-testid="product-card"]').first().find('a').first().click();
    
    // Check all product details are displayed
    cy.get('img').should('be.visible');
    cy.get('h1').should('not.be.empty');
    cy.contains('$').should('be.visible');
    cy.contains('Category:').should('be.visible');
    cy.contains('Rating:').should('be.visible');
    cy.contains('Description').should('be.visible');
    
    // Check action buttons
    cy.contains('button', 'Add to Cart').should('be.visible');
    cy.contains('button', 'Buy Now').should('be.visible');
  });

  it('should add product to cart', () => {
    // Navigate to product detail
    cy.get('[data-testid="product-card"]').first().find('a').first().click();
    
    // Add to cart
    cy.contains('button', 'Add to Cart').click();
    
    // Check cart count updates
    cy.get('[data-testid="cart-count"]').should('contain', '1');
    
    // Verify success message
    cy.contains('Added to cart').should('be.visible');
  });

  it('should handle product quantity', () => {
    cy.get('[data-testid="product-card"]').first().find('a').first().click();
    
    // Increase quantity
    cy.get('button').contains('+').click();
    
    // Quantity should be 2
    cy.get('input[type="number"]').should('have.value', '2');
    
    // Add to cart with quantity 2
    cy.contains('button', 'Add to Cart').click();
    
    // Cart should show quantity 2
    cy.get('[data-testid="cart-count"]').should('contain', '2');
  });
});