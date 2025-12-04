import React, { createContext, useContext, useReducer, useEffect, useCallback, useMemo } from 'react';
import type { CartItem, CartState, CartContextType, DiscountRule } from '../types';


// Initial state
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalPrice: 0,
  shipping: 0,
  discount: 0,
  tax: 0,
  currency: 'USD'
};

// Discount codes (can be moved to API/database)
const DISCOUNT_RULES: DiscountRule[] = [
  { code: 'WELCOME10', type: 'percentage', value: 10, minPurchase: 0 },
  { code: 'FREESHIP', type: 'free_shipping', value: 0, minPurchase: 50 },
  { code: 'SAVE20', type: 'percentage', value: 20, minPurchase: 100, maxDiscount: 50 },
  { code: 'FLAT10', type: 'fixed', value: 10, minPurchase: 30 },
];

// Action types
type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { itemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'TOGGLE_SELECT_ITEM'; payload: string }
  | { type: 'REMOVE_SELECTED_ITEMS' }
  | { type: 'SELECT_ALL_ITEMS' }
  | { type: 'UNSELECT_ALL_ITEMS' }
  | { type: 'APPLY_DISCOUNT'; payload: { discount: number; shipping: number } }
  | { type: 'RECALCULATE_TOTALS' };

// Cart reducer
function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItemIndex = state.items.findIndex(item => item.productId === action.payload.productId);
      
      let updatedItems: CartItem[];
      if (existingItemIndex !== -1) {
        // Update existing item quantity
        updatedItems = state.items.map((item, index) => 
          index === existingItemIndex 
            ? { ...item, quantity: item.quantity + action.payload.quantity }
            : item
        );
      } else {
        // Add new item
        updatedItems = [...state.items, action.payload];
      }

      return { ...state, items: updatedItems };
    }

    case 'REMOVE_ITEM': {
      const updatedItems = state.items.filter(item => item.id !== action.payload);
      return { ...state, items: updatedItems };
    }

    case 'UPDATE_QUANTITY': {
      const { itemId, quantity } = action.payload;
      const updatedItems = state.items.map(item =>
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, Math.min(quantity, item.maxQuantity || 99)) }
          : item
      );
      return { ...state, items: updatedItems };
    }

    case 'CLEAR_CART': {
      return initialState;
    }

    case 'TOGGLE_SELECT_ITEM': {
      const updatedItems = state.items.map(item =>
        item.id === action.payload ? { ...item, selected: !item.selected } : item
      );
      return { ...state, items: updatedItems };
    }

    case 'REMOVE_SELECTED_ITEMS': {
      const updatedItems = state.items.filter(item => !item.selected);
      return { ...state, items: updatedItems };
    }

    case 'SELECT_ALL_ITEMS': {
      const updatedItems = state.items.map(item => ({ ...item, selected: true }));
      return { ...state, items: updatedItems };
    }

    case 'UNSELECT_ALL_ITEMS': {
      const updatedItems = state.items.map(item => ({ ...item, selected: false }));
      return { ...state, items: updatedItems };
    }

    case 'APPLY_DISCOUNT': {
      return {
        ...state,
        discount: action.payload.discount,
        shipping: action.payload.shipping
      };
    }

    case 'RECALCULATE_TOTALS': {
      const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);
      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Calculate shipping (free if discount includes free shipping)
      const shipping = state.shipping === 0 ? (subtotal >= 50 ? 0 : 5.99) : state.shipping;
      
      // Calculate tax (simplified - 10% of subtotal)
      const tax = subtotal * 0.1;
      
      // Ensure discount doesn't exceed subtotal
      const maxDiscount = Math.min(state.discount, subtotal);
      
      const totalPrice = subtotal + shipping + tax - maxDiscount;
      
      return {
        ...state,
        totalItems,
        totalPrice: Math.max(0, totalPrice),
        shipping,
        tax
      };
    }

    default:
      return state;
  }
}

// Create context
const CartContext = createContext<CartContextType | undefined>(undefined);

// Storage key
const CART_STORAGE_KEY = 'shopnow_cart_v2';

