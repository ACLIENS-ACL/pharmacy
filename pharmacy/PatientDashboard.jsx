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

const testimonies = [
    {
        image: logo,
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore obcaecati maiores voluptate aspernatur iusto eveniet, placeat ab quod tenetur ducimus. Minus ratione sit quaerat unde.',
        author: 'Kelly Holmes',
    },
    {
        image: logo1,
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore obcaecati maiores voluptate aspernatur iusto eveniet, placeat ab quod tenetur ducimus. Minus ratione sit quaerat unde.',
        author: 'Rebecca Morando',
    },
    {
        image: logo2,
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore obcaecati maiores voluptate aspernatur iusto eveniet, placeat ab quod tenetur ducimus. Minus ratione sit quaerat unde.',
        author: 'Lucas Gallone',
    },
    {
        image: logo3,
        text: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Nemo omnis voluptatem consectetur quam tempore obcaecati maiores voluptate aspernatur iusto eveniet, placeat ab quod tenetur ducimus. Minus ratione sit quaerat unde.',
        author: 'Andrew Neel',
    },
];

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
};
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
    const updateCartCount = () => {
        return cartItems;
      };


    return (
        <div>
            {/* <nav className="navbar navbar-expand-lg navbar-dark bg-dark">

                <Link to="/" className="">
                    <span className="logo">
                        <img src={logo} style={{ height: "70px", width: "200px" }} alt="" />
                    </span>
                </Link>

                <ul className="navbar__links">
                    <li>
                        <Link to="/" className="">
                            <span>
                                Home
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/patientMedicine" className="">
                            <span>
                                Medicines
                            </span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/view-cart" className="">
                            <span>
                                Past Orders
                            </span>
                        </Link>
                    </li>
                </ul>

                <ul className="navbar__links">
                    <li>
                        <Link to="/cart" className="cart__link">
                            <i className="fas fa-shopping-cart"></i>
                            <span>
                                Cart <span className="cartlogo__badge">{getCartCount()}</span>
                            </span>
                        </Link>
                    </li>
                    <li>
                        <div className="d-flex justify-content-end mb-2">
                            <button onClick={handleLogout} className="btn btn-danger">Logout</button>
                        </div>
                    </li>
                </ul>

                <div className="hamburger__menu" onClick={click}>
                    <div></div>
                    <div></div>
                    <div></div>
                </div>
            </nav> */}
<Nav  />
            <div className="site-blocks-cover" style={{
                backgroundImage: `url( ${backgroundImage})`
            }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-7 mx-auto order-lg-2 align-self-center">
                            <div className="site-block-cover-content text-center">
                                <h2 className="sub-title">Effective Medicine, New Medicine Everyday</h2>
                                <h1>Welcome {patient.name}</h1>
                                <p>
                                    <Link to="/patientMedicine" className="btn btn-primary px-5 py-3">
                                        Shop Now
                                    </Link>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <div className="site-section">
                <div className="container">
                    <div className="row">
                        <div className="title-section text-center col-12">
                            <h2 className="text-uppercase">Testimonials</h2>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-md-12 block-3 products-wrap">
                            <Slider {...settings}>
                                {testimonies.map((testimony, index) => (
                                    <div key={index} className="testimony">
                                        <blockquote>
                                            <img src={testimony.image} alt="Image" className="img-fluid w-25 mb-4 rounded-circle" />
                                            <p>&ldquo;{testimony.text}&rdquo;</p>
                                        </blockquote>
                                        <p>&mdash; {testimony.author}</p>
                                    </div>
                                ))}
                            </Slider>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="site-section bg-secondary bg-image" style={{ backgroundImage: `url(${bg_1})` }}>
                <div className="container">
                    <div className="row align-items-stretch">
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <Link to="/orders" className="banner-1 h-100 d-flex" style={{ backgroundImage: `url(${bg_1})`,textDecoration:"none" }}>
                                <div className="banner-1-inner align-self-center">
                                    <h2>Past Orders</h2>
                                    <p>
                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae ex ad minus rem odio voluptatem.
                                    </p>
                                </div>
                            </Link>
                        </div>
                        <div className="col-lg-6 mb-5 mb-lg-0">
                            <Link to="/patientchat" className="banner-1 h-100 d-flex justify-content-end" style={{ backgroundImage: `url(${bg_2})`,textDecoration:"none" }}>
                                <div className="banner-1-inner ml-auto align-self-center">
                                    <h2>Chat with Pharmacist</h2>
                                    <p>
                                        Lorem, ipsum dolor sit amet consectetur adipisicing elit. Molestiae ex ad minus rem odio voluptatem.
                                    </p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default PatientDashboard;