import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ChangePassword() {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');
    const [currentpass, setcurrentpass] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('patientToken');
    const token1 = localStorage.getItem('adminToken');
    const token2 = localStorage.getItem('pharmacistToken');
    
  const headers = {
    Authorization: '',
  };
  if (token !== null) {
    headers.Authorization = `Bearer ${token}`;
  } else if (token1 !== null) {
    headers.Authorization = `Bearer ${token1}`;
  } else if (token2 !== null) {
    headers.Authorization = `Bearer ${token2}`;
  } 
    useEffect(() => {
      if (token !== null&&token1 !== null&&token2 !== null) {
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
        
        if (currentPassword==newPassword) {
            setError('Please chose a new password');
            return;
        }

        axios
            .post('http://localhost:3002/update-password', {
                password: newPassword
            }, {headers})
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
        // Fetch cart items and user data from the server
        axios.get('http://localhost:3002/change-password', {headers})
            .then((response) => {
                const responseData = response.data;
                setcurrentpass(responseData.patientRequests.password);
            })
            .catch((error) => {
                console.error('Error fetching user data:', error);
            });
    }, [navigate]);

    
  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/logout`, {headers})
      .then((response) => {
        const responseData = response.data;
        if (responseData.type == "") {
          navigate('/login');
        }
      })
  };
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/patient`, {headers})
      .then((response) => {
        const responseData = response.data;
        console.log(responseData.type)
        if ((responseData.type !== "patient" &&responseData.type !== "pharmacist"&&responseData.type !== "admin") || responseData.in !== true) {
          navigate('/login')
        }
      })
  }, []);

    return (
        <div className="container mt-5">
          <div className="d-flex justify-content-end mb-2">
            <button onClick={handleLogout} className="btn btn-danger">
              Logout
            </button>
          </div>
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
            <button onClick={handleChangePassword} className="btn btn-primary">
              Change Password
            </button>
          </div>
        </div>
    );
}

export default ChangePassword;