// Cart provider component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [isInitialized, setIsInitialized] = React.useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        // Validate and set loaded cart items
        if (parsedCart && Array.isArray(parsedCart.items)) {
          parsedCart.items.forEach((item: CartItem) => {
            dispatch({ type: 'ADD_ITEM', payload: item });
          });
        }
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
      // Clear corrupted data
      localStorage.removeItem(CART_STORAGE_KEY);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save cart to localStorage on change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state));
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [state, isInitialized]);

  // Recalculate totals when items change
  useEffect(() => {
    if (isInitialized) {
      dispatch({ type: 'RECALCULATE_TOTALS' });
    }
  }, [state.items, state.discount, state.shipping, isInitialized]);

  // Add to cart
  const addToCart = useCallback((product: Omit<CartItem, 'id' | 'quantity'>) => {
    const cartItem: CartItem = {
      ...product,
      id: `${product.productId}-${Date.now()}`,
      quantity: 1,
      selected: false
    };
    
    dispatch({ type: 'ADD_ITEM', payload: cartItem });
    
    // Success notification (can be integrated with toast library)
    console.log('Added to cart:', product.title);
  }, []);

  // Remove from cart
  const removeFromCart = useCallback((itemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: itemId });
  }, []);

  // Update quantity
  const updateQuantity = useCallback((itemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity } });
  }, []);

  // Increment quantity
  const incrementQuantity = useCallback((itemId: string) => {
    const item = state.items.find(item => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + 1;
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity: newQuantity } });
    }
  }, [state.items]);

  // Decrement quantity
  const decrementQuantity = useCallback((itemId: string) => {
    const item = state.items.find(item => item.id === itemId);
    if (item && item.quantity > 1) {
      const newQuantity = item.quantity - 1;
      dispatch({ type: 'UPDATE_QUANTITY', payload: { itemId, quantity: newQuantity } });
    }
  }, [state.items]);

  // Clear cart
  const clearCart = useCallback(() => {
    dispatch({ type: 'CLEAR_CART' });
  }, []);

  // Toggle item selection
  const toggleSelectItem = useCallback((itemId: string) => {
    dispatch({ type: 'TOGGLE_SELECT_ITEM', payload: itemId });
  }, []);

  // Remove selected items
  const removeSelectedItems = useCallback(() => {
    dispatch({ type: 'REMOVE_SELECTED_ITEMS' });
  }, []);

  // Select all items
  const selectAllItems = useCallback(() => {
    dispatch({ type: 'SELECT_ALL_ITEMS' });
  }, []);

  // Unselect all items
  const unselectAllItems = useCallback(() => {
    dispatch({ type: 'UNSELECT_ALL_ITEMS' });
  }, []);

  // Apply discount code
  const applyDiscount = useCallback(async (code: string) => {
    try {
      const discountRule = DISCOUNT_RULES.find(
        rule => rule.code === code.toUpperCase() && 
        (!rule.validUntil || new Date(rule.validUntil) > new Date())
      );

      if (!discountRule) {
        return { success: false, message: 'Invalid or expired discount code' };
      }

      const subtotal = state.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Check minimum purchase
      if (discountRule.minPurchase && subtotal < discountRule.minPurchase) {
        return { 
          success: false, 
          message: `Minimum purchase of $${discountRule.minPurchase} required` 
        };
      }

      let discount = 0;
      let shipping = state.shipping;

      if (discountRule.type === 'percentage') {
        discount = subtotal * (discountRule.value / 100);
        if (discountRule.maxDiscount) {
          discount = Math.min(discount, discountRule.maxDiscount);
        }
      } else if (discountRule.type === 'fixed') {
        discount = discountRule.value;
      } else if (discountRule.type === 'free_shipping') {
        shipping = 0;
      }

      dispatch({ 
        type: 'APPLY_DISCOUNT', 
        payload: { discount, shipping } 
      });

      return { 
        success: true, 
        message: `Discount applied successfully! ${discountRule.type === 'free_shipping' ? 'Free shipping activated!' : `$${discount.toFixed(2)} off`}` 
      };
    } catch (error) {
      console.error('Discount application error:', error);
      return { success: false, message: 'Failed to apply discount code' };
    }
  }, [state.items, state.shipping]);

  // Get item quantity by productId
  const getItemQuantity = useCallback((productId: string) => {
    const item = state.items.find(item => item.productId === productId);
    return item ? item.quantity : 0;
  }, [state.items]);

  // Check if product is in cart
  const isInCart = useCallback((productId: string) => {
    return state.items.some(item => item.productId === productId);
  }, [state.items]);

  // Memoize context value
  const contextValue = useMemo(() => ({
    ...state,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    incrementQuantity,
    decrementQuantity,
    toggleSelectItem,
    removeSelectedItems,
    selectAllItems,
    unselectAllItems,
    applyDiscount,
    getItemQuantity,
    isInCart
  }), [state, addToCart, removeFromCart, updateQuantity, clearCart, 
       incrementQuantity, decrementQuantity, toggleSelectItem, 
       removeSelectedItems, selectAllItems, unselectAllItems, 
       applyDiscount, getItemQuantity, isInCart]);

  // Show loading while initializing
  if (!isInitialized) {
    return <div className="p-4">Loading cart...</div>;
  }

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
}

// Custom hook to use cart
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}