// PharmacistNavbar.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Link } from 'react-router-dom';
import heroBg from "./images/hero-bg.png";
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css'; // Import your responsive styles
import { FaWallet,FaSignOutAlt } from 'react-icons/fa';

const PharmacistNavbar = () => {
    const [notifications, setNotifications] = useState([]); // New state for notifications
    const [showNotifications, setShowNotifications] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [pharmacist, setPharmacist] = useState([]);
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
        axios.get(`http://localhost:3002/pharmacistData`, { headers })
            .then((response) => {
                if (response.status === 401) {
                    // Redirect to the login page if the token is invalid
                    navigate('/login');
                } else {
                    setPharmacist(response.data.pharmacist)
                    console.log(response.data.pharmacist.latestNotifications)
                    setNotifications(response.data.pharmacist.latestNotifications)
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
                if (pharmacist.name == null) {
                    navigate('/login');
                }
            });
    }, []);

    const handleLogout = () => {
        // Perform any necessary logout actions (e.g., clearing session or tokens).
        // After logging out, navigate to the login page.
        // Fetch admin data from the server
        // axios.get(`http://localhost:3002/logout`, {headers})
        //   .then((response) => {
        //     const responseData = response.data;
        //     if (responseData.type == "") {
        localStorage.removeItem('token');
        navigate('/login');
        //   }
        // })
    };

    const handleNotificationsToggle = () => {
        setShowNotifications((prevShowNotifications) => !prevShowNotifications);
    };
    const handleGoBack = () => {
        navigate(-1); // This will go back to the previous page
    };
    const [showWallet, setShowWallet] = useState(false);
    const handleWalletToggle = () => {
        setShowWallet((prevShowWallet) => !prevShowWallet);
    };

    return (
        <div className="hero_area">

            <div className="hero_bg_box">
                <img src={heroBg} alt="" />
            </div>
            <header className="header_section" style={{ width: '100%' }}>
                <div className="container-fluid">
                    <nav className="navbar navbar-expand-lg custom_nav-container " >

                        <Link className="navbar-brand" to="/pharmacist">
                            <span>
                                Pharmacy
                            </span>
                        </Link>

                        <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span className=""> </span>
                        </button>

                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav">
                                <li className="nav-item active dropdown no-arrow mx-1">
                                    {/* Add a class to the container for styling */}
                                    <div className="nav-link nav-icon-container"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        data-placement="bottom" onClick={handleGoBack}>
                                        {/* Back Arrow Icon */}
                                        <i className="fas fa-arrow-left" aria-hidden="true"></i>
                                        <span style={{ width: "100px" }} className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Go Back</span>
                                    </div>
                                </li>
                                <li className="nav-item dropdown no-arrow mx-1">
                                    <div
                                        className="nav-link dropdown-toggle"
                                        role="button"
                                        aria-haspopup="true"
                                        data-placement="bottom"
                                        onClick={handleWalletToggle}
                                    >
                                        {/* Use the wallet icon */}
                                        <FaWallet />

                                        {/* Display Wallet text on hover */}
                                        {/* <span className={`hover-text ${showWallet ? 'visible' : 'hidden'}`}>Wallet</span> */}
                                    </div>
                                    {/* Dropdown - Wallet */}
                                    <div className={`wallet-content-container ${showNotifications ? 'd-block' : ''}`} >

                                        {showWallet && (
                                            <div className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in notifications-box d-block`} style={{ paddingRight: "15px", paddingLeft: "15px" }}>

                                                Wallet: {pharmacist.wallet}
                                            </div>
                                        )}
                                    </div>
                                </li>
                                <li className="nav-item dropdown no-arrow mx-1">
                                    <div
                                        className="nav-link dropdown-toggle"
                                        role="button"
                                        aria-haspopup="true"
                                        data-placement="bottom"
                                        onClick={handleNotificationsToggle}
                                    >
                                        {/* Bell Icon for Notifications */}
                                        <i className="fa fa-bell" aria-hidden="true"></i>

                                        {/* Notifications Box */}
                                        <div className={`notifications-box-container ${showNotifications ? 'd-block' : ''}`} >

                                            {showNotifications && (
                                                <div className={`dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in notifications-box d-block`} style={{ paddingRight: "15px", paddingLeft: "15px" }}>
                                                    <h6 className="dropdown-header">
                                                        Notifications
                                                    </h6>
                                                    {notifications.length === 0 ? (
                                                        <p className="m-0">No notifications</p>
                                                    ) : (
                                                        <ul className="list-unstyled m-0">
                                                            {notifications.map((notification, index) => (
                                                                <React.Fragment key={index}>
                                                                    <li className="mb-2">{notification.message}</li>
                                                                    {index < notifications.length - 1 && <hr className="my-2" />}
                                                                </React.Fragment>
                                                            ))}
                                                        </ul>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </li>
                                <li
                                    className="nav-item dropdown no-arrow mx-1"
                                    onMouseEnter={() => setIsHovered(true)}
                                    onMouseLeave={() => setIsHovered(false)}
                                >
                                    <Link
                                        className="nav-link dropdown-toggle"
                                        to="/password-change"
                                        id="settingsDropdown"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        data-placement="bottom"
                                        title="Settings"
                                    >
                                        <i className="fas fa-cogs fa-fw"></i>
                                        {/* Display Settings text on hover */}
                                        <span className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Settings</span>
                                    </Link>
                                    {/* Dropdown - Settings */}
                                    <div
                                        className="dropdown-list dropdown-menu dropdown-menu-right shadow animated--grow-in"
                                        aria-labelledby="settingsDropdown"
                                    >
                                        <h6 className="dropdown-header">
                                            Settings
                                        </h6>
                                    </div>
                                </li>
                                
                                <li className="nav-item active dropdown no-arrow mx-1">
                                    <div onClick={handleLogout}
                                        className="nav-link dropdown-toggle"
                                        role="button"
                                        data-toggle="dropdown"
                                        aria-haspopup="true"
                                        aria-expanded="false"
                                        data-placement="bottom">
                                        <FaSignOutAlt/>
                                        <span className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Logout</span>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>
                </div>
            </header>

            <section className="slider_section ">
                <div id="customCarousel1" className="carousel slide" data-ride="carousel">
                    <div className="carousel-inner">
                        <div className="carousel-item active">
                            <div className="container ">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="detail-box">
                                            <h1>
                                                Welcome DR
                                            </h1>
                                            <h1>
                                                {pharmacist.name}
                                            </h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item ">
                            <div className="container ">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="detail-box">
                                            <h1>
                                                We Provide Best Healthcare
                                            </h1>
                                            <p>
                                                Explicabo esse amet tempora quibusdam laudantium, laborum eaque magnam fugiat hic? Esse dicta aliquid error repudiandae earum suscipit fugiat molestias, veniam, vel architecto veritatis delectus repellat modi impedit sequi.
                                            </p>
                                            <div className="btn-box">
                                                <Link to="" className="btn1">
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel-item">
                            <div className="container ">
                                <div className="row">
                                    <div className="col-md-7">
                                        <div className="detail-box">
                                            <h1>
                                                We Provide Best Healthcare
                                            </h1>
                                            <p>
                                                Explicabo esse amet tempora quibusdam laudantium, laborum eaque magnam fugiat hic? Esse dicta aliquid error repudiandae earum suscipit fugiat molestias, veniam, vel architecto veritatis delectus repellat modi impedit sequi.
                                            </p>
                                            <div className="btn-box">
                                                <Link to="" className="btn1">
                                                    Read More
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </section>
        </div>
    );
};

export default PharmacistNavbar;
