import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const formContainerStyle = {
  maxWidth: '400px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
};

const inputStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '3px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  background: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
  marginBottom: '10px',
};

const ulStyle = {
  listStyleType: 'none',
  padding: 0,
};

const liStyle = {
  border: '1px solid #ccc',
  padding: '10px',
  marginBottom: '5px',
  borderRadius: '3px',
};

const errorStyle = {
  color: 'red',
  fontSize: '14px',
};

function AddAddressForm() {
  const [newAddress, setNewAddress] = useState('');
  const [existingAddresses, setExistingAddresses] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);
  // Fetch and set existing addresses from the database when the component mounts
  useEffect(() => {
    axios.get('http://localhost:3002/delivery-addresses',{headers})
      .then((response) => {
        console.log(response.data.patientRequests[0].deliveryAddresses)
        setExistingAddresses(response.data.patientRequests[0].deliveryAddresses || []);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Check if the new address already exists
    if(newAddress==''){
      setErrorMessage('Please Add an Address');
    }
    else if (!existingAddresses.includes(newAddress)) {
      // Create a new array with the existing addresses and the new address
      const updatedAddresses = [...existingAddresses, newAddress];
      console.log(updatedAddresses)

      // Send the updated addresses to the backend
      axios
        .post('http://localhost:3002/add-address', { addresses: updatedAddresses }, {headers})
        .then((response) => {
          // Handle the response if needed
        })
        .catch((error) => {
          console.error(error);
          // Handle error
        });

      // Update the state with the new address
      setExistingAddresses(updatedAddresses);

      // Clear the new address input field
      setNewAddress('');
      // Clear any previous error message
      setErrorMessage('');
    } else {
      // Display an error message if the address already exists
      setErrorMessage('Address already exists');
    }
  }

  const goBack = () => {
    navigate('/checkOut');
  };

  return (
    <div style={formContainerStyle}>
      <button type="button" style={buttonStyle} onClick={goBack}>
        Go Back to Checkout
      </button>
      <h2 style={{ marginTop: '20px' }}>Add New Address</h2> {/* Add margin to create space */}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter a new address"
          style={inputStyle}
          value={newAddress}
          onChange={(e) => setNewAddress(e.target.value)}
        />
        <button type="submit" style={buttonStyle}>
          Add Address
        </button>
      </form>
      {errorMessage && <p style={errorStyle}>{errorMessage}</p>}
      <h2>Existing Addresses</h2>
      <ul style={ulStyle}>
        {existingAddresses.map((address, index) => (
          <li key={index} style={liStyle}>
            {address}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AddAddressForm;
