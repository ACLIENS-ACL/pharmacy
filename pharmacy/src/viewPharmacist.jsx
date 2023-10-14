import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function ViewPharmacist() {
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [message, setMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pharmacist requests from the server
    axios
      .get('http://localhost:3001/view-pharmacist')
      .then((response) => {
        const responseData = response.data;
        if (responseData.userType === 'admin' && responseData.sessi === true) {
          const initiallyAcceptedPharmacists = responseData.pharmacistRequests.filter((pharmacist) => pharmacist.enrolled === 'accepted');
          setPharmacists(initiallyAcceptedPharmacists);
          setFilteredPharmacists(initiallyAcceptedPharmacists); // Initially set the filtered list to all pharmacists
        } else {
          navigate('/login');
        }
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
      return name.startsWith(searchTerm)&&enrolled==="accepted";
    });

    setFilteredPharmacists(filtered);
  };

  return (
    <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
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

export default ViewPharmacist;
