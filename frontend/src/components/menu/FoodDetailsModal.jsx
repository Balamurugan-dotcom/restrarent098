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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px', padding: '0' }}>
        <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close modal">
          <X size={18} />
        </button>

        <div style={{ height: '260px', overflow: 'hidden', position: 'relative' }}>
          <img
            src={food.image}
            alt={food.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.src =
                'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div
            style={{
              position: 'absolute',
              bottom: '14px',
              left: '16px',
              display: 'flex',
              gap: '6px',
            }}
          >
            <span
              style={{
                background: 'rgba(0,0,0,0.7)',
                color: '#ffffff',
                padding: '4px 10px',
                borderRadius: '9999px',
                fontSize: '0.75rem',
                fontWeight: 600,
              }}
            >
              {food.category}
            </span>
          </div>
        </div>

        <div style={{ padding: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <div className={`food-diet-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
              <div className="dot" />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{food.name}</h2>
          </div>

          <p style={{ color: '#64748B', lineHeight: '1.6', fontSize: '0.95rem', marginBottom: '1.25rem' }}>
            {food.description}
          </p>

          <div
            style={{
              display: 'flex',
              gap: '1.5rem',
              padding: '0.85rem 1rem',
              background: '#F8FAFC',
              borderRadius: '10px',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <Flame size={16} color="#DC2626" />
              <span>Spice: <strong>{food.spiceLevel || 'Medium'}</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <Clock size={16} color="#E65100" />
              <span>Prep Time: <strong>20-25 mins</strong></span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#475569' }}>
              <span>Diet: <strong>{food.isVeg ? 'Pure Veg' : 'Non-Veg'}</strong></span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: '#64748B' }}>Price per portion</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1E293B', fontFamily: 'var(--font-heading)' }}>
                <span style={{ color: '#E65100', marginRight: '3px' }}>₹</span>
                {food.price}
              </div>
            </div>

            {food.isAvailable ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div className="qty-stepper" style={{ padding: '0.35rem 0.5rem' }}>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '32px', height: '32px' }}
                    aria-label="Decrease"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="qty-val" style={{ minWidth: '36px', fontSize: '1.1rem' }}>
                    {quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ width: '32px', height: '32px' }}
                    aria-label="Increase"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleAdd}
                  style={{ minWidth: '150px' }}
                >
                  {addedNotice ? (
                    <>
                      <Check size={18} /> Added!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={18} /> Add (₹{food.price * quantity})
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
