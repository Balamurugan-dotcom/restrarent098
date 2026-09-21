import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Clock, ShieldAlert, Heart } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand & Introduction */}
          <div>
            <div className="brand-logo" style={{ color: '#ffffff', marginBottom: '1rem' }}>
              <div className="logo-icon">🌿</div>
              <div>
                Spice <span className="highlight" style={{ color: '#FF9800' }}>Garden</span>
              </div>
            </div>
            <p style={{ color: '#94A3B8', fontSize: '0.92rem', marginBottom: '1.25rem', lineHeight: '1.6' }}>
              Experience the pinnacle of royal Indian culinary heritage right here in Bangalore. Handcrafted kebabs,
              authentic dum biryanis, and rich curries prepared with freshly ground whole spices and pure desi ghee.
            </p>
            {/* Delivery Area Restriction Callout */}
            <div
              style={{
                background: 'rgba(255, 152, 0, 0.1)',
                border: '1px solid rgba(255, 152, 0, 0.25)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                fontSize: '0.8rem',
                color: '#FED7AA',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.5rem',
              }}
            >
              <ShieldAlert size={18} style={{ flexShrink: 0, color: '#FFB74D', marginTop: '2px' }} />
              <div>
                <strong>Delivery Notice:</strong> We proudly deliver within a <strong>10 km radius</strong> in Bangalore
                (Indiranagar, Koramangala, Domlur, HAL, Ulsoor, MG Road, and surrounding areas).
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="footer-title">Explore</h4>
            <ul className="footer-links">
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/menu">Full Dining Menu</Link>
              </li>
              <li>
                <Link to="/reviews">Customer Reviews</Link>
              </li>
              <li>
                <Link to="/cart">My Shopping Cart</Link>
              </li>
              <li>
                <Link to="/my-orders">Track Orders</Link>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="footer-title">Service Hours</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div>
                <div style={{ color: '#E2E8F0', fontWeight: 600 }}>Lunch Service</div>
                <div style={{ color: '#94A3B8' }}>11:00 AM – 3:30 PM</div>
              </div>
              <div>
                <div style={{ color: '#E2E8F0', fontWeight: 600 }}>Evening & Dinner</div>
                <div style={{ color: '#94A3B8' }}>6:30 PM – 11:30 PM</div>
              </div>
              <div>
                <div style={{ color: '#E2E8F0', fontWeight: 600 }}>Online Delivery Kitchen</div>
                <div style={{ color: '#FCD34D' }}>Non-Stop 11:00 AM – 11:30 PM</div>
              </div>
            </div>
          </div>

          {/* Bangalore Location & Contact */}
          <div>
            <h4 className="footer-title">Bangalore Restaurant</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6rem' }}>
                <MapPin size={18} style={{ color: '#FF9800', flexShrink: 0, marginTop: '3px' }} />
                <span>#42, 100 Feet Road, 12th Main, Indiranagar, Bangalore, Karnataka – 560038</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Phone size={18} style={{ color: '#FF9800', flexShrink: 0 }} />
                <span>+91 80 4123 4567 / +91 98450 12345</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <Mail size={18} style={{ color: '#FF9800', flexShrink: 0 }} />
                <span>orders@spicegardenbangalore.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div>© {new Date().getFullYear()} Spice Garden Restaurant. All rights reserved. Bangalore, Karnataka.</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#64748B' }}>
            Crafted with <Heart size={14} fill="#EF4444" color="#EF4444" /> for Food Lovers
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
