
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';
import ChartsPage from './ChartsPage'; // Create ChartsPage component

function RegisterAdmin() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('adminToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePassword(password)) {
      setMessage('Password must contain at least one lowercase letter, one uppercase letter, one digit, and one special character. It should be at least 8 characters long.');
      return;
    }

    try {
      const adminData = {
        username,
        email,
        password,
      };

      const result = await axios.post('http://localhost:3002/register-admin', adminData, { headers });
      console.log(result.data.message)

      if (result.data.message === 'Admin added successfully') {
        setMessage('Admin registered successfully.');
      } else if (result.data.message === 'Username already exists') {
        setMessage('Username Already Exists');
      } else if (result.data.message === 'Email already registered to another user') {
        setMessage('Email already registered to another user');
      }
      console.log("no way" + message)
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };
  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };

  return (
    <div id="wrapper">
      <Sidebar />

      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Topbar />

          <div className="container-fluid">
            <div>
              <h1 className="h3 mb-2 text-gray-800">Register New Admin</h1>

              <div className="row">
                <div className="col-lg-6">
                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label htmlFor="username">Username:</label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">Email:</label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="password">Password:</label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-primary">
                      Register
                    </button>
                  </form>
                </div>
                <div className="col-lg-6">
                  {message && <div className="alert alert-info" style={{ marginTop: '100px' }}>{message}</div>}
                </div>
              </div>
            </div>
          </div>

          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Your Website 2020</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default RegisterAdmin;
