import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';
import {
  Star,
  MessageSquare,
  CheckCircle2,
  PenLine,
  X,
  Sparkles,
  ShoppingBag,
  Utensils,
  ThumbsUp,
  AlertCircle,
  Filter,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const POPULAR_DISH_TAGS = [
  'Hyderabadi Dum Biryani',
  'Chicken Ghee Roast',
  'Old Delhi Butter Chicken',
  'Bangalore Mutton Sukka',
  'Paneer Butter Masala',
  'Fish Amritsari Fry',
  'Gulab Jamun with Rabdi',
  'Alphonso Mango Lassi',
  'Filter Coffee',
  'Tandoori Murgh',
];

const RATING_LABELS = {
  1: 'Needs Improvement',
  2: 'Fair Experience',
  3: 'Good Flavors',
  4: 'Very Good & Tasty',
  5: 'Royal Feast / Outstanding!',
};

const ReviewsPage = () => {
  const { isAuthenticated, user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveredOrders, setDeliveredOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [selectedDishes, setSelectedDishes] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/reviews');
      if (res.data.success) setReviews(res.data.data || []);
    } catch (err) {
      console.error('Failed to load reviews:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  // Fetch delivered orders when opening modal
  const handleOpenModal = async () => {
    setIsModalOpen(true);
    setFormError('');
    setSuccess('');
    try {
      setLoadingOrders(true);
      const res = await api.get('/api/orders/my-orders');
      const allOrders = res.data.data || [];
      const delivered = allOrders.filter((o) => o.orderStatus === 'Delivered');
      setDeliveredOrders(delivered);
      if (delivered.length > 0) {
        setSelectedOrderId(delivered[0]._id);
      }
    } catch (err) {
      console.error('Failed to fetch user orders:', err);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleToggleDishTag = (dish) => {
    if (selectedDishes.includes(dish)) {
      setSelectedDishes(selectedDishes.filter((d) => d !== dish));
    } else {
      if (selectedDishes.length >= 4) {
        return; // Max 4 tags
      }
      setSelectedDishes([...selectedDishes, dish]);
    }
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!comment.trim()) {
      setFormError('Please write your dining feedback before submitting.');
      return;
    }
    if (comment.trim().length < 10) {
      setFormError('Please write at least 10 characters describing your experience.');
      return;
    }

    try {
      setSubmitting(true);
      setFormError('');
      const payload = {
        rating,
        comment: comment.trim(),
        orderId: selectedOrderId || undefined,
        dishesLoved: selectedDishes,
      };

      const res = await api.post('/api/reviews', payload);
      setSuccess('Thank you for sharing your experience! Your review has been submitted for verification.');
      setIsModalOpen(false);
      setComment('');
      setSelectedDishes([]);
      setRating(5);
      fetchReviews();
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to submit review.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : 0;

  const filteredReviews = reviews.filter((r) => {
    if (filterRating === 'all') return true;
    return r.rating === Number(filterRating);
  });

  return (
    <div className="main-content" style={{ padding: '3rem 0', minHeight: '80vh' }}>
      <div className="container" style={{ maxWidth: '920px' }}>
        {/* Header Showcase */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div
            className="section-tag"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginBottom: '0.85rem',
            }}
          >
            <Star size={15} />
            <span>Bangalore Diner Voices</span>
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.5rem' }}>
            What Our Diners Say
          </h1>
          <p style={{ color: '#64748B', fontSize: '1.05rem', maxWidth: '620px', margin: '0 auto 1.5rem auto' }}>
            Verified reviews from food lovers across Indiranagar, Koramangala, and Bangalore who have savored Spice Garden.
          </p>

          {reviews.length > 0 && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.85rem',
                background: '#FFF8F0',
                border: '1px solid #FFE0B2',
                borderRadius: '50px',
                padding: '0.65rem 1.5rem',
                boxShadow: '0 4px 12px rgba(230, 81, 0, 0.08)',
              }}
            >
              <span style={{ fontSize: '1.75rem', fontWeight: 800, color: '#E65100', lineHeight: 1 }}>
                {avgRating}
              </span>
              <div style={{ display: 'flex', gap: '3px' }}>
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    fill={i < Math.round(avgRating) ? '#F59E0B' : 'none'}
                    color={i < Math.round(avgRating) ? '#F59E0B' : '#CBD5E1'}
                  />
                ))}
              </div>
              <span style={{ color: '#64748B', fontSize: '0.9rem', fontWeight: 600 }}>
                ({reviews.length} verified reviews)
              </span>
            </div>
          )}
        </div>

        {/* Success Alert Banner */}
        {success && (
          <div
            style={{
              background: '#F0FDF4',
              border: '1px solid #BBF7D0',
              borderRadius: '12px',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              color: '#15803D',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 600,
            }}
          >
            <CheckCircle2 size={22} color="#16A34A" />
            <span>{success}</span>
          </div>
        )}

        {/* Write a Review CTA Box */}
        <div
          style={{
            background: 'linear-gradient(135deg, #FFF8F0 0%, #FFF3E0 100%)',
            border: '1px solid #FFE0B2',
            borderRadius: '20px',
            padding: '1.75rem 2rem',
            marginBottom: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1.5rem',
            flexWrap: 'wrap',
            boxShadow: '0 4px 20px rgba(230, 81, 0, 0.06)',
          }}
        >
          <div>
            <h3 style={{ fontWeight: 800, fontSize: '1.2rem', color: '#1E293B', marginBottom: '0.35rem' }}>
              Have you tasted Spice Garden?
            </h3>
            <p style={{ fontSize: '0.92rem', color: '#64748B', margin: 0 }}>
              Share your dining thoughts, rate dishes, and help Bangalore foodies discover their next feast.
            </p>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              id="write-review-btn"
              className="btn btn-primary btn-lg"
              onClick={handleOpenModal}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.5rem',
                boxShadow: '0 4px 14px rgba(230, 81, 0, 0.35)',
              }}
            >
              <PenLine size={18} />
              <span>Write a Review</span>
            </button>
          ) : (
            <Link
              to="/login"
              className="btn btn-primary"
              style={{ padding: '0.75rem 1.5rem' }}
            >
              Login to Review
            </Link>
          )}
        </div>

        {/* Filter Pills Toolbar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '1rem',
            marginBottom: '1.75rem',
            paddingBottom: '1rem',
            borderBottom: '1px solid #E2E8F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Filter size={15} /> Filter:
            </span>
            {[
              { label: 'All Reviews', value: 'all' },
              { label: '5 ★ Royal', value: '5' },
              { label: '4 ★ Very Good', value: '4' },
              { label: '3 ★ Good', value: '3' },
            ].map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilterRating(f.value)}
                className={`btn btn-sm ${filterRating === f.value ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.35rem 0.85rem' }}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
            Showing <strong>{filteredReviews.length}</strong> of <strong>{reviews.length}</strong> reviews
          </div>
        </div>

        {/* Reviews Feed */}
        {loading ? (
          <Loader message="Loading verified customer reviews..." />
        ) : filteredReviews.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '4rem 1rem', color: '#94A3B8' }}>
            <MessageSquare size={56} style={{ margin: '0 auto 1rem', color: '#CBD5E1' }} />
            <h3 style={{ color: '#64748B', fontWeight: 700 }}>No reviews match this rating</h3>
            <p style={{ fontSize: '0.95rem' }}>Be the first to share your thoughts on this dining category!</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="review-card"
                style={{
                  background: '#ffffff',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  padding: '1.75rem',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                }}
              >
                {/* Author & Rating Header */}
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                    gap: '0.75rem',
                    marginBottom: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #E65100, #F59E0B)',
                        color: '#ffffff',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.15rem',
                        fontWeight: 800,
                        boxShadow: '0 3px 10px rgba(230, 81, 0, 0.25)',
                      }}
                    >
                      {rev.customerName ? rev.customerName.charAt(0).toUpperCase() : 'D'}
                    </div>
                    <div>
                      <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                        {rev.customerName}
                      </h4>
                      <span style={{ fontSize: '0.8rem', color: '#64748B' }}>
                        {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}{' '}
                        • Bangalore Diner
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '2px' }}>
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={17}
                          fill={i < rev.rating ? '#F59E0B' : 'none'}
                          color={i < rev.rating ? '#F59E0B' : '#CBD5E1'}
                        />
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#15803D',
                        fontWeight: 700,
                        background: '#ECFDF5',
                        border: '1px solid #A7F3D0',
                        padding: '2px 8px',
                        borderRadius: '20px',
                      }}
                    >
                      ✓ Verified Order
                    </span>
                  </div>
                </div>

                {/* Review Text */}
                <p style={{ color: '#334155', fontSize: '1rem', lineHeight: '1.7', margin: '0 0 1rem 0' }}>
                  "{rev.comment}"
                </p>

                {/* Dishes Loved Tags */}
                {rev.dishesLoved && rev.dishesLoved.length > 0 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', paddingTop: '0.75rem', borderTop: '1px dashed #F1F5F9' }}>
                    <span style={{ fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <ThumbsUp size={13} color="#E65100" /> Loved:
                    </span>
                    {rev.dishesLoved.map((d, idx) => (
                      <span
                        key={idx}
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          background: '#FFF8F0',
                          color: '#E65100',
                          border: '1px solid #FED7AA',
                          padding: '2px 8px',
                          borderRadius: '6px',
                        }}
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Interactive Review Submission Modal */}
        {isModalOpen && (
          <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '620px', padding: '2rem' }}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={20} />
              </button>

              <div style={{ marginBottom: '1.5rem' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#E65100', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
                  <Sparkles size={14} /> Verified Bangalore Diner Review
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Share Your Dining Feedback
                </h2>
                <p style={{ color: '#64748B', fontSize: '0.88rem', margin: '4px 0 0 0' }}>
                  Your authentic review will appear on the Spice Garden community wall.
                </p>
              </div>

              {formError && (
                <div
                  style={{
                    background: '#FEF2F2',
                    border: '1px solid #FECDD3',
                    borderRadius: '10px',
                    padding: '0.75rem 1rem',
                    marginBottom: '1.25rem',
                    color: '#B91C1C',
                    fontSize: '0.88rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <span>{formError}</span>
                </div>
              )}

              {/* Order Selection Check */}
              {loadingOrders ? (
                <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                  <Loader message="Checking verified delivered orders..." />
                </div>
              ) : deliveredOrders.length === 0 ? (
                <div
                  style={{
                    background: '#FFFBEB',
                    border: '1px solid #FDE68A',
                    borderRadius: '12px',
                    padding: '1.5rem',
                    textAlign: 'center',
                    marginBottom: '1rem',
                  }}
                >
                  <ShoppingBag size={40} color="#D97706" style={{ margin: '0 auto 0.75rem' }} />
                  <h4 style={{ color: '#92400E', fontWeight: 800, marginBottom: '0.35rem' }}>
                    No Delivered Orders Found
                  </h4>
                  <p style={{ color: '#B45309', fontSize: '0.88rem', marginBottom: '1.25rem' }}>
                    To ensure all dining reviews are genuine and trustworthy, reviews can only be submitted after an order has been successfully delivered.
                  </p>
                  <Link
                    to="/menu"
                    className="btn btn-primary btn-sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Order from Bangalore Menu Now
                  </Link>
                </div>
              ) : (
                <form onSubmit={handleSubmitReview}>
                  {/* Select Order */}
                  <div style={{ marginBottom: '1.25rem' }}>
                    <label className="form-label" style={{ fontWeight: 700 }}>
                      Select Delivered Order to Review *
                    </label>
                    <select
                      value={selectedOrderId}
                      onChange={(e) => setSelectedOrderId(e.target.value)}
                      className="form-select"
                      style={{ fontSize: '0.9rem' }}
                    >
                      {deliveredOrders.map((ord) => (
                        <option key={ord._id} value={ord._id}>
                          Order #{ord.orderId || ord._id.slice(-6)} • ₹{ord.totalAmount} • {ord.items?.length || 1} items ({new Date(ord.createdAt).toLocaleDateString('en-IN')})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Interactive Star Rating */}
                  <div style={{ marginBottom: '1.5rem', background: '#F8FAFC', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.5rem' }}>
                      Your Dining Rating *
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        {[1, 2, 3, 4, 5].map((star) => {
                          const active = (hoverRating || rating) >= star;
                          return (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setRating(star)}
                              onMouseEnter={() => setHoverRating(star)}
                              onMouseLeave={() => setHoverRating(0)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '2px',
                                transition: 'transform 0.15s',
                                transform: (hoverRating || rating) >= star ? 'scale(1.15)' : 'scale(1)',
                              }}
                              aria-label={`${star} Stars`}
                            >
                              <Star
                                size={32}
                                fill={active ? '#F59E0B' : 'none'}
                                color={active ? '#F59E0B' : '#CBD5E1'}
                              />
                            </button>
                          );
                        })}
                      </div>
                      <span
                        style={{
                          fontSize: '0.95rem',
                          fontWeight: 700,
                          color: '#E65100',
                          marginLeft: '0.5rem',
                        }}
                      >
                        {RATING_LABELS[hoverRating || rating]}
                      </span>
                    </div>
                  </div>

                  {/* Dishes Loved Tag Selector */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <label className="form-label" style={{ fontWeight: 700, marginBottom: '0.25rem' }}>
                      Which dishes did you love the most? (Select up to 4)
                    </label>
                    <p style={{ fontSize: '0.78rem', color: '#64748B', margin: '0 0 0.65rem 0' }}>
                      Click dish tags to highlight your favorites
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {POPULAR_DISH_TAGS.map((dish) => {
                        const isSelected = selectedDishes.includes(dish);
                        return (
                          <button
                            key={dish}
                            type="button"
                            onClick={() => handleToggleDishTag(dish)}
                            style={{
                              border: isSelected ? '1px solid #E65100' : '1px solid #CBD5E1',
                              background: isSelected ? '#FFF8F0' : '#ffffff',
                              color: isSelected ? '#E65100' : '#475569',
                              fontWeight: isSelected ? 700 : 500,
                              borderRadius: '20px',
                              padding: '0.35rem 0.8rem',
                              fontSize: '0.8rem',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            {isSelected && <span>✓</span>}
                            <span>{dish}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Written Review */}
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <label className="form-label" style={{ fontWeight: 700, margin: 0 }}>
                        Your Review Feedback *
                      </label>
                      <span style={{ fontSize: '0.78rem', color: comment.length > 450 ? '#EF4444' : '#94A3B8' }}>
                        {comment.length} / 500 characters
                      </span>
                    </div>
                    <textarea
                      rows={4}
                      className="form-textarea"
                      placeholder="Describe the flavors, aromas, meat tenderness, ghee taste, temperature on delivery, and overall satisfaction..."
                      value={comment}
                      maxLength={500}
                      onChange={(e) => {
                        setComment(e.target.value);
                        setFormError('');
                      }}
                      required
                      style={{ resize: 'vertical', fontSize: '0.92rem' }}
                    />
                  </div>

                  {/* Submit Actions */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                    <button
                      type="button"
                      className="btn btn-outline"
                      onClick={() => setIsModalOpen(false)}
                      disabled={submitting}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      id="submit-review-btn"
                      className="btn btn-primary"
                      disabled={submitting}
                      style={{
                        padding: '0.65rem 1.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      {submitting ? (
                        'Submitting...'
                      ) : (
                        <>
                          <CheckCircle2 size={16} />
                          <span>Submit Verified Review</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewsPage;
