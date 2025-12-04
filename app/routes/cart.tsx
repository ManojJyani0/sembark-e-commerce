import React from 'react';
import { Link } from 'react-router';
import type { Route } from './+types/cart';
import { useCart } from '~/context/cart';
import { EmptyCart } from '~/components/cart/EmptyCart';
import { CartItemCard } from '~/components/cart/CartItem';
import { CartProgressIndicator } from '~/components/cart/CartProgressIndicator';
import { CartMiniSummary } from '~/components/cart/CartSummary';

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Shopping Cart - ShopNow' },
    { name: 'description', content: 'Review your shopping cart items, update quantities, and proceed to checkout.' },
  ];
}

export default function CartPage() {
  const { items, totalItems, clearCart } = useCart();

  if (totalItems === 0) {
    return <EmptyCart />;
  }

  return (
    <div className="min-h-screen mx-auto bg-gray-50">
      <CartProgressIndicator />
      {/* Breadcrumb */}
      <nav className="bg-white ">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center text-sm text-gray-600">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <span className="mx-2">/</span>
            <Link to="/cart" className="font-medium text-gray-900">Shopping Cart ({totalItems})</Link>
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-800 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm  overflow-hidden">
              <div className="px-6 py-4  bg-gray-50">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Items in Cart</h2>
                  <span className="text-sm text-gray-600">{totalItems} items</span>
                </div>
              </div>
              
              <div>
                {items.map((item) => (
                  <CartItemCard key={item.id} item={item}  />
                ))}
              </div>
              
              <div className="px-6 py-4  bg-gray-50">
                <Link
                  to="/"
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                  </svg>
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            {/* <CartSummary /> */}
            <CartMiniSummary />
            
            {/* Payment Icons */}
            <div className="mt-4 bg-white rounded-lg  p-4">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">We Accept</h3>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
                <div className="w-10 h-6 bg-gray-200 rounded"></div>
              </div>
            </div>
            
            {/* Security Badge */}
            <div className="mt-4 bg-white rounded-lg  p-4">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-sm font-medium text-gray-900">Secure Checkout</p>
                  <p className="text-xs text-gray-600">SSL encrypted & 100% secure</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading cart...</p>
      </div>
    </div>
  );
}