import React, { useEffect, useState } from 'react';
import axios from 'axios';

import { useNavigate, useLocation } from 'react-router-dom';
const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
};

const orderStyle = {
  border: '1px solid #ccc',
  borderRadius: '5px',
  padding: '10px',
  marginBottom: '10px',
  backgroundColor: '#fff',
};

const cancelButtonStyle = {
  background: 'red',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  padding: '5px 10px',
  cursor: 'pointer',
};

function UserOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem('patientToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  const navigate = useNavigate();

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
          const ordersResponse = await axios.get(`http://localhost:3002/user-orders`, {headers})
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
    axios.get(`http://localhost:3002/user-orders`, {headers})
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
      const confirmation = window.confirm("Do you want to add this order back to your cart?");
      if (confirmation) {
        // Send a request to the server to add the order back to the cart
        axios.put(`http://localhost:3002/add-to-cart/${orderId}`, {headers})
          .then(() => {
            // Remove the canceled order from the local state
            setOrders((prevOrders) => prevOrders.filter((order) => order._id !== orderId));
          })
          .catch((error) => {
            console.error('Error adding the order back to the cart:', error);
          });
      } else {
        // Send a request to the server to cancel the order
        axios.put(`http://localhost:3002/cancel-order/${orderId}`, {headers})
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

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokens).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/logout`, {headers})
      .then((response) => {
        const responseData = response.data;
        if (responseData.type == "") {
          navigate('/login');
        }
      })
  };

  return (
    <div style={containerStyle}>
    <div className="d-flex justify-content-end mb-2">
      <button onClick={handleLogout} className="btn btn-danger">Logout</button>
    </div>
      <h2>Your Orders</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id} style={orderStyle}>
              <p>Order ID: {order._id}</p>
              <p>Total Amount: ${order.totalAmount}</p>
              <p>Delivery Address: {order.deliveryAddress}</p>
              <p>Payment Method: {order.paymentMethod}</p>
              <p>Status: {order.status}</p>
              {order.status === "Processing" && (
                <button onClick={() => handleCancelOrder(order._id)} style={cancelButtonStyle}>Cancel Order</button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>No orders found.</p>
      )}
    </div>
  );
}

export default UserOrders;
