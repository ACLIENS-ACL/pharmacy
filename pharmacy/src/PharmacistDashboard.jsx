// PharmacistNavbar.js
import React from 'react';
import io from 'socket.io-client';

import { Link, useNavigate } from 'react-router-dom';
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
const PharmacistDashboard = () => {
    // const [chatRequests, setChatRequests] = useState([]);

    // useEffect(() => {
    //     // Listen for chat request notifications
    //     socket.on('chat-request-notification', (data) => {
    //         setChatRequests((prevRequests) => [...prevRequests, data]);
    //     });

    //     return () => {
    //         // Clean up socket event listener when component unmounts
    //         socket.off('chat-request-notification');
    //     };
    // }, []);

    // // Function to handle accepting the chat request
    // const acceptChatRequest = (patientId, roomId) => {
    //     // Emit an event to inform the server that the request is accepted
    //     socket.emit('accept-chat-request', { patientId, roomId });
    //     // You can add further logic here, for example, redirecting to the chat page
    // };
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
        </div>
    );
};

export default PharmacistDashboard;
