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

const NewCheckout = ({ click }) => {
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
            <div class="site-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 mb-5 mb-md-0">
                            <h2 class="h3 mb-3 text-black">Billing Details</h2>
                            <div class="p-3 p-lg-5 border">
                                <div class="form-group">
                                    <label for="c_country" class="text-black">Country <span class="text-danger">*</span></label>
                                    <select id="c_country" class="form-control">
                                        <option value="1">Select a country</option>
                                        <option value="2">bangladesh</option>
                                        <option value="3">Algeria</option>
                                        <option value="4">Afghanistan</option>
                                        <option value="5">Ghana</option>
                                        <option value="6">Albania</option>
                                        <option value="7">Bahrain</option>
                                        <option value="8">Colombia</option>
                                        <option value="9">Dominican Republic</option>
                                    </select>
                                </div>
                                <div class="form-group row">
                                    <div class="col-md-6">
                                        <label for="c_fname" class="text-black">First Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_fname" name="c_fname" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="c_lname" class="text-black">Last Name <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_lname" name="c_lname" />
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col-md-12">
                                        <label for="c_companyname" class="text-black">Company Name </label>
                                        <input type="text" class="form-control" id="c_companyname" name="c_companyname" />
                                    </div>
                                </div>

                                <div class="form-group row">
                                    <div class="col-md-12">
                                        <label for="c_address" class="text-black">Address <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_address" name="c_address" placeholder="Street address" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <input type="text" class="form-control" placeholder="Apartment, suite, unit etc. (optional)" />
                                </div>

                                <div class="form-group row">
                                    <div class="col-md-6">
                                        <label for="c_state_country" class="text-black">State / Country <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_state_country" name="c_state_country" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="c_postal_zip" class="text-black">Posta / Zip <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_postal_zip" name="c_postal_zip" />
                                    </div>
                                </div>

                                <div class="form-group row mb-5">
                                    <div class="col-md-6">
                                        <label for="c_email_address" class="text-black">Email Address <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_email_address" name="c_email_address" />
                                    </div>
                                    <div class="col-md-6">
                                        <label for="c_phone" class="text-black">Phone <span class="text-danger">*</span></label>
                                        <input type="text" class="form-control" id="c_phone" name="c_phone" placeholder="Phone Number" />
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="c_create_account" class="text-black" data-toggle="collapse" href="#create_an_account"
                                        role="button" aria-expanded="false" aria-controls="create_an_account"><input type="checkbox" value="1"
                                            id="c_create_account" /> Create an account?</label>
                                    <div class="collapse" id="create_an_account">
                                        <div class="py-2">
                                            <p class="mb-3">Create an account by entering the information below. If you are a returning customer
                                                please login at the top of the page.</p>
                                            <div class="form-group">
                                                <label for="c_account_password" class="text-black">Account Password</label>
                                                <input type="email" class="form-control" id="c_account_password" name="c_account_password"
                                                    placeholder="" />
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <div class="form-group">
                                    <label for="c_ship_different_address" class="text-black" data-toggle="collapse"
                                        href="#ship_different_address" role="button" aria-expanded="false"
                                        aria-controls="ship_different_address"><input type="checkbox" value="1" id="c_ship_different_address" />
                                        Ship To A Different Address?</label>
                                    <div class="collapse" id="ship_different_address">
                                        <div class="py-2">

                                            <div class="form-group">
                                                <label for="c_diff_country" class="text-black">Country <span class="text-danger">*</span></label>
                                                <select id="c_diff_country" class="form-control">
                                                    <option value="1">Select a country</option>
                                                    <option value="2">bangladesh</option>
                                                    <option value="3">Algeria</option>
                                                    <option value="4">Afghanistan</option>
                                                    <option value="5">Ghana</option>
                                                    <option value="6">Albania</option>
                                                    <option value="7">Bahrain</option>
                                                    <option value="8">Colombia</option>
                                                    <option value="9">Dominican Republic</option>
                                                </select>
                                            </div>


                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <label for="c_diff_fname" class="text-black">First Name <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_fname" name="c_diff_fname" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="c_diff_lname" class="text-black">Last Name <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_lname" name="c_diff_lname" />
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <div class="col-md-12">
                                                    <label for="c_diff_companyname" class="text-black">Company Name </label>
                                                    <input type="text" class="form-control" id="c_diff_companyname" name="c_diff_companyname" />
                                                </div>
                                            </div>

                                            <div class="form-group row">
                                                <div class="col-md-12">
                                                    <label for="c_diff_address" class="text-black">Address <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_address" name="c_diff_address"
                                                        placeholder="Street address" />
                                                </div>
                                            </div>

                                            <div class="form-group">
                                                <input type="text" class="form-control" placeholder="Apartment, suite, unit etc. (optional)" />
                                            </div>

                                            <div class="form-group row">
                                                <div class="col-md-6">
                                                    <label for="c_diff_state_country" class="text-black">State / Country <span
                                                        class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_state_country" name="c_diff_state_country" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="c_diff_postal_zip" class="text-black">Posta / Zip <span
                                                        class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_postal_zip" name="c_diff_postal_zip" />
                                                </div>
                                            </div>

                                            <div class="form-group row mb-5">
                                                <div class="col-md-6">
                                                    <label for="c_diff_email_address" class="text-black">Email Address <span
                                                        class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_email_address" name="c_diff_email_address" />
                                                </div>
                                                <div class="col-md-6">
                                                    <label for="c_diff_phone" class="text-black">Phone <span class="text-danger">*</span></label>
                                                    <input type="text" class="form-control" id="c_diff_phone" name="c_diff_phone"
                                                        placeholder="Phone Number" />
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="c_order_notes" class="text-black">Order Notes</label>
                                    <textarea name="c_order_notes" id="c_order_notes" cols="30" rows="5" class="form-control"
                                        placeholder="Write your notes here..."></textarea>
                                </div>

                            </div>
                        </div>
                        <div class="col-md-6">


                            <div class="row mb-5">
                                <div class="col-md-12">
                                    <h2 class="h3 mb-3 text-black">Your Order</h2>
                                    <div class="p-3 p-lg-5 border">
                                        <table class="table site-block-order-table mb-5">
                                            <thead>
                                                <th>Product</th>
                                                <th>Total</th>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>Bioderma <strong class="mx-2">x</strong> 1</td>
                                                    <td>$55.00</td>
                                                </tr>
                                                <tr>
                                                    <td>Ibuprofeen <strong class="mx-2">x</strong> 1</td>
                                                    <td>$45.00</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
                                                    <td class="text-black">$350.00</td>
                                                </tr>
                                                <tr>
                                                    <td class="text-black font-weight-bold"><strong>Order Total</strong></td>
                                                    <td class="text-black font-weight-bold"><strong>$350.00</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <div class="border mb-3">
                                            <h3 class="h6 mb-0"><a class="d-block" data-toggle="collapse" href="#collapsebank" role="button"
                                                aria-expanded="false" aria-controls="collapsebank">Direct Bank Transfer</a></h3>

                                            <div class="collapse" id="collapsebank">
                                                <div class="py-2 px-4">
                                                    <p class="mb-0">Make your payment directly into our bank account. Please use your Order ID as the
                                                        payment reference. Your order won’t be shipped until the funds have cleared in our account.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="border mb-3">
                                            <h3 class="h6 mb-0"><a class="d-block" data-toggle="collapse" href="#collapsecheque" role="button"
                                                aria-expanded="false" aria-controls="collapsecheque">Cheque Payment</a></h3>

                                            <div class="collapse" id="collapsecheque">
                                                <div class="py-2 px-4">
                                                    <p class="mb-0">Make your payment directly into our bank account. Please use your Order ID as the
                                                        payment reference. Your order won’t be shipped until the funds have cleared in our account.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="border mb-5">
                                            <h3 class="h6 mb-0"><a class="d-block" data-toggle="collapse" href="#collapsepaypal" role="button"
                                                aria-expanded="false" aria-controls="collapsepaypal">Paypal</a></h3>

                                            <div class="collapse" id="collapsepaypal">
                                                <div class="py-2 px-4">
                                                    <p class="mb-0">Make your payment directly into our bank account. Please use your Order ID as the
                                                        payment reference. Your order won’t be shipped until the funds have cleared in our account.</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div class="form-group">
                                            <button class="btn btn-primary btn-lg btn-block" onclick="window.location='thankyou.html'">Place
                                                Order</button>
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

export default NewCheckout;