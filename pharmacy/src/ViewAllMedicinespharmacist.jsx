import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ViewAllMedicinesP() {
    const [medicines, setMedicines] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Fetch all medicines from the backend
        axios.get('http://localhost:3001/medicinespharmacist')
            .then(response => {
                setMedicines(response.data);
            })
            .catch(error => {
                console.error(error);
                setMessage('Error retrieving medicines');
            });
    }, []);

    return (
        <div>
            <h1>All Medicines</h1>
            {medicines.map(medicine => (
                <div key={medicine.id}>
                    <h2>{medicine.name}</h2>
                    <img src={medicine.imageUrl} alt={medicine.name} />
                    <p>Price: ${medicine.price}</p>
                    <p>Description: {medicine.description}</p>
                    <p>Medicinal Use: {medicine.medicinalUse}</p>
                    <p>Available Quantity: {medicine.quantity}</p> 
                    <p>Sales: {medicine.sales}</p> 
                </div>
            ))}
            {message && <p>{message}</p>}
        </div>
    );
}

export default ViewAllMedicinesP;