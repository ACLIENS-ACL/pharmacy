import "./styles/Navbar.css";
import { Link, NavLink } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag, faSignOut } from '@fortawesome/free-solid-svg-icons';
import { animateScroll as scroll } from 'react-scroll';
// import 'https://fonts.googleapis.com/css?family=Rubik:400,700|Crimson+Text:400,400i';

import { FaWallet } from 'react-icons/fa';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// /* Add your custom stylesheets here */
// import './fonts/icomoon/style.css';
// import './styles/bootstrap.min.css';
// import './styles/magnific-popup.css';
// import './styles/jquery-ui.css';
// import './styles/aos.css';
import './styles/style.css';

import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css'; // Import your responsive styles



const Nav = () => {
    const [patient, setPatient] = useState([]);
    const [cartItems, setCartItems] = useState(0);
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate();
    const token = localStorage.getItem('patientToken');
    const headers = {
        Authorization: `Bearer ${token}`,
    };

    useEffect(() => {
        if (token === null) {
            navigate('/login');
        }
    }, [token, navigate]);
    const scrollToContact = () => {
        console.log(token)
        scroll.scrollToBottom({ smooth: true }); // Scroll to the bottom smoothly
    };

    useEffect(() => {
        axios.get(`http://localhost:3002/patientData`, { headers })
            .then((response) => {
                console.log(token)
                setPatient(response.data.patient)
                console.log(response.data.patient.cart.length)
                setCartItems(response.data.patient.cart.length);
            })
    }, []);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    const handleGoBack = () => {
        navigate(-1); // This will go back to the previous page
    };
    const [showWallet, setShowWallet] = useState(false);
    const handleWalletToggle = () => {
        setShowWallet((prevShowWallet) => !prevShowWallet);
    };
    const handleNotificationsToggle = () => {
        setShowNotifications((prevShowNotifications) => !prevShowNotifications);
    };
    return (
        <div class="site-navbar py-2">

            <div class="container">
                <div class="d-flex align-items-center justify-content-between">
                    <div class="logo">
                        <div class="site-logo">
                            <Link to="/patient" class="js-logo-clone">Pharma</Link>
                        </div>
                    </div>
                    <div class="main-nav d-none d-lg-block">
                        <nav class="site-navigation text-right text-md-center" role="navigation">
                            <ul class="site-menu js-clone-nav d-none d-lg-block">
                                <li>
                                    <NavLink exact to="/patient" activeClassName="active">
                                        Home
                                    </NavLink>
                                </li>
                                <li>
                                    <span className="nav-link" onClick={scrollToContact}>
                                        ABOUT
                                    </span>
                                </li>
                                <li>
                                    <NavLink to="/password-patient" activeClassName="active">
                                        Settings
                                    </NavLink>
                                </li>
                            </ul>
                        </nav>
                    </div>
                    <div class="icons d-flex align-items-center">
                        <div className="nav-item active dropdown no-arrow mx-1">
                            {/* Add a class to the container for styling */}
                            <div className="nav-link nav-icon-container"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                data-placement="bottom" onClick={handleGoBack}>
                                {/* Back Arrow Icon */}
                                <i className="fas fa-arrow-left" aria-hidden="true"></i>
                                <span style={{ width: "80px" }} className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Go Back</span>
                            </div>
                        </div>
                        <Link to="/view-cart" className="icons-btn d-inline-block bag mr-3" >
                            <span className="icon-shopping-bag">
                                <FontAwesomeIcon icon={faShoppingBag} />
                            </span>
                            <span className="number">{cartItems}</span>
                        </Link>
                        <div className="nav-item dropdown no-arrow mx-1">
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

                                        Wallet: {patient.wallets}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="nav-item active dropdown no-arrow mx-1 logout-icon">
                            <div onClick={handleLogout}
                                className="nav-link dropdown-toggle"
                                role="button"
                                data-toggle="dropdown"
                                aria-haspopup="true"
                                aria-expanded="false"
                                data-placement="bottom">
                                <FontAwesomeIcon icon={faSignOut} />
                                <span className={`hover-text ${isHovered ? 'visible' : 'hidden'}`}>Logout</span>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Nav;
