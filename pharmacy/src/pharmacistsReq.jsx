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
        if (responseData.userType === "admin"&&responseData.sessi===true) {
          setRequests(responseData.pharmacistRequests);
        }
        else{
          navigate('/login')
        }
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching pharmacist requests.');
      });
  }, [navigate]);

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
    <div>
      <h2>pharmacist Requests</h2>
      {message && <div className="alert alert-danger">{message}</div>}
      <ul>
        {requests.map((request) => (
          <li key={request._id}>
            <strong>Name:</strong> {request.name}<br />
            <strong>Specialization:</strong> {request.specialization}<br />
            <strong>Other Properties:</strong>
            <ul>
              {Object.keys(request)
                .filter((key) => key !== 'password' && key !== 'enrolled' && key !== '__v')
                .map((key) => (
                  <li key={key}>
                    {key}: {request[key]}
                  </li>
                ))}
            </ul>
            <button onClick={() => handleApprove(request._id)}>Approve</button>
            <button onClick={() => handleReject(request._id)}>Reject</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PharmacistsRequests;
