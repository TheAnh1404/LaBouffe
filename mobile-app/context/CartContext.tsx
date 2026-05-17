import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const CART_STORAGE_KEY = '@labouffe_cart';

export type CartItem = {
  id: string; // food id
  name: string;
  desc: string;
  price: number;
  imageUrl: string;
  quantity: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  updateQuantity: (id: string, change: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
  /** Order note for the current checkout */
  orderNote: string;
  setOrderNote: (note: string) => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [orderNote, setOrderNote] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);

  // ─── Load cart from AsyncStorage on mount ──────────────────────
  useEffect(() => {
    const loadCart = async () => {
      try {
        const stored = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCartItems(parsed);
          }
        }
      } catch (error) {
        console.warn('Failed to load cart from storage:', error);
      } finally {
        setIsLoaded(true);
      }
    };
    loadCart();
  }, []);

  // ─── Persist cart to AsyncStorage whenever it changes ──────────
  useEffect(() => {
    if (!isLoaded) return; // Don't save until initial load is complete
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
      } catch (error) {
        console.warn('Failed to save cart to storage:', error);
      }
    };
    saveCart();
  }, [cartItems, isLoaded]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, change: number) => {
    setCartItems(prev => {
      return prev.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + change;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const clearCart = () => {
    setCartItems([]);
    setOrderNote('');
  };

  const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, clearCart, cartTotal, cartCount, orderNote, setOrderNote }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within a CartProvider");
  return context;
};
