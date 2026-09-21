import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import {
  MapPin,
  CreditCard,
  Banknote,
  ShieldCheck,
  Truck,
  AlertCircle,
  CheckCircle,
  Tag,
  Ticket,
  Percent,
  Sparkles,
  X,
  CheckCircle2,
} from 'lucide-react';

const BANGALORE_COUPONS = [
  {
    code: 'BANGALORE50',
    title: 'Bangalore Welcome Special',
    badge: 'FLAT ₹50 OFF',
    desc: 'Flat ₹50 off on orders above ₹200',
    highlight: 'Valid on all authentic dishes',
    icon: '⚡',
    color: '#E65100',
    bg: '#FFF7ED',
    border: '#FED7AA',
  },
  {
    code: 'BIRYANI20',
    title: 'Royal Dum Biryani Feast',
    badge: '20% OFF BIRYANI',
    desc: '20% off on all Dum Biryanis (up to ₹100)',
    highlight: 'Hyderabadi, Mutton & Kolkata Biryanis',
    icon: '👑',
    color: '#B45309',
    bg: '#FEF3C7',
    border: '#FDE68A',
  },
  {
    code: 'FREEDEL',
    title: 'Free Express Bangalore Delivery',
    badge: 'ZERO DELIVERY FEE',
    desc: '100% Free delivery across Bangalore',
    highlight: 'Saves standard ₹40 express fee',
    icon: '🛵',
    color: '#047857',
    bg: '#ECFDF5',
    border: '#A7F3D0',
  },
];

const CheckoutPage = () => {
  const { cartItems, subtotal, deliveryCharge, isMinOrderMet, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    area: user?.address?.area || '',
    landmark: user?.address?.landmark || '',
    city: 'Bangalore',
    pincode: user?.address?.pincode || '',
    instructions: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('Cash on Delivery');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Smart Coupon Engine State
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const [couponFeedback, setCouponFeedback] = useState(null);

  const handleAddressChange = (e) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleApplyCoupon = async (codeOverride) => {
    const targetCode = (codeOverride || couponInput).trim().toUpperCase();
    if (!targetCode) {
      setCouponFeedback({ type: 'error', text: 'Please enter a coupon code.' });
      return;
    }

    try {
      setCouponLoading(true);
      setCouponFeedback(null);
      const res = await api.post('/api/orders/validate-coupon', {
        couponCode: targetCode,
        subtotal,
        items: cartItems.map((item) => ({
          name: item.name,
          category: item.category,
          price: item.price,
          quantity: item.quantity,
        })),
      });

      if (res.data.success) {
        setAppliedCoupon(res.data.data);
        setCouponInput(targetCode);
        setCouponFeedback({
          type: 'success',
          text: `🎉 ${targetCode} applied! You saved ₹${res.data.data.discountAmount}.`,
        });
      }
    } catch (err) {
      setCouponFeedback({
        type: 'error',
        text: err.response?.data?.message || err.message || 'Invalid coupon code.',
      });
    } finally {
      setCouponLoading(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput('');
    setCouponFeedback(null);
  };

  const finalDeliveryCharge =
    appliedCoupon?.finalDeliveryCharge !== undefined
      ? appliedCoupon.finalDeliveryCharge
      : deliveryCharge;

  const discountAmount = appliedCoupon?.discountAmount || 0;
  const finalTotalAmount = Math.max(0, subtotal + finalDeliveryCharge - discountAmount);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isMinOrderMet) return setError('Minimum order value of ₹200 not met.');
    if (!address.street || !address.area || !address.pincode) return setError('Please fill all required address fields.');

    try {
      setLoading(true);
      setError('');
      const orderPayload = {
        items: cartItems.map((item) => ({ food: item.food, quantity: item.quantity, name: item.name })),
        deliveryAddress: address,
        paymentMethod,
        customerPhone: user?.phone || '',
        couponCode: appliedCoupon ? appliedCoupon.couponCode : '',
      };
      const res = await api.post('/api/orders', orderPayload);
      if (res.data.success) {
        clearCart();
        navigate(`/track/${res.data.data._id}`, { state: { newOrder: true } });
      }
    } catch (err) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (cartItems.length === 0) {
    return <Navigate to="/cart" replace />;
  }

  return (
    <div className="main-content" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Checkout</h1>
        <p style={{ color: '#64748B', marginBottom: '2rem' }}>Review your order and complete delivery details</p>

        {/* Delivery Area Notice */}
        <div className="delivery-notice-banner" style={{ marginBottom: '2rem' }}>
          <div className="icon-box"><MapPin size={22} /></div>
          <div>
            <div className="title">10 km Delivery Zone — Bangalore</div>
            <div className="subtitle">We deliver within ~10 km of Indiranagar, Bangalore. Areas: Indiranagar, Koramangala, Domlur, HAL, MG Road, Ulsoor & nearby areas.</div>
          </div>
        </div>

        {error && (
          <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: '10px', padding: '1rem', marginBottom: '1.5rem', color: '#B91C1C', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertCircle size={18} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="checkout-grid">
            {/* Left: Address + Payment */}
            <div>
              {/* Delivery Address */}
              <div className="checkout-card" style={{ marginBottom: '1.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={20} color="#E65100" /> Delivery Address in Bangalore
                </h3>
                <div className="checkout-form-fields-grid">
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label" htmlFor="street">Street Address / Flat / Building *</label>
                    <input id="street" name="street" type="text" className="form-input" placeholder="e.g. #12, 3rd Cross, 5th Main" value={address.street} onChange={handleAddressChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="area">Area / Locality *</label>
                    <input id="area" name="area" type="text" className="form-input" placeholder="e.g. Indiranagar" value={address.area} onChange={handleAddressChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="pincode">PIN Code *</label>
                    <input id="pincode" name="pincode" type="text" className="form-input" placeholder="e.g. 560038" value={address.pincode} onChange={handleAddressChange} maxLength={6} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="landmark">Landmark (Optional)</label>
                    <input id="landmark" name="landmark" type="text" className="form-input" placeholder="e.g. Near Metro Station" value={address.landmark} onChange={handleAddressChange} />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="city">City</label>
                    <input id="city" name="city" type="text" className="form-input" value="Bangalore" readOnly style={{ background: '#F8FAFC', color: '#64748B' }} />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1/-1' }}>
                    <label className="form-label" htmlFor="instructions">Delivery Instructions (Optional)</label>
                    <textarea id="instructions" name="instructions" className="form-textarea" placeholder="Any special instructions for the delivery partner..." rows={2} value={address.instructions} onChange={handleAddressChange} style={{ resize: 'none' }} />
                  </div>
                </div>
              </div>

              {/* Payment Method */}
              <div className="checkout-card">
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CreditCard size={20} color="#E65100" /> Payment Method
                </h3>
                <div className="payment-method-selector">
                  {['Cash on Delivery', 'Online Payment'].map((method) => (
                    <div
                      key={method}
                      id={`payment-${method.replace(/\s/g, '-').toLowerCase()}`}
                      className={`payment-option-card ${paymentMethod === method ? 'selected' : ''}`}
                      onClick={() => setPaymentMethod(method)}
                    >
                      {method === 'Cash on Delivery' ? <Banknote size={22} color={paymentMethod === method ? '#E65100' : '#94A3B8'} /> : <CreditCard size={22} color={paymentMethod === method ? '#E65100' : '#94A3B8'} />}
                      <div>
                        <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{method}</div>
                        <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{method === 'Cash on Delivery' ? 'Pay at your door' : 'UPI / Cards / NetBanking'}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {paymentMethod === 'Online Payment' && (
                  <div className="online-payment-simulator">
                    <p style={{ fontWeight: 700, fontSize: '0.9rem', marginBottom: '1rem', color: '#1E293B' }}>
                      <ShieldCheck size={16} color="#15803D" style={{ display: 'inline', marginRight: '6px' }} />
                      Secure Payment Portal (Demo)
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', marginBottom: '0.75rem' }}>
                      {['📱 UPI / PhonePe', '💳 Debit / Credit Card', '🏦 Net Banking', '💰 Paytm Wallet'].map(m => (
                        <div key={m} style={{ padding: '0.6rem 0.85rem', background: '#fff', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.82rem', fontWeight: 600, color: '#475569', cursor: 'pointer' }}>{m}</div>
                      ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#64748B' }}>* Payment gateway integration coming soon. Order will be confirmed automatically.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Order Summary with Smart Coupon Engine */}
            <div>
              <div className="order-summary-card" style={{ position: 'sticky', top: '100px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1.25rem', paddingBottom: '1rem', borderBottom: '1px solid #F1F5F9' }}>
                  Your Order
                </h3>

                {/* Items List */}
                <div style={{ maxHeight: '220px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '4px' }}>
                  {cartItems.map((item) => (
                    <div
                      key={item.food}
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        padding: '0.6rem 0',
                        borderBottom: '1px solid #F8FAFC',
                        fontSize: '0.88rem',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div className={`food-diet-badge ${item.isVeg ? 'veg' : 'non-veg'}`}>
                          <div className="dot" />
                        </div>
                        <span style={{ fontWeight: 600, color: '#1E293B' }}>{item.name}</span>
                        <span style={{ color: '#94A3B8', fontSize: '0.8rem' }}>×{item.quantity}</span>
                      </div>
                      <span style={{ fontWeight: 700, color: '#0F172A' }}>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                {/* --- SMART COUPON & FESTIVAL DISCOUNT ENGINE --- */}
                <div
                  style={{
                    background: '#F8FAFC',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1.25rem',
                    border: '1px solid #E2E8F0',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', fontWeight: 700, color: '#1E293B' }}>
                      <Ticket size={16} color="#E65100" />
                      <span>Bangalore Special Coupons</span>
                    </div>
                    {appliedCoupon && (
                      <span
                        style={{
                          fontSize: '0.72rem',
                          background: '#DCFCE7',
                          color: '#15803D',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                        }}
                      >
                        ✓ Applied
                      </span>
                    )}
                  </div>

                  {/* Coupon Input Form */}
                  {!appliedCoupon ? (
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                        <div style={{ position: 'relative', flex: 1 }}>
                          <Tag
                            size={14}
                            color="#94A3B8"
                            style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)' }}
                          />
                          <input
                            type="text"
                            placeholder="Enter Promo Code"
                            value={couponInput}
                            onChange={(e) => {
                              setCouponInput(e.target.value.toUpperCase());
                              setCouponFeedback(null);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleApplyCoupon();
                              }
                            }}
                            style={{
                              width: '100%',
                              padding: '0.55rem 0.6rem 0.55rem 2rem',
                              borderRadius: '8px',
                              border: '1px solid #CBD5E1',
                              fontSize: '0.85rem',
                              fontWeight: 700,
                              letterSpacing: '0.04em',
                              textTransform: 'uppercase',
                              background: '#FFFFFF',
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          disabled={couponLoading || !couponInput.trim()}
                          style={{
                            padding: '0.55rem 1rem',
                            background: couponInput.trim() ? '#E65100' : '#E2E8F0',
                            color: couponInput.trim() ? '#FFFFFF' : '#94A3B8',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '0.82rem',
                            fontWeight: 700,
                            cursor: couponInput.trim() ? 'pointer' : 'not-allowed',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          {couponLoading ? 'Checking...' : 'Apply'}
                        </button>
                      </div>

                      {/* Coupon Feedback Error */}
                      {couponFeedback?.type === 'error' && (
                        <div
                          style={{
                            fontSize: '0.78rem',
                            color: '#DC2626',
                            background: '#FEF2F2',
                            padding: '0.4rem 0.6rem',
                            borderRadius: '6px',
                            marginBottom: '0.75rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <AlertCircle size={13} />
                          <span>{couponFeedback.text}</span>
                        </div>
                      )}

                      {/* Available Bangalore Coupons Quick-Picks */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>
                          Tap to apply Bangalore instant savings:
                        </div>
                        {BANGALORE_COUPONS.map((c) => (
                          <div
                            key={c.code}
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              padding: '0.55rem 0.75rem',
                              background: c.bg,
                              border: `1px dashed ${c.border}`,
                              borderRadius: '8px',
                              cursor: 'pointer',
                              transition: 'all 0.15s ease',
                            }}
                            onClick={() => handleApplyCoupon(c.code)}
                          >
                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ fontSize: '0.85rem' }}>{c.icon}</span>
                                <span style={{ fontWeight: 800, fontSize: '0.82rem', color: c.color, letterSpacing: '0.03em' }}>
                                  {c.code}
                                </span>
                                <span
                                  style={{
                                    fontSize: '0.68rem',
                                    fontWeight: 700,
                                    background: '#FFFFFF',
                                    color: c.color,
                                    padding: '1px 5px',
                                    borderRadius: '4px',
                                    border: `1px solid ${c.border}`,
                                  }}
                                >
                                  {c.badge}
                                </span>
                              </div>
                              <div style={{ fontSize: '0.72rem', color: '#475569', marginTop: '2px' }}>
                                {c.desc}
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleApplyCoupon(c.code);
                              }}
                              style={{
                                background: 'transparent',
                                border: `1px solid ${c.color}`,
                                color: c.color,
                                padding: '0.25rem 0.65rem',
                                borderRadius: '6px',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              Apply
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    /* Active Applied Coupon Banner */
                    <div
                      style={{
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        borderRadius: '8px',
                        padding: '0.75rem',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                          <CheckCircle2 size={18} color="#059669" style={{ marginTop: '2px', flexShrink: 0 }} />
                          <div>
                            <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#065F46' }}>
                              {appliedCoupon.couponCode} Applied!
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '1px' }}>
                              {appliedCoupon.title} • You save ₹{appliedCoupon.discountAmount}
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={handleRemoveCoupon}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: '#DC2626',
                            fontSize: '0.75rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: '2px 4px',
                          }}
                        >
                          <X size={13} /> Remove
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Price Breakdown */}
                <div className="cart-summary-line">
                  <span>Subtotal</span>
                  <span style={{ fontWeight: 600 }}>₹{subtotal}</span>
                </div>

                <div className="cart-summary-line">
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Truck size={14} /> Delivery Fee
                  </span>
                  <span style={{ fontWeight: 600, color: finalDeliveryCharge === 0 ? '#15803D' : '#1E293B' }}>
                    {finalDeliveryCharge === 0 ? (
                      appliedCoupon?.couponCode === 'FREEDEL' ? (
                        <>
                          <del style={{ color: '#94A3B8', marginRight: '6px', fontSize: '0.82rem' }}>₹40</del>
                          <span>FREE 🎉</span>
                        </>
                      ) : (
                        'FREE 🎉'
                      )
                    ) : (
                      `₹${finalDeliveryCharge}`
                    )}
                  </span>
                </div>

                {discountAmount > 0 && (
                  <div className="cart-summary-line" style={{ color: '#059669' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 700 }}>
                      <Percent size={14} /> Coupon Discount ({appliedCoupon.couponCode})
                    </span>
                    <span style={{ fontWeight: 800, fontSize: '0.95rem' }}>-₹{discountAmount}</span>
                  </div>
                )}

                <div className="cart-summary-line total" style={{ marginTop: '0.5rem', paddingTop: '0.75rem', borderTop: '2px dashed #E2E8F0' }}>
                  <span>Grand Total</span>
                  <span style={{ color: '#E65100', fontSize: '1.3rem', fontWeight: 800 }}>₹{finalTotalAmount}</span>
                </div>

                {discountAmount > 0 && (
                  <div
                    style={{
                      background: '#ECFDF5',
                      color: '#065F46',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      padding: '0.4rem 0.6rem',
                      borderRadius: '6px',
                      textAlign: 'center',
                      marginTop: '0.6rem',
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    🎉 You saved ₹{discountAmount + (deliveryCharge > 0 && finalDeliveryCharge === 0 ? deliveryCharge : 0)} on this order!
                  </div>
                )}

                <button
                  id="place-order-btn"
                  type="submit"
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    marginTop: '1.25rem',
                    padding: '0.95rem',
                    fontSize: '1.05rem',
                    fontWeight: 800,
                    borderRadius: '12px',
                    boxShadow: '0 6px 20px rgba(230, 81, 0, 0.28)',
                  }}
                  disabled={loading || !isMinOrderMet}
                >
                  {loading ? (
                    'Placing Order...'
                  ) : (
                    <>
                      <CheckCircle size={20} /> Place Order — ₹{finalTotalAmount}
                    </>
                  )}
                </button>

                <p style={{ fontSize: '0.75rem', color: '#94A3B8', textAlign: 'center', marginTop: '0.75rem' }}>
                  By placing the order you agree to our delivery policy within Bangalore's 10 km zone.
                </p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
