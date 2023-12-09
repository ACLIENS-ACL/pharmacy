// PharmacistNavbar.js
import React from 'react';

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
                        <div className="row">
                            <div className="col-md-3">
                                <Link to="/medicines" style={{ textDecoration: 'none', color: 'inherit' }}>
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
                            <div className="col-md-3">
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
                            <div className="col-md-3">
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
                            <div className="col-md-3">
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
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <PharmacistFooter />
        </div>
    );
};

export default PharmacistDashboard;
