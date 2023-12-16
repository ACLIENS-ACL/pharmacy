import "./styles/Navbar.css";
import { Link } from "react-router-dom";
import logo from "./images/person_1.jpg";
import logo1 from "./images/person_2.jpg";
import logo2 from "./images/person_3.jpg";
import logo3 from "./images/person_4.jpg";
import backgroundImage from "./images/hero_1.jpg";
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingBag } from '@fortawesome/free-solid-svg-icons';
import { animateScroll as scroll } from 'react-scroll';
import Footer from './Footer';
import Nav from './Nav';
// import 'https://fonts.googleapis.com/css?family=Rubik:400,700|Crimson+Text:400,400i';

import Slider from 'react-slick';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('pk_test_51O88P5HzoCWXbTYqT8xDcGsLRVepjiG6k4KqILsc5mIxkTraEfRqAP9N6Vr3yRdQHDcuB8R4M5C754kjshcm1JtM0051zRZXTh');

import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// /* Add your custom stylesheets here */
// import './fonts/icomoon/style.css';
// import './styles/bootstrap.min.css';
// import './styles/magnific-popup.css';
// import './styles/jquery-ui.css';
// import './styles/aos.css';
import './styles/style.css';

const CheckoutForm = ({ onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            // Stripe.js has not yet loaded.
            return;
        }

        const card = elements.getElement(CardElement);

        const { tokenn, error } = await stripe.createToken(card);

        if (error) {
            console.error(error);
        } else {
            // Send the tokenn to your server to charge the user.
            // You can handle the server-side logic for payment here.

            // Example: Call your API to handle the payment
            const response = await axios.post('your-payment-endpoint', { tokenn });
            if (response.data.success) {
                onPaymentSuccess();
            }
        }
    };

    return (
        <form className="payment-formm" onSubmit={handleSubmit}>
            <div className="card-elementm">
                <CardElement />
            </div>
        </form>
    );
};

const NewCheckout = ({ click }) => {
    const [message, setMessage] = useState('');
    const [deliveryAddresses, setDeliveryAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState('');
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
    const [walletBalance, setWalletBalance] = useState(0);
    const location = useLocation();
    const [medicines, setMedicines] = useState([]);
    const [patient, setPatient] = useState([]);
    const [cartItems, setCartItems] = useState([]);
    const cartData = location.state?.cart || [];
    const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const [newAddress, setNewAddress] = useState('');
    const [existingAddresses, setExistingAddresses] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
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
        axios.get('http://localhost:3002/patientData', { headers })
            .then((response) => {
                setPatient(response.data.patient)
                console.log(response.data.patient.cart)
            })
    }, []);

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
    }; useEffect(() => {
        // Fetch the wallet balance from the server
        axios.get('http://localhost:3002/wallet-balance', { headers }) // Adjust the endpoint as needed
            .then((response) => {
                setWalletBalance(response.data.balance);
            })
            .catch((error) => {
                console.error('Error fetching wallet balance:', error);
            });
    }, []);

    useEffect(() => {
        // Fetch delivery addresses from the server
        axios
            .get('http://localhost:3002/delivery-addresses', { headers })
            .then((response) => {
                const responseData = response.data;
                // if (responseData.userType === 'patient' && responseData.sessi === true) {
                setDeliveryAddresses(responseData.patientRequests[0].deliveryAddresses);
                console.log(responseData.patientRequests[0].deliveryAddresses)
                // } else {
                //   navigate('/login');
                // }
            })
            .catch((error) => {
                console.error('Error fetching delivery addresses:', error);
            });
    }, [navigate]);

    const handleAddressChange = (event) => {
        setSelectedAddress(event.target.value);
    };
    const handleNewAddressChange = (event) => {
        setNewAddress(event.target.value);
    };

    const placeOrder = async () => {
        console.log("hello,".selectedAddress, selectedPaymentMethod)
        if ((newAddress == '' && !selectedAddress) || !selectedPaymentMethod) {
            alert('Please select a delivery address and payment method.');
            return;
        }
        var orderData = {
            cart: cartData,
            deliveryAddress: selectedAddress,
            paymentMethod: selectedPaymentMethod,
        };
        if (newAddress == '') {
            setErrorMessage('Please Add an Address');
        }
        else if (newAddress != '') {
             orderData = {
                cart: cartData,
                deliveryAddress: newAddress,
                paymentMethod: selectedPaymentMethod,
            };
            // Create a new array with the existing addresses and the new address
            const updatedAddresses = [...existingAddresses, newAddress];
            console.log(updatedAddresses)

            // Send the updated addresses to the backend
            await axios
                .post('http://localhost:3002/add-address', { addresses: updatedAddresses }, { headers })
                .then((response) => {

                    // Handle the response if needed
                })
                .catch((error) => {
                    console.error(error);
                    // Handle error
                });

            // Update the state with the new address
            setExistingAddresses(updatedAddresses);

            // Clear the new address input field
            setNewAddress('');
            // Clear any previous error message
            setErrorMessage('');
        } else {
            // Display an error message if the address already exists
            setErrorMessage('Address already exists');
            return;
        }

        if (selectedPaymentMethod === 'wallet') {
            if (walletBalance < total) {
                alert('Insufficient funds in the wallet. Please choose another payment method.');
                return;
            }
        }
        console.log("helloooo",orderData)
        axios
            .get('http://localhost:3002/update-medicine-quantities', { headers })
        // Send a request to the server to place the order
        axios
            .post('http://localhost:3002/place-order', orderData, { headers })
            .then((response) => {
                if (selectedPaymentMethod === 'wallet') {
                    const newWalletBalance = walletBalance - total;

                    // Update the wallet balance on the server
                    axios.post('http://localhost:3002/update-wallet-balance', { balance: newWalletBalance }, { headers })
                        .then(() => {
                            setWalletBalance(newWalletBalance);
                        })
                        .catch((error) => {
                            console.error('Error updating wallet balance:', error);
                        });
                }
                navigate('/Thankyou')
            })
            .catch((error) => {
                console.error('Error placing the order:', error);
                alert('Failed to place the order. Please try again.');
            });
    };

    const handlePaymentMethodChange = (event) => {
        setSelectedPaymentMethod(event.target.value);
    };
    const [isDifferentAddress, setIsDifferentAddress] = useState(false);

    const handleAddressCheckboxChange = () => {
        setIsDifferentAddress(!isDifferentAddress);
    };

    useEffect(() => {
        axios.get('http://localhost:3002/delivery-addresses', { headers })
            .then((response) => {
                console.log(response.data.patientRequests[0].deliveryAddresses)
                setExistingAddresses(response.data.patientRequests[0].deliveryAddresses || []);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    return (
        <div>
            <Nav />
            <div class="site-section">
                <div class="container">
                    <div class="row">
                        <div class="col-md-6 mb-5 mb-md-0">
                            <h2 class="h3 mb-3 text-black">Billing Details</h2>
                            <div class="p-3 p-lg-5 border">


                                {!isDifferentAddress && <div className="form-group row">
                                    <div className="col-md-12">
                                        <label htmlFor="c_address" className="text-black">Address <span className="text-danger">*</span></label>
                                        <select
                                            id="c_address"
                                            className="form-control"
                                            name="c_address"
                                            onChange={handleAddressChange}
                                            value={selectedAddress}
                                        >
                                            <option value="">Select an address</option>
                                            {deliveryAddresses.map((address) => (
                                                <option key={address.id} value={address.id}>
                                                    {address}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>}
                                {isDifferentAddress && (
                                    <>
                                        <div className="form-group row">
                                            <div className="col-md-12">
                                                <label htmlFor="c_diff_address" className="text-black">Address <span className="text-danger">*</span></label>
                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    id="c_diff_address"
                                                    name="c_diff_address"
                                                    placeholder="Add New Address"
                                                    onChange={handleNewAddressChange}
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}


                                <div className="form-group">
                                    <label htmlFor="c_ship_different_address" className="text-black" data-toggle="collapse"
                                        href="#ship_different_address" role="button" aria-expanded="false"
                                        aria-controls="ship_different_address">
                                        <input
                                            type="checkbox"
                                            value={isDifferentAddress ? "1" : "0"}
                                            id="c_ship_different_address"
                                            onChange={handleAddressCheckboxChange}
                                        />
                                        Ship To A Different Address?
                                    </label>
                                    <div className="collapse" id="ship_different_address">
                                        <div className="py-2">

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
                                        <table className="table site-block-order-table mb-5">
                                            <thead>
                                                <th>Product</th>
                                                <th>Total</th>
                                            </thead>
                                            <tbody>
                                                {cartItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.name} <strong className="mx-2">x</strong> {item.quantity}</td>
                                                        <td>${item.price * item.quantity}</td>
                                                    </tr>
                                                ))}
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Cart Subtotal</strong></td>
                                                    <td className="text-black">${total.toFixed(2)}</td>
                                                </tr>
                                                <tr>
                                                    <td className="text-black font-weight-bold"><strong>Order Total</strong></td>
                                                    <td className="text-black font-weight-bold"><strong>${total.toFixed(2)}</strong></td>
                                                </tr>
                                            </tbody>
                                        </table>

                                        <h2 class="h2-payment">Payment Method</h2>
                                        <select
                                            className="select-payment-method"
                                            value={selectedPaymentMethod}
                                            onChange={handlePaymentMethodChange}
                                        >
                                            <option value="">Select a payment method</option>
                                            <option value="wallet">Wallet</option>
                                            <option value="credit_card">Credit Card (Stripe)</option>
                                            <option value="cash_on_delivery">Cash on Delivery</option>
                                        </select>

                                        {/* Stripe Payment Form */}
                                        {selectedPaymentMethod === 'credit_card' && (
                                            <Elements stripe={stripePromise}>
                                                <div className="payment-form">
                                                    <CheckoutForm onPaymentSuccess={() => navigate('/patient')} />
                                                </div>
                                            </Elements>
                                        )}

                                        {/* Wallet Section */}
                                        {selectedPaymentMethod === 'wallet' && (
                                            <p className="wallet-balance">Wallet: ${walletBalance}</p>
                                        )}

                                        <div class="form-group">
                                            <button class="btn btn-primary btn-lg btn-block" onClick={placeOrder}>Place
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