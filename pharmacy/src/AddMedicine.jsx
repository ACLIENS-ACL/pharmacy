// PharmacistNavbar.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

import PharmacistNavbar from './PharmacistNavBar'
import PharmacistFooter from './PharmacistFooter'
import departmentImage1 from './images/s1.png';
import departmentImage2 from './images/s2.png';
import departmentImage3 from './images/s3.png';
import departmentImage4 from './images/s4.png';

import 'bootstrap/dist/css/bootstrap.css'; // Import Bootstrap CSS
import './css/font-awesome.min.css'; // Import Font Awesome CSS
import './css/style.css'; // Import your custom styles
import './css/responsive.css';
const AddMed = () => {
  const navigate = useNavigate();
  const [medicine, setMedicine] = useState({
    name: '',
    activeIngredients: [],
    medicinalUse: '',
    price: 0,
    quantity: 0,
    sales: 0,
    imageUrl: null,
    isPrescriptionRequired: false,
    description: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const token = localStorage.getItem('pharmacistToken');
  const headers = {
    Authorization: `Bearer ${token}`,
  };
  useEffect(() => {
    if (token === null) {
      navigate('/login');
    }
  }, [token, navigate]);
  const handleChange = (event) => {
    setSuccessMessage('');
    const { name, value } = event.target;

    // Check if the field being updated is 'activeIngredients'
    if (name === 'activeIngredients') {
      const ingredientsArray = value.split(',').map((ingredient) => ingredient.trim());
      console.log(ingredientsArray.length)
      const arr = []
      for (var i = 0; i < ingredientsArray.length; i++) {
        arr.push(ingredientsArray[i])
        console.log(ingredientsArray[i])
      }
      setMedicine((prevState) => ({
        ...prevState,
        [name]: arr,
      }));
    } else if (name === 'image') {
      const file = event.target.files[0];
      setMedicine((prevState) => ({
        ...prevState,
        image: file,
      }));
    } else if (name === 'price' || name === 'quantity') {
      // Ensure that the value is a non-negative number
      const numericValue = parseFloat(value);
      if (!isNaN(numericValue) && numericValue >= 0) {
        setMedicine((prevState) => ({
          ...prevState,
          [name]: numericValue,
        }));
      }
    } else {
      setMedicine((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append('name', medicine.name);
    formData.append('activeIngredients', medicine.activeIngredients.join(', '));
    formData.append('medicinalUse', medicine.medicinalUse);
    formData.append('price', medicine.price);
    formData.append('quantity', medicine.quantity);
    formData.append('isPrescriptionRequired', medicine.isPrescriptionRequired);
    formData.append('description', medicine.description);
    formData.append('image', medicine.image); // Append the image file

    try {
      if (medicine.price <= 0 || medicine.quantity <= 0) {
        setErrorMessage('Price and quantity must be greater than 0.');
      } else {
        const response = await axios.post('http://localhost:3002/add-medicine', formData, { headers })
        console.log(response.data);
        setSuccessMessage('Medicine added successfully');
        setErrorMessage('');
        setMedicine({
          name: '',
          activeIngredients: [],
          medicinalUse: '',
          price: 0,
          quantity: 0,
          sales: 0,
          imageUrl: '',
          isPrescriptionRequired: false,
          description: '',
        });
      }
      navigate('/add-med');
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div>
      <PharmacistNavbar />
      <div className="container mt-5 mb-5">
        <h1 className="mb-4 d-flex justify-content-center"
          style={{ color: '#62d2a2' }} >Add Medicine</h1>
        <div className="row ">
          <div className="col-md-8 mx-auto">
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" name="name" value={medicine.name} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="medicinalUse">Medicinal Use:</label>
                    <input type="text" id="medicinalUse" name="medicinalUse" value={medicine.medicinalUse} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input type="number" id="price" name="price" value={medicine.price} onChange={handleChange} className="form-control" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input type="number" id="quantity" name="quantity" value={medicine.quantity} onChange={handleChange} className="form-control" required />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label htmlFor="activeIngredients">Active Ingredients (Separate with a comma):</label>
                    <input
                      type="text"
                      id="activeIngredients"
                      name="activeIngredients"
                      placeholder="e.g., 1st ingredient, 2nd ingredient"
                      value={medicine.activeIngredients.join(', ')}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="image">Medicine Image:</label>
                    <br /> {/* Add a line break */}
                    <input
                      type="file"
                      id="image"
                      name="image"
                      accept="image/*"
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                  <div className="form-group form-check mb-3">
                    <input
                      type="checkbox"
                      id="isPrescriptionRequired"
                      name="isPrescriptionRequired"
                      checked={medicine.isPrescriptionRequired}
                      onChange={() =>
                        setMedicine((prevState) => ({
                          ...prevState,
                          isPrescriptionRequired: !prevState.isPrescriptionRequired,
                        }))
                      }
                      className="form-check-input"
                    />
                    <label htmlFor="isPrescriptionRequired" className="form-check-label ml-2">Prescription Required</label>
                  </div>
                  <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                      id="description"
                      name="description"
                      value={medicine.description}
                      onChange={handleChange}
                      className="form-control"
                      required
                    />
                  </div>
                </div>
              </div>
              <div className="d-flex justify-content-end mt-3">
                {/* Move the button to the right */}
                <button type="submit" className="btn btn-primary"
                  style={{
                    backgroundColor: '#62d2a2',
                    borderColor: '#62d2a2'
                  }} >
                  Add Medicine
                </button>
              </div>
              {successMessage && <p className="text-success mt-2">{successMessage}</p>}
              {errorMessage && <p className="text-danger mt-2">{errorMessage}</p>}
            </form>
          </div>
        </div>
      </div>
      <PharmacistFooter />
    </div>
  );
};

export default AddMed;
