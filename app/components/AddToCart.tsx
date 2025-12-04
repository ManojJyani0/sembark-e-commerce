import React, { useState } from 'react';
import { useCart } from '~/context/cart';
import type { Product } from '~/types';

interface AddToCartButtonProps {
  product: Product;
  variant?: 'primary' | 'secondary' | 'icon';
  className?: string;
  onAdd?: () => void;
}

export function AddToCartButton({ 
  product, 
  variant = 'primary', 
  className = '',
  onAdd 
}: AddToCartButtonProps) {
  const { addToCart, getItemQuantity, isInCart } = useCart();
  const [isAdding, setIsAdding] = useState(false);
  
  const quantityInCart = getItemQuantity(product.id.toString());
  const alreadyInCart = isInCart(product.id.toString());

  const handleAddToCart = async () => {
    if (isAdding) return;
    
    setIsAdding(true);
    try {
      addToCart({
        productId: product.id.toString(),
        title: product.title,
        price: product.price,
        image: product.image,
        category: product.category,
      });
      
      onAdd?.();
      
      // Success animation/feedback
      setTimeout(() => setIsAdding(false), 500);
    } catch (error) {
      console.error('Failed to add to cart:', error);
      setIsAdding(false);
    }
  };

  // Different button variants
  const baseClasses = "transition-all duration-200 font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 text-sm`,
    secondary: `${baseClasses} bg-white border border-blue-600 text-blue-600 hover:bg-blue-50 px-6 py-3 text-sm`,
    icon: `${baseClasses} bg-blue-600 hover:bg-blue-700 text-white p-2`
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={isAdding}
      className={`${variants[variant]} ${className} ${alreadyInCart ? 'opacity-80' : ''}`}
      aria-label={alreadyInCart ? `Update quantity (${quantityInCart} in cart)` : 'Add to cart'}
    >
      {isAdding ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          Adding...
        </span>
      ) : alreadyInCart ? (
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Added ({quantityInCart})
        </span>
      ) : (
        <span className="flex items-center justify-center">
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Add to Cart
        </span>
      )}
    </button>
  );
}