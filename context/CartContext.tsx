import React, { createContext, useState, useEffect, useRef } from 'react';
import { Product, CartItem } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

// Custom hook to get the previous value of a prop or state
function usePrevious<T>(value: T) {
  // FIX: Explicitly pass `undefined` to `useRef` to satisfy TypeScript's expectation of one argument.
  const ref = useRef<T | undefined>(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (product: Product, quantity: number) => void;
  updateQuantity: (productId: number, newQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  loading: boolean;
}

export const CartContext = createContext<CartContextType>({
  cartItems: [],
  addToCart: () => {},
  updateQuantity: () => {},
  removeFromCart: () => {},
  clearCart: () => {},
  loading: true,
});

/**
 * Fetches all cart items for a given user by performing two separate queries:
 * one to get cart item relations (product_id, quantity) and another to get
 * the full product details. This is more robust than a single join query.
 */
const fetchUserCart = async (userId: string): Promise<CartItem[]> => {
    const { data: cartData, error: cartError } = await supabase
        .from('cart_items')
        .select('product_id, quantity')
        .eq('user_id', userId);

    if (cartError) {
        console.error('Error fetching cart items:', cartError.message);
        throw cartError;
    }

    if (!cartData || cartData.length === 0) {
        return [];
    }

    const productIds = cartData.map(item => item.product_id);

    const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

    if (productsError) {
        console.error('Error fetching products for cart:', productsError.message);
        throw productsError;
    }

    if (!productsData) {
        return [];
    }

    const productsById = productsData.reduce((acc, p) => {
        acc[p.id] = p;
        return acc;
    }, {} as Record<number, Product>);

    return cartData
        .map(item => {
            const product = productsById[item.product_id];
            if (!product) return null; // Gracefully handle if a product was deleted
            return { ...product, quantity: item.quantity };
        })
        .filter((item): item is CartItem => item !== null);
};


interface CartProviderProps {
  children: React.ReactNode;
  session: Session | null;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children, session }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [localCart, setLocalCart] = useLocalStorage<CartItem[]>('cart', []);
  const [loading, setLoading] = useState(true);
  const prevSession = usePrevious(session);

  // Sync cart on session change (login/logout)
  useEffect(() => {
    const syncCart = async () => {
      setLoading(true);
      if (!isSupabaseConfigured) {
        setCartItems(localCart);
        setLoading(false);
        return;
      }

      try {
        // User logged in
        if (session && !prevSession) {
          const dbCart = await fetchUserCart(session.user.id);
          
          // Merge local cart into DB cart
          if (localCart.length > 0) {
              const mergedCart = [...dbCart];

              localCart.forEach(localItem => {
                  const existingItem = mergedCart.find(item => item.id === localItem.id);
                  if (existingItem) {
                      existingItem.quantity += localItem.quantity;
                  } else {
                      mergedCart.push(localItem);
                  }
              });
              
              const itemsToUpsert = mergedCart.map(item => ({
                  user_id: session.user.id,
                  product_id: item.id,
                  quantity: item.quantity,
              }));
              
              // Clear old items before upserting the merged list
              await supabase.from('cart_items').delete().eq('user_id', session.user.id);
              const { error: upsertError } = await supabase.from('cart_items').upsert(itemsToUpsert);
              
              if (upsertError) console.error("Error merging cart:", upsertError.message);
              
              setLocalCart([]); // Clear local cart after merge
              setCartItems(mergedCart);
          } else {
              setCartItems(dbCart);
          }

        // User logged out
        } else if (!session && prevSession) {
          setCartItems([]); // Clear cart, guest cart will be empty by default
          setLocalCart([]);
        
        // Session unchanged or initial load
        } else {
           if (session) {
              const userCart = await fetchUserCart(session.user.id);
              setCartItems(userCart);
           } else {
              setCartItems(localCart);
           }
        }
      } catch (error) {
          // The error is already logged in the fetchUserCart function
          console.error("Failed to sync cart.", error);
      } finally {
        setLoading(false);
      }
    };

    syncCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);


  const addToCart = async (product: Product, quantity: number) => {
    const optimisticCart = [...cartItems];
    const existingItemIndex = optimisticCart.findIndex(item => item.id === product.id);
    if (existingItemIndex > -1) {
        optimisticCart[existingItemIndex].quantity += quantity;
    } else {
        optimisticCart.push({ ...product, quantity });
    }
    setCartItems(optimisticCart);

    if (session) {
        const { data } = await supabase
            .from('cart_items')
            .select('quantity')
            .eq('user_id', session.user.id)
            .eq('product_id', product.id)
            .single();

        const newQuantity = (data?.quantity || 0) + quantity;
        
        const { error } = await supabase.from('cart_items').upsert({
            user_id: session.user.id,
            product_id: product.id,
            quantity: newQuantity,
        }, {
            onConflict: 'user_id,product_id'
        });
        if (error) console.error("Error adding to cart:", error.message);
    } else {
        setLocalCart(optimisticCart);
    }
  };

  const updateQuantity = async (productId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const optimisticCart = cartItems.map(item => item.id === productId ? { ...item, quantity: newQuantity } : item);
    setCartItems(optimisticCart);

    if (session) {
        const { error } = await supabase.from('cart_items').update({ quantity: newQuantity }).match({ user_id: session.user.id, product_id: productId });
        if (error) console.error("Error updating quantity:", error.message);
    } else {
        setLocalCart(optimisticCart);
    }
  };

  const removeFromCart = async (productId: number) => {
    const optimisticCart = cartItems.filter(item => item.id !== productId);
    setCartItems(optimisticCart);

    if (session) {
        const { error } = await supabase.from('cart_items').delete().match({ user_id: session.user.id, product_id: productId });
        if (error) console.error("Error removing from cart:", error.message);
    } else {
        setLocalCart(optimisticCart);
    }
  };

  const clearCart = async () => {
    setCartItems([]);
    if (session) {
        const { error } = await supabase.from('cart_items').delete().eq('user_id', session.user.id);
        if (error) console.error("Error clearing cart:", error.message);
    } else {
        setLocalCart([]);
    }
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart, loading }}>
      {children}
    </CartContext.Provider>
  );
};