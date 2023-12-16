import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RemovePatient() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [message, setMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient requests from the server
    axios.get('http://localhost:3001/remove-patient')
      .then((response) => {
        const responseData = response.data;
        if (responseData.userType === 'admin' && responseData.sessi === true) {
          setPatients(responseData.patientRequests);
          setFilteredPatients(responseData.patientRequests); // Initially set the filtered list to all patients
        } else {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching patient requests.');
      });
  }, [navigate]);

  const handleReject = (patientId) => {
    // Send a request to reject and remove the patient
    axios.post(`http://localhost:3001/remove-patient/${patientId}`)
      .then(() => {
        // Update the local state to remove the deleted patient
        setPatients((prevRequests) => prevRequests.filter((request) => request._id !== patientId));
        setFilteredPatients((prevRequests) => prevRequests.filter((request) => request._id !== patientId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the patient.');
      });
  };

  const handleSearch = () => {
    // Filter patients based on the search input
    const searchTerm = searchInput.toLowerCase();
    const filtered = patients.filter((patient) => {
      const name = patient.name.toLowerCase();
      return name.startsWith(searchTerm);
    });

    setFilteredPatients(filtered);
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

  return (
    <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <h2>Patients</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by name"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          style={{
            padding: '10px',
            fontSize: '16px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginRight: '10px',
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            backgroundColor: 'blue',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          Search
        </button>
      </div>
      <ul>
        {filteredPatients.map((patient) => (
          <li key={patient._id} style={{ marginBottom: '20px' }}>
            <strong>Name:</strong> {patient.name}<br />
            <strong>Other Properties:</strong>
            <ul>
              {Object.keys(patient)
                .filter(
                  (key) =>
                    key !== '_id' &&
                    key !== 'userType' &&
                    key !== 'name' &&
                    key !== 'username' &&
                    key !== 'password' &&
                    key !== 'enrolled' &&
                    key !== '__v' &&
                    key !== 'cart' &&
                    key !== 'orders' &&
                    key !== 'deliveryAddresses' &&
                    key !== 'wallets'
                )
                .map((key) => (
                  <li key={key}>
                    {key}: {patient[key]}
                  </li>
                ))}
            </ul>
            <button onClick={() => handleReject(patient._id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RemovePatient;
