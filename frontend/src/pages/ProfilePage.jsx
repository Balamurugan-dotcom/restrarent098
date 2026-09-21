import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Phone, Mail, MapPin, Save, CheckCircle2 } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      area: user?.address?.area || 'Indiranagar',
      landmark: user?.address?.landmark || '',
      city: 'Bangalore',
      pincode: user?.address?.pincode || '',
    },
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const field = name.split('.')[1];
      setFormData(prev => ({ ...prev, address: { ...prev.address, [field]: value } }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setError(''); setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (formData.password && formData.password.length < 6) {
      return setError('New password must be at least 6 characters.');
    }
    try {
      setLoading(true);
      const payload = { name: formData.name, phone: formData.phone, address: formData.address };
      if (formData.password) payload.password = formData.password;
      await updateProfile(payload);
      setSuccess('Profile updated successfully!');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
    } catch (err) {
      setError(err.message || 'Update failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-content" style={{ padding: '2.5rem 0' }}>
      <div className="container-narrow">
        <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '0.35rem' }}>My Profile</h1>
        <p style={{ color: '#64748B', marginBottom: '2rem' }}>Manage your personal details and default delivery address</p>

        {/* User Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', background: 'linear-gradient(135deg, #FFF8F0, #FFF3E0)', border: '1px solid #FFE0B2', borderRadius: '16px', padding: '1.5rem', marginBottom: '2rem' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #FF6F00, #E65100)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800 }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800 }}>{user?.name}</h2>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.35rem' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}><Mail size={14} />{user?.email}</span>
              <span style={{ fontSize: '0.85rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '4px' }}><Phone size={14} />{user?.phone}</span>
            </div>
          </div>
        </div>

        {error && <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', color: '#B91C1C', fontSize: '0.88rem' }}>⚠️ {error}</div>}
        {success && (
          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', color: '#15803D', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <CheckCircle2 size={18} /> {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Personal Info */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <User size={18} color="#E65100" /> Personal Information
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">Full Name</label>
                <input id="profile-name" name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="profile-phone">Mobile Number</label>
                <input id="profile-phone" name="phone" type="tel" className="form-input" value={formData.phone} onChange={handleChange} maxLength={10} />
              </div>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label">Email Address (Cannot be changed)</label>
                <input type="email" className="form-input" value={user?.email} readOnly style={{ background: '#F8FAFC', color: '#94A3B8' }} />
              </div>
            </div>
          </div>

          {/* Default Delivery Address */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', marginBottom: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <MapPin size={18} color="#E65100" /> Default Delivery Address — Bangalore
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group" style={{ gridColumn: '1/-1' }}>
                <label className="form-label" htmlFor="address-street">Street / Flat / Building</label>
                <input id="address-street" name="address.street" type="text" className="form-input" placeholder="e.g. #24, 5th Cross, HAL 2nd Stage" value={formData.address.street} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address-area">Area / Locality</label>
                <input id="address-area" name="address.area" type="text" className="form-input" placeholder="e.g. Indiranagar" value={formData.address.area} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address-pincode">PIN Code</label>
                <input id="address-pincode" name="address.pincode" type="text" className="form-input" placeholder="e.g. 560038" value={formData.address.pincode} onChange={handleChange} maxLength={6} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="address-landmark">Landmark</label>
                <input id="address-landmark" name="address.landmark" type="text" className="form-input" placeholder="e.g. Near Metro Station" value={formData.address.landmark} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" className="form-input" value="Bangalore" readOnly style={{ background: '#F8FAFC', color: '#64748B' }} />
              </div>
            </div>
          </div>

          {/* Change Password */}
          <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid #E2E8F0', padding: '1.75rem', marginBottom: '2rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1.25rem' }}>Change Password (Optional)</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="new-password">New Password</label>
                <input id="new-password" name="password" type="password" className="form-input" placeholder="Leave blank to keep current" value={formData.password} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="confirm-new-password">Confirm New Password</label>
                <input id="confirm-new-password" name="confirmPassword" type="password" className="form-input" placeholder="Re-enter new password" value={formData.confirmPassword} onChange={handleChange} />
              </div>
            </div>
          </div>

          <button id="save-profile-btn" type="submit" className="btn btn-primary btn-lg" disabled={loading}>
            {loading ? 'Saving...' : <><Save size={18} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
