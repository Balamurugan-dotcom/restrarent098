import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem('spicegarden_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('spicegarden_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Add item to cart
  const addToCart = (food, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex((item) => item.food === food._id);
      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            food: food._id,
            name: food.name,
            price: food.price,
            image: food.image,
            category: food.category,
            isVeg: food.isVeg,
            quantity,
          },
        ];
      }
    });
  };

  // Remove single item completely
  const removeFromCart = (foodId) => {
    setCartItems((prev) => prev.filter((item) => item.food !== foodId));
  };

  // Increase or decrease quantity
  const updateQuantity = (foodId, delta) => {
    setCartItems((prev) =>
      prev
        .map((item) => {
          if (item.food === foodId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Clear all items
  const clearCart = () => {
    setCartItems([]);
  };

  // Helper to check current quantity of a food item
  const getItemQuantity = (foodId) => {
    const item = cartItems.find((i) => i.food === foodId);
    return item ? item.quantity : 0;
  };

  // Subtotal calculation
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Business Delivery Rules:
  // - ₹40 for orders below ₹500
  // - Free for ₹500 and above
  const deliveryCharge = subtotal > 0 ? (subtotal >= 500 ? 0 : 40) : 0;

  // Final Total
  const totalAmount = subtotal + deliveryCharge;

  // Total item count (units)
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

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
