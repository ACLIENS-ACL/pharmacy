import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from './SideBar';
import Topbar from './Topbar';
import ChartsPage from './ChartsPage'; // Create ChartsPage component

function ViewPatient() {
    const [patients, setPatients] = useState([]);
    const [filteredPatients, setFilteredPatients] = useState([]);
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
        // Fetch patient requests from the server
        axios.get('http://localhost:3002/view-patient', { headers })
            .then((response) => {
                const responseData = response.data;
                setPatients(responseData.patientRequests);
                setFilteredPatients(responseData.patientRequests); // Initially set the filtered list to all patients
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

    const renderTableHeader = () => {
        const headers = Object.keys(patients[0]);
        return (
            <>
                {headers.map((header) => (
                    <th key={header}>{header}</th>
                ))}
                <th>Action</th>
            </>
        );
    };

    const renderTableData = () => {
        return filteredPatients.map((patient) => (
            <tr key={patient._id}>
                {Object.values(patient).map((value, index) => (
                    <td key={index}>{Array.isArray(value) ? value.join(', ') : value}</td>
                ))}
                <td>
                    <button
                        onClick={() => handleRemove(patient._id)}
                        className="btn btn-danger"
                    >
                        Remove Patient
                    </button>
                </td>
            </tr>
        ));
    };


    useEffect(() => {
        // Fetch patient requests from the server
        axios.get('http://localhost:3002/remove-patient', { headers })
            .then((response) => {
                const responseData = response.data;
                // if (responseData.userType === 'admin' && responseData.sessi === true) {
                setPatients(responseData.patientRequests);
                setFilteredPatients(responseData.patientRequests); // Initially set the filtered list to all patients
                // } else {
                //   navigate('/login');
                // }
            })
            .catch((error) => {
                console.error(error);
                setMessage('An error occurred while fetching patient requests.');
            });
    }, [navigate]);


    const handleRemove = (patientId) => {
        console.log(patientId)
        console.log(headers)
        // Send a request to reject and remove the patient
        axios.post(`http://localhost:3002/remove-patient/${patientId}`,
        {}, { headers })
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

    return (
        <div id="wrapper">
            <Sidebar />

            <div id="content-wrapper" className="d-flex flex-column">
                <div id="content">
                    <Topbar />

                    <div className="container-fluid">
                        <div>
                            <div className="row" style={{ marginTop: '20px' }}>
                                <div className="col-md-8">
                                    <h1 className="h3 mb-2 text-gray-800">Patients Data</h1>
                                </div>
                                <div className="col-md-4 text-right">
                                    {/* Search input and button aligned to the right */}
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
                                </div>
                            </div>
                            <div className="row">
                                {message && <div className="alert alert-danger">{message}</div>}
                                <div style={{ marginBottom: '20px' }}>
                                    {/* Search input and button */}
                                </div>
                                <div className="table-responsive">
                                    <table className="table table-bordered" id="dataTable" width="100%" cellSpacing="0">
                                        <thead>
                                            <tr>
                                                <th className="text-center">Username</th>
                                                <th className="text-center">Name</th>
                                                <th className="text-center">Email</th>
                                                <th className="text-center">DOB</th>
                                                <th className="text-center">Gender</th>
                                                <th className="text-center">Mobile Number</th>
                                                <th className="text-center">Actions</th>
                                                {/* Add more columns as needed */}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {filteredPatients.map((patient) => (
                                                <tr key={patient._id} >
                                                    <td className="text-center">{patient.username}</td>
                                                    <td className="text-center">{patient.name}</td>
                                                    <td className="text-center">{patient.email}</td>
                                                    <td className="text-center">{patient.dob}</td>
                                                    <td className="text-center">{patient.gender}</td>
                                                    <td className="text-center">{patient.mobileNumber}</td>
                                                    <td  className="text-center">
                                                        <button className="btn btn-primary height-auto btn-sm" onClick={() => handleRemove(patient._id)}>
                                                            X
                                                        </button>
                                                        
                                                    </td>
                                                    {/* Add more cells as needed */}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
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

export default ViewPatient;
