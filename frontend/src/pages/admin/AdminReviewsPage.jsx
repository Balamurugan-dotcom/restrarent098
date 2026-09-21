import React, { useState, useEffect } from 'react';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { Star, CheckCircle, Trash2, XCircle, ShieldAlert, Check } from 'lucide-react';

const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'pending', 'approved'

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const res = await api.get('/reviews/admin');
      setReviews(res.data.data || res.data.reviews || []);
    } catch (err) {
      console.error('Failed to fetch admin reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApprove = async (id, currentStatus) => {
    try {
      const res = await api.put(`/reviews/${id}/approve`, { isApproved: !currentStatus });
      setReviews((prev) =>
        prev.map((r) => (r._id === id ? { ...r, isApproved: res.data.review.isApproved } : r))
      );
    } catch (err) {
      console.error('Failed to toggle approval:', err);
      alert('Could not update review status.');
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this customer review?')) {
      return;
    }
    try {
      await api.delete(`/reviews/${id}`);
      setReviews((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      console.error('Failed to delete review:', err);
      alert('Failed to delete review.');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (filter === 'pending') return !r.isApproved;
    if (filter === 'approved') return r.isApproved;
    return true;
  });

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Review Moderation
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Approve verified diner reviews to publish them on the Spice Garden public website.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-outline"
            onClick={fetchReviews}
            style={{ fontSize: '0.85rem' }}
          >
            Refresh Reviews
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.75rem' }}>
          <button
            type="button"
            onClick={() => setFilter('all')}
            className={`btn ${filter === 'all' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
          >
            All Reviews ({reviews.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('pending')}
            className={`btn ${filter === 'pending' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
          >
            Pending Approval ({reviews.filter((r) => !r.isApproved).length})
          </button>
          <button
            type="button"
            onClick={() => setFilter('approved')}
            className={`btn ${filter === 'approved' ? 'btn-primary' : 'btn-outline'}`}
            style={{ fontSize: '0.82rem', padding: '0.4rem 0.85rem' }}
          >
            Published ({reviews.filter((r) => r.isApproved).length})
          </button>
        </div>

        {loading ? (
          <Loader message="Loading reviews feed..." />
        ) : (
          <div className="data-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Customer</th>
                    <th>Rating</th>
                    <th>Review Content</th>
                    <th>Date</th>
                    <th>Moderation Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReviews.length > 0 ? (
                    filteredReviews.map((rev) => (
                      <tr key={rev._id}>
                        <td style={{ fontWeight: 700, color: '#1E293B' }}>
                          {rev.customerName || rev.customer?.name || 'Verified Diner'}
                        </td>
                        <td>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: '#F59E0B' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={14}
                                fill={i < rev.rating ? '#F59E0B' : 'transparent'}
                                stroke="#F59E0B"
                              />
                            ))}
                          </div>
                        </td>
                        <td style={{ maxWidth: '360px' }}>
                          <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.45', margin: 0 }}>
                            "{rev.comment}"
                          </p>
                          {rev.dishesLoved && rev.dishesLoved.length > 0 && (
                            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '6px' }}>
                              {rev.dishesLoved.map((d, i) => (
                                <span
                                  key={i}
                                  style={{
                                    fontSize: '0.72rem',
                                    background: '#FFF8F0',
                                    color: '#E65100',
                                    border: '1px solid #FED7AA',
                                    padding: '1px 6px',
                                    borderRadius: '4px',
                                    fontWeight: 600,
                                  }}
                                >
                                  {d}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td style={{ fontSize: '0.8rem', color: '#64748B' }}>
                          {new Date(rev.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>
                        <td>
                          {rev.isApproved ? (
                            <span
                              style={{
                                background: '#ECFDF5',
                                color: '#059669',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              <Check size={13} /> Published
                            </span>
                          ) : (
                            <span
                              style={{
                                background: '#FFFBEB',
                                color: '#D97706',
                                padding: '4px 10px',
                                borderRadius: '9999px',
                                fontSize: '0.78rem',
                                fontWeight: 700,
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                              }}
                            >
                              Pending Review
                            </span>
                          )}
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button
                              type="button"
                              onClick={() => handleToggleApprove(rev._id, rev.isApproved)}
                              className={`btn ${rev.isApproved ? 'btn-outline' : 'btn-primary'}`}
                              style={{
                                padding: '0.35rem 0.65rem',
                                fontSize: '0.78rem',
                              }}
                            >
                              {rev.isApproved ? 'Unpublish' : 'Approve'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteReview(rev._id)}
                              className="btn btn-outline"
                              style={{
                                padding: '0.35rem 0.5rem',
                                color: '#DC2626',
                                borderColor: '#FECACA',
                              }}
                              title="Delete review"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8' }}>
                        No reviews found for this filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminReviewsPage;
