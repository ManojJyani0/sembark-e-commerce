import React from 'react';
import { Link } from 'react-router';
import { useCart } from '~/context/cart';
import { currencyFormatter } from '~/utils';

interface CartMiniSummaryProps {
  className?: string;
  showItemCount?: boolean;
}

export function CartMiniSummary({ 
  className = '',
  showItemCount = true 
}: CartMiniSummaryProps) {
  const { totalItems, totalPrice, items } = useCart();
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const uniqueProducts = new Set(items.map(item => item.productId)).size;

  return (
    <div className={`bg-white rounded-lg  p-4 shadow-sm ${className}`}>
      <div className="space-y-3">
        {/* Header */}
        <div className="flex justify-between items-center pb-3 border-b">
          <h3 className="font-semibold text-gray-900">Cart Summary</h3>
          {showItemCount && totalItems > 0 && (
            <span className="text-sm text-gray-600">
              {totalItems} item{totalItems !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {/* Quick Stats */}
        {totalItems > 0 ? (
          <>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">{currencyFormatter(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Products</span>
                <span>{uniqueProducts} unique</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Savings</span>
                <span className="text-green-600 font-medium">
                  {currencyFormatter(subtotal - totalPrice)}
                </span>
              </div>
            </div>
            
            {/* Total */}
            <div className="pt-3 border-t">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-900">Total</span>
                <span className="text-xl font-bold text-gray-900">{currencyFormatter(totalPrice)}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Including tax and shipping</p>
            </div>
            
            {/* CTA Buttons */}
            <div className="pt-3 space-y-2">
              <Link
                to="/checkout"
                className="block w-full border border-blue-600 text-blue-600 text-center py-2.5 rounded-lg hover:bg-blue-50 transition-colors font-medium text-sm"
              >
                Quick Checkout
              </Link>
            </div>
          </>
        ) : (
          <div className="py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-gray-600 mb-4">Your cart is empty</p>
            <Link
              to="/"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
            >
              Start Shopping
            </Link>
          </div>
        )}
        
        {/* Additional Info */}
        {totalItems > 0 && (
          <div className="pt-3 border-t">
            <div className="flex items-center text-xs text-gray-500">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              Free shipping on orders over {currencyFormatter(100)}
            </div>
            <div className="flex items-center text-xs text-gray-500 mt-1">
              <svg className="w-3 h-3 mr-1 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              30-day return policy
            </div>
          </div>
        )}
      </div>
    </div>
  );
}