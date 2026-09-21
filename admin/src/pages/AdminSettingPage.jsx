import React, { useState } from 'react';
import { useAdminAuth } from '../context/AdminAuthContext';
import {
  Settings,
  Store,
  Clock,
  Bike,
  ShieldCheck,
  Bell,
  Save,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Phone,
  Mail,
  MapPin,
  Volume2,
  VolumeX,
  FileCheck
} from 'lucide-react';

const AdminSettingPage = () => {
  const { adminUser } = useAdminAuth();

  // Load saved settings or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('sg_admin_settings');
      return saved
        ? JSON.parse(saved)
        : {
            restaurantName: 'Spice Garden',
            tagline: 'Authentic Indian & Bangalore Dum Specialties',
            address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
            city: 'Bangalore, Karnataka - 560038',
            phone: '+91 80 4123 4567',
            whatsapp: '+91 98450 11223',
            email: 'contact@spicegarden.com',
            fssaiNumber: '11223344556677',
            isAcceptingOrders: true,
            openTime: '11:00 AM',
            closeTime: '11:30 PM',
            deliveryRadius: 10,
            baseDeliveryFee: 40,
            freeDeliveryThreshold: 499,
            minOrderAmount: 200,
            taxRate: 5,
            soundAlerts: true,
            autoPrintKOT: false,
          };
    } catch {
      return {
        restaurantName: 'Spice Garden',
        tagline: 'Authentic Indian & Bangalore Dum Specialties',
        address: '100 Feet Road, HAL 2nd Stage, Indiranagar',
        city: 'Bangalore, Karnataka - 560038',
        phone: '+91 80 4123 4567',
        whatsapp: '+91 98450 11223',
        email: 'contact@spicegarden.com',
        fssaiNumber: '11223344556677',
        isAcceptingOrders: true,
        openTime: '11:00 AM',
        closeTime: '11:30 PM',
        deliveryRadius: 10,
        baseDeliveryFee: 40,
        freeDeliveryThreshold: 499,
        minOrderAmount: 200,
        taxRate: 5,
        soundAlerts: true,
        autoPrintKOT: false,
      };
    }
  });

  const [passwordState, setPasswordState] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('sg_admin_settings', JSON.stringify(settings));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handlePasswordChange = (e) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!passwordState.newPassword || passwordState.newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }

    if (passwordState.newPassword !== passwordState.confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    // Success simulation
    setPasswordSuccess(true);
    setPasswordState({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: '#FFFFFF',
          padding: '1.5rem 1.75rem',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              Restaurant Operations & System Settings
            </h1>
            <span
              style={{
                fontSize: '0.74rem',
                fontWeight: 700,
                backgroundColor: settings.isAcceptingOrders ? '#ECFDF5' : '#FEF2F2',
                color: settings.isAcceptingOrders ? '#065F46' : '#DC2626',
                border: `1px solid ${settings.isAcceptingOrders ? '#A7F3D0' : '#FECACA'}`,
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              {settings.isAcceptingOrders ? '● Store Open & Live' : '● Online Orders Paused'}
            </span>
          </div>
          <p style={{ fontSize: '0.88rem', color: '#64748B', margin: 0 }}>
            Configure kitchen operating parameters, Bangalore delivery radius, pricing rules, tax rates, and security controls.
          </p>
        </div>

        {savedSuccess && (
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#ECFDF5',
              border: '1px solid #A7F3D0',
              color: '#065F46',
              fontSize: '0.84rem',
              fontWeight: 700,
            }}
          >
            <CheckCircle2 size={16} />
            <span>Settings saved successfully!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSaveSettings} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1.5rem' }}>
          {/* Left Column: Restaurant Profile & Delivery Configuration */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Restaurant Profile Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Store size={20} color="#059669" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Kitchen & Restaurant Identity
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Brand / Restaurant Name
                    </label>
                    <input
                      type="text"
                      name="restaurantName"
                      value={settings.restaurantName}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      FSSAI Gold License Number
                    </label>
                    <input
                      type="text"
                      name="fssaiNumber"
                      value={settings.fssaiNumber}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Brand Tagline
                  </label>
                  <input
                    type="text"
                    name="tagline"
                    value={settings.tagline}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Physical Kitchen Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={settings.address}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      Helpline Phone
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={settings.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                      WhatsApp Orders Hotline
                    </label>
                    <input
                      type="text"
                      name="whatsapp"
                      value={settings.whatsapp}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '0.6rem 0.85rem',
                        borderRadius: '8px',
                        border: '1px solid #CBD5E1',
                        fontSize: '0.88rem',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Delivery & Pricing Parameters */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Bike size={20} color="#2563EB" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Bangalore Delivery & Order Pricing Rules
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Delivery Radius (km)
                  </label>
                  <input
                    type="number"
                    name="deliveryRadius"
                    value={settings.deliveryRadius}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Radius from 100ft Rd, Indiranagar</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Express Delivery Fee (₹)
                  </label>
                  <input
                    type="number"
                    name="baseDeliveryFee"
                    value={settings.baseDeliveryFee}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Standard express Bangalore fee</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Free Delivery Threshold (₹)
                  </label>
                  <input
                    type="number"
                    name="freeDeliveryThreshold"
                    value={settings.freeDeliveryThreshold}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Orders above this enjoy ₹0 delivery</span>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Minimum Order Value (₹)
                  </label>
                  <input
                    type="number"
                    name="minOrderAmount"
                    value={settings.minOrderAmount}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                  <span style={{ fontSize: '0.72rem', color: '#64748B' }}>Checkout enforces this minimum</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Live Store Status, Operating Hours & Security */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Live Store Status Switch */}
            <div
              style={{
                backgroundColor: settings.isAcceptingOrders ? '#F0FDF4' : '#FEF2F2',
                padding: '1.5rem',
                borderRadius: '16px',
                border: `1px solid ${settings.isAcceptingOrders ? '#BBF7D0' : '#FECACA'}`,
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: settings.isAcceptingOrders ? '#166534' : '#991B1B' }}>
                    {settings.isAcceptingOrders ? 'Store Accepting Online Orders' : 'Store Temporarily Paused'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: settings.isAcceptingOrders ? '#15803D' : '#B91C1C', marginTop: '2px' }}>
                    {settings.isAcceptingOrders
                      ? 'Customers across Bangalore can place orders on http://localhost:5173'
                      : 'Orders paused for kitchen rush or maintenance.'}
                  </div>
                </div>

                <label style={{ position: 'relative', display: 'inline-block', width: '50px', height: '26px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="isAcceptingOrders"
                    checked={settings.isAcceptingOrders}
                    onChange={handleChange}
                    style={{ opacity: 0, width: 0, height: 0 }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      inset: 0,
                      backgroundColor: settings.isAcceptingOrders ? '#16A34A' : '#CBD5E1',
                      borderRadius: '34px',
                      transition: '0.3s',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        content: '""',
                        height: '20px',
                        width: '20px',
                        left: settings.isAcceptingOrders ? '26px' : '3px',
                        bottom: '3px',
                        backgroundColor: 'white',
                        borderRadius: '50%',
                        transition: '0.3s',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
                      }}
                    />
                  </span>
                </label>
              </div>
            </div>

            {/* Operating Hours & Sound Alerts */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <Clock size={20} color="#D97706" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Kitchen Operating Hours & Alerts
                </h3>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Kitchen Opening
                  </label>
                  <input
                    type="text"
                    name="openTime"
                    value={settings.openTime}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '4px' }}>
                    Last Order Time
                  </label>
                  <input
                    type="text"
                    name="closeTime"
                    value={settings.closeTime}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', borderTop: '1px solid #E2E8F0', paddingTop: '1rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="soundAlerts"
                    checked={settings.soundAlerts}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                  />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    Play audible chime sound on incoming kitchen orders
                  </div>
                </label>

                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    name="autoPrintKOT"
                    checked={settings.autoPrintKOT}
                    onChange={handleChange}
                    style={{ width: '16px', height: '16px', accentColor: '#059669' }}
                  />
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#334155' }}>
                    Auto-trigger Kitchen Order Ticket (KOT) print dialogue
                  </div>
                </label>
              </div>
            </div>

            {/* Admin Security Card */}
            <div
              style={{
                backgroundColor: '#FFFFFF',
                padding: '1.5rem',
                borderRadius: '16px',
                border: '1px solid #E2E8F0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.25rem' }}>
                <KeyRound size={20} color="#7C3AED" />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0F172A', margin: 0 }}>
                  Admin Credentials & Password
                </h3>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '0.74rem', color: '#64748B', fontWeight: 600 }}>Active Admin User</span>
                  <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0F172A' }}>
                    {adminUser?.name || 'Spice Garden Admin'} (admin@spicegarden.com)
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordState.newPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, newPassword: e.target.value })}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordState.confirmPassword}
                    onChange={(e) => setPasswordState({ ...passwordState, confirmPassword: e.target.value })}
                    style={{
                      padding: '0.6rem 0.85rem',
                      borderRadius: '8px',
                      border: '1px solid #CBD5E1',
                      fontSize: '0.88rem',
                    }}
                  />
                </div>

                {passwordError && (
                  <div style={{ fontSize: '0.78rem', color: '#DC2626', fontWeight: 600 }}>
                    {passwordError}
                  </div>
                )}
                {passwordSuccess && (
                  <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 600 }}>
                    ✓ Admin password updated successfully!
                  </div>
                )}

                <button
                  type="button"
                  onClick={handlePasswordChange}
                  style={{
                    alignSelf: 'flex-start',
                    padding: '0.55rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid #CBD5E1',
                    backgroundColor: '#F8FAFC',
                    color: '#334155',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Save Action Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '1rem',
            padding: '1.25rem 1.5rem',
            backgroundColor: '#FFFFFF',
            borderRadius: '16px',
            border: '1px solid #E2E8F0',
          }}
        >
          <button
            type="submit"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '0.75rem 2rem',
              borderRadius: '10px',
              backgroundColor: '#059669',
              color: '#FFFFFF',
              fontWeight: 800,
              fontSize: '0.95rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#047857')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#059669')}
          >
            <Save size={18} />
            <span>Save Operational Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingPage;
