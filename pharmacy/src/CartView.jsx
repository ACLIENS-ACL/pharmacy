import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function CartView() {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();
  const total = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const token = localStorage.getItem('patientToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);
  const removeItem = (itemId) => {
    const updatedCart = cartItems.filter((item) => item.name !== itemId);
    setCartItems(updatedCart);
    axios
      .post('http://localhost:3002/remove-item', { cart: updatedCart }, {headers})
      .then((response) => {})
      .catch((error) => {
        console.error('Error removing item:', error);
      });
  };
  
  useEffect(() => {
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/patient`, {headers})
      .then((response) => {
        const responseData = response.data;
        // if (responseData.type !== "patient" || responseData.in !== true) {
        //   navigate('/login')
        // }
      })
  }, []);

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
        .post('http://localhost:3002/update-quantity', { cart: updatedCart }, {headers})
        .then((response) => {})
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
      .get('http://localhost:3002/view-cart', {headers})
      .then((response) => {
        const responseData = response.data;
        if (responseData.userType === 'patient' && responseData.sessi === true) {
          setCartItems(responseData.patientRequests.cart);
        } else {
          navigate('/login');
        }
      })
      .catch((error) => {
        console.error('Error fetching cart data:', error);
      });
  }, [navigate]);

  const handleLogout = () => {
    axios.get(`http://localhost:3002/logout`, {headers}).then((response) => {
      const responseData = response.data;
      if (responseData.type === '') {
        navigate('/login');
      }
    });
  };

  const styles = {
    container: {
      margin: '20px auto',
      width: '80%',
      textAlign: 'center',
    },
    header: {
      fontSize: '30px', // Increased font size
      marginBottom: '20px',
    },
    cartItem: {
      border: '1px solid #ddd',
      borderRadius: '5px',
      padding: '20px', // Increased padding for better spacing
      marginBottom: '15px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
      fontSize: '18px', // Increased font size for items
    },
    quantityButtons: {
      display: 'flex',
      marginTop: '10px',
      alignItems: 'center',
      justifyContent: 'center',
    },
    quantityButton: {
      cursor: 'pointer',
      padding: '5px 5px', // Increased padding
      fontSize: '15px', // Increased font size
      borderRadius: '3px',
      border: '1px solid #007BFF',
      backgroundColor: '#007BFF',
      color: '#fff',
      marginRight:'2px'
    },
    removeButton: {
      marginTop: '10px',
      padding: '8px 16px',
      backgroundColor: '#dc3545',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    total: {
      marginTop: '20px',
      fontWeight: 'bold',
      fontSize: '20px', // Increased font size
    },
    confirmOrderButton: {
      marginTop: '20px',
      padding: '12px 24px',
      backgroundColor: '#28a745',
      color: '#fff',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
    },
    logoutButton: {
      position: 'absolute',
      top: '20px',
      right: '20px',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.logoutButton}>
        <button onClick={handleLogout} className="btn btn-danger">
          Logout
        </button>
      </div>
      <h1 style={styles.header}>Shopping Cart</h1>
      <div className="cart-items">
        {cartItems.map((item) => (
          <div key={item.name} style={styles.cartItem}>
            <div>{item.name}</div>
            <div>Price: ${item.price}</div>
            <div>
              Quantity: {item.quantity}
              <div style={styles.quantityButtons}>
                <button
                  style={styles.quantityButton}
                  onClick={() => updateQuantity(item.name, item.quantity + 1)}
                >
                  +
                </button>
                <button
                  style={styles.quantityButton}
                  onClick={() => updateQuantity(item.name, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  -
                </button>
              </div>
            </div>
            <button style={styles.removeButton} onClick={() => removeItem(item.name)}>
              Remove
            </button>
          </div>
        ))}
      </div>
      <p style={styles.total}>Total: ${total}</p>
      <button style={styles.confirmOrderButton} onClick={handleConfirmOrder}>
        Confirm Order
      </button>
    </div>
  );
}

export default CartView;
