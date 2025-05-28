import React, { useState } from 'react';
import './Login.css';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'; // adjust path if needed
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();

  const [facultyId, setFacultyId] = useState('');
  const [password, setPassword] = useState('');
  const [showSignup, setShowSignup] = useState(false);
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, facultyId, password);
      navigate('/student-portal');
    } catch (err) {
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleSignup = async () => {
    setError('');
    if (signupPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      await createUserWithEmailAndPassword(auth, signupEmail, signupPassword);
      alert('Account created successfully!');
      setShowSignup(false);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      {/* HEADER */}
      <div className="header">
        <img src="/login-assets/uni-logo.png" alt="University Logo" className="uni-logo" />
        <span className="Univ">UNIVERSIDAD DE MANILA</span>
      </div>

      <div className="main-box">
        <div className="left-side">
          <img src="/login-assets/bubbles.png" alt="Bubbles" className="bubbles" />
          <img src="/login-assets/wc.png" alt="Welcome Logo" className="welcome" />
          <img src="/login-assets/leon.png" alt="Lion Logo" className="lion" />
          <img src="/login-assets/ln.png" alt="Line" className="line1" />
          <img src="/login-assets/ln2.png" alt="Line" className="line2" />
          <img src="/login-assets/page.png" alt="Page" className="page" />
          <p className="copyright">© 2025 MgaLigmaProduction</p>
        </div>

        <div className="right-side">
          <div className="container-lace">
            <img src="/login-assets/lace-left.png" alt="" className='Lleft' />
            <img src="/login-assets/lace-right.png" alt="" className='Lright' />
          </div>

          <div className="login-box">
            <h2 className="login-title">FACULTY LOGIN</h2>
            <img src="/login-assets/pc.png" alt="Group Photo" className="group-pic" />

            <label htmlFor="faculty-id">FACULTY ID</label>
            <input
              type="email"
              id="faculty-id"
              placeholder="Faculty Email..."
              value={facultyId}
              onChange={(e) => { setFacultyId(e.target.value); setError(''); }}
            />

            <label htmlFor="password">PASSWORD</label>
            <input
              type="password"
              id="password"
              placeholder="Password..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
            />

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

            <button type="button" className="sign-in" onClick={handleLogin}>SIGN IN</button>

            <p className="admin-link" onClick={() => setShowSignup(true)}>
              Don't have an account? <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Sign Up</span>
            </p>
          </div>
        </div>
      </div>

      {/* SIGNUP MODAL */}
      {showSignup && (
        <div className="signup-modal">
          <div className="signup-content">
            <h2>Faculty Sign Up</h2>

            <input
              type="email"
              placeholder="Email"
              value={signupEmail}
              onChange={(e) => { setSignupEmail(e.target.value); setError(''); }}
            />

            <input
              type="password"
              placeholder="Password"
              value={signupPassword}
              onChange={(e) => { setSignupPassword(e.target.value); setError(''); }}
            />

            <input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
            />

            {error && <p style={{ color: 'red', fontSize: '12px' }}>{error}</p>}

            <button type="button" onClick={handleSignup}>Register</button>
            <button type="button" onClick={() => setShowSignup(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
