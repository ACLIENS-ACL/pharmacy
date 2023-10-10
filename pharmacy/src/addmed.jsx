

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const AddMed = () => {
    const navigate = useNavigate();
    const [medicine, setMedicine] = useState({
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
        <div className="add-med-container">
            <h1>Add Medicine</h1>
            <form onSubmit={handleSubmit} className="add-med-form">
                <div className="form-group">
                    <label htmlFor="name">Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={medicine.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="activeIngredients">Active Ingredients:</label>
                    <input
                        type="text"
                        id="activeIngredients"
                        name="activeIngredients"
                        value={medicine.activeIngredients}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="medicinalUse">Medicinal Use:</label>
                    <input
                        type="text"
                        id="medicinalUse"
                        name="medicinalUse"
                        value={medicine.medicinalUse}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="price">Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        value={medicine.price}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="quantity">Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={medicine.quantity}
                        onChange={handleChange}
                        required
                    />
                </div>
               
                <div className="form-group">
                    <label htmlFor="imageUrl">Image URL:</label>
                    <input
                        type="text"
                        id="imageUrl"
                        name="imageUrl"
                        value={medicine.imageUrl}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="isPrescriptionRequired">Prescription Required:</label>
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
                <div className="form-group">
                    <label htmlFor="description">Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={medicine.description}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="add-med-btn">Add Medicine</button>
                {successMessage}{errorMessage}
            </form>
        </div>
    );
};

export default AddMed;
