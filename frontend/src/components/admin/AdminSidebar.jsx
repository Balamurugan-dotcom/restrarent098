import React from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Star, ArrowLeft, LogOut, Shield } from 'lucide-react';

const AdminSidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="admin-sidebar">
      <div style={{ paddingBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              background: 'var(--primary-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '0.9rem',
              boxShadow: '0 4px 10px rgba(230, 81, 0, 0.4)',
            }}
          >
            SG
          </div>
          <span style={{ fontWeight: 800, fontSize: '1.2rem', color: '#ffffff', letterSpacing: '-0.02em' }}>
            Spice Garden
          </span>
        </div>
        <div style={{ fontSize: '0.75rem', color: '#FDBA74', fontWeight: 700, paddingLeft: '2.6rem', letterSpacing: '0.05em' }}>
          BANGALORE ADMIN
        </div>
      </div>

      <nav style={{ marginTop: '1.75rem' }}>
        <ul className="admin-sidebar-nav">
          <li>
            <NavLink
              to="/admin"
              end
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/foods"
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <UtensilsCrossed size={18} />
              <span>Menu (60 Dishes)</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/orders"
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <ShoppingBag size={18} />
              <span>Live Orders</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/admin/reviews"
              className={({ isActive }) => `admin-sidebar-link ${isActive ? 'active' : ''}`}
            >
              <Star size={18} />
              <span>Reviews Moderation</span>
            </NavLink>
          </li>
        </ul>
      </nav>

      <div style={{ marginTop: 'auto', paddingTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {/* User Card */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: '10px',
            padding: '0.75rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#E65100',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.85rem',
              fontWeight: 700,
              flexShrink: 0,
            }}
          >
            A
          </div>
          <div style={{ overflow: 'hidden', flex: 1 }}>
            <div style={{ color: '#F1F5F9', fontSize: '0.82rem', fontWeight: 700, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.name || 'Administrator'}
            </div>
            <div style={{ color: '#94A3B8', fontSize: '0.72rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
              {user?.email || 'admin@spicegarden.com'}
            </div>
          </div>
        </div>

        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#CBD5E1',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#ffffff';
            e.currentTarget.style.background = 'rgba(255,255,255,0.06)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#CBD5E1';
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <ArrowLeft size={16} />
          <span>Exit to Customer Site</span>
        </Link>

        <button
          type="button"
          onClick={handleLogout}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            color: '#F87171',
            background: 'transparent',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 600,
            padding: '0.6rem 0.75rem',
            borderRadius: '8px',
            cursor: 'pointer',
            textAlign: 'left',
            width: '100%',
            transition: 'var(--transition)',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'transparent';
          }}
        >
          <LogOut size={16} />
          <span>Log Out</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;
