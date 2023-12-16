import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';
// Import any additional components or stylesheets as needed

function PharmacistsRequests() {
  const [requests, setRequests] = useState([]);
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
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

  const handlePharmacistClick = (pharmacist) => {
    // Set the selected pharmacist when clicked
    setSelectedPharmacist(pharmacist);
  };

  useEffect(() => {
    // Fetch pharmacist requests from the server
    axios.get('http://localhost:3002/pharmacist-requests', { headers })
      .then((response) => {
        const responseData = response.data;
        setRequests(responseData.pharmacistRequests);
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while fetching pharmacist requests.');
      });
  }, [navigate]);

  const pendingRequests = requests.filter((request) => request.enrolled === 'pending');

  const handleApprove = (pharmacistId) => {
    axios.post(`http://localhost:3002/approve-pharmacist/${pharmacistId}`)
      .then(() => {
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
        setSelectedPharmacist(null); // Reset selected pharmacist after approval
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while approving the pharmacist.');
      });
  };

  const handleReject = (pharmacistId) => {
    axios.post(`http://localhost:3002/reject-pharmacist/${pharmacistId}`)
      .then(() => {
        setRequests((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
        setSelectedPharmacist(null); // Reset selected pharmacist after rejection
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while rejecting the pharmacist.');
      });
  };

  return (
    <div id="wrapper" className="d-flex">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Topbar />
          <div className="container-fluid">
            <div className="row">
              <div className="col-md-12">
                <div className="page-container" style={{ boxSizing: 'border-box', padding: '20px' }}>
                  <h2 style={{ fontSize: '2rem', color: 'blue', marginBottom: '20px' }}>All Pharmacists</h2>
                  {message && <div className="alert alert-danger">{message}</div>}
                  {requests.map((pharmacist) => (
                    <div key={pharmacist._id} className="card mb-3">
                      <div className="card-body text-center">
                        <h5 className="card-title">
                          <strong>{pharmacist.name}</strong>
                        </h5>
                        <table className="table">
                          <tbody>
                            {Object.keys(pharmacist)
                              .filter(
                                (key) =>
                                  key !== '_id' &&
                                  key !== 'password' &&
                                  key !== 'username' &&
                                  key !== 'latestNotifications' &&
                                  key !== 'enrolled' &&
                                  key !== 'medicines' &&
                                  key !== 'userType' &&
                                  key !== 'wallet' &&
                                  key !== 'lastAcceptedDate' &&
                                  key !== 'name' &&
                                  key !== '__v'
                              )
                              .map((key) => (
                                <tr key={key}>
                                  <td>{key}:</td>
                                  <td>
                                    {key === 'idDocument' || key === 'medicalDegree' ? (
                                      <a
                                        href={`http://localhost:3002/uploads/${pharmacist[key].fileName}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                      >
                                        View {key}
                                      </a>
                                    ) : key === 'medicalLicenses' ? (
                                      <ul className="list-unstyled">
                                        {pharmacist[key].map((license, index) => (
                                          <li key={index}>
                                            <a
                                              href={`http://localhost:3002/uploads/${license.fileName}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              View License {index + 1}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    ) : (
                                      `${pharmacist[key]}`
                                    )}
                                  </td>
                                </tr>
                              ))}
                          </tbody>
                        </table>
                        <div className="d-flex justify-content-end mt-3">
                          <button
                            onClick={() => handleApprove(pharmacist._id)}
                            className="btn btn-success me-2"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleReject(pharmacist._id)}
                            className="btn btn-danger"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <footer className="sticky-footer bg-white">
            <div className="container my-auto">
              <div className="copyright text-center my-auto">
                <span>Copyright &copy; Your Website 2020</span>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}

export default PharmacistsRequests;
