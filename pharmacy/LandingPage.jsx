import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import BG1 from './images/bg_3.jpg';
import logo from './images/logo.png';
import heroImage from './images/hero_1.jpg';
import departmentImage1 from './images/s1.png';
import departmentImage2 from './images/s2.png';
import departmentImage3 from './images/s3.png';
import departmentImage4 from './images/s4.png';
import aboutImage from './images/about-img.jpg';
import doctorImage1 from './images/d1.jpg';
import doctorImage2 from './images/d2.jpg';
import doctorImage3 from './images/d3.jpg';
import clientImage1 from './images/client.jpg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLongArrowLeft, faLongArrowRight } from '@fortawesome/free-solid-svg-icons';

import { FaFacebook, FaTwitter, FaYoutube, FaLinkedin } from 'react-icons/fa';

// Import required font-awesome icons
import './css/font-awesome.min.css';
import "https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Include Bootstrap CSS
const LandingPage = () => {
    localStorage.removeItem('token');

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorUsername, setErrorUsername] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const navigate = useNavigate();
    const handleNavigation = async (e) => {
        if (username) {
            navigate('/password-reset')
        }
        else {
            navigate('/register')
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {


            const type = await axios.get('http://localhost:3002/getType', {
                params: { username: username },
            });
            console.log(type.data.userType)

            const userType = type.data.userType
            if (userType === "not found") {
                setErrorUsername("invalid username")
            }
            else {
                const result = await axios.post(`http://localhost:3002/login-${userType}`, { username, password });

                const { message, token } = result.data;

                if (userType == "patient") {
                    localStorage.setItem('patientToken', token);
                }
                if (message === 'Success But Not Enrolled') {
                    const { token2 } = result.data;
                    localStorage.setItem('token', token2);
                    navigate('/makeReq');
                } else if (message === 'Waiting for contract') {
                    navigate('/contract');
                } else if (message === 'Success' || message === 'success') {
                    alert(message);
                    const decodedToken = jwtDecode(token);
                    if (decodedToken.type.toLowerCase() === 'admin') {
                        localStorage.setItem('adminToken', token);
                        navigate('/admin');
                    } else if (decodedToken.type.toLowerCase() === 'pharmacist') {
                        localStorage.setItem('pharmacistToken', token);
                        navigate('/pharmacist');
                    } else if (decodedToken.type.toLowerCase() === 'patient') {
                        localStorage.setItem('patientToken', token);
                        navigate('/patient');
                    } else {
                        navigate('/register');
                    }
                }
                if (message === "username isn't registered") {
                    setErrorUsername(message);
                    setErrorPassword('');
                }
                else if (message === "Password incorrect")
                    setErrorUsername("");
                setErrorPassword(message);
            }
        } catch (err) {
            console.log(err);
            alert("Hello")
        }
    }
    const [activeIndex, setActiveIndex] = useState(0);

    const handlePrev = () => {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? 2 : prevIndex - 1));
    };

    const handleNext = () => {
        setActiveIndex((prevIndex) => (prevIndex === 2 ? 0 : prevIndex + 1));
    };
    return (
        <div className="hero_area">
            {/* Header Section */}
            <div className="hero_area">
                <div className="hero_bg_box" style={{
                    backgroundColor: "rgb(90, 90, 227,0.4)"
                }}>
                    <img src={BG1} alt="" style={{ opacity: "0.5" }} />
                </div>
                <header className="header_section">
                    <div className="container-fluid" >
                        <nav className="navbar navbar-expand-lg custom_nav-container" style={{ borderRadius: '20px' }}>
                            <Link className="navbar-brand" to="/">
                                <span>
                                    Pharma
                                </span>
                            </Link>

                            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                                <span class=""> </span>
                            </button>
                            <div className="d-flex align-items-center">
                                <input
                                    type="text"
                                    className={`form-control form-control-sm me-2 ${errorUsername ? 'is-invalid' : ''}`}
                                    style={{ maxWidth: '120px', borderColor: errorUsername ? 'red' : '' }}
                                    placeholder="Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />

                                <input
                                    type="password"
                                    className={`form-control form-control-sm me-2 ${errorPassword ? 'is-invalid' : ''}`}
                                    style={{ maxWidth: '120px', borderColor: errorPassword ? 'red' : '' }}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <button className="btn btn-sm btn-primary rounded-pill" style={{ backgroundColor: "blue", borderColor: "blue" }} onClick={(e) => handleSubmit(e)}>
                                    Login
                                </button>
                                <a
                                    className="ms-2"
                                    style={{
                                        textDecoration: 'none',
                                        color: 'grey',
                                        cursor: 'pointer',
                                        transition: 'color 0.2s, text-decoration 0.2s',
                                    }}
                                    onMouseOver={(e) => {
                                        e.target.style.textDecoration = 'underline';
                                        e.target.style.color = 'navy';
                                    }}
                                    onMouseOut={(e) => {
                                        e.target.style.textDecoration = 'none';
                                        e.target.style.color = 'grey';
                                    }}
                                    onClick={(e) => handleNavigation(e)}
                                >
                                    {username ? "Forgot Password?" : "Don't have an Account?"}
                                </a>
                            </div>
                        </nav>
                    </div>
                </header>

                {/* Slider Section */}
                <section className="slider_section">
                    <div id="customCarousel1" className="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            <div class="carousel-item active">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-md-7">
                                            <div class="detail-box">
                                                <h1 >
                                                    WELCOME TO PHARMA<br />
                                                </h1>
                                                <p>
                                                    EFFECTIVE MEDICINE, NEW MEDICINE EVERYDAY
                                                </p>
                                                <div class="btn-box">
                                                    <a href="/register" class="btn1">
                                                        Sign Up Now
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="carousel-item ">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-md-7">
                                            <div class="detail-box">
                                                <h1>
                                                    We Provide Best Healthcare
                                                </h1>
                                                <p>
                                                    Explicabo esse amet tempora quibusdam laudantium, laborum eaque magnam fugiat hic? Esse dicta aliquid error repudiandae earum suscipit fugiat molestias, veniam, vel architecto veritatis delectus repellat modi impedit sequi.
                                                </p>
                                                <div class="btn-box">
                                                    <a href="" class="btn1">
                                                        Read More
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="carousel-item">
                                <div class="container ">
                                    <div class="row">
                                        <div class="col-md-7">
                                            <div class="detail-box">
                                                <h1>
                                                    WELCOME TO PHARMA<br />
                                                    We Provide Best Healthcare
                                                </h1>
                                                <p>
                                                    EFFECTIVE MEDICINE, NEW MEDICINE EVERYDAY
                                                </p>
                                                <div class="btn-box">
                                                    <a href="" class="btn1">
                                                        Read More
                                                    </a>
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

            {/* About Section */}
            <section className="about_section layout_margin-bottom">
                <div className="container">
                    <div class="row">
                        <div class="col-md-6 ">
                            <div class="img-box">
                                <img src={aboutImage} alt="" />
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="detail-box">
                                <div class="heading_container">
                                    <h2>
                                        About <span>Us</span>
                                    </h2>
                                </div>
                                <p>
                                    There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration
                                    in some form, by injected humour, or randomised words which don't look even slightly believable. If you
                                    are going to use a passage of Lorem Ipsum, you need to be sure there isn't anything embarrassing hidden in
                                    the middle of text. All
                                </p>
                                <a href="">
                                    Read More
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Doctor Section */}
            {/* <section className="doctor_section layout_padding">
                <div className="container">
                    <div class="heading_container heading_center">
                        <h2>
                            Our Doctors
                        </h2>
                        <p class="col-md-10 mx-auto px-0">
                            Incilint sapiente illo quo praesentium officiis laudantium nostrum, ad adipisci cupiditate sit, quisquam aliquid. Officiis laudantium fuga ad voluptas aspernatur error fugiat quos facilis saepe quas fugit, beatae id quisquam.
                        </p>
                    </div>
                    <div class="row">
                        <div class="col-sm-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={doctorImage1} alt="" />
                                </div>
                                <div class="detail-box">
                                    <div class="social_box" >
                                        <a href="">
                                            <FaFacebook />
                                        </a>
                                        <a href="">
                                            <FaTwitter />
                                        </a>
                                        <a href="">
                                            <FaLinkedin />
                                        </a>
                                        <a href="">
                                            <FaYoutube />
                                        </a>
                                    </div>
                                    <h5>
                                        Elina Josh
                                    </h5>
                                    <h6 class="">
                                        Doctor
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={doctorImage2} alt="" />
                                </div>
                                <div class="detail-box">
                                    <div class="social_box" >
                                        <a href="">
                                            <FaFacebook />
                                        </a>
                                        <a href="">
                                            <FaTwitter />
                                        </a>
                                        <a href="">
                                            <FaLinkedin />
                                        </a>
                                        <a href="">
                                            <FaYoutube />
                                        </a>
                                    </div>
                                    <h5>
                                        Adam View
                                    </h5>
                                    <h6 class="">
                                        Doctor
                                    </h6>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-6 col-lg-4 mx-auto">
                            <div class="box">
                                <div class="img-box">
                                    <img src={doctorImage3} alt="" />
                                </div>
                                <div class="detail-box">
                                    <div class="social_box" >
                                        <a href="">
                                            <FaFacebook />
                                        </a>
                                        <a href="">
                                            <FaTwitter />
                                        </a>
                                        <a href="">
                                            <FaLinkedin />
                                        </a>
                                        <a href="">
                                            <FaYoutube />
                                        </a>
                                    </div>
                                    <h5>
                                        Mia Mike
                                    </h5>
                                    <h6 class="">
                                        Doctor
                                    </h6>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}


            {/* Client Section */}
            <section className="client_section layout_padding-bottom" style={{ marginTop: "40px" }}>
                <div className="container">
                    <div class="heading_container heading_center ">
                        <h2>
                            Testimonial
                        </h2>
                    </div>
                    <div id="carouselExample2Controls" class="carousel slide" data-ride="carousel">
                        <div class="carousel-inner">
                            <div className={`carousel-item ${activeIndex === 0 ? 'active' : ''}`}>
                                <div className="row">
                                    <div className="col-md-11 col-lg-10 mx-auto">
                                        <div className="box">
                                            <div className="img-box">
                                                <img src={clientImage1} alt="" />
                                            </div>
                                            <div className="detail-box">
                                                <div className="name">
                                                    <h6>
                                                        Alan Emerson
                                                    </h6>
                                                </div>
                                                <p>
                                                    Enim consequatur odio assumenda voluptas voluptatibus esse nobis officia. Magnam, aspernatur nostrum explicabo, distinctio laudantium delectus deserunt quia quidem magni corporis earum inventore totam consectetur corrupti! Corrupti, nihil sunt? Natus.
                                                </p>
                                                <i className="fa fa-quote-left" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class={`carousel-item ${activeIndex === 1 ? 'active' : ''}`} >
                                <div class="row">
                                    <div class="col-md-11 col-lg-10 mx-auto">
                                        <div class="box">
                                            <div class="img-box">
                                                <img src={clientImage1} alt="" />
                                            </div>
                                            <div class="detail-box">
                                                <div class="name">
                                                    <h6>
                                                        Alan2 Emerson
                                                    </h6>
                                                </div>
                                                <p>
                                                    Enim consequatur odio assumenda voluptas voluptatibus esse nobis officia. Magnam, aspernatur nostrum explicabo, distinctio laudantium delectus deserunt quia quidem magni corporis earum inventore totam consectetur corrupti! Corrupti, nihil sunt? Natus.
                                                </p>
                                                <i class="fa fa-quote-left" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class={`carousel-item ${activeIndex === 2 ? 'active' : ''}`}>
                                <div class="row">
                                    <div class="col-md-11 col-lg-10 mx-auto">
                                        <div class="box">
                                            <div class="img-box">
                                                <img src={clientImage1} alt="" />
                                            </div>
                                            <div class="detail-box">
                                                <div class="name">
                                                    <h6>
                                                        another alan Emerson
                                                    </h6>
                                                </div>
                                                <p>
                                                    Enim consequatur odio assumenda voluptas voluptatibus esse nobis officia. Magnam, aspernatur nostrum explicabo, distinctio laudantium delectus deserunt quia quidem magni corporis earum inventore totam consectetur corrupti! Corrupti, nihil sunt? Natus.
                                                </p>
                                                <i class="fa fa-quote-left" aria-hidden="true"></i>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="carousel_btn-container">
                            <a className="carousel-control-prev" href="#carouselExample2Controls" role="button" data-slide="prev" onClick={handlePrev}>
                                <FontAwesomeIcon icon={faLongArrowLeft} />
                                <span className="visually-hidden">Previous</span>
                            </a>
                            <a className="carousel-control-next" href="#carouselExample2Controls" role="button" data-slide="next" onClick={handleNext}>
                                <FontAwesomeIcon icon={faLongArrowRight} />
                                <span className="visually-hidden">Next</span>
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer Section */}
            <footer className="footer_section">
                <div className="container">
                    <div class="row">
                        <div class="col-md-6 col-lg-3 footer_col">
                            <div class="footer_contact">
                                <h4>
                                    Reach at..
                                </h4>
                                <div class="contact_link_box">
                                    <a href="">
                                        <i class="fa fa-map-marker" aria-hidden="true"></i>
                                        <span>
                                            Location
                                        </span>
                                    </a>
                                    <a href="">
                                        <i class="fa fa-phone" aria-hidden="true"></i>
                                        <span>
                                            Call +01 1234567890
                                        </span>
                                    </a>
                                    <a href="">
                                        <i class="fa fa-envelope" aria-hidden="true"></i>
                                        <span>
                                            demo@gmail.com
                                        </span>
                                    </a>
                                </div>
                            </div>
                            <div class="footer_social">
                                <a href="">
                                    <i class="fa fa-facebook" aria-hidden="true"></i>
                                </a>
                                <a href="">
                                    <i class="fa fa-twitter" aria-hidden="true"></i>
                                </a>
                                <a href="">
                                    <i class="fa fa-linkedin" aria-hidden="true"></i>
                                </a>
                                <a href="">
                                    <i class="fa fa-instagram" aria-hidden="true"></i>
                                </a>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3 footer_col">
                            <div class="footer_detail">
                                <h4>
                                    About
                                </h4>
                                <p>
                                    Beatae provident nobis mollitia magnam voluptatum, unde dicta facilis minima veniam corporis laudantium alias tenetur eveniet illum reprehenderit fugit a delectus officiis blanditiis ea.
                                </p>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-2 mx-auto footer_col">
                            <div class="footer_link_box">
                                <h4>
                                    Links
                                </h4>
                                <div class="footer_links">
                                    <a class="active" href="index.html">
                                        Home
                                    </a>
                                    <a class="" href="about.html">
                                        About
                                    </a>
                                    <a class="" href="departments.html">
                                        Departments
                                    </a>
                                    <a class="" href="doctors.html">
                                        Doctors
                                    </a>
                                    <a class="" href="contact.html">
                                        Contact Us
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div class="col-md-6 col-lg-3 footer_col ">
                            <h4>
                                Newsletter
                            </h4>
                            <form action="#">
                                <input type="email" placeholder="Enter email" />
                                <button type="submit">
                                    Subscribe
                                </button>
                            </form>
                        </div>
                    </div>
                    <div class="footer-info">
                        <p>
                            &copy; <span id="displayYear"></span> All Rights Reserved By
                            <a href="https://html.design/">Free Html Templates<br /><br /></a>
                            &copy; <span id="displayYear"></span> Distributed By
                            <a href="https://themewagon.com/">ThemeWagon</a>
                        </p>

                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
