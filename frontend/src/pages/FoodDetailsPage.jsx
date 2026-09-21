import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import Loader from '../components/common/Loader';
import { ArrowLeft, Plus, Minus, ShoppingBag, Check, Flame, Clock, ShieldCheck, Heart } from 'lucide-react';

const FoodDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, getItemQuantity } = useCart();

  const [food, setFood] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [addedNotice, setAddedNotice] = useState(false);

  useEffect(() => {
    const fetchFood = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/foods/${id}`);
        setFood(res.data.food);
        const existing = getItemQuantity(res.data.food?._id);
        if (existing > 0) setQuantity(existing);
      } catch (err) {
        console.error(err);
        setError('Dish not found or failed to load.');
      } finally {
        setLoading(false);
      }
    };
    fetchFood();
  }, [id, getItemQuantity]);

  const handleAddToCart = () => {
    if (!food) return;
    addToCart(food, quantity);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 1500);
  };

  if (loading) {
    return (
      <div className="section">
        <Loader message="Preparing dish details..." />
      </div>
    );
  }

  if (error || !food) {
    return (
      <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
        <h2>Dish Not Found</h2>
        <p style={{ color: '#64748B', margin: '1rem 0 2rem' }}>
          {error || "The dish you're looking for might have been moved or removed."}
        </p>
        <Link to="/menu" className="btn btn-primary">
          <ArrowLeft size={18} /> Back to Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="section" style={{ background: '#FFFDF9' }}>
      <div className="container">
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="btn btn-outline"
            style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
          >
            <ArrowLeft size={16} /> Back
          </button>
          <span style={{ color: '#94A3B8' }}>/</span>
          <Link to="/menu" style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>
            Menu
          </Link>
          <span style={{ color: '#94A3B8' }}>/</span>
          <span style={{ color: '#E65100', fontSize: '0.9rem', fontWeight: 700 }}>
            {food.name}
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1.15fr',
            gap: '3.5rem',
            background: '#ffffff',
            padding: '2.5rem',
            borderRadius: '24px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
          }}
          className="food-details-grid"
        >
          {/* Image Column */}
          <div>
            <div
              style={{
                position: 'relative',
                borderRadius: '20px',
                overflow: 'hidden',
                boxShadow: '0 12px 28px rgba(0,0,0,0.1)',
                height: '420px',
              }}
            >
              <img
                src={food.image}
                alt={food.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src =
                    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80';
                }}
              />
              <span
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'rgba(255,255,255,0.92)',
                  backdropFilter: 'blur(8px)',
                  padding: '6px 14px',
                  borderRadius: '9999px',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  color: '#1E293B',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                }}
              >
                {food.category}
              </span>
            </div>
          </div>

          {/* Details Column */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
              <div className={`food-diet-badge ${food.isVeg ? 'veg' : 'non-veg'}`}>
                <div className="dot" />
              </div>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: food.isVeg ? '#2E7D32' : '#DC2626',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
                {food.isVeg ? 'Pure Vegetarian' : 'Non-Vegetarian'}
              </span>
              {food.isPopular && (
                <span
                  style={{
                    background: '#FFF8E1',
                    color: '#B45309',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    padding: '3px 10px',
                    borderRadius: '9999px',
                    border: '1px solid #FDE68A',
                  }}
                >
                  Chef Special
                </span>
              )}
            </div>

            <h1 style={{ fontSize: '2.4rem', fontWeight: 800, marginBottom: '1rem', lineHeight: '1.2' }}>
              {food.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '2.4rem', fontWeight: 800, color: '#E65100', fontFamily: 'var(--font-heading)' }}>
                ₹{food.price}
              </span>
              <span style={{ color: '#64748B', fontSize: '0.95rem' }}>Inclusive of all taxes</span>
            </div>

            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.7', marginBottom: '2rem' }}>
              {food.description}
            </p>

            {/* Dish Meta Cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '1rem',
                marginBottom: '2.25rem',
              }}
            >
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                  <Flame size={20} color="#DC2626" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Spice Level</div>
                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.95rem' }}>
                  {food.spiceLevel || 'Medium'}
                </div>
              </div>

              <div
                style={{
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                  <Clock size={20} color="#E65100" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Preparation</div>
                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.95rem' }}>
                  {food.preparationTime || 25} mins
                </div>
              </div>

              <div
                style={{
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  textAlign: 'center',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.35rem' }}>
                  <ShieldCheck size={20} color="#16A34A" />
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Kitchen</div>
                <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.95rem' }}>Hygienic</div>
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 'auto', borderTop: '1px solid #F1F5F9', paddingTop: '1.75rem' }}>
              {food.isAvailable ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div className="qty-stepper" style={{ padding: '0.45rem 0.65rem' }}>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                      style={{ width: '36px', height: '36px' }}
                      aria-label="Decrease quantity"
                    >
                      <Minus size={18} />
                    </button>
                    <span className="qty-val" style={{ minWidth: '40px', fontSize: '1.2rem' }}>
                      {quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => setQuantity((q) => q + 1)}
                      style={{ width: '36px', height: '36px' }}
                      aria-label="Increase quantity"
                    >
                      <Plus size={18} />
                    </button>
                  </div>

                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleAddToCart}
                    style={{ flex: 1, minWidth: '220px', padding: '0.85rem 1.75rem', fontSize: '1.05rem' }}
                  >
                    {addedNotice ? (
                      <>
                        <Check size={20} /> Added to Cart!
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={20} /> Add to Cart — ₹{food.price * quantity}
                      </>
                    )}
                  </button>
                </div>
              ) : (
                <div
                  style={{
                    background: '#FEE2E2',
                    color: '#991B1B',
                    padding: '1rem',
                    borderRadius: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                  }}
                >
                  This dish is temporarily sold out today. Please check back later!
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodDetailsPage;
