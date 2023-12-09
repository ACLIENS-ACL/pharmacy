import "./styles/Navbar.css";
import { Link } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { animateScroll as scroll } from 'react-scroll';
// import 'https://fonts.googleapis.com/css?family=Rubik:400,700|Crimson+Text:400,400i';


import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// /* Add your custom stylesheets here */
// import './fonts/icomoon/style.css';
// import './styles/bootstrap.min.css';
// import './styles/magnific-popup.css';
// import './styles/jquery-ui.css';
// import './styles/aos.css';
import './styles/style.css';


const Nav = () => {
    const [patient, setPatient] = useState([]);
    const [cartItems, setCartItems] = useState(0);
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
                setPatient(response.data.patient)
                console.log(response.data.patient.cart)
                setCartItems(response.data.patient.cart.length);
            })
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
    return (
        <div class="site-navbar py-2">

            <div class="search-wrap">
                <div class="container">
                    <Link to="#" className="search-close js-search-close"><span class="icon-close2"></span>
                    </Link>
                    <form action="#" method="post">
                        <input type="text" class="form-control" placeholder="Search keyword and hit enter..." />
                    </form>
                </div>
            </div>

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
                                <li class="active">
                                    <Link to="/patient">Home</Link></li>
                                <li onClick={scrollToContact}>
                                    <Link to="/"> About</Link></li>
                                <li> <Link to="/">Contact</Link></li>
                                <li > <Link to="/patient" >Settings</Link></li>
                            </ul>
                        </nav>
                    </div>
                    <div class="icons d-flex align-items-center">
                        <Link to="/view-cart" className="icons-btn d-inline-block bag mr-3" >
                            <span className="icon-shopping-bag">
                                <FontAwesomeIcon icon={faShoppingBag} />
                            </span>
                            <span className="number">{cartItems}</span>
                        </Link>
                        <div>
                            <button onClick={handleLogout} className="btn btn-danger ">Logout</button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
export default Nav;
