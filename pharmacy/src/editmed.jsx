import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function EditMed() {
    const [medicines, setMedicines] = useState([]);
    const [selectedMedicine, setSelectedMedicine] = useState(null);
    const [editedMedicine, setEditedMedicine] = useState(null);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:3001/medicines')
            .then(response => {
                setMedicines(response.data);
            })
            .catch(error => {
                console.error(error);
            });
    }, []);

    function handleSelectMedicine(medicine) {
        setSelectedMedicine(medicine);
        setEditedMedicine({ ...medicine });
    }

    function handleEditMedicine(event) {
        const { name, value } = event.target;
        setEditedMedicine(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    function handleSaveChanges() {
        axios.put(`http://localhost:3001/medicines/${selectedMedicine.name}`, editedMedicine)
            .then(response => {
                setSelectedMedicine(null);
                setEditedMedicine(null);
                setSuccessMessage('Medicine edited successfully');
                console.log('Success message:', successMessage);
                navigate("/medicines");
            })
            .catch(error => {
                console.error(error);
            });
    }

    return (
        <div>
        {successMessage && <p className="success-message">{successMessage}</p>}
            <h1>Edit Medicine</h1>
            <ul>
                {medicines.map(medicine => (
                    <li  key={medicine.name} onClick={() => handleSelectMedicine(medicine)}>
                        {medicine.name}
                    </li>
                ))}
            </ul>

            {selectedMedicine && (
                <div>
                    <h2>{selectedMedicine.name}</h2>
                    <form>
                        <label>
                            Name:
                            <input type="text" name="name" value={editedMedicine.name} onChange={handleEditMedicine} />
                        </label>
                        <label>
                            Price:
                            <input type="number" name="price" value={editedMedicine.price} onChange={handleEditMedicine} />
                        </label>
                        <label>
                            Quantity:
                            <input type="number" name="quantity" value={editedMedicine.quantity} onChange={handleEditMedicine} />
                        </label>
                        {/* Add other fields that match the backend */}
                        <button onClick={handleSaveChanges}>Save Changes</button>
                    </form>
                </div>
            )}
        </div>
    );
}

export default EditMed;
