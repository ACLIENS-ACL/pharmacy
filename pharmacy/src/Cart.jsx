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

const NewCart = ({ click }) => {
    const [meds, setMeds] = useState([]);
    const [message, setMessage] = useState('');
    const [medicinalUse, setMedicinalUse] = useState('');
    const [medicinalUses, setMedicinalUses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [medicines, setMedicines] = useState([]);
    const [pmedicines, setPMedicines] = useState([]);
    const [type, setType] = useState([]);
    const [patient, setPatient] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
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

    useEffect(() => {
        axios.get(`http://localhost:3002/patientData`, { headers })
            .then((response) => {
                setPatient(response.data.patient)
                console.log(response.data.patient.cart)
            })
    }, []);

    const removeItem = (itemId) => {
        console.log("iam here", itemId)
        const updatedCart = cartItems.filter((item) => item.name !== itemId);
        setCartItems(updatedCart);
        axios
            .post('http://localhost:3002/remove-item', { cart: updatedCart }, { headers })
            .then((response) => {
                navigate('/view-cart');
            })
            .catch((error) => {
                console.error('Error removing item:', error);
            });
    };

    const updateQuantity = (itemId, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(itemId);
        } else {
            const updatedCart = cartItems.map((item) => {
                if (item.name === itemId) {
                    return { ...item, quantity: newQuantity };
                }
                return item;
            });
            setCartItems(updatedCart);

            axios
                .post('http://localhost:3002/update-quantity', { cart: updatedCart }, { headers })
                .then((response) => { })
                .catch((error) => {
                    console.error('Error updating quantity:', error);
                });
        }
    };

    const handleConfirmOrder = () => {
        navigate('/checkOut', { state: { cart: cartItems } });
    };

    useEffect(() => {
        axios
            .get('http://localhost:3002/view-cart', { headers })
            .then((response) => {
                const responseData = response.data;
                console.log(responseData.patientRequests.cart)
                setCartItems(responseData.patientRequests.cart);

            })
            .catch((error) => {
                console.error('Error fetching cart data:', error);
            });
    }, [navigate]);

    useEffect(() => {
        // Fetch all medicines from the backend
        axios.get('http://localhost:3002/medicinespatient', { headers })
            .then(response => {
                console.log(response.data[0].pharmacyMedicines)
                console.log("2nd one ", response.data[0].clinicMedicines)
                setMedicines(response.data[0].pharmacyMedicines);
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicines');
            });
    }, []);

    const getImageUrl = (medicineId) => {
        const medicine = medicines.find((med) => med._id === medicineId);
        return medicine ? `http://localhost:3002/uploads/${encodeURIComponent(medicine.imageUrl.fileName)}` : '';
    };

    return (
        <div>
            <Nav />

            <div className="site-section">
                <div className="container">
                    <div className="col-md-12">
                        <div className="row mb-5">
                            <div className="col-md-6 h2 text-black">
                                Your Cart:
                            </div>
                            <div className="col-md-6 d-flex justify-content-end">
                                <button className="btn btn-outline-primary btn-md btn-block">Continue Shopping</button>
                            </div>
                        </div>
                    </div>
                    <div className="row mb-5">
                        <form className="col-md-12" method="post">
                            <div className="site-blocks-table">
                                <table className="table table-bordered">
                                    <thead>
                                        <tr>
                                            <th className="product-thumbnail">Image</th>
                                            <th className="product-name">Product</th>
                                            <th className="product-price">Price</th>
                                            <th className="product-quantity">Quantity</th>
                                            <th className="product-total">Total</th>
                                            <th className="product-remove">Remove</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {cartItems.map((item, index) => (
                                            <tr key={index}>
                                                <td className="product-thumbnail">
                                                    <img src={getImageUrl(item.medicineId)} alt="Medicine" className="img-fluid" />
                                                </td>
                                                <td className="product-name">
                                                    <h2 className="h5 text-black">{item.name}</h2>
                                                </td>
                                                <td>${item.price}</td>
                                                <td style={{ width: "165px" }}>
                                                    <div className="input-group mb-3 " style={{ maxWidth: '120px' }}>
                                                        <div className="input-group-prepend ml-10">
                                                            <button className="btn btn-outline-primary js-btn-minus" type="button"
                                                                onClick={() => updateQuantity(item.name, item.quantity - 1)}>
                                                                &minus;
                                                            </button>
                                                        </div>
                                                        <input
                                                            type="text"
                                                            className="form-control text-center"
                                                            value={item.quantity}
                                                            placeholder=""
                                                            aria-label="Example text with button addon"
                                                            aria-describedby="button-addon1"
                                                        />
                                                        <div className="input-group-append">
                                                            <button className="btn btn-outline-primary js-btn-plus" type="button"
                                                                onClick={() => updateQuantity(item.name, item.quantity + 1)}>
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td>${item.quantity * item.price}</td>
                                                <td>
                                                    <Link to="/view-cart">
                                                        <button className="btn btn-primary height-auto btn-sm" onClick={() => removeItem(item.name)}>
                                                            X
                                                        </button>
                                                    </Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                    <div className="row">
                        <div className="row d-flex justify-content-end">
                            <div className="col-md-6 pl-5">
                                <div className="row  d-flex justify-content-end">
                                    <div className="col-md-7">
                                        <div className="row mb-3">
                                            <div className="col-md-12 text-right border-bottom ">
                                                <h3 className="text-black h4 text-uppercase d-flex justify-content-between">Cart Total:
                                                    <strong className="text-black ">${total.toFixed(2)}</strong></h3>
                                            </div>
                                        </div>
                                        <div className="row ">
                                            <div className="col-md-12">
                                                <button
                                                    className="btn btn-primary btn-lg btn-block"
                                                    onClick={handleConfirmOrder}
                                                >
                                                    Proceed To Checkout
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default NewCart;