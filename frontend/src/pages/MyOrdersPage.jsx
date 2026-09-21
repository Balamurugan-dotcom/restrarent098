import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import Loader from '../components/common/Loader';
import { PackageCheck, MapPin, ArrowRight, ShoppingBag, RotateCcw } from 'lucide-react';
import { useCart } from '../context/CartContext';

const statusClass = {
  'Order Placed': 'status-placed',
  'Preparing': 'status-preparing',
  'Out for Delivery': 'status-delivery',
  'Delivered': 'status-delivered',
  'Cancelled': 'status-cancelled',
};

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const handleReorder = (order) => {
    if (!order.items || order.items.length === 0) return;
    order.items.forEach((item) => {
      addToCart({
        _id: item.food || item._id,
        name: item.name,
        price: item.price,
        image: item.image,
        isVeg: item.isVeg,
      }, item.quantity || 1);
    });
    navigate('/checkout');
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await api.get('/api/orders/my-orders');
        if (res.data.success) setOrders(res.data.data);
      } catch (err) {
        setError(err.message || 'Failed to load orders.');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="main-content" style={{ padding: '2.5rem 0' }}>
      <div className="container">
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>My Orders</h1>
          <p style={{ color: '#64748B' }}>Track and manage all your Spice Garden orders</p>
        </div>

        {loading && <Loader message="Loading your order history..." />}

        {error && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#B91C1C' }}>{error}</div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div style={{ textAlign: 'center', padding: '5rem 1rem' }}>
            <ShoppingBag size={68} color="#CBD5E1" style={{ margin: '0 auto 1.5rem auto' }} />
            <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>No Orders Yet</h3>
            <p style={{ color: '#64748B', marginBottom: '2rem' }}>Looks like you haven't placed any orders. Start exploring our menu!</p>
            <Link to="/menu" className="btn btn-primary btn-lg">Browse Menu & Order Now</Link>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {orders.map((order) => (
              <div key={order._id} style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.5rem', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.3rem' }}>
                      <h3 style={{ fontWeight: 800, fontSize: '1.1rem' }}>#{order.orderId}</h3>
                      <span className={`status-pill ${statusClass[order.orderStatus] || ''}`}>
                        ⬤ {order.orderStatus}
                      </span>
                    </div>
                    <p style={{ color: '#64748B', fontSize: '0.85rem' }}>
                      {new Date(order.createdAt).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' })}
                    </p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#E65100' }}>₹{order.totalAmount}</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748B' }}>{order.paymentMethod}</div>
                  </div>
                </div>

                {/* Items Preview */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {order.items.slice(0, 4).map((item, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#F8FAFC', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', color: '#475569' }}>
                      <div className={`food-diet-badge ${item.isVeg ? 'veg' : 'non-veg'}`} style={{ width: '14px', height: '14px' }}><div className="dot" style={{ width: '6px', height: '6px' }} /></div>
                      {item.name} × {item.quantity}
                    </div>
                  ))}
                  {order.items.length > 4 && (
                    <div style={{ background: '#F8FAFC', padding: '0.3rem 0.7rem', borderRadius: '20px', fontSize: '0.8rem', color: '#94A3B8' }}>+{order.items.length - 4} more</div>
                  )}
                </div>

                {/* Delivery Address Short */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#64748B', fontSize: '0.82rem', marginBottom: '1rem' }}>
                  <MapPin size={14} color="#E65100" />
                  <span>{order.deliveryAddress.area}, {order.deliveryAddress.city} — {order.deliveryAddress.pincode}</span>
                </div>

                <div style={{ display: 'flex', gap: '0.85rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', flexWrap: 'wrap' }}>
                  {/* Button 1: Track Order */}
                  <Link
                    to={`/track/${order._id}`}
                    className="btn btn-primary"
                    style={{
                      flex: 1,
                      minWidth: '180px',
                      padding: '0.85rem 1.25rem',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      boxShadow: '0 4px 14px rgba(230, 81, 0, 0.3)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    <PackageCheck size={18} /> Track Order <ArrowRight size={16} />
                  </Link>

                  {/* Button 2: Order Again */}
                  <button
                    type="button"
                    onClick={() => handleReorder(order)}
                    className="btn btn-secondary"
                    style={{
                      flex: 1,
                      minWidth: '180px',
                      padding: '0.85rem 1.25rem',
                      fontSize: '0.98rem',
                      fontWeight: 700,
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                      border: '1.5px solid #E2E8F0',
                      backgroundColor: '#FFFFFF',
                      color: '#1E293B',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#E65100';
                      e.currentTarget.style.color = '#E65100';
                      e.currentTarget.style.backgroundColor = '#FFF7ED';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#E2E8F0';
                      e.currentTarget.style.color = '#1E293B';
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                    }}
                  >
                    <RotateCcw size={17} color="#E65100" /> Order Again
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;
