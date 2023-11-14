import React, { useState } from 'react';
import axios from 'axios';

const containerStyle = {
  maxWidth: '400px',
  margin: 'auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '15px',
  border: '1px solid #ccc',
  borderRadius: '3px',
};

const buttonStyle = {
  width: '100%',
  padding: '12px',
  background: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

const messageStyle = {
  marginTop: '15px',
  color: 'green',
};

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);


  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
};

  const requestOTP = () => {
    axios
      .post('http://localhost:3001/send-otp', { username: email })
      .then((response) => {
        setMessage(response.data.message);
      })
      .catch((error) => {
        setMessage('Error requesting OTP: ' + error.message);
      });
  };

  const resetPassword = () => {
    if (!validatePassword(newPassword)) {
      setMessage('Password must contain at least one lowercase letter, one uppercase letter, one special character, and one number. It should be at least 8 characters long.');
        return;
    }
    axios
      .post('http://localhost:3001/verify-otp', { username: email, otp })
      .then((response) => {
        if (response.status === 200) {
          axios
            .post('http://localhost:3001/reset-password', { email, password: newPassword })
            .then((resetResponse) => {
              setMessage(resetResponse.data.message);
              setResetSuccess(true);
            })
            .catch((resetError) => {
              setMessage('Error resetting password: ' + resetError.message);
            });
        } else {
          setMessage('Invalid OTP');
        }
      })
      .catch((error) => {
        setMessage('Error verifying OTP: ' + error.message);
      });
  };

  return (
    <div style={containerStyle}>
      <h2>Password Reset</h2>
      <div>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={inputStyle}
        />
      </div>
      <button onClick={requestOTP} style={buttonStyle}>
        Request OTP
      </button>
      <div>
        <input
          type="text"
          placeholder="OTP"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          style={inputStyle}
        />
      </div>
      <div>
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          style={inputStyle}
        />
      </div>
      <button onClick={resetPassword} style={buttonStyle}>
        Reset Password
      </button>
      {message && <p style={messageStyle}>{message}</p>}
      {resetSuccess && <p style={messageStyle}>Password reset successfully.</p>}
    </div>
  );
}

export default ResetPassword;
