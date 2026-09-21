import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import adminApi from '../api/adminApi';
import { ShieldCheck, Lock, Mail, Eye, EyeOff, LogIn, ChefHat, KeyRound, CheckCircle2, X, Send, Check, Sparkles, RefreshCw } from 'lucide-react';

const AdminLoginPage = () => {
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Forgot password OTP modal state
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('admin@spicegarden.com');
  const [otpCode, setOtpCode] = useState('');
  const [generatedDemoOtp, setGeneratedDemoOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [showForgotNewPass, setShowForgotNewPass] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleOpenForgotModal = () => {
    setShowForgotModal(true);
    setForgotEmail(formData.email || 'admin@spicegarden.com');
    setOtpCode('');
    setGeneratedDemoOtp('');
    setOtpSent(false);
    setOtpVerified(false);
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotError('');
    setForgotSuccess('');
  };

  const handleCloseForgotModal = () => {
    setShowForgotModal(false);
    setForgotError('');
    setForgotSuccess('');
  };

  const handleUseDefault = () => {
    setFormData({
      email: 'admin@spicegarden.com',
      password: 'Admin@123',
    });
    setError('');
    setShowForgotModal(false);
  };

  // Step 1: Generate & Send OTP to admin email
  const handleGenerateOtp = async () => {
    if (!forgotEmail) {
      setForgotError('Please enter your admin email address.');
      return;
    }
    try {
      setOtpLoading(true);
      setForgotError('');
      setForgotSuccess('');
      const res = await adminApi.post('/auth/send-otp', { email: forgotEmail });
      setOtpSent(true);
      setOtpVerified(false);
      setGeneratedDemoOtp(res.data.otp || '');
      setForgotSuccess(res.data.message || `OTP sent to ${forgotEmail}`);
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || 'Failed to generate OTP.');
    } finally {
      setOtpLoading(false);
    }
  };

  // Step 2: Match and Verify OTP
  const handleVerifyOtp = async (e) => {
    if (e) e.preventDefault();
    if (!otpCode || otpCode.trim().length !== 6) {
      setForgotError('Please enter the 6-digit OTP code.');
      return;
    }
    try {
      setVerifyLoading(true);
      setForgotError('');
      setForgotSuccess('');
      const res = await adminApi.post('/auth/verify-otp', {
        email: forgotEmail,
        otp: otpCode.trim(),
      });
      setOtpVerified(true);
      setForgotSuccess(res.data.message || 'OTP matched! You may now set your new password.');
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || 'Invalid or expired OTP code.');
    } finally {
      setVerifyLoading(false);
    }
  };

  // Step 3: Save New Password after OTP is verified
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!otpVerified) {
      setForgotError('Please verify your OTP code before setting a new password.');
      return;
    }
    if (!forgotNewPassword) {
      setForgotError('Please enter your new password.');
      return;
    }
    if (forgotNewPassword.length < 6) {
      setForgotError('New password must be at least 6 characters long.');
      return;
    }
    if (forgotConfirmPassword && forgotNewPassword !== forgotConfirmPassword) {
      setForgotError('Passwords do not match. Please re-enter.');
      return;
    }

    try {
      setForgotLoading(true);
      setForgotError('');
      setForgotSuccess('');

      const res = await adminApi.post('/auth/reset-password-otp', {
        email: forgotEmail,
        otp: otpCode.trim(),
        newPassword: forgotNewPassword,
      });

      setForgotSuccess(res.data.message || 'Password reset successfully!');
      setFormData({
        email: forgotEmail,
        password: forgotNewPassword,
      });

      setTimeout(() => {
        handleCloseForgotModal();
        setForgotSuccess('');
        setForgotNewPassword('');
        setForgotConfirmPassword('');
      }, 1500);
    } catch (err) {
      setForgotError(err.response?.data?.message || err.message || 'Failed to reset password.');
    } finally {
      setForgotLoading(false);
    }
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
      console.error('Login error:', err);
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please verify your admin credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0F172A',
        padding: '1.5rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Brand Header */}
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
          <h1 style={{ color: '#F8FAFC', fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.02em', margin: 0 }}>
            Spice Garden Admin
          </h1>
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#CBD5E1' }}>
                  Password
                </label>
                <button
                  type="button"
                  onClick={handleOpenForgotModal}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#10B981',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot Password?
                </button>
              </div>
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
        </div>

        {/* Forgot Password OTP Modal */}
        {showForgotModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              backgroundColor: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
              padding: '1.25rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#1E293B',
                border: '1px solid #334155',
                borderRadius: '18px',
                padding: '1.75rem',
                width: '100%',
                maxWidth: '460px',
                color: '#FFFFFF',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)',
                maxHeight: '90vh',
                overflowY: 'auto',
              }}
            >
              {/* Modal Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <KeyRound size={22} color="#10B981" />
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#F8FAFC' }}>
                      Reset Admin Password
                    </h3>
                    <p style={{ fontSize: '0.75rem', color: '#94A3B8', margin: '2px 0 0 0' }}>
                      Verify your admin email with OTP to set a new password
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleCloseForgotModal}
                  style={{
                    background: 'rgba(51, 65, 85, 0.5)',
                    border: 'none',
                    color: '#94A3B8',
                    cursor: 'pointer',
                    padding: '6px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              {/* Step Progress Bar */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0F172A',
                  padding: '6px 8px',
                  borderRadius: '10px',
                  marginBottom: '1.25rem',
                  border: '1px solid #334155',
                  fontSize: '0.72rem',
                }}
              >
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    backgroundColor: otpSent ? 'rgba(16, 185, 129, 0.2)' : 'rgba(56, 189, 248, 0.2)',
                    color: otpSent ? '#34D399' : '#38BDF8',
                    fontWeight: 700,
                  }}
                >
                  1. Email OTP
                </div>
                <span style={{ color: '#475569' }}>→</span>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    backgroundColor: otpVerified ? 'rgba(16, 185, 129, 0.2)' : otpSent ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    color: otpVerified ? '#34D399' : otpSent ? '#38BDF8' : '#64748B',
                    fontWeight: otpSent ? 700 : 500,
                  }}
                >
                  2. Match OTP
                </div>
                <span style={{ color: '#475569' }}>→</span>
                <div
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '4px',
                    borderRadius: '6px',
                    backgroundColor: otpVerified ? 'rgba(56, 189, 248, 0.2)' : 'transparent',
                    color: otpVerified ? '#38BDF8' : '#64748B',
                    fontWeight: otpVerified ? 700 : 500,
                  }}
                >
                  3. New Password
                </div>
              </div>

              {/* Default Master Shortcut */}
              <div
                style={{
                  backgroundColor: '#0F172A',
                  border: '1px dashed #334155',
                  borderRadius: '8px',
                  padding: '0.65rem 0.85rem',
                  marginBottom: '1rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: '0.76rem', color: '#94A3B8' }}>
                  Default admin: <span style={{ color: '#34D399', fontWeight: 600 }}>Admin@123</span>
                </div>
                <button
                  type="button"
                  onClick={handleUseDefault}
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    color: '#10B981',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '5px',
                    padding: '0.25rem 0.55rem',
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  Auto-Fill Login
                </button>
              </div>

              {forgotError && (
                <div
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.15)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1rem',
                    color: '#FCA5A5',
                    fontSize: '0.82rem',
                  }}
                >
                  ⚠️ {forgotError}
                </div>
              )}

              {forgotSuccess && (
                <div
                  style={{
                    backgroundColor: 'rgba(16, 185, 129, 0.15)',
                    border: '1px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '8px',
                    padding: '0.65rem 0.85rem',
                    marginBottom: '1rem',
                    color: '#6EE7B7',
                    fontSize: '0.82rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CheckCircle2 size={16} />
                  <span>{forgotSuccess}</span>
                </div>
              )}

              {/* STEP 1: Admin Email & Generate OTP */}
              <div style={{ marginBottom: '1.1rem' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '5px' }}>
                  Step 1: Admin Email
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <Mail size={16} style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      disabled={otpVerified}
                      placeholder="admin@spicegarden.com"
                      style={{
                        width: '100%',
                        padding: '0.65rem 0.75rem 0.65rem 2.4rem',
                        backgroundColor: '#0F172A',
                        border: '1px solid #334155',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '0.85rem',
                        outline: 'none',
                        opacity: otpVerified ? 0.7 : 1,
                      }}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={otpLoading || otpVerified}
                    style={{
                      backgroundColor: otpSent ? 'rgba(56, 189, 248, 0.15)' : '#059669',
                      color: otpSent ? '#38BDF8' : '#FFFFFF',
                      border: otpSent ? '1px solid rgba(56, 189, 248, 0.3)' : 'none',
                      borderRadius: '8px',
                      padding: '0.65rem 0.9rem',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: otpVerified ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {otpLoading ? (
                      'Generating...'
                    ) : otpSent ? (
                      <>
                        <RefreshCw size={14} /> Resend OTP
                      </>
                    ) : (
                      <>
                        <Send size={14} /> Generate OTP
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Instant preview helper badge for generated OTP */}
              {otpSent && generatedDemoOtp && (
                <div
                  style={{
                    backgroundColor: 'rgba(56, 189, 248, 0.1)',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    borderRadius: '8px',
                    padding: '0.6rem 0.85rem',
                    marginBottom: '1.1rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.72rem', color: '#94A3B8', display: 'block' }}>Generated OTP Code:</span>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#38BDF8', letterSpacing: '2px', fontFamily: 'monospace' }}>
                      {generatedDemoOtp}
                    </span>
                  </div>
                  {!otpVerified && (
                    <button
                      type="button"
                      onClick={() => setOtpCode(generatedDemoOtp)}
                      style={{
                        backgroundColor: '#38BDF8',
                        color: '#0F172A',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '0.35rem 0.65rem',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Fill OTP
                    </button>
                  )}
                </div>
              )}

              {/* STEP 2: Enter & Match OTP */}
              {otpSent && (
                <div
                  style={{
                    backgroundColor: otpVerified ? 'rgba(16, 185, 129, 0.08)' : '#0F172A',
                    border: otpVerified ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid #334155',
                    borderRadius: '10px',
                    padding: '0.85rem',
                    marginBottom: '1.1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontSize: '0.78rem', color: otpVerified ? '#34D399' : '#CBD5E1', fontWeight: 700 }}>
                      Step 2: Match OTP Code
                    </label>
                    {otpVerified && (
                      <span style={{ fontSize: '0.72rem', color: '#34D399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Check size={14} /> Matched & Verified
                      </span>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      disabled={otpVerified}
                      placeholder="6-digit OTP"
                      style={{
                        flex: 1,
                        padding: '0.65rem 0.85rem',
                        backgroundColor: '#1E293B',
                        border: '1px solid #475569',
                        borderRadius: '8px',
                        color: '#FFFFFF',
                        fontSize: '1rem',
                        fontWeight: 800,
                        letterSpacing: '4px',
                        textAlign: 'center',
                        fontFamily: 'monospace',
                        outline: 'none',
                        opacity: otpVerified ? 0.7 : 1,
                      }}
                    />
                    {!otpVerified && (
                      <button
                        type="button"
                        onClick={handleVerifyOtp}
                        disabled={verifyLoading || otpCode.length !== 6}
                        style={{
                          backgroundColor: otpCode.length === 6 ? '#10B981' : '#334155',
                          color: otpCode.length === 6 ? '#FFFFFF' : '#94A3B8',
                          border: 'none',
                          borderRadius: '8px',
                          padding: '0.65rem 1rem',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: otpCode.length === 6 ? 'pointer' : 'not-allowed',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {verifyLoading ? 'Matching...' : 'Match OTP'}
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* STEP 3: Enter New Password (GATED: Only visible once OTP is verified!) */}
              {otpVerified ? (
                <form onSubmit={handleResetSubmit} style={{ marginTop: '0.5rem' }}>
                  <div
                    style={{
                      backgroundColor: 'rgba(16, 185, 129, 0.08)',
                      border: '1px solid rgba(16, 185, 129, 0.25)',
                      borderRadius: '10px',
                      padding: '1rem',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '0.85rem' }}>
                      <CheckCircle2 size={18} color="#10B981" />
                      <span style={{ fontSize: '0.82rem', color: '#6EE7B7', fontWeight: 700 }}>
                        Step 3: Enter New Password
                      </span>
                    </div>

                    <div style={{ marginBottom: '0.85rem' }}>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '4px' }}>
                        Set New Password
                      </label>
                      <div style={{ position: 'relative' }}>
                        <input
                          type={showForgotNewPass ? 'text' : 'password'}
                          value={forgotNewPassword}
                          onChange={(e) => setForgotNewPassword(e.target.value)}
                          placeholder="At least 6 characters"
                          required
                          style={{
                            width: '100%',
                            padding: '0.65rem 2.4rem 0.65rem 0.85rem',
                            backgroundColor: '#0F172A',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            color: '#FFFFFF',
                            fontSize: '0.85rem',
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowForgotNewPass(!showForgotNewPass)}
                          style={{
                            position: 'absolute',
                            right: '0.75rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: '#64748B',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: 0,
                          }}
                        >
                          {showForgotNewPass ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontSize: '0.78rem', color: '#94A3B8', fontWeight: 600, marginBottom: '4px' }}>
                        Confirm New Password
                      </label>
                      <input
                        type={showForgotNewPass ? 'text' : 'password'}
                        value={forgotConfirmPassword}
                        onChange={(e) => setForgotConfirmPassword(e.target.value)}
                        placeholder="Re-enter new password"
                        required
                        style={{
                          width: '100%',
                          padding: '0.65rem 0.85rem',
                          backgroundColor: '#0F172A',
                          border: '1px solid #334155',
                          borderRadius: '8px',
                          color: '#FFFFFF',
                          fontSize: '0.85rem',
                        }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={handleCloseForgotModal}
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        backgroundColor: 'transparent',
                        border: '1px solid #334155',
                        color: '#94A3B8',
                        fontSize: '0.82rem',
                        fontWeight: 700,
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="admin-btn admin-btn-primary"
                      style={{
                        flex: 1.6,
                        padding: '0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                      }}
                    >
                      {forgotLoading ? 'Saving...' : 'Save New Password'}
                    </button>
                  </div>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={handleCloseForgotModal}
                    style={{
                      padding: '0.65rem 1.25rem',
                      borderRadius: '8px',
                      backgroundColor: 'transparent',
                      border: '1px solid #334155',
                      color: '#94A3B8',
                      fontSize: '0.82rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLoginPage;
