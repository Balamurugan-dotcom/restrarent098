import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, AlertCircle, Truck } from 'lucide-react';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, subtotal, deliveryCharge, totalAmount,
    totalCount, isMinOrderMet, minOrderDifference, amountNeededForFreeDelivery, freeDeliveryProgress, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
      return;
    }
    navigate('/checkout');
  };

  if (cartItems.length === 0) {
    return (
      <div className="main-content">
        <div className="container" style={{ padding: '5rem 0', textAlign: 'center' }}>
          <ShoppingBag size={72} color="#CBD5E1" style={{ margin: '0 auto 1.5rem auto' }} />
          <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem' }}>Your Cart is Empty</h2>
          <p style={{ color: '#64748B', marginBottom: '2rem', maxWidth: '400px', margin: '0 auto 2rem auto' }}>
            Looks like you haven't added any dishes yet. Explore our full menu of authentic Bangalore specialities!
          </p>
          <Link to="/menu" className="btn btn-primary btn-lg">
            Browse Full Menu <ArrowRight size={20} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="main-content" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>My Cart</h1>
            <p style={{ color: '#64748B' }}>{totalCount} item{totalCount !== 1 ? 's' : ''} selected</p>
          </div>
          <button type="button" onClick={clearCart} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#EF4444', fontSize: '0.88rem', fontWeight: 600 }}>
            <Trash2 size={16} /> Clear All
          </button>
        </div>

        <div className="cart-layout">
          {/* Cart Items */}
          <div className="cart-items-card">
            {/* Free Delivery Progress Bar */}
            <div className="free-delivery-progress">
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 600, color: '#1E293B', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Truck size={15} color="#E65100" />
                  {amountNeededForFreeDelivery > 0
                    ? <>Add <strong style={{ color: '#E65100' }}>₹{amountNeededForFreeDelivery}</strong> more for FREE delivery!</>
                    : <span style={{ color: '#15803D', fontWeight: 700 }}>🎉 You've unlocked FREE delivery!</span>
                  }
                </span>
                <span style={{ color: '#64748B', fontWeight: 600 }}>₹{subtotal} / ₹500</span>
              </div>
              <div className="progress-track">
                <div className="progress-bar" style={{ width: `${freeDeliveryProgress}%` }} />
              </div>
            </div>

            {/* Item Rows */}
            {cartItems.map((item) => (
              <div key={item.food} className="cart-item-row">
                <img
                  src={item.image}
                  alt={item.name}
                  className="cart-item-img"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=200&q=80'; }}
                />
                <div className="cart-item-info">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                    <div className={`food-diet-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                      <div className="dot" />
                    </div>
                    <h4>{item.name}</h4>
                  </div>
                  <div className="item-price">₹{item.price} × {item.quantity} = ₹{item.price * item.quantity}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="qty-stepper">
                    <button type="button" onClick={() => updateQuantity(item.food, -1)} aria-label="Decrease"><Minus size={14} /></button>
                    <span className="qty-val">{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.food, 1)} aria-label="Increase"><Plus size={14} /></button>
                  </div>
                  <button type="button" onClick={() => removeFromCart(item.food)} style={{ color: '#EF4444', padding: '4px' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="order-summary-card" style={{ position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
              Order Summary
            </h3>

            <div className="cart-summary-line">
              <span>Subtotal ({totalCount} items)</span>
              <span style={{ fontWeight: 600, color: '#1E293B' }}>₹{subtotal}</span>
            </div>
            <div className="cart-summary-line">
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Truck size={15} /> Delivery Charge
              </span>
              <span style={{ fontWeight: 600, color: deliveryCharge === 0 ? '#15803D' : '#1E293B' }}>
                {deliveryCharge === 0 ? 'FREE 🎉' : `₹${deliveryCharge}`}
              </span>
            </div>

            {deliveryCharge > 0 && (
              <div style={{ fontSize: '0.78rem', color: '#64748B', margin: '-0.5rem 0 0.5rem 0', background: '#FFF7ED', padding: '0.5rem 0.75rem', borderRadius: '6px' }}>
                Add ₹{amountNeededForFreeDelivery} more to get <strong>FREE delivery</strong>
              </div>
            )}

            <div className="cart-summary-line total">
              <span>Total Amount</span>
              <span style={{ color: '#E65100' }}>₹{totalAmount}</span>
            </div>

            {!isMinOrderMet && (
              <div className="min-order-alert">
                <AlertCircle size={16} />
                <span>Add ₹{minOrderDifference} more to meet the ₹200 minimum order requirement</span>
              </div>
            )}

            <button
              id="proceed-to-checkout-btn"
              type="button"
              className="btn btn-primary"
              style={{ width: '100%', marginTop: '1.5rem', padding: '0.9rem' }}
              disabled={!isMinOrderMet}
              onClick={handleCheckout}
            >
              Proceed to Checkout <ArrowRight size={18} />
            </button>

            <Link to="/menu" style={{ display: 'block', textAlign: 'center', marginTop: '1rem', color: '#64748B', fontSize: '0.88rem' }}>
              ← Continue Browsing Menu
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
