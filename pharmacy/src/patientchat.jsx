import "./styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "./images/person_1.jpg";
import logo1 from "./images/person_2.jpg";
import logo2 from "./images/person_3.jpg";
import logo3 from "./images/person_4.jpg";
import backgroundImage from "./images/hero_1.jpg";
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { animateScroll as scroll } from 'react-scroll';
import Footer from './Footer';
import Nav from './Nav';
// import 'https://fonts.googleapis.com/css?family=Rubik:400,700|Crimson+Text:400,400i';

import Slider from 'react-slick';

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// /* Add your custom stylesheets here */
// import './fonts/icomoon/style.css';
// import './styles/bootstrap.min.css';
// import './styles/magnific-popup.css';
// import './styles/jquery-ui.css';
// import './styles/aos.css';
import './styles/style.css';

import bg_1 from "./images/bg_1.jpg";
import bg_2 from "./images/bg_2.jpg";


const PatientDashboard = ({ click }) => {
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

    useEffect(() => {
        const fetchData = async () => {
            console.log(token)
            // Check if a room already exists with the current patient and clicked doctor
            try {
                const response = await axios.post(`http://localhost:3002/createRoompp`,
                    {}, { headers });
                console.log("hi,", response);
                navigate(`/chat/${response.data.roomId}`);
            } catch (error) {
                // Handle errors here
                console.error("Error fetching data:", error);
            }
        };

        fetchData(); // Call the async function

        // Specify an empty dependency array to run the effect only once
    }, [navigate, headers]);

    return (
        <div>
            <Nav />
            <Footer />
        </div>
    );
};

export default PatientDashboard;