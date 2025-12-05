import React, { useState } from "react";
import type { CartItem } from "~/types/cart";
import { Link } from "react-router";
import { useCart } from "~/context/cart";
import { currencyFormatter } from "~/utils";

interface CartItemCardProps {
  item: CartItem;
  compact?: boolean;
  showSelect?: boolean;
  onQuantityChange?: (itemId: string, quantity: number) => void;
  onRemove?: (itemId: string) => void;
}

export function CartItemCard({
  item,
  compact = false,
  showSelect = true,
  onQuantityChange,
  onRemove,
}: CartItemCardProps) {
  const {
    incrementQuantity,
    decrementQuantity,
    updateQuantity,
    removeFromCart,
    toggleSelectItem,
  } = useCart();

  const [isRemoving, setIsRemoving] = useState(false);
  const [quantityInput, setQuantityInput] = useState(item.quantity.toString());

  // Handle quantity input change with debounce
  const handleQuantityInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setQuantityInput(value);

    const newQuantity = parseInt(value, 10);
    if (
      !isNaN(newQuantity) &&
      newQuantity > 0 &&
      newQuantity <= (item.maxQuantity || 99)
    ) {
      const handler = onQuantityChange || updateQuantity;
      handler(item.id, newQuantity);
    }
  };

  // Handle increment
  const handleIncrement = () => {
    if (item.quantity < (item.maxQuantity || 99)) {
      const newQuantity = item.quantity + 1;
      setQuantityInput(newQuantity.toString());
      if (onQuantityChange) {
        // Custom handler
        onQuantityChange(item.id, newQuantity);
      } else {
        // Cart context increment - only needs itemId
        incrementQuantity(item.id);
      }
    }
  };

  // Handle decrement
  const handleDecrement = () => {
    if (item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      setQuantityInput(newQuantity.toString());
      //   const handler = onQuantityChange || decrementQuantity;
      //   handler(item.id);
      // this is creating type issue so handled separately
      if (onQuantityChange) {
        // Custom handler
        onQuantityChange(item.id, newQuantity);
      } else {
        // Cart context decrement - only needs itemId
        decrementQuantity(item.id);
      }
    }
  };

  // Handle remove with confirmation
  const handleRemove = async () => {
    if (isRemoving) return;

    setIsRemoving(true);
    try {
      // Show confirmation for expensive items
      if (item.price > 100) {
        const confirmed = window.confirm(`Remove ${item.title} from cart?`);
        if (!confirmed) {
          setIsRemoving(false);
          return;
        }
      }

      const handler = onRemove || removeFromCart;
      handler(item.id);
    } catch (error) {
      console.error("Failed to remove item:", error);
      setIsRemoving(false);
    }
  };

  // Calculate item total
  const itemTotal = item.price * item.quantity;

  // Compact version for dropdowns/mini carts
  if (compact) {
    return (
      <div className="flex items-center justify-between py-3 last:border-b-0">
        <div className="flex items-center space-x-3">
          {/* Product Image */}
          <Link to={`/product/${item.productId}`} className="shrink-0">
            <img
              src={item.image}
              alt={item.title}
              className="w-12 h-12 object-cover rounded-lg hover:opacity-90 transition-opacity"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).src =
                  "/images/placeholder-product.jpg";
              }}
            />
          </Link>

          {/* Product Info */}
          <div className="flex-1 min-w-0">
            <Link
              to={`/product/${item.productId}`}
              className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
            >
              {item.title}
            </Link>
            <p className="text-xs text-gray-600 capitalize">{item.category}</p>
            <p className="text-sm font-medium text-gray-900 mt-1">
              {currencyFormatter(item.price)} × {item.quantity}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-3">
          <span className="text-sm font-semibold text-gray-900">
            {currencyFormatter(itemTotal)}
          </span>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-500 hover:text-red-700 p-1 disabled:opacity-50"
            aria-label="Remove item"
          >
            {isRemoving ? (
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Full version for cart page
  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:bg-gray-50 transition-colors group">
      {/* Selection Checkbox */}
      {showSelect && (
        <div className="flex items-center">
          <input
            type="checkbox"
            checked={item.selected || false}
            onChange={() => toggleSelectItem(item.id)}
            className="h-4 w-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
            aria-label={`Select ${item.title}`}
          />
        </div>
      )}

      {/* Product Image */}
      <Link
        to={`/product/${item.productId}`}
        className="relative shrink-0 w-full sm:w-24 h-24"
      >
        <img
          src={item.image}
          alt={item.title}
          className="w-full h-full object-cover rounded-lg hover:opacity-90 transition-opacity"
          loading="lazy"
          onError={(e) => {
            (e.target as HTMLImageElement).src =
              "/images/placeholder-product.jpg";
          }}
        />
        {item.quantity > 1 && (
          <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
            {item.quantity}
          </span>
        )}
      </Link>

      {/* Product Details */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
          <div className="flex-1">
            <Link
              to={`/product/${item.productId}`}
              className="text-base font-medium text-gray-900 hover:text-blue-600 line-clamp-2"
            >
              {item.title}
            </Link>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full capitalize">
                {item.category}
              </span>
              {item.maxQuantity && item.quantity >= item.maxQuantity && (
                <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                  Max: {item.maxQuantity}
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Unit Price:{" "}
              <span className="font-medium">${item.price.toFixed(2)}</span>
            </p>
          </div>

          {/* Price and Total */}
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">
             {currencyFormatter(itemTotal)}
            </p>
            <p className="text-sm text-gray-600">
              {currencyFormatter(itemTotal)} each
            </p>
          </div>
        </div>

        {/* Quantity Controls and Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <div className="flex items-center border rounded-lg">
              <button
                onClick={handleDecrement}
                disabled={item.quantity <= 1}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-l-lg"
                aria-label="Decrease quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M20 12H4"
                  />
                </svg>
              </button>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  max={item.maxQuantity || 99}
                  value={quantityInput}
                  onChange={handleQuantityInputChange}
                  onBlur={() => {
                    if (!quantityInput || parseInt(quantityInput) < 1) {
                      setQuantityInput("1");
                      updateQuantity(item.id, 1);
                    }
                  }}
                  className="w-16 text-center border-0 focus:ring-0 bg-transparent py-2"
                  aria-label="Quantity"
                />
                <div className="absolute inset-y-0 right-0 flex items-center pointer-events-none">
                  <span className="text-gray-400 text-sm">Qty</span>
                </div>
              </div>

              <button
                onClick={handleIncrement}
                disabled={
                  item.maxQuantity ? item.quantity >= item.maxQuantity : false
                }
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed rounded-r-lg"
                aria-label="Increase quantity"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
              </button>
            </div>

            {/* Stock indicator */}
            {item.maxQuantity && (
              <div className="ml-4 text-xs text-gray-500">
                <div className="w-32 bg-gray-200 rounded-full h-1.5">
                  <div
                    className="bg-green-500 h-1.5 rounded-full"
                    style={{
                      width: `${(item.quantity / item.maxQuantity) * 100}%`,
                    }}
                  ></div>
                </div>
                <p className="mt-1">
                  {item.quantity} of {item.maxQuantity} in cart
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleRemove}
              disabled={isRemoving}
              className="text-sm text-red-600 hover:text-red-800 flex items-center gap-1 disabled:opacity-50"
              aria-label="Remove item from cart"
            >
              {isRemoving ? (
                <>
                  <svg
                    className="w-4 h-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Removing...
                </>
              ) : (
                <>
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Remove
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
