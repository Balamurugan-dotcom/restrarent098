import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import {
  ShoppingBag,
  User,
  LogOut,
  MapPin,
  Clock,
  Menu as MenuIcon,
  X,
  ShieldCheck,
  PackageCheck,
  ChevronDown,
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { totalCount, totalAmount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate('/');
  };

  return (
    <>
      {/* Top Bangalore Delivery & Hours Announcement Bar */}
      <div className="announcement-bar">
        <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <div className="loc-tag">
            <MapPin size={14} />
            <span>Indiranagar, Bangalore • Express Delivery (within 10 km)</span>
          </div>
          <div className="hours-tag">
            <Clock size={14} />
            <span>Open Daily: 11:00 AM – 11:30 PM</span>
            <span className="announcement-divider">•</span>
            <span className="announcement-offer">Free Delivery on ₹500+</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="navbar">
        <div className="container nav-container">
          {/* Brand Logo */}
          <Link to="/" className="brand-logo" onClick={() => setMobileOpen(false)}>
            <div className="logo-icon">🌿</div>
            <div>
              Spice <span className="highlight">Garden</span>
              <span className="city-badge">BLR</span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className={`nav-links ${mobileOpen ? 'mobile-open' : ''}`}>
            <NavLink to="/" onClick={() => setMobileOpen(false)}>
              Home
            </NavLink>
            <NavLink to="/menu" onClick={() => setMobileOpen(false)}>
              Menu
            </NavLink>
            <NavLink to="/reviews" onClick={() => setMobileOpen(false)}>
              Reviews
            </NavLink>
            {isAuthenticated && (
              <NavLink to="/my-orders" onClick={() => setMobileOpen(false)}>
                My Orders
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                style={{
                  color: '#D97706',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
              >
                <ShieldCheck size={16} />
                Staff Admin
              </NavLink>
            )}
            {!isAuthenticated && (
              <div className="mobile-auth-drawer-links" style={{ display: 'none' }}>
                <Link to="/login" className="btn btn-secondary btn-sm" onClick={() => setMobileOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm" onClick={() => setMobileOpen(false)}>
                  Register
                </Link>
              </div>
            )}
          </nav>

          {/* Right Action Icons & Auth */}
          <div className="nav-actions">
            {/* Cart Button */}
            <Link to="/cart" className="cart-btn" title="View Shopping Cart">
              <ShoppingBag size={20} />
              {totalCount > 0 && <span className="cart-count-badge">{totalCount}</span>}
            </Link>

            {/* User Dropdown or Login CTA */}
            {isAuthenticated ? (
              <div style={{ position: 'relative' }}>
                <button
                  type="button"
                  className="user-menu-btn"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <div className="user-avatar-circle">{user?.name ? user.name.charAt(0).toUpperCase() : 'U'}</div>
                  <span style={{ maxWidth: '100px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {user?.name?.split(' ')[0]}
                  </span>
                  <ChevronDown size={14} />
                </button>

                {userMenuOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 'calc(100% + 8px)',
                      background: '#ffffff',
                      borderRadius: '12px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.12)',
                      border: '1px solid #E2E8F0',
                      minWidth: '200px',
                      padding: '0.5rem 0',
                      zIndex: 200,
                      animation: 'fadeIn 0.2s ease',
                    }}
                  >
                    <div style={{ padding: '0.75rem 1rem', borderBottom: '1px solid #F1F5F9' }}>
                      <p style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.9rem' }}>{user.name}</p>
                      <p style={{ fontSize: '0.75rem', color: '#64748B' }}>{user.email}</p>
                      {isAdmin && (
                        <span
                          style={{
                            fontSize: '0.65rem',
                            fontWeight: 700,
                            background: '#FEF3C7',
                            color: '#92400E',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            marginTop: '4px',
                            display: 'inline-block',
                          }}
                        >
                          ADMINISTRATOR
                        </span>
                      )}
                    </div>

                    <Link
                      to="/profile"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.88rem',
                        color: '#334155',
                      }}
                    >
                      <User size={16} /> My Profile
                    </Link>

                    <Link
                      to="/my-orders"
                      onClick={() => setUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                        padding: '0.6rem 1rem',
                        fontSize: '0.88rem',
                        color: '#334155',
                      }}
                    >
                      <PackageCheck size={16} /> My Orders
                    </Link>

                    {isAdmin && (
                      <a
                        href="http://localhost:5174"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setUserMenuOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 1rem',
                          fontSize: '0.88rem',
                          color: '#D97706',
                          fontWeight: 600,
                        }}
                      >
                        <ShieldCheck size={16} /> Admin Console (5174)
                      </a>
                    )}

                    <div style={{ borderTop: '1px solid #F1F5F9', marginTop: '4px' }}>
                      <button
                        type="button"
                        onClick={handleLogout}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                          padding: '0.6rem 1rem',
                          fontSize: '0.88rem',
                          color: '#EF4444',
                          width: '100%',
                          textAlign: 'left',
                        }}
                      >
                        <LogOut size={16} /> Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="desktop-auth-links" style={{ display: 'flex', gap: '0.5rem' }}>
                <Link to="/login" className="btn btn-secondary btn-sm">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-sm">
                  Register
                </Link>
              </div>
            )}

            {/* Mobile Menu Toggle Button */}
            <button
              type="button"
              className="mobile-nav-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle Navigation"
            >
              {mobileOpen ? <X size={24} /> : <MenuIcon size={24} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
