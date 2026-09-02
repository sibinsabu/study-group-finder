import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, CheckCircle2, ArrowRight, User as UserIcon, AlertCircle, X, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface AuthCardProps {
  initialMode?: 'login' | 'register';
  onSuccessRedirect?: string;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  initialMode = 'login',
  onSuccessRedirect = '/dashboard'
}) => {
  const navigate = useNavigate();
  const { login, register } = useAuth();

  const [isRegisterMode, setIsRegisterMode] = useState(initialMode === 'register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Social Auth Modal Popup State
  const [socialModalProvider, setSocialModalProvider] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (isRegisterMode && password !== confirmPassword) {
      setStatusMessage({
        type: 'error',
        text: 'Passwords do not match. Please re-enter your password correctly.'
      });
      return;
    }

    setIsLoading(true);
    setStatusMessage(null);

    try {
      if (isRegisterMode) {
        // Register flow -> MongoDB
        const res = await register(name || 'Student', email, password);
        if (res.success) {
          setStatusMessage({
            type: 'success',
            text: res.message || 'Registration successful! Redirecting to your Dashboard...'
          });
          setTimeout(() => {
            navigate(onSuccessRedirect);
          }, 800);
        } else {
          setStatusMessage({
            type: 'error',
            text: res.message || 'Registration failed. Please try again.'
          });
          setIsLoading(false);
        }
      } else {
        // Login flow -> MongoDB
        const res = await login(email, password);
        if (res.success) {
          setStatusMessage({
            type: 'success',
            text: res.message || 'Login successful! Redirecting to Dashboard...'
          });
          setTimeout(() => {
            navigate(onSuccessRedirect);
          }, 600);
        } else {
          setStatusMessage({
            type: 'error',
            text: res.message || 'Invalid email or password.'
          });
          setIsLoading(false);
        }
      }
    } catch {
      setStatusMessage({
        type: 'error',
        text: 'Authentication server unavailable. Please check your backend connection.'
      });
      setIsLoading(false);
    }
  };

  const handleSocialClick = (provider: 'Google' | 'GitHub') => {
    setSocialModalProvider(provider);
  };

  return (
    <>
      <div style={{
        width: '100%',
        maxWidth: '840px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '24px',
        boxShadow: '0 25px 60px -15px rgba(11, 26, 48, 0.2), 0 0 0 1px rgba(226, 232, 240, 0.9)',
        overflow: 'hidden',
        display: 'grid',
        gridTemplateColumns: '260px 1fr',
        border: '1px solid #e2e8f0'
      }}>
        {/* Left Side: Brand Panel */}
        <div style={{
          background: 'linear-gradient(145deg, #f8fafc 0%, #edf2f7 100%)',
          borderRight: '1px solid #e2e8f0',
          padding: '36px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Subtle grid in brand card */}
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'linear-gradient(to right, rgba(203, 213, 225, 0.3) 1px, transparent 1px), linear-gradient(to bottom, rgba(203, 213, 225, 0.3) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
            opacity: 0.6,
            pointerEvents: 'none'
          }} />

          <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Logo Emblem Icon */}
            <div style={{
              width: '84px',
              height: '84px',
              borderRadius: '22px',
              backgroundColor: '#0b1a30',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 28px rgba(11, 26, 48, 0.25)',
              marginBottom: '16px',
              transform: 'rotate(-4deg)',
              transition: 'transform 0.3s ease'
            }}>
              <span style={{
                color: '#ffffff',
                fontFamily: "'Outfit', sans-serif",
                fontWeight: 900,
                fontSize: '42px',
                lineHeight: 1,
                letterSpacing: '-1px'
              }}>
                S
              </span>
            </div>

            <h3 style={{
              fontFamily: "'Outfit', sans-serif",
              fontWeight: 800,
              fontSize: '20px',
              letterSpacing: '1px',
              color: '#0b1a30',
              marginBottom: '6px'
            }}>
              STUDYSPHERE
            </h3>
            <p style={{
              fontSize: '12px',
              color: '#64748b',
              fontWeight: 500,
              lineHeight: 1.4
            }}>
              Collaborative Study & Peer Performance Platform
            </p>
          </div>

          {/* Card Bottom Switch Link */}
          <div style={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
            paddingTop: '16px',
            borderTop: '1px solid #e2e8f0',
            marginTop: '20px'
          }}>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(!isRegisterMode);
                setStatusMessage(null);
                setConfirmPassword('');
              }}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: '#0b1a30',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              {isRegisterMode ? (
                <>Already a member? <span style={{ color: '#eb5757', textDecoration: 'underline' }}>Sign In</span></>
              ) : (
                <>Need an account? <span style={{ color: '#eb5757', textDecoration: 'underline' }}>Register</span></>
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div style={{
          padding: '36px 40px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '20px' }}>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans', var(--font-heading), sans-serif",
              fontSize: '22px',
              fontWeight: 700,
              color: '#0b1a30',
              marginBottom: '6px'
            }}>
              Join or Login to Your Study Circle
            </h2>
            <p style={{ fontSize: '14px', color: '#64748b' }}>
              {isRegisterMode
                ? 'Create your verified student account saved in MongoDB.'
                : 'Enter your credentials to access your peer learning circles.'}
            </p>
          </div>

          {/* Tab switch pills */}
          <div style={{
            display: 'flex',
            background: '#f1f5f9',
            padding: '4px',
            borderRadius: '10px',
            marginBottom: '20px',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(false);
                setStatusMessage(null);
                setConfirmPassword('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                backgroundColor: !isRegisterMode ? '#ffffff' : 'transparent',
                color: !isRegisterMode ? '#0b1a30' : '#64748b',
                boxShadow: !isRegisterMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => {
                setIsRegisterMode(true);
                setStatusMessage(null);
                setConfirmPassword('');
              }}
              style={{
                flex: 1,
                padding: '8px 12px',
                border: 'none',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s',
                backgroundColor: isRegisterMode ? '#ffffff' : 'transparent',
                color: isRegisterMode ? '#0b1a30' : '#64748b',
                boxShadow: isRegisterMode ? '0 2px 6px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              Register
            </button>
          </div>

          {statusMessage && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              backgroundColor: statusMessage.type === 'success' ? '#ecfdf5' : '#fef2f2',
              border: `1px solid ${statusMessage.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
              borderRadius: '10px',
              color: statusMessage.type === 'success' ? '#065f46' : '#991b1b',
              fontSize: '13px',
              fontWeight: 500,
              marginBottom: '16px'
            }}>
              {statusMessage.type === 'success' ? (
                <CheckCircle2 size={16} color="#10b981" />
              ) : (
                <AlertCircle size={16} color="#ef4444" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Full Name for Registration */}
            {isRegisterMode && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px'
                }}>
                  Full Name
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <UserIcon size={16} color="#64748b" style={{ marginRight: '10px', flexShrink: 0 }} />
                  <input
                    type="text"
                    required
                    placeholder="e.g. Alex Johnson"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                </div>
              </div>
            )}

            {/* University Email Input */}
            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: 600,
                color: '#334155',
                marginBottom: '6px'
              }}>
                University Email
              </label>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <Mail size={16} color="#64748b" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '6px'
              }}>
                <label style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155'
                }}>
                  {isRegisterMode ? 'Set Password (min. 6 chars)' : 'Password'}
                </label>
                {!isRegisterMode && (
                  <button
                    type="button"
                    onClick={() => alert('Password reset link sent to your university email!')}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: 0,
                      fontSize: '12px',
                      color: '#64748b',
                      cursor: 'pointer',
                      fontWeight: 500
                    }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#0b1a30')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#64748b')}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '10px',
                padding: '10px 14px'
              }}>
                <Lock size={16} color="#64748b" style={{ marginRight: '10px', flexShrink: 0 }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder={isRegisterMode ? 'Create a secure password' : 'Enter your password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete={isRegisterMode ? 'new-password' : 'current-password'}
                  style={{
                    border: 'none',
                    background: 'transparent',
                    width: '100%',
                    fontSize: '14px',
                    color: '#0f172a',
                    outline: 'none',
                    fontFamily: 'inherit'
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: '0',
                    cursor: 'pointer',
                    color: '#64748b',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Re-enter Password Input (Registration Mode Only) */}
            {isRegisterMode && (
              <div>
                <label style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  marginBottom: '6px'
                }}>
                  Re-enter Password
                </label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  background: '#f8fafc',
                  border: `1px solid ${confirmPassword && password !== confirmPassword ? '#f87171' : '#cbd5e1'}`,
                  borderRadius: '10px',
                  padding: '10px 14px'
                }}>
                  <Lock size={16} color="#64748b" style={{ marginRight: '10px', flexShrink: 0 }} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    minLength={6}
                    placeholder="Re-enter your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    style={{
                      border: 'none',
                      background: 'transparent',
                      width: '100%',
                      fontSize: '14px',
                      color: '#0f172a',
                      outline: 'none',
                      fontFamily: 'inherit'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '0',
                      cursor: 'pointer',
                      color: '#64748b',
                      display: 'flex',
                      alignItems: 'center'
                    }}
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {confirmPassword && password !== confirmPassword && (
                  <span style={{ fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block', fontWeight: 500 }}>
                    Passwords do not match
                  </span>
                )}
              </div>
            )}

            {/* Primary Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              style={{
                marginTop: '6px',
                width: '100%',
                padding: '12px',
                backgroundColor: '#0b1a30',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                fontSize: '15px',
                fontWeight: 600,
                fontFamily: 'inherit',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 12px rgba(11, 26, 48, 0.25)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                if (!isLoading) {
                  e.currentTarget.style.backgroundColor = '#162b4c';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#0b1a30';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {isLoading ? (
                'Connecting to MongoDB...'
              ) : isRegisterMode ? (
                <>Register & Go to Dashboard <ArrowRight size={16} /></>
              ) : (
                <>Sign In <ArrowRight size={16} /></>
              )}
            </button>

            {/* Subtle Divider */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '2px 0',
              gap: '12px'
            }}>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
              <span style={{ fontSize: '12px', color: '#94a3b8', textTransform: 'lowercase' }}>or continue with</span>
              <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
            </div>

            {/* Social Logins */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button
                type="button"
                onClick={() => handleSocialClick('Google')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                Google
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick('GitHub')}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  padding: '9px 14px',
                  background: '#ffffff',
                  border: '1px solid #cbd5e1',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#334155',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  transition: 'all 0.15s ease'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#f8fafc';
                  e.currentTarget.style.borderColor = '#94a3b8';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = '#ffffff';
                  e.currentTarget.style.borderColor = '#cbd5e1';
                }}
              >
                <svg width="16" height="16" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                </svg>
                GitHub
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Social Login Unavailable Popup Modal */}
      {socialModalProvider && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(11, 26, 48, 0.65)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '24px',
            padding: '36px',
            maxWidth: '460px',
            width: '100%',
            boxShadow: '0 25px 60px -10px rgba(11, 26, 48, 0.35), 0 0 0 1px rgba(226, 232, 240, 0.8)',
            position: 'relative',
            textAlign: 'center'
          }}>
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSocialModalProvider(null)}
              style={{
                position: 'absolute',
                top: '18px',
                right: '18px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: '50%',
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: '#64748b',
                transition: 'background-color 0.15s, color 0.15s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = '#e2e8f0';
                e.currentTarget.style.color = '#0b1a30';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '#f1f5f9';
                e.currentTarget.style.color = '#64748b';
              }}
            >
              <X size={16} />
            </button>

            {/* Icon Badge */}
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '20px',
              backgroundColor: '#eff6ff',
              border: '1px solid #bfdbfe',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px auto',
              color: '#2563eb'
            }}>
              <Info size={30} />
            </div>

            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', var(--font-heading), sans-serif",
              fontSize: '22px',
              fontWeight: 800,
              color: '#0b1a30',
              marginBottom: '10px'
            }}>
              {socialModalProvider} Sign-In Unavailable
            </h3>

            <p style={{
              fontSize: '14px',
              color: '#64748b',
              lineHeight: 1.55,
              marginBottom: '28px'
            }}>
              Direct authentication via <strong>{socialModalProvider}</strong> is currently under development. Please register or sign in using your <strong>University Email</strong> and password to access your StudySphere circles.
            </p>

            <button
              type="button"
              onClick={() => setSocialModalProvider(null)}
              style={{
                width: '100%',
                padding: '12px 24px',
                backgroundColor: '#0b1a30',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: 600,
                cursor: 'pointer',
                fontFamily: 'inherit',
                boxShadow: '0 4px 14px rgba(11, 26, 48, 0.25)',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#162b4c')}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#0b1a30')}
            >
              Continue with University Email
            </button>
          </div>
        </div>
      )}
    </>
  );
};
