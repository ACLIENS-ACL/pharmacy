import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const addMedContainerStyle = {
    maxWidth: '400px',
    margin: '0 auto',
    padding: '20px',
};

const formGroupStyle = {
    marginBottom: '10px',
};

const labelStyle = {
    fontWeight: 'bold',
    marginRight:'20px'
};

const checkboxStyle = {
    marginLeft: '5px',
};

const addMedButtonStyle = {
    backgroundColor: '#007BFF',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    cursor: 'pointer',
    marginLeft:'200px'
};

const successMessageStyle = {
    color: 'green',
};

const errorMessageStyle = {
    color: 'red',
};

const AddMed = () => {
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState({
        name: '',
        activeIngredients: '',
        medicinalUse: '',
        price: 0,
        quantity: 0,
        sales: 0,
        imageUrl: '',
        isPrescriptionRequired: false,
        description: '',
    });
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const handleChange = (event) => {
        const { name, value } = event.target;
        setMedicine((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (medicine.price <= 0 || medicine.quantity <= 0) {
                setErrorMessage('Price and quantity must be greater than 0.');
            } else {
                const response = await axios.post('http://localhost:3001/add-medicine', medicine);
                console.log(response.data);
                setSuccessMessage('Medicine added successfully');
                setErrorMessage('');
                setMedicine({
                    name: '',
                    activeIngredients: '',
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
        <div style={addMedContainerStyle}>
            <h1 style={{margin:'20px'}}>Add Medicine</h1>
            <form onSubmit={handleSubmit}>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={medicine.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="activeIngredients">Active Ingredients:</label>
                    <input
                        type="text"
                        id="activeIngredients"
                        name="activeIngredients"
                        value={medicine.activeIngredients}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="medicinalUse">Medicinal Use:</label>
                    <input
                        type="text"
                        id="medicinalUse"
                        name="medicinalUse"
                        value={medicine.medicinalUse}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={medicine.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={medicine.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="imageUrl">Image URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={medicine.imageUrl}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="isPrescriptionRequired">Prescription Required:</label>
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
                    />
                </div>
                <div style={formGroupStyle}>
                    <label style={labelStyle} htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={medicine.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" style={addMedButtonStyle}>Add Medicine</button>
                {successMessage && <p style={successMessageStyle}>{successMessage}</p>}
                {errorMessage && <p style={errorMessageStyle}>{errorMessage}</p>}
            </form>
        </div>
    );
};

export default AddMed;
