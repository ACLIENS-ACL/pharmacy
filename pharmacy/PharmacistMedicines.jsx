// PharmacistNavbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import PharmacistNavbar from './PharmacistNavBar'
import PharmacistFooter from './PharmacistFooter'
import departmentImage1 from './images/s1.png';
import departmentImage2 from './images/s2.png';
import departmentImage3 from './images/s3.png';
import departmentImage4 from './images/s4.png';

import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
const AllInOneMedicine = () => {
    const [meds, setMeds] = useState([]);
    const [message, setMessage] = useState('');
    const [medicinalUse, setMedicinalUse] = useState('');
    const [medicinalUses, setMedicinalUses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [type, setType] = useState([]);
    const [userData, setUserData] = useState(null);
    const navigate = useNavigate();
    const token = localStorage.getItem('pharmacistToken');
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    useEffect(() => {
        if (token === null) {
            navigate('/login');
        }
    }, [token, navigate]);
    useEffect(() => {

        axios.get('http://localhost:3002/admin', { headers })
            .then((response) => {
                const responseData = response.data;
                setType(responseData.type);
                console.log(responseData.type, responseData.in);

                if (
                    (responseData.type === 'admin' || responseData.type === 'pharmacist' || responseData.type === 'patient') &&
                    responseData.in === true
                ) {
                    // Continue with your logic for authenticated users
                } else {
                    // Redirect to the login page or handle unauthorized access
                    navigate('/login');
                }
            })
            .catch((error) => {
                // Handle errors, e.g., network issues or server errors
                console.error('Error fetching admin data:', error);
            });
    }, []);


    useEffect(() => {
        axios.get('http://localhost:3002/current-user', { headers })
            .then((response) => {
                const userData = response.data;
                setUserData(userData);
            })
            .catch((error) => {
                console.error(error);
                setMessage('An error occurred while fetching user data.');
            });
    }, []);


    useEffect(() => {
        // Fetch distinct medicinal uses from the server
        axios.get(`http://localhost:3002/medicinal-uses`, { headers })
            .then(response => {
                const responseData = response.data
                setMedicinalUses(responseData.medicinalUses);
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicinal uses');
            });

        // Fetch all medicines from the backend
        axios.get('http://localhost:3002/medicines', { headers })
            .then(response => {
                setMedicines(response.data);
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicines');
            });
    }, []);
    useEffect(() => {
        if (token === null) {
            navigate('/login');
        }
    }, [token, navigate]);
    const handleFilter = (event) => {
        const input = event.target;
        setMedicinalUse(event);
        filterMedicines(searchQuery, event);
    };

    const handleSearch = (event) => {
        const input = event.target.value;
        setSearchQuery(input);
        filterMedicines(input, medicinalUse);
    };

    const filterMedicines = (search, filter) => {
        const filtered = medicines.filter(medicine =>
            medicine.name.toLowerCase().startsWith(search.toLowerCase()) &&
            (filter === '' || medicine.medicinalUse === filter)
        );
        setMeds(filtered);
    };

    useEffect(() => {
        filterMedicines(searchQuery, medicinalUse);
    }, [searchQuery, medicinalUse, medicines]);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const indexOfLastMed = currentPage * itemsPerPage;
    const indexOfFirstMed = indexOfLastMed - itemsPerPage;
    const currentMeds = meds.slice(indexOfFirstMed, indexOfLastMed);

    const totalPages = Math.ceil(meds.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    return (
        <div>
            <PharmacistNavbar />
            <div className=' d-flex justify-content-center'>
                <div style={{ width: "1000px" }}>
                    <div className="site-section" style={{ marginBottom: "80px" }}>
                        <div class="container">
                            <div className="row">
                                <div className="col-lg-10 align-self-center" style={{ marginLeft: "80px", height: "20px" }}>
                                    <div className="d-flex">
                                        <h3 className="h6 text-uppercase text-black d-block m-2">Filter by Medical use:</h3>
                                        <select
                                            className="form-control ml-2"
                                            style={{ width: "250px", marginRight: "140px" }}
                                            onChange={(e) => handleFilter(e.target.value)}
                                        >
                                            <option value="">Medical uses</option>
                                            {medicinalUses.map((use, index) => (
                                                <option key={index} value={use}>
                                                    {use}
                                                </option>
                                            ))}
                                        </select>
                                        <h3 className="h6 text-uppercase text-black d-block m-2">Search by Name:</h3>
                                        <input
                                            type="text"
                                            className="form-control ml-80"
                                            placeholder="Search for a medication by name"
                                            value={searchQuery}
                                            onChange={handleSearch}
                                            style={{ width: "400px" }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        {currentMeds.map((medicine, index) => (
                            <div key={index} className="col-md-4 mb-4">
                                <div className="d-flex flex-column align-items-center p-3" style={{ border: '1px solid #62d2a2', borderRadius: '10px' }}>
                                    <a href={`shop-single.html?id=${medicine._id}`}>
                                        <img
                                            src={`http://localhost:3002/uploads/${encodeURIComponent(medicine.imageUrl.fileName)}`}
                                            alt={medicine.name}
                                            style={{ width: '150px' }}
                                        />
                                    </a>
                                    <h3 className="text-dark">
                                        <a style={{ color: '#62d2a2' }} href={`shop-single.html?id=${medicine._id}`}>{medicine.name}</a>
                                    </h3>
                                    <p>Description: {medicine.description}</p>
                                    <p>Medicinal Use: {medicine.medicinalUse}</p>
                                    <p>Price: ${medicine.price}</p>
                                    <p>Available Quantity: {medicine.quantity}</p>
                                    <p>Sales: {medicine.sales}</p>
                                </div>
                            </div>
                        ))}
                    </div>


                    <div className="pagination d-flex justify-content-center col-md-12 text-center " style={{ fontSize: '30px', padding: '20px 0' }}>
                        <span style={{ marginRight: '10px' }}>Pages:</span>
                        <ul className="pagination-list d-flex" style={{ listStyleType: 'none', padding: 0 }}>
                            {Array.from({ length: totalPages }).map((_, index) => (
                                <li
                                    key={index}
                                    className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`}
                                    style={{
                                        margin: '0 8px',
                                        borderRadius: '50%',
                                        background: currentPage === index + 1 ? '#000' : '#f0f0f0', // Black for active, light gray for non-active
                                        padding: '8px',
                                        border: currentPage !== index + 1 ? '1px solid #000' : 'none', // Border for non-active
                                    }}
                                >
                                    <Link
                                        to="#"
                                        onClick={() => handlePageChange(index + 1)}
                                        style={{
                                            display: 'block',
                                            width: '100%',
                                            height: '100%',
                                            textAlign: 'center',
                                            fontSize: '16px',
                                            color: currentPage === index + 1 ? '#fff' : '#000', // White for active, black for non-active
                                            marginTop: '2px',
                                        }}
                                    >
                                        {index + 1}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
            <PharmacistFooter />
        </div>
    );
};

export default AllInOneMedicine;
