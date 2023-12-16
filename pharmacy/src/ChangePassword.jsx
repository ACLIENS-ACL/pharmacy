import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Footer from './Footer';
import Nav from './Nav';
import 'bootstrap/dist/css/bootstrap.min.css';
// import 'https://fonts.googleapis.com/css?family=Rubik:400,700|Crimson+Text:400,400i';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// /* Add your custom stylesheets here */
// import './fonts/icomoon/style.css';
// import './styles/bootstrap.min.css';
// import './styles/magnific-popup.css';
// import './styles/jquery-ui.css';
// import './styles/aos.css';
import './styles/style.css';

function ChangePasswo() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [currentpass, setcurrentpass] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('patientToken');

  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    if (token == null ) {
      navigate('/login');
    }
  }, [token, navigate]);
  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  const handleChangePassword = () => {
    setError(''); // Reset any previous errors
    setSuccessMessage('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password does not meet the criteria.');
      return;
    }

    if (currentPassword !== currentpass) {
      setError('Current Password is not correct');
      return;
    }

    if (currentPassword == newPassword) {
      setError('Please chose a new password');
      return;
    }

    axios
      .post('http://localhost:3002/update-password', {
        password: newPassword
      }, { headers })
      .then((response) => {
        console.log("hi")
        console.log(response.data.message)
        console.log(response.message)
        setSuccessMessage(response.data.message);
      })
      .catch((error) => {
        setError('Current password is incorrect. Please try again.');
        console.error('Error updating password:', error);
      });
  };

  useEffect(() => {
    console.log("hiii")
    // Fetch cart items and user data from the server
    axios.get('http://localhost:3002/change-password', { headers })
      .then((response) => {
        console.log("hello hi")
        const responseData = response.data;
        setcurrentpass(responseData.patientRequests.password);
      })
      .catch((error) => {
        console.error('Error fetching user data:', error);
      });
  });

  return (
    <div >
      <Nav />
      <div className="container-fluid">
        <div className="container mt-5" style={{ marginBottom: "50px" }}>
          <div className="card w-50 mx-auto p-4">
            {error && <div className="alert alert-danger">{error}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}
            <h2 className="mb-4">Change Password</h2>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <input
                type="password"
                className="form-control"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <button onClick={handleChangePassword} className="btn btn-primary"
            >
              Change Password
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ChangePasswo;
