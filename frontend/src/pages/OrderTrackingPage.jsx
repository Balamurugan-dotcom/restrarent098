import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import OrderStatusStepper from '../components/order/OrderStatusStepper';
import Loader from '../components/common/Loader';
import { MapPin, Phone, Banknote, CreditCard, AlertTriangle, RefreshCw } from 'lucide-react';

const statusClass = {
  'Order Placed': 'status-placed',
  'Preparing': 'status-preparing',
  'Out for Delivery': 'status-delivery',
  'Delivered': 'status-delivered',
  'Cancelled': 'status-cancelled',
};

const OrderTrackingPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/api/orders/${id}`);
      if (res.data.success) setOrder(res.data.data);
    } catch (err) {
      setError(err.message || 'Failed to load order details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrder(); }, [id]);

  const handleCancel = async () => {
    try {
      setCancelling(true);
      await api.put(`/api/orders/${id}/cancel`, { reason: 'Cancelled by customer' });
      setShowCancelConfirm(false);
      fetchOrder();
    } catch (err) {
      setError(err.message);
    } finally {
      setCancelling(false);
    }
  };

  if (loading) return <div className="container" style={{ padding: '4rem 0' }}><Loader message="Loading your order details..." /></div>;
  if (error) return (
    <div className="container" style={{ padding: '4rem 0', textAlign: 'center' }}>
      <AlertTriangle size={48} color="#EF4444" style={{ margin: '0 auto 1rem' }} />
      <h2>Could Not Load Order</h2>
      <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>{error}</p>
      <Link to="/my-orders" className="btn btn-primary">Back to My Orders</Link>
    </div>
  );
  if (!order) return null;

  return (
    <div className="main-content" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.35rem' }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Order #{order.orderId}</h1>
              <span className={`status-pill ${statusClass[order.orderStatus] || ''}`}>⬤ {order.orderStatus}</span>
            </div>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Placed on {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button type="button" onClick={fetchOrder} className="btn btn-secondary btn-sm">
              <RefreshCw size={15} /> Refresh
            </button>
            {order.orderStatus === 'Order Placed' && (
              <button id="cancel-order-btn" type="button" className="btn btn-sm" onClick={() => setShowCancelConfirm(true)}
                style={{ background: '#FEF2F2', color: '#B91C1C', border: '1px solid #FECDD3' }}>
                Cancel Order
              </button>
            )}
          </div>
        </div>

        {/* Visual Stepper */}
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Live Order Tracking</h3>
          <p style={{ color: '#64748B', fontSize: '0.88rem', marginBottom: '1rem' }}>Your food is being prepared fresh at our Indiranagar Bangalore kitchen.</p>
          <OrderStatusStepper currentStatus={order.orderStatus} />

          {/* Status History Timeline */}
          {order.statusHistory && order.statusHistory.length > 0 && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid #F1F5F9', paddingTop: '1.25rem' }}>
              <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#475569', marginBottom: '0.85rem' }}>Timeline</h4>
              {[...order.statusHistory].reverse().map((hist, i) => (
                <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.65rem', fontSize: '0.85rem' }}>
                  <span style={{ color: '#E65100', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {new Date(hist.timestamp).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ color: '#475569' }}>{hist.note || hist.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Details + Address */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 0.9fr', gap: '2rem' }}>
          {/* Items */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Order Items</h3>
            {order.items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid #F8FAFC' }}>
                <img src={item.image} alt={item.name} style={{ width: '56px', height: '56px', borderRadius: '10px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=100&q=80'; }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.name}</div>
                  <div style={{ fontSize: '0.82rem', color: '#64748B' }}>₹{item.price} × {item.quantity}</div>
                </div>
                <div style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</div>
              </div>
            ))}
            <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
                <span>Subtotal</span><span>₹{order.subtotal}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem', color: '#64748B' }}>
                <span>Delivery</span><span style={{ color: order.deliveryCharge === 0 ? '#15803D' : '#1E293B' }}>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.2rem', paddingTop: '0.5rem', borderTop: '1px solid #E2E8F0' }}>
                <span>Total</span><span style={{ color: '#E65100' }}>₹{order.totalAmount}</span>
              </div>
            </div>
          </div>

          {/* Address & Payment */}
          <div>
            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={18} color="#E65100" /> Delivery Address
              </h3>
              <p style={{ color: '#334155', fontSize: '0.9rem', lineHeight: '1.6' }}>
                {order.deliveryAddress.street},<br />
                {order.deliveryAddress.area}{order.deliveryAddress.landmark ? `, ${order.deliveryAddress.landmark}` : ''},<br />
                {order.deliveryAddress.city} — {order.deliveryAddress.pincode}
              </p>
              {order.deliveryAddress.instructions && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.82rem', color: '#64748B', fontStyle: 'italic' }}>
                  📝 "{order.deliveryAddress.instructions}"
                </p>
              )}
            </div>

            <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', marginBottom: '1.25rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
                {order.paymentMethod === 'Cash on Delivery' ? <Banknote size={18} color="#E65100" /> : <CreditCard size={18} color="#E65100" />}
                Payment
              </h3>
              <p style={{ color: '#334155', fontSize: '0.9rem' }}>{order.paymentMethod}</p>
              <span className={`status-pill ${order.paymentStatus === 'Paid' ? 'status-delivered' : 'status-placed'}`} style={{ marginTop: '0.5rem', display: 'inline-flex' }}>
                {order.paymentStatus}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <Link to="/my-orders" className="btn btn-secondary" style={{ flex: 1, justifyContent: 'center' }}>All Orders</Link>
              <Link to="/menu" className="btn btn-outline-primary" style={{ flex: 1, justifyContent: 'center' }}>Order Again</Link>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Confirm Modal */}
      {showCancelConfirm && (
        <div className="modal-overlay" onClick={() => setShowCancelConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, marginBottom: '0.75rem' }}>Cancel This Order?</h3>
            <p style={{ color: '#64748B', marginBottom: '1.5rem' }}>
              Are you sure you want to cancel order <strong>#{order.orderId}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setShowCancelConfirm(false)}>
                Keep My Order
              </button>
              <button type="button" className="btn" onClick={handleCancel} disabled={cancelling}
                style={{ flex: 1, background: '#EF4444', color: '#fff' }}>
                {cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderTrackingPage;
