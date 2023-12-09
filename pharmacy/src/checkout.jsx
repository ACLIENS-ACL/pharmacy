// CheckOut.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, CardElement } from '@stripe/react-stripe-js';

const containerStyle = {
  maxWidth: '600px',
  margin: '0 auto',
  padding: '20px',
  border: '1px solid #ccc',
  borderRadius: '5px',
  boxShadow: '0 0 5px rgba(0, 0, 0, 0.2)',
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  marginBottom: '10px',
  border: '1px solid #ccc',
  borderRadius: '3px',
};

const buttonStyle = {
  padding: '10px',
  background: 'blue',
  color: 'white',
  border: 'none',
  borderRadius: '3px',
  cursor: 'pointer',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  marginBottom: '10px',
};

const thStyle = {
  backgroundColor: 'lightgray',
  padding: '8px',
  textAlign: 'left',
};

const tdStyle = {
  border: '1px solid #ddd',
  padding: '8px',
};

const addressHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const stripePromise = loadStripe('pk_test_51O88P5HzoCWXbTYqT8xDcGsLRVepjiG6k4KqILsc5mIxkTraEfRqAP9N6Vr3yRdQHDcuB8R4M5C754kjshcm1JtM0051zRZXTh');

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
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pay
      </button>
    </form>
  );
};

function CheckOut() {
  const [deliveryAddresses, setDeliveryAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [walletBalance, setWalletBalance] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const cartData = location.state?.cart || [];
  const total = cartData.reduce((acc, item) => acc + item.price * item.quantity, 0);

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
    // Fetch the wallet balance from the server
    axios.get('http://localhost:3002/wallet-balance', {headers}) // Adjust the endpoint as needed
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
      .get('http://localhost:3002/delivery-addresses', {headers})
      .then((response) => {
        const responseData = response.data;
        // if (responseData.userType === 'patient' && responseData.sessi === true) {
          setDeliveryAddresses(responseData.patientRequests[0].deliveryAddresses);
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

  const placeOrder = () => {
    if (!selectedAddress || !selectedPaymentMethod) {
      alert('Please select a delivery address and payment method.');
      return;
    }

    const orderData = {
      cart: cartData,
      deliveryAddress: selectedAddress,
      paymentMethod: selectedPaymentMethod,
    };

    if (selectedPaymentMethod === 'wallet') {
      console.log(walletBalance)
      console.log(total)
      if (walletBalance < total) {
        alert('Insufficient funds in the wallet. Please choose another payment method.');
        return;
      }
    }

    // Send a request to the server to place the order
    axios
      .post('http://localhost:3002/place-order', orderData, {headers})
      .then((response) => {
        if (selectedPaymentMethod === 'wallet') {
          const newWalletBalance = walletBalance - total;

          // Update the wallet balance on the server
          axios.post('http://localhost:3002/update-wallet-balance', { balance: newWalletBalance }, {headers})
            .then(() => {
              setWalletBalance(newWalletBalance);
            })
            .catch((error) => {
              console.error('Error updating wallet balance:', error);
            });
        }
        axios
          .get('http://localhost:3002/update-medicine-quantities', {headers})
        navigate('/patient'); // Redirect to a success page
      })
      .catch((error) => {
        console.error('Error placing the order:', error);
        alert('Failed to place the order. Please try again.');
      });
  };

  const handleAddAddress = () => {
    navigate('/addAddress');
  };

  const handlePaymentMethodChange = (event) => {
    setSelectedPaymentMethod(event.target.value);
  };

  const handleLogout = () => {
    // Perform any necessary logout actions (e.g., clearing session or tokenns).
    // After logging out, navigate to the login page.
    // Fetch admin data from the server
    axios.get(`http://localhost:3002/logout`)
      .then((response) => {
        const responseData = response.data;
        if (responseData.type === "") {
          navigate('/login');
        }
      });
  };


  return (
    <div style={containerStyle}>
      <div className="d-flex justify-content-end mb-2">
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <h2>Cart Summary</h2>
      <table style={tableStyle}>
        <thead>
          <tr>
            <th style={thStyle}>Item</th>
            <th style={thStyle}>Price</th>
            <th style={thStyle}>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {cartData.map((item) => (
            <tr key={item.name}>
              <td style={tdStyle}>{item.name}</td>
              <td style={tdStyle}>${item.price}</td>
              <td style={tdStyle}>{item.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <p>Total: ${total}</p>

      <div style={addressHeaderStyle}>
        <h2>Delivery Addresses</h2>
        <button onClick={handleAddAddress} style={buttonStyle}>
          Add New Address
        </button>
      </div>

      <select style={selectStyle} value={selectedAddress} onChange={handleAddressChange}>
        <option value="">Select an address</option>
        {deliveryAddresses.map((address) => (
          <option key={address} value={address}>
            {address}
          </option>
        ))}
      </select>
      <p>Selected Address: {selectedAddress}</p>

      <h2>Payment Method</h2>
      <select
        style={selectStyle}
        value={selectedPaymentMethod}
        onChange={handlePaymentMethodChange}
      >
        <option value="">Select a payment method</option>
        <option value="wallet">Wallet</option>
        <option value="credit_card">Credit Card (Stripe)</option>
        <option value="cash_on_delivery">Cash on Delivery</option>
      </select>

      {selectedPaymentMethod === 'credit_card' && (
        <Elements stripe={stripePromise}>
          <CheckoutForm onPaymentSuccess={() => navigate('/patient')} />
        </Elements>
      )}
      {selectedPaymentMethod === 'wallet' && (
        <p>wallet:${walletBalance}</p>
      )
      }

      <button onClick={placeOrder} style={buttonStyle}>
        Place Order
      </button>
    </div>
  );
}

export default CheckOut;
