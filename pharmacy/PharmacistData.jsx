import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';
import ChartsPage from './ChartsPage'; // Create ChartsPage component

function ViewPharmacist() {
  const [pharmacists, setPharmacists] = useState([]);
  const [filteredPharmacists, setFilteredPharmacists] = useState([]);
  const [message, setMessage] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [selectedPharmacist, setSelectedPharmacist] = useState(null);
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

    if (filtered.length === 0) {
      setMessage('No matching pharmacists found.');
    } else {
      setMessage('');
    }

    setFilteredPharmacists(filtered);
  };
  useEffect(() => {
    // Fetch pharmacist requests from the server
    console.log(headers)
    axios.get('http://localhost:3002/remove-pharmacist',)
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

  const handleRemove = (pharmacistId) => {
    // Send a request to reject and remove the pharmacist
    axios.post(`http://localhost:3002/remove-pharmacist/${pharmacistId}`, { headers })
      .then(() => {
        // Update the local state to remove the deleted pharmacist
        setPharmacists((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
        setFilteredPharmacists((prevRequests) => prevRequests.filter((request) => request._id !== pharmacistId));
      })
      .catch((error) => {
        console.error(error);
        setMessage('An error occurred while removing the pharmacist.');
      });
  };


  return (
    <div id="wrapper" className="d-flex">
      <Sidebar />
      <div id="content-wrapper" className="d-flex flex-column">
        <div id="content">
          <Topbar />
          <div className="container-fluid">
            <div className="row mb-3">
              <div className="col-md-6">
                <h1 className="h3 mb-2 text-gray-800">Pharmacists Data</h1>
              </div>
              <div className="col-md-6 text-right">
                <div className="d-flex align-items-center">
                  <input
                    type="text"
                    placeholder="Search by Name"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="form-control"
                  />
                  <button onClick={handleSearch} className="btn btn-primary ml-2">
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-md-12">
                {message && <div className="alert alert-danger">{message}</div>}
                <div className="table-responsive">
                  <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                    <thead className="thead-dark">
                      <tr>
                        <th className="text-center">Name</th>
                        <th className="text-center">Email</th>
                        <th className="text-center">DOB</th>
                        <th className="text-center">Mobile Number</th>
                        <th className="text-center">Hourly Rate</th>
                        <th className="text-center">Enrolled</th>
                        <th className="text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPharmacists.map((pharmacist) => (
                        <React.Fragment key={pharmacist._id}>
                          <tr onClick={() => setSelectedPharmacist(pharmacist)}>
                            <td className="text-center">{pharmacist.name}</td>
                            <td className="text-center">{pharmacist.email}</td>
                            <td className="text-center">{pharmacist.dob}</td>
                            <td className="text-center">{pharmacist.mobileNumber}</td>
                            <td className="text-center">{pharmacist.hourlyRate}</td>
                            <td className="text-center">{pharmacist.enrolled}</td>
                            <td className="text-center">
                              <button
                                className="btn btn-danger btn-sm"
                                onClick={() => handleRemove(pharmacist._id)}
                              >
                                Remove
                              </button>
                            </td>
                          </tr>

                          {selectedPharmacist?._id === pharmacist._id && (
                            <tr>
                              <td colSpan="7">
                                <div className="bg-light p-3 border rounded">
                                  <h2>Detailed Information for {pharmacist.name}</h2>
                                  <div className="list-group">
                                    {Object.keys(pharmacist)
                                      .filter(
                                        (key) =>
                                          key !== '_id' &&
                                          key !== 'username' &&
                                          key !== 'name' &&
                                          key !== 'password' &&
                                          key !== 'userType' &&
                                          key !== 'mobileNumber' &&
                                          key !== 'email' &&
                                          key !== 'hourlyRate' &&
                                          key !== 'dob' &&
                                          key !== 'medicines' &&
                                          key !== 'wallet' &&
                                          key !== 'lastAcceptedDate' &&
                                          key !== 'enrolled' &&
                                          key !== 'latestNotifications' &&
                                          key !== '__v'
                                      )
                                      .map((key) => (
                                        <div key={key} className="list-group-item">
                                          <strong>{key}:</strong>{' '}
                                          {key === 'idDocument' || key === 'medicalDegree' ? (
                                            <a
                                              href={`http://localhost:3001/uploads/${pharmacist[key].fileName}`}
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
                                                    href={`http://localhost:3001/uploads/${license.fileName}`}
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
                                        </div>
                                      ))}
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <footer className="sticky-footer bg-white mt-4">
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

export default ViewPharmacist;
