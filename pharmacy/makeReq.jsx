import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const containerStyle = {
  maxWidth: '800px',
  margin: '0 auto',
  padding: '20px',
};

const messageStyle = {
  color: 'red',
};

const headingStyle = {
  fontSize: '24px',
  marginBottom: '20px',
};

const labelStyle = {
  fontWeight: 'bold',
  display: 'block',
  marginTop: '10px',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
};

const textareaStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
};

const submitButtonStyle = {
  backgroundColor: 'blue',
  color: 'white',
  border: 'none',
  padding: '10px 20px',
};

const columnContainerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
};

const columnStyle = {
  flex: '1',
  marginRight: '20px',
};

const PharmacistRegistrationForm = () => {
  const [pharmacistInfo, setPharmacistInfo] = useState({});
  const [notes, setNotes] = useState();
  const [message, setMessage] = useState('');
  const [formModified, setFormModified] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('pharmacistToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    axios.get('http://localhost:3002/get-pharmacist-info')
      .then((response) => {
        setPharmacistInfo(response.data);
        if (response.data.enrolled === 'rejected') {
          setMessage('Your request was rejected');
        } else if (response.data.enrolled === 'pending') {
          setMessage('Your request is still pending');
        } else if (response.data.enrolled === 'request not made') {
          setMessage('Please submit your request');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setPharmacistInfo({
      ...pharmacistInfo,
      [e.target.name]: e.target.value,
    });
    setFormModified(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const updatedStatus = formModified ? 'pending' : pharmacistInfo.enrolled;
    console.log(notes)
    const requestData = {
      ...pharmacistInfo,
       notes, 
      enrolled: updatedStatus,
    };

    try {console.log(requestData);
      await axios.put('http://localhost:3002/update-pharmacist-info', requestData);

      setFormModified(false);

      navigate('./login');
    } catch (error) {
      console.error('Error:', error);

      alert('An error occurred while submitting the registration request.');
    }
  };
  
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

  return (
    <div style={containerStyle}>
    <div className="d-flex justify-content-end mb-2">
      <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    </div>
      <p style={messageStyle}>{message}</p>

      <h1 style={headingStyle}>Pharmacist Registration</h1>
      <form onSubmit={handleSubmit}>
        <div style={columnContainerStyle}>
          <div style={columnStyle}>
            <label style={labelStyle}>Name:</label>
            <input
              type="text"
              name="name"
              value={pharmacistInfo.name || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Email:</label>
            <input
              type="text"
              name="email"
              value={pharmacistInfo.email || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Date of Birth:</label>
            <input
              type="text"
              name="dob"
              value={pharmacistInfo.dob || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Educational Background:</label>
            <input
              type="text"
              name="educationalBackground"
              value={pharmacistInfo.educationalBackground || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
          <div style={columnStyle}>
            <label style={labelStyle}>Mobile Number:</label>
            <input
              type="text"
              name="mobileNumber"
              value={pharmacistInfo.mobileNumber || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />

            <label style={labelStyle}>Hourly Rate:</label>
            <input
              type="text"
              name="hourlyRate"
              value={pharmacistInfo.hourlyRate || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />
            <label style={labelStyle}>Affiliation:</label>
            <input
              type="text"
              name="affiliation"
              value={pharmacistInfo.affiliation || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
        </div>
        <label style={labelStyle}>Professional Experience:</label>
        <textarea
          name="extraNotes"
          value={pharmacistInfo.extraNotes}
          onChange={handleInputChange}
          rows="4"
          cols="50"
          style={textareaStyle}
          required
        />
        <br />

        <button
          type="submit"
          style={{
            ...submitButtonStyle,
            cursor: formModified ? 'pointer' : 'not-allowed',
          }}
          disabled={!formModified}
        >
          Submit Registration
        </button>

      </form>
    </div>
  );
};

export default PharmacistRegistrationForm;
