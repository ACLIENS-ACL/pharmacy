import React, { useState, useEffect } from 'react';
import axios from 'axios';

function PharmacistRegistrationForm() {
  const [pharmacistInfo, setpharmacistInfo] = useState({});
  const [notes, setNotes] = useState('');
  const [message, setMessage] = useState('');
  const [formModified, setFormModified] = useState(false);

  useEffect(() => {
    axios.get('http://localhost:3001/get-pharmacist-info')
      .then((response) => {
        console.log(response.data)
        setpharmacistInfo(response.data);
        if (response.data.enrolled == "rejected") {
          setMessage("your request was rejected")
        } else if (response.data.enrolled == "pending") {
          setMessage("your request is still pending")
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  }, []);

  const handleInputChange = (e) => {
    setpharmacistInfo({
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
      enrolled: 'Pending',
    };

    try {
      // Send a POST request to your server to update the pharmacist's information
      await axios.put('http://localhost:3001/update-pharmacist-info', requestData);

      setFormModified(false);

      // Optionally, you can display a success message to the user
      alert('Registration request submitted successfully.');
    } catch (error) {
      console.error('Error:', error);

      // Handle errors, e.g., display an error message to the user
      alert('An error occurred while submitting the registration request.');
    }
  };

  return (
    <div>
      <p style={{ color: 'red' }}>{message}</p>

      <h1>pharmacist Registration</h1>
      <form onSubmit={handleSubmit}>

        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={pharmacistInfo.name || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Email:</label>
        <input
          type="text"
          name="email"
          value={pharmacistInfo.email || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Date of Birth:</label>
        <input
          type="text"
          name="dob"
          value={pharmacistInfo.dob || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Gender:</label>
        <input
          type="text"
          name="gender"
          value={pharmacistInfo.gender || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Mobile Number:</label>
        <input
          type="text"
          name="mobileNumber"
          value={pharmacistInfo.mobileNumber || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Hourly Rate:</label>
        <input
          type="text"
          name="hourlyRate"
          value={pharmacistInfo.hourlyRate || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Affiliation:</label>
        <input
          type="text"
          name="affiliation"
          value={pharmacistInfo.affiliation || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Educational Background:</label>
        <input
          type="text"
          name="educationalBackground"
          value={pharmacistInfo.educationalBackground || ''}
          onChange={handleInputChange}
        />
        <br />

        <label>Extra Notes:</label>
        <textarea
          name="extraNotes"
          value={pharmacistInfo.extraNotes || ''}
          onChange={handleInputChange}
          rows="4"
          cols="50"
        ></textarea>
        <br />

        <button type="submit" disabled={!formModified}>
          Submit Registration
        </button>
      </form>
    </div>
  );
}

export default PharmacistRegistrationForm;