import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

// Helper to determine user-scoped storage key
const getCartStorageKey = (currentUser) => {
  if (currentUser && (currentUser._id || currentUser.id || currentUser.email)) {
    const identifier = currentUser._id || currentUser.id || currentUser.email;
    return `spicegarden_cart_${identifier}`;
  }
  return 'spicegarden_cart_guest';
};

// Safe helper to read from localStorage
const loadCartFromStorage = (key) => {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : [];
  } catch (err) {
    console.warn('Error reading cart from localStorage:', err);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const { user, token, isAuthenticated, loading: authLoading } = useAuth();
  const currentUserId = user?._id || user?.id || user?.email || null;
  const prevUserIdRef = useRef(undefined);

  // Initialize cart state for current user
  const [cartItems, setCartItems] = useState(() => {
    // Clean up legacy un-scoped cart so it never leaks between users
    try {
      localStorage.removeItem('spicegarden_cart');
    } catch {
      // ignore
    }
    const initialKey = getCartStorageKey(user);
    return loadCartFromStorage(initialKey);
  });

  // Track active user and switch/sync cart when candidate account changes
  useEffect(() => {
    // Clean up legacy un-scoped cart key if still present
    try {
      localStorage.removeItem('spicegarden_cart');
    } catch {
      // ignore
    }

    // Skip if user hasn't changed
    if (prevUserIdRef.current === currentUserId) {
      return;
    }
    prevUserIdRef.current = currentUserId;

    const storageKey = getCartStorageKey(user);
    const localItems = loadCartFromStorage(storageKey);

    // Immediately update local state with this user's cached cart
    setCartItems(localItems);

    // If authenticated, fetch candidate's backend cart from database to synchronize
    if (isAuthenticated && token) {
      let isMounted = true;
      api
        .get('/api/cart')
        .then((res) => {
          if (!isMounted) return;
          if (res.data?.success && Array.isArray(res.data.data)) {
            const serverItems = res.data.data;
            if (serverItems.length > 0) {
              // Server has items, prioritize server cart
              setCartItems(serverItems);
              localStorage.setItem(storageKey, JSON.stringify(serverItems));
            } else if (localItems.length > 0) {
              // Server cart empty but local has items, sync local to server
              api.put('/api/cart', { items: localItems }).catch(() => {});
            }
          }
        })
        .catch((err) => {
          console.warn('Could not sync cart with server, using local account cart:', err.message);
        });

      return () => {
        isMounted = false;
      };
    }
  }, [currentUserId, isAuthenticated, token]);

  // Save changes to current user's isolated localStorage and backend
  const persistCart = (updatedItems) => {
    const storageKey = getCartStorageKey(user);
    try {
      localStorage.setItem(storageKey, JSON.stringify(updatedItems));
    } catch (err) {
      console.warn('Error saving cart to localStorage:', err);
    }

    // Also persist to backend if candidate is logged in
    if (isAuthenticated && token) {
      api.put('/api/cart', { items: updatedItems }).catch((err) => {
        console.warn('Background cart sync failed:', err.message);
      });
    }
  };

  // Add item to candidate's cart
  const addToCart = (food, quantity = 1) => {
    const foodId = String(food._id || food.food || food.id);
    const qtyToAdd = Math.max(1, Number(quantity) || 1);

    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => String(item.food || item._id) === foodId
      );
      let updated;
      if (existingIndex > -1) {
        updated = [...prevItems];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + qtyToAdd,
        };
      } else {
        updated = [
          ...prevItems,
          {
            food: foodId,
            name: food.name || '',
            price: Number(food.price) || 0,
            image: food.image || '',
            category: food.category || '',
            isVeg: food.isVeg !== undefined ? food.isVeg : true,
            quantity: qtyToAdd,
          },
        ];
      }
      persistCart(updated);
      return updated;
    });
  };

  // Remove single item completely from candidate's cart
  const removeFromCart = (foodId) => {
    const targetId = String(foodId);
    setCartItems((prev) => {
      const updated = prev.filter(
        (item) => String(item.food || item._id) !== targetId
      );
      persistCart(updated);
      return updated;
    });
  };

  // Increase or decrease quantity in candidate's cart
  const updateQuantity = (foodId, delta) => {
    const targetId = String(foodId);
    setCartItems((prev) => {
      const updated = prev
        .map((item) => {
          if (String(item.food || item._id) === targetId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
      persistCart(updated);
      return updated;
    });
  };

  // Set explicit quantity for an item
  const setCartQuantity = (food, newQuantity) => {
    const foodId = String(food._id || food.food || food.id);
    const targetQty = Number(newQuantity);

    setCartItems((prevItems) => {
      let updated;
      if (targetQty <= 0) {
        updated = prevItems.filter(
          (item) => String(item.food || item._id) !== foodId
        );
      } else {
        const existingIndex = prevItems.findIndex(
          (item) => String(item.food || item._id) === foodId
        );
        if (existingIndex > -1) {
          updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: targetQty,
          };
        } else {
          updated = [
            ...prevItems,
            {
              food: foodId,
              name: food.name || '',
              price: Number(food.price) || 0,
              image: food.image || '',
              category: food.category || '',
              isVeg: food.isVeg !== undefined ? food.isVeg : true,
              quantity: targetQty,
            },
          ];
        }
      }
      persistCart(updated);
      return updated;
    });
  };

  // Clear all items in candidate's cart
  const clearCart = () => {
    setCartItems([]);
    persistCart([]);
  };

  // Helper to check current quantity of a food item in candidate's cart
  const getItemQuantity = (foodId) => {
    if (!foodId) return 0;
    const targetId = String(foodId);
    const item = cartItems.find(
      (i) => String(i.food || i._id) === targetId
    );
    return item ? item.quantity : 0;
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  // Business Delivery Rules:
  // - ₹40 for orders below ₹500
  // - Free for ₹500 and above
  const deliveryCharge = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;

  // Final Total
  const totalAmount = subtotal + deliveryCharge;

  // Total item count (units)
  const totalCount = cartItems.reduce(
    (acc, item) => acc + (Number(item.quantity) || 0),
    0
  );

  // Minimum order rule: ₹200
  const isMinOrderMet = subtotal >= 200;
  const minOrderDifference = Math.max(0, 200 - subtotal);

  // Free delivery gap calculation
  const amountNeededForFreeDelivery = Math.max(0, 500 - subtotal);
  const freeDeliveryProgress = Math.min(100, (subtotal / 500) * 100);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    setCartQuantity,
    clearCart,
    getItemQuantity,
    subtotal,
    deliveryCharge,
    totalAmount,
    totalCount,
    isMinOrderMet,
    minOrderDifference,
    amountNeededForFreeDelivery,
    freeDeliveryProgress,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
