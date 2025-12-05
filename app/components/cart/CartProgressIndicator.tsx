import React from 'react';
import { useCart } from '~/context/cart';
import { currencyFormatter } from '~/utils';


export function CartProgressIndicator() {
  const { totalPrice } = useCart();
  
  const freeShippingThreshold = 100;
  const progress = Math.min((totalPrice / freeShippingThreshold) * 100, 100);
  const remaining = Math.max(freeShippingThreshold - totalPrice, 0);
  
  if (totalPrice >= freeShippingThreshold) {
    return (
      <div className=" bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center">
          <svg className="w-5 h-5 text-green-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="font-medium text-green-800">🎉 Free Shipping Unlocked!</p>
            <p className="text-sm text-green-700">Your order qualifies for free shipping</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="mb-3">
        <div className="flex justify-between text-sm text-blue-800 mb-1">
          <span>Free shipping at {currencyFormatter(freeShippingThreshold)}</span>
          <span>${remaining.toFixed(2)} to go</span>
        </div>
        <div className="w-full bg-blue-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>
      <p className="text-sm text-blue-700">
        Add {currencyFormatter(remaining)} more to get <span className="font-semibold">FREE shipping!</span>
      </p>
    </div>
  );
}