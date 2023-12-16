import React, { useState, useEffect } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBInput, MDBBtn } from 'mdb-react-ui-kit';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RegistrationForm() {
  const formStyle = {
    background: '#f0f0f0', // Background color
    padding: '20px', // Add padding for spacing
  };

  const inputStyle = {
    fontSize: '1.2rem', // Increase font size for larger inputs
  };

  const h2Style = {
    fontSize: '2rem', // Set the font size for the h2 element
    color: 'blue', // Set the text color to blue
    marginBottom: '20px', // Add bottom margin for spacing
  };

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const validatePassword = (password) => {
    // Password must contain at least one capital letter, one small letter, one special character, and one number.
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordPattern.test(password);
  };
  useEffect(() => {
    // Fetch pharmacist requests from the server
    axios.get('http://localhost:3001/register-admin')
      .then((response) => {
        const responseData = response.data;
        if (responseData.type !== "admin" || !responseData.in) {
          navigate('/login')
        }
      })
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate the password
    if (!validatePassword(password)) {
      setMessage(
        'Password must contain at least one lowercase letter, one uppercase letter, one special character, and one number. It should be at least 8 characters long.'
      );
      return;
    }
    try {
      const adminData = {
        username,
        email,
        password,
      };

      const result = await axios.post('http://localhost:3001/register-admin', adminData);
      console.log(result.data.message)
      if (result.data.message === 'Admin added successfully') {
        setMessage('Admin registered successfully.');
      } else if (result.data.message === 'Username already exists') {
        console.log("dsad")
        setMessage('Username Already Exists');
      } else if (result.data.message === 'Email already registered to another user') {
        setMessage('Email already registered to another user');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again later.');
    }
  };

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    axios.get(`http://localhost:3001/logout`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type == "") {
          navigate('/login');
        }
      })
  };

  const logoutButtonStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
  };

  return (
    <MDBContainer className="vh-100 d-flex justify-content-center align-items-center">
      <button onClick={handleLogout} className="btn btn-danger" style={logoutButtonStyle}>
        Logout
      </button>
      <MDBRow>
        <MDBCol md="20" lg="20">
          <h2 style={h2Style}>Add Admin</h2>
          <form style={formStyle} onSubmit={handleSubmit}>
            <MDBInput
              label="Username"
              type="text"
              id="username"
              name="username"
              className="mb-4"
              style={inputStyle}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <MDBInput
              label="Email"
              type="email"
              id="email"
              name="email"
              className="mb-4"
              style={inputStyle}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <MDBInput
              label="Password"
              type="password"
              id="password"
              name="password"
              className="mb-4"
              style={inputStyle}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <MDBBtn color="primary" type="submit">
              Register
            </MDBBtn>
            <div className="mt-3 text-danger">{message}</div>
          </form>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default RegistrationForm;
