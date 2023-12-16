import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from 'react-router-dom';
import PharmacistNavbar from './PharmacistNavBar'
import PharmacistFooter from './PharmacistFooter'

import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
function Prescriptions() {
    const [Prescreptions, setPrescreptions] = useState([]);
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
        axios.get(`http://localhost:3002/prescriptions`, { headers })
            .then((response) => {
                if (response.status === 401) {
                    // Redirect to the login page if the token is invalid
                    navigate('/login');
                } else {
                    setPrescreptions(response.data.prescriptions)
                    console.log(response.data.prescriptions)
                }
            })
            .catch(error => {
                // Handle API call errors
                console.error('Error fetching data:', error);

                // Check the status code in the error response
                if (error.response && error.response.status === 401) {
                    // Redirect to the login page if the token is invalid
                    navigate('/login');
                } else {
                    // Handle other error cases as needed
                }
            });
        if (Prescreptions == null) {
            navigate('/login');
        }
    }, []);

    const handleChatButtonClick = async (doctorId) => {
        try {
            const response = await axios.post(
                'http://localhost:3002/createRoom',
                { DoctorId: doctorId },
                { headers }
            );

            if (response.data.roomId) {
                // The chat room was successfully created
                // You can redirect to the chat page or perform additional actions
                console.log(`Chat room created with ID: ${response.data.roomId}`);
                navigate(`/chatdr/${response.data.roomId}`)
            } else {
                console.error('Failed to create chat room');
            }
        } catch (error) {
            console.error('Error creating chat room:', error);
        }
    };


    return (
        <div>
            <PharmacistNavbar />


            <div className="container mt-4">
                <h2 className="mb-4">Prescriptions</h2>
                <ul className="list-unstyled">
                    {Prescreptions.map((prescription) => (
                        <li key={prescription._id} className="card mb-4">
                            <div className="card-body">
                                <h5 className="card-title mb-2 font-weight-bold">Medicines:</h5>
                                <ul className="list-group">
                                    {prescription.medicines.map((medicine) => (
                                        <li key={medicine._id} className="list-group-item">
                                            <p className="mb-0">Name: {medicine.name}</p>
                                            <p className="mb-0">Dose: {medicine.dose.daily} times a day for {medicine.dose.days} days</p>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    type="button"
                                    className="btn btn-primary mt-3" style={{ backgroundColor: "#1fab89", borderColor: "#1fab89" }}
                                    onClick={() => handleChatButtonClick(prescription.doctorID)}
                                >
                                    Chat with Doctor
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
            <PharmacistFooter />
        </div>
    );

}
export default Prescriptions;
