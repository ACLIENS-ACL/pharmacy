import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const addMedContainerStyle = {
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
  cursor: 'pointer',
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
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [formModified, setFormModified] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:3001/get-pharmacist-info')
      .then((response) => {
        console.log(response.data);
        setPharmacistInfo(response.data);
        if (response.data.enrolled === 'rejected') {
          setMessage('Your request was rejected');
        } else if (response.data.enrolled === 'pending') {
          setMessage('Your request is still pending');
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

    // Create a data object to send to the server
    const requestData = {
      ...pharmacistInfo,
      notes,
      enrolled: 'pending',
    };

    try {
      // Send a POST request to your server to update the pharmacist's information
      await axios.put('http://localhost:3001/update-pharmacist-info', requestData);

      setFormModified(false);

      // Optionally, you can display a success message to the user
      alert('Registration request submitted successfully.');
      navigate('./login')
    } catch (error) {
      console.error('Error:', error);

      // Handle errors, e.g., display an error message to the user
      alert('An error occurred while submitting the registration request.');
    }
  };

  return (
    <div style={addMedContainerStyle}>
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

            <label style={labelStyle}>Gender:</label>
            <input
              type="text"
              name="gender"
              value={pharmacistInfo.gender || ''}
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

            <label style={labelStyle}>Educational Background:</label>
            <input
              type="text"
              name="educationalBackground"
              value={pharmacistInfo.educationalBackground || ''}
              onChange={handleInputChange}
              style={inputStyle}
            />
          </div>
        </div>
        <label style={labelStyle}>Extra Notes:</label>
        <textarea
          name="extraNotes"
          value={pharmacistInfo.extraNotes || ''}
          onChange={handleInputChange}
          rows="4"
          cols="50"
          style={textareaStyle}
        />
        <br />

        <button type="submit" disabled={!formModified} style={submitButtonStyle}>
          Submit Registration
        </button>
      </form>
    </div>
  );
};

export default PharmacistRegistrationForm;
