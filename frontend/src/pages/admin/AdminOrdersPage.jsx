import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminSidebar from '../../components/admin/AdminSidebar';
import api from '../../services/api';
import Loader from '../../components/common/Loader';
import { Search, Eye, Download, CheckCircle2, Clock, Truck, XCircle, X, RefreshCw, ArrowUpDown } from 'lucide-react';

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'oldest', 'highest', 'lowest'

  // Order Details Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetchOrders();
  }, [filterStatus]);

  const fetchOrders = async () => {
    try {
      setRefreshing(true);
      const url = filterStatus ? `/orders?status=${encodeURIComponent(filterStatus)}` : '/orders';
      const res = await api.get(url);
      setOrders(res.data.data || res.data.orders || []);
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      setUpdatingId(orderId);
      const res = await api.put(`/orders/${orderId}/status`, { status: newStatus });
      const updatedOrder = res.data.data || res.data.order;
      if (updatedOrder) {
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? updatedOrder : o))
        );
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(updatedOrder);
        }
      } else {
        fetchOrders();
      }
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Could not update order status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Placed':
        return <span className="order-status-badge placed">Placed</span>;
      case 'Preparing':
        return <span className="order-status-badge preparing">Preparing</span>;
      case 'Out for Delivery':
        return <span className="order-status-badge out">Out for Delivery</span>;
      case 'Delivered':
        return <span className="order-status-badge delivered">Delivered</span>;
      case 'Cancelled':
        return <span className="order-status-badge cancelled">Cancelled</span>;
      default:
        return <span className="order-status-badge">{status}</span>;
    }
  };

  // Filter & Search Logic
  const filteredOrders = orders
    .filter((order) => {
      const term = searchTerm.toLowerCase();
      const idMatch = (order.orderId || order._id).toLowerCase().includes(term);
      const nameMatch = order.customerDetails?.name?.toLowerCase().includes(term);
      const phoneMatch = order.customerDetails?.phone?.toLowerCase().includes(term);
      const areaMatch = order.deliveryAddress?.area?.toLowerCase().includes(term);
      return idMatch || nameMatch || phoneMatch || areaMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highest') return (b.totalAmount || 0) - (a.totalAmount || 0);
      if (sortBy === 'lowest') return (a.totalAmount || 0) - (b.totalAmount || 0);
      return 0;
    });

  // Calculate filtered totals
  const totalValue = filteredOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

  // CSV Export
  const handleExportCSV = () => {
    if (filteredOrders.length === 0) {
      alert('No orders available to export.');
      return;
    }

    const headers = [
      'Order ID',
      'Date & Time',
      'Customer Name',
      'Phone',
      'Email',
      'Delivery Area',
      'Full Address',
      'Items Count',
      'Items Summary',
      'Subtotal (INR)',
      'Delivery Fee (INR)',
      'Total Amount (INR)',
      'Payment Method',
      'Payment Status',
      'Order Status',
    ];

    const rows = filteredOrders.map((o) => {
      const itemsSummary = o.items
        ? o.items.map((i) => `${i.quantity}x ${i.name}`).join('; ')
        : '';
      const fullAddress = `${o.deliveryAddress?.street || ''}, ${o.deliveryAddress?.area || ''}, ${o.deliveryAddress?.city || 'Bangalore'} - ${o.deliveryAddress?.pincode || ''}`;
      
      return [
        o.orderId || o._id,
        new Date(o.createdAt).toLocaleString('en-IN'),
        o.customerDetails?.name || '',
        o.customerDetails?.phone || '',
        o.customerDetails?.email || '',
        o.deliveryAddress?.area || '',
        fullAddress,
        o.items?.length || 0,
        itemsSummary,
        o.subtotal || 0,
        o.deliveryCharge || 0,
        o.totalAmount || 0,
        o.paymentMethod || 'Online',
        o.paymentStatus || 'Paid',
        o.orderStatus || 'Order Placed',
      ];
    });

    const csvContent = [
      headers.map((h) => `"${h}"`).join(','),
      ...rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `spice_garden_orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="admin-layout">
      <AdminSidebar />

      <main className="admin-main">
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.75rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: '#0F172A', marginBottom: '0.25rem' }}>
              Order Management
            </h1>
            <p style={{ color: '#64748B', fontSize: '0.9rem' }}>
              Live kitchen throughput, status transitions, search & CSV reporting.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-outline"
              onClick={fetchOrders}
              disabled={refreshing}
              style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <RefreshCw size={15} className={refreshing ? 'spin' : ''} />
              <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
            </button>

            <button
              type="button"
              className="btn btn-primary"
              onClick={handleExportCSV}
              style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              title="Download filtered orders as CSV spreadsheet"
            >
              <Download size={16} />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div
          style={{
            background: '#ffffff',
            padding: '1.25rem',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
          }}
        >
          {/* Search + Sort row */}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1', minWidth: '260px' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
              <input
                type="text"
                placeholder="Search by Order ID, customer, phone, or Bangalore area..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '2.5rem' }}
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                  }}
                >
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ArrowUpDown size={16} color="#64748B" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="form-select"
                style={{ fontSize: '0.85rem', padding: '0.5rem 0.85rem', width: 'auto' }}
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="highest">Amount: High to Low</option>
                <option value="lowest">Amount: Low to High</option>
              </select>
            </div>
          </div>

          {/* Status Pills row */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {[
              { label: 'All Orders', value: '' },
              { label: 'Order Placed', value: 'Order Placed' },
              { label: 'Preparing', value: 'Preparing' },
              { label: 'Out for Delivery', value: 'Out for Delivery' },
              { label: 'Delivered', value: 'Delivered' },
              { label: 'Cancelled', value: 'Cancelled' },
            ].map((st) => (
              <button
                key={st.value || 'all'}
                type="button"
                onClick={() => setFilterStatus(st.value)}
                className={`btn ${filterStatus === st.value ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>

        {/* Metrics Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            padding: '0.75rem 1rem',
            background: '#F8FAFC',
            borderRadius: '8px',
            border: '1px solid #E2E8F0',
            fontSize: '0.85rem',
            color: '#475569',
          }}
        >
          <div>
            Showing <strong>{filteredOrders.length}</strong> of <strong>{orders.length}</strong> orders
            {filterStatus && <span style={{ color: 'var(--primary)', marginLeft: '6px' }}>({filterStatus})</span>}
          </div>
          <div>
            Filtered Total Value: <strong style={{ color: '#0F172A', fontSize: '0.95rem' }}>₹{totalValue}</strong>
          </div>
        </div>

        {loading ? (
          <Loader message="Loading orders feed..." />
        ) : (
          <div className="data-table-card">
            <div style={{ overflowX: 'auto' }}>
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer Info</th>
                    <th>Delivery Area</th>
                    <th>Items</th>
                    <th>Total</th>
                    <th>Current Status</th>
                    <th>Change Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order._id}>
                        <td style={{ fontWeight: 800, color: '#E65100', fontSize: '0.9rem' }}>
                          {order.orderId || order._id.slice(-6)}
                        </td>
                        <td>
                          <div style={{ fontWeight: 700, color: '#1E293B' }}>
                            {order.customerDetails?.name || 'Customer'}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: '#64748B' }}>
                            {order.customerDetails?.phone}
                          </div>
                        </td>
                        <td>
                          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                            {order.deliveryAddress?.area || 'Bangalore'}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                            {order.deliveryAddress?.pincode}
                          </div>
                        </td>
                        <td>
                          <span style={{ fontSize: '0.85rem' }}>
                            {order.items?.length || 0} item{(order.items?.length || 0) > 1 ? 's' : ''}
                          </span>
                        </td>
                        <td style={{ fontWeight: 800, color: '#0F172A' }}>₹{order.totalAmount}</td>
                        <td>{getStatusBadge(order.orderStatus)}</td>
                        <td>
                          <select
                            disabled={updatingId === order._id || order.orderStatus === 'Delivered' || order.orderStatus === 'Cancelled'}
                            value={order.orderStatus}
                            onChange={(e) => handleUpdateStatus(order._id, e.target.value)}
                            className="form-select"
                            style={{
                              padding: '0.35rem 0.6rem',
                              fontSize: '0.8rem',
                              width: 'auto',
                              fontWeight: 600,
                            }}
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Preparing">Preparing</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              type="button"
                              onClick={() => setSelectedOrder(order)}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                              title="Inspect Order Details"
                            >
                              <Eye size={14} /> Details
                            </button>
                            <Link
                              to={`/order-tracking/${order._id}`}
                              className="btn btn-outline"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                              title="Customer Live Stepper"
                            >
                              Live
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" style={{ textAlign: 'center', padding: '2.5rem', color: '#94A3B8' }}>
                        No orders match the selected filters.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
            <div
              className="modal-content"
              onClick={(e) => e.stopPropagation()}
              style={{ maxWidth: '640px' }}
            >
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setSelectedOrder(null)}
              >
                <X size={18} />
              </button>

              <div style={{ borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.25rem' }}>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>
                    Order #{selectedOrder.orderId || selectedOrder._id}
                  </h2>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748B' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </div>
              </div>

              {/* Customer & Address */}
              <div
                style={{
                  background: '#F8FAFC',
                  padding: '1rem',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '1rem',
                  fontSize: '0.85rem',
                }}
              >
                <div>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Customer Details</div>
                  <div>{selectedOrder.customerDetails?.name}</div>
                  <div style={{ color: '#64748B' }}>{selectedOrder.customerDetails?.phone}</div>
                  <div style={{ color: '#64748B' }}>{selectedOrder.customerDetails?.email}</div>
                </div>

                <div>
                  <div style={{ fontWeight: 700, color: '#1E293B', marginBottom: '0.25rem' }}>Delivery Address</div>
                  <div>{selectedOrder.deliveryAddress?.street}</div>
                  <div>{selectedOrder.deliveryAddress?.area}, Bangalore</div>
                  <div style={{ color: '#64748B' }}>PIN: {selectedOrder.deliveryAddress?.pincode}</div>
                  {selectedOrder.deliveryAddress?.instructions && (
                    <div style={{ color: '#E65100', marginTop: '4px', fontStyle: 'italic' }}>
                      "{selectedOrder.deliveryAddress.instructions}"
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items */}
              <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>Dishes Ordered</h4>
              <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '1.25rem' }}>
                {selectedOrder.items?.map((item, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.6rem 0',
                      borderBottom: '1px solid #F1F5F9',
                      fontSize: '0.9rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontWeight: 700, color: '#E65100' }}>{item.quantity}x</span>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </div>
                    <span style={{ fontWeight: 700 }}>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* Payment and Totals */}
              <div style={{ background: '#FFFDF9', border: '1px dashed #FED7AA', borderRadius: '10px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                  <span style={{ color: '#64748B' }}>Subtotal</span>
                  <span>₹{selectedOrder.subtotal}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: '#64748B' }}>Delivery Fee</span>
                  <span>{selectedOrder.deliveryCharge === 0 ? 'FREE' : `₹${selectedOrder.deliveryCharge}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 800, fontSize: '1.1rem', borderTop: '1px solid #E2E8F0', paddingTop: '0.5rem' }}>
                  <span>Total Amount</span>
                  <span style={{ color: '#E65100' }}>₹{selectedOrder.totalAmount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginTop: '0.5rem', color: '#64748B' }}>
                  <span>Payment Method: <strong>{selectedOrder.paymentMethod}</strong></span>
                  <span>Status: <strong>{selectedOrder.paymentStatus}</strong></span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminOrdersPage;
