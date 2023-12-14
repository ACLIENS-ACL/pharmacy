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

import ConfirmationModal from './ConfirmationModal';

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
const PastOrders = ({ click }) => {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [orderIdToCancel, setOrderIdToCancel] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
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
                console.log(response.data)
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
            setOrderIdToCancel(orderId);
            setShowConfirmation(true);

        } else {
            alert("This order cannot be canceled or its status is not 'Processing'.");
        }
    };

    const handleConfirmAddToCart = () => {
        // Send a request to the server to add the order back to the cart
        axios.put(`http://localhost:3002/add-to-cart/${orderIdToCancel}`)
            .then(() => {
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderIdToCancel));
                setShowConfirmation(false);
            })
            .catch((error) => {
                console.error('Error adding the order back to the cart:', error);
            });
    };

    const handleConfirmNoAddToCart = () => {
        console.log("ji")
        // Send a request to the server to cancel the order
        axios.put(`http://localhost:3002/cancel-order/${orderIdToCancel}`)
            .then(() => {
                setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderIdToCancel));
                setShowConfirmation(false);
            })
            .catch((error) => {
                console.error('Error canceling the order:', error);
            });
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <Nav />
            <div className="container mt-4 ">
                <h2 className="text-center" style={{ marginBottom: "40px", color: "black", fontSize: "40px" }}>Your Orders</h2>
                {orders.length > 0 ? (
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th className="text-center">Total Amount</th>
                                <th className="text-center">Delivery Address</th>
                                <th className="text-center">Payment Method</th>
                                <th className="text-center">Status</th>
                                <th className="text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order._id}>
                                    <td className="text-center">${order.totalAmount}</td>
                                    <td className="text-center">{order.deliveryAddress}</td>
                                    <td className="text-center">{order.paymentMethod}</td>
                                    <td className="text-center">{order.status}</td>
                                    <td className="text-center">
                                        {order.status === 'Processing' && (
                                            <button className="btn btn-danger" onClick={() => handleCancelOrder(order._id)}>
                                                X
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <p>No orders found.</p>
                )}
            </div>
            <Footer />
            <ConfirmationModal
                isOpen={showConfirmation}
                onCancel={() => setShowConfirmation(false)}
                onConfirmAddToCart={handleConfirmAddToCart}
                onConfirmNoAddToCart={handleConfirmNoAddToCart}
            />

        </div>
    );
};

export default PastOrders;