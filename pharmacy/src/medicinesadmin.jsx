import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

function Medicinesadmin() {
  const [meds, setMeds] = useState([]);
  const [message, setMessage] = useState('');
  const [medicinalUse, setMedicinalUse] = useState('');
  const [medicinalUses, setMedicinalUses] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [medicines, setMedicines] = useState([]);
  const [type, setType] = useState([]);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();
    const token = localStorage.getItem('adminToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);
  useEffect(() => {
  
    axios.get('http://localhost:3002/admin', {headers})
      .then((response) => {
        const responseData = response.data;
        setType(responseData.type);
        console.log(responseData.type, responseData.in);
        
        if (
          (responseData.type === 'admin' || responseData.type === 'pharmacist' || responseData.type === 'patient') &&
          responseData.in === true
        ) {
          // Continue with your logic for authenticated users
        } else {
          // Redirect to the login page or handle unauthorized access
          navigate('/login');
        }
      })
      .catch((error) => {
        // Handle errors, e.g., network issues or server errors
        console.error('Error fetching admin data:', error);
      });
  }, []);
  

const addToCart = (medicine) => {

  const updatedCart = [...userData.cart];
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

  // Send the updated cart data along with the user ID to the backend    
  axios.post(`http://localhost:3002/patient/${userData._id}/cart`, { cart: updatedCart }, {headers})
    .then((response) => {
      // Handle success response if needed
      // For example, you can update the local state here if the request was successful.
      setUserData({ ...userData, cart: updatedCart });
    })
    .catch((error) => {
      console.error(error);
      setMessage('An error occurred while updating the cart.');
    });
};


useEffect(() => {
  axios.get('http://localhost:3002/current-user', {headers})
    .then((response) => {
      const userData = response.data;
      setUserData(userData);
    })
    .catch((error) => {
      console.error(error);
      setMessage('An error occurred while fetching user data.');
    });
}, []);


useEffect(() => {
  // Fetch distinct medicinal uses from the server
  axios.get(`http://localhost:3002/medicinal-uses`, {headers})
    .then(response => {
      const responseData = response.data
      setMedicinalUses(responseData.medicinalUses);
    })
    .catch(error => {
      console.error(error);
      setMessage('Error retrieving medicinal uses');
    });

  // Fetch all medicines from the backend
  axios.get('http://localhost:3002/medicines', {headers})
    .then(response => {
      setMedicines(response.data);
    })
    .catch(error => {
      console.error(error);
      setMessage('Error retrieving medicines');
    });
}, []);

const containerStyle = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '20px',
  position: 'relative',
};

const componentStyle = {
  border: '1px solid #ccc',
  padding: '20px',
  width: '80%',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
  marginBottom: '20px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',  // Center content horizontally
};

const rowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',  // Center content vertically
  marginBottom: '20px',
  width: '100%',  // Take up the full width
};

const selectStyle = {
  width: '48%',
  padding: '8px',
  fontSize: '16px',
};

const inputStyle = {
  width: '48%',
  padding: '8px',
  fontSize: '16px',
};

const logoutButtonStyle = {
  position: 'absolute',
  top: '20px', // Adjust as needed
  right: '180px', // Adjust as needed
};

const medicineItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const imageStyle = {
  marginRight: '20px', // Add a right margin of 20px
  width: '100px',
};

const handleFilter = (event) => {
  const input = event.target.value;
  setMedicinalUse(input);
  filterMedicines(searchQuery, input);
};

const handleSearch = (event) => {
  const input = event.target.value;
  setSearchQuery(input);
  filterMedicines(input, medicinalUse);
};

const filterMedicines = (search, filter) => {
  const filtered = medicines.filter(medicine =>
    medicine.name.toLowerCase().startsWith(search.toLowerCase()) &&
    (filter === '' || medicine.medicinalUse === filter)
  );
  setMeds(filtered);
};

useEffect(() => {
  filterMedicines(searchQuery, medicinalUse);
}, [searchQuery, medicinalUse, medicines]);

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
    <div style={componentStyle}>
      <h2 className="text-center mb-4">Medicine Filter and Search</h2>
      <div style={logoutButtonStyle}>
        <button onClick={handleLogout} className="btn btn-danger">Logout</button>
      </div>
      <div style={rowStyle}>
        <select onChange={handleFilter} style={selectStyle}>
          <option value="">Filter Medicines by Medicinal Use</option>
          {medicinalUses.map((use, index) => (
            <option key={index} value={use}>{use}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="Search for a medication by name"
          value={searchQuery}
          onChange={handleSearch}
          style={inputStyle}
        />
      </div>
      {meds.map(med => (
        <div key={med._id} style={{ marginBottom: '20px' }}>
          <h3>{med.name}</h3>
          <div style={medicineItemStyle}>
            <div>
              <img
                src={`http://localhost:3002/uploads/${encodeURIComponent(med.imageUrl.fileName)}`}
                alt={med.name}
                style={{ ...imageStyle, width: '150px' }}
              />
            </div>
            <div>
              <p>Description: {med.description}</p>
              <p>Medicinal Use: {med.medicinalUse}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
    {message && <p>{message}</p>}
  </div>
);

}
export default Medicinesadmin;
