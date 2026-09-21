import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', password: '', confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, phone, password, confirmPassword } = formData;
    if (!name || !email || !phone || !password) {
      return setError('All fields are required.');
    }
    if (password.length < 6) return setError('Password must be at least 6 characters.');
    if (password !== confirmPassword) return setError('Passwords do not match.');
    try {
      setLoading(true);
      await register({ name, email, phone, password });
      navigate('/menu');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #FFF8F0 0%, #FFFDF9 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1rem' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Link to="/" className="brand-logo" style={{ display: 'inline-flex', justifyContent: 'center' }}>
            <div className="logo-icon">🌿</div>
            <div>Spice <span className="highlight">Garden</span></div>
          </Link>
        </div>

        <div style={{ background: '#ffffff', borderRadius: '20px', padding: '2.5rem', boxShadow: '0 8px 30px rgba(0,0,0,0.08)', border: '1px solid #F1F5F9' }}>
          <div style={{ marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '0.35rem' }}>Create Account</h1>
            <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Join Spice Garden Bangalore – Order authentic Indian cuisine</p>
          </div>

          {error && (
            <div style={{ background: '#FEF2F2', border: '1px solid #FECDD3', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#B91C1C', fontSize: '0.88rem' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-name">Full Name</label>
              <input id="reg-name" name="name" type="text" className="form-input" placeholder="e.g. Rahul Sharma" value={formData.name} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-email">Email Address</label>
              <input id="reg-email" name="email" type="email" className="form-input" placeholder="you@example.com" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-phone">Mobile Number (10-digit)</label>
              <input id="reg-phone" name="phone" type="tel" className="form-input" placeholder="e.g. 9845012345" value={formData.phone} onChange={handleChange} maxLength={10} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-password">Password (min 6 characters)</label>
              <div style={{ position: 'relative' }}>
                <input id="reg-password" name="password" type={showPassword ? 'text' : 'password'} className="form-input" placeholder="Create a strong password" value={formData.password} onChange={handleChange} style={{ paddingRight: '2.75rem' }} />
                <button type="button" onClick={() => setShowPassword(!showPassword)} style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="reg-confirm">Confirm Password</label>
              <input id="reg-confirm" name="confirmPassword" type="password" className="form-input" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <button id="register-submit-btn" type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem', padding: '0.875rem' }} disabled={loading}>
              {loading ? 'Creating Account...' : (<><UserPlus size={18} /> Create My Account</>)}
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.9rem', color: '#64748B' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#E65100', fontWeight: 700 }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
