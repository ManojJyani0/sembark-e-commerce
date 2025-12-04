export interface CartItem {
  id: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string;
  category: string;
  maxQuantity?: number; // Stock limit
  selected?: boolean; // For bulk operations
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  shipping: number;
  discount: number;
  tax: number;
  currency: string;
}

export interface CartContextType extends CartState {
  addToCart: (product: Omit<CartItem, 'id' | 'quantity'>) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  incrementQuantity: (itemId: string) => void;
  decrementQuantity: (itemId: string) => void;
  toggleSelectItem: (itemId: string) => void;
  removeSelectedItems: () => void;
  selectAllItems: () => void;
  unselectAllItems: () => void;
  applyDiscount: (code: string) => Promise<{ success: boolean; message: string }>;
  getItemQuantity: (productId: string) => number;
  isInCart: (productId: string) => boolean;
}

export interface DiscountRule {
  code: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minPurchase?: number;
  maxDiscount?: number;
  validUntil?: Date;
  oneTimeUse?: boolean;
}