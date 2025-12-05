describe('Home Page E2E Tests', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the homepage successfully', () => {
    // Check page loads without errors
    cy.contains('Products').should('be.visible');
    cy.contains('Error').should('not.exist');
    
    // Check main elements are present
    cy.get('input[type="search"]').should('be.visible');
    cy.get('select').should('be.visible');
    cy.get('button').should('be.visible');
  });

  it('should display products', () => {
    // Wait for products to load
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Check product information
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.get('img').should('be.visible');
      cy.get('h3').should('not.be.empty');
      cy.contains('$').should('be.visible');
    });
  });

  it('should filter products by search', () => {
    const searchQuery = 'jacket';
    
    cy.get('input[type="search"]').type(searchQuery).type('{enter}');
    
    // Check products are filtered
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // Verify search appears in URL
    cy.url().should('include', `search=${searchQuery}`);
  });

  it('should filter products by category', () => {
    cy.get('select').select('electronics');
    
    // Check URL contains category filter
    cy.url().should('include', 'category=electronics');
    
    // Wait for filtered results
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).each(($card) => {
      cy.wrap($card).should('contain', 'electronics');
    });
  });

  it('should sort products', () => {
    cy.get('select').eq(1).select('price-low');
    
    // Wait for sorted results
    cy.get('[data-testid="product-card"]', { timeout: 10000 }).should('have.length.greaterThan', 0);
    
    // URL should contain sort parameter
    cy.url().should('include', 'sortBy=price-low');
  });
});