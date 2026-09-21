import React from 'react';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Flame, Star } from 'lucide-react';

const FoodCard = ({ food, onSelect }) => {
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(food._id);

  const handleCardClick = (e) => {
    // If clicking the add/minus buttons, do not open modal
    if (e.target.closest('button') || e.target.closest('.qty-stepper')) {
      return;
    }
    if (onSelect) {
      onSelect(food);
    }
  };

  return (
    <div className="food-card" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
      <div className="food-card-media">
        <img
          src={food.image}
          alt={food.name}
          loading="lazy"
          onError={(e) => {
            e.target.src =
              'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80';
          }}
        />
        <div className="food-card-badges">
          <span className="food-category-tag">{food.category}</span>
          {food.isPopular && (
            <span
              style={{
                background: 'linear-gradient(135deg, #FFB300, #F59E0B)',
                color: '#78350F',
                fontSize: '0.7rem',
                fontWeight: 700,
                padding: '0.25rem 0.6rem',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '2px',
              }}
            >
              ★ Chef's Special
            </span>
          )}
        </div>

        {!food.isAvailable && (
          <div className="food-out-of-stock-overlay">
            <span>Currently Sold Out</span>
          </div>
        )}
      </div>

      <div className="food-card-body">
        <div className="food-card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className={`food-diet-badge ${food.isVeg ? 'veg' : 'non-veg'}`} title={food.isVeg ? 'Pure Veg' : 'Non-Veg'}>
              <div className="dot" />
            </div>
            <h3 className="food-card-title">{food.name}</h3>
          </div>
        </div>

        <p className="food-card-desc">{food.description}</p>

        {food.spiceLevel && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.75rem',
              color: food.spiceLevel === 'Spicy' ? '#DC2626' : '#D97706',
              fontWeight: 600,
              marginBottom: '0.75rem',
            }}
          >
            <Flame size={13} />
            <span>{food.spiceLevel} Spice</span>
          </div>
        )}

        <div className="food-card-footer">
          <div className="food-price">
            <span className="currency">₹</span>
            {food.price}
          </div>

          <div>
            {!food.isAvailable ? (
              <button type="button" className="btn btn-secondary btn-sm" disabled>
                Unavailable
              </button>
            ) : quantityInCart > 0 ? (
              <div className="qty-stepper">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(food._id, -1);
                  }}
                  aria-label="Decrease quantity"
                >
                  <Minus size={14} />
                </button>
                <span className="qty-val">{quantityInCart}</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    updateQuantity(food._id, 1);
                  }}
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                className="btn btn-outline-primary btn-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(food, 1);
                }}
              >
                <Plus size={14} /> Add
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
