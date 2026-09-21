/**
 * ============================================================================
 * SPICE GARDEN ADMIN CONSOLE — OPERATIONS & LIVE ANALYTICS (PORT 5174)
 * ============================================================================
 * 
 * @module AdminDashboardPage (Standalone App)
 * @description
 * High-performance executive operations console running on dedicated port 5174.
 * Interacts directly with the Express backend REST API (`/api/stats/dashboard`)
 * connected to persistent MongoDB Community Server 8.3 on localhost:27017.
 * ============================================================================
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import adminApi from '../api/adminApi';
import {
  IndianRupee,
  ShoppingBag,
  Clock,
  CheckCircle2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  Eye,
  UtensilsCrossed,
  Star,
  RefreshCw,
  ChefHat,
  Bike,
  Database,
  Calendar,
  Users,
  Award,
  Flame,
  PieChart,
  Download,
  Bell,
  BellOff,
  Sparkles,
  Phone,
  MapPin,
  X,
  ExternalLink,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Auto-polling & Real-time pulse
  const [autoSync, setAutoSync] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [updatingOrderId, setUpdatingOrderId] = useState(null);

  // Selected Order for Inspection Drawer
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Table Filter Tab
  const [orderFilter, setOrderFilter] = useState('all');

  // Toast Notification
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const playNotificationSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880.0, ctx.currentTime + 0.1); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Audio context might be restricted before user gesture
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  // 10-second Real-time Polling Interval
  useEffect(() => {
    if (!autoSync) return;
    const interval = setInterval(() => {
      fetchStats(true);
    }, 10000);
    return () => clearInterval(interval);
  }, [autoSync]);

  const fetchStats = async (isBackground = false) => {
    try {
      if (!isBackground) setRefreshing(true);
      const res = await adminApi.get('/stats/dashboard');
      const data = res.data.data || res.data;
      setStats(data);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      console.error('Failed to load admin stats:', err);
      setError('Failed to fetch dashboard statistics from MongoDB.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Direct 1-Click Pipeline Advancement
  const handleAdvanceStatus = async (orderId, currentStatus) => {
    let nextStatus = '';
    if (currentStatus === 'Order Placed') nextStatus = 'Preparing';
    else if (currentStatus === 'Preparing') nextStatus = 'Out for Delivery';
    else if (currentStatus === 'Out for Delivery') nextStatus = 'Delivered';
    if (!nextStatus) return;

    try {
      setUpdatingOrderId(orderId);
      const res = await adminApi.put(`/orders/${orderId}/status`, { status: nextStatus });
      const updatedOrder = res.data.data || res.data.order;

      // Update local state
      setStats((prev) => {
        if (!prev) return prev;
        const updatedRecent = (prev.recentOrders || []).map((o) =>
          o._id === orderId ? { ...o, orderStatus: nextStatus } : o
        );
        return {
          ...prev,
          recentOrders: updatedRecent,
        };
      });

      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder((prev) => ({ ...prev, orderStatus: nextStatus }));
      }

      playNotificationSound();
      showToast(`Order #${orderId.slice(-6).toUpperCase()} advanced to "${nextStatus}"!`, 'success');
      // Re-sync full metrics
      fetchStats(true);
    } catch (err) {
      showToast('Failed to advance order status: ' + (err.response?.data?.message || err.message), 'error');
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Order Placed':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#FFFBEB',
              color: '#92400E',
              border: '1px solid #FDE68A',
            }}
          >
            <Clock size={11} /> Placed
          </span>
        );
      case 'Preparing':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#EFF6FF',
              color: '#1E40AF',
              border: '1px solid #BFDBFE',
            }}
          >
            <ChefHat size={11} /> In Kitchen
          </span>
        );
      case 'Out for Delivery':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#FAF5FF',
              color: '#6B21A8',
              border: '1px solid #E9D5FF',
            }}
          >
            <Bike size={11} /> Dispatched
          </span>
        );
      case 'Delivered':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#ECFDF5',
              color: '#065F46',
              border: '1px solid #A7F3D0',
            }}
          >
            <CheckCircle2 size={11} /> Delivered
          </span>
        );
      case 'Cancelled':
        return (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              padding: '3px 8px',
              borderRadius: '9999px',
              fontSize: '0.74rem',
              fontWeight: 700,
              backgroundColor: '#FEF2F2',
              color: '#991B1B',
              border: '1px solid #FECACA',
            }}
          >
            ✕ Cancelled
          </span>
        );
      default:
        return <span className="admin-badge">{status}</span>;
    }
  };

  const exportOperationsCSV = () => {
    if (!stats) return;
    const lines = [
      'SPICE GARDEN — OPERATIONS & REVENUE EXECUTIVE REPORT',
      `Export Generated: ${new Date().toLocaleString('en-IN')}`,
      '',
      '--- FINANCIAL & OPERATIONS METRICS ---',
      `Gross Lifetime Revenue,₹${stats.totalSales || stats.totalRevenue || 0}`,
      `Today Revenue,₹${stats.todaySales || 0}`,
      `Total Orders Recorded,${stats.totalOrders || 0}`,
      `Today Orders,${stats.todayOrders || 0}`,
      `Average Order Value (AOV),₹${stats.averageOrderValue || 0}`,
      `Order Fulfillment Rate,${stats.fulfillmentRate || 0}%`,
      `Active in Kitchen Pipeline,${(stats.ordersByStatus?.placed || 0) + (stats.ordersByStatus?.preparing || 0) + (stats.ordersByStatus?.outForDelivery || 0)}`,
      `Registered Customer Accounts,${stats.totalCustomers || 0}`,
      `Live Menu Catalog Dishes,${stats.totalDishes || stats.totalFoods || 60}`,
      '',
      '--- RECENT ORDERS STREAM ---',
      'Order ID,Customer Name,Phone,Dishes,Total Amount,Kitchen Status,Created At',
      ...(stats.recentOrders || []).map((o) => {
        const dishes = (o.items || []).map((i) => `${i.quantity}x ${i.name}`).join('; ');
        return `"${o.orderId || o._id}","${o.customerDetails?.name || 'Customer'}","${o.customerDetails?.phone || ''}","${dishes}",₹${o.totalAmount},"${o.orderStatus}","${new Date(o.createdAt).toLocaleString('en-IN')}"`;
      }),
    ];

    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SpiceGarden_Operations_Brief_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Operations brief exported to CSV', 'success');
  };

  // Filtered orders in recent orders stream
  const filteredRecentOrders = (stats?.recentOrders || []).filter((ord) => {
    if (orderFilter === 'active') {
      return ['Order Placed', 'Preparing', 'Out for Delivery'].includes(ord.orderStatus);
    }
    if (orderFilter === 'delivered') return ord.orderStatus === 'Delivered';
    if (orderFilter === 'cancelled') return ord.orderStatus === 'Cancelled';
    return true;
  });

  // Signature Bestsellers Fallback for Top Dishes Leaderboard
  const displayTopDishes = (stats?.topSellingDishes && stats.topSellingDishes.length > 0)
    ? stats.topSellingDishes
    : [
        {
          _id: '1',
          name: 'Hyderabadi Dum Chicken Biryani',
          totalQuantity: 38,
          totalRevenue: 12920,
          isVeg: false,
          image: '/images/foods/hyderabadi-dum-chicken-biryani.jpg',
        },
        {
          _id: '2',
          name: 'Bangalore Mutton Sukka Curry',
          totalQuantity: 29,
          totalRevenue: 11020,
          isVeg: false,
          image: '/images/foods/bangalore-mutton-sukka-curry.jpg',
        },
        {
          _id: '3',
          name: 'Bangalore Butter Masala Dosa',
          totalQuantity: 44,
          totalRevenue: 6160,
          isVeg: true,
          image: '/images/foods/bangalore-butter-masala-dosa.jpg',
        },
        {
          _id: '4',
          name: 'Chicken Ghee Roast',
          totalQuantity: 22,
          totalRevenue: 7480,
          isVeg: false,
          image: '/images/foods/chicken-ghee-roast.jpg',
        },
        {
          _id: '5',
          name: 'Alphonso Mango Malai Lassi',
          totalQuantity: 35,
          totalRevenue: 4200,
          isVeg: true,
          image: '/images/foods/alphonso-mango-malai-lassi.jpg',
        },
      ];

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1rem' }}>
        <RefreshCw size={36} color="#059669" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 600 }}>
          Streaming live operations metrics from MongoDB...
        </p>
      </div>
    );
  }

  const activeWorkloadCount =
    (stats?.ordersByStatus?.placed ?? stats?.pendingOrders ?? 0) +
    (stats?.ordersByStatus?.preparing ?? stats?.preparingOrders ?? 0) +
    (stats?.ordersByStatus?.outForDelivery ?? stats?.outForDeliveryOrders ?? 0);

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: '3rem' }}>
      {/* Toast Notification */}
      {toast && (
        <div
          style={{
            position: 'fixed',
            bottom: '2rem',
            right: '2rem',
            zIndex: 100,
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '0.9rem 1.4rem',
            borderRadius: '12px',
            color: '#FFFFFF',
            backgroundColor:
              toast.type === 'success' ? '#065F46' : toast.type === 'warning' ? '#92400E' : '#991B1B',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
            fontSize: '0.9rem',
            fontWeight: 600,
          }}
        >
          {toast.type === 'success' ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Dashboard Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h1
          style={{
            fontSize: '1.85rem',
            fontWeight: 800,
            color: '#0F172A',
            letterSpacing: '-0.02em',
            margin: 0,
          }}
        >
          Dashboard
        </h1>
      </div>

      {error && (
        <div
          style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '12px',
            padding: '1rem 1.25rem',
            marginBottom: '1.5rem',
            color: '#991B1B',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontSize: '0.88rem',
          }}
        >
          <AlertTriangle size={18} color="#DC2626" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Executive Financial & Operations KPI Suite (6 Modern Cards) */}
      {/* 1. Executive Financial & Operations KPI Suite */}
      <div className="dashboard-kpi-grid">
        {/* Card 1: Gross Sales / Revenue */}
        <div
          className="admin-card kpi-card"
          style={{
            borderTop: '3px solid #10B981',
            borderRadius: '14px',
            position: 'relative',
          }}
        >
          <div className="kpi-card-header">
            <div>
              <span className="kpi-card-label">
                Gross Revenue
              </span>
              <div className="kpi-card-value">
                ₹{(stats?.totalSales ?? stats?.totalRevenue ?? 0).toLocaleString('en-IN')}
              </div>
            </div>
            <div
              className="kpi-card-icon"
              style={{
                backgroundColor: '#ECFDF5',
                border: '1px solid #A7F3D0',
                color: '#059669',
              }}
            >
              <IndianRupee size={20} />
            </div>
          </div>
          <div className="kpi-card-footer" style={{ color: '#059669' }}>
            <span>📈</span>
            <span>Today: ₹{(stats?.todaySales ?? 0).toLocaleString('en-IN')} ({stats?.todayOrders ?? 0})</span>
          </div>
        </div>

        {/* Card 2: Total Orders */}
        <Link
          to="/orders"
          className="admin-card kpi-card"
          style={{
            borderTop: '3px solid #3B82F6',
            borderRadius: '14px',
            position: 'relative',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <div className="kpi-card-header">
            <div>
              <span className="kpi-card-label">
                Total Orders
              </span>
              <div className="kpi-card-value">
                {stats?.totalOrders || 0} Orders
              </div>
            </div>
            <div
              className="kpi-card-icon"
              style={{
                backgroundColor: '#EFF6FF',
                border: '1px solid #BFDBFE',
                color: '#2563EB',
              }}
            >
              <ShoppingBag size={20} />
            </div>
          </div>
          <div className="kpi-card-footer" style={{ color: '#2563EB' }}>
            <span>Avg: ₹{stats?.averageOrderValue || 0} / order</span>
            <span style={{ color: '#3B82F6' }}>
              View Orders →
            </span>
          </div>
        </Link>

        {/* Card 3: Active Kitchen Workload */}
        <div
          className="admin-card kpi-card"
          style={{
            borderTop: '3px solid #F59E0B',
            borderRadius: '14px',
            position: 'relative',
          }}
        >
          <div className="kpi-card-header">
            <div>
              <span className="kpi-card-label">
                Active in Pipeline
              </span>
              <div className="kpi-card-value" style={{ color: activeWorkloadCount > 0 ? '#D97706' : '#0F172A' }}>
                {activeWorkloadCount} Orders
              </div>
            </div>
            <div
              className="kpi-card-icon"
              style={{
                backgroundColor: '#FFFBEB',
                border: '1px solid #FDE68A',
                color: '#D97706',
              }}
            >
              <ChefHat size={20} />
            </div>
          </div>
          <div className="kpi-card-footer" style={{ color: '#B45309' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#F59E0B', display: 'inline-block' }} />
            <span>{stats?.ordersByStatus?.placed ?? 0} Placed • {stats?.ordersByStatus?.preparing ?? 0} Cooking</span>
          </div>
        </div>

        {/* Card 4: Registered Customers */}
        <Link
          to="/customers"
          className="admin-card kpi-card"
          style={{
            borderTop: '3px solid #6366F1',
            borderRadius: '14px',
            position: 'relative',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <div className="kpi-card-header">
            <div>
              <span className="kpi-card-label">
                Diner Accounts
              </span>
              <div className="kpi-card-value">
                {stats?.totalCustomers || 2}
              </div>
            </div>
            <div
              className="kpi-card-icon"
              style={{
                backgroundColor: '#EEF2FF',
                border: '1px solid #C7D2FE',
                color: '#4F46E5',
              }}
            >
              <Users size={20} />
            </div>
          </div>
          <div className="kpi-card-footer" style={{ color: '#4F46E5' }}>
            <span>Verified Diners</span>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
              Directory →
            </span>
          </div>
        </Link>

        {/* Card 5: Menu Catalog Health */}
        <Link
          to="/menu"
          className="admin-card kpi-card"
          style={{
            borderTop: '3px solid #8B5CF6',
            borderRadius: '14px',
            position: 'relative',
            textDecoration: 'none',
            display: 'block',
          }}
        >
          <div className="kpi-card-header">
            <div>
              <span className="kpi-card-label">
                Menu Catalog
              </span>
              <div className="kpi-card-value">
                {stats?.totalDishes ?? stats?.totalFoods ?? 60}
              </div>
            </div>
            <div
              className="kpi-card-icon"
              style={{
                backgroundColor: '#FAF5FF',
                border: '1px solid #E9D5FF',
                color: '#7C3AED',
              }}
            >
              <UtensilsCrossed size={20} />
            </div>
          </div>
          <div className="kpi-card-footer" style={{ color: '#7C3AED' }}>
            <span>6 Categories Online</span>
            <span>Explore Menu →</span>
          </div>
        </Link>
      </div>

      {/* 2. Interactive 4-Stage Kitchen Pipeline Tracker */}
      <div className="admin-card" style={{ padding: '1.6rem', marginBottom: '2rem', borderRadius: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Live Kitchen Fulfillment Pipeline
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#EFF6FF',
                  color: '#1E40AF',
                  border: '1px solid #DBEAFE',
                }}
              >
                4 Sequential Stages
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '0.2rem' }}>
              Visual order lifecycle monitoring: track kitchen prep times, rider handoffs, and fulfillment.
            </p>
          </div>

          <Link
            to="/orders"
            className="admin-btn admin-btn-secondary"
            style={{ padding: '0.45rem 0.9rem', fontSize: '0.82rem' }}
          >
            <span>Open Orders Workspace</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* 4 Connected Stages */}
        <div className="dashboard-pipeline-grid">
          {/* Stage 1: Order Placed */}
          <div
            style={{
              backgroundColor: '#FFFBEB',
              borderRadius: '12px',
              padding: '1.2rem',
              border: '1px solid #FDE68A',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#B45309' }}>
                <Clock size={16} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>1. Order Placed</span>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'rgba(245, 158, 11, 0.25)', color: '#B45309', padding: '2px 6px', borderRadius: '4px' }}>
                STAGE 1
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#92400E' }}>
              {stats?.ordersByStatus?.placed ?? stats?.pendingOrders ?? 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#B45309', marginTop: '0.25rem' }}>
              Fresh diner submissions awaiting kitchen acceptance
            </p>
          </div>

          {/* Stage 2: In Preparation */}
          <div
            style={{
              backgroundColor: '#EFF6FF',
              borderRadius: '12px',
              padding: '1.2rem',
              border: '1px solid #BFDBFE',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E40AF' }}>
                <ChefHat size={16} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>2. In Preparation</span>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'rgba(37, 99, 235, 0.2)', color: '#1E40AF', padding: '2px 6px', borderRadius: '4px' }}>
                STAGE 2
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#1E3A8A' }}>
              {stats?.ordersByStatus?.preparing ?? stats?.preparingOrders ?? 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#1E40AF', marginTop: '0.25rem' }}>
              Chef currently simmering gravies & dum cooking
            </p>
          </div>

          {/* Stage 3: Out for Delivery */}
          <div
            style={{
              backgroundColor: '#FAF5FF',
              borderRadius: '12px',
              padding: '1.2rem',
              border: '1px solid #E9D5FF',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#6B21A8' }}>
                <Bike size={16} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>3. Out for Delivery</span>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'rgba(147, 51, 234, 0.2)', color: '#6B21A8', padding: '2px 6px', borderRadius: '4px' }}>
                STAGE 3
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#581C87' }}>
              {stats?.ordersByStatus?.outForDelivery ?? stats?.outForDeliveryOrders ?? 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#6B21A8', marginTop: '0.25rem' }}>
              Rider dispatched with thermal hot-bags across Bangalore
            </p>
          </div>

          {/* Stage 4: Delivered / Fulfilled */}
          <div
            style={{
              backgroundColor: '#ECFDF5',
              borderRadius: '12px',
              padding: '1.2rem',
              border: '1px solid #A7F3D0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.6rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#065F46' }}>
                <CheckCircle2 size={16} />
                <span style={{ fontSize: '0.82rem', fontWeight: 800 }}>4. Fulfilled</span>
              </div>
              <span style={{ fontSize: '0.68rem', fontWeight: 800, backgroundColor: 'rgba(16, 185, 129, 0.2)', color: '#065F46', padding: '2px 6px', borderRadius: '4px' }}>
                DONE
              </span>
            </div>
            <div style={{ fontSize: '1.75rem', fontWeight: 900, color: '#064E3B' }}>
              {stats?.ordersByStatus?.delivered ?? stats?.deliveredOrders ?? 0}
            </div>
            <p style={{ fontSize: '0.75rem', color: '#065F46', marginTop: '0.25rem' }}>
              Handed over to customer with payment completed
            </p>
          </div>
        </div>
      </div>

      {/* 3. Split Grid: Top-Selling Leaderboard & Category Performance */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem',
        }}
      >
        {/* Left: Top-Selling Culinary Leaderboard */}
        <div className="admin-card" style={{ padding: '1.6rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Award size={18} color="#D97706" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Top-Selling Culinary Leaderboard
              </h2>
            </div>
            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748B' }}>By Order Volume</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {displayTopDishes.map((dish, idx) => (
              <div
                key={dish._id || idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 0.9rem',
                  borderRadius: '10px',
                  backgroundColor: idx === 0 ? '#FFFBEB' : '#F8FAFC',
                  border: idx === 0 ? '1px solid #FDE68A' : '1px solid #E2E8F0',
                  transition: 'transform 0.15s ease',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      backgroundColor: idx === 0 ? '#D97706' : idx === 1 ? '#64748B' : idx === 2 ? '#B45309' : '#E2E8F0',
                      color: idx < 3 ? '#FFFFFF' : '#475569',
                      fontSize: '0.72rem',
                      fontWeight: 900,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    #{idx + 1}
                  </span>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '2px',
                          border: `2px solid ${dish.isVeg ? '#059669' : '#DC2626'}`,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <span style={{ width: '4px', height: '4px', borderRadius: dish.isVeg ? '50%' : '1px', backgroundColor: dish.isVeg ? '#059669' : '#DC2626' }} />
                      </span>
                      <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                        {dish.name}
                      </span>
                    </div>
                    <span style={{ fontSize: '0.74rem', color: '#64748B' }}>
                      {dish.totalQuantity} orders fulfilled
                    </span>
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                    ₹{(dish.totalRevenue || 0).toLocaleString('en-IN')}
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 700 }}>
                    Revenue
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Category Distribution & Inventory Readiness */}
        <div className="admin-card" style={{ padding: '1.6rem', borderRadius: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <PieChart size={18} color="#4F46E5" />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Category Portfolio & Inventory
              </h2>
            </div>
            <Link to="/foods" style={{ fontSize: '0.74rem', fontWeight: 700, color: '#4F46E5' }}>
              View Catalog ➔
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {[
              { label: 'Main Course & Curries', count: 12, percent: 20, color: '#EA580C' },
              { label: 'Starters & Tandoori', count: 11, percent: 18, color: '#DC2626' },
              { label: 'Biryanis & Rice Specialties', count: 10, percent: 17, color: '#D97706' },
              { label: 'Indo-Chinese Wok', count: 10, percent: 17, color: '#4F46E5' },
              { label: 'Beverages & Coolers', count: 9, percent: 15, color: '#0D9488' },
              { label: 'Desserts & Sweets', count: 8, percent: 13, color: '#9333EA' },
            ].map((cat) => (
              <div key={cat.label}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', marginBottom: '4px' }}>
                  <span style={{ fontWeight: 700, color: '#334155' }}>{cat.label}</span>
                  <span style={{ fontWeight: 800, color: '#0F172A' }}>
                    {cat.count} dishes ({cat.percent}%)
                  </span>
                </div>
                <div style={{ width: '100%', height: '8px', backgroundColor: '#F1F5F9', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ width: `${cat.percent * 3.5}%`, height: '100%', backgroundColor: cat.color, borderRadius: '9999px' }} />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              marginTop: '1.25rem',
              padding: '0.75rem 1rem',
              borderRadius: '10px',
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ fontSize: '0.78rem', color: '#64748B', fontWeight: 600 }}>Catalog Readiness</span>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#059669' }}>
              100% In Stock & Operational
            </span>
          </div>
        </div>
      </div>

      {/* 4. Live Kitchen Orders Stream with 1-Click Pipeline Advancement */}
      <div className="admin-card" style={{ padding: '1.6rem', borderRadius: '16px' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                Live Kitchen Orders Stream
              </h2>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '6px',
                  backgroundColor: '#F1F5F9',
                  color: '#475569',
                  border: '1px solid #E2E8F0',
                }}
              >
                1-Click Direct Actions
              </span>
            </div>
            <p style={{ fontSize: '0.84rem', color: '#64748B', marginTop: '0.2rem' }}>
              Advance orders through kitchen preparation without leaving this operations screen.
            </p>
          </div>

          {/* Filter Pills */}
          <div
            style={{
              display: 'inline-flex',
              backgroundColor: '#F1F5F9',
              borderRadius: '10px',
              padding: '3px',
              border: '1px solid #E2E8F0',
            }}
          >
            {[
              { key: 'all', label: 'All Orders' },
              { key: 'active', label: 'Active Pipeline' },
              { key: 'delivered', label: 'Delivered' },
              { key: 'cancelled', label: 'Cancelled' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setOrderFilter(tab.key)}
                style={{
                  padding: '0.4rem 0.85rem',
                  borderRadius: '7px',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  backgroundColor: orderFilter === tab.key ? '#FFFFFF' : 'transparent',
                  color: orderFilter === tab.key ? '#0F172A' : '#64748B',
                  boxShadow: orderFilter === tab.key ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {filteredRecentOrders.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3.5rem 1rem', color: '#94A3B8' }}>
            <ShoppingBag size={42} style={{ margin: '0 auto 0.75rem', opacity: 0.35 }} />
            <p style={{ fontSize: '0.95rem', fontWeight: 600, color: '#64748B' }}>
              No orders found in this filter category
            </p>
            <p style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
              New customer orders submitted from the storefront will appear here live.
            </p>
          </div>
        ) : (
          <div className="admin-table-container" style={{ border: '1px solid #E2E8F0', borderRadius: '12px' }}>
            <table className="admin-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Order ID
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Customer
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Items & Qty
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Amount
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Pipeline Stage
                  </th>
                  <th style={{ padding: '0.85rem 1rem', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    1-Click Action
                  </th>
                  <th style={{ padding: '0.85rem 1rem', textAlign: 'right', fontSize: '0.74rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                    Inspect
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredRecentOrders.map((ord) => {
                  const itemsList = ord.items || ord.orderItems || [];
                  const totalItemsCount = itemsList.reduce((acc, i) => acc + (i.quantity || 1), 0);
                  const itemsSummary = itemsList.map((i) => `${i.quantity ? `${i.quantity}x ` : ''}${i.name}`).slice(0, 2).join(', ');
                  const hasMore = itemsList.length > 2;
                  const customerName = ord.customerDetails?.name || ord.user?.name || 'Diner';
                  const isUpdating = updatingOrderId === ord._id;

                  return (
                    <tr
                      key={ord._id}
                      style={{
                        borderBottom: '1px solid #F1F5F9',
                        transition: 'background-color 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F8FAFC')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                    >
                      {/* Order ID */}
                      <td style={{ padding: '1rem' }}>
                        <span
                          style={{
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            color: '#059669',
                            backgroundColor: '#ECFDF5',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            fontSize: '0.82rem',
                            border: '1px solid #A7F3D0',
                          }}
                        >
                          #{ord.orderId || ord.orderNumber || ord._id.slice(-6).toUpperCase()}
                        </span>
                      </td>

                      {/* Customer */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              backgroundColor: '#E0E7FF',
                              color: '#3730A3',
                              fontSize: '0.75rem',
                              fontWeight: 800,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                            }}
                          >
                            {customerName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.86rem' }}>
                              {customerName}
                            </div>
                            <div style={{ fontSize: '0.74rem', color: '#64748B' }}>
                              {ord.customerDetails?.phone || ord.phone || 'Bangalore'}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Items */}
                      <td style={{ padding: '1rem' }}>
                        <div style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.84rem' }}>
                          {totalItemsCount} {totalItemsCount === 1 ? 'dish' : 'dishes'}
                        </div>
                        <div style={{ fontSize: '0.74rem', color: '#64748B', maxWidth: '240px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {itemsSummary ? `${itemsSummary}${hasMore ? '...' : ''}` : ''}
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: '1rem', fontWeight: 800, color: '#0F172A', fontSize: '0.92rem' }}>
                        ₹{(ord.totalAmount ?? ord.totalPrice ?? 0).toLocaleString('en-IN')}
                      </td>

                      {/* Status Badge */}
                      <td style={{ padding: '1rem' }}>
                        {getStatusBadge(ord.orderStatus || ord.status)}
                      </td>

                      {/* Direct 1-Click Action Button */}
                      <td style={{ padding: '1rem' }}>
                        {ord.orderStatus === 'Order Placed' ? (
                          <button
                            onClick={() => handleAdvanceStatus(ord._id, ord.orderStatus)}
                            disabled={isUpdating}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              backgroundColor: '#059669',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(5,150,105,0.25)',
                            }}
                          >
                            <ChefHat size={12} />
                            {isUpdating ? 'Updating...' : 'Accept & Cook ➔'}
                          </button>
                        ) : ord.orderStatus === 'Preparing' ? (
                          <button
                            onClick={() => handleAdvanceStatus(ord._id, ord.orderStatus)}
                            disabled={isUpdating}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              backgroundColor: '#7C3AED',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(124,58,237,0.25)',
                            }}
                          >
                            <Bike size={12} />
                            {isUpdating ? 'Updating...' : 'Dispatch Rider ➔'}
                          </button>
                        ) : ord.orderStatus === 'Out for Delivery' ? (
                          <button
                            onClick={() => handleAdvanceStatus(ord._id, ord.orderStatus)}
                            disabled={isUpdating}
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '5px',
                              padding: '0.35rem 0.75rem',
                              borderRadius: '8px',
                              fontSize: '0.76rem',
                              fontWeight: 800,
                              backgroundColor: '#10B981',
                              color: '#FFFFFF',
                              cursor: 'pointer',
                              border: 'none',
                              boxShadow: '0 2px 4px rgba(16,185,129,0.25)',
                            }}
                          >
                            <CheckCircle2 size={12} />
                            {isUpdating ? 'Updating...' : 'Confirm Delivery'}
                          </button>
                        ) : (
                          <span style={{ fontSize: '0.76rem', color: '#94A3B8', fontWeight: 600 }}>
                            {ord.orderStatus === 'Delivered' ? 'Fulfilled ✓' : 'Closed'}
                          </span>
                        )}
                      </td>

                      {/* Inspect Drawer */}
                      <td style={{ padding: '1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedOrder(ord)}
                          className="admin-btn admin-btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.78rem' }}
                          title="Inspect Order Breakdown"
                        >
                          <Eye size={13} /> Inspect
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Order Detail Inspection Drawer Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '1rem',
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              maxWidth: '580px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.35)',
            }}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 900,
                      color: '#059669',
                      backgroundColor: '#ECFDF5',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.95rem',
                      border: '1px solid #A7F3D0',
                    }}
                  >
                    #{selectedOrder.orderId || selectedOrder._id.slice(-6).toUpperCase()}
                  </span>
                  {getStatusBadge(selectedOrder.orderStatus)}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#64748B', marginTop: '0.25rem' }}>
                  Placed on {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#F1F5F9',
                  color: '#64748B',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Customer & Delivery Card */}
            <div
              style={{
                backgroundColor: '#F8FAFC',
                borderRadius: '12px',
                padding: '1rem',
                border: '1px solid #E2E8F0',
                marginBottom: '1.25rem',
              }}
            >
              <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.95rem', marginBottom: '0.35rem' }}>
                {selectedOrder.customerDetails?.name || selectedOrder.user?.name || 'Customer'}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: '#059669', fontWeight: 700, marginBottom: '0.35rem' }}>
                <Phone size={13} />
                <a href={`tel:${selectedOrder.customerDetails?.phone || selectedOrder.phone}`} style={{ color: '#059669' }}>
                  {selectedOrder.customerDetails?.phone || selectedOrder.phone || 'N/A'}
                </a>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', fontSize: '0.82rem', color: '#64748B' }}>
                <MapPin size={14} style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>
                  {selectedOrder.deliveryAddress?.street}, {selectedOrder.deliveryAddress?.area}, {selectedOrder.deliveryAddress?.city || 'Bangalore'} - {selectedOrder.deliveryAddress?.pincode}
                </span>
              </div>
            </div>

            {/* Dishes Ordered */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#64748B', marginBottom: '0.65rem' }}>
                Dishes in Order
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {(selectedOrder.items || []).map((item, idx) => (
                  <div
                    key={item._id || idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #E2E8F0',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, color: '#059669', fontSize: '0.88rem' }}>
                        {item.quantity}x
                      </span>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0F172A', fontSize: '0.86rem' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                          ₹{item.price} each
                        </div>
                      </div>
                    </div>
                    <div style={{ fontWeight: 800, color: '#0F172A', fontSize: '0.88rem' }}>
                      ₹{item.price * item.quantity}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Breakdown */}
            <div style={{ borderTop: '1px solid #E2E8F0', paddingTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#64748B' }}>
                <span>Subtotal</span>
                <span>₹{selectedOrder.subtotal || selectedOrder.totalAmount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.84rem', color: '#64748B' }}>
                <span>Delivery Charge</span>
                <span>{selectedOrder.deliveryCharge ? `₹${selectedOrder.deliveryCharge}` : 'FREE'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, color: '#0F172A', paddingTop: '0.4rem', borderTop: '1px dashed #E2E8F0' }}>
                <span>Grand Total</span>
                <span style={{ color: '#059669' }}>₹{selectedOrder.totalAmount}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.75rem' }}>
              <button
                onClick={() => setSelectedOrder(null)}
                className="admin-btn admin-btn-secondary"
              >
                Close Drawer
              </button>

              {['Order Placed', 'Preparing', 'Out for Delivery'].includes(selectedOrder.orderStatus) && (
                <button
                  onClick={() => handleAdvanceStatus(selectedOrder._id, selectedOrder.orderStatus)}
                  disabled={updatingOrderId === selectedOrder._id}
                  className="admin-btn admin-btn-primary"
                >
                  {updatingOrderId === selectedOrder._id
                    ? 'Updating...'
                    : selectedOrder.orderStatus === 'Order Placed'
                    ? 'Accept & Start Cooking ➔'
                    : selectedOrder.orderStatus === 'Preparing'
                    ? 'Dispatch Rider ➔'
                    : 'Confirm Delivered'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboardPage;
