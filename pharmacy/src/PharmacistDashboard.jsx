// PharmacistNavbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

import { Link, useNavigate } from 'react-router-dom';
import PharmacistNavbar from './PharmacistNavBar'
import PharmacistFooter from './PharmacistFooter'
import departmentImage1 from './images/s1.png';
import departmentImage2 from './images/s2.png';
import departmentImage3 from './images/s3.png';
import departmentImage4 from './images/s4.png';


import { FaComment, FaVideo } from 'react-icons/fa';
import { Dropdown } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
const PharmacistDashboard = () => {
    // const [chatRequests, setChatRequests] = useState([]);

    const navigate = useNavigate();
    const [rooms, setRooms] = useState([]);
    useEffect(() => {
        const fetchDoctors = async () => {
            try {
                const token = localStorage.getItem('pharmacistToken');
                const response = await axios.get('http://localhost:3002/allrooms', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRooms(response.data);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            }
        };

        fetchDoctors();
    }, []);
    const handleChatClick = async (e, roomId) => {
        e.stopPropagation(); // Prevent the event from propagating to the parent elements
        console.log(roomId)
        navigate(`/pharmachat/${roomId}`)

    }
    return (
        <div>
            <PharmacistNavbar />
            <section className="department_section layout_padding">
                <div className="department_container">
                    <div className="container ">
                        <div className="heading_container heading_center">
                            <h2>
                                Our Departments
                            </h2>
                            <p>
                                Asperiores sunt consectetur impedit nulla molestiae delectus repellat laborum dolores doloremque accusantium
                            </p>
                        </div>
                        <div className="row mx-auto">
                            <div className="col-md-4">
                                <Link to="/allInOneMedicine" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="box">
                                        <div className="img-box">
                                            <img src={departmentImage2} alt="Cardiology" />
                                        </div>
                                        <div className="detail-box">
                                            <h5>
                                                Medicines
                                            </h5>
                                            <p>
                                                View All Medicines
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to="/add-med" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="box ">
                                        <div className="img-box">
                                            <img src={departmentImage4} alt="Diagnosis" />
                                        </div>
                                        <div className="detail-box">
                                            <h5>
                                                Add Medicine
                                            </h5>
                                            <p>
                                                Add New Medicine.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-4">
                                <Link to="/edit-med" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="box ">
                                        <div className="img-box">
                                            <img src={departmentImage3} alt="Surgery" />
                                        </div>
                                        <div className="detail-box">
                                            <h5>
                                                Edit Medicine
                                            </h5>
                                            <p>
                                                Edit Your Medicines.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                        <div className="row  mx-auto">
                            <div className="col-md-6">
                                <Link to="/prescriptions" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="box ">
                                        <div className="img-box">
                                            <img src={departmentImage1} alt="First Aid" />
                                        </div>
                                        <div className="detail-box">
                                            <h5>
                                                Prescreptions
                                            </h5>
                                            <p>
                                                View All Prescreptions that include your medicines.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                            <div className="col-md-6">
                                <Link to="/salesReport" style={{ textDecoration: 'none', color: 'inherit' }}>
                                    <div className="box ">
                                        <div className="img-box">
                                            <img src={departmentImage1} alt="First Aid" />
                                        </div>
                                        <div className="detail-box">
                                            <h5>
                                                Sales Report
                                            </h5>
                                            <p>
                                                View Sales Report for your Medicines.
                                            </p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* {chatRequests.map((request, index) => (
                <div key={index} className="chat-request-notification">
                    <p>New chat request from {request.patientId}</p>
                    <button onClick={() => acceptChatRequest(request.patientId, request.roomId)}>
                        Accept
                    </button>
                </div>
            ))} */}
            <PharmacistFooter />
            <div className="d-flex justify-content-end">
                <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
                    <div style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: '1000' }}>
                        <Dropdown drop="up">
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                Reply to patients
                            </Dropdown.Toggle>

                            <Dropdown.Menu>
                                {rooms.map((patient) => (
                                    <Dropdown.Item key={patient._id}>
                                        <div className="d-flex align-items-center justify-content-between">
                                            <span>Room</span>
                                            <span style={{ marginLeft: '10px' }}>
                                                {/* Add chat and video icons */}
                                                <FaComment
                                                    style={{ marginRight: '10px', cursor: 'pointer' }}
                                                    onClick={(e) => handleChatClick(e, patient._id)}
                                                />
                                            </span>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default PharmacistDashboard;
