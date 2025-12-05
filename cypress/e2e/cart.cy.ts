describe('Cart Page E2E Tests', () => {
  beforeEach(() => {
    // Start with empty cart
    cy.visit('/');
    cy.clearLocalStorage();
  });

  it('should display empty cart', () => {
    cy.visit('/cart');
    
    // Check empty cart message
    cy.contains('Your cart is empty').should('be.visible');
    cy.contains('Continue Shopping').should('be.visible');
    
    // No products should be shown
    cy.get('[data-testid="cart-item"]').should('not.exist');
  });

  it('should add product to cart and display in cart page', () => {
    // Add a product to cart from home page
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('button', 'Add to Cart').click();
    });
    
    // Navigate to cart
    cy.visit('/cart');
    
    // Verify product is in cart
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
    
    // Check product details in cart
    cy.get('[data-testid="cart-item"]').within(() => {
      cy.get('img').should('be.visible');
      cy.get('h3').should('not.be.empty');
      cy.contains('$').should('be.visible');
      cy.get('input[type="number"]').should('have.value', '1');
    });
    
    // Check cart total
    cy.contains('Total:').should('be.visible');
    cy.contains('Checkout').should('be.visible');
  });

  it('should update product quantity in cart', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('button', 'Add to Cart').click();
    });
    
    cy.visit('/cart');
    
    // Increase quantity
    cy.get('[data-testid="cart-item"]').within(() => {
      cy.get('button').contains('+').click();
      cy.get('input[type="number"]').should('have.value', '2');
    });
    
    // Total should update
    cy.get('[data-testid="cart-total"]').should('not.contain', '$0.00');
  });

  it('should remove product from cart', () => {
    // Add product to cart
    cy.get('[data-testid="product-card"]').first().within(() => {
      cy.contains('button', 'Add to Cart').click();
    });
    
    cy.visit('/cart');
    
    // Remove product
    cy.get('[data-testid="cart-item"]').within(() => {
      cy.get('button').contains('Remove').click();
    });
    
    // Cart should be empty
    cy.contains('Your cart is empty').should('be.visible');
    cy.get('[data-testid="cart-item"]').should('not.exist');
  });

  it('should calculate cart total correctly', () => {
    // Add two different products
    cy.get('[data-testid="product-card"]').eq(0).within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    cy.get('[data-testid="product-card"]').eq(1).within(() => {
      cy.get('button').contains('Add to Cart').click();
    });
    
    cy.visit('/cart');
    
    // Get prices and calculate expected total
    let expectedTotal = 0;
    
    cy.get('[data-testid="cart-item"]').each(($item) => {
      cy.wrap($item).within(() => {
        cy.get('[data-testid="product-price"]').invoke('text').then((priceText) => {
          const price = parseFloat(priceText.replace('$', ''));
          cy.get('input[type="number"]').invoke('val').then((quantity) => {
            expectedTotal += price * parseInt(quantity as string);
          });
        });
      });
    }).then(() => {
      // Verify displayed total matches calculated total
      cy.get('[data-testid="cart-total"]').invoke('text').then((totalText) => {
        const displayedTotal = parseFloat(totalText.replace('$', ''));
        expect(displayedTotal).to.be.closeTo(expectedTotal, 0.01);
      });
    });
  });

  it('should continue shopping from empty cart', () => {
    cy.visit('/cart');
    
    // Click continue shopping
    cy.contains('Continue Shopping').click();
    
    // Should return to home page
    cy.url().should('eq', 'http://localhost:3000/');
    cy.contains('Products').should('be.visible');
  });
});