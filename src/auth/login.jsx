import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, AlertCircle, CheckCircle, Phone } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './style.css'; // Make sure the CSS I provided earlier is here

const AuthPage = () => {
  const navigate = useNavigate();
  const { login, signup } = useContext(AuthContext);

  // 1. Sliding Logic State
  const [isToggled, setIsToggled] = useState(false);
  
  // 2. Form Data State (Combined for both forms)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    phoneNumber: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [otpVerified, setOtpVerified] = useState(false);
  const [loginWithOtp, setLoginWithOtp] = useState(false);
  const [signupOtpSent, setSignupOtpSent] = useState(false);
  const [signupOtp, setSignupOtp] = useState('');
  const [signupGeneratedOtp, setSignupGeneratedOtp] = useState('');
  const [signupOtpVerified, setSignupOtpVerified] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleToggle = (e) => {
    e.preventDefault();
    setIsToggled(!isToggled);
    setMessage({ type: '', text: '' }); // Clear messages on switch
    setOtpSent(false);
    setOtp('');
    setOtpVerified(false);
  };

  const sendLoginOtp = async () => {
    if (!formData.username || formData.username.length !== 10) {
      setMessage({ type: 'error', text: 'Enter valid 10-digit phone number' });
      return;
    }

    setLoading(true);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(otpCode);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formData.username, otp: otpCode }),
      });
      
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to send OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send OTP' });
    }
    setLoading(false);
  };

  const sendSignupOtp = async () => {
    if (!formData.phoneNumber || formData.phoneNumber.length !== 10) {
      setMessage({ type: 'error', text: 'Enter valid 10-digit phone number' });
      return;
    }

    setLoading(true);
    const otpCode = Math.floor(1000 + Math.random() * 9000).toString();
    setSignupGeneratedOtp(otpCode);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: formData.phoneNumber, otp: otpCode }),
      });
      
      const data = await response.json();
      if (data.success) {
        setSignupOtpSent(true);
        setMessage({ type: 'success', text: 'OTP sent!' });
      } else {
        setMessage({ type: 'error', text: 'Failed to send OTP' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to send OTP' });
    }
    setLoading(false);
  };

  const verifyLoginOtp = async () => {
    if (otp === generatedOtp) {
      setOtpVerified(true);
      setMessage({ type: 'success', text: 'OTP verified! Logging in...' });
      
      // Auto login after OTP verification
      setLoading(true);
      const result = await login(formData.username, 'otp-verified');
      if (result.success) {
        setMessage({ type: 'success', text: 'Login successful!' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
      setLoading(false);
    } else {
      setMessage({ type: 'error', text: 'Invalid OTP' });
    }
  };

  const verifySignupOtp = () => {
    if (signupOtp === signupGeneratedOtp) {
      setSignupOtpVerified(true);
      setMessage({ type: 'success', text: 'Phone verified!' });
    } else {
      setMessage({ type: 'error', text: 'Invalid OTP' });
    }
  };

  const handleSubmit = async (e, mode) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    if (mode === 'signin') {
      if (loginWithOtp && !otpVerified) {
        setMessage({ type: 'error', text: 'Please verify OTP first' });
        setLoading(false);
        return;
      }
      
      if (!loginWithOtp) {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          setMessage({ type: 'success', text: 'Login successful!' });
          setTimeout(() => navigate('/'), 1500);
        } else {
          setMessage({ type: 'error', text: result.message });
        }
      }
    } else {
      if (!signupOtpVerified) {
        setMessage({ type: 'error', text: 'Verify phone first' });
        setLoading(false);
        return;
      }
      
      const result = await signup(
        formData.email,
        formData.password,
        formData.password,
        formData.username,
        formData.phoneNumber
      );
      
      if (result.success) {
        setMessage({ type: 'success', text: 'Account created!' });
        setTimeout(() => navigate('/'), 1500);
      } else {
        setMessage({ type: 'error', text: result.message });
      }
    }
    setLoading(false);
  };

  return (
    <div className="auth-page-root">

      {/* Dynamic Class triggers your CSS animations */}
      <div className={`auth-wrapper ${isToggled ? 'toggled' : ''}`}>
      <img src="logo.png" alt="FinoNest Logo" className="top-logo" />
        <div className="background-shape"></div>
        <div className="secondary-shape"></div>

        {/* --- SIGN IN PANEL --- */}
        <div className="credentials-panel signin">
          <h2 className="slide-element head">Login</h2>
          
          {message.text && !isToggled && (
            <div className={`message-banner ${message.type}`}>
               {message.text}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, 'signin')}>
            <div className="field-wrapper slide-element">
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
              <label>{loginWithOtp ? 'Phone Number' : 'Email or Phone Number'}</label>
              <User className="field-icon" size={18} />
            </div>

            {!loginWithOtp && (
              <div className="field-wrapper slide-element">
                <input 
                  type="password" 
                  name="password" 
                  value={formData.password} 
                  onChange={handleChange} 
                  required 
                />
                <label>Password</label>
                <Lock className="field-icon" size={18} />
              </div>
            )}

            {loginWithOtp && !otpSent && (
              <div className="field-wrapper slide-element">
                <button type="button" className="submit-button" onClick={sendLoginOtp} disabled={loading}>
                  Send OTP
                </button>
              </div>
            )}

            {loginWithOtp && otpSent && !otpVerified && (
              <div className="field-wrapper slide-element">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={otp} 
                    onChange={(e) => setOtp(e.target.value)}
                    maxLength="4"
                    placeholder="Enter OTP"
                    style={{ flex: 1 }}
                  />
                  <button type="button" onClick={verifyLoginOtp} disabled={otp.length !== 4 || loading} style={{ padding: '8px 16px', fontSize: '14px' }}>
                    {loading ? 'Verifying...' : 'Verify'}
                  </button>
                </div>
              </div>
            )}

            {!loginWithOtp && (
              <div className="field-wrapper slide-element">
                <button className="submit-button" type="submit" disabled={loading}>
                  {loading ? 'Processing...' : 'Login'}
                </button>
              </div>
            )}

            <div className="switch-link slide-element">
              <a href="#" onClick={(e) => { e.preventDefault(); setLoginWithOtp(!loginWithOtp); setOtpSent(false); setOtp(''); setOtpVerified(false); }}>
                {loginWithOtp ? 'Login with Password' : 'Login with OTP'}
              </a>
            </div>

            <div className="switch-link slide-element">
              <p>Don't have an account? <br /> 
                <a href="#" onClick={handleToggle}>Sign Up</a>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section signin">
          <h2 className="slide-element wel">WELCOME<br/>BACK!</h2>
        </div>

        {/* --- SIGN UP PANEL --- */}
        <div className="credentials-panel signup">
          <h2 className="slide-element head">Register</h2>
          <form onSubmit={(e) => handleSubmit(e, 'signup')}>
            <div className="field-wrapper slide-element">
              <input 
                type="text" 
                name="username" 
                value={formData.username} 
                onChange={handleChange} 
                required 
              />
              <label>Username</label>
              <User className="field-icon" size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
              <label>Email</label>
              <Mail className="field-icon" size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input 
                    type="tel" 
                    name="phoneNumber" 
                    className='phone'
                    value={formData.phoneNumber} 
                    onChange={handleChange}
                    maxLength="10"
                    disabled={signupOtpVerified}
                    required 
                  />  
                  <label>Phone Number</label>
                  <Phone className="field-icon" size={18} />
                </div>
                {!signupOtpVerified && (
                  <button 
                    type="button" 
                    onClick={sendSignupOtp}
                    disabled={loading || !formData.phoneNumber}
                    style={{ padding: '8px 16px', fontSize: '14px', whiteSpace: 'nowrap' }}
                  >
                    {signupOtpSent ? 'Resend' : 'Send OTP'}
                  </button>
                )}
              </div>
            </div>

            {signupOtpSent && !signupOtpVerified && (
              <div className="field-wrapper slide-element">
                <div style={{ display: 'flex', gap: '8px' }}>
                  <div style={{ position: 'relative', flex: 1 }}>
                    <input 
                      type="text" 
                      value={signupOtp} 
                      
                      onChange={(e) => setSignupOtp(e.target.value)}
                      maxLength="4"
                      placeholder="Enter 4-digit OTP"
                      required 
                    />
                  </div>
                  <button 
                    type="button" 
                    onClick={verifySignupOtp}
                    disabled={loading || signupOtp.length !== 4}
                    style={{ padding: '8px 16px', fontSize: '14px', backgroundColor: '#10b981' }}
                  >
                    Verify
                  </button>
                </div>
              </div>
            )}

            <div className="field-wrapper slide-element">
              <input 
                type="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
              <label>Password</label>
              <Lock className="field-icon" size={18} />
            </div>

            <div className="field-wrapper slide-element">
              <button className="submit-button" type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Register'}
              </button>
            </div>

            <div className="switch-link slide-element">
              <p>Already have an account? <br /> 
                <a href="#" style={{color: 'black'}} onClick={handleToggle}>Sign In</a>
              </p>
            </div>
          </form>
        </div>

        <div className="welcome-section signup">
          <h2 className="slide-element wel">WELCOME!</h2>
          {message.text && isToggled && (
            <div className={`message-banner ${message.type}`}>
               {message.text}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;