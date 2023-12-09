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
const PatientMedicines = ({ click }) => {
    const [meds, setMeds] = useState([]);
    const [message, setMessage] = useState('');
    const [medicinalUse, setMedicinalUse] = useState('');
    const [medicinalUses, setMedicinalUses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [pmedicines, setPMedicines] = useState([]);
    const [type, setType] = useState([]);
    const [patient, setPatient] = useState([]);
    const [cartItems, setCartItems] = useState(0);
    const [cartUpdated, setCartUpdated] = useState(false);
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

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 9;
    const indexOfLastMed = currentPage * itemsPerPage;
    const indexOfFirstMed = indexOfLastMed - itemsPerPage;
    const currentMeds = meds.slice(indexOfFirstMed, indexOfLastMed);

    const totalPages = Math.ceil(meds.length / itemsPerPage);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };


    const addToCart = (medicine) => {
        console.log(medicine)
        const updatedCart = [...patient.cart];
        const existingCartItem = updatedCart.find((item) => item.medicineId === medicine._id);

        if (existingCartItem) {
            // If the medicine is already in the cart, update the quantity
            existingCartItem.quantity++;
        } else {
            // If it's a new medicine, add it to the cart with name and price
            updatedCart.push({
                medicineId: medicine._id,
                quantity: 1,
                name: medicine.name,
                price: medicine.price,
            });
        }
        setCartItems(updatedCart.length);

        // Send the updated cart data along with the user ID to the backend    
        axios.post(`http://localhost:3002/patient/${patient._id}/cart`, { cart: updatedCart }, { headers })
            .then((response) => {
                // Handle success response if needed
                // For example, you can update the local state here if the request was successful.
                setPatient({ ...patient, cart: updatedCart });
            })
            .catch((error) => {
                console.error(error);
                setMessage('An error occurred while updating the cart.');
            });
    };


    useEffect(() => {
        // Fetch distinct medicinal uses from the server
        axios.get(`http://localhost:3002/medicinal-uses`, { headers })
            .then(response => {
                const responseData = response.data
                setMedicinalUses(responseData.medicinalUses);
                console.log(responseData.medicinalUses)
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicinal uses');
            });

        // Fetch all medicines from the backend
        axios.get('http://localhost:3002/medicinespatient', { headers })
            .then(response => {
                console.log(response.data[0].pharmacyMedicines)
                console.log("2nd one ", response.data[0].clinicMedicines)
                setMedicines(response.data[0].pharmacyMedicines);
                setPMedicines(response.data[0].clinicMedicines)
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicines');
            });
    }, []);

    const getAlternatives = (activeIngredients, currentMedicineName) => {
        const alternatives = [];

        // Loop through medicines to find alternatives
        medicines.forEach((medicine) => {
            // Check if the medicine is different, in stock, and has matching active ingredients
            if (
                medicine.name !== currentMedicineName &&
                medicine.quantity > 0 &&
                medicine.activeIngredients.some((ingredient) =>
                    activeIngredients.includes(ingredient)
                )
            ) {
                alternatives.push(medicine.name);
            }
        });

        return alternatives;
    };
    const handleFilter = (event) => {
        console.log(event)
        setMedicinalUse(event);
        filterMedicines(searchQuery, event);
    };

    const handleSearch = (event) => {
        const input = event.target.value;
        setSearchQuery(input);
        filterMedicines(input, medicinalUse);
    };

    const filterMedicines = (search, filter) => {
        console.log(filter)
        const filtered = medicines.filter(medicine =>
            medicine.name.toLowerCase().startsWith(search.toLowerCase()) &&
            (filter === '' || medicine.medicinalUse === filter) &&
            !medicine.archived
        );
        setMeds(filtered);
    };

    useEffect(() => {
        filterMedicines(searchQuery, medicinalUse);
    }, [searchQuery, medicinalUse, medicines]);
  

    return (
        <div>
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
            <div className="site-section" style={{ backgroundColor: '#e6f7ff', marginBottom: "80px" }}>
                <div class="container">
                    <div className="row">
                        <div className="col-lg-12 align-self-center" style={{ marginLeft: "80px" }}>
                            <div className="d-flex">
                                <h3 className="h6 text-uppercase text-black d-block m-2">Filter by Medical use:</h3>
                                <select
                                    className="form-control ml-2"
                                    style={{ width: "250px", marginRight: "140px" }}
                                    onChange={(e) => handleFilter(e.target.value)}
                                >
                                    <option value="">Medical uses</option>
                                    {medicinalUses.map((use, index) => (
                                        <option key={index} value={use}>
                                            {use}
                                        </option>
                                    ))}
                                </select>
                                <h3 className="h6 text-uppercase text-black d-block m-2">Search by Name:</h3>
                                <input
                                    type="text"
                                    className="form-control ml-80"
                                    placeholder="Search for a medication by name"
                                    value={searchQuery}
                                    onChange={handleSearch}
                                    style={{ width: "400px" }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="row">
                {currentMeds.map((medicine, index) => (
                    <div key={index} className="col-sm-6 col-lg-4 text-center item mb-4">
                        <div className="d-flex flex-column align-items-center">
                            <a href={`shop-single.html?id=${medicine._id}`}>
                                <img
                                    src={`http://localhost:3002/uploads/${encodeURIComponent(medicine.imageUrl.fileName)}`}
                                    alt={medicine.name}
                                    style={{ width: '150px' }}
                                />
                            </a>
                            <h3 className="text-dark">
                                <a href={`shop-single.html?id=${medicine._id}`}>{medicine.name}</a>
                            </h3>
                            {medicine.quantity === 0 && (
                                <div style={{width:"200px"}}>
                                    <p style={{ color: 'red' , fontWeight: 'bold'}}>Out of Stock</p>
                                    {medicine.activeIngredients.length > 0 && (
                                        <p style={{ color: 'green', fontWeight: 'bold' }}>
                                            Alternatives:{' '}
                                            {getAlternatives(
                                                medicine.activeIngredients,
                                                medicine.name
                                            ).join(', ')}
                                        </p>
                                    )}
                                </div>
                            )}
                            {medicine.price && <p className="price">price: ${medicine.price}</p>}
                            {
                                medicine.quantity > 0 && (
                                    medicine.isPrescriptionRequired ? (
                                        pmedicines.includes(medicine.name) ? (
                                            <button onClick={() => addToCart(medicine)} className="btn btn-primary">
                                                Add to Cart
                                            </button>
                                        ) : (
                                            <p style={{ color: 'red', fontWeight: 'bold' }}>This medicine requires a prescription.</p>
                                        )
                                    ) : (
                                        <button onClick={() => addToCart(medicine)} className="btn btn-primary">
                                            Add to Cart
                                        </button>
                                    )
                                )
                            }

                        </div>
                    </div>
                ))}
            </div>

            <div className="pagination d-flex justify-content-center col-md-12 text-center " style={{ backgroundColor: '#e6f7ff', fontSize: '30px', padding: '20px 0' }}>
                <span style={{ marginRight: '10px' }}>Pages:</span>
                <ul className="pagination-list d-flex" style={{ listStyleType: 'none', padding: 0 }}>
                    {Array.from({ length: totalPages }).map((_, index) => (
                        <li
                            key={index}
                            className={`pagination-item ${currentPage === index + 1 ? 'active' : ''}`}
                            style={{
                                margin: '0 8px',
                                borderRadius: '50%',
                                background: currentPage === index + 1 ? '#000' : '#f0f0f0', // Black for active, light gray for non-active
                                padding: '8px',
                                border: currentPage !== index + 1 ? '1px solid #000' : 'none', // Border for non-active
                            }}
                        >
                            <Link
                                to="#"
                                onClick={() => handlePageChange(index + 1)}
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    height: '100%',
                                    textAlign: 'center',
                                    fontSize: '16px',
                                    color: currentPage === index + 1 ? '#fff' : '#000', // White for active, black for non-active
                                    marginTop: '2px',
                                }}
                            >
                                {index + 1}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>




            <Footer />
        </div>
    );
};

export default PatientMedicines;