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

const Order = ({ click }) => {
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

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token === null) {
            navigate('/login');
        }
    }, [token, navigate]);
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch admin data from the server
                // const adminResponse = await axios.get(`http://localhost:3002/patient`, {headers});
                // const adminData = adminResponse.data;

                // if (adminData.type !== "patient" || adminData.in !== true) {
                //   // Redirect to login page if not a patient
                //   navigate('/login');
                // } else {
                // Fetch the user's orders when the component loads
                const ordersResponse = await axios.get(`http://localhost:3002/user-orders`, { headers })
                setOrders(ordersResponse.data);
                setLoading(false);
                // }
            } catch (error) {
                console.error('Error fetching user orders:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        // Fetch the user's orders when the component loads
        axios.get(`http://localhost:3002/user-orders`, { headers })
            .then((response) => {
                setOrders(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error('Error fetching user orders:', error);
                setLoading(false);
            });
    }, []);

    const handleCancelOrder = (orderId) => {
        // Check if the order status is "Processing"
        const orderToCancel = orders.find((order) => order._id === orderId);
        if (orderToCancel && orderToCancel.status === "Processing") {
            // Ask the user for confirmation
            const confirmation = window.confirm("Do you want to add this order back to your cart?");
            if (confirmation) {
                // Send a request to the server to add the order back to the cart
                axios.put(`http://localhost:3002/add-to-cart/${orderId}`, { headers })
                    .then(() => {
                        // Remove the canceled order from the local state
                        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                    })
                    .catch((error) => {
                        console.error('Error adding the order back to the cart:', error);
                    });
            } else {
                // Send a request to the server to cancel the order
                axios.put(`http://localhost:3002/cancel-order/${orderId}`, { headers })
                    .then(() => {
                        // Remove the canceled order from the local state
                        setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
                    })
                    .catch((error) => {
                        console.error('Error canceling the order:', error);
                    });
            }
        } else {
            alert("This order cannot be canceled or its status is not 'Processing'.");
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Nav />
            <div className="site-section">
                <div className="container">
                    <div className="font-weight-bold d-flex align-items-center justify-content-center" style={{marginBottom:"20px"}}>
                        <h2 style={{ color: '#000000' }}>
                            Your Orders
                        </h2>
                    </div>

                    <div className="row mb-5">
                        <form className="col-md-12" method="post">
                            <div className="site-blocks-table">
                                <table className="table table-bordered">
                                    <thead  >
                                        <tr style={{ backgroundColor: '#ADD8E6' }}>
                                            <th className="product-name h5 font-weight-bold">Status</th>
                                            <th className="product-name h5 font-weight-bold">Payment Method</th>
                                            <th className="product-price h5 font-weight-bold">Order Date</th>
                                            <th className="product-name h5 font-weight-bold">Delivery Address</th>
                                            <th className="product-total h5 font-weight-bold">Total Amount</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody >
                                        {orders.map((order) => (
                                            <tr key={order._id}>
                                                <td className="product-name h6">{order.status}</td>
                                                <td className="product-name h6">{order.deliveryAddress}</td>
                                                <td className="product-price h6">{new Date(order.orderDate).toLocaleString()}</td>
                                                <td className="product-name h6">{order.paymentMethod}</td>
                                                <td className="product-total h6">${order.totalAmount}</td>
                                                <td className="d-flex align-items-center justify-content-between">
                                                    <button
                                                        onClick={() => handleOrderDetails(order._id)}
                                                        className="btn btn-primary btn-sm mr-2"
                                                    >
                                                        Order Details
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelOrder(order._id)}
                                                        className="btn btn-danger btn-sm"
                                                    >
                                                        Cancel Order
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default Order;