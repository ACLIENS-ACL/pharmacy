import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('patientToken');
    const headers = {
      Authorization: `Bearer ${token}`,
    };

    axios.get(`http://localhost:3002/patientData`, { headers })
      .then((response) => {
        setCartItems(response.data.patient.cart.length);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);
  
  useEffect(() => {
    updateCartItems();
  }, []); // Run once on component mount

  return (
    <CartContext.Provider value={{ cartItems, setCartItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartProvider;