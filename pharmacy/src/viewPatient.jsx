import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewPatient() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [message, setMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch patient requests from the server
    axios.get('http://localhost:3001/view-patient')
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

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = patients.filter((patient) => {
      const name = patient.name.toLowerCase();
      return name.startsWith(searchTerm);
    });

    setFilteredPatients(filtered);
  };

  return (
    <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
      <h2>Patients</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by Name"
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
        {filteredPatients.map((request) => (
          <li key={request._id} style={{ marginBottom: '20px' }}>
            <strong>Name:</strong> {request.name}<br />
            <strong>Other Properties:</strong>
            <ul>
              {Object.keys(request)
                .filter(
                  (key) =>
                    key !== '_id' &&
                    key !== 'username' &&
                    key !== 'name' &&
                    key !== 'password' &&
                    key !== 'userType' &&
                    key !== '__v'
                )
                .map((key) => (
                  <li key={key}>
                    {key}: {request[key]}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewPatient;
