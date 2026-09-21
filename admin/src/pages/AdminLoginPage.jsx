import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, LogIn, ChefHat, Database, ExternalLink } from 'lucide-react';

const AdminLoginPage = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError('Please enter your administrator email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(formData.email, formData.password);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Authentication failed. Please verify admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#0B1120',
        backgroundImage: 'radial-gradient(at 0% 0%, rgba(5, 150, 105, 0.15) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(234, 88, 12, 0.12) 0px, transparent 50%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem',
        fontFamily: 'var(--font-main)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Banner */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 10px 25px rgba(5, 150, 105, 0.3)',
              marginBottom: '1rem',
            }}
          >
            <ChefHat size={30} />
          </div>
          <h1 style={{ color: '#F8FAFC', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Spice Garden Admin
          </h1>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem', marginTop: '0.25rem' }}>
            Operations & Kitchen Pipeline Console
          </p>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              marginTop: '0.6rem',
              padding: '0.25rem 0.65rem',
              borderRadius: '9999px',
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              color: '#34D399',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <Database size={12} />
            <span>MongoDB 8.3 Persistent Database</span>
          </div>
        </div>

        {/* Login Card */}
        <div
          style={{
            backgroundColor: '#1E293B',
            borderRadius: '20px',
            border: '1px solid #334155',
            padding: '2.25rem',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem', color: '#38BDF8' }}>
            <ShieldCheck size={20} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#F8FAFC' }}>
              Management Sign In
            </h2>
          </div>

          {error && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                borderRadius: '8px',
                padding: '0.75rem 1rem',
                marginBottom: '1.25rem',
                color: '#FCA5A5',
                fontSize: '0.85rem',
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Admin Email
              </label>
              <div style={{ position: 'relative' }}>
                <Mail size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="admin@spicegarden.com"
                  style={{
                    width: '100%',
                    padding: '0.7rem 1rem 0.7rem 2.6rem',
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  autoComplete="email"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1', marginBottom: '0.4rem' }}>
                Password
              </label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  style={{
                    width: '100%',
                    padding: '0.7rem 2.6rem 0.7rem 2.6rem',
                    backgroundColor: '#0F172A',
                    border: '1px solid #334155',
                    borderRadius: '8px',
                    color: '#F8FAFC',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="admin-btn admin-btn-primary"
              style={{ width: '100%', padding: '0.85rem', fontSize: '0.95rem' }}
            >
              {loading ? 'Authenticating...' : (
                <>
                  <LogIn size={18} /> Enter Management Console
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center', borderTop: '1px solid #334155', paddingTop: '1.25rem' }}>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: '#94A3B8', fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <span>Switch to Customer Storefront (Port 5173)</span>
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
