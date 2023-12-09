import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewPharmacist() {
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [message, setMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
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
  useEffect(() => {
    // Fetch pharmacist requests from the server
    axios
      .get('http://localhost:3002/view-pharmacist', { headers })
      .then((response) => {
        const responseData = response.data;
        // if (responseData.userType === 'admin' && responseData.sessi === true) {
        const initiallyAcceptedPharmacists = responseData.pharmacistRequests.filter((pharmacist) => pharmacist.enrolled === 'accepted');
        setPharmacists(initiallyAcceptedPharmacists);
        setFilteredPharmacists(initiallyAcceptedPharmacists); // Initially set the filtered list to all pharmacists
        // } else {
        //   navigate('/login');
        // }
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching pharmacist requests.');
      });
  }, [navigate]);

  const handleSearch = () => {
    const searchTerm = searchInput.toLowerCase();
    const filtered = pharmacists.filter((pharmacist) => {
      const name = pharmacist.name.toLowerCase();
      return name.startsWith(searchTerm);
    });

    setFilteredPharmacists(filtered);
  };

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <h2>Pharmacists</h2>
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
        {filteredPharmacists.map((request) => (
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
                    {key}: {key === 'idDocument' || key === 'medicalDegree' ? (
                      // If the key is 'idDocument' or 'medicalDegree', create a link to view the file
                      <a href={`http://localhost:3001/uploads/${request[key].fileName}`} target="_blank" rel="noopener noreferrer">
                        View {key}
                      </a>
                    ) : key === 'medicalLicenses' ? (
                      // If the key is 'medicalLicenses', create links to view each license file
                      <ul>
                        {request[key].map((license, index) => (
                          <li key={index}>
                            <a href={`http://localhost:3001/uploads/${license.fileName}`} target="_blank" rel="noopener noreferrer">
                              View License {index + 1}
                            </a>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      // Otherwise, display the property normally
                      `${request[key]}`
                    )}
                  </li>
                ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewPharmacist;
