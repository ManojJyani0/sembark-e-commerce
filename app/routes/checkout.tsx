import React from "react";
import { Link } from "react-router";
import { useCart } from "~/context/cart";
import type { Route } from "./+types/checkout";
import { currencyFormatter } from "~/utils";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Checkout - ShopNow" },
    { name: "description", content: "Complete your purchase" },
    { robots: "noindex, nofollow" }, // Don't index checkout pages
  ];
}

export function HydrateFallback() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading checkout...</p>
      </div>
    </div>
  );
}

// Empty loader since we don't need data
export async function loader() {
  return { timestamp: Date.now() };
}

export default function CheckoutPage() {
  const { totalItems, totalPrice, items } = useCart();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <Link to="/" className="text-lg font-bold text-blue-600">
              ShopNow
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/cart" className="text-gray-600 hover:text-gray-900">
                ← Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-600">
            This page is a placeholder. Checkout functionality was not requested
            in the project scope.
          </p>
        </div>

        {/* Information Card */}
        <div className="bg-white rounded-xl shadow-sm border p-6 md:p-8 mb-8">
          <div className="flex items-start mb-6">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
            <div className="ml-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Feature Not Implemented
              </h2>
              <p className="text-gray-600 mt-1">
                The checkout process, payment gateway integration, and order
                management system were not included in the project requirements.
                This is a demonstration placeholder.
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Your Order Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Items ({totalItems})</span>
                <span>
                 
                  {currencyFormatter(items
                    .reduce((sum, item) => sum + item.price * item.quantity, 0)
                    )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Estimated Tax</span>
                <span>${(totalPrice * 0.1).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="text-green-600">FREE</span>
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Estimated Total</span>
                  <span>${totalPrice.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Placeholder Checkout Steps */}
          <div className="mt-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Checkout Process (Placeholder)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="border rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-600 font-semibold">1</span>
                </div>
                <h4 className="font-medium text-gray-900">Shipping</h4>
                <p className="text-sm text-gray-600 mt-1">Address details</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-600 font-semibold">2</span>
                </div>
                <h4 className="font-medium text-gray-900">Payment</h4>
                <p className="text-sm text-gray-600 mt-1">Payment method</p>
              </div>
              <div className="border rounded-lg p-4 text-center">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-gray-600 font-semibold">3</span>
                </div>
                <h4 className="font-medium text-gray-900">Confirmation</h4>
                <p className="text-sm text-gray-600 mt-1">Order review</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/cart"
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-center font-medium transition-colors"
          >
            ← Back to Cart
          </Link>
          <Link
            to="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-center font-medium transition-colors"
          >
            Continue Shopping
          </Link>
          {/* Demo Placeholder Button */}
          <button
            onClick={() =>
              alert(
                "Checkout functionality is not implemented. This is a demo placeholder."
              )
            }
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 text-center font-medium transition-colors opacity-50 cursor-not-allowed"
            title="Checkout not implemented - demo only"
          >
            Complete Purchase (Demo)
          </button>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center text-sm text-gray-500">
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            This is a demonstration page. Actual checkout functionality
            requires:
          </div>
          <ul className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
            <li className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Payment gateway integration (Stripe, PayPal, etc.)
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Address validation and management
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Order processing and confirmation
            </li>
            <li className="flex items-center text-sm text-gray-600">
              <svg
                className="w-4 h-4 text-green-500 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Email notifications and receipts
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
}
