import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PharmacistsRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch pharmacist requests from the server
    axios.get('http://localhost:3001/pharmacist-requests')
      .then((response) => {
        const responseData = response.data;
        if (responseData.userType === 'admin' && responseData.sessi === true) {
          setRequests(responseData.pharmacistRequests);
        } else {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching pharmacist requests.');
      });
  }, [navigate]);
  
  const pendingRequests = requests.filter((request) => request.status === 'pending');

  const handleApprove = (pharmacistId) => {
    // Send a request to approve the pharmacist
    axios.post(`http://localhost:3001/approve-pharmacist/${pharmacistId}`)
      .then(() => {
        // Update the local state to reflect the change
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while approving the pharmacist.');
      });
  };

  const handleReject = (pharmacistId) => {
    // Send a request to reject and remove the pharmacist
    axios.post(`http://localhost:3001/reject-pharmacist/${pharmacistId}`)
      .then(() => {
        // Update the local state to remove the rejected pharmacist
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while rejecting the pharmacist.');
      });
  };

  return (
    <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
      <h2 style={{ fontSize: '2rem', color: 'blue', marginBottom: '20px' }}>Pharmacist Requests</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <ul>
        {pendingRequests.map((request) => (
          <li key={request._id} style={{ marginBottom: '20px' }}>
            <strong>Name:</strong> {request.name}<br />
            <strong>Other Properties:</strong>
            <ul>
              {Object.keys(request)
                .filter(
                  (key) =>
                    key !== '_id' &&
                    key !== 'password' &&
                    key !== 'username' &&
                    key !== 'userType' &&
                    key !== 'name' &&
                    key !== '__v'
                )
                .map((key) => (
                  <li key={key}>
                    {key}: {request[key]}
                  </li>
                ))}
            </ul>
            <button
              onClick={() => handleApprove(request._id)}
              style={{
                backgroundColor: 'green',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
                marginRight: '10px',
              }}
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(request._id)}
              style={{
                backgroundColor: 'red',
                color: 'white',
                border: 'none',
                padding: '10px 20px',
                borderRadius: '5px',
                cursor: 'pointer',
              }}
            >
              Reject
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PharmacistsRequests;
