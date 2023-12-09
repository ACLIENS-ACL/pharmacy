import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function PharmacistsRequests() {
  const [requests, setRequests] = useState([]);
  const [message, setMessage] = useState('');
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
    axios.get('http://localhost:3002/pharmacist-requests', {headers})
      .then((response) => {
        const responseData = response.data;
        // if (responseData.userType === 'admin' && responseData.sessi === true) {
          setRequests(responseData.pharmacistRequests);
        // } else {
        //   navigate('/login');
        // }
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching pharmacist requests.');
      });
  }, [navigate]);
  
  const pendingRequests = requests.filter((request) => request.enrolled === 'pending');
  console.log(pendingRequests)

  const handleApprove = (pharmacistId) => {
    // Send a request to approve the pharmacist
    console.log(token)
    axios.post(`http://localhost:3002/approve-pharmacist/${pharmacistId}`)
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
    axios.post(`http://localhost:3002/reject-pharmacist/${pharmacistId}`)
      .then(() => {
        // Update the local state to remove the rejected pharmacist
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while rejecting the pharmacist.');
      });
  };

  
  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    // axios.get(`http://localhost:3002/logout`, {headers})
    //   .then((response) => {
    //     const responseData = response.data;
    //     if (responseData.type == "") {
    localStorage.removeItem('adminToken');
          navigate('/login');
        // }
      // })
  };

  return (
    <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
    <div className="d-flex justify-content-end mb-2">
      <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    </div>
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
                    {key}: {key === 'idDocument' || key === 'medicalDegree' ? (
                      // If the key is 'idDocument' or 'medicalDegree', create a link to view the file
                      <a href={`http://localhost:3002/uploads/${request[key].fileName}`} target="_blank" rel="noopener noreferrer">
                        View {key}
                      </a>
                    ) : key === 'medicalLicenses' ? (
                      // If the key is 'medicalLicenses', create links to view each license file
                      <ul>
                        {request[key].map((license, index) => (
                          <li key={index}>
                            <a href={`http://localhost:3002/uploads/${license.fileName}`} target="_blank" rel="noopener noreferrer">
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
