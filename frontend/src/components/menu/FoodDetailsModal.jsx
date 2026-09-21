import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { X, Plus, Minus, Flame, Clock, Check, ShoppingBag } from 'lucide-react';

const FoodDetailsModal = ({ food, onClose }) => {
  const { addToCart, getItemQuantity } = useCart();
  const existingQty = getItemQuantity(food?._id);
  const [quantity, setQuantity] = useState(existingQty > 0 ? existingQty : 1);
  const [addedNotice, setAddedNotice] = useState(false);

  if (!food) return null;

  const handleAdd = () => {
    // If not in cart, add the selected quantity
    // If already in cart, calculate diff or re-add
    const diff = quantity - existingQty;
    if (diff !== 0) {
      addToCart(food, diff > 0 ? diff : 0);
    } else if (existingQty === 0) {
      addToCart(food, quantity);
    }
    setAddedNotice(true);
    setTimeout(() => {
      setAddedNotice(false);
      onClose();
    }, 800);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content food-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="food-modal-img-wrap">
          {/* Floating Top-Right Circular 'X' Close Button */}
          <button
            type="button"
            className="food-modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            <X size={20} strokeWidth={2.5} color="#0F172A" />
          </button>
          <img
            src={food.image}
            alt={food.name}
            className="food-modal-img"
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="food-modal-category-badge">
            <span>{food.category}</span>
          </div>
        </div>

        <div className="food-modal-body">
          <div className="food-modal-title-row">
            <div className={`food-diet-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
              <div className="dot" />
            </div>
            <h2>{food.name}</h2>
          </div>

          <p className="food-modal-desc">
            {food.description}
          </p>

          <div className="food-modal-specs">
            <div className="spec-item">
              <Flame size={15} color="#DC2626" />
              <span>Spice: <strong>{food.spiceLevel || 'Medium'}</strong></span>
            </div>
            <div className="spec-item">
              <Clock size={15} color="#E65100" />
              <span>Prep Time: <strong>20-25 mins</strong></span>
            </div>
            <div className="spec-item">
              <span>Diet: <strong>{food.isVeg ? 'Pure Veg' : 'Non-Veg'}</strong></span>
            </div>
          </div>

          <div className="food-modal-footer">
            <div className="food-modal-price-box">
              <div className="price-label">Price per portion</div>
              <div className="price-amount">
                <span className="rupee">₹</span>
                {food.price}
              </div>
            </div>

            {food.isAvailable ? (
              <div className="food-modal-actions-box">
                <div className="qty-stepper">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease"
                  >
                    <Minus size={15} />
                  </button>
                  <span className="qty-val">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    aria-label="Increase"
                  >
                    <Plus size={15} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary food-modal-add-btn"
                  onClick={handleAdd}
                >
                  {addedNotice ? (
                    <>
                      <Check size={18} /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} />
                      <span>Add (₹{food.price * quantity})</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div style={{ color: '#EF4444', fontWeight: 700 }}>Currently Unavailable</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsModal;
